import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Shipment from "@/models/shipmentOrderModel";
import User from "@/models/userModel";
import Country from "@/models/countryModel";
import jwt from "jsonwebtoken";

// Connect to the database
connect();

// Function to get the admin user
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
  const shipment = await Shipment.findById(params.id);
  if (!shipment) return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  return NextResponse.json({ shipment });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  // Fetch old shipment to compare
  const oldShipment = await Shipment.findById(params.id);
  if (!oldShipment) return NextResponse.json({ error: "Shipment not found" }, { status: 404 });

  // Compare and build changes object
  const changes: Record<string, any> = {};
  for (const key in body) {
    if (key !== "updateHistory" && oldShipment[key] !== body[key]) {
      changes[key] = oldShipment[key];
    }
  }

  // Push to updateHistory if there are changes
  if (Object.keys(changes).length > 0) {
    oldShipment.updateHistory = oldShipment.updateHistory || [];
    oldShipment.updateHistory.push({
      updatedAt: new Date(),
      updatedBy: adminUser._id,
      changes,
      comment: body.historyComment || ""
    });
  }

  // Update shipment fields
  for (const key in body) {
    if (key !== "updateHistory" && key !== "historyComment") {
      oldShipment[key] = body[key];
    }
  }
  await oldShipment.save();

  return NextResponse.json({ shipment: oldShipment });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const shipment = await Shipment.findByIdAndDelete(params.id);
  if (!shipment) return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  return NextResponse.json({ message: "Shipment deleted successfully" });
} 