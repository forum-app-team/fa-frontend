import { Outlet } from "react-router-dom";
import { NavigationBar } from "./NavigationBar";

const GlobalLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar with a gray horizontal line at the bottom */}
      <NavigationBar />
      <hr></hr>
      <main>
        <div className="w-full text-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default GlobalLayout;
