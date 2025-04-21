import dbConnect from "@/app/lib/db";
import BloodStock from "@/app/models/bloodStock"; // Assuming you have a BloodStock model
import { NextResponse } from "next/server";

// Handle POST request to add a new blood stock
export async function POST(req) {
  try {
    await dbConnect(); // Connect to MongoDB

    const { bloodGroup, quantity } = await req.json();

    if (!bloodGroup || !quantity) {
      return new NextResponse(
        JSON.stringify({ message: "Blood group and quantity are required" }),
        { status: 400 }
      );
    }

    // Create a new blood stock document
    const newBloodStock = new BloodStock({ bloodGroup, quantity });

    // Save the new blood stock to the database
    const savedBloodStock = await newBloodStock.save();

    return new NextResponse(
      JSON.stringify({
        message: "Blood stock added successfully",
        data: savedBloodStock,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding blood stock:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect(); // Connect to MongoDB

    const bloodStocks = await BloodStock.find({});

    // If no data is found, handle the empty response
    if (bloodStocks.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No blood stock found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(bloodStocks, { status: 200 });
  } catch (error) {
    console.error("Error fetching blood stock:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
