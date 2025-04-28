// src/app/page.tsx
"use client";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const { user, loading } = useUser();
  let displayName = "";
  if (user) {
    if (user.profile?.firstName || user.profile?.lastName) {
      displayName = `${user.profile?.firstName ?? ''} ${user.profile?.lastName ?? ''}`.trim();
    } else if (user.username) {
      displayName = user.username;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 border border-blue-100 text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">
          {displayName
            ? <>Welcome to your Dashboard, {displayName}.</>
            : <>Welcome to your Dashboard.</>
          }
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          We are currently working to enable online shipment booking with G-Line Logistics.<br />
          In the meantime, please contact our support team at <b>08061904041</b> for manual shipment orders.<br />
          We are happy to assist you.
        </p>
      </div>
    </div>
  );
}