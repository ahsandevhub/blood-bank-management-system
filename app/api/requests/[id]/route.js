import dbConnect from "@/app/lib/db";
import BloodStock from "@/app/models/bloodStock"; // Assuming you have a BloodStock model
import Request from "@/app/models/request"; // Assuming you have a Request model
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params; // The request ID

  try {
    await dbConnect(); // Connect to MongoDB

    const { bloodGroup, quantity } = await req.json();

    // Check if blood group and quantity are available in the BloodStock collection
    const bloodStock = await BloodStock.findOne({ bloodGroup });

    if (!bloodStock) {
      // Blood group not found in stock
      return new NextResponse(
        JSON.stringify({ message: "Blood group not found in stock" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const stockQuantity = bloodStock.quantity;

    if (stockQuantity < quantity) {
      // Not enough quantity in stock
      return new NextResponse(
        JSON.stringify({ message: "Insufficient blood quantity in stock" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the status of the request to "approved"
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true } // Return the updated request
    );

    if (!updatedRequest) {
      return new NextResponse(
        JSON.stringify({ message: "Request not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the blood stock by deducting the requested quantity
    await BloodStock.findOneAndUpdate(
      { bloodGroup },
      { $inc: { quantity: -quantity } }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Request approved and stock updated",
        updatedRequest,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating request:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Failed to update request",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
