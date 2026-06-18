import React from 'react'
import { ContentBlock, TableData, FormulaData, InlineQuiz } from '@/lib/study-content/types'

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || !Array.isArray(blocks)) return null;
  
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === 'text') return (
          <p key={i} className="text-slate-300 leading-relaxed">{block.data as string}</p>
        )
        if (block.type === 'heading') return (
          <h3 key={i} className="text-amber-400 font-bold text-lg mt-6 mb-2">{block.data as string}</h3>
        )
        if (block.type === 'callout') return (
          <div key={i} className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg p-4 my-4">
            <p className="text-amber-200 text-sm">{block.data as string}</p>
          </div>
        )
        if (block.type === 'formula') {
          const f = block.data as FormulaData
          return (
            <div key={i} className="bg-slate-800 border border-slate-600 rounded-lg p-4 font-mono my-4">
              <pre className="text-emerald-400 text-sm whitespace-pre-wrap">{f.expression}</pre>
              {f.note && <p className="text-slate-500 text-xs mt-2">{f.note}</p>}
            </div>
          )
        }
        if (block.type === 'list') return (
          <ul key={i} className="space-y-2 my-4">
            {(block.data as string[]).map((item, j) => (
              <li key={j} className="flex gap-2 text-slate-300 text-sm">
                <span className="text-amber-500 mt-1 flex-shrink-0">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )
        if (block.type === 'table') {
          const t = block.data as TableData
          return (
            <div key={i} className="overflow-x-auto my-6 border border-slate-700 rounded-xl">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    {t.headers.map((h, j) => (
                      <th key={j} className="border-b border-r last:border-r-0 border-slate-600 px-4 py-3 text-amber-400 text-left font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((row, j) => (
                    <tr key={j} className={j % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800/50'}>
                      {row.map((cell, k) => (
                        <td key={k} className="border-b last:border-b-0 border-r last:border-r-0 border-slate-700 px-4 py-3 text-slate-300">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        if (block.type === 'inlineQuiz') {
          const q = (block.data || block) as InlineQuiz
          return (
            <div key={i} className="bg-slate-800 border border-indigo-500/50 rounded-xl p-6 my-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Concept Check</span>
              </div>
              <p className="text-white font-bold mb-4">{q.question}</p>
              <div className="space-y-2">
                {q.options?.map((opt: string, k: number) => (
                  <div key={k} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-slate-300">
                    <span className="text-slate-500 mr-3 font-mono">{String.fromCharCode(65 + k)}.</span>
                    {opt}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <strong className="text-indigo-400">Answer:</strong> Option {String.fromCharCode(65 + (q.correct ?? 0))} — {q.explanation}
              </div>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
