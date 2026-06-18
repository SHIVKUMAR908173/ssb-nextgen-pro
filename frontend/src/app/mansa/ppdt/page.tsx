'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ImageIcon, Eye, PenTool, Target, Brain, Info } from 'lucide-react'
import PPDTEvaluator from '../../../components/tests/PPDTEvaluator'

export default function PPDTPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* PPDT Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#0f172a] rounded-[48px] p-12 overflow-hidden border border-white/5 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1 space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                 <Eye className="w-3 h-3 text-yellow-500" />
                 <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">Stage I: Screening</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
                 PPDT <span className="text-yellow-500">Round</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-bold">
                 Picture Perception & Description Test. Observe the hazy image, formulate a logical story, and present character details. This decides your screening status.
              </p>
           </div>
           <div className="bg-[#162840] backdrop-blur-xl border border-white/5 rounded-[40px] p-8 text-center min-w-[240px] relative shadow-2xl">
              <ImageIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-50" />
              <div className="space-y-1">
                 <p className="text-2xl font-black text-white uppercase tracking-tight">Active Image</p>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">30 Seconds Observation</p>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Simulator Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 bg-[#162840] rounded-[48px] p-12 border border-[#1E3A5F] min-h-[600px] shadow-2xl">
            <div className="flex items-center justify-between mb-12">
               <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Simulator Workspace</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Intelligence Assessment Enabled</p>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">IO Online</span>
               </div>
            </div>
            
            <PPDTEvaluator />
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] shadow-xl">
               <div className="flex items-center gap-3 mb-6">
                  <Info className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Protocol</h3>
               </div>
               <div className="space-y-4">
                  {[
                    { icon: Eye, label: '30s Perception', desc: 'Observe characters, mood, and surroundings.' },
                    { icon: PenTool, label: '1m Details', desc: 'Mark Age, Sex, Mood, and Action.' },
                    { icon: Target, label: '4m Story', desc: 'Explain past, present, and future outcome.' },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 group">
                       <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-yellow-500 group-hover:text-black transition-all shrink-0 border border-white/5">
                          <step.icon className="w-5 h-5" />
                       </div>
                       <div>
                          <h4 className="text-[11px] font-black text-white uppercase tracking-tight mb-0.5">{step.label}</h4>
                          <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{step.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-[#0f172a] rounded-[32px] p-8 border border-white/5 shadow-xl">
               <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">AI Insights</h3>
               </div>
               <p className="text-xs font-bold text-slate-500 leading-relaxed">
                 The AI evaluates your story for Officer Like Qualities (OLQs) such as Logical Reasoning, Social Adaptability, and Effective Intelligence.
               </p>
               <button className="mt-6 w-full py-4 bg-yellow-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/10 hover:bg-yellow-400 transition-all">
                  View Sample Stories
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
