const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, toggleAvailability, updateLocation, findNearbyProviders } = require('../controllers/providerController');
const protect = require('../middleware/authMiddleware');

router.put('/profile', protect, createOrUpdateProfile);
router.put('/availability', protect, toggleAvailability);
router.put('/location', protect, updateLocation);
router.get('/nearby', findNearbyProviders);

module.exports = router;