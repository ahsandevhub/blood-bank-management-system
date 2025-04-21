import dbConnect from "@/app/lib/db";
import User from "@/app/models/user"; // Adjust the import path as necessary

export async function GET(req) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Fetch all users (equivalent to SELECT * FROM users)
    const users = await User.find({});

    // Return user data as a JSON response
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    // Return error message with 500 status
    return new Response(
      JSON.stringify({
        message: "Failed to fetch user data",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
