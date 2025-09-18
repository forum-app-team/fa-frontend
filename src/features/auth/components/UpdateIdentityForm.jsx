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

const UpdateIdentityForm = ({ mode }) => {
    if (!mode) {
        throw new Error("The form requires a `mode` prop: `password` or `email`");
    }
    const [credentials, setCredentials] = useState(initCredentials);
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const { error, loading } = useSelector((state) => state.auth);

    // check if passwords / emails match
    const fieldsMatch = mode === "password"
        ? credentials.newPassword === credentials.confirmNewPassword
        : credentials.newEmail === credentials.confirmNewEmail;

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

        const requiredFields = mode === 'password'
            ? ["currentPassword", "newPassword", "confirmNewPassword"]
            : ["currentPassword", "newEmail", "confirmNewEmail"];

        const { sanitized, errors } = validateInput(credentials, requiredFields);

        if (Object.keys(errors).length > 0) {
            dispatch(updateIdentityFailure(Object.values(errors)[0]));
            return;
        }

        // extra layer of defense :)
        const payload = mode === "password"
            ? { currentPassword: sanitized.currentPassword, newPassword: sanitized.newPassword }
            : { currentPassword: sanitized.currentPassword, newEmail: sanitized.newEmail };

        try {
            const response = await updateUserIdentity(payload);

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

    // useEffect(() => {
    //     return () => {
    //         setCredentials(initCredentials);
    //     };
    // }, []); // also clean up credentials at unmount;

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

            {mode === 'password' && (
                <>
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
                </>
            )}
            {mode === "email" && (
                <>
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
                </>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                <button type="submit" disabled={loading || !fieldsMatch}>Save Changes</button>
                <button onClick={() => setCredentials(initCredentials)}>Cancel</button>
            </div>
        </form>
    );
};

export default UpdateIdentityForm;