import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../utils/auth";
import TypingTitle from "./TypingTitle";
import styles from "./Hero.module.css";

const Hero = () => {
  const { user, isAuthenticated } = useAuth();
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToDashboard = () => {
    const element = document.getElementById("dashboard-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/candidate/dashboard";
    }
  };

  return (
    <section className={styles.hero}>
      {/* Floating Background Orbs */}
      <div className={styles.floatingElements}>
        <div className={`${styles.floatingOrb} ${styles.orb1}`} />
        <div className={`${styles.floatingOrb} ${styles.orb2}`} />
        <div className={`${styles.floatingOrb} ${styles.orb3}`} />
      </div>

      <div className={styles.content}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={styles.welcomeText}
        >
          Welcome to
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.heading}
        >
          <span className={styles.headingGradient}>
            <TypingTitle />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={styles.subtitle}
        >
          One Account.
          <br className={styles.mobileBreak} /> Multiple Powerful Solutions.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.description}
        >
          Access a suite of powerful tools and platforms with a single account.
          From AI-powered hiring to innovative business solutions — everything
          you need, all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={styles.buttons}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToProducts}
            className={styles.primaryBtn}
          >
            Explore Products
            <FiArrowRight className={styles.arrowIcon} />
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={isAuthenticated ? "/dashboard" : "/login"}
            className={styles.secondaryBtn}
          >
            {isAuthenticated ? "Platform Dashboard" : "Sign In"}
            <FiArrowRight className={styles.arrowIcon} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
