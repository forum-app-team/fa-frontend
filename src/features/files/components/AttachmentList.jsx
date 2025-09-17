/**
 * AttachmentList - A reusable component for displaying attachment files
 * 
 * @param {Object} props
 * @param {File[]} props.attachments - Array of attachment files
 * @param {Function} props.onRemove - Callback when an attachment is removed (index)
 * @param {boolean} props.showSize - Whether to show file size
 * @param {string} props.className - Additional CSS classes
 */
export default function AttachmentList({
  attachments = [],
  onRemove,
  showSize = true,
  className = ""
}) {
  if (!attachments.length) {
    return null;
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return 'bi-file-image';
    } else if (file.type === 'application/pdf') {
      return 'bi-file-pdf';
    } else if (file.type.startsWith('text/')) {
      return 'bi-file-text';
    } else {
      return 'bi-file-earmark';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };

  return (
    <ul className={`list-group mt-2 ${className}`}>
      {attachments.map((file, index) => (
        <li
          key={`${file.name}-${index}`}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center flex-grow-1">
            <i className={`bi ${getFileIcon(file)} me-2 text-muted`}></i>
            <div className="flex-grow-1">
              <div className="text-truncate" style={{ maxWidth: 300 }}>
                {file.name}
              </div>
              {showSize && (
                <small className="text-muted">
                  {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                </small>
              )}
            </div>
          </div>
          
          {onRemove && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={() => onRemove(index)}
              title="Remove attachment"
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
