import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getPostDetail,
  updatePost,
  deletePost,
  archivePost, unarchivePost,
  hidePost, unhidePost,
  banPost, unbanPost, recoverPost,
  publishPost,
} from "@/features/posts/api/posts.api";
import RepliesSection from "@/features/posts/components/RepliesSection";
import AttachmentList from "@/features/posts/components/AttachmentList";

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);
  const [post, setPost] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);

  const isOwner = useMemo(() => post && user && post.userId === user.userId, [post, user]);
  const isAdmin = user?.role === "admin" || user?.role === "super";

  const load = async () => {
    try {
      setError(null);
      const data = await getPostDetail(id);
      setPost(data);
      setForm({ title: data.title, content: data.content });
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load post");
    }
  };

  useEffect(() => { load(); }, [id]);

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updatePost(id, form);
      setPost(updated);
      setEdit(false);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to update");
    }
  };

  const doAction = (fn) => async () => { try { await fn(id); await load(); } catch (e) { setError(e?.response?.data?.message || "Action failed"); } };

  if (!post) return <div className="container py-4">{error ? <div className="alert alert-danger">{error}</div> : "Loading..."}</div>;

  return (
      <div className="container py-4 text-start">
        {error && <div className="alert alert-danger">{error}</div>}

        {!edit ? (
            <>
              <div className="d-flex justify-content-between align-items-center">
                <h2>{post.title}</h2>
                <span className="badge text-bg-secondary">{post.status}{post.isArchived ? " (archived)" : ""}</span>
              </div>
              <div className="text-muted small">
                Posted: {new Date(post.postDate).toLocaleString()}
                {post.lastEditedAt && <> • Last edited: {new Date(post.lastEditedAt).toLocaleString()}</>}
              </div>
              <p className="mt-3">{post.content}</p>


              {post.attachments?.length > 0 && (
                  <div className="mb-3 border-top">
                    <h4 className="m-0 mb-2 text-start">Attachments</h4>
                    <AttachmentList attachments={post.attachments} />
                  </div>
              )}

              {post && <RepliesSection post={post} />}

              <div className="mt-4 d-flex gap-2 flex-wrap">
                {isOwner && !["Banned","Deleted"].includes(post.status) && (
                    <>
                      {post.status === "Unpublished" && (
                          <button className="btn btn-success" onClick={doAction(publishPost)}>
                            Publish
                          </button>
                      )}
                      <button className="btn btn-outline-primary" onClick={() => setEdit(true)}>Edit</button>
                      {post.isArchived
                          ? <button className="btn btn-outline-secondary" onClick={doAction(unarchivePost)}>Unarchive</button>
                          : <button className="btn btn-outline-secondary" onClick={doAction(archivePost)}>Archive</button>}
                      {post.status === "Hidden"
                          ? <button className="btn btn-outline-warning" onClick={doAction(unhidePost)}>Unhide</button>
                          : <button className="btn btn-outline-warning" onClick={doAction(hidePost)}>Hide</button>}
                      <button className="btn btn-outline-danger" onClick={doAction(deletePost)}>Delete</button>
                    </>
                )}

                {isAdmin && (
                    <>
                      {post.status === "Banned"
                          ? <button className="btn btn-outline-success" onClick={doAction(unbanPost)}>Unban</button>
                          : <button className="btn btn-outline-danger" onClick={doAction(banPost)}>Ban</button>}
                      {post.status === "Deleted" && (
                          <button className="btn btn-outline-success" onClick={doAction(recoverPost)}>Recover</button>
                      )}
                    </>
                )}
              </div>
            </>
        ) : (
            <form className="card card-body" onSubmit={saveEdit}>
              <div className="mb-2">
                <label className="form-label">Title</label>
                <input className="form-control" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} required maxLength={200}/>
              </div>
              <div className="mb-2">
                <label className="form-label">Content</label>
                <textarea className="form-control" rows={6} value={form.content} onChange={(e)=>setForm({...form, content:e.target.value})} required />
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={()=>setEdit(false)}>Cancel</button>
              </div>
            </form>
        )}
      </div>
  );
};

export default PostDetail;
