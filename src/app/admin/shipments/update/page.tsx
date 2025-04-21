"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ShipmentOrderForm from '@/components/admin/shipments/ShipmentOrderForm';

export default function UpdateShipmentOrderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Get shipment id from query or URL param (Next.js app router can use params or search)
    // For this example, let's use ?id=... for simplicity
    const shipmentId = searchParams.get('id');

    if (!shipmentId) return <div className="p-8">No shipment ID provided.</div>;

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <AdminHeader />
                <div className="max-w-6xl mx-auto p-4 sm:p-8 w-full flex flex-col">
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-8">Update Shipment Order</h1>
                    <ShipmentOrderForm id={shipmentId} />
                </div>
            </div>
        </div>
    );
}
