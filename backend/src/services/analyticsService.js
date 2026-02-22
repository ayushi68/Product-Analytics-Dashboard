const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

const normalizeFilters = ({ startDate, endDate, age, ageGroup, gender }) => {
  let parsedStartDate = null;
  let parsedEndDate = null;
  let parsedAge = null;
  let parsedAgeGroup = null;

  if (startDate) {
    if (Number.isNaN(Date.parse(startDate))) {
      throw new ApiError(400, "startDate must be a valid date.");
    }
    parsedStartDate = new Date(startDate).toISOString();
  }

  if (endDate) {
    if (Number.isNaN(Date.parse(endDate))) {
      throw new ApiError(400, "endDate must be a valid date.");
    }
    parsedEndDate = new Date(endDate).toISOString();
  }

  if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
    throw new ApiError(400, "startDate cannot be greater than endDate.");
  }

  if (age !== undefined) {
    parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      throw new ApiError(400, "age must be a valid integer between 1 and 120.");
    }
  }

  if (ageGroup !== undefined) {
    const allowedAgeGroups = ["<18", "18-40", ">40"];
    if (!allowedAgeGroups.includes(ageGroup)) {
      throw new ApiError(400, "ageGroup must be one of <18, 18-40, >40.");
    }
    parsedAgeGroup = ageGroup;
  }

  if (gender !== undefined) {
    const allowedGenders = ["Male", "Female", "Other"];
    if (!allowedGenders.includes(gender)) {
      throw new ApiError(400, "gender must be one of Male, Female, Other.");
    }
  }

  return {
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    age: parsedAge,
    ageGroup: parsedAgeGroup,
    gender: gender || null
  };
};

const buildWhereClause = (filters, includeFeatureName, featureName) => {
  const conditions = [];
  const values = [];

  if (filters.startDate) {
    values.push(filters.startDate);
    conditions.push(`fc.clicked_at >= $${values.length}`);
  }

  if (filters.endDate) {
    values.push(filters.endDate);
    conditions.push(`fc.clicked_at <= $${values.length}`);
  }

  if (filters.age !== null) {
    values.push(filters.age);
    conditions.push(`u.age = $${values.length}`);
  }

  if (filters.ageGroup) {
    if (filters.ageGroup === "<18") {
      conditions.push("u.age < 18");
    }

    if (filters.ageGroup === "18-40") {
      conditions.push("u.age >= 18 AND u.age <= 40");
    }

    if (filters.ageGroup === ">40") {
      conditions.push("u.age > 40");
    }
  }

  if (filters.gender) {
    values.push(filters.gender);
    conditions.push(`u.gender = $${values.length}`);
  }

  if (includeFeatureName) {
    values.push(featureName);
    conditions.push(`fc.feature_name = $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { whereClause, values };
};

const getAnalytics = async ({ startDate, endDate, age, ageGroup, gender, featureName }) => {
  const filters = normalizeFilters({ startDate, endDate, age, ageGroup, gender });

  const totalQueryParts = buildWhereClause(filters, false, null);
  const totalQuery = `
    SELECT fc.feature_name, COUNT(*)::int AS total_clicks
    FROM feature_clicks fc
    INNER JOIN users u ON u.id = fc.user_id
    ${totalQueryParts.whereClause}
    GROUP BY fc.feature_name
    ORDER BY total_clicks DESC, fc.feature_name ASC
  `;

  const totalResult = await pool.query(totalQuery, totalQueryParts.values);

  let dailyClicks = [];

  if (featureName) {
    const dailyQueryParts = buildWhereClause(filters, true, featureName);
    const dailyQuery = `
      SELECT DATE(fc.clicked_at) AS date, COUNT(*)::int AS clicks
      FROM feature_clicks fc
      INNER JOIN users u ON u.id = fc.user_id
      ${dailyQueryParts.whereClause}
      GROUP BY DATE(fc.clicked_at)
      ORDER BY DATE(fc.clicked_at) ASC
    `;

    const dailyResult = await pool.query(dailyQuery, dailyQueryParts.values);
    dailyClicks = dailyResult.rows;
  }

  return {
    filters: {
      startDate: filters.startDate,
      endDate: filters.endDate,
      age: filters.age,
      ageGroup: filters.ageGroup,
      gender: filters.gender,
      featureName: featureName || null
    },
    totalClicksByFeature: totalResult.rows,
    dailyClicks
  };
};

module.exports = {
  getAnalytics
};
