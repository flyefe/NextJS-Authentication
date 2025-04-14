import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
  originCountry: { type: String, required: true },
  originCity: { type: String, required: true },
  destinationCountry: { type: String, required: true },
  destinationCity: { type: String, required: true },
  routeName: { type: String }, // Optional: for easy reference
  description: { type: String }, // Optional
  routeType: { type: String, enum: ["intra-city", "inter-city"], required: true },
  // Add more fields as needed
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true },
});

const Route = mongoose.models.Route || mongoose.model("Route", RouteSchema);

export default Route;