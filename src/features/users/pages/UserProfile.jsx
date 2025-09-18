import { useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import TopPostsList from "../components/TopPostsList";
import DraftsList from "../components/DraftsList";
import ViewHistorySection from "../components/ViewHistorySection";
import EditProfileButton from "../components/EditProfileButton";
import ProfileImageUploader from "../components/ProfileImageUploader";
import EmailUpdateSection from "../components/EmailUpdateSection";
import UpdateNameSection from "../components/UpdateNameSection";
import { Button } from "react-bootstrap";



const UserProfile = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [showEditCreds, setShowEditCreds] = useState(false);

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "1rem",
        display: "grid",
        gap: "2rem",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>User Profile</h1>

        <div style={{display: "flex", gap: ".5rem"}}>
        <Button onClick={() => {setShowEdit(v => false); setShowEditCreds(v => !v);}}>Edit Email/Password</Button>
        <EditProfileButton onClick={() => {setShowEdit(v => !v); setShowEditCreds(v => false);}} />
        </div>
      </header>

      <ProfileHeader />

    {showEditCreds && (
        <section style={{ border: "1px solid #ccc", padding: "1rem" }}>
          {/* <h2>Edit Profile</h2> */}
          {/* <ProfileImageUploader /> */}
          <EmailUpdateSection />
        </section>
    )}


      {showEdit && (
        <section style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <h2>Edit Profile</h2>
          <ProfileImageUploader />
          {/* <EmailUpdateSection /> */}
          <UpdateNameSection />
          {/* TODO: Add name fields, password change form */}
        </section>
      )}

      <TopPostsList />
      <DraftsList />
      <ViewHistorySection />
    </div>
  );
};

export default UserProfile;
