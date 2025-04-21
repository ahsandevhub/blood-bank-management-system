import dbConnect from "@/app/lib/db";
import BloodStock from "@/app/models/bloodStock";
import BloodStockIn from "@/app/models/bloodStockIn";
import Request from "@/app/models/request"; // Assuming you have the Request model
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

    // Insert the incoming blood stock data into the blood_stock_in collection
    const newBloodStockIn = new BloodStockIn({ bloodGroup, quantity });
    await newBloodStockIn.save();

    // Update the blood stock in the main blood_stock collection by adding the quantity
    const bloodStock = await BloodStock.findOneAndUpdate(
      { bloodGroup: bloodGroup },
      { $inc: { quantity: quantity } },
      { upsert: true, new: true } // upsert: true creates the document if it doesn't exist
    );

    return new NextResponse(
      JSON.stringify({
        message: "Blood stock added and updated successfully",
        bloodStock,
        newBloodStockIn,
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
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect(); // Connect to MongoDB

    const bloodStocksIn = await BloodStockIn.find({});

    // If no data is found, handle the empty response
    if (bloodStocksIn.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No incoming blood stock found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(bloodStocksIn, { status: 200 });
  } catch (error) {
    console.error("Error fetching incoming blood stock:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect(); // Connect to MongoDB

    // Parse the incoming request body (assuming it's JSON)
    const { requestId } = await req.json(); // Assuming you provide the request ID to identify the request
    if (!requestId) {
      return new NextResponse(
        JSON.stringify({ message: "Request ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the request exists in the 'requests' collection
    const request = await Request.findById(requestId);

    if (!request) {
      return new NextResponse(
        JSON.stringify({ message: "Request not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const { bloodGroup, quantity } = request;

    // Check the availability in the 'blood_stock' collection
    const bloodStock = await BloodStock.findOne({ bloodGroup });

    if (!bloodStock) {
      return new NextResponse(
        JSON.stringify({ message: "Blood group not found in stock" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if sufficient stock is available
    const availableQty = bloodStock.quantity;
    if (availableQty < quantity) {
      // Insufficient stock, decline the request
      await Request.findByIdAndUpdate(requestId, { status: "declined" });

      return new NextResponse(
        JSON.stringify({
          message: "Request declined due to insufficient stock",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the status to 'approved' and decrease the quantity in stock
    await Request.findByIdAndUpdate(requestId, { status: "approved" });
    await BloodStock.findOneAndUpdate(
      { bloodGroup },
      { $inc: { quantity: -quantity } }
    );

    return new NextResponse(
      JSON.stringify({ message: "Request approved and stock updated" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating request:", error);

    // Return error message with 500 status
    return new NextResponse(
      JSON.stringify({
        message: "Failed to update request",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
