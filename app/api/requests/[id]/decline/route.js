import db from "@/app/lib/db.js";

export async function PUT(req, { params }) {
  const { id } = params; // The request ID

  try {
    // Fetch the request to check its current status
    const [requestRows] = await db.execute(
      "SELECT * FROM requests WHERE id = ?",
      [id]
    );

    if (requestRows.length === 0) {
      // Request not found
      return new Response(JSON.stringify({ message: "Request not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const request = requestRows[0];

    if (request.status === "approved" || request.status === "declined") {
      // If the request has already been approved or declined, no further action is required
      return new Response(
        JSON.stringify({ message: "Request already processed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the status to declined
    await db.execute("UPDATE requests SET status = ? WHERE id = ?", [
      "declined",
      id,
    ]);

    return new Response(JSON.stringify({ message: "Request declined" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating request:", error);

    return new Response(
      JSON.stringify({ message: "Failed to update request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
