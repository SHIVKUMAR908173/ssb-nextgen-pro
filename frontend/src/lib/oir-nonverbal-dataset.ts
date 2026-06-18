export const OIR_NONVERBAL_SETS = {
  sets: Array.from({ length: 60 }).map((_, i) => ({
    setId: i + 1,
    questions: [
      {
        id: `nv-${i}-1`,
        type: 'figure-series',
        questionText: 'Which figure comes next in the series?',
        // A crystal clear SVG showing a sequence of 3 geometric shapes
        figuresSVG: `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(20, 20)">
            <rect width="60" height="60" fill="none" stroke="#e2e8f0" stroke-width="2"/>
            <circle cx="30" cy="30" r="${10 + (i % 3) * 5}" fill="#3b82f6"/>
          </g>
          <g transform="translate(120, 20)">
            <rect width="60" height="60" fill="none" stroke="#e2e8f0" stroke-width="2"/>
            <circle cx="30" cy="30" r="${15 + (i % 3) * 5}" fill="#3b82f6"/>
          </g>
          <g transform="translate(220, 20)">
            <rect width="60" height="60" fill="none" stroke="#e2e8f0" stroke-width="2"/>
            <circle cx="30" cy="30" r="${20 + (i % 3) * 5}" fill="#3b82f6"/>
          </g>
          <g transform="translate(320, 20)">
            <rect width="60" height="60" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4,4"/>
            <text x="30" y="35" text-anchor="middle" fill="#3b82f6" font-size="24">?</text>
          </g>
        </svg>`,
        options: [
          `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="${25 + (i % 3) * 5}" fill="#3b82f6"/></svg>`,
          `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="${10 + (i % 3) * 5}" fill="#ef4444"/></svg>`,
          `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="15" width="30" height="30" fill="#3b82f6"/></svg>`,
          `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><polygon points="30,10 50,50 10,50" fill="#3b82f6"/></svg>`
        ],
        correctAnswerIndex: 0,
        explanation: 'The circle radius increases sequentially.'
      },
      {
        id: `nv-${i}-2`,
        type: 'odd-one-out',
        questionText: 'Find the odd figure out.',
        options: [
          `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="40" height="40" fill="none" stroke="#e2e8f0" stroke-width="4"/><line x1="20" y1="20" x2="60" y2="60" stroke="#e2e8f0" stroke-width="2"/></svg>`,
          `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="40" height="40" fill="none" stroke="#e2e8f0" stroke-width="4"/><line x1="60" y1="20" x2="20" y2="60" stroke="#e2e8f0" stroke-width="2"/></svg>`,
          `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="20" fill="none" stroke="#e2e8f0" stroke-width="4"/><line x1="26" y1="26" x2="54" y2="54" stroke="#e2e8f0" stroke-width="2"/></svg>`,
          `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="40" height="40" fill="none" stroke="#e2e8f0" stroke-width="4"/><circle cx="40" cy="40" r="10" fill="#e2e8f0"/></svg>`
        ],
        correctAnswerIndex: 3,
        explanation: 'All other figures contain a diagonal line, but option D contains a solid circle inside.'
      }
    ]
  }))
};
