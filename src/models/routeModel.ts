import mongoose from "mongoose";

// Rates sub-schemas

// Express Rate sub-schema
const ExpressRateSchema = new mongoose.Schema({
  "0.5": Number,
  "1.0": Number,
  "1.5": Number,
  "2.0": Number,
  "2.5": Number,
  "3.0": Number,
  "3.5": Number,
  "4.0": Number,
  "4.5": Number,
  "5.0": Number,
  extraHalfKgRate: Number,
  subCharge: { type: Number, default: 0 },
  vatPercent: { type: Number, default: 0 },
  goodsCategory: [String],
  active: { type: Boolean, default: true },
}, { _id: false });

// Air Rate sub-schema
const airRateSchema = new mongoose.Schema({
  "1-5kg": String,
  "6-10kg": String,
  "above10kg": String,
  ratePerKg: Number,
  ratePerPiece: Number,
  ratePerVolume: Number,
  customClearanceRateAir: Number,
  goodsCategory: [String],
  active: { type: Boolean, default: true },
}, { _id: false });

// Sea Rate sub-schema
const SeaRateSchema = new mongoose.Schema({
  ratePerCBM: Number,
  ratePer20ft: Number,
  ratePer40ft: Number,
  customClearanceRatePerCBM: Number,
  customClearanceCost: Number,
  documentationCost: Number,
  goodsCategory: [String],
  active: { type: Boolean, default: true },
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
  routeType: { type: String, enum: ["intra-city", "inter-city"] },
  category: { type: String, enum: ["import", "export"], required: true },

  // Country and City IDs
  originCountry: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  destinationCountry: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  originCity: { type: String, required: true },
  destinationCity: { type: String, required: true },
  originAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  destinationAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },

  shippingOptionConfig: { type: ShippingOptionConfigSchema, required: true },
  
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Route = mongoose.models.Route || mongoose.model("Route", RouteSchema);
export default Route;


