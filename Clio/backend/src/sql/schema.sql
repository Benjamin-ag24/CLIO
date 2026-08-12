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
---Funcion trigger de audithlog para la tabla de analysis
CREATE OR REPLACE FUNCTION fn_audit_analysis()
RETURNS TRIGGER AS $$
DECLARE
  acting_user_id INTEGER;
BEGIN
  acting_user_id := NULLIF(current_setting('app.current_user_id', true), '')::INTEGER;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (user_id, affected_table, operation, previous_data, new_data)
    VALUES (acting_user_id, 'analysis', 'INSERT', NULL, to_jsonb(NEW));
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    IF (OLD.original_text IS DISTINCT FROM NEW.original_text)
       OR (OLD.is_deleted IS DISTINCT FROM NEW.is_deleted) THEN

      IF (OLD.is_deleted = FALSE AND NEW.is_deleted = TRUE) THEN
        INSERT INTO audit_log (user_id, affected_table, operation, previous_data, new_data)
        VALUES (acting_user_id, 'analysis', 'DELETE', to_jsonb(OLD), to_jsonb(NEW));
      ELSE
        INSERT INTO audit_log (user_id, affected_table, operation, previous_data, new_data)
        VALUES (acting_user_id, 'analysis', 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
      END IF;

    END IF;
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
---adjuntarlo a la tabla de analysis para auditoria 
CREATE TRIGGER trg_audit_analysis
AFTER INSERT OR UPDATE ON analysis
FOR EACH ROW EXECUTE FUNCTION fn_audit_analysis();

-- Vista de análisis agrupados por fecha
CREATE OR REPLACE VIEW view_analysis_by_date AS
SELECT
    DATE(created_at) AS analysis_date,
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE verdict = 'veraz') AS truthful_count,
    COUNT(*) FILTER (WHERE verdict = 'dudoso') AS uncertain_count,
    COUNT(*) FILTER (WHERE verdict = 'falso') AS false_count
FROM analysis
WHERE is_deleted = FALSE
GROUP BY DATE(created_at)
ORDER BY analysis_date DESC;


-- Vista de palabras clave más usadas
CREATE OR REPLACE VIEW view_most_used_keywords AS
SELECT
    keyword_text AS keyword,
    COUNT(*) AS usage_count
FROM analysis,
LATERAL jsonb_array_elements_text(keywords) AS keyword_text
WHERE is_deleted = FALSE
GROUP BY keyword_text
ORDER BY usage_count DESC;


-- Vista de resumen general
CREATE OR REPLACE VIEW view_general_summary AS
SELECT
    (SELECT COUNT(*)
     FROM analysis
     WHERE is_deleted = FALSE) AS total_analyses,

    (SELECT COUNT(*)
     FROM users
     WHERE is_active = TRUE) AS total_active_users,

    (SELECT COUNT(*)
     FROM analysis
     WHERE is_deleted = FALSE
     AND verdict = 'veraz') AS truthful_total,

    (SELECT COUNT(*)
     FROM analysis
     WHERE is_deleted = FALSE
     AND verdict = 'dudoso') AS uncertain_total,

    (SELECT COUNT(*)
     FROM analysis
     WHERE is_deleted = FALSE
     AND verdict = 'falso') AS false_total;


-- Vista de las keywords más recientes
CREATE OR REPLACE VIEW view_keywords_catalog AS
SELECT
    k.id,
    k.keyword,
    k.created_at,
    COALESCE(usage.usage_count, 0) AS usage_count
FROM keywords k
LEFT JOIN (
    SELECT
        keyword_text AS keyword,
        COUNT(*) AS usage_count
    FROM analysis,
    LATERAL jsonb_array_elements_text(keywords) AS keyword_text
    WHERE is_deleted = FALSE
    GROUP BY keyword_text
) usage
ON usage.keyword = k.keyword
ORDER BY usage_count DESC, k.keyword ASC;