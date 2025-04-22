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

  try {
    const users = await User.find();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'error fetching users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Gracefully handle empty or invalid JSON input
    let body: any;
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    console.log('Received user creation data (POST):', body);
    
    // Validate and normalize nested objects
    if ('profile' in body && typeof body.profile !== 'object') {
      return NextResponse.json({ error: 'profile must be an object' }, { status: 400 });
    }
    if ('company' in body && typeof body.company !== 'object') {
      return NextResponse.json({ error: 'company must be an object' }, { status: 400 });
    }
    if (!('profile' in body)) {
      body.profile = {};
    }
    if (!('company' in body)) {
      body.company = {};
    }
    // Create new user
    const user = new User({ 
      ...body, 
      createdBy: adminUser._id,
      updatedBy: adminUser._id
    });
    
    await user.save();
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'error creating user' }, { status: 500 });
  }
}