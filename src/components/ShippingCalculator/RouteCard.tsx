// components/RouteCard.tsx
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Route } from "@/hooks/useRoutes"; // Assuming Route type is exported

interface RouteCardProps {
  direction: "import" | "export";
  onDirectionChange: (value: "import" | "export") => void;
  routeId: string;
  onRouteIdChange: (value: string) => void;
  filteredRoutes: Route[];
  selectedRoute: Route | undefined;
  shippingMode: "air" | "sea" | "";
  onShippingModeChange: (value: "air" | "sea" | "") => void;
  kg: number;
  onKgChange: (value: number) => void;
  container: string;
  onContainerChange: (value: string) => void;
  availableContainers: string[];
  volume: number;
  onVolumeChange: (value: number) => void;
  selectedGoodsCategory: string;
  onSelectedGoodsCategoryChange: (value: string) => void;
  onCalculate: () => void;
  isCalculationDisabled: boolean;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  direction,
  onDirectionChange,
  routeId,
  onRouteIdChange,
  filteredRoutes,
  selectedRoute,
  shippingMode,
  onShippingModeChange,
  kg,
  onKgChange,
  container,
  onContainerChange,
  availableContainers,
  volume,
  onVolumeChange,
  selectedGoodsCategory,
  onSelectedGoodsCategoryChange,
  onCalculate,
  isCalculationDisabled,
}) => {
  return (
    <Card className="p-3 md:p-5 flex flex-col gap-4 md:gap-6 shadow-xl rounded-2xl bg-white/95 border border-blue-100 transition-all w-full max-w-full">

      <CardHeader className="mb-1 md:mb-2 flex flex-col items-start">
        <CardTitle className="text-lg md:text-2xl font-bold text-blue-900 tracking-tight mb-1">Route & Parameters</CardTitle>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full mb-2" />
      </CardHeader>

      {/* Step 1: Direction */}
      <div className="flex gap-2 mb-2">
        <RadioGroup value={direction} onValueChange={onDirectionChange} className="flex gap-2">
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
        <Select value={routeId} onValueChange={onRouteIdChange}>
          <SelectTrigger className="text-gray-900">
            <SelectValue placeholder="Select Route" className="text-gray-900" />
          </SelectTrigger>
          <SelectContent className="text-gray-900">
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
          <RadioGroup value={shippingMode} onValueChange={onShippingModeChange} className="flex gap-4">
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
          <Input
            className="text-gray-900 placeholder:text-gray-900"
            type="number"
            min={0}
            value={kg}
            onChange={e => {
              const v = Number(e.target.value);
              onKgChange(isNaN(v) || v < 0 ? 0 : v);
            }}
          />
        </div>
      )}
      {selectedRoute && shippingMode === "sea" && (
        <>
          <div className="mb-2">
            <label className="block text-sm mb-1 text-gray-900">Container Type</label>
            <Select value={container} onValueChange={onContainerChange}>
              <SelectTrigger className="text-gray-900">
                <SelectValue placeholder="Select Container" className="text-gray-900" />
              </SelectTrigger>
              <SelectContent className="text-gray-900">
                {availableContainers.map(c => (
                  <SelectItem className="text-gray-900" key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {container === "LCL" && (
            <div className="mb-2">
              <label className="block text-sm mb-1 text-gray-900">Volume (CBM)</label>
              <Input
                className="text-gray-900 placeholder:text-gray-900"
                type="number"
                min={0}
                value={volume}
                onChange={e => {
                  const v = Number(e.target.value);
                  onVolumeChange(isNaN(v) || v < 0 ? 0 : v);
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Step 5: Goods Category */}
      {selectedRoute && Array.isArray(selectedRoute.goodsCategory) && selectedRoute.goodsCategory.length > 0 && (
        (shippingMode === "air" && kg > 0) ||
        (shippingMode === "sea" && container && (container !== "LCL" || (container === "LCL" && volume > 0)))
      ) && (
        <div className="mb-2">
          <label className="block text-sm mb-1 text-gray-900">Goods Category</label>
          <RadioGroup
            value={selectedGoodsCategory}
            onValueChange={onSelectedGoodsCategoryChange}
            className="flex flex-col gap-1"
          >
            {selectedRoute.goodsCategory.map((cat, idx) => (
              <div key={cat} className="flex items-center gap-2 text-gray-900">
                <RadioGroupItem value={cat} id={`goods-category-${idx}`} />
                <label htmlFor={`goods-category-${idx}`} className="text-sm text-gray-900">{cat}</label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Calculate Button */}
      <button
        className="bg-blue-700 rounded px-4 py-2 font-semibold mt-4 hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={(e) => {
          e.preventDefault();
          onCalculate();
        }}
        type="button"
        disabled={isCalculationDisabled}
      >
        Calculate Shipping Cost
      </button>
    </Card>
  );
};