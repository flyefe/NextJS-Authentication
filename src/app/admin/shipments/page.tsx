"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DataTable from '@/components/admin/DataTable';

// TypeScript type for a shipment order object
interface ShipmentOrder {
    _id: string;
    customer: string;
    routeId: string;
    shippingOption: string;
    goodsCategory?: string;
    weight?: number;
    volume?: number;
    containerType?: string;
    pickupAddress?: string;
    dropOffAddress?: string;
    originCountry: string;
    destinationCountry: string;
    amount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export default function AdminShipmentOrdersPage() {
    const [shipmentOrders, setShipmentOrders] = useState<ShipmentOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch shipment orders
    useEffect(() => {
        setLoading(true);
        axios.get('/api/admin/shipments', { withCredentials: true })
            .then(res => {
                setShipmentOrders(res.data.shipmentOrders);
            })
            .catch(err => {
                setError(err?.response?.data?.error || err?.message || 'Unauthorized or error fetching data');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <AdminHeader />
                <div className="max-w-6xl mx-auto p-4 sm:p-8 w-full flex flex-col">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Admin: Shipment Orders</h1>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold shadow"
                            onClick={() => router.push('/admin/shipments/create')}
                        >
                            + Add Shipment Order
                        </button>
                    </div>
                    {/* DataTable for existing shipment orders */}
                    <DataTable<ShipmentOrder>
                        columns={[
                            { key: 'customer', label: 'Customer' },
                            { key: 'routeId', label: 'Route ID' },
                            { key: 'shippingOption', label: 'Shipping Option' },
                            { key: 'goodsCategory', label: 'Goods Category' },
                            { key: 'weight', label: 'Weight (kg)' },
                            { key: 'volume', label: 'Volume (cbm)' },
                            { key: 'containerType', label: 'Container Type' },
                            { key: 'originCountry', label: 'Origin Country' },
                            { key: 'destinationCountry', label: 'Destination Country' },
                            { key: 'amount', label: 'Amount' },
                            { key: 'status', label: 'Status' },
                        ]}
                        data={shipmentOrders}
                        actions={order => (
                            <div className="flex gap-2">
                                <a
                                    href={`/admin/shipments/update?id=${order._id}`}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    Edit
                                </a>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    onClick={() => handleDelete(order._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

// Function to delete a shipment order
const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this shipment order?')) return;
    try {
        await axios.delete(`/api/admin/shipments/${id}`, { withCredentials: true });
        toast.success('Shipment order deleted');
        // Refresh the shipment orders list
        setShipmentOrders(prevOrders => prevOrders.filter(order => order._id !== id));
    } catch (err: any) {
        toast.error('Error deleting shipment order');
    }
};
