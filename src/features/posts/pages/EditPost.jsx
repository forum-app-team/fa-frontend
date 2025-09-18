import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPostDetail, updatePost } from "@/features/posts/api/posts.api";
import { PATHS } from "@/app/config/paths";
import { resolvePath } from "@/app/lib/resolvePath";
import AttachmentUploader from "@/features/posts/components/AttachmentUploader";

export default function PostEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const myUserId = useSelector((s) => s.auth?.user?.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [post, setPost] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [attachments, setAttachments] = useState([]);

    const canEdit = useMemo(() => {
        return post && myUserId && post.userId === myUserId;
    }, [post, myUserId]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setError(null);
                setLoading(true);
                const data = await getPostDetail(id); // expects { id, userId, title, content, ... }
                if (!mounted) return;

                setPost(data);
                setTitle(data?.title || "");
                setContent(data?.content || "");
                setAttachments(data.attachments || []);
            } catch (e) {
                setError(e?.response?.data?.message || e.message || "Failed to load post");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id]);

    const onSave = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            return alert("Title is required");
        }
        setSaving(true);
        try {
            await updatePost(id, { title: title.trim(), content, attachments });
            // back to detail after successful save
            navigate(resolvePath(PATHS.POST_DETAIL, { id }));
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="container py-4">Loading…</div>;
    }

    if (error) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger">{error}</div>
                <Link className="btn btn-secondary" to={resolvePath(PATHS.POST_DETAIL, { id })}>
                    Back to Post
                </Link>
            </div>
        );
    }

    if (!canEdit) {
        return (
            <div className="container py-4">
                <div className="alert alert-warning">You can only edit your own post.</div>
                <Link className="btn btn-secondary" to={resolvePath(PATHS.POST_DETAIL, { id })}>
                    Back to Post
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Edit Post</h2>
                <Link className="btn btn-outline-secondary" to={resolvePath(PATHS.POST_DETAIL, { id })}>
                    Cancel
                </Link>
            </div>

            <form onSubmit={onSave}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={200}
                        required
                    />
                    <div className="form-text">{title.length}/200</div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                        className="form-control"
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Attachments</label>
                    <AttachmentUploader value={attachments} onChange={setAttachments} disabled={saving} />
                </div>

                <button className="btn btn-primary" type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                </button>
            </form>
        </div>
    );
}