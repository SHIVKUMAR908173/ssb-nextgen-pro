import { TopicContent } from '../../types'

export const NDA_MATH_01_TOPICS: TopicContent[] = [
  {
    id: 'nda-math-01-t01',
    title: 'Sets — Definition, Types and Notation',
    readTimeMinutes: 6,
    content: [
      { type: 'text', data: 'A set is a well-defined collection of distinct objects called elements. Sets are denoted by capital letters (A, B, C) and elements by small letters (a, b, c). If element a belongs to set A, we write a ∈ A.' },
      { type: 'heading', data: 'Types of Sets' },
      { type: 'list', data: [
        'Empty Set (Null Set) φ: No elements. Example: {x : x is a natural number < 1}',
        'Singleton Set: Exactly one element. Example: {5}',
        'Finite Set: Countable elements. Example: {1, 2, 3, 4, 5}',
        'Infinite Set: Uncountable elements. Example: Set of all natural numbers',
        'Universal Set (U): Contains all sets under consideration',
        'Power Set P(A): Collection of all subsets of A. If |A| = n, then |P(A)| = 2ⁿ',
        'Equal Sets: A = B if every element of A is in B and vice versa',
        'Equivalent Sets: Same number of elements (same cardinality)',
      ]},
      { type: 'callout', data: '🎯 NDA KEY FACT: If A has n elements, the number of subsets = 2ⁿ and number of proper subsets = 2ⁿ - 1. This is a very frequent NDA question type.' },
      { type: 'heading', data: 'Set Operations' },
      { type: 'table', data: {
        headers: ['Operation', 'Symbol', 'Definition', 'Example (A={1,2,3}, B={2,3,4})'],
        rows: [
          ['Union', 'A ∪ B', 'All elements in A or B or both', '{1,2,3,4}'],
          ['Intersection', 'A ∩ B', 'Elements common to both A and B', '{2,3}'],
          ['Difference', 'A - B', 'Elements in A but not in B', '{1}'],
          ['Complement', "A'", 'Elements in U but not in A', 'U - A'],
          ['Symmetric Diff', 'A △ B', '(A-B) ∪ (B-A)', '{1,4}'],
        ]
      }},
      { type: 'heading', data: 'De Morgan\'s Laws' },
      { type: 'formula', data: { expression: "(A ∪ B)' = A' ∩ B'   AND   (A ∩ B)' = A' ∪ B'", note: "De Morgan's Laws — very frequently tested in NDA" }},
      { type: 'heading', data: 'Cardinality Formulas' },
      { type: 'formula', data: { expression: "|A ∪ B| = |A| + |B| - |A ∩ B|\n|A ∪ B ∪ C| = |A| + |B| + |C| - |A∩B| - |B∩C| - |A∩C| + |A∩B∩C|", note: "Inclusion-Exclusion Principle" }},
      { type: 'callout', data: '⚠️ COMMON MISTAKE: Students confuse A-B with B-A. A-B means elements IN A but NOT in B. Always draw Venn diagrams for word problems.' },
    ],
    keyPoints: [
      'Power set of n elements = 2ⁿ subsets',
      'De Morgan\'s Laws: complement of union = intersection of complements',
      '|A ∪ B| = |A| + |B| - |A ∩ B| (Inclusion-Exclusion)',
      'Empty set φ is a subset of every set',
      'A set is always a subset of itself: A ⊆ A',
    ],
    inlineQuiz: [
      { question: 'If A = {1,2,3,4} and B = {3,4,5,6}, what is |A ∪ B|?', options: ['6','8','4','5'], correct: 0, explanation: 'A ∪ B = {1,2,3,4,5,6} so |A ∪ B| = 6. Formula: 4+4-2 = 6 (|A∩B| = {3,4} = 2)' },
      { question: 'How many subsets does a set with 4 elements have?', options: ['8','12','16','4'], correct: 2, explanation: 'Number of subsets = 2ⁿ = 2⁴ = 16' },
    ]
  },
  {
    id: 'nda-math-01-t02',
    title: 'Relations — Types and Properties',
    readTimeMinutes: 7,
    content: [
      { type: 'text', data: 'A relation R from set A to set B is a subset of the Cartesian product A × B. If (a,b) ∈ R, we write aRb and say "a is related to b".' },
      { type: 'heading', data: 'Cartesian Product' },
      { type: 'text', data: 'A × B = {(a,b) : a ∈ A, b ∈ B}. If |A| = m and |B| = n, then |A × B| = mn. Total number of relations from A to B = 2^(mn).' },
      { type: 'heading', data: 'Types of Relations' },
      { type: 'table', data: {
        headers: ['Type', 'Definition', 'Example'],
        rows: [
          ['Reflexive', 'aRa for all a ∈ A', '"is equal to" — every number equals itself'],
          ['Symmetric', 'aRb ⟹ bRa', '"is sibling of" — if A is sibling of B, B is sibling of A'],
          ['Transitive', 'aRb and bRc ⟹ aRc', '"is less than" — if a<b and b<c then a<c'],
          ['Equivalence', 'Reflexive + Symmetric + Transitive', '"is congruent to" in geometry'],
          ['Anti-symmetric', 'aRb and bRa ⟹ a=b', '"is divisor of"'],
        ]
      }},
      { type: 'callout', data: '🎯 NDA TRICK: To check if a relation is equivalence, verify ALL THREE: reflexive AND symmetric AND transitive. Missing any one = not equivalence.' },
      { type: 'heading', data: 'Domain, Codomain, Range' },
      { type: 'list', data: [
        'Domain: Set of all first elements (inputs)',
        'Codomain: The set B (all possible outputs declared)',
        'Range: Set of actual outputs (Range ⊆ Codomain)',
      ]},
    ],
    keyPoints: [
      'Equivalence relation = Reflexive + Symmetric + Transitive',
      '|A × B| = |A| × |B|',
      'Range is always a subset of Codomain',
      'Total relations from A(m elements) to B(n elements) = 2^(mn)',
    ],
    inlineQuiz: [
      { question: 'The relation R = {(1,1),(2,2),(3,3)} on set {1,2,3} is:', options: ['Only Reflexive','Equivalence Relation','Only Symmetric','Only Transitive'], correct: 1, explanation: 'It is reflexive (aRa for all a), symmetric (trivially, no cross pairs), and transitive (trivially). So it is an equivalence relation.' },
      { question: 'If |A| = 3 and |B| = 2, how many relations exist from A to B?', options: ['64','32','16','6'], correct: 0, explanation: '|A × B| = 3×2 = 6. Number of relations = 2⁶ = 64.' },
    ]
  },
  {
    id: 'nda-math-01-t03',
    title: 'Functions — Types and Properties',
    readTimeMinutes: 8,
    content: [
      { type: 'text', data: 'A function f: A → B is a special relation where every element of A has exactly one image in B. Key: every input has exactly one output.' },
      { type: 'heading', data: 'Types of Functions' },
      { type: 'table', data: {
        headers: ['Type', 'Condition', 'Also Called', 'NDA Frequency'],
        rows: [
          ['One-one (Injective)', 'f(a)=f(b) ⟹ a=b. Different inputs → different outputs', 'Injective', 'HIGH'],
          ['Onto (Surjective)', 'Range = Codomain. Every element of B has a pre-image', 'Surjective', 'HIGH'],
          ['Bijective', 'Both one-one AND onto', 'One-one correspondence', 'VERY HIGH'],
          ['Many-one', 'Two or more inputs can give same output', '-', 'MEDIUM'],
          ['Into', 'Range ⊂ Codomain (Range ≠ Codomain)', '-', 'MEDIUM'],
        ]
      }},
      { type: 'heading', data: 'Composition of Functions' },
      { type: 'formula', data: { expression: '(fog)(x) = f(g(x)) — Apply g first, then f\n(gof)(x) = g(f(x)) — Apply f first, then g', note: 'fog ≠ gof in general' }},
      { type: 'heading', data: 'Inverse Function' },
      { type: 'text', data: 'Inverse function f⁻¹ exists only if f is BIJECTIVE. If f(a) = b, then f⁻¹(b) = a.' },
      { type: 'callout', data: '🎯 NDA KEY: For inverse to exist, function MUST be bijective. Always check both one-one AND onto conditions.' },
      { type: 'heading', data: 'Important Standard Functions' },
      { type: 'table', data: {
        headers: ['Function', 'Formula', 'Domain', 'Range'],
        rows: [
          ['Identity', 'f(x) = x', 'R', 'R'],
          ['Constant', 'f(x) = c', 'R', '{c}'],
          ['Modulus', 'f(x) = |x|', 'R', '[0,∞)'],
          ['Signum', 'f(x) = x/|x| for x≠0, 0 for x=0', 'R', '{-1,0,1}'],
          ['Greatest Integer', 'f(x) = ⌊x⌋', 'R', 'Z (integers)'],
        ]
      }},
    ],
    keyPoints: [
      'Bijective function = one-one + onto (inverse exists only for bijective)',
      'fog means apply g first then f',
      'Identity function: f(x) = x, maps every element to itself',
      'Modulus function range is [0,∞) — never negative',
      'Greatest integer function ⌊3.7⌋ = 3, ⌊-3.2⌋ = -4',
    ],
    inlineQuiz: [
      { question: 'For f: R→R, f(x) = 2x+1. Is f bijective?', options: ['Yes, bijective','Only one-one','Only onto','Neither'], correct: 0, explanation: 'One-one: f(a)=f(b) → 2a+1=2b+1 → a=b ✓. Onto: For any y∈R, x=(y-1)/2 ∈ R ✓. So bijective.' },
      { question: 'If f(x) = x² on R→R, then f is:', options: ['Bijective','One-one but not onto','Onto but not one-one','Neither one-one nor onto'], correct: 3, explanation: 'Not one-one: f(2)=f(-2)=4. Not onto: -1 has no pre-image. So neither.' },
    ]
  }
]
