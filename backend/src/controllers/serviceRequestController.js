const ServiceRequest = require('../models/ServiceRequest');
const ProviderProfile = require('../models/ProviderProfile');
const { isValidTransition } = require('../utils/stateMachine');
const { createNotification } = require('../services/notificationService');

const createRequest = async (req, res) => {
  try {
    const { category, description, address } = req.body;

    const request = await ServiceRequest.create({
      customer: req.user.id,
      category,
      description,
      address,
      status: 'MATCHING',
    });

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user.id }).populate('category', 'name');
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const providerId = req.user.id;

    const updatedRequest = await ServiceRequest.findOneAndUpdate(
      { _id: requestId, status: 'MATCHING' },
      { status: 'ACCEPTED', assignedProvider: providerId },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(409).json({
        success: false,
        message: 'Request is no longer available',
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.to(updatedRequest.customer.toString()).emit('requestAccepted', {
        requestId: updatedRequest._id,
        providerId,
        status: updatedRequest.status,
      });
    }

    await createNotification({
      userId: updatedRequest.customer,
      message: 'A provider has accepted your service request.',
      relatedRequest: updatedRequest._id,
    });

    res.status(200).json({ success: true, data: updatedRequest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status: newStatus } = req.body;

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (!isValidTransition(request.status, newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${request.status} to ${newStatus}`,
      });
    }

    request.status = newStatus;
    await request.save();

    const io = req.app.get('io');
    if (io) {
      io.to(request.customer.toString()).emit('statusUpdated', {
        requestId: request._id,
        status: request.status,
      });
    }

    res.status(200).json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getNearbyRequests = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    const requests = await ServiceRequest.find({ status: 'MATCHING' }).populate('category', 'name');

    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAssignedRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ assignedProvider: req.user.id })
      .populate('category', 'name')
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createRequest, getMyRequests, acceptRequest, updateStatus, getNearbyRequests, getAssignedRequests };