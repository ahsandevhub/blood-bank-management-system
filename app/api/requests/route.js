import db from "@/app/lib/db.js";

export async function GET(req) {
  try {
    // Fetch all donors
    const [rows] = await db.execute("SELECT * FROM requests");

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

export async function POST(req) {
  try {
    // Parse the incoming request body (assuming it's JSON)
    const data = await req.json();

    const { userId, bloodGroup, quantity } = data; // Example fields: bloodGroup and quantity

    // Validate data (you can add more validation as needed)
    if (!bloodGroup || !quantity || isNaN(quantity) || quantity <= 0) {
      return new Response(
        JSON.stringify({ message: "Invalid data. Please check your inputs." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Insert the new data into the database
    const query = `
      INSERT INTO requests (userId, blood_group, quantity)
      VALUES (?, ?, ?)
    `;
    await db.execute(query, [userId, bloodGroup, quantity]);

    // Return success response
    return new Response(
      JSON.stringify({ message: "Request successfully created" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving request data:", error);

    // Return error message with 500 status
    return new Response(
      JSON.stringify({ message: "Failed to create request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
