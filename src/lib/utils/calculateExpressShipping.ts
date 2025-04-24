import type { Route } from "@/hooks/useRoutes";

/**
 * Calculate the express shipping rate for a given route and weight.
 * Returns null if express is not available for this route.
 */
export function calculateExpressShippingRate(
  route: Route,
  weight: number,
): number | null {
  // Check if express option is active
  const expressConfig = route.shippingOptionConfig?.availableOptions?.expressRate;
  if (!expressConfig || !expressConfig.active) return null;

  const subCharge = route.shippingOptionConfig?.availableOptions?.expressRate?.subCharge || 0.22;
  const vatPercent = route.shippingOptionConfig?.availableOptions?.expressRate?.vatPercent || 0.075;

  // Example logic: you should adapt this to your actual config structure
  // Here we assume expressConfig.kgRates is an object like { "0_5kg": 100, "1_0kg": 150, ... }
  const kgRates = expressConfig.kgRates as Record<string, number> | undefined;
  if (!kgRates) return null;

  // Find the appropriate rate for the weight
  // This is just a sample mapping logic—customize as needed!
  if (weight <= 0.5 && kgRates["0_5kg"]) {
    const amount = (kgRates["0_5kg"] + (kgRates["0_5kg"] * subCharge) + (kgRates["0_5kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  };
  if (weight <= 1 && kgRates["1_0kg"]) {
    const amount = (kgRates["1_0kg"] + (kgRates["1_0kg"] * subCharge) + (kgRates["1_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  };
  if (weight <= 1.5 && kgRates["1_5kg"]) {
    const amount = (kgRates["1_5kg"] + (kgRates["1_5kg"] * subCharge) + (kgRates["1_5kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  };
  if (weight <= 2 && kgRates["2_0kg"]) {
    const amount = (kgRates["2_0kg"] + (kgRates["2_0kg"] * subCharge) + (kgRates["2_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  };
  if (weight <= 2.5 && kgRates["2_5kg"]) {
    const amount = (kgRates["2_5kg"] + (kgRates["2_5kg"] * subCharge) + (kgRates["2_5kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  };
  if (weight <= 3 && kgRates["3_0kg"]) {
    const amount = (kgRates["3_0kg"] + (kgRates["3_0kg"] * subCharge) + (kgRates["3_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  };
  if (weight <= 3.5 && kgRates["3_5kg"]) {
    const amount = (kgRates["3_5kg"] + (kgRates["3_5kg"] * subCharge) + (kgRates["3_5kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  };
  if (weight <= 4 && kgRates["4_0kg"]) {
    const amount = (kgRates["4_0kg"] + (kgRates["4_0kg"] * subCharge) + (kgRates["4_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  };
  if (weight <= 4.5 && kgRates["4_5kg"]) {
    const amount = (kgRates["4_5kg"] + (kgRates["4_5kg"] * subCharge) + (kgRates["4_5kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  };
  if (weight <= 5 && kgRates["5_0kg"]) {
    const amount = (kgRates["5_0kg"] + (kgRates["5_0kg"] * subCharge) + (kgRates["5_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  }
  
  // If above all ranges, use extraHalfKgRate if available
  if (kgRates["extraHalfKgRate"]) {
    const baseRate = (kgRates["5_0kg"] + (kgRates["5_0kg"] * subCharge) + (kgRates["5_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    // Calculate how many extra half-kilos above 5kg
    const extra = Math.ceil((weight - 5) / 0.5);
    const amount = baseRate + extra * (kgRates["extraHalfKgRate"] + (kgRates["extraHalfKgRate"] * subCharge) + (kgRates["extraHalfKgRate"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  }

  // Fallback: return null if no rate found
  return null;
}