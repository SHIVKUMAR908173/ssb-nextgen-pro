export interface StudyChapter {
  id: string
  title: string
  description: string
  readTime: number // in minutes
  type: 'concept' | 'video' | 'interactive' | 'quiz'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  status: 'locked' | 'unlocked' | 'completed'
}

export interface StudyModule {
  id: string
  title: string
  description: string
  icon: string
  chapters: StudyChapter[]
}

export interface StudyCategory {
  id: string
  title: string
  description: string
  color: string
  modules: StudyModule[]
}

export const STUDY_CATEGORIES: StudyCategory[] = [
  {
    id: 'nda',
    title: 'NDA Syllabus',
    description: 'Complete National Defence Academy prep (Maths, GAT, English).',
    color: 'blue',
    modules: [
      {
        id: 'nda-maths',
        title: 'Mathematics (Paper I)',
        description: 'Algebra, Calculus, Trigonometry, and Statistics.',
        icon: 'Calculator',
        chapters: [
          { id: 'nda-m-1', title: 'Sets, Venn Diagrams and Relations', description: 'Basic set theory and operations.', readTime: 45, type: 'concept', difficulty: 'Beginner', status: 'unlocked' },
          { id: 'nda-m-2', title: 'Complex Numbers', description: 'Properties, modulus, and argument.', readTime: 60, type: 'concept', difficulty: 'Intermediate', status: 'locked' },
        ]
      },
      {
        id: 'nda-gat',
        title: 'General Ability (Paper II)',
        description: 'Physics, Chemistry, General Science, History, Geography.',
        icon: 'Globe',
        chapters: [
          { id: 'nda-g-1', title: 'Mechanics & Kinematics', description: 'Laws of motion and kinematics.', readTime: 55, type: 'concept', difficulty: 'Intermediate', status: 'unlocked' },
        ]
      }
    ]
  },
  {
    id: 'cds',
    title: 'CDS Syllabus',
    description: 'Combined Defence Services preparation modules.',
    color: 'emerald',
    modules: [
      {
        id: 'cds-english',
        title: 'English Language',
        description: 'Grammar, vocabulary, and reading comprehension.',
        icon: 'BookOpen',
        chapters: [
          { id: 'cds-e-1', title: 'Spotting Errors', description: 'Common grammatical mistakes.', readTime: 30, type: 'concept', difficulty: 'Beginner', status: 'unlocked' },
        ]
      },
      {
        id: 'cds-gk',
        title: 'General Knowledge',
        description: 'Polity, Economy, History, and Defence updates.',
        icon: 'Landmark',
        chapters: [
          { id: 'cds-gk-1', title: 'Indian Constitution Basics', description: 'Preamble, Fundamental Rights, and Duties.', readTime: 45, type: 'concept', difficulty: 'Intermediate', status: 'locked' },
        ]
      }
    ]
  },
  {
    id: 'afcat',
    title: 'AFCAT Prep',
    description: 'Air Force Common Admission Test study material.',
    color: 'cyan',
    modules: [
      {
        id: 'afcat-reasoning',
        title: 'Reasoning & Military Aptitude',
        description: 'Spatial ability, analogies, and classification.',
        icon: 'Brain',
        chapters: [
          { id: 'afcat-r-1', title: 'Spatial Reasoning', description: 'Mental rotation and pattern matching.', readTime: 40, type: 'interactive', difficulty: 'Advanced', status: 'unlocked' },
        ]
      }
    ]
  },
  {
    id: 'oir',
    title: 'OIR Tests',
    description: 'Officer Intelligence Rating (Verbal & Non-Verbal).',
    color: 'orange',
    modules: [
      {
        id: 'oir-verbal',
        title: 'Verbal Intelligence',
        description: 'Blood relations, coding-decoding, sequence.',
        icon: 'MessageSquare',
        chapters: [
          { id: 'oir-v-1', title: 'Coding & Decoding', description: 'Letter and number coding patterns.', readTime: 25, type: 'quiz', difficulty: 'Beginner', status: 'unlocked' },
        ]
      }
    ]
  },
  {
    id: 'ssb',
    title: 'SSB Prep Guide',
    description: 'Psychology, GTO, and Personal Interview foundations.',
    color: 'purple',
    modules: [
      {
        id: 'ssb-psych',
        title: 'Psychological Tests',
        description: 'TAT, WAT, SRT, and SD strategies.',
        icon: 'BrainCircuit',
        chapters: [
          { id: 'ssb-p-1', title: 'TAT Theme Building', description: 'How to structure a positive, hero-led story.', readTime: 35, type: 'concept', difficulty: 'Intermediate', status: 'unlocked' },
        ]
      }
    ]
  },
  {
    id: 'current-affairs',
    title: 'Current Affairs',
    description: 'Daily, weekly, and monthly geopolitical updates.',
    color: 'rose',
    modules: [
      {
        id: 'ca-defence',
        title: 'Defence Updates',
        description: 'Acquisitions, exercises, and strategic moves.',
        icon: 'Shield',
        chapters: [
          { id: 'ca-d-1', title: 'Recent Military Exercises', description: 'Joint exercises of Indian Armed Forces.', readTime: 20, type: 'concept', difficulty: 'Beginner', status: 'unlocked' },
        ]
      }
    ]
  }
]
