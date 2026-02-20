-- ChciAI.cz Database Schema (Supabase PostgreSQL)

-- Clients table
CREATE TABLE clients (
  id BIGSERIAL PRIMARY KEY,
  client_id VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'suspended', 'cancelled')),
  trial_started_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  
  -- VPS & OpenClaw
  vps_ip VARCHAR(50),
  docker_container_id VARCHAR(255),
  dashboard_url TEXT,
  
  -- Stripe
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  current_period_end TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_client_id ON clients(client_id);
CREATE INDEX idx_clients_stripe_customer ON clients(stripe_customer_id);
CREATE INDEX idx_clients_status ON clients(status);

-- Usage logs (optional - for analytics)
CREATE TABLE usage_logs (
  id BIGSERIAL PRIMARY KEY,
  client_id VARCHAR(255) REFERENCES clients(client_id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL, -- 'message_sent', 'api_call', 'login', etc.
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_logs_client ON usage_logs(client_id);
CREATE INDEX idx_usage_logs_created ON usage_logs(created_at);

-- Payments history (optional)
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  client_id VARCHAR(255) REFERENCES clients(client_id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255),
  amount INTEGER NOT NULL, -- in cents (99000 = 990 Kč)
  currency VARCHAR(10) DEFAULT 'czk',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Row Level Security (RLS) for Supabase
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on auth strategy)
-- For now, allow service role full access
CREATE POLICY "Service role can do anything" ON clients
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can do anything" ON usage_logs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can do anything" ON payments
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Functions

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Sample data for testing (optional)
-- INSERT INTO clients (client_id, first_name, last_name, email, phone, company, password_hash, vps_ip, dashboard_url)
-- VALUES ('test_001', 'Martin', 'Test', 'martin@chciai.cz', '+420608922096', 'ChciAI s.r.o.', 'hashed_password_here', '46.28.111.185', 'http://46.28.111.185:8001');
