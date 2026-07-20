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
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px]"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                  <Zap className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Word Association Test</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                  WAT <span className="text-yellow-500">Simulator</span>
                </h1>
                <p className="text-slate-400 font-bold leading-relaxed max-w-2xl">
                  {TOTAL_WORDS} words will be flashed for 15 seconds each. Write the very first constructive thought or sentence that comes to your mind. Do not skip any word.
                </p>
              </div>

              <div className="h-px bg-white/5"></div>

              {!isFullBattery && (
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-4 bg-[#162840] p-2 rounded-2xl border border-white/5 w-fit">
                    <button 
                        onClick={() => setTestMode('AUTHENTIC')}
                        className={`px-6 py-3 text-[10px] font-black tracking-widest uppercase rounded-xl flex items-center gap-2 transition-all ${testMode === 'AUTHENTIC' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        <PenTool className="w-4 h-4" /> Paper Mode
                    </button>
                    <button 
                        onClick={() => setTestMode('TYPING')}
                        className={`px-6 py-3 text-[10px] font-black tracking-widest uppercase rounded-xl flex items-center gap-2 transition-all ${testMode === 'TYPING' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Keyboard className="w-4 h-4" /> Typing Mode
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 pt-4">
                <button
                  onClick={startTest}
                  disabled={isLoadingScenarios}
                  className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-5 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingScenarios ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Zap className="w-4 h-4 text-black fill-black" />}
                  {isLoadingScenarios ? 'Initializing...' : `Start Set ${setIndex + 1}`}
                </button>
              </div>
            </div>

            {/* Sidebar Guidelines Panel */}
            <div className="bg-[#162840]/60 border border-white/5 rounded-[48px] p-10 flex flex-col justify-between space-y-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Assessor Guidelines</h2>
                </div>
                
                <ul className="space-y-4 text-xs font-bold text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0 mt-1.5"></span>
                    <span>1. Subconscious Reaction: Do not overthink. Write the very first sentence that forms.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0 mt-1.5"></span>
                    <span>2. Avoid Advice/Phrases: "Always be happy" or "Honesty is the best policy" are weak. Be original.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0 mt-1.5"></span>
                    <span>3. Avoid Negativity: Frame even negative words constructively (e.g. Defeat -> "Defeat teaches lessons for success").</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#0f172a] rounded-[32px] p-6 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Timing</span>
                </div>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                  Exactly 15 seconds per word. The test automatically advances. Missing a word breaks the psychological chain.
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
                <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                  {testMode === 'TYPING' ? 'Digital Input Mode' : 'Authentic Paper Mode'}
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Word {currentIdx + 1} of {TOTAL_WORDS}
                </span>
              </div>
            </div>

            {/* Main Interactive Screen */}
            <div className="bg-[#0f172a] rounded-[48px] p-8 md:p-16 border border-white/5 relative overflow-hidden shadow-2xl space-y-12 flex flex-col items-center justify-center min-h-[500px]">
              
              {/* Timing Countdown Slider */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                  <motion.div 
                      key={currentIdx}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: WORD_TIME, ease: 'linear' }}
                      className="h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
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
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                      className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl uppercase italic text-center w-full"
                  >
                      {currentWord?.word}
                  </motion.div>
              </AnimatePresence>

              {testMode === 'TYPING' ? (
                  <div className="w-full max-w-2xl relative z-10">
                      <input
                          ref={inputRef}
                          type="text"
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveAndNext()}
                          placeholder="Write your constructive sentence here..."
                          className="w-full bg-[#162840] border-2 border-white/5 rounded-[24px] p-6 text-xl text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all shadow-2xl text-center font-bold"
                      />
                  </div>
              ) : (
                  <div className="w-full max-w-2xl relative text-center z-10 bg-[#162840] rounded-[24px] p-6 border border-white/5">
                      <div className="flex flex-col items-center gap-4 text-slate-500 animate-pulse">
                          <PenTool className="w-8 h-8" />
                          <p className="font-bold text-sm tracking-widest uppercase">Write sentence {currentIdx + 1} on your physical sheet of paper</p>
                      </div>
                  </div>
              )}
            </div>
          </motion.div>
        )}

        {/* UPLOAD SHEET PHASE (FOR PAPER MODE) */}
        {phase === 'UPLOAD_SHEET' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="bg-[#0f172a] rounded-[48px] p-16 border border-white/5 relative overflow-hidden shadow-2xl text-center flex flex-col items-center justify-center gap-8 min-h-[400px]">
               <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-[80px]"></div>
               
               {!isUploading ? (
                   <>
                       <UploadCloud className="w-16 h-16 text-yellow-500" />
                       <div className="space-y-4 relative z-10">
                         <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Upload Answer Sheet</h3>
                         <p className="text-slate-400 font-bold max-w-lg mx-auto">
                             The test is over. Take a clear, well-lit photo of your handwritten responses and upload it for AI OCR Evaluation.
                         </p>
                       </div>
                       
                       <label className="relative z-10 mt-4 px-10 py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black tracking-widest text-sm uppercase rounded-full cursor-pointer transition-all shadow-xl shadow-yellow-500/20 flex items-center gap-3">
                           <UploadCloud className="w-5 h-5" /> Select Image
                           <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                       </label>
                   </>
               ) : (
                   <div className="space-y-6 relative z-10 flex flex-col items-center">
                       <div className="relative w-24 h-24 mx-auto">
                         <div className="absolute inset-0 rounded-full border-4 border-yellow-500/10" />
                         <div className="absolute inset-0 rounded-full border-4 border-t-yellow-500 animate-spin" />
                         <div className="absolute inset-0 flex items-center justify-center">
                           <UploadCloud className="w-8 h-8 text-yellow-500 animate-pulse" />
                         </div>
                       </div>
                       <h3 className="text-2xl font-black uppercase tracking-tight text-white">{ocrStatus}</h3>
                   </div>
               )}
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
              <div className="absolute inset-0 rounded-full border-4 border-yellow-500/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-yellow-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Resolving Semantic Patterns</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                AI Board President scanning responses for OLQ projection...
              </p>
            </div>
          </motion.div>
        )}

        {/* DISQUALIFIED PHASE */}
        {phase === 'DISQUALIFIED' && (
          <motion.div
            key="disqualified"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="bg-[#0f172a] rounded-[48px] p-16 border border-red-500/20 relative overflow-hidden shadow-2xl text-center flex flex-col items-center justify-center gap-8">
               <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-red-500/10 rounded-full blur-[80px]"></div>
               <ShieldAlert className="w-24 h-24 text-red-500 animate-pulse relative z-10" />
               <div className="space-y-4 relative z-10">
                 <h3 className="text-4xl md:text-5xl font-black text-red-500 uppercase tracking-tighter">Test Disqualified</h3>
                 <p className="text-red-300/80 font-bold max-w-lg mx-auto">
                    You have committed a security infraction by switching tabs or losing focus during an active psych test. SSB testing requires strict discipline. This infraction has been logged.
                 </p>
               </div>
               
               <button 
                   onClick={() => { setPhase('IDLE'); setTestMode('AUTHENTIC'); }}
                   className="relative z-10 mt-4 px-10 py-5 bg-red-500 hover:bg-red-400 text-white font-black tracking-widest text-sm uppercase rounded-full cursor-pointer transition-all shadow-xl shadow-red-500/20"
               >
                   Acknowledge & Restart
               </button>
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
                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-[80px]"></div>
                
                <div className="space-y-4 relative z-10 text-center md:text-left">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto md:mx-0">
                    <CheckCircle className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">WAT Evaluation Complete</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                    Mindset Status: <br/>
                    <span className={evaluation.overall_score >= 60 ? 'text-emerald-400' : 'text-yellow-400'}>
                      {evaluation.overall_score >= 60 ? 'OPTIMISTIC / CONSTRUCTIVE' : 'NEUTRAL / MIXED'}
                    </span>
                  </h1>
                  
                  <p className="text-slate-400 text-sm font-semibold leading-relaxed max-w-xl">
                    {evaluation.mindset_summary}
                  </p>
                </div>

                {/* Score Dial */}
                <div className="bg-[#162840] border border-white/5 rounded-[40px] p-10 text-center min-w-[220px] shadow-2xl relative shrink-0">
                  <p className={`text-6xl font-black ${evaluation.overall_score >= 70 ? 'text-emerald-500' : evaluation.overall_score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {evaluation.overall_score}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Overall Score / 100</p>
                  <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
                    <div 
                      className={`h-full ${evaluation.overall_score >= 70 ? 'bg-emerald-500' : evaluation.overall_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${evaluation.overall_score}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Sidebar Quick Re-run */}
              <div className="bg-[#162840] border border-white/5 rounded-[48px] p-10 flex flex-col justify-between space-y-6 shadow-xl">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Next Steps</h3>
                  <p className="mt-4 text-xs font-semibold text-slate-400 leading-relaxed">
                    {evaluation.recommendations}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={nextSet}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                  >
                    Next Set
                  </button>
                  <button
                    onClick={() => {
                        setPhase('IDLE');
                        setAllResponses([]);
                    }}
                    className="w-full bg-[#0f172a] hover:bg-[#1e3658] border border-white/5 text-white py-4 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                  >
                     Retake
                  </button>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0f172a] rounded-[48px] p-12 border border-emerald-500/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">+</div>
                        Positive Projections
                    </h3>
                    <ul className="space-y-4">
                        {evaluation.strengths.map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-4 text-sm font-semibold text-emerald-200/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2"></span>
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="bg-[#0f172a] rounded-[48px] p-12 border border-red-500/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">-</div>
                        Negative Indicators
                    </h3>
                    <ul className="space-y-4">
                        {evaluation.weaknesses.map((w: string, i: number) => (
                            <li key={i} className="flex items-start gap-4 text-sm font-semibold text-red-200/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-2"></span>
                                {w}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Submissions Log (If generated) */}
            {evaluation.responses && evaluation.responses.length > 0 && (
                <div className="bg-[#0f172a] rounded-[48px] p-12 border border-white/5 shadow-2xl space-y-6">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Submission Log</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                       {evaluation.responses.map((r: WatResponse, idx: number) => (
                          <div key={idx} className="bg-[#162840] p-4 rounded-[24px] border border-white/5 space-y-2">
                             <div className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">Word {idx + 1}: {r.word}</div>
                             <p className="text-slate-300 text-sm font-semibold">{r.response}</p>
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
