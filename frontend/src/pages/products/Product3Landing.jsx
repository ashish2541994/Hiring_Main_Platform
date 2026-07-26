import { motion } from "framer-motion";
import {
  FiLayers,
  FiArrowRight,
  FiTrendingUp,
  FiPieChart,
  FiGlobe,
} from "react-icons/fi";
import styles from "./ProductLanding.module.css";

const Product3Landing = () => {
  return (
    <div className={styles.page}>
      <div className={styles.bgEffects}>
        <div
          className={styles.orb1}
          style={{ background: "#10b981", right: "auto", left: "-200px" }}
        />
        <div
          className={styles.orb2}
          style={{ background: "#06b6d4", left: "auto", right: "-200px" }}
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
              borderColor: "rgba(16, 185, 129, 0.2)",
              color: "#34d399",
              background: "rgba(16, 185, 129, 0.1)",
            }}
          >
            <FiLayers /> Coming Soon
          </div>

          <h1 className={styles.title}>
            Welcome to{" "}
            <span
              className={styles.gradient}
              style={{
                backgroundImage: "linear-gradient(135deg, #10b981, #06b6d4)",
              }}
            >
              Product 3
            </span>
          </h1>

          <p className={styles.subtitle}>
            Next-gen analytics platform that turns data into actionable
            intelligence. Transform how you make decisions.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <FiTrendingUp
                className={styles.featureIcon}
                style={{ color: "#10b981" }}
              />
              <h3>Advanced Analytics</h3>
              <p>Deep insights powered by machine learning.</p>
            </div>
            <div className={styles.featureItem}>
              <FiPieChart
                className={styles.featureIcon}
                style={{ color: "#06b6d4" }}
              />
              <h3>Visual Dashboards</h3>
              <p>Beautiful, interactive data visualizations.</p>
            </div>
            <div className={styles.featureItem}>
              <FiGlobe
                className={styles.featureIcon}
                style={{ color: "#f59e0b" }}
              />
              <h3>Global Scale</h3>
              <p>Handle millions of data points effortlessly.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.ctaSection}
          >
            <p className={styles.notifyText}>
              Launching soon. Join the waitlist.
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

export default Product3Landing;
