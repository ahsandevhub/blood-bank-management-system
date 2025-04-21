import dbConnect from "@/app/lib/dbConnect";
import BloodStock from "@/app/models/bloodStock"; // Assuming you have the BloodStock model
import { NextResponse } from "next/server";

// Handle GET request for all blood stocks or a specific blood stock
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await dbConnect(); // Connect to MongoDB

    if (id) {
      // If `id` is provided, fetch a specific blood stock by its _id
      const bloodStock = await BloodStock.findById(id);

      if (!bloodStock) {
        // If no blood stock found for the provided `id`
        return new NextResponse(
          JSON.stringify({ error: "Blood stock not found" }),
          { status: 404 }
        );
      }
      // Return the specific blood stock data
      return NextResponse.json(bloodStock, { status: 200 });
    } else {
      // If `id` is not provided, fetch all blood stock records
      const bloodStocks = await BloodStock.find({});
      return NextResponse.json(bloodStocks, { status: 200 });
    }
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

// Handle PUT request to update an existing blood stock
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await dbConnect(); // Connect to MongoDB

    const { bloodGroup, quantity } = await req.json();

    if (!bloodGroup || !quantity) {
      return new NextResponse(
        JSON.stringify({ message: "Blood group and quantity are required" }),
        { status: 400 }
      );
    }

    // Update the blood stock by its _id
    const updatedBloodStock = await BloodStock.findByIdAndUpdate(
      id,
      { bloodGroup, quantity, updatedAt: Date.now() },
      { new: true } // Return the modified document rather than the original
    );

    if (!updatedBloodStock) {
      return new NextResponse(
        JSON.stringify({ message: "Blood stock not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Blood stock updated successfully",
        data: updatedBloodStock,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blood stock:", error);
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

// Handle DELETE request to delete a blood stock
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await dbConnect(); // Connect to MongoDB

    // Delete the blood stock by its _id
    const deletedBloodStock = await BloodStock.findByIdAndDelete(id);

    if (!deletedBloodStock) {
      return new NextResponse(
        JSON.stringify({ error: "Blood stock not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Blood stock deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blood stock:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
