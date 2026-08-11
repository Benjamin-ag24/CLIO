CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analysis (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    original_text TEXT NOT NULL,
    analyzed_text TEXT,
    verdict VARCHAR(10) NOT NULL CHECK (verdict IN ('veraz', 'dudoso', 'falso')),
    explanation TEXT,
    keywords JSONB DEFAULT '[]',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_analysis_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    affected_table VARCHAR(50) NOT NULL,
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    previous_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_log_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---Vista de análisis agrupados por fecha
CREATE OR REPLACE VIEW view_analysis_by_date AS
SELECT
  DATE(created_at) AS analysis_date,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE verdict = 'veraz') AS veraz_count,
  COUNT(*) FILTER (WHERE verdict = 'dudoso') AS dudoso_count,
  COUNT(*) FILTER (WHERE verdict = 'falso') AS falso_count
FROM analysis
WHERE is_deleted = FALSE
GROUP BY DATE(created_at)
ORDER BY analysis_date DESC;
---Vista de palabras clave más usadas
CREATE OR REPLACE VIEW view_most_used_keywords AS
SELECT
  keyword_text AS keyword,
  COUNT(*) AS usage_count
FROM analysis,
  LATERAL jsonb_array_elements_text(keywords) AS keyword_text
WHERE is_deleted = FALSE
GROUP BY keyword_text
ORDER BY usage_count DESC;
---Vista de resumen general
CREATE OR REPLACE VIEW view_general_summary AS
SELECT
  (SELECT COUNT(*) FROM analysis WHERE is_deleted = FALSE) AS total_analyses,
  (SELECT COUNT(*) FROM users WHERE is_active = TRUE) AS total_active_users,
  (SELECT COUNT(*) FROM analysis WHERE is_deleted = FALSE AND verdict = 'veraz') AS veraz_total,
  (SELECT COUNT(*) FROM analysis WHERE is_deleted = FALSE AND verdict = 'dudoso') AS dudoso_total,
  (SELECT COUNT(*) FROM analysis WHERE is_deleted = FALSE AND verdict = 'falso') AS falso_total;