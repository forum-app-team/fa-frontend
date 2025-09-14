import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/auth.slice";
import authListenerMiddleware from "../features/auth/store/auth.listener";
import { adminUserApi } from '../features/admin/users.api';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add your feature reducer here:
    // posts: postsReducer,
    // etc...
  },
  middleware: (getDefault) =>
    getDefault()
      .prepend(authListenerMiddleware.middleware)
      .concat(adminUserApi.middleware),
});

export { store };
