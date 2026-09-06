const ProviderProfile = require('../models/ProviderProfile');

const createOrUpdateProfile = async (req, res) => {
  try {
    const { services } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user.id },
      { services },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    profile.isOnline = !profile.isOnline;
    await profile.save();

    res.status(200).json({ success: true, data: { isOnline: profile.isOnline } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user.id },
      { location: { type: 'Point', coordinates: [longitude, latitude] } },
      { new: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const findNearbyProviders = async (req, res) => {
  try {
    const { longitude, latitude, service, maxDistanceKm = 10 } = req.query;
    const maxDistanceMeters = maxDistanceKm * 1000;

    const providers = await ProviderProfile.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          distanceField: 'distanceMeters',
          maxDistance: maxDistanceMeters,
          query: { isOnline: true, isVerified: true, services: service },
          spherical: true,
        },
      },
    ]);

    const providersWithKm = providers.map((p) => ({
      ...p,
      distanceKm: p.distanceMeters / 1000,
    }));

    const { rankProviders } = require('../services/matchingService');
    const ranked = rankProviders(providersWithKm, maxDistanceKm);

    res.status(200).json({ success: true, data: ranked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getMyProfile = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = { createOrUpdateProfile, toggleAvailability, updateLocation, findNearbyProviders, getMyProfile };