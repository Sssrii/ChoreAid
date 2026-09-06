const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, toggleAvailability, updateLocation, findNearbyProviders, getMyProfile } = require('../controllers/providerController');
router.put('/profile', protect, createOrUpdateProfile);
router.put('/availability', protect, toggleAvailability);
router.put('/location', protect, updateLocation);
router.get('/nearby', findNearbyProviders);
router.get('/profile', protect, getMyProfile);

module.exports = router;