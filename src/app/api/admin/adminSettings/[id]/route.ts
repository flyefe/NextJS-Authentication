import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import AdminSettings from "@/models/adminSettingsModel";
import User from "@/models/userModel";
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
  const setting = await AdminSettings.findById(params.id);
  if (!setting) return NextResponse.json({ error: "Setting not found" }, { status: 404 });
  return NextResponse.json({ setting });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const setting = await AdminSettings.findByIdAndUpdate(params.id, body, { new: true });
  if (!setting) return NextResponse.json({ error: "Setting not found" }, { status: 404 });
  return NextResponse.json({ setting });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const setting = await AdminSettings.findByIdAndDelete(params.id);
  if (!setting) return NextResponse.json({ error: "Setting not found" }, { status: 404 });
  return NextResponse.json({ message: "Setting deleted successfully" });
} 