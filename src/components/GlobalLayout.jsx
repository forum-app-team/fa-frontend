import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar"; // TODO: implement nav bar

const GlobalLayout = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default GlobalLayout;
