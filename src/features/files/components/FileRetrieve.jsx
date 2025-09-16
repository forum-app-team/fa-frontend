import { useState } from "react";
import { retrieve } from "@/features/files/api/file.api";

export default function FileRetrieve() {
  const [objectKey, setObjectKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const onRetrieve = async () => {
    if (!objectKey.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await retrieve(objectKey.trim());
      setResult(data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Retrieve failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-body mt-4">
      <h5 className="mb-3">Retrieve a File</h5>
      <div className="input-group mb-2">
        <input
          className="form-control"
          placeholder="u/<userId>/<category>/yyyy/mm/<filename>"
          value={objectKey}
          onChange={(e) => setObjectKey(e.target.value)}
        />
        <button className="btn btn-outline-secondary" disabled={!objectKey.trim() || loading} onClick={onRetrieve}>
          {loading ? "Retrieving..." : "Retrieve"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {result && (
        <div className="alert alert-info">
          <div><strong>Object Key:</strong> {result.objectKey}</div>
          <div><strong>Size:</strong> {result.metadata?.size} bytes</div>
          <div><strong>Content Type:</strong> {result.metadata?.contentType}</div>
          <div><strong>Last Modified:</strong> {result.metadata?.lastModified && new Date(result.metadata.lastModified).toLocaleString()}</div>
          <div className="mt-2">
            <a className="btn btn-sm btn-outline-primary" href={result.downloadUrl} target="_blank" rel="noreferrer">Download</a>
          </div>
          {result.metadata?.contentType?.startsWith("image/") && (
            <div className="mt-3">
              <img src={result.downloadUrl} alt="Preview" style={{ maxWidth: 300, maxHeight: 300 }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

