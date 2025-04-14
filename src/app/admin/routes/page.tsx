'use client';

import axios from "axios"; // For making HTTP requests to your API
import { toast } from "react-hot-toast"; // For showing notifications to the user
import { useRouter } from "next/navigation"; // For navigation/redirection
import { useEffect, useState } from 'react';
import ModelCreateUpdateForm from '@/components/ModelCreateUpdateForm'; // Import the generic form

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

    // Callback to refresh the routes list after creating a new route
    const handleRouteCreated = () => {
        setLoading(true);
        axios.get('/api/admin/routes', { withCredentials: true })
            .then(res => {
                setRoutes(res.data.routes);
            })
            .catch(err => {
                setError('Unauthorized or error fetching routes');
            })
            .finally(() => setLoading(false));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Admin: Routes</h1>
            {/* Render the create route form */}
            <div className="mb-8">
                <ModelCreateUpdateForm
                    model="route"
                    mode="create"
                    onSuccess={handleRouteCreated}
                />
            </div>
            {/* Table of existing routes */}
            <table className="min-w-full border">
                <thead>
                    <tr>
                        <th>Route Name</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Type</th>
                        <th>Active</th>
                        <th>Actions</th> {/* For future update/delete */}
                    </tr>
                </thead>
                <tbody>
                    {routes.map(route => (
                        <tr key={route._id}>
                            <td>{route.routeName}</td>
                            <td>{route.originCity}, {route.originCountry}</td>
                            <td>{route.destinationCity}, {route.destinationCountry}</td>
                            <td>{route.routeType}</td>
                            <td>{route.active ? 'Yes' : 'No'}</td>
                            <td>
                                {/* Future: Add update/delete buttons here */}
                                {/* <button onClick={() => handleEdit(route._id)}>Edit</button>
                                <button onClick={() => handleDelete(route._id)}>Delete</button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}