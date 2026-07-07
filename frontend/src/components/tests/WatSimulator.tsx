'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Zap, ShieldAlert, Loader2, Send, UploadCloud, PenTool, Keyboard, X } from 'lucide-react';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import { useTimer } from '@/hooks/useTimer';
import enrichedWatBank from '@/data/wat_repository_enriched.json';

const TOTAL_WORDS = 25;
const WORD_TIME = 15; // 15 seconds per word

interface WatScenario {
    id: string;
    word: string;
}

interface WatResponse {
    scenario_id?: string;
    word: string;
    response: string;
}

export interface WatEvaluation {
    overall_score: number;
    mindset_summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    responses: WatResponse[];
}

export interface WatSimulatorProps {
    isFullBattery?: boolean;
    onComplete?: (responses: WatResponse[]) => void;
}

export default function WatSimulator({ isFullBattery, onComplete }: WatSimulatorProps) {
  const [setIndex, setSetIndex] = useState(0);
  const [sessionState, setSessionState] = useState<any>(null);
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'IDLE' | 'TEST' | 'UPLOAD_SHEET' | 'EVALUATING' | 'DONE' | 'DISQUALIFIED'>('IDLE');

  // Anti-Cheat Hook
  useAntiCheat({
    enabled: phase === 'TEST',
    onInfraction: () => setPhase('DISQUALIFIED')
  });
  const [testMode, setTestMode] = useState<'TYPING' | 'AUTHENTIC'>('AUTHENTIC');
  const [response, setResponse] = useState('');
  const [allResponses, setAllResponses] = useState<WatResponse[]>([]);
  const [evaluation, setEvaluation] = useState<WatEvaluation | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchScenarios = async () => {
    // Just a stub for UI loading indication
    setIsLoadingScenarios(true);
    setTimeout(() => setIsLoadingScenarios(false), 500);
  };

  useEffect(() => {
    fetchScenarios();
  }, [setIndex]);

  const handleTimerExpireRef = useRef<() => void>(() => {});
  const timer = useTimer({
    initialTime: WORD_TIME,
    onExpire: () => handleTimerExpireRef.current?.(),
  });

  handleTimerExpireRef.current = () => {
    if (phase === 'TEST') {
      saveAndNext();
    }
  };

  useEffect(() => {
    if (phase === 'TEST' && testMode === 'TYPING' && inputRef.current) {
        inputRef.current.focus();
    }
  }, [phase, currentIdx, testMode]);

  const startTest = async () => {
    setIsLoadingScenarios(true);
    try {
      const res = await fetch('/api/wat/session/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            sessionId: `wat-session-${Date.now()}`,
            wordCount: TOTAL_WORDS,
            flashDurationSeconds: WORD_TIME,
            seed: Date.now()
          }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to init session');

      setSessionState(data.state);
      setCurrentWord(data.next);
      setCurrentIdx(0);
      setAllResponses([]);
      setResponse('');
      setEvaluation(null);
      setPhase('TEST');
      timer.setTimeAndStart(data.next.flashDurationSeconds);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to start test on backend', type: 'error' });
    } finally {
      setIsLoadingScenarios(false);
    }
  };

  const nextSet = () => {
    setSetIndex(prev => prev + 1);
    setPhase('IDLE');
  };

  const saveAndNext = async () => {
    if (!currentWord || !sessionState) return;

    const currentResponseText = testMode === 'AUTHENTIC' ? "[HANDWRITTEN]" : (response.trim() || "[SKIPPED]");
    
    const payload: WatResponse = {
        scenario_id: currentWord.wordId,
        word: currentWord.word,
        response: currentResponseText
    };

    const newResponses = [...allResponses, payload];
    setAllResponses(newResponses);
    setResponse('');

    try {
      const res = await fetch('/api/wat/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: sessionState,
          responseText: currentResponseText
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit response');

      setSessionState(data.state);

      if (data.state.stage === 'finished' || !data.next) {
          if (testMode === 'AUTHENTIC') {
              setPhase('UPLOAD_SHEET');
          } else {
              if (isFullBattery && onComplete) {
                  onComplete(newResponses);
              } else {
                  generateEvaluation(newResponses);
              }
          }
      } else {
          setCurrentWord(data.next);
          setCurrentIdx(data.state.currentIndex);
          timer.setTimeAndStart(data.next.flashDurationSeconds);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to submit answer to backend', type: 'error' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setOcrStatus('Converting image...');
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        setOcrStatus('Extracting handwriting via AI...');
        const wordList = allResponses.map(r => r.word);
        
        const res = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64data, words: wordList })
        });
        
        const data = await res.json();
        
        if (data.success && data.parsed) {
            setOcrStatus('Merging data...');
            // Merge scenario IDs with parsed responses
            const finalResponses: WatResponse[] = data.parsed.map((p: { word: string; response: string }, idx: number) => ({
                scenario_id: allResponses[idx]?.scenario_id || `word-${idx}`,
                word: p.word,
                response: p.response
            }));
            
            if (isFullBattery && onComplete) {
                onComplete(finalResponses);
            } else {
                await generateEvaluation(finalResponses);
            }
        } else {
            setToast({ message: 'Failed to parse handwriting: ' + (data.error || 'Unknown error'), type: 'error' });
            setTimeout(() => setToast(null), 4000);
            setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Upload failed. Please try again.', type: 'error' });
      setTimeout(() => setToast(null), 4000);
      setIsUploading(false);
    }
  };

  const generateEvaluation = async (finalResponses: WatResponse[]) => {
    setPhase('EVALUATING');
    try {
        const res = await fetch('/api/evaluate-wat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses: finalResponses })
        });

        const data = await res.json();
        
        if (data.status === 'success' || data.evaluation) {
            const evaluationResult = data.evaluation || data;
            setEvaluation({
                overall_score: evaluationResult.board_score || evaluationResult.overallScore || 50,
                mindset_summary: evaluationResult.board_president_verdict || evaluationResult.mindset_summary || 'Response analyzed successfully.',
                strengths: evaluationResult.strengths || ['Identified positive projections'],
                weaknesses: evaluationResult.critical_weaknesses ? evaluationResult.critical_weaknesses.map((w: any) => `${w.word}: ${w.why_it_fails}`) : (evaluationResult.weaknesses || ['No critical red flags']),
                recommendations: evaluationResult.reform_protocol || evaluationResult.recommendations || 'Practice improving reaction time and generating constructive sentences under stress.',
                responses: finalResponses
            });
            setPhase('DONE');
        } else {
            setPhase('DONE');
        }
    } catch {
        setPhase('DONE');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0f172a] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl text-slate-200 relative">
      
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
            <Zap className="w-5 h-5 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
            Word Association Test (Set {setIndex + 1})
          </h2>
          <p className="text-[10px] text-slate-500 font-black mt-1 tracking-widest uppercase">
            15s Per Word // {TOTAL_WORDS} Words // Rapid Fire
          </p>
        </div>
        {phase === 'IDLE' && (
          <div className="flex flex-col gap-4 items-end">
            <div className="flex items-center gap-2 bg-black/20 p-1 rounded-xl">
               <button 
                  onClick={() => setTestMode('AUTHENTIC')}
                  className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase rounded-lg flex items-center gap-2 transition-all ${testMode === 'AUTHENTIC' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-white'}`}
               >
                  <PenTool className="w-3 h-3" /> Paper Mode
               </button>
               <button 
                  onClick={() => setTestMode('TYPING')}
                  className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase rounded-lg flex items-center gap-2 transition-all ${testMode === 'TYPING' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-white'}`}
               >
                  <Keyboard className="w-3 h-3" /> Typing Mode
               </button>
            </div>
            
            <button 
                 onClick={startTest}
                 disabled={isLoadingScenarios}
                 className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-700 disabled:text-slate-400 text-black font-black tracking-widest text-xs uppercase rounded-xl transition-all shadow-xl shadow-yellow-500/20 flex justify-center items-center gap-2"
            >
                 {isLoadingScenarios ? (
                     <><Loader2 className="w-4 h-4 animate-spin" /> Fetching Scenarios...</>
                 ) : (
                     `Begin WAT - Set ${setIndex + 1}`
                 )}
            </button>
          </div>
        )}
      </div>

      <div className="min-h-[450px] w-full bg-black/20 relative overflow-hidden flex flex-col">
        {phase === 'IDLE' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-6">
                <ShieldAlert className="w-16 h-16 text-yellow-500/20" />
                <h3 className="text-3xl font-black tracking-[0.2em] text-white uppercase">Association Rules</h3>
                {testMode === 'AUTHENTIC' ? (
                  <p className="text-slate-400 max-w-2xl leading-relaxed text-lg font-bold">
                    <span className="text-yellow-400 block mb-2">Authentic Paper Mode Active</span>
                    Grab a pen and a blank sheet of paper. 
                    A word will flash for exactly 15 seconds and auto-advance. Write your sentence down on paper. 
                    When all 60 words are complete, take a photo of your sheet and upload it for AI OCR evaluation.
                  </p>
                ) : (
                  <p className="text-slate-500 max-w-2xl leading-relaxed text-lg font-bold">
                    A word will appear on the screen for 15 seconds. 
                    Type the first positive, meaningful sentence that comes to your mind before the timer runs out.
                  </p>
                )}
           </div>
        ) : phase === 'UPLOAD_SHEET' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-6">
               {!isUploading ? (
                   <>
                       <UploadCloud className="w-16 h-16 text-yellow-500/50" />
                       <h3 className="text-3xl font-black tracking-[0.2em] text-white uppercase">Upload Answer Sheet</h3>
                       <p className="text-slate-400 font-bold max-w-md">
                           Take a clear, well-lit photo of your handwritten responses. Make sure all sentences are readable.
                       </p>
                       <label className="mt-4 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black tracking-widest text-sm uppercase rounded-2xl cursor-pointer transition-all shadow-xl shadow-yellow-500/20 flex items-center gap-2">
                           <UploadCloud className="w-5 h-5" /> Select Image
                           <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                       </label>
                   </>
               ) : (
                   <>
                       <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(234,179,8,0.3)]"></div>
                       <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white animate-pulse">{ocrStatus}</h3>
                   </>
               )}
           </div>
        ) : phase === 'EVALUATING' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 gap-6 text-center">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(234,179,8,0.3)]"></div>
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Analyzing Semantic Patterns</h3>
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest max-w-md">
                   AI Psychologist is scanning responses for psychological indicators, positive outlook, and emotional stability...
                </p>
           </div>
        ) : phase === 'DISQUALIFIED' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 gap-6 text-center">
                <ShieldAlert className="w-24 h-24 text-red-500 animate-pulse" />
                <h3 className="text-4xl font-black uppercase tracking-[0.2em] text-red-500">WAT (Disqualified)</h3>
                <p className="text-slate-400 font-bold max-w-md">
                   You have committed a security infraction by switching tabs or losing focus during an active test. 
                   SSB testing requires strict discipline. This infraction has been logged.
                </p>
                <button 
                    onClick={() => setPhase('IDLE')}
                    className="mt-6 px-8 py-3 bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-[0.1em] text-sm rounded-xl transition-all shadow-xl shadow-red-500/20"
                >
                    Acknowledge & Restart
                </button>
           </div>
        ) : phase === 'DONE' && evaluation ? (
           <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex-1 p-8 overflow-y-auto custom-scrollbar h-[500px]"
           >
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                   <div className="flex items-center gap-3">
                       <CheckCircle className="w-8 h-8 text-green-500" />
                       <h3 className="text-2xl font-black text-white uppercase tracking-[0.1em]">Psychological Dossier</h3>
                   </div>
                   <button 
                       onClick={nextSet}
                       className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-[0.1em] text-xs rounded-xl transition-all shadow-xl shadow-yellow-500/20"
                   >
                       Start Next Set
                   </button>
               </div>
               
               <div className="space-y-8">
                   <div className="bg-[#162840] p-8 rounded-3xl border border-white/5 shadow-xl">
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-yellow-500 mb-4">Mindset Analysis</h4>
                        <p className="text-slate-300 text-sm leading-relaxed font-bold">{evaluation.mindset_summary}</p>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-500/5 p-6 rounded-3xl border border-green-500/20">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-4">Positive Projections</h5>
                            <ul className="text-xs space-y-3 text-slate-400 font-bold">
                                {evaluation.strengths?.map((s: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-green-500 mt-1.5" />
                                    {s}
                                  </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/20">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-4">Negative Indicators</h5>
                            <ul className="text-xs space-y-3 text-slate-400 font-bold">
                                {evaluation.weaknesses?.map((w: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5" />
                                    {w}
                                  </li>
                                ))}
                            </ul>
                        </div>
                   </div>

                   {/* Optionally render extracted OCR text if in authentic mode */}
                   {testMode === 'AUTHENTIC' && evaluation.responses && (
                     <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">AI Transcribed Responses</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {evaluation.responses.map((r: WatResponse, idx: number) => (
                              <div key={idx} className="bg-black/20 p-3 rounded-lg border border-white/5">
                                 <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">{idx + 1}. {r.word}</span>
                                 <p className="text-slate-300 text-xs mt-1 font-medium">{r.response}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                   )}

                   <div className="bg-yellow-500/5 p-8 rounded-3xl border border-yellow-500/20">
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-yellow-500 mb-4">Psychologist Recommendations</h4>
                        <p className="text-slate-300 text-sm leading-relaxed font-bold">{evaluation.recommendations}</p>
                   </div>
               </div>
           </motion.div>
        ) : (
           // Active Test
           <div className="flex-1 flex flex-col relative">
                {/* Timer Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-20">
                    <motion.div 
                         key={currentIdx}
                         initial={{ width: '100%' }}
                         animate={{ width: '0%' }}
                         transition={{ duration: WORD_TIME, ease: 'linear' }}
                         className="h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                    />
                </div>

                <div className="absolute top-6 right-8 flex items-center gap-2 z-20 bg-black/40 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="font-mono font-black text-xl text-white tabular-nums">
                        {timer.formattedTime}
                    </span>
                </div>

                <div className="absolute top-6 left-8 z-20 bg-black/40 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                     <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mr-2">Word</span>
                     <span className="text-white font-mono font-black text-lg">{currentIdx + 1}/{TOTAL_WORDS}</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-12 pt-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                            className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl mb-16 uppercase italic"
                        >
                            {currentWord?.word}
                        </motion.div>
                    </AnimatePresence>

                    {testMode === 'TYPING' ? (
                        <div className="w-full max-w-2xl relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveAndNext()}
                                placeholder="Write your response sentence..."
                                className="w-full bg-black/40 border-2 border-white/5 rounded-3xl p-8 text-xl text-white placeholder-slate-700 focus:outline-none focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 transition-all shadow-2xl text-center font-bold"
                            />
                            <button 
                                onClick={saveAndNext}
                                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-yellow-500 rounded-2xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
                            >
                                <Send className="w-5 h-5 text-black" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl relative text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-500 animate-pulse mt-8">
                                <PenTool className="w-8 h-8" />
                                <p className="font-bold text-sm tracking-widest uppercase">Write sentence on physical paper</p>
                            </div>
                        </div>
                    )}
                </div>
           </div>
        )}
      </div>
    </div>
  );
}
