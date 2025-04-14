import mongoose from 'mongoose'


const ShipmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
  type: { type: String, enum: ['Local', 'International'], required: true },
  localRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'LocalRoute' },
  totalCost: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'], default: 'pending' },
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

export default mongoose.models.Shipment || mongoose.model('Shipment', ShipmentSchema)
