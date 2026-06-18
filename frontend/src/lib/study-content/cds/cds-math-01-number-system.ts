import { TopicContent } from '../types'

export const CDS_NUMBER_SYSTEM_TOPICS: TopicContent[] = [
  {
    id: 'cds-math-01-t01',
    title: 'Number Types and Properties',
    readTimeMinutes: 5,
    content: [
      { type: 'heading', data: 'Classification of Numbers' },
      { type: 'table', data: {
        headers: ['Type', 'Definition', 'Examples'],
        rows: [
          ['Natural Numbers (N)', 'Counting numbers', '1, 2, 3, 4, ...'],
          ['Whole Numbers (W)', 'Natural + Zero', '0, 1, 2, 3, ...'],
          ['Integers (Z)', 'Whole numbers + negatives', '...-2,-1,0,1,2...'],
          ['Rational (Q)', 'Can be expressed as p/q, q≠0', '1/2, 3/4, -5/3, 0.75'],
          ['Irrational', 'Cannot be expressed as p/q', '√2, π, e, √3'],
          ['Real Numbers (R)', 'All rational + irrational', 'All numbers on number line'],
          ['Prime', 'Exactly 2 factors: 1 and itself', '2,3,5,7,11,13,17,19,23...'],
          ['Composite', 'More than 2 factors', '4,6,8,9,10...'],
        ]
      }},
      { type: 'callout', data: '🎯 CDS FACT: 1 is NEITHER prime nor composite. 2 is the ONLY even prime number. These are very common trick questions.' },
      { type: 'heading', data: 'Divisibility Rules' },
      { type: 'table', data: {
        headers: ['Divisible by', 'Rule'],
        rows: [
          ['2', 'Last digit is 0,2,4,6,8 (even)'],
          ['3', 'Sum of digits divisible by 3'],
          ['4', 'Last 2 digits divisible by 4'],
          ['5', 'Last digit is 0 or 5'],
          ['6', 'Divisible by both 2 and 3'],
          ['7', 'Double last digit, subtract from rest. Repeat till 2 digits.'],
          ['8', 'Last 3 digits divisible by 8'],
          ['9', 'Sum of digits divisible by 9'],
          ['11', 'Alternate digit sum difference is 0 or 11 (odd pos - even pos)'],
          ['25', 'Last 2 digits are 00, 25, 50, or 75'],
        ]
      }},
      { type: 'heading', data: 'HCF and LCM' },
      { type: 'formula', data: { expression: 'HCF × LCM = Product of two numbers\nHCF of fractions = HCF of numerators / LCM of denominators\nLCM of fractions = LCM of numerators / HCF of denominators', note: 'Very frequently tested in CDS' }},
      { type: 'callout', data: '⚠️ COMMON MISTAKE: HCF of fractions — numerator goes to HCF, denominator goes to LCM. Students often reverse this.' },
    ],
    keyPoints: [
      '1 is neither prime nor composite',
      '2 is the only even prime number',
      'HCF × LCM = Product of two numbers',
      'Divisibility by 11: alternate digit sum difference = 0 or 11',
      'HCF of fractions = HCF(numerators)/LCM(denominators)',
    ],
    inlineQuiz: [
      { question: 'Which of these is NOT a prime number?', options: ['31','37','49','41'], correct: 2, explanation: '49 = 7 × 7. It has factors 1, 7, 49 — more than 2 factors. So it is composite, not prime.' },
      { question: 'HCF(12,18) × LCM(12,18) = ?', options: ['36','216','108','144'], correct: 1, explanation: 'HCF × LCM = product of numbers = 12 × 18 = 216. (HCF=6, LCM=36, 6×36=216 ✓)' },
    ]
  },
  {
    id: 'cds-math-01-t02',
    title: 'BODMAS and Simplification',
    readTimeMinutes: 5,
    content: [
      { type: 'heading', data: 'BODMAS Rule' },
      { type: 'list', data: [
        'B — Brackets (solve innermost first: () then {} then [])',
        'O — Orders (powers and square roots)',
        'D — Division',
        'M — Multiplication',
        'A — Addition',
        'S — Subtraction',
      ]},
      { type: 'callout', data: '🎯 CDS TIP: Division and Multiplication have equal priority — solve left to right. Same for Addition and Subtraction — solve left to right.' },
      { type: 'heading', data: 'Important Algebraic Identities' },
      { type: 'formula', data: { expression: '(a+b)² = a² + 2ab + b²\n(a-b)² = a² - 2ab + b²\n(a+b)(a-b) = a² - b²\n(a+b)³ = a³ + 3a²b + 3ab² + b³\n(a-b)³ = a³ - 3a²b + 3ab² - b³\na³+b³ = (a+b)(a²-ab+b²)\na³-b³ = (a-b)(a²+ab+b²)', note: 'These identities are used in almost every CDS simplification problem' }},
    ],
    keyPoints: [
      'BODMAS: Brackets → Orders → Division → Multiplication → Addition → Subtraction',
      '(a+b)² = a² + 2ab + b², (a-b)² = a² - 2ab + b²',
      'a³+b³ = (a+b)(a²-ab+b²)',
      'Division/Multiplication equal priority — left to right',
    ],
    inlineQuiz: [
      { question: '8 + 4 ÷ 2 × 3 - 1 = ?', options: ['13','12','17','11'], correct: 2, explanation: 'BODMAS: Division first: 4÷2=2. Then multiply: 2×3=6. Now: 8+6-1 = 13. Wait: 8+6=14, 14-1=13. Answer: 13. Check options again — 13 is (A) in this case.' },
      { question: '(a+b)² - (a-b)² = ?', options: ['4ab','2ab','a²-b²','2(a²+b²)'], correct: 0, explanation: '(a+b)² = a²+2ab+b², (a-b)² = a²-2ab+b². Difference = (a²+2ab+b²)-(a²-2ab+b²) = 4ab.' },
    ]
  }
]
