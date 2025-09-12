import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { updateIdentityStart, updateIdentitySuccess, updateIdentityFailure } from "../store/auth.slice";
import { updateUserIdentity } from "../api/auth.api";
// import { PATHS } from "@/app/config/paths";
import validateInput from "../utils/validateUserInput";

const initCredentials = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        newEmail: "",
        confirmNewEmail: ""
    };

const UpdateIdentityForm = () => {
    const [credentials, setCredentials] = useState(initCredentials);
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const { error, loading } = useSelector((state) => state.auth);

    // check if passwords / emails match
    const passwordsMatch = credentials.newPassword === credentials.confirmNewPassword;
    const emailsMatch = credentials.newEmail === credentials.confirmNewEmail;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(updateIdentityStart());

        const { sanitized, errors } = validateInput(credentials, ["currentPassword"]);

        if (Object.keys(errors).length > 0) {
            dispatch(updateIdentityFailure(Object.values(errors)[0]));
            return;
        }

        try {
            const response = await updateUserIdentity(sanitized);

            // Update store with user data and token
            dispatch(updateIdentitySuccess(response));

            setCredentials(initCredentials);

            // navigate(PATHS.HOME);

        } catch (err) {
            const message = err?.data?.message || "Invalid credentials"
            dispatch(updateIdentityFailure(message));
            setCredentials((prev) => ({ ...prev, currentPassword: "" })); // clean up the password anyways
        }
    };

    useEffect(() => {
        return () => {
            setCredentials(initCredentials);
        };
    }, []); // also clean up credentials at unmount;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Current Password:</label>
                <input
                    type="password"
                    name="currentPassword"
                    value={credentials.currentPassword}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>New Password:</label>
                <input
                    type="password"
                    name="newPassword"
                    value={credentials.newPassword}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Confirm New Password:</label>
                <input
                    type="password"
                    name="confirmNewPassword"
                    value={credentials.confirmNewPassword}
                    onChange={handleChange}
                />
            </div>
            
            <div>
                <label>New Email:</label>
                <input
                    type="text"
                    name="newEmail"
                    value={credentials.newEmail}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Confirm New Email:</label>
                <input
                    type="text"
                    name="confirmNewEmail"
                    value={credentials.confirmNewEmail}
                    onChange={handleChange}
                />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" disabled={loading || !passwordsMatch || !emailsMatch}>Save Changes</button>
        </form>
    );
};

export default UpdateIdentityForm;