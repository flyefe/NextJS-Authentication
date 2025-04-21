import mongoose from "mongoose";

const ShipmentOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  customerPhone: { type: String, required: true },

  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  shippingOption: { type: String, required: true },
  goodsCategory: { type: String, required: false},

  item: { type: String, required: false },
  itemDescription: { type: String, required: false },
  quantity: { type: Number, required: false },
  itemCost: { type: Number, required: false },


  weight: { type: Number, required: false }, // in KG
  volume: { type: Number, required: false }, // in CBM
  containerType: { type: String, enum: ["20ft", "40ft", "40ft High Cube", "45ft High Cube", "Other"], required: false },

  pickupAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  dropOffAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },

  originCountry: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
  destinationCountry: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },

  amount: { type: Number, required: true }, // total cost (naira, USD, etc.)
  exchangeRateUsed: { type: Number }, // store applied rate for historical accuracy
  comment: { type: String },
  remark: { type: String },

  status: { 
    type: String, 
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },

  trackingNumber: { type: String },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now },

  eta: { type: Date },
  pickupTime: { type: Date },
  deliveryTime: { type: Date },
  referenceNumber: { type: String },
  updateHistory: [{
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changes: { type: Object }, // { fieldName: previousValue }
    comment: { type: String },
  }],

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const ShipmentOrder = mongoose.models.ShipmentOrder || mongoose.model("ShipmentOrder", ShipmentOrderSchema);

export default ShipmentOrder;
