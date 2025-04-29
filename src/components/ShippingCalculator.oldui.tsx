// LEGACY UI - ShippingCalculator
// This is a backup of the previous UI for reference.
"use client";
import { useState, useEffect } from "react";
import { useRoutes, Route } from "@/hooks/useRoutes";
import { calculateAllShippingOptions, ShippingEstimate } from "@/lib/utils/shippingCalculator";

export default function ShippingCalculator() {
  const [direction, setDirection] = useState<"import" | "export">("import");
  const [routeId, setRouteId] = useState("");
  const [option, setOption] = useState("");
  const [kg, setKg] = useState(0);
  const [volume, setVolume] = useState(0);
  const [container, setContainer] = useState<string | null>(null);
  const { routes, loading, error } = useRoutes();
  const filteredRoutes = routes.filter(r => r.category === direction);
  const selectedRoute = filteredRoutes.find(r => r._id === routeId);
  const availableOptions: string[] = selectedRoute?.shippingOptionConfig?.availableOptions
    ? Object.keys(selectedRoute.shippingOptionConfig.availableOptions).filter(opt => selectedRoute.shippingOptionConfig?.availableOptions && selectedRoute.shippingOptionConfig.availableOptions[opt]?.active)
    : [];
  const estimates: ShippingEstimate[] = selectedRoute
    ? calculateAllShippingOptions({ route: selectedRoute, kg, volume, container })
    : [];

  if (loading) return <div className="p-4 text-gray-900">Loading routes...</div>;
  if (error) return <div className="p-4 text-red-500 text-gray-900">Error loading routes: {error}</div>;
  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2 text-gray-900">Shipping Calculator</h2>
      <div className="mb-2">
        <label className="block font-semibold text-xs mb-1 text-gray-700">Direction</label>
        <select value={direction} onChange={e => { setDirection(e.target.value as any); setRouteId(""); setOption(""); }} className="w-full p-1 border rounded text-xs text-gray-900 bg-white">
          <option value="import" className="text-gray-900">Import</option>
          <option value="export" className="text-gray-900">Export</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block font-semibold text-xs mb-1 text-gray-700">Route</label>
        <select value={routeId} onChange={e => { setRouteId(e.target.value); setOption(""); }} className="w-full p-1 border rounded text-xs text-gray-900 bg-white">
          <option value="">Select Route</option>
          {filteredRoutes.map(r => <option key={r._id} value={r._id}>{r.routeName}</option>)}
        </select>
      </div>
      {selectedRoute && (
        <div className="mb-2">
          <label className="block font-semibold text-xs mb-1 text-gray-700">Shipping Option</label>
          <select value={option} onChange={e => setOption(e.target.value)} className="w-full p-1 border rounded text-xs text-gray-900 bg-white">
            <option value="">Select Option</option>
            {availableOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      )}
      <div className="mb-2">
        <label className="block font-semibold text-xs mb-1 text-gray-700">Weight (kg)</label>
        <input type="number" value={kg} onChange={e => setKg(Number(e.target.value))} className="w-full p-1 border rounded text-xs text-gray-900 bg-white" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold text-xs mb-1 text-gray-700">Volume (cbm)</label>
        <input type="number" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full p-1 border rounded text-xs text-gray-900 bg-white" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold text-xs mb-1 text-gray-700">Container (optional)</label>
        <select value={container || ""} onChange={e => setContainer(e.target.value || null)} className="w-full p-1 border rounded text-xs text-gray-900 bg-white">
          <option value="">None</option>
          <option value="FCL" className="text-gray-900">FCL</option>
          <option value="LCL" className="text-gray-900">LCL</option>
        </select>
      </div>
      {selectedRoute && (
        <div className="mb-4">
          <label className="block font-semibold text-xs mb-1 text-gray-700">Quotes</label>
          <div className="space-y-2">
            {estimates.map(est => (
              <div key={est.option} className="border p-2 rounded bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="font-semibold text-gray-900">{est.option}</span>
                <span>Cost: <span className="font-mono text-gray-900">${est.amount.toFixed(2)}</span></span>
                <span>ETA: {est.eta} days</span>
                <button className="bg-blue-600 text-white px-2 py-1 rounded mt-2 md:mt-0" onClick={() => alert(`Proceed to booking for ${est.option}`)}>Book</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
