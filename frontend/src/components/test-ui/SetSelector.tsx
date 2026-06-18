'use client'

import React from 'react'

interface SetSelectorProps {
  totalSets: number
  currentSet: number
  onSelectSet: (setId: number) => void
  completedSets: Set<number>
  module: string
}

export function SetSelector({ totalSets, currentSet, onSelectSet, completedSets, module }: SetSelectorProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 bg-amber-500 rounded-full"/>
        <span className="text-slate-300 text-sm font-mono uppercase tracking-wider">
          Select Set — {module}
        </span>
        <span className="ml-auto text-slate-500 text-xs font-mono">
          {completedSets.size}/{totalSets} completed
        </span>
      </div>
      <div className="grid grid-cols-10 gap-1.5 max-h-40 overflow-y-auto">
        {Array.from({ length: totalSets }, (_, i) => i + 1).map(setNum => (
          <button key={setNum} onClick={() => onSelectSet(setNum)}
            className={`w-8 h-8 rounded text-xs font-mono transition-all
              ${currentSet === setNum ? 'bg-amber-500 text-slate-950 font-bold' :
                completedSets.has(setNum) ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' :
                'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
            {setNum}
          </button>
        ))}
      </div>
      <div className="flex gap-4 mt-3">
        {[['bg-amber-500','Current'],['bg-emerald-900/50 border border-emerald-700','Done'],['bg-slate-800','Pending']].map(([cls,label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${cls}`}/>
            <span className="text-slate-500 text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
