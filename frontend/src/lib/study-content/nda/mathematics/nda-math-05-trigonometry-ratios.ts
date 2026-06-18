import { TopicContent } from '../../types'

export const NDA_TRIG_TOPICS: TopicContent[] = [
  {
    id: 'nda-math-05-t01',
    title: 'Trigonometric Ratios — Definitions and Values',
    readTimeMinutes: 8,
    content: [
      { type: 'heading', data: 'Basic Definitions (Right Triangle)' },
      { type: 'table', data: {
        headers: ['Ratio', 'Definition', 'Reciprocal'],
        rows: [
          ['sin θ', 'Opposite / Hypotenuse', 'cosec θ = 1/sin θ'],
          ['cos θ', 'Adjacent / Hypotenuse', 'sec θ = 1/cos θ'],
          ['tan θ', 'Opposite / Adjacent = sin θ/cos θ', 'cot θ = 1/tan θ'],
        ]
      }},
      { type: 'heading', data: 'Standard Values Table' },
      { type: 'table', data: {
        headers: ['Angle', '0°', '30°', '45°', '60°', '90°'],
        rows: [
          ['sin', '0', '1/2', '1/√2', '√3/2', '1'],
          ['cos', '1', '√3/2', '1/√2', '1/2', '0'],
          ['tan', '0', '1/√3', '1', '√3', '∞'],
          ['cosec', '∞', '2', '√2', '2/√3', '1'],
          ['sec', '1', '2/√3', '√2', '2', '∞'],
          ['cot', '∞', '√3', '1', '1/√3', '0'],
        ]
      }},
      { type: 'callout', data: '🎯 MEMORY TRICK for sin values: sin 0°=0, 30°=1/2, 45°=1/√2, 60°=√3/2, 90°=1. Pattern: √0/2, √1/2, √2/2, √3/2, √4/2. Cos is reverse of sin!' },
      { type: 'heading', data: 'ASTC Rule — Signs in Quadrants' },
      { type: 'list', data: [
        'Quadrant I (0° to 90°): ALL ratios positive',
        'Quadrant II (90° to 180°): Only SINE (and cosec) positive',
        'Quadrant III (180° to 270°): Only TAN (and cot) positive',
        'Quadrant IV (270° to 360°): Only COS (and sec) positive',
        'Memory: All Students Take Coffee / Add Sugar To Coffee',
      ]},
      { type: 'heading', data: 'Fundamental Identities' },
      { type: 'formula', data: { expression: 'sin²θ + cos²θ = 1\n1 + tan²θ = sec²θ\n1 + cot²θ = cosec²θ', note: 'These three are THE most important trig identities. Memorise completely.' }},
    ],
    keyPoints: [
      'sin²θ + cos²θ = 1 — The most fundamental identity',
      'ASTC rule: All, Sin, Tan, Cos positive in Q1, Q2, Q3, Q4',
      'sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2',
      'tan 90° is undefined (∞), cot 0° is undefined',
      'sec²θ - tan²θ = 1, cosec²θ - cot²θ = 1',
    ],
    inlineQuiz: [
      { question: 'What is the value of sin²60° + cos²60°?', options: ['1','3/4','1/2','√3/2'], correct: 0, explanation: 'sin²θ + cos²θ = 1 for ALL values of θ. This is the Pythagorean identity.' },
      { question: 'In which quadrant is tan negative and cos positive?', options: ['I','II','III','IV'], correct: 3, explanation: 'Quadrant IV: cos positive (ASTC rule — C for cos in Q4), tan = sin/cos — sin is negative in Q4, cos positive, so tan is negative.' },
    ]
  },
  {
    id: 'nda-math-05-t02',
    title: 'Compound Angle Formulas',
    readTimeMinutes: 7,
    content: [
      { type: 'heading', data: 'Addition Formulas' },
      { type: 'formula', data: { expression: 'sin(A+B) = sinA cosB + cosA sinB\nsin(A-B) = sinA cosB - cosA sinB\ncos(A+B) = cosA cosB - sinA sinB\ncos(A-B) = cosA cosB + sinA sinB\ntan(A+B) = (tanA + tanB)/(1 - tanA tanB)\ntan(A-B) = (tanA - tanB)/(1 + tanA tanB)', note: 'These are derived in NDA. Learn the pattern: sin changes sign, cos formula has - in addition.' }},
      { type: 'heading', data: 'Double Angle Formulas' },
      { type: 'formula', data: { expression: 'sin 2A = 2 sinA cosA\ncos 2A = cos²A - sin²A = 1 - 2sin²A = 2cos²A - 1\ntan 2A = 2tanA/(1 - tan²A)', note: 'cos 2A has THREE forms — NDA asks you to choose the right one.' }},
      { type: 'heading', data: 'Product to Sum Formulas' },
      { type: 'formula', data: { expression: '2sinA cosB = sin(A+B) + sin(A-B)\n2cosA sinB = sin(A+B) - sin(A-B)\n2cosA cosB = cos(A+B) + cos(A-B)\n2sinA sinB = cos(A-B) - cos(A+B)', note: '' }},
      { type: 'callout', data: '⚠️ COMMON MISTAKE: In cos(A+B) = cosA cosB - sinA sinB, the sign is MINUS. Students often write plus. Remember: cosine addition uses minus.' },
    ],
    keyPoints: [
      'sin(A+B) = sinA cosB + cosA sinB',
      'cos(A+B) = cosA cosB - sinA sinB (minus sign!)',
      'sin 2A = 2sinA cosA',
      'cos 2A has 3 equivalent forms',
      'tan(A+B) = (tanA+tanB)/(1-tanA tanB)',
    ],
    inlineQuiz: [
      { question: 'What is sin 75°? (sin(45°+30°))', options: ['(√6+√2)/4','(√6-√2)/4','√3/2','(√3+1)/2'], correct: 0, explanation: 'sin(45+30) = sin45 cos30 + cos45 sin30 = (1/√2)(√3/2) + (1/√2)(1/2) = √3/(2√2) + 1/(2√2) = (√3+1)/(2√2) = (√6+√2)/4' },
      { question: 'cos 2θ = ?', options: ['2cos²θ - 1','1 - 2cos²θ','2sin²θ - 1','sin²θ - cos²θ'], correct: 0, explanation: 'cos 2θ = cos²θ - sin²θ = cos²θ - (1-cos²θ) = 2cos²θ - 1. Also equals 1-2sin²θ.' },
    ]
  }
]
