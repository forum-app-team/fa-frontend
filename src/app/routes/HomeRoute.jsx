import UserHomePage from "../../features/users/pages/UserHomePage";
import AdminHomePage from "../../features/admin/pages/AdminHomePage";
import { useSelector } from "react-redux";

const HomeRoute = () => {
  // TODO: Implement authentication state based on the role (user and admin)
  // const user = { role: "admin" };
  // const user = { role: 'user' };
  const user = useSelector((state) => state.auth.user)

  if (user && user.role !== "normal") {
    return <AdminHomePage />;
  }

  return <UserHomePage />;
};

export default HomeRoute;
