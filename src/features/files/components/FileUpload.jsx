import { useEffect, useMemo, useState } from "react";
import { directUpload } from "@/features/files/api/file.api";

const DEFAULT_CATEGORY = "profile"; // profile | postAttachment

// Deferred upload component: the file stays in browser memory until user clicks "Finalize Upload".
export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const canFinalize = useMemo(() => !!file && !loading, [file, loading]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult(null);
    setError(null);
  };

  // Local preview URL management
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const discard = () => {
    setFile(null);
    setError(null);
    setResult(null);
  };

  // Finalize: actually upload to S3 (via presigned or direct)
  const finalizeUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await directUpload({ file, category });
      setResult({ method: "Direct", ...data });
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-body">
      <h5 className="mb-2">Attach a File (Direct upload)</h5>
      <p className="text-muted mb-3">The selected file remains in your browser and is not uploaded until you click "Upload".</p>

      <div className="row g-3 align-items-center mb-2">
        <div className="col-auto">
          <label className="col-form-label">Category</label>
        </div>
        <div className="col-auto">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="profile">Profile (images ≤5MB)</option>
            <option value="postAttachment">Post Attachment (images/PDF ≤20MB)</option>
          </select>
        </div>
      </div>



      <div className="mb-2">
        <input type="file" onChange={onFileChange} />
      </div>

      {previewUrl && (
        <div className="mb-3">
          <div className="text-muted small">Preview (if supported by your browser):</div>
          {/* Only images will visually preview; other types will just show a link */}
          {file?.type?.startsWith("image/") ? (
            <img src={previewUrl} alt="Preview" style={{ maxWidth: 300, maxHeight: 300 }} />
          ) : (
            <a href={previewUrl} target="_blank" rel="noreferrer">Open selected file</a>
          )}
        </div>
      )}

      <div className="d-flex gap-2">
        <button className="btn btn-primary" disabled={!canFinalize} onClick={finalizeUpload}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        <button className="btn btn-outline-secondary" disabled={!file || loading} onClick={discard}>
          Discard
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result && (
        <div className="alert alert-success mt-3">
          <div><strong>Method:</strong> {result.method}</div>
          <div><strong>Object Key:</strong> {result.objectKey}</div>
          {result.fileUrl && (
            <div>
              <strong>URL:</strong> <a href={result.fileUrl} target="_blank" rel="noreferrer">{result.fileUrl}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
