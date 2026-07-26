import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiWind,
  FiCheck,
  FiUsers,
  FiBriefcase,
  FiZap,
  FiShield,
  FiBarChart2,
  FiArrowRight,
  FiStar,
  FiDollarSign,
  FiHeadphones,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import styles from "./WindHireLandingPage.module.css";

const features = [
  {
    icon: FiZap,
    title: "AI-Powered Matching",
    description:
      "Our advanced AI algorithms match candidates to the perfect roles with 95% accuracy.",
  },
  {
    icon: FiUsers,
    title: "Smart Candidate Sourcing",
    description:
      "Automatically source and rank candidates from thousands of profiles.",
  },
  {
    icon: FiBarChart2,
    title: "Analytics Dashboard",
    description:
      "Real-time insights into your hiring pipeline and recruitment metrics.",
  },
  {
    icon: FiShield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption and compliance with global data protection standards.",
  },
  {
    icon: FiBriefcase,
    title: "Seamless Workflow",
    description:
      "From job posting to offer letter, manage your entire hiring workflow.",
  },
  {
    icon: FiStar,
    title: "Candidate Experience",
    description:
      "Beautiful, mobile-friendly application experience that candidates love.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Up to 3 active jobs",
      "Basic candidate matching",
      "Email support",
      "Standard analytics",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing teams",
    features: [
      "Up to 20 active jobs",
      "AI-powered matching",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large organizations",
    features: [
      "Unlimited active jobs",
      "Advanced AI matching",
      "Dedicated account manager",
      "Custom integrations",
      "SSO & SAML",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "HR Director, TechCorp",
    avatar: "SJ",
    text: "Wind Hire transformed our recruitment process. We cut our time-to-hire by 60%.",
    rating: 5,
  },
  {
    name: "Marcus Chen",
    role: "CEO, StartUp Inc",
    avatar: "MC",
    text: "The AI matching is incredible. We found our best engineers through Wind Hire.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Talent Lead, InnovateCo",
    avatar: "PP",
    text: "Best hiring platform we've used. The analytics give us invaluable insights.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "How does the AI matching work?",
    a: "Our AI analyzes job descriptions, candidate profiles, and historical hiring data to find the best matches.",
  },
  {
    q: "Can I customize the hiring workflow?",
    a: "Yes, you can fully customize your hiring stages, assessment criteria, and communication templates.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use bank-grade encryption and comply with GDPR, CCPA, and SOC 2 standards.",
  },
  {
    q: "What kind of support do you offer?",
    a: "All plans include email support. Professional plans get priority support, Enterprise gets a dedicated account manager.",
  },
];

const WindHireLandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link to="/products/windhire" className={styles.navLogo}>
            <div className={styles.logoIcon}>
              <FiWind />
            </div>
            <span className={styles.logoText}>Wind Hire</span>
          </Link>
          <div className={styles.navLinks}>
            <button onClick={() => scrollToSection("features")}>
              Features
            </button>
            <button onClick={() => scrollToSection("pricing")}>Pricing</button>
            <button onClick={() => scrollToSection("faqs")}>FAQs</button>
          </div>
          <div className={styles.navActions}>
            {isAuthenticated ? (
              <Link
                to="/products/windhire/dashboard"
                className={styles.dashboardBtn}
              >
                Go to Dashboard
                <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/login" className={styles.signInBtn}>
                  Sign In
                </Link>
                <Link to="/register" className={styles.getStartedBtn}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBgEffects}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
        </div>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.heroBadge}
          >
            <FiWind /> AI-Powered Hiring Platform
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.heroTitle}
          >
            Hire Smarter.
            <br />
            <span className={styles.heroGradient}>Build Faster.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.heroDesc}
          >
            The AI-powered recruitment platform that helps you find, evaluate,
            and hire the best talent in record time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={styles.heroButtons}
          >
            <Link
              to={
                isAuthenticated ? "/products/windhire/dashboard" : "/register"
              }
              className={styles.heroPrimaryBtn}
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Hiring Free"}
              <FiArrowRight />
            </Link>
            <button
              onClick={() => scrollToSection("features")}
              className={styles.heroSecondaryBtn}
            >
              Explore Features
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          {[
            { value: "10K+", label: "Companies" },
            { value: "100K+", label: "Jobs Posted" },
            { value: "1M+", label: "Candidates" },
            { value: "95%", label: "Satisfaction" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={styles.statItem}
            >
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionBadge}>Features</span>
            <h2 className={styles.sectionTitle}>Everything You Need to Hire</h2>
            <p className={styles.sectionDesc}>
              Powerful tools and AI-driven insights to streamline your
              recruitment process.
            </p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={styles.featureCard}
              >
                <div className={styles.featureIcon}>
                  <feature.icon />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricingSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionBadge}>Pricing</span>
            <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
            <p className={styles.sectionDesc}>
              Choose the plan that fits your team. No hidden fees.
            </p>
          </motion.div>

          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${styles.pricingCard} ${plan.popular ? styles.pricingCardPopular : ""}`}
              >
                {plan.popular && (
                  <div className={styles.popularBadge}>Most Popular</div>
                )}
                <h3 className={styles.pricingName}>{plan.name}</h3>
                <div className={styles.pricingPrice}>
                  <span className={styles.priceAmount}>{plan.price}</span>
                  <span className={styles.pricePeriod}>{plan.period}</span>
                </div>
                <p className={styles.pricingDesc}>{plan.description}</p>
                <ul className={styles.pricingFeatures}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.pricingFeature}>
                      <FiCheck /> {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={
                    isAuthenticated
                      ? "/products/windhire/dashboard"
                      : "/register"
                  }
                  className={`${styles.pricingCta} ${plan.popular ? styles.pricingCtaPopular : ""}`}
                >
                  {plan.cta}
                  <FiArrowRight />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionBadge}>Testimonials</span>
            <h2 className={styles.sectionTitle}>Loved by Teams Worldwide</h2>
          </motion.div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={styles.testimonialCard}
              >
                <div className={styles.testimonialStars}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} className={styles.starFilled} />
                  ))}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.avatar}</div>
                  <div>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialRole}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className={styles.faqsSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionBadge}>FAQs</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </motion.div>

          <div className={styles.faqsList}>
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={styles.faqItem}
              >
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.ctaTitle}>Ready to Transform Your Hiring?</h2>
            <p className={styles.ctaDesc}>
              Join thousands of companies using Wind Hire to build their dream
              teams.
            </p>
            <Link
              to={
                isAuthenticated ? "/products/windhire/dashboard" : "/register"
              }
              className={styles.ctaBtn}
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Hiring Free"}
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <div className={styles.logoIcon}>
              <FiWind />
            </div>
            <span className={styles.logoText}>Wind Hire</span>
            <p className={styles.footerDesc}>
              Part of Vidhidhruv Solutions ecosystem.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <Link to="/">Vidhidhruv Home</Link>
            <Link to="/dashboard">Platform Dashboard</Link>
            <Link to="/products/windhire">Wind Hire</Link>
          </div>
          <p className={styles.footerCopy}>
            &copy; {new Date().getFullYear()} Wind Hire. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WindHireLandingPage;
