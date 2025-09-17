import { useRef, useState } from "react";
import { uploadAttachment } from "@/features/files/api/files.api";


const ACCEPT = ["image/png", "image/jpeg", "application/pdf", "application/zip", "application/x-zip-compressed"];
const MAX_BYTES = 20 * 1024 * 1024; // 20MB


export default function AttachmentUploader({ value = [], onChange, disabled }) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [err, setErr] = useState(null);


    const choose = () => inputRef.current?.click();


    const validate = (file) => {
        if (!ACCEPT.includes(file.type)) return `Unsupported type: ${file.type}`;
        if (file.size > MAX_BYTES) return `File too large: ${(file.size / (1024*1024)).toFixed(1)}MB`;
        return null;
    };


    const onFiles = async (files) => {
        setErr(null);
        const list = Array.from(files || []);
        if (!list.length) return;
        setUploading(true);
        try {
            const uploaded = [];
            for (const f of list) {
                const v = validate(f); if (v) { setErr(v); continue; }
                const att = await uploadAttachment(f); // presign + PUT
                uploaded.push(att);
            }
            if (uploaded.length) onChange?.([...(value || []), ...uploaded]);
        } catch (e) {
            setErr(e?.message || "Upload failed");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = ""; // reset chooser
        }
    };


    const remove = (idx) => {
        const next = [...(value || [])];
        next.splice(idx, 1);
        onChange?.(next);
    };

    return (
        <div className="border rounded p-3">
            <div className="d-flex align-items-center gap-2 mb-2">
                <button type="button" className="btn btn-outline-primary" onClick={choose} disabled={disabled || uploading}>
                    {uploading ? "Uploading…" : "Add attachments"}
                </button>
                <span className="text-muted small">PNG, JPG, PDF • up to 20MB</span>
            </div>
            <input
                ref={inputRef}
                type="file"
                hidden
                multiple
                accept={ACCEPT.join(",")}
                onChange={(e) => onFiles(e.target.files)}
                disabled={disabled}
            />


            {err && <div className="alert alert-warning py-2">{err}</div>}


            {(value?.length ?? 0) > 0 && (
                <ul className="list-group">
                    {value.map((att, i) => (
                        <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="text-truncate" style={{maxWidth: "70%"}}>
                                <div className="fw-semibold text-truncate">{att.filename}</div>
                                {/*<div className="small text-muted">{att.contentType} • {(att.sizeBytes/1024/1024).toFixed(2)} MB</div>*/}
                                {/*<a href={att.fileUrl} target="_blank" rel="noreferrer">Preview/Download</a>*/}
                            </div>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(i)} disabled={disabled || uploading}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}