import mongoose from "mongoose";

// Rates sub-schemas

// Express Rate sub-schema
const ExpressRateSchema = new mongoose.Schema({
  "0_5kg": { type: Number, default: 0 },
  "1_0kg": { type: Number, default: 0 },
  "1_5kg": { type: Number, default: 0 },
  "2_0kg": { type: Number, default: 0 },
  "2_5kg": { type: Number, default: 0 },
  "3_0kg": { type: Number, default: 0 },
  "3_5kg": { type: Number, default: 0 },
  "4_0kg": { type: Number, default: 0 },
  "4_5kg": { type: Number, default: 0 },
  "5_0kg": { type: Number, default: 0 },
  extraHalfKgRate: { type: Number, default: 0 },
  subCharge: { type: Number, default: 0 },
  vatPercent: { type: Number, default: 0 },
  goodsCategory: { type: [String], default: ["Has Battery", "Chemical", "Food"] },
  eta: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
  baseRate: { type: Number, default: 40000 },
}, { _id: false });

// Air Rate sub-schema
const airRateSchema = new mongoose.Schema({
  "1-5kg": { type: Number, default: 0 },
  "6-10kg": { type: Number, default: 0 },
  "above10kg": { type: Number, default: 0 },
  ratePerKg: { type: Number, default: 0 },
  ratePerPiece: { type: Number, default: 0 },
  ratePerVolume: { type: Number, default: 0 },
  hasBatteryRate: { type: Number, default: 0 },
  hasFoodRate: { type: Number, default: 0 },
  specialGoodsRate: { type: Number, default: 0 },
  hasChemicalRate: { type: Number, default: 0 },
  customClearanceRateAir: { type: Number, default: 0 },
  goodsCategory: { type: [String], default: ["Has Battery", "Chemical", "Contain Food", "Has No Battery", "Special Goods"] },
  eta: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
}, { _id: false });

// Sea Rate sub-schema
const SeaRateSchema = new mongoose.Schema({
  ratePerCBM: { type: Number, default: 0 },
  ratePer20ft: { type: Number, default: 0 },
  ratePer40ft: { type: Number, default: 0 },
  ratePer40ftHighCube: { type: Number, default: 0 },
  ratePer45ftHighCube: { type: Number, default: 0 },
  customClearanceRatePerCBM: { type: Number, default: 0 },
  customClearanceCost: { type: Number, default: 0 },
  documentationCost: { type: Number, default: 0 },
  goodsCategory: { type: [String], default: ["Has Battery", "Chemical", "Food"] },
  eta: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
}, { _id: false });

// Shipping Option Config sub-schema
const ShippingOptionConfigSchema = new mongoose.Schema({
  availableOptions: {
    expressRate: ExpressRateSchema,
    fastTrackRate: airRateSchema,
    consoleRate: airRateSchema,
    seaRate: SeaRateSchema,
  },
}, { _id: false });

// Route Main Schema
const RouteSchema = new mongoose.Schema({
  routeName: { type: String },
  scope: { type: String, enum: ["local", "international"], default: "international" },
  routeType: { type: String, enum: ["intra-city", "inter-city", null] },
  category: { type: String, enum: ["import", "export"], required: false },
  exchangeRate: { type: Number, default: 1 },
  currency: { type: String, default: "USD" },

  // Country and City IDs
  originCountry: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: false },
  destinationCountry: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: false },
  originCity: { type: String, required: false },
  destinationCity: { type: String, required: false },
  originAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  destinationAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },

  shippingOptionConfig: { type: ShippingOptionConfigSchema, required: false },
  
  active: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: false });

const Route = mongoose.models.Route || mongoose.model("Route", RouteSchema);
export default Route;


