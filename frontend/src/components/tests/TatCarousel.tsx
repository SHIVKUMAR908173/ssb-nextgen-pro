'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, AlertCircle, Loader2, Image as ImageIcon, Edit3, ImageOff } from 'lucide-react'

// Placeholder thematic stimuli mimicking psychological projective tests
const TAT_STIMULI = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600&h=400", // Team discussion
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600&h=400", // Individual coding late night
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=600&h=400", // Pensive individual
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=600&h=400", // Hardship in nature
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=600&h=400", // Urban scene, hurry
    "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?auto=format&fit=crop&q=80&w=600&h=400", // Silhouette of abstract
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=400", // Conflicted portrait
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600&h=400", // Medical or stress
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600&h=400", // Conflict resolution
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600&h=400", // Danger or rescue
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600&h=400", // Tech failure
    "BLANK" // The final unstructured Blank Slide
]

export default function TatCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0) // 0 to 11
    const [phase, setPhase] = useState<'IMAGE' | 'STORY'>('IMAGE') // IMAGE=30s, STORY=240s
    const [timeLeft, setTimeLeft] = useState(30)
    const [stories, setStories] = useState<string[]>(Array(12).fill(''))
    const [isCompleted, setIsCompleted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [evaluation, setEvaluation] = useState<any>(null)

    // Master Clock & Phase Loop Tracker
    useEffect(() => {
        if (isCompleted) return

        if (timeLeft <= 0) {
            if (phase === 'IMAGE') {
                // Transition to typing phase (4 Minutes strict)
                setPhase('STORY');
                setTimeLeft(240);
            } else {
                // Time up! Transition to next slide
                if (currentSlide === 11) {
                    setIsCompleted(true);
                    submitProtocol();
                } else {
                    setCurrentSlide(prev => prev + 1);
                    setPhase('IMAGE');
                    setTimeLeft(30);
                }
            }
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, phase, currentSlide, isCompleted]);

    // Handle Story typing
    const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newStories = [...stories];
        newStories[currentSlide] = e.target.value;
        setStories(newStories);
    };

    // Automated Packaging Protocol to LLM
    const submitProtocol = async () => {
        setIsSubmitting(true);
        try {
            // Package the 12 semantic stories
            const payloadArray = stories.map((s, i) => `[TAT Slide ${i + 1} (${TAT_STIMULI[i] === 'BLANK' ? 'Blank Image' : 'Visual Image'})]: ${s || "Candidate failed to formulate a story."}`);
            const completeChronicle = payloadArray.join('\n\n---\n\n');

            const res = await fetch('/api/psych-evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testType: 'Thematic Apperception Test (TAT)',
                    stimulus: '12 Image Battery (Including Blank Slide)',
                    response: completeChronicle,
                    isSpoken: false
                })
            });

            const data = await res.json();
            setEvaluation(data.feedback || data);
        } catch (e) {
            console.error(e);
            setEvaluation({ error: "Failed to connect to SSB Psychological Pipeline." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Utility: format timer mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-charcoal/80 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl font-sans text-slate-200">
            {/* Header Telemetry */}
            <div className="bg-slate-900/60 border-b border-white/10 p-5 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black tracking-widest uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                        TAT Simulator <span className="text-purple-400 font-mono text-xs tracking-normal align-top ml-2">v.2.0</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mt-1">THEMATIC APPERCEPTION TEST // STRICT 30S IMAGE, 4M WRITING</p>
                </div>
                {!isCompleted && (
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Slide</span>
                            <span className="font-mono text-sm font-bold text-emerald-400">{currentSlide + 1} / 12</span>
                        </div>
                        <div className={`px-4 py-2 rounded border font-mono font-black text-xl w-[90px] text-center ${timeLeft <= 10 && phase === 'STORY' ? 'bg-red-500/20 text-red-500 border-red-500/50 animate-pulse' : 'bg-black/50 text-white border-white/10'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                )}
            </div>

            {/* Test Arena */}
            {!isCompleted ? (
                <div className="relative h-[550px] w-full bg-black/40 overflow-hidden flex flex-col justify-center items-center">
                    
                    {/* Status Modifiers */}
                    <div className="absolute top-4 left-4 flex gap-2 z-20">
                        {phase === 'IMAGE' ? (
                            <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon className="w-3.5 h-3.5" /> Image Perception Active
                            </div>
                        ) : (
                            <div className="bg-orange-500/20 border border-orange-500/40 text-orange-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Edit3 className="w-3.5 h-3.5" /> Story Construction Active
                            </div>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {phase === 'IMAGE' ? (
                            <motion.div
                                key={`IMG-${currentSlide}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.6 }}
                                className="relative w-[90%] md:w-[70%] aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-white/10"
                            >
                                {TAT_STIMULI[currentSlide] === 'BLANK' ? (
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <ImageOff className="w-16 h-16 text-slate-300 opacity-50" />
                                    </div>
                                ) : (
                                    <img 
                                        src={TAT_STIMULI[currentSlide]} 
                                        alt="TAT Stimulus"
                                        className="w-full h-full object-cover grayscale-[20%] sepia-[10%] contrast-125"
                                    />
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`STORY-${currentSlide}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                                className="w-[90%] md:w-[85%] h-[80%] flex flex-col"
                            >
                                <label className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">
                                    Formulate your story for Slide {currentSlide + 1}
                                </label>
                                <textarea
                                    value={stories[currentSlide]}
                                    onChange={handleStoryChange}
                                    placeholder="Format: What led up to the event, what is happening right now, what are the characters thinking/feeling, what is the final outcome..."
                                    className="w-full flex-1 bg-black/60 border border-white/10 focus:border-purple-500/50 outline-none rounded-xl p-5 text-slate-200 resize-none font-medium leading-relaxed custom-scrollbar shadow-inner"
                                    autoFocus
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                /* Completion & AI Evaluation State */
                <div className="h-[550px] w-full bg-black/40 p-8 overflow-y-auto custom-scrollbar flex flex-col items-center">
                    {isSubmitting ? (
                        <div className="flex flex-col flex-1 items-center justify-center h-full gap-5">
                            <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
                            <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Aggregating Psychological Data</h3>
                            <p className="text-slate-400 font-mono text-sm max-w-sm text-center">Packaging 12 cognitive stories for Officer Like Quality (OLQ) multi-dimensional assessment...</p>
                        </div>
                    ) : evaluation ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                        >
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                                <div className="bg-emerald-500/20 p-4 rounded-full border border-emerald-500/30">
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-widest text-white">Evaluation Matrix Complete</h3>
                                    <p className="text-slate-400 font-mono text-sm">Automated Semantic RAG Parser</p>
                                </div>
                            </div>
                            
                            {/* Raw Fallback Rendering (As some APIs might deviate their strict JSON structure) */}
                            {evaluation.error ? (
                                <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-5 rounded-xl font-mono text-sm flex items-start gap-4">
                                    <AlertCircle className="w-6 h-6 shrink-0" />
                                    {evaluation.error}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5">
                                            <h4 className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-3 flex items-center gap-2"><span>✦</span> Primary Strengths</h4>
                                            <ul className="space-y-2">
                                                {evaluation.strengths?.length ? evaluation.strengths.map((s: string, i: number) => (
                                                    <li key={i} className="flex gap-2 text-slate-300 text-sm"><span className="text-emerald-500">✓</span> {s}</li>
                                                )) : <li className="text-slate-500 text-sm">No significant strengths parsed.</li>}
                                            </ul>
                                        </div>
                                        <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5">
                                            <h4 className="text-xs uppercase font-bold tracking-widest text-red-400 mb-3 flex items-center gap-2"><span>⚠</span> Red Flags</h4>
                                            <ul className="space-y-2">
                                                {evaluation.redFlags?.length ? evaluation.redFlags.map((r: string, i: number) => (
                                                    <li key={i} className="flex gap-2 text-slate-300 text-sm"><span className="text-red-500">✕</span> {r}</li>
                                                )) : <li className="text-slate-500 text-sm">No red flags flagged by the AI.</li>}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    {evaluation.olqAnalysis && (
                                        <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-5">
                                            <h4 className="text-xs uppercase font-bold tracking-widest text-purple-400 mb-4">Specific OLQ Analysis Matrix</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {evaluation.olqAnalysis.map((olq: any, idx: number) => (
                                                    <div key={idx} className="bg-black/30 border border-white/5 rounded-lg p-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-white text-sm">{olq.olq}</span>
                                                            <span className={`font-mono text-xs font-bold ${olq.score >= 7 ? 'text-emerald-400' : 'text-amber-400'}`}>{olq.score}/10</span>
                                                        </div>
                                                        <p className="text-slate-400 italic text-xs leading-relaxed">{olq.note}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {evaluation.advice && (
                                        <div className="bg-blue-900/20 border-l-4 border-blue-500 p-5 rounded-r-xl">
                                            <h4 className="text-xs uppercase font-bold tracking-widest text-blue-400 mb-1">DIPR Evaluator Advice</h4>
                                            <p className="text-white text-sm leading-relaxed">{evaluation.advice}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ) : null}
                </div>
            )}
        </div>
    )
}
