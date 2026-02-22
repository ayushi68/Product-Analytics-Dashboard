const asyncHandler = require("../utils/asyncHandler");
const { getAnalytics } = require("../services/analyticsService");

const analytics = asyncHandler(async (req, res) => {
  const result = await getAnalytics({
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    age: req.query.age,
    ageGroup: req.query.ageGroup,
    gender: req.query.gender,
    featureName: req.query.featureName
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  analytics
};
