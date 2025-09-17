import { useEffect, useState } from "react";

/**
 * ImagePreview - A reusable component for displaying image previews
 * 
 * @param {Object} props
 * @param {File[]} props.images - Array of image files to preview
 * @param {Function} props.onRemove - Callback when an image is removed (index)
 * @param {number} props.maxWidth - Maximum width for preview images
 * @param {number} props.maxHeight - Maximum height for preview images
 * @param {string} props.className - Additional CSS classes
 */
export default function ImagePreview({
  images = [],
  onRemove,
  maxWidth = 200,
  maxHeight = 200,
  className = ""
}) {
  const [previewUrls, setPreviewUrls] = useState([]);

  // Generate preview URLs for images
  useEffect(() => {
    const urls = images.map(file => {
      if (file instanceof File && file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return null;
    });
    
    setPreviewUrls(urls);

    // Cleanup URLs when component unmounts or images change
    return () => {
      urls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [images]);

  if (!images.length) {
    return null;
  }

  return (
    <div className={`row g-2 mt-2 ${className}`}>
      {images.map((file, index) => {
        const previewUrl = previewUrls[index];
        
        return (
          <div className="col-auto" key={`${file.name}-${index}`}>
            <div className="position-relative border rounded p-1">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={file.name}
                  style={{ 
                    maxWidth, 
                    maxHeight, 
                    objectFit: "cover",
                    display: "block"
                  }}
                  className="rounded"
                />
              ) : (
                <div
                  style={{ 
                    width: maxWidth, 
                    height: maxHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa"
                  }}
                  className="rounded text-muted"
                >
                  <i className="bi bi-file-image" style={{ fontSize: "2rem" }}></i>
                </div>
              )}
              
              <div className="mt-1">
                <div className="text-truncate small" style={{ maxWidth: maxWidth }}>
                  {file.name}
                </div>
                <div className="text-muted small">
                  {Math.round(file.size / 1024)} KB
                </div>
              </div>
              
              {onRemove && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger mt-1 w-100"
                  onClick={() => onRemove(index)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
