import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
  // General route info
  originCountry: { type: String, required: false },
  originCity: { type: String, required: false },
  destinationCountry: { type: String, required: false },
  destinationCity: { type: String, required: false },
  routeName: { type: String }, // Optional: for easy reference
  description: { type: String }, // Optional
  scope: { type: String, enum: ["local", "international"], default: "international", required: false },
  routeType: { type: String, enum: ["intra-city", "inter-city"], required: false },


 //General shipping config
  subCharge: { type: Number, default: 0 },
  vatPercent: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Route = mongoose.models.Route || mongoose.model("Route", RouteSchema);

export default Route;