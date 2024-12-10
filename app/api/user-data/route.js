import db from "@/app/lib/db.js";

export async function GET(req) {
  try {
    // Fetch all users from the database
    const query = "SELECT * FROM users";
    const [rows] = await db.execute(query);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "No users found" }), {
        status: 404,
      });
    }

    // Return the list of users
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return new Response(JSON.stringify({ message: "Failed to fetch users" }), {
      status: 500,
    });
  }
}
