import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/auth.slice";
import authListenerMiddleware from "../features/auth/store/auth.listener";
import { adminUserApi } from "../features/admin/users.api";
import { adminPostApi } from "../features/admin/posts.api";
import messageReducer from "../features/messages/store/message.slice";
import { normalUserApi } from "@/features/users/store/users.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminUserApi.reducerPath]: adminUserApi.reducer,
    [adminPostApi.reducerPath]: adminPostApi.reducer,
    message: messageReducer,
    [normalUserApi.reducerPath]: normalUserApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault()
      .prepend(authListenerMiddleware.middleware)
      .concat(adminUserApi.middleware, adminPostApi.middleware, normalUserApi.middleware),
});

export { store };
