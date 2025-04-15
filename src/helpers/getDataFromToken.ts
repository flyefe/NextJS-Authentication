// This function is used to extract user data from the JWT token.
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// This function is used to extract user data from the JWT token.
export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    );

    return typeof decodedToken === 'string' ? decodedToken : decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
