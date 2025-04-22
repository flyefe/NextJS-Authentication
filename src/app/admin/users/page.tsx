'use client';

import axios from "axios"; // For making HTTP requests to your API
import { toast } from "react-hot-toast"; // For showing notifications to the user
import { useRouter } from "next/navigation"; // For navigation/redirection
import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DataTable from '@/components/admin/DataTable';
import ModelCreateUpdateForm from '@/components/admin/ModelCreateUpdateForm';

// TypeScript type for a user object
type User = {
    _id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    isVerified: boolean;
    address: string;
    phoneNumber: string;
    NIN: string;
    createdAt: string;
    updatedAt: string;
};

export default function AdminUsersPage() { 
    const [users, setUsers] = useState<User[]>([]); // State to store the list of users
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(''); // State to track errors
    const router = useRouter();

    // Check authentication and fetch users
    useEffect(() => {
        // Fetch users from the backend API
        axios.get('/api/admin/users', { withCredentials: true }) // Sends cookies (JWT) for authentication
            .then(res => {
                setUsers(res.data.users);
            })
            .catch(err => {
                const errorMessage = err.response?.data?.error || 'Error fetching users';
                setError(errorMessage);
                // If unauthorized, you might want to redirect to login
                if (err.response?.status === 401) {
                    // router.push('/login');
                }
            })
            .finally(() => setLoading(false));
    }, []);

    // Modal state for create/update
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Callback to refresh the users list after creating/updating/deleting a user
    const handleUserChanged = () => {
        setLoading(true);
        axios.get('/api/admin/users', { withCredentials: true })
            .then(res => {
                setUsers(res.data.users);
            })
            .catch(err => {
                const errorMessage = err.response?.data?.error || 'Error fetching users';
                setError(errorMessage);
            })
            .finally(() => setLoading(false));
        setModalOpen(false);
        setSelectedUser(null);
    };

    // Open modal for creating a new user
    const openCreateModal = () => {
        setModalMode('create');
        setSelectedUser(null);
        setModalOpen(true);
    };

    // Function to open the update modal and fetch user data
    const openUpdateModal = async (userId) => {
        try {
            const response = await axios.get(`/api/admin/users/${userId}`, { withCredentials: true });
            const userData = response.data.user;
            console.log('Fetched user data for update:', userData); // Log the fetched user data
            console.log('Selected user data for update:', userData);
            setModalMode('update');
            setSelectedUser(userData);
            setModalOpen(true);
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to fetch user data');
        }
    };

    // Delete a user
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`, { withCredentials: true });
            toast.success('User deleted');
            handleUserChanged();
        } catch (err: any) {
            toast.error('Error deleting user');
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
                        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Admin: Users</h1>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold shadow"
                            onClick={openCreateModal}
                        >
                            + Add User
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
                                    model="user"
                                    mode={modalMode}
                                    id={selectedUser?._id}
                                    initialValues={selectedUser}
                                    onSuccess={handleUserChanged}
                                />
                            </div>
                        </div>
                    )}
                    {/* DataTable for existing users */}
                    <DataTable<User>
                        columns={[
                            { key: 'username', label: 'Username' },
                            { key: 'email', label: 'Email' },
                            { key: 'isAdmin', label: 'Admin', render: val => (
                                <span className={val ? "inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded" : "inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded"}>
                                    {val ? 'Yes' : 'No'}
                                </span>
                            ) },
                            { key: 'isVerified', label: 'Verified', render: val => (
                                <span className={val ? "inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded" : "inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded"}>
                                    {val ? 'Yes' : 'No'}
                                </span>
                            ) },
                            { key: 'address', label: 'Address' },
                            { key: 'phoneNumber', label: 'Phone' },
                            { key: 'NIN', label: 'NIN' },
                            { key: 'createdAt', label: 'Created', render: val => new Date(val).toLocaleString() },
                            { key: 'updatedAt', label: 'Updated', render: val => new Date(val).toLocaleString() },
                        ]}
                        data={users}
                        actions={user => (
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                    onClick={() => openUpdateModal(user._id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    onClick={() => handleDelete(user._id)}
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
