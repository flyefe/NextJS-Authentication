'use client';

import axios from "axios"; // For making HTTP requests to your API
import { toast } from "react-hot-toast"; // For showing notifications to the user
import { useRouter } from "next/navigation"; // For navigation/redirection
import { useEffect, useState } from 'react';
import ModelCreateUpdateForm from '@/components/admin/ModelCreateUpdateForm'; // Import the generic form

// TypeScript type for a route object
type Route = {
    _id: string;
    originCountry: string;
    originCity: string;
    destinationCountry: string;
    destinationCity: string;
    routeName?: string;
    description?: string;
    routeType: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function AdminRoutesPage() { 
    const [routes, setRoutes] = useState<Route[]>([]); // State to store the list of routes
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(''); // State to track errors
    const router = useRouter();

    // Check authentication and fetch routes
    useEffect(() => {
        // Fetch routes from the backend API
        axios.get('/api/admin/routes', { withCredentials: true }) // Sends cookies (JWT) for authentication
            .then(res => {
                setRoutes(res.data.routes);
            })
            .catch(err => {
                setError('Unauthorized or error fetching routes');
                // If not authorized, redirect to login (optional)
                // router.push('/login');
            })
            .finally(() => setLoading(false));
    }, []);

    // Modal state for create/update
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

    // Callback to refresh the routes list after creating/updating/deleting a route
    const handleRouteChanged = () => {
        setLoading(true);
        axios.get('/api/admin/routes', { withCredentials: true })
            .then(res => {
                setRoutes(res.data.routes);
            })
            .catch(err => {
                setError('Unauthorized or error fetching routes');
            })
            .finally(() => setLoading(false));
        setModalOpen(false);
        setSelectedRoute(null);
    };

    // Open modal for creating a new route
    const openCreateModal = () => {
        setModalMode('create');
        setSelectedRoute(null);
        setModalOpen(true);
    };

    // Open modal for updating a route
    const openUpdateModal = (route: Route) => {
        setModalMode('update');
        setSelectedRoute(route);
        setModalOpen(true);
    };

    // Delete a route
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this route?')) return;
        try {
            await axios.delete(`/api/admin/routes/${id}`, { withCredentials: true });
            toast.success('Route deleted');
            handleRouteChanged();
        } catch (err: any) {
            toast.error('Error deleting route');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold mb-8 text-blue-900 tracking-tight">Admin: Routes</h1>
            {/* Add Route Button */}
            <div className="mb-6">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold shadow"
                    onClick={openCreateModal}
                >
                    + Add Route
                </button>
            </div>
            {/* Modal for create/update */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
                    onClick={e => {
                        if (e.target === e.currentTarget) setModalOpen(false);
                    }}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
                        style={{ boxSizing: 'border-box' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                            onClick={() => setModalOpen(false)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <ModelCreateUpdateForm
                            model="route"
                            mode={modalMode}
                            id={modalMode === 'update' ? selectedRoute?._id : undefined}
                            initialValues={modalMode === 'update' && selectedRoute ? selectedRoute : {}}
                            onSuccess={handleRouteChanged}
                        />
                    </div>
                </div>
            )}
            {/* Table of existing routes */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-blue-100 text-blue-900">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Route Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Origin</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Destination</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Scope</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Active</th>
                            <th className="px-4 py-3 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.map((route, i) => (
                            <tr key={route._id} className={i % 2 === 0 ? "bg-gray-50 hover:bg-blue-50" : "bg-white hover:bg-blue-50"}>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{route.routeName}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{route.originCity}, {route.originCountry}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{route.destinationCity}, {route.destinationCountry}</td>
                                <td className="px-4 py-3 whitespace-nowrap capitalize text-gray-700">{route.routeType}</td>
                                <td className="px-4 py-3 whitespace-nowrap capitalize text-gray-700">{route.scope}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={route.active ? "inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded" : "inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded"}>
                                        {route.active ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                        onClick={() => openUpdateModal(route)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                        onClick={() => handleDelete(route._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}