import { useState } from "react";

/**
 * FileSelector - A reusable component for selecting files with validation
 * 
 * @param {Object} props
 * @param {string} props.label - Label for the file input
 * @param {string[]} props.acceptedTypes - Array of accepted MIME types
 * @param {number} props.maxSizeMB - Maximum file size in MB
 * @param {boolean} props.multiple - Allow multiple file selection
 * @param {Function} props.onFilesSelected - Callback when files are selected
 * @param {Function} props.onError - Callback when validation fails
 * @param {string} props.className - Additional CSS classes
 */
export default function FileSelector({
  label,
  acceptedTypes = [],
  maxSizeMB = 20,
  multiple = false,
  onFilesSelected,
  onError,
  className = ""
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFiles = (files) => {
    const tooBig = [];
    const badType = [];
    
    for (const file of files) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        tooBig.push(file.name);
      }
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
        badType.push(file.name);
      }
    }
    
    if (tooBig.length) {
      return `These files exceed ${maxSizeMB}MB: ${tooBig.join(", ")}`;
    }
    if (badType.length) {
      return `Unsupported file type: ${badType.join(", ")}`;
    }
    return null;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files) => {
    const error = validateFiles(files);
    if (error) {
      onError?.(error);
      return;
    }
    onFilesSelected?.(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const acceptString = acceptedTypes.join(",");

  return (
    <div className={`mb-3 ${className}`}>
      {label && <label className="form-label">{label}</label>}
      
      <div
        className={`border rounded p-3 text-center ${
          isDragOver ? "border-primary bg-light" : "border-secondary"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptString}
          multiple={multiple}
          onChange={handleFileChange}
          className="form-control mb-2"
        />
        
        <div className="text-muted small">
          {isDragOver ? (
            <span className="text-primary">Drop files here</span>
          ) : (
            <>
              <div>Click to select files or drag and drop</div>
              <div>
                Max size: {maxSizeMB}MB
                {acceptedTypes.length > 0 && (
                  <span> • Accepted: {acceptedTypes.join(", ")}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
