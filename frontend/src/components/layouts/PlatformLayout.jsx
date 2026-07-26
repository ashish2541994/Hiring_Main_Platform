import { Outlet } from "react-router-dom";
import PlatformNavbar from "../layout/PlatformNavbar";

const PlatformLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <PlatformNavbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default PlatformLayout;
