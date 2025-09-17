// TODO: Integrate S3 presigned upload flow: request URL, PUT image, update user profile image
const ProfileImageUploader = () => {
  return (
    <div>
      <input type="file" accept="image/*" />
      <button>Upload</button>
    </div>
  );
};

export default ProfileImageUploader;
