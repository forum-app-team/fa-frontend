import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost, publishPost } from "@/features/posts/api/posts.api";

const MAX_TITLE = 200;

export default function NewPostPage() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const isVerified = !!user?.emailVerified;

  const [form, setForm] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = useMemo(
      () => form.title.trim() && form.content.trim() && form.title.length <= MAX_TITLE,
      [form]
  );

  const handleCreate = async (publish = false) => {
    setSubmitting(true); setError(null);
    try {
      const draft = await createPost({
        title: form.title.trim(),
        content: form.content.trim(),
      });
      if (publish) {
        await publishPost(draft.id); // publish immediately
      }
      navigate(`/posts/${draft.id}`);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="container py-4">
        <h2 className="mb-3">Create a New Post</h2>

        {!isVerified && (
            <div className="alert alert-warning">
              Your email is not verified. You can’t create or publish posts until verification is complete.
            </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card card-body">
          <div className="mb-3">
            <label className="form-label">Title <span className="text-muted">({form.title.length}/{MAX_TITLE})</span></label>
            <input
                className="form-control"
                value={form.title}
                maxLength={MAX_TITLE}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="What’s on your mind?"
                required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea
                className="form-control"
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your post here..."
                required
            />
          </div>

          <div className="d-flex gap-2">
            <button
                className="btn btn-secondary"
                disabled={!isVerified || submitting || !canSubmit}
                onClick={() => handleCreate(false)}
                title={!isVerified ? "Email verification required" : "Save as draft"}
            >
              Save as draft
            </button>

            <button
                className="btn btn-success"
                disabled={!isVerified || submitting || !canSubmit}
                onClick={() => handleCreate(true)}
                title={!isVerified ? "Email verification required" : "Publish now"}
            >
              Publish now
            </button>

            <button
                className="btn btn-outline-secondary ms-auto"
                onClick={() => navigate(-1)}
                disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
  );
}
