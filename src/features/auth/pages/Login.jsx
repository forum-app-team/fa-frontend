import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../store/auth.slice";
import { loginUser } from "../api/auth.api";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Set loading state
      dispatch(loginStart());

      // Send login request and get response
      const response = await loginUser(credentials);

      // Update store with user data and token
      dispatch(loginSuccess(response));

      navigate("/home");
    } catch (err) {
      dispatch(loginFailure("Invalid credentials"));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                username: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                password: e.target.value,
              })
            }
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
