// RouteCreateForm.tsx
//
// This file defines the form UI and logic for creating or editing a shipping route in the admin panel.
// The form is broken down into logical sections for basic route info, rate configuration, and shipping config.
// Each section is encapsulated in its own component for clarity and reusability.
//
// Main Sections:
// - BasicRouteInfoSection: Handles route name, type, origin/destination, currency, exchange rate, and goods category.
// - OptionRateSection: Allows admin to configure rates for each available shipping option (e.g. Sea, Air, Fast Track).
// - ShippingConfigSection: Handles advanced shipping configuration options.
//
// The main RouteCreateForm component manages the form state and handles submission.
//
// See comments throughout for more details on each section's responsibilities.

import React, { useState } from 'react';
import OptionRateSection from './OptionRateSection';
import ShippingConfigSection from '../ShippingConfigSection';
import Country from '@/models/countryModel';

const ROUTE_OPTIONS = [
  { key: 'seaCBM', label: 'Sea CBM', component: OptionRateSection },
  { key: 'seaFCL', label: 'Sea FCL', component: OptionRateSection },
  { key: 'seaLCL', label: 'Sea LCL', component: OptionRateSection },
  { key: 'airExpress', label: 'Air Express', component: OptionRateSection },
  { key: 'airFastTrack', label: 'Air Fast Track', component: OptionRateSection },
  { key: 'airConsole', label: 'Air Console', component: OptionRateSection },
];

// Define a type for the form state


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

// Section 1: BasicRouteInfoSection
// - Collects all the core route details: name, type, origin/destination, currency, exchange rate, and goods category.
// - Handles user input and updates the main form state via setForm.
const BasicRouteInfoSection = ({ form, setForm, countries, users }: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  countries: Country[];
  users: User[];
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'goodsCategory') {
      setForm((prev) => ({ ...prev, goodsCategory: value.split(',').map((s) => s.trim()) }));
    } else if (type === 'checkbox' && 'checked' in e.target) {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-2">Basic Route Information</h3>
      <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exchange Rate and Currency */}
        <div>
          <label className="block text-gray-900">Exchange Rate</label>
          <input
            type="number"
            name="exchangeRate"
            value={form.exchangeRate ?? 1}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
            step="any"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-gray-900">Currency</label>
          <input
            type="text"
            name="currency"
            value={form.currency ?? 'USD'}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
            required
          />
        </div>
        {/* Origin and Destination Fields */}
        <div>
        <label className="block text-gray-900">Currency</label>
          <input
            type="text"
            name="currency"
            value={form.currency ?? 'USD'}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-gray-900"
            required
          />
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

        {/* Goods Category */}
        <div>
          <label className="block text-gray-700">Goods Category (comma separated)</label>
          <input
            type="text"
            name="goodsCategory"
            value={Array.isArray(form.goodsCategory) ? form.goodsCategory.join(', ') : ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-gray-900"
          />
        </div>
        
        {/* Rate Configuration for Route Options */}
        {/*
           Section 2: OptionRateSection
           - Lets the admin configure rates for each shipping option (e.g. Sea, Air, Fast Track).
           - Tabs for each option, with a dedicated rate input form for each.
         */}
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
                    form={form.shippingConfig?.availableOptions?.[opt.key] || {}}
                    setForm={(rateVals) => setForm((f) => ({
                      ...f,
                      shippingConfig: {
                        ...f.shippingConfig,
                        availableOptions: {
                          ...f.shippingConfig?.availableOptions,
                          [opt.key]: rateVals,
                        },
                      },
                    }))}
                    rateType={opt.key as 'seaRate' | 'fastTrackRate' | 'consoleRate' | 'expressRate'}
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
//
// RouteCreateForm is the top-level component that assembles all form sections, manages state, and handles submission.
// It passes the form state and update functions down to each section.
interface RouteCreateFormProps {
  countries: Country[];
  users: User[];
  initialValues?: Partial<FormState>;
  onSubmit: (form: FormState) => void;
}

const RouteCreateForm: React.FC<RouteCreateFormProps> = ({ countries, users, initialValues, onSubmit }) => {
  const [form, setForm] = useState<FormState>({
    expressRate: {},
    optionRate: {},
    shippingConfig: {},
    active: true,
    exchangeRate: 1,
    currency: 'USD',
    ...(initialValues || {}),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data being posted:', form); // Log the form data
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