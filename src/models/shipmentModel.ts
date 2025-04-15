import mongoose from 'mongoose'

// Define the Shipment schema
const ShipmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true }, // Unified route reference
  // Removed: type (derive from Route.scope)
  origin: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    addressLine: { type: String },
    state: { type: String },
    postalCode: { type: String },
    phoneNumber: { type: String },
    contactName: { type: String }
  },
  destination: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    addressLine: { type: String },
    postalCode: { type: String },
    phoneNumber: { type: String },
    contactName: { type: String }
  },
  goodsCategory: { type: String, enum: ['Has Battery', 'Other'], required: true },
  weightKg: { type: Number, required: true },
  volumeCbm: { type: Number, required: true },
  shippingOption: { type: String, enum: ['Express', 'Fast Track', 'Console'], required: true },
  totalCost: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'], default: 'pending' },
  // Optionally keep localRouteSnapshot or shipmentSnapshot if needed for audit/history
  localRouteSnapshot: { type: Object },
  shipmentSnapshot: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  auditTrail: [{
    action: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

// Export the Shipment model
export default mongoose.models.Shipment || mongoose.model('Shipment', ShipmentSchema)
