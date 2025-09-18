import apiClient from "@/libs/axios";
import { API_CONFIG } from "@/config/api.config";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || API_CONFIG.BASE_URL;

export async function presignAttachment({ filename, contentType, sizeBytes }) {
    const url = `${FILE_BASE}/api/files/presign`;
    const body = { filename, contentType, sizeBytes, category: "postAttachment" };
    const { data } = await apiClient.post(url, body);
// { uploadMethod:'PUT', uploadUrl, headers, objectKey, fileUrl, expiresInSeconds }
    return data;
}

export async function retrieveFile(objectKey) {
    // objectKey contains slashes; encode as one path segment
    const url = `${FILE_BASE}/api/files/retrieve/${encodeURIComponent(objectKey)}`;
    const { data } = await apiClient.get(url);
    // data: { downloadUrl, metadata: {...}, expiresInSeconds: 3600 }
    return data;
}

export async function uploadToSignedUrl({ uploadUrl, headers, file }) {
    const res = await fetch(uploadUrl, { method: "PUT", headers, body: file });
    if (!res.ok) throw new Error(`Upload failed with ${res.status}`);
}


/**
 * High-level helper: presign + PUT, returns attachment payload for post
 */
export async function uploadAttachment(file) {
    const meta = await presignAttachment({
        filename: file.name,
        contentType: file.type,
        sizeBytes: file.size,
    });
    await uploadToSignedUrl({ uploadUrl: meta.uploadUrl, headers: meta.headers, file });
    return {
        objectKey: meta.objectKey,
        fileUrl: meta.fileUrl,
        contentType: file.type,
        sizeBytes: file.size,
        filename: file.name,
    };
}

/*
export async function directUploadAttachment(file) {
    const form = new FormData();
    form.append("file", file);
    form.append("category", "postAttachment");
    const url = `${FILE_BASE}/api/files/upload`;
    const { data } = await apiClient.post(url, form, { headers: { "Content-Type": "multipart/form-data" } });
// { fileUrl, objectKey, sizeBytes, contentType }
    return { ...data, filename: file.name };
}
 */