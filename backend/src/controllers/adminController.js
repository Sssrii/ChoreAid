const ProviderProfile = require('../models/ProviderProfile');
const ServiceRequest = require('../models/ServiceRequest');

const verifyProvider = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.params.userId },
      { isVerified: true },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('customer', 'name email')
      .populate('assignedProvider', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { verifyProvider, getAllRequests };

