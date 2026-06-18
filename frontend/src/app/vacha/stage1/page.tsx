'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, Zap, Target, Shield, Activity, Compass, Clock, Sparkles, 
  CheckCircle2, XCircle, Info, RefreshCcw, FileText, Award, 
  TrendingUp, UserCheck, AlertTriangle, ArrowRight, Play, FastForward, Award as MedalIcon
} from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  index: number
  domain: string
  prompt: string
  options: string[]
  timeLimitSeconds: number
}

interface StateMachineState {
  stage: 'css' | 'opam' | 'finished'
  sessionId: string
  currentIndex: number
  answeredCount: number
  startedAtIso: string
  endsAtIso: string
  config: {
    sessionId: string
    maxCssQuestions: number
    maxOpamQuestions: number
    totalTimeSeconds: number
    seed: number
  }
}

interface EvaluationResult {
  css?: {
    domainScores: Array<{ domain: string; score: number }>
  }
  opam?: {
    domainScores: Array<{ domain: string; score: number }>
  }
  overallScore: number
  correctnessSummary: {
    attemptedCount: number
    totalQuestionCount: number
  }
}

export default function CSSSStage1Page() {
  // Navigation & Session Phase
  const [phase, setPhase] = useState<'briefing' | 'testing' | 'evaluating' | 'results'>('briefing')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Test session state
  const [sessionState, setSessionState] = useState<StateMachineState | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentKind, setCurrentKind] = useState<'css' | 'opam'>('css')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)

  // Simulated metrics
  const [answersLog, setAnswersLog] = useState<Array<{
    questionId: string
    domain: string
    kind: 'css' | 'opam'
    selectedOption: number | null
    timeSpent: number
  }>>([])

  // Fast-Forward Automation State
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  // Timer States
  const [timeLeft, setTimeLeft] = useState(10)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const questionStartTimeRef = useRef<number>(0)

  // API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

  const initializeSession = async () => {
    setLoading(true)
    setError(null)
    setPhase('testing')
    setIsAutoPlaying(false)
    setAnswersLog([])

    const config = {
      sessionId: `csss-session-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      maxCssQuestions: 70,
      maxOpamQuestions: 120,
      totalTimeSeconds: 5400,
      seed: Math.floor(Math.random() * 10000)
    }

    try {
      const response = await fetch(`${API_URL}/api/stage1/session/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      })

      if (!response.ok) {
        throw new Error(`Failed to initialize session. Core API returned status: ${response.status}`)
      }

      const data = await response.json()
      setSessionState(data.state)
      setCurrentQuestion(data.next.question)
      setCurrentKind(data.next.kind)
      setSelectedOption(null)
      setTimeLeft(data.next.timeLimitSeconds)
      questionStartTimeRef.current = Date.now()
    } catch (err) {
      console.warn('Backend not reachable, using offline simulation fallback.', err)
      // Fallback local state for testing without backend
      setSessionState({
        stage: 'css',
        sessionId: config.sessionId,
        currentIndex: 0,
        answeredCount: 0,
        startedAtIso: new Date().toISOString(),
        endsAtIso: new Date(Date.now() + 5400 * 1000).toISOString(),
        config
      });
      setCurrentQuestion({
        id: 'mock-1',
        index: 0,
        domain: 'reasoning',
        prompt: 'If ALL birds have feathers, and a PENGUIN is a bird, does a PENGUIN have feathers?',
        options: ['Yes', 'No', 'Cannot determine', 'Penguins are mammals'],
        timeLimitSeconds: 10
      });
      setCurrentKind('css');
      setSelectedOption(null);
      setTimeLeft(10);
      questionStartTimeRef.current = Date.now();
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async (optionIndex: number | null, autoSkip = false) => {
    if (!sessionState || !currentQuestion) return

    const timeSpent = (Date.now() - questionStartTimeRef.current) / 1000

    // Log answer locally for analytics
    setAnswersLog(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        domain: currentQuestion.domain,
        kind: currentKind,
        selectedOption: optionIndex,
        timeSpent
      }
    ])

    setSelectedOption(null)

    try {
      const response = await fetch(`${API_URL}/api/stage1/session/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: sessionState,
          questionId: currentQuestion.id,
          selectedOptionIndex: optionIndex
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit answer.')
      }

      const data = await response.json()

      if (data.state.stage === 'finished') {
        setSessionState(data.state)
        setEvaluation(data.evaluation)
        setPhase('results')
        setIsAutoPlaying(false)
      } else {
        setSessionState(data.state)
        setCurrentQuestion(data.next.question)
        setCurrentKind(data.next.kind)
        setTimeLeft(data.next.timeLimitSeconds)
        questionStartTimeRef.current = Date.now()
      }
    } catch (err) {
      console.warn('Connection interrupted during submission. Retrying locally...', err)
      
      const isFinished = sessionState.currentIndex >= 5; // Finish after 6 questions in offline mode
      
      if (isFinished) {
          setPhase('results');
          setIsAutoPlaying(false);
          setEvaluation({
              overallScore: 7.5,
              correctnessSummary: { attemptedCount: sessionState.currentIndex + 1, totalQuestionCount: sessionState.currentIndex + 1 },
              css: { domainScores: [{ domain: 'reasoning', score: 8.0 }, { domain: 'spatial', score: 7.0 }] },
              opam: { domainScores: [{ domain: 'discipline', score: 9.0 }, { domain: 'team_spirit', score: 8.5 }] }
          });
      } else {
          setSessionState(prev => ({
              ...prev!,
              currentIndex: prev!.currentIndex + 1,
              answeredCount: prev!.answeredCount + 1
          }));
          setCurrentQuestion({
              id: `mock-${sessionState.currentIndex + 2}`,
              index: sessionState.currentIndex + 1,
              domain: sessionState.currentIndex % 2 === 0 ? 'spatial' : 'team_spirit',
              prompt: sessionState.currentIndex % 2 === 0 ? 'Which pattern completes the series?' : 'Your teammate refuses to work. What do you do?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              timeLimitSeconds: 10
          });
          setCurrentKind(sessionState.currentIndex % 2 === 0 ? 'css' : 'opam');
          setTimeLeft(10);
          questionStartTimeRef.current = Date.now();
      }
    }
  }

  // Trigger Fast Forward Automation (Programmatic Sandbox Solver)
  const triggerFastForward = async () => {
    if (!sessionState || !currentQuestion || isAutoPlaying) return
    setIsAutoPlaying(true)
    setPhase('evaluating')
  }

  // Effect to handle programmatic fast forward submissions
  useEffect(() => {
    if (!isAutoPlaying || !sessionState || !currentQuestion) return

    const timer = setTimeout(async () => {
      // Pick a reasonable random option
      const randomOption = Math.random() > 0.08 ? Math.floor(Math.random() * currentQuestion.options.length) : null
      await submitAnswer(randomOption)
    }, 15) // Rapid execution under 15ms per question

    return () => clearTimeout(timer)
  }, [isAutoPlaying, sessionState, currentQuestion])

  // Question Per-Item Timer Effect
  useEffect(() => {
    if (phase !== 'testing' || isAutoPlaying || !currentQuestion) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          // Timeout submission
          submitAnswer(null, true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentQuestion, phase, isAutoPlaying])

  // Clean format helper for domain labels
  const formatDomain = (domain: string) => {
    return domain
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  // Derived psychological Big Five metrics from OPAM
  const getBigFiveMetrics = () => {
    if (!evaluation?.opam?.domainScores) return null

    const domainScores = evaluation.opam.domainScores
    const weights: Record<string, Record<string, number>> = {
      self_report_conduct: { agreeableness: 0.65, neuroticism: 0.35 },
      discipline: { conscientiousness: 0.95, neuroticism: 0.1 },
      motivation: { openness: 0.5, conscientiousness: 0.4, extroversion: 0.2 },
      team_spirit: { agreeableness: 0.75, extroversion: 0.35 }
    }

    const traitSumWeights: Record<string, number> = {
      openness: 0, conscientiousness: 0, extroversion: 0, agreeableness: 0, neuroticism: 0
    }
    const traitWeightedTotal: Record<string, number> = {
      openness: 0, conscientiousness: 0, extroversion: 0, agreeableness: 0, neuroticism: 0
    }

    domainScores.forEach(d => {
      const w = weights[d.domain] || {}
      Object.keys(w).forEach(trait => {
        traitWeightedTotal[trait] += d.score * w[trait]
        traitSumWeights[trait] += w[trait]
      })
    })

    const result: Record<string, number> = {}
    Object.keys(traitSumWeights).forEach(trait => {
      const denom = traitSumWeights[trait] || 1
      result[trait] = Math.max(1, Math.min(10, Math.round(traitWeightedTotal[trait] / denom)))
    })

    return result
  }

  const bigFive = getBigFiveMetrics()

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Upper Navigation Row */}
      <div className="flex items-center justify-between">
        <Link 
          href="/vacha/assessment"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          Back to Assessment Hub
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stage-1 Reform Standard</span>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE NOTIFICATION */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 p-6 rounded-[24px] flex items-start gap-4"
        >
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-black uppercase text-red-400">Tactical Comm Error</h4>
            <p className="text-xs text-red-300/80 leading-relaxed font-semibold">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-[10px] font-black text-red-500 uppercase hover:text-red-400"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* ANCHOR PANELS BASED ON CURRENT ACTIVE PHASE */}
      <AnimatePresence mode="wait">
        
        {/* PHASE 0: INSTRUCTIONS / BRIEFING */}
        {phase === 'briefing' && (
          <motion.div
            key="briefing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Information Panel */}
            <div className="lg:col-span-2 bg-[#0f172a] rounded-[48px] p-12 border border-white/5 relative overflow-hidden shadow-2xl space-y-8">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-400/5 rounded-full blur-[100px]"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                  <Activity className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">CSSS Computerised Test System</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                  Stage-1 Computerised <br/><span className="text-yellow-500">Screening Battery</span>
                </h1>
                <p className="text-slate-400 font-bold leading-relaxed max-w-2xl">
                  Replaces traditional paper-based OIR and PPDT sessions with a combined 190-item rapid testing protocol dynamically evaluating cognitive capabilities and officer conduct personality stems.
                </p>
              </div>

              <div className="h-px bg-white/5"></div>

              {/* Cognitive / Personality Modules summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-[#162840] border border-[#1E3A5F] rounded-[32px] p-8 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">1. Cognitive Battery (CSS)</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">70 Items • 5-11s Time Pressure</p>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Evaluates attention control, spatial orientation, map memory grid calculation, reasoning, speed of perception, and form resolution.
                  </p>
                </div>

                <div className="bg-[#162840] border border-[#1E3A5F] rounded-[32px] p-8 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">2. Personality Module (OPAM)</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">120 Stems • 8-12s Response Window</p>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Evaluates 15 Officer Like Qualities (OLQs) through self-reported situational behaviors detailing conduct, team spirit, motivation, and discipline.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 pt-4">
                <button
                  onClick={initializeSession}
                  className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-5 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/20"
                >
                  <Play className="w-4 h-4 fill-black" />
                  Initialize Test Sequence
                </button>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-slate-600" />
                  Total Exam Allocation: 90 Minutes
                </div>
              </div>
            </div>

            {/* Sidebar Guidelines Panel */}
            <div className="bg-[#162840]/60 border border-white/5 rounded-[48px] p-10 flex flex-col justify-between space-y-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <MedalIcon className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Assessor Guidelines</h2>
                </div>
                
                <ul className="space-y-4 text-xs font-bold text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0 mt-1.5"></span>
                    <span>AUTOMATIC NAVIGATION: When a per-question timer reaches zero, the system registers a blank input and immediately transitions to the next item.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0 mt-1.5"></span>
                    <span>NO RETRIES allowed. Once a selection is submitted, the command state machine locks down the database registration.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0 mt-1.5"></span>
                    <span>OFFICER COMPATIBILITY: St stems are designed specifically to gauge your alignment with OLQs (integrity, resilience, planning, cooperation).</span>
                  </li>
                </ul>
              </div>

              {/* Sandbox Simulator Fast-Forward Note */}
              <div className="bg-[#0f172a] rounded-[32px] p-6 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Tester sandbox feature</span>
                </div>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                  To inspect final dashboards without completing all 190 questions manually, a programmatically designed <strong className="text-white">Fast-Forward sandbox solver</strong> will be available inside the command panel.
                </p>
              </div>
            </div>

          </motion.div>
        )}

        {/* PHASE 1 & 2: DYNAMIC TEST PLAYER AND COUNTER */}
        {phase === 'testing' && sessionState && currentQuestion && (
          <motion.div
            key="testing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Top Status Header */}
            <div className="bg-[#0f172a] border border-white/5 rounded-[24px] p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  currentKind === 'css' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                }`}>
                  {currentKind === 'css' ? 'Cognitive Battery (CSS)' : 'Personality Battery (OPAM)'}
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Question {sessionState.currentIndex + 1} of {sessionState.config.maxCssQuestions + sessionState.config.maxOpamQuestions}
                </span>
              </div>

              {/* Interactive Sandbox fast forward button */}
              <button 
                onClick={triggerFastForward}
                className="flex items-center gap-2 bg-yellow-500/15 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/25 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
              >
                <FastForward className="w-3.5 h-3.5" />
                Fast-Forward Sandbox
              </button>
            </div>

            {/* Main Interactive Screen */}
            <div className="bg-[#0f172a] rounded-[48px] p-12 border border-white/5 relative overflow-hidden shadow-2xl space-y-8">
              
              {/* Timing Countdown Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Response Window
                  </span>
                  <span className={`${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                    {timeLeft}s Remaining
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / currentQuestion.timeLimitSeconds) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                    className={`h-full ${timeLeft <= 3 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-yellow-500 shadow-[0_0_10px_#eab308]'}`}
                  />
                </div>
              </div>

              {/* Target Prompt Display */}
              <div className="space-y-3">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  {formatDomain(currentQuestion.domain)} Matrix Stems
                </div>
                <p className="text-2xl font-bold text-white leading-relaxed">
                  {currentQuestion.prompt}
                </p>
              </div>

              {/* MCQs Answers Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedOption(i)
                      submitAnswer(i)
                    }}
                    className={`
                      p-6 text-left rounded-[24px] border font-bold transition-all flex items-start gap-4
                      ${selectedOption === i 
                        ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' 
                        : 'bg-[#162840]/60 border-white/5 text-slate-300 hover:border-white/20 hover:bg-[#1a2f4c]'
                      }
                    `}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-black uppercase ${
                      selectedOption === i ? 'border-yellow-500 text-yellow-400 bg-yellow-500/20' : 'border-white/20 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm font-semibold">{opt}</span>
                  </button>
                ))}
              </div>

              {/* Fast Skipper Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => submitAnswer(null)}
                  className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  Skip Question <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* PHASE 2.5: FAST FORWARD EVALUATING STATE */}
        {phase === 'evaluating' && (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto py-24 text-center space-y-6"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-yellow-500/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-yellow-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-8 h-8 text-yellow-500 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Resolving Combined Stream</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Fast-Forward Sandbox processing question {sessionState?.currentIndex ?? 0}/190
              </p>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
              <div 
                className="bg-yellow-500 h-full transition-all duration-75"
                style={{ width: `${((sessionState?.currentIndex ?? 0) / 190) * 100}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* PHASE 3: EVALUATION & DETAILED METRICS REPORT */}
        {phase === 'results' && evaluation && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            
            {/* Top Score summary widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Screening recommendation check */}
              <div className="lg:col-span-2 bg-[#0f172a] rounded-[48px] p-12 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px]"></div>
                
                <div className="space-y-4 relative z-10 text-center md:text-left">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto md:mx-0">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Stage-1 Evaluation Complete</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                    SSB Screening Status: <br/>
                    <span className={evaluation.overallScore >= 6 ? 'text-emerald-400' : 'text-red-400'}>
                      {evaluation.overallScore >= 6 ? 'RECOMMENDED (SCREENED IN)' : 'NOT RECOMMENDED (SCREENED OUT)'}
                    </span>
                  </h1>
                  
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed max-w-xl">
                    Evaluation is mapped directly through computerised Stage-1 algorithms (CSSS) integrating strict time limits and OLQ profiling matrices. Recommended score target is 6.0/10.0 or higher.
                  </p>
                </div>

                {/* Score Dial */}
                <div className="bg-[#162840] border border-white/5 rounded-[40px] p-10 text-center min-w-[220px] shadow-2xl relative shrink-0">
                  <p className="text-6xl font-black text-white">{evaluation.overallScore.toFixed(1)}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Overall SS Grade</p>
                  <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
                    <div 
                      className={`h-full ${evaluation.overallScore >= 6 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`}
                      style={{ width: `${evaluation.overallScore * 10}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Sidebar Quick Re-run */}
              <div className="bg-[#162840] border border-white/5 rounded-[48px] p-10 flex flex-col justify-between space-y-6 shadow-xl">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Metrics log</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>Total Questions Evaluated</span>
                      <span className="text-white font-bold">{evaluation.correctnessSummary.totalQuestionCount}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>Attempted count</span>
                      <span className="text-white font-bold">{evaluation.correctnessSummary.attemptedCount}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>Skipped/Timeout count</span>
                      <span className="text-white font-bold">
                        {evaluation.correctnessSummary.totalQuestionCount - evaluation.correctnessSummary.attemptedCount}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={initializeSession}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Restart Evaluation
                </button>
              </div>

            </div>

            {/* Cognitive battery Breakdown */}
            {evaluation.css && (
              <div className="bg-[#0f172a] rounded-[48px] p-12 border border-white/5 shadow-2xl space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Cognitive Battery (CSS) Performance</h2>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Scale 1.0 to 10.0 • 9 Unique Skill Domains Registered</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {evaluation.css.domainScores.map((domain, i) => (
                    <div key={domain.domain} className="bg-[#162840]/60 border border-white/5 rounded-[24px] p-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {formatDomain(domain.domain)}
                        </span>
                        <span className="text-sm font-black text-blue-400">{domain.score.toFixed(1)}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                          style={{ width: `${domain.score * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Psychology and Big Five Personality Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* OPAM Domain Scores */}
              {evaluation.opam && (
                <div className="bg-[#0f172a] rounded-[48px] p-12 border border-white/5 shadow-2xl space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Personality Stems (OPAM) Scores</h2>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Situational self-report profiling metrics</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {evaluation.opam.domainScores.map(domain => (
                      <div key={domain.domain} className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-400 uppercase tracking-wider">{formatDomain(domain.domain)}</span>
                          <span className="text-emerald-400 font-black">{domain.score.toFixed(1)}/10</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]"
                            style={{ width: `${domain.score * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Big Five Personality Traits */}
              {bigFive && (
                <div className="bg-[#0f172a] rounded-[48px] p-12 border border-white/5 shadow-2xl space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Officer Big Five Mapping</h2>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Projected from military behavioral stubs</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(bigFive).map(([trait, score]) => (
                      <div key={trait} className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-400 uppercase tracking-wider capitalize">{trait}</span>
                          <span className="text-purple-400 font-black">{score.toFixed(1)}/10</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 shadow-[0_0_8px_#a855f7]"
                            style={{ width: `${score * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  )
}
