'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, UserSquare2, Loader2, Volume2, Sparkles, Trophy, ShieldAlert, CheckCircle2, ArrowLeft, Radio, Target, Award, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'

export default function VachaInterviewPage() {
    // Session State
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [currentStage, setCurrentStage] = useState<string>('Initialization')
    const [currentQuestion, setCurrentQuestion] = useState<string>("Click 'Start Interview' when you are ready to begin.")
    const [interviewCompleted, setInterviewCompleted] = useState(false)
    const [isInitializing, setIsInitializing] = useState(false)

    // Recording State
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [interimTranscript, setInterimTranscript] = useState('')
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    
    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [feedback, setFeedback] = useState<any>(null) // the "analysis" object from backend
    const [speechError, setSpeechError] = useState<string | null>(null)
    const [isSpeaking, setIsSpeaking] = useState(false)

    const recognitionRef = useRef<any>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const startTimeRef = useRef<number>(0)

    // Helper to get auth token
    const getAuthToken = async () => {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        return session?.access_token || ''
    }

    const startInterview = async () => {
        setIsInitializing(true)
        setFeedback(null)
        setTranscript('')
        try {
            const token = await getAuthToken()
            const res = await fetch(`${API_URL}/pi-interview/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    candidate_profile: {
                        name: "Candidate",
                        age: 22,
                        education: "Graduate",
                        hobbies: ["Reading", "Sports"]
                    },
                    mode: "assessment"
                })
            })
            
            if (!res.ok) throw new Error('Failed to start interview')
            
            const data = await res.json()
            setSessionId(data.session_id)
            setCurrentQuestion(data.question)
            setCurrentStage(data.stage || 'Ice breaker')
            
            // Auto speak the first question
            speakText(data.question)
            
        } catch (error) {
            console.error("Start interview error:", error)
            setSpeechError("Could not connect to the Brigadier AI Backend. Ensure the Python server is running.")
        }
        setIsInitializing(false)
    }

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
        if (!sessionId) {
            alert("Please start the interview first!")
            return
        }
        
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
        
        // --- ADD MEDIA RECORDER ---
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            audioChunksRef.current = []
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data)
            }
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                setAudioBlob(audioBlob)
                stream.getTracks().forEach(track => track.stop())
            }
            
            mediaRecorder.start(1000)
            mediaRecorderRef.current = mediaRecorder
        } catch (e) {
            console.warn("MediaRecorder not available or permitted", e)
        }
        
        recognitionRef.current = recognition
        startTimeRef.current = Date.now()
        setIsRecording(true)
        setSpeechError(null)
    }, [sessionId])

    const stopRecording = useCallback(() => {
        recognitionRef.current?.stop()
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
        }
        setIsRecording(false)
        setInterimTranscript('')
    }, [])

    const analyzeResponse = async () => {
        if (!transcript.trim() || !sessionId) return
        setIsAnalyzing(true)
        
        try {
            const token = await getAuthToken()
            
            const formData = new FormData()
            formData.append('response', transcript.trim())
            if (audioBlob) {
                // Determine mime type based on browser support
                const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
                formData.append('audio', audioBlob, `recording.${mimeType.split('/')[1]}`)
            }

            const res = await fetch(`${API_URL}/pi-interview/submit-response/${sessionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
            
            if (!res.ok) throw new Error('Evaluation failed')
            
            const data = await res.json()
            
            if (data.interview_completed) {
                setInterviewCompleted(true)
                setCurrentQuestion("Interview Completed. Check your report.")
                setFeedback(data.analysis)
            } else {
                setFeedback(data.analysis)
                setCurrentQuestion(data.next_question)
                if (data.stage) setCurrentStage(data.stage)
                setTranscript('')
                speakText(data.next_question)
            }
        } catch (e) {
            console.error(e)
            setSpeechError('Failed to connect to AI evaluator. Please try again.')
        }
        setIsAnalyzing(false)
    }

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
                        {sessionId && !interviewCompleted && (
                            <div className="px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black tracking-widest uppercase rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                IN PROGRESS
                            </div>
                        )}
                        {interviewCompleted && (
                            <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black tracking-widest uppercase rounded-full flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" />
                                COMPLETED
                            </div>
                        )}
                    </div>
                </div>

                {speechError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5" />
                        {speechError}
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: Assessment Categories / Stage */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center text-center">
                            {!sessionId ? (
                                <button 
                                    onClick={startInterview}
                                    disabled={isInitializing}
                                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50">
                                    {isInitializing ? 'Connecting...' : 'Start Interview'}
                                </button>
                            ) : (
                                <div className="w-full">
                                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-center gap-2">
                                        <Radio className="w-4 h-4 text-amber-500" /> Live Status
                                    </h2>
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-6">
                                        <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-2">Current Phase</p>
                                        <p className="text-xl font-black text-slate-800 capitalize">{currentStage.replace('_', ' ')}</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className={`p-4 rounded-2xl border ${currentStage === 'Ice breaker' ? 'bg-cyan-50 border-cyan-200 text-cyan-800' : 'bg-transparent border-slate-100 text-slate-400'}`}>
                                            <p className="text-xs font-bold uppercase tracking-wider">Phase 1: CIQ & Context</p>
                                        </div>
                                        <div className={`p-4 rounded-2xl border ${currentStage === 'Core Assessment' ? 'bg-cyan-50 border-cyan-200 text-cyan-800' : 'bg-transparent border-slate-100 text-slate-400'}`}>
                                            <p className="text-xs font-bold uppercase tracking-wider">Phase 2: Core Analysis</p>
                                        </div>
                                        <div className={`p-4 rounded-2xl border ${currentStage === 'Stress Testing' ? 'bg-cyan-50 border-cyan-200 text-cyan-800' : 'bg-transparent border-slate-100 text-slate-400'}`}>
                                            <p className="text-xs font-bold uppercase tracking-wider">Phase 3: Stress Test</p>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                <Image src="/col-nishant-turban.png" alt="Col. Arjun Singh" fill className="object-cover" />
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
                                <button onClick={isRecording ? stopRecording : startRecording} disabled={!sessionId || interviewCompleted}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg disabled:opacity-50
                                        ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' : 'bg-[#111827] text-white hover:bg-slate-800'}`}>
                                    {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                </button>
                                
                                <button onClick={analyzeResponse} disabled={!transcript.trim() || isAnalyzing || interviewCompleted}
                                    className="px-8 h-16 rounded-full bg-slate-100 text-red-500 font-black text-[11px] tracking-widest uppercase hover:bg-red-50 transition-colors disabled:opacity-50 disabled:hover:bg-slate-100 flex items-center gap-2">
                                    {isAnalyzing ? <><Loader2 className="w-4 h-4 animate-spin text-slate-400" /> <span className="text-slate-400">Analyzing</span></> : 'Submit Response'}
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
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-auto">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Transcript
                                        </p>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {transcript}<span className="text-slate-400">{interimTranscript}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Protocol / Feedback Card */}
                        <div className="bg-[#1e293b] rounded-[40px] p-8 shadow-lg min-h-[240px] flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <Target className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">Brigadier AI Assessment</h3>
                            </div>
                            <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {!feedback ? (
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                                        "Awaiting response... AI will perform psychological deep-scan and OLQ assessment upon submission."
                                    </p>
                                ) : (
                                    <div className="space-y-6">
                                        {feedback.overall_assessment && (
                                            <p className="text-sm text-white font-medium border-l-2 border-cyan-500 pl-4 py-1">
                                                {feedback.overall_assessment}
                                            </p>
                                        )}
                                        
                                        {/* Red Flags */}
                                        {feedback.red_flags_detected?.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-[9px] font-black tracking-widest uppercase text-red-400">Red Flags Detected</span>
                                                {feedback.red_flags_detected.map((flag: string, i: number) => (
                                                    <p key={i} className="text-xs text-red-200 flex items-start gap-2 bg-red-500/10 p-2 rounded-lg">
                                                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {flag}
                                                    </p>
                                                ))}
                                            </div>
                                        )}

                                        {/* Green Flags */}
                                        {feedback.green_flags_detected?.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-[9px] font-black tracking-widest uppercase text-emerald-400">Green Flags Detected</span>
                                                {feedback.green_flags_detected.map((flag: string, i: number) => (
                                                    <p key={i} className="text-xs text-emerald-200 flex items-start gap-2 bg-emerald-500/10 p-2 rounded-lg">
                                                        <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {flag}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Top OLQ Addressed */}
                                        {feedback.olq_analysis && Object.keys(feedback.olq_analysis).length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-[9px] font-black tracking-widest uppercase text-slate-400">Key OLQ Signals</span>
                                                {Object.entries(feedback.olq_analysis).slice(0,3).map(([key, val]: any, i: number) => {
                                                    const score = val.score || 0;
                                                    const color = score >= 3.5 ? 'text-emerald-400' : score < 2.5 ? 'text-red-400' : 'text-amber-400';
                                                    return (
                                                        <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-xs">
                                                            <span className="text-slate-300 font-medium">{key}</span>
                                                            <span className={`font-black ${color}`}>{score}/5</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}

                                        {/* Acoustic Biomarkers */}
                                        {feedback.voice_confidence !== undefined && (
                                            <div className="space-y-2 pt-2 border-t border-slate-700">
                                                <span className="text-[9px] font-black tracking-widest uppercase text-cyan-400">Acoustic Biomarkers</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-white/5 p-2 rounded-lg flex flex-col gap-1">
                                                        <span className="text-[8px] uppercase text-slate-400 font-bold">Voice Confidence</span>
                                                        <span className="text-sm font-black text-white">{Math.round(feedback.voice_confidence * 100)}%</span>
                                                    </div>
                                                    <div className="bg-white/5 p-2 rounded-lg flex flex-col gap-1">
                                                        <span className="text-[8px] uppercase text-slate-400 font-bold">Pitch Stability</span>
                                                        <span className="text-sm font-black text-white">{Math.round((feedback.pitch_stability || 0) * 100)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    )
}
