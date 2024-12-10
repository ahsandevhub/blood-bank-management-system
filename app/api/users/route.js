import db from "@/app/lib/db.js";

export async function GET(req) {
  try {
    // Fetch all donors
    const [rows] = await db.execute("SELECT * FROM users");

    // Return donor data as a JSON response
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching donors:", error);

    // Return error message with 500 status
    return new Response(
      JSON.stringify({ message: "Failed to fetch donor data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
