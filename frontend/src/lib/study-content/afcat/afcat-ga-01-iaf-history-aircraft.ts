import { TopicContent } from '../types'

export const AFCAT_IAF_TOPICS: TopicContent[] = [
  {
    id: 'afcat-ga-01-t01',
    title: 'IAF — History and Formation',
    readTimeMinutes: 5,
    content: [
      { type: 'heading', data: 'IAF Key Facts' },
      { type: 'table', data: {
        headers: ['Parameter', 'Detail'],
        rows: [
          ['Founded', '8 October 1932 (as Royal Indian Air Force)'],
          ['Renamed IAF', '1950 (after Republic)'],
          ['Motto', '"Nabah Sparsham Deeptam" (Touch the Sky with Glory) — from Bhagavad Gita'],
          ['Chief', 'Air Chief Marshal (4 stars)'],
          ['Highest Rank (wartime)', 'Marshal of the Air Force (5 stars) — only Sam Manekshaw equivalent'],
          ['HQ', 'Vayu Bhawan, New Delhi'],
          ['Air Command HQ', 'Western (Delhi), Eastern (Shillong), Southern (Thiruvananthapuram), Central (Allahabad), South-Western (Gandhinagar), Training (Bengaluru), Maintenance (Nagpur)'],
          ['Current Strength', '~1.7 lakh personnel, ~1800 aircraft'],
        ]
      }},
      { type: 'heading', data: 'IAF Aircraft — Current Fleet' },
      { type: 'table', data: {
        headers: ['Aircraft', 'Type', 'Origin', 'Role'],
        rows: [
          ['Rafale', 'Fighter', 'France (Dassault)', 'Multirole — air superiority, strike. 36 inducted from 2020'],
          ['Su-30 MKI', 'Fighter', 'Russia (modified India)', 'Air superiority, multirole. Backbone of IAF. ~260 in service'],
          ['MiG-21', 'Fighter', 'Russia', 'Being phased out — last few squadrons remaining'],
          ['Mirage 2000', 'Fighter', 'France', 'Precision strike. Used in Kargil, Balakot'],
          ['Jaguar', 'Strike', 'UK-France (SEPECAT)', 'Ground attack, maritime strike'],
          ['Tejas Mk1A', 'LCA', 'India (HAL)', 'Light Combat Aircraft — indigenous. Orders for 83 Mk1A'],
          ['C-130J Super Hercules', 'Transport', 'USA (Lockheed)', 'Special ops transport'],
          ['C-17 Globemaster III', 'Transport', 'USA (Boeing)', 'Strategic heavy lift'],
          ['IL-76', 'Transport', 'Russia', 'Heavy strategic transport'],
          ['Apache AH-64E', 'Attack Helicopter', 'USA (Boeing)', 'Anti-tank, close air support'],
          ['Chinook CH-47F', 'Transport Helicopter', 'USA (Boeing)', 'Heavy lift in high altitude'],
        ]
      }},
      { type: 'callout', data: '🎯 AFCAT KEY: Rafale = France = 36 aircraft = inducted 2020 onwards. Tejas = India = HAL = first indigenous fighter. Su-30 MKI = most numerous fighter. These three aircraft asked most in AFCAT.' },
      { type: 'heading', data: 'IAF Missiles' },
      { type: 'table', data: {
        headers: ['Missile', 'Type', 'Range', 'Note'],
        rows: [
          ['BrahMos', 'Cruise', '290-800 km', 'Air-launched version on Su-30 MKI. Russia-India joint. Supersonic.'],
          ['Astra Mk1', 'AAM BVR', '70-110 km', 'India\'s first BVR air-to-air missile. DRDO made.'],
          ['METEOR', 'AAM BVR', '100+ km', 'On Rafale. Most advanced BVR missile in IAF'],
          ['SCALP/Storm Shadow', 'Cruise', '300+ km', 'Long range air-launched cruise missile on Rafale'],
          ['Python-5', 'AAM WVR', 'Short range', 'Israeli. On Tejas, MiG-21'],
        ]
      }},
    ],
    keyPoints: [
      'IAF founded 8 October 1932. Motto: Touch the Sky with Glory',
      'Rafale (France) — 36 aircraft inducted from 2020',
      'Su-30 MKI — backbone of IAF, ~260 aircraft',
      'Tejas Mk1A — indigenous LCA by HAL — 83 ordered',
      'BrahMos air-launched — on Su-30 MKI — supersonic cruise missile',
    ],
    inlineQuiz: [
      { question: 'IAF\'s motto "Nabah Sparsham Deeptam" is taken from:', options: ['Ramayana','Bhagavad Gita','Arthashastra','Mahabharata'], correct: 1, explanation: '"Touch the Sky with Glory" is from the Bhagavad Gita, Chapter 11, Verse 24.' },
      { question: 'Which is India\'s indigenous Light Combat Aircraft?', options: ['Su-30 MKI','Rafale','Tejas','Jaguar'], correct: 2, explanation: 'Tejas (HAL LCA) is India\'s indigenously designed and produced light combat aircraft. Developed by HAL with DRDO.' },
    ]
  }
]
