import db from "@/app/lib/db.js";
import { NextResponse } from "next/server";

// Handle GET request for donor details
export async function GET(req, { params }) {
  const { id } = params;

  try {
    const [rows] = await db.query("SELECT * FROM donors WHERE id = ?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Donor not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching donor details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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
    // Parse the request body
    const donor = await req.json();
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
    } = donor;

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
      return new Response(
        JSON.stringify({ message: "All required fields must be provided" }),
        { status: 400 }
      );
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: "Invalid email format" }), {
        status: 400,
      });
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
      return new Response(
        JSON.stringify({ message: "Donor must be at least 18 years old" }),
        { status: 400 }
      );
    }

    // Validate phone number format (Bangladeshi phone number)
    if (!phoneRegex.test(phone)) {
      return new Response(
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

    // Update the donor data in the MySQL database
    const [result] = await db.execute(
      "UPDATE donors SET name = ?, phone = ?, email = ?, city = ?, address = ?, gender = ?, dob = ?, bloodType = ?, medicalHistory = ?, lastDonationDate = ?, status = ? WHERE id = ?",
      [
        name,
        phone,
        email,
        city,
        address,
        gender,
        dob,
        bloodType,
        medicalHistory || null,
        lastDonationDate || null,
        status,
        id, // Donor ID to update
      ]
    );

    // Check if the donor exists (no rows affected means donor not found)
    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: "Donor not found" }), {
        status: 404,
      });
    }

    // Return a success response with a message
    return new Response(
      JSON.stringify({ message: "Donor updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// Handle DELETE request to remove a donor
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Delete the donor record from the database
    const [result] = await db.query("DELETE FROM donors WHERE id = ?", [id]);

    // Check if the record was deleted
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Donor not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Donor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting donor:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
