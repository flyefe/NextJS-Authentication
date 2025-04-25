"use client";
import type { Route } from "@/hooks/useRoutes";
export interface ShippingEstimate {
  option: string;
  amount: number;
  eta: number;
}

export interface ShippingCalculationParams {
  route: Route;
  kg: number;
  volume: number;
  container: string | null;
  containers?: string[]; // Optional: for sea shipping multiple containers
}

import { calculateExpressShippingRate } from "./calculateExpressShipping";
import { calculateFastTrackShippingRate } from "./calculateFastTrack";
import { calculateConsoleShippingRate } from "./calculateConsoleShipping";
import { calculateSeaShippingRate } from "./calculateSeaShipping";

// Main utility function to calculate all relevant shipping options for a route
export function calculateAllShippingOptions({ route, kg, volume, container, containers }: ShippingCalculationParams): ShippingEstimate[] {
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
    if (option === "expressRate") {
      amount = calculateExpressShippingRate(route, kg) ?? 0;
    } else if (option === "fastTrackRate") {
      amount = calculateFastTrackShippingRate(route, kg) ?? 0;
    } else if (option === "consoleRate") {
      amount = calculateConsoleShippingRate(route, kg) ?? 0;
    } else if (option === "seaRate") {
      // Prefer containers array if provided, fallback to single container
      if (Array.isArray(containers) && containers.length > 0) {
        amount = calculateSeaShippingRate(route, volume, containers) ?? 0;
      } else if (container) {
        amount = calculateSeaShippingRate(route, volume, [container]) ?? 0;
      } else {
        amount = calculateSeaShippingRate(route, volume, []) ?? 0;
      }
    }
    // Get eta from the corresponding config
    const config = route.shippingOptionConfig?.availableOptions?.[option];
    const eta = (config && typeof config.eta === "number") ? config.eta : 0;
    return { option: optionLabels[option], amount, eta };
  });
}
