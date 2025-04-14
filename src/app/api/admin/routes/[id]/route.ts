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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const updatedRoute = await Route.findByIdAndUpdate(params.id, { ...body, updatedBy: adminUser._id, updatedAt: new Date() }, { new: true });
  if (!updatedRoute) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ route: updatedRoute });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const deleted = await Route.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}