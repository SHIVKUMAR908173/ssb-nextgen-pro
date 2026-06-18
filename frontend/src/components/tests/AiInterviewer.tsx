'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Activity, Play, CheckCircle, ShieldAlert, User, Star, ArrowRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { ApiClient } from '@/lib/api/api-client';

const SSB_BOARDS = [
  { id: '1_afsb', name: '1 AFSB Dehradun', focus: 'Air Force — Technical aptitude, flying passion', accent: 'sky' },
  { id: '2_afsb', name: '2 AFSB Mysuru', focus: 'Air Force — South zone, structured thinkers', accent: 'sky' },
  { id: '11_ssb', name: '11 SSB Allahabad', focus: 'Army — Ground duties, physicality, team leadership', accent: 'emerald' },
  { id: '14_ssb', name: '14 SSB Bhopal', focus: 'Army — Infantry & artillery, decisiveness', accent: 'emerald' },
  { id: 'ins_delhi', name: 'INS Delhi SSB', focus: 'Navy — Maritime operations, cool temperament', accent: 'blue' },
];

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally'];

interface VoiceMetrics {
  wpm: number;
  fillerCount: number;
  confidenceScore: number;
}

interface InterviewHistoryItem {
  question: string;
  answer: string;
  metrics: VoiceMetrics;
  feedback?: Record<string, unknown>; // the JSON response from evaluate-interview
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition {
  start(): void;
  stop(): void;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
}

export default function AiInterviewer() {
  const [mounted, setMounted] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  
  const { user } = useAuth();
  const supabase = createClient();
  const [piqData, setPiqData] = useState<Record<string, unknown> | null>(null);
  const [isPiqLoading, setIsPiqLoading] = useState(true);

  // States: 'IDLE' | 'LISTENING' | 'ANALYZING' | 'DONE' | 'MISSING_PIQ' | 'FETCHING_Q'
  const [phase, setPhase] = useState<'IDLE' | 'LISTENING' | 'ANALYZING' | 'DONE' | 'MISSING_PIQ' | 'FETCHING_Q'>('IDLE');
  
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [questionCount, setQuestionCount] = useState(0);
  const MAX_QUESTIONS = 6;
  
  const [transcript, setTranscript] = useState('');
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<InterviewHistoryItem[]>([]);
  
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch PIQ Data on Mount
  useEffect(() => {
    const fetchPiq = async () => {
      if (!user?.id) return;
      setIsPiqLoading(true);
      try {
        const { data, error } = await supabase.from('piq_submissions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error || !data) {
          setPhase('MISSING_PIQ');
        } else {
          setPiqData({
            personal: data.personal_details,
            education: data.education_details,
            hobbies: data.hobbies_sports,
            history: data.ssb_history
          });
        }
      } catch (err) {
        setPhase('MISSING_PIQ');
      } finally {
        setIsPiqLoading(false);
      }
    };
    if (user) fetchPiq();
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onresult = (event: ISpeechRecognitionEvent) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
          }
          setTranscript(prev => prev + finalTranscript);
        };
        
        recognitionRef.current.onerror = (event: ISpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error", event.error);
          stopListening();
        };
      }
    }
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  }, []);

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang === 'en-IN' || v.lang === 'en-GB');
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchNextQuestion = async (history: InterviewHistoryItem[]) => {
    setPhase('FETCHING_Q');
    try {
      const previousAnswers = history.map(h => `Q: ${h.question} | A: ${h.answer}`);
      const data = await ApiClient.post<{ question: string }>('/api/interview-question', { 
        sessionId: 'session-1', 
        previousAnswers, 
        piqData,
        questionType: 'PIQ-Driven CIQ',
        questionNumber: history.length + 1
      });
      if (data.question) {
        setCurrentQuestion(data.question);
        setPhase('IDLE');
        speakQuestion(data.question);
      }
    } catch (e) {
      console.error(e);
      setPhase('IDLE');
    }
  };

  const startInterview = () => {
    setInterviewHistory([]);
    setQuestionCount(0);
    fetchNextQuestion([]);
  };

  const startListening = () => {
    setTranscript('');
    setRecordingStartTime(Date.now());
    setPhase('LISTENING');
    try { recognitionRef.current?.start(); } catch (e) { console.error("Recog already started"); }
  };

  const stopListening = async () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setPhase('ANALYZING');
    
    // Vocal metrics
    const endTime = Date.now();
    const durationMinutes = (endTime - (recordingStartTime || endTime)) / 60000;
    const words = transcript.trim().split(/\s+/).filter(w => w.length > 0);
    const wpm = durationMinutes > 0 ? Math.round(words.length / durationMinutes) : 0;
    let fillerCount = 0;
    words.map(w => w.toLowerCase()).forEach(w => { if (FILLER_WORDS.includes(w)) fillerCount++; });
    
    let wpmPenalty = 0;
    if (wpm < 130) wpmPenalty = (130 - wpm) * 0.5;
    if (wpm > 170) wpmPenalty = (wpm - 170) * 0.5;
    let score = 100 - wpmPenalty - (fillerCount * 3);
    score = Math.max(0, Math.min(100, score));

    const metrics: VoiceMetrics = { wpm, fillerCount, confidenceScore: Math.round(score) };
    const currentAns = transcript.trim() || "[NO RESPONSE DETECTED]";

    // Evaluate answer with AI
    let feedback: Record<string, unknown> | undefined = undefined;
    try {
       const previousContext = interviewHistory.map(h => `Q: ${h.question}\nA: ${h.answer}`).join("\n\n");
       feedback = await ApiClient.post<Record<string, unknown>>('/api/evaluate-interview', {
           transcript: currentAns,
           currentCiqStage: questionCount + 1,
           piqData,
           previousContext,
           speechMetrics: metrics
       });
    } catch(e) {
       console.error("Evaluation failed", e);
    }

    const newHistory = [...interviewHistory, { question: currentQuestion, answer: currentAns, metrics, feedback }];
    setInterviewHistory(newHistory);
    setQuestionCount(prev => prev + 1);

    if (questionCount + 1 >= MAX_QUESTIONS) {
        setPhase('DONE');
    } else {
        fetchNextQuestion(newHistory);
    }
  };

  if (!mounted || isPiqLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto min-h-[500px] flex items-center justify-center bg-charcoal/80 border border-white/10 rounded-3xl backdrop-blur-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-t-2 border-blue-500 animate-spin"></div>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Loading secure channel...</p>
        </div>
      </div>
    );
  }

  if (phase === 'MISSING_PIQ') {
    return (
       <div className="w-full max-w-5xl mx-auto min-h-[500px] flex flex-col items-center justify-center bg-charcoal/80 border border-white/10 rounded-3xl backdrop-blur-xl p-12 text-center">
            <ShieldAlert className="w-20 h-20 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-4">PIQ Data Missing</h2>
            <p className="text-slate-400 font-bold max-w-xl mb-8 leading-relaxed">
                The Personal Interview (PI) is 100% based on your Personal Information Questionnaire (PIQ). 
                The AI cannot conduct a realistic mock interview without knowing your educational background, family details, and hobbies.
            </p>
            <Link href="/piq" className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-yellow-500/20 flex items-center gap-3">
                <FileText className="w-5 h-5" /> Fill Out Digital PIQ Form
            </Link>
       </div>
    );
  }

  if (!selectedBoard) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-charcoal/80 border border-white/10 rounded-3xl shadow-glass overflow-hidden backdrop-blur-xl text-slate-200">
        <div className="bg-slate-900/80 border-b border-white/10 p-5">
          <h2 className="text-xl font-black tracking-widest uppercase text-white flex items-center gap-2">
            <Volume2 className="text-blue-400" />
            Personal Interview — Board Selection
          </h2>
          <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest uppercase">Select your target SSB Board for board-specific question calibration</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SSB_BOARDS.map((board) => (
              <button
                key={board.id}
                onClick={() => setSelectedBoard(board.id)}
                className="text-left p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-white font-black text-sm uppercase tracking-tight group-hover:text-blue-400 transition-colors">{board.name}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{board.focus}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-charcoal/80 border border-white/10 rounded-3xl shadow-glass overflow-hidden backdrop-blur-xl text-slate-200">
      <div className="bg-slate-900/80 border-b border-white/10 p-5 flex justify-between items-center z-10 relative">
        <div>
          <h2 className="text-xl font-black tracking-widest uppercase text-white shadow-neon flex items-center gap-2">
            <Volume2 className="text-blue-400" /> Vacha / IO AI
          </h2>
          <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest uppercase">
            Board: {SSB_BOARDS.find(b => b.id === selectedBoard)?.name || 'General Practice'} — PIQ Linked
          </p>
        </div>
        <div className="flex items-center gap-3">
          {phase === 'IDLE' && questionCount === 0 && (
            <button onClick={startInterview} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold uppercase tracking-widest text-xs">
              Start Interview
            </button>
          )}
        </div>
      </div>

      <div className="min-h-[500px] flex flex-col relative p-8">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

          {phase === 'DONE' ? (
              <div className="w-full flex flex-col items-center">
                   <CheckCircle className="w-16 h-16 text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                   <h3 className="text-3xl font-black uppercase text-white tracking-widest mb-8">Interview Complete</h3>
                   
                   <div className="w-full space-y-6">
                      {interviewHistory.map((h, i) => (
                         <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-6">
                            <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Volume2 className="w-4 h-4" /> Q{i+1}: {h.question}</h4>
                            <p className="text-slate-300 italic mb-4">"{h.answer}"</p>
                            
                            {h.feedback && (
                               <div className="bg-slate-900/80 border border-blue-500/20 rounded-xl p-4 space-y-4">
                                  <div className="flex justify-between items-start">
                                     <div>
                                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Authenticity & Consistency</p>
                                        <p className="text-xs text-white font-bold">{String(h.feedback.authenticity_verdict || '')}</p>
                                        <p className="text-xs text-slate-400">{String(h.feedback.piq_consistency || '')}</p>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1">Score</p>
                                        <p className="text-lg text-white font-black">{String(h.feedback.confidenceScore || 0)}/100</p>
                                     </div>
                                  </div>
                                  <div>
                                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">IO Analysis</p>
                                     <p className="text-xs text-slate-300">{String(h.feedback.board_president_analysis || '')}</p>
                                  </div>
                               </div>
                            )}
                         </div>
                      ))}
                   </div>
              </div>
          ) : (
              <div className="flex-1 flex flex-col items-center justify-center relative">
                  {/* IO Avatar */}
                  <div className="mb-10 flex flex-col items-center z-20">
                      <div className="relative w-32 h-32 mb-4">
                          <div className={`absolute inset-0 bg-blue-500/20 rounded-full blur-xl ${phase === 'LISTENING' || phase === 'FETCHING_Q' ? 'animate-pulse' : ''}`}></div>
                          <div className={`relative w-full h-full bg-slate-800 rounded-full border-4 border-blue-500/50 flex items-center justify-center overflow-hidden transition-all duration-500`}>
                              {phase === 'LISTENING' ? (
                                  <div className="flex items-center justify-center gap-1.5 h-12">
                                      <div className="w-1.5 h-full bg-emerald-400 rounded-full animate-pulse" />
                                      <div className="w-1.5 h-3/4 bg-emerald-400 rounded-full animate-pulse delay-75" />
                                      <div className="w-1.5 h-full bg-emerald-400 rounded-full animate-pulse delay-150" />
                                  </div>
                              ) : phase === 'ANALYZING' || phase === 'FETCHING_Q' ? (
                                  <Activity className="w-12 h-12 text-blue-400 animate-pulse" />
                              ) : (
                                  <User className="w-16 h-16 text-blue-400" />
                              )}
                          </div>
                      </div>
                      <h3 className="text-white font-black uppercase tracking-widest text-lg flex items-center gap-2">Brigadier (Senior IO)</h3>
                  </div>

                  {phase === 'FETCHING_Q' && (
                     <p className="text-blue-400 text-sm font-black uppercase tracking-widest animate-pulse">Reviewing PIQ & Generating Question...</p>
                  )}

                  {phase !== 'FETCHING_Q' && currentQuestion && (
                      <div className="text-center max-w-2xl z-20 mb-8">
                          <h4 className="text-blue-400 text-sm font-black uppercase tracking-[0.2em] mb-2">Question {questionCount + 1}</h4>
                          <p className="text-white text-xl font-bold">{currentQuestion}</p>
                      </div>
                  )}

                  <div className="flex flex-col items-center gap-6 z-20 mt-4">
                      {phase === 'IDLE' && questionCount > 0 && (
                          <button onClick={startListening} className="w-24 h-24 rounded-full bg-charcoal border-2 border-white/20 flex flex-col items-center justify-center text-slate-400 hover:text-white hover:border-blue-400 transition-all group">
                              <Mic className="w-8 h-8 mb-1 group-hover:scale-110" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Ans</span>
                          </button>
                      )}

                      {phase === 'LISTENING' && (
                          <div className="flex flex-col items-center gap-4">
                              <button onClick={stopListening} className="w-24 h-24 rounded-full bg-blue-600 border-4 border-blue-400 flex flex-col items-center justify-center text-white shadow-[0_0_50px_rgba(59,130,246,0.5)] animate-pulse">
                                  <Activity className="w-8 h-8 mb-1" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Stop</span>
                              </button>
                              <div className="w-full max-w-xl h-24 overflow-y-auto bg-black/40 border border-white/10 p-4 rounded-xl text-sm text-slate-300 italic">
                                  {transcript || "Listening..."}
                              </div>
                          </div>
                      )}

                      {phase === 'ANALYZING' && (
                          <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Analyzing Consistency & Authenticity...</p>
                          </div>
                      )}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
