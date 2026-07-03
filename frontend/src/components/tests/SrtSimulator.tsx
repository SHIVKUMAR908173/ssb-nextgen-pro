'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, ShieldAlert, Send, AlertTriangle, X } from 'lucide-react';
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
    try {
      const res = await fetch('http://localhost:3001/api/srt/session/init', {
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
      const res = await fetch('http://localhost:3001/api/srt/session/submit', {
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
    <div className="w-full max-w-5xl mx-auto bg-[#0f172a] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl text-slate-200 relative">
      
      {/* Inline Toast Notification */}
      {toast && (
        <div className={`absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-3 p-4 rounded-2xl border ${
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
      
      {/* Header */}
      <div className="bg-[#162840] border-b border-white/5 p-6 flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-xl font-black tracking-widest uppercase text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
            Situation Reaction Test
          </h2>
          <p className="text-[10px] text-slate-500 font-black mt-1 tracking-widest uppercase">
            30s Per Situation // 30 Reactions // Logical Action
          </p>
        </div>
        {phase === 'IDLE' && (
          <button 
               onClick={startTest}
               className="px-8 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black tracking-widest text-xs uppercase rounded-xl transition-all shadow-xl shadow-orange-500/20"
          >
               Launch SRT Series
          </button>
        )}
      </div>

      <div className="min-h-[550px] w-full bg-black/20 relative overflow-hidden flex flex-col">
        {phase === 'IDLE' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-6">
                <ShieldAlert className="w-16 h-16 text-orange-500/20" />
                <h3 className="text-3xl font-black tracking-[0.2em] text-white uppercase">Combat Thinking Instructions</h3>
                <p className="text-slate-500 max-w-2xl leading-relaxed text-lg font-bold">
                    A real-world situation will be presented for 30 seconds. 
                    Write a complete, logical, and prompt reaction. 
                    Do not just plan; describe the ACTION you would take to resolve the situation completely.
                </p>

                <div className="flex gap-4 mt-4">
                  <button onClick={startTest} className="px-10 py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-xl shadow-orange-500/20 w-full md:w-auto">
                    Start Test (30 Situations)
                  </button>
                </div>
           </div>
        ) : phase === 'EVALUATING' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 gap-6 text-center">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(249,115,22,0.3)]"></div>
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Analyzing Behavioral Consistency</h3>
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest max-w-md">
                   AI Psychologist is cross-referencing your reactions against positive indicators and 15 OLQs...
                </p>
           </div>
        ) : phase === 'DONE' && evaluation ? (
           <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex-1 p-8 overflow-y-auto custom-scrollbar h-[600px] relative"
           >
               <div className="flex flex-wrap gap-4 items-center justify-between mb-8 pb-4 border-b border-white/5">
                   <div className="flex items-center gap-3">
                       <CheckCircle className="w-8 h-8 text-orange-500" />
                       <h3 className="text-2xl font-black text-white uppercase tracking-[0.1em]">AI Evaluation Results</h3>
                   </div>
                   <button 
                       onClick={restartTest}
                       className="px-6 py-2 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-[0.1em] text-xs rounded-xl transition-all shadow-xl shadow-orange-500/20"
                   >
                       Take Test Again
                   </button>
               </div>
               
               <div className="space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                       <div className="bg-[#162840] p-8 rounded-3xl border border-white/5 shadow-xl">
                            <h4 className="text-[10px] uppercase font-black tracking-widest text-orange-500 mb-4">Overall Score</h4>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-black text-white">{evaluation.overall_score}</span>
                                <span className="text-slate-500 font-black mb-1">/ 10</span>
                            </div>
                            <p className="mt-4 text-slate-300 text-sm leading-relaxed font-bold">{evaluation.summary}</p>
                       </div>

                       <div className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/20 shadow-xl">
                            <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-400 mb-4">Detected Officer-Like Qualities (OLQs)</h4>
                            <div className="flex flex-wrap gap-2">
                                {evaluation.detected_olqs?.map((olq: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-300">
                                        {olq}
                                    </span>
                                ))}
                            </div>
                       </div>
                   </div>

                   {evaluation.scenarios_feedback?.length > 0 && (
                        <div className="space-y-6">
                             <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">Detailed Situation Feedback</h4>
                             {evaluation.scenarios_feedback.map((item: any, idx: number) => {
                                 const scenarioData = allResponses.find(r => r.scenarioId === item.id);
                                 const isPoor = item.rating?.toLowerCase() === 'poor';
                                 const isGood = item.rating?.toLowerCase() === 'good';
                                 
                                 return (
                                     <div key={idx} className="bg-[#162840] border border-white/5 rounded-3xl p-6 shadow-xl">
                                         <div className="mb-4">
                                             <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Situation</span>
                                             <p className="text-white font-bold text-lg italic mt-1">"{scenarioData?.scenario}"</p>
                                         </div>
                                         <div className="grid md:grid-cols-2 gap-4">
                                             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                                                 <span className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Your Reaction</span>
                                                 <p className="text-slate-300 text-sm font-bold italic">"{scenarioData?.response}"</p>
                                             </div>
                                             <div className={`p-4 rounded-2xl border ${isGood ? 'bg-emerald-500/5 border-emerald-500/20' : isPoor ? 'bg-red-500/5 border-red-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
                                                 <div className="flex items-center gap-2 mb-2">
                                                     <span className={`text-[10px] font-black uppercase tracking-widest ${isGood ? 'text-emerald-400' : isPoor ? 'text-red-400' : 'text-orange-400'}`}>
                                                         {item.rating} Response
                                                     </span>
                                                 </div>
                                                 <p className="text-slate-300 text-sm font-bold">{item.feedback}</p>
                                             </div>
                                         </div>
                                     </div>
                                 );
                             })}
                        </div>
                   )}
               </div>
           </motion.div>
        ) : (
           // Active Test
           <div className="flex-1 flex flex-col relative h-full">
                {/* Timer Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-20">
                    <motion.div 
                         key={currentIdx}
                         initial={{ width: '100%' }}
                         animate={{ width: '0%' }}
                         transition={{ duration: SRT_TIME, ease: 'linear' }}
                         className="h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                    />
                </div>

                <div className="absolute top-6 right-8 flex items-center gap-2 z-20 bg-black/40 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                    <Clock className={`w-4 h-4 ${timer.timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                    <span className={`font-mono font-black text-xl tabular-nums ${timer.timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {timer.formattedTime}
                    </span>
                </div>

                <div className="absolute top-6 left-8 z-20 bg-black/40 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                     <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mr-2">Situation</span>
                     <span className="text-white font-mono font-black text-lg">{currentIdx + 1}/{TOTAL_SRTS}</span>
                </div>

                <div className="flex-1 flex flex-col p-8 pt-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-[#162840] border border-white/5 p-12 rounded-[40px] mb-8 min-h-[180px] flex items-center justify-center text-center shadow-2xl"
                        >
                            <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed italic">
                                "{currentScenarioObj?.situation}"
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex-1 flex flex-col relative">
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
                            className="flex-1 bg-black/40 border-2 border-white/5 rounded-[40px] p-10 text-xl text-white placeholder-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-2xl resize-none leading-relaxed font-bold"
                        />
                        <button 
                            onClick={saveAndNext}
                            className="mt-4 w-full sm:w-auto sm:mt-0 sm:absolute sm:bottom-8 sm:right-10 px-10 py-5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 group active:scale-95"
                        >
                            Submit Action
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
           </div>
        )}
      </div>
    </div>
  );
}
