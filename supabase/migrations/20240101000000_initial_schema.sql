-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create notices table
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id TEXT NOT NULL DEFAULT 'classic',
    deceased_name TEXT NOT NULL,
    age INTEGER,
    death_date TIMESTAMPTZ NOT NULL,
    funeral_hall TEXT NOT NULL,
    room_number TEXT,
    burial_date TIMESTAMPTZ NOT NULL,
    resting_place TEXT,
    host_name TEXT NOT NULL,
    contact TEXT,
    show_contact BOOLEAN DEFAULT false,
    account_bank TEXT,
    account_number TEXT,
    account_holder TEXT,
    show_account BOOLEAN DEFAULT false,
    message TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notice_credentials table
CREATE TABLE notice_credentials (
    notice_id UUID PRIMARY KEY REFERENCES notices(id) ON DELETE CASCADE,
    phone_e164 TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create owner_sessions table
CREATE TABLE owner_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rate_limit table for IP-based rate limiting
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address TEXT NOT NULL,
    action_type TEXT NOT NULL,
    action_count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ip_address, action_type, window_start)
);

-- Create indexes
CREATE INDEX idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX idx_notices_is_active ON notices(is_active);
CREATE INDEX idx_notice_credentials_phone ON notice_credentials(phone_e164);
CREATE INDEX idx_owner_sessions_token ON owner_sessions(session_token);
CREATE INDEX idx_owner_sessions_expires ON owner_sessions(expires_at);
CREATE INDEX idx_rate_limits_ip_action ON rate_limits(ip_address, action_type, window_start);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_notices_updated_at
    BEFORE UPDATE ON notices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notice_credentials_updated_at
    BEFORE UPDATE ON notice_credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM owner_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to deactivate old notices (90 days)
CREATE OR REPLACE FUNCTION deactivate_old_notices()
RETURNS void AS $$
BEGIN
    UPDATE notices
    SET is_active = false
    WHERE created_at < NOW() - INTERVAL '90 days'
    AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Add RLS (Row Level Security) policies
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_sessions ENABLE ROW LEVEL SECURITY;

-- Public can view active notices
CREATE POLICY "Public can view active notices" ON notices
    FOR SELECT
    USING (is_active = true);

-- Owners can update their notices (via session)
CREATE POLICY "Owners can update their notices" ON notices
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM owner_sessions
            WHERE owner_sessions.notice_id = notices.id
            AND owner_sessions.expires_at > NOW()
        )
    );

-- Only service role can insert notices
CREATE POLICY "Service role can insert notices" ON notices
    FOR INSERT
    WITH CHECK (true);

-- Only service role can access credentials
CREATE POLICY "Service role can access credentials" ON notice_credentials
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Only service role can access sessions
CREATE POLICY "Service role can access sessions" ON owner_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);
