const Notification = require('../models/Notification');

const createNotification = async ({ userId, message, relatedRequest }) => {
  return Notification.create({ user: userId, message, relatedRequest });
};

module.exports = { createNotification };