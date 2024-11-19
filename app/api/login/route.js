import db from "@/app/lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Validate request body
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get connection from the pool
    const connection = await db.getConnection();

    try {
      // Query user by username
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      // Check if the user exists
      if (rows.length === 0) {
        return new Response(
          JSON.stringify({ error: "Invalid username or password" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      const user = rows[0];

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return new Response(
          JSON.stringify({ error: "Invalid username or password" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Return the token
      return new Response(
        JSON.stringify({ token, message: "Login successful" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } finally {
      // Always release the connection back to the pool
      connection.release();
    }
  } catch (error) {
    console.error("Login API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
