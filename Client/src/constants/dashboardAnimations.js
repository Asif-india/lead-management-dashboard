/**
 * Dashboard Animation Variants
 *
 * Framer Motion animation variants for dashboard components.
 * Extracted from SaasDashboard.jsx for better maintainability.
 */

// Container Animation Variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Item Animation Variants
export const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      duration: 0.6
    }
  }
}

// Card Animation Variants
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      duration: 0.8
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15
    }
  }
}

// Chart Animation Variants
export const chartVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotateY: -15
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 1
    }
  }
}
