import UserHomePage from "../../features/users/pages/UserHomePage";
import AdminHomePage from "../../features/admin/pages/AdminHomePage";

const HomeRoute = () => {
  // TODO: Implement authentication state based on the role (user and admin)
  // const user = { role: "admin" };
  const user = { role: 'user' };

  if (user && user.role === "admin") {
    return <AdminHomePage />;
  }

  return <UserHomePage />;
};

export default HomeRoute;
