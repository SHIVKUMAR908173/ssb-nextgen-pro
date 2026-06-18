'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Flag, CheckCircle2, ShieldAlert, Loader2, Play, ChevronRight, Target, Zap, Crosshair } from 'lucide-react'
import Link from 'next/link'

type ConferencePhase = 'LOADING' | 'AGGREGATING' | 'RAPID_FIRE' | 'FINAL_VERDICT'

export default function ConferencePage() {
  const [phase, setPhase] = useState<ConferencePhase>('LOADING')
  const [scores, setScores] = useState({
     stage1: 0,
     psych: 0,
     gto: 0,
     interview: 0,
     overall: 0,
     status: 'BORDERLINE' // CLEAR_PASS, BORDERLINE, CLEAR_FAIL
  })
  const [rapidFireQ, setRapidFireQ] = useState(0)
  const [verdict, setVerdict] = useState<any>(null)
  
  const rapidFireQuestions = [
     "Why do you think your Psych scores are inconsistent with your Interview?",
     "Give me one solid reason we should select you over the other candidates.",
     "How would you handle a subordinate who refuses your direct order in a combat zone?"
  ]

  useEffect(() => {
     // Simulate gathering data from localStorage/backend
     const timer = setTimeout(() => {
         const s1 = Math.floor(Math.random() * 40) + 50 // 50-90
         const psych = Math.floor(Math.random() * 50) + 40 // 40-90
         const gto = Math.floor(Math.random() * 40) + 45 // 45-85
         const interview = Math.floor(Math.random() * 45) + 50 // 50-95
         
         const avg = Math.round((s1 + psych + gto + interview) / 4)
         let status = 'BORDERLINE'
         if (avg >= 75) status = 'CLEAR_PASS'
         if (avg < 55) status = 'CLEAR_FAIL'
         
         setScores({ stage1: s1, psych, gto, interview, overall: avg, status })
         setPhase('AGGREGATING')
     }, 2000)
     return () => clearTimeout(timer)
  }, [])

  const startConference = () => {
     if (scores.status === 'BORDERLINE') {
         setPhase('RAPID_FIRE')
     } else {
         generateFinalVerdict()
     }
  }

  const handleRapidFireAnswer = () => {
      if (rapidFireQ < rapidFireQuestions.length - 1) {
          setRapidFireQ(q => q + 1)
      } else {
          generateFinalVerdict()
      }
  }

  const generateFinalVerdict = () => {
      setPhase('LOADING')
      setTimeout(() => {
          setVerdict({
              recommended: scores.overall >= 60,
              chestNumber: Math.floor(Math.random() * 100) + 1,
              feedback: scores.overall >= 60 
                  ? "You demonstrated strong consistency across all tests. Your psych profile matches your interview persona, and your leadership in GTO was proactive."
                  : "We noticed significant inconsistencies between your written psych tests and your personal interview. Your stress response under pressure needs improvement.",
              olqs: [
                 { name: 'Effective Intelligence', score: Math.round(scores.psych / 10) },
                 { name: 'Social Adaptability', score: Math.round(scores.interview / 10) },
                 { name: 'Initiative', score: Math.round(scores.gto / 10) }
              ]
          })
          setPhase('FINAL_VERDICT')
      }, 3000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Base
        </Link>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${phase === 'FINAL_VERDICT' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Board Conference Active</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'LOADING' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
            <Loader2 className="w-20 h-20 text-red-500 animate-spin" />
            <div className="text-center">
              <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">President & Board Assembling</h2>
              <p className="text-slate-400 font-bold max-w-md mx-auto">Compiling Stage 1, Psych, GTO, and Interview dossiers...</p>
            </div>
          </motion.div>
        )}

        {phase === 'AGGREGATING' && (
          <motion.div key="aggregating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
             <div className="bg-[#0f172a] rounded-[48px] p-16 text-center border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <Flag className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">The Final Conference</h1>
                <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">The President, GTO, and Chief Psychologist are reviewing your performance across all 5 days.</p>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                   { label: 'Stage 1 (OIR+PPDT)', score: scores.stage1, color: 'blue' },
                   { label: 'Psychology', score: scores.psych, color: 'purple' },
                   { label: 'GTO Tasks', score: scores.gto, color: 'emerald' },
                   { label: 'Personal Interview', score: scores.interview, color: 'amber' }
                ].map((s, i) => (
                   <div key={i} className="bg-[#162840] rounded-[32px] p-8 border border-white/5 text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{s.label}</p>
                      <p className={`text-5xl font-black tabular-nums text-${s.color}-400`}>{s.score}</p>
                   </div>
                ))}
             </div>

             <div className="flex justify-center">
                <button onClick={startConference} className="bg-red-600 hover:bg-red-500 text-white px-12 py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-sm flex items-center gap-4 transition-all active:scale-95 shadow-2xl shadow-red-600/20">
                   <Play className="w-5 h-5 fill-current" /> Enter Conference Room
                </button>
             </div>
          </motion.div>
        )}

        {phase === 'RAPID_FIRE' && (
          <motion.div key="rapid_fire" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh]">
             <div className="w-full max-w-3xl bg-[#0f172a] rounded-[48px] p-16 border border-red-500/30 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px]"></div>
                <div className="relative z-10 space-y-12">
                    <div className="bg-red-500/10 border border-red-500/20 px-6 py-2 rounded-full inline-flex items-center gap-3">
                       <Crosshair className="w-4 h-4 text-red-500" />
                       <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Borderline Candidate • Rapid Fire Mode</span>
                    </div>
                    
                    <div>
                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-4">Question {rapidFireQ + 1} of {rapidFireQuestions.length}</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                           "{rapidFireQuestions[rapidFireQ]}"
                        </h2>
                    </div>

                    <div className="flex justify-center">
                        <button onClick={handleRapidFireAnswer} className="bg-white text-black px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-slate-200 transition-colors">
                           Submit Verbal Response <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
             </div>
          </motion.div>
        )}

        {phase === 'FINAL_VERDICT' && verdict && (
          <motion.div key="verdict" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
             <div className={`rounded-[64px] p-16 text-center border relative overflow-hidden shadow-2xl ${verdict.recommended ? 'bg-[#0f172a] border-emerald-500/30' : 'bg-[#0f172a] border-slate-700'}`}>
                {verdict.recommended && <div className="absolute inset-0 bg-emerald-500/5 blur-[100px]"></div>}
                <div className="relative z-10 space-y-8">
                    {verdict.recommended ? (
                        <>
                           <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(16,185,129,0.4)]">
                              <span className="text-5xl font-black text-white">+{verdict.chestNumber}</span>
                           </div>
                           <div>
                               <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter">Recommended</h1>
                               <p className="text-emerald-400 font-black uppercase tracking-[0.4em] text-sm mt-4">Welcome to the Academy</p>
                           </div>
                        </>
                    ) : (
                        <>
                           <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-600">
                              <span className="text-3xl font-black text-slate-500">{verdict.chestNumber}</span>
                           </div>
                           <div>
                               <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Not Recommended</h1>
                               <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-sm mt-4">Better Luck Next Time</p>
                           </div>
                        </>
                    )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#162840] rounded-[40px] p-10 border border-[#1E3A5F]">
                   <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-500" /> Board President's Remarks
                   </h3>
                   <p className="text-slate-300 font-medium leading-relaxed text-lg">{verdict.feedback}</p>
                </div>
                <div className="bg-[#162840] rounded-[40px] p-10 border border-[#1E3A5F]">
                   <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                      <Zap className="w-5 h-5 text-amber-500" /> Final OLQ Assessment
                   </h3>
                   <div className="space-y-4">
                      {verdict.olqs.map((olq: any, i: number) => (
                         <div key={i} className="bg-[#0f172a] rounded-2xl p-4 flex items-center justify-between border border-white/5">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{olq.name}</span>
                            <span className={`text-lg font-black ${olq.score >= 7 ? 'text-emerald-400' : 'text-amber-400'}`}>{olq.score}/10</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
