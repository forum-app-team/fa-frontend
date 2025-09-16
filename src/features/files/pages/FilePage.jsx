import FileUpload from "../components/FileUpload";
import FileRetrieve from "../components/FileRetrieve";

export default function FilePage() {
  return (
    <div className="container py-3">
      <h2 className="mb-3">Files Test Page</h2>
      <p className="text-muted">This page allows testing direct file upload and retrieval.</p>

      {/* Upload */}
      <FileUpload />

      {/* Retrieve */}
      <FileRetrieve />
    </div>
  );
}

