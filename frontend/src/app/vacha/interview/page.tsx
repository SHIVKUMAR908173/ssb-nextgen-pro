'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, UserSquare2, Loader2, Volume2, Sparkles, Trophy, ShieldAlert, CheckCircle2, ArrowLeft, Radio, Target, Award, FileText } from 'lucide-react'
import Link from 'next/link'
import { INITIAL_QUESTIONS, FOLLOW_UP_PROMPTS } from '@/data/interview_questions'

const PI_CATEGORIES = [
    { id: 'intro', title: 'CIQ-1: About Yourself', icon: UserSquare2, stage: 1 },
    { id: 'family', title: 'CIQ-2: Family Background', icon: ShieldAlert, stage: 2 },
    { id: 'edu', title: 'CIQ-3: Education', icon: Trophy, stage: 3 },
    { id: 'hobbies', title: 'CIQ-4: Hobbies & Interests', icon: Sparkles, stage: 4 },
    { id: 'friends', title: 'CIQ-5: Social Life', icon: CheckCircle2, stage: 5 },
]

export default function VachaInterviewPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>('intro')
    const [currentQuestion, setCurrentQuestion] = useState<string>(INITIAL_QUESTIONS[0])
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [interimTranscript, setInterimTranscript] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [feedback, setFeedback] = useState<any>(null)
    const [speechError, setSpeechError] = useState<string | null>(null)
    const [completedCategories, setCompletedCategories] = useState<Set<string>>(new Set())
    const [allFeedbacks, setAllFeedbacks] = useState<Record<string, any>>({})
    const [showReport, setShowReport] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [sessionHistory, setSessionHistory] = useState<{q: string, a: string}[]>([])

    const recognitionRef = useRef<any>(null)
    const startTimeRef = useRef<number>(0)

    const fetchNextQuestion = async (category: string) => {
        try {
            const res = await fetch('/api/interview-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionType: category,
                    questionNumber: sessionHistory.length + 1,
                    previousAnswers: sessionHistory
                })
            })
            const data = await res.json()
            if (data.question) setCurrentQuestion(data.question)
        } catch (e) {
            // Fallback
            const stage = PI_CATEGORIES.findIndex(c => c.id === category)
            setCurrentQuestion(INITIAL_QUESTIONS[stage] || INITIAL_QUESTIONS[0])
        }
    }

    useEffect(() => {
        if (activeCategory && !completedCategories.has(activeCategory)) {
            fetchNextQuestion(activeCategory)
        }
    }, [activeCategory])

    const speakText = useCallback((text: string) => {
        if (!('speechSynthesis' in window)) return
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        const voices = window.speechSynthesis.getVoices()
        const preferred = voices.find(v => v.lang === 'en-IN' || v.lang === 'en-GB')
        if (preferred) utterance.voice = preferred
        utterance.rate = 0.9
        utterance.pitch = 0.8
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
    }, [])

    const startRecording = useCallback(async () => {
        if (typeof window === 'undefined') return
        const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!SpeechRecognitionClass) {
            setSpeechError('Speech recognition not supported in this browser.')
            return
        }
        const recognition = new SpeechRecognitionClass()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-IN'
        recognition.onresult = (event: any) => {
            let final = '', interim = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) final += event.results[i][0].transcript
                else interim += event.results[i][0].transcript
            }
            if (final) setTranscript(prev => prev + final + ' ')
            setInterimTranscript(interim)
        }
        recognition.onerror = () => setIsRecording(false)
        recognition.onend = () => setIsRecording(false)
        recognition.start()
        recognitionRef.current = recognition
        startTimeRef.current = Date.now()
        setIsRecording(true)
        setSpeechError(null)
    }, [])

    const stopRecording = useCallback(() => {
        recognitionRef.current?.stop()
        setIsRecording(false)
        setInterimTranscript('')
    }, [])

    const analyzeResponse = async () => {
        if (!transcript.trim() || !activeCategory) return
        setIsAnalyzing(true)
        setFeedback(null)
        const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
        
        try {
            const res = await fetch('/api/ai-evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'interview',
                    content: transcript.trim(),
                    context: { question: currentQuestion, seconds }
                })
            })
            const fb = await res.json()
            setFeedback(fb)
            setCompletedCategories(prev => new Set(prev).add(activeCategory))
            setAllFeedbacks(prev => ({ ...prev, [activeCategory]: fb }))
            setSessionHistory(prev => [...prev, { q: currentQuestion, a: transcript.trim() }])
        } catch (e) {
            setFeedback({ microFeedback: 'Failed to connect to AI evaluator. Please try again.', scores: {} })
        }
        setIsAnalyzing(false)
    }

    const allDone = completedCategories.size === PI_CATEGORIES.length
    const avgScore = allDone ? Math.round(Object.values(allFeedbacks).reduce((a, f) => a + (f.overallScore || f.scores?.content || 0), 0) / PI_CATEGORIES.length) : 0

    return (
        <div className="min-h-screen bg-[#f4f6f8] text-slate-800 font-sans p-4 md:p-8">
            <div className="max-w-[1400px] mx-auto">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/vacha/assessment" className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <h1 className="text-sm font-black tracking-[0.15em] text-slate-700 uppercase">
                            1/1 PERSONAL INTERVIEW (VIRTUAL)
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black tracking-widest uppercase rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            IN PROGRESS
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: Assessment Categories */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 h-full">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Target className="w-4 h-4" /> Assessment
                            </h2>
                            <div className="space-y-3">
                                {PI_CATEGORIES.map(cat => (
                                    <button key={cat.id}
                                        onClick={() => { setActiveCategory(cat.id); setFeedback(allFeedbacks[cat.id] || null); setTranscript(''); }}
                                        className={`w-full p-4 rounded-3xl transition-all text-left flex items-center gap-4 group
                                            ${activeCategory === cat.id ? 'bg-slate-50 border border-slate-200' : 'bg-transparent border border-transparent text-slate-500 hover:bg-slate-50'}`}>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0
                                            ${activeCategory === cat.id ? 'bg-white shadow-sm text-slate-800' : completedCategories.has(cat.id) ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {completedCategories.has(cat.id) ? <CheckCircle2 className="w-5 h-5" /> : <cat.icon className="w-5 h-5" />}
                                        </div>
                                        <span className={`text-[11px] font-black tracking-widest uppercase leading-tight ${activeCategory === cat.id ? 'text-slate-800' : ''}`}>
                                            {cat.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Video Call Area */}
                    <div className="lg:col-span-6 flex flex-col gap-6">
                        <div className="bg-[#111827] rounded-[48px] p-8 shadow-2xl relative h-[500px] flex flex-col items-center justify-center overflow-hidden border-4 border-slate-800/50">
                            
                            {/* Candidate PIP */}
                            <div className="absolute top-8 right-8 w-32 h-40 bg-slate-800/80 backdrop-blur-md rounded-3xl border border-white/10 flex flex-col items-center justify-center overflow-hidden z-20 shadow-2xl">
                                 <UserSquare2 className="w-8 h-8 text-slate-500 mb-2" />
                                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">You</span>
                            </div>

                            {/* Officer Avatar */}
                            <div className={`relative rounded-3xl overflow-hidden transition-all duration-300 w-full max-w-[440px] aspect-video shadow-2xl bg-[#0a0f18] flex items-center justify-center ${isSpeaking ? 'ring-4 ring-cyan-500 ring-offset-8 ring-offset-[#111827] scale-[1.02]' : 'ring-1 ring-white/10'}`}>
                                <img src="/col-nishant-turban.png" alt="Col. Arjun Singh" className="w-full h-full object-cover" />
                            </div>

                            {/* Officer Name */}
                            <h2 className="mt-10 text-3xl font-black text-white uppercase tracking-tighter text-center relative z-10 drop-shadow-lg">
                                COL. ARJUN SINGH
                            </h2>
                            <p className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] mt-2 relative z-10">President • SSB</p>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center -mt-2">
                            <div className="bg-white rounded-full p-2.5 shadow-xl border border-slate-100 flex items-center gap-3">
                                <button onClick={isRecording ? stopRecording : startRecording}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg
                                        ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' : 'bg-[#111827] text-white hover:bg-slate-800'}`}>
                                    {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                </button>
                                
                                <button onClick={analyzeResponse} disabled={!transcript.trim() || isAnalyzing}
                                    className="px-8 h-16 rounded-full bg-slate-100 text-red-500 font-black text-[11px] tracking-widest uppercase hover:bg-red-50 transition-colors disabled:opacity-50 disabled:hover:bg-slate-100 flex items-center gap-2">
                                    {isAnalyzing ? <><Loader2 className="w-4 h-4 animate-spin text-slate-400" /> <span className="text-slate-400">Analyzing</span></> : 'End Call'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information & Protocol */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        {/* Candidate Input/Question Card */}
                        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[240px]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-cyan-600" />
                                </div>
                                <button onClick={() => speakText(currentQuestion)} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[9px] font-black text-slate-600 uppercase tracking-widest transition-colors flex items-center gap-2">
                                    <Volume2 className="w-3 h-3" /> Hear
                                </button>
                            </div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Current Question</h3>
                            <div className="flex-1 overflow-y-auto pr-2">
                                <p className="text-base font-bold text-slate-800 leading-snug mb-4">&quot;{currentQuestion}&quot;</p>
                                {(transcript || interimTranscript) && (
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Live Transcript</p>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {transcript}<span className="text-slate-400">{interimTranscript}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Protocol / Feedback Card */}
                        <div className="bg-[#1e293b] rounded-[40px] p-8 shadow-lg min-h-[240px] flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <ShieldAlert className="w-5 h-5 text-amber-400" />
                                <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Protocol & Assessment</h3>
                            </div>
                            <div className="relative z-10 flex-1 overflow-y-auto pr-2">
                                {!feedback ? (
                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                        "Maintain professional tone. The IO is analyzing voice modulation, posture, and facial expressions in real-time."
                                    </p>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                                            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Score</span>
                                            <span className="text-2xl font-black text-emerald-400">{feedback.overallScore || feedback.scores?.content || 0}%</span>
                                        </div>
                                        <p className="text-sm text-white font-medium italic border-l-2 border-cyan-500 pl-4 py-1">{feedback.microFeedback}</p>
                                        {feedback.redFlags?.length > 0 && (
                                            <div className="space-y-3">
                                                <span className="text-[9px] font-black tracking-widest uppercase text-red-400">Flags</span>
                                                {feedback.redFlags.map((r: string, i: number) => (
                                                    <p key={i} className="text-[11px] text-slate-300 flex items-start gap-3 bg-red-500/10 p-3 rounded-xl">
                                                        <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> {r}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
