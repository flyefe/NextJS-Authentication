import type { Route } from "@/hooks/useRoutes";

/**
 * Calculate the FastTrack shipping rate for a given route and kg.
 * Returns null if FastTrack is not available for this route.
 */
console.log("TEST LOG FROM FASTTRACK SHIPPING") 
export function calculateFastTrackShippingRate(
  route: Route,
  kg: number,
): number | null { 
  if (!route.shippingOptionConfig?.availableOptions?.fastTrackRate?.active) return null;
  const fastTrackConfig = route.shippingOptionConfig?.availableOptions?.fastTrackRate;
  if (!fastTrackConfig || !fastTrackConfig.active) return null; 
  console.log("fastTrackConfig2:", fastTrackConfig) 
  //Import
  let amount = 0;
  console.log("amount:", amount);
  if (route.category === "import") {
    //China calculation for air
    if (route.originCountry === "China" && route.destinationCountry === "Nigeria") {
      console.log("fastTrackConfig:", fastTrackConfig);
      if (fastTrackConfig.goodsCategory.includes("Has No Battery")) {
        amount = ((kg * fastTrackConfig.ratePerKg) * (route.exchangeRate ?? 1)) + fastTrackConfig.customClearanceRatePerKg;
        console.log("FastTrack rate for Has No Battery:", amount);
        return amount;
      } else if (fastTrackConfig.goodsCategory.includes("Has Battery")) {
        let amount = ((kg * fastTrackConfig.hasBatteryRate) * (route.exchangeRate ?? 1)) + fastTrackConfig.customClearanceRatePerKg;
        console.log("FastTrack rate for Has Battery:", amount);
        return amount;
      } else if (fastTrackConfig.goodsCategory.includes("Chemical")) {
        let amount = ((kg * fastTrackConfig.hasChemicalRate) * (route.exchangeRate ?? 1)) + fastTrackConfig.customClearanceRatePerKg;
        return amount;
      } else if (fastTrackConfig.goodsCategory.includes("ContainFood")) {
        let amount = ((kg * fastTrackConfig.hasFoodRate) * (route.exchangeRate ?? 1)) + fastTrackConfig.customClearanceRatePerKg;
        return amount;
      } else if (fastTrackConfig.goodsCategory.includes("SpecialGoods")) {
        const amount = ((kg * fastTrackConfig.specialGoodsRate) * (route.exchangeRate ?? 1)) + fastTrackConfig.customClearanceRatePerKg;
        return amount;
      }
      //Other countries (US, UK, Canada)
    } else if (route.originCountry !== "China" && route.destinationCountry === "Nigeria") {
      // If goodsCategory contains food, use hasFoodRate for all slabs
      if (fastTrackConfig.goodsCategory.includes("ContainFood") || fastTrackConfig.goodsCategory.includes("Food")) {
        if (kg <= 5 && fastTrackConfig.hasFoodRate) {
          let amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1));
          return amount;
        }
        if (kg > 5 && kg <= 10 && fastTrackConfig.hasFoodRate) {
          let amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1));
          return amount;
        }
        if (kg > 10 && fastTrackConfig.hasFoodRate) {
          let amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1));
          return amount;
        }
        // fallback if hasFoodRate is not available
        return null;
      } else {
        // Use standard rates
        if (kg <= 5 && fastTrackConfig["1-5kg"]) {
          let amount = (fastTrackConfig["1-5kg"] * (route.exchangeRate ?? 1))
          return amount;
        }
        if (kg > 5 && kg <= 10 && fastTrackConfig["6-10kg"]) {
          let amount = (fastTrackConfig["6-10kg"] * (route.exchangeRate ?? 1))
          return amount;
        }
        if (kg > 10 && fastTrackConfig.ratePerKg) {
          let amount = ((kg * fastTrackConfig.ratePerKg) * (route.exchangeRate ?? 1))
          return amount;
        }
        // fallback to ratePerKg if slabs are missing
        if (fastTrackConfig.ratePerKg && kg > 10) {
          let amount = ((fastTrackConfig.ratePerKg * kg) * (route.exchangeRate ?? 1))
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
          if (kg <= 5 && fastTrackConfig.hasFoodRate) {
            const amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * kg;
            return amount;
          }
          if (kg > 5 && kg <= 10 && fastTrackConfig.hasFoodRate) {
            const amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * kg;
            return amount;
          }
          if (kg > 10 && fastTrackConfig.hasFoodRate) {
            const amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * kg;
            return amount;
          }
          // fallback if hasFoodRate is not available
          return null;
        } else {
          // Use standard rates
          if (kg <= 5 && fastTrackConfig["1-5kg"]) {
            const amount = (fastTrackConfig["1-5kg"] * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * kg;
            return amount;
          }
          if (kg > 5 && kg <= 10 && fastTrackConfig["6-10kg"]) {
            const amount = (fastTrackConfig["6-10kg"] * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * kg;
            return amount;
          }
          if (kg > 10 && fastTrackConfig.ratePerKg) {
            const amount = ((kg * fastTrackConfig.ratePerKg) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * kg;
            return amount;
          }
        }
        // fallback to ratePerKg if slabs are missing
        if (fastTrackConfig.ratePerKg && kg > 10) {
          const amount = ((fastTrackConfig.ratePerKg * kg) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRatePerKg ?? 0) * kg;
          return amount;
        }
        return null; // No matching rate found
      } else {
        return null;
      }
    }
  return null;
}


 