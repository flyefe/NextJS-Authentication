"use client";
import React from "react";
import axiosInstance from "@/lib/utils/axiosInstance";
import { toast } from "react-hot-toast";

export default function LogoutButton({ className = "", children, onClick }: { className?: string; children?: React.ReactNode; onClick?: () => void }) {
  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent parent menu click interference
    if (onClick) onClick();     // Allow parent to close menu first if needed
    await axiosInstance.get("/api/users/logout");
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.replace("/login");
    }, 150); // Allow toast to show briefly
  };

  return (
    <button
      onClick={handleLogout}
      className={
        className ||
        "text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      }
    >
      {children || "Logout"}
    </button>
  );
}

