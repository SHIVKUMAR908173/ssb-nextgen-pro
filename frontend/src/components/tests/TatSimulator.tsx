'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, ShieldAlert, Image as ImageIcon, Loader2, Upload, Play, Brain, RefreshCcw } from 'lucide-react';
import tatSampleStories from '@/data/tat_sample_stories.json';
import { useTimer } from '@/hooks/useTimer';
import { experimental_useObject } from '@ai-sdk/react';
import { z } from 'zod';

const tatEvaluationSchema = z.object({
  chief_psychologist_verdict: z.string(),
  dominant_psychological_theme: z.string(),
  hero_pattern_analysis: z.string(),
  olq_projection: z.array(z.object({
    olq: z.string(),
    score: z.number(),
    story_evidence: z.string()
  })),
  story_evaluations: z.array(z.object({
    story_number: z.number(),
    candidate_story: z.string(),
    formula_compliance: z.string(),
    red_flags: z.array(z.string()),
    psychological_insight: z.string(),
    board_score: z.number(),
    ideal_story_rewrite: z.string()
  })),
  recurring_vulnerabilities: z.string(),
  tat_mastery_plan: z.string(),
  overall_tat_score: z.number()
});

const TOTAL_SETS = 1;
const TOTAL_SLIDES = 12;
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
  const [sessionState, setSessionState] = useState<any>(null);
  const [currentSlideObj, setCurrentSlideObj] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phase, setPhase] = useState<'IDLE' | 'VIEWING' | 'WRITING' | 'EVALUATING' | 'DONE'>('IDLE');
  const [story, setStory] = useState('');
  const [allStories, setAllStories] = useState<TatResponse[]>([]);
  const [customSet, setCustomSet] = useState<any[] | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fallbackEval, setFallbackEval] = useState<any>(null);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(false);

  const handleTimerExpireRef = useRef<() => void>(() => {});

  const timer = useTimer({
    initialTime: PICTURE_TIME,
    onExpire: () => handleTimerExpireRef.current?.(),
  });

  const { object: streamedEval, submit, isLoading } = experimental_useObject({
    api: '/api/evaluate-tat',
    schema: tatEvaluationSchema,
    onError: (error: any) => {
        console.error("Stream error", error);
        setFallbackEval({
            chief_psychologist_verdict: 'Evaluation service temporarily unavailable. Please try again.',
            dominant_psychological_theme: 'N/A',
            overall_tat_score: 0,
            olq_projection: [],
            story_evaluations: allStories.map((r, i) => ({
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
    },
    onFinish: (event: any) => {
        try {
            const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
            history.push({
                id: `TAT-${Date.now()}`,
                test: 'Thematic Apperception Test',
                score: event.object?.overall_tat_score || 50,
                total: 100,
                date: new Date().toISOString(),
                status: 'completed',
                improvements: ['Review Chief Psychologist Feedback', 'Practice with model rewrites']
            });
            localStorage.setItem('testHistory', JSON.stringify(history));
        } catch (err) {}
        setPhase('DONE');
    }
  });

  const evaluation = fallbackEval || streamedEval;

  const generateEvaluation = (finalResponses: TatResponse[]) => {
    if (isFullBattery && onComplete) {
        onComplete(finalResponses);
        return;
    }
    setPhase('EVALUATING');
    submit({ stories: finalResponses });
  };

  const saveAndAdvance = useCallback(async () => {
    if (!currentSlideObj || !sessionState) return;

    const isBlank = currentSlideObj.isBlank;
    const currentResponseText = story.trim() || '[NO STORY WRITTEN]';
    
    const payload = {
        trigger: isBlank ? 'Blank Slide' : `TAT Picture ${currentSlide + 1}`,
        response: currentResponseText
    };
    const newStories = [...allStories, payload];
    setAllStories(newStories);
    setStory('');

    try {
      const res = await fetch('/api/tat/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: sessionState,
          responseText: currentResponseText
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit answer');

      setSessionState(data.state);

      if (data.state.stage === 'finished' || !data.next) {
        generateEvaluation(newStories);
      } else {
        setCurrentSlideObj(data.next);
        setCurrentSlide(data.state.currentIndex);
        setPhase('VIEWING');
        timer.setTimeAndStart(data.next.pictureTimeSeconds);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit story to backend.');
    }
  }, [currentSlideObj, sessionState, story, currentSlide, allStories, timer, isFullBattery, onComplete]);

  handleTimerExpireRef.current = () => {
    if (phase === 'VIEWING') {
      setPhase('WRITING');
      timer.setTimeAndStart(WRITING_TIME);
    } else if (phase === 'WRITING') {
      saveAndAdvance();
    }
  };

  useEffect(() => {
    if (phase === 'WRITING' && textareaRef.current) textareaRef.current.focus();
  }, [phase]);

  const startTest = async () => {
    setIsLoadingScenarios(true);
    try {
      const res = await fetch('/api/tat/session/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            sessionId: `tat-session-${Date.now()}`,
            scenarioCount: TOTAL_SLIDES,
            pictureTimeSeconds: PICTURE_TIME,
            writingTimeSeconds: WRITING_TIME,
            seed: Date.now()
          }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to init session');

      setSessionState(data.state);
      setCurrentSlideObj(data.next);
      setCurrentSlide(0); 
      setAllStories([]); 
      setStory(''); 
      setFallbackEval(null);
      setPhase('VIEWING'); 
      timer.setTimeAndStart(data.next.pictureTimeSeconds);
    } catch (err) {
      console.error(err);
      alert('Failed to start TAT session on backend.');
    } finally {
      setIsLoadingScenarios(false);
    }
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





  const getCurrentTatSvg = useCallback(() => {
    if (customSet && customSet[currentSlide]) return customSet[currentSlide].url;
    if (currentSlideObj?.isBlank) return '';
    return currentSlideObj?.imageUrl || '';
  }, [currentSlideObj, customSet]);

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
          <li>• The last (12th) slide will be blank. Write a story from your own imagination.</li>
        </ul>
      </div>

      <div className="flex gap-4">
          <button onClick={startTest} disabled={isLoadingScenarios} className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black py-4 px-10 rounded-[24px] transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-sm w-full md:w-auto flex items-center justify-center gap-2">
            {isLoadingScenarios ? <Loader2 className="w-5 h-5 animate-spin" /> : `Start Set ${customSet ? '(Custom)' : setIndex + 1}`}
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
    <div className="w-full space-y-8">
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
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Thematic Apperception Test</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                  TAT <span className="text-purple-500">Simulator</span>
                </h1>
                <p className="text-slate-400 font-bold leading-relaxed max-w-2xl">
                  You will be shown 11 pictures, each for 30 seconds. Write a complete story: what led to the situation, what is happening, and what will be the outcome. The 12th slide is blank.
                </p>
              </div>

              <div className="h-px bg-white/5"></div>

              {!isFullBattery && (
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select TAT Set:</span>
                    <span className="text-xs font-bold text-purple-400">Set {setIndex + 1} of {TOTAL_SETS}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {Array.from({ length: TOTAL_SETS }, (_, i) => {
                          const isSelected = i === setIndex;
                          const difficulty = i < 20 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                                            i < 40 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 
                                            'bg-red-500/10 border-red-500/20 text-red-500';
                          return (
                              <button
                                  key={i}
                                  onClick={() => {
                                      setSetIndex(i);
                                      setCustomSet(null);
                                  }}
                                  className={`
                                      aspect-square rounded-xl border text-[10px] font-black transition-all flex items-center justify-center
                                      ${isSelected ? 'bg-purple-500 text-white border-purple-500 shadow-lg scale-110' : difficulty}
                                      hover:scale-105
                                  `}
                              >
                                  {i + 1}
                              </button>
                          );
                      })}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 pt-4">
                <button
                  onClick={startTest}
                  disabled={isLoadingScenarios}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-10 py-5 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingScenarios ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                  {isLoadingScenarios ? 'Initializing...' : `Start Set ${customSet ? '(Custom)' : setIndex + 1}`}
                </button>
                
                {!isFullBattery && (
                  <>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto bg-[#162840] hover:bg-[#1e3658] border border-white/5 text-white px-8 py-5 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all"
                    >
                      <Upload className="w-4 h-4" /> Custom Set
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileUpload} />
                  </>
                )}
              </div>
            </div>

            {/* Sidebar Guidelines Panel */}
            <div className="bg-[#162840]/60 border border-white/5 rounded-[48px] p-10 flex flex-col justify-between space-y-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">SSB TAT Formula</h2>
                </div>
                
                <ul className="space-y-4 text-xs font-bold text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
                    <span>1. SITUATION: What led to the current scene in the picture?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
                    <span>2. THOUGHT: What is the main character (Hero) thinking and feeling?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
                    <span>3. ACTION: What proactive steps does the hero take to solve the problem?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
                    <span>4. OUTCOME: Provide a logical, positive conclusion.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#0f172a] rounded-[32px] p-6 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-500 animate-pulse" />
                  <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Timing</span>
                </div>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                  30 seconds to perceive the image. 4 minutes to write. The system will automatically advance to the next slide when time expires.
                </p>
              </div>
            </div>

          </motion.div>
        )}

        {/* ACTIVE TEST PHASE */}
        {(phase === 'VIEWING' || phase === 'WRITING') && (
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
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 text-purple-400`}>
                  {phase === 'VIEWING' ? 'Perception Phase' : 'Writing Phase'}
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Slide {currentSlide + 1} of 12
                </span>
              </div>
            </div>

            {/* Main Interactive Screen */}
            <div className="bg-[#0f172a] rounded-[48px] p-8 md:p-12 border border-white/5 relative overflow-hidden shadow-2xl space-y-8">
              
              {/* Timing Countdown Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    {phase === 'VIEWING' ? 'View Window' : 'Write Window'}
                  </span>
                  <span className={`${timer.timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                    {timer.formattedTime}
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timer.timeLeft / (phase === 'VIEWING' ? PICTURE_TIME : WRITING_TIME)) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                    className={`h-full ${timer.timeLeft <= 10 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-purple-500 shadow-[0_0_10px_#a855f7]'}`}
                  />
                </div>
              </div>

              {/* View/Write Area */}
              <AnimatePresence mode="wait">
                  {phase === 'VIEWING' && (
                      <motion.div
                          key="viewing"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, filter: 'blur(20px)' }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-96 flex items-center justify-center relative"
                      >
                          {currentSlideObj?.isBlank ? (
                              <div className="w-full h-full bg-white rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center">
                                  <h2 className="text-black/20 text-4xl font-black uppercase tracking-widest">Blank Slide</h2>
                              </div>
                          ) : (
                              <div className="w-full h-full bg-[#162840] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                                  {typeof getCurrentTatSvg() === 'string' && getCurrentTatSvg().trim().startsWith('<svg') ? (
                                      <div 
                                          className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                                          dangerouslySetInnerHTML={{ __html: getCurrentTatSvg() }}
                                      />
                                  ) : (
                                      <img 
                                          src={getCurrentTatSvg()} 
                                          alt="TAT Scenario" 
                                          className="w-full h-full object-contain"
                                      />
                                  )}
                              </div>
                          )}
                      </motion.div>
                  )}

                  {phase === 'WRITING' && (
                      <motion.div
                          key="writing"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full h-96 flex flex-col"
                      >
                          <textarea
                              ref={textareaRef}
                              value={story}
                              onChange={(e) => setStory(e.target.value)}
                              placeholder="Write your story here... (Situation → Hero's Thought → Proactive Action → Positive Outcome)"
                              className="flex-1 bg-[#162840] border border-white/5 rounded-3xl p-8 text-lg text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none font-medium leading-relaxed shadow-inner"
                          />
                      </motion.div>
                  )}
              </AnimatePresence>

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
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Resolving Psychological Stream</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                AI Board President analyzing responses
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
                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px]"></div>
                
                <div className="space-y-4 relative z-10 text-center md:text-left">
                  <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto md:mx-0">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
                    <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">TAT Evaluation Complete</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                    Dominant Theme: <br/>
                    <span className="text-purple-400">
                      {evaluation.dominant_psychological_theme}
                    </span>
                  </h1>
                  
                  {evaluation.chief_psychologist_verdict && (
                    <p className="text-slate-300 text-sm font-semibold leading-relaxed max-w-xl italic">
                      "{evaluation.chief_psychologist_verdict}"
                    </p>
                  )}
                </div>

                {/* Score Dial */}
                <div className="bg-[#162840] border border-white/5 rounded-[40px] p-10 text-center min-w-[220px] shadow-2xl relative shrink-0">
                  <p className={`text-6xl font-black ${evaluation.overall_tat_score >= 70 ? 'text-emerald-500' : evaluation.overall_tat_score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {evaluation.overall_tat_score}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Overall Score / 100</p>
                  <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
                    <div 
                      className={`h-full ${evaluation.overall_tat_score >= 70 ? 'bg-emerald-500' : evaluation.overall_tat_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${evaluation.overall_tat_score}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Sidebar Quick Re-run */}
              <div className="bg-[#162840] border border-white/5 rounded-[48px] p-10 flex flex-col justify-between space-y-6 shadow-xl">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Next Steps</h3>
                  {evaluation.tat_mastery_plan && (
                    <p className="mt-4 text-xs font-semibold text-slate-400 leading-relaxed">
                      {evaluation.tat_mastery_plan}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={nextSet}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                  >
                    Next Set
                  </button>
                  <button
                    onClick={() => {
                        setPhase('IDLE');
                        setAllStories([]);
                    }}
                    className="w-full bg-[#0f172a] hover:bg-[#1e3658] border border-white/5 text-white py-4 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCcw className="w-4 h-4" /> Retake
                  </button>
                </div>
              </div>

            </div>

            {/* OLQ Projection */}
            {evaluation.olq_projection?.length > 0 && (
              <div className="bg-[#0f172a] rounded-[48px] p-12 border border-white/5 shadow-2xl space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">OLQ Projection Map</h2>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Scale 1.0 to 10.0</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {evaluation.olq_projection.map((olq: any, i: number) => (
                    <div key={i} className="bg-[#162840]/60 border border-white/5 rounded-[24px] p-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {olq.olq}
                        </span>
                        <span className={`text-sm font-black ${olq.score >= 7 ? 'text-emerald-400' : olq.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>{olq.score.toFixed(1)}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${olq.score >= 7 ? 'bg-emerald-500' : olq.score >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${olq.score * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Story Deep-Dive */}
            {evaluation.story_evaluations?.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight px-4">Story-by-Story Board Analysis</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {evaluation.story_evaluations.map((story: any, idx: number) => (
                            <div key={idx} className="bg-[#0f172a] border border-white/5 rounded-[32px] p-8 space-y-6 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <p className="text-purple-400 font-black uppercase tracking-widest text-sm">Story {story.story_number}</p>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${story.formula_compliance === 'FULL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : story.formula_compliance === 'PARTIAL' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                            Formula: {story.formula_compliance}
                                        </span>
                                        <span className="text-xl font-black text-white">{story.board_score}/10</span>
                                    </div>
                                </div>
                                
                                {story.red_flags?.length > 0 && (
                                    <div className="text-red-400 text-xs font-semibold bg-red-500/10 rounded-2xl p-4 border border-red-500/20">
                                        <span className="font-black">RED FLAGS:</span> {story.red_flags.join(' | ')}
                                    </div>
                                )}
                                
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">{story.psychological_insight}</p>
                                
                                {story.ideal_story_rewrite && (
                                    <div className="bg-[#162840] border border-white/5 rounded-2xl p-6">
                                        <p className="text-purple-400 text-[9px] font-black uppercase tracking-widest mb-3">Ideal Model Story</p>
                                        <p className="text-slate-300 text-sm font-semibold leading-relaxed italic">"{story.ideal_story_rewrite}"</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
