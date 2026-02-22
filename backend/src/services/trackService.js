const FeatureClickModel = require("../models/featureClickModel");
const ApiError = require("../utils/ApiError");

const trackFeatureClick = async ({ userId, featureName, timestamp }) => {
  if (!featureName || String(featureName).trim().length === 0) {
    throw new ApiError(400, "feature_name is required.");
  }

  if (timestamp && Number.isNaN(Date.parse(timestamp))) {
    throw new ApiError(400, "timestamp must be a valid ISO datetime.");
  }

  const click = await FeatureClickModel.create({
    userId,
    featureName: String(featureName).trim(),
    timestamp: timestamp || null
  });

  return click;
};

module.exports = {
  trackFeatureClick
};
