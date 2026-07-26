import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  slideLeft: {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  slideRight: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  scale: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  scaleIn: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
}

const AnimatedWrapper = ({
  children,
  variant = 'fade',
  delay = 0,
  duration = 0.3,
  className,
  as: Component = 'div',
  ...props
}) => {
  const motionVariants = variants[variant] || variants.fade

  return (
    <motion.div
      as={Component}
      initial="hidden"
      animate="visible"
      variants={motionVariants}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

const StaggeredChildren = ({ children, staggerDelay = 0.1, className }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const AnimatedItem = ({ children, className }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const PageTransition = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const HoverLift = ({ children, className, liftAmount = 4 }) => {
  return (
    <motion.div
      whileHover={{ y: -liftAmount }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const HoverScale = ({ children, className, scale = 1.02 }) => {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const PressScale = ({ children, className, scale = 0.95 }) => {
  return (
    <motion.div
      whileTap={{ scale }}
      transition={{ duration: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export {
  AnimatedWrapper,
  StaggeredChildren,
  AnimatedItem,
  PageTransition,
  HoverLift,
  HoverScale,
  PressScale,
}
