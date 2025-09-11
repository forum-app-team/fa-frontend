import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {registerStart, registerSuccess, registerFailure} from "../store/auth.slice";
import {registerUser} from "../api/auth.api";

const Register = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {error} = useSelector((state) => state.auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(registerStart());

      const response = await registerUser(credentials);

      dispatch(registerSuccess(response));

      navigate("/user/login"); // no automatic login

    } catch(error) {
      dispatch(registerFailure("Registration failed. Please try again"));
    }
  };

  const handleChange = (event) => {
    const {name, value} = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials, 
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>Register Page</h2>
      {error & <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={credentials.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={credentials.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email" 
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
