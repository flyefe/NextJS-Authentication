

"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaPlus, FaSearch, FaHistory } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [redirected, setRedirected] = useState(false);
  useEffect(() => {
    router.replace("/shipping-calculator");
    setRedirected(true);
  }, [router]);
  if (!redirected) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Welcome Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-1">Welcome to Your Dashboard</h1>
            <p className="text-gray-600 text-base md:text-lg">Manage your shipping orders, track deliveries, and access quick tools.</p>
          </div>
          <button className="bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition">Logout</button>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col items-center border border-blue-100">
            <FaBoxOpen className="text-blue-500 text-3xl mb-2" />
            <div className="text-2xl font-bold text-blue-900">12</div>
            <div className="text-gray-600 text-sm">Total Orders</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col items-center border border-blue-100">
            <FaShippingFast className="text-yellow-500 text-3xl mb-2" />
            <div className="text-2xl font-bold text-yellow-700">2</div>
            <div className="text-gray-600 text-sm">Pending Shipments</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col items-center border border-blue-100">
            <FaCheckCircle className="text-green-500 text-3xl mb-2" />
            <div className="text-2xl font-bold text-green-700">10</div>
            <div className="text-gray-600 text-sm">Delivered</div>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* My Shipping Orders */}
          <div className="col-span-2 bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <FaBoxOpen className="text-blue-500 text-xl" />
              <span className="font-bold text-lg text-blue-900">My Shipping Orders</span>
            </div>
            <div className="text-gray-500 text-sm mb-4">You have <span className="font-semibold text-blue-700">2</span> shipments in progress. View all your orders below.</div>
            <div className="flex flex-col gap-2">
              {/* Placeholder orders */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div>
                  <div className="font-semibold text-blue-900">Order #12345</div>
                  <div className="text-xs text-gray-600">Status: In Transit</div>
                </div>
                <button className="text-blue-700 font-bold hover:underline">View</button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div>
                  <div className="font-semibold text-blue-900">Order #12344</div>
                  <div className="text-xs text-gray-600">Status: Pending Pickup</div>
                </div>
                <button className="text-blue-700 font-bold hover:underline">View</button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <div className="font-semibold text-gray-800">Order #12343</div>
                  <div className="text-xs text-gray-600">Status: Delivered</div>
                </div>
                <button className="text-blue-700 font-bold hover:underline">View</button>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition">View All Orders</button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <FaPlus className="text-green-600 text-xl" />
              <span className="font-bold text-lg text-blue-900">Quick Actions</span>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition">
              <FaPlus /> Create New Order
            </button>
            <button className="flex items-center gap-2 bg-yellow-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition">
              <FaSearch /> Track Shipment
            </button>
            <button className="flex items-center gap-2 bg-gray-100 text-blue-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition">
              <FaHistory /> Order History
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <FaHistory className="text-blue-500 text-xl" />
            <span className="font-bold text-lg text-blue-900">Recent Activity</span>
          </div>
          <ul className="text-gray-700 text-sm flex flex-col gap-2">
            <li><span className="font-semibold text-blue-700">Order #12345</span> was shipped to Lagos, Nigeria.</li>
            <li><span className="font-semibold text-blue-700">Order #12344</span> is pending pickup.</li>
            <li><span className="font-semibold text-blue-700">Order #12343</span> was delivered successfully.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
