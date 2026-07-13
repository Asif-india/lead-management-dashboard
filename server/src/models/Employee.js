/**
 * Employee Model
 * Represents an employee in the system
 */

import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },

    // Job Information
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Legal'],
        message: 'Please select a valid department',
      },
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },

    // Location Information
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true,
    },

    // Employment Details
    dateOfJoining: {
      type: Date,
      required: [true, 'Date of joining is required'],
    },
    employmentStatus: {
      type: String,
      enum: ['active', 'inactive', 'on-leave', 'terminated'],
      default: 'active',
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
    },

    // Profile Information
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    skills: [{
      type: String,
      trim: true,
    }],

    // User Account Reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ employmentStatus: 1 });
employeeSchema.index({ managerId: 1 });

// Virtual for full name
employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for years of service
employeeSchema.virtual('yearsOfService').get(function () {
  if (!this.dateOfJoining) return 0;
  const diffTime = Math.abs(new Date() - this.dateOfJoining);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 365);
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
