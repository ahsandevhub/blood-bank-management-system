import mongoose from "mongoose";

const bloodStockInSchema = new mongoose.Schema(
  {
    bloodGroup: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
); // Adds createdAt/updatedAt automatically

// Prevent model overwrite in Next.js hot reload
const BloodStockIn =
  mongoose.models.BloodStockIn ||
  mongoose.model("BloodStockIn", bloodStockInSchema);

export default BloodStockIn;
