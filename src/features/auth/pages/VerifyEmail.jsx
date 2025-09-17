import { useState } from "react";

import { hitVerificationLink } from "../api/auth.email.api";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Please click the button to verify your email.");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const handleVerify = async () => {
    if (!token) {
      setMessage("No verification token found.");
      return;
    }
    setLoading(true);
    setMessage("Verifying...");
    try {

      const response = await hitVerificationLink(token);
      console.log("Response from API:", response);
      setMessage(`${response.message}. You may close this page.` || "Email verified successfully. You may close this page.");

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Verification failed";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
      setVerified(true);
    }
  };


  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>{message}</h2>
      {!loading && !verified && token && (
        <button
          onClick={handleVerify}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
          }}
        >
          Verify Email
        </button>
      )}
    </div>
  );
};

export default VerifyEmail;
