-- OLQ Tracking Schema
-- This schema enables daily tracking of all 15 OLQs across different test types

-- OLQ Assessment Scores Table
-- Stores individual OLQ scores from each assessment
CREATE TABLE olq_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL CHECK (test_type IN ('OIR', 'PPDT', 'TAT', 'WAT', 'SRT', 'SD', 'GPE', 'GTO', 'INTERVIEW', 'MOCK_SSB')),
    test_id UUID, -- Reference to the specific test (oir_tests, psych_submissions, gto_sessions, etc.)
    
    -- Overall score for this test
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    
    -- OLQ scores (1-10 scale as per rubrics)
    effective_intelligence INTEGER CHECK (effective_intelligence >= 1 AND effective_intelligence <= 10),
    reasoning_ability INTEGER CHECK (reasoning_ability >= 1 AND reasoning_ability <= 10),
    organizing_ability INTEGER CHECK (organizing_ability >= 1 AND organizing_ability <= 10),
    power_of_expression INTEGER CHECK (power_of_expression >= 1 AND power_of_expression <= 10),
    
    social_adaptability INTEGER CHECK (social_adaptability >= 1 AND social_adaptability <= 10),
    cooperation INTEGER CHECK (cooperation >= 1 AND cooperation <= 10),
    sense_of_responsibility INTEGER CHECK (sense_of_responsibility >= 1 AND sense_of_responsibility <= 10),
    
    initiative INTEGER CHECK (initiative >= 1 AND initiative <= 10),
    self_confidence INTEGER CHECK (self_confidence >= 1 AND self_confidence <= 10),
    speed_of_decision INTEGER CHECK (speed_of_decision >= 1 AND speed_of_decision <= 10),
    ability_to_influence INTEGER CHECK (ability_to_influence >= 1 AND ability_to_influence <= 10),
    
    liveliness INTEGER CHECK (liveliness >= 1 AND liveliness <= 10),
    determination INTEGER CHECK (determination >= 1 AND determination <= 10),
    courage INTEGER CHECK (courage >= 1 AND courage <= 10),
    stamina INTEGER CHECK (stamina >= 1 AND stamina <= 10),
    
    -- Metadata
    assessed_by TEXT DEFAULT 'AI', -- 'AI' or 'Human' or specific assessor
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, test_type, test_id)
);

-- Daily OLQ Summary Table
-- Aggregates daily OLQ scores for trend analysis
CREATE TABLE olq_daily_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Daily averages for each OLQ
    effective_intelligence_avg NUMERIC(3,2) CHECK (effective_intelligence_avg >= 1 AND effective_intelligence_avg <= 10),
    reasoning_ability_avg NUMERIC(3,2) CHECK (reasoning_ability_avg >= 1 AND reasoning_ability_avg <= 10),
    organizing_ability_avg NUMERIC(3,2) CHECK (organizing_ability_avg >= 1 AND organizing_ability_avg <= 10),
    power_of_expression_avg NUMERIC(3,2) CHECK (power_of_expression_avg >= 1 AND power_of_expression_avg <= 10),
    
    social_adaptability_avg NUMERIC(3,2) CHECK (social_adaptability_avg >= 1 AND social_adaptability_avg <= 10),
    cooperation_avg NUMERIC(3,2) CHECK (cooperation_avg >= 1 AND cooperation_avg <= 10),
    sense_of_responsibility_avg NUMERIC(3,2) CHECK (sense_of_responsibility_avg >= 1 AND sense_of_responsibility_avg <= 10),
    
    initiative_avg NUMERIC(3,2) CHECK (initiative_avg >= 1 AND initiative_avg <= 10),
    self_confidence_avg NUMERIC(3,2) CHECK (self_confidence_avg >= 1 AND self_confidence_avg <= 10),
    speed_of_decision_avg NUMERIC(3,2) CHECK (speed_of_decision_avg >= 1 AND speed_of_decision_avg <= 10),
    ability_to_influence_avg NUMERIC(3,2) CHECK (ability_to_influence_avg >= 1 AND ability_to_influence_avg <= 10),
    
    liveliness_avg NUMERIC(3,2) CHECK (liveliness_avg >= 1 AND liveliness_avg <= 10),
    determination_avg NUMERIC(3,2) CHECK (determination_avg >= 1 AND determination_avg <= 10),
    courage_avg NUMERIC(3,2) CHECK (courage_avg >= 1 AND courage_avg <= 10),
    stamina_avg NUMERIC(3,2) CHECK (stamina_avg >= 1 AND stamina_avg <= 10),
    
    -- Overall daily score
    overall_daily_score NUMERIC(5,2) CHECK (overall_daily_score >= 0 AND overall_daily_score <= 100),
    
    -- Number of assessments contributing to this summary
    assessment_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, date)
);

