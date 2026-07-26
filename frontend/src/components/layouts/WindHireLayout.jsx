import { Outlet } from "react-router-dom";
import { useState } from "react";
import WindHireSidebar from "../layout/WindHireSidebar";
import DashboardHeader from "../layout/DashboardHeader";
import { cn } from "../../utils/cn";

const WindHireLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <WindHireSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isCollapsed={isCollapsed}
        onCollapseToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <div
        className={cn(
          "min-h-screen flex flex-col transition-all duration-300",
          isCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <DashboardHeader
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          sidebarCollapsed={isCollapsed}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WindHireLayout;
