import mongoose from "mongoose";

const ShipmentOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },

  shippingOption: { 
    type: String, 
    required: true, 
    enum: ["Express", "Fast Track", "Console", "Sea"] 
  },

  goodsCategory: {
    type: String,
    required: true,
    enum: ["Has Battery", "No Battery", "Contains Food Stuff"]
  },

  weight: { type: Number, required: true }, // in KG
  volume: { type: Number, required: true }, // in CBM
  containerType: { type: String, required: true }, // 20ft, 40ft, etc.

  pickupAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  dropOffAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },

  originCountry: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
  destinationCountry: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },

  amount: { type: Number, required: true }, // total cost (naira, USD, etc.)

  exchangeRateUsed: { type: Number }, // store applied rate for historical accuracy

  status: { 
    type: String, 
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },

  trackingNumber: { type: String },
  notes: { type: String },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const ShipmentOrder = mongoose.models.ShipmentOrder || mongoose.model("ShipmentOrder", ShipmentOrderSchema);

export default ShipmentOrder;
