-- koH Labs Terminal Backend Database Schema
-- PostgreSQL 16+ with UUID extension

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- User Management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(64) UNIQUE,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    permission_level INTEGER DEFAULT 1, -- 1: normal, 2: advanced, 3: admin
    dangerous_mode_enabled BOOLEAN DEFAULT false,
    ai_mode_preference VARCHAR(20) DEFAULT 'assisted', -- 'off', 'assisted', 'auto'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- User Sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    websocket_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Command History
CREATE TABLE command_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    command TEXT NOT NULL,
    command_type VARCHAR(50), -- 'token', 'defi', 'system', 'ai', 'custom'
    arguments JSONB,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    execution_time_ms INTEGER,
    status VARCHAR(20) DEFAULT 'success', -- 'success', 'error', 'timeout', 'cancelled'
    response_data JSONB,
    error_message TEXT,
    dangerous_command BOOLEAN DEFAULT false
);

-- AI Command Predictions
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    context_hash VARCHAR(64), -- Hash of recent commands for pattern matching
    predicted_command TEXT NOT NULL,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    prediction_source VARCHAR(50), -- 'pattern', 'ai_model', 'hybrid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    was_used BOOLEAN DEFAULT false,
    user_feedback INTEGER -- -1: rejected, 0: ignored, 1: accepted
);

-- Token Watchlists
CREATE TABLE user_watchlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_mint_address VARCHAR(64) NOT NULL,
    token_symbol VARCHAR(20),
    token_name VARCHAR(100),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    alert_price_above DECIMAL(20,8),
    alert_price_below DECIMAL(20,8),
    alert_volume_change DECIMAL(5,2), -- Percentage change
    notifications_enabled BOOLEAN DEFAULT true
);

-- Real-time Data Cache (for heavy queries)
CREATE TABLE data_cache (
    cache_key VARCHAR(255) PRIMARY KEY,
    data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Metrics and Monitoring
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,6),
    metric_unit VARCHAR(20),
    tags JSONB, -- For dimensional data
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate Limiting
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(255) NOT NULL, -- user_id, ip_address, or session_id
    identifier_type VARCHAR(20) NOT NULL, -- 'user', 'ip', 'session'
    endpoint VARCHAR(255) NOT NULL,
    requests_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    window_duration_seconds INTEGER DEFAULT 60,
    max_requests INTEGER DEFAULT 100
);

-- Indexes for Performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_websocket ON user_sessions(websocket_id);
CREATE INDEX idx_command_history_user_executed ON command_history(user_id, executed_at DESC);
CREATE INDEX idx_command_history_type ON command_history(command_type);
CREATE INDEX idx_ai_predictions_user_context ON ai_predictions(user_id, context_hash);
CREATE INDEX idx_watchlists_user_token ON user_watchlists(user_id, token_mint_address);
CREATE INDEX idx_data_cache_expires ON data_cache(expires_at);
CREATE INDEX idx_system_metrics_name_time ON system_metrics(metric_name, recorded_at DESC);
CREATE INDEX idx_rate_limits_identifier_endpoint ON rate_limits(identifier, endpoint, window_start);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Sample data for development
INSERT INTO users (wallet_address, username, permission_level) VALUES
('11111111111111111111111111111111', 'admin', 3),
('22222222222222222222222222222222', 'testuser', 1);