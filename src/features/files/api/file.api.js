import apiClient from "@/libs/axios";
import { API_CONFIG } from "@/config/api.config";

const FILES_API = API_CONFIG.ENDPOINTS.FILES;

// Request a presigned PUT URL for direct browser->S3 upload
async function presignUpload({ filename, contentType, sizeBytes, category }) {
  const { data } = await apiClient.post(FILES_API.PRESIGN, {
    filename,
    contentType,
    sizeBytes,
    category,
  });
  return data; // { uploadUrl, headers, objectKey, fileUrl, expiresInSeconds }
}

// Perform a direct multipart upload via the file service (service streams to S3)
async function directUpload({ file, category }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);
  const { data } = await apiClient.post(FILES_API.DIRECT_UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { fileUrl, objectKey, sizeBytes, contentType }
}

// Retrieve file metadata and a temporary download URL
async function retrieve(objectKey) {
  const { data } = await apiClient.get(FILES_API.RETRIEVE(encodeURIComponent(objectKey)));
  return data; // { objectKey, metadata:{...}, downloadUrl, expiresInSeconds }
}

export { presignUpload, directUpload, retrieve };

