// This model can be used to store information about any action that was performed on the database.
// This information can be used for debugging, security audits, etc.

import mongoose from 'mongoose'

const AuditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  target: {
    type: { type: String },
    id: mongoose.Schema.Types.ObjectId,
    fieldChanged: String
  },
  before: mongoose.Schema.Types.Mixed,
  after: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
})

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema)
