/**
 * Async Handler Utility
 * Wraps async route handlers to catch errors and pass them to error middleware
 * Eliminates need for try-catch blocks in controllers
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
