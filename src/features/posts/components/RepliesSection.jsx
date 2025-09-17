import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getPublicUsers } from "@/features/auth/api/publicUsers.api";
import { listReplies, createReply, updateReply, deleteReply } from "@/features/posts/api/posts.api";
import ReplyForm from "./ReplyForm";
import ReplyThread from "./ReplyThread";

export default function RepliesSection({ post }) {
    const me = useSelector((s) => s.auth?.user);
    const meId = me?.id;
    const meRole = me?.role;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [names, setNames] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const canReply = useMemo(() => {
        if (!me?.emailVerified) return false;
        if (!post || post.isArchived) return false;
        return post.status === "Published";
    }, [me?.emailVerified, post]);

    useEffect(() => {
        let active = true;
        (async () => {
            if (!post?.id) return;
            if (!meId) {
                setError("Sign in to view replies.");
                return;
            }
            try {
                setError(null);
                setLoading(true);
                const data = await listReplies(post.id);
                if (!active) return;
                setNodes(data || []);
                const ids = Array.from(new Set((flattenUsers(data))));
                const map = await getPublicUsers(ids);
                if (!active) return;
                setNames(map || {});
            } catch (e) {
                if (!active) return;
                setError(e?.response?.data?.message || e.message || "Failed to load replies");
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, [post?.id, meId]);

    const refresh = async () => {
        const data = await listReplies(post.id);
        setNodes(data || []);
        const ids = Array.from(new Set((flattenUsers(data))));
        const map = await getPublicUsers(ids);
        setNames(map || {});
    };

    const handleCreate = async (parentReplyId, content) => {
        setSubmitting(true);
        try {
            await createReply(post.id, { content, parentReplyId: parentReplyId || null });
            await refresh();
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (replyId, content) => {
        setSubmitting(true);
        try {
            await updateReply(post.id, replyId, { content });
            await refresh();
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (replyId) => {
        setSubmitting(true);
        try {
            await deleteReply(post.id, replyId);
            await refresh();
        } finally {
            setSubmitting(false);
        }
    };

    const top = (
        <div className="mb-3">
            <h3 className="m-0 mb-2 text-start">Replies</h3>
            {error && <div className="alert alert-warning py-2 mb-2">{error}</div>}
            {loading ? <div className="text-muted">Loading…</div> : null}
        </div>
    );


    if (!meId) {
        return (
            <div className="mt-4">
                {top}
                <div className="alert alert-info">Sign in to view and write replies.</div>
            </div>
        );
    }

    return (
        <div className="mt-4">
            {top}

            {canReply && (
                <div className="mb-3">
                    <ReplyForm
                        submitLabel="Reply"
                        placeholder="Write a reply…"
                        submitting={submitting}
                        onSubmit={(val) => handleCreate(null, val)}
                    />
                </div>
            )}

            <ReplyThread
                nodes={nodes}
                names={names}
                meId={meId}
                meRole={meRole}
                postOwnerId={post?.userId}
                canReply={canReply}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </div>
    );
}

function flattenUsers(nodes = []) {
    const ids = [];
    const walk = (arr) => {
        for (const n of arr) {
            if (n.userId) ids.push(n.userId);
            if (n.children?.length) walk(n.children);
        }
    };
    walk(nodes);
    return ids;
}