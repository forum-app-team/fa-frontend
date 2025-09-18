import apiClient from "@/libs/axios";
import { API_CONFIG } from "@/config/api.config";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || API_CONFIG.BASE_URL;

export async function presignAttachment({ filename, contentType, sizeBytes }) {
    const url = `${FILE_BASE}/api/files/presign`;
    const body = { filename, contentType, sizeBytes, category: "postAttachment" };
    const { data } = await apiClient.post(url, body);
    return data;
}

export async function retrieveFile(objectKey) {
    const url = `${FILE_BASE}/api/files/retrieve/${encodeURIComponent(objectKey)}`;
    const { data } = await apiClient.get(url);
    return data;
}

export async function uploadToSignedUrl({ uploadUrl, headers, file }) {
    const res = await fetch(uploadUrl, { method: "PUT", headers, body: file });
    if (!res.ok) throw new Error(`Upload failed with ${res.status}`);
}


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