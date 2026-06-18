'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Zap, Timer, Users, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function SnakeRacePage() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'done'>('idle')
  const [timeLeft, setTimeLeft] = useState(120)
  const [taps, setTaps] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
    if (timeLeft <= 0 && gameState === 'playing') {
      setGameState('done')
      // Calculate coordination score based on tap consistency
      if (taps.length > 2) {
        const intervals = taps.slice(1).map((t, i) => t - taps[i])
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
        const variance = intervals.reduce((s, i) => s + Math.pow(i - avgInterval, 2), 0) / intervals.length
        const consistency = Math.max(0, 100 - Math.sqrt(variance) * 10)
        setScore(Math.round((consistency * taps.length) / 50))
      }
    }
  }, [gameState, timeLeft])

  const startGame = () => { setGameState('playing'); setTimeLeft(120); setTaps([]); setScore(0) }
  const handleHeave = () => { if (gameState === 'playing') setTaps(p => [...p, Date.now()]) }
  const reset = () => { setGameState('idle'); setTimeLeft(120); setTaps([]); setScore(0) }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/karmana/gto" className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Command Center
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-[#064e3b] via-[#043b2f] to-[#022c22] p-12 md:p-16 border border-emerald-500/20 shadow-2xl text-center">
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Team Race • Coordination</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">Snake <span className="text-emerald-400">Race</span></h1>
          <p className="text-emerald-100/70 font-bold text-lg max-w-2xl mx-auto">
            The entire team carries a heavy structure (snake) over obstacles in a <strong className="text-white">timed race</strong> against another group. 
            Coordination, rhythm, and stamina are everything.
          </p>
        </div>
      </motion.div>

      {/* Interactive Simulator */}
      <div className="bg-[#0f172a] rounded-[48px] p-8 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <Timer className="w-5 h-5 text-emerald-500" />
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Coordination Simulator</h3>
        </div>

        {gameState === 'idle' && (
          <div className="text-center py-12 space-y-6">
            <p className="text-slate-400 font-bold">Tap the HEAVE button rhythmically every 2-3 seconds. Consistency = higher score!</p>
            <button onClick={startGame} className="px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl active:scale-95 transition-all shadow-2xl">
              <Zap className="w-4 h-4 inline mr-2" />Start Snake Race
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="text-center py-8 space-y-6">
            <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
              <motion.div className="h-full bg-emerald-500 rounded-full" style={{ width: `${((120 - timeLeft) / 120) * 100}%` }} />
            </div>
            <div className="flex justify-center gap-8">
              <div><p className="text-4xl font-black text-white tabular-nums">{timeLeft}s</p><p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Remaining</p></div>
              <div><p className="text-4xl font-black text-emerald-400">{taps.length}</p><p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Heaves</p></div>
            </div>
            <motion.button onClick={handleHeave} whileTap={{ scale: 0.9 }}
              className="w-40 h-40 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/30 active:shadow-emerald-500/50 transition-all">
              HEAVE!
            </motion.button>
            <p className="text-slate-600 text-xs font-bold">Tap every 2-3 seconds for best coordination score</p>
          </div>
        )}

        {gameState === 'done' && (
          <div className="text-center py-12 space-y-6">
            <p className="text-4xl font-black text-emerald-400">Score: {score}</p>
            <p className="text-slate-400 font-bold">You completed {taps.length} heaves in 120 seconds</p>
            <p className="text-slate-500 text-sm">{score >= 80 ? '🏆 OUTSTANDING coordination!' : score >= 50 ? '✅ Good rhythm, keep practicing!' : '⚠️ Work on consistency — tap every 2-3 seconds'}</p>
            <button onClick={reset} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-xs rounded-2xl border border-white/10 flex items-center gap-2 mx-auto">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}
      </div>

      {/* Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-[32px] p-8">
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-5">✅ Winning Strategy</h3>
          <ul className="space-y-3">
            {['Call out a rhythm: "1-2-3-HEAVE" for team synchronization','Start at medium pace — don\'t sprint early','Rotate tired members to the middle (less weight)','Communicate upcoming obstacles loudly','Sprint in the final 20 meters for maximum impact'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /><span className="text-slate-300 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/5 border border-red-500/15 rounded-[32px] p-8">
          <h3 className="text-red-400 font-black uppercase tracking-widest text-[10px] mb-5">❌ Common Mistakes</h3>
          <ul className="space-y-3">
            {['Dropping the snake — immediate penalty','Going too fast too early — team burns out','Not communicating obstacles ahead','Individual members letting go or slacking','Blaming teammates when things go wrong'].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /><span className="text-slate-400 text-sm font-medium">{item}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F]">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">OLQs Assessed</h3>
        <div className="flex flex-wrap gap-3">
          {['Stamina','Cooperation','Group Influencing','Determination','Courage','Liveliness'].map(o => (
            <span key={o} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full">{o}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
