'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Timer, BookOpen, Play, Target, ShieldAlert, ArrowLeft, Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'

const TOTAL_SETS = 96
const QUESTIONS_PER_SET = 40

export default function OirHub() {
  const [selectedSet, setSelectedSet] = useState<number | null>(null)
  const [mode, setMode] = useState<'practice' | 'test' | null>(null)
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleStart = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/oir-questions?count=${QUESTIONS_PER_SET}&set=${selectedSet || 1}`)
      const data = await res.json()
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions)
        setCurrentQuestionIndex(0)
        setStarted(true)
        if (mode === 'test') {
            setTimeLeft(30)
        }
      } else {
          alert('Failed to load questions.')
      }
    } catch (err) {
      console.error(err)
      alert('Error fetching questions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      if (started && mode === 'test' && timeLeft > 0) {
          timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
      } else if (timeLeft === 0 && started && mode === 'test') {
          handleNextQuestion()
      }
      return () => {
          if (timerRef.current) clearTimeout(timerRef.current)
      }
  }, [timeLeft, started, mode])

  const handleNextQuestion = () => {
      if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          if (mode === 'test') setTimeLeft(30)
      } else {
          // Finished
          alert('OIR Set Completed!')
          setStarted(false)
      }
  }

  const currentQ = questions[currentQuestionIndex]

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/vacha"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intelligence Matrix Active</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] rounded-[48px] p-12 overflow-hidden border border-white/5 relative shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                 <ShieldAlert className="w-3 h-3 text-red-500" />
                 <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">OIR Intelligence Bank</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white leading-tight uppercase tracking-tighter">
                 Officer <span className="text-red-600">Rating</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-bold">
                 Access 96 sets of Verbal and Non-Verbal reasoning tests. Master the screening stage with officer-grade logic.
              </p>
           </div>
           <div className="bg-[#162840] border border-white/5 rounded-[32px] p-8 text-center min-w-[240px] shadow-2xl">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Total Intelligence Points</p>
              <p className="text-5xl font-black text-white uppercase tracking-tight">3840</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-4">Scenarios Indexed</p>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Set List */}
         <div className="lg:col-span-4 bg-[#162840] rounded-[48px] p-10 border border-[#1E3A5F] shadow-2xl flex flex-col h-[700px]">
            <div className="flex items-center gap-3 mb-8">
               <Brain className="w-6 h-6 text-red-500" />
               <h2 className="text-2xl font-black text-white uppercase tracking-tight">Archive Sets</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar">
               {Array.from({ length: TOTAL_SETS }).map((_, i) => {
                  const id = i + 1
                  const isActive = selectedSet === id
                  return (
                    <button
                      key={id}
                      onClick={() => !started && setSelectedSet(id)}
                      disabled={started}
                      className={`w-full p-6 rounded-3xl border transition-all text-left flex flex-col gap-2 ${
                        isActive ? 'bg-red-600 border-red-500 shadow-xl shadow-red-600/20' : 'bg-[#0f172a] border-white/5 hover:border-white/10'
                      } ${started ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                         <span className={`text-sm font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-white/70'}`}>SET #{String(id).padStart(2, '0')}</span>
                         {isActive && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                      </div>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-white/60' : 'text-slate-500'}`}>
                        {QUESTIONS_PER_SET} Questions • Logic Engine {id % 2 === 0 ? 'V' : 'NV'}
                      </p>
                    </button>
                  )
               })}
            </div>
         </div>

         {/* Interaction Area */}
         <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
               {!started ? (
                 <motion.div 
                   key="intro"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 1.05 }}
                   className="bg-[#162840] rounded-[48px] p-12 border border-[#1E3A5F] shadow-2xl h-full flex flex-col items-center justify-center text-center space-y-12"
                 >
                    {!selectedSet ? (
                      <>
                        <div className="w-32 h-32 bg-[#0f172a] rounded-full flex items-center justify-center text-slate-700 border border-white/5 shadow-2xl">
                           <Target className="w-12 h-12" />
                        </div>
                        <div className="space-y-4">
                           <h2 className="text-4xl font-black text-white uppercase tracking-tight">Intelligence Awaiting</h2>
                           <p className="text-slate-500 font-bold max-w-sm uppercase tracking-wider text-xs leading-relaxed">
                              Select a classified OIR set from the archives to initiate the evaluation sequence.
                           </p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full max-w-lg space-y-10">
                        <div className="space-y-4">
                           <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Target: Set #{selectedSet}</p>
                           <h2 className="text-5xl font-black text-white uppercase tracking-tight">Select Protocol</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                           <button 
                             onClick={() => setMode('practice')}
                             className={`p-8 rounded-[32px] border-2 transition-all flex items-start gap-6 text-left ${
                               mode === 'practice' ? 'bg-red-600/10 border-red-600' : 'bg-[#0f172a] border-white/5 hover:border-white/10'
                             }`}
                           >
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${mode === 'practice' ? 'bg-red-600 text-white shadow-xl' : 'bg-[#162840] text-slate-500'}`}>
                                 <BookOpen className="w-7 h-7" />
                              </div>
                              <div>
                                 <h3 className="text-xl font-black text-white uppercase tracking-tight">Practice Intel</h3>
                                 <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-widest mt-1">No timer. Real-time logic feedback.</p>
                              </div>
                           </button>

                           <button 
                             onClick={() => setMode('test')}
                             className={`p-8 rounded-[32px] border-2 transition-all flex items-start gap-6 text-left ${
                               mode === 'test' ? 'bg-red-600/10 border-red-600 shadow-2xl' : 'bg-[#0f172a] border-white/5 hover:border-white/10'
                             }`}
                           >
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${mode === 'test' ? 'bg-red-600 text-white shadow-xl' : 'bg-[#162840] text-slate-500'}`}>
                                 <Timer className="w-7 h-7" />
                              </div>
                              <div>
                                 <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Combat</h3>
                                 <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-widest mt-1">Strict 30s timer. Simulated screening pressure.</p>
                              </div>
                           </button>
                        </div>

                        <button 
                           disabled={!mode || loading}
                           onClick={handleStart}
                           className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 shadow-2xl shadow-red-600/20 transition-all disabled:opacity-20 active:scale-95"
                        >
                           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                           {loading ? 'Initializing...' : 'Execute Session'}
                        </button>
                      </div>
                    )}
                 </motion.div>
               ) : (
                 <motion.div 
                   key="test"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="bg-[#162840] rounded-[48px] p-12 border border-[#1E3A5F] shadow-2xl h-full flex flex-col"
                 >
                    <div className="flex items-center justify-between mb-12">
                       <div className="flex items-center gap-4">
                          <div className="bg-[#0f172a] px-5 py-3 rounded-2xl border border-white/5">
                             <span className="text-xl font-black text-white tabular-nums">{currentQuestionIndex + 1}/{questions.length}</span>
                          </div>
                          <div className="h-1.5 w-48 bg-[#0f172a] rounded-full overflow-hidden">
                             <div className="h-full bg-red-600 transition-all" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                          </div>
                       </div>
                       {mode === 'test' && (
                          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xl border shadow-xl ${timeLeft <= 5 ? 'bg-red-600/20 text-red-500 border-red-500/50 animate-pulse' : 'bg-red-600/10 text-red-500 border-red-600/20'}`}>
                             <Timer className="w-6 h-6" />
                             <span className="tabular-nums">00:{String(timeLeft).padStart(2, '0')}</span>
                          </div>
                       )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-12">
                       <div className="space-y-4">
                          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Logic Scenario {String(currentQuestionIndex + 1).padStart(2, '0')}</span>
                          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                             {currentQ?.questionText}
                          </h2>
                          {currentQ?.imageUrl && (
                              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 flex justify-center">
                                  <img src={currentQ.imageUrl} alt="OIR Figure" className="max-h-64 object-contain" />
                              </div>
                          )}
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentQ?.options?.map((opt: string, i: number) => (
                             <button 
                                key={i}
                                onClick={handleNextQuestion}
                                className="p-8 bg-[#0f172a] hover:bg-red-600/10 border border-white/5 hover:border-red-600/30 rounded-[32px] text-left group transition-all shadow-xl"
                             >
                                <span className="text-red-600 mr-4 font-mono font-black group-hover:text-red-500 transition-colors">{String.fromCharCode(65 + i)}/</span>
                                <span className="text-xl font-black text-white uppercase">{opt}</span>
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/5">
                       <button onClick={() => setStarted(false)} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-red-500 transition-colors">
                          Abort Session
                       </button>
                       <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-red-500" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logic Synapse: {currentQ?.category || 'MIXED'}</span>
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>

    </div>
  )
}
