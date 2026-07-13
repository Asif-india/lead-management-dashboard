/**
 * Form Animation Constants
 *
 * Reusable Framer Motion animation variants for form components.
 */

/**
 * Container animation variant for form fade-in
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

/**
 * Item animation variant for individual elements
 */
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
