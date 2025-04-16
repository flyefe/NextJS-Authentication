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
    export: {
        availableOptions: string[];
        allowedGoods: string[];
        kgRates: {
            '0.5': number;
            '1.0': number;
            '1.5': number;
            '2.0': number;
            '2.5': number;
            '3.0': number;
            '3.5': number;
            '4.0': number;
            '4.5': number;
            '5.0': number;
        };
        extraHalfKgRate: number;
        exchangeRate: number;
        fastTrackRate: {
            '1-5kg': string;
            '6-10kg': string;
            'above10kg': string;
        };
        consoleRate: {
            '1-5kg': string;
            '6-10kg': string;
            'above10kg': string;
        };
        seaRate: number;
        '20ftRate': number;
        '40ftRate': number;
        customClearanceRate: number;
    };
    import: {
        availableOptions: string[];
        allowedGoods: string[];
        kgRates: {
            '0.5': number;
            '1.0': number;
            '1.5': number;
            '2.0': number;
            '2.5': number;
            '3.0': number;
            '3.5': number;
            '4.0': number;
            '4.5': number;
            '5.0': number;
        };
        extraHalfKgRate: number;
        exchangeRate: number;
        fastTrackRate: {
            '1-5kg': string;
            '6-10kg': string;
            'above10kg': string;
        };
        consoleRate: {
            '1-5kg': string;
            '6-10kg': string;
            'above10kg': string;
        };
        seaRate: number;
        '20ftRate': number;
        '40ftRate': number;
        customClearanceRate: number;
    };
};

export default function AdminCountryPage() { 
    const [countries, setCountries] = useState<Country[]>([]); // State to store the list of countries
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(''); // State to track errors
    const [searchQuery, setSearchQuery] = useState(''); // State to track search query
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const router = useRouter();

    // Check authentication and fetch countries
    useEffect(() => {
        // Fetch countries from the backend API
        axios.get('/api/admin/countries', { withCredentials: true }) // Sends cookies (JWT) for authentication
            .then(res => {
                setCountries(res.data.countries);
            })
            .catch(err => {
                setError('Unauthorized or error fetching countries');
                // If not authorized, you might want to redirect to login
                if (err.response?.status === 401) {
                    // router.push('/login');
                }
            })
            .finally(() => setLoading(false));
    }, []);

    // Filtered countries based on search query
    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Modal state for create/update
    const [modalMode, setModalMode] = useState<'create' | 'update'>('create');

    // Callback to refresh the countries list after creating/updating/deleting a country
    const handleCountryChanged = () => {
        setLoading(true);
        axios.get('/api/admin/countries', { withCredentials: true })
            .then(res => {
                setCountries(res.data.countries);
            })
            .catch(err => {
                setError('Unauthorized or error fetching countries');
            })
            .finally(() => setLoading(false));
        setModalOpen(false);
        setSelectedCountry(null);
    };

    // Open modal for creating a new country
    const openCreateModal = () => {
        setModalMode('create');
        setSelectedCountry(null);
        setModalOpen(true);
    };

    // Open modal for updating a country
    const openUpdateModal = (country: Country) => {
        setModalMode('update');
        setSelectedCountry(country);
        setModalOpen(true);
    };

    // Delete a country
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this country?')) return;
        try {
            await axios.delete(`/api/admin/countries/${id}`, { withCredentials: true });
            toast.success('Country deleted');
            handleCountryChanged();
        } catch (err: any) {
            toast.error('Error deleting country');
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
                        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Admin: Countries</h1>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold shadow"
                            onClick={openCreateModal}
                        >
                            + Add Country
                        </button>
                    </div>
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
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
                                <ModelCreateUpdateForm
                                    model="country"
                                    mode={modalMode}
                                    id={modalMode === 'update' ? selectedCountry?._id : undefined}
                                    initialValues={modalMode === 'update' && selectedCountry ? selectedCountry : {}}
                                    onSuccess={handleCountryChanged}
                                />
                            </div>
                        </div>
                    )}
                    {/* DataTable for existing countries */}
                    <DataTable<Country>
                        columns={[
                            { key: 'name', label: 'Country Name' },
                            { key: 'code', label: 'Country Code' },
                            { key: 'export', label: 'Export Options', render: val => val.availableOptions.join(', ') },
                            { key: 'import', label: 'Import Options', render: val => val.availableOptions.join(', ') },
                        ]}
                        data={filteredCountries}
                        actions={country => (
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                    onClick={() => openUpdateModal(country)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    onClick={() => handleDelete(country._id)}
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