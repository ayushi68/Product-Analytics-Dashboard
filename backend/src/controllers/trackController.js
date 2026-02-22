const asyncHandler = require("../utils/asyncHandler");
const { trackFeatureClick } = require("../services/trackService");

const track = asyncHandler(async (req, res) => {
  const click = await trackFeatureClick({
    userId: req.user.sub,
    featureName: req.body.feature_name,
    timestamp: req.body.timestamp
  });

  res.status(201).json({
    success: true,
    data: click
  });
});

module.exports = {
  track
};
