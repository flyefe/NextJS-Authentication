'use client';

import axios from "axios"; // For making HTTP requests to your API
import { toast } from "react-hot-toast"; // For showing notifications to the user
import { useRouter } from "next/navigation"; // For navigation/redirection
import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DataTable from '@/components/admin/DataTable';
import RouteCreateForm from '../../../components/admin/RouteCreateForm';   
import { useCountries } from "@/hooks/useCountries"; // Import the hook

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
    scope: string;
    category?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function AdminRoutesPage() { 
    const { countries, loading: countriesLoading, error: countriesError } = useCountries(); // Use the hook
    const [routes, setRoutes] = useState<Route[]>([]); // State to store the list of routes
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState<string | null>(null); // State to track errors
    const [dropdownOptions, setDropdownOptions] = useState<string[]>([]); // State for dropdown options
    const [users, setUsers] = useState<any[]>([]);
    const router = useRouter();
    const [selectedScope, setSelectedScope] = useState('');

    // Fetch routes, countries, and users
    useEffect(() => {
        setLoading(true);
        Promise.all([
            axios.get('/api/admin/routes', { withCredentials: true }),
            axios.get('/api/admin/users', { withCredentials: true }),
        ])
            .then(([routesRes, usersRes]) => {
                console.log('Routes:', routesRes.data.routes); // Debug: Log routes data
                console.log('Countries:', countries); // Debug: Log countries data
                setRoutes(routesRes.data.routes);
                setUsers(usersRes.data.users || []);
                const uniqueRouteTypes = Array.from(new Set<string>(routesRes.data.routes.map((route: Route) => route.routeType)));
                setDropdownOptions(uniqueRouteTypes);
            })
            .catch(err => {
                setError(err?.response?.data?.error || err?.message || 'Unauthorized or error fetching data');
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
                setError(err?.response?.data?.error || err?.message || 'Unauthorized or error fetching routes');
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

    // Function to open modal for editing a route
    const openUpdateModal = (route: Route) => {
        setModalMode('update');
        setSelectedRoute(route);
        setModalOpen(true);
    };

    // Function to fetch a single route by ID (for editing, if needed)
    const fetchRouteById = async (id: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/admin/routes/${id}`, { withCredentials: true });
            setSelectedRoute(res.data.route);
        } catch (err: any) {
            setError(err?.response?.data?.error || err?.message || 'Failed to fetch route');
        } finally {
            setLoading(false);
        }
    };

    // Function to update a route
    const updateRoute = async (id: string, form: any) => {
        setLoading(true);
        try {
            const res = await axios.put(`/api/admin/routes/${id}`, form, { withCredentials: true });
            toast.success('Route updated');
            handleRouteChanged();
        } catch (err: any) {
            setError(err?.response?.data?.error || err?.message || 'Failed to update route');
        } finally {
            setLoading(false);
        }
    };

    // Add search functionality to filter routes by name
    const [searchQuery, setSearchQuery] = useState('');
    const filteredRoutes = routes.filter(route => {
        const matchesName = route.routeName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesScope = selectedScope ? route.scope === selectedScope : true;
        return matchesName && matchesScope;
    });

    // Function to toggle the active status of a route
    const toggleActiveStatus = async (id: string, newStatus: boolean) => {
        try {
            await axios.patch(`/api/admin/routes/${id}`, { active: newStatus }, { withCredentials: true });
            toast.success(`Route ${newStatus ? 'activated' : 'deactivated'}`);
            handleRouteChanged(); // Refresh the routes list
        } catch (err: any) {
            toast.error('Error updating route status');
        }
    };

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
                        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Admin: Routes</h1>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold shadow"
                            onClick={() => router.push('/admin/routes/create')}
                        >
                            + Add Route
                        </button>
                    </div>
                    {/* Dropdown for route scopes */}
                    <select
                        className="mb-4 p-2 border border-gray-300 rounded text-gray-400"
                        value={selectedScope}
                        onChange={(e) => setSelectedScope(e.target.value)}
                    >
                        <option value="">Select Route Scope</option>
                        {['local', 'international'].map(scope => (
                            <option key={scope} value={scope}>{scope}</option>
                        ))}
                    </select>
                    {/* Input for search */}
                    <input
                        type="text"
                        placeholder="Search routes by name"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded text-gray-900"
                    />
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
                                <RouteCreateForm
                                    countries={countries}
                                    users={users}
                                    initialValues={modalMode === 'update' && selectedRoute ? selectedRoute : undefined}
                                    onSubmit={async (form) => {
                                        try {
                                            if (modalMode === 'update' && selectedRoute) {
                                                await updateRoute(selectedRoute._id, form);
                                            } else {
                                                // Ensure routeType is not required
                                                const payload = { ...form, routeType: form.routeType || null };
                                                await axios.post('/api/admin/routes', payload, { withCredentials: true });
                                                toast.success('Route created');
                                                handleRouteChanged();
                                            }
                                            setModalOpen(false);
                                        } catch (err: any) {
                                            toast.error(err?.response?.data?.error || err?.message || 'Error saving route');
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    {/* DataTable for existing routes */}
                    <DataTable<Route>
                        columns={[
                            { key: 'routeName', label: 'Route Name', render: (val, row) => (
                                <a
                                    href={`/admin/routes/update?id=${row._id}`}
                                    className="text-blue-600 hover:underline"
                                    title="Update route"
                                >
                                    {val}
                                </a>
                            )},
                            { key: 'originCity', label: 'Origin', render: (val, row) => {
                                const originCountryName = row.originCountry.name || 'Unknown';
                                return `${row.originCity}, ${originCountryName}`;
                            }},
                            { key: 'destinationCity', label: 'Destination', render: (val, row) => {
                                const destinationCountryName = row.destinationCountry.name || 'Unknown';
                                return `${row.destinationCity}, ${destinationCountryName}`;
                            }},
                            { key: 'scope', label: 'Scope', render: val => <span className="capitalize">{val}</span> },
                            { key: 'category', label: 'Category', render: val => <span className="capitalize">{val}</span> },
                            { key: 'active', label: 'Active', render: (val, row) => (
                                <span
                                    onClick={() => toggleActiveStatus(row._id, !val)}
                                    className={val ? "inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded cursor-pointer" : "inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded cursor-pointer"}
                                >
                                    {val ? 'Yes' : 'No'}
                                </span>
                            ) },
                        ]}
                        data={filteredRoutes}
                        actions={route => (
                            <div className="flex gap-2">
                                <a
                                    href={`/admin/routes/update?id=${route._id}`}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    Edit
                                </a>
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