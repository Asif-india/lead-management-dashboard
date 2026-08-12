/**
 * Transaction Helper
 * Provides graceful fallback for MongoDB transactions
 * If replica set is unavailable, operations proceed without transactions
 */

import mongoose from 'mongoose';

/**
 * Check if MongoDB transactions are available (replica set)
 * @returns {Promise<boolean>} True if transactions are available
 */
export const isTransactionAvailable = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return false;
    }

    const adminDb = mongoose.connection.db.admin();
    const serverStatus = await adminDb.serverStatus();

    return !!serverStatus.repl;
  } catch (error) {
    console.warn('Could not verify transaction availability:', error.message);
    return false;
  }
};

/**
 * Execute operation with transaction if available, fallback to non-transactional
 * @param {Function} operation - Async function to execute
 * @param {Object} options - Options
 * @param {boolean} options.requireTransaction - Fail if transaction not available
 * @returns {Promise<any>} Operation result
 */
export const withTransaction = async (operation, options = {}) => {
  const { requireTransaction = false } = options;

  const transactionsAvailable = await isTransactionAvailable();

  if (!transactionsAvailable) {
    if (requireTransaction) {
      throw new Error('Transactions are required but not available. MongoDB replica set is required for transactions.');
    }

    console.warn('⚠️  Transactions unavailable - proceeding without transaction');
    // Execute without transaction
    return await operation(null);
  }

  // Execute with transaction
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Execute operation on a specific model with transaction support
 * @param {mongoose.Model} model - Mongoose model
 * @param {Function} operation - Async function to execute with session
 * @param {Object} options - Options
 * @returns {Promise<any>} Operation result
 */
export const withModelTransaction = async (model, operation, options = {}) => {
  const { requireTransaction = false } = options;

  const transactionsAvailable = await isTransactionAvailable();

  if (!transactionsAvailable) {
    if (requireTransaction) {
      throw new Error('Transactions are required but not available. MongoDB replica set is required for transactions.');
    }

    console.warn('⚠️  Transactions unavailable - proceeding without transaction');
    return await operation(null);
  }

  const session = await model.startSession();

  try {
    session.startTransaction();
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
