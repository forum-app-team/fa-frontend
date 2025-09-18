import { useMemo, useRef } from "react";
import {
    hidePost, unhidePost,
    archivePost, unarchivePost,
    deletePost, publishPost
} from "@/features/posts/api/posts.api";
import { useSelector } from "react-redux";

export default function PostActions({
                post,
                onEdit,
                onAfter,
                compact = false,
            }) {
    const user = useSelector(s => s.auth.user);
    const isOwner = useMemo(() => post && user && post.userId === user.id, [post, user]);
    const disabled = !isOwner || ["Banned","Deleted"].includes(post?.status);

    // prevent double-click/rapid taps on the same action
    const pending = useRef(new Set());
    const guard = (action) => {
        if (pending.current.has(action)) return true;
        pending.current.add(action);
        return false;
    };
    const release = (action) => pending.current.delete(action);

    const doAction = (label, fn) => async () => {
        if (guard(label)) return;
        try {
            await fn(post.id);
            onAfter?.();
        } catch (e) {
            alert(e?.response?.data?.message || e.message || "Action failed");
        } finally {
            release(label);
        }
    };

    if (!post) return null;
    if (disabled) return null;

    const btn = (cls, onClick, title, children) => (
        <button
            className={compact ? `${cls} btn-sm` : cls}
            onClick={onClick}
            title={title}
            type="button"
        >
            {children}
        </button>
    );

    return (
        <div className={`d-flex gap-2 ${compact ? "flex-wrap" : ""}`}>
            {post.status === "Unpublished" &&
                btn("btn btn-success", doAction("publish", publishPost), "Publish this post", "Publish")}

            {onEdit && btn("btn btn-outline-primary", onEdit, "Edit", "Edit")}

            {post.isArchived
                ? btn("btn btn-outline-secondary", doAction("unarchive", unarchivePost), "Unarchive", "Unarchive")
                : btn("btn btn-outline-secondary", doAction("archive", archivePost), "Archive", "Archive")}

            {post.status === "Hidden"
                ? btn("btn btn-outline-warning", doAction("unhide", unhidePost), "Unhide", "Unhide")
                : btn("btn btn-outline-warning", doAction("hide", hidePost), "Hide", "Hide")}

            {btn("btn btn-outline-danger", doAction("delete", deletePost), "Delete (soft delete)", "Delete")}
        </div>
    );
}
