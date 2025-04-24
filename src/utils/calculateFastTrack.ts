import type { Route } from "@/hooks/useRoutes";

/**
 * Calculate the FastTrack shipping rate for a given route and weight.
 * Returns null if FastTrack is not available for this route.
 */
export function calculateFastTrackShippingRate(
  route: Route,
  weight: number,
): number | null {
  if (!route.shippingOptionConfig?.availableOptions?.fastTrackRate?.active) return null;
  const fastTrackConfig = route.shippingOptionConfig?.availableOptions?.fastTrackRate;
  if (!fastTrackConfig || !fastTrackConfig.active) return null; 
  //Import
  if (route.category === "import") {
    //China calculation for air
    if (route.originCountry === "China" && route.destinationCountry === "Nigeria") {
      if (fastTrackConfig.goodsCategory.includes("Has No Battery")) {
        const amount = ((weight * fastTrackConfig.ratePerKg) * (route.exchangeRate ?? 1)) + fastTrackConfig.customClearanceRatePerKg;
        return amount;
      } else if (fastTrackConfig.goodsCategory.includes("Has Battery")) {
        const amount = ((weight * fastTrackConfig.hasBatteryRate) * (route.exchangeRate ?? 1)) + fastTrackConfig.customClearanceRatePerKg;
        return amount;
      } else if (fastTrackConfig.goodsCategory.includes("Chemical")) {
        const amount = ((weight * fastTrackConfig.hasChemicalRate) * (route.exchangeRate ?? 1)) + fastTrackConfig.customClearanceRatePerKg;
        return amount;
      } else if (fastTrackConfig.goodsCategory.includes("ContainFood")) {
        const amount = ((weight * fastTrackConfig.hasFoodRate) * (route.exchangeRate ?? 1)) + fastTrackConfig.customClearanceRatePerKg;
        return amount;
      } else if (fastTrackConfig.goodsCategory.includes("SpecialGoods")) {
        const amount = ((weight * fastTrackConfig.specialGoodsRate) * (route.exchangeRate ?? 1)) + fastTrackConfig.customClearanceRatePerKg;
        return amount;
      }
      //Other countries (US, UK, Canada)
    } else if (route.originCountry !== "China" && route.destinationCountry === "Nigeria") {
      // If goodsCategory contains food, use hasFoodRate for all slabs
      if (fastTrackConfig.goodsCategory.includes("ContainFood") || fastTrackConfig.goodsCategory.includes("Food")) {
        if (weight <= 5 && fastTrackConfig.hasFoodRate) {
          const amount = (fastTrackConfig.hasFoodRate * weight * (route.exchangeRate ?? 1));
          return amount;
        }
        if (weight > 5 && weight <= 10 && fastTrackConfig.hasFoodRate) {
          const amount = (fastTrackConfig.hasFoodRate * weight * (route.exchangeRate ?? 1));
          return amount;
        }
        if (weight > 10 && fastTrackConfig.hasFoodRate) {
          const amount = (fastTrackConfig.hasFoodRate * weight * (route.exchangeRate ?? 1));
          return amount;
        }
        // fallback if hasFoodRate is not available
        return null;
      } else {
        // Use standard rates
        if (weight <= 5 && fastTrackConfig["1-5kg"]) {
          const amount = (fastTrackConfig["1-5kg"] * (route.exchangeRate ?? 1))
          return amount;
        }
        if (weight > 5 && weight <= 10 && fastTrackConfig["6-10kg"]) {
          const amount = (fastTrackConfig["6-10kg"] * (route.exchangeRate ?? 1))
          return amount;
        }
        if (weight > 10 && fastTrackConfig.ratePerKg) {
          const amount = ((weight * fastTrackConfig.ratePerKg) * (route.exchangeRate ?? 1))
          return amount;
        }
        // fallback to ratePerKg if slabs are missing
        if (fastTrackConfig.ratePerKg && weight > 10) {
          const amount = ((fastTrackConfig.ratePerKg * weight) * (route.exchangeRate ?? 1))
          return amount;
        }
        return null;
      }
    }
  }

    //Export
    if (route.category === "export") {
        //To Other countries (US, UK, Canada)
      if (route.originCountry === "Nigeria") {
        // If goodsCategory contains food, use hasFoodRate for all slabs
        if (fastTrackConfig.goodsCategory.includes("ContainFood") || fastTrackConfig.goodsCategory.includes("Food")) {
          if (weight <= 5 && fastTrackConfig.hasFoodRate) {
            const amount = (fastTrackConfig.hasFoodRate * weight * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
          if (weight > 5 && weight <= 10 && fastTrackConfig.hasFoodRate) {
            const amount = (fastTrackConfig.hasFoodRate * weight * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
          if (weight > 10 && fastTrackConfig.hasFoodRate) {
            const amount = (fastTrackConfig.hasFoodRate * weight * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
          // fallback if hasFoodRate is not available
          return null;
        } else {
          // Use standard rates
          if (weight <= 5 && fastTrackConfig["1-5kg"]) {
            const amount = (fastTrackConfig["1-5kg"] * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
          if (weight > 5 && weight <= 10 && fastTrackConfig["6-10kg"]) {
            const amount = (fastTrackConfig["6-10kg"] * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
          if (weight > 10 && fastTrackConfig.ratePerKg) {
            const amount = ((weight * fastTrackConfig.ratePerKg) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
        }
        // fallback to ratePerKg if slabs are missing
        if (fastTrackConfig.ratePerKg && weight > 10) {
          const amount = ((fastTrackConfig.ratePerKg * weight) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * weight;
          return amount;
        }
        return null; // No matching rate found
      } else {
        return null;
      }
    }
  return null;
}


 