-- OLQ Configuration Table
-- Allows manual adjustments and calibration of OLQ scores
CREATE TABLE olq_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Weight multipliers for each OLQ (default 1.0)
    effective_intelligence_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (effective_intelligence_weight >= 0.5 AND effective_intelligence_weight <= 2.0),
    reasoning_ability_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (reasoning_ability_weight >= 0.5 AND reasoning_ability_weight <= 2.0),
    organizing_ability_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (organizing_ability_weight >= 0.5 AND organizing_ability_weight <= 2.0),
    power_of_expression_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (power_of_expression_weight >= 0.5 AND power_of_expression_weight <= 2.0),
    
    social_adaptability_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (social_adaptability_weight >= 0.5 AND social_adaptability_weight <= 2.0),
    cooperation_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (cooperation_weight >= 0.5 AND cooperation_weight <= 2.0),
    sense_of_responsibility_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (sense_of_responsibility_weight >= 0.5 AND sense_of_responsibility_weight <= 2.0),
    
    initiative_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (initiative_weight >= 0.5 AND initiative_weight <= 2.0),
    self_confidence_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (self_confidence_weight >= 0.5 AND self_confidence_weight <= 2.0),
    speed_of_decision_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (speed_of_decision_weight >= 0.5 AND speed_of_decision_weight <= 2.0),
    ability_to_influence_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (ability_to_influence_weight >= 0.5 AND ability_to_influence_weight <= 2.0),
    
    liveliness_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (liveliness_weight >= 0.5 AND liveliness_weight <= 2.0),
    determination_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (determination_weight >= 0.5 AND determination_weight <= 2.0),
    courage_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (courage_weight >= 0.5 AND courage_weight <= 2.0),
    stamina_weight NUMERIC(3,2) DEFAULT 1.00 CHECK (stamina_weight >= 0.5 AND stamina_weight <= 2.0),
    
    -- Target scores for each OLQ (for goal setting)
    target_effective_intelligence INTEGER DEFAULT 7 CHECK (target_effective_intelligence >= 1 AND target_effective_intelligence <= 10),
    target_reasoning_ability INTEGER DEFAULT 7 CHECK (target_reasoning_ability >= 1 AND target_reasoning_ability <= 10),
    target_organizing_ability INTEGER DEFAULT 7 CHECK (target_organizing_ability >= 1 AND target_organizing_ability <= 10),
    target_power_of_expression INTEGER DEFAULT 7 CHECK (target_power_of_expression >= 1 AND target_power_of_expression <= 10),
    
    target_social_adaptability INTEGER DEFAULT 7 CHECK (target_social_adaptability >= 1 AND target_social_adaptability <= 10),
    target_cooperation INTEGER DEFAULT 7 CHECK (target_cooperation >= 1 AND target_cooperation <= 10),
    target_sense_of_responsibility INTEGER DEFAULT 7 CHECK (target_sense_of_responsibility >= 1 AND target_sense_of_responsibility <= 10),
    
    target_initiative INTEGER DEFAULT 7 CHECK (target_initiative >= 1 AND target_initiative <= 10),
    target_self_confidence INTEGER DEFAULT 7 CHECK (target_self_confidence >= 1 AND target_self_confidence <= 10),
    target_speed_of_decision INTEGER DEFAULT 7 CHECK (target_speed_of_decision >= 1 AND target_speed_of_decision <= 10),
    target_ability_to_influence INTEGER DEFAULT 7 CHECK (target_ability_to_influence >= 1 AND target_ability_to_influence <= 10),
    
    target_liveliness INTEGER DEFAULT 7 CHECK (target_liveliness >= 1 AND target_liveliness <= 10),
    target_determination INTEGER DEFAULT 7 CHECK (target_determination >= 1 AND target_determination <= 10),
    target_courage INTEGER DEFAULT 7 CHECK (target_courage >= 1 AND target_courage <= 10),
    target_stamina INTEGER DEFAULT 7 CHECK (target_stamina >= 1 AND target_stamina <= 10),
    
    -- Configuration metadata
    configuration_name TEXT DEFAULT 'Default',
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, configuration_name)
);

