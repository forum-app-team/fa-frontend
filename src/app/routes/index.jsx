import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "../config/paths";

import ProtectedRoute from "./ProtectedRoute";
import HomeRoute from "./HomeRoute";
import GlobalLayout from "../../components/GlobalLayout";
import Login from "../../features/auth/pages/Login";
import Register from "../../features/auth/pages/Register";
import ContactAdmin from "../../features/messages/pages/ContactAdmin";
import UserManagement from "../../features/admin/pages/UserManagement";
import MessageManagement from "../../features/messages/pages/MessageManagement";
import UserProfile from "../../features/users/pages/UserProfile";
import PostDetail from "../../features/posts/pages/PostDetail";
import NewPost from "../../features/posts/pages/NewPost";
import NotFound from "../../components/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<GlobalLayout />}>
        {/* Public routes */}
        <Route index element={<Navigate to={PATHS.LOGIN} replace />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.REGISTER} element={<Register />} />
        <Route path={PATHS.CONTACT_US} element={<ContactAdmin />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={PATHS.HOME} element={<HomeRoute />} />
          <Route path={PATHS.PROFILE} element={<UserProfile />} />
          <Route path={PATHS.POST_DETAIL} element={<PostDetail />} />
          <Route path={PATHS.POST_NEW} element={<NewPost />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path={PATHS.MESSAGES} element={<MessageManagement />} />
          <Route path={PATHS.USERS} element={<UserManagement />} />
        </Route>

        {/* 404 Error handling */}
        <Route path={PATHS.ERROR} element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
