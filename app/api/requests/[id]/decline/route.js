import dbConnect from "@/app/lib/db";
import Request from "@/app/models/request"; // Assuming you have a Request model
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params; // The request ID

  try {
    await dbConnect(); // Connect to MongoDB

    // Fetch the request to check its current status
    const request = await Request.findById(id);

    if (!request) {
      // Request not found
      return new NextResponse(
        JSON.stringify({ message: "Request not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (request.status === "approved" || request.status === "declined") {
      // If the request has already been approved or declined, no further action is required
      return new NextResponse(
        JSON.stringify({ message: "Request already processed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the status to "declined"
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status: "declined" },
      { new: true } // Return the updated request
    );

    return new NextResponse(
      JSON.stringify({ message: "Request declined", updatedRequest }),
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
