import dbConnect from "@/app/lib/db";
import Donor from "@/app/models/donor"; // Assuming you have the Donor model
import { NextResponse } from "next/server";

// Handle GET request for donor details
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await dbConnect(); // Connect to MongoDB

    const donor = await Donor.findById(id);

    if (!donor) {
      return new NextResponse(JSON.stringify({ error: "Donor not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(donor, { status: 200 });
  } catch (error) {
    console.error("Error fetching donor details:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

// Regular expression to validate email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regular expression to validate Bangladeshi phone number (must start with 01 and contain 11 digits)
const phoneRegex = /^01[3-9]\d{8}$/;

export async function PUT(req, { params }) {
  try {
    await dbConnect(); // Connect to MongoDB

    // Parse the request body
    const donorData = await req.json();
    const { id } = params; // Get the donor ID from the URL parameters
    const {
      name,
      phone,
      email,
      city,
      address,
      gender,
      dob,
      bloodType,
      medicalHistory,
      lastDonationDate,
    } = donorData;

    // Validate required fields
    if (
      !name ||
      !phone ||
      !email ||
      !city ||
      !address ||
      !gender ||
      !dob ||
      !bloodType
    ) {
      return new NextResponse(
        JSON.stringify({ message: "All required fields must be provided" }),
        { status: 400 }
      );
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid email format" }),
        {
          status: 400,
        }
      );
    }

    // Validate DOB (18+ years old)
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      return new NextResponse(
        JSON.stringify({ message: "Donor must be at least 18 years old" }),
        { status: 400 }
      );
    }

    // Validate phone number format (Bangladeshi phone number)
    if (!phoneRegex.test(phone)) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Invalid phone number. It must start with '01' and contain 11 digits.",
        }),
        { status: 400 }
      );
    }

    // Determine donor status based on last donation date
    let status = "active"; // Default status is active
    if (lastDonationDate) {
      const lastDonation = new Date(lastDonationDate);
      const diffTime = today - lastDonation;
      const diffDays = diffTime / (1000 * 3600 * 24); // Convert milliseconds to days

      // If last donation was within 120 days, mark donor as inactive
      if (diffDays <= 120) {
        status = "inactive";
      }
    }

    // Update the donor data in MongoDB
    const updatedDonor = await Donor.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        email,
        city,
        address,
        gender,
        dob,
        bloodType,
        medicalHistory,
        lastDonationDate,
        status,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true } // runValidators ensures schema validations are applied
    );

    // Check if the donor exists
    if (!updatedDonor) {
      return new NextResponse(JSON.stringify({ message: "Donor not found" }), {
        status: 404,
      });
    }

    // Return a success response with the updated donor data
    return new NextResponse(
      JSON.stringify({
        message: "Donor updated successfully",
        data: updatedDonor,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating donor:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// Handle DELETE request to remove a donor
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await dbConnect(); // Connect to MongoDB

    // Delete the donor record from MongoDB
    const deletedDonor = await Donor.findByIdAndDelete(id);

    // Check if the record was deleted
    if (!deletedDonor) {
      return new NextResponse(JSON.stringify({ error: "Donor not found" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Donor deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting donor:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
