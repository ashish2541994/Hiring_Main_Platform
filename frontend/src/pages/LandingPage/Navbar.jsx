import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FiLogOut, FiGrid } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
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
    { name: "Home", path: "/" },
    { name: "Products", path: "/#products" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  const scrollToSection = (sectionId) => {
    if (sectionId === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const id = sectionId.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
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
              <span>DV</span>
            </div>
            <span className={styles.logoText}>DhruVidhi Solutions</span>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.path)}
              className={styles.menuItem}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className={styles.desktopActions}>
          {isAuthenticated ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
                className={styles.dashboardBtn}
              >
                <FiGrid className={styles.btnIcon} />
                Dashboard
              </motion.button>
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
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.path)}
                  className={styles.mobileMenuItem}
                >
                  {item.name}
                </button>
              ))}
              <div className={styles.mobileActions}>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                      className={styles.mobileDashboardBtn}
                    >
                      <FiGrid className={styles.btnIcon} />
                      Dashboard
                    </button>
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

export default Navbar;
