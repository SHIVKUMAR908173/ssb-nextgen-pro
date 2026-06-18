'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, ChevronRight, CheckCircle2, AlertCircle, Play, ShieldAlert, Target } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { useAntiCheat } from '@/hooks/useAntiCheat';

interface OIRQuestion {
    id?: number;
    category: string;
    question_text: string;
    options: any[]; // string or { label, svg }
    correct_option: string | number;
    explanation?: string;
    reference_figures?: { label: string; svg: string }[];
}

export default function OIRPage() {
    const [questions, setQuestions] = useState<OIRQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [score, setScore] = useState(0);
    
    // States: IDLE, LOADING, TESTING, DONE, DISQUALIFIED
    const [phase, setPhase] = useState<'IDLE' | 'LOADING' | 'TESTING' | 'DONE' | 'DISQUALIFIED'>('IDLE');
    const [timeLeft, setTimeLeft] = useState(1020); // 17 minutes = 1020 seconds

    useAntiCheat({
        enabled: phase === 'TESTING',
        onInfraction: () => setPhase('DISQUALIFIED')
    });

    const fetchMixedBattery = async () => {
        setPhase('LOADING');
        try {
            const res = await fetch('/api/oir?type=mixed');
            const data = await res.json();
            if (data && data.data) {
                setQuestions(data.data);
                setTimeLeft(1020); // Reset timer just in case
                setPhase('TESTING');
            } else {
                alert('Failed to load OIR Battery');
                setPhase('IDLE');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to fetch OIR Battery');
            setPhase('IDLE');
        }
    };

    // Timer Logic
    useEffect(() => {
        if (phase === 'TESTING' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (phase === 'TESTING' && timeLeft === 0) {
            finishTest();
        }
    }, [timeLeft, phase]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleOptionSelect = (optionValue: string, optionIndex: number) => {
        if (answers[currentIdx] !== undefined) return; // already answered
        
        const q = questions[currentIdx];
        
        // Checking correctness based on different datasets formats
        let isCorrect = false;
        
        if (typeof q.correct_option === 'number') {
           // 1-indexed number
           isCorrect = (optionIndex + 1) === q.correct_option;
        } else if (typeof q.correct_option === 'string') {
           // Could be "A", "B", "C" or "1", "2", "3" or the text itself
           const optLetter = String.fromCharCode(65 + optionIndex); // 0 -> A, 1 -> B
           isCorrect = optionValue === q.correct_option || 
                       optionValue.startsWith(`(${q.correct_option})`) || 
                       optLetter === q.correct_option ||
                       (optionIndex + 1).toString() === q.correct_option;
        }

        setAnswers(prev => ({ ...prev, [currentIdx]: optionValue }));
        if (isCorrect) setScore(s => s + 1);

        // Auto Advance instantly
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(curr => curr + 1);
        } else {
            finishTest();
        }
    };

    const finishTest = () => {
        setPhase('DONE');
        // Save to localStorage
        try {
            const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
            testHistory.push({
                id: `OIR-${Date.now()}`,
                test: 'OIR Stage 1 Battery',
                score: score,
                total: questions.length,
                date: new Date().toISOString(),
                status: 'completed',
                improvements: ['Practice daily to reduce time per question']
            });
            localStorage.setItem('testHistory', JSON.stringify(testHistory));
        } catch (e) {
            console.error('Failed to save history', e);
        }
    };

    const renderSVG = (svgString: string) => {
        return { __html: DOMPurify.sanitize(svgString, { ADD_TAGS: ['svg', 'path', 'rect', 'circle', 'line', 'polygon', 'polyline', 'text', 'g'], ADD_ATTR: ['viewBox', 'd', 'points', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'transform', 'text-anchor', 'font-size'] }) };
    };

    if (phase === 'IDLE') {
        return (
            <div className="max-w-5xl mx-auto min-h-screen py-12 px-6">
                <div className="relative bg-gradient-to-br from-slate-900 to-[#1a0a3d] rounded-[40px] p-12 border border-blue-500/20 overflow-hidden text-center shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full mb-8 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            <ShieldAlert className="w-4 h-4 text-red-400" />
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]">Stage 1 Elimination Filter</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
                            OIR Battery
                        </h1>
                        <p className="text-blue-300 font-bold text-xl mb-12 max-w-2xl mx-auto">
                            Officer Intelligence Rating — Strict 17-Minute Gauntlet. Fail here, and you go home on Day 1.
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
                            <div className="bg-black/40 border border-white/5 rounded-3xl px-8 py-6 flex flex-col items-center min-w-[160px] shadow-glass">
                                <Clock className="w-8 h-8 text-blue-400 mb-3" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Limit</p>
                                <p className="text-3xl font-black text-white">17 Mins</p>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-3xl px-8 py-6 flex flex-col items-center min-w-[160px] shadow-glass">
                                <Target className="w-8 h-8 text-emerald-400 mb-3" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Questions</p>
                                <p className="text-3xl font-black text-white">50 Mixed</p>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-3xl px-8 py-6 flex flex-col items-center min-w-[160px] shadow-glass">
                                <Brain className="w-8 h-8 text-amber-400 mb-3" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Pace</p>
                                <p className="text-3xl font-black text-white">20s / Q</p>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 max-w-2xl mx-auto mb-10 text-left">
                            <h3 className="text-blue-400 font-black uppercase tracking-widest text-sm mb-2">Rules of Engagement:</h3>
                            <ul className="text-slate-300 text-sm space-y-2 font-medium">
                                <li>• The test consists of both Verbal (text) and Non-Verbal (visual) reasoning.</li>
                                <li>• The timer is unforgiving. It will not stop.</li>
                                <li>• <strong className="text-rose-400">Auto-Advance is ON.</strong> Selecting an option instantly moves to the next question. You cannot go back.</li>
                            </ul>
                        </div>

                        <button
                            onClick={fetchMixedBattery}
                            className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black py-5 px-12 rounded-2xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] uppercase tracking-widest text-lg inline-flex items-center gap-3"
                        >
                            <Play className="w-6 h-6 fill-current" /> Start Real OIR Exam
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'LOADING') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                 <div className="flex flex-col items-center gap-4">
                     <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                     <p className="text-blue-400 font-black uppercase tracking-widest text-sm animate-pulse">Assembling Battery...</p>
                 </div>
            </div>
        );
    }
    if (phase === 'DISQUALIFIED') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
                 <div className="bg-slate-900 border border-red-500/20 rounded-[40px] p-12 text-center max-w-lg shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                     <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-6 animate-pulse" />
                     <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">OIR-5 (Disqualified)</h2>
                     <p className="text-slate-400 font-bold mb-8">
                         You have committed a security infraction by switching tabs or losing focus during an active test. 
                         SSB testing requires strict discipline. This infraction has been logged.
                     </p>
                     <button onClick={() => setPhase('IDLE')} className="px-8 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-bold uppercase tracking-widest transition-colors">
                         Acknowledge
                     </button>
                 </div>
            </div>
        );
    }
    if (phase === 'DONE') {
        const percentage = Math.round((score / questions.length) * 100);
        let oirRating = 5;
        let ratingColor = 'text-red-500';
        let ratingText = 'Screened Out';

        if (percentage >= 90) { oirRating = 1; ratingColor = 'text-emerald-400'; ratingText = 'Outstanding'; }
        else if (percentage >= 80) { oirRating = 2; ratingColor = 'text-blue-400'; ratingText = 'Excellent'; }
        else if (percentage >= 70) { oirRating = 3; ratingColor = 'text-amber-400'; ratingText = 'Good'; }
        else if (percentage >= 60) { oirRating = 4; ratingColor = 'text-orange-500'; ratingText = 'Average - Borderline'; }

        return (
            <div className="max-w-4xl mx-auto min-h-screen py-12 px-6 flex flex-col items-center justify-center">
                <div className="bg-slate-900 border border-white/10 rounded-[40px] p-12 text-center w-full shadow-2xl relative overflow-hidden">
                    <div className="absolute top-[-50%] left-[-10%] w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none" />
                    
                    <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest mb-2">Stage 1 Result</h2>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-10">OIR Rating</h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
                         <div className={`w-48 h-48 rounded-full border-8 ${ratingColor.replace('text-', 'border-').replace('400', '500')} flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]`}>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</span>
                             <span className={`text-6xl font-black ${ratingColor}`}>OIR-{oirRating}</span>
                         </div>
                         <div className="text-left space-y-4">
                              <div>
                                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Performance Level</p>
                                  <p className={`text-2xl font-black uppercase ${ratingColor}`}>{ratingText}</p>
                              </div>
                              <div>
                                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Raw Score</p>
                                  <p className="text-3xl font-black text-white">{score} <span className="text-slate-500 text-xl">/ {questions.length}</span></p>
                              </div>
                              <div>
                                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Accuracy</p>
                                  <p className="text-3xl font-black text-white">{percentage}%</p>
                              </div>
                         </div>
                    </div>

                    {oirRating >= 4 && (
                         <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-left mb-8 max-w-xl mx-auto">
                             <h3 className="text-red-400 font-black uppercase tracking-widest text-sm flex items-center gap-2 mb-2"><ShieldAlert className="w-4 h-4" /> Danger Zone</h3>
                             <p className="text-slate-300 text-sm font-medium">An OIR rating of 4 or 5 drastically reduces your chances of passing the Day 1 Screening (PP&DT), even if your story is good. You need to improve your speed.</p>
                         </div>
                    )}

                    <div className="flex items-center justify-center gap-4">
                        <button onClick={() => setPhase('IDLE')} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl border border-white/10 transition-colors">
                            Retake Test
                        </button>
                        <Link href="/command-center" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-600/20 transition-all">
                            Return to HQ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // TESTING PHASE
    const q = questions[currentIdx];
    const isUrgent = timeLeft < 120; // Red text if under 2 minutes

    return (
        <div className="max-w-5xl mx-auto min-h-screen py-8 px-4 flex flex-col">
            {/* HUD Header */}
            <div className="flex items-center justify-between bg-slate-900 border border-white/10 rounded-2xl p-4 mb-8 sticky top-4 z-50 shadow-glass">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Progress</span>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-black text-white">{currentIdx + 1}</span>
                            <span className="text-sm font-bold text-slate-500 mb-1">/ {questions.length}</span>
                        </div>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Category</span>
                        <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">{q.category}</span>
                    </div>
                </div>

                <div className={`flex items-center gap-3 px-6 py-2 rounded-xl border ${isUrgent ? 'bg-red-500/10 border-red-500/50' : 'bg-black/50 border-white/10'}`}>
                    <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                    <span className={`text-2xl font-black tabular-nums tracking-wider ${isUrgent ? 'text-red-500' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Question Area */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col bg-slate-900/50 border border-white/5 rounded-3xl p-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
                        {q.question_text}
                    </h2>

                    {/* Non-Verbal Reference Figures (if any) */}
                    {q.reference_figures && q.reference_figures.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-6 mb-10 bg-white/5 p-6 rounded-2xl">
                            {q.reference_figures.map((fig, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl shadow-lg border-2 border-slate-700 p-2 flex items-center justify-center" dangerouslySetInnerHTML={renderSVG(fig.svg)} />
                                    <span className="text-xs font-bold text-slate-400 uppercase mt-3">{fig.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                        {q.options.map((opt, idx) => {
                            const isSelected = answers[currentIdx] === opt;
                            const isString = typeof opt === 'string';
                            const letter = String.fromCharCode(65 + idx); // A, B, C, D
                            
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(isString ? opt : opt.label, idx)}
                                    className={`relative flex items-center gap-4 p-6 rounded-2xl border-2 transition-all active:scale-95 group overflow-hidden text-left
                                        ${isSelected 
                                            ? 'bg-blue-600 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.5)]' 
                                            : 'bg-[#162840] border-white/10 hover:border-blue-500/50 hover:bg-[#1a2f4c]'
                                        }
                                    `}
                                >
                                    <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-sm font-black transition-colors
                                        ${isSelected ? 'bg-white text-blue-600' : 'bg-white/10 text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-400'}
                                    `}>
                                        {letter}
                                    </div>
                                    
                                    {isString ? (
                                        <span className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                            {opt}
                                        </span>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            {opt.svg && <div className="w-16 h-16 bg-white rounded-lg p-1 shrink-0" dangerouslySetInnerHTML={renderSVG(opt.svg)} />}
                                            {opt.text && <span className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>{opt.text}</span>}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>
            
            {/* Auto-advance hint */}
            <div className="text-center mt-6">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Click an option to instantly advance. Cannot go back.</p>
            </div>
        </div>
    );
}
