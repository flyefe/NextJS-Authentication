import type { Route } from "@/hooks/useRoutes";

/**
 * Calculate the sea shipping rate for a given route and weight/volume/container.
 * Returns null if sea is not available for this route.
 */

console.log("TEST LOG FROM SEA SHIPPING") 
export function calculateSeaShippingRate(
  route: Route,
  volume: number,
  containers: string[],
  goodsCategory: string | null,
): { amount: number, calculationDetails?: string } | null {
  if (!route.shippingOptionConfig?.availableOptions?.seaRate?.active) return null;
  const seaConfig = route.shippingOptionConfig?.availableOptions?.seaRate;
  if (!seaConfig || !seaConfig.active) return null;
  console.log("seaConfig:", seaConfig) 

  let total = 0;
  let calculationDetails = undefined;
  const exchangeRate = route.exchangeRate ?? 1;
  if (Array.isArray(containers)) {
    for (const container of containers) {
      if (container === "LCL" && seaConfig.ratePerCBM && volume) {
        total += (seaConfig.ratePerCBM * volume * exchangeRate) + (seaConfig.customClearanceCost ?? 0) + (seaConfig.documentationCost ?? 0);
        calculationDetails = `Formula: (ratePerCBM * volume * exchangeRate) + customClearanceCost + documentationCost\nValues: (${seaConfig.ratePerCBM} * ${volume} * ${exchangeRate}) + (${seaConfig.customClearanceCost ?? 0}) + (${seaConfig.documentationCost ?? 0})`;
      } else if (container === "20ft" && seaConfig.ratePer20ft) {
        total += (seaConfig.ratePer20ft * exchangeRate) + (seaConfig.customClearanceCost ?? 0) + (seaConfig.documentationCost ?? 0);
      } else if (container === "40ft" && seaConfig.ratePer40ft) {
        total += (seaConfig.ratePer40ft * exchangeRate) + (seaConfig.customClearanceCost ?? 0) + (seaConfig.documentationCost ?? 0);
      } else if (container === "40ftHighCube" && seaConfig.ratePer40ftHighCube) {
        total += (seaConfig.ratePer40ftHighCube * exchangeRate) + (seaConfig.customClearanceCost ?? 0) + (seaConfig.documentationCost ?? 0);
      } else if (container === "45ftHighCube" && seaConfig.ratePer45ftHighCube) {
        total += (seaConfig.ratePer45ftHighCube * exchangeRate) + (seaConfig.customClearanceCost ?? 0) + (seaConfig.documentationCost ?? 0);
      }
    }
  }
  // Add volume-based cost if needed (for LCL)
  if (!calculationDetails && volume && seaConfig.ratePerCBM && containers && containers.includes("LCL")) {
    total += (seaConfig.ratePerCBM * volume * exchangeRate) + (seaConfig.customClearanceCost ?? 0) + (seaConfig.documentationCost ?? 0);
    calculationDetails = `Formula: (ratePerCBM * volume * exchangeRate) + customClearanceCost + documentationCost\nValues: (${seaConfig.ratePerCBM} * ${volume} * ${exchangeRate}) + (${seaConfig.customClearanceCost ?? 0}) + (${seaConfig.documentationCost ?? 0})`;
  }
  return total > 0 ? { amount: total, calculationDetails } : null;
}