# Modular File Upload Components

## 1) Component Overview

### FileSelector
A reusable file picker with drag‑and‑drop and client‑side validation.
- Props:
  - `label?: string`
  - `acceptedTypes?: string[]` – MIME types; e.g. `["image/png", "image/jpeg"]`
  - `maxSizeMB?: number` – default 20
  - `multiple?: boolean` – default `false`
  - `onFilesSelected?: (files: File[]) => void`
  - `onError?: (message: string) => void`
  - `className?: string`

### ImagePreview
Displays previews for images selected in memory.
- Props:
  - `images: File[]`
  - `onRemove?: (index: number) => void`
  - `maxWidth?: number` – default 200
  - `maxHeight?: number` – default 200
  - `className?: string`

### AttachmentList
Shows non‑image attachments in a list with optional size and remove.
- Props:
  - `attachments: File[]`
  - `onRemove?: (index: number) => void`
  - `showSize?: boolean` – default `true`
  - `className?: string`

### FileUploadManager
High‑level manager that combines two selectors (images + attachments), optional previews, and upload orchestration.
- Props:
  - `category?: string` – upload category, default `"postAttachment"` (used by API)
  - `imageConfig?: { enabled: boolean; label: string; acceptedTypes: string[]; maxSizeMB: number; multiple: boolean }`
  - `attachmentConfig?: { enabled: boolean; label: string; acceptedTypes: string[]; maxSizeMB: number; multiple: boolean }`
  - `onFilesUploaded?: (result: { images: string[]; attachments: string[]; totalFiles: number }) => void`
  - `onError?: (message: string) => void`
  - `disabled?: boolean`
  - `className?: string`
- Imperative API (via `ref`):
  - `await uploadFiles(): Promise<{ images: string[]; attachments: string[]; totalFiles: number } | null>`
  - `clearAll(): void`
  - `hasFiles: boolean`

---

## 2) Usage Examples

### A. Using FileUploadManager inside a form (recommended)
This mirrors how a post creation form can integrate uploads: call `uploadFiles()` before submit and merge the returned URLs into your payload.

```jsx
import { useRef, useState } from "react";
import FileUploadManager from "@/features/files/components/FileUploadManager";
import { createPost, publishPost } from "@/features/posts/api/posts.api";

export default function NewThingForm() {
  const uploaderRef = useRef(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (publish = false) => {
    setSubmitting(true); setError(null);
    try {
      // 1) Upload any selected files
      const uploaded = await uploaderRef.current?.uploadFiles();
      // uploaded => { images: [], attachments: [], totalFiles }

      // 2) Send your domain payload
      const draft = await createPost({
        title: form.title.trim(),
        content: form.content.trim(),
        images: uploaded?.images ?? [],
        attachments: uploaded?.attachments ?? [],
      });

      if (publish) await publishPost(draft.id);
      // navigate(`/posts/${draft.id}`)
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card card-body">
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input className="form-control" value={form.title}
               onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>

      <div className="mb-3">
        <label className="form-label">Content</label>
        <textarea className="form-control" rows={6} value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })} />
      </div>

      <FileUploadManager
        ref={uploaderRef}
        category="postAttachment"
        imageConfig={{
          enabled: true,
          label: "Images",
          acceptedTypes: ["image/png", "image/jpeg"],
          maxSizeMB: 20,
          multiple: true,
        }}
        attachmentConfig={{
          enabled: true,
          label: "Attachments (images/PDF)",
          acceptedTypes: ["image/png", "image/jpeg", "application/pdf"],
          maxSizeMB: 20,
          multiple: true,
        }}
        onError={setError}
      />

      {error && <div className="alert alert-danger mt-2">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-secondary" onClick={() => handleSubmit(false)} disabled={submitting}>Save as draft</button>
        <button className="btn btn-success" onClick={() => handleSubmit(true)} disabled={submitting}>Publish now</button>
      </div>
    </div>
  );
}
```

### B. Using individual components separately
Below are minimal examples if you prefer full control over state.

```jsx
import { useState } from "react";
import FileSelector from "@/features/files/components/FileSelector";
import ImagePreview from "@/features/files/components/ImagePreview";
import AttachmentList from "@/features/files/components/AttachmentList";

export default function CustomUploader() {
  const [images, setImages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState(null);

  return (
    <div>
      <h6>Pick images</h6>
      <FileSelector
        label="Images"
        acceptedTypes={["image/png", "image/jpeg"]}
        maxSizeMB={20}
        multiple
        onFilesSelected={(files) => setImages((prev) => [...prev, ...files])}
        onError={setError}
      />
      <ImagePreview images={images} onRemove={(i) => setImages(images.filter((_, idx) => idx !== i))} />

      <h6 className="mt-3">Pick attachments</h6>
      <FileSelector
        label="Attachments"
        acceptedTypes={["image/png", "image/jpeg", "application/pdf"]}
        maxSizeMB={20}
        multiple
        onFilesSelected={(files) => setAttachments((prev) => [...prev, ...files])}
        onError={setError}
      />
      <AttachmentList attachments={attachments} onRemove={(i) => setAttachments(attachments.filter((_, idx) => idx !== i))} />

      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
}
```

