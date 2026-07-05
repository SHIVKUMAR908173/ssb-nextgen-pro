'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Box, ChevronRight, Footprints, Play, Sparkles, ShieldCheck, Target, Zap,
  MessageSquare, Users, Crown, TrendingUp, Clock, Trophy, Star, Flame, Award, Map
} from 'lucide-react'
import VirtualGtoGround3D from '@/components/game/VirtualGtoGround3D'
import IOObstacleGame from '@/components/game/IOObstacleGame'

const GTO_TASKS = [
  { id: 'gd', name: 'Group Discussion', shortName: 'GD', category: 'Verbal', duration: '20 min', href: '/karmana/gd', color: 'emerald', emoji: '💬', difficulty: 'Medium', xp: 150 },
  { id: 'gpe', name: 'Group Planning Exercise', shortName: 'GPE', category: 'Planning', duration: '25 min', href: '/karmana/gpe', color: 'blue', emoji: '🗺️', difficulty: 'Hard', xp: 200 },
  { id: 'lecturette', name: 'Lecturette', shortName: 'LEC', category: 'Verbal', duration: '3 min', href: '/vacha/lecturette', color: 'purple', emoji: '🎤', difficulty: 'Medium', xp: 150 },
  { id: 'pgt', name: 'Progressive Group Task', shortName: 'PGT', category: 'Outdoor', duration: '45 min', href: '#gto-3d-stage', color: 'emerald', emoji: '🏗️', difficulty: 'Hard', xp: 250 },
  { id: 'hgt', name: 'Half Group Task', shortName: 'HGT', category: 'Outdoor', duration: '25 min', href: '#gto-3d-stage', color: 'blue', emoji: '👥', difficulty: 'Hard', xp: 200 },
  { id: 'ct', name: 'Command Task', shortName: 'CT', category: 'Leadership', duration: '15 min', href: '#gto-3d-stage', color: 'purple', emoji: '👑', difficulty: 'Expert', xp: 300 },
  { id: 'fgt', name: 'Final Group Task', shortName: 'FGT', category: 'Outdoor', duration: '30 min', href: '#gto-3d-stage', color: 'amber', emoji: '🏁', difficulty: 'Hard', xp: 200 },
  { id: 'snake', name: 'Snake Race', shortName: 'SR', category: 'Team Race', duration: '10 min', href: '#gto-3d-stage', color: 'emerald', emoji: '🐍', difficulty: 'Medium', xp: 150 },
  { id: 'io', name: 'Individual Obstacles', shortName: 'IO', category: 'Physical', duration: '3 min', href: '/karmana/io', color: 'red', emoji: '🏃', difficulty: 'Expert', xp: 250 },
  { id: 'outdoor', name: 'Outdoor Group Tasks', shortName: 'OGT', category: 'Outdoor', duration: '30 min', href: '#gto-3d-stage', color: 'emerald', emoji: '🌲', difficulty: 'Medium', xp: 150 },
  { id: 'helping', name: 'Helping Material Tasks', shortName: 'HMT', category: 'Materials', duration: '20 min', href: '#gto-3d-stage', color: 'orange', emoji: '🔧', difficulty: 'Medium', xp: 150 },
  { id: 'personal', name: 'Personal Obstacles', shortName: 'PO', category: 'Physical', duration: '3 min', href: '/karmana/io', color: 'red', emoji: '💪', difficulty: 'Hard', xp: 200 },
]

const RANKS = [
  { min: 0, name: 'Cadet', icon: '🎖️' },
  { min: 101, name: 'Lance Naik', icon: '⭐' },
  { min: 301, name: 'Naik', icon: '⭐⭐' },
  { min: 601, name: 'Havildar', icon: '🎗️' },
  { min: 1001, name: 'JCO', icon: '🏅' },
  { min: 2001, name: 'Officer', icon: '👑' },
]

const diffColors: Record<string, string> = {
  'Easy': 'bg-emerald-500/10 text-emerald-400',
  'Medium': 'bg-blue-500/10 text-blue-400',
  'Hard': 'bg-orange-500/10 text-orange-400',
  'Expert': 'bg-red-500/10 text-red-400',
}

