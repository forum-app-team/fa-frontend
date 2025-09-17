import { useState } from "react";
import { useRequestEmailVerificationMutation } from "../store/users.slice";

const EmailUpdateSection = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [requestEmailVerification, { isLoading }] = useRequestEmailVerificationMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email || !confirmEmail) {
      setError("Please fill in both email fields.");
      return;
    }
    if (email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }
    try {
      await requestEmailVerification(email).unwrap();
      setSuccess(
        "Verification email sent! Please check your inbox and follow the link to verify your new email address."
      );
      setEmail("");
      setConfirmEmail("");
    } catch (err) {
      setError(
        err?.data?.message || err?.error || err?.message || "Failed to send verification email."
      );
    }
  };

  return (
    <section>
      <h3>Update Email (Verification Required)</h3>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-2">
          <input
            type="email"
            className="form-control mb-2"
            placeholder="New email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="email"
            className="form-control"
            placeholder="Confirm new email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Sending..." : "Verify Email"}
        </button>
      </form>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">{success}</div>}
    </section>
  );
};

export default EmailUpdateSection;
