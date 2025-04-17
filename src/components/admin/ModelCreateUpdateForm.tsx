'use client';

import { useState } from 'react'; // This function is used to create and manage state in React components.
import axios from 'axios'; // This function is used to make HTTP requests.
import { toast } from 'react-hot-toast'; // This function is used to display toast notifications.
import { pluralizeModel } from '@/utils/PluralizeModels'; // This function is used to pluralize model names.

// Supported models and their fields
type ModelType = 'user' | 'adminSettings' | 'auditLog' | 'country'; // This function is used to define the types of models that can be created or updated.

// Add all discovered models and their fields here
// Each field should match the backend model as closely as possible
const modelFields: Record<ModelType, { label: string; name: string; type: string; required?: boolean; options?: { value: string; label: string }[] }[]> = {
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
    
  ],
};

// Exclude the route model from being handled by this form
const supportedModels: ModelType[] = ['user', 'adminSettings', 'auditLog', 'country'];

// Generic form for create/update
interface ModelFormProps {
  model: ModelType; // Include 'route' in the model type
  mode?: 'create' | 'update';
  initialValues?: Record<string, any>;
  id?: string;
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
  model,
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
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handles form submission for both create and update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let endpoint = `/api/admin/${pluralizeModel(model)}`;
      if (mode === 'update' && id) endpoint += `/${id}`;
      const method = mode === 'update' ? 'put' : 'post';
      // Remove empty string values for select fields before submitting
      const cleanedForm = { ...form };
      if (cleanedForm.routeType === "") delete cleanedForm.routeType;
      if (cleanedForm.scope === "") delete cleanedForm.scope;
      await axios({
        url: endpoint,
        method,
        data: cleanedForm,
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
      <h2 className="text-xl font-bold mb-4 text-blue-900">
        {mode === 'update' ? 'Update' : 'Add New'} {model.charAt(0).toUpperCase() + model.slice(1)}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {supportedModels.includes(model) && modelFields[model].map((field) => (
          <div key={field.name}>
            <label className="block mb-1 text-gray-700">{field.label}{field.required && ' *'}</label>
            {field.type === 'select' ? (
              <select
                className="w-full border rounded px-3 py-2 text-gray-700"
                name={field.name}
                value={form[field.name] || ''}
                required={field.required}
                onChange={handleChange}
                disabled={loading}
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                className="w-full border rounded px-3 py-2 text-gray-700"
                type={field.type}
                name={field.name}
                value={field.type === 'checkbox' ? undefined : form[field.name] || ''}
                checked={field.type === 'checkbox' ? !!form[field.name] : undefined}
                required={field.required}
                onChange={handleChange}
                disabled={loading}
              />
            )}
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
