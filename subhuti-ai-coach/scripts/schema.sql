-- Subhuti AI Coach Database Schema
-- PostgreSQL (pgvector optional for v1)

-- Enable pgvector extension (optional - comment out if not available)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Users table (synced with Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  company_id UUID,
  role VARCHAR(50) DEFAULT 'user', -- user, admin, coach
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_company ON users(company_id);

-- Companies (for SME customers)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  employee_count INTEGER,
  plan_tier VARCHAR(50) DEFAULT 'standard', -- standard, premium, enterprise
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User onboarding profiles
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  mindfulness_baseline INTEGER, -- 1-10 scale
  stress_level INTEGER, -- 1-10 scale
  burnout_risk VARCHAR(20), -- low, medium, high
  goals TEXT[],
  spiritual_orientation VARCHAR(100), -- buddhist, secular, other, none
  preferred_language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'Asia/Singapore',
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaching sessions (with vector embeddings)
CREATE TABLE coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR(50), -- daily_checkin, on_demand, weekly_review
  topic VARCHAR(255),
  mood_before INTEGER, -- 1-10
  mood_after INTEGER, -- 1-10
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON coaching_sessions(user_id);
CREATE INDEX idx_sessions_created ON coaching_sessions(created_at);

-- Session messages (conversation history)
CREATE TABLE session_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  embedding JSONB, -- Claude embeddings (JSONB for now, vector later)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_session ON session_messages(session_id);
-- CREATE INDEX idx_messages_embedding ON session_messages USING ivfflat (embedding vector_cosine_ops); -- pgvector only

-- User commitments (goals + accountability)
CREATE TABLE commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- mindfulness, work, relationships, health
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  status VARCHAR(20) DEFAULT 'active', -- active, completed, abandoned
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_commitments_user ON commitments(user_id);
CREATE INDEX idx_commitments_status ON commitments(status);

-- Daily nudges (micro-practices + reminders)
CREATE TABLE nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nudge_type VARCHAR(50), -- mindfulness, accountability, wisdom, check_in
  content TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  context VARCHAR(100), -- morning, midday, evening, stressful_moment
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nudges_user ON nudges(user_id);
CREATE INDEX idx_nudges_scheduled ON nudges(scheduled_for) WHERE sent_at IS NULL;

-- Weekly progress reports
CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  mindfulness_score INTEGER, -- 1-10
  stress_score INTEGER, -- 1-10
  sessions_count INTEGER,
  commitments_completed INTEGER,
  insights TEXT[],
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_reports_user ON weekly_reports(user_id);

-- Burnout assessments (periodic)
CREATE TABLE burnout_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emotional_exhaustion INTEGER, -- 1-5
  depersonalization INTEGER, -- 1-5
  personal_accomplishment INTEGER, -- 1-5 (reverse scored)
  overall_risk VARCHAR(20), -- low, medium, high
  who_icd11_aligned BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_assessments_user ON burnout_assessments(user_id);

-- Slack/Teams integrations
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL, -- slack, teams
  platform_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  webhook_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Weekly summarization jobs (for memory management)
CREATE TABLE memory_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  summary_text TEXT NOT NULL,
  key_insights TEXT[],
  patterns_identified TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_summaries_user ON memory_summaries(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commitments_updated_at BEFORE UPDATE ON commitments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts (synced with Clerk auth)';
COMMENT ON TABLE coaching_sessions IS 'AI coaching conversations with vector embeddings';
COMMENT ON TABLE session_messages IS 'Individual messages within coaching sessions';
COMMENT ON TABLE commitments IS 'User goals and accountability tracking';
COMMENT ON TABLE nudges IS 'Daily mindfulness practices and reminders';
COMMENT ON TABLE weekly_reports IS 'Automated weekly progress summaries';
COMMENT ON TABLE burnout_assessments IS 'Periodic burnout risk assessments (WHO ICD-11 aligned)';
COMMENT ON TABLE memory_summaries IS 'Weekly conversation summaries for long-term memory';
