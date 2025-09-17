
import { useState, useRef } from "react";
import { directUpload } from "@/features/files/api/file.api";

const ProfileImageUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult(null);
    setError(null);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const discard = () => {
    setFile(null);
    setError(null);
    setResult(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const finalizeUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await directUpload({ file, category: "profile" });
      setResult({ method: "Direct", ...data });
      onUploadSuccess?.(data.fileUrl);
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-body">
      <h5 className="mb-2">Profile Image Upload</h5>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={loading}
      />
      {previewUrl && (
        <div className="mb-3">
          <div className="text-muted small">Preview:</div>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: "50%" }} />
        </div>
      )}
      <div className="d-flex gap-2">
        <button className="btn btn-primary" disabled={!file || loading} onClick={finalizeUpload}>
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
};

export default ProfileImageUploader;
