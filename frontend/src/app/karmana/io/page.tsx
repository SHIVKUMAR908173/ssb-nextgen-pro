'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Clock, Target, Dumbbell } from 'lucide-react'
import Link from 'next/link'
import IOObstacleGame from '@/components/game/IOObstacleGame'

const OBSTACLES = [
  { id: 1, name: 'Monkey Crawl', marks: 2, difficulty: 'Easy', technique: 'Hook ankles over rope, pull with arms, push with legs in rhythm. Face upward.', color: 'emerald' },
  { id: 2, name: 'Double Ditch', marks: 3, difficulty: 'Medium', technique: 'Build speed. Jump at 45° angle. Use arms for thrust. Maintain momentum between ditches.', color: 'blue' },
  { id: 3, name: 'Zig-Zag Balance', marks: 2, difficulty: 'Easy', technique: 'Shift weight to inner foot at turns. Arms out. Look at endpoint, not feet.', color: 'amber' },
  { id: 4, name: 'High Jump', marks: 4, difficulty: 'Hard', technique: 'Approach at 30°. Plant takeoff foot. Scissors kick. Drive knee aggressively.', color: 'red' },
  { id: 5, name: 'Long Jump', marks: 3, difficulty: 'Medium', technique: 'Full sprint. Hit board with stronger foot. Jump at 20-25°. Swing arms forward.', color: 'purple' },
  { id: 6, name: 'Rope Climbing', marks: 5, difficulty: 'Expert', technique: 'S-wrap rope between feet. Use legs MORE than arms. Pull-push rhythm.', color: 'orange' },
  { id: 7, name: 'Tarzan Swing', marks: 4, difficulty: 'Hard', technique: 'Grip overhand high. Tuck knees at bottom. Extend legs before release.', color: 'cyan' },
  { id: 8, name: 'Burma Bridge', marks: 3, difficulty: 'Medium', technique: 'Stand on bottom rope. Hold side ropes. Shuffle sideways. Look ahead.', color: 'lime' },
  { id: 9, name: 'Commando Walk', marks: 3, difficulty: 'Medium', technique: 'Small quick steps. Engage core. Don\'t stop in middle. Arms out for balance.', color: 'pink' },
  { id: 10, name: 'Screen Jump', marks: 5, difficulty: 'Expert', technique: 'Jump outward not downward. Grab net on impact. Descend with 3-point contact.', color: 'yellow' },
]

const difficultyColor: Record<string, string> = {
  'Easy': 'text-emerald-400 bg-emerald-500/10', 'Medium': 'text-blue-400 bg-blue-500/10',
  'Hard': 'text-orange-400 bg-orange-500/10', 'Expert': 'text-red-400 bg-red-500/10'
}

export default function IOPage() {
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
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Individual • Physical Courage</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">Individual <span className="text-emerald-400">Obstacles</span></h1>
          <p className="text-emerald-100/70 font-bold text-lg max-w-2xl mx-auto">
            <strong className="text-white">10 obstacles</strong> in <strong className="text-white">3 minutes</strong>. Each scored 2-5 marks. 
            Total: 34 marks. This tests raw physical courage and determination.
          </p>
          <div className="flex justify-center gap-6">
            {[
              { icon: Clock, label: '3 Min', sub: 'Total Time' },
              { icon: Target, label: '34', sub: 'Max Marks' },
              { icon: Dumbbell, label: '10', sub: 'Obstacles' },
            ].map(s => (
              <div key={s.sub} className="bg-[#0f172a]/60 rounded-2xl px-6 py-4 border border-white/10 text-center">
                <s.icon className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-white font-black text-lg">{s.label}</p>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 10 Obstacle Cards */}
      <div>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">All 10 Obstacles — Technique Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OBSTACLES.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#0f172a] rounded-[28px] p-6 border border-white/5 hover:border-emerald-500/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-emerald-500">{String(o.id).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tight">{o.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[8px] font-black text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded uppercase tracking-widest">{o.marks} marks</span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${difficultyColor[o.difficulty]}`}>{o.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{o.technique}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strategy */}
      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-[32px] p-8 border border-orange-500/20">
        <h3 className="text-orange-400 font-black uppercase tracking-widest text-[10px] mb-5 flex items-center gap-2">
          <Dumbbell className="w-4 h-4" /> Pro Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { tip: 'Start Easy', detail: 'Begin with Monkey Crawl and Zig-Zag Balance (2 marks each) for guaranteed points. Build momentum.' },
            { tip: 'Skip if Stuck', detail: 'If an obstacle takes more than 15 seconds, SKIP IT. Move to the next one. Come back if time permits.' },
            { tip: 'Physical Prep', detail: 'Daily: 20 pull-ups, 50 push-ups, 5km run, rope climbing. Upper body strength is non-negotiable.' },
          ].map((t, i) => (
            <div key={i} className="bg-[#0f172a]/60 rounded-2xl p-5 border border-white/5">
              <p className="text-orange-300 font-black text-sm uppercase tracking-tight mb-2">{t.tip}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{t.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Game */}
      <div className="bg-[#0f172a] rounded-[48px] p-4 shadow-2xl border border-white/5">
        <div className="p-6 pb-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">🏃 Start Obstacle Course Simulation</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tap rapidly to clear each obstacle</p>
        </div>
        <IOObstacleGame />
      </div>

      <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F]">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">OLQs Assessed</h3>
        <div className="flex flex-wrap gap-3">
          {['Courage','Stamina','Determination','Speed of Decision','Self-Confidence'].map(o => (
            <span key={o} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full">{o}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
