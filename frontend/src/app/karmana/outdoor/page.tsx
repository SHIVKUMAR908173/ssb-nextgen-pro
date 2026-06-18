'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Wrench, Shield, Lightbulb } from 'lucide-react'
import Link from 'next/link'

const MATERIALS = [
  { name: 'Balli (Bamboo Pole)', length: '12 ft', use: 'Bridge gaps up to 10ft. Can be placed between two safe zones as a walkway.', emoji: '🎋', color: 'amber', weight: 'Light' },
  { name: 'Fatta (Wooden Plank)', length: '8 ft', use: 'Shorter but wider. Can support full body weight. Use for short crossings.', emoji: '🪵', color: 'orange', weight: 'Medium' },
  { name: 'Rope', length: '15 ft', use: 'Most flexible. Can be used for swinging, tying materials together, or pulling.', emoji: '🪢', color: 'slate', weight: 'Light' },
  { name: 'Drum / Barrel', length: '3 ft dia.', use: 'Can be rolled, used as a stepping stone, or platform. Heavy but very stable.', emoji: '🛢️', color: 'blue', weight: 'Heavy' },
]

export default function OutdoorPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/karmana/gto" className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Command Center
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-[#064e3b] via-[#043b2f] to-[#022c22] p-12 md:p-16 border border-emerald-500/20 shadow-2xl text-center">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
            <Wrench className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Outdoor • Materials Based</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Outdoor Tasks & <span className="text-emerald-400">Helping Material</span></h1>
          <p className="text-emerald-100/70 font-bold text-lg max-w-2xl mx-auto">
            Group exercises in an open field using specific materials. Master the tools to master the task.
          </p>
        </div>
      </motion.div>

      {/* Material Reference Guide */}
      <div>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Material Reference Guide — Know Every Tool</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MATERIALS.map(m => (
            <div key={m.name} className={`bg-[#0f172a] border border-white/5 rounded-[32px] p-8 hover:border-${m.color}-500/30 transition-all`}>
              <div className="flex items-start gap-6">
                <div className="text-5xl">{m.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-white font-black uppercase tracking-tight text-lg mb-1">{m.name}</h3>
                  <div className="flex gap-3 mb-3">
                    <span className={`text-[9px] font-black text-${m.color}-400 bg-${m.color}-500/10 border border-${m.color}-500/20 px-2 py-0.5 rounded uppercase tracking-widest`}>{m.length}</span>
                    <span className="text-[9px] font-black text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase tracking-widest">{m.weight}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{m.use}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Zone Rules */}
      <div className="bg-[#0f172a] rounded-[32px] p-8 border border-white/5">
        <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Shield className="w-4 h-4" /> Color Zone Rules</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { zone: 'White', rule: 'SAFE — Can step and place materials', bg: 'bg-white/10', text: 'text-white' },
            { zone: 'Red', rule: 'RESTRICTED — Cannot touch with body or materials', bg: 'bg-red-500/10', text: 'text-red-400' },
            { zone: 'Blue', rule: 'WATER — Must bridge over, no contact', bg: 'bg-blue-500/10', text: 'text-blue-400' },
            { zone: 'Yellow', rule: 'FINISH — Target zone, must reach safely', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
            { zone: 'Green', rule: 'SAFE — Starting zone, regroup here', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
          ].map(z => (
            <div key={z.zone} className={`${z.bg} rounded-2xl p-4 text-center border border-white/5`}>
              <p className={`${z.text} font-black text-lg uppercase mb-1`}>{z.zone}</p>
              <p className="text-slate-500 text-[10px] font-bold leading-relaxed">{z.rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-[32px] p-8">
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-5">✅ Strategy</h3>
          <ul className="space-y-3">
            {['Assess ALL materials before touching anything','Plan the full crossing mentally first','Assign roles: scout, carrier, spotter','Test material placement before committing body weight','Always account for material length — measure with arms first'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /><span className="text-slate-300 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/5 border border-red-500/15 rounded-[32px] p-8">
          <h3 className="text-red-400 font-black uppercase tracking-widest text-[10px] mb-5">❌ Common Mistakes</h3>
          <ul className="space-y-3">
            {['Rushing to use materials without measuring gaps','Not testing stability before stepping on a bridge','Forgetting to retrieve materials for next obstacle','Arguing about which approach to use — wastes time','Ignoring color zone restrictions under pressure'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /><span className="text-slate-400 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F]">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">OLQs Assessed</h3>
        <div className="flex flex-wrap gap-3">
          {['Organising Ability','Effective Intelligence','Reasoning Ability','Cooperation','Initiative'].map(o => (
            <span key={o} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full">{o}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
