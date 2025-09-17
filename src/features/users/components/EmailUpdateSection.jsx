
import { useState } from "react";
import apiClient from "@/libs/axios";
import { API_CONFIG } from "@/config/api.config";

const EmailUpdateSection = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
    setLoading(true);
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.EMAIL_VERIFICATION_SEND, { email });
      setSuccess("Verification email sent! Please check your inbox and follow the link to verify your new email address.");
      setEmail("");
      setConfirmEmail("");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to send verification email.");
    } finally {
      setLoading(false);
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
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="email"
            className="form-control"
            placeholder="Confirm new email"
            value={confirmEmail}
            onChange={e => setConfirmEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Verify Email"}
        </button>
      </form>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">{success}</div>}
    </section>
  );
};

export default EmailUpdateSection;
