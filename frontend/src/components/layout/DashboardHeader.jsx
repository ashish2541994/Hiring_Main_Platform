import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { cn } from "../../utils/cn";
import { getDashboardPath, getProfilePath } from "../../utils/auth";

const DashboardHeader = ({ onMenuToggle, sidebarCollapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const jobsPath =
      user?.role === "recruiter" || user?.role === "admin"
        ? "/recruiter/jobs"
        : "/candidate/jobs";
    navigate(`${jobsPath}?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 shrink-0"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 max-w-md"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Link to="/notifications">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </Link>

          <Link to="/messages">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </Link>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-2 pr-1"
            >
              <Avatar
                src={user?.avatar}
                initials={`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`}
                size="sm"
              />
              <span className="hidden lg:inline text-sm font-medium max-w-[120px] truncate">
                {user?.firstName}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-background shadow-lg py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to={getDashboardPath(user?.role)}
                      className="block px-4 py-2 text-sm hover:bg-accent"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={getProfilePath(user?.role)}
                      className="block px-4 py-2 text-sm hover:bg-accent"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm hover:bg-accent"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
