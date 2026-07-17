import mongoose from "mongoose";
import { LEAD_STATUS, LEAD_PRIORITY } from "../constants/index.js";

const leadSchema = new mongoose.Schema(
  {
    // Employee Information
    employeeName: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      maxlength: [100, "Employee name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      trim: true,
      unique: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      enum: {
        values: [
          "Engineering",
          "Marketing",
          "Sales",
          "HR",
          "Finance",
          "Operations",
          "IT",
          "Legal",
        ],
        message: "Please select a valid department",
      },
    },

    // Location Information
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    zipCode: {
      type: String,
      required: [true, "Zip code is required"],
      trim: true,
    },

    // Student Information
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [100, "Student name cannot exceed 100 characters"],
    },

    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },

    university: {
      type: String,
      required: [true, "University is required"],
      trim: true,
    },

    studentEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    studentPhone: {
      type: String,
      trim: true,
      default: "",
    },

    studentAge: {
      type: Number,
      default: null,
    },

    collegeType: {
      type: String,
      trim: true,
      default: "",
    },

    graduationYear: {
      type: Number,
      default: null,
    },

    // Lead Status and Priority
    leadStatus: {
      type: String,
      enum: Object.values(LEAD_STATUS),
      default: LEAD_STATUS.NEW,
    },

    priority: {
      type: String,
      enum: Object.values(LEAD_PRIORITY),
      default: LEAD_PRIORITY.MEDIUM,
    },

    // Additional Information
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },

    source: {
      type: String,
      trim: true,
      default: "",
    },

    // Tracking
    assignedTo: {
      type: String,
      default: "",
    },

    followUpDate: {
      type: Date,
    },

    lastContactDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
leadSchema.index({ leadStatus: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ department: 1 });
leadSchema.index({ createdAt: -1 });

// Virtual
leadSchema.virtual("leadAge").get(function () {
  if (!this.createdAt) return 0;

  const diffTime = Math.abs(new Date() - this.createdAt);

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre Save Middleware
leadSchema.pre("save", function (next) {
  if (
    this.isModified("leadStatus") &&
    this.leadStatus === "contacted"
  ) {
    this.lastContactDate = new Date();
  }

  next();
});

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
