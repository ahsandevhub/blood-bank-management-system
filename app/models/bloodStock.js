import mongoose from "mongoose";

const bloodStockSchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
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
const BloodStock =
  mongoose.models.BloodStock || mongoose.model("BloodStock", bloodStockSchema);

export default BloodStock;
