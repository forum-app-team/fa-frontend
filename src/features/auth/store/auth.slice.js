import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
let user = null;

if (token) {
  try {
    const tokenPaylaod = jwtDecode(token);
    user = tokenPaylaod.sub;
  } catch (err) {
    localStorage.removeItem("token");
  }
}

const initialState = {
  user,
  token,
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //login reducers
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;

      const { accessToken, message } = action.payload;
      state.token = accessToken;

      const tokenPayload = jwtDecode(accessToken);
      state.user = tokenPayload.sub;

      localStorage.setItem("token", accessToken);

      state.message = message;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    logout: (state, action) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      state.message = action.payload.message;
    },

    // registration reducers
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.message = action.payload.message;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // update identity reducers
    updateIdentityStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateIdentitySuccess: (state, action) => {
      state.loading = false;

      const { accessToken, message } = action.payload;
      state.token = accessToken;

      const tokenPayload = jwtDecode(accessToken);
      state.user = tokenPayload.sub;

      localStorage.setItem("token", accessToken);

      state.message = message;
    },
    updateIdentityFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  updateIdentityStart,
  updateIdentitySuccess,
  updateIdentityFailure
} = authSlice.actions;

export default authSlice.reducer;
