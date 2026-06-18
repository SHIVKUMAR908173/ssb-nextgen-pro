'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Clock, Target, Play, Shield, Lightbulb } from 'lucide-react'
import Link from 'next/link'

const TOOLS = [
  { name: 'Balli', desc: 'Bamboo pole, ~12ft. Can bridge gaps up to 10ft. Cannot touch red zones.', emoji: '🎋', color: 'amber' },
  { name: 'Fatta', desc: 'Wooden plank, ~8ft. Can support body weight. Use for short bridges.', emoji: '🪵', color: 'orange' },
  { name: 'Rope', desc: '~15ft. Flexible. For swinging, tying, pulling. Most versatile tool.', emoji: '🪢', color: 'slate' },
  { name: 'Drum', desc: 'Metal barrel. Can be rolled, used as stepping stone. Heavy but stable.', emoji: '🛢️', color: 'blue' },
]

export default function PGTPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/karmana/gto" className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Command Center
        </Link>
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 3D Arena Available
        </span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-[#064e3b] via-[#043b2f] to-[#022c22] p-12 md:p-16 border border-emerald-500/20 shadow-2xl text-center">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
            <Users className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Outdoor • Full Group</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">Progressive <span className="text-emerald-400">Group Task</span></h1>
          <p className="text-emerald-100/70 font-bold text-lg max-w-2xl mx-auto">
            4 progressive obstacles with increasing difficulty. Your team of 8-10 must cross using limited materials. <strong className="text-white">40-50 minutes</strong> of pure teamwork.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/karmana/gto#gto-3d-stage" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-black transition-all active:scale-95 hover:bg-emerald-300">
              <Play className="w-4 h-4 fill-current" /> Enter 3D PGT Arena
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Tools Reference */}
      <div>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Helping Materials — Know Your Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TOOLS.map(t => (
            <div key={t.name} className={`bg-${t.color}-500/5 border border-${t.color}-500/15 rounded-[32px] p-6 text-center hover:border-${t.color}-500/30 transition-all`}>
              <div className="text-4xl mb-3">{t.emoji}</div>
              <h3 className="text-white font-black uppercase tracking-tight mb-2">{t.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-[32px] p-8">
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-5">✅ Winning Strategy</h3>
          <ul className="space-y-3">
            {['Observe the obstacle for 30 seconds before acting','Volunteer to carry heavy materials — shows physical courage','Help struggling team members cross — shows cooperation','Suggest ideas but don\'t force them — show democratic leadership','Always account for material length before bridging gaps'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /><span className="text-slate-300 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/5 border border-red-500/15 rounded-[32px] p-8">
          <h3 className="text-red-400 font-black uppercase tracking-widest text-[10px] mb-5">❌ Common Mistakes</h3>
          <ul className="space-y-3">
            {['Taking charge too aggressively — ignoring others\' ideas','Not contributing at all — staying in the background','Stepping in out-of-bounds (red zones) — rule violation','Placing materials on restricted areas','Leaving team members behind to finish faster'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /><span className="text-slate-400 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-[#0f172a] rounded-[32px] p-8 border border-white/5">
        <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Shield className="w-4 h-4" /> Rules of Engagement</h3>
        <div className="space-y-3">
          {['Materials (balli, fatta, rope) CANNOT touch red/out-of-bounds zones','Team members cannot step on restricted ground','All group members must cross each obstacle before moving to the next','Materials can only rest on white/safe zones and body contact','No external help — only use provided materials'].map((r, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <span className="text-orange-400 font-black text-lg w-8">{String(i+1).padStart(2,'0')}</span>
              <span className="text-slate-300 text-sm font-bold">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* OLQ */}
      <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F]">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">OLQs Assessed</h3>
        <div className="flex flex-wrap gap-3">
          {['Cooperation','Initiative','Determination','Courage','Stamina','Group Influencing'].map(o => (
            <span key={o} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full">{o}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
