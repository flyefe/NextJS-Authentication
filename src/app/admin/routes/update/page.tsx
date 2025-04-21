"use client";

import React, { useState, useEffect } from "react";
import { useCountries } from "@/hooks/useCountries";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import OptionRateSection from "@/components/admin/routes/OptionRateSection";

const ROUTE_OPTIONS = [
  { key: "seaRate", label: "Sea", component: OptionRateSection },
  { key: "fastTrackRate", label: "Fast Track", component: OptionRateSection },
  { key: "consoleRate", label: "Console", component: OptionRateSection },
  { key: "expressRate", label: "Express", component: OptionRateSection },
];

export default function UpdateRoutePage() {
  const router = useRouter(); // Router for navigation
  const searchParams = useSearchParams(); // Search parameters for route ID
  const routeId = searchParams.get("id"); // Route ID from URL

  // Holds the raw fetched route object
  const [route, setRoute] = useState<any>(null);

  // Holds the editable form state
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
        expressRate: {},
        fastTrackRate: {},
        consoleRate: {},
        seaRate: {},
      },
    },
    active: true,
  });

  const [rateTab, setRateTab] = useState("seaRate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { countries } = useCountries();

  useEffect(() => {
    const fetchRoute = async () => {
      if (!routeId) return;
      try {
        setLoading(true);
        const res = await axios.get(`/api/admin/routes/${routeId}`, {
          withCredentials: true,
        });

        const data = res.data;

        setRoute(data.route || data); // Save the raw route for reference

        // Utility function to transform backend data for form compatibility
        function transformRouteData(raw: any) {
          // Helper to ensure only primitives for text/select fields
          const toStringOrEmpty = (val: any) => (val === null || val === undefined ? "" : String(val));
          // Helper to ensure numbers (for rates)
          const toNumberOrZero = (val: any) => (val === null || val === undefined ? 0 : Number(val));

          return {
            ...raw,
            // Convert country fields from object to string ID
            originCountry: raw.originCountry?._id || "",
            destinationCountry: raw.destinationCountry?._id || "",
            // Always strings for text/select
            routeName: toStringOrEmpty(raw.routeName),
            routeType: toStringOrEmpty(raw.routeType),
            category: toStringOrEmpty(raw.category),
            originCity: toStringOrEmpty(raw.originCity),
            destinationCity: toStringOrEmpty(raw.destinationCity),
            scope: toStringOrEmpty(raw.scope),
            // Ensure all nested rate configs exist and numbers are numbers
            shippingOptionConfig: {
              availableOptions: {
                expressRate: { ...raw.shippingOptionConfig?.availableOptions?.expressRate },
                fastTrackRate: { ...raw.shippingOptionConfig?.availableOptions?.fastTrackRate },
                consoleRate: { ...raw.shippingOptionConfig?.availableOptions?.consoleRate },
                seaRate: { ...raw.shippingOptionConfig?.availableOptions?.seaRate },
              },
            },
            active: typeof raw.active === "boolean" ? raw.active : true,
          };
        }

        const raw = data.route || data;
        setForm(transformRouteData(raw));
      } catch (err: any) {
        setError("Failed to load route data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [routeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && "checked" in e.target) {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvailableOptionRateChange = (rateKey: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      shippingOptionConfig: {
        ...prev.shippingOptionConfig,
        availableOptions: {
          ...prev.shippingOptionConfig.availableOptions,
          [rateKey]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Simple validation
    if (!form.routeName?.trim()) {
      setError("Route name is required");
      setLoading(false);
      return;
    }

    if (form.scope === "local" && !form.routeType?.trim()) {
      setError("Route type is required for local scope");
      setLoading(false);
      return;
    }

    if (form.scope !== "local") {
      if (!form.originCountry || !form.destinationCountry) {
        setError("Both origin and destination countries are required");
        setLoading(false);
        return;
      }
    }

    try {
      const {
        routeName,
        scope,
        routeType,
        category,
        originCountry,
        originCity,
        destinationCountry,
        destinationCity,
        shippingOptionConfig,
        active
      } = form;

      const payload = {
        routeName,
        scope,
        routeType: scope === "local" ? routeType : null,
        category,
        originCountry,
        originCity,
        destinationCountry,
        destinationCity,
        shippingOptionConfig: {
          availableOptions: {
            expressRate: shippingOptionConfig.availableOptions.expressRate,
            fastTrackRate: shippingOptionConfig.availableOptions.fastTrackRate,
            consoleRate: shippingOptionConfig.availableOptions.consoleRate,
            seaRate: shippingOptionConfig.availableOptions.seaRate,
          }
        },
        active
      };

      // Log payload for debugging
      console.log('Payload being sent to backend:', payload);
      console.log('Express Rate Payload:', payload.shippingOptionConfig.availableOptions.expressRate);

      await axios.put(`/api/admin/routes/${routeId}`, payload, { withCredentials: true });

      setSuccess("Route updated successfully!");
      setTimeout(() => router.push("/admin/routes"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Update Route</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-900">Route Name</label>
            <input
              type="text"
              name="routeName"
              value={form.routeName}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-900">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white text-gray-900"
            >
              <option value="import">Import</option>
              <option value="export">Export</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-900">Scope</label>
            <select
              name="scope"
              value={form.scope}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white text-gray-900"
            >
              <option value="international">International</option>
              <option value="local">Local</option>
            </select>
          </div>

          {form.scope === "local" && (
            <div>
              <label className="block font-semibold mb-1 text-gray-900">Route Type</label>
              <input
                type="text"
                name="routeType"
                value={form.routeType}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 text-gray-900"
              />
            </div>
          )}

          {form.scope === "international" && (
            <>
              <div>
                <label className="block font-semibold mb-1 text-gray-900">Origin Country</label>
                <select
                  name="originCountry"
                  value={form.originCountry}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white text-gray-900"
                >
                  <option value="">Select Origin Country</option>
                  {countries?.map((country) => (
                    <option key={country._id} value={country._id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-900">Origin City</label>
                <input
                  type="text"
                  name="originCity"
                  value={form.originCity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-900">Destination Country</label>
                <select
                  name="destinationCountry"
                  value={form.destinationCountry}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white text-gray-900"
                >
                  <option value="">Select Destination Country</option>
                  {countries?.map((country) => (
                    <option key={country._id} value={country._id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-900">Destination City</label>
                <input
                  type="text"
                  name="destinationCity"
                  value={form.destinationCity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white text-gray-900"
                />
              </div>
            </>
          )}
        </div>

        {/* Rate Tabs */}
        <div>
          <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-900">Shipping Options</h3>
          <div className="flex space-x-2 mb-2">
            {ROUTE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setRateTab(opt.key)}
                className={`px-3 py-1 rounded ${
                  rateTab === opt.key ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="border rounded p-3 bg-gray-50">
            {ROUTE_OPTIONS.map((opt) => {
              if (rateTab !== opt.key) return null;
              const Component = opt.component;
              return (
                <Component
                  key={opt.key}
                  form={(form.shippingOptionConfig.availableOptions as Record<string, any>)?.[opt.key] || {}}
                  setForm={(data: any) => handleAvailableOptionRateChange(opt.key, data)}
                  rateType={opt.key as "seaRate" | "fastTrackRate" | "consoleRate" | "expressRate"}
                />
              );
            })}
          </div>
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}
        {success && <p className="text-green-600 font-medium">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded shadow"
        >
          {loading ? "Updating..." : "Update Route"}
        </button>
      </form>
    </div>
  );
}
