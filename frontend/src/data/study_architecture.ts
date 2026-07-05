/**
 * Study Architecture – Pragya Study Base
 *
 * Defines the syllabus hierarchy used by the Pragya dashboard
 * and chapter‑reader pages.
 */

export interface Chapter {
  id: string
  title: string
  description: string
  type: 'Theory' | 'Quiz' | 'Case Study' | 'Flashcard' | 'Practice'
  readTime: number          // minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  status: 'available' | 'completed' | 'locked'
}

export interface StudyModule {
  id: string
  title: string
  description: string
  icon: string              // key into the icon‑map on the page
  chapters: Chapter[]
}

export interface StudyCategory {
  id: string
  title: string
  description: string
  color: string             // tailwind colour name (blue, emerald, …)
  modules: StudyModule[]
}

// ──────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────

export const STUDY_CATEGORIES: StudyCategory[] = [
  // ── 1. Mathematics ────────────────────────────────────────
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'NDA / CDS mathematics syllabus – algebra, calculus, trigonometry, and statistics.',
    color: 'blue',
    modules: [
      {
        id: 'algebra',
        title: 'Algebra & Equations',
        description: 'Master quadratic equations, matrices, determinants, and complex numbers.',
        icon: 'Calculator',
        chapters: [
          { id: 'alg-quadratics', title: 'Quadratic Equations', description: 'Roots, discriminant, and sum/product relations.', type: 'Theory', readTime: 12, difficulty: 'Beginner', status: 'available' },
          { id: 'alg-matrices', title: 'Matrices & Determinants', description: 'Operations, inverses, and the Cramer rule.', type: 'Theory', readTime: 18, difficulty: 'Intermediate', status: 'available' },
          { id: 'alg-complex', title: 'Complex Numbers', description: 'Argand plane, modulus, and the De Moivre theorem.', type: 'Theory', readTime: 15, difficulty: 'Intermediate', status: 'available' },
          { id: 'alg-quiz', title: 'Algebra – Rapid Fire Quiz', description: '25 MCQs covering the full algebra module.', type: 'Quiz', readTime: 20, difficulty: 'Intermediate', status: 'locked' },
        ],
      },
      {
        id: 'calculus',
        title: 'Differential & Integral Calculus',
        description: 'Limits, derivatives, integration, and differential equations.',
        icon: 'Calculator',
        chapters: [
          { id: 'calc-limits', title: 'Limits & Continuity', description: 'Epsilon‑delta definition and the Hospital rule.', type: 'Theory', readTime: 14, difficulty: 'Beginner', status: 'available' },
          { id: 'calc-derivatives', title: 'Derivatives & Applications', description: 'Chain rule, maxima/minima, tangent‑normal.', type: 'Theory', readTime: 20, difficulty: 'Intermediate', status: 'available' },
          { id: 'calc-integration', title: 'Integration Techniques', description: 'Substitution, by parts, partial fractions.', type: 'Theory', readTime: 22, difficulty: 'Advanced', status: 'locked' },
        ],
      },
      {
        id: 'trigonometry',
        title: 'Trigonometry',
        description: 'Identities, inverse functions, and height & distance problems.',
        icon: 'Calculator',
        chapters: [
          { id: 'trig-identities', title: 'Trigonometric Identities', description: 'Compound angles, sum‑to‑product, and product‑to‑sum.', type: 'Theory', readTime: 10, difficulty: 'Beginner', status: 'available' },
          { id: 'trig-height-dist', title: 'Height & Distance', description: 'Application problems for NDA Paper I.', type: 'Case Study', readTime: 15, difficulty: 'Intermediate', status: 'available' },
        ],
      },
    ],
  },

  // ── 2. General Knowledge ──────────────────────────────────
  {
    id: 'general-knowledge',
    title: 'General Knowledge',
    description: 'Current affairs, Indian polity, geography, history, and science for defence exams.',
    color: 'emerald',
    modules: [
      {
        id: 'indian-polity',
        title: 'Indian Polity & Constitution',
        description: 'Fundamental rights, directive principles, parliamentary system.',
        icon: 'Landmark',
        chapters: [
          { id: 'polity-preamble', title: 'Preamble & Fundamental Rights', description: 'Articles 12–35 and their judicial interpretation.', type: 'Theory', readTime: 15, difficulty: 'Beginner', status: 'available' },
          { id: 'polity-parliament', title: 'Parliamentary System', description: 'Lok Sabha, Rajya Sabha, and legislative process.', type: 'Theory', readTime: 18, difficulty: 'Intermediate', status: 'available' },
          { id: 'polity-judiciary', title: 'Indian Judiciary', description: 'Supreme Court, High Courts, PILs.', type: 'Theory', readTime: 14, difficulty: 'Intermediate', status: 'available' },
          { id: 'polity-quiz', title: 'Polity Quiz – 30 MCQs', description: 'Comprehensive quiz across all polity topics.', type: 'Quiz', readTime: 25, difficulty: 'Advanced', status: 'locked' },
        ],
      },
      {
        id: 'indian-history',
        title: 'Indian History',
        description: 'Ancient, medieval, and modern India – freedom struggle to post‑independence.',
        icon: 'Globe',
        chapters: [
          { id: 'hist-ancient', title: 'Ancient India', description: 'Indus Valley, Vedic period, Maurya & Gupta empires.', type: 'Theory', readTime: 20, difficulty: 'Beginner', status: 'available' },
          { id: 'hist-medieval', title: 'Medieval India', description: 'Delhi Sultanate, Mughal Empire, Bhakti & Sufi movements.', type: 'Theory', readTime: 20, difficulty: 'Intermediate', status: 'available' },
          { id: 'hist-modern', title: 'Modern India & Freedom Struggle', description: '1857 revolt to Independence, key personalities.', type: 'Theory', readTime: 25, difficulty: 'Intermediate', status: 'available' },
        ],
      },
      {
        id: 'geography',
        title: 'Indian & World Geography',
        description: 'Physical, economic, and human geography concepts.',
        icon: 'Globe',
        chapters: [
          { id: 'geo-physical', title: 'Physical Geography of India', description: 'Physiographic divisions, rivers, climate zones.', type: 'Theory', readTime: 18, difficulty: 'Beginner', status: 'available' },
          { id: 'geo-world', title: 'World Geography', description: 'Continents, oceans, major straits, and global climate.', type: 'Theory', readTime: 20, difficulty: 'Intermediate', status: 'available' },
        ],
      },
    ],
  },

  // ── 3. English & Comprehension ────────────────────────────
  {
    id: 'english',
    title: 'English & Comprehension',
    description: 'Grammar, vocabulary, reading comprehension, and précis writing.',
    color: 'cyan',
    modules: [
      {
        id: 'grammar',
        title: 'English Grammar',
        description: 'Sentence correction, voice, narration, and tenses.',
        icon: 'BookOpen',
        chapters: [
          { id: 'eng-tenses', title: 'Tenses & Voice', description: 'Active/passive voice transformations and tense usage.', type: 'Theory', readTime: 12, difficulty: 'Beginner', status: 'available' },
          { id: 'eng-narration', title: 'Direct & Indirect Speech', description: 'Rules for converting narration.', type: 'Theory', readTime: 10, difficulty: 'Beginner', status: 'available' },
          { id: 'eng-errors', title: 'Spotting Errors', description: 'Common grammatical error patterns in CDS / AFCAT.', type: 'Practice', readTime: 15, difficulty: 'Intermediate', status: 'available' },
        ],
      },
      {
        id: 'comprehension',
        title: 'Reading Comprehension',
        description: 'Passage analysis, inference, and vocabulary in context.',
        icon: 'BookOpen',
        chapters: [
          { id: 'eng-rc-strategies', title: 'RC Strategies', description: 'Skimming, scanning, and inference techniques.', type: 'Theory', readTime: 10, difficulty: 'Beginner', status: 'available' },
          { id: 'eng-rc-practice', title: 'RC Practice – 5 Passages', description: 'Timed comprehension practice with detailed solutions.', type: 'Practice', readTime: 30, difficulty: 'Intermediate', status: 'available' },
        ],
      },
    ],
  },

  // ── 4. Defence & Current Affairs ──────────────────────────
  {
    id: 'defence-awareness',
    title: 'Defence & Current Affairs',
    description: 'Indian Armed Forces, international relations, and recent events for SSB interview.',
    color: 'orange',
    modules: [
      {
        id: 'indian-defence',
        title: 'Indian Defence Forces',
        description: 'Army, Navy, Air Force structure, ranks, commands, and equipment.',
        icon: 'Shield',
        chapters: [
          { id: 'def-army', title: 'Indian Army – Structure & Commands', description: 'Ranks, commands, regiments, and recent operations.', type: 'Theory', readTime: 18, difficulty: 'Beginner', status: 'available' },
          { id: 'def-navy', title: 'Indian Navy – Fleet & Bases', description: 'Commands, major warships, and naval exercises.', type: 'Theory', readTime: 15, difficulty: 'Beginner', status: 'available' },
          { id: 'def-airforce', title: 'Indian Air Force – Squadrons & Aircraft', description: 'Commands, fighter fleet, and indigenous platforms.', type: 'Theory', readTime: 15, difficulty: 'Beginner', status: 'available' },
          { id: 'def-exercises', title: 'Joint & International Exercises', description: 'Malabar, RIMPAC, Pitch Black, Garuda – key bilateral drills.', type: 'Flashcard', readTime: 10, difficulty: 'Intermediate', status: 'available' },
        ],
      },
      {
        id: 'current-affairs',
        title: 'Current Affairs Digest',
        description: 'Monthly digest of national and international events relevant to defence exams.',
        icon: 'Globe',
        chapters: [
          { id: 'ca-national', title: 'National Events', description: 'Government schemes, appointments, awards.', type: 'Theory', readTime: 12, difficulty: 'Beginner', status: 'available' },
          { id: 'ca-international', title: 'International Relations', description: 'Summits, treaties, UN resolutions, and geopolitics.', type: 'Theory', readTime: 14, difficulty: 'Intermediate', status: 'available' },
          { id: 'ca-quiz', title: 'Current Affairs Quiz – 40 MCQs', description: 'Quick‑fire quiz on the last 3 months.', type: 'Quiz', readTime: 20, difficulty: 'Advanced', status: 'locked' },
        ],
      },
    ],
  },

  // ── 5. SSB Psychology ─────────────────────────────────────
  {
    id: 'ssb-psychology',
    title: 'SSB Psychology',
    description: 'TAT, WAT, SRT, and Self‑Description theory, examples, and practice sets.',
    color: 'purple',
    modules: [
      {
        id: 'tat-theory',
        title: 'TAT – Thematic Apperception Test',
        description: 'How to write impactful TAT stories with OLQ‑driven narratives.',
        icon: 'Brain',
        chapters: [
          { id: 'tat-intro', title: 'TAT Introduction & Format', description: 'What the assessor looks for, timing, and structure.', type: 'Theory', readTime: 10, difficulty: 'Beginner', status: 'available' },
          { id: 'tat-olq', title: 'Infusing OLQs into Stories', description: 'How to naturally project Officer‑Like Qualities.', type: 'Case Study', readTime: 15, difficulty: 'Intermediate', status: 'available' },
          { id: 'tat-practice', title: 'TAT Practice – 10 Pictures', description: 'Write stories and self‑evaluate with the OLQ checklist.', type: 'Practice', readTime: 30, difficulty: 'Intermediate', status: 'available' },
        ],
      },
      {
        id: 'wat-srt-theory',
        title: 'WAT & SRT Strategies',
        description: 'Word Association Test and Situation Reaction Test best practices.',
        icon: 'MessageSquare',
        chapters: [
          { id: 'wat-intro', title: 'WAT – Format & Strategy', description: '15‑second rule, positive framing, and common pitfalls.', type: 'Theory', readTime: 10, difficulty: 'Beginner', status: 'available' },
          { id: 'srt-intro', title: 'SRT – Situation Reaction Test', description: 'How to write concise, action‑oriented responses.', type: 'Theory', readTime: 12, difficulty: 'Beginner', status: 'available' },
          { id: 'srt-practice', title: 'SRT Practice – 60 Situations', description: 'Timed practice with model answers.', type: 'Practice', readTime: 35, difficulty: 'Intermediate', status: 'available' },
        ],
      },
    ],
  },

  // ── 6. GTO & Interview ────────────────────────────────────
  {
    id: 'gto-interview',
    title: 'GTO & Interview',
    description: 'Group Testing Officer tasks, lecturette, group discussion, and personal interview preparation.',
    color: 'rose',
    modules: [
      {
        id: 'gto-tasks',
        title: 'GTO Task Theory',
        description: 'PGT, HGT, Command Task, IO, and Snake Race rules & strategies.',
        icon: 'Shield',
        chapters: [
          { id: 'gto-pgt', title: 'PGT / HGT / FGT Rules', description: 'Rule of Rigidity, Rule of Distance, and colour demarcations.', type: 'Theory', readTime: 15, difficulty: 'Beginner', status: 'available' },
          { id: 'gto-io', title: 'Individual Obstacles', description: 'All 10 obstacles – technique, timing, and safety.', type: 'Theory', readTime: 12, difficulty: 'Beginner', status: 'available' },
          { id: 'gto-ct', title: 'Command Task Mindset', description: 'How the GTO evaluates your command potential.', type: 'Case Study', readTime: 15, difficulty: 'Intermediate', status: 'available' },
        ],
      },
      {
        id: 'personal-interview',
        title: 'Personal Interview',
        description: 'How to handle rapid‑fire questions, PIQ‑based probes, and tricky scenarios.',
        icon: 'MessageSquare',
        chapters: [
          { id: 'pi-intro', title: 'Interview Overview', description: 'What the IO expects, body language, and first impressions.', type: 'Theory', readTime: 12, difficulty: 'Beginner', status: 'available' },
          { id: 'pi-piq', title: 'PIQ‑Based Questions', description: 'How every PIQ field turns into an interview question.', type: 'Theory', readTime: 15, difficulty: 'Intermediate', status: 'available' },
          { id: 'pi-tricky', title: 'Handling Tricky Scenarios', description: '"Why should we select you?" and other curveballs.', type: 'Case Study', readTime: 18, difficulty: 'Advanced', status: 'available' },
          { id: 'pi-mock', title: 'Mock Interview – Self‑Assessment', description: 'Record yourself answering 20 questions, then evaluate.', type: 'Practice', readTime: 40, difficulty: 'Advanced', status: 'locked' },
        ],
      },
    ],
  },
]
