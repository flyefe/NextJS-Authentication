"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    username: "",
    companyName: "",
    companyEmail: "",
  });
  const [isValidData, setIsValidData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSignUp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Sign Up successful", response.data);

      toast.success("Registration successful! Please check your email to verify your account before logging in.");
      router.push("/login");
    } catch (error: any) {
      console.log("Sign up failed");
      toast.error(error.response?.data.message || error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsValidData(
      user.firstName.length > 0 &&
      user.lastName.length > 0 &&
      user.phoneNumber.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0 &&
      user.companyName.length > 0 &&
      user.companyEmail.length > 0
    );
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          {loading ? "Processing..." : "Sign Up"}
        </h1>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-sm font-medium text-gray-600">First Name</label>
              <input
                id="firstName"
                type="text"
                value={user.firstName}
                onChange={(e) => setUser((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter your first name"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-sm font-medium text-gray-600">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={user.lastName}
                onChange={(e) => setUser((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter your last name"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-600">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              value={user.phoneNumber}
              onChange={(e) => setUser((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="Enter your phone number"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-600">Username</label>
            <input
              id="username"
              type="text"
              value={user.username}
              onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your username"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-600">Email</label>
            <input
              id="email"
              type="text"
              value={user.email}
              onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="text-sm font-medium text-gray-600">Business/Company Name</label>
              <input
                id="companyName"
                type="text"
                value={user.companyName}
                onChange={(e) => setUser((prev) => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter your business or company name"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>
            <div>
              <label htmlFor="companyEmail" className="text-sm font-medium text-gray-600">Company Email</label>
              <input
                id="companyEmail"
                type="email"
                value={user.companyEmail}
                onChange={(e) => setUser((prev) => ({ ...prev, companyEmail: e.target.value }))}
                placeholder="Enter your company email"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-600">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={user.password}
                onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
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
          onClick={onSignUp}
          className={`w-full p-2 text-white bg-blue-500 rounded-lg ${
            isValidData ? "hover:bg-blue-600" : "cursor-not-allowed opacity-50"
          } focus:outline-none`}
        >
          Sign Up
        </button>

        <div className="text-center">
          <Link href="/login" className="text-sm text-blue-500 hover:underline">
            Visit Login Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
