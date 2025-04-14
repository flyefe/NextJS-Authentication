// models/LocalRoute.js
import mongoose from "mongoose";

const kgRatesSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

const localRouteSchema = new mongoose.Schema(
  {
    originCity: { type: String, required: true },
    destinationCity: { type: String, required: true },
    country: { type: String, default: "Nigeria" },

    option: {
      type: String,
      enum: ["Intra-city Express", "Standard", "Bike Delivery", "Same Day", "Next Day"],
      required: true,
    },

    routeType: {
      type: String,
      enum: ["intra-city", "inter-city"],
      required: true,
    },

    kgRates: { type: kgRatesSchema, required: true },
    extraHalfKgRate: { type: Number, required: true },

    subChargePercent: { type: Number, default: 0 },
    vatPercent: { type: Number, default: 0 },

    active: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
export default mongoose.models.LocalRoute || mongoose.model("LocalRoute", localRouteSchema);
