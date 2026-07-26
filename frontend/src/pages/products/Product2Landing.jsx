import { motion } from "framer-motion";
import {
  FiBox,
  FiArrowRight,
  FiMail,
  FiBell,
  FiBarChart2,
} from "react-icons/fi";
import styles from "./ProductLanding.module.css";

const Product2Landing = () => {
  return (
    <div className={styles.page}>
      <div className={styles.bgEffects}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.content}
        >
          <div className={styles.badge}>
            <FiBox /> Coming Soon
          </div>

          <h1 className={styles.title}>
            Welcome to <span className={styles.gradient}>Product 2</span>
          </h1>

          <p className={styles.subtitle}>
            An innovative solution redefining how teams collaborate and build
            together. We're working on something amazing.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <FiBarChart2 className={styles.featureIcon} />
              <h3>Real-time Collaboration</h3>
              <p>Work together seamlessly with your team.</p>
            </div>
            <div className={styles.featureItem}>
              <FiBell className={styles.featureIcon} />
              <h3>Smart Notifications</h3>
              <p>Stay updated with intelligent alerts.</p>
            </div>
            <div className={styles.featureItem}>
              <FiMail className={styles.featureIcon} />
              <h3>Integrated Communication</h3>
              <p>Built-in messaging and updates.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.ctaSection}
          >
            <p className={styles.notifyText}>
              Be the first to know when we launch.
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

export default Product2Landing;
