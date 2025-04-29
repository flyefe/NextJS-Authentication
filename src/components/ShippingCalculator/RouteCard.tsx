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

      {/* Step 1: Direction Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold border-b-4 transition-all duration-150 focus:outline-none ${direction === "import" ? "border-blue-600 bg-blue-50 text-blue-900" : "border-transparent bg-gray-100 text-gray-500"}`}
          onClick={() => onDirectionChange("import")}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2M8 12l4 4m0 0l4-4m-4 4V4" /></svg>
          Import
        </button>
        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold border-b-4 transition-all duration-150 focus:outline-none ${direction === "export" ? "border-blue-600 bg-blue-50 text-blue-900" : "border-transparent bg-gray-100 text-gray-500"}`}
          onClick={() => onDirectionChange("export")}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2m16 0l-4-4m4 4l-4 4m4-4H3" /></svg>
          Export
        </button>
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

      {/* Step 3: Shipping mode with icons */}
      {selectedRoute && (
        <div className="mb-2">
          <label className="block text-sm mb-1 text-gray-900">Shipping Mode</label>
          <RadioGroup value={shippingMode} onValueChange={onShippingModeChange} className="flex gap-4">
            <div className="flex items-center gap-2 text-gray-900">
              <RadioGroupItem value="air" id="air" />
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 18.5l-7-7a1 1 0 011.4-1.4l7 7a1 1 0 01-1.4 1.4zM21 15v-2a3 3 0 00-3-3h-4.18a3 3 0 01-2.12-.88l-3.82-3.83a1 1 0 011.42-1.42l3.82 3.83A5 5 0 0118 13v2a1 1 0 001 1h2a1 1 0 001-1z" /></svg>
              <label htmlFor="air" className="text-sm text-gray-900">Air</label>
            </div>
            <div className="flex items-center gap-2 text-gray-900">
              <RadioGroupItem value="sea" id="sea" />
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 20v-2a4 4 0 014-4h10a4 4 0 014 4v2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a4 4 0 01-8 0" /></svg>
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
                <RadioGroupItem value={cat} id={`goods-category-${idx}`} className="ring-2 ring-black ring-offset-2" />
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