import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiWind, FiBox, FiLayers, FiZap, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import styles from "./PlatformDashboard.module.css";

const products = [
  {
    id: "windhire",
    name: "Wind Hire",
    tagline: "AI Hiring Platform",
    description:
      "AI-powered recruitment platform that connects top talent with great companies.",
    status: "available",
    icon: FiWind,
    gradient: "linear-gradient(135deg, #6366f1, #a855f7)",
    path: "/products/windhire",
  },
  {
    id: "product2",
    name: "Product 2",
    tagline: "Coming Soon",
    description:
      "An innovative solution redefining how teams collaborate and build together.",
    status: "coming_soon",
    icon: FiBox,
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    path: "/products/product2",
  },
  {
    id: "product3",
    name: "Product 3",
    tagline: "Coming Soon",
    description:
      "Next-gen analytics platform that turns data into actionable intelligence.",
    status: "coming_soon",
    icon: FiLayers,
    gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
    path: "/products/product3",
  },
  {
    id: "product4",
    name: "Product 4",
    tagline: "Coming Soon",
    description:
      "Automation tools designed to streamline your business operations effortlessly.",
    status: "coming_soon",
    icon: FiZap,
    gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    path: "/products/product4",
  },
];

const PlatformDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOpenProduct = (product) => {
    if (product.status === "available" || product.status === "coming_soon") {
      navigate(product.path);
    }
  };

  return (
    <div className={styles.page}>
      {/* Animated Background */}
      <div className={styles.bgEffects}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgOrb3} />
      </div>

      <div className={styles.container}>
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={styles.welcomeBadge}
          >
            Welcome
          </motion.div>
          <h1 className={styles.heading}>
            Hello, {user?.firstName || "there"}!
          </h1>
          <p className={styles.subheading}>
            Welcome to the Vidhidhruv Solutions ecosystem. Explore our products
            and tools below.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className={styles.grid}>
          {products.map((product, index) => {
            const Icon = product.icon;
            const isAvailable = product.status === "available";

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className={styles.productCard}
                onClick={() => handleOpenProduct(product)}
              >
                {/* Gradient accent bar */}
                <div
                  className={styles.cardAccent}
                  style={{ background: product.gradient }}
                />

                <div className={styles.cardContent}>
                  {/* Icon */}
                  <motion.div
                    className={styles.iconWrapper}
                    style={{ background: product.gradient }}
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className={styles.icon} />
                  </motion.div>

                  {/* Name */}
                  <h3 className={styles.productName}>{product.name}</h3>

                  {/* Tagline */}
                  <p className={styles.productTagline}>{product.tagline}</p>

                  {/* Description */}
                  <p className={styles.productDesc}>{product.description}</p>

                  {/* Status & CTA */}
                  <div className={styles.cardFooter}>
                    <span
                      className={`${styles.statusBadge} ${isAvailable ? styles.statusAvailable : styles.statusComingSoon}`}
                    >
                      {isAvailable ? "Live" : "Coming Soon"}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.04, gap: "0.75rem" }}
                      whileTap={{ scale: 0.96 }}
                      className={styles.openBtn}
                    >
                      {isAvailable ? "Open" : "Explore"}
                      <FiArrowRight className={styles.arrowIcon} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlatformDashboard;
