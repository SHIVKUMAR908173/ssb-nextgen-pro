'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, RefreshCw, Shield } from 'lucide-react'
import Link from 'next/link'

export default function FGTPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/karmana/gto" className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Command Center
        </Link>
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Final Chance • Show Growth</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-[#78350f] via-[#451a03] to-[#1c0a00] p-12 md:p-16 border border-amber-500/20 shadow-2xl text-center">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
            <TrendingUp className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">Final Assessment • Growth Curve</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">Final Group <span className="text-amber-400">Task</span></h1>
          <p className="text-amber-100/70 font-bold text-lg max-w-2xl mx-auto">
            Your <strong className="text-white">LAST outdoor task</strong>. Same team as PGT. The GTO directly compares your performance here 
            with PGT to measure your <strong className="text-white">growth curve</strong>.
          </p>
          <Link href="/karmana/gto" className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-black active:scale-95 hover:bg-amber-300">
            <RefreshCw className="w-4 h-4" /> Review 3D Arena
          </Link>
        </div>
      </motion.div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-[32px] p-8">
        <h3 className="text-amber-400 font-black uppercase tracking-widest text-[10px] mb-4">🔑 The Growth Curve Principle</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">The GTO directly compares your FGT with your PGT performance. They look for:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Were you quiet in PGT?', action: 'Be ASSERTIVE in FGT — speak up, suggest ideas, volunteer.' },
            { title: 'Were you dominant in PGT?', action: 'Show COOPERATION — listen more, build on others\' ideas, let others lead.' },
            { title: 'Were you average in PGT?', action: 'Show INITIATIVE — take physical risks, carry materials, lead a crossing.' },
          ].map((d, i) => (
            <div key={i} className="bg-[#0f172a]/60 rounded-2xl p-5 border border-white/5">
              <p className="text-amber-300 font-black text-sm mb-2">{d.title}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{d.action}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-[32px] p-8">
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-5">✅ FGT Strategy</h3>
          <ul className="space-y-3">
            {['Show visible improvement from PGT performance','Help weaker team members more actively','Volunteer for the hardest part of the task','Maintain high energy even if physically tired','Demonstrate democratic leadership — involve everyone'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /><span className="text-slate-300 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/5 border border-red-500/15 rounded-[32px] p-8">
          <h3 className="text-red-400 font-black uppercase tracking-widest text-[10px] mb-5">❌ Avoid These</h3>
          <ul className="space-y-3">
            {['Repeating the exact same behavior from PGT','Showing fatigue or disinterest','Letting others do all the work','Being reckless to compensate for poor PGT','Ignoring team dynamics'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /><span className="text-slate-400 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F]">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">OLQs Assessed</h3>
        <div className="flex flex-wrap gap-3">
          {['Cooperation','Initiative','Stamina','Liveliness','Determination','Group Influencing'].map(o => (
            <span key={o} className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full">{o}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
