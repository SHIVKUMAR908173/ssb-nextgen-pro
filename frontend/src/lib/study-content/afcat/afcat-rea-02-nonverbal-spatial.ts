import { TopicContent } from '../types'

export const AFCAT_NONVERBAL_TOPICS: TopicContent[] = [
  {
    id: 'afcat-rea-02-t01',
    title: 'Figure Series and Pattern Recognition',
    readTimeMinutes: 6,
    content: [
      { type: 'text', data: 'Non-verbal reasoning tests your ability to recognize patterns in figures without relying on language. This is important for pilot aptitude — spatial reasoning is critical for flying.' },
      { type: 'heading', data: 'Common Pattern Types in AFCAT' },
      { type: 'list', data: [
        'Rotation: Figures rotate 45°, 90°, 180° clockwise/anticlockwise',
        'Size change: Shape grows or shrinks progressively',
        'Addition/subtraction: Elements added or removed each step',
        'Shading pattern: Shading shifts position or increases',
        'Number pattern: Count of elements follows arithmetic sequence',
        'Reflection: Mirror image of previous figure',
        'Combination: Two or more patterns operate simultaneously',
      ]},
      { type: 'heading', data: 'Strategy for Figure Series' },
      { type: 'list', data: [
        'STEP 1: Look at overall shape — does it rotate, grow, or stay same shape?',
        'STEP 2: Count elements — do they increase or decrease?',
        'STEP 3: Check shading — does shading move position?',
        'STEP 4: Look at inner elements separately from outer elements',
        'STEP 5: If stuck, eliminate wrong options first',
      ]},
      { type: 'callout', data: '🎯 AFCAT PILOT TIP: Spatial reasoning questions are weighted more heavily for flying branch. Practice mirror images and 3D rotation mentally. These test the same skills as instrument reading in cockpit.' },
      { type: 'heading', data: 'Mirror Image Rules' },
      { type: 'list', data: [
        'Vertical mirror (left-right flip): Left becomes right, right becomes left',
        'Horizontal mirror (up-down flip): Top becomes bottom',
        'Alphabets with vertical symmetry: A,H,I,M,O,T,U,V,W,X,Y',
        'Alphabets with horizontal symmetry: B,C,D,E,H,I,K,O,X',
        'Numbers: 0,1,8 look same in vertical mirror',
        'Clock time mirror: If time is H:MM, mirror time = 11:60 - H:MM',
      ]},
    ],
    keyPoints: [
      'Check rotation, size, shading, element count separately',
      'Mirror image: left-right reversal for vertical mirror',
      'Clock mirror formula: 11:60 minus original time',
      'Elimination strategy works well for non-verbal questions',
      'Pilot aptitude weighs spatial reasoning more heavily',
    ],
    inlineQuiz: [
      { question: 'If a clock shows 3:45, its mirror image shows:', options: ['8:15','9:15','8:45','9:45'], correct: 0, explanation: 'Mirror time = 11:60 - 3:45 = 8:15. (11-3=8 hours, 60-45=15 minutes).' },
      { question: 'Which letter looks the same when reflected vertically (left-right)?', options: ['R','F','A','L'], correct: 2, explanation: 'A has vertical symmetry — left half mirrors right half. R, F, L are all asymmetric vertically.' },
    ]
  }
]
