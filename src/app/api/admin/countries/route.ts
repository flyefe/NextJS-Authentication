import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Country from "@/models/countryModel";
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
  //const adminUser = await getAdminUser(request);
  //if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const countries = await Country.find();
  return NextResponse.json({ countries });
}

export async function POST(request: NextRequest) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const country = new Country({ ...body, createdBy: adminUser._id, updatedBy: adminUser._id });
  await country.save();
  return NextResponse.json({ country });
} 