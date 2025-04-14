import { Shipment } from './models'; // Adjust path as needed

// Define types for the function parameters
interface Route {
  origin_country: string;
  destination_country: string;
}

async function calculateExpressShippingRate(
  route: Route,
  option: string,
  weight: number,
  goodsCategory: string
): Promise<number> {
  // Check if it's an export or import scenario
  const isExport = route.origin_country === 'Nigeria';
  const isImport = route.destination_country === 'Nigeria';
  const country_key = isExport ? route.destination_country : route.origin_country;

  // Fetch data from the database based on country and option
  const countryRates = await Shipment.findOne({ country: country_key });

  // Function to get the rate for a specific weight range
  const getRatesUpTo5Kg = (country: string, option: string, category: string) => {
    // Fetches rates for the specific country and option (Express, etc.)
    if (countryRates) {
      return countryRates[option].kgRates; // Assumes the rates are under the selected option
    }
    return [];
  };

  // Get the additional rate for every extra 0.5kg
  const getExtraHalfKgRate = (country: string, option: string, category: string) => {
    if (countryRates) {
      return countryRates[option].extraHalfKgRate;
    }
    return 0;
  };

  // Get VAT and Sub-charge values
  const getVAT = (country: string) => {
    if (countryRates) {
      return countryRates.vatPercent;
    }
    return 0;
  };

  const getSubCharge = (country: string) => {
    if (countryRates) {
      return countryRates.subChargePercent;
    }
    return 0;
  };

  // Get the exchange rate
  const getExchangeRate = (country: string) => {
    if (countryRates) {
      return countryRates.exchangeRate;
    }
    return 0;
  };

  // Get the base rates for the selected country and shipping option
  const base_rates_0_5kg = getRatesUpTo5Kg(country_key, option, goodsCategory); // Array of 0.5kg steps [rate_0.5kg, rate_1kg, ..., rate_5kg]
  const extra_half_kg_rate = getExtraHalfKgRate(country_key, option, goodsCategory); // flat rate after 5kg
  const vat = getVAT(country_key);
  const sub_charge = getSubCharge(country_key);
  const exchange_rate = getExchangeRate(country_key);

  let total = 0;

  if (weight <= 5) {
    // Find the correct 0.5kg slab
    const slabIndex = Math.ceil(weight / 0.5) - 1;
    const base_rate = base_rates_0_5kg[slabIndex];

    const sub = base_rate * (sub_charge / 100); // Subcharge applied to the rate
    const vat_amount = base_rate * (vat / 100); // VAT applied to the rate

    total = (base_rate + sub + vat_amount) * exchange_rate;
  } else {
    // Calculate for the first 5kg
    const base_rate_5kg = base_rates_0_5kg[9]; // index for 5kg
    const sub_5kg = base_rate_5kg * (sub_charge / 100);
    const vat_5kg = base_rate_5kg * (vat / 100);
    const total_5kg = base_rate_5kg + sub_5kg + vat_5kg;

    // Calculate extra half kg blocks after 5kg
    const extra_weight = weight - 5;
    const extra_blocks = Math.ceil(extra_weight / 0.5);
    const extra_rate_total =
      extra_blocks *
      (extra_half_kg_rate + extra_half_kg_rate * (sub_charge / 100) + extra_half_kg_rate * (vat / 100));

    total = (total_5kg + extra_rate_total) * exchange_rate;
  }

  return total;
}
