'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, ShieldAlert, Loader2, Send, AlertTriangle, Upload } from 'lucide-react';
import srtBank from '@/data/srt_situation_bank.json';
import { useTimer } from '@/hooks/useTimer';

const TOTAL_SRTS = 60;
const SRT_TIME = 30; // 30 seconds per situation

// Randomly pick a set at render time for variety
function getSituations(setIndex: number): string[] {
  const sets = srtBank.sets;
  return sets[setIndex % sets.length].situations;
}


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
  const [setIndex, setSetIndex] = useState(0);
  const SRT_SITUATIONS = useMemo(() => getSituations(setIndex), [setIndex]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'IDLE' | 'TEST' | 'EVALUATING' | 'DONE'>('IDLE');
  const [response, setResponse] = useState('');
  const [allResponses, setAllResponses] = useState<SrtResponse[]>([]);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [repairedSituations, setRepairedSituations] = useState<string[]>([]);
  const [customSet, setCustomSet] = useState<string[] | null>(null);

  const ALL_SRT_SITUATIONS = useMemo(() => customSet || [...SRT_SITUATIONS, ...repairedSituations], [SRT_SITUATIONS, repairedSituations, customSet]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Dataset Repair
  useEffect(() => {
    if (SRT_SITUATIONS.length < TOTAL_SRTS) {
      const missingCount = TOTAL_SRTS - SRT_SITUATIONS.length;
      fetch('/api/data/repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testType: 'SRT', count: missingCount })
      })
      .then(res => res.json())
      .then(data => {
        if (data.data) setRepairedSituations(data.data);
      })
      .catch(err => console.error("Auto-repair failed", err));
    } else {
      setRepairedSituations([]);
    }
  }, [SRT_SITUATIONS]);

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

  const startTest = () => {
    setCurrentIdx(0);
    setAllResponses([]);
    setResponse('');
    setEvaluation(null);
    setPhase('TEST');
    timer.setTimeAndStart(SRT_TIME);
  };

  const nextSet = () => {
    setSetIndex(prev => prev + 1);
    setCustomSet(null);
    setPhase('IDLE');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const parsed = JSON.parse(event.target?.result as string);
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                setCustomSet(parsed);
                setPhase('IDLE');
                alert(`Loaded custom SRT set with ${parsed.length} situations!`);
            } else {
                alert('Invalid JSON format. Must be an array of strings (situations).');
            }
        } catch (err) {
            alert('Error parsing JSON file.');
        }
    };
    reader.readAsText(file);
  };

  const saveAndNext = () => {
    const payload = {
        scenarioId: `${setIndex}-${currentIdx}`,
        scenario: ALL_SRT_SITUATIONS[currentIdx % ALL_SRT_SITUATIONS.length],
        response: response.trim() || "[NO REACTION RECORDED]"
    };

    const newResponses = [...allResponses, payload];
    setAllResponses(newResponses);
    setResponse('');

    if (currentIdx + 1 === TOTAL_SRTS) {
        finishTest(newResponses);
    } else {
        setCurrentIdx((prev) => prev + 1);
        timer.setTimeAndStart(SRT_TIME);
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
            setEvaluation({
                overall_score: evalData.overallScore || evalData.overall_score || 75,
                action_summary: evalData.feedback || evalData.action_summary || 'Reaction analyzed successfully.',
                vulnerabilities: evalData.redFlags?.join(', ') || evalData.vulnerabilities || 'No critical vulnerabilities.',
                situation_breakdown: evalData.situation_breakdown || []
            });
            
            // Save to localStorage for Assessment Hub
            try {
                const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
                history.push({
                    id: `SRT-${Date.now()}`,
                    test: 'Situation Reaction Test',
                    score: evalData.overallScore || evalData.overall_score || 75,
                    total: 100,
                    date: new Date().toISOString(),
                    status: 'completed',
                    improvements: (evalData.overallScore || 75) >= 70 
                        ? ['Maintain quick reaction times', 'Keep responses practical']
                        : ['Respond faster to situations', 'Ensure responses show initiative']
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
        // Fallback Evaluation
        setEvaluation({
            overall_score: 50,
            action_summary: 'Evaluation service temporarily unavailable.',
            vulnerabilities: 'N/A',
            situation_breakdown: []
        });
        setPhase('DONE');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#0f172a] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl text-slate-200">
      
      {/* Header */}
      <div className="bg-[#162840] border-b border-white/5 p-6 flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-xl font-black tracking-widest uppercase text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
            Situation Reaction Test (Set {setIndex + 1})
          </h2>
          <p className="text-[10px] text-slate-500 font-black mt-1 tracking-widest uppercase">
            30s Per Situation // 60 Reactions // Logical Action
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

                {!isFullBattery && (
                  <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 w-full max-w-md justify-center mt-4">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Select Set:</span>
                     <select 
                       value={customSet ? 'custom' : setIndex} 
                       onChange={(e) => {
                          if (e.target.value !== 'custom') {
                              setSetIndex(Number(e.target.value));
                              setCustomSet(null);
                          }
                       }}
                       className="bg-[#162840] border border-white/10 text-white text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-2.5 font-bold outline-none cursor-pointer"
                     >
                       {Array.from({ length: 60 }).map((_, i) => (
                          <option key={i} value={i}>SRT Set {i + 1}</option>
                       ))}
                       {customSet && <option value="custom">Custom Uploaded Set</option>}
                     </select>
                  </div>
                )}

                <div className="flex gap-4 mt-4">
                  <button onClick={startTest} className="px-10 py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-xl shadow-orange-500/20 w-full md:w-auto">
                    Start {customSet ? 'Custom Set' : `Set ${setIndex + 1}`}
                  </button>
                  
                  {!isFullBattery && (
                    <>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/5 hover:bg-white/10 active:scale-95 text-white font-bold py-4 px-6 rounded-2xl transition-all border border-white/10 text-sm flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" /> Custom Set
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileUpload} />
                    </>
                  )}
                </div>
           </div>
        ) : phase === 'EVALUATING' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 gap-6 text-center">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(249,115,22,0.3)]"></div>
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Analyzing Behavioral Consistency</h3>
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest max-w-md">
                   AI Psychologist is cross-referencing 60 reactions against the 15 OLQs. Mapping initiative, decision-making speed, and social responsibility...
                </p>
           </div>
        ) : phase === 'DONE' && evaluation ? (
           <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex-1 p-8 overflow-y-auto custom-scrollbar h-[600px] relative"
           >
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                   <div className="flex items-center gap-3">
                       <CheckCircle className="w-8 h-8 text-orange-500" />
                       <h3 className="text-2xl font-black text-white uppercase tracking-[0.1em]">SRT Tactical Audit</h3>
                   </div>
                   <button 
                       onClick={nextSet}
                       className="px-6 py-2 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-[0.1em] text-xs rounded-xl transition-all shadow-xl shadow-orange-500/20"
                   >
                       Start Next Set
                   </button>
               </div>
               
               <div className="space-y-8">
                   <div className="bg-[#162840] p-8 rounded-3xl border border-white/5 shadow-xl">
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-orange-500 mb-4">Action Orientation Matrix</h4>
                        <p className="text-slate-300 text-sm leading-relaxed font-bold">{evaluation.action_summary}</p>
                   </div>

                   <div className="bg-red-500/5 p-8 rounded-3xl border border-red-500/20 shadow-xl">
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-red-400 mb-4">Critical Vulnerabilities</h4>
                        <p className="text-slate-300 text-sm leading-relaxed font-bold">{evaluation.vulnerabilities}</p>
                   </div>

                   {evaluation.situation_breakdown?.length > 0 && (
                        <div className="space-y-6">
                             <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">Detailed Situation Audit</h4>
                             {evaluation.situation_breakdown.map((item: any, idx: number) => (
                                  <div key={idx} className="bg-[#162840] border border-white/5 rounded-3xl p-8 gap-6 grid md:grid-cols-2 shadow-2xl">
                                       <div className="col-span-full mb-2">
                                           <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Situation</span>
                                           <p className="text-white font-bold text-lg italic leading-relaxed">"{item.situation}"</p>
                                       </div>
                                       <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl">
                                           <span className="text-red-400 text-[10px] font-black uppercase mb-3 block tracking-widest">Your Reaction</span>
                                           <p className="text-slate-400 text-sm italic mb-4 font-bold">"{item.candidate_response}"</p>
                                           <p className="text-red-300 text-[9px] pt-3 border-t border-red-500/10 uppercase tracking-[0.2em] font-black">Failure Point: {item.failure_reason}</p>
                                       </div>
                                       <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-2xl">
                                           <span className="text-orange-400 text-[10px] font-black uppercase mb-3 block tracking-widest">Officer-Like Action</span>
                                           <p className="text-slate-300 text-sm leading-relaxed font-bold italic">{item.ideal_action}</p>
                                       </div>
                                  </div>
                             ))}
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
                                "{ALL_SRT_SITUATIONS[currentIdx % ALL_SRT_SITUATIONS.length]}"
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
                            className="absolute bottom-8 right-10 px-10 py-5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 group active:scale-95"
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
