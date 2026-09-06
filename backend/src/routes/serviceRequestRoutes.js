const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, acceptRequest, updateStatus, getNearbyRequests, getAssignedRequests } = require('../controllers/serviceRequestController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/nearby', protect, getNearbyRequests);
router.get('/assigned', protect, getAssignedRequests);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/status', protect, updateStatus);

module.exports = router;