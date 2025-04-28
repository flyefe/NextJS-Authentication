"use client";
import { useState, useEffect } from "react";
import { useRoutes } from "@/hooks/useRoutes";
import { calculateAllShippingOptions, ShippingEstimate } from "@/lib/utils/shippingCalculator";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { RouteCard } from "./RouteCard";
import { AvailableOptionsCard } from "./AvailableOptionsCard";
import { DetailsCard } from "./DetailCard";

export default function ShippingCalculator() {
  // State management (unchanged)
  const [selectedGoodsCategory, setSelectedGoodsCategory] = useState("");
  const [direction, setDirection] = useState<"import" | "export">("import");
  const [routeId, setRouteId] = useState("");
  const [shippingMode, setShippingMode] = useState<"air" | "sea" | "">("");
  const [kg, setKg] = useState(0);
  const [container, setContainer] = useState("");
  const [volume, setVolume] = useState(0);
  const [showEstimates, setShowEstimates] = useState(false);

  // Routes and filtering (unchanged)
  const { routes, loading, error } = useRoutes();
  const filteredRoutes = routes.filter(r => r.category === direction);
  const selectedRoute = filteredRoutes.find(r => r._id === routeId);

  // Available containers logic (unchanged)
  let availableContainers = ["LCL", "20ft", "40ft", "40ftHighCube", "45ftHighCube"];
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

  // Calculation logic (unchanged)
  let estimates: ShippingEstimate[] = [];
  if (showEstimates && selectedRoute) {
    if (shippingMode === "air") {
      const safeKg = kg > 0 ? kg : 0;
      estimates = calculateAllShippingOptions({
        route: selectedRoute,
        kg: safeKg,
        volume: 0,
        container: null,
        goodsCategory: selectedGoodsCategory,
      }).filter(e => ["Express", "Fast Track", "Console"].includes(e.option));
    } else if (shippingMode === "sea") {
      estimates = calculateAllShippingOptions({
        route: selectedRoute,
        kg: 0,
        volume: container === "LCL" ? volume : 0,
        container: container || null,
        goodsCategory: selectedGoodsCategory,
      }).filter(e => e.option === "Sea");
    }
  }

  // Selected estimate (unchanged)
  const selectedEstimate = estimates[0];

  // Loading and error states
  if (loading) return <div className="p-4 text-gray-900">Loading routes...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading routes: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Cost Calculator</h1>
      <div className="flex w-full max-w-7xl mx-auto" style={{ minHeight: '70vh' }}>
        {/* Left: Route & Inputs (30%) */}
        <div style={{ flexBasis: '35%', maxWidth: '35%', minWidth: '300px' }} className="pr-4">
          <RouteCard
            direction={direction}
            onDirectionChange={(val) => {
              setDirection(val);
              setRouteId("");
              setShippingMode("");
              setKg(0);
              setContainer("");
              setVolume(0);
              setShowEstimates(false);
              setSelectedGoodsCategory("");
            }}
            routeId={routeId}
            onRouteIdChange={(val) => {
              setRouteId(val);
              setShippingMode("");
              setKg(0);
              setContainer("");
              setVolume(0);
              setShowEstimates(false);
              setSelectedGoodsCategory("");
            }}
            filteredRoutes={filteredRoutes}
            selectedRoute={selectedRoute}
            shippingMode={shippingMode}
            onShippingModeChange={(val) => {
              setShippingMode(val);
              setKg(0);
              setContainer("");
              setVolume(0);
              setShowEstimates(false);
              setSelectedGoodsCategory("");
            }}
            kg={kg}
            onKgChange={(val) => {
              setKg(val);
              setShowEstimates(false);
            }}
            container={container}
            onContainerChange={(val) => {
              setContainer(val);
              setVolume(0);
              setShowEstimates(false);
            }}
            availableContainers={availableContainers}
            volume={volume}
            onVolumeChange={(val) => {
              setVolume(val);
              setShowEstimates(false);
            }}
            selectedGoodsCategory={selectedGoodsCategory}
            onSelectedGoodsCategoryChange={(val) => {
              setSelectedGoodsCategory(val);
              setShowEstimates(false);
            }}
            onCalculate={() => setShowEstimates(true)}
            isCalculationDisabled={
              !selectedRoute ||
              !shippingMode ||
              (shippingMode === "air" && (!kg || kg <= 0)) ||
              (shippingMode === "sea" && (!container || (container === "LCL" && (!volume || volume <= 0))))
            }
          />
        </div>
        {/* Right: Results (70%) - only show when showEstimates is true */}
        {showEstimates && (
          <div style={{ flexBasis: '65%', maxWidth: '65%' }} className="flex flex-row gap-2 overflow-x-auto">
            {/* Available Options (20% of right) */}
            <div style={{ flexBasis: '20%', minWidth: '200px' }}>
              <AvailableOptionsCard estimates={estimates} showEstimates={showEstimates} />
            </div>
            {/* Details Card (80% of right) */}
            <div style={{ flexBasis: '80%' }}>
              <DetailsCard selectedEstimate={selectedEstimate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}