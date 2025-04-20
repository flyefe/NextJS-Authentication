import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Route from "@/models/routeModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connect();

async function getAdminUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const user = await User.findById(decoded.id);
    if (user && user.isAdmin) return user;
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const route = await Route.findById(params.id)
      .populate('originCountry destinationCountry createdBy updatedBy');
    if (!route) return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.log("Route sent to frontend:", JSON.stringify(route, null, 2));
    return NextResponse.json({ route });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  // Convert string IDs to ObjectId if present
  if (body.originCountry && typeof body.originCountry === 'string') body.originCountry = new mongoose.Types.ObjectId(body.originCountry);
  if (body.destinationCountry && typeof body.destinationCountry === 'string') body.destinationCountry = new mongoose.Types.ObjectId(body.destinationCountry);
  if (body.createdBy && typeof body.createdBy === 'string') body.createdBy = new mongoose.Types.ObjectId(body.createdBy);
  if (body.updatedBy && typeof body.updatedBy === 'string') body.updatedBy = new mongoose.Types.ObjectId(body.updatedBy);

  // Set audit fields
  body.updatedBy = adminUser._id;
  body.updatedAt = new Date();

  try {
    const updatedRoute = await Route.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    ).populate('originCountry destinationCountry createdBy updatedBy');
    if (!updatedRoute) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ route: updatedRoute });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  // Validate required fields
  if (!body.routeName) {
    return NextResponse.json({ error: 'Route name is required' }, { status: 400 });
  }

  // Convert string IDs to ObjectId
  if (body.originCountry && typeof body.originCountry === 'string') body.originCountry = new mongoose.Types.ObjectId(body.originCountry);
  if (body.destinationCountry && typeof body.destinationCountry === 'string') body.destinationCountry = new mongoose.Types.ObjectId(body.destinationCountry);
  if (body.createdBy && typeof body.createdBy === 'string') body.createdBy = new mongoose.Types.ObjectId(body.createdBy);
  if (body.updatedBy && typeof body.updatedBy === 'string') body.updatedBy = new mongoose.Types.ObjectId(body.updatedBy);

  // Remove old fields if present
  delete body.import;
  delete body.export;

  // Ensure nested objects are present
  body.shippingOptionConfig = body.shippingOptionConfig || {};
  body.category = body.category || {};

  // Set audit fields
  body.updatedBy = adminUser._id;
  body.updatedAt = new Date();

  try {
    const updatedRoute = await Route.findByIdAndUpdate(params.id, body, { new: true })
      .populate('originCountry destinationCountry createdBy updatedBy');
    if (!updatedRoute) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ route: updatedRoute });
  } catch (error: any) {
    console.error("Route update error:", error, body);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const deleted = await Route.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}