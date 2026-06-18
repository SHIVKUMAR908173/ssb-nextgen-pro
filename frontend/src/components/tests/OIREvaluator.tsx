'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, ChevronRight, ChevronLeft, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import defaultVerbalSet from '@/data/oir_set1_verbal.json';

interface OIRQuestion {
    question_number: number;
    category: string;
    question_text: string;
    options: string[];
    correct_option: string;
    explanation: string;
}

export default function OIREvaluator() {
    const [questions, setQuestions] = useState<OIRQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({}); // Locks answer per question index
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes for 40/50 questions
    const [isStarted, setIsStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [setId, setSetId] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchRandomSet = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/oir?type=verbal');
            const data = await res.json();
            if (data && data.data) {
                setQuestions(data.data);
                setSetId(data.setId);
            } else {
                alert('Failed to load questions from server');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to fetch OIR set');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isStarted && questions.length === 0 && !isLoading) {
             fetchRandomSet();
        }
    }, [isStarted]);

    useEffect(() => {
        if (isStarted && timeLeft > 0 && !isFinished && questions.length > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isStarted && timeLeft === 0 && !isFinished && questions.length > 0) {
            finishTest();
        }
    }, [timeLeft, isFinished, isStarted, questions.length]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleOptionSelect = (option: string) => {
        if (answers[currentIdx] !== undefined) return; // Answer locked
        
        const isCorrect = option === questions[currentIdx].correct_option || option.startsWith(`(${questions[currentIdx].correct_option})`);
        
        setAnswers(prev => ({ ...prev, [currentIdx]: option }));
        if (isCorrect) setScore(s => s + 1);

        // Auto next after 1 second if not last question
        if (currentIdx < questions.length - 1) {
            setTimeout(() => {
                setCurrentIdx(curr => curr + 1);
            }, 800);
        } else {
            setTimeout(() => {
                finishTest();
            }, 800);
        }
    };

    const finishTest = () => {
        setIsFinished(true);
        // Save to localStorage for Assessment Hub
        try {
            const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
            testHistory.push({
                test: 'OIR Verbal',
                score: score,
                total: questions.length,
                date: new Date().toISOString()
            });
            localStorage.setItem('testHistory', JSON.stringify(testHistory));
        } catch (e) {
            console.error('Failed to save score', e);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].question_text) {
                    setQuestions(parsed);
                    setCurrentIdx(0);
                    setAnswers({});
                    setScore(0);
                    setTimeLeft(1200);
                    setIsStarted(false);
                    setIsFinished(false);
                    alert(`Loaded ${parsed.length} questions successfully!`);
                } else {
                    alert('Invalid JSON format. Must be an array of OIR questions.');
                }
            } catch (err) {
                alert('Error parsing JSON file.');
            }
        };
        reader.readAsText(file);
    };

    if (!isStarted && !isFinished) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                <div className="relative bg-gradient-to-br from-[#0d1b4b] to-[#1a0a3d] rounded-[48px] p-12 border border-indigo-500/20 overflow-hidden text-center shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-6">
                            <Brain className="w-4 h-4 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Stage I Screening</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-3">
                            OIR Verbal Test
                        </h1>
                        <p className="text-indigo-300 font-bold text-lg mb-6 max-w-lg mx-auto">
                            Officer Intelligence Rating — Verbal & Logical Reasoning
                        </p>
                        
                        <div className="flex items-center justify-center gap-6 mb-10">
                            <div className="bg-[#162840] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4">
                                <Clock className="w-8 h-8 text-indigo-400" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Limit</p>
                                    <p className="text-2xl font-black text-white">20 Mins</p>
                                </div>
                            </div>
                            <div className="bg-[#162840] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4">
                                <AlertCircle className="w-8 h-8 text-rose-400" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Questions</p>
                                    <p className="text-2xl font-black text-white">{questions.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 max-w-xl mx-auto mb-10">
                            <p className="text-rose-400 text-sm font-bold uppercase tracking-widest">⚠️ Note: Once selected, answers cannot be changed.</p>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => setIsStarted(true)}
                                className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-indigo-600/25 uppercase tracking-widest text-sm flex items-center gap-3"
                            >
                                Start Test
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white/5 hover:bg-white/10 active:scale-95 text-white font-bold py-4 px-6 rounded-2xl transition-all border border-white/10 text-sm flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" /> Custom Set
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileUpload} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isFinished) {
        const percentage = Math.round((score / questions.length) * 100);
        let oirRating = 5;
        if (percentage >= 90) oirRating = 1;
        else if (percentage >= 80) oirRating = 2;
        else if (percentage >= 70) oirRating = 3;
        else if (percentage >= 60) oirRating = 4;

        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-[#0f172a] rounded-[48px] p-12 border border-emerald-500/20 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                        <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Test Completed</h2>
                        <p className="text-emerald-400 font-bold mb-10">Performance Analysis Saved</p>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="bg-[#162840] rounded-3xl p-8 border border-white/5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Score</p>
                                <p className="text-5xl font-black text-white">{score}<span className="text-2xl text-slate-600">/{questions.length}</span></p>
                            </div>
                            <div className="bg-[#162840] rounded-3xl p-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">OIR Rating</p>
                                <p className="text-5xl font-black text-emerald-400">OIR-{oirRating}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsFinished(false);
                                setIsStarted(false);
                                setCurrentIdx(0);
                                setScore(0);
                                setAnswers({});
                                setTimeLeft(1200);
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-2xl transition-all border border-white/10 text-sm uppercase tracking-widest"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIdx];
    const hasAnsweredCurrent = answers[currentIdx] !== undefined;

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-150px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#0f172a] p-6 rounded-3xl border border-white/5 mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">OIR Verbal</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</p>
                    </div>
                </div>
                
                <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 font-mono text-xl font-black transition-colors ${timeLeft < 300 ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                    <Clock className="w-5 h-5" /> {formatTime(timeLeft)}
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 bg-[#162840] rounded-[40px] p-10 border border-white/5 flex flex-col relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]" />
                    
                    <div className="relative z-10 flex-1 flex flex-col">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 bg-indigo-500/10 w-fit px-3 py-1 rounded-full border border-indigo-500/20">
                            {currentQ.category || 'Verbal Reasoning'}
                        </span>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-10">
                            {currentQ.question_text}
                        </h3>

                        <div className="space-y-4 mt-auto">
                            {currentQ.options && currentQ.options.length > 0 ? (
                                currentQ.options.map((opt, i) => {
                                    const isSelected = answers[currentIdx] === opt;
                                    const isCorrectOpt = opt.startsWith(`(${currentQ.correct_option})`) || opt === currentQ.correct_option;
                                    
                                    let btnStyle = "bg-[#0d1424] border-white/10 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/5";
                                    
                                    if (hasAnsweredCurrent) {
                                        if (isCorrectOpt) {
                                            btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
                                        } else if (isSelected) {
                                            btnStyle = "bg-rose-500/20 border-rose-500 text-rose-400";
                                        } else {
                                            btnStyle = "bg-[#0d1424] border-white/5 text-slate-600 opacity-50";
                                        }
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleOptionSelect(opt)}
                                            disabled={hasAnsweredCurrent}
                                            className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-bold text-lg flex items-center justify-between ${btnStyle}`}
                                        >
                                            {opt}
                                            {hasAnsweredCurrent && isCorrectOpt && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="bg-[#0d1424] p-6 rounded-2xl border border-white/10">
                                    <p className="text-slate-400 mb-4 text-sm font-bold uppercase tracking-widest">Type your answer</p>
                                    <div className="flex gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Your answer..."
                                            disabled={hasAnsweredCurrent}
                                            className="flex-1 bg-[#162840] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-indigo-500"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleOptionSelect(e.currentTarget.value);
                                            }}
                                        />
                                        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Submit</button>
                                    </div>
                                    {hasAnsweredCurrent && (
                                        <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                                            <p className="text-indigo-400 font-bold text-sm">Correct Answer: {currentQ.correct_option}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between mt-6 shrink-0 bg-[#0f172a] p-4 rounded-3xl border border-white/5">
                <button
                    onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentIdx === 0}
                    className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 disabled:opacity-30 transition-colors text-white"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex gap-1.5">
                    {questions.map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-all ${
                                i === currentIdx ? 'bg-indigo-500 w-6' : 
                                answers[i] !== undefined ? 'bg-slate-500' : 'bg-slate-700'
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => {
                        if (currentIdx === questions.length - 1) finishTest();
                        else setCurrentIdx(prev => prev + 1);
                    }}
                    className="p-4 bg-indigo-600 rounded-2xl hover:bg-indigo-500 transition-colors text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                >
                    {currentIdx === questions.length - 1 ? 'Finish' : <ChevronRight className="w-6 h-6" />}
                </button>
            </div>
        </div>
    );
}
