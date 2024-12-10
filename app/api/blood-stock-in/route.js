import db from "@/app/lib/db.js";
import { NextResponse } from "next/server"; // Ensure you are importing NextResponse

// Handle POST request to add a new blood stock
export async function POST(req) {
  try {
    const { bloodGroup, quantity } = await req.json();

    if (!bloodGroup || !quantity) {
      return new Response(
        JSON.stringify({ message: "Blood group and quantity are required" }),
        { status: 400 }
      );
    }

    // Insert the incoming blood stock data into the blood_stock_in table
    await db.execute(
      "INSERT INTO blood_stock_in (bloodGroup, quantity) VALUES (?, ?)",
      [bloodGroup, quantity]
    );

    // Update the blood stock in the main blood_stock table by adding the quantity
    await db.execute(
      "UPDATE blood_stock SET quantity = quantity + ? WHERE bloodGroup = ?",
      [quantity, bloodGroup]
    );

    return new Response(
      JSON.stringify({ message: "Blood stock added and updated successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding blood stock:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    const [rows] = await db.query("SELECT * FROM blood_stock_in");

    // If no data is found, handle the empty response
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No blood stock found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching blood stock:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    // Parse the incoming request body (assuming it's JSON)
    const { requestId } = await req.json(); // Assuming you provide the request ID to identify the request
    if (!requestId) {
      return new Response(
        JSON.stringify({ message: "Request ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if the request exists in the 'requests' table
    const [request] = await db.execute("SELECT * FROM requests WHERE id = ?", [
      requestId,
    ]);

    if (request.length === 0) {
      return new Response(JSON.stringify({ message: "Request not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { blood_group, quantity } = request[0];

    // Check the availability in the 'blood_stock' table
    const [stock] = await db.execute(
      "SELECT * FROM blood_stock WHERE blood_group = ?",
      [blood_group]
    );

    if (stock.length === 0) {
      return new Response(
        JSON.stringify({ message: "Blood group not found in stock" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if sufficient stock is available
    const availableQty = stock[0].quantity;
    if (availableQty < quantity) {
      // Insufficient stock, decline the request
      await db.execute("UPDATE requests SET status = 'declined' WHERE id = ?", [
        requestId,
      ]);

      return new Response(
        JSON.stringify({
          message: "Request declined due to insufficient stock",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update the status to 'approved' and decrease the quantity in stock
    await db.execute("UPDATE requests SET status = 'approved' WHERE id = ?", [
      requestId,
    ]);
    await db.execute(
      "UPDATE blood_stock SET quantity = quantity - ? WHERE blood_group = ?",
      [quantity, blood_group]
    );

    return new Response(
      JSON.stringify({ message: "Request approved and stock updated" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating request:", error);

    // Return error message with 500 status
    return new Response(
      JSON.stringify({ message: "Failed to update request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
