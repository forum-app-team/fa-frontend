import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/auth.slice";
import messageReducer from "../features/messages/store/message.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
    // Add your feature reducer here:
    // posts: postsReducer,
    // etc...
  },
});

export { store };
