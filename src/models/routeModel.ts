import mongoose from "mongoose";
import Country from "./countryModel";
import Address from "./addressModel";

// Rates sub-schema
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
  "5.0": Number
  extraHalfKgRate: Number,
}, { _id: false });

const OptionRateSchema = new mongoose.Schema({
  "1-5kg": String,
  "6-10kg": String,
  "above10kg": String,
  ratePerKg: Number,
  ratePerPiece: Number,
  ratePerCBM: Number,
  ratePer20ft: Number,
  ratePer40ft: Number,
  customClearanceRateSea: Number,
  customClearanceRateAir: Number,
  exchangeRate: Number,
}, { _id: false });

const ShippingConfigSchema = new mongoose.Schema({
  availableOptions: [String],
  allowedGoods: [String],
  expressRate: ExpressRateSchema,
  fastTrackRate: OptionRateSchema,
  consoleRate: OptionRateSchema,
  subCharge: { type: Number, default: 0 },
  vatPercent: { type: Number, default: 0 },
}, { _id: false });

const RouteSchema = new mongoose.Schema({
  routeName: { type: String },
  scope: { type: String, enum: ["local", "international"], default: "international" },
  routeType: { type: String, enum: ["intra-city", "inter-city"] },

  export: { type: ShippingConfigSchema },
  import: { type: ShippingConfigSchema },
  
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Route = mongoose.models.Route || mongoose.model("Route", RouteSchema);
export default Route;


