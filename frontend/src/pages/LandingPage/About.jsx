import { motion } from "framer-motion";
import {
  FiShield,
  FiZap,
  FiUsers,
  FiTrendingUp,
  FiGlobe,
  FiHeart,
} from "react-icons/fi";
import styles from "./About.module.css";

const features = [
  {
    icon: FiShield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption and security protocols to keep your data safe and compliant.",
  },
  {
    icon: FiZap,
    title: "Lightning Fast",
    description:
      "Optimized performance with sub-second response times for a seamless experience.",
  },
  {
    icon: FiUsers,
    title: "Unified Platform",
    description:
      "One account to access all our solutions. No more juggling multiple logins.",
  },
  {
    icon: FiTrendingUp,
    title: "AI-Powered",
    description:
      "Leverage cutting-edge artificial intelligence to automate and enhance your workflows.",
  },
  {
    icon: FiGlobe,
    title: "Global Scale",
    description:
      "Built for teams of all sizes, from startups to enterprises across the globe.",
  },
  {
    icon: FiHeart,
    title: "24/7 Support",
    description:
      "Dedicated support team available around the clock to help you succeed.",
  },
];

const About = () => {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <span className={styles.badge}>Why Us</span>
          <h2 className={styles.heading}>Why Vidhidhruv Solutions</h2>
          <p className={styles.subheading}>
            We combine technology, design, and innovation to deliver solutions
            that make a real difference.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
              className={styles.featureCard}
            >
              <div className={styles.iconWrapper}>
                <feature.icon className={styles.featureIcon} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={styles.statsContainer}
        >
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <span className={styles.statValue}>99.9%</span>
              <span className={styles.statLabel}>Uptime</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>10K+</span>
              <span className={styles.statLabel}>Active Users</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>50+</span>
              <span className={styles.statLabel}>Team Members</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>24/7</span>
              <span className={styles.statLabel}>Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
