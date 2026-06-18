export interface TableData {
  headers: string[]
  rows: string[][]
}

export interface FormulaData {
  expression: string
  note?: string
}

export interface ContentBlock {
  type: 'text' | 'heading' | 'table' | 'list' | 'callout' | 'formula' | 'inlineQuiz' | string
  data?: string | string[] | TableData | FormulaData | InlineQuiz | Record<string, unknown>
  question?: string
  options?: string[]
  correct?: number
  explanation?: string
}

export interface InlineQuiz {
  question: string
  options: [string, string, string, string]
  correct: number
  explanation: string
}

export interface TopicContent {
  id: string
  title: string
  readTimeMinutes: number
  content: ContentBlock[]
  keyPoints: string[]      // 5-7 bullet takeaways
  inlineQuiz: InlineQuiz[] // 2 questions mid-content
}
