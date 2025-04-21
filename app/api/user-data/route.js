import dbConnect from "@/app/lib/db";
import User from "@/app/models/user"; // Adjust the import path as necessary
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Fetch all users from MongoDB
    const users = await User.find({});

    if (users.length === 0) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    // Return the list of users
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
