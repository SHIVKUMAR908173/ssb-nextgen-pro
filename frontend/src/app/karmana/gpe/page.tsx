'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Target, Map, Shield, Play, Info, AlertTriangle, ArrowLeft, Radio, Sparkles, Navigation, Clock } from 'lucide-react'
import Link from 'next/link'
import GpeSimulator from '@/components/game/GpeSimulator'

export default function GpePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
           <Link 
             href="/karmana/gto"
             className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
           >
             <ArrowLeft className="w-3 h-3" /> Back to Grounds
           </Link>
           <div className="h-4 w-px bg-white/10"></div>
           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Phase II: Strategic Planning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model Uplink Active</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] rounded-[48px] p-16 overflow-hidden border border-white/5 relative shadow-2xl text-center"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 space-y-8">
           <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-600/20 mb-4 border border-blue-400/20">
              <Navigation className="w-12 h-12" />
           </div>
           <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto">
                 <Clock className="w-3 h-3 text-blue-500" />
                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">15-Minute Tactical Sprint</span>
              </div>
              <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                 Group <span className="text-blue-600">Planning</span>
              </h1>
              <p className="text-slate-400 max-w-xl mx-auto text-lg font-bold">
                 Analyze the sand model, identify the crises, and formulate a high-efficiency tactical plan under strict time constraints.
              </p>
           </div>
        </div>
      </motion.div>

      {/* GPE Simulator */}
      <div className="bg-[#0f172a] rounded-[48px] p-4 shadow-2xl border border-white/5 overflow-hidden">
         <div className="p-8 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Map className="w-5 h-5 text-blue-500" />
               </div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tight">GPE Sandbox Deployment</h2>
            </div>
         </div>
         <div className="p-4 pt-0">
            <GpeSimulator />
         </div>
      </div>

      {/* Briefing Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { icon: Info, label: 'Reading Phase', desc: '5 Minutes. No notes allowed. Focus on map scale and narrative cues.', color: 'blue' },
           { icon: AlertTriangle, label: 'Priority Logic', desc: 'Human life > Property > Time. Account for every resource.', color: 'amber' },
           { icon: Sparkles, label: 'Consensus', desc: 'In a real SSB, you must reach a common group plan. Practice clarity.', color: 'emerald' },
         ].map((item, i) => (
           <div key={i} className="bg-[#162840] rounded-[40px] p-10 border border-[#1E3A5F] shadow-xl flex flex-col items-center text-center gap-6">
              <item.icon className={`w-10 h-10 text-${item.color}-500`} />
              <div>
                 <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">{item.label}</h4>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{item.desc}</p>
              </div>
           </div>
         ))}
      </div>

    </div>
  )
}
