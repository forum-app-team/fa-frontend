import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginStart, loginSuccess, loginFailure } from "../store/auth.slice";
import { loginUser } from "../api/auth.api";
import validateInput from "@/utils/validateUserInput";
import { PATHS } from "@/app/config/paths";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Set loading state
    dispatch(loginStart());

    // input sanitation
    // need to validate all fields of the login form
    const { sanitized, errors } = validateInput(credentials, Object.keys(credentials));
    // const { sanitized, errors } = validateInput(credentials, ["email", "password"]);

    if (Object.keys(errors).length > 0) {
      dispatch(loginFailure(Object.values(errors)[0])); // just need the first error
      return;
    }

    try {
      // Send login request and get response
      const response = await loginUser(sanitized);

      // Update store with user data and token
      dispatch(loginSuccess(response));

      setCredentials({ email: "", password: "" });

      navigate(PATHS.HOME);

    } catch (err) {
      const message = err?.data?.message || "Invalid credentials"
      dispatch(loginFailure(message));
      setCredentials((prev) => ({ ...prev, password: "" })); // clean up the password anyways
    }
  };

  useEffect(() => {
    return () => {
      setCredentials({ email: "", password: "" });
    };
  }, []); // also clean up credentials at unmount;

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>email:</label>
          <input
            type="text"
            name="email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>Login</button>
      </form>
    </div>
  );
};

export default Login;
