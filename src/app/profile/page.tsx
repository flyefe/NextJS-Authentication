// This line tells Next.js to use client-side rendering for this page.
"use client"; // Use client-side rendering

// Import React and hooks
import React, { useState } from "react"; // This function is used to create and manage state in React components.

// Import Next.js components and hooks
import Link from "next/link"; // This function is used to create links in Next.js.
import axiosInstance from "@/lib/utils/axiosInstance"; // This function is used to make HTTP requests.
import { toast } from "react-hot-toast"; // This function is used to display toast notifications.
import { useRouter } from "next/navigation"; // This function is used to navigate between pages.

// Component definition
const ProfilePage = () => {
  const router = useRouter(); // This function is used to navigate between pages.
  const [data, setData] = useState(); // This function is used to create and manage state in React components.

  const getUserDetails = async () => {
    try {
      const response = await axiosInstance.post("/api/users/me");
      setData(response.data.data._id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    await axiosInstance.get("/api/users/logout");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="w-full max-w-md p-6 space-y-4 bg-white rounded-xl shadow-md">
        <h1 className="text-xl font-semibold text-center text-gray-800">
          Profile Page
        </h1>

        <hr className="border-gray-300" />

        <h2 className="text-center">
          {data ? (
            <Link
              href={`/profile/${data}`}
              className="text-blue-500 hover:underline"
            >
              View Profile - {data}
            </Link>
          ) : (
            "No data"
          )}
        </h2>

        <hr className="border-gray-300" />

        <div className="flex flex-col space-y-2">
          <button
            onClick={getUserDetails}
            className="text-white bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Get User Details
          </button>

          <button
            onClick={logout}
            className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
