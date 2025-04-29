"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
}

interface Company {
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  registrationNumber?: string;
  website?: string;
  industry?: string;
  companyLogo?: string;
  contactPerson?: string;
  position?: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  idCard?: string;
  dob?: string;
  gender?: string;
  profilePicture?: string;
  bio?: string;
  nationality?: string;
  occupation?: string;
  maritalStatus?: string;
  socialLinks?: SocialLinks;
  NIN?: string;
}

interface User {
  _id?: string;
  username?: string;
  email?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: string;
  verifyToken?: string;
  verifyTokenExpiry?: string;
  profile?: UserProfile;
  company?: Company;
}

const ProfileDetails = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (data.status && data.data) {
          setUser(data.data);
        } else {
          setError(data.message || "Failed to load user");
        }
      } catch (err: any) {
        setError("Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!user) {
    return <div className="p-8 text-center">No user data found.</div>;
  }

  const { profile, company } = user;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">User Profile Details</h1>
      <div className="flex flex-col gap-6">
        {/* Account Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Account Info</h2>
          <div className="mt-2 space-y-1 text-gray-700">
            <div><b>Username:</b> {user.username}</div>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Verified:</b> {user.isVerified ? "Yes" : "No"}</div>
            <div><b>Admin:</b> {user.isAdmin ? "Yes" : "No"}</div>
          </div>
        </div>

        {/* Profile Info */}
        {profile && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Profile Info</h2>
            <div className="mt-2 space-y-1">
              {profile.profilePicture && (
                <img
                  src={profile.profilePicture}
                  alt="Profile Picture"
                  className="w-24 h-24 rounded-full mb-2 border"
                />
              )}
              <div><b>Name:</b> {profile.firstName} {profile.lastName}</div>
              <div><b>Address:</b> {profile.address}</div>
              <div><b>Phone:</b> {profile.phoneNumber}</div>
              <div><b>ID Card:</b> {profile.idCard}</div>
              <div><b>Date of Birth:</b> {profile.dob && new Date(profile.dob).toLocaleDateString()}</div>
              <div><b>Gender:</b> {profile.gender}</div>
              <div><b>NIN:</b> {profile.NIN}</div>
              <div><b>Nationality:</b> {profile.nationality}</div>
              <div><b>Occupation:</b> {profile.occupation}</div>
              <div><b>Marital Status:</b> {profile.maritalStatus}</div>
              <div><b>Bio:</b> {profile.bio}</div>
              {profile.socialLinks && (
                <div className="mt-2">
                  <b>Social Links:</b>
                  <ul className="list-disc list-inside ml-4">
                    {profile.socialLinks.twitter && <li>Twitter: {profile.socialLinks.twitter}</li>}
                    {profile.socialLinks.linkedin && <li>LinkedIn: {profile.socialLinks.linkedin}</li>}
                    {profile.socialLinks.facebook && <li>Facebook: {profile.socialLinks.facebook}</li>}
                    {profile.socialLinks.instagram && <li>Instagram: {profile.socialLinks.instagram}</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Company Info */}
        {company && company.companyName && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Company Info</h2>
            <div className="mt-2 space-y-1">
              {company.companyLogo && (
                <img
                  src={company.companyLogo}
                  alt="Company Logo"
                  className="w-24 h-24 rounded mb-2 border"
                />
              )}
              <div><b>Company Name:</b> {company.companyName}</div>
              <div><b>Address:</b> {company.companyAddress}</div>
              <div><b>Email:</b> {company.companyEmail}</div>
              <div><b>Phone:</b> {company.companyPhone}</div>
              <div><b>Registration #:</b> {company.registrationNumber}</div>
              <div><b>Website:</b> {company.website}</div>
              <div><b>Industry:</b> {company.industry}</div>
              <div><b>Contact Person:</b> {company.contactPerson}</div>
              <div><b>Position:</b> {company.position}</div>
            </div>
          </div>
        )}

        {/* Back to Profile Page Button */}
        <div className="flex justify-center">
          <Link
            href="/profile"
            className="inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple hover:shadow-lg hover:bg-blue-600 focus:outline-none"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
