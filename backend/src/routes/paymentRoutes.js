const express = require('express');
const router = express.Router();
const { createPayment, getPaymentByRequest } = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createPayment);
router.get('/:requestId', protect, getPaymentByRequest);

module.exports = router;