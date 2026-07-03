'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PenTool, ArrowLeft, Radio, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import TatSimulator from '@/components/tests/TatSimulator'

export default function TatPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/mansa"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Psychology Hub
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Psych Battery Active</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] rounded-[48px] p-16 overflow-hidden border border-white/5 relative shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
           <div className="space-y-6">
              <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto md:mx-0">
                 <PenTool className="w-3 h-3 text-purple-500" />
                 <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em]">Thematic Apperception Test</span>
              </div>
              <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                 TAT <span className="text-purple-600">Sim</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-bold">
                 Write stories based on 11 hazy pictures and 1 blank slide. 30 seconds to perceive, 4 minutes to write each story.
              </p>
           </div>
           
           <div className="bg-[#162840] border border-white/5 rounded-[40px] p-10 min-w-[240px] shadow-2xl">
              <Clock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <p className="text-2xl font-black text-white uppercase tracking-tight">4:30 <span className="text-xs text-slate-500">Per Slide</span></p>
           </div>
        </div>
      </motion.div>

      <div className="bg-[#0f172a] rounded-[48px] p-8 shadow-2xl border border-white/5">
         <TatSimulator />
      </div>

    </div>
  )
}
