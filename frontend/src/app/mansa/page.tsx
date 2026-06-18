'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, PenTool, MessageSquare, Zap, UserCircle, Timer, Sparkles, ArrowRight, Play, Info, ArrowLeft, Image as ImageIcon, Radio } from 'lucide-react'
import Link from 'next/link'

const PSYCH_MODULES = [
  { id: 'full', label: 'FULL', title: '2-Hr Pressure Test', icon: Brain, desc: 'Take the complete TAT, WAT, SRT, and SDT back-to-back under strict SSB time limits for a comprehensive evaluation.', duration: '2 Hours Total', path: '/mansa/full' },
  { id: 'ppdt', label: 'PPDT', title: 'Perception Test', icon: ImageIcon, desc: 'Screening test involving hazy picture perception and story writing.', duration: '30s view + 4m write', path: '/vacha/ppdt' },
  { id: 'tat', label: 'TAT', title: 'Thematic Apperception', icon: PenTool, desc: 'Write stories based on 11 hazy pictures + 1 blank slide.', duration: '4m per slide', path: '/mansa/tat' },
  { id: 'wat', label: 'WAT', title: 'Word Association', icon: MessageSquare, desc: 'Respond to 60 words appearing for 15s each.', duration: '15s per word', path: '/mansa/wat' },
  { id: 'srt', label: 'SRT', title: 'Situation Reaction', icon: Zap, desc: 'React to 60 real-life social/personal dilemmas.', duration: '30m total', path: '/mansa/srt' },
  { id: 'sd', label: 'SD', title: 'Self Description', icon: UserCircle, desc: 'Describe yourself through 5 different lenses.', duration: '15m total', path: '/mansa/self-description' },
]

export default function MansaPsychPage() {
  const [selectedModule, setSelectedModule] = useState(PSYCH_MODULES[0])

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Psych Center Online</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] rounded-[48px] p-16 overflow-hidden border border-white/5 relative shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-6">
              <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto md:mx-0">
                 <Radio className="w-3 h-3 text-purple-500" />
                 <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em]">AI Psychologist Core</span>
              </div>
              <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none text-center md:text-left">
                 Mansa <span className="text-purple-500">Psych</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-bold text-center md:text-left">
                 Unlock your subconscious potential. Evaluate cognitive structuring, resilience, and officer potential through our high-fidelity psych batteries.
              </p>
           </div>
           
           <div className="bg-[#162840] border border-white/5 rounded-[40px] p-10 text-center min-w-[280px] shadow-2xl">
              <Brain className="w-16 h-16 text-purple-500 mx-auto mb-6" />
              <div className="space-y-1">
                 <p className="text-3xl font-black text-white uppercase tracking-tight">Stage 2</p>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Psychological Assessment</p>
              </div>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Module Selection */}
        <div className="lg:col-span-4 space-y-4">
           {PSYCH_MODULES.map((module) => (
             <button
               key={module.id}
               onClick={() => setSelectedModule(module)}
               className={`
                 w-full p-8 rounded-[40px] border transition-all text-left flex items-center gap-6 group
                 ${selectedModule.id === module.id ? 'bg-[#162840] border-purple-500/40 text-white shadow-2xl' : 'bg-transparent border-white/5 hover:bg-white/5 text-slate-500'}
               `}
             >
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${selectedModule.id === module.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-[#0f172a] text-slate-700'}`}>
                  <module.icon className="w-6 h-6" />
               </div>
               <div className="flex-1">
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${selectedModule.id === module.id ? 'text-purple-500' : 'text-slate-600'}`}>{module.label}</p>
                  <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-white transition-colors">{module.title}</h3>
               </div>
               {selectedModule.id === module.id && <ArrowRight className="w-5 h-5 text-purple-500" />}
             </button>
           ))}
        </div>

        {/* Right: Module Detail & Execution */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
             <motion.div
               key={selectedModule.id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="bg-[#162840] rounded-[48px] p-12 shadow-2xl border border-[#1E3A5F] h-full flex flex-col relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"></div>
                <div className="flex items-center justify-between mb-12 relative z-10">
                   <div className="space-y-2">
                      <h2 className="text-4xl font-black text-white uppercase tracking-tight">{selectedModule.title}</h2>
                      <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Timer className="w-4 h-4" />
                            {selectedModule.duration}
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                            <Sparkles className="w-3 h-3" />
                            AI Psychologist Evaluator
                         </div>
                      </div>
                   </div>
                   <button className="p-4 bg-[#0f172a] rounded-2xl border border-white/5 text-slate-500 hover:text-white transition-colors shadow-xl">
                      <Info className="w-6 h-6" />
                   </button>
                </div>

                <div className="flex-1 space-y-10 relative z-10">
                   <p className="text-xl font-bold text-slate-400 leading-relaxed max-w-2xl">
                      {selectedModule.desc} You will be shown a series of stimuli and must provide your response within the strict time limits of the SSB.
                   </p>

                   <div className="bg-[#0f172a] rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Mission Briefing</h4>
                      <ul className="space-y-5">
                         {[
                           'Sit in a distraction-free tactical environment.',
                           'Physical pen & paper backup recommended.',
                           'Operational continuity: Do not pause the engine.',
                           'Integrity Protocol: Avoid rehearsed responses.'
                         ].map((item, i) => (
                           <li key={i} className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                              <div className="w-2 h-2 rounded-full bg-purple-600 shadow-[0_0_8px_#9333ea]"></div>
                              {item}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>

                <div className="pt-12 mt-auto border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uplink Ready</span>
                   </div>
                   <Link 
                      href={selectedModule.path}
                      className="bg-white hover:bg-slate-100 text-[#0f172a] px-12 py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 shadow-2xl transition-all active:scale-95 group"
                   >
                      <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                      Initiate {selectedModule.label} Mission
                   </Link>
                </div>
             </motion.div>
           </AnimatePresence>
        </div>

      </div>

    </div>
  )
}
