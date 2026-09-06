// Calculates a score for a provider based on distance and rating.
// Lower distance = better. Higher rating = better.
// Score is normalized so both factors contribute fairly, regardless of scale.

const calculateScore = (provider, maxDistanceKm) => {
  const distanceKm = provider.distanceKm;
  const rating = provider.rating?.average || 0;

  // Distance score: closer = higher score (1 = right next to customer, 0 = at max distance)
  const distanceScore = 1 - (distanceKm / maxDistanceKm);

  // Rating score: normalize 0-5 rating to 0-1
  const ratingScore = rating / 5;

  // Weighted combination: distance matters slightly more than rating for home services
  // (a highly-rated provider 8km away is less useful than a decent one 1km away)
  const WEIGHT_DISTANCE = 0.6;
  const WEIGHT_RATING = 0.4;

  return (distanceScore * WEIGHT_DISTANCE) + (ratingScore * WEIGHT_RATING);
};

const rankProviders = (providers, maxDistanceKm) => {
  return providers
    .map((provider) => ({
      ...provider,
      score: calculateScore(provider, maxDistanceKm),
    }))
    .sort((a, b) => b.score - a.score); // highest score first
};

module.exports = { calculateScore, rankProviders };