import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FiLogOut, FiGrid, FiHome, FiPackage, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import styles from "./PlatformNavbar.module.css";

const PlatformNavbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const menuItems = [
    { name: "Home", path: "/", icon: FiHome },
    { name: "Dashboard", path: "/dashboard", icon: FiGrid },
    { name: "Products", path: "/#products", icon: FiPackage },
    { name: "Profile", path: "/profile", icon: FiUser },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path.startsWith("/#")) return false;
    return location.pathname.startsWith(path);
  };

  const scrollToSection = (sectionId) => {
    if (sectionId === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (sectionId.startsWith("/#")) {
      const id = sectionId.replace("/#", "");
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigate(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${styles.nav} ${isScrolled ? styles.navScrolled : ""}`}
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={styles.logoContainer}
          >
            <div className={styles.logoIcon}>
              <span>V</span>
            </div>
            <span className={styles.logoText}>VIDHI SOL</span>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          {menuItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.path)}
                className={`${styles.menuItem} ${isActive(item.path) ? styles.menuItemActive : ""}`}
              >
                <ItemIcon className={styles.menuIcon} />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Desktop Right Side */}
        <div className={styles.desktopActions}>
          {isAuthenticated ? (
            <>
              <motion.span
                whileHover={{ scale: 1.02 }}
                className={styles.userGreeting}
              >
                Welcome, {user?.firstName || "User"}
              </motion.span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={styles.logoutBtn}
              >
                <FiLogOut className={styles.btnIcon} />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.signInBtn}
                >
                  Sign In
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.getStartedBtn}
                >
                  Get Started
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.mobileMenu}
          >
            <div className={styles.mobileMenuContent}>
              {menuItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.path)}
                    className={`${styles.mobileMenuItem} ${isActive(item.path) ? styles.mobileMenuItemActive : ""}`}
                  >
                    <ItemIcon className={styles.menuIcon} />
                    {item.name}
                  </button>
                );
              })}
              <div className={styles.mobileActions}>
                {isAuthenticated ? (
                  <>
                    <span className={styles.mobileUserGreeting}>
                      Signed in as <strong>{user?.firstName}</strong>
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className={styles.mobileLogoutBtn}
                    >
                      <FiLogOut className={styles.btnIcon} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={styles.mobileSignInBtn}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className={styles.mobileGetStartedBtn}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default PlatformNavbar;
