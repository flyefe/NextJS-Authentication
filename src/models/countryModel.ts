
// This model can be used to store information about countries.

import mongoose from 'mongoose'

const RateSchema = new mongoose.Schema({
  "0.5": Number,
  "1.0": Number,
  "1.5": Number,
  "2.0": Number,
  "2.5": Number,
  "3.0": Number,
  "3.5": Number,
  "4.0": Number,
  "4.5": Number,
  "5.0": Number
}, { _id: false })

const OptionRateSchema = new mongoose.Schema({
  "1-5kg": String,
  "6-10kg": String,
  "above10kg": String,
}, { _id: false })

const ShippingConfigSchema = new mongoose.Schema({
  availableOptions: [String],
  allowedGoods: [String],
  kgRates: RateSchema,
  extraHalfKgRate: Number,
  subChargePercent: Number,
  vatPercent: Number,
  exchangeRate: Number,
  fastTrackRate: OptionRateSchema,
  consoleRate: OptionRateSchema,
  seaRate: Number,
  "20ftRate": Number,
  "40ftRate": Number,
  customClearanceRate: Number,
}, { _id: false })

const CountrySchema = new mongoose.Schema({
  name: String,
  code: String,
  export: ShippingConfigSchema,
  import: ShippingConfigSchema,
})

export default mongoose.models.Country || mongoose.model('Country', CountrySchema)
