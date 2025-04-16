import mongoose from "mongoose";

//Rates
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
  exchangeRate: Number,
  fastTrackRate: OptionRateSchema,
  consoleRate: OptionRateSchema,
  seaRate: Number,
  "20ftRate": Number,
  "40ftRate": Number,
  customClearanceRate: Number,
}, { _id: false })

const RouteSchema = new mongoose.Schema({
  // General route info
  originCountry: { type: String, required: false, enum: [] as string[] },
  destinationCountry: { type: String, required: false, enum: [] as string[] },
  
  routeName: { type: String }, // Optional: for easy reference
  scope: { type: String, enum: ["local", "international"], default: "international", required: false },
  routeType: { type: String, enum: ["intra-city", "inter-city"], required: false },

 //General shipping config
  export: { type: ShippingConfigSchema },
  import: { type: ShippingConfigSchema },
  subCharge: { type: Number, default: 0 },
  vatPercent: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Route = mongoose.models.Route || mongoose.model("Route", RouteSchema);

export default Route;