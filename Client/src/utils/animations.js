/**
 * Premium Animation Configurations
 * 
 * Reusable animation variants and presets for consistent motion design
 * across the entire application.
 */

// Easing functions for premium feel
export const easings = {
  // Smooth and bouncy
  smooth: [0.25, 0.46, 0.45, 0.94],
  // Quick and responsive
  snappy: [0.25, 0.46, 0.45, 0.94],
  // Gentle and slow
  gentle: [0.25, 0.46, 0.45, 0.94],
  // Elastic bounce
  elastic: [0.68, -0.55, 0.265, 1.55],
  // Sharp and quick
  sharp: [0.25, 0.46, 0.45, 0.94]
}

// Duration presets
export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.4,
  slower: 0.5,
  slowest: 0.6
}

// Spring configurations
export const springs = {
  // Gentle spring for UI elements
  gentle: {
    type: "spring",
    stiffness: 300,
    damping: 24
  },
  // Bouncy spring for interactions
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 17
  },
  // Stiff spring for precise movements
  stiff: {
    type: "spring",
    stiffness: 500,
    damping: 15
  },
  // Very soft spring for smooth transitions
  soft: {
    type: "spring",
    stiffness: 200,
    damping: 30
  }
}

// Container variants for page layouts
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: durations.normal,
      ease: easings.smooth
    }
  }
}

// Item variants for list/grid items
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
      ...springs.gentle,
      duration: durations.slow
    }
  }
}

// Card variants for hoverable cards
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
      ...springs.bouncy,
      duration: durations.slower
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      ...springs.stiff,
      duration: durations.fast
    }
  }
}

// Modal variants for dialogs
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...springs.gentle,
      duration: durations.normal
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: durations.fast,
      ease: easings.smooth
    }
  }
}

// Dropdown variants for menus
export const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -15,
    scale: 0.95,
    transition: {
      duration: durations.fast,
      ease: easings.smooth
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.95,
    transition: {
      duration: durations.fast,
      ease: easings.smooth
    }
  }
}

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: easings.smooth,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.98,
    transition: {
      duration: durations.normal,
      ease: easings.smooth
    }
  }
}

// Sidebar variants
export const sidebarVariants = {
  expanded: {
    width: '280px',
    transition: {
      duration: durations.slow,
      ease: easings.smooth
    }
  },
  collapsed: {
    width: '80px',
    transition: {
      duration: durations.slow,
      ease: easings.smooth
    }
  },
  mobile: {
    x: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth
    }
  }
}

// Table row variants
export const tableRowVariants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      ...springs.gentle,
      duration: durations.fast
    }
  },
  hover: {
    x: 5,
    transition: {
      ...springs.stiff,
      duration: durations.fast
    }
  }
}

// Button variants
export const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      ...springs.stiff,
      duration: durations.fast
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: durations.fast
    }
  }
}

// Loading variants
export const loadingVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: durations.normal,
      ease: easings.smooth
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: durations.fast,
      ease: easings.smooth
    }
  }
}

// Chart variants
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
      ...springs.soft,
      duration: durations.slowest
    }
  }
}

// Notification variants
export const notificationVariants = {
  hidden: { 
    opacity: 0, 
    y: -50,
    scale: 0.3
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      ...springs.bouncy,
      duration: durations.normal
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.3,
    transition: {
      duration: durations.fast,
      ease: easings.smooth
    }
  }
}

// Preset animation hooks for common use cases
export const usePageTransition = () => ({
  initial: "initial",
  animate: "animate",
  exit: "exit",
  variants: pageVariants
})

export const useCardAnimation = () => ({
  whileHover: "hover",
  variants: cardVariants
})

export const useModalAnimation = () => ({
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: modalVariants
})

export const useDropdownAnimation = () => ({
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: dropdownVariants
})

// Utility function to create custom variants
export const createCustomVariant = (customConfig) => ({
  hidden: { opacity: 0, ...customConfig.hidden },
  visible: { 
    opacity: 1, 
    ...customConfig.visible,
    transition: {
      ...springs.gentle,
      ...customConfig.transition
    }
  }
})

// Stagger children animation helper
export const staggerContainer = (staggerTime = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerTime,
      delayChildren: 0.1
    }
  }
})
