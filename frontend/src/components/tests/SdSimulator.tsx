'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserCircle, PenTool, Brain, CheckCircle2, ArrowLeft, Radio, Sparkles, Target, Zap, Loader2, AlertTriangle, ChevronRight, ChevronLeft, Star } from 'lucide-react'
import Link from 'next/link'

const SD_SECTIONS = [
  { id: 'parents', label: 'Parents Opinion', placeholder: 'Describe how your parents perceive you — your character, reliability, strengths and weaknesses in their eyes. Be specific and honest. (e.g., "My father believes I am disciplined but sometimes too stubborn when I believe I am right. My mother says I am caring but need to be more organized...")' },
  { id: 'teachers', label: 'Teachers / Employers Opinion', placeholder: 'How do your teachers, professors, or employers describe you? Academic/professional conduct, social behavior, leadership potential in their eyes. Mention specific incidents.' },
  { id: 'friends', label: 'Friends / Colleagues Opinion', placeholder: 'What do your closest friends or colleagues say about you? Your role in the group/team, your energy, your reliability. Be honest — include both what they admire and what they tease you about.' },
  { id: 'subordinates', label: 'Subordinates Opinion (Optional)', placeholder: 'If you have led a team, how do your subordinates perceive your leadership? Describe how you manage conflicts and inspire them. Leave blank if not applicable.' },
  { id: 'self', label: 'Self Assessment', placeholder: 'Objectively assess yourself. What are your 2-3 genuine strengths with real evidence? What are your 2-3 real weaknesses (not fake ones like "I work too hard") and what are you actively doing to fix them?' },
  { id: 'aims', label: 'Officer Vision', placeholder: 'What kind of officer do you aspire to be? Be specific — which branch/arm, what qualities you want to embody, and WHY the Armed Forces (not generic "serve the nation" — be personal and specific).' },
]

interface SdEvaluation {
  board_verdict: string
  authenticity_rating: string
  consistency_check: string
  psychological_self_awareness_score: number
  section_evaluations: Array<{
    section: string
    candidate_response: string
    strengths: string[]
    weaknesses: string[]
    authenticity_concern: string
    ideal_rewrite: string
  }>
  weakness_quality_assessment: string
  olq_projection_from_sd: Array<{ olq: string; score: number; sd_evidence: string }>
  ideal_weakness_statement: string
  ideal_officer_vision: string
  sd_coaching_protocol: string
  overall_sd_score: number
}

const TIMER_SECONDS = 15 * 60 // 15 minutes

export interface SdSimulatorProps {
    isFullBattery?: boolean;
    onComplete?: (responses: Record<string, string>) => void;
}

