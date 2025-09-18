import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getPostDetail,
  deletePost,
  archivePost, unarchivePost,
  hidePost, unhidePost,
  banPost, unbanPost, recoverPost,
  publishPost,
} from "@/features/posts/api/posts.api";
import RepliesSection from "@/features/posts/components/RepliesSection";
import AttachmentList from "@/features/posts/components/AttachmentList";
import PostAuthorInfo from "@/features/posts/components/PostAuthorInfo";
import { resolvePath } from "@/app/lib/resolvePath";
import { PATHS } from "@/app/config/paths";
import { useRecordHistoryViewMutation } from "@/features/users/store/users.slice";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [recordHistoryView] = useRecordHistoryViewMutation();

  const isOwner = useMemo(() => post && user && post.userId === user.id, [post, user]);
  const isAdmin = user?.role === "admin" || user?.role === "super";

  const load = async () => {
    try {
      setError(null);
      const data = await getPostDetail(id);
      setPost(data);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load post");
    }
  };


  // Record a view for published posts (non-blocking)
  useEffect(() => {
    if (post && post.status === "Published") {
      recordHistoryView({ postId: id }).catch(() => {});
    }
  }, [id, post?.status, recordHistoryView]);

  useEffect(() => { load(); }, [id]);

  const doAction = (fn) => async () => { try { await fn(id); await load(); } catch (e) { setError(e?.response?.data?.message || "Action failed"); } };

  if (!post) return <div className="container py-4">{error ? <div className="alert alert-danger">{error}</div> : "Loading..."}</div>;

  return (
      <div className="container py-4 text-start">
        {error && <div className="alert alert-danger">{error}</div>}

        <>
          <div className="d-flex justify-content-between align-items-center">
            <h2>{post.title}</h2>
            <span className="badge text-bg-secondary">
            {post.status}{post.isArchived ? " (archived)" : ""}
          </span>
          </div>

          <div className="d-flex align-items-center flex-wrap gap-2">
            {post && <PostAuthorInfo userId={post.userId} />}
            <div className="text-muted small flex-grow-1 text-truncate">
              Posted: {new Date(post.postDate).toLocaleString()}
              {post.lastEditedAt && <> • Last edited: {new Date(post.lastEditedAt).toLocaleString()}</>}
            </div>
          </div>

          <p className="mt-3">{post.content}</p>

          {post.attachments?.length > 0 && (
              <div className="mb-3 border-top">
                <h4 className="m-0 mb-2 text-start">Attachments</h4>
                <AttachmentList attachments={post.attachments} />
              </div>
          )}

          <div className="d-flex gap-2 flex-wrap ms-auto justify-content-end">
            {isOwner && !["Banned","Deleted"].includes(post.status) && (
                post.status === "Unpublished" ? (
                    <>
                      <button className="btn btn-success" onClick={doAction(publishPost)}>Publish</button>
                      <button
                          className="btn btn-primary"
                          onClick={() => navigate(resolvePath(PATHS.POST_EDIT, { id: post.id }))}
                          title="Edit"
                      >
                        Edit
                      </button>
                    </>
                ) : (
                    <>
                      <button
                          className="btn btn-primary"
                          onClick={() => navigate(resolvePath(PATHS.POST_EDIT, { id: post.id }))}
                          title="Edit"
                      >
                        Edit
                      </button>
                      {post.isArchived
                          ? <button className="btn btn-secondary" onClick={doAction(unarchivePost)}>Unarchive</button>
                          : <button className="btn btn-secondary" onClick={doAction(archivePost)}>Archive</button>}
                      {post.status === "Hidden"
                          ? <button className="btn btn-warning" onClick={doAction(unhidePost)}>Unhide</button>
                          : <button className="btn btn-warning" onClick={doAction(hidePost)}>Hide</button>}
                      <button className="btn btn-danger" onClick={doAction(deletePost)}>Delete</button>
                    </>
                )
            )}

            {isAdmin && (
                <>
                  {post.status === "Banned"
                      ? <button className="btn btn-success" onClick={doAction(unbanPost)}>Unban</button>
                      : <button className="btn btn-danger" onClick={doAction(banPost)}>Ban</button>}
                  {post.status === "Deleted" && (
                      <button className="btn btn-success" onClick={doAction(recoverPost)}>Recover</button>
                  )}
                </>
            )}
          </div>

          {post && <RepliesSection post={post} />}
        </>
      </div>
  );
};

export default PostDetail;
