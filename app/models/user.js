import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^01[3-9]\d{8}$/, // Bangladeshi phone number validation
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    password: {
      type: String,
      required: true,
      // In a real application, you should hash this password using bcrypt!
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); // Adds createdAt/updatedAt automatically

// Prevent model overwrite in Next.js hot reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
