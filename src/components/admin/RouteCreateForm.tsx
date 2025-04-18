import React, { useState } from 'react';
import ExpressRateSection from './ExpressRateSection';
import OptionRateSection from './OptionRateSection';
import ShippingConfigSection from './ShippingConfigSection';

const ROUTE_OPTIONS = [
  { key: 'seaCBM', label: 'Sea CBM', component: OptionRateSection },
  { key: 'seaFCL', label: 'Sea FCL', component: OptionRateSection },
  { key: 'seaLCL', label: 'Sea LCL', component: OptionRateSection },
  { key: 'airExpress', label: 'Air Express', component: ExpressRateSection },
  { key: 'airFastTrack', label: 'Air Fast Track', component: OptionRateSection },
  { key: 'airConsole', label: 'Air Console', component: OptionRateSection },
];

// Define a type for the form state
interface FormState {
  originCountry?: string;
  originCity?: string;
  destinationCountry?: string;
  destinationCity?: string;
  routeType?: string;
  scope?: string;
  routeName?: string;
  active?: boolean;
  createdBy?: string;
  updatedBy?: string;
  expressRate: Record<string, number>;
  optionRate: Record<string, number>;
  shippingConfig: {
    [key: string]: any;
    availableOptions?: string[];
    goodsCategory?: string[];
    subCharge?: number;
    vatPercent?: number;
  };
  activeRateTab?: string;
}

// Component for basic route information
interface Country {
  _id: string;
  name: string;
  code?: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

const BasicRouteInfoSection = ({ form, setForm, countries, users }: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  countries: Country[];
  users: User[];
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-2">Basic Route Information</h3>
      <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Rate Configuration for Route Options */}
      <div className="col-span-2">
        <h3 className="text-lg font-bold mb-2 mt-4">Configure Rates for Route Options</h3>
        <div className="mb-4">
          <div className="flex space-x-2 mb-2">
            {ROUTE_OPTIONS.map((opt, idx) => (
              <button
                key={opt.key}
                type="button"
                className={`px-3 py-1 rounded ${form.activeRateTab === opt.key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}
                onClick={() => setForm(f => ({ ...f, activeRateTab: opt.key }))}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="border rounded p-3 bg-gray-50">
            {ROUTE_OPTIONS.map(opt => {
              if (form.activeRateTab !== opt.key) return null;
              const RateComponent = opt.component;
              return (
                <RateComponent
                  key={opt.key}
                  form={form.shippingConfig?.[opt.key] || {}}
                  setForm={rateVals => setForm(f => ({
                    ...f,
                    shippingConfig: {
                      ...f.shippingConfig,
                      [opt.key]: rateVals
                    }
                  }))}
                />
              );
            })}
          </div>
        </div>
      </div>
        <div>
          <label className="block text-gray-900">Origin Country</label>
          <select
            name="originCountry"
            value={form.originCountry || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
            required
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-900">Origin City</label>
          <input
            type="text"
            name="originCity"
            value={form.originCity || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-gray-900">Destination Country</label>
          <select
            name="destinationCountry"
            value={form.destinationCountry || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
            required
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-900">Destination City</label>
          <input
            type="text"
            name="destinationCity"
            value={form.destinationCity || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-gray-900">Route Name</label>
          <input
            type="text"
            name="routeName"
            value={form.routeName || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
            required
          />
        </div>
        {form.scope === 'local' && (
          <div>
            <label className="block text-gray-900">Route Type</label>
            <select
              name="routeType"
              value={form.routeType || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white text-gray-900"
              required
            >
              <option value="">Select</option>
              <option value="intra-city">Intra-city</option>
              <option value="inter-city">Inter-city</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-gray-900">Scope</label>
          <select
            name="scope"
            value={form.scope || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
            required
          >
            <option value="">Select</option>
            <option value="local">Local</option>
            <option value="international">International</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-900">Category</label>
          <select
            name="category"
            value={form.category || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
            required
          >
            <option value="">Select</option>
            <option value="import">Import</option>
            <option value="export">Export</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-900">Active</label>
          <input
            type="checkbox"
            name="active"
            checked={form.active ?? true}
            onChange={handleChange}
            className="ml-2"
          />
        </div>
        <div>
          <label className="block text-gray-900">Created By</label>
          <select
            name="createdBy"
            value={form.createdBy || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-900">Updated By</label>
          <select
            name="updatedBy"
            value={form.updatedBy || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Main form component for creating a route
interface RouteCreateFormProps {
  countries: Country[];
  users: User[];
  initialValues?: Partial<FormState>;
  onSubmit: (form: FormState) => void;
}

const RouteCreateForm: React.FC<RouteCreateFormProps> = ({ countries, users, initialValues, onSubmit }) => {
  const [form, setForm] = useState<FormState>(
    initialValues ? { ...{
      expressRate: {},
      optionRate: {},
      shippingConfig: {},
      active: true,
    }, ...initialValues } : {
      expressRate: {},
      optionRate: {},
      shippingConfig: {},
      active: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Summary card for origin/destination
  const getCountryName = (id?: string) => countries.find(c => c._id === id)?.name || '';

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{initialValues ? 'Edit Route' : 'Create New Route'}</h2>
      <div className="mb-4 p-3 bg-gray-100 rounded flex items-center gap-4">
        <span className="font-semibold">Route:</span>
        <span>{getCountryName(form.originCountry)} {form.originCity ? `(${form.originCity})` : ''} <span className="mx-2">→</span> {getCountryName(form.destinationCountry)} {form.destinationCity ? `(${form.destinationCity})` : ''}</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicRouteInfoSection form={form} setForm={setForm} countries={countries} users={users} />
        <ExpressRateSection form={form} setForm={setForm} />
        <OptionRateSection form={form} setForm={setForm} />
        <ShippingConfigSection form={form} setForm={setForm} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {initialValues ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default RouteCreateForm;