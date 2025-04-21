import dbConnect from "@/app/lib/db";
import User from "@/app/models/user"; // Assuming you have the User model
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

// Regular expression to validate Bangladeshi phone number (must start with 01 and contain 11 digits)
const phoneRegex = /^01[3-9]\d{8}$/;

export async function POST(req) {
  try {
    await dbConnect(); // Connect to MongoDB

    // Parse the request body
    const donorData = await req.json();
    const { name, phone, gender, bloodType, password } = donorData;

    // Validate required fields
    if (!name || !phone || !gender || !password || !bloodType) {
      return new NextResponse(
        JSON.stringify({ message: "All required fields must be provided" }),
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

    // Insert the donor data into the MongoDB users collection
    const newUser = new User({
      name,
      phone,
      gender,
      bloodType,
      password, // In a real app, hash this!
    });

    const savedUser = await newUser.save();

    // Return a success response with the inserted donor's ID (_id in MongoDB)
    return new NextResponse(
      JSON.stringify({
        message: "Donor added successfully",
        id: savedUser._id.toString(),
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding donor:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect(); // Connect to MongoDB

    // Extract the token from the request headers
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Authorization token is missing" }),
        { status: 401 }
      );
    }

    // Verify and decode the token to get the user ID
    if (!JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set.");
      return new NextResponse(
        JSON.stringify({ message: "Internal server error" }),
        { status: 500 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded?.id;

      if (!userId) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid token or user ID missing" }),
          { status: 401 }
        );
      }

      // Fetch user details from the database based on userId (_id in MongoDB)
      const user = await User.findById(userId);

      if (!user) {
        return new NextResponse(JSON.stringify({ message: "User not found" }), {
          status: 404,
        });
      }

      // Return the user details
      const { password, ...userData } = user.toObject(); // Exclude password from the response
      return new NextResponse(JSON.stringify(userData), { status: 200 });
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError.message);
      return new NextResponse(
        JSON.stringify({ message: "Invalid authorization token" }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Failed to fetch user details",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
