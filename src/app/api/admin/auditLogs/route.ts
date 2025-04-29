import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import AuditLog from "@/models/auditLogModel";
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

export async function GET(request: NextRequest) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const logs = await AuditLog.find();
  return NextResponse.json({ logs });
}

export async function POST(request: NextRequest) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const log = new AuditLog({ ...body, createdBy: adminUser._id, updatedBy: adminUser._id });
  await log.save();
  return NextResponse.json({ log });
} 