import type { Route } from "@/hooks/useRoutes";

/**
 * Calculate the console shipping rate for a given route and kg.
 * Returns null if console is not available for this route.
 */

console.log("TEST LOG FROM CONSOLE SHIPPING") 
export function calculateConsoleShippingRate(
  route: Route,
  kg: number,
  goodsCategory: string | null,
): number | null {
  if (!route.shippingOptionConfig?.availableOptions?.consoleRate?.active) return null;
  const consoleConfig = route.shippingOptionConfig?.availableOptions?.consoleRate;
  if (!consoleConfig || !consoleConfig.active) return null; 
  //Import
  let amount = 0;
  let originCountry = route.originCountry?.name;
  let destinationCountry = route.destinationCountry?.name;
  if (route.category === "import") {
    //China calculation for air
    if (originCountry === "China" && destinationCountry === "Nigeria") {
      if (goodsCategory === "Has No Battery") {
        amount = ((kg * consoleConfig.ratePerKg) * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0);
        return amount;
      } else if (goodsCategory === "Has Battery") {
        amount = ((kg * consoleConfig.hasBatteryRate) * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0);
        return amount;
      } else if (goodsCategory === "Has Chemical") {
        amount = ((kg * consoleConfig.hasChemicalRate) * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0);
        return amount;
      } else if (goodsCategory === "Contain Food") {
        amount = ((kg * consoleConfig.hasFoodRate) * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0);
        return amount;
      } else if (goodsCategory === "SpecialGoods") {
        amount = ((kg * consoleConfig.specialGoodsRate) * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0);
        return amount;
      }
      //Other countries (US, UK, Canada)
    } else if (originCountry !== "China" && destinationCountry === "Nigeria") {
      // If goodsCategory contains food, use hasFoodRate for all slabs
      if (goodsCategory === "Contain Food" || goodsCategory === "Food") {
        if (kg <= 5 && consoleConfig.hasFoodRate) {
          amount = (consoleConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * kg;
          return amount;
        }
        if (kg > 5 && kg <= 10 && consoleConfig.hasFoodRate) {
          amount = (consoleConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * kg;
          return amount;
        }
        if (kg > 10 && consoleConfig.hasFoodRate) {
          amount = (consoleConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * kg;
          return amount;
        }
        // fallback if hasFoodRate is not available
        return null;
      } else {
        // Use standard rates
        if (kg <= 5 && consoleConfig["1-5kg"]) {
          amount = (consoleConfig["1-5kg"] * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * kg;
          return amount;
        }
        if (kg > 5 && kg <= 10 && consoleConfig["6-10kg"]) {
          amount = (consoleConfig["6-10kg"] * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * kg;
          return amount;
        }
        if (kg > 10 && consoleConfig.ratePerKg) {
          amount = ((kg * consoleConfig.ratePerKg) * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * kg;
          return amount;
        }
        // fallback to ratePerKg if slabs are missing
        if (consoleConfig.ratePerKg && kg > 10) {
          amount = ((consoleConfig.ratePerKg * kg) * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * kg
          return amount;
        }
        return null;
      }
    }
  }

    //Export
    if (route.category === "export") {
        //To Other countries (US, UK, Canada)
      if (originCountry === "Nigeria") {
        // If goodsCategory contains food, use hasFoodRate for all slabs
        if (goodsCategory === "Contain Food" || goodsCategory === "Food") {
          if (kg <= 5 && consoleConfig.hasFoodRate) {
            amount = (consoleConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * kg;
            return amount;
          }
          if (kg > 5 && kg <= 10 && consoleConfig.hasFoodRate) {
            amount = (consoleConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * kg;
            return amount;
          }
          if (kg > 10 && consoleConfig.hasFoodRate) {
            amount = (consoleConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (consoleConfig.customClearanceRatePerKg ?? 0) * kg;
            return amount;
          }
          // fallback if hasFoodRate is not available
          return null;
        } else {
          // Use standard rates
          if (kg <= 5 && consoleConfig["1-5kg"]) {
            amount = (consoleConfig["1-5kg"] * (route.exchangeRate ?? 1));
          }
          if (kg > 5 && kg <= 10 && consoleConfig["6-10kg"]) {
            amount = (consoleConfig["6-10kg"] * (route.exchangeRate ?? 1));
            return amount;
          }
          if (kg > 10 && consoleConfig.ratePerKg) {
            amount = ((kg * consoleConfig.ratePerKg) * (route.exchangeRate ?? 1));
            return amount;
          }
        }
        // fallback to ratePerKg if slabs are missing
        if (consoleConfig.ratePerKg && kg > 10) {
          amount = ((consoleConfig.ratePerKg * kg) * (route.exchangeRate ?? 1));
          return amount;
        }
        return null; // No matching rate found
      } else {
        return null;
      }
    }
  return null;
} 
 