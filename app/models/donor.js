import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    bloodType: { type: String, required: true },
    medicalHistory: { type: String },
    lastDonationDate: { type: Date },
    status: { type: String, default: "active" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
); // Adds createdAt/updatedAt automatically

// Prevent model overwrite in Next.js hot reload
const Donor = mongoose.models.Donor || mongoose.model("Donor", donorSchema);

export default Donor;
