"use client";

// This line tells Next.js to use client-side rendering for this page.
import React, { useEffect, useState } from "react"; // This function is used to create and manage state in React components.
import { Toaster, toast } from "react-hot-toast"; // This function is used to display toast notifications.

import Link from "next/link"; // This function is used to create links in Next.js.
import axios from "axios"; // This function is used to make HTTP requests.
import { useRouter } from "next/navigation"; // This function is used to navigate between pages.

// Component definition
const Login = () => {
  const router = useRouter();

  // State for form fields
  const [user, setUser] = useState({ // This function is used to create and manage state in React components.
    email: "",
    password: "",
  });
  const [isValidData, setIsValidData] = useState(false); // This function is used to validate the form data.
  const [loading, setLoading] = useState(false); // This function is used to track the loading state of the form.
  const [showPassword, setShowPassword] = useState(false); // This function is used to toggle the visibility of the password.

  const onLogin = async () => {
    try {
      setLoading(true);
      await axios.post("/api/users/login", user);
      window.location.href = "/";
    } catch (error: any) {
      console.log("Login error details", error);
      toast.error("Failed to login.");
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsValidData(user.email.length > 0 && user.password.length > 0);
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          {loading ? "Processing..." : "Login"}
        </h1>
        <div className="space-y-4">
          <div>
            {/* Email input */}
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              value={user.email}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={user.password}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Enter your password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        <button
          disabled={!isValidData}
          onClick={onLogin}
          className={`w-full p-2 text-white bg-blue-500 rounded-lg ${
            isValidData ? "hover:bg-blue-600" : "cursor-not-allowed opacity-50"
          } focus:outline-none`}
        >
          Log In
        </button>

        <div className="text-center">
          <Link
            href="/signup"
            className="text-sm text-blue-500 hover:underline"
          >
            Visit Sign Up Page
          </Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
