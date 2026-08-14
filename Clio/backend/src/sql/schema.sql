
-- =========================================================
-- CLIO - SCRIPT OFICIAL DE BASE DE DATOS
-- PostgreSQL 15+
-- =========================================================

-- =========================================================
-- 1. TABLAS BASE
-- =========================================================

-- TABLE: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: keywords
CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: analysis
CREATE TABLE IF NOT EXISTS analysis (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    original_text TEXT NOT NULL,
    analyzed_text TEXT,
    verdict VARCHAR(10) NOT NULL
        CHECK (verdict IN ('veraz', 'dudoso', 'falso')),
    explanation TEXT,
    keywords JSONB DEFAULT '[]',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_analysis_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- TABLE: audit_log
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    affected_table VARCHAR(50) NOT NULL,
    operation VARCHAR(10) NOT NULL
        CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    previous_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_log_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =========================================================
-- 2. ÍNDICES
-- =========================================================

-- Índice parcial opcional solo para usuarios activos si se requiere filtrar el estado
CREATE INDEX IF NOT EXISTS idx_users_active_admins ON users(id) WHERE is_active = TRUE AND role = 'admin';

-- Índice Compuesto Parcial para Dashboard de Usuario (Filtro + Ordenamiento)
CREATE INDEX IF NOT EXISTS idx_analysis_user_dashboard ON analysis(user_id, created_at DESC) WHERE is_deleted = FALSE;

-- Índice Compuesto Parcial para Métricas de Veredicto en Dashboard
CREATE INDEX IF NOT EXISTS idx_analysis_verdict_dashboard ON analysis(verdict, created_at DESC) WHERE is_deleted = FALSE;

-- Índice GIN para búsquedas en JSONB (keywords)
CREATE INDEX IF NOT EXISTS idx_analysis_keywords ON analysis USING GIN (keywords);

-- =========================================================
-- 3. FUNCIONES DE AUDITORÍA Y TRIGGERS
-- =========================================================

-- GENERIC AUDIT FUNCTION
CREATE OR REPLACE FUNCTION fn_audit_generic()
RETURNS TRIGGER AS $$
DECLARE
    acting_user_id INTEGER;
BEGIN
    BEGIN
        acting_user_id := NULLIF(
            current_setting(
                'app.current_user_id',
                true
            ),
            ''
        )::INTEGER;
    EXCEPTION
        WHEN OTHERS THEN
            acting_user_id := NULL;
    END;
    
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (
            user_id,
            affected_table,
            operation,
            previous_data,
            new_data
        )
        VALUES (
            acting_user_id,
            TG_TABLE_NAME,
            'INSERT',
            NULL,
            to_jsonb(NEW)
        );
        RETURN NEW;
   
    ELSIF TG_OP = 'UPDATE' THEN
      
        IF (
            TG_TABLE_NAME = 'analysis'
            AND OLD.is_deleted = FALSE
            AND NEW.is_deleted = TRUE
        ) THEN
            INSERT INTO audit_log (
                user_id,
                affected_table,
                operation,
                previous_data,
                new_data
            )
            VALUES (
                acting_user_id,
                TG_TABLE_NAME,
                'DELETE',
                to_jsonb(OLD),
                to_jsonb(NEW)
            );
        ELSE
            INSERT INTO audit_log (
                user_id,
                affected_table,
                operation,
                previous_data,
                new_data
            )
            VALUES (
                acting_user_id,
                TG_TABLE_NAME,
                'UPDATE',
                to_jsonb(OLD),
                to_jsonb(NEW)
            );
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (
            user_id,
            affected_table,
            operation,
            previous_data,
            new_data
        )
        VALUES (
            acting_user_id,
            TG_TABLE_NAME,
            'DELETE',
            to_jsonb(OLD),
            NULL
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: users (INSERT / UPDATE / DELETE)
DROP TRIGGER IF EXISTS trg_audit_users ON users;
CREATE TRIGGER trg_audit_users
AFTER INSERT OR UPDATE OR DELETE
ON users
FOR EACH ROW
EXECUTE FUNCTION fn_audit_generic();

-- TRIGGER: keywords (INSERT / DELETE)
DROP TRIGGER IF EXISTS trg_audit_keywords ON keywords;
CREATE TRIGGER trg_audit_keywords
AFTER INSERT OR DELETE
ON keywords
FOR EACH ROW
EXECUTE FUNCTION fn_audit_generic();

-- TRIGGER: analysis (INSERT / UPDATE)
DROP TRIGGER IF EXISTS trg_audit_analysis ON analysis;
CREATE TRIGGER trg_audit_analysis
AFTER INSERT OR UPDATE
ON analysis
FOR EACH ROW
EXECUTE FUNCTION fn_audit_generic();

-- =========================================================
-- 4. VISTAS DEL SISTEMA
-- =========================================================

-- VIEW: analysis grouped by date
CREATE OR REPLACE VIEW view_analysis_by_date AS
SELECT
    DATE(created_at) AS analysis_date,
    COUNT(*) AS total,
    COUNT(*) FILTER (
        WHERE verdict = 'veraz'
    ) AS truthful_count,
    COUNT(*) FILTER (
        WHERE verdict = 'dudoso'
    ) AS uncertain_count,
    COUNT(*) FILTER (
        WHERE verdict = 'falso'
    ) AS false_count
FROM analysis
WHERE is_deleted = FALSE
GROUP BY DATE(created_at)
ORDER BY analysis_date DESC;

-- VIEW: most used keywords
CREATE OR REPLACE VIEW view_most_used_keywords AS
SELECT
    keyword_text AS keyword,
    COUNT(*) AS usage_count
FROM analysis,
LATERAL jsonb_array_elements_text(keywords) AS keyword_text
WHERE is_deleted = FALSE
GROUP BY keyword_text
ORDER BY usage_count DESC;

-- VIEW: general summary
CREATE OR REPLACE VIEW view_general_summary AS
SELECT
    (
        SELECT COUNT(*)
        FROM analysis
        WHERE is_deleted = FALSE
    ) AS total_analyses,
    (
        SELECT COUNT(*)
        FROM users
        WHERE is_active = TRUE
    ) AS total_active_users,
    (
        SELECT COUNT(*)
        FROM analysis
        WHERE is_deleted = FALSE
        AND verdict = 'veraz'
    ) AS truthful_total,
    (
        SELECT COUNT(*)
        FROM analysis
        WHERE is_deleted = FALSE
        AND verdict = 'dudoso'
    ) AS uncertain_total,
    (
        SELECT COUNT(*)
        FROM analysis
        WHERE is_deleted = FALSE
        AND verdict = 'falso'
    ) AS false_total;

-- VIEW: keywords catalog
CREATE OR REPLACE VIEW view_keywords_catalog AS
SELECT
    k.id,
    k.keyword,
    k.created_at,
    COALESCE(
        usage.usage_count,
        0
    ) AS usage_count
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
ORDER BY
    usage_count DESC,
    k.keyword ASC;