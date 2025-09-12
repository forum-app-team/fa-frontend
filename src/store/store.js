import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/auth.slice";
import { adminUserApi } from '@/features/admin/users.api';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminUserApi.reducerPath]: adminUserApi.reducer,
    // Add your feature reducer here:
    // posts: postsReducer,
    // etc...
  },
  middleware: (getDefault) =>
    getDefault().concat(adminUserApi.middleware),
});

export { store };
