import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "../config/paths";

const ProtectedRoute = ({ adminOnly }) => {
  // TODO: Implement user authentication state.
  return <Outlet />;
};

export default ProtectedRoute;
