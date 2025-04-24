"use client";
import { useState, useEffect } from "react";
import { useRoutes, Route } from "@/hooks/useRoutes";
import { calculateAllShippingOptions, ShippingEstimate } from "@/utils/shippingCalculator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ShippingCalculator() {
  const [direction, setDirection] = useState<"import" | "export">("import");
  const [routeId, setRouteId] = useState("");
  const [shippingMode, setShippingMode] = useState<"air" | "sea" | "">("");
  const [kg, setKg] = useState<number>(0);
  const [container, setContainer] = useState<string>("");
  const [volume, setVolume] = useState<number>(0);

  const { routes, loading, error } = useRoutes();
  const filteredRoutes = routes.filter(r => r.category === direction);
  const selectedRoute = filteredRoutes.find(r => r._id === routeId);

  // Determine available containers for sea shipping
  let availableContainers: string[] = ["LCL", "20ft", "40ft", "40ftHighCube", "45ftHighCube"];
  // Only show containers that are in the config for the selected route
  if (selectedRoute && selectedRoute.shippingOptionConfig?.availableOptions?.seaRate) {
    const seaConfig = selectedRoute.shippingOptionConfig.availableOptions.seaRate;
    availableContainers = [
      ...(seaConfig.ratePerCBM ? ["LCL"] : []),
      ...(seaConfig.ratePer20ft ? ["20ft"] : []),
      ...(seaConfig.ratePer40ft ? ["40ft"] : []),
      ...(seaConfig.ratePer40ftHighCube ? ["40ftHighCube"] : []),
      ...(seaConfig.ratePer45ftHighCube ? ["45ftHighCube"] : []),
    ];
  }

  // Calculate estimates using the utility, but filter for air/sea options as needed
  let estimates: ShippingEstimate[] = [];
  if (selectedRoute) {
    if (shippingMode === "air") {
      estimates = calculateAllShippingOptions({ route: selectedRoute, kg, volume: 0, container: null }).filter(e => e.option === "Express" || e.option === "Fast Track" || e.option === "Console");
    } else if (shippingMode === "sea") {
      // For LCL, pass volume; for FCL, pass container
      if (container === "LCL") {
        estimates = calculateAllShippingOptions({ route: selectedRoute, kg: 0, volume, container });
      } else if (container) {
        estimates = calculateAllShippingOptions({ route: selectedRoute, kg: 0, volume: 0, container });
      } else {
        estimates = calculateAllShippingOptions({ route: selectedRoute, kg: 0, volume: 0, container: null });
      }
      estimates = estimates.filter(e => e.option === "Sea");
    }
  }

  if (loading) return <div className="p-4 text-gray-900">Loading routes...</div>;
  if (error) return <div className="p-4 text-red-500 text-gray-900">Error loading routes: {error}</div>;

  // Use the first estimate as the selected one for details (or undefined if none)
  const selectedEstimate = estimates[0];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 ml-8">Shipping Cost Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left: Route & Inputs */}
        <Card className="p-4 flex flex-col gap-4">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Route</CardTitle>
          </CardHeader>
          {/* Step 1: Direction */}
          <div className="flex gap-2 mb-2">
            <RadioGroup value={direction} onValueChange={val => { setDirection(val as any); setRouteId(""); setShippingMode(""); setKg(0); setContainer(""); setVolume(0); }} className="flex gap-2">
              <div className="flex items-center gap-1 text-gray-900">
                <RadioGroupItem value="import" id="import" />
                <label htmlFor="import" className="text-sm text-gray-900">Import</label>
              </div>
              <div className="flex items-center gap-1 text-gray-900">
                <RadioGroupItem value="export" id="export" />
                <label htmlFor="export" className="text-sm text-gray-900">Export</label>
              </div>
            </RadioGroup>
          </div>
          {/* Step 2: Route select */}
          <div className="mb-2">
            <label className="block text-sm mb-1 text-gray-900">Route</label>
            <Select value={routeId} onValueChange={val => { setRouteId(val); setShippingMode(""); setKg(0); setContainer(""); setVolume(0); }}>
              <SelectTrigger className="text-gray-900" >
                <SelectValue placeholder="Select Route" className="text-gray-900" />
              </SelectTrigger>
              <SelectContent className="text-gray-900" >
                {filteredRoutes.map(r => (
                  <SelectItem className="text-gray-900" key={r._id} value={r._id!}>{r.routeName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Step 3: Shipping mode */}
          {selectedRoute && (
            <div className="mb-2">
              <label className="block text-sm mb-1 text-gray-900">Shipping Mode</label>
              <RadioGroup value={shippingMode} onValueChange={val => { setShippingMode(val as any); setKg(0); setContainer(""); setVolume(0); }} className="flex gap-4">
                <div className="flex items-center gap-1 text-gray-900">
                  <RadioGroupItem value="air" id="air" />
                  <label htmlFor="air" className="text-sm text-gray-900">Air</label>
                </div>
                <div className="flex items-center gap-1 text-gray-900">
                  <RadioGroupItem value="sea" id="sea" />
                  <label htmlFor="sea" className="text-sm text-gray-900">Sea</label>
                </div>
              </RadioGroup>
            </div>
          )}
          {/* Step 4: Mode-specific fields */}
          {selectedRoute && shippingMode === "air" && (
            <div className="mb-2">
              <label className="block text-sm mb-1 text-gray-900">Weight (kg)</label>
              <Input className="text-gray-900 placeholder:text-gray-900" type="number" min={0} value={kg} onChange={e => setKg(Number(e.target.value))} />
            </div>
          )}
          {selectedRoute && shippingMode === "sea" && (
            <>
              <div className="mb-2">
                <label className="block text-sm mb-1 text-gray-900">Container Type</label>
                <Select value={container} onValueChange={val => { setContainer(val); setVolume(0); }}>
                  <SelectTrigger className="text-gray-900" >
                    <SelectValue placeholder="Select Container" className="text-gray-900" />
                  </SelectTrigger>
                  <SelectContent className="text-gray-900" >
                    {availableContainers.map(c => (
                      <SelectItem className="text-gray-900" key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {container === "LCL" && (
                <div className="mb-2">
                  <label className="block text-sm mb-1 text-gray-900">Volume (CBM)</label>
                  <Input className="text-gray-900 placeholder:text-gray-900" type="number" min={0} value={volume} onChange={e => setVolume(Number(e.target.value))} />
                </div>
              )}
            </>
          )}
          <button className="bg-blue-700  rounded px-4 py-2 font-semibold mt-4 hover:bg-blue-800 transition">Calculate Shipping Cost</button>
        </Card>

        {/* Middle: Available Options */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-base text-gray-900">Available Options</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-black">
            {estimates.map(est => (
              <Card
                key={est.option}
                className="border-2 border-gray-200 p-3 mb-2"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-lg text-gray-900">{est.option.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                  <span className="text-2xl font-bold text-blue-900">₦{est.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  <span className="text-xs text-gray-600">ETA: {est.eta} business days</span>
                  <span className="text-xs text-blue-700 underline cursor-pointer">View details</span>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Right: Selected Option Details */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-base text-blue-900 flex items-center gap-2">
              <span className="text-gray-900">$</span>
              <span className="text-gray-900">{selectedEstimate ? `₦${selectedEstimate.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '--'}</span>
            </CardTitle>
            <div className="text-gray-900 text-xs">Estimated Time of Arrival: {selectedEstimate ? `${selectedEstimate.eta} business days` : '--'}</div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="font-semibold mb-2 text-gray-900">Calculation Summary</div>
              <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                This shipping option is calculated based on your selected parameters. For a detailed breakdown of the calculation, please provide your contact information below.
              </div>
            </div>
            <button className="w-full bg-blue-700 rounded px-4 py-2 font-semibold mb-2 hover:bg-blue-800 transition">Proceed with this option</button>
            <button className="w-full border border-blue-700 text-black rounded px-4 py-2 font-semibold hover:bg-blue-50 transition">Request custom quote</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
