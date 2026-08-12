/**
 * Data Migration Script
 * Safely links existing User and Employee documents
 * Sets accountStatus for existing Users
 * 
 * Run with: node server/scripts/migrateUserEmployeeLinks.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Employee from '../src/models/Employee.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saas-lead-management';

/**
 * Migration: Link User and Employee documents
 */
const migrateUserEmployeeLinks = async () => {
  try {
    console.log('🔄 Starting User-Employee link migration...\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Step 1: Find Employees without userId
    const employeesWithoutUser = await Employee.find({ userId: { $exists: false } });
    console.log(`📊 Found ${employeesWithoutUser.length} Employees without userId`);
    
    // Step 2: Find Users without employeeId
    const usersWithoutEmployee = await User.find({ employeeId: { $exists: false } });
    console.log(`📊 Found ${usersWithoutEmployee.length} Users without employeeId\n`);
    
    let linkedCount = 0;
    let userStatusUpdatedCount = 0;
    let skippedCount = 0;
    
    // Step 3: Link Employees to Users by email
    for (const employee of employeesWithoutUser) {
      try {
        // Find User by email (assuming email was duplicated in Employee before)
        // If email doesn't exist in Employee, try to match by firstName + lastName
        let user;
        
        if (employee.email) {
          user = await User.findOne({ email: employee.email });
        }
        
        if (!user) {
          // Try to match by name
          user = await User.findOne({
            firstName: employee.firstName,
            lastName: employee.lastName
          });
        }
        
        if (user) {
          // Link Employee to User
          employee.userId = user._id;
          await employee.save();
          
          // Link User to Employee if not already linked
          if (!user.employeeId) {
            user.employeeId = employee._id;
            await user.save();
          }
          
          linkedCount++;
          console.log(`✅ Linked Employee ${employee.employeeId} to User ${user.email}`);
        } else {
          skippedCount++;
          console.log(`⚠️  No matching User found for Employee ${employee.employeeId}`);
        }
      } catch (error) {
        console.error(`❌ Error linking Employee ${employee.employeeId}:`, error.message);
      }
    }
    
    // Step 4: Set accountStatus for existing Users
    const usersWithoutStatus = await User.find({ accountStatus: { $exists: false } });
    console.log(`\n📊 Found ${usersWithoutStatus.length} Users without accountStatus`);
    
    for (const user of usersWithoutStatus) {
      try {
        // Set accountStatus based on isActive
        user.accountStatus = user.isActive ? 'active' : 'inactive';
        await user.save();
        userStatusUpdatedCount++;
        console.log(`✅ Set accountStatus for User ${user.email}: ${user.accountStatus}`);
      } catch (error) {
        console.error(`❌ Error setting accountStatus for User ${user.email}:`, error.message);
      }
    }
    
    // Step 5: Report orphaned records
    const orphanedEmployees = await Employee.find({ userId: { $exists: false } });
    const orphanedUsers = await User.find({ employeeId: { $exists: false }, role: { $ne: 'administrator' } }); // Exclude admin
    
    console.log('\n📊 Migration Summary:');
    console.log(`   - Linked records: ${linkedCount}`);
    console.log(`   - User status updated: ${userStatusUpdatedCount}`);
    console.log(`   - Skipped (no match): ${skippedCount}`);
    console.log(`   - Orphaned Employees: ${orphanedEmployees.length}`);
    console.log(`   - Orphaned Users (non-admin): ${orphanedUsers.length}`);
    
    if (orphanedEmployees.length > 0) {
      console.log('\n⚠️  Orphaned Employees (no User linked):');
      orphanedEmployees.forEach(emp => {
        console.log(`   - ${emp.employeeId}: ${emp.firstName} ${emp.lastName}`);
      });
    }
    
    if (orphanedUsers.length > 0) {
      console.log('\n⚠️  Orphaned Users (no Employee linked):');
      orphanedUsers.forEach(user => {
        console.log(`   - ${user.email}: ${user.firstName} ${user.lastName}`);
      });
    }
    
    console.log('\n✅ Migration completed successfully');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run migration
migrateUserEmployeeLinks();