---

## 3) Integration Scenarios

### A. User Profile Page – avatar upload
Enable only the images section, set a specific `category` (e.g., `"profile"`), and accept a single file.

```jsx
import { useRef, useState } from "react";
import FileUploadManager from "@/features/files/components/FileUploadManager";
import { updateIdentity } from "@/features/users/api/users.api"; // Example API

export default function ProfileAvatarForm() {
  const ref = useRef(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveAvatar = async () => {
    setSaving(true); setError(null);
    try {
      const uploaded = await ref.current?.uploadFiles();
      const avatarUrl = uploaded?.images?.[0] || null;
      if (!avatarUrl) throw new Error("Please select an image");
      await updateIdentity({ avatarUrl });
      // toast.success("Avatar updated")
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to save avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <FileUploadManager
        ref={ref}
        category="profile"
        imageConfig={{
          enabled: true,
          label: "Profile picture",
          acceptedTypes: ["image/png", "image/jpeg"],
          maxSizeMB: 5,
          multiple: false,
        }}
        attachmentConfig={{ enabled: false }}
        onError={setError}
      />

      <button className="btn btn-primary" onClick={saveAvatar} disabled={saving}>Save Avatar</button>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
}
```

### B. Post Creation Page – current approach and enhancements
The current `NewPost.jsx` flow creates and optionally publishes a post. To (re‑)enable file uploads, add `FileUploadManager` and merge its results into the `createPost` payload (see example in 2A). Enhancements you may consider:
- Limit images by count or size for performance
- Validate total attachment size before submit
- Show per‑file upload progress (wrap `directUpload` with progress events and a progress bar)
- Inline remove/undo controls

### C. Other use cases
- Comment attachments (images and PDFs)
- Admin asset upload for announcement banners
- User‑generated content galleries
- Support tickets: screenshots + logs

---

## 4) Configuration Options

- `category` (string): a logical grouping used by the file service for routing/organization (e.g., `"profile"`, `"postAttachment"`, `"messageAttachment"`). Required by the API; defaults to `"postAttachment"`.
- `imageConfig`:
  - `enabled` (boolean)
  - `label` (string)
  - `acceptedTypes` (string[] MIME)
  - `maxSizeMB` (number)
  - `multiple` (boolean)
- `attachmentConfig`: same shape as `imageConfig`.
- `onFilesUploaded(result)`: called after successful uploads with `{ images, attachments, totalFiles }`.
- `onError(message)`: called after validation or network failures; `FileUploadManager` also renders a Bootstrap danger alert inline.
- `disabled` / `className`: UI state & styling passthrough.

---

## 5) API Integration

These components use the file API helpers in `src/features/files/api/file.api.js`:

- `directUpload({ file, category })` → POST `/api/files/upload`
  - Body: multipart/form‑data with fields `file`, `category`
  - Response: `{ fileUrl, objectKey, sizeBytes, contentType }`
  - `FileUploadManager` collects `fileUrl`s and returns them to the caller
- `retrieve(objectKey)` → GET `/api/files/retrieve/:objectKey`
  - Returns metadata and a temporary download URL (presigned). Useful when you store `objectKey` instead of `fileUrl`.
- `presignUpload(...)` exists in the client but presign endpoint is currently disabled in `API_CONFIG`; the manager uses `directUpload` by default. You can switch strategies later without changing component APIs.

Auth & base URL are handled by the shared Axios client (`src/libs/axios.js`) and `API_CONFIG`. When the gateway requires auth, ensure the user is logged in so requests include the Authorization header automatically.

---

## Styling & Icons

- The components render Bootstrap utility classes. Ensure Bootstrap CSS is loaded globally.
- Icons use Bootstrap Icons classes (e.g., `bi bi-file-image`). Include Bootstrap Icons CSS if not already present.

## Accessibility

- Drag‑and‑drop has a standard file input fallback.
- Labels and button text are provided; you can further enhance ARIA attributes as needed.

## Notes

- Large uploads: consider adding progress UI and chunking on the service side if required.
- Errors: both validation (client‑side) and server responses are surfaced via `onError` and inline alerts in the manager.

