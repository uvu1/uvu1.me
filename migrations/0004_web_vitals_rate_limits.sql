CREATE TABLE IF NOT EXISTS web_vitals_rate_limits (
  rate_key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_web_vitals_rate_limits_updated_at
  ON web_vitals_rate_limits(updated_at);

