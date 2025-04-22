"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ShipmentOrderFormProps {
    onSubmit?: (formData: any) => void;
    loading?: boolean;
    id?: string; // If present, form is in edit mode
}

interface Route {
    _id: string;
    routeName: string;
}

import { useRouter, useSearchParams } from 'next/navigation';

export default function ShipmentOrderForm({ onSubmit, loading = false, id }: ShipmentOrderFormProps) {
    interface ShipmentOrderFormState {
        customer: string;
        customerPhone: string;
        routeId: string;
        shippingOption: string;
        goodsCategory: string;
        item: string;
        itemDescription: string;
        quantity: number;
        itemCost: number;
        weight: number;
        volume: number;
        containerType: string;
        pickupAddress: string;
        dropOffAddress: string;
        originCountry: string;
        destinationCountry: string;
        amount: number;
        exchangeRateUsed: number;
        comment: string;
        remark: string;
        status: string;
        trackingNumber: string;
        eta: string | null;
        pickupTime: string | null;
        deliveryTime: string | null;
        referenceNumber: string;
        assignedTo: string;
        updatedAt?: string | null; // for edit mode, ISO string for datetime-local
    }

    const [formData, setFormData] = useState<ShipmentOrderFormState>({
        customer: '',
        customerPhone: '',
        routeId: '', //Ensure routeId is set to valid ObjectId
        shippingOption: '', 
        goodsCategory: '',
        item: '',
        itemDescription: '',
        quantity: 0,
        itemCost: 0,
        weight: 0,
        volume: 0,
        containerType: '',
        pickupAddress: '',
        dropOffAddress: '',
        originCountry: '',
        destinationCountry: '',
        amount: 0,
        exchangeRateUsed: 0,
        comment: '',
        remark: '',
        status: 'pending',
        trackingNumber: '',
        eta: null,
        pickupTime: null,
        deliveryTime: null,
        referenceNumber: '',
        assignedTo: '',
    });

    const [routes, setRoutes] = useState<any[]>([]);
    const [activeOptions, setActiveOptions] = useState<string[]>([]);
    const [goodsCategories, setGoodsCategories] = useState<string[]>([]);
    const [isEdit, setIsEdit] = useState(!!id);
    const [loadingShipment, setLoadingShipment] = useState(false);
    const router = useRouter();
    const [customers, setCustomers] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);

    // Helper to format date for datetime-local input
    function toDatetimeLocal(dt: string | Date | null) {
        if (!dt) return "";
        const d = new Date(dt);
        return d.toISOString().slice(0, 16);
    }

    // State to track when routes are loaded
    const [routesLoaded, setRoutesLoaded] = useState(false);
    useEffect(() => {
        axios.get('/api/admin/routes')
            .then(response => {
                setRoutes(response.data.routes);
                setRoutesLoaded(true);
            })
            .catch(error => console.error('Error fetching routes:', error));
    }, []);

    useEffect(() => {
        axios.get('/api/admin/users?role=customer&verified=true')
            .then(response => {
                setCustomers(response.data.users);
                console.log('Customers:', response.data.users);
            })
            .catch(error => console.error('Error fetching customers:', error));

        axios.get('/api/admin/users?role=staff')
            .then(response => {
                setStaff(response.data.users);
                console.log('Staff:', response.data.users);
            })
            .catch(error => console.error('Error fetching staff:', error));
    }, []);

    // Fetch shipment order if editing
    // Wait until both routes and shipment are loaded before populating form for edit
    useEffect(() => {
        if (isEdit && id && routesLoaded) {
            setLoadingShipment(true);
            axios.get(`/api/admin/shipments/${id}`, { withCredentials: true })
                .then(res => {
                    const shipment = res.data.shipment;
                    // Format date fields for datetime-local input
                    shipment.eta = toDatetimeLocal(shipment.eta);
                    shipment.pickupTime = toDatetimeLocal(shipment.pickupTime);
                    shipment.deliveryTime = toDatetimeLocal(shipment.deliveryTime);
                    // Optionally format updatedAt if you use it in a date input
                    if (shipment.updatedAt) shipment.updatedAt = toDatetimeLocal(shipment.updatedAt);
                    else shipment.updatedAt = toDatetimeLocal(new Date());
                    if (shipment.createdAt) shipment.createdAt = toDatetimeLocal(shipment.createdAt);
                    if (Array.isArray(shipment.updateHistory)) {
                        shipment.updateHistory = shipment.updateHistory.map((entry: any) => ({
                            ...entry,
                            updatedAt: entry.updatedAt ? toDatetimeLocal(entry.updatedAt) : null,
                        }));
                    }
                    setFormData(shipment);
                })
                .catch(() => {
                    // handle error
                })
                .finally(() => setLoadingShipment(false));
        }
    }, [isEdit, id, routesLoaded]);

    // When routeId changes, update active shipping options and clear shippingOption
    // When routeId changes, update active shipping options and clear shippingOption
    useEffect(() => {
        if (!formData.routeId) {
            setActiveOptions([]);
            setGoodsCategories([]);
            setFormData((prev: typeof formData) => ({ ...prev, shippingOption: '', goodsCategory: '' }));
            return;
        }
        const selectedRoute = routes.find((r: any) => r._id === formData.routeId);
        if (selectedRoute && selectedRoute.shippingOptionConfig?.availableOptions) {
            const options = [];
            const available = selectedRoute.shippingOptionConfig.availableOptions;
            if (available.expressRate?.active) options.push('Express');
            if (available.seaRate?.active) options.push('Sea');
            if (available.consoleRate?.active) options.push('Console');
            if (available.fastTrackRate?.active) options.push('Fast Track');
            setActiveOptions(options);
            // If editing, do not clear shippingOption/goodsCategory
        } else {
            setActiveOptions([]);
        }
        // Only clear on create, not on edit
        if (!isEdit) {
            setGoodsCategories([]);
            setFormData((prev: typeof formData) => ({ ...prev, shippingOption: '', goodsCategory: '' }));
        }
    }, [formData.routeId, routes, isEdit]);

    // When shippingOption changes, update goodsCategory choices
    // When shippingOption changes, update goodsCategory choices
    useEffect(() => {
        if (!formData.routeId || !formData.shippingOption) {
            setGoodsCategories([]);
            // Only clear on create, not on edit
            if (!isEdit) setFormData((prev: typeof formData) => ({ ...prev, goodsCategory: '' }));
            return;
        }
        const selectedRoute = routes.find((r: any) => r._id === formData.routeId);
        let categories: string[] = [];
        if (selectedRoute && selectedRoute.shippingOptionConfig?.availableOptions) {
            const available = selectedRoute.shippingOptionConfig.availableOptions;
            let rateObj;
            switch (formData.shippingOption) {
                case 'Express':
                    rateObj = available.expressRate; break;
                case 'Sea':
                    rateObj = available.seaRate; break;
                case 'Console':
                    rateObj = available.consoleRate; break;
                case 'Fast Track':
                    rateObj = available.fastTrackRate; break;
                default:
                    rateObj = null;
            }
            if (rateObj && Array.isArray(rateObj.goodsCategory)) {
                categories = rateObj.goodsCategory;
            }
        }
        setGoodsCategories(categories);
        // Only clear on create, not on edit
        if (!isEdit) setFormData((prev: typeof formData) => ({ ...prev, goodsCategory: '' }));
    }, [formData.shippingOption, formData.routeId, routes, isEdit]);

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name as keyof ShipmentOrderFormState]: value }));
    };

    // Handle form submission       
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Clean the form data
        // Convert date fields from string to Date or null
        const cleanedFormData: any = { ...formData };
        // Always set updatedAt to now when updating
        if (isEdit) {
            cleanedFormData.updatedAt = new Date().toISOString();
        } else {
            cleanedFormData.updatedAt = formData.updatedAt ? new Date(formData.updatedAt) : null;
        }
        (['eta', 'pickupTime', 'deliveryTime'] as const).forEach((field) => {
            const value = formData[field];
            cleanedFormData[field] = value ? new Date(value) : null;
        });
        (Object.keys(cleanedFormData) as (keyof ShipmentOrderFormState)[]).forEach((key) => {
            if (cleanedFormData[key] === undefined) {
                cleanedFormData[key] = null;
            }
        });
        // assignedTo should be null if empty
        if (!cleanedFormData.assignedTo) cleanedFormData.assignedTo = null;
        console.log('Cleaned form data being sent:', cleanedFormData); // Log the cleaned form data
        if (!cleanedFormData.customer || !cleanedFormData.routeId || !cleanedFormData.shippingOption || !cleanedFormData.originCountry || !cleanedFormData.destinationCountry || !cleanedFormData.trackingNumber) {
            alert('Please fill in all required fields.');
            return;
        }
        if (isEdit && id) {
            // Update
            try {
                await axios.put(`/api/admin/shipments/${id}`, cleanedFormData, { withCredentials: true });
                toast.success('Shipment order updated successfully');
                router.push('/admin/shipments');
            } catch (err) {
                toast.error('Error updating shipment order');
            }
        } else if (onSubmit) {
            // Create
            try {
                await axios.post('/api/admin/shipments', cleanedFormData, { withCredentials: true });
                toast.success('Shipment order created successfully');
                router.push('/admin/shipments');
            } catch (err) {
                console.error('Error creating shipment order:', err);
                toast.error('Error creating shipment order');
            }
        }
    };

    // Filter staff to include only users who are staff, admin, or shipping staff
    const filteredStaff = staff.filter(member => member.isStaff || member.isAdmin || member.isShipmentStaff);

    return (
        <div className="flex flex-col md:flex-row">
            <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md">
                {/* Top Field */}
                <div className="col-span-2">
                    <label className="block font-semibold mb-1 text-xs text-gray-700">Tracking Number</label>
                    <input
                        type="text"
                        name="trackingNumber"
                        value={formData.trackingNumber}
                        onChange={handleChange}
                        className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                </div>
                {/* Left Column */}
                <div className="space-y-3">
                    <label className="block font-semibold mb-1 text-xs text-gray-700">Customer</label>
                    <select
                        name="customer"
                        value={formData.customer}
                        onChange={handleChange}
                        className="w-full p-1 border border-gray-300 rounded text-gray-700 text-xs bg-gray-100"
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers.map(customer => (
                            <option key={customer._id} value={customer._id} className="text-gray-700">{customer.email}</option>
                        ))}
                    </select>
                    <label className="block font-semibold mb-1 text-xs text-gray-700">Route</label>
                    <select
                        name="routeId"
                        value={formData.routeId}
                        onChange={handleChange}
                        className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        required
                    >
                        <option value="">Select Route</option>
                        {routes.map(route => (
                            <option key={route._id} value={route._id}>{route.routeName}</option>
                        ))}
                    </select>
                    {formData.routeId && (
                        <div>
                            <label className="block font-semibold mb-1 text-xs text-gray-700">Shipping Option</label>
                            <select
                                name="shippingOption"
                                value={formData.shippingOption}
                                onChange={handleChange}
                                className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                                required
                            >
                                <option value="">Select Shipping Option</option>
                                {activeOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Goods Category</label>
                        <select
                            name="goodsCategory"
                            value={formData.goodsCategory}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            required={goodsCategories.length > 0}
                            disabled={goodsCategories.length === 0}
                        >
                            <option value="">{goodsCategories.length === 0 ? 'No categories available' : 'Select Goods Category'}</option>
                            {goodsCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Item</label>
                        <input
                            type="text"
                            name="item"
                            value={formData.item}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Description</label>
                        <input
                            type="text"
                            name="itemDescription"
                            value={formData.itemDescription}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block font-semibold mb-1 text-xs text-gray-700">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 text-xs text-gray-700">Item Cost</label>
                            <input
                                type="number"
                                name="itemCost"
                                value={formData.itemCost}
                                onChange={handleChange}
                                className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Volume (cbm)</label>
                        <input
                            type="number"
                            name="volume"
                            value={formData.volume}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Container Type</label>
                        <select
                            name="containerType"
                            value={formData.containerType}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        >
                            <option value="">Select Container Type</option>
                            <option value="20ft">20ft</option>
                            <option value="40ft">40ft</option>
                            <option value="40ft High Cube">40ft High Cube</option>
                            <option value="45ft High Cube">45ft High Cube</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                {/* Right Column */}
                <div className="space-y-3">
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Customer Phone</label>
                        <input
                            type="text"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Pickup Address</label>
                        <input
                            type="text"
                            name="pickupAddress"
                            value={formData.pickupAddress}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Delivery Address</label>
                        <input
                            type="text"
                            name="dropOffAddress"
                            value={formData.dropOffAddress}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Origin Country</label>
                        <input
                            type="text"
                            name="originCountry"
                            value={formData.originCountry}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Destination Country</label>
                        <input
                            type="text"
                            name="destinationCountry"
                            value={formData.destinationCountry}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">ETA</label>
                        <input
                            type="date"
                            name="eta"
                            value={formData.eta ? formData.eta.substring(0,10) : ''}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Pickup Time</label>
                        <input
                            type="datetime-local"
                            name="pickupTime"
                            value={formData.pickupTime ?? ''}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Delivery Time</label>
                        <input
                            type="datetime-local"
                            name="deliveryTime"
                            value={formData.deliveryTime ?? ''}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Reference Number</label>
                        <input
                            type="text"
                            name="referenceNumber"
                            value={formData.referenceNumber}
                            onChange={handleChange}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-xs text-gray-700">Comment</label>
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLTextAreaElement>)}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                    </div>
                </div>
               
                 {/* Action Column */}
                <div className="w-full md:w-1/4 p-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold shadow"
                        disabled={loading || loadingShipment}
                    >
                        {loading || loadingShipment ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Shipment Order' : 'Create Shipment Order')}
                    </button>
                    <div className="mt-4 space-y-3">
                        <div>
                            <label className="block font-semibold mb-1 text-xs text-gray-700">Assigned Staff</label>
                            <select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                className="w-full p-1 border border-gray-300 rounded text-gray-700 text-xs bg-gray-100"
                            >
                                <option value="">Select Staff</option>
                                {filteredStaff.map(member => (
                                    <option key={member._id} value={member._id} className="text-gray-700">{member.email}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 text-xs text-gray-700">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs bg-gray-100"
                            >
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 text-xs text-gray-700">Remark</label>
                            <textarea
                                name="remark"
                                value={formData.remark}
                                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLTextAreaElement>)}
                                className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </div>
                        {isEdit && (
                            <div>
                                <label className="block font-semibold mb-1 text-xs text-gray-700">Updated At</label>
                                <input
                                    type="datetime-local"
                                    name="updatedAt"
                                    value={formData.updatedAt}
                                    onChange={handleChange}
                                    className="w-full p-1 border border-gray-300 rounded text-gray-700 text-xs bg-gray-100"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block font-semibold mb-1 text-xs text-gray-700">Updated By</label>
                            <select
                                name="updatedBy"
                                value={formData.updatedBy}
                                onChange={handleChange}
                                className="w-full p-1 border border-gray-300 rounded text-gray-700 text-xs bg-gray-100"
                            >
                                <option value="">Select Staff</option>
                                {filteredStaff.map(member => (
                                    <option key={member._id} value={member._id} className="text-gray-700">{member.email}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

// Editable row for update history
function UpdateHistoryRow({ entry, idx, formData, setFormData }: any) {
    const [editMode, setEditMode] = useState(false);
    const [comment, setComment] = useState(entry.comment || "");
    const handleSave = () => {
        const newHistory = [...formData.updateHistory];
        newHistory[idx] = { ...entry, comment };
        setFormData((prev: typeof formData) => ({ ...prev, updateHistory: newHistory }));
        setEditMode(false);
    };
    return (
        <tr>
            <td className="border p-2">{new Date(entry.updatedAt).toLocaleString()}</td>
            <td className="border p-2">{entry.updatedBy || '-'}</td>
            <td className="border p-2">{Object.keys(entry.changes || {}).join(', ')}</td>
            <td className="border p-2">
                <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(entry.changes, null, 2)}</pre>
            </td>
            <td className="border p-2">
                {editMode ? (
                    <input
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="p-1 border rounded w-full"
                    />
                ) : (
                    entry.comment || '-'
                )}
            </td>
            <td className="border p-2">
                {editMode ? (
                    <button className="text-blue-600 mr-2" onClick={handleSave}>Save</button>
                ) : (
                    <button className="text-blue-600" onClick={() => setEditMode(true)}>Edit</button>
                )}
                {editMode && (
                    <button className="text-gray-600 ml-2" onClick={() => setEditMode(false)}>Cancel</button>
                )}
            </td>
        </tr>
    );
}