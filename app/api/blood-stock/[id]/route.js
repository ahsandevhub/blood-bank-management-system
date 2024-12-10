import db from "@/app/lib/db.js";
import { NextResponse } from "next/server";

// Handle GET request for all blood stocks or a specific blood stock
export async function GET(req, { params }) {
  const { id } = params;

  try {
    if (id) {
      // If `id` is provided, fetch a specific blood stock
      const [rows] = await db.query(
        "SELECT * FROM blood_stock_in WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        // If no blood stock found for the provided `id`
        return NextResponse.json(
          { error: "Blood stock not found" },
          { status: 404 }
        );
      }
      // Return the specific blood stock data
      return NextResponse.json(rows[0], { status: 200 });
    } else {
      // If `id` is not provided, fetch all blood stock records
      const [rows] = await db.query("SELECT * FROM blood_stock");
      return NextResponse.json(rows, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching blood stock:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle PUT request to update an existing blood stock
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const { bloodGroup, quantity } = await req.json();

    if (!bloodGroup || !quantity) {
      return new Response(
        JSON.stringify({ message: "Blood group and quantity are required" }),
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      "UPDATE blood_stock SET bloodGroup = ?, quantity = ? WHERE id = ?",
      [bloodGroup, quantity, id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Blood stock not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Blood stock updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blood stock:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// Handle DELETE request to delete a blood stock
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const [result] = await db.query("DELETE FROM blood_stock WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Blood stock not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blood stock deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blood stock:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
