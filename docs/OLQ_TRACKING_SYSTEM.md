# OLQ Tracking System Documentation

## Overview

The OLQ (Officer Like Qualities) Tracking System is a comprehensive solution for monitoring and analyzing the 15 OLQs across all SSB assessment tests. This system enables daily tracking, configuration, and visualization of candidate performance.

## Architecture

### Database Schema

The system uses three main tables:

1. **olq_assessments** - Stores individual OLQ scores from each assessment
2. **olq_daily_summary** - Aggregates daily OLQ scores for trend analysis
3. **olq_configuration** - Stores user-specific weights and targets

### API Endpoints

All endpoints are prefixed with `/api/olq/`:

- `POST /assessments` - Record a new OLQ assessment
- `GET /assessments/{user_id}` - Get user's assessments
- `GET /current-scores/{user_id}` - Get current aggregated scores
- `GET /daily-summary/{user_id}` - Get daily summaries
- `GET /configuration/{user_id}` - Get user configuration
- `POST /configuration` - Update user configuration
- `GET /trends/{user_id}` - Get OLQ trends over time

## The 15 OLQs

### Factor I: Planning & Organising

1. **Effective Intelligence** - Practical problem-solving ability
2. **Reasoning Ability** - Logical thinking and analysis
3. **Organising Ability** - Systematic resource arrangement
4. **Power of Expression** - Clear communication

### Factor II: Social Adjustment

5. **Social Adaptability** - Interpersonal flexibility
6. **Cooperation** - Team collaboration
7. **Sense of Responsibility** - Duty fulfillment

### Factor III: Social Effectiveness

8. **Initiative** - Self-starting action
9. **Self Confidence** - Faith in abilities
10. **Speed of Decision** - Quick, practical decisions
11. **Ability to Influence** - Leadership and persuasion

### Factor IV: Dynamic

12. **Liveliness** - Cheerfulness in adversity
13. **Determination** - Persistent effort
14. **Courage** - Calculated risk-taking
15. **Stamina** - Endurance under strain

## Setup Instructions

### 1. Database Migration

Run the migration script to create the necessary tables:

```bash
cd database
psql -U your_user -d your_database -f migrations/001_olq_tracking_schema.sql
```

### 2. Seed Sample Data (Optional)

For testing, run the seeder script:

```bash
cd database/scripts
python seed_olq_data.py
```

This creates 30 days of realistic sample data for a test user.

### 3. Backend Setup

The OLQ tracker API is already registered in the backend router. Ensure your backend is running:

```bash
cd backend-ai
python -m uvicorn app.main:app --reload
```

### 4. Frontend Setup

The frontend components are ready to use. Start your development server:

```bash
cd frontend
npm run dev
```

## Usage

### Recording an Assessment

```typescript
import { createOLQAssessment } from "@/lib/api/olq-tracker";

await createOLQAssessment(
  userId,
  "WAT", // Test type
  testId,
  85, // Overall score
  {
    effective_intelligence: 8,
    reasoning_ability: 7,
    // ... all 15 OLQs
  },
  "AI", // Assessed by
  "Excellent performance",
);
```

### Fetching Current Scores

```typescript
import { getCurrentOLQScores } from "@/lib/api/olq-tracker";

const { scores, labels, last_updated } = await getCurrentOLQScores(userId);
// scores: number[] (15 values)
// labels: string[] (OLQ names)
```

### Viewing the Dashboard

Navigate to `/olq-dashboard` to see the full OLQ tracking interface with:

- Radar chart visualization
- Factor score breakdown
- Daily progress tracking
- Configuration panel

## Configuration System

### Weights

Each OLQ can have a weight multiplier (0.5x to 2.0x) that affects how scores are calculated. Default is 1.0x.

### Targets

Set target scores (1-10) for each OLQ to track progress towards goals. Default is 7.

### Accessing Configuration

```typescript
import { getOLQConfiguration, updateOLQConfiguration } from '@/lib/api/olq-tracker'

// Get current config
const config = await getOLQConfiguration(userId)

// Update config
await updateOLQConfiguration(userId, {
  weights: { effective_intelligence: 1.5, ... },
  targets: { effective_intelligence: 8, ... },
  configuration_name: 'Leadership Focus',
  notes: 'Emphasizing leadership qualities'
})
```

## Integration with Existing Tests

The OLQ tracking system is designed to integrate with all existing assessment modules:

### OIR Tests

- Primary OLQs: Effective Intelligence, Reasoning Ability
- Record scores after each OIR test completion

### Psychology Tests (TAT, WAT, SRT, SD)

- Primary OLQs: Power of Expression, Initiative, Social Adaptability
- Record scores after each psychology assessment

### GTO Exercises (GPE, GTO)

- Primary OLQs: Organizing Ability, Cooperation, Ability to Influence
- Record scores after GTO simulation completion

### Interview

- All OLQs can be assessed
- Comprehensive evaluation after interview practice

## API Reference

### Assessment Object

```typescript
interface OLQAssessment {
  id: string;
  user_id: string;
  test_type: string;
  test_id: string | null;
  overall_score: number | null;
  olq_scores: OLQScores;
  assessed_by: string;
  notes: string | null;
  created_at: string;
}
```

### OLQ Scores

```typescript
interface OLQScores {
  effective_intelligence: number | null;
  reasoning_ability: number | null;
  organizing_ability: number | null;
  power_of_expression: number | null;
  social_adaptability: number | null;
  cooperation: number | null;
  sense_of_responsibility: number | null;
  initiative: number | null;
  self_confidence: number | null;
  speed_of_decision: number | null;
  ability_to_influence: number | null;
  liveliness: number | null;
  determination: number | null;
  courage: number | null;
  stamina: number | null;
}
```

### Daily Summary

```typescript
interface OLQDailySummary {
  date: string;
  olq_averages: OLQScores;
  overall_daily_score: number | null;
  assessment_count: number;
}
```

## Best Practices

1. **Consistent Recording**: Record OLQ scores immediately after each assessment
2. **Regular Reviews**: Check the dashboard weekly to identify trends
3. **Configuration Tuning**: Adjust weights based on specific goals
4. **Target Setting**: Set realistic but challenging targets
5. **Export Reports**: Download periodic reports for offline analysis

## Troubleshooting

### No Data Showing

- Ensure assessments have been recorded
- Check that the user ID is correct
- Verify database connection

### API Errors

- Check that the backend is running
- Verify DATABASE_URL in .env
- Ensure the olq_assessments table exists

### Chart Not Rendering

- Verify plotly.js is installed
- Check browser console for errors
- Ensure the component is mounted (SSR disabled)

## Future Enhancements

- [ ] AI-powered OLQ assessment from test responses
- [ ] Comparative analysis with peer groups
- [ ] Predictive analytics for SSB success
- [ ] Mobile-optimized dashboard
- [ ] Push notifications for daily tracking reminders
- [ ] Integration with wearable devices for stamina tracking

## Support

For issues or questions, please refer to:

- GitHub Issues: [repository issues page]
- Documentation: `/docs` directory
- API Swagger: `http://localhost:8000/docs`

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-20  
**Author**: SSB NextGen Team
