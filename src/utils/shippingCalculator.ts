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
}

// Main utility function to calculate all relevant shipping options for a route
export function calculateAllShippingOptions({ route, kg, volume, container }: ShippingCalculationParams): ShippingEstimate[] {
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
    // Example logic (replace with real per-option/route logic)
    if (option === "expressRate") amount = kg * 15 + (volume * 10);
    else if (option === "seaRate") amount = container === "FCL" ? 2000 : volume * 50;
    else if (option === "consoleRate") amount = kg * 12 + (volume * 8);
    else if (option === "fastTrackRate") amount = kg * 20 + (volume * 20);
    // ETA: Not defined in model, set to 0 or add logic if you add eta fields
    const eta = 0;
    return { option: optionLabels[option], amount, eta };
  });
}
