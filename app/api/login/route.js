import db from "@/app/lib/db.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req) {
  try {
    // Parse the request body
    const { username, password } = await req.json();

    // Validate required fields
    if (!username || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Username and password are required" }),
        { status: 400 }
      );
    }

    // Query the database for the user
    const [rows] = await db.execute("SELECT * FROM admins WHERE username = ?", [
      username,
    ]);

    // Check if the user exists
    if (rows.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid username or password" }),
        { status: 401 }
      );
    }

    const user = rows[0];

    // Check the password directly (in plain text)
    if (password !== user.password) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid username or password" }),
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return the token and success message
    return new NextResponse(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
