import type { Route } from "@/hooks/useRoutes";

/**
 * Calculate the express shipping rate for a given route and kg.
 * Returns null if express is not available for this route.
 */

console.log("TEST LOG FROM EXPRESS SHIPPING") 
export function calculateExpressShippingRate(
  route: Route,
  kg: number,
): number | null {
  // Check if express option is active
  const expressConfig = route.shippingOptionConfig?.availableOptions?.expressRate;
  if (!expressConfig || !expressConfig.active) return null;
  console.log("expressConfig:", expressConfig) 

  const subCharge = (route.shippingOptionConfig?.availableOptions?.expressRate?.subCharge)/100;
  const vatPercent = (route.shippingOptionConfig?.availableOptions?.expressRate?.vatPercent)/100;

  // Collate all slab rates from expressConfig into kgRates object
  const slabKeys = [
    "0_5kg", "1_0kg", "1_5kg", "2_0kg", "2_5kg", "3_0kg", "3_5kg", "4_0kg", "4_5kg", "5_0kg"
  ];
  const kgRates: Record<string, number> = {};
  slabKeys.forEach(key => {
    if (typeof expressConfig[key] === "number") {
      kgRates[key] = expressConfig[key];
    }
  });
  if (typeof expressConfig.extraHalfKgRate === "number") {
    kgRates["extraHalfKgRate"] = expressConfig.extraHalfKgRate;
  }
  console.log("Express kgRates keys:", kgRates  ? Object.keys(kgRates) : "No kgRates");
  if (Object.keys(kgRates).length === 0) return null;

  // Find the appropriate rate for the kg
  // This is just a sample mapping logic—customize as needed!
  let amount = 0;
  if (kg <= 0.5 && kgRates["0_5kg"]) {
    
    amount = (kgRates["0_5kg"] + (kgRates["0_5kg"] * subCharge) + (kgRates["0_5kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount + 40000;
  };
  if (kg <= 1 && kgRates["1_0kg"]) {
    let amount = (kgRates["1_0kg"] + (kgRates["1_0kg"] * subCharge) + (kgRates["1_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount + 40000;
  };
  if (kg <= 1.5 && kgRates["1_5kg"]) {
    let amount = (kgRates["1_5kg"] + (kgRates["1_5kg"] * subCharge) + (kgRates["1_5kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount + 40000;
  };
  if (kg <= 2 && kgRates["2_0kg"]) {
    let amount = (kgRates["2_0kg"] + (kgRates["2_0kg"] * subCharge) + (kgRates["2_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount + 40000;
  };
  if (kg <= 2.5 && kgRates["2_5kg"]) {
    let amount = (kgRates["2_5kg"] + (kgRates["2_5kg"] * subCharge) + (kgRates["2_5kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount + 40000;
  };
  if (kg <= 3 && kgRates["3_0kg"]) {
    let amount = (kgRates["3_0kg"] + (kgRates["3_0kg"] * subCharge) + (kgRates["3_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount;
  };
  if (kg <= 3.5 && kgRates["3_5kg"]) {
    let amount = (kgRates["3_5kg"] + (kgRates["3_5kg"] * subCharge) + (kgRates["3_5kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount + 40000;
  };
  if (kg <= 4 && kgRates["4_0kg"]) {
    let amount = (kgRates["4_0kg"] + (kgRates["4_0kg"] * subCharge) + (kgRates["4_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount + 40000;
  };
  if (kg <= 4.5 && kgRates["4_5kg"]) {
    let amount = (kgRates["4_5kg"] + (kgRates["4_5kg"] * subCharge) + (kgRates["4_5kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount + 40000;
  };
  if (kg <= 5 && kgRates["5_0kg"]) {
    let amount = (kgRates["5_0kg"] + (kgRates["5_0kg"] * subCharge) + (kgRates["5_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount + 40000;
  }
  
  // If above all ranges, use extraHalfKgRate if available
  if (kgRates["extraHalfKgRate"]) {
    const baseRate = (kgRates["5_0kg"] + (kgRates["5_0kg"] * subCharge) + (kgRates["5_0kg"] * vatPercent)) * (route.exchangeRate ?? 1);
    // Calculate how many extra half-kilos above 5kg
    const extra = Math.ceil((kg - 5) / 0.5);
    const amount = baseRate + extra * (kgRates["extraHalfKgRate"] + (kgRates["extraHalfKgRate"] * subCharge) + (kgRates["extraHalfKgRate"] * vatPercent)) * (route.exchangeRate ?? 1);
    return amount + 40000;
  }

  // Fallback: return null if no rate found
  return null;
}