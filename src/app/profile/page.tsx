// This line tells Next.js to use client-side rendering for this page.
"use client"; // Use client-side rendering

// Import React and hooks
import React, { useEffect, useState } from "react";
import LogoutButton from "@/components/ui/LogoutButton";
import ProfileForm from "@/components/ProfileForm";
import axiosInstance from "@/lib/utils/axiosInstance";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.post("/api/users/me");
        setUser(response.data.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-red-600">Unable to load profile.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white/90 rounded-3xl shadow-2xl border border-blue-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-blue-900 tracking-tight">Profile</h1>
          <LogoutButton />
        </div>
        <div className="flex flex-col md:flex-row gap-10 md:gap-6">
          {/* DETAILS SECTION */}
          <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col items-center relative">
            {/* Profile Image or Placeholder */}
            <div className="mb-4 flex flex-col items-center">
              {user.profile?.profilePicture ? (
                <img src={user.profile.profilePicture} alt="Profile" className="w-24 h-24 rounded-full border-4 border-blue-200 shadow-lg object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {((user.profile?.firstName?.[0] || '') + (user.profile?.lastName?.[0] || user.username?.[0] || '')).toUpperCase()}
                </div>
              )}
              <h2 className="mt-2 text-xl font-semibold text-gray-800">{user.profile?.firstName || user.username} {user.profile?.lastName || ''}</h2>
              <div className="text-gray-500 text-sm">{user.email}</div>
            </div>
            <div className="w-full space-y-2 mt-2">
              <div className="text-gray-700"><span className="font-medium">Username:</span> <span className="text-gray-800">{user.username}</span></div>
              <div className="text-gray-700"><span className="font-medium">Phone Number:</span> <span className="text-gray-800">{user.profile?.phoneNumber || '-'}</span></div>
              <div className="text-gray-700"><span className="font-medium">Date of Birth:</span> <span className="text-gray-800">{user.profile?.dob ? user.profile.dob.slice(0,10) : '-'}</span></div>
              <div className="text-gray-700"><span className="font-medium">Gender:</span> <span className="text-gray-800">{user.profile?.gender || '-'}</span></div>
              <div className="text-gray-700"><span className="font-medium">Marital Status:</span> <span className="text-gray-800">{user.profile?.maritalStatus || '-'}</span></div>
              <div className="text-gray-700"><span className="font-medium">Address:</span> <span className="text-gray-800">{user.profile?.address || '-'}</span></div>
              <div className="text-gray-700"><span className="font-medium">Nationality:</span> <span className="text-gray-800">{user.profile?.nationality || '-'}</span></div>
              {user.isAdmin && (
                <>
                  <div className="text-gray-700"><span className="font-medium">NIN:</span> <span className="text-gray-800">{user.profile?.NIN || '-'}</span></div>
                  <div className="text-gray-700"><span className="font-medium">ID Card:</span> <span className="text-gray-800">{user.profile?.idCard || '-'}</span></div>
                </>
              )}
              <div className="text-gray-700"><span className="font-medium">Occupation:</span> <span className="text-gray-800">{user.profile?.occupation || '-'}</span></div>
              <div className="text-gray-700"><span className="font-medium">Bio:</span> <span className="text-gray-800">{user.profile?.bio || '-'}</span></div>
            </div>
            <div className="w-full mt-4">
              <div className="text-gray-700 font-medium mb-1">Social Links:</div>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li className="transition-colors hover:text-blue-600">Twitter: <a href={user.profile?.socialLinks?.twitter || undefined} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline hover:text-blue-600">{user.profile?.socialLinks?.twitter || '-'}</a></li>
                <li className="transition-colors hover:text-blue-600">LinkedIn: <a href={user.profile?.socialLinks?.linkedin || undefined} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline hover:text-blue-600">{user.profile?.socialLinks?.linkedin || '-'}</a></li>
                <li className="transition-colors hover:text-blue-600">Facebook: <a href={user.profile?.socialLinks?.facebook || undefined} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline hover:text-blue-600">{user.profile?.socialLinks?.facebook || '-'}</a></li>
                <li className="transition-colors hover:text-blue-600">Instagram: <a href={user.profile?.socialLinks?.instagram || undefined} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline hover:text-blue-600">{user.profile?.socialLinks?.instagram || '-'}</a></li>
              </ul>
            </div>
          </div>
          {/* VERTICAL DIVIDER */}
          <div className="hidden md:block w-px bg-gradient-to-b from-blue-100 to-blue-300 mx-4 rounded-full" />
          <div className="block md:hidden h-px bg-gradient-to-r from-blue-100 to-blue-300 my-6 rounded-full" />
          {/* FORM SECTION */}
          <div className="w-full md:w-1/2 flex flex-col border border-gray-200 rounded-2xl bg-white/80 p-4">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Update Profile</h2>
            <ProfileForm user={user} onUpdate={setUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
