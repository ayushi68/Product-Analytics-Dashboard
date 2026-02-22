const pool = require("../config/db");

const FeatureClickModel = {
  async create({ userId, featureName, timestamp }) {
    const query = `
      INSERT INTO feature_clicks (user_id, feature_name, clicked_at)
      VALUES ($1, $2, COALESCE($3, NOW()))
      RETURNING id, user_id, feature_name, clicked_at
    `;
    const values = [userId, featureName, timestamp || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = FeatureClickModel;
