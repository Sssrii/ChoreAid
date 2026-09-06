

const VALID_TRANSITIONS = {
  REQUESTED: ['MATCHING', 'CANCELLED'],
  MATCHING: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['PROVIDER_ON_WAY', 'CANCELLED'],
  PROVIDER_ON_WAY: ['ARRIVED', 'CANCELLED'],
  ARRIVED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [], 
};

const isValidTransition = (currentStatus, newStatus) => {
  const allowedNext = VALID_TRANSITIONS[currentStatus] || [];
  return allowedNext.includes(newStatus);
};

module.exports = { isValidTransition, VALID_TRANSITIONS };