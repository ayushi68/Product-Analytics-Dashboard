const bcrypt = require("bcrypt");
const pool = require("../src/config/db");
const env = require("../src/config/env");

const genders = ["Male", "Female", "Other"];
const featureNames = [
  "Dashboard",
  "Reports",
  "UserProfile",
  "Search",
  "Notifications",
  "Billing",
  "Integrations",
  "Export"
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDateInLastNDays = (days) => {
  const now = Date.now();
  const past = now - days * 24 * 60 * 60 * 1000;
  return new Date(randomInt(past, now));
};

const seed = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const schemaSql = `
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS feature_clicks (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        feature_name VARCHAR(100) NOT NULL,
        clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await client.query(schemaSql);

    await client.query("TRUNCATE TABLE feature_clicks, users RESTART IDENTITY CASCADE;");

    const hashedPassword = await bcrypt.hash("Password@123", env.bcryptSaltRounds);

    const totalUsers = 20;
    const userIds = [];

    for (let i = 1; i <= totalUsers; i += 1) {
      const username = `user_${i}`;
      const age = randomInt(18, 60);
      const gender = genders[randomInt(0, genders.length - 1)];

      const userInsert = await client.query(
        `
          INSERT INTO users (username, password_hash, age, gender)
          VALUES ($1, $2, $3, $4)
          RETURNING id
        `,
        [username, hashedPassword, age, gender]
      );

      userIds.push(userInsert.rows[0].id);
    }

    const totalClicks = 120;

    for (let i = 0; i < totalClicks; i += 1) {
      const userId = userIds[randomInt(0, userIds.length - 1)];
      const featureName = featureNames[randomInt(0, featureNames.length - 1)];
      const clickedAt = randomDateInLastNDays(30);

      await client.query(
        `
          INSERT INTO feature_clicks (user_id, feature_name, clicked_at)
          VALUES ($1, $2, $3)
        `,
        [userId, featureName, clickedAt]
      );
    }

    await client.query("COMMIT");

    console.log("Seeding complete:");
    console.log(`- Users inserted: ${totalUsers}`);
    console.log(`- Feature clicks inserted: ${totalClicks}`);
    console.log("- Default password for all users: Password@123");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
