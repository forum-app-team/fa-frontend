import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { resolvePath } from "@/app/lib/resolvePath";
import { PATHS } from "@/app/config/paths";

import {
  listPublishedPosts,
  hidePost,
  archivePost,
  unarchivePost,
  deletePost
} from "@/features/posts/api/posts.api";
import { getPublicUsers } from "@/features/auth/api/publicUsers.api";

export default function UserHomePage() {
  const navigate = useNavigate();
  const myUserId = useSelector((s) => s.auth?.user?.id);

  const [posts, setPosts] = useState([]);
  const [names, setNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pending = useRef(new Set());
  const guard = (action, id) => {
    const key = `${action}:${id}`;
    if (pending.current.has(key)) return true;
    pending.current.add(key);
    return false;
  };
  const release = (action, id) => pending.current.delete(`${action}:${id}`);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await listPublishedPosts();
        if (!mounted) return;
        setPosts(data || []);

        const ids = Array.from(new Set((data || []).map(p => p.userId).filter(Boolean)));
        const map = ids.length ? await getPublicUsers(ids) : {};
        if (!mounted) return;
        setNames(map || {});
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const rows = useMemo(() => {
    return posts.map(p => ({
      ...p,
      email: names[p.userId] || "unknown@user",
      when: new Date(p.postDate || p.createdAt).toLocaleString(),
      isOwner: myUserId && p.userId === myUserId,
      archived: typeof p.isArchived === "boolean" ? p.isArchived : !!p._archived,
    }));
  }, [posts, names, myUserId]);

  const doHide = async (id) => {
    if (!window.confirm("Hide this post? It will no longer appear as published.")) return;
    if (guard("hide", id)) return;
    try {
      await hidePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to hide post");
    } finally {
      release("hide", id);
    }
  };

  const doToggleArchive = async (post) => {
    const { id, archived } = post;
    if (guard("archive", id)) return;

    // Optimistic flip: update immediately
    setPosts(prev => prev.map(p => (
        p.id === id ? { ...p, isArchived: !archived, _archived: !archived } : p
    )));

    try {
      if (archived) {
        await unarchivePost(id);
      } else {
        await archivePost(id);
      }
    } catch (e) {
      // Revert on failure
      setPosts(prev => prev.map(p => (
          p.id === id ? { ...p, isArchived: archived, _archived: archived } : p
      )));
      alert(e?.response?.data?.message || e.message || "Failed to toggle archive");
    } finally {
      release("archive", id);
    }
  };

  const doDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    if (guard("delete", id)) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to delete post");
    } finally {
      release("delete", id);
    }
  };

  if (loading) return <div className="container py-4">Loading…</div>;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;

  return (
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Published Posts</h2>
          <button className="btn btn-primary" onClick={() => navigate(PATHS.POST_NEW)}>
            New Post
          </button>
        </div>

        {!rows.length && <div className="text-muted">No posts yet.</div>}

        <ul className="list-unstyled m-0 p-0">
          {rows.map(p => (
              <li key={p.id} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="flex-grow-1 text-start">
                  <Link
                      to={resolvePath(PATHS.POST_DETAIL, { id: p.id })}
                      className="fw-semibold fs-5 text-decoration-none d-block m-0"
                  >
                    {p.title}
                  </Link>

                  <div className="text-muted small mb-1">
                    {p.email} • {p.when}{p.archived ? " • (archived)" : ""}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  {p.isOwner ? (
                      <>
                        <button
                            className="btn btn-sm btn-warning"
                            onClick={() => doHide(p.id)}
                            title="Hide (Published → Hidden)"
                        >
                          Hide
                        </button>

                        <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => navigate(resolvePath(PATHS.POST_EDIT, { id: p.id }))}
                            title="Edit"
                        >
                          Edit
                        </button>

                        <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => doToggleArchive(p)}
                            title={p.archived ? "Unarchive (enable replies)" : "Archive (disable replies)"}
                        >
                          {p.archived ? "Unarchive" : "Archive"}
                        </button>

                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => doDelete(p.id)}
                            title="Delete (soft delete)"
                        >
                          Delete
                        </button>
                      </>
                  ) : null}
                </div>
              </li>
          ))}
        </ul>
      </div>
  );
}