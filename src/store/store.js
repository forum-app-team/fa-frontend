import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/auth.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add your feature reducer here:
    // posts: postsReducer,
    // etc...
  },
});

export { store };
