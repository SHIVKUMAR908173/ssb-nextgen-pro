'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, ShieldAlert, Send, AlertTriangle, X, Loader2 } from 'lucide-react';
import enrichedSrtBank from '@/data/srt_scenarios_enriched.json';
import { useTimer } from '@/hooks/useTimer';

const TOTAL_SRTS = 30;
const SRT_TIME = 30; // 30 seconds per situation

interface SrtResponse {
    scenarioId: string;
    scenario: string;
    response: string;
}

export interface SrtSimulatorProps {
    isFullBattery?: boolean;
    onComplete?: (responses: SrtResponse[]) => void;
}

export default function SrtSimulator({ isFullBattery, onComplete }: SrtSimulatorProps) {
  const [sessionState, setSessionState] = useState<any>(null);
  const [currentScenarioObj, setCurrentScenarioObj] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'IDLE' | 'TEST' | 'EVALUATING' | 'DONE'>('IDLE');
  const [response, setResponse] = useState('');
  const [allResponses, setAllResponses] = useState<SrtResponse[]>([]);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTimerExpireRef = useRef<() => void>(() => {});
  const timer = useTimer({
    initialTime: SRT_TIME,
    onExpire: () => handleTimerExpireRef.current?.(),
  });

  handleTimerExpireRef.current = () => {
    if (phase === 'TEST') {
      saveAndNext();
    }
  };

  useEffect(() => {
    if (phase === 'TEST' && textareaRef.current) {
        textareaRef.current.focus();
    }
  }, [phase, currentIdx]);

  const startTest = async () => {
    setIsLoadingScenarios(true);
    try {
      const res = await fetch('/api/srt/session/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            sessionId: `srt-session-${Date.now()}`,
            scenarioCount: TOTAL_SRTS,
            flashDurationSeconds: SRT_TIME,
            seed: Date.now()
          }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to init SRT session');

      setSessionState(data.state);
      setCurrentScenarioObj(data.next);
      setCurrentIdx(0);
      setAllResponses([]);
      setResponse('');
      setEvaluation(null);
      setPhase('TEST');
      timer.setTimeAndStart(data.next.flashDurationSeconds);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to start SRT session on backend.', type: 'error' });
    } finally {
      setIsLoadingScenarios(false);
    }
  };

  const restartTest = () => {
    setPhase('IDLE');
  };

  const saveAndNext = async () => {
    if (!currentScenarioObj || !sessionState) return;

    const currentResponseText = response.trim() || "[NO REACTION RECORDED]";
    const payload = {
        scenarioId: currentScenarioObj.scenarioId,
        scenario: currentScenarioObj.situation,
        response: currentResponseText
    };

    const newResponses = [...allResponses, payload];
    setAllResponses(newResponses);
    setResponse('');

    try {
      const res = await fetch('/api/srt/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: sessionState,
          responseText: currentResponseText
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit SRT answer');

      setSessionState(data.state);

      if (data.state.stage === 'finished' || !data.next) {
        finishTest(newResponses);
      } else {
        setCurrentScenarioObj(data.next);
        setCurrentIdx(data.state.currentIndex);
        timer.setTimeAndStart(data.next.flashDurationSeconds);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to submit action to backend.', type: 'error' });
    }
  };

  const finishTest = async (finalResponses: SrtResponse[]) => {
    if (isFullBattery && onComplete) {
        onComplete(finalResponses);
        return;
    }
    setPhase('EVALUATING');
    try {
        const res = await fetch('/api/evaluate-srt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses: finalResponses })
        });

        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

        const data = await res.json();
        const evalData = data.evaluation;
        
        if (evalData) {
            setEvaluation(evalData);
            
            // Save to localStorage for Assessment Hub
            try {
                const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
                history.push({
                    id: `SRT-${Date.now()}`,
                    test: 'Situation Reaction Test',
                    score: (evalData.overall_score || 0) * 10, // Assuming 1-10 score, scale to 100
                    total: 100,
                    date: new Date().toISOString(),
                    status: 'completed',
                    improvements: evalData.detected_olqs || []
                });
                localStorage.setItem('testHistory', JSON.stringify(history));
            } catch (err) {
                console.error('Failed to save test history', err);
            }

            setPhase('DONE');
        } else {
            throw new Error('No evaluation data received');
        }
    } catch (e) {
        console.error('Evaluation failed:', e);
        setEvaluation({
            overall_score: 5,
            summary: 'Evaluation service temporarily unavailable.',
            detected_olqs: [],
            scenarios_feedback: []
        });
        setPhase('DONE');
    }
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Inline Toast Notification */}
      {toast && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md ${
          toast.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <p className="text-sm font-bold">{toast.message}</p>
          <button onClick={() => setToast(null)} className="shrink-0 p-1 hover:opacity-70" aria-label="Dismiss notification">
            <X size={16} />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* PHASE 0: IDLE / BRIEFING */}
        {phase === 'IDLE' && (
          <motion.div
            key="briefing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Information Panel */}
            <div className="lg:col-span-2 bg-[#0f172a] rounded-[48px] p-12 border border-white/5 relative overflow-hidden shadow-2xl space-y-8">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Situation Reaction Test</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                  SRT <span className="text-orange-500">Simulator</span>
                </h1>
                <p className="text-slate-400 font-bold leading-relaxed max-w-2xl">
                  {TOTAL_SRTS} situations will be presented for 30 seconds each. Write a complete, logical, and prompt reaction. Do not just plan; describe the ACTION you would take.
                </p>
              </div>

              <div className="h-px bg-white/5"></div>

              <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 pt-4">
                <button
                  onClick={startTest}
                  disabled={isLoadingScenarios}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-black px-10 py-5 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingScenarios ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <AlertTriangle className="w-4 h-4 text-black fill-black" />}
                  {isLoadingScenarios ? 'Initializing...' : `Start Test (${TOTAL_SRTS} Situations)`}
                </button>
              </div>
            </div>

            {/* Sidebar Guidelines Panel */}
            <div className="bg-[#162840]/60 border border-white/5 rounded-[48px] p-10 flex flex-col justify-between space-y-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-orange-500" />
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Combat Instructions</h2>
                </div>
                
                <ul className="space-y-4 text-xs font-bold text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5"></span>
                    <span>1. Take Action: Do not leave the situation hanging. Resolve it completely.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5"></span>
                    <span>2. Be Logical: Use resources available in the situation. No superhero solutions.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5"></span>
                    <span>3. Avoid Delay: "I will call the police and wait" is poor. Take initiative first.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#0f172a] rounded-[32px] p-6 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Timing</span>
                </div>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                  Exactly 30 seconds per situation. The test automatically advances. Missing a reaction breaks consistency.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ACTIVE TEST PHASE */}
        {phase === 'TEST' && (
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
                <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 text-orange-500">
                  Active Simulation
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Situation {currentIdx + 1} of {TOTAL_SRTS}
                </span>
              </div>
            </div>

            {/* Main Interactive Screen */}
            <div className="bg-[#0f172a] rounded-[48px] p-8 md:p-12 border border-white/5 relative overflow-hidden shadow-2xl space-y-8 flex flex-col h-[600px]">
              
              {/* Timing Countdown Slider */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                  <motion.div 
                      key={currentIdx}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: SRT_TIME, ease: 'linear' }}
                      className="h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                  />
              </div>

              <div className="absolute top-8 right-8 flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${timer.timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                  <span className={`font-mono font-black text-2xl tabular-nums ${timer.timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                      {timer.formattedTime}
                  </span>
              </div>

              <AnimatePresence mode="wait">
                  <motion.div
                      key={currentIdx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-[#162840] border border-white/5 p-10 rounded-[32px] mt-12 flex-1 flex items-center justify-center text-center shadow-inner"
                  >
                      <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed italic">
                          "{currentScenarioObj?.situation}"
                      </p>
                  </motion.div>
              </AnimatePresence>

              <div className="w-full relative shrink-0">
                  <textarea
                      ref={textareaRef}
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              saveAndNext();
                          }
                      }}
                      placeholder="Type your reaction here... (Shift+Enter for new line)"
                      className="w-full bg-[#162840] border-2 border-white/5 rounded-[32px] p-8 text-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-2xl resize-none h-32 font-bold"
                  />
                  <button 
                      onClick={saveAndNext}
                      className="absolute right-6 bottom-6 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 group active:scale-95"
                  >
                      Submit
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* EVALUATING PHASE */}
        {phase === 'EVALUATING' && (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto py-24 text-center space-y-6"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Analyzing Behavioral Consistency</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                AI Psychologist is cross-referencing your reactions against positive indicators and 15 OLQs...
              </p>
            </div>
          </motion.div>
        )}

        {/* RESULTS PHASE */}
        {phase === 'DONE' && evaluation && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            
            {/* Top Score summary widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 bg-[#0f172a] rounded-[48px] p-12 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[80px]"></div>
                
                <div className="space-y-4 relative z-10 text-center md:text-left">
                  <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto md:mx-0">
                    <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">SRT Evaluation Complete</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                    Overall Performance <br/>
                    <span className={evaluation.overall_score >= 7 ? 'text-emerald-400' : 'text-orange-400'}>
                      {evaluation.overall_score >= 7 ? 'HIGH CONSISTENCY' : 'NEEDS IMPROVEMENT'}
                    </span>
                  </h1>
                  
                  <p className="text-slate-400 text-sm font-semibold leading-relaxed max-w-xl">
                    {evaluation.summary}
                  </p>
                </div>

                {/* Score Dial */}
                <div className="bg-[#162840] border border-white/5 rounded-[40px] p-10 text-center min-w-[220px] shadow-2xl relative shrink-0">
                  <p className={`text-6xl font-black ${evaluation.overall_score >= 7 ? 'text-emerald-500' : evaluation.overall_score >= 5 ? 'text-orange-500' : 'text-red-500'}`}>
                    {evaluation.overall_score}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Overall Score / 10</p>
                  <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
                    <div 
                      className={`h-full ${evaluation.overall_score >= 7 ? 'bg-emerald-500' : evaluation.overall_score >= 5 ? 'bg-orange-500' : 'bg-red-500'}`}
                      style={{ width: `${evaluation.overall_score * 10}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Sidebar Quick Re-run */}
              <div className="bg-[#162840] border border-white/5 rounded-[48px] p-10 flex flex-col justify-between space-y-6 shadow-xl">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Detected OLQs</h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                      {evaluation.detected_olqs?.map((olq: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] uppercase tracking-widest font-black text-emerald-400">
                              {olq}
                          </span>
                      ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={restartTest}
                    className="w-full bg-[#0f172a] hover:bg-[#1e3658] border border-white/5 text-white py-4 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                  >
                     Retake Test
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Situation Feedback */}
            {evaluation.scenarios_feedback?.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight pl-2">Detailed Situation Feedback</h3>
                    <div className="grid grid-cols-1 gap-6">
                        {evaluation.scenarios_feedback.map((item: any, idx: number) => {
                            const scenarioData = allResponses.find(r => r.scenarioId === item.id);
                            const isPoor = item.rating?.toLowerCase() === 'poor';
                            const isGood = item.rating?.toLowerCase() === 'good';
                            
                            return (
                                <div key={idx} className="bg-[#0f172a] border border-white/5 rounded-[40px] p-10 shadow-xl overflow-hidden relative">
                                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${isGood ? 'bg-emerald-500/5' : isPoor ? 'bg-red-500/5' : 'bg-orange-500/5'}`}></div>
                                    <div className="relative z-10 mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Situation {idx + 1}</span>
                                        </div>
                                        <p className="text-white font-bold text-xl md:text-2xl leading-relaxed italic">"{scenarioData?.scenario}"</p>
                                    </div>
                                    <div className="grid lg:grid-cols-2 gap-6 relative z-10">
                                        <div className="bg-[#162840] border border-white/5 p-6 rounded-[24px]">
                                            <span className="text-slate-400 text-[10px] font-black uppercase mb-3 block tracking-widest">Your Reaction</span>
                                            <p className="text-slate-300 text-base font-bold italic">"{scenarioData?.response}"</p>
                                        </div>
                                        <div className={`p-6 rounded-[24px] border ${isGood ? 'bg-emerald-500/10 border-emerald-500/20' : isPoor ? 'bg-red-500/10 border-red-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={`w-2 h-2 rounded-full ${isGood ? 'bg-emerald-500' : isPoor ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isGood ? 'text-emerald-400' : isPoor ? 'text-red-400' : 'text-orange-400'}`}>
                                                    {item.rating} Response
                                                </span>
                                            </div>
                                            <p className="text-slate-300 text-sm font-bold leading-relaxed">{item.feedback}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
