"use client";

import React, { useState, useEffect } from "react";
import OptionRateSection from "@/components/admin/routes/OptionRateSection";
import ExpressRateSection from "@/components/admin/ExpressRateSection";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

// Types for route details (should match your Route model)
type AddressObj = {
  _id: string;
  street?: string;
  [key: string]: any;
};

interface UserObj {
  _id: string;
  username?: string;
  email?: string;
}

type CountryObj = {
  _id: string;
  name: string;
};

type RouteDetails = {
  _id: string;
  routeName: string;
  originCountry: string | CountryObj;
  originCity: string;
  destinationCountry: string | CountryObj;
  destinationCity: string;
  routeType?: string;
  scope: string;
  category: 'import' | 'export';
  shippingConfig?: any;
  active: boolean;
  createdBy?: string | UserObj;
  updatedBy?: string | UserObj;
  originAddress?: string | AddressObj;
  destinationAddress?: string | AddressObj;
  createdAt?: string;
  updatedAt?: string;
};

export default function RouteDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeId = searchParams.get("id");
  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<RouteDetails>>({});
  const [countries, setCountries] = useState<{ _id: string; name: string }[]>([]);
  const [routeTypes, setRouteTypes] = useState<string[]>([]);
  const [rateTab, setRateTab] = useState('seaCBM');

  // Fetch countries and route types
  useEffect(() => {
    axios.get('/api/admin/countries', { withCredentials: true })
      .then(res => setCountries(res.data.countries || []));
    axios.get('/api/admin/routes', { withCredentials: true })
      .then(res => {
        const uniqueRouteTypes = Array.from(new Set<string>(res.data.routes.map((r: any) => r.routeType)));
        setRouteTypes(uniqueRouteTypes);
      });
  }, []);

  // Fetch route details
  useEffect(() => {
    if (!routeId) return;
    setLoading(true);
    axios.get(`/api/admin/routes/${routeId}`, { withCredentials: true })
      .then(res => {
        setRoute(res.data.route);
        setForm(res.data.route);
      })
      .catch(() => toast.error("Failed to fetch route details"))
      .finally(() => setLoading(false));
  }, [routeId]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Update route
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeId) return;
    setLoading(true);
    try {
      await axios.put(`/api/admin/routes/${routeId}`, form, { withCredentials: true });
      toast.success("Route updated successfully");
      setEditing(false);
      // Refetch updated details
      const res = await axios.get(`/api/admin/routes/${routeId}`, { withCredentials: true });
      setRoute(res.data.route);
      setForm(res.data.route);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update route");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !route) {
    return (
      <div className="text-center p-8">Loading...</div>
    );
  }

  if (!route) {
    return (
      <div className="text-center p-8">Route not found.</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Route Details</h2>
      {!editing ? (
        <div>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-200 rounded-lg text-gray-900 bg-white">
              <tbody>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2 font-bold">Attribute</th>
                <th className="text-left px-4 py-2 font-bold">Value</th>
              </tr>
              <tr><td className="px-4 py-2 font-semibold">Route Name</td><td className="px-4 py-2">{route.routeName}</td></tr>
              <tr className="bg-gray-50"><td className="px-4 py-2 font-semibold">Scope</td><td className="px-4 py-2">{route.scope}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">Route Type</td><td className="px-4 py-2">{route.routeType}</td></tr>
              <tr className="bg-gray-50"><td className="px-4 py-2 font-semibold">Origin Country</td><td className="px-4 py-2">{typeof route.originCountry === 'object' && route.originCountry !== null ? route.originCountry.name : route.originCountry}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">Origin City</td><td className="px-4 py-2">{route.originCity}</td></tr>
              <tr className="bg-gray-50"><td className="px-4 py-2 font-semibold">Destination Country</td><td className="px-4 py-2">{typeof route.destinationCountry === 'object' && route.destinationCountry !== null ? route.destinationCountry.name : route.destinationCountry}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">Destination City</td><td className="px-4 py-2">{route.destinationCity}</td></tr>
              <tr className="bg-gray-50"><td className="px-4 py-2 font-semibold">Origin Address</td><td className="px-4 py-2">{route.originAddress ? (typeof route.originAddress === 'object' ? route.originAddress?.street || route.originAddress?._id : route.originAddress) : '-'}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">Destination Address</td><td className="px-4 py-2">{route.destinationAddress ? (typeof route.destinationAddress === 'object' ? route.destinationAddress?.street || route.destinationAddress?._id : route.destinationAddress) : '-'}</td></tr>
              <tr className="bg-gray-50"><td className="px-4 py-2 font-semibold">Category</td><td className="px-4 py-2">{route.category}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">Shipping Config</td><td className="px-4 py-2">{route.shippingConfig ? <pre className="whitespace-pre-wrap text-xs bg-gray-100 rounded p-2">{JSON.stringify(route.shippingConfig, null, 2)}</pre> : '-'}</td></tr>
              <tr className="bg-gray-50"><td className="px-4 py-2 font-semibold">Active</td><td className="px-4 py-2">{route.active ? 'Yes' : 'No'}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">Created By</td><td className="px-4 py-2">{route.createdBy ? (typeof route.createdBy === 'object' ? route.createdBy?.username || route.createdBy?._id : route.createdBy) : '-'}</td></tr>
              <tr className="bg-gray-50"><td className="px-4 py-2 font-semibold">Updated By</td><td className="px-4 py-2">{route.updatedBy ? (typeof route.updatedBy === 'object' ? route.updatedBy?.username || route.updatedBy?._id : route.updatedBy) : '-'}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">Updated At</td><td className="px-4 py-2">{route.updatedAt ? new Date(route.updatedAt).toLocaleString() : '-'}</td></tr>
              <tr className="bg-gray-50"><td className="px-4 py-2 font-semibold">Created At</td><td className="px-4 py-2">{route.createdAt ? new Date(route.createdAt).toLocaleString() : '-'}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">_id</td><td className="px-4 py-2">{route._id}</td></tr>
            </tbody>
          </table>
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Rates Configuration</h3>
            <div className="flex space-x-2 mb-2">
              {[
                { key: 'seaCBM', label: 'Sea CBM' },
                { key: 'seaFCL', label: 'Sea FCL' },
                { key: 'seaLCL', label: 'Sea LCL' },
                { key: 'airExpress', label: 'Air Express' },
                { key: 'airFastTrack', label: 'Air Fast Track' },
              ].map(opt => (
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
              <pre className="whitespace-pre-wrap text-xs bg-gray-100 rounded p-2">
                {JSON.stringify(route.shippingConfig?.[rateTab] || {}, null, 2)}
              </pre>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setEditing(true)}>Edit</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Rates Configuration</h3>
            <div className="flex space-x-2 mb-2">
              {[
                { key: 'seaCBM', label: 'Sea CBM', component: OptionRateSection },
                { key: 'seaFCL', label: 'Sea FCL', component: OptionRateSection },
                { key: 'seaLCL', label: 'Sea LCL', component: OptionRateSection },
                { key: 'airExpress', label: 'Air Express', component: ExpressRateSection },
                { key: 'airFastTrack', label: 'Air Fast Track', component: OptionRateSection },
              ].map(opt => (
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
              {[
                { key: 'seaCBM', component: OptionRateSection },
                { key: 'seaFCL', component: OptionRateSection },
                { key: 'seaLCL', component: OptionRateSection },
                { key: 'airExpress', component: ExpressRateSection },
                { key: 'airFastTrack', component: OptionRateSection },
              ].map(opt => {
                if (rateTab !== opt.key) return null;
                const RateComponent = opt.component;
                return (
                  <RateComponent
                    key={opt.key}
                    form={form.shippingConfig?.[opt.key] || {}}
                    setForm={(rateVals: any) => setForm(f => ({
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
          <div>
            <label className="block text-gray-900">Name</label>
            <input type="text" name="routeName" value={form.routeName || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required />
          </div>
          {/* ...rest of form fields... */}
        </form>
      );
              ].map(opt => {
                if (rateTab !== opt.key) return null;
                const RateComponent = opt.component;
                return (
                  <RateComponent
                    key={opt.key}
                    form={form.shippingConfig?.[opt.key] || {}}
                    setForm={(rateVals: any) => setForm(f => ({
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
          <div>
            <label className="block text-gray-900">Name</label>
            <input type="text" name="routeName" value={form.routeName || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required />
          </div>
          <div>
            <label className="block text-gray-900">Origin Country</label>
            <select
              name="originCountry"
              value={typeof form.originCountry === 'object' && form.originCountry !== null ? form.originCountry._id : form.originCountry || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white text-gray-900"
              required
            >
              <option value="">Select Country</option>
              {countries.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-900">Origin City</label>
            <input type="text" name="originCity" value={form.originCity || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required />
          </div>
          <div>
            <label className="block text-gray-900">Destination Country</label>
            <select
              name="destinationCountry"
              value={typeof form.destinationCountry === 'object' && form.destinationCountry !== null ? form.destinationCountry._id : form.destinationCountry || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white text-gray-900"
              required
            >
              <option value="">Select Country</option>
              {countries.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-900">Destination City</label>
            <input type="text" name="destinationCity" value={form.destinationCity || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required />
          </div>
          {form.scope === 'local' && (
            <div>
              <label className="block text-gray-900">Route Type</label>
              <select
                name="routeType"
                value={form.routeType || ""}
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
            <input type="text" name="scope" value={form.scope || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white text-gray-900" required />
          </div>
          <div>
            <label className="block text-gray-900">Active</label>
            <input type="checkbox" name="active" checked={form.active || false} onChange={handleChange} className="ml-2" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setEditing(false); setForm(route); }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
