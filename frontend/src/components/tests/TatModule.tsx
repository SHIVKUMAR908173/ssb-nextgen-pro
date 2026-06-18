'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Timer, CheckCircle, Image as ImageIcon, Send } from 'lucide-react'
import DualModeEngine from './DualModeEngine'

interface TatSlide {
    id: number;
    imageUrl?: string;
    isBlank?: boolean;
}

// 11 Picture slides + 1 Blank slide
const TAT_SLIDES: TatSlide[] = [
    { id: 1, imageUrl: '/tat/slide1.webp' },
    { id: 2, imageUrl: '/tat/slide2.webp' },
    { id: 3, imageUrl: '/tat/slide3.webp' },
    { id: 4, imageUrl: '/tat/slide4.webp' },
    { id: 5, imageUrl: '/tat/slide5.webp' },
    { id: 6, imageUrl: '/tat/slide6.webp' },
    { id: 7, imageUrl: '/tat/slide7.webp' },
    { id: 8, imageUrl: '/tat/slide8.webp' },
    { id: 9, imageUrl: '/tat/slide9.webp' },
    { id: 10, imageUrl: '/tat/slide10.webp' },
    { id: 11, imageUrl: '/tat/slide11.webp' },
    { id: 12, isBlank: true },
]

// Standard TAT testing rules 
const PICTURE_VIEW_TIME = 30; // 30 seconds to view picture
const STORY_WRITE_TIME = 240; // 4 minutes (240 seconds) to write the story

