import dbConnect from "@/app/lib/db";
import User from "@/app/models/user"; // Assuming you have a User model
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req) {
  try {
    await dbConnect(); // Connect to MongoDB

    // Parse the request body
    const { phone, password } = await req.json();

    // Validate required fields
    if (!phone || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Phone and password are required" }),
        { status: 400 }
      );
    }

    // Query the database for the user
    const user = await User.findOne({ phone });

    // Check if the user exists
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid phone or password" }),
        { status: 401 }
      );
    }

    // Check the password directly (in plain text)
    if (password !== user.password) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid phone or password" }),
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return the token and success message
    return new NextResponse(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
