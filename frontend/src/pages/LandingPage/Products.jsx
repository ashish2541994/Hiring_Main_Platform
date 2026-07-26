import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiWind, FiBox, FiLayers, FiZap } from "react-icons/fi";
import ProductCard from "./ProductCard";
import styles from "./Products.module.css";

const products = [
  {
    name: "Wind Hire",
    description: "AI Powered Hiring & Recruitment Platform",
    status: "available",
    icon: FiWind,
    path: "/products/windhire",
  },
  {
    name: "P1",
    description: "Coming Soon",
    status: "coming_soon",
    icon: FiBox,
    path: null,
  },
  {
    name: "P2",
    description: "Coming Soon",
    status: "coming_soon",
    icon: FiLayers,
    path: null,
  },
  {
    name: "P3",
    description: "Coming Soon",
    status: "coming_soon",
    icon: FiZap,
    path: null,
  },
];

const Products = () => {
  const navigate = useNavigate();

  const handleOpenProduct = (product) => {
    if (product.path) {
      navigate(product.path);
    }
  };

  return (
    <section id="products" className={styles.section}>
      {/* Section Background Effects */}
      <div className={styles.sectionBg}>
        <div className={styles.bgGlow1} />
        <div className={styles.bgGlow2} />
      </div>

      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <span className={styles.badge}>Products</span>
          <h2 className={styles.heading}>Our Solutions</h2>
          <p className={styles.subheading}>
            Powerful tools designed to transform your workflow and drive
            results.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className={styles.grid}>
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              product={product}
              index={index}
              onOpen={() => handleOpenProduct(product)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