export default function SdSimulator({ isFullBattery, onComplete }: SdSimulatorProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<'WRITING' | 'EVALUATING' | 'RESULTS'>('WRITING')
  const [evaluation, setEvaluation] = useState<SdEvaluation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Countdown timer for writing phase
  useEffect(() => {
    if (phase === 'WRITING' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (phase === 'WRITING' && timeLeft === 0) {
      // Auto-submit when time runs out
      if (allComplete) handleSubmit()
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase, timeLeft])

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const timerColor = timeLeft > 300 ? 'text-emerald-400' : timeLeft > 120 ? 'text-yellow-400' : 'text-red-400'
  const timerBg = timeLeft > 300 ? 'bg-emerald-500/10 border-emerald-500/20' : timeLeft > 120 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20 animate-pulse'

  const currentSectionData = SD_SECTIONS[currentSection]
  const currentResponse = responses[currentSectionData.id] || ''
  const allComplete = SD_SECTIONS.every(s => (responses[s.id] || '').trim().length > 50)

  const handleSubmit = async () => {
    if (isFullBattery && onComplete) {
        onComplete(responses);
        return;
    }
    setPhase('EVALUATING')
    setError(null)
    try {
      const sections = SD_SECTIONS.map(s => ({
        section: s.label,
        response: responses[s.id] || '[NOT ATTEMPTED]'
      }))
      const res = await fetch('/api/ai-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            type: 'sd',
            content: JSON.stringify(sections)
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        setEvaluation(data.evaluation)
        
        // Save to localStorage for Assessment Hub
        try {
            const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
            history.push({
                id: `SD-${Date.now()}`,
                test: 'Self Description',
                score: data.evaluation.overall_sd_score || 80,
                total: 100,
                date: new Date().toISOString(),
                status: 'completed',
                improvements: (data.evaluation.overall_sd_score || 80) >= 70 
                    ? ['Maintain authenticity', 'Ensure consistent reflection']
                    : ['Re-evaluate self awareness', 'Work on specific weaknesses']
            });
            localStorage.setItem('testHistory', JSON.stringify(history));
        } catch (err) {
            console.error('Failed to save test history', err);
        }

        setPhase('RESULTS')
      } else {
        setError(data.error || 'Evaluation failed')
        setPhase('WRITING')
      }
    } catch (e: any) {
      setError(e.message)
      setPhase('WRITING')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (phase === 'EVALUATING') {
    return (
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh] gap-10">
        <div className="relative">
          <div className="w-32 h-32 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20 shadow-2xl">
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
          </div>
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-[40px] animate-pulse"></div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Board President Analyzing...</h2>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Authenticity audit · Cross-section consistency · OLQ mapping · Ideal response generation</p>
        </div>
      </div>
    )
  }

  if (phase === 'RESULTS' && evaluation) {
    const authColor = evaluation.authenticity_rating?.includes('AUTHENTIC') ? 'text-emerald-400' : evaluation.authenticity_rating?.includes('SEMI') ? 'text-yellow-400' : 'text-red-400'

    return (
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        <div className="flex items-center justify-between">
          <button onClick={() => { setPhase('WRITING'); setEvaluation(null) }} className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
            <ArrowLeft className="w-3 h-3" /> Redo Assessment
          </button>
          <div className={`text-2xl font-black tabular-nums ${getScoreColor(evaluation.overall_sd_score)}`}>
            SD Score: {evaluation.overall_sd_score}/100
          </div>
        </div>

        {/* Board President Verdict */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#162840] rounded-[48px] p-12 border border-[#1E3A5F] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"></div>
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-14 h-14 bg-purple-600 rounded-[20px] flex items-center justify-center shadow-2xl">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Board President Verdict</p>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Know Thyself: Report</h3>
            </div>
          </div>
          <p className="text-slate-300 text-lg font-bold leading-relaxed italic relative z-10 mb-8">"{evaluation.board_verdict}"</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Authenticity</p>
              <p className={`text-sm font-black ${authColor} uppercase tracking-tight`}>{evaluation.authenticity_rating}</p>
            </div>
            <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Consistency</p>
              <p className={`text-sm font-black ${evaluation.consistency_check?.includes('CONSISTENT') ? 'text-emerald-400' : 'text-red-400'} uppercase tracking-tight`}>{evaluation.consistency_check}</p>
            </div>
            <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Self-Awareness</p>
              <p className={`text-2xl font-black tabular-nums ${getScoreColor(evaluation.psychological_self_awareness_score * 10)}`}>{evaluation.psychological_self_awareness_score}/10</p>
            </div>
          </div>
        </motion.div>

        {/* Section-by-Section Analysis */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
            <Brain className="w-8 h-8 text-purple-500" /> Section Intelligence Report
          </h2>
          {evaluation.section_evaluations?.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#162840] rounded-[40px] p-10 border border-[#1E3A5F] shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{section.section}</h3>
                <span className="bg-purple-500/10 text-purple-400 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-purple-500/20">{section.authenticity_concern}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {section.strengths?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Strengths</p>
                      {section.strengths.map((s, j) => (
                        <div key={j} className="flex items-start gap-3 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.weaknesses?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Critical Weaknesses</p>
                      {section.weaknesses.map((w, j) => (
                        <div key={j} className="flex items-start gap-3 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{w}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-[#0f172a] rounded-[32px] p-8 border border-purple-500/20 shadow-inner">
                  <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles className="w-3 h-3" /> Ideal Model Response</p>
                  <p className="text-slate-300 text-sm font-bold leading-relaxed italic">"{section.ideal_rewrite}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ideal Statements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#162840] rounded-[40px] p-10 border border-[#1E3A5F] shadow-2xl">
            <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Star className="w-3 h-3" /> Model Weakness Statement</p>
            <p className="text-slate-300 font-bold leading-relaxed italic text-lg">"{evaluation.ideal_weakness_statement}"</p>
          </div>
          <div className="bg-[#162840] rounded-[40px] p-10 border border-[#1E3A5F] shadow-2xl">
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-3 h-3" /> Ideal Officer Vision</p>
            <p className="text-slate-300 font-bold leading-relaxed italic text-lg">"{evaluation.ideal_officer_vision}"</p>
          </div>
        </div>

        {/* Coaching Protocol */}
        {evaluation.sd_coaching_protocol && (
          <div className="bg-purple-600 rounded-[40px] p-10 shadow-2xl shadow-purple-600/10 text-center">
            <p className="text-[9px] font-black text-purple-200 uppercase tracking-widest mb-3">Board-Prescribed Reform Protocol</p>
            <p className="text-white font-black text-lg leading-relaxed">{evaluation.sd_coaching_protocol}</p>
          </div>
        )}
      </div>
    )
  }

  // WRITING PHASE
  return (
    <div className="w-full mx-auto space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f172a] rounded-[48px] p-16 overflow-hidden border border-white/5 relative shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center md:text-left">
            <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto md:mx-0">
              <Brain className="w-3 h-3 text-purple-500" />
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em]">Know Thyself · Board President AI</span>
            </div>
            <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              Self <span className="text-purple-600">Description</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-lg font-bold">
              Write authentically across all 5 sections. The Board President AI will analyze your psychological profile, detect coached responses, and give you IDEAL model answers.
            </p>
          </div>
          <div className="bg-[#162840] border border-white/5 rounded-[40px] p-10 text-center min-w-[240px] shadow-2xl">
            <UserCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <p className="text-3xl font-black text-white">{Object.keys(responses).filter(k => (responses[k] || '').trim().length > 50).length}/5</p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Sections Complete</p>
          </div>
        </div>
      </motion.div>

      {/* Section Navigator */}
      <div className="flex flex-wrap gap-3">
        {SD_SECTIONS.map((section, i) => {
          const isDone = (responses[section.id] || '').trim().length > 50
          return (
            <button key={section.id} onClick={() => setCurrentSection(i)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all border ${
                currentSection === i ? 'bg-purple-600 text-white border-purple-600 shadow-2xl' : isDone ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-[#162840] text-slate-500 border-white/5'
              }`}
            >
              {isDone && <CheckCircle2 className="w-3 h-3" />}
              {i + 1}. {section.label}
            </button>
          )
        })}
      </div>

      {/* Writing Area */}
      <AnimatePresence mode="wait">
        <motion.div key={currentSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-[#162840] rounded-[48px] p-12 border border-[#1E3A5F] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-600 rounded-[20px] flex items-center justify-center text-white font-black text-xl shadow-2xl">
                {currentSection + 1}
              </div>
              <div>
                <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Section {currentSection + 1} of 5</p>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">{currentSectionData.label}</h2>
              </div>
            </div>

            <textarea
              value={currentResponse}
              onChange={(e) => setResponses(prev => ({ ...prev, [currentSectionData.id]: e.target.value }))}
              placeholder={currentSectionData.placeholder}
              rows={10}
              className="w-full bg-[#0f172a] border border-white/5 rounded-[32px] p-8 text-white placeholder-slate-700 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all resize-none font-bold text-base leading-relaxed shadow-inner"
            />

            <div className="flex items-center justify-between">
              <p className={`text-[10px] font-black uppercase tracking-widest ${currentResponse.length < 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                {currentResponse.length < 50 ? `Write at least ${50 - currentResponse.length} more characters` : `✓ ${currentResponse.length} characters`}
              </p>
              <div className="flex gap-4">
                {currentSection > 0 && (
                  <button onClick={() => setCurrentSection(s => s - 1)} className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-slate-400 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[9px] border border-white/5 transition-all">
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                )}
                {currentSection < SD_SECTIONS.length - 1 ? (
                  <button onClick={() => setCurrentSection(s => s + 1)} className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-2xl transition-all active:scale-95">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={!allComplete} className="flex items-center gap-3 px-10 py-4 bg-white hover:bg-slate-100 text-[#0f172a] rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-2xl transition-all active:scale-95 disabled:opacity-30 group">
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Get Board Analysis
                  </button>
                )}
              </div>
            </div>

            {error && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">{error}</p>}
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
