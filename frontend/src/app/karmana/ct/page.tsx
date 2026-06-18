'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Crown, Play, Shield, Lightbulb, Star } from 'lucide-react'
import Link from 'next/link'

export default function CTPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/karmana/gto" className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Command Center
        </Link>
        <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Most Critical GTO Task</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-[#3b0764] via-[#1e1b4b] to-[#0c0a1d] p-12 md:p-16 border border-purple-500/20 shadow-2xl text-center">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
            <Crown className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Individual • Leadership Assessment</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">Command <span className="text-purple-400">Task</span></h1>
          <p className="text-purple-100/70 font-bold text-lg max-w-2xl mx-auto">
            YOU are appointed as the <strong className="text-white">Commander</strong>. Lead 2-3 subordinates through an obstacle. 
            This is the <strong className="text-white">most direct test of your leadership</strong> ability.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/karmana/gto#gto-3d-stage" className="inline-flex items-center gap-2 rounded-2xl bg-purple-400 px-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-black transition-all active:scale-95 hover:bg-purple-300">
              <Play className="w-4 h-4 fill-current" /> Enter 3D Command Arena
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Why CT is Critical */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-[32px] p-8">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-6 h-6 text-purple-400" />
          <h3 className="text-purple-400 font-black uppercase tracking-widest text-[10px]">Why Command Task is the Most Important</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Direct Assessment', desc: 'The GTO personally assigns YOU a task. Your every decision is being evaluated in real-time.' },
            { title: 'Harder Problem', desc: 'The GTO intentionally gives you a problem slightly harder than what you\'ve seen in PGT/HGT. Show adaptability.' },
            { title: 'Leadership Proof', desc: 'Unlike group tasks where you share spotlight, CT is 100% about YOUR leadership ability.' },
          ].map((d, i) => (
            <div key={i} className="bg-[#0f172a]/60 rounded-2xl p-5 border border-white/5">
              <p className="text-white font-black text-sm uppercase tracking-tight mb-2">{d.title}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy */}
      <div>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Command Protocol — 5 Steps to Lead</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Assess', desc: 'Spend 30 seconds studying the obstacle. Identify safe zones, distances, and material options.', icon: '🔍' },
            { step: '02', title: 'Brief', desc: 'Clearly explain your plan to subordinates. Assign specific roles: "You hold the balli, you cross first."', icon: '📋' },
            { step: '03', title: 'Lead Physically', desc: 'Move to the front. Don\'t just give orders — physically participate in the solution.', icon: '🏃' },
            { step: '04', title: 'Adapt', desc: 'If Plan A fails, pivot immediately. Say: "New plan — let\'s try this instead." Stay calm.', icon: '🔄' },
            { step: '05', title: 'Complete', desc: 'Ensure ALL subordinates cross safely. A commander never leaves people behind.', icon: '✅' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-[#0f172a] rounded-[32px] p-6 border border-white/5 hover:border-purple-500/30 transition-all text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-[9px] font-black text-purple-400 tracking-[0.3em] uppercase mb-2">Step {s.step}</div>
              <h3 className="text-white font-black uppercase tracking-tight text-sm mb-2">{s.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-[32px] p-8">
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-5">✅ Commander's Playbook</h3>
          <ul className="space-y-3">
            {['Think aloud — let the GTO hear your decision-making process','Use all subordinates — don\'t do everything yourself','Stay calm under pressure — confidence is key','Give clear, concise instructions','Show adaptability when first plan fails'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /><span className="text-slate-300 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/5 border border-red-500/15 rounded-[32px] p-8">
          <h3 className="text-red-400 font-black uppercase tracking-widest text-[10px] mb-5">❌ Fatal Errors</h3>
          <ul className="space-y-3">
            {['Panicking when the task seems too hard','Standing back and only giving verbal orders','Not utilizing all subordinates','Poor time management — spending too long on assessment','Getting frustrated or showing anger at subordinates'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /><span className="text-slate-400 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F]">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">OLQs Assessed — Command Task</h3>
        <div className="flex flex-wrap gap-3">
          {['Organising Ability','Power of Expression','Initiative','Self-Confidence','Decision Making','Effective Intelligence'].map(o => (
            <span key={o} className="bg-purple-500/10 border border-purple-500/20 text-purple-400 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full">{o}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
