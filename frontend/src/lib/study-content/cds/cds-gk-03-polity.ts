import { TopicContent } from '../types'

export const CDS_POLITY_TOPICS: TopicContent[] = [
  {
    id: 'cds-gk-03-t01',
    title: 'Indian Constitution — Key Features and Facts',
    readTimeMinutes: 6,
    content: [
      { type: 'heading', data: 'Constitutional Facts' },
      { type: 'table', data: {
        headers: ['Feature', 'Detail'],
        rows: [
          ['Adopted', '26 November 1949'],
          ['Enacted', '26 January 1950 (Republic Day)'],
          ['Drafting Committee Chairman', 'Dr. B.R. Ambedkar'],
          ['Constituent Assembly Chairman', 'Dr. Rajendra Prasad'],
          ['Original Articles', '395 Articles, 8 Schedules, 22 Parts'],
          ['Current Articles', '448 Articles, 12 Schedules, 25 Parts'],
          ['Longest Constitution', 'World\'s longest written constitution'],
          ['Borrowed from', 'Multiple constitutions (see below)'],
        ]
      }},
      { type: 'heading', data: 'Sources of Indian Constitution' },
      { type: 'table', data: {
        headers: ['Country', 'Feature Borrowed'],
        rows: [
          ['UK (Britain)', 'Parliamentary system, Rule of Law, Bicameral legislature, Writs'],
          ['USA', 'Fundamental Rights, Judicial Review, Independence of Judiciary, Preamble'],
          ['Ireland', 'Directive Principles of State Policy (DPSP), Nominations to Rajya Sabha'],
          ['Canada', 'Federal system with strong centre, Residuary powers with centre'],
          ['Australia', 'Concurrent List, Joint sitting of Parliament'],
          ['Soviet Union (USSR)', 'Fundamental Duties, Socialist ideals'],
          ['South Africa', 'Amendment procedure (Article 368)'],
          ['Germany (Weimar)', 'Suspension of Fundamental Rights during Emergency'],
          ['France', 'Ideals of Liberty, Equality, Fraternity (Preamble)'],
          ['Japan', 'Procedure Established by Law'],
        ]
      }},
      { type: 'callout', data: '🎯 CDS TOP QUESTION: DPSP borrowed from Ireland. Fundamental Rights from USA. Parliamentary system from UK. These three combinations appear in almost every CDS paper.' },
      { type: 'heading', data: 'Preamble — Key Words' },
      { type: 'text', data: 'We, the people of India, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all citizens: JUSTICE (Social, Economic, Political), LIBERTY (Thought, Expression, Belief, Faith, Worship), EQUALITY (Status and Opportunity), FRATERNITY (dignity + unity).' },
      { type: 'callout', data: '⚠️ NOTE: "Socialist" and "Secular" were added by 42nd Constitutional Amendment, 1976 (during Emergency). Original Preamble did not have these words.' },
    ],
    keyPoints: [
      'Constitution adopted 26 Nov 1949, enacted 26 Jan 1950',
      'B.R. Ambedkar — Drafting Committee Chairman',
      'DPSP from Ireland, Fundamental Rights from USA, Parliamentary system from UK',
      '"Socialist" and "Secular" added in 1976 by 42nd Amendment',
      'World\'s longest written constitution',
    ],
    inlineQuiz: [
      { question: 'Directive Principles of State Policy in Indian Constitution are borrowed from:', options: ['USA','UK','Ireland','Australia'], correct: 2, explanation: 'DPSP is borrowed from the Constitution of Ireland (Article 36-51 of Indian Constitution). Ireland had similar social directive principles.' },
      { question: 'When was the Indian Constitution adopted by the Constituent Assembly?', options: ['26 Jan 1950','15 Aug 1947','26 Nov 1949','26 Jan 1949'], correct: 2, explanation: 'Adopted on 26 November 1949 (Constitution Day). Came into force on 26 January 1950 (Republic Day).' },
    ]
  }
]
