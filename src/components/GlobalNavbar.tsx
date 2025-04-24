"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function GlobalNavbar() {
  const { user, loading, error } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 border-b border-blue-900 shadow-lg px-2 sm:px-6 py-3 flex items-center justify-between flex-wrap relative">
      {/* Brand/Logo on the left */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-extrabold text-white tracking-tight whitespace-nowrap drop-shadow">G-Line</Link>
      </div>
      {/* Desktop Nav */}
      <div className="hidden sm:flex items-center space-x-6 flex-1 ml-4">
        <Link href="/shipping-calculator" className={`font-medium hover:text-yellow-300 transition text-white ${pathname === "/shipping-calculator" ? "underline underline-offset-4 decoration-yellow-300" : ""}`}>Shipping Calculator</Link>
        {user?.isAdmin && (
          <Link href="/admin/routes" className={`font-medium hover:text-yellow-300 transition text-white ${pathname.startsWith("/admin/routes") ? "underline underline-offset-4 decoration-yellow-300" : ""}`}>Admin</Link>
        )}
      </div>
      {/* Hamburger button for mobile - now on the far right */}
      <button
        className="sm:hidden flex items-center px-2 py-1 text-yellow-300 border border-yellow-300 rounded ml-2 bg-blue-800 hover:bg-yellow-300 hover:text-blue-900 transition"
        onClick={() => setMobileMenuOpen((v: boolean) => !v)}
        aria-label="Toggle Menu"
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-nav"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="sm:hidden absolute top-full right-0 w-full bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950 border-b border-yellow-300 z-40 flex flex-col items-start px-4 py-2 gap-2 shadow animate-fadein"
          role="menu"
        >
          <Link href="/shipping-calculator" className={`block w-full py-2 px-2 rounded font-medium hover:bg-blue-50 ${pathname === "/calculator" ? "text-blue-700" : "text-gray-700"}`} onClick={() => setMobileMenuOpen(false)}>
            Shipping Calculator
          </Link>
          {user?.isAdmin && (
            <Link href="/admin" className={`block w-full py-2 px-2 rounded font-medium hover:bg-blue-50 ${pathname.startsWith("/admin") ? "text-blue-700" : "text-gray-700"}`} onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
          )}
          {/* Profile/Logout for mobile */}
          {user ? (
            <>
              <button
                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded transition w-full mt-2"
                onClick={() => { router.push("/profile"); setMobileMenuOpen(false); }}
              >
                <span className="inline-block w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  {user.profile?.avatarUrl ? (
                    <img src={user.profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </span>
                <span className="text-gray-700 font-semibold">
                  {user.profile?.firstName || user.profile?.lastName
                    ? `${user.profile?.firstName ?? ''} ${user.profile?.lastName ?? ''}`.trim()
                    : user.username}
                </span>
              </button>
              <button
                className="text-blue-700 font-semibold hover:underline w-full text-left px-3 py-2"
                onClick={() => { router.push("/api/users/logout"); setMobileMenuOpen(false); }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="block w-full py-2 px-2 rounded font-medium hover:bg-blue-50 text-blue-700" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
      {/* Profile/Login/Logout - always visible on desktop */}
      <div className={`hidden sm:flex items-center ${mobileMenuOpen ? 'hidden' : ''}`}>
        {user ? (
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded transition"
              onClick={() => router.push("/profile")}
            >
              <span className="inline-block w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                {user.profile?.avatarUrl ? (
                  <img src={user.profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </span>
              <span className="text-gray-700 font-semibold">
                {user.profile?.firstName || user.profile?.lastName
                  ? `${user.profile?.firstName ?? ''} ${user.profile?.lastName ?? ''}`.trim()
                  : user.username}
              </span>
            </button>
            <button
              className="text-blue-700 font-semibold hover:underline"
              onClick={() => router.push("/api/users/logout")}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-blue-700 font-semibold hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
}
