const pool = require("../config/db");

const UserModel = {
  async create({ username, passwordHash, age, gender }) {
    const query = `
      INSERT INTO users (username, password_hash, age, gender)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, age, gender, created_at
    `;
    const values = [username, passwordHash, age, gender];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByUsername(username) {
    const query = `
      SELECT id, username, password_hash, age, gender, created_at
      FROM users
      WHERE username = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [username]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const query = `
      SELECT id, username, age, gender, created_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
};

module.exports = UserModel;
