import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/auth.slice";
import authListenerMiddleware from "../features/auth/store/auth.listener";
import { adminUserApi } from "../features/admin/users.api";
import { adminPostApi } from "../features/admin/posts.api";
import messageReducer from "../features/messages/store/message.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminUserApi.reducerPath]: adminUserApi.reducer,
    [adminPostApi.reducerPath]: adminPostApi.reducer,
    message: messageReducer,
    // Add your feature reducer here:
    // posts: postsReducer,
    // etc...
  },
  middleware: (getDefault) =>
    getDefault()
      .prepend(authListenerMiddleware.middleware)
      .concat(adminUserApi.middleware)
      .concat(adminPostApi.middleware),
});

export { store };
