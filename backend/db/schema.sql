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

CREATE INDEX IF NOT EXISTS idx_feature_clicks_user_id ON feature_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_clicks_feature_name ON feature_clicks(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_clicks_clicked_at ON feature_clicks(clicked_at);
