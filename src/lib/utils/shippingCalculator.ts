"use client";
import type { Route } from "@/hooks/useRoutes";
export interface ShippingEstimate {
  option: string;
  amount: number;
  eta: number;
  calculationDetails?: string;
}

export interface ShippingCalculationParams {
  route: Route;
  kg: number;
  volume: number;
  container: string | null;
  goodsCategory: string | null;
  containers?: string[]; // Optional: for sea shipping multiple containers
}

import { calculateExpressShippingRate } from "./calculateExpressShipping";
import { calculateFastTrackShippingRate } from "./calculateFastTrack";
import { calculateConsoleShippingRate } from "./calculateConsoleShipping";
import { calculateSeaShippingRate } from "./calculateSeaShipping";

// Main utility function to calculate all relevant shipping options for a route
export function calculateAllShippingOptions({ route, kg, volume, container, containers, goodsCategory }: ShippingCalculationParams): ShippingEstimate[] {
  console.log("[calculateAllShippingOptions] received:", { route, kg, volume, container, containers });
  if (!route) return [];
  // Extract available options from shippingOptionConfig
  // Define the possible option keys
  type OptionKey = "expressRate" | "seaRate" | "consoleRate" | "fastTrackRate";
  const availableOptionsObj = route.shippingOptionConfig?.availableOptions as Partial<Record<OptionKey, { active: boolean }>> | undefined;
  const options = availableOptionsObj ? (Object.keys(availableOptionsObj) as OptionKey[]).filter(opt => availableOptionsObj[opt]?.active) : [];
  // Map option keys to user-friendly labels
  const optionLabels: Record<OptionKey, string> = {
    expressRate: "Express",
    seaRate: "Sea",
    consoleRate: "Console",
    fastTrackRate: "Fast Track"
  };
  return options.map(option => {
    let amount = 0;
    let calculationDetails: string | undefined = undefined;
    if (option === "expressRate") {
      amount = calculateExpressShippingRate(route, kg, goodsCategory) ?? 0;
    } else if (option === "fastTrackRate") {
      const result = calculateFastTrackShippingRate(route, kg, goodsCategory);
      amount = result?.amount ?? 0;
      calculationDetails = result?.calculationDetails;
    } else if (option === "consoleRate") {
      amount = calculateConsoleShippingRate(route, kg, goodsCategory) ?? 0;
    } else if (option === "seaRate") {
      // Prefer containers array if provided, fallback to single container
      let result;
      if (Array.isArray(containers) && containers.length > 0) {
        result = calculateSeaShippingRate(route, volume, containers, goodsCategory);
      } else if (container) {
        result = calculateSeaShippingRate(route, volume, [container], goodsCategory);
      } else {
        result = calculateSeaShippingRate(route, volume, [], goodsCategory);
      }
       amount = result?.amount ?? 0;
      calculationDetails = result?.calculationDetails;
    }
    // Get eta from the corresponding config
    const config = route.shippingOptionConfig?.availableOptions?.[option];
    const eta = (config && typeof config.eta === "number") ? config.eta : 0;
    return { option: optionLabels[option], amount, eta, calculationDetails };
  });
}
