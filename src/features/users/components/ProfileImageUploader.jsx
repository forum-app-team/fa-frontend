import { useRef, useState } from "react";
import FileUploadManager from "@/features/files/components/FileUploadManager";
import { useUpdateProfileImageMutation } from "../store/users.slice";
import { useSelector } from "react-redux";
import { getUserIdFromToken } from "../utils/authUtils";

const ProfileImageUploader = ({ onUploadSuccess }) => {
  const ref = useRef(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [updateProfileImage] = useUpdateProfileImageMutation();
  const reduxUserId = useSelector((state) => state.auth.user?.id);
  const userId = reduxUserId || getUserIdFromToken();

  const saveAvatar = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const uploaded = await ref.current?.uploadFiles();
      const avatarUrl = uploaded?.images?.[0] || null;
      if (!avatarUrl) throw new Error("Please select an image");

      await updateProfileImage({
        userId,
        profileImageUrl: avatarUrl,
      }).unwrap();

      setSuccess(true);
      onUploadSuccess?.(avatarUrl);
    } catch (e) {
      setError(
        e?.response?.data?.message || e.message || "Failed to save avatar"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card card-body">
      <h5 className="mb-2">Profile Image Upload</h5>
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
      <button
        className="btn btn-primary mt-3"
        onClick={saveAvatar}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Avatar"}
      </button>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && (
        <div className="alert alert-success mt-2">Profile image updated!</div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
