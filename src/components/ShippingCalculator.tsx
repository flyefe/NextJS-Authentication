"use client";
import { useState, useEffect } from "react";
import { useRoutes, Route } from "@/hooks/useRoutes";
import { calculateAllShippingOptions, ShippingEstimate } from "@/lib/utils/shippingCalculator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// ShippingCalculator UI component
// Workflow:
// 1. User selects shipment direction (import/export)
// 2. User selects a route (filtered by direction)
// 3. User selects shipping mode (Air/Sea)
// 4. User enters weight (kg) for Air, or selects container and enters volume (if LCL) for Sea
// 5. When 'Calculate Shipping Cost' is clicked, input values are bundled as parameters and sent to the calculation utility (calculateAllShippingOptions)
// 6. The returned estimates are displayed to the user

export default function ShippingCalculator() {
  // --- State for user input ---
  // Step 1: Shipment direction (import/export)
  const [direction, setDirection] = useState<"import" | "export">("import");
  // Step 2: Route selection
  const [routeId, setRouteId] = useState("");
  // Step 3: Shipping mode (Air/Sea)
  const [shippingMode, setShippingMode] = useState<"air" | "sea" | "">("");
  // Step 4: Weight (kg) for Air, or container and volume (if LCL) for Sea
  const [kg, setKg] = useState<number>(0);
  const [container, setContainer] = useState<string>(""); // Container type for Sea
  const [volume, setVolume] = useState<number>(0); // Volume (CBM) for LCL Sea

  // --- Get available routes and filter by direction ---
  const { routes, loading, error } = useRoutes();
  // Filter routes by selected direction
  const filteredRoutes = routes.filter(r => r.category === direction);
  // Get the selected route
  const selectedRoute = filteredRoutes.find(r => r._id === routeId);

  // --- Determine available containers for sea shipping based on route config ---
  // Default available containers
  let availableContainers: string[] = ["LCL", "20ft", "40ft", "40ftHighCube", "45ftHighCube"];
  // If selected route has sea rate config, filter containers accordingly
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

  // --- Calculation trigger and logic ---
  // showEstimates: controls when to display results (after button click)
  const [showEstimates, setShowEstimates] = useState(false);
  // Estimates array to store calculation results
  let estimates: ShippingEstimate[] = [];
  // Perform calculation when user clicks 'Calculate' and selected route is available
  if (showEstimates && selectedRoute) {
    // 5. When user clicks 'Calculate', build calculation parameters based on mode
    if (shippingMode === "air") {
      const safeKg = kg > 0 ? kg : 0;
      // Log the parameters being sent for air
      console.log("Calling calculateAllShippingOptions for AIR with:", {
        route: selectedRoute,
        kg: safeKg,
        volume: 0,
        container: null
      });
      // For air: pass kg, volume=0, container=null
      estimates = calculateAllShippingOptions({ route: selectedRoute, kg: safeKg, volume: 0, container: null }).filter(e => e.option === "Express" || e.option === "Fast Track" || e.option === "Console");
    } else if (shippingMode === "sea") {
      // Log the parameters being sent for sea
      console.log("Calling calculateAllShippingOptions for SEA with:", {
        route: selectedRoute,
        kg: 0,
        volume: container === "LCL" ? volume : 0,
        container: container || null
      });
      // For sea: if LCL, pass volume and container; if FCL, pass container only
      if (container === "LCL") {
        console.log("Calling calculateAllShippingOptions for SEA (LCL) with:", {
          route: selectedRoute,
          kg: 0,
          volume,
          container
        });
        estimates = calculateAllShippingOptions({ route: selectedRoute, kg: 0, volume, container });
      } else if (container) {
        console.log("Calling calculateAllShippingOptions for SEA (FCL) with:", {
          route: selectedRoute,
          kg: 0,
          volume: 0,
          container
        });
        estimates = calculateAllShippingOptions({ route: selectedRoute, kg: 0, volume: 0, container });
      } else {
        console.log("Calling calculateAllShippingOptions for SEA (no container) with:", {
          route: selectedRoute,
          kg: 0,
          volume: 0,
          container: null
        });
        estimates = calculateAllShippingOptions({ route: selectedRoute, kg: 0, volume: 0, container: null });
      }
      // Only show sea options
      estimates = estimates.filter(e => e.option === "Sea");
    }
  }

  // --- Loading and error states ---
  if (loading) return <div className="p-4 text-gray-900">Loading routes...</div>;
  if (error) return <div className="p-4 text-red-500 text-gray-900">Error loading routes: {error}</div>;

  // --- Use the first estimate as the selected one for details (or undefined if none) ---
  const selectedEstimate = estimates[0];

  // --- UI Rendering ---
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
            <RadioGroup value={direction} onValueChange={val => { setDirection(val as any); setRouteId(""); setShippingMode(""); setKg(0); setContainer(""); setVolume(0); setShowEstimates(false); }} className="flex gap-2">
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
            <Select value={routeId} onValueChange={val => { setRouteId(val); setShippingMode(""); setKg(0); setContainer(""); setVolume(0); setShowEstimates(false); }}>
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
              <RadioGroup value={shippingMode} onValueChange={val => { setShippingMode(val as any); setKg(0); setContainer(""); setVolume(0); setShowEstimates(false); }} className="flex gap-4">
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
              <Input className="text-gray-900 placeholder:text-gray-900" type="number" min={0} value={kg} onChange={e => {
                const v = Number(e.target.value);
                setKg(isNaN(v) || v < 0 ? 0 : v);
                setShowEstimates(false);
              }} />
            </div>
          )}
          {selectedRoute && shippingMode === "sea" && (
            <>
              <div className="mb-2">
                <label className="block text-sm mb-1 text-gray-900">Container Type</label>
                <Select value={container} onValueChange={val => { setContainer(val); setVolume(0); setShowEstimates(false); }}>
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
                  <Input className="text-gray-900 placeholder:text-gray-900" type="number" min={0} value={volume} onChange={e => {
                    const v = Number(e.target.value);
                    setVolume(isNaN(v) || v < 0 ? 0 : v);
                    setShowEstimates(false);
                  }} />
                </div>
              )}
            </>
          )}
          <button
            className="bg-blue-700 rounded px-4 py-2 font-semibold mt-4 hover:bg-blue-800 transition"
            onClick={e => {
              e.preventDefault();
              setShowEstimates(true);
            }}
            type="button"
            disabled={
              !selectedRoute || !shippingMode ||
              (shippingMode === 'air' && (!kg || kg <= 0)) ||
              (shippingMode === 'sea' && (!container || (container === 'LCL' && (!volume || volume <= 0))))
            }
          >
            Calculate Shipping Cost
          </button>
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
