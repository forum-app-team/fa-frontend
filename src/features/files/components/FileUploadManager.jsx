import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { directUpload } from "@/features/files/api/file.api";
import FileSelector from "./FileSelector";
import ImagePreview from "./ImagePreview";
import AttachmentList from "./AttachmentList";

/**
 * FileUploadManager - A comprehensive file upload management component
 * 
 * @param {Object} props
 * @param {string} props.category - File category for upload (e.g., "postAttachment", "profile")
 * @param {Object} props.imageConfig - Configuration for image uploads
 * @param {Object} props.attachmentConfig - Configuration for attachment uploads
 * @param {Function} props.onFilesUploaded - Callback when files are uploaded successfully
 * @param {Function} props.onError - Callback when an error occurs
 * @param {boolean} props.disabled - Whether the component is disabled
 * @param {string} props.className - Additional CSS classes
 */
const FileUploadManager = forwardRef(function FileUploadManager({
  category = "postAttachment",
  imageConfig = {
    enabled: true,
    label: "Images",
    acceptedTypes: ["image/png", "image/jpeg"],
    maxSizeMB: 20,
    multiple: true
  },
  attachmentConfig = {
    enabled: true,
    label: "Attachments",
    acceptedTypes: ["image/png", "image/jpeg", "application/pdf"],
    maxSizeMB: 20,
    multiple: true
  },
  onFilesUploaded,
  onError,
  disabled = false,
  className = ""
}, ref) {
  const [imageFiles, setImageFiles] = useState([]);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    uploadFiles,
    clearAll,
    hasFiles: imageFiles.length > 0 || attachmentFiles.length > 0
  }), [imageFiles.length, attachmentFiles.length]);

  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
    onError?.(errorMessage);
  }, [onError]);

  const handleImageSelection = useCallback((files) => {
    setError(null);
    setImageFiles(prev => [...prev, ...files]);
  }, []);

  const handleAttachmentSelection = useCallback((files) => {
    setError(null);
    setAttachmentFiles(prev => [...prev, ...files]);
  }, []);

  const removeImage = useCallback((index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const removeAttachment = useCallback((index) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const uploadFiles = useCallback(async () => {
    if (uploading) return null;
    
    setUploading(true);
    setError(null);
    
    try {
      const uploadedImageUrls = [];
      const uploadedAttachmentUrls = [];

      // Upload images
      for (const file of imageFiles) {
        const { fileUrl } = await directUpload({ file, category });
        uploadedImageUrls.push(fileUrl);
      }

      // Upload attachments
      for (const file of attachmentFiles) {
        const { fileUrl } = await directUpload({ file, category });
        uploadedAttachmentUrls.push(fileUrl);
      }

      const result = {
        images: uploadedImageUrls,
        attachments: uploadedAttachmentUrls,
        totalFiles: uploadedImageUrls.length + uploadedAttachmentUrls.length
      };

      onFilesUploaded?.(result);
      
      // Clear files after successful upload
      setImageFiles([]);
      setAttachmentFiles([]);
      
      return result;
    } catch (e) {
      const errorMessage = e?.response?.data?.message || e.message || "Upload failed";
      handleError(errorMessage);
      throw e;
    } finally {
      setUploading(false);
    }
  }, [imageFiles, attachmentFiles, category, onFilesUploaded, handleError, uploading]);

  const clearAll = useCallback(() => {
    setImageFiles([]);
    setAttachmentFiles([]);
    setError(null);
  }, []);

  const hasFiles = imageFiles.length > 0 || attachmentFiles.length > 0;

  return (
    <div className={`file-upload-manager ${className}`}>
      {/* Image Upload Section */}
      {imageConfig.enabled && (
        <div className="mb-3">
          <FileSelector
            label={imageConfig.label}
            acceptedTypes={imageConfig.acceptedTypes}
            maxSizeMB={imageConfig.maxSizeMB}
            multiple={imageConfig.multiple}
            onFilesSelected={handleImageSelection}
            onError={handleError}
            className={disabled ? "opacity-50" : ""}
          />
          
          <ImagePreview
            images={imageFiles}
            onRemove={disabled ? null : removeImage}
          />
        </div>
      )}

      {/* Attachment Upload Section */}
      {attachmentConfig.enabled && (
        <div className="mb-3">
          <FileSelector
            label={attachmentConfig.label}
            acceptedTypes={attachmentConfig.acceptedTypes}
            maxSizeMB={attachmentConfig.maxSizeMB}
            multiple={attachmentConfig.multiple}
            onFilesSelected={handleAttachmentSelection}
            onError={handleError}
            className={disabled ? "opacity-50" : ""}
          />
          
          <AttachmentList
            attachments={attachmentFiles}
            onRemove={disabled ? null : removeAttachment}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      {hasFiles && (
        <div className="d-flex gap-2 mb-3">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={clearAll}
            disabled={disabled || uploading}
          >
            Clear All
          </button>
          
          <div className="text-muted small align-self-center">
            {imageFiles.length + attachmentFiles.length} file(s) selected
          </div>
        </div>
      )}
    </div>
  );
});

export default FileUploadManager;

// Export individual components for more granular usage
export { FileSelector, ImagePreview, AttachmentList };
