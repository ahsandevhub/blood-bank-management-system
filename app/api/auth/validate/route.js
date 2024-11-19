import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { token } = await request.json(); // Parse the request body

    if (!token) {
      return new Response(
        JSON.stringify({ isValid: false, message: "Token is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      return new Response(JSON.stringify({ isValid: true, user: decoded }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ isValid: false, message: "Invalid token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ isValid: false, message: "Server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
