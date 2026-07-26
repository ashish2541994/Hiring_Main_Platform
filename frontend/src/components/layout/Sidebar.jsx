import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Bookmark,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import { cn } from "../../utils/cn";

const Sidebar = ({ isOpen, onToggle, isCollapsed, onCollapseToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const menuItems = {
    candidate: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/candidate/dashboard",
      },
      { name: "Browse Jobs", icon: Briefcase, path: "/candidate/jobs" },
      { name: "Applications", icon: FileText, path: "/candidate/applications" },
      { name: "Saved Jobs", icon: Bookmark, path: "/candidate/saved-jobs" },
      { name: "Profile", icon: Users, path: "/candidate/profile" },
    ],
    recruiter: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/recruiter/dashboard",
      },
      { name: "Manage Jobs", icon: Briefcase, path: "/recruiter/jobs" },
      { name: "Applicants", icon: FileText, path: "/recruiter/applications" },
      { name: "Candidates", icon: Users, path: "/recruiter/candidates" },
      { name: "Company Profile", icon: Building2, path: "/recruiter/company" },
    ],
    admin: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
      { name: "Users", icon: Users, path: "/admin/users" },
      { name: "Applications", icon: FileText, path: "/admin/applications" },
      { name: "Reports", icon: BarChart3, path: "/admin/analytics" },
      { name: "Settings", icon: Settings, path: "/admin/settings" },
    ],
  };

  const commonItems = [
    { name: "Messages", icon: MessageSquare, path: "/messages" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const roleKey =
    user?.role === "admin" || user?.role === "super_admin"
      ? "admin"
      : user?.role === "recruiter" ||
          user?.role === "hr" ||
          user?.role === "company"
        ? "recruiter"
        : "candidate";

  const allMenuItems = [
    ...(menuItems[roleKey] || menuItems.candidate),
    ...commonItems,
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 256 }}
        className={cn(
          "fixed left-0 top-0 h-full bg-background border-r border-border z-50 flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between h-16 px-3 border-b border-border shrink-0">
          {!isCollapsed && (
            <Link
              to={getDashboardPathForRole(roleKey)}
              className="flex items-center gap-2 min-w-0"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-lg font-bold gradient-text truncate">
                Wind Hire
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link to={getDashboardPathForRole(roleKey)} className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
            </Link>
          )}
          <button
            onClick={onCollapseToggle}
            className="p-2 rounded-lg hover:bg-accent transition-colors hidden md:flex shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-accent transition-colors md:hidden shrink-0"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isCollapsed && (
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <Avatar
                src={user?.avatar}
                initials={`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {allMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 768) onToggle();
                    }}
                    title={isCollapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      isCollapsed && "justify-center px-2",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-border shrink-0">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-destructive hover:bg-destructive/10",
              isCollapsed && "justify-center px-2",
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

function getDashboardPathForRole(roleKey) {
  switch (roleKey) {
    case "admin":
      return "/admin/dashboard";
    case "recruiter":
      return "/recruiter/dashboard";
    default:
      return "/candidate/dashboard";
  }
}

export default Sidebar;
