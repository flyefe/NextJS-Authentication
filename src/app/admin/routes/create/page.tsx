"use client";

import React, { useState } from "react";
import { useCountries } from "@/hooks/useCountries";
import axios from "axios";
import { useRouter } from "next/navigation";
import OptionRateSection from "@/components/admin/OptionRateSection";
import ExpressRateSection from "@/components/admin/ExpressRateSection";

const ROUTE_OPTIONS = [
  { key: 'seaRate', label: 'Sea', component: OptionRateSection },
  { key: 'fastTrackRate', label: 'Fast Track', component: OptionRateSection },
  { key: 'consoleRate', label: 'Console', component: OptionRateSection },
  { key: 'expressRate', label: 'Express', component: ExpressRateSection },
];

export default function CreateRoutePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    routeName: "",
    scope: "international",
    routeType: "",
    category: "import",
    originCountry: "",
    originCity: "",
    destinationCountry: "",
    destinationCity: "",
    shippingOptionConfig: {
      availableOptions: {
        expressRate: { goodsCategory: [] },
        fastTrackRate: { goodsCategory: [] },
        consoleRate: { goodsCategory: [] },
        seaRate: { goodsCategory: [] },
      },
      subCharge: 0,
      vatPercent: 0,
    },
    active: true,
  });
  const [rateTab, setRateTab] = useState('seaRate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { countries, loading: countriesLoading, error: countriesError } = useCountries();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && 'checked' in e.target) {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleShippingOptionConfigChange = (key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      shippingOptionConfig: {
        ...prev.shippingOptionConfig,
        [key]: value,
      },
    }));
  };

  const handleAvailableOptionRateChange = (rateKey: string, value: any) => {
    setForm(prev => ({
      ...prev,
      shippingOptionConfig: {
        ...prev.shippingOptionConfig,
        availableOptions: {
          ...prev.shippingOptionConfig.availableOptions,
          [rateKey]: value,
        },
        // goodsCategory, subCharge, vatPercent are unchanged
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("/api/admin/routes", form, { withCredentials: true });
      setSuccess("Route created successfully!");
      setTimeout(() => router.push("/admin/routes"), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Create New Route</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-900">Route Name</label>
            <input type="text" name="routeName" value={form.routeName} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required />
          </div>
          <div>
            <label className="block text-gray-900">Scope</label>
            <select name="scope" value={form.scope} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required>
              <option value="">Select</option>
              <option value="local">Local</option>
              <option value="international">International</option>
            </select>
          </div>
          {form.scope === 'local' && (
            <div>
              <label className="block text-gray-900">Route Type</label>
              <select name="routeType" value={form.routeType} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required>
                <option value="">Select</option>
                <option value="intra-city">Intra-city</option>
                <option value="inter-city">Inter-city</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-gray-900">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required>
              <option value="">Select</option>
              <option value="import">Import</option>
              <option value="export">Export</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-900">Origin Country</label>
            <select
              name="originCountry"
              value={form.originCountry}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white text-gray-900"
              required
              disabled={countriesLoading}
            >
              <option value="">{countriesLoading ? "Loading..." : "Select"}</option>
              {countries.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-900">Origin City</label>
            <input type="text" name="originCity" value={form.originCity} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required />
          </div>
          <div>
            <label className="block text-gray-900">Destination Country</label>
            <select
              name="destinationCountry"
              value={form.destinationCountry}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white text-gray-900"
              required
              disabled={countriesLoading}
            >
              <option value="">{countriesLoading ? "Loading..." : "Select"}</option>
              {countries.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-900">Destination City</label>
            <input type="text" name="destinationCity" value={form.destinationCity} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2 mt-4">Configure Rates for Shipping Options</h3>
          <div className="flex space-x-2 mb-2">
            {ROUTE_OPTIONS.map(opt => (
              <button
                key={opt.key}
                type="button"
                className={`px-3 py-1 rounded ${rateTab === opt.key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}
                onClick={() => setRateTab(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="border rounded p-3 bg-gray-50">
            {ROUTE_OPTIONS.map(opt => {
              if (rateTab !== opt.key) return null;
              const RateComponent = opt.component;
              if (RateComponent === OptionRateSection) {
                return (
                  <RateComponent
                    key={opt.key}
                    form={(form.shippingOptionConfig.availableOptions as Record<string, any>)?.[opt.key] || {}}
                    setForm={(rateVals: any) => handleAvailableOptionRateChange(opt.key, rateVals)}
                    rateType={opt.key as 'seaRate' | 'fastTrackRate' | 'consoleRate'}
                  />
                );
              } else {
                return (
                  <RateComponent
                    key={opt.key}
                    form={(form.shippingOptionConfig.availableOptions as Record<string, any>)?.[opt.key] || {}}
                    setForm={(rateVals: any) => handleAvailableOptionRateChange(opt.key, rateVals)}
                  />
                );
              }
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-gray-900">Sub Charge</label>
            <input type="number" value={form.shippingOptionConfig.subCharge || 0} onChange={e => handleShippingOptionConfigChange('subCharge', parseFloat(e.target.value) || 0)} className="w-full border rounded px-3 py-2 bg-white text-gray-900" />
          </div>
          <div>
            <label className="block text-gray-900">VAT Percent</label>
            <input type="number" value={form.shippingOptionConfig.vatPercent || 0} onChange={e => handleShippingOptionConfigChange('vatPercent', parseFloat(e.target.value) || 0)} className="w-full border rounded px-3 py-2 bg-white text-gray-900" />
          </div>
        </div>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        {success && <div className="text-green-600 font-semibold">{success}</div>}
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded" disabled={loading}>
          {loading ? "Creating..." : "Create Route"}
        </button>
      </form>
    </div>
  );
}

