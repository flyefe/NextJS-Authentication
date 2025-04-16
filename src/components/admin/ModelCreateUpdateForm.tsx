'use client';

import { useState } from 'react'; // This function is used to create and manage state in React components.
import axios from 'axios'; // This function is used to make HTTP requests.
import { toast } from 'react-hot-toast'; // This function is used to display toast notifications.

// Supported models and their fields
type ModelType = 'route' | 'user' | 'shipment' | 'adminSettings' | 'auditLog' | 'country' | 'localRoute'; // This function is used to define the types of models that can be created or updated.

// Add all discovered models and their fields here
// Each field should match the backend model as closely as possible
const modelFields: Record<ModelType, { label: string; name: string; type: string; required?: boolean; options?: { value: string; label: string }[] }[]> = {
  route: [
    { label: 'Origin Country', name: 'originCountry', type: 'text', required: false },
    { label: 'Origin City', name: 'originCity', type: 'text', required: false },
    { label: 'Destination Country', name: 'destinationCountry', type: 'text', required: false },
    { label: 'Destination City', name: 'destinationCity', type: 'text', required: false },
    { label: 'Route Name', name: 'routeName', type: 'text' },
    { label: 'Description', name: 'description', type: 'text' },
    { label: 'Scope', name: 'scope', type: 'select', required: false, options: [
      { value: '', label: 'Select' },
      { value: 'local', label: 'Local' },
      { value: 'international', label: 'International' }
    ] },
    { label: 'Route Type', name: 'routeType', type: 'select', required: false, options: [
      { value: '', label: 'Select' },
      { value: 'intra-city', label: 'Intra-city' },
      { value: 'inter-city', label: 'Inter-city' }
    ] },
    { label: 'Subcharge', name: 'subCharge', type: 'number' },
    { label: 'VAT Percent', name: 'vatPercent', type: 'number' },
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
    { label: 'Origin Country', name: 'origin.country', type: 'text', required: true },
    { label: 'Origin City', name: 'origin.city', type: 'text', required: true },
    { label: 'Origin Address Line', name: 'origin.addressLine', type: 'text' },
    { label: 'Origin State', name: 'origin.state', type: 'text' },
    { label: 'Origin Postal Code', name: 'origin.postalCode', type: 'text' },
    { label: 'Origin Phone Number', name: 'origin.phoneNumber', type: 'text' },
    { label: 'Origin Contact Name', name: 'origin.contactName', type: 'text' },
    { label: 'Destination Country', name: 'destination.country', type: 'text', required: true },
    { label: 'Destination City', name: 'destination.city', type: 'text', required: true },
    { label: 'Destination Address Line', name: 'destination.addressLine', type: 'text' },
    { label: 'Destination Postal Code', name: 'destination.postalCode', type: 'text' },
    { label: 'Destination Phone Number', name: 'destination.phoneNumber', type: 'text' },
    { label: 'Destination Contact Name', name: 'destination.contactName', type: 'text' },
    { label: 'Goods Category', name: 'goodsCategory', type: 'select', required: true, options: [
      { value: 'Has Battery', label: 'Has Battery' },
      { value: 'Other', label: 'Other' }
    ] },
    { label: 'Weight (kg)', name: 'weightKg', type: 'number', required: true },
    { label: 'Volume (CBM)', name: 'volumeCbm', type: 'number', required: true },
    { label: 'Shipping Option', name: 'shippingOption', type: 'select', required: true, options: [
      { value: 'Express', label: 'Express' },
      { value: 'Fast Track', label: 'Fast Track' },
      { value: 'Console', label: 'Console' }
    ] },
    { label: 'Total Cost', name: 'totalCost', type: 'number', required: true },
    { label: 'Currency', name: 'currency', type: 'text', required: true },
    { label: 'Status', name: 'status', type: 'select', required: true, options: [
      { value: 'Pending', label: 'Pending' },
      { value: 'Processing', label: 'Processing' },
      { value: 'In Transit', label: 'In Transit' },
      { value: 'Delivered', label: 'Delivered' },
      { value: 'Cancelled', label: 'Cancelled' }
    ] },
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
    { label: 'Export Options', name: 'export.availableOptions', type: 'text' },
    { label: 'Export Allowed Goods', name: 'export.allowedGoods', type: 'text' },
    { label: 'Export KG Rates', name: 'export.kgRates', type: 'text' },
    { label: 'Export Extra Half KG Rate', name: 'export.extraHalfKgRate', type: 'number' },
    { label: 'Export Exchange Rate', name: 'export.exchangeRate', type: 'number' },
    { label: 'Export Fast Track Rate', name: 'export.fastTrackRate', type: 'text' },
    { label: 'Export Console Rate', name: 'export.consoleRate', type: 'text' },
    { label: 'Export Sea Rate', name: 'export.seaRate', type: 'number' },
    { label: 'Export 20ft Rate', name: 'export.20ftRate', type: 'number' },
    { label: 'Export 40ft Rate', name: 'export.40ftRate', type: 'number' },
    { label: 'Export Custom Clearance Rate', name: 'export.customClearanceRate', type: 'number' },
    { label: 'Import Options', name: 'import.availableOptions', type: 'text' },
    { label: 'Import Allowed Goods', name: 'import.allowedGoods', type: 'text' },
    { label: 'Import KG Rates', name: 'import.kgRates', type: 'text' },
    { label: 'Import Extra Half KG Rate', name: 'import.extraHalfKgRate', type: 'number' },
    { label: 'Import Exchange Rate', name: 'import.exchangeRate', type: 'number' },
    { label: 'Import Fast Track Rate', name: 'import.fastTrackRate', type: 'text' },
    { label: 'Import Console Rate', name: 'import.consoleRate', type: 'text' },
    { label: 'Import Sea Rate', name: 'import.seaRate', type: 'number' },
    { label: 'Import 20ft Rate', name: 'import.20ftRate', type: 'number' },
    { label: 'Import 40ft Rate', name: 'import.40ftRate', type: 'number' },
    { label: 'Import Custom Clearance Rate', name: 'import.customClearanceRate', type: 'number' },
  ],
  localRoute: [], // Deprecated
};

// Generic form for create/update
interface ModelFormProps {
  model: ModelType; // This function is used to define the type of model that is being created or updated.
  mode?: 'create' | 'update'; // This function is used to define the mode of the form (create or update).
  initialValues?: Record<string, any>; // This function is used to define the initial values of the form. (for update)
  id?: string; // Only needed for update
  onSuccess?: () => void; // This function is used to define the callback function to be called when the form is successfully submitted.
}

/**
 * ModelCreateUpdateForm can be used for both creating and updating any model.
 * - Pass `mode="create"` for creating, `mode="update"` for updating.
 * - Pass `initialValues` for updating (pre-fills form).
 * - Pass `id` for updating (used in API endpoint).
 * - Pass `onSuccess` callback to refresh parent data.
 */
const ModelCreateUpdateForm = ({
  model = 'route', // Default model is route
  mode = 'create', // Default mode is create
  initialValues = {}, // Default initial values is empty
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
        {modelFields[model].map((field) => (
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
