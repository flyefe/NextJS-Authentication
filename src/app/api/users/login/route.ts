import { NextRequest, NextResponse } from "next/server";

import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    // get the data from the request  
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // check if the user exists
    const user = await User.findOne({ email });

    // if the user does not exist, return an error
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist." },
        { status: 400 }
      );
    }

    // check if the password is valid
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Check your credentials" },
        { status: 400 }
      );
    }

    // create a token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });

    // return the response
    const response = NextResponse.json({
      message: "Logged In successfully.",
      success: true,
    });

    // set the token in the cookies
    response.cookies.set("token", token, {
      httpOnly: true, // user cannot modify it from the browser
    });

    // return the response
    return response;
  } catch (error: any) {
    // return the error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
