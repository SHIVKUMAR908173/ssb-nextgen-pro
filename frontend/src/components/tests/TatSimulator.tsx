'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, ShieldAlert, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import { TAT_SETS } from '@/lib/tat-dataset';

const TOTAL_SETS = 60;
const TOTAL_SLIDES = 13;
const PICTURE_TIME = 30;
const WRITING_TIME = 240;

interface TatResponse {
    trigger: string;
    response: string;
}

export interface TatSimulatorProps {
    isFullBattery?: boolean;
    onComplete?: (responses: TatResponse[]) => void;
}

export default function TatSimulator({ isFullBattery, onComplete }: TatSimulatorProps) {
  const [setIndex, setSetIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phase, setPhase] = useState<'IDLE' | 'VIEWING' | 'WRITING' | 'EVALUATING' | 'DONE'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0);
  const [story, setStory] = useState('');
  const [allStories, setAllStories] = useState<TatResponse[]>([]);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [repairedScenarios, setRepairedScenarios] = useState<any[]>([]);
  const [customSet, setCustomSet] = useState<any[] | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Removed auto-repair logic as we are using internal SVG datasets now

  useEffect(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (phase === 'IDLE' || phase === 'DONE' || phase === 'EVALUATING') return;
    if (timeLeft <= 0) {
      if (phase === 'VIEWING') { setPhase('WRITING'); setTimeLeft(WRITING_TIME); }
      else if (phase === 'WRITING') { saveAndAdvance(); }
      return;
    }
    timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, [timeLeft, phase, currentSlide]);

  useEffect(() => {
    if (phase === 'WRITING' && textareaRef.current) textareaRef.current.focus();
  }, [phase]);

  const startTest = () => {
    setCurrentSlide(0); setAllStories([]); setStory(''); setEvaluation(null);
    setPhase('VIEWING'); setTimeLeft(PICTURE_TIME);
  };

  const nextSet = () => {
    setSetIndex(prev => (prev + 1) % TOTAL_SETS);
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
            if (Array.isArray(parsed) && parsed.length > 0) {
                setCustomSet(parsed);
                setPhase('IDLE');
                alert(`Loaded custom TAT set with ${parsed.length} pictures!`);
            } else {
                alert('Invalid JSON format. Must be an array of image objects.');
            }
        } catch (err) {
            alert('Error parsing JSON file.');
        }
    };
    reader.readAsText(file);
  };

  const saveAndAdvance = () => {
    const isBlank = currentSlide === 12;
    const payload = {
        trigger: isBlank ? 'Blank Slide' : `TAT Picture ${currentSlide + 1}`,
        response: story.trim() || '[NO STORY WRITTEN]'
    };
    const newStories = [...allStories, payload];
    setAllStories(newStories);
    setStory('');
    if (currentSlide + 1 === TOTAL_SLIDES) { generateEvaluation(newStories); }
    else { setCurrentSlide((prev) => prev + 1); setPhase('VIEWING'); setTimeLeft(PICTURE_TIME); }
  };

  const generateEvaluation = async (finalResponses: TatResponse[]) => {
    if (isFullBattery && onComplete) {
        onComplete(finalResponses);
        return;
    }
    setPhase('EVALUATING');
    try {
        // Send ALL stories in a single batch to the native Next.js Gemini endpoint
        const res = await fetch('/api/evaluate-tat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stories: finalResponses })
        });

        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }

        const data = await res.json();
        const evalData = data.evaluation;

        setEvaluation({
            chief_psychologist_verdict: evalData.chief_psychologist_verdict || 'Evaluation completed.',
            dominant_psychological_theme: evalData.dominant_psychological_theme || 'N/A',
            overall_tat_score: evalData.overall_tat_score || 50,
            olq_projection: evalData.olq_projection || [],
            story_evaluations: evalData.story_evaluations || [],
            tat_mastery_plan: evalData.tat_mastery_plan || 'Keep practicing.'
        });

        // Save to localStorage for Assessment Hub
        try {
            const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
            history.push({
                id: `TAT-${Date.now()}`,
                test: 'Thematic Apperception Test',
                score: evalData.overall_tat_score || 50,
                total: 100,
                date: new Date().toISOString(),
                status: 'completed',
                improvements: ['Review Chief Psychologist Feedback', 'Practice with model rewrites']
            });
            localStorage.setItem('testHistory', JSON.stringify(history));
        } catch (err) {
            console.error('Failed to save test history', err);
        }

        setPhase('DONE');
    } catch (e) {
        console.error('Evaluation failed:', e);
        // Provide fallback evaluation on error
        setEvaluation({
            chief_psychologist_verdict: 'Evaluation service temporarily unavailable. Please try again.',
            dominant_psychological_theme: 'N/A',
            overall_tat_score: 0,
            olq_projection: [],
            story_evaluations: finalResponses.map((r, i) => ({
                story_number: r.trigger,
                board_score: 5,
                formula_compliance: 'NONE',
                psychological_insight: 'Story submitted but could not be evaluated.',
                red_flags: [],
                ideal_story_rewrite: null
            })),
            tat_mastery_plan: 'Please try again when the evaluation service is available.'
        });
        setPhase('DONE');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getCurrentTatSvg = useCallback(() => {
    if (customSet && customSet[currentSlide]) return customSet[currentSlide].url;
    const baseSet = TAT_SETS[setIndex];
    if (!baseSet) return '';
    return baseSet.images[currentSlide]?.url || '';
  }, [setIndex, currentSlide, customSet]);

  const renderIdle = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center border border-indigo-500/20 mb-4">
        <ImageIcon className="w-10 h-10 text-indigo-400" />
      </div>
      <div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-4">Thematic Apperception Test</h2>
        <p className="text-slate-400 font-medium">12 Pictures • 1 Blank Slide • 30s View • 4m Write</p>
      </div>

      {!isFullBattery && (
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 w-full justify-center mt-6">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Select Practice Set:</span>
           <select 
             value={customSet ? 'custom' : setIndex} 
             onChange={(e) => {
                if (e.target.value !== 'custom') {
                    setSetIndex(Number(e.target.value));
                    setCustomSet(null);
                }
             }}
             className="bg-[#162840] border border-white/10 text-white text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-bold outline-none cursor-pointer"
           >
             {Array.from({ length: TOTAL_SETS }).map((_, i) => (
                <option key={i} value={i}>TAT Practice Set {i + 1}</option>
             ))}
             {customSet && <option value="custom">Custom Uploaded Set</option>}
           </select>
        </div>
      )}

      <div className="bg-[#162840] border border-white/5 rounded-3xl p-6 text-left w-full">
        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Instructions:</h4>
        <ul className="text-sm text-slate-400 space-y-2 font-medium">
          <li>• You will be shown a picture for 30 seconds.</li>
          <li>• After that, you have 4 minutes to write a story.</li>
          <li>• Story should have: What led to the situation, what is happening now, and what will be the outcome.</li>
          <li>• The last (13th) slide will be blank. Write a story from your own imagination.</li>
        </ul>
      </div>

      <div className="flex gap-4">
          <button onClick={startTest} className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black py-4 px-10 rounded-[24px] transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-sm w-full md:w-auto flex items-center justify-center gap-2">
            Start Set {customSet ? '(Custom)' : setIndex + 1}
          </button>
          
          {!isFullBattery && (
            <>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/5 hover:bg-white/10 active:scale-95 text-white font-bold py-4 px-6 rounded-[24px] transition-all border border-white/10 text-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Custom Set
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileUpload} />
            </>
          )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto bg-charcoal/80 border border-white/10 rounded-3xl shadow-glass overflow-hidden backdrop-blur-xl text-slate-200">
      
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-white/10 p-5 flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-xl font-black tracking-widest uppercase text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-olive-light" />
            Thematic Apperception Test
          </h2>
          <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest uppercase">30s View // 4m Write // 13 Slides // Board President AI</p>
        </div>
      </div>

      <div className="min-h-[600px] w-full bg-black/50 relative overflow-hidden flex flex-col">
        {phase === 'IDLE' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
                <ShieldAlert className="w-16 h-16 text-olive-light opacity-80" />
                <h3 className="text-3xl font-black tracking-[0.2em] text-white uppercase">TAT Instructions</h3>
                <p className="text-slate-400 max-w-2xl leading-relaxed text-lg">
                    You will be shown 12 pictures, each for 30 seconds. Write a complete story: what led to the situation, what is happening, and what will be the outcome. The 13th slide is blank.
                </p>
                <div className="bg-olive/10 border border-olive/30 rounded-xl p-4 max-w-lg text-left">
                    <p className="text-olive-light text-[9px] font-black uppercase tracking-widest mb-2">SSB TAT Formula</p>
                    <p className="text-slate-300 text-sm">Situation → Character Thought → Proactive Action → Positive Outcome. Your HERO must solve the problem.</p>
                </div>
                
                {/* Set Selection Grid */}
                <div className="w-full max-w-2xl mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select TAT Set:</span>
                        <span className="text-xs font-bold text-olive-light">Set {setIndex + 1} of {TOTAL_SETS}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {Array.from({ length: TOTAL_SETS }, (_, i) => {
                            const isSelected = i === setIndex;
                            const difficulty = i < 20 ? 'bg-green-500/20 border-green-500/30 text-green-500' : 
                                              i < 40 ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500' : 
                                              'bg-red-500/20 border-red-500/30 text-red-500';
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSetIndex(i)}
                                    className={`
                                        aspect-square rounded-lg border text-[8px] font-black transition-all
                                        ${isSelected ? 'bg-olive-light text-white border-olive-light scale-110 shadow-lg' : difficulty}
                                        hover:scale-105
                                    `}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>
                    {/* Difficulty Legend */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-[8px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Easy (1-20)</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Medium (21-40)</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Hard (41-60)</span>
                    </div>
                </div>
           </div>
        ) : phase === 'EVALUATING' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5">
                <Loader2 className="w-16 h-16 text-neon animate-spin drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Chief Psychologist Analyzing...</h3>
                <p className="text-slate-400 font-mono text-xs max-w-md text-center">
                   Board President is mapping hero patterns, OLQ projections, and generating ideal story rewrites for each slide...
                </p>
           </div>
        ) : phase === 'DONE' && evaluation ? (
           <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex-1 p-8 overflow-y-auto custom-scrollbar h-[600px] space-y-8"
           >
               {/* Board Verdict */}
               <div className="bg-slate-900/80 border border-olive/30 rounded-2xl p-6">
                   <p className="text-[9px] font-black text-olive-light uppercase tracking-[0.3em] mb-2">Chief Psychologist — Board President Verdict</p>
                   <p className="text-slate-200 font-bold leading-relaxed italic">"{evaluation.chief_psychologist_verdict}"</p>
               </div>

               {/* Score + Theme */}
               <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/5">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Dominant Theme</p>
                       <p className="text-slate-200 text-sm font-bold">{evaluation.dominant_psychological_theme}</p>
                   </div>
                   <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/5 text-center">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Overall TAT Score</p>
                       <p className={`text-4xl font-black tabular-nums ${(evaluation.overall_tat_score >= 70) ? 'text-neon' : (evaluation.overall_tat_score >= 50) ? 'text-amber-400' : 'text-red-400'}`}>
                           {evaluation.overall_tat_score}<span className="text-slate-600 text-xl">/100</span>
                       </p>
                   </div>
               </div>

               {/* OLQ Projection */}
               {evaluation.olq_projection?.length > 0 && (
                   <div className="bg-slate-900/60 rounded-2xl p-6 border border-white/5">
                       <p className="text-[9px] font-black text-olive-light uppercase tracking-[0.3em] mb-4">OLQ Projection Map</p>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                           {evaluation.olq_projection.map((olq: any, i: number) => (
                               <div key={i} className="bg-black/40 rounded-xl p-4 border border-white/5">
                                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{olq.olq}</p>
                                   <p className={`text-2xl font-black tabular-nums ${olq.score >= 7 ? 'text-neon' : olq.score >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                                       {olq.score}<span className="text-slate-700 text-xs">/10</span>
                                   </p>
                               </div>
                           ))}
                       </div>
                   </div>
               )}

               {/* Story Deep-Dive */}
               {evaluation.story_evaluations?.length > 0 && (
                   <div className="space-y-4">
                       <p className="text-white text-sm font-black uppercase tracking-[0.2em]">Story-by-Story Board Analysis</p>
                       {evaluation.story_evaluations.map((story: any, idx: number) => (
                           <div key={idx} className="bg-slate-900 border border-white/10 rounded-xl p-5 space-y-3">
                               <div className="flex items-center justify-between">
                                   <p className="text-olive-light font-black uppercase tracking-widest text-xs">Story {story.story_number}</p>
                                   <div className="flex items-center gap-3">
                                       <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${story.formula_compliance === 'FULL' ? 'bg-neon/10 text-neon' : story.formula_compliance === 'PARTIAL' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                                           {story.formula_compliance}
                                       </span>
                                       <span className="text-lg font-black text-white">{story.board_score}/10</span>
                                   </div>
                               </div>
                               {story.red_flags?.length > 0 && (
                                   <div className="text-red-300 text-xs bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                       Red Flags: {story.red_flags.join(' | ')}
                                   </div>
                               )}
                               <p className="text-slate-400 text-xs leading-relaxed">{story.psychological_insight}</p>
                               {story.ideal_story_rewrite && (
                                   <div className="bg-olive/10 border border-olive/20 rounded-lg p-4">
                                       <p className="text-olive-light text-[9px] font-black uppercase tracking-widest mb-2">Ideal Model Story</p>
                                       <p className="text-slate-300 text-xs leading-relaxed italic">"{story.ideal_story_rewrite}"</p>
                                   </div>
                               )}
                           </div>
                       ))}
                   </div>
               )}

               {/* Mastery Plan */}
               {evaluation.tat_mastery_plan && (
                   <div className="bg-olive/10 border border-olive/30 rounded-2xl p-6">
                       <p className="text-olive-light font-black uppercase tracking-widest text-[9px] mb-3">Board-Prescribed TAT Mastery Plan</p>
                       <p className="text-slate-200 text-sm leading-relaxed">{evaluation.tat_mastery_plan}</p>
                   </div>
               )}

                <div className="flex gap-4">
                    <button onClick={nextSet} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-colors">
                        Next Set
                    </button>
                    <button onClick={startTest} className="flex-1 py-4 bg-olive hover:bg-olive-light text-white font-black uppercase tracking-widest text-sm rounded-xl transition-colors">
                        Retake Set {setIndex + 1}
                    </button>
                </div>
           </motion.div>
        ) : (
           // Active Test
           <div className="flex-1 flex flex-col relative h-[600px]">
                {/* Timer Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-800 z-20">
                    <div 
                         className={`h-full transition-all duration-1000 ease-linear ${phase === 'VIEWING' ? 'bg-blue-500' : 'bg-red-500'}`}
                         style={{ width: `${(timeLeft / (phase === 'VIEWING' ? PICTURE_TIME : WRITING_TIME)) * 100}%` }}
                    />
                </div>

                <div className="absolute top-4 right-6 flex items-center gap-2 z-20 bg-black/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                    <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                    <span className={`font-mono font-black text-xl ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                <div className="absolute top-4 left-6 z-20 bg-black/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                     <span className="text-slate-400 text-xs uppercase font-bold tracking-widest mr-2">Slide</span>
                     <span className="text-white font-mono font-bold text-lg">{currentSlide + 1}/13</span>
                </div>

                <AnimatePresence mode="wait">
                    {phase === 'VIEWING' && (
                        <motion.div
                            key="viewing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, filter: 'blur(20px)' }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center p-8 z-10"
                        >
                            {currentSlide === 12 ? (
                                <div className="w-full max-w-2xl h-96 bg-white rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center justify-center">
                                    <h2 className="text-black/20 text-4xl font-black uppercase tracking-widest">Blank Slide</h2>
                                </div>
                            ) : (
                                <div className="w-full max-w-2xl h-96 bg-slate-800 rounded-xl overflow-hidden border border-white/20 shadow-2xl relative">
                                    {typeof getCurrentTatSvg() === 'string' && getCurrentTatSvg().trim().startsWith('<svg') ? (
                                        <div 
                                            className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                                            dangerouslySetInnerHTML={{ __html: getCurrentTatSvg() }}
                                        />
                                    ) : (
                                        <img 
                                            src={getCurrentTatSvg()} 
                                            alt="TAT Scenario" 
                                            className="w-full h-full object-contain bg-black/50"
                                        />
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {phase === 'WRITING' && (
                        <motion.div
                            key="writing"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 flex flex-col p-8 pt-20 z-10"
                        >
                            <textarea
                                ref={textareaRef}
                                value={story}
                                onChange={(e) => setStory(e.target.value)}
                                placeholder="Write your story here... (Situation → Hero's Thought → Proactive Action → Positive Outcome)"
                                className="flex-1 bg-charcoal border border-white/10 rounded-2xl p-6 text-lg text-white placeholder-slate-600 focus:outline-none focus:border-olive-light focus:ring-1 focus:ring-olive-light transition-all resize-none font-medium leading-relaxed shadow-inner"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
           </div>
        )}
      </div>
    </div>
  );
}
