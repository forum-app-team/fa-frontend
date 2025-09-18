import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateUserProfile } from "../users.api";
import {validateName} from "../utils/validateName";

const initNames = { firstName: "", lastName: "" };

const UpdateNameSection = () => {
  const [names, setNames] = useState(initNames);
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const { user, error, loading } = useSelector((state) => state.auth);
  const userId = user?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNames({ ...names, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const { sanitized, errors } = validateName(names);
    if (Object.keys(errors).length > 0) {
      setLocalError("Please fix input errors");
      return;
    }

    try {
      await updateUserProfile(userId, sanitized);
      setNames(initNames); // only clear if success
    } catch (err) {
      setLocalError(err?.data?.message || "Invalid inputs");
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <label>New First Name: </label>
        <input
          type="text"
          name="firstName"
          value={names.firstName}
          onChange={handleChange}
        />
        <br />
        <label>New Last Name</label>
        <input
          type="text"
          name="lastName"
          value={names.lastName}
          onChange={handleChange}
        />

        {(error || localError) && (
          <p style={{ color: "red" }}>{error || localError}</p>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: ".5rem" }}>
          <button type="submit" disabled={loading}>
            Save Changes
          </button>
          <button type="button" onClick={() => setNames(initNames)}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default UpdateNameSection;
