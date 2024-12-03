import db from "@/app/lib/db.js";
import jwt from "jsonwebtoken";

// Regular expression to validate Bangladeshi phone number (must start with 01 and contain 11 digits)
const phoneRegex = /^01[3-9]\d{8}$/;

export async function POST(req) {
  try {
    // Parse the request body
    const donor = await req.json();
    const { name, phone, gender, bloodType, password } = donor;

    // Validate required fields
    if (!name || !phone || !gender || !password || !bloodType) {
      return new Response(
        JSON.stringify({ message: "All required fields must be provided" }),
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
    const [result] = await db.execute(
      "INSERT INTO users (fullName, phone, sex, bloodGroup, password) VALUES (?, ?, ?, ?, ?)",
      [name, phone, gender, bloodType, password]
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
    // Extract the token from the request headers
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return new Response(
        JSON.stringify({ message: "Authorization token is missing" }),
        { status: 401 }
      );
    }

    // Verify and decode the token to get the user ID
    const secretKey = process.env.JWT_SECRET; // Ensure this is set in your environment variables
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded?.id;

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "Invalid token or user ID missing" }),
        { status: 401 }
      );
    }

    // Fetch user details from the database based on userId
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.execute(query, [userId]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Return the user details
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return new Response(
      JSON.stringify({ message: "Failed to fetch user details" }),
      { status: 500 }
    );
  }
}
