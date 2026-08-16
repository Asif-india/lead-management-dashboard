/**
 * Migration Script: Populate incentiveDate from createdAt
 * 
 * This script migrates existing Incentive documents to populate the new incentiveDate field
 * with the value from createdAt for records where incentiveDate is missing.
 * 
 * Run this script once after adding the incentiveDate field to the schema.
 * 
 * Usage: node src/migrations/migrateIncentiveDate.js
 */

import mongoose from 'mongoose';
import Incentive from '../models/Incentive.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateIncentiveDate = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find all incentives without incentiveDate
    const incentivesWithoutDate = await Incentive.find({ incentiveDate: { $exists: false } });

    console.log(`Found ${incentivesWithoutDate.length} incentives without incentiveDate`);

    if (incentivesWithoutDate.length === 0) {
      console.log('No migration needed. All incentives already have incentiveDate.');
      process.exit(0);
    }

    // Update each incentive
    let updatedCount = 0;
    for (const incentive of incentivesWithoutDate) {
      incentive.incentiveDate = incentive.createdAt;
      await incentive.save();
      updatedCount++;
      console.log(`Updated incentive ${incentive._id}: incentiveDate set to ${incentive.createdAt}`);
    }

    console.log(`Migration completed. Updated ${updatedCount} incentives.`);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

migrateIncentiveDate();
