import dbConnect from "@/app/lib/db";
import Donor from "@/app/models/donor"; // Adjust the import path as necessary
import { NextResponse } from "next/server";

// Regular expressions (same as before)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^01[3-9]\d{8}$/;

export async function POST(req) {
  try {
    await dbConnect();
    const donorData = await req.json();

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

    // Validation (same as before)
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
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Age validation
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 18) {
      return NextResponse.json(
        { message: "Donor must be at least 18 years old" },
        { status: 400 }
      );
    }

    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        {
          message:
            "Invalid phone number. Must start with '01' and contain 11 digits",
        },
        { status: 400 }
      );
    }

    // Determine status
    let status = "active";
    if (lastDonationDate) {
      const lastDonation = new Date(lastDonationDate);
      const diffDays = (today - lastDonation) / (1000 * 3600 * 24);
      if (diffDays <= 120) status = "inactive";
    }

    // Create donor in MongoDB
    const donor = await Donor.create({
      name,
      phone,
      email,
      city,
      address,
      gender,
      dob,
      bloodType,
      medicalHistory: medicalHistory || null,
      lastDonationDate: lastDonationDate || null,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Donor added successfully",
        id: donor._id, // MongoDB uses _id instead of insertId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const bloodType = url.searchParams.get("bloodType");
    const city = url.searchParams.get("city");

    // Build query object
    const query = {};
    if (bloodType) query.bloodType = bloodType;
    if (city) query.city = city;

    const donors = await Donor.find(query);

    return NextResponse.json(donors, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch donor data" },
      { status: 500 }
    );
  }
}
