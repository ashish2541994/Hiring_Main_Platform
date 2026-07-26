import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiHeart,
} from "react-icons/fi";
import styles from "./Footer.module.css";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/#products" },
  { name: "About", path: "/#about" },
  { name: "Contact", path: "/#contact" },
];

const socialLinks = [
  { icon: FiGithub, href: "#", label: "GitHub" },
  { icon: FiTwitter, href: "#", label: "Twitter" },
  { icon: FiLinkedin, href: "#", label: "LinkedIn" },
  { icon: FiInstagram, href: "#", label: "Instagram" },
];

const Footer = () => {
  const scrollToSection = (path) => {
    if (path === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const id = path.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandColumn}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <span>V</span>
              </div>
              <span className={styles.logoText}>VIDHI SOL</span>
            </Link>
            <p className={styles.brandDesc}>
              Building powerful solutions for the modern world. One account,
              endless possibilities.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.socialLink}
                  aria-label={social.label}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.path)}
                    className={styles.link}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className={styles.columnTitle}>Products</h4>
            <ul className={styles.linkList}>
              <li>
                <span className={styles.link}>Wind Hire</span>
              </li>
              <li>
                <span className={styles.linkDisabled}>P1 (Coming Soon)</span>
              </li>
              <li>
                <span className={styles.linkDisabled}>P2 (Coming Soon)</span>
              </li>
              <li>
                <span className={styles.linkDisabled}>P3 (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={styles.columnTitle}>Contact</h4>
            <ul className={styles.linkList}>
              <li>
                <span className={styles.link}>hello@vidhisol.com</span>
              </li>
              <li>
                <span className={styles.link}>+1 (555) 000-0000</span>
              </li>
              <li>
                <span className={styles.link}>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Vidhidhruv Solutions. All rights
            reserved.
          </p>
          <p className={styles.madeWith}>
            Made with <FiHeart className={styles.heartIcon} /> by Vidhi Sol Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
