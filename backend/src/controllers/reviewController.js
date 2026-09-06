const Review = require('../models/Review');
const ServiceRequest = require('../models/ServiceRequest');
const ProviderProfile = require('../models/ProviderProfile');

const createReview = async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body;

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Can only review completed jobs' });
    }

    if (request.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not your request to review' });
    }

    const review = await Review.create({
      request: requestId,
      customer: req.user.id,
      provider: request.assignedProvider,
      rating,
      comment,
    });

    // Recalculate the provider's average rating
    const providerReviews = await Review.find({ provider: request.assignedProvider });
    const totalRating = providerReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverage = totalRating / providerReviews.length;

    await ProviderProfile.findOneAndUpdate(
      { user: request.assignedProvider },
      {
        'rating.average': newAverage,
        'rating.count': providerReviews.length,
      }
    );

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { createReview };