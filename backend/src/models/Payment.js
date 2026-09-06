const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'SUCCEEDED', 'FAILED'], default: 'PENDING' },
  transactionRef: { type: String }, // would be the real gateway's payment ID in production
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);