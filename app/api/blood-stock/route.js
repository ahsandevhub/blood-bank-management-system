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

    // Insert blood stock data into the database
    const [result] = await db.execute(
      "INSERT INTO blood_stock (bloodGroup, quantity) VALUES (?, ?)",
      [bloodGroup, quantity]
    );

    return new Response(
      JSON.stringify({ message: "Blood stock added successfully" }),
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
    const [rows] = await db.query("SELECT * FROM blood_stock");

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
