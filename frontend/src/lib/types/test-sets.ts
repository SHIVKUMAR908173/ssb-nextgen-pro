export interface TestSet<T> {
  setId: number
  setNumber: number
  difficulty: 'basic' | 'intermediate' | 'advanced'
  items: T[]
}

export interface TATImage {
  imageId: number
  svgElements: string
  sceneDescription: string
  theme: string
  isBlankSlide: boolean
  difficulty: 'basic' | 'moderate' | 'complex'
}
export type TATSet = TestSet<TATImage>

export interface PPDTImage {
  imageId: number
  svgElements: string
  sceneDescription: string
  theme: string
  hazeLevel: number
}
export type PPDTSet = TestSet<PPDTImage>

export interface WATWord {
  wordId: number
  word: string
  category: 'positive_trigger' | 'negative_trigger' | 'neutral' | 'defence'
}
export type WATSet = TestSet<WATWord>

export interface SRTSituation {
  situationId: number
  text: string
  category: 'leadership' | 'ethical' | 'social' | 'operational' | 'personal'
  difficulty: 'basic' | 'moderate' | 'complex'
  olqFocus: string[]
}
export type SRTSet = TestSet<SRTSituation>

export interface GDTopic {
  topicId: string
  title: string
  category: 'defence' | 'international' | 'social' | 'economy' | 'tech' | 'environment' | 'current'
  difficulty: 'basic' | 'intermediate' | 'advanced'
  keyPoints: string[]
  bothSides: { for: string[], against: string[] }
}
export interface GDSet { setId: number; topics: GDTopic[] }

export interface GPEMapElement {
  type: 'village' | 'river' | 'road' | 'bridge' | 'hospital' | 'school' | 'marker' | 'depot'
  x: number; y: number; label: string
  color?: string; damaged?: boolean; path?: string
}
export interface GPEScenario {
  scenarioId: number; title: string; difficulty: string
  situation: string; mapElements: GPEMapElement[]
  availableResources: string[]
  objectives: { label: string; priority: number; distance: string }[]
  timeAvailable: string; evaluationFocus: string[]
}
export interface GPESet { setId: number; scenario: GPEScenario }

export interface OIRVerbalQuestion {
  qId: number
  type: 'analogy' | 'odd_one_out' | 'series_completion' | 'coding_decoding' | 'direction' | 'ranking' | 'blood_relation'
  question: string
  options: [string, string, string, string]
  correctIndex: number; explanation: string
}
export interface OIRNonVerbalQuestion {
  qId: number
  type: 'figure_series' | 'figure_analogy' | 'odd_one_out' | 'pattern_completion' | 'mirror_image'
  question: string
  figuresSVG?: string[]; figureA?: string; figureB?: string; figureC?: string
  matrixSVG?: string; figures?: string[]
  options: string[]; correctIndex: number; explanation: string
}
export interface OIRSet {
  setId: number; book: 'verbal' | 'nonverbal'
  questions: (OIRVerbalQuestion | OIRNonVerbalQuestion)[]
  totalQuestions: number; timeLimit: number
}
