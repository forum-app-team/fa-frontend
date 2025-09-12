import UpdateIdentityForm from "@/features/auth/components/UpdateIdentityForm";

const UserProfile = () => {
  return (
    <div>
      <h1>User Profile</h1>
      <h2>Update Email</h2>
      <UpdateIdentityForm mode="email"></UpdateIdentityForm>
      <h2>Update Password</h2>
      <UpdateIdentityForm mode="password"></UpdateIdentityForm>
    </div>
    );
};

export default UserProfile;
