import { useState, useEffect } from "react";


export default function ReplyForm({
          initialValue = "",
          onSubmit,
          onCancel,
          submitting = false,
          placeholder = "Write a reply...",
          submitLabel = "Reply",
          clearOnSubmit = true,
      }) {
    const [content, setContent] = useState(initialValue);


    useEffect(() => { setContent(initialValue); }, [initialValue]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = content.trim();
        if (!trimmed) return;
        try {
            await onSubmit(trimmed);
            if (clearOnSubmit) setContent("");
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
            <textarea
                className="form-control"
                rows={3}
                value={content}
                placeholder={placeholder}
                onChange={(e) => setContent(e.target.value)}
                disabled={submitting}
                required
            />
            <div className="d-flex gap-2">
                <button className="btn btn-primary" disabled={submitting || !content.trim()}>
                    {submitLabel}
                </button>
                {onCancel && (
                    <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}