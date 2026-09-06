const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ['REQUESTED', 'MATCHING', 'ACCEPTED', 'PROVIDER_ON_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'REQUESTED',
  },
  assignedProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);