-- Indexes for performance
CREATE INDEX idx_olq_assessments_user_id ON olq_assessments(user_id);
CREATE INDEX idx_olq_assessments_test_type ON olq_assessments(test_type);
CREATE INDEX idx_olq_assessments_created_at ON olq_assessments(created_at);
CREATE INDEX idx_olq_daily_summary_user_id ON olq_daily_summary(user_id);
CREATE INDEX idx_olq_daily_summary_date ON olq_daily_summary(date);
CREATE INDEX idx_olq_configuration_user_id ON olq_configuration(user_id);

-- Function to calculate daily summary from assessments
CREATE OR REPLACE FUNCTION calculate_daily_olq_summary(p_user_id UUID, p_date DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO olq_daily_summary (
        user_id, date,
        effective_intelligence_avg, reasoning_ability_avg, organizing_ability_avg, power_of_expression_avg,
        social_adaptability_avg, cooperation_avg, sense_of_responsibility_avg,
        initiative_avg, self_confidence_avg, speed_of_decision_avg, ability_to_influence_avg,
        liveliness_avg, determination_avg, courage_avg, stamina_avg,
        overall_daily_score, assessment_count
    )
    SELECT 
        p_user_id,
        p_date,
        AVG(effective_intelligence) as effective_intelligence_avg,
        AVG(reasoning_ability) as reasoning_ability_avg,
        AVG(organizing_ability) as organizing_ability_avg,
        AVG(power_of_expression) as power_of_expression_avg,
        AVG(social_adaptability) as social_adaptability_avg,
        AVG(cooperation) as cooperation_avg,
        AVG(sense_of_responsibility) as sense_of_responsibility_avg,
        AVG(initiative) as initiative_avg,
        AVG(self_confidence) as self_confidence_avg,
        AVG(speed_of_decision) as speed_of_decision_avg,
        AVG(ability_to_influence) as ability_to_influence_avg,
        AVG(liveliness) as liveliness_avg,
        AVG(determination) as determination_avg,
        AVG(courage) as courage_avg,
        AVG(stamina) as stamina_avg,
        AVG(overall_score) as overall_daily_score,
        COUNT(*) as assessment_count
    FROM olq_assessments
    WHERE user_id = p_user_id 
        AND DATE(created_at) = p_date
        AND overall_score IS NOT NULL
    GROUP BY user_id
    ON CONFLICT (user_id, date) 
    DO UPDATE SET
        effective_intelligence_avg = EXCLUDED.effective_intelligence_avg,
        reasoning_ability_avg = EXCLUDED.reasoning_ability_avg,
        organizing_ability_avg = EXCLUDED.organizing_ability_avg,
        power_of_expression_avg = EXCLUDED.power_of_expression_avg,
        social_adaptability_avg = EXCLUDED.social_adaptability_avg,
        cooperation_avg = EXCLUDED.cooperation_avg,
        sense_of_responsibility_avg = EXCLUDED.sense_of_responsibility_avg,
        initiative_avg = EXCLUDED.initiative_avg,
        self_confidence_avg = EXCLUDED.self_confidence_avg,
        speed_of_decision_avg = EXCLUDED.speed_of_decision_avg,
        ability_to_influence_avg = EXCLUDED.ability_to_influence_avg,
        liveliness_avg = EXCLUDED.liveliness_avg,
        determination_avg = EXCLUDED.determination_avg,
        courage_avg = EXCLUDED.courage_avg,
        stamina_avg = EXCLUDED.stamina_avg,
        overall_daily_score = EXCLUDED.overall_daily_score,
        assessment_count = EXCLUDED.assessment_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update daily summary when new assessment is added
CREATE OR REPLACE FUNCTION update_daily_summary_on_assessment()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM calculate_daily_olq_summary(NEW.user_id, DATE(NEW.created_at));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_update_daily_summary
    AFTER INSERT OR UPDATE ON olq_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_summary_on_assessment();