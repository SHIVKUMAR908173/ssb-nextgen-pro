'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Brain, Users, Flag, Mic, Shield, ChevronRight, ArrowLeft, Radio, Sparkles, Map } from 'lucide-react'
import Link from 'next/link'

const DAYS = [
  { id: 'day1', label: 'Day 1', title: 'Screening', icon: Target },
  { id: 'day2', label: 'Day 2', title: 'Psychology', icon: Brain },
  { id: 'day3', label: 'Day 3', title: 'GTO-1', icon: Users },
  { id: 'day4', label: 'Day 4', title: 'GTO-2', icon: Flag },
  { id: 'day5', label: 'Day 5', title: 'Board Conference', icon: Mic },
]

export default function SsbJourneyPage() {
  const [activeDay, setActiveDay] = useState('day1')

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Node: Roadmap Active</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0f172a] rounded-[48px] p-16 overflow-hidden border border-white/5 relative shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[140px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-6 text-center md:text-left">
              <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto md:mx-0">
                 <Radio className="w-3 h-3 text-yellow-500" />
                 <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">Full Operations Roadmap</span>
              </div>
              <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                 5-Day <span className="text-yellow-500">Board</span>
              </h1>
              <p className="text-slate-400 max-w-2xl text-lg font-bold">
                 &quot;The SSB process is a tactical audit of your &apos;Manas, Vach, Karmana&apos; — Mind, Speech, and Action. Decode every phase.&quot;
              </p>
           </div>
           
           <div className="hidden lg:flex items-center justify-center">
              <div className="w-40 h-40 bg-white/5 rounded-full border border-white/10 flex items-center justify-center relative">
                 <Shield className="w-24 h-24 text-yellow-500 opacity-20" />
                 <Sparkles className="absolute top-4 right-4 w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
           </div>
        </div>
      </motion.div>

      {/* Days Timeline Tabs */}
      <div className="bg-[#162840] rounded-[40px] p-4 shadow-2xl border border-[#1E3A5F] flex flex-wrap items-stretch gap-2">
        {DAYS.map((day, i) => {
          const isActive = activeDay === day.id
          return (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`
                flex-1 min-w-[150px] p-8 rounded-[32px] transition-all flex flex-col items-center gap-4 text-center group
                ${isActive ? 'bg-[#0f172a] shadow-2xl border border-yellow-500/30 scale-105 z-10' : 'hover:bg-[#1a3050] border border-transparent opacity-40'}
              `}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isActive ? 'bg-yellow-500 text-black shadow-xl shadow-yellow-500/20' : 'bg-[#0f172a] text-slate-700'}`}>
                 <day.icon className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isActive ? 'text-yellow-500' : 'text-slate-600'}`}>{day.label}</p>
                <p className={`text-xs font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-slate-500'}`}>{day.title}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Content Section */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-[#162840] rounded-[48px] p-16 shadow-2xl border border-[#1E3A5F] min-h-[500px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px]"></div>
          
          {activeDay === 'day1' && (
            <div className="space-y-16 relative z-10">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
                   Stage I: <span className="text-yellow-500">Screening</span>
                 </h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Sector Filtration Protocol</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8">
                <div className="space-y-10">
                   <p className="text-slate-400 text-xl leading-relaxed font-bold italic">
                     Day 1 is the most critical tactical filter. 60-70% of candidates are neutralized at this phase. Precision is mandatory.
                   </p>
                   <div className="space-y-6">
                      <div className="bg-[#0f172a] p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                         <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 opacity-20"></div>
                         <h4 className="font-black text-white uppercase text-xs tracking-widest mb-3">OIR (Officer Intelligence Rating)</h4>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Verbal and Non-verbal reasoning tests. High-speed logic processing required.</p>
                      </div>
                      <div className="bg-[#0f172a] p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                         <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 opacity-20"></div>
                         <h4 className="font-black text-white uppercase text-xs tracking-widest mb-3">PPDT (Picture Perception)</h4>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Hazy stimuli perception, narrative construction, and consensus negotiation.</p>
                      </div>
                   </div>
                </div>
                
                <div className="bg-[#0f172a] rounded-[48px] p-12 flex flex-col items-center justify-center text-center space-y-10 border border-white/5 shadow-inner">
                   <Target className="w-24 h-24 text-yellow-500 opacity-20 animate-pulse" />
                   <div className="space-y-4">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Ready for Simulation?</p>
                      <Link href="/vacha/assessment" className="inline-block bg-white hover:bg-slate-100 text-black px-12 py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all active:scale-95">
                        Start Screening Mission
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeDay === 'day2' && (
            <div className="space-y-16 relative z-10">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
                   Day 2: <span className="text-yellow-500">Psychology</span>
                 </h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Cognitive Blueprint Analysis</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8">
                <div className="space-y-10">
                   <p className="text-slate-400 text-xl leading-relaxed font-bold italic">
                     Four tests designed to penetrate your subconscious and extract your true personality markers.
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: 'TAT', desc: '12 Thematic Pictures' },
                        { title: 'WAT', desc: '60 Word Associations' },
                        { title: 'SRT', desc: '60 Life Situations' },
                        { title: 'SD', desc: 'Self Description' }
                      ].map(test => (
                        <div key={test.title} className="bg-[#0f172a] p-6 rounded-3xl border border-white/5">
                           <h4 className="font-black text-yellow-500 uppercase text-[10px] tracking-widest mb-1">{test.title}</h4>
                           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{test.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="bg-[#0f172a] rounded-[48px] p-12 flex flex-col items-center justify-center text-center space-y-10 border border-white/5">
                   <Brain className="w-24 h-24 text-yellow-500 opacity-20" />
                   <div className="space-y-4">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Analyze your mind</p>
                      <Link href="/mansa" className="inline-block border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 px-12 py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all">
                        Launch Mansa Hub
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeDay === 'day3' && (
            <div className="space-y-16 relative z-10">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
                   Day 3: <span className="text-yellow-500">GTO-1</span>
                 </h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Squad Dynamics Observation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8">
                <div className="space-y-6">
                   <div className="bg-[#0f172a] p-8 rounded-[40px] border border-white/5">
                      <ul className="space-y-6">
                         {[
                           { name: 'Group Discussion', icon: Users },
                           { name: 'Group Planning Exercise', icon: Map },
                           { name: 'Progressive Group Task', icon: Target },
                           { name: 'Half Group Task', icon: Target }
                         ].map((task, i) => (
                           <li key={i} className="flex items-center gap-4 text-slate-300 font-bold text-sm uppercase tracking-wider">
                              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                 <task.icon className="w-4 h-4" />
                              </div>
                              {task.name}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>
                <div className="flex flex-col justify-center">
                   <p className="text-slate-400 text-lg leading-relaxed font-bold">
                     GTO tasks test your ability to work within a team, your physical stamina, and your practical intelligence under pressure.
                   </p>
                </div>
              </div>
            </div>
          )}

          {activeDay === 'day4' && (
            <div className="space-y-16 relative z-10">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
                   Day 4: <span className="text-yellow-500">GTO-2</span>
                 </h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Leadership Verification</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8">
                <div className="space-y-8">
                   <div className="bg-yellow-500/5 p-8 rounded-[40px] border border-yellow-500/10">
                      <h4 className="text-yellow-500 font-black uppercase text-xs tracking-widest mb-4">The Command Task</h4>
                      <p className="text-slate-400 text-sm font-bold leading-relaxed">
                        This is where the GTO tests your individual leadership. You choose your subordinates and execute a mission with limited resources.
                      </p>
                   </div>
                   <div className="bg-[#0f172a] p-8 rounded-[40px] border border-white/5">
                      <h4 className="text-white font-black uppercase text-xs tracking-widest mb-4">Lecturette</h4>
                      <p className="text-slate-500 text-sm font-bold leading-relaxed">
                        3 minutes to deliver a briefing on a selected topic. Confidence and clarity are paramount.
                      </p>
                   </div>
                </div>
                <div className="bg-[#0f172a] rounded-[48px] p-12 flex flex-col items-center justify-center text-center space-y-6 border border-white/5">
                   <Flag className="w-24 h-24 text-yellow-500 opacity-20" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ground Simulation Active</p>
                   <Link href="/karmana/gto" className="inline-block bg-yellow-500 text-black px-12 py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all">
                     Enter Karmana Hub
                   </Link>
                </div>
              </div>
            </div>
          )}

          {activeDay === 'day5' && (
            <div className="space-y-16 relative z-10">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
                   Day 5: <span className="text-yellow-500">Conference</span>
                 </h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">The Final Verdict</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8">
                <div className="space-y-10">
                   <div className="flex items-center gap-6">
                      <div className="w-1 bg-yellow-500 h-24"></div>
                      <p className="text-slate-400 text-xl leading-relaxed font-bold italic">
                        The entire board of officers meets to decide your recommendation. It is the culmination of 5 days of rigorous assessment.
                      </p>
                   </div>
                   <div className="bg-[#0f172a] p-10 rounded-[40px] border border-white/5">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-loose">
                        - Formal uniform check<br />
                        - Board room entry protocol<br />
                        - Final questioning by President<br />
                        - The result declaration
                      </p>
                   </div>
                </div>
                <div className="bg-yellow-500 rounded-[48px] p-12 flex flex-col items-center justify-center text-center space-y-8 text-black shadow-2xl shadow-yellow-500/20">
                   <Mic className="w-24 h-24 opacity-30" />
                   <div className="space-y-2">
                      <h4 className="text-2xl font-black uppercase tracking-tight">Final Assessment</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Victory or Lesson. There is no failure.</p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
