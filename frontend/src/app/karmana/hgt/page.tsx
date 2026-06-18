'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Play, Shield, Lightbulb, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function HGTPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/karmana/gto" className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Command Center
        </Link>
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Half Group • 4-5 Members</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-[#1e3a5f] via-[#172554] to-[#0c1524] p-12 md:p-16 border border-blue-500/20 shadow-2xl text-center">
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
            <Users className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Outdoor • Half Group</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">Half Group <span className="text-blue-400">Task</span></h1>
          <p className="text-blue-100/70 font-bold text-lg max-w-2xl mx-auto">
            Same as PGT but with <strong className="text-white">only 4-5 people</strong>. Smaller team = more individual visibility. 
            This is where the GTO looks for <strong className="text-white">natural leaders</strong>.
          </p>
          <Link href="/karmana/gto#gto-3d-stage" className="inline-flex items-center gap-2 rounded-2xl bg-blue-400 px-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-black transition-all active:scale-95 hover:bg-blue-300">
            <Play className="w-4 h-4 fill-current" /> Enter 3D HGT Arena
          </Link>
        </div>
      </motion.div>

      {/* Key Difference */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-[32px] p-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-400" />
          <h3 className="text-orange-400 font-black uppercase tracking-widest text-[10px]">Critical Difference from PGT</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Smaller Team', desc: 'Only 4-5 people. You CANNOT hide. Every action is noticed by the GTO.' },
            { title: 'More Pressure', desc: 'With fewer hands, each person must contribute physically and mentally.' },
            { title: 'Leadership Window', desc: 'This is the primary task where natural leaders emerge. Step up or miss your chance.' },
          ].map((d, i) => (
            <div key={i} className="bg-[#0f172a]/60 rounded-2xl p-5 border border-white/5">
              <p className="text-white font-black text-sm uppercase tracking-tight mb-2">{d.title}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-[32px] p-8">
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-5">✅ Winning Strategy</h3>
          <ul className="space-y-3">
            {['Take initiative — suggest ideas immediately','Physically lead from the front, not from behind','Encourage quieter team members to participate','Think aloud — let the GTO hear your reasoning process','Manage time actively — call out remaining minutes'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /><span className="text-slate-300 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/5 border border-red-500/15 rounded-[32px] p-8">
          <h3 className="text-red-400 font-black uppercase tracking-widest text-[10px] mb-5">❌ Mistakes to Avoid</h3>
          <ul className="space-y-3">
            {['Being passive — waiting for others to act','Dominating without listening to team input','Getting frustrated when ideas don\'t work','Not adapting your approach from PGT','Ignoring safety rules under time pressure'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /><span className="text-slate-400 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F]">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">OLQs Assessed</h3>
        <div className="flex flex-wrap gap-3">
          {['Self-Confidence','Decision Making','Liveliness','Determination','Initiative','Courage'].map(o => (
            <span key={o} className="bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full">{o}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
