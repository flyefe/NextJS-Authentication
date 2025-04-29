import type { Route } from "@/hooks/useRoutes";

/**
 * Calculate the FastTrack shipping rate for a given route and kg.
 * Returns null if FastTrack is not available for this route.
 */
console.log("TEST LOG FROM FASTTRACK SHIPPING") 
export function calculateFastTrackShippingRate(
  route: Route,
  kg: number,
  goodsCategory: string | null,
): { amount: number, calculationDetails: string } | null { 
  if (!route.shippingOptionConfig?.availableOptions?.fastTrackRate?.active) return null;
  const fastTrackConfig = route.shippingOptionConfig?.availableOptions?.fastTrackRate;
  if (!fastTrackConfig || !fastTrackConfig.active) return null; 
  console.log("fastTrackConfig2:", fastTrackConfig) 
  //Import Logic
  let amount = 0;
  let originCountry = route.originCountry?.name;
  let destinationCountry = route.destinationCountry?.name;
  console.log("amount:", amount);
  console.log("goodsCategory:", goodsCategory);
  if (route.category === "import") {
    console.log("FastTrack status for Import:", route.category);
    console.log("FastTrack status for originCountry:", originCountry);
    //China calculation for air
    if (originCountry === "China" && destinationCountry === "Nigeria") {
      console.log("fastTrackConfigChina:", fastTrackConfig);
      if (goodsCategory && goodsCategory === "Has No Battery") {
        amount = ((kg * fastTrackConfig.ratePerKg) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
        const calculationDetails = `Formula: (kg * ratePerKg * exchangeRate) + (customClearanceRateAir * kg)\nValues: (${kg} * ${fastTrackConfig.ratePerKg} * ${route.exchangeRate ?? 1}) + (${fastTrackConfig.customClearanceRateAir ?? 0} * ${kg})`;
        return { amount, calculationDetails };
      } else if (goodsCategory && goodsCategory === "Has Battery") {
        amount = ((kg * fastTrackConfig.hasBatteryRate) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
        const calculationDetails = `Formula: (kg * hasBatteryRate * exchangeRate) + (customClearanceRateAir * kg)\nValues: (${kg} * ${fastTrackConfig.hasBatteryRate} * ${route.exchangeRate ?? 1}) + (${fastTrackConfig.customClearanceRateAir ?? 0} * ${kg})`;
        return { amount, calculationDetails };
      } else if (goodsCategory && goodsCategory === "Contain Chemical") {
        let amount = ((kg * fastTrackConfig.hasChemicalRate) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
        const calculationDetails = `Formula: (kg * hasChemicalRate * exchangeRate) + (customClearanceRateAir * kg)\nValues: (${kg} * ${fastTrackConfig.hasChemicalRate} * ${route.exchangeRate ?? 1}) + (${fastTrackConfig.customClearanceRateAir ?? 0} * ${kg})`;
        return { amount, calculationDetails };
      } else if (goodsCategory && goodsCategory === "Contain Food") {
        let amount = ((kg * fastTrackConfig.hasFoodRate) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
        const calculationDetails = `Formula: (kg * hasFoodRate * exchangeRate) + (customClearanceRateAir * kg)\nValues: (${kg} * ${fastTrackConfig.hasFoodRate} * ${route.exchangeRate ?? 1}) + (${fastTrackConfig.customClearanceRateAir ?? 0} * ${kg})`;
        return { amount, calculationDetails };
      } else if (goodsCategory && goodsCategory === "SpecialGoods") {
        const amount = ((kg * fastTrackConfig.specialGoodsRate) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
        const calculationDetails = `Formula: (kg * specialGoodsRate * exchangeRate) + (customClearanceRateAir * kg)\nValues: (${kg} * ${fastTrackConfig.specialGoodsRate} * ${route.exchangeRate ?? 1}) + (${fastTrackConfig.customClearanceRateAir ?? 0} * ${kg})`;
        return { amount, calculationDetails };
      }
      //Other countries (US, UK, Canada)
    } else if (originCountry !== "China" && destinationCountry === "Nigeria") {
      // If goodsCategory contains food, use hasFoodRate for all slabs
      if (goodsCategory && (goodsCategory === "ContainFood" || goodsCategory === "Food")) {
        if (kg <= 5 && fastTrackConfig.hasFoodRate) {
          let amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1));
          const calculationDetails = `Formula: hasFoodRate * kg * exchangeRate\nValues: ${fastTrackConfig.hasFoodRate} * ${kg} * ${route.exchangeRate ?? 1}`;
          return { amount, calculationDetails };
        }
        if (kg > 5 && kg <= 10 && fastTrackConfig.hasFoodRate) {
          let amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1));
          const calculationDetails = `Formula: hasFoodRate * kg * exchangeRate\nValues: ${fastTrackConfig.hasFoodRate} * ${kg} * ${route.exchangeRate ?? 1}`;
          return { amount, calculationDetails };
        }
        if (kg > 10 && fastTrackConfig.hasFoodRate) {
          let amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1));
          const calculationDetails = `Formula: hasFoodRate * kg * exchangeRate\nValues: ${fastTrackConfig.hasFoodRate} * ${kg} * ${route.exchangeRate ?? 1}`;
          return { amount, calculationDetails };
        }
        // fallback if hasFoodRate is not available
        return null;
      } else {
        // Use standard rates
        if (kg <= 5 && fastTrackConfig["1-5kg"]) {
          let amount = (fastTrackConfig["1-5kg"] * (route.exchangeRate ?? 1))
          const calculationDetails = `Formula: 1-5kg Slab Rate * exchangeRate\nValues: ${fastTrackConfig["1-5kg"]} * ${route.exchangeRate ?? 1}`;
          return { amount, calculationDetails };
        }
        if (kg > 5 && kg <= 10 && fastTrackConfig["6-10kg"]) {
          let amount = (fastTrackConfig["6-10kg"] * (route.exchangeRate ?? 1))
          const calculationDetails = `Formula: 6-10kg Slab Rate * exchangeRate\nValues: ${fastTrackConfig["6-10kg"]} * ${route.exchangeRate ?? 1}`;
          return { amount, calculationDetails };
        }
        if (kg > 10 && fastTrackConfig.ratePerKg) {
          let amount = ((kg * fastTrackConfig.ratePerKg) * (route.exchangeRate ?? 1))
          const calculationDetails = `Formula: kg * ratePerKg * exchangeRate\nValues: ${kg} * ${fastTrackConfig.ratePerKg} * ${route.exchangeRate ?? 1}`;
          return { amount, calculationDetails };
        }
        // fallback to ratePerKg if slabs are missing
        if (fastTrackConfig.ratePerKg && kg > 10) {
          let amount = ((fastTrackConfig.ratePerKg * kg) * (route.exchangeRate ?? 1))
          const calculationDetails = `Formula: kg * ratePerKg * exchangeRate\nValues: ${kg} * ${fastTrackConfig.ratePerKg} * ${route.exchangeRate ?? 1}`;
          return { amount, calculationDetails };
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
        if (fastTrackConfig.goodsCategory === "Contain Food" || fastTrackConfig.goodsCategory === "Food") {
          if (kg <= 5 && fastTrackConfig.hasFoodRate) {
            const amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
            return amount;
          }
          if (kg > 5 && kg <= 10 && fastTrackConfig.hasFoodRate) {
            const amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
            return amount;
          }
          if (kg > 10 && fastTrackConfig.hasFoodRate) {
            const amount = (fastTrackConfig.hasFoodRate * kg * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
            return amount;
          }
          // fallback if hasFoodRate is not available
          return null;
        } else {
          // Use standard rates
          if (kg <= 5 && fastTrackConfig["1-5kg"]) {
            const amount = (fastTrackConfig["1-5kg"] * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
            return amount;
          }
          if (kg > 5 && kg <= 10 && fastTrackConfig["6-10kg"]) {
            const amount = (fastTrackConfig["6-10kg"] * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
            return amount;
          }
          if (kg > 10 && fastTrackConfig.ratePerKg) {
            const amount = ((kg * fastTrackConfig.ratePerKg) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
            return amount;
          }
        }
        // fallback to ratePerKg if slabs are missing
        if (fastTrackConfig.ratePerKg && kg > 10) {
          const amount = ((fastTrackConfig.ratePerKg * kg) * (route.exchangeRate ?? 1)) + (fastTrackConfig.customClearanceRateAir ?? 0) * kg;
          return amount;
        }
        return null; // No matching rate found
      } else {
        return null;
      }
    }
  return null;
}


 