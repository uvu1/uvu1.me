CREATE TABLE IF NOT EXISTS web_vitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id TEXT NOT NULL,
  name TEXT NOT NULL,
  value REAL NOT NULL,
  delta REAL,
  rating TEXT,
  navigation_type TEXT,
  path TEXT NOT NULL,
  url TEXT,
  viewport_width INTEGER,
  viewport_height INTEGER,
  connection_type TEXT,
  attribution TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_web_vitals_name_created_at
  ON web_vitals (name, created_at);

CREATE INDEX IF NOT EXISTS idx_web_vitals_path_created_at
  ON web_vitals (path, created_at);
