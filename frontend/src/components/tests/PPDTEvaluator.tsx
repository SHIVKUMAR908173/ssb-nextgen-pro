'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Send, UserPlus, Mic, Activity, Upload } from 'lucide-react';
import { resolvePPDTImage } from './stimuliImages';
import { PPDT_SETS } from '@/lib/ppdt-dataset';

interface Character {
    age: string;
    sex: string;
    mood: string;
}

export default function PPDTEvaluator() {
    // Phases: 'instructions' -> 'picture' -> 'writing' -> 'narration' -> 'evaluating' -> 'finished'
    const [phase, setPhase] = useState<'instructions' | 'picture' | 'writing' | 'narration' | 'evaluating' | 'finished'>('instructions');
    const [timeLeft, setTimeLeft] = useState(0);
    const [story, setStory] = useState('');
    const [narration, setNarration] = useState('');
    const [oirRating, setOirRating] = useState(1);
    const [characters, setCharacters] = useState<Character[]>([{ age: '', sex: 'P', mood: '0' }]);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [setIndex, setSetIndex] = useState(0);
    const [customSet, setCustomSet] = useState<any[] | null>(null);
    const [randomImage, setRandomImage] = useState(1);
    const [imageLoadFailed, setImageLoadFailed] = useState(false);
    
    const recognitionRef = React.useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-IN';

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + ' ';
                }
                if (finalTranscript) {
                    setNarration(prev => prev + finalTranscript);
                }
            };
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (phase === 'picture' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (phase === 'picture' && timeLeft === 0) {
            setPhase('writing');
            setTimeLeft(240); // 4 minutes
        } else if (phase === 'writing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (phase === 'writing' && timeLeft === 0) {
            startNarration();
        } else if (phase === 'narration' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (phase === 'narration' && timeLeft === 0) {
            if (recognitionRef.current) recognitionRef.current.stop();
            evaluateStory();
        }
        return () => clearTimeout(timer);
    }, [phase, timeLeft]);

    const startNarration = () => {
        setPhase('narration');
        setTimeLeft(60); // 1 minute for GD Narration
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.warn('Speech recognition already started');
            }
        }
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCustomSet(parsed);
                    setPhase('instructions');
                    alert(`Loaded custom PPDT set with ${parsed.length} images!`);
                } else {
                    alert('Invalid JSON format. Must be an array of objects with image_url.');
                }
            } catch (err) {
                alert('Error parsing JSON file.');
            }
        };
        reader.readAsText(file);
    };

    const startTest = () => {
        setImageLoadFailed(false);
        setPhase('picture');
        setTimeLeft(30); // 30 seconds
    };

    const addCharacter = () => {
        setCharacters([...characters, { age: '', sex: 'P', mood: '0' }]);
    };

    const updateCharacter = (index: number, field: keyof Character, value: string) => {
        const newChars = [...characters];
        newChars[index] = { ...newChars[index], [field]: value };
        setCharacters(newChars);
    };

    const evaluateStory = async () => {
        setPhase('evaluating');
        try {
            // Format characters as string array for backend
            const characterDescriptions = characters.map(c => {
                const parts = [];
                if (c.age) parts.push(`${c.age} years old`);
                parts.push(c.sex === 'M' ? 'Male' : c.sex === 'F' ? 'Female' : 'Person');
                if (c.mood === '+') parts.push('positive mood');
                else if (c.mood === '-') parts.push('negative mood');
                return parts.join(' ');
            }).filter(Boolean);

            const res = await fetch('/api/psych-evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testType: 'PPDT',
                    stimulus: characterDescriptions.join('; ') || 'Group of people in a situation',
                    content: { story, narration, oirRating, charactersIdentified: characterDescriptions },
                    isSpoken: true // Narration is spoken
                })
            });
            
            if (res.ok) {
                const data = await res.json();
                const evalFeedback = data.feedback || {};
                
                setEvaluation({
                    olq_summary: evalFeedback.verdict || evalFeedback.advice || 'Story evaluated successfully.',
                    required_improvements: evalFeedback.redFlags?.join('; ') || 'Focus on developing clearer themes and character motivations.',
                    screening_probability: evalFeedback.confidenceScore ? `${evalFeedback.confidenceScore}%` : "75%"
                });

                // Save to localStorage for Assessment Hub
                try {
                    const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
                    let probabilityScore = 75; // Default fallback
                    if (data.screening_probability) {
                        const probMatch = data.screening_probability.match(/(\d+)%/);
                        if (probMatch) probabilityScore = parseInt(probMatch[1]);
                    }

                    history.push({
                        id: `PPDT-${Date.now()}`,
                        test: 'PPDT & Narration',
                        score: probabilityScore,
                        total: 100,
                        date: new Date().toISOString(),
                        status: 'completed',
                        improvements: data.olq_analysis 
                            ? Object.entries(data.olq_analysis)
                                .filter(([_, score]: [string, any]) => score < 3.5)
                                .map(([olq, _]: [string, any]) => `Improve ${olq} demonstration`)
                            : ['Improve character perception', 'Construct clearer narratives']
                    });
                    localStorage.setItem('testHistory', JSON.stringify(history));
                } catch (err) {
                    console.error('Failed to save test history', err);
                }

            } else {
                setEvaluation({
                    olq_summary: 'Story submitted but evaluation service returned an error.',
                    required_improvements: 'Please try again or contact support if issue persists.'
                });
            }
            setPhase('finished');
        } catch (e) {
            console.error(e);
            setEvaluation({
                olq_summary: 'Story submitted but could not be evaluated due to a connection error.',
                required_improvements: 'Please check your connection and try again.'
            });
            setPhase('finished');
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (phase === 'instructions') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                {/* Hero Banner */}
                <div className="relative bg-gradient-to-br from-[#0d1b4b] to-[#1a0a3d] rounded-[48px] p-12 border border-indigo-500/20 overflow-hidden text-center shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-6">
                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Stage I Screening</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-3">
                            PPDT
                        </h1>
                        <p className="text-indigo-300 font-bold text-lg mb-2">Picture Perception &amp; Discussion Test</p>
                        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                            A hazy picture is shown for <strong className="text-white">30 seconds</strong>. Then you write a story in <strong className="text-white">4 minutes</strong> that is later discussed in a group.
                        </p>
                    </div>
                </div>

                {/* 5-Step Process Cards */}
                <div>
                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">How to Attempt — 5 Steps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            { step: '01', title: 'Observe', desc: 'View the hazy image carefully for 30 sec. Note every figure, action, and environment.', color: 'indigo', icon: '👁' },
                            { step: '02', title: 'Identify Characters', desc: 'Count the number of people. Mark age, sex (M/F/P) and mood (+/-/0) for each.', color: 'blue', icon: '👥' },
                            { step: '03', title: 'Build the Story', desc: 'Past → Present → Future. The hero must be proactive, positive and solve the problem.', color: 'purple', icon: '📖' },
                            { step: '04', title: 'OLQ Focus', desc: 'Show qualities: Leadership, Courage, Cooperation. Avoid negative or passive characters.', color: 'violet', icon: '🎯' },
                            { step: '05', title: 'Submit & Discuss', desc: "Submit story clearly. In group discussion, build on others' ideas — don't dominate.", color: 'emerald', icon: '✅' },
                        ].map((s) => (
                            <div key={s.step} className={`bg-${s.color}-500/5 border border-${s.color}-500/15 rounded-3xl p-6 flex flex-col items-center text-center hover:border-${s.color}-500/30 transition-all`}>
                                <div className="text-3xl mb-3">{s.icon}</div>
                                <div className={`text-[9px] font-black text-${s.color}-400 tracking-[0.3em] uppercase mb-2`}>Step {s.step}</div>
                                <h3 className="text-white font-black uppercase tracking-tight mb-2 text-sm">{s.title}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Do's and Don'ts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-[32px] p-8">
                        <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-5 flex items-center gap-2">
                            <span>✅</span> What GOOD Stories Have
                        </h3>
                        <ul className="space-y-3">
                            {[
                                'Main character is proactive — takes initiative',
                                'Story has a clear problem → action → positive outcome',
                                'Shows leadership, teamwork, and courage',
                                'Characters identified with age, sex & mood',
                                'Ends positively with social impact'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <span className="text-slate-300 text-sm font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/15 rounded-[32px] p-8">
                        <h3 className="text-red-400 font-black uppercase tracking-widest text-[10px] mb-5 flex items-center gap-2">
                            <span>❌</span> Common Mistakes to Avoid
                        </h3>
                        <ul className="space-y-3">
                            {[
                                'Passive hero who waits for others to act',
                                'Negative or tragic ending',
                                'Skipping character identification (age/sex/mood)',
                                'More than 1 main character without clarity',
                                'Writing the same story every time (pattern is flagged)'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                    <span className="text-slate-400 text-sm font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Timing Guide */}
                <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F]">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Time Breakdown</h3>
                    <div className="grid grid-cols-3 gap-6">
                        {[
                            { time: '30 sec', label: 'Picture Viewing', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                            { time: '4 min', label: 'Story Writing', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                            { time: '~3 min', label: 'Group Discussion', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        ].map((t) => (
                            <div key={t.label} className={`${t.bg} rounded-2xl p-6 text-center`}>
                                <p className={`text-3xl font-black ${t.color} mb-1`}>{t.time}</p>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button and OIR Selection */}
                <div className="flex flex-col gap-4">
                    <div className="bg-[#162840] rounded-[28px] p-6 border border-[#1E3A5F] flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-left">
                            <h3 className="text-white font-black uppercase tracking-widest text-sm">Select Your OIR Rating</h3>
                            <p className="text-slate-400 text-xs mt-1">Used to calculate your final Screening Probability accurately.</p>
                        </div>
                        <select 
                            value={oirRating}
                            onChange={(e) => setOirRating(Number(e.target.value))}
                            className="bg-black/50 border border-white/10 rounded-xl px-6 py-3 text-white font-black uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        >
                            <option value={1}>OIR - 1 (Outstanding)</option>
                            <option value={2}>OIR - 2 (Excellent)</option>
                            <option value={3}>OIR - 3 (Average)</option>
                            <option value={4}>OIR - 4 (Below Average)</option>
                            <option value={5}>OIR - 5 (Poor)</option>
                        </select>
                    </div>

                {/* CTA Button */}
                <div className="flex gap-4 items-center justify-center w-full">
                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-[24px] border border-white/10 flex-1 min-w-[200px]">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Set:</span>
                         <select 
                           value={customSet ? 'custom' : setIndex} 
                           onChange={(e) => {
                              if (e.target.value !== 'custom') {
                                  setSetIndex(Number(e.target.value));
                                  setCustomSet(null);
                              }
                           }}
                           className="bg-[#162840] border border-white/10 text-white text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-bold outline-none cursor-pointer w-full"
                         >
                           {Array.from({ length: 60 }).map((_, i) => (
                              <option key={i} value={i}>PPDT Set {i + 1}</option>
                           ))}
                           {customSet && <option value="custom">Custom Set</option>}
                         </select>
                    </div>

                    <button
                        onClick={startTest}
                        className="bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-black py-5 px-10 rounded-[24px] transition-all shadow-xl shadow-indigo-600/25 uppercase tracking-widest text-sm flex items-center justify-center gap-3 group whitespace-nowrap"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
                        Begin Screening
                    </button>

                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/5 hover:bg-white/10 active:scale-95 text-white font-bold py-5 px-6 rounded-[24px] transition-all border border-white/10 text-sm flex items-center justify-center gap-2"
                    >
                        <Upload className="w-4 h-4" /> Custom Set
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileUpload} />
                </div>
            </div>
            </div>
        );
    }

    const currentPicUrl = customSet ? (customSet[setIndex]?.image_url || customSet[0]?.image_url) : (PPDT_SETS.sets[setIndex]?.images[0]?.image_url || resolvePPDTImage(randomImage));
    const isSvgString = typeof currentPicUrl === 'string' && currentPicUrl.trim().startsWith('<svg');

    if (phase === 'picture') {
        return (
            <div className="bg-black/80 p-8 rounded-[40px] border border-white/10 text-center relative overflow-hidden max-w-5xl mx-auto h-[600px] flex flex-col items-center justify-center">
                <div className="absolute top-8 right-8 bg-red-500/20 text-red-500 font-mono font-black px-6 py-2 rounded-full border border-red-500/30 backdrop-blur-md z-20">
                    TIME: {formatTime(timeLeft)}
                </div>
                <h2 className="text-xl font-black mb-8 text-white uppercase tracking-[0.2em] opacity-60">Visual Perception Mode</h2>
                <div className="w-full max-w-3xl aspect-video rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl relative group bg-[#d1d5db] flex items-center justify-center">
                    {imageLoadFailed ? (
                        <div className="text-center px-6">
                            <p className="text-black font-black uppercase tracking-[0.2em] text-sm">Stimulus unavailable</p>
                            <p className="text-black/70 text-xs mt-2">Using local PPDT set only. Please continue with the story exercise.</p>
                        </div>
                    ) : isSvgString ? (
                        <div
                            className="w-full h-full flex items-center justify-center filter grayscale blur-[1px] opacity-90 transition-all duration-1000 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                            dangerouslySetInnerHTML={{ __html: currentPicUrl }}
                        />
                    ) : (
                        <img
                            src={currentPicUrl}
                            alt="PPDT Scenario"
                            className="w-full h-full object-contain filter grayscale blur-[1px] opacity-90 transition-all duration-1000"
                            onError={() => setImageLoadFailed(true)}
                        />
                    )}
                </div>
                <p className="mt-8 text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Analyze the environment and characters...</p>
            </div>
        );
    }

    if (phase === 'writing') {
        return (
            <div className="bg-charcoal/80 p-8 rounded-[40px] border border-white/10 shadow-glass backdrop-blur-xl max-w-6xl mx-auto h-[700px] flex flex-col">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Narrative Construction</h2>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Phase 2: Writing & Identification</p>
                    </div>
                    <div className="bg-red-500/20 text-red-500 font-mono font-black px-6 py-2 rounded-full border border-red-500/30 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
                    {/* Character Marking */}
                    <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="font-black text-[10px] uppercase text-slate-500 tracking-[0.2em]">Character Matrix</h3>
                            <button onClick={addCharacter} className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/20 hover:bg-indigo-600/40 transition-colors">
                                <UserPlus className="w-4 h-4" />
                            </button>
                        </div>
                        {characters.map((char, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Character {idx + 1}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <input 
                                        type="text" placeholder="Age" value={char.age}
                                        onChange={(e) => updateCharacter(idx, 'age', e.target.value)}
                                        className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                                    />
                                    <select 
                                        value={char.sex}
                                        onChange={(e) => updateCharacter(idx, 'sex', e.target.value)}
                                        className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                                    >
                                        <option value="M">M</option>
                                        <option value="F">F</option>
                                        <option value="P">P</option>
                                    </select>
                                    <select 
                                        value={char.mood}
                                        onChange={(e) => updateCharacter(idx, 'mood', e.target.value)}
                                        className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                                    >
                                        <option value="+">+</option>
                                        <option value="-">-</option>
                                        <option value="0">0</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Story Area */}
                    <div className="lg:col-span-8 flex flex-col h-full relative">
                        <textarea
                            className="flex-1 w-full bg-black/40 border border-white/10 rounded-[32px] p-8 text-lg text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none font-medium leading-relaxed shadow-inner"
                            placeholder="Construct your story... What led to this? What is the current action? What is the resolution?"
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                if (phase === 'writing') startNarration();
                            }}
                            className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px] flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Next: GD Narration
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'narration') {
        return (
            <div className="bg-charcoal/80 p-8 rounded-[40px] border border-white/10 shadow-glass backdrop-blur-xl max-w-4xl mx-auto h-[600px] flex flex-col items-center text-center">
                <div className="w-full flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Individual Narration</h2>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Phase 3: Group Discussion Prep</p>
                    </div>
                    <div className="bg-amber-500/20 text-amber-500 font-mono font-black px-6 py-2 rounded-full border border-amber-500/30 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
                    <div className="w-32 h-32 rounded-full bg-blue-600/20 border-4 border-blue-500 flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-20"></div>
                        <Mic className="w-12 h-12 text-blue-400" />
                    </div>
                    
                    <h3 className="text-2xl font-medium text-white mb-4">Narrate your story clearly...</h3>
                    <p className="text-slate-400 text-sm mb-8">Speak continuously for 1 minute. The AI is capturing your confidence and fluency.</p>
                    
                    <div className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-left overflow-y-auto custom-scrollbar italic text-slate-300 text-sm">
                        {narration || "Listening to your narration..."}
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (recognitionRef.current) recognitionRef.current.stop();
                        evaluateStory();
                    }}
                    className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs flex items-center gap-2"
                >
                    <CheckCircle className="w-5 h-5" />
                    Finish Narration & Evaluate
                </button>
            </div>
        );
    }

    if (phase === 'evaluating') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5 min-h-[500px]">
                <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Psychometric Audit Active</h3>
                <p className="text-slate-500 font-mono text-xs max-w-md text-center">
                   AI Psychologist is analyzing character perception accuracy, story coherence, and projected OLQs...
                </p>
            </div>
        );
    }

    return (
        <div className="bg-charcoal/80 p-8 rounded-[40px] border border-white/10 shadow-glass backdrop-blur-xl max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Perception Report</h2>
            </div>
            
            <div className="space-y-8 text-left">
                {evaluation ? (
                    <>
                        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-4 py-1 bg-indigo-500/20 rounded-bl-xl border-b border-l border-indigo-500/30">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{evaluation.screening_probability}</span>
                            </div>
                            <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-4 tracking-widest mt-4">Psychological Narrative Analysis</h4>
                            <p className="text-slate-200 text-sm leading-relaxed">{evaluation.olq_summary}</p>
                        </div>
                        <div className="bg-red-900/10 p-6 rounded-3xl border border-red-500/20">
                            <h4 className="text-[10px] font-black uppercase text-red-400 mb-4 tracking-widest">Parameters to Improve (Why you might be screened out)</h4>
                            <p className="text-red-200 text-sm leading-relaxed">{evaluation.required_improvements}</p>
                        </div>
                    </>
                ) : (
                    <div className="bg-slate-900 p-8 rounded-3xl text-center">
                        <p className="text-slate-500 italic">Evaluation complete. Review your submission below.</p>
                    </div>
                )}

                <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Your Submitted Story</h3>
                    <p className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">{story || "No story written."}</p>
                </div>
            </div>

            <button
                onClick={() => {
                    setPhase('instructions');
                setStory('');
                setNarration('');
                setCharacters([{ age: '', sex: 'P', mood: '0' }]);
                setEvaluation(null);
                setImageLoadFailed(false);
                }}
                className="mt-10 px-12 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all"
            >
                Restart Session
            </button>
        </div>
    );
}
