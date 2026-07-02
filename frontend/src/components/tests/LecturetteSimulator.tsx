'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Mic, MicOff, CheckCircle, Loader2, Play, AlertCircle } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';

interface LecturetteSimulatorProps {
    topic: string;
    onClose: () => void;
}

export default function LecturetteSimulator({ topic, onClose }: LecturetteSimulatorProps) {
    const [phase, setPhase] = useState<'PREP' | 'SPEAKING' | 'EVALUATING' | 'DONE'>('PREP');
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [evaluation, setEvaluation] = useState<any>(null);
    const recognitionRef = useRef<any>(null);

    const handleTimerExpireRef = useRef<() => void>(() => {});
    const timer = useTimer({
        initialTime: 180,
        onExpire: () => handleTimerExpireRef.current?.(),
    });

    handleTimerExpireRef.current = () => {
        if (phase === 'PREP') {
            startSpeaking();
        } else if (phase === 'SPEAKING') {
            stopRecordingAndEvaluate();
        }
    };

    const startSpeaking = () => {
        setPhase('SPEAKING');
        timer.setTimeAndStart(180); // 3 minutes speaking
        startRecording();
    };

    const startRecording = () => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'speechRecognition' in window)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                }
                setTranscript(prev => prev + ' ' + currentTranscript);
            };

            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const stopRecordingAndEvaluate = async () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
        setPhase('EVALUATING');

        try {
            const res = await fetch('/api/evaluate-lecturette', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    topic, 
                    transcript, 
                    duration: 180 - timer.timeLeft 
                })
            });
            const data = await res.json();
            if (data.evaluation) {
                setEvaluation(data.evaluation);
                setPhase('DONE');
            }
        } catch (error) {
            console.error(error);
            setPhase('DONE');
        }
    };



    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
        >
            <div className="w-full max-w-4xl bg-charcoal border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
                
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900">
                    <div>
                        <h3 className="text-white font-black uppercase tracking-widest text-sm">Lecturette Practice</h3>
                        <p className="text-emerald-400 text-lg font-bold">{topic}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
                </div>

                <div className="flex-1 flex flex-col p-8 relative">
                    <div className="absolute top-8 right-8 flex items-center gap-3 bg-black/40 px-6 py-3 rounded-full border border-white/10">
                        <Clock className={`w-5 h-5 ${timer.timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
                        <span className={`text-2xl font-mono font-black ${timer.timeLeft < 30 ? 'text-red-500' : 'text-white'}`}>
                            {timer.formattedTime}
                        </span>
                    </div>

                    {phase === 'PREP' ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <Play className="w-20 h-20 text-emerald-500 mb-6 opacity-20" />
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Preparation Phase</h2>
                            <p className="text-slate-400 max-w-md leading-relaxed">
                                You have 3 minutes to organize your thoughts. Look at the structured notes and prepare your delivery.
                            </p>
                            <button 
                                onClick={startSpeaking}
                                className="mt-8 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                            >
                                Start Speaking Now
                            </button>
                        </div>
                    ) : phase === 'SPEAKING' ? (
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1 flex flex-col items-center justify-center text-center mb-8">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                                    <Mic className="w-20 h-20 text-red-500 relative z-10" />
                                </div>
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">LIVE: Speaking Phase</h2>
                                <p className="text-slate-400">Speak clearly. Your words are being transcribed for AI analysis.</p>
                            </div>
                            
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 h-40 overflow-y-auto custom-scrollbar italic text-slate-500 text-sm">
                                {transcript || "Listening for your voice..."}
                            </div>

                            <button 
                                onClick={stopRecordingAndEvaluate}
                                className="mt-8 w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                            >
                                Finish & Evaluate
                            </button>
                        </div>
                    ) : phase === 'EVALUATING' ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mb-6" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest">GTO Analysis Active</h2>
                            <p className="text-slate-500 font-mono text-xs mt-2">Scoring content quality, confidence intervals, and time efficiency...</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                    <h3 className="text-2xl font-black text-white uppercase tracking-widest">GTO Feedback</h3>
                                </div>
                                <div className="bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 rounded-xl">
                                    <span className="text-[10px] uppercase font-black text-emerald-400 block tracking-widest">Accuracy Score</span>
                                    <span className="text-2xl font-black text-white">{evaluation?.accuracy_score}%</span>
                                </div>
                            </div>

                            <div className="space-y-6 pb-8">
                                <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">Performance Summary</h4>
                                    <p className="text-slate-200 text-sm leading-relaxed">{evaluation?.performance_summary}</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-green-900/10 border border-green-500/20 p-5 rounded-xl">
                                        <h5 className="text-[10px] font-black uppercase text-green-400 mb-3 tracking-widest">Effective Delivery</h5>
                                        <ul className="text-xs space-y-2 text-slate-300">
                                            {evaluation?.strengths?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                                        </ul>
                                    </div>
                                    <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl">
                                        <h5 className="text-[10px] font-black uppercase text-red-400 mb-3 tracking-widest">Improvement Zones</h5>
                                        <ul className="text-xs space-y-2 text-slate-300">
                                            {evaluation?.weaknesses?.map((w: string, i: number) => <li key={i}>• {w}</li>)}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-2xl flex gap-4">
                                    <AlertCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                                    <div>
                                        <h5 className="text-[10px] font-black uppercase text-emerald-400 mb-2 tracking-widest">Tactical Advice</h5>
                                        <p className="text-slate-300 text-sm">{evaluation?.improvements}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
