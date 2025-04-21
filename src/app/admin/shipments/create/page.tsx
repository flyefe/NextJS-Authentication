"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ShipmentOrderForm from '@/components/admin/shipments/ShipmentOrderForm';
import { useUser } from '@/hooks/useUser';

export default function CreateShipmentOrderPage() {
    const { user, loading: userLoading, error: userError } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/admin/shipments', { ...formData, customer: user._id }, { withCredentials: true });
            toast.success('Shipment order created successfully');
            router.push('/admin/shipments');
        } catch (error) {
            toast.error('Error creating shipment order');
        } finally {
            setLoading(false);
        }
    };

    if (userLoading) return <div>Loading user data...</div>;
    if (userError) return <div>Error loading user data: {userError}</div>;

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <AdminHeader />
                <div className="max-w-6xl mx-auto p-4 sm:p-8 w-full flex flex-col">
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-8">Create Shipment Order</h1>
                    <ShipmentOrderForm onSubmit={handleSubmit} loading={loading} />
                </div>
            </div>
        </div>
    );
}
