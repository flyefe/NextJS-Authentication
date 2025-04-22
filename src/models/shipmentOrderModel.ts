import mongoose from "mongoose";

const ShipmentOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerPhone: { type: String, required: false, default: "" },

  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  shippingOption: { type: String, required: true, default: "" },
  goodsCategory: { type: String, required: false, default: "" },

  item: { type: String, required: false, default: "" },
  itemDescription: { type: String, required: false, default: "" },
  quantity: { type: Number, required: false, default: null },
  itemCost: { type: Number, required: false, default: null },

  weight: { type: Number, required: false, default: null },
  volume: { type: Number, required: false, default: null },
  containerType: { 
    type: String, 
    enum: ["20ft", "40ft", "40ft High Cube", "45ft High Cube", "Other", ""],
    required: false,
    default: "" 
  },

  pickupAddress: { type: String, required: false, default: "" },
  dropOffAddress: { type: String, required: false, default: "" },

  originCountry: { type: String, required: true, default: "" },
  destinationCountry: { type: String, required: true, default: "" },

  amount: { type: Number, required: false, default: null },
  exchangeRateUsed: { type: Number, required: false, default: null },
  comment: { type: String, required: false, default: "" },
  remark: { type: String, required: false, default: "" },

  status: { 
    type: String, 
    enum: ["pending", "processing", "shipped", "delivered", "cancelled", ""],
    default: "" 
  },

  trackingNumber: { type: String, required: true, default: "" },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  updatedAt: { type: Date, default: Date.now },

  eta: { type: Date, default: null },
  pickupTime: { type: Date, default: null },
  deliveryTime: { type: Date, default: null },
  referenceNumber: { type: String, default: "" },

  updateHistory: [{
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    changes: { type: Object, default: {} },
    comment: { type: String, default: "" },
  }],

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

}, { timestamps: true });

const ShipmentOrder = mongoose.models.ShipmentOrder || mongoose.model("ShipmentOrder", ShipmentOrderSchema);

export default ShipmentOrder;
