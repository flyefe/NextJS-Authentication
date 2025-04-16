
'use client';

import axios from "axios"; // For making HTTP requests to your API
import { toast } from "react-hot-toast"; // For showing notifications to the user
import { useRouter } from "next/navigation"; // For navigation/redirection
import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DataTable from '@/components/admin/DataTable';
import ModelCreateUpdateForm from '@/components/admin/ModelCreateUpdateForm';

// TypeScript type for a country object
type Country = {
    _id: string;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
    routeName?: string;
    description?: string;
    routeType: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function AdminCountryPage() { 
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
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <AdminHeader />
                <div className="max-w-6xl mx-auto p-4 sm:p-8 w-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Admin: Routes</h1>
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
                    {/* DataTable for existing routes */}
                    <DataTable<Route>
                        columns={[
                            { key: 'routeName', label: 'Route Name' },
                            { key: 'originCity', label: 'Origin', render: (val, row) => `${row.originCity}, ${row.originCountry}` },
                            { key: 'destinationCity', label: 'Destination', render: (val, row) => `${row.destinationCity}, ${row.destinationCountry}` },
                            { key: 'routeType', label: 'Type', render: val => <span className="capitalize">{val}</span> },
                            { key: 'scope', label: 'Scope', render: val => <span className="capitalize">{val}</span> },
                            { key: 'active', label: 'Active', render: val => (
                                <span className={val ? "inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded" : "inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded"}>
                                    {val ? 'Yes' : 'No'}
                                </span>
                            ) },
                        ]}
                        data={routes}
                        actions={route => (
                            <div className="flex gap-2">
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
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}