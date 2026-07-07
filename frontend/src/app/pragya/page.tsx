'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, BookOpen, Brain, Calculator, ChevronRight, 
  Globe, Landmark, Lock, MessageSquare, Play, Shield, 
  Sparkles, Target, Database, CheckCircle2, Search
} from 'lucide-react'
import Link from 'next/link'
import { STUDY_CATEGORIES } from '@/data/study_architecture'

const iconMap: Record<string, any> = {
  Calculator, Globe, BookOpen, Landmark, Brain, 
  MessageSquare, BrainCircuit: Brain, Shield
}

const colorMap: Record<string, string> = {
  blue: 'from-blue-600 to-blue-400 border-blue-500/20 text-blue-400',
  emerald: 'from-emerald-600 to-emerald-400 border-emerald-500/20 text-emerald-400',
  cyan: 'from-cyan-600 to-cyan-400 border-cyan-500/20 text-cyan-400',
  orange: 'from-orange-600 to-orange-400 border-orange-500/20 text-orange-400',
  purple: 'from-purple-600 to-purple-400 border-purple-500/20 text-purple-400',
  rose: 'from-rose-600 to-rose-400 border-rose-500/20 text-rose-400',
}

export default function PragyaDashboard() {
  const [activeCategory, setActiveCategory] = useState(STUDY_CATEGORIES[0].id)
  const [searchQuery, setSearchQuery] = useState('')

  const activeCatData = STUDY_CATEGORIES.find(c => c.id === activeCategory)!

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Link 
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Base
        </Link>
        
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search 1000+ topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f172a] border border-white/5 rounded-full py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 font-bold"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pragya Data Uplink</span>
        </div>
      </div>

      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] rounded-[48px] p-12 md:p-16 overflow-hidden border border-white/5 relative shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-6">
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                 <Database className="w-3 h-3 text-indigo-500" />
                 <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Intel Hub</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                 Pragya <span className="text-indigo-500">Study Base</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-bold">
                 Access 1000+ tactical study modules for NDA, CDS, AFCAT, and SSB. Master concepts, take quizzes, and track your syllabus progression.
              </p>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#162840] border border-white/5 rounded-[32px] p-6 shadow-2xl flex flex-col items-center justify-center text-center">
                 <BookOpen className="w-8 h-8 text-indigo-500 mb-3" />
                 <p className="text-3xl font-black text-white">45<span className="text-sm text-slate-500">%</span></p>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Syllabus Completion</p>
              </div>
              <div className="bg-[#162840] border border-white/5 rounded-[32px] p-6 shadow-2xl flex flex-col items-center justify-center text-center">
                 <Target className="w-8 h-8 text-emerald-500 mb-3" />
                 <p className="text-3xl font-black text-white">12</p>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Active Modules</p>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar: Categories */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#162840] rounded-[40px] p-8 border border-white/5 shadow-2xl">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Study Streams</h2>
            <div className="space-y-3">
              {STUDY_CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id
                return (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left p-5 rounded-3xl border transition-all flex items-center justify-between group
                      ${isActive 
                        ? `bg-slate-900 border-white/10` 
                        : `bg-transparent border-transparent hover:bg-white/[0.02]`
                      }`}
                  >
                    <div>
                      <h3 className={`font-black uppercase tracking-widest text-sm mb-1 ${isActive ? colorMap[cat.color].split(' ')[2] : 'text-slate-400'}`}>
                        {cat.title}
                      </h3>
                      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{cat.modules.length} Modules</p>
                    </div>
                    {isActive && <ChevronRight className={`w-5 h-5 ${colorMap[cat.color].split(' ')[2]}`} />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content: Modules */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0f172a] rounded-[48px] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] bg-${activeCatData.color}-500/5`}></div>
            
            <div className="relative z-10 mb-10">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{activeCatData.title}</h2>
              <p className="text-slate-400 font-bold">{activeCatData.description}</p>
            </div>

            <div className="space-y-6 relative z-10">
              {activeCatData.modules.map(mod => {
                const Icon = iconMap[mod.icon] || BookOpen
                return (
                  <div key={mod.id} className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] shadow-xl">
                    <div className="flex items-start gap-5 mb-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${colorMap[activeCatData.color].split(' ').slice(0,2).join(' ')} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{mod.title}</h3>
                        <p className="text-slate-400 text-sm font-bold">{mod.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {mod.chapters.map((chap, i) => (
                        <Link 
                          key={chap.id} 
                          href={chap.status === 'locked' ? '#' : `/pragya/reader/${chap.id}`}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all
                            ${chap.status === 'locked' 
                              ? 'bg-black/20 border-white/5 opacity-60 cursor-not-allowed' 
                              : 'bg-slate-900 border-white/5 hover:border-white/20 hover:bg-slate-800'
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-slate-600 font-black font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
                            <div>
                              <p className="text-white font-bold text-sm mb-0.5 flex items-center gap-2">
                                {chap.title}
                                {chap.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              </p>
                              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                <span>{chap.type}</span>
                                <span>•</span>
                                <span>{chap.readTime}m</span>
                                <span>•</span>
                                <span className={
                                  chap.difficulty === 'Beginner' ? 'text-emerald-500/70' :
                                  chap.difficulty === 'Intermediate' ? 'text-yellow-500/70' :
                                  'text-red-500/70'
                                }>{chap.difficulty}</span>
                              </div>
                            </div>
                          </div>
                          {chap.status === 'locked' ? (
                            <Lock className="w-5 h-5 text-slate-700" />
                          ) : (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 ${colorMap[activeCatData.color].split(' ')[2]}`}>
                              <Play className="w-3 h-3 ml-0.5" />
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-[32px] p-8 border border-indigo-500/20 shadow-2xl relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-black text-white uppercase tracking-widest">More Intel Coming Soon</h3>
              </div>
              <p className="text-slate-400 font-bold text-sm max-w-md">
                We are constantly declassifying new study modules. Expect updates on Advanced GTO Tactics, Service Profiles, and CPSS Phase-2 synthetic testing shortly.
              </p>
            </div>
            <div className="relative z-10 hidden md:block">
              <div className="px-6 py-3 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
                Deployment Pending
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
