'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Supported models and their fields
type ModelType = 'route' | 'user' | 'shipment' | 'adminSettings' | 'auditLog' | 'country' | 'localRoute';

// Add all discovered models and their fields here
// Each field should match the backend model as closely as possible
const modelFields: Record<ModelType, { label: string; name: string; type: string; required?: boolean }[]> = {
  route: [
    { label: 'Origin Country', name: 'originCountry', type: 'text', required: true },
    { label: 'Origin City', name: 'originCity', type: 'text', required: true },
    { label: 'Destination Country', name: 'destinationCountry', type: 'text', required: true },
    { label: 'Destination City', name: 'destinationCity', type: 'text', required: true },
    { label: 'Route Name', name: 'routeName', type: 'text' },
    { label: 'Description', name: 'description', type: 'text' },
    { label: 'Route Type', name: 'routeType', type: 'text', required: true },
    { label: 'Active', name: 'active', type: 'checkbox' },
  ],
  user: [
    { label: 'Username', name: 'username', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Password', name: 'password', type: 'password', required: true },
    { label: 'Is Admin', name: 'isAdmin', type: 'checkbox' },
    { label: 'Is Verified', name: 'isVerified', type: 'checkbox' },
    { label: 'Address', name: 'address', type: 'text' },
    { label: 'Phone Number', name: 'phoneNumber', type: 'text' },
    { label: 'NIN', name: 'NIN', type: 'text' },
  ],
  shipment: [
    { label: 'User ID', name: 'userId', type: 'text', required: true },
    { label: 'Route ID', name: 'routeId', type: 'text', required: true },
    { label: 'Origin Country', name: 'originCountry', type: 'text', required: true },
    { label: 'Origin City', name: 'originCity', type: 'text', required: true },
    { label: 'Destination Country', name: 'destinationCountry', type: 'text', required: true },
    { label: 'Destination City', name: 'destinationCity', type: 'text', required: true },
    { label: 'Weight', name: 'weight', type: 'number', required: true },
    { label: 'Volume (CBM)', name: 'volumeCbm', type: 'number', required: true },
    { label: 'Shipping Option', name: 'shippingOption', type: 'text', required: true },
    { label: 'Type', name: 'type', type: 'text', required: true },
    { label: 'Total Cost', name: 'totalCost', type: 'number', required: true },
    { label: 'Currency', name: 'currency', type: 'text', required: true },
    { label: 'Status', name: 'status', type: 'text', required: true },
  ],
  adminSettings: [
    { label: 'Default Exchange Rate', name: 'defaultExchangeRate', type: 'number' },
    { label: 'Default VAT', name: 'defaultVAT', type: 'number' },
    { label: 'Default SubCharge', name: 'defaultSubCharge', type: 'number' },
    { label: 'Maintenance Mode', name: 'maintenanceMode', type: 'checkbox' },
    { label: 'Supported Options (comma separated)', name: 'supportedOptions', type: 'text' },
  ],
  auditLog: [
    { label: 'Actor ID', name: 'actorId', type: 'text' },
    { label: 'Action', name: 'action', type: 'text' },
    { label: 'Target Type', name: 'targetType', type: 'text' },
    { label: 'Target ID', name: 'targetId', type: 'text' },
    { label: 'Field Changed', name: 'fieldChanged', type: 'text' },
    { label: 'Before (JSON)', name: 'before', type: 'text' },
    { label: 'After (JSON)', name: 'after', type: 'text' },
  ],
  country: [
    { label: 'Country Name', name: 'name', type: 'text', required: true },
    { label: 'Country Code', name: 'code', type: 'text', required: true },
    // For export/import configs, you may want to use a separate form or JSON input
  ],
  localRoute: [
    { label: 'Origin City', name: 'originCity', type: 'text', required: true },
    { label: 'Destination City', name: 'destinationCity', type: 'text', required: true },
    { label: 'Country', name: 'country', type: 'text', required: true },
    { label: 'Option', name: 'option', type: 'text', required: true },
    { label: 'Active', name: 'active', type: 'checkbox' },
    { label: 'SubCharge Percent', name: 'subChargePercent', type: 'number' },
    { label: 'VAT Percent', name: 'vatPercent', type: 'number' },
  ],
};

// Generic form for create/update
interface ModelFormProps {
  model: ModelType;
  mode?: 'create' | 'update';
  initialValues?: Record<string, any>;
  id?: string; // Only needed for update
  onSuccess?: () => void;
}

/**
 * ModelCreateUpdateForm can be used for both creating and updating any model.
 * - Pass `mode="create"` for creating, `mode="update"` for updating.
 * - Pass `initialValues` for updating (pre-fills form).
 * - Pass `id` for updating (used in API endpoint).
 * - Pass `onSuccess` callback to refresh parent data.
 */
const ModelCreateUpdateForm = ({
  model = 'route',
  mode = 'create',
  initialValues = {},
  id,
  onSuccess,
}: ModelFormProps) => {
  // State for form fields, initialized with initialValues for update, or empty for create
  const [form, setForm] = useState<Record<string, any>>(initialValues);
  const [loading, setLoading] = useState(false);

  // Handles input changes for all fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handles form submission for both create and update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let endpoint = `/api/admin/${model}s`;
      if (mode === 'update' && id) endpoint += `/${id}`;
      const method = mode === 'update' ? 'put' : 'post';
      await axios({
        url: endpoint,
        method,
        data: form,
        withCredentials: true,
      });
      toast.success(`${model.charAt(0).toUpperCase() + model.slice(1)} ${mode === 'update' ? 'updated' : 'created'}!`);
      setForm({});
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Error ' + (mode === 'update' ? 'updating' : 'creating') + ' ' + model);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {mode === 'update' ? 'Update' : 'Add New'} {model.charAt(0).toUpperCase() + model.slice(1)}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {modelFields[model].map((field) => (
          <div key={field.name}>
            <label className="block mb-1">{field.label}{field.required && ' *'}</label>
            <input
              className="w-full border rounded px-3 py-2"
              type={field.type}
              name={field.name}
              value={field.type === 'checkbox' ? undefined : form[field.name] || ''}
              checked={field.type === 'checkbox' ? !!form[field.name] : undefined}
              required={field.required}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (mode === 'update' ? 'Updating...' : 'Submitting...') : (mode === 'update' ? 'Update' : 'Create')}
        </button>
      </form>
    </div>
  );
};

export default ModelCreateUpdateForm;
