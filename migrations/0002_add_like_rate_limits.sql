-- Migration number: 0002 	 2026-05-26T10:29:47.989Z

CREATE TABLE IF NOT EXISTS like_rate_limits (
  rate_key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_like_rate_limits_updated_at
  ON like_rate_limits(updated_at);
