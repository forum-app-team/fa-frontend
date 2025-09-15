import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "../store/message.thunk";
import {
  resetStatus,
  selectMessageLoading,
  selectMessageSuccess,
  selectMessageError,
} from "../store/message.slice";

const MessageForm = () => {
  const [form, setForm] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const dispatch = useDispatch();

  const loading = useSelector(selectMessageLoading);
  const success = useSelector(selectMessageSuccess);
  const error = useSelector(selectMessageError);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendMessageThunk(form));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (success) {
      setForm({ email: "", subject: "", message: "" });
    }
  }, [success, dispatch]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {success && (
            <div className="text-success fw-bold mb-3 p-3 border border-success rounded bg-light">
              Message sent successfully!
            </div>
          )}

          {error && (
            <div className="text-danger fw-bold mb-3 p-3 border border-danger rounded bg-light">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                disabled={loading}
                rows="5"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn ${
                loading ? "btn-secondary" : "btn-primary"
              } w-100`}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm me-2"></span>
              )}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export { MessageForm };
