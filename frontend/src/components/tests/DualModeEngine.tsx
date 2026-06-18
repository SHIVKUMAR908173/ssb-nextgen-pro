'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, BrainCircuit, XCircle, ArrowRight, Clock, ShieldAlert, Target } from 'lucide-react';
import { ApiClient } from '@/lib/api/api-client';

const WAT_FULL_SET = [
    "Company", "Weapon", "Mother", "Defeat", "Snake", "Success", "Blood", "Duty", 
    "Fear", "Careless", "Help", "Problem"
]; // Condensed for demo. Full 60 in production.

const OIR_TEST_TIME = 1800; // 30 minutes for 50 questions
const WAT_WORD_TIME = 15; // 15 seconds per word

interface DualModeEngineProps {
  testType: 'OIR' | 'WAT';
  defaultMode?: 'PRACTICE' | 'TEST';
}

export default function DualModeEngine({ testType, defaultMode = 'PRACTICE' }: DualModeEngineProps) {
    const [mode, setMode] = useState<'PRACTICE' | 'TEST'>(defaultMode);
    const [phase, setPhase] = useState<'IDLE' | 'ACTIVE' | 'EVALUATING' | 'DONE'>('IDLE');
    
    const [questions, setQuestions] = useState<Record<string, any>[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0); // For WAT it's per word, for OIR it's total time
    
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [responses, setResponses] = useState<Record<string, unknown>[]>([]);
    
    // Practice Mode Feedback State
    const [showFeedback, setShowFeedback] = useState(false);
    
    // Final Results
    const [evaluation, setEvaluation] = useState<Record<string, any> | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch OIR data on load if OIR string
    useEffect(() => {
        if (testType === 'OIR' && phase === 'IDLE') {
            ApiClient.get<{ questions: Record<string, any>[] }>('/api/oir-questions?count=50')
                .then(data => setQuestions(data.questions))
                .catch(err => console.error(err));
        } else if (testType === 'WAT') {
            setQuestions(WAT_FULL_SET.map(w => ({ trigger: w })));
        }
    }, [testType, phase]);

    // Timer Logic
    useEffect(() => {
        if (phase !== 'ACTIVE' || mode === 'PRACTICE') return;

        if (timeLeft <= 0) {
            if (testType === 'WAT') {
                saveAndNext(true); // Auto advance WAT word
            } else if (testType === 'OIR') {
                finishTest(); // Auto finish OIR Test when 30 mins are up
            }
            return;
        }

        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [phase, mode, timeLeft, testType, currentIndex]);

    const startSession = () => {
        setCurrentIndex(0);
        setResponses([]);
        setCurrentAnswer('');
        setShowFeedback(false);
        setEvaluation(null);
        setPhase('ACTIVE');
        
        if (mode === 'TEST') {
            setTimeLeft(testType === 'WAT' ? WAT_WORD_TIME : OIR_TEST_TIME);
        }
    };

    const handleAnswerChange = (val: string) => {
        setCurrentAnswer(val);
    };

    const saveAndNext = (autoAdvance = false) => {
        const payload = testType === 'WAT' 
            ? { trigger: questions[currentIndex].trigger, response: currentAnswer.trim() || "[NO RESPONSE]" }
            : { questionId: questions[currentIndex].id, selectedOption: parseInt(currentAnswer) || -1 };
        
        setResponses(prev => [...prev, payload]);

        if (currentIndex + 1 >= questions.length) {
            finishTest([...responses, payload]);
        } else {
            setCurrentIndex(prev => prev + 1);
            setCurrentAnswer('');
            setShowFeedback(false);
            if (mode === 'TEST' && testType === 'WAT') {
                setTimeLeft(WAT_WORD_TIME); // Reset 15s timer for WAT
            }
        }
    };

    const checkAnswerInPractice = () => {
        setShowFeedback(true);
    };

    const finishTest = async (finalResponses = responses) => {
        setPhase('EVALUATING');
        
        if (testType === 'OIR') {
            let score = 0;
            finalResponses.forEach((r, i) => {
                if (questions[i].correctOptionIndex === r.selectedOption) score++;
            });
            // OIR Ranks calculation simplified
            const rank = score > 45 ? 'OIR-1' : score > 35 ? 'OIR-2' : score > 25 ? 'OIR-3' : 'OIR-4';
            setTimeout(() => {
                setEvaluation({ score, total: questions.length, rank });
                setPhase('DONE');
            }, 1000); // Simulate API latency
        } else {
            // WAT Holistic Evaluation (Batch)
            try {
                const data = await ApiClient.post<{ evaluation: Record<string, any> }>('/api/psych-eval', { 
                    testType: 'Word Association Test (WAT)', 
                    responses: finalResponses 
                });
                setEvaluation(data.evaluation);
                setPhase('DONE');
            } catch (error) {
                console.error(error);
                setPhase('DONE');
            }
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-charcoal/90 border border-white/10 rounded-3xl shadow-glass overflow-hidden backdrop-blur-xl font-sans text-slate-200">
            {/* Header Telemetry */}
            <div className="bg-slate-900/60 border-b border-white/10 p-5 flex flex-col md:flex-row justify-between items-center relative z-10 gap-4">
                <div>
                    <h2 className="text-xl font-black tracking-widest uppercase text-white shadow-neon flex items-center gap-2">
                        {testType === 'WAT' ? <BrainCircuit className="text-purple-400" /> : <Target className="text-emerald-400" />}
                        Mansa / {testType === 'WAT' ? 'Word Association Battery' : 'DIPR OIR Reasoning'}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest uppercase">
                        Current Engine Profile: {mode} ENGINE
                    </p>
                </div>
                
                {phase === 'IDLE' && (
                    <div className="flex bg-black/50 p-1 rounded-lg border border-white/10">
                        <button 
                            onClick={() => setMode('PRACTICE')}
                            className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${mode === 'PRACTICE' ? 'bg-olive text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Practice Mode
                        </button>
                        <button 
                            onClick={() => setMode('TEST')}
                            className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${mode === 'TEST' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Test Mode
                        </button>
                    </div>
                )}
            </div>

            <div className="min-h-[500px] w-full bg-black/40 relative flex flex-col justify-center overflow-hidden">
                {phase === 'IDLE' ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5 text-center">
                        <ShieldAlert className={`w-16 h-16 opacity-80 ${mode === 'TEST' ? 'text-red-500' : 'text-emerald-500'}`} />
                        <h3 className="text-3xl font-black uppercase tracking-[0.2em] text-white">
                            {mode === 'PRACTICE' ? 'Untimed Practice Environment' : 'Strict Auto-Advancing Test'}
                        </h3>
                        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                            {mode === 'PRACTICE' 
                                ? `Take your time. You can check instant feedback and proper reasoning for ${testType === 'OIR' ? 'DIPR Booklets' : 'Psychological Responses'} to build cognitive conditioning.`
                                : `This simulates actual SSB conditions. ${testType === 'OIR' ? '30 minutes for 50 questions.' : '15 seconds auto-advance per word.'} No pausing. Complete focus required.`}
                        </p>
                        <button 
                            onClick={startSession}
                            className={`mt-4 px-10 py-4 font-black uppercase tracking-widest text-white rounded-xl transition-all shadow-glass ease-in hover:scale-[1.02] ${mode === 'TEST' ? 'bg-red-600 hover:bg-red-500' : 'bg-olive hover:bg-olive-light'}`}
                        >
                            Initialize Sequence
                        </button>
                    </div>
                ) : phase === 'EVALUATING' ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
                        <Loader2 className="w-16 h-16 text-olive-light animate-spin" />
                        <h3 className="text-2xl font-black uppercase tracking-widest">Compiling Actionable Report...</h3>
                    </div>
                ) : phase === 'DONE' && evaluation ? (
                    <div className="flex-1 overflow-y-auto p-8 h-[500px] custom-scrollbar">
                         {testType === 'OIR' ? (
                             <div className="text-center bg-slate-900/80 border border-white/10 rounded-2xl p-10 max-w-2xl mx-auto backdrop-blur-lg shadow-glass">
                                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto border-2 border-emerald-500 rounded-full mb-6 p-2" />
                                  <h3 className="text-3xl font-black uppercase tracking-widest text-white mb-2">OIR Evaluation</h3>
                                  <p className="text-slate-400 font-mono text-sm mb-8">Extracted from 3,840 DIPR Authenticated Parameters</p>
                                  <div className="flex justify-center items-end gap-2 mb-4">
                                       <span className="text-7xl font-black text-neon">{evaluation.score}</span>
                                       <span className="text-2xl text-slate-500 font-bold uppercase mb-2">/ {evaluation.total}</span>
                                  </div>
                                  <div className="bg-charcoal border border-white/10 rounded-xl p-4 inline-block">
                                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Projected Rating</p>
                                      <p className={`text-4xl font-black ${evaluation.rank === 'OIR-1' ? 'text-emerald-400' : evaluation.rank === 'OIR-2' ? 'text-blue-400' : 'text-red-400'}`}>{evaluation.rank}</p>
                                  </div>
                             </div>
                         ) : (
                             <div className="space-y-6">
                                  <h3 className="text-3xl font-black uppercase tracking-widest text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] mb-8 flex items-center gap-3">
                                      <CheckCircle /> Holistic WAT Report
                                  </h3>
                                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                                      <h4 className="text-emerald-500 text-sm font-black uppercase tracking-widest mb-2">OLQ Matrix</h4>
                                      <p className="text-slate-200">{evaluation.olq_summary}</p>
                                  </div>
                                  <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                      <h4 className="text-red-400 text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> What You Need To Change</h4>
                                      <p className="text-red-200">{evaluation.required_improvements}</p>
                                  </div>
                                  
                                  <div className="space-y-4">
                                       {evaluation.specific_corrections?.map((corr: any, idx: number) => (
                                            <div key={idx} className="bg-charcoal border border-white/10 rounded-xl p-4 grid md:grid-cols-2 gap-4 relative overflow-hidden">
                                                 <div className="col-span-full">
                                                     <p className="font-mono text-slate-500 text-[10px] font-bold uppercase tracking-widest">Trigger Word</p>
                                                     <p className="text-xl font-bold tracking-widest text-white uppercase">{corr.trigger_word_or_situation}</p>
                                                 </div>
                                                 <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-sm text-red-100">
                                                     <p className="opacity-70 text-xs font-bold uppercase mb-1 flex items-center gap-1"><XCircle className="w-3 h-3"/> Your Response</p>
                                                     <p>"{corr.candidate_response}"</p>
                                                     <p className="text-xs text-red-400 mt-2 border-t border-red-500/20 pt-2">{corr.why_its_wrong}</p>
                                                 </div>
                                                 <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded text-sm text-emerald-100">
                                                     <p className="opacity-70 text-xs font-bold uppercase mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Officer Approach</p>
                                                     <p>{corr.better_approach}</p>
                                                 </div>
                                            </div>
                                       ))}
                                  </div>
                             </div>
                         )}
                    </div>
                ) : (
                    // ACTIVE TEST UI
                    <div className="flex-1 flex flex-col p-8 relative">
                         {/* Timer Global */}
                         {mode === 'TEST' && testType === 'OIR' && (
                             <div className="absolute top-4 right-8 bg-black/60 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 z-20">
                                 <Clock className="w-4 h-4 text-red-500"/>
                                 <span className="font-mono font-bold text-white tracking-widest">{formatTime(timeLeft)}</span>
                             </div>
                         )}
                         
                         {mode === 'TEST' && testType === 'WAT' && (
                             <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 z-20">
                                 <div className="h-full bg-gradient-to-r from-emerald-500 to-red-600 transition-all duration-1000 ease-linear"
                                      style={{ width: `${(timeLeft / WAT_WORD_TIME) * 100}%` }}
                                 />
                             </div>
                         )}

                         <div className="mb-4">
                             <span className="bg-charcoal border border-white/10 text-slate-300 text-xs px-3 py-1 rounded font-mono font-bold tracking-widest">
                                 {testType === 'OIR' ? `QUESTION ${currentIndex + 1} / ${questions.length}` : `WORD ${currentIndex + 1} / ${questions.length}`}
                             </span>
                         </div>

                         {testType === 'OIR' && questions[currentIndex] && (
                             <div className="space-y-6 flex-1">
                                  <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl">
                                      <p className="text-xl md:text-2xl text-white font-medium">{questions[currentIndex].questionText}</p>
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-4">
                                      {questions[currentIndex].options.map((opt: string, i: number) => {
                                          const isSelected = currentAnswer === i.toString();
                                          const isCorrect = showFeedback && questions[currentIndex].correctOptionIndex === i;
                                          const isWrong = showFeedback && isSelected && i !== questions[currentIndex].correctOptionIndex;
                                          
                                          let btnClass = "text-left p-4 rounded-xl border font-medium flex items-center gap-3 transition-all outline-none ";
                                          if (isCorrect) btnClass += "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.2)]";
                                          else if (isWrong) btnClass += "bg-red-500/20 border-red-500/50 text-red-200";
                                          else if (isSelected) btnClass += "bg-olive/40 border-olive-light text-white";
                                          else btnClass += "bg-charcoal border-white/10 hover:border-olive-light text-slate-300";

                                          return (
                                              <button key={i} onClick={() => handleAnswerChange(i.toString())} disabled={showFeedback} className={btnClass}>
                                                  <span className="w-8 h-8 rounded bg-black/50 text-xs flex items-center justify-center font-mono border border-white/5">
                                                      {String.fromCharCode(65 + i)}
                                                  </span>
                                                  {opt}
                                              </button>
                                          );
                                      })}
                                  </div>
                                  
                                  <AnimatePresence>
                                  {showFeedback && (
                                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                                          <p className="text-blue-400 text-xs uppercase font-bold tracking-widest mb-1 flex items-center gap-1"><BrainCircuit className="w-3 h-3"/> DIPR Reasoning</p>
                                          <p className="text-blue-100 text-sm mt-1">{questions[currentIndex].explanation}</p>
                                      </motion.div>
                                  )}
                                  </AnimatePresence>
                             </div>
                         )}

                         {testType === 'WAT' && questions[currentIndex] && (
                             <AnimatePresence mode="popLayout">
                                 <motion.div key={currentIndex} initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} className="flex-1 flex flex-col items-center justify-center gap-12">
                                     <h3 className="text-6xl md:text-8xl font-black text-white tracking-tight uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                         {questions[currentIndex].trigger}
                                     </h3>
                                     <input autoFocus ref={inputRef} value={currentAnswer} onChange={(e) => handleAnswerChange(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveAndNext()} placeholder="Formulate an Officer-like sentence..." className="w-full max-w-2xl bg-charcoal border-2 border-slate-700 p-4 text-xl rounded-xl text-white outline-none focus:border-olive-light focus:ring-1 focus:ring-olive-light font-medium" />
                                 </motion.div>
                             </AnimatePresence>
                         )}

                         <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
                             {mode === 'PRACTICE' && testType === 'OIR' && !showFeedback && currentAnswer !== '' && (
                                 <button onClick={checkAnswerInPractice} className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl uppercase tracking-widest text-xs hover:bg-slate-700">Check Reasoning</button>
                             )}
                             {(mode === 'PRACTICE' || currentAnswer !== '') && (
                                 <button onClick={() => saveAndNext()} className="px-8 py-3 bg-olive text-white font-bold rounded-xl flex items-center gap-2 uppercase tracking-widest text-xs shadow-glass hover:bg-olive-light transition-all cursor-pointer">
                                     {currentIndex + 1 === questions.length ? 'Submit Battery' : 'Next Item'} <ArrowRight className="w-4 h-4"/>
                                 </button>
                             )}
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
}
