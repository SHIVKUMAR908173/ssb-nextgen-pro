'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Target, ShieldAlert, Crosshair, Navigation, Search, Play, Square, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import cpssData from '@/data/cpss_synthetic.json'

interface CpssScenario {
  scenario: string;
  context: string;
  objectives: string[];
  constraints: string[];
  category: string;
}

const ALL_SCENARIOS: CpssScenario[] = cpssData.sets.flatMap(s => s.scenarios)
const CPSS_DURATION = 900 // 15 minutes in seconds

export default function CpssPage() {
  const [search, setSearch] = useState('')
  const [practiceMode, setPracticeMode] = useState(false)
  const [currentScenario, setCurrentScenario] = useState<CpssScenario | null>(null)
  const [timeLeft, setTimeLeft] = useState(CPSS_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const filtered = ALL_SCENARIOS.filter(s => 
    s.scenario.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startPractice = (scenarioObj?: CpssScenario) => {
    const selected = scenarioObj || ALL_SCENARIOS[Math.floor(Math.random() * ALL_SCENARIOS.length)]
    setCurrentScenario(selected)
    setTimeLeft(CPSS_DURATION)
    setPracticeMode(true)
    setIsRunning(true)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopPractice = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRunning(false)
  }

  const resetPractice = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPracticeMode(false)
    setIsRunning(false)
    setTimeLeft(CPSS_DURATION)
    setCurrentScenario(null)
  }

  const timerPercent = (timeLeft / CPSS_DURATION) * 100
  const timerColor = timerPercent > 50 ? 'bg-emerald-500' : timerPercent > 20 ? 'bg-amber-500' : 'bg-red-500'
  const timerGlow = timerPercent > 50 ? 'shadow-emerald-500/50' : timerPercent > 20 ? 'shadow-amber-500/50' : 'shadow-red-500/50'
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <Link href="/karmana" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Karmana</span>
        </Link>

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">AFSB Special Testing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
            CPSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Simulator</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg font-medium">
            Computerised Pilot Selection System (CPSS) requires rapid cognitive processing, spatial orientation, and psychomotor coordination. Practice decision-making under intense time pressure and complex constraints.
          </p>
        </div>

        {practiceMode && currentScenario ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Timer HUD */}
            <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
              
              <div className="flex items-center gap-8 relative z-10">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="60" className="stroke-white/5 fill-none stroke-[8]" />
                    <circle 
                      cx="64" cy="64" r="60" 
                      className={`fill-none stroke-[8] transition-all duration-1000 ${
                        timerPercent > 50 ? 'stroke-emerald-500' : timerPercent > 20 ? 'stroke-amber-500' : 'stroke-red-500'
                      }`}
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * timerPercent) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className={`text-3xl font-black tracking-tighter ${
                      timerPercent > 50 ? 'text-emerald-400' : timerPercent > 20 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Remaining</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Mission Active</h3>
                  <p className="text-slate-400 text-sm">Analyze constraints, execute objectives, and maintain situational awareness.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                {isRunning ? (
                  <button onClick={stopPractice} className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                    <Square className="w-4 h-4" /> Pause Simulation
                  </button>
                ) : timeLeft > 0 ? (
                  <button onClick={() => startPractice(currentScenario)} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-all shadow-lg">
                    <Play className="w-4 h-4" /> Resume
                  </button>
                ) : (
                  <div className="px-6 py-3 bg-red-500/10 text-red-400 rounded-xl font-black uppercase tracking-widest text-[10px] border border-red-500/20">
                    Simulation Ended
                  </div>
                )}
                <button onClick={resetPractice} className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>

            {/* Scenario Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Scenario & Context */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#162840] rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <Navigation className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">{currentScenario.category} Simulation</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white leading-relaxed mb-8">{currentScenario.scenario}</h2>
                    
                    <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-blue-400" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Context</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm">{currentScenario.context}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objectives & Constraints Sidebar */}
              <div className="space-y-6">
                <div className="bg-[#162840] rounded-3xl p-6 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <Crosshair className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Mission Objectives</h3>
                    </div>
                    <ul className="space-y-4">
                      {currentScenario.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">{i+1}</span>
                          <span className="text-slate-300 text-sm font-medium leading-relaxed">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-[#162840] rounded-3xl p-6 border border-red-500/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Critical Constraints</h3>
                    </div>
                    <ul className="space-y-3">
                      {currentScenario.constraints.map((cons, i) => (
                        <li key={i} className="flex gap-3 items-start p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                          <span className="text-red-200/80 text-sm font-medium leading-relaxed">{cons}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar / List */}
            <div className="lg:col-span-4 bg-[#0f172a] rounded-[32px] p-6 border border-white/5 h-[800px] flex flex-col">
              <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder={`Search ${ALL_SCENARIOS.length} scenarios...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#162840] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                {filtered.map((scenario, i) => (
                  <button
                    key={i}
                    onClick={() => startPractice(scenario)}
                    className="w-full text-left p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Scenario {String(i + 1).padStart(3, '0')}</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">{scenario.category}</span>
                    </div>
                    <p className="text-slate-300 text-sm font-medium line-clamp-2 leading-relaxed">{scenario.scenario}</p>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-sm">No scenarios found matching your search.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Preview / Instructions */}
            <div className="lg:col-span-8 bg-[#0f172a] rounded-[32px] p-12 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
              
              <div className="relative z-10 max-w-lg">
                <div className="w-24 h-24 bg-[#162840] rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Navigation className="w-10 h-10 text-emerald-400" />
                </div>
                
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Start CPSS Training</h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Select a scenario from the list to begin a timed 15-minute simulation. You will be evaluated on your ability to process context, formulate a strategy to meet objectives, and navigate critical constraints.
                </p>
                
                <button 
                  onClick={() => startPractice()}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:-translate-y-1"
                >
                  Start Random Scenario
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
