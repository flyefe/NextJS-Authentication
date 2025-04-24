import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import Country from '@/models/countryModel';

// This function is used to get the admin user
async function getAdminUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string };
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

  try {
    const urlParts = request.url.split('/');
    const id = urlParts[urlParts.length - 1]; // Extract the ID from the URL path
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await connect();
    const user = await User.findById(id).select('profile company'); // Ensure these fields are selected
    console.log('Fetched user data:', user); // Log the fetched user data
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) {
    console.log('Unauthorized access attempt');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const urlParts = request.url.split('/');
    const id = urlParts[urlParts.length - 1]; // Extract the ID from the URL path
    if (!id) {
      console.log('Missing ID in request URL');
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();
    console.log('Received user update data (PUT):', body);
    await connect();

    // Validate and normalize nested objects
    if ('profile' in body && typeof body.profile !== 'object') {
      console.log('Invalid profile structure');
      return NextResponse.json({ error: 'profile must be an object' }, { status: 400 });
    }
    if ('company' in body && typeof body.company !== 'object') {
      console.log('Invalid company structure');
      return NextResponse.json({ error: 'company must be an object' }, { status: 400 });
    }
    if (!('profile' in body)) {
      body.profile = {};
    }
    if (!('company' in body)) {
      body.company = {};
    }

    // Update user with new fields, create if not exists
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        $set: body,
        updatedBy: adminUser._id
      },
      { new: true, upsert: true } // Use upsert to create if not exists
    );

    if (!updatedUser) {
      console.log('User not found for ID:', id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await dbConnect();
    
    // Delete user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();
    await dbConnect();

    // Validate and normalize nested objects
    if ('profile' in body && typeof body.profile !== 'object') {
      return NextResponse.json({ error: 'profile must be an object' }, { status: 400 });
    }
    if ('company' in body && typeof body.company !== 'object') {
      return NextResponse.json({ error: 'company must be an object' }, { status: 400 });
    }

    // Partial update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        $set: body,
        updatedBy: adminUser._id
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}