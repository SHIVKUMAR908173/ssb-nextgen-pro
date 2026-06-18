# 📚 Complete Dataset Generation Prompts Guide
## For 5-Day SSB Process + NDA/CDS/AFCAT Free Resources

---

## 🎯 Overview

This document provides comprehensive prompts for generating datasets covering:
1. **Complete 5-Day SSB Selection Process**
2. **NDA Exam Preparation Resources**
3. **CDS Exam Preparation Resources**
4. **AFCAT Exam Preparation Resources**

Each prompt is designed to generate high-quality, exam-relevant content that can be directly integrated into the SSB NextGen Pro platform.

---

## 📋 Table of Contents

1. [5-Day SSB Process Datasets](#5-day-ssb-process-datasets)
   - [Day 1: Screening Test (PPDT + OIR + SDT)](#day-1-screening-test)
   - [Day 2: Psychology Tests (TAT + WAT + SRT)](#day-2-psychology-tests)
   - [Day 3-4: GTO Tasks](#day-3-4-gto-tasks)
   - [Day 5: Interview & Conference](#day-5-interview--conference)
2. [NDA Free Resources](#nda-free-resources)
3. [CDS Free Resources](#cds-free-resources)
4. [AFCAT Free Resources](#afcat-free-resources)
5. [Dataset Specifications](#dataset-specifications)
6. [Integration Guidelines](#integration-guidelines)

---

## 5-Day SSB Process Datasets

### Day 1: Screening Test

#### PPDT (Picture Perception & Description Test) Dataset

**Prompt for Generating 100 Additional PPDT Scenarios:**

```
Generate 100 PPDT (Picture Perception & Description Test) hazy picture scenarios for SSB screening. Each scenario should include:

REQUIREMENTS:
- Ambiguous social situations with 2-4 human figures
- Objects that can be interpreted in multiple ways
- Diverse settings: indoor (classroom, office, home), outdoor (park, street, field)
- Various emotional contexts: cooperation, conflict, problem-solving, celebration
- Time variations: morning, afternoon, evening, night
- Weather conditions: clear, rainy, foggy, sunny
- Character demographics: different age groups, genders, occupations

FORMAT FOR EACH SCENARIO:
{
  "id": "ppdt-xxx",
  "description": "Detailed description of the ambiguous scene",
  "setting": "indoor/outdoor specific location",
  "characterCount": number,
  "objectCount": number,
  "emotionalTone": "cooperative/conflict/problem-solving/etc",
  "difficultyLevel": "easy/medium/hard",
  "suggestedTimeLimit": "4 minutes 30 seconds",
  "evaluationFocus": ["observation", "imagination", "social awareness", "story construction"]
}

SOURCES:
- Real SSB screening pictures from SSBCrack samples
- Major Kalshi Classes practice materials
- Centurion Defence Academy PPDT sets
- SSB Arena hazy pictures
```

#### OIR (Officer Intelligence Rating) Dataset

**Prompt for Generating 200 OIR Questions:**

```
Create 200 OIR questions divided equally between verbal and non-verbal reasoning:

VERBAL REASONING (100 questions):
1. Alphabet Series (25) — Letter patterns, missing letters
2. Coding-Decoding (25) — Letter/number/symbol coding
3. Blood Relations (25) — Family tree, relationship puzzles
4. Direction Sense (25) — Distance/direction, shadow-based

NON-VERBAL REASONING (100 questions):
1. Figure Analogy (25) — Pattern relationships
2. Mirror Images (20) — Vertical/horizontal mirror patterns
3. Water Images (20) — Vertical inversion patterns
4. Paper Folding (15) — Folding/cutting patterns
5. Embedded Figures (20) — Hidden figure detection

FORMAT:
{
  "id": "oir-[type]-[number]",
  "category": "verbal/non_verbal",
  "type": "specific question type",
  "question": "Clear question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A/B/C/D",
  "difficulty": 1/2/3,
  "explanation": "Detailed solution with reasoning"
}

SOURCES: UPSC NDA papers (2010-2024), RS Aggarwal, SSBCrack OIR sets
```

#### SDT (Self Description Test) Dataset

**Prompt for Generating 50 SDT Prompts:**

```
Generate 50 SDT prompts covering:
1. Self-Perspective (15) — Strengths, weaknesses, values, goals
2. Parents' Perspective (10) — How parents see you
3. Teachers' Perspective (10) — Academic performance, attitude
4. Friends' Perspective (10) — Social interactions, reliability
5. Mixed Perspectives (5) — Comparative analysis

FORMAT:
{
  "id": "sdt-xxx",
  "perspective": "self/parents/teachers/friends",
  "promptTemplate": "Write a brief description...",
  "focusAreas": ["specific areas"],
  "wordLimit": "150-200 words",
  "timeAllocation": "15 minutes",
  "evaluationRubric": { "selfAwareness": "0-5", "authenticity": "0-5", "consistency": "0-5" }
}
```

---

### Day 2: Psychology Tests

#### TAT (Thematic Apperception Test) Dataset

**Prompt for Generating 100 TAT Story Prompts:**

```
Create 100 TAT story prompts based on real SSB scenarios:

THEME CATEGORIES:
1. Leadership Situations (25) — Leading teams, difficult decisions
2. Moral/Ethical Dilemmas (20) — Right vs easy, integrity under pressure
3. Teamwork Scenarios (20) — Collaboration, conflict resolution
4. Crisis Management (20) — Emergency response, resource constraints
5. Goal Achievement (15) — Overcoming obstacles, perseverance

FORMAT:
{
  "id": "tat-xxx",
  "pictureDescription": "Ambiguous scene description",
  "characters": { "count": N, "ageGroup": "young/adult", "gender": "mixed" },
  "setting": "location and context",
  "storyFramework": { "past": "...", "present": "...", "thoughts": "...", "future": "..." },
  "timeLimit": "4 minutes 30 seconds per picture",
  "olqMapping": ["specific OLQs assessed"],
  "sampleResponses": { "average": "...", "good": "...", "excellent": "..." }
}

SOURCES: SSB Arena TAT (336 images), Centurion Defence Academy, Major Kalshi
```

#### WAT (Word Association Test) Dataset

**Prompt for Generating 200 WAT Words:**

```
Generate 200 WAT words categorized by type:

1. Leadership & Authority (40) — Command, Responsibility, Decision...
2. Social & Team Dynamics (40) — Cooperation, Conflict, Trust...
3. Action & Achievement (40) — Achieve, Overcome, Solve...
4. Abstract Concepts (40) — Justice, Integrity, Courage...
5. Situational Words (40) — Crisis, Opportunity, Challenge...

FORMAT:
{
  "id": "wat-xxx",
  "word": "stimulus word",
  "category": "leadership/social/action/abstract/situational",
  "difficulty": "easy/medium/hard",
  "sampleAssociations": { "positive": "...", "actionOriented": "..." },
  "timeLimit": "15 seconds",
  "olqIndicators": ["specific OLQs revealed"]
}

SOURCES: SSBCrack WAT eBook, Defence Academy sets, existing wat_word_bank.json
```

#### SRT (Situation Reaction Test) Dataset

**Prompt for Generating 150 SRT Scenarios:**

```
Create 150 SRT scenarios covering:

1. Leadership Challenges (30) — Unmotivated teams, quick decisions
2. Ethical Dilemmas (25) — Moral conflicts, integrity vs convenience
3. Time Management (25) — Multiple deadlines, priority conflicts
4. Resource Constraints (25) — Limited budget/time/personnel
5. Interpersonal Conflicts (25) — Team disputes, superior-subordinate
6. Emergency Situations (20) — Medical, safety, security threats

FORMAT:
{
  "id": "srt-xxx",
  "category": "leadership/ethical/time/resource/interpersonal/emergency",
  "situation": "2-3 sentence realistic scenario",
  "sampleResponses": {
    "poor": { "response": "...", "issues": ["..."] },
    "average": { "response": "...", "strengths": ["..."] },
    "excellent": { "response": "...", "olqsDemonstrated": ["..."] }
  },
  "olqMapping": ["specific OLQs assessed"]
}

SOURCES: SSBCrack SRT eBook, Defence Academy sets, existing srt_situation_bank.json
```

---

### Day 3-4: GTO Tasks

#### Group Discussion Topics (100 topics)

```
Categories: Current Affairs (25), Social Issues (25), Abstract (20), Defence (15), Technology (15)

FORMAT:
{
  "id": "gd-xxx",
  "topic": "Clear topic statement",
  "category": "current-affairs/social/abstract/defence/technology",
  "keyDiscussionPoints": ["Main aspects"],
  "evaluationCriteria": { "communication": "...", "knowledge": "...", "leadership": "..." }
}
```

#### Group Planning Exercise (50 scenarios)

```
FORMAT:
{
  "id": "gpe-xxx",
  "title": "Scenario name",
  "problems": [{ "description": "...", "urgency": "...", "importance": "..." }],
  "availableResources": { "personnel": N, "equipment": ["..."], "time": "..." },
  "idealSolution": { "priorities": "...", "resourceAllocation": "...", "timeline": "..." }
}
```

#### Progressive Group Task (30 scenarios)

```
FORMAT:
{
  "id": "pgt-xxx",
  "objective": "Goal to achieve",
  "obstacles": [{ "type": "burma_bridge/wall/gap", "dimensions": {} }],
  "availableMaterials": [{ "item": "plank/rope/drum", "quantity": N }],
  "colorRules": { "red": "Out of bounds", "white": "Safe for both" },
  "groupSize": "8-10",
  "timeLimit": "15-20 minutes"
}
```

#### Lecturette Topics (100 topics)

```
Difficulty Tiers: Above Average (25), Average (50), Sub-Standard (25)
Categories: Current Affairs, Social Issues, Science, Defence, Education, Environment

FORMAT:
{
  "id": "lec-xxx",
  "topic": "Topic statement",
  "difficultyTier": "above_average/average/sub_standard",
  "keyPoints": ["4-5 main discussion points"],
  "sampleOutline": { "introduction": "...", "body": "...", "conclusion": "..." }
}
```

---

### Day 5: Interview & Conference

#### Personal Interview Questions (200 questions)

```
Categories:
1. Personal Background (40) — Family, education, hobbies, strengths/weaknesses
2. Defence Motivation (40) — Why armed forces, career goals
3. Current Affairs (40) — National/international issues
4. Situational/Leadership (40) — Hypothetical scenarios
5. Ethics & Values (40) — Moral principles, integrity

FORMAT:
{
  "id": "pi-xxx",
  "category": "personal/motivation/current-affairs/situational/ethics",
  "question": "Direct question",
  "intent": "What interviewer assesses",
  "followUpQuestions": ["Potential follow-ups"],
  "olqAssessment": ["Target OLQs"],
  "difficultyLevel": "easy/medium/hard"
}
```

#### Conference Evaluation Framework

```
{
  "assessorEvaluation": {
    "psychologist": { "maxMarks": 300, "passingMarks": 90 },
    "gto": { "maxMarks": 300, "passingMarks": 90 },
    "io": { "maxMarks": 300, "passingMarks": 90 }
  },
  "aggregationRules": {
    "totalMarks": 900,
    "passingTotal": 270,
    "perAssessorMinimum": 90,
    "borderlineRange": "240-269"
  },
  "recommendationCriteria": {
    "SSB_RECOMMEND": "All assessors >= 90 AND total >= 270",
    "MAYBE": "Total 240-269 (borderline)",
    "NOT_RECOMMEND": "Any assessor < 90 OR total < 240"
  }
}
```

---

## NDA Free Resources

### NDA Mathematics (625 questions)

```
Topics: Algebra (100), Matrices (50), Trigonometry (75), Analytical Geometry (100),
Differential Calculus (100), Integral Calculus (75), Probability & Stats (75), Vectors (50)

FORMAT:
{
  "id": "nda-math-[topic]-[number]",
  "topic": "specific topic",
  "question": "Problem statement",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A/B/C/D",
  "difficulty": 1/2/3,
  "stepByStepSolution": "Detailed solution",
  "formulaUsed": ["relevant formulas"]
}

SOURCES: UPSC NDA papers (2010-2024), RS Aggarwal, NCERT (11th/12th), Arihant NDA
```

### NDA General Ability (700 questions)

```
English (300): Grammar (100), Comprehension (250 from 50 passages), Vocabulary (100)
GK (400): Physics (80), Chemistry (80), Biology (60), History (60), Geography (60),
Current Affairs (40), Polity (40), Economics (40)

SOURCES: NCERT textbooks, Lucent's GK, Arihant NDA, The Hindu
```

---

## CDS Free Resources

### CDS English (500 items)

```
Reading Comprehension (250 from 50 passages), Grammar (150), Vocabulary (100)
SOURCES: UPSC CDS papers, Wren & Martin, Word Power Made Easy
```

### CDS General Knowledge (800 questions)

```
History (150), Geography (150), Polity (100), Economics (100), Science (200), Current Affairs (100)
SOURCES: NCERT, Lucent's GK, Manorama Yearbook, PRS India, PIB
```

### CDS Elementary Mathematics (500 questions)

```
Arithmetic (150), Algebra (100), Geometry (100), Trigonometry (75), Statistics (75)
SOURCES: UPSC CDS papers, RS Aggarwal, NCERT (9th/10th), Arihant CDS
```

---

## AFCAT Free Resources

### AFCAT Verbal Ability (350 items)

```
Reading Comprehension (150 from 30 passages), Grammar (100), Vocabulary (100)
Focus: Include aviation/technical terminology
SOURCES: Previous AFCAT papers, aviation journals
```

### AFCAT Numerical Ability (350 questions)

```
Basic Arithmetic (100), Algebra (75), Geometry/Mensuration (75), Time/Speed/Distance (50), Work/Time (50)
SOURCES: Previous AFCAT papers, RS Aggarwal, Fast Track Objective Arithmetic
```

### AFCAT Reasoning & Military Aptitude (250 questions)

```
Verbal Reasoning (100), Non-Verbal Reasoning (100), Military Aptitude (50)
Military Aptitude: Spatial orientation, hidden figures, map reading, mechanical comprehension
SOURCES: Previous AFCAT papers, RS Aggarwal, military aptitude test books
```

### AFCAT General Awareness (400 questions)

```
Defence (100), Aviation (100), Current Events (100), Static GK (100)
Aviation Focus: Aircraft, helicopters, airports, space tech, aeronautical engineering
SOURCES: Previous AFCAT papers, SP's Military Yearbook, aviation magazines
```

---

## Dataset Specifications

### General JSON Format

```json
{
  "datasetId": "unique_dataset_identifier",
  "version": "1.0.0",
  "generatedAtIso": "2026-05-17T10:00:00.000Z",
  "items": [
    {
      "id": "item-unique-id",
      "type": "question/prompt/scenario",
      "category": "main category",
      "difficulty": "easy/medium/hard",
      "content": "main content",
      "options": ["for MCQs"],
      "correctAnswer": "index or text",
      "explanation": "detailed solution",
      "olqMapping": ["relevant OLQs"],
      "tags": ["searchable tags"]
    }
  ]
}
```

### Quality Assurance Criteria

1. **Accuracy**: All content verified against official sources
2. **Relevance**: Aligned with current exam patterns and syllabi
3. **Difficulty Progression**: Easy → Medium → Hard
4. **Explanations**: Detailed solutions for all questions
5. **Updates**: Quarterly review and updates
6. **Validation**: Schema validation for all datasets

---

## Integration Guidelines

### 1. Place datasets in `src/data/`

```
src/data/
├── nda_math_bank.json
├── nda_gat_bank.json
├── cds_english_bank.json
├── cds_gk_bank.json
├── cds_math_bank.json
├── afcat_verbal_bank.json
├── afcat_math_bank.json
├── afcat_reasoning_bank.json
├── afcat_ga_bank.json
├── ppdt_scenario_bank.json
├── gd_topics.json (existing)
├── gpe_scenario_bank.json
├── pgt_scenario_bank.json
├── lecturette_topics.json
├── pi_question_bank.json
└── conference_framework.json
```

### 2. Import in components

```typescript
import ndaMathBank from '@/data/nda_math_bank.json';
```

### 3. Add to Resources page tabs

Update `src/app/resources/page.tsx` with new tabs for each exam dataset.

---

**Document Version**: 1.0.0
**Last Updated**: May 17, 2026
**Maintained By**: SSB NextGen Pro Development Team
