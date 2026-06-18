'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Brain, ShieldAlert, Loader2, Target, Zap, Play, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import TatSimulator from '@/components/tests/TatSimulator'
import WatSimulator from '@/components/tests/WatSimulator'
import SrtSimulator from '@/components/tests/SrtSimulator'
import SdSimulator from '@/components/tests/SdSimulator'

type TestStage = 'intro' | 'tat' | 'wat' | 'srt' | 'sdt' | 'evaluating' | 'results';

export default function FullPsychBatteryPage() {
  const [stage, setStage] = useState<TestStage>('intro');
  
  // Accumulated data
  const [tatData, setTatData] = useState<any>(null);
  const [watData, setWatData] = useState<any>(null);
  const [srtData, setSrtData] = useState<any>(null);
  const [sdtData, setSdtData] = useState<any>(null);

  const [evaluation, setEvaluation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const submitComprehensiveAssessment = async (finalSdtData: any) => {
    setSdtData(finalSdtData);
    setStage('evaluating');
    
    try {
      const payload = {
        tat_responses: tatData,
        wat_responses: watData,
        srt_responses: srtData,
        sdt_responses: finalSdtData
      };

      const res = await fetch('/api/evaluate-comprehensive-psych', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.status === 'success') {
        setEvaluation(data.evaluation);
        setStage('results');
      } else {
        setError(data.error || 'Failed to generate comprehensive dossier.');
        setStage('results');
      }
    } catch (e: any) {
      setError(e.message);
      setStage('results');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/mansa"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Abort Battery
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
             {stage === 'intro' ? 'System Ready' : stage === 'evaluating' ? 'Generating Dossier' : stage === 'results' ? 'Dossier Complete' : 'Active Testing Protocol'}
          </span>
        </div>
      </div>

      {/* Intro Stage */}
      {stage === 'intro' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f172a] rounded-[48px] p-16 relative overflow-hidden border border-purple-500/20 shadow-2xl">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
           
           <div className="max-w-3xl relative z-10 space-y-8">
              <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                 <Brain className="w-3 h-3 text-purple-500" />
                 <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em]">Full Psychological Battery</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                 The 2-Hour <span className="text-purple-500">Pressure Test</span>
              </h1>
              
              <p className="text-xl text-slate-400 font-bold leading-relaxed">
                 You are about to undergo the complete Stage-2 Psychological Assessment back-to-back. 
                 This simulates the exact fatigue, time pressure, and cognitive load of the real SSB.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/5">
                 {[
                   { name: 'TAT', desc: '12 Stories', time: '1 hr' },
                   { name: 'WAT', desc: '60 Words', time: '15 min' },
                   { name: 'SRT', desc: '60 Situations', time: '30 min' },
                   { name: 'SDT', desc: '5 Paragraphs', time: '15 min' },
                 ].map((t, i) => (
                   <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                      <p className="text-2xl font-black text-white">{t.name}</p>
                      <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest my-1">{t.desc}</p>
                      <p className="text-xs font-bold text-slate-500">{t.time}</p>
                   </div>
                 ))}
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
                 <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                 <div>
                    <p className="text-red-400 font-black uppercase tracking-widest text-xs mb-2">Warning: No Pausing</p>
                    <p className="text-slate-400 text-sm font-bold">Once initiated, you cannot pause the test. If you leave the page, your progress will be lost. Ensure you have 2 hours of uninterrupted time.</p>
                 </div>
              </div>

              <button 
                 onClick={() => setStage('tat')}
                 className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center gap-4 transition-all active:scale-95 shadow-xl shadow-purple-600/20"
              >
                 <Play className="w-5 h-5" />
                 Initiate Full Battery
              </button>
           </div>
        </motion.div>
      )}

      {/* Active Test Stage - Progress Bar */}
      {['tat', 'wat', 'srt', 'sdt'].includes(stage) && (
        <div className="flex items-center gap-2 mb-6">
           {['tat', 'wat', 'srt', 'sdt'].map((s, i) => {
              const stages = ['tat', 'wat', 'srt', 'sdt'];
              const currentIndex = stages.indexOf(stage);
              const isActive = i === currentIndex;
              const isPast = i < currentIndex;
              
              return (
                 <div key={s} className="flex-1">
                    <div className={`h-2 rounded-full mb-2 ${isActive ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : isPast ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                    <p className={`text-[9px] font-black uppercase tracking-widest text-center ${isActive ? 'text-purple-400' : isPast ? 'text-emerald-500' : 'text-slate-600'}`}>
                       {s}
                    </p>
                 </div>
              )
           })}
        </div>
      )}

      {/* Simulator Mounts */}
      <div className="bg-[#0f172a] rounded-[48px] p-8 shadow-2xl border border-white/5">
        {stage === 'tat' && <TatSimulator isFullBattery onComplete={(data) => { setTatData(data); setStage('wat'); }} />}
        {stage === 'wat' && <WatSimulator isFullBattery onComplete={(data) => { setWatData(data); setStage('srt'); }} />}
        {stage === 'srt' && <SrtSimulator isFullBattery onComplete={(data) => { setSrtData(data); setStage('sdt'); }} />}
        {stage === 'sdt' && <SdSimulator isFullBattery onComplete={submitComprehensiveAssessment} />}
      </div>

      {/* Evaluating Stage */}
      {stage === 'evaluating' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
           <Loader2 className="w-20 h-20 text-purple-500 animate-spin" />
           <div className="text-center">
              <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Synthesizing Dossier</h2>
              <p className="text-slate-400 font-bold max-w-md mx-auto">The AI Chief Psychologist is cross-referencing your TAT, WAT, SRT, and SDT to generate a cohesive psychological profile.</p>
           </div>
        </div>
      )}

      {/* Results Stage */}
      {stage === 'results' && evaluation && (
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* The Final Verdict */}
            <div className="bg-slate-900 border border-purple-500/30 rounded-[40px] p-12 text-center relative overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
               <p className="text-purple-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Board President • Final Psychological Verdict</p>
               <p className="text-3xl font-black text-white italic max-w-4xl mx-auto leading-relaxed">
                  "{evaluation.verdict}"
               </p>
               <div className="mt-8 inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-purple-900 bg-purple-500/10">
                  <span className="text-5xl font-black text-white">{evaluation.overall_score}</span>
               </div>
               <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-4">Composite Psych Score</p>
            </div>

            {/* Subconscious Alignment Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#162840] rounded-3xl p-8 border border-white/5">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths</p>
                  <ul className="space-y-4">
                     {evaluation.strengths?.map((s: string, i: number) => (
                        <li key={i} className="flex gap-3 text-slate-300 font-bold text-sm">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" /> {s}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="bg-[#162840] rounded-3xl p-8 border border-white/5">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Fatal Red Flags</p>
                  <ul className="space-y-4">
                     {evaluation.weaknesses?.map((w: string, i: number) => (
                        <li key={i} className="flex gap-3 text-slate-400 font-bold text-sm">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" /> {w}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            {/* Cross-Test Consistency */}
            <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/5">
               <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Cross-Test Consistency Analysis</p>
               <p className="text-slate-300 leading-relaxed font-medium">{evaluation.consistency_analysis}</p>
            </div>
         </motion.div>
      )}

      {stage === 'results' && error && (
         <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-8 rounded-2xl font-black text-center">
            {error}
         </div>
      )}

    </div>
  )
}
