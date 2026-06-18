import { TopicContent } from '../../types'

export const NDA_HISTORY_MODERN_TOPICS: TopicContent[] = [
  {
    id: 'nda-hist-03-t01',
    title: 'British Conquest of India — Key Events',
    readTimeMinutes: 7,
    content: [
      { type: 'heading', data: 'Chronology of British Expansion' },
      { type: 'table', data: {
        headers: ['Year', 'Event', 'Significance'],
        rows: [
          ['1757', 'Battle of Plassey', 'British defeated Siraj-ud-Daulah. Start of British political power in India'],
          ['1764', 'Battle of Buxar', 'British defeated Mir Qasim, Nawab of Awadh + Mughal Emperor. More decisive than Plassey'],
          ['1765', 'Diwani Rights', 'East India Company got right to collect revenue from Bengal, Bihar, Orissa'],
          ['1773', 'Regulating Act', 'First British Act to regulate EIC affairs. Warren Hastings became first Governor-General'],
          ['1784', 'Pitt\'s India Act', 'Dual control — Board of Control + Court of Directors'],
          ['1857', 'Revolt of 1857', 'First War of Independence. Led to Crown taking over from EIC'],
          ['1858', 'Government of India Act', 'British Crown directly ruled India. Viceroy replaced Governor-General'],
        ]
      }},
      { type: 'callout', data: '🎯 NDA TRICK: Battle of Plassey (1757) = START of British power. Battle of Buxar (1764) = CONSOLIDATION of British power. Buxar more significant — British fought combined force of 3 rulers.' },
      { type: 'heading', data: 'Important Governor Generals / Viceroys' },
      { type: 'table', data: {
        headers: ['Name', 'Period', 'Key Policy/Event'],
        rows: [
          ['Warren Hastings', '1774-1785', 'First Governor-General. Rohilla War, Maratha War, Judicial reforms'],
          ['Lord Cornwallis', '1786-1793', 'Permanent Settlement (1793), Civil Services reform, Cornwallis Code'],
          ['Lord Wellesley', '1798-1805', 'Subsidiary Alliance system. Expanded British territory rapidly'],
          ['Lord Dalhousie', '1848-1856', 'Doctrine of Lapse. Railways, Telegraph, Post. Annexed Punjab, Awadh'],
          ['Lord Canning', '1856-1862', 'First Viceroy after 1857. Universities Act 1857'],
          ['Lord Curzon', '1899-1905', 'Partition of Bengal (1905). Delhi Durbar 1903'],
          ['Lord Mountbatten', '1947', 'Last Viceroy. Oversaw Independence and Partition'],
        ]
      }},
    ],
    keyPoints: [
      '1757 Battle of Plassey — start of British political power',
      '1764 Battle of Buxar — more decisive, British fought 3 rulers',
      'Doctrine of Lapse (Dalhousie) — annexed states with no male heir',
      '1857 Revolt led to Crown taking over from East India Company',
      'Permanent Settlement 1793 — Cornwallis — fixed land revenue with zamindars',
    ],
    inlineQuiz: [
      { question: 'Who introduced the Subsidiary Alliance system?', options: ['Lord Dalhousie','Lord Wellesley','Lord Cornwallis','Warren Hastings'], correct: 1, explanation: 'Lord Wellesley introduced the Subsidiary Alliance system — Indian rulers had to maintain British troops and accept a British Resident at their court.' },
      { question: 'The Doctrine of Lapse was introduced by:', options: ['Lord Canning','Lord Curzon','Lord Dalhousie','Lord Cornwallis'], correct: 2, explanation: 'Lord Dalhousie (1848-1856) introduced Doctrine of Lapse — if an Indian ruler died without a natural heir, the state would lapse to British.' },
    ]
  },
  {
    id: 'nda-hist-03-t02',
    title: 'Indian National Congress — Formation and Early Phase',
    readTimeMinutes: 6,
    content: [
      { type: 'text', data: 'The Indian National Congress (INC) was founded in 1885 by A.O. Hume (a retired British civil servant), with the first session held in Bombay (now Mumbai). W.C. Bonnerjee was the first president.' },
      { type: 'heading', data: 'Phases of INC' },
      { type: 'table', data: {
        headers: ['Phase', 'Period', 'Leaders', 'Key Features'],
        rows: [
          ['Moderate Phase', '1885-1905', 'Dadabhai Naoroji, Gopal Krishna Gokhale, Pherozeshah Mehta', 'Constitutional methods, petitions, prayers. Believed in British fairness. Economic drain theory (Dadabhai Naoroji)'],
          ['Extremist Phase', '1905-1919', 'Bal Gangadhar Tilak, Lala Lajpat Rai, Bipin Chandra Pal (Lal-Bal-Pal)', 'Swaraj as goal. Boycott, Swadeshi, National Education, Passive Resistance. 1907 Surat Split'],
          ['Gandhian Phase', '1919-1947', 'Mahatma Gandhi, Nehru, Patel, Bose', 'Mass movements, non-violence, civil disobedience, non-cooperation'],
        ]
      }},
      { type: 'callout', data: '🎯 NDA KEY: Lal-Bal-Pal = Lala Lajpat Rai (Punjab), Bal Gangadhar Tilak (Maharashtra), Bipin Chandra Pal (Bengal). The three extremist leaders. Surat Split 1907 divided moderates and extremists.' },
      { type: 'heading', data: 'Key Sessions of INC' },
      { type: 'table', data: {
        headers: ['Year', 'Place', 'President', 'Significance'],
        rows: [
          ['1885', 'Bombay', 'W.C. Bonnerjee', 'First session — founding of INC'],
          ['1906', 'Calcutta', 'Dadabhai Naoroji', 'Swaraj declared as goal for first time'],
          ['1907', 'Surat', 'Ras Bihari Ghosh', 'Surat Split — moderates vs extremists'],
          ['1929', 'Lahore', 'Jawaharlal Nehru', 'Poorna Swaraj resolution. 26 Jan declared Independence Day'],
          ['1931', 'Karachi', 'Vallabhbhai Patel', 'Fundamental Rights resolution adopted'],
        ]
      }},
    ],
    keyPoints: [
      'INC founded 1885 by A.O. Hume — first session Bombay, W.C. Bonnerjee president',
      'Lal-Bal-Pal = extremist trio (Lajpat Rai, Tilak, Pal)',
      '1907 Surat Split — moderates vs extremists',
      '1929 Lahore session — Poorna Swaraj resolution by Nehru',
      'Dadabhai Naoroji — "Grand Old Man of India" — Drain of Wealth theory',
    ],
    inlineQuiz: [
      { question: 'Who was the first President of Indian National Congress?', options: ['Dadabhai Naoroji','W.C. Bonnerjee','Gopal Krishna Gokhale','A.O. Hume'], correct: 1, explanation: 'W.C. Bonnerjee (Womesh Chandra Bonnerjee) was the first president. A.O. Hume founded INC but was not its president.' },
      { question: 'At which session was Poorna Swaraj (Complete Independence) declared?', options: ['1927 Madras','1929 Lahore','1931 Karachi','1906 Calcutta'], correct: 1, explanation: '1929 Lahore session under Jawaharlal Nehru passed the Poorna Swaraj resolution. January 26 was declared Independence Day (later became Republic Day in 1950).' },
    ]
  }
]
