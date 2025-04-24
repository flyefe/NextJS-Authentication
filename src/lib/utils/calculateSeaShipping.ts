import type { Route } from "@/hooks/useRoutes";

/**
 * Calculate the sea shipping rate for a given route and weight/volume/container.
 * Returns null if sea is not available for this route.
 */
export function calculateSeaShippingRate(
  route: Route,
  volume: number,
  containers: string[],
): number | null {
  if (!route.shippingOptionConfig?.availableOptions?.seaRate?.active) return null;
  const seaConfig = route.shippingOptionConfig?.availableOptions?.seaRate;
  if (!seaConfig || !seaConfig.active) return null;

  let total = 0;
  const exchangeRate = route.exchangeRate ?? 1;
  if (Array.isArray(containers)) {
    for (const container of containers) {
      if (container === "20ft" && seaConfig.ratePer20ft) {
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
  // Add volume-based cost if needed
  if (volume && seaConfig.ratePerCBM) {
    total += (seaConfig.ratePerCBM * volume * exchangeRate) + (seaConfig.customClearanceCost ?? 0) + (seaConfig.documentationCost ?? 0);
  }
  return total > 0 ? total : null;
}