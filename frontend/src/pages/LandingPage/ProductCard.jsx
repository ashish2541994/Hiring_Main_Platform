import { motion } from "framer-motion";
import { FiArrowRight, FiClock, FiCheck, FiLock } from "react-icons/fi";
import styles from "./ProductCard.module.css";

const statusConfig = {
  available: {
    icon: FiCheck,
    label: "Available",
    className: styles.statusAvailable,
  },
  coming_soon: {
    icon: FiClock,
    label: "Coming Soon",
    className: styles.statusComingSoon,
  },
};

const ProductCard = ({ product, index, onOpen }) => {
  const { name, description, status, icon: Icon } = product;
  const config = statusConfig[status] || statusConfig.coming_soon;
  const StatusIcon = config.icon;
  const isAvailable = status === "available";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className={styles.card}
      onClick={() => isAvailable && onOpen && onOpen()}
    >
      {/* Glow border effect */}
      <div className={styles.glowBorder} />

      <div className={styles.cardContent}>
        {/* Icon */}
        <motion.div
          className={styles.iconContainer}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          {Icon && <Icon className={styles.icon} />}
        </motion.div>

        {/* Name */}
        <h3 className={styles.name}>{name}</h3>

        {/* Description */}
        <p className={styles.description}>{description}</p>

        {/* Status Badge */}
        <div className={`${styles.statusBadge} ${config.className}`}>
          <StatusIcon className={styles.statusIcon} />
          <span>{config.label}</span>
        </div>

        {/* Action Button */}
        <div className={styles.actionWrapper}>
          {isAvailable ? (
            <motion.button
              whileHover={{ scale: 1.05, gap: "0.75rem" }}
              whileTap={{ scale: 0.95 }}
              className={styles.openBtn}
            >
              Open
              <FiArrowRight className={styles.openIcon} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={styles.disabledBtn}
              disabled
            >
              <FiLock className={styles.lockIcon} />
              Coming Soon
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
