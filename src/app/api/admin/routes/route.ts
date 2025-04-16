// This file handles API requests for routes

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Route from "@/models/routeModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

// This function is used to connect to the database.  
connect();

// This function is used to get the admin user.
async function getAdminUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Get the token from the cookie
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!); // Verify the token
    const user = await User.findById(decoded.id); //find user by id from database
    if (user && user.isAdmin) return user; // Return the user if they are an admin
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const routes = await Route.find();
  return NextResponse.json({ routes });
}

export async function POST(request: NextRequest) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const route = new Route({ ...body, createdBy: adminUser._id, updatedBy: adminUser._id });
  await route.save();
  return NextResponse.json({ route });
}