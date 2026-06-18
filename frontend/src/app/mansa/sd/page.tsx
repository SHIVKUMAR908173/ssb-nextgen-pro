'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { UserCircle, PenTool, Brain, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

const SD_SECTIONS = [
  { id: 'parents', label: 'Parents Opinion', desc: 'What do your parents think of you as a son/daughter?' },
  { id: 'teachers', label: 'Teachers Opinion', desc: 'How do your teachers perceive your academic and social behavior?' },
  { id: 'friends', label: 'Friends Opinion', desc: 'What kind of a friend are you? What are your qualities and weaknesses?' },
  { id: 'self', label: 'Self Opinion', desc: 'What is your own assessment of your character and potential?' },
  { id: 'aims', label: 'Aims & Improvements', icon: Brain, desc: 'What are your goals and areas you want to improve?' },
]

export default function SelfDescriptionPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      <div className="flex items-center justify-between">
        <Link 
          href="/mansa"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Psych Hub
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Psychological Profiling</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] rounded-[48px] p-12 overflow-hidden border border-white/5 relative shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 space-y-6">
           <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
             <Sparkles className="w-3 h-3 text-blue-400" />
             <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Psychological Battery</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
             Know <span className="text-blue-500">Thyself</span>
           </h1>
           <p className="text-slate-400 max-w-2xl text-lg font-bold">
             The Self Description Test (SDT) is an effective tool to assess a candidate&apos;s insight, honesty, and self-awareness.
           </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {SD_SECTIONS.map((section, i) => (
           <motion.div 
             key={section.id}
             initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] flex flex-col gap-6 group hover:border-blue-500/30 transition-all shadow-xl"
           >
              <div className="flex items-center justify-between">
                 <div className="w-12 h-12 bg-[#0f172a] rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all border border-white/5 shadow-lg">
                    {section.icon ? <section.icon className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
                 </div>
                 <CheckCircle2 className="w-5 h-5 text-slate-800" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{section.label}</h3>
                 <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">{section.desc}</p>
              </div>
              <button className="mt-auto w-full py-5 bg-[#0f172a] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                 Begin Draft
              </button>
           </motion.div>
         ))}
      </div>
    </div>
  )
}
