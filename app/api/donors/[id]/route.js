import db from "@/app/lib/db.js";
import { NextResponse } from "next/server";

// Handle GET request for donor details
export async function GET(req, { params }) {
  const { id } = params;

  try {
    const [rows] = await db.query("SELECT * FROM donors WHERE id = ?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Donor not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching donor details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
