import React, { useState } from 'react';
import ExpressRateSection from './ExpressRateSection';
import OptionRateSection from './OptionRateSection';
import ShippingConfigSection from './ShippingConfigSection';

// Define a type for the form state
interface FormState {
  originCountry?: string;
  originCity?: string;
  destinationCountry?: string;
  destinationCity?: string;
  routeType?: string;
  expressRate: Record<string, number>;
  optionRate: Record<string, number>;
  shippingConfig: {
    availableOptions?: string[];
    allowedGoods?: string[];
    subCharge?: number;
    vatPercent?: number;
  };
}

// Component for basic route information
const BasicRouteInfoSection = ({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-2">Basic Route Information</h3>
      <div className="space-y-2">
        <div>
          <label className="block text-gray-700">Origin Country</label>
          <input
            type="text"
            name="originCountry"
            value={form.originCountry || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Origin City</label>
          <input
            type="text"
            name="originCity"
            value={form.originCity || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Destination Country</label>
          <input
            type="text"
            name="destinationCountry"
            value={form.destinationCountry || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Destination City</label>
          <input
            type="text"
            name="destinationCity"
            value={form.destinationCity || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Route Type</label>
          <select
            name="routeType"
            value={form.routeType || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="intra-city">Intra-city</option>
            <option value="inter-city">Inter-city</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Main form component for creating a route
const RouteCreateForm = () => {
  const [form, setForm] = useState<FormState>({
    expressRate: {},
    optionRate: {},
    shippingConfig: {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', form);
    // Example: Submit to backend
    // axios.post('/api/routes', form)
    //   .then(response => console.log('Route created:', response))
    //   .catch(error => console.error('Error creating route:', error));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Route</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicRouteInfoSection form={form} setForm={setForm} />
        <ExpressRateSection form={form} setForm={setForm} />
        <OptionRateSection form={form} setForm={setForm} />
        <ShippingConfigSection form={form} setForm={setForm} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RouteCreateForm; 