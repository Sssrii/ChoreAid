const mongoose = require('mongoose');

const providerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  services: [{ type: String }],
  isOnline: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  rating: {
  average: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
},
}, { timestamps: true });

providerProfileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);