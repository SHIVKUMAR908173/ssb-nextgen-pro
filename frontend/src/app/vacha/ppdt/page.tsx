'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ImageIcon, Eye, PenTool, Target, Brain, Info, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react'
import Link from 'next/link'
import PPDTEvaluator from '@/components/tests/PPDTEvaluator'

export default function PPDTPage() {
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
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stage I: Screening Active</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] rounded-[48px] p-12 overflow-hidden border border-white/5 relative shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                 <ShieldAlert className="w-3 h-3 text-blue-500" />
                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Primary Filter</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white leading-tight uppercase tracking-tighter">
                 PPDT <span className="text-blue-600">Round</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-bold">
                 Picture Perception & Description Test. Observe, synthesize, and narrate. Your first step toward the officer candidate title.
              </p>
           </div>
           <div className="bg-[#162840] border border-white/5 rounded-[40px] p-10 text-center min-w-[280px] shadow-2xl relative">
              <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-blue-500/20" />
              <ImageIcon className="w-16 h-16 text-blue-500 mx-auto mb-6 opacity-50" />
              <p className="text-2xl font-black text-white uppercase tracking-tight">Active Matrix</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Hazy Visual Perception</p>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8">
            <PPDTEvaluator />
         </div>

         <div className="lg:col-span-4 space-y-6">
            <section className="bg-[#162840] rounded-[40px] p-10 border border-[#1E3A5F] shadow-2xl">
               <div className="flex items-center gap-3 mb-8">
                  <Info className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Protocol</h3>
               </div>
               <div className="space-y-8">
                  {[
                    { icon: Eye, label: '30s Perception', desc: 'Lock onto character count, age, sex, and mood.' },
                    { icon: PenTool, label: '1m Marking', desc: 'Log the character matrix with precision.' },
                    { icon: Target, label: '4m Synthesis', desc: 'Craft a logical past, present, and resolution.' },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-5 group">
                       <div className="w-12 h-12 bg-[#0f172a] rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0 shadow-xl">
                          <step.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">{step.label}</h4>
                          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">{step.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            <section className="bg-[#0f172a] rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
               <div className="flex items-center gap-3 mb-6 relative z-10">
                  <Brain className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">AI Audit</h3>
               </div>
               <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest relative z-10">
                 The AI engine monitors narrative coherence, character perception accuracy, and the projection of Officer Like Qualities (OLQs).
               </p>
               <button className="mt-8 w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Analyze Sample Narratives
               </button>
            </section>
         </div>
      </div>
    </div>
  )
}