export default function TatModule() {
    // Mode configuration
    const [mode, setMode] = useState<'PRACTICE' | 'TEST' | null>(null)

    // TAT Internal State
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [phase, setPhase] = useState<'VIEWING' | 'WRITING' | 'COMPLETED'>('VIEWING')
    const [timeLeft, setTimeLeft] = useState(PICTURE_VIEW_TIME)
    const [story, setStory] = useState('')
    const [allResponses, setAllResponses] = useState<Record<number, string>>({})

    const isTestMode = mode === 'TEST'

    // Engine Core Timer Loop
    useEffect(() => {
        // Only run timer if we are viewing or writing in Test mode
        if (phase === 'COMPLETED' || !isTestMode) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleAutoAdvance() // Time is up!
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, currentSlideIndex, isTestMode]) // Rebind when phase switches

    const handleAutoAdvance = () => {
        if (phase === 'VIEWING') {
            // After 30s view time, switch to 4m writing time
            setPhase('WRITING')
            setTimeLeft(STORY_WRITE_TIME)
        } else if (phase === 'WRITING') {
            // Strictly auto-submit the story and move to the next slide
            saveStoryAndNext()
        }
    }

    const saveStoryAndNext = () => {
        // Archive current story
        setAllResponses(prev => ({ ...prev, [currentSlideIndex]: story }))
        setStory('')

        if (currentSlideIndex < TAT_SLIDES.length - 1) {
            // Move to next slide, reset to view phase
            setCurrentSlideIndex(prev => prev + 1)
            setPhase('VIEWING')
            setTimeLeft(PICTURE_VIEW_TIME)
        } else {
            // All 12 slides completed
            setPhase('COMPLETED')
        }
    }

    // Early return if mode not selected yet
    if (!mode) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5 text-center text-slate-200">
                <h3 className="text-3xl font-black uppercase tracking-[0.2em] text-white">Thematic Apperception Test (TAT)</h3>
                <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                    11 Picture slides and 1 Blank slide. 30 seconds to view, 4 minutes to write each story. Tests your subconscious perceptions against the 15 Officer Like Qualities.
                </p>
                <div className="flex gap-4 mt-6">
                    <button 
                        onClick={() => { setMode('PRACTICE'); setPhase('VIEWING'); setTimeLeft(PICTURE_VIEW_TIME); }}
                        className="px-10 py-4 font-black uppercase tracking-widest text-white rounded-xl transition-all shadow-glass ease-in hover:scale-[1.02] bg-olive hover:bg-olive-600"
                    >
                        Practice Mode
                    </button>
                    <button 
                        onClick={() => { setMode('TEST'); setPhase('VIEWING'); setTimeLeft(PICTURE_VIEW_TIME); }}
                        className="px-10 py-4 font-black uppercase tracking-widest text-white rounded-xl transition-all shadow-glass ease-in hover:scale-[1.02] bg-red-600 hover:bg-red-500"
                    >
                        Test Mode
                    </button>
                </div>
            </div>
        )
    }

    const currentSlide = TAT_SLIDES[currentSlideIndex]

    if (phase === 'COMPLETED') {
        console.log('Final Payload for Vacha/Mansa AI:', allResponses);
        return (
            <div className="bg-charcoal flex flex-col items-center justify-center p-6 mt-16 pb-32">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-white/[0.03] border border-white/10 p-12 rounded-3xl backdrop-blur-md shadow-2xl">
                    <CheckCircle className="w-24 h-24 text-olive mx-auto mb-6 drop-shadow-[0_0_20px_rgba(77,120,78,0.5)]" />
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight">Assesment Complete</h2>
                    <p className="text-slate-400 mt-4 max-w-sm mx-auto leading-relaxed">All 12 stories acquired securely. Mansa AI is evaluating your psych profile against the 15 OLQs.</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-[85vh] bg-charcoal flex flex-col p-4 md:p-8 text-slate-200 selection:bg-olive/30">
            {/* Header / HUD Tracker */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        TAT Eval
                        <span className="text-[10px] font-mono tracking-widest text-indigo-400 border border-indigo-400/30 px-2 py-1 rounded bg-indigo-500/10 uppercase">
                            {mode} MODE
                        </span>
                    </h1>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-olive animate-pulse"></span>
                        Slide {currentSlideIndex + 1} of 12 • {currentSlide.isBlank ? 'Blank Slide Sequence' : 'Picture Slide Sequence'}
                    </p>
                </div>

                {/* Timer Display */}
                {isTestMode && (
                    <div className={`flex items-center gap-3 px-5 py-2.5 border rounded-xl font-mono font-bold text-xl shadow-lg transition-colors ${phase === 'VIEWING' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10 shadow-amber-500/10' : 'border-red-500/30 text-red-500 bg-red-500/10 shadow-red-500/10'}`}>
                        <Timer className="w-5 h-5 -mt-0.5 animate-pulse" />
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                )}
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full pb-8">
                {/* Visual Apperception Area */}
                <div className="flex flex-col items-center justify-center bg-black/40 border border-white/10 rounded-3xl relative overflow-hidden h-[50vh] lg:h-auto min-h-[400px] shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
                    <AnimatePresence mode="popLayout">
                        {(phase === 'VIEWING' || !isTestMode) ? (
                            <motion.div
                                key={`img-${currentSlideIndex}`}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 flex items-center justify-center p-6 md:p-12"
                            >
                                {currentSlide.isBlank ? (
                                    <div className="w-full h-full border-4 border-dashed border-white/20 rounded-2xl flex items-center justify-center text-white/30 font-black text-4xl uppercase tracking-[0.2em] bg-white/[0.02]">
                                        Blank Slide
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group">
                                        {/* Placeholder for actual TAT slides fetched from Cloud */}
                                        <ImageIcon className="w-24 h-24 text-white/10 mb-4" />
                                        <span className="text-white/30 font-mono text-xs tracking-widest uppercase">TAT_SLIDE_{currentSlideIndex + 1}_HOLOGRAPHIC_ASSET</span>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent pointer-events-none"></div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="hide-img"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center p-12 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md"
                            >
                                <div className="w-20 h-20 rounded-full bg-red-500/10 mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                    <ImageIcon className="w-8 h-8 text-red-500/50" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-wider">Picture Hidden</h3>
                                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                                    Construct a story around the image. Identify what led to the situation, what is currently happening, the feelings of the characters, and the final outcome.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Cognitive Writing Area */}
                <div className="flex flex-col h-[50vh] lg:h-auto">
                    <div className="flex-1 relative group">
                        <textarea
                            className={`absolute inset-0 w-full h-full bg-white/[0.03] backdrop-blur-xl border ${phase === 'WRITING' || !isTestMode ? 'border-olive/40 focus:border-olive/100 focus:bg-white/[0.05] shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] focus:shadow-[0_0_30px_rgba(77,120,78,0.2)]' : 'border-white/5 opacity-50 cursor-not-allowed'} rounded-3xl p-8 text-slate-100 font-serif text-lg leading-relaxed resize-none focus:outline-none transition-all duration-300`}
                            placeholder={(phase === 'WRITING' || !isTestMode) ? "Begin your narrative here..." : "Wait for the viewing period to complete..."}
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                            disabled={phase === 'VIEWING' && isTestMode}
                        />
                    </div>

                    {/* Foot controls */}
                    <div className="mt-5 flex justify-between items-center px-2">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <span className="text-xs font-mono font-bold text-slate-400">{story.split(/\s+/).filter(Boolean).length} words</span>
                            </div>
                        </div>

                        {(!isTestMode || phase === 'WRITING') && (
                            <button
                                onClick={saveStoryAndNext}
                                className="group flex items-center gap-2 px-8 py-3.5 bg-olive hover:bg-olive-600 text-charcoal font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(77,120,78,0.3)] hover:shadow-[0_0_30px_rgba(77,120,78,0.5)] active:scale-95"
                            >
                                {currentSlideIndex < 11 ? 'Advance Slide' : 'Submit TAT'}
                                <Send className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
