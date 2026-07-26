import { motion } from "framer-motion";
import { FiZap, FiArrowRight, FiCode, FiLock, FiCloud } from "react-icons/fi";
import styles from "./ProductLanding.module.css";

const Product4Landing = () => {
  return (
    <div className={styles.page}>
      <div className={styles.bgEffects}>
        <div
          className={styles.orb1}
          style={{ background: "#ec4899", right: "auto", left: "-200px" }}
        />
        <div
          className={styles.orb2}
          style={{ background: "#8b5cf6", left: "auto", right: "-200px" }}
        />
      </div>

      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.content}
        >
          <div
            className={styles.badge}
            style={{
              borderColor: "rgba(236, 72, 153, 0.2)",
              color: "#f472b6",
              background: "rgba(236, 72, 153, 0.1)",
            }}
          >
            <FiZap /> Coming Soon
          </div>

          <h1 className={styles.title}>
            Welcome to{" "}
            <span
              className={styles.gradient}
              style={{
                backgroundImage: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              }}
            >
              Product 4
            </span>
          </h1>

          <p className={styles.subtitle}>
            Automation tools designed to streamline your business operations
            effortlessly. Simplify complexity.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <FiCode
                className={styles.featureIcon}
                style={{ color: "#ec4899" }}
              />
              <h3>No-Code Builder</h3>
              <p>Build workflows without writing code.</p>
            </div>
            <div className={styles.featureItem}>
              <FiLock
                className={styles.featureIcon}
                style={{ color: "#8b5cf6" }}
              />
              <h3>Enterprise Security</h3>
              <p>Bank-grade encryption for your data.</p>
            </div>
            <div className={styles.featureItem}>
              <FiCloud
                className={styles.featureIcon}
                style={{ color: "#06b6d4" }}
              />
              <h3>Cloud Native</h3>
              <p>Scalable, reliable, always available.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.ctaSection}
          >
            <p className={styles.notifyText}>
              Early access coming soon. Sign up for updates.
            </p>
            <div className={styles.ctaGroup}>
              <a href="mailto:hello@vidhisol.com" className={styles.primaryBtn}>
                Notify Me
                <FiArrowRight />
              </a>
              <a href="/dashboard" className={styles.secondaryBtn}>
                Back to Platform
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Product4Landing;
