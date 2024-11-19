import db from "@/app/lib/db.js";

// Regular expression to validate email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regular expression to validate Bangladeshi phone number (must start with 01 and contain 11 digits)
const phoneRegex = /^01[3-9]\d{8}$/;

export async function POST(req) {
  try {
    // Parse the request body
    const donor = await req.json();
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
      status,
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

    // Insert the donor data into the MySQL database
    const defaultStatus = "active";

    const [result] = await db.execute(
      "INSERT INTO donors (name, phone, email, city, address, gender, dob, bloodType, medicalHistory, lastDonationDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
        status || defaultStatus,
      ]
    );

    // Return a success response with the inserted donor's ID
    return new Response(
      JSON.stringify({
        message: "Donor added successfully",
        id: result.insertId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    // Extract query parameters (if any) for filtering, pagination, etc.
    const url = new URL(req.url);
    const bloodType = url.searchParams.get("bloodType");
    const city = url.searchParams.get("city");

    // Base query to fetch all donors
    let query = "SELECT * FROM donors";
    let values = [];

    // Apply filters if bloodType or city is provided
    if (bloodType || city) {
      const filters = [];
      if (bloodType) {
        filters.push("bloodType = ?");
        values.push(bloodType);
      }
      if (city) {
        filters.push("city = ?");
        values.push(city);
      }
      query += ` WHERE ${filters.join(" AND ")}`;
    }

    // Execute the query
    const [rows] = await db.execute(query, values);

    // Return the donor data
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch donor data" }),
      { status: 500 }
    );
  }
}
