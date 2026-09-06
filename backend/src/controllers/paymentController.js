const Payment = require('../models/Payment');
const ServiceRequest = require('../models/ServiceRequest');

const createPayment = async (req, res) => {
  try {
    const { requestId, amount } = req.body;

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not your request' });
    }

    // In a real integration, this is where we'd call Stripe/Razorpay's API
    // and get back a real transaction reference + status.
    // We simulate a successful payment here.
    const payment = await Payment.create({
      request: requestId,
      customer: req.user.id,
      amount,
      status: 'SUCCEEDED',
      transactionRef: `MOCK-${Date.now()}`,
    });

    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getPaymentByRequest = async (req, res) => {
  try {
    const payment = await Payment.findOne({ request: req.params.requestId });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'No payment found for this request' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createPayment, getPaymentByRequest };