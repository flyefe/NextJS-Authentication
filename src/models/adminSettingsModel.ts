// This model can be used to store information about the admin settings.

import mongoose from 'mongoose'

const AdminSettingsSchema = new mongoose.Schema({
  defaultExchangeRate: Number,
  defaultVAT: Number,
  defaultSubCharge: Number,
  maintenanceMode: Boolean,
  supportedOptions: [String],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export default mongoose.models.AdminSettings || mongoose.model('AdminSettings', AdminSettingsSchema)
