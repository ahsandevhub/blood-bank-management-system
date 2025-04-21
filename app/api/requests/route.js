import dbConnect from "@/app/lib/db";
import Request from "@/app/models/request"; // Assuming you have a Request model
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect(); // Connect to MongoDB

    // Fetch all requests
    const requests = await Request.find({});

    // Return request data as a JSON response
    return NextResponse.json(requests, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);

    // Return error message with 500 status
    return new NextResponse(
      JSON.stringify({
        message: "Failed to fetch request data",
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect(); // Connect to MongoDB

    // Parse the incoming request body (assuming it's JSON)
    const data = await req.json();

    const { userId, bloodGroup, quantity } = data; // Example fields

    // Validate data (you can add more validation as needed)
    if (
      !userId ||
      !bloodGroup ||
      !quantity ||
      isNaN(quantity) ||
      quantity <= 0
    ) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid data. Please check your inputs." }),
        {
          status: 400,
        }
      );
    }

    // Insert the new data into the database
    const newRequest = new Request({
      userId,
      bloodGroup,
      quantity,
      // You might want to set a default status here, e.g., 'pending'
      status: "pending",
    });

    const savedRequest = await newRequest.save();

    // Return success response
    return NextResponse.json(
      { message: "Request successfully created", id: savedRequest._id },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error saving request data:", error);

    // Return error message with 500 status
    return new NextResponse(
      JSON.stringify({
        message: "Failed to create request",
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
