import db from "@/app/lib/db.js";

export async function PUT(req, { params }) {
  const { id } = params; // The request ID
  const { bloodGroup, quantity } = await req.json();

  try {
    // Check if blood group and quantity are available in the blood_stock table
    const [stockRows] = await db.execute(
      "SELECT quantity FROM blood_stock WHERE bloodGroup = ?",
      [bloodGroup]
    );

    if (stockRows.length === 0) {
      // Blood group not found in stock
      return new Response(
        JSON.stringify({ message: "Blood group not found in stock" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const stockQuantity = stockRows[0].quantity;

    if (stockQuantity < quantity) {
      // Not enough quantity in stock
      return new Response(
        JSON.stringify({ message: "Insufficient blood quantity in stock" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the status and deduct the quantity from stock
    await db.execute("UPDATE requests SET status = ? WHERE id = ?", [
      "approved",
      id,
    ]);

    // Update the blood stock by deducting the requested quantity
    await db.execute(
      "UPDATE blood_stock SET quantity = quantity - ? WHERE bloodGroup = ?",
      [quantity, bloodGroup]
    );

    return new Response(
      JSON.stringify({ message: "Request approved and stock updated" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating request:", error);

    return new Response(
      JSON.stringify({ message: "Failed to update request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
