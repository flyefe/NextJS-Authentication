// This file handles API requests for routes

import mongoose from "mongoose";
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

  // Support for filtering (optional, e.g. by country, active)
  const { searchParams } = new URL(request.url);
  const filter: any = {};
  if (searchParams.get('originCountry')) filter.originCountry = searchParams.get('originCountry');
  if (searchParams.get('destinationCountry')) filter.destinationCountry = searchParams.get('destinationCountry');
  if (searchParams.get('active')) filter.active = searchParams.get('active') === 'true';

  const routes = await Route.find(filter)
    .populate('originCountry destinationCountry createdBy updatedBy');
  return NextResponse.json({ routes });
}

export async function POST(request: NextRequest) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  // Validate required fields
  if (!body.originCountry || !body.destinationCountry || !body.routeType || !body.originCity || !body.destinationCity) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Convert string IDs to ObjectId
  body.originCountry = new mongoose.Types.ObjectId(body.originCountry);
  body.destinationCountry = new mongoose.Types.ObjectId(body.destinationCountry);
  if (body.createdBy) body.createdBy = new mongoose.Types.ObjectId(body.createdBy);
  if (body.updatedBy) body.updatedBy = new mongoose.Types.ObjectId(body.updatedBy);
  
  // The frontend should send a shippingOptionConfig object with this structure:
  // shippingOptionConfig: {
  //   availableOptions: {
  //     expressRate: { ... },
  //     fastTrackRate: { ... },
  //     consoleRate: { ... },
  //     seaRate: { ... }
  //   },
  //   subCharge: number,
  //   vatPercent: number
  // }
  // No legacy expressRate/optionRate/shippingConfig fields are needed.

  // Set audit fields
  body.createdBy = adminUser._id;
  body.updatedBy = adminUser._id;

  try {
    const route = new Route(body);
    await route.save();
    // Populate references for response
    // await route.populate('originCountry destinationCountry createdBy updatedBy');
    return NextResponse.json({ route });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}