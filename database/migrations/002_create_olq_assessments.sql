CREATE TABLE IF NOT EXISTS olq_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    test_type TEXT NOT NULL,
    test_id UUID,
    overall_score INTEGER,
    effective_intelligence NUMERIC(3,1),
    reasoning_ability NUMERIC(3,1),
    organizing_ability NUMERIC(3,1),
    power_of_expression NUMERIC(3,1),
    social_adaptability NUMERIC(3,1),
    cooperation NUMERIC(3,1),
    sense_of_responsibility NUMERIC(3,1),
    initiative NUMERIC(3,1),
    self_confidence NUMERIC(3,1),
    speed_of_decision NUMERIC(3,1),
    ability_to_influence NUMERIC(3,1),
    liveliness NUMERIC(3,1),
    determination NUMERIC(3,1),
    courage NUMERIC(3,1),
    stamina NUMERIC(3,1),
    assessed_by TEXT DEFAULT 'AI',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_olq_assessments_user_id ON olq_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_olq_assessments_created_at ON olq_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_olq_assessments_test_type ON olq_assessments(test_type);
