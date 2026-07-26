import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundAnimation from "./BackgroundAnimation";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Products from "./Products";
import About from "./About";
import Footer from "./Footer";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const location = useLocation();

  // Handle hash-based scrolling on mount
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className={styles.page}>
      <BackgroundAnimation />
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={styles.main}
      >
        <Hero />
        <Products />
        <About />
      </motion.main>

      <Footer />
    </div>
  );
};

export default LandingPage;
