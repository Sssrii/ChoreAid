const express = require('express');
const router = express.Router();
const { verifyProvider, getAllRequests } = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

router.put('/providers/:userId/verify', protect, isAdmin, verifyProvider);
router.get('/requests', protect, isAdmin, getAllRequests);

module.exports = router;