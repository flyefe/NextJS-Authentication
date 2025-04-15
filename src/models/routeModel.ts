import mongoose from "mongoose";

// Route Schema for both Local and International Routes
const kgRatesSchema = new mongoose.Schema({
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
}, { _id: false });

const RouteSchema = new mongoose.Schema({
  // General route info
  originCountry: { type: String, required: true },
  originCity: { type: String, required: true },
  destinationCountry: { type: String, required: true },
  destinationCity: { type: String, required: true },
  routeName: { type: String }, // Optional: for easy reference
  description: { type: String }, // Optional
  routeType: { type: String, enum: ["intra-city", "inter-city"], required: true },
  scope: { type: String, enum: ["local", "international"], default: "international", required: true },

  // Local route-specific fields (only required for local routes)
  option: {
    type: String,
    enum: [
      "Intra-city Express",
      "Standard",
      "Bike Delivery",
      "Same Day",
      "Next Day"
    ],
    required: function() { return this.scope === 'local'; },
  },
  kgRates: {
    type: kgRatesSchema,
    required: function() { return this.scope === 'local'; },
  },
  extraHalfKgRate: { type: Number },
  vatPercent: { type: Number, default: 0 },

  // General fields
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Route = mongoose.models.Route || mongoose.model("Route", RouteSchema);

export default Route;