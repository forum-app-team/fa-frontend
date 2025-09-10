import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { PATHS } from "../config/paths";

const ProtectedRoute = ({ adminOnly = false }) => {
  // ! dev mode flag
  if (import.meta.env.VITE_SKIP_AUTH === "true") {
    console.log("Auth checks skipped - Development mode");
    return <Outlet />;
  }

  const { user, token, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  // Check admin access for admin-only routes
  if (adminOnly && (!user || user.role !== "admin")) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  // Render child routes if authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
