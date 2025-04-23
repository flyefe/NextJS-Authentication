"use client";
import { useState, useEffect } from "react";
import { useRoutes, Route } from "@/hooks/useRoutes";

// Fetch routes using SWR (route hook)




import { calculateAllShippingOptions, ShippingEstimate } from "@/utils/shippingCalculator";


// Note: Route type is imported from utils/shippingCalculator.ts for consistency
export default function ShippingCalculator() {
  const [direction, setDirection] = useState<"import" | "export">("import");
  const [routeId, setRouteId] = useState("");
  const [option, setOption] = useState("");
  const [kg, setKg] = useState(0);
  const [volume, setVolume] = useState(0);
  const [container, setContainer] = useState<string | null>(null);
  const { routes, loading, error } = useRoutes();
  // Filter routes by direction (category: 'import'/'export')
  const filteredRoutes = routes.filter(r => r.category === direction);
  const selectedRoute = filteredRoutes.find(r => r._id === routeId);
  // Extract available options safely
  const availableOptions: string[] = selectedRoute?.shippingOptionConfig?.availableOptions
    ? Object.keys(selectedRoute.shippingOptionConfig.availableOptions).filter(opt => selectedRoute.shippingOptionConfig?.availableOptions && selectedRoute.shippingOptionConfig.availableOptions[opt]?.active)
    : [];

  // Use shared utility to calculate all estimates for this route
  const estimates: ShippingEstimate[] = selectedRoute
    ? calculateAllShippingOptions({ route: selectedRoute, kg, volume, container })
    : [];

  if (loading) return <div className="p-4">Loading routes...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading routes: {error}</div>;
  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Shipping Calculator</h2>
      <div className="mb-2">
        <label className="block font-semibold text-xs mb-1">Direction</label>
        <select value={direction} onChange={e => { setDirection(e.target.value as any); setRouteId(""); setOption(""); }} className="w-full p-1 border rounded text-xs">
          <option value="import">Import</option>
          <option value="export">Export</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block font-semibold text-xs mb-1">Route</label>
        <select value={routeId} onChange={e => { setRouteId(e.target.value); setOption(""); }} className="w-full p-1 border rounded text-xs">
          <option value="">Select Route</option>
          {filteredRoutes.map(r => <option key={r._id} value={r._id}>{r.routeName}</option>)}
        </select>
      </div>
      {selectedRoute && (
        <div className="mb-2">
          <label className="block font-semibold text-xs mb-1">Shipping Option</label>
          <select value={option} onChange={e => setOption(e.target.value)} className="w-full p-1 border rounded text-xs">
            <option value="">Select Option</option>
            {availableOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      )}
      <div className="mb-2">
        <label className="block font-semibold text-xs mb-1">Weight (kg)</label>
        <input type="number" value={kg} onChange={e => setKg(Number(e.target.value))} className="w-full p-1 border rounded text-xs" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold text-xs mb-1">Volume (cbm)</label>
        <input type="number" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full p-1 border rounded text-xs" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold text-xs mb-1">Container (optional)</label>
        <select value={container || ""} onChange={e => setContainer(e.target.value || null)} className="w-full p-1 border rounded text-xs">
          <option value="">None</option>
          <option value="FCL">FCL</option>
          <option value="LCL">LCL</option>
        </select>
      </div>
      {selectedRoute && (
        <div className="mb-4">
          <label className="block font-semibold text-xs mb-1">Quotes</label>
          <div className="space-y-2">
            {estimates.map(est => (
              <div key={est.option} className="border p-2 rounded bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="font-semibold">{est.option}</span>
                <span>Cost: <span className="font-mono">${est.cost.toFixed(2)}</span></span>
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
