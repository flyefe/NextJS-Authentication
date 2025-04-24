import type { Route } from "@/hooks/useRoutes";

/**
 * Calculate the console shipping rate for a given route and weight.
 * Returns null if console is not available for this route.
 */
export function calculateConsoleShippingRate(
  route: Route,
  weight: number,
): number | null {
  if (!route.shippingOptionConfig?.availableOptions?.consoleRate?.active) return null;
  const consoleConfig = route.shippingOptionConfig?.availableOptions?.consoleRate;
  if (!consoleConfig || !consoleConfig.active) return null; 
  //Import
  if (route.category === "import") {
    //China calculation for air
    if (route.originCountry === "China" && route.destinationCountry === "Nigeria") {
      if (consoleConfig.goodsCategory.includes("Has No Battery")) {
        const amount = ((weight * consoleConfig.ratePerKg) * (route.exchangeRate ?? 1)) + consoleConfig.customClearanceRatePerKg;
        return amount;
      } else if (consoleConfig.goodsCategory.includes("Has Battery")) {
        const amount = ((weight * consoleConfig.hasBatteryRate) * (route.exchangeRate ?? 1)) + consoleConfig.customClearanceRatePerKg;
        return amount;
      } else if (consoleConfig.goodsCategory.includes("Chemical")) {
        const amount = ((weight * consoleConfig.hasChemicalRate) * (route.exchangeRate ?? 1)) + consoleConfig.customClearanceRatePerKg;
        return amount;
      } else if (consoleConfig.goodsCategory.includes("ContainFood")) {
        const amount = ((weight * consoleConfig.hasFoodRate) * (route.exchangeRate ?? 1)) + consoleConfig.customClearanceRatePerKg;
        return amount;
      } else if (consoleConfig.goodsCategory.includes("SpecialGoods")) {
        const amount = ((weight * consoleConfig.specialGoodsRate) * (route.exchangeRate ?? 1)) + consoleConfig.customClearanceRatePerKg;
        return amount;
      }
      //Other countries (US, UK, Canada)
    } else if (route.originCountry !== "China" && route.destinationCountry === "Nigeria") {
      // If goodsCategory contains food, use hasFoodRate for all slabs
      if (consoleConfig.goodsCategory.includes("ContainFood") || consoleConfig.goodsCategory.includes("Food")) {
        if (weight <= 5 && consoleConfig.hasFoodRate) {
          const amount = (consoleConfig.hasFoodRate * weight * (route.exchangeRate ?? 1));
          return amount;
        }
        if (weight > 5 && weight <= 10 && consoleConfig.hasFoodRate) {
          const amount = (consoleConfig.hasFoodRate * weight * (route.exchangeRate ?? 1));
          return amount;
        }
        if (weight > 10 && consoleConfig.hasFoodRate) {
          const amount = (consoleConfig.hasFoodRate * weight * (route.exchangeRate ?? 1));
          return amount;
        }
        // fallback if hasFoodRate is not available
        return null;
      } else {
        // Use standard rates
        if (weight <= 5 && consoleConfig["1-5kg"]) {
          const amount = (consoleConfig["1-5kg"] * (route.exchangeRate ?? 1))
          return amount;
        }
        if (weight > 5 && weight <= 10 && consoleConfig["6-10kg"]) {
          const amount = (consoleConfig["6-10kg"] * (route.exchangeRate ?? 1))
          return amount;
        }
        if (weight > 10 && consoleConfig.ratePerKg) {
          const amount = ((weight * consoleConfig.ratePerKg) * (route.exchangeRate ?? 1))
          return amount;
        }
        // fallback to ratePerKg if slabs are missing
        if (consoleConfig.ratePerKg && weight > 10) {
          const amount = ((consoleConfig.ratePerKg * weight) * (route.exchangeRate ?? 1))
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
        if (consoleConfig.goodsCategory.includes("ContainFood") || consoleConfig.goodsCategory.includes("Food")) {
          if (weight <= 5 && consoleConfig.hasFoodRate) {
            const amount = (consoleConfig.hasFoodRate * weight * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
          if (weight > 5 && weight <= 10 && consoleConfig.hasFoodRate) {
            const amount = (consoleConfig.hasFoodRate * weight * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
          if (weight > 10 && consoleConfig.hasFoodRate) {
            const amount = (consoleConfig.hasFoodRate * weight * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
          // fallback if hasFoodRate is not available
          return null;
        } else {
          // Use standard rates
          if (weight <= 5 && consoleConfig["1-5kg"]) {
            const amount = (consoleConfig["1-5kg"] * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
          if (weight > 5 && weight <= 10 && consoleConfig["6-10kg"]) {
            const amount = (consoleConfig["6-10kg"] * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
          if (weight > 10 && consoleConfig.ratePerKg) {
            const amount = ((weight * consoleConfig.ratePerKg) * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * weight;
            return amount;
          }
        }
        // fallback to ratePerKg if slabs are missing
        if (consoleConfig.ratePerKg && weight > 10) {
          const amount = ((consoleConfig.ratePerKg * weight) * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * weight;
          return amount;
        }
        return null; // No matching rate found
      } else {
        return null;
      }
    }
  return null;
} 


 