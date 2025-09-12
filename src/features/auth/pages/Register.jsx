import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {registerStart, registerSuccess, registerFailure} from "../store/auth.slice";
import {registerUser} from "../api/auth.api";
import validateInput from '@/utils/validateUserInput';

import { PATHS } from '@/app/config/paths';

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
    dispatch(registerStart());

    // input sanitation
    // in the registration form, all fields are required
    const { sanitized, errors } = validateInput(credentials, Object.keys(credentials));

    if (Object.keys(errors).length > 0) {
      dispatch(loginFailure(Object.values(errors)[0])); // just need the first error
      return;
    }
    try {

      const response = await registerUser(sanitized);

      dispatch(registerSuccess(response));

      navigate(PATHS.LOGIN); // no automatic login

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