const catColors: Record<string, string> = {
  'Verbal': 'bg-purple-500/10 text-purple-400',
  'Planning': 'bg-blue-500/10 text-blue-400',
  'Outdoor': 'bg-emerald-500/10 text-emerald-400',
  'Leadership': 'bg-amber-500/10 text-amber-400',
  'Team Race': 'bg-cyan-500/10 text-cyan-400',
  'Physical': 'bg-red-500/10 text-red-400',
  'Materials': 'bg-orange-500/10 text-orange-400',
}

export default function KarmanaGtoPage() {
  const [xp, setXp] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [recentActivity, setRecentActivity] = useState<Array<{test: string, score: number, total: number, date: string}>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const history = JSON.parse(localStorage.getItem('testHistory') || '[]')
      const totalXp = history.length * 50
      setXp(totalXp)
      setCompletedTasks(history.length)
      setRecentActivity(history.slice(-5).reverse())
    } catch { /* empty */ }
  }, [])

  const rank = [...RANKS].reverse().find(r => xp >= r.min) || RANKS[0]
  const nextRank = RANKS[RANKS.indexOf(rank) + 1]
  const rankProgress = nextRank ? ((xp - rank.min) / (nextRank.min - rank.min)) * 100 : 100

  // Daily mission (date-seeded)
  const today = new Date()
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const dailyTask = GTO_TASKS[daySeed % GTO_TASKS.length]

  // SVG Radar
  const radarLabels = ['Leadership', 'Cooperation', 'Communication', 'Planning', 'Courage', 'Initiative']
  const radarValues = radarLabels.map((_, i) => 0.4 + (((daySeed * (i + 7)) % 60) / 100))
  const radarPoints = radarValues.map((v, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
    return `${50 + v * 40 * Math.cos(angle)},${50 + v * 40 * Math.sin(angle)}`
  }).join(' ')

  if (!mounted) return null

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 space-y-8">
      {/* Header */}
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 rounded-[32px] border border-white/5 bg-[#0f172a] p-5 shadow-2xl md:flex-row md:items-center md:justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 transition-colors hover:text-white">
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Command Center Online
        </div>
      </motion.header>

      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[48px] border border-emerald-500/20 bg-gradient-to-br from-[#064e3b] via-[#043b2f] to-[#022c22] p-10 md:p-16 shadow-2xl"
        style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-orange-500/10 blur-[80px]" />
        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">
            <Sparkles className="h-3 w-3" /> Karmana Operations • GTO Command Center
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase leading-none tracking-tighter text-white">
            GTO <span className="text-emerald-400">Command</span> Center
          </h1>
          <p className="text-emerald-50/70 font-bold text-lg max-w-2xl mx-auto">
            Your tactical operations hub for all 12 GTO tasks. Train, strategize, and master every group testing activity.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { icon: Trophy, label: 'Tasks Done', value: completedTasks },
              { icon: Flame, label: 'Total XP', value: xp },
              { icon: Award, label: 'Current Rank', value: rank.name },
              { icon: Star, label: 'Rank Icon', value: rank.icon },
            ].map(s => (
              <div key={s.label} className="rounded-[20px] border border-white/10 bg-[#0f172a]/70 p-4 text-center backdrop-blur-sm">
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Rank + Daily Mission Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rank Progress */}
        <div className="bg-[#0f172a] rounded-[32px] p-8 border border-white/5">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Rank Progression</h3>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{rank.icon}</span>
            <div className="flex-1">
              <p className="text-white font-black text-xl uppercase">{rank.name}</p>
              <p className="text-slate-500 text-xs font-bold">{xp} XP{nextRank ? ` / ${nextRank.min} XP for ${nextRank.name}` : ' — Maximum Rank!'}</p>
            </div>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all" style={{ width: `${Math.min(rankProgress, 100)}%` }} />
          </div>
        </div>

        {/* Daily Mission */}
        <Link href={dailyTask.href} className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-[32px] p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all group">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-orange-400" />
            <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Daily Mission</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl mb-1">{dailyTask.emoji}</p>
              <p className="text-white font-black text-xl uppercase tracking-tight">{dailyTask.name}</p>
              <p className="text-slate-500 text-xs font-bold mt-1">+{dailyTask.xp} XP Reward</p>
            </div>
            <ChevronRight className="w-6 h-6 text-orange-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* 12 Mission Cards */}
      <div>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">All GTO Missions — 12 Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GTO_TASKS.map((task, i) => (
            <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={task.href}
                className="block bg-[#0f172a] rounded-[28px] p-6 border border-white/5 hover:border-emerald-500/30 hover:scale-[1.02] transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{task.emoji}</span>
                  <div className="flex gap-2">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${catColors[task.category] || 'bg-slate-500/10 text-slate-400'}`}>{task.category}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${diffColors[task.difficulty]}`}>{task.difficulty}</span>
                  </div>
                </div>
                <h3 className="text-white font-black uppercase tracking-tight text-sm mb-1 group-hover:text-emerald-400 transition-colors">{task.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3" /> {task.duration}</span>
                  </div>
                  <span className="text-[9px] font-black text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">+{task.xp} XP</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Radar + Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SVG Radar */}
        <div className="bg-[#0f172a] rounded-[32px] p-8 border border-white/5">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">GTO Competency Radar</h3>
          <svg viewBox="0 0 100 100" className="w-full max-w-[300px] mx-auto">
            {/* Grid rings */}
            {[0.25, 0.5, 0.75, 1].map(r => (
              <polygon key={r} points={radarLabels.map((_, i) => {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
                return `${50 + r * 40 * Math.cos(angle)},${50 + r * 40 * Math.sin(angle)}`
              }).join(' ')} fill="none" stroke="#1e293b" strokeWidth="0.5" />
            ))}
            {/* Axis lines */}
            {radarLabels.map((_, i) => {
              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
              return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(angle)} y2={50 + 40 * Math.sin(angle)} stroke="#1e293b" strokeWidth="0.5" />
            })}
            {/* Data polygon */}
            <polygon points={radarPoints} fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.5" />
            {/* Labels */}
            {radarLabels.map((label, i) => {
              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
              const x = 50 + 48 * Math.cos(angle)
              const y = 50 + 48 * Math.sin(angle)
              return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" className="fill-slate-500 text-[3px] font-bold uppercase">{label}</text>
            })}
          </svg>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0f172a] rounded-[32px] p-8 border border-white/5">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl p-4">
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-tight">{a.test}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{new Date(a.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-emerald-400 font-black text-sm">{a.score}/{a.total}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 font-bold text-sm">No activity yet. Complete a task to see your history!</p>
            </div>
          )}
        </div>
      </div>

      {/* 3D Arena */}
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div id="gto-3d-stage" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[40px] border border-white/5 bg-[#0f172a] shadow-2xl">
          <div className="flex items-center justify-between gap-4 border-b border-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                <Box className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white md:text-2xl">Virtual GTO Ground <span className="text-emerald-400">3D</span></h2>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">Three.js engine • PGT / HGT / CT • training map</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300 md:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" /> 3D mode
            </div>
          </div>
          <div className="p-4 md:p-5"><VirtualGtoGround3D /></div>
        </motion.div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[36px] border border-white/5 bg-[#0f172a] p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Mission Protocol</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">Command Center flow</p>
              </div>
            </div>
            <div className="space-y-3">
              {['Pick a level from the 3D tactical grid.','Select a tool and anchor two safe points.','Bridge the gap, avoid red zones, clear the route.','Track score and unlock the next level.'].map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-black text-emerald-300">{index + 1}</div>
                  <p className="text-sm font-bold leading-relaxed text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* IO Section */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[40px] border border-white/5 bg-[#0f172a] p-4 shadow-2xl">
        <div className="flex items-center gap-3 px-2 pb-4 pt-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
            <Footprints className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">Individual Obstacle Course</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">10 obstacles • 3 minutes • real SSB scoring</p>
          </div>
        </div>
        <IOObstacleGame />
      </motion.section>

      <div className="flex items-center justify-center gap-2 pb-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
        <Zap className="h-3.5 w-3.5 text-emerald-400" /> GTO Command Center • Karmana Operations
      </div>
    </div>
  )
}
