'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Cpu, CheckCircle2, Loader2, BarChart2, Sparkles, Mic2, Mic, MicOff, ArrowRight, Zap, Target, ArrowLeft, Video } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ReactMarkdown from 'react-markdown'

const INITIAL_TOPICS = [
    'Poverty in India', 'Lok Sabha Polls 2024', 'Cross border terrorism',
    'Deepfake Technology', 'Chandrayaan 3 mission', 'Make in India',
    'Global Oil Crisis', 'Women in Combat Roles', 'Demonetization',
]
const TOTAL_TOPICS = 452

export default function LecturettePage() {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [notes, setNotes] = useState<string | null>(null)
    const [youtubeUsed, setYoutubeUsed] = useState(false)
    const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set())
    const [globalLecturetteCount, setGlobalLecturetteCount] = useState(0)
    const [userId, setUserId] = useState<string | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [interimTranscript, setInterimTranscript] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [feedback, setFeedback] = useState<any>(null)
    
    const recognitionRef = useRef<any>(null)
    const startTimeRef = useRef<number>(0)

    const supabase = createClient()

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setUserId(user.id)
            const { data } = await supabase.from('lecturette_progress').select('topic_id').eq('user_id', user.id)
            if (data) {
                const loadedTopics = new Set<string>(data.map((d: { topic_id: string }) => d.topic_id))
                setCompletedTopics(loadedTopics)
            }

            const { data: progressData } = await supabase.from('user_progress').select('lecturettes_completed').eq('user_id', user.id).single()
            if (progressData) {
                setGlobalLecturetteCount(progressData.lecturettes_completed)
            }
        }
        load()
    }, [supabase.auth])

    const generateNotes = useCallback(async (topic: string) => {
        setIsGenerating(true)
        setSelectedTopic(topic)
        setNotes(null)
        setYoutubeUsed(false)
        try {
            const res = await fetch('/api/generate-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            })
            const data = await res.json()
            setNotes(data.notes || 'Could not generate notes.')
            setYoutubeUsed(data.youtubeUsed || false)
        } catch {
            setNotes('Failed to reach the RAG pipeline.')
        } finally {
            setIsGenerating(false)
        }
    }, [])

    const startRecording = useCallback(async () => {
        if (typeof window === 'undefined') return
        const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!SpeechRecognitionClass) return
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
        setTranscript('')
        setFeedback(null)
    }, [])

    const stopRecording = useCallback(() => {
        recognitionRef.current?.stop()
        setIsRecording(false)
        setInterimTranscript('')
    }, [])

    const analyzeSpeech = async () => {
        if (!transcript.trim() || !selectedTopic) return
        setIsAnalyzing(true)
        setFeedback(null)
        const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
        
        try {
            const res = await fetch('/api/evaluate-lecturette', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: selectedTopic,
                    transcript: transcript.trim(),
                    duration: seconds
                })
            })
            const data = await res.json()
            if (data.status === 'success' || data.evaluation) {
                const evalData = data.evaluation || data;
                setFeedback({
                    feedback: evalData.board_president_verdict || evalData.performance_improvement_plan || 'Speech analyzed successfully.',
                    overallScore: evalData.overall_lecturette_score || 50
                })
                markComplete()
            } else {
                setFeedback({ feedback: 'Evaluation failed.', overallScore: 0 })
            }
        } catch (e) {
            setFeedback({ feedback: 'Failed to connect to AI evaluator.', overallScore: 0 })
        }
        setIsAnalyzing(false)
    }

    const markComplete = async () => {
        if (!selectedTopic) return
        const newSet = new Set(Array.from(completedTopics).concat(selectedTopic))
        setCompletedTopics(newSet)
        const newTotal = newSet.size
        setGlobalLecturetteCount(newTotal)

        if (userId) {
            await supabase.from('lecturette_progress').upsert({ user_id: userId, topic_id: selectedTopic }, { onConflict: 'user_id,topic_id' })
            await supabase.from('user_progress').upsert({ user_id: userId, lecturettes_completed: newTotal }, { onConflict: 'user_id' })
        }
    }

    const progressPct = Math.round((globalLecturetteCount / TOTAL_TOPICS) * 100)

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link 
                    href="/vacha/assessment"
                    className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" /> Back to Assessment Hub
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RAG Engine Online</span>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0f172a] rounded-3xl md:rounded-[48px] p-12 overflow-hidden border border-white/5 relative shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                   <div className="space-y-6">
                      <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                         <Mic2 className="w-3 h-3 text-blue-500" />
                         <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Live Intelligence Preparation</span>
                      </div>
                      <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                         Lecturette <span className="text-blue-500">Engine</span>
                      </h1>
                      <p className="text-slate-400 max-w-2xl text-lg font-bold">
                         AI-driven speech synthesis for GTO tasks. Access 452+ indexed topics with real-time YouTube transcript grounding.
                      </p>
                   </div>
                   <div className="bg-[#162840] border border-white/5 rounded-[40px] p-10 text-center min-w-[280px] shadow-2xl">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Total Topics Mastered</p>
                      <p className="text-5xl font-black text-white tabular-nums">{globalLecturetteCount}</p>
                      <div className="mt-6 h-1.5 w-full bg-[#0f172a] rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} className="h-full bg-blue-500" />
                      </div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-4">Progress: {progressPct}%</p>
                   </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Topics Archive */}
                <div className="lg:col-span-4 bg-[#162840] rounded-3xl md:rounded-[48px] p-10 border border-[#1E3A5F] shadow-2xl flex flex-col h-[700px]">
                    <div className="flex items-center gap-3 mb-8">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Priority Archive</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar">
                        {INITIAL_TOPICS.map((topic) => {
                            const isSelected = selectedTopic === topic
                            const isDone = completedTopics.has(topic)
                            return (
                                <button
                                    key={topic}
                                    onClick={() => generateNotes(topic)}
                                    className={`w-full p-6 rounded-3xl border transition-all text-left flex items-center gap-4 ${
                                        isSelected ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-600/20' : 'bg-[#0f172a] border-white/5 hover:border-white/10 text-slate-500'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSelected ? 'bg-white text-blue-600' : 'bg-[#162840] text-slate-700'}`}>
                                        {isDone ? <CheckCircle2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                    </div>
                                    <span className={`text-xs font-black uppercase tracking-tight flex-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>{topic}</span>
                                    {isSelected && <ArrowRight className="w-4 h-4 text-white/50" />}
                                </button>
                            )
                        })}
                        <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-[40px] space-y-4 opacity-50">
                            <BarChart2 className="w-10 h-10 text-slate-700 mx-auto" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">+{TOTAL_TOPICS - INITIAL_TOPICS.length} More Contexts Indexed</p>
                        </div>
                    </div>
                </div>

                {/* Workspace Area */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {!selectedTopic ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="bg-[#162840] rounded-3xl md:rounded-[48px] p-12 border border-[#1E3A5F] shadow-2xl h-full flex flex-col items-center justify-center text-center space-y-12"
                            >
                                <div className="w-32 h-32 bg-[#0f172a] rounded-full flex items-center justify-center text-slate-700 border border-white/5 shadow-2xl">
                                    <Target className="w-12 h-12" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tight">Intelligence Latent</h2>
                                    <p className="text-slate-500 font-bold max-w-sm uppercase tracking-wider text-xs leading-relaxed">
                                        Select a topic from the mission archives to initiate the RAG synthesis sequence.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="content"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-[#162840] rounded-3xl md:rounded-[48px] p-12 border border-[#1E3A5F] shadow-2xl h-full flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-12">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-4">
                                           <h2 className="text-4xl font-black text-white uppercase tracking-tight">{selectedTopic}</h2>
                                           {youtubeUsed && (
                                              <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
                                                 <Video className="w-3 h-3" />
                                                 Search Grounded
                                              </div>
                                           )}
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">3-Minute Tactical Delivery Structure</p>
                                    </div>
                                    <div className="w-14 h-14 bg-[#0f172a] border border-white/5 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl">
                                        <Cpu className="w-7 h-7" />
                                    </div>
                                </div>

                                {isGenerating ? (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-8">
                                        <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <div className="text-center space-y-2">
                                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] animate-pulse">Synthesis Engine Active</p>
                                           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Gemini 3.1 Pro + RAG Pipeline</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 space-y-12 overflow-y-auto pr-6 custom-scrollbar pb-10">
                                        <div className="bg-[#0f172a] rounded-[40px] p-10 border border-white/5 shadow-inner">
                                            <div className="prose prose-invert max-w-none prose-h2:text-blue-500 prose-h2:uppercase prose-h2:tracking-widest prose-h2:text-sm prose-h2:font-black prose-p:text-slate-300 prose-p:text-lg prose-p:font-bold prose-p:leading-relaxed prose-li:text-slate-400 prose-li:font-bold">
                                                {/* Assuming notes is markdown */}
                                                <ReactMarkdown>{notes || ''}</ReactMarkdown>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-[#162840] border border-[#1E3A5F] rounded-[40px] p-8 flex flex-col items-center gap-6">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-center">Deliver Your Lecturette</p>
                                            
                                            <div className="flex items-center gap-4">
                                                <button onClick={isRecording ? stopRecording : startRecording}
                                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg
                                                        ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' : 'bg-[#0f172a] border border-white/10 text-white hover:bg-slate-800'}`}>
                                                    {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                                </button>
                                                
                                                <button onClick={analyzeSpeech} disabled={!transcript.trim() || isAnalyzing || isRecording}
                                                    className="px-8 h-16 rounded-full bg-blue-600 text-white font-black text-[11px] tracking-widest uppercase hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center gap-2">
                                                    {isAnalyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing</> : 'Analyze Speech'}
                                                </button>
                                            </div>

                                            {(transcript || interimTranscript) && (
                                                <div className="w-full bg-[#0f172a] border border-white/5 p-6 rounded-3xl mt-4">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Live Transcript</p>
                                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                                        {transcript}<span className="text-slate-500">{interimTranscript}</span>
                                                    </p>
                                                </div>
                                            )}

                                            {feedback && (
                                                <div className="w-full bg-blue-900/20 border border-blue-500/30 p-6 rounded-3xl mt-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AI Assessment</span>
                                                        <span className="text-2xl font-black text-emerald-400">{feedback.overallScore || 0}%</span>
                                                    </div>
                                                    <p className="text-sm text-slate-300 italic border-l-2 border-blue-500 pl-4 py-1">"{feedback.feedback}"</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <button onClick={() => generateNotes(selectedTopic)} className="flex-1 py-6 bg-[#0f172a] border border-white/5 hover:border-white/10 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] text-slate-500 transition-all active:scale-95">
                                                Regenerate
                                            </button>
                                            <button 
                                                onClick={markComplete}
                                                disabled={completedTopics.has(selectedTopic)}
                                                className={`flex-[2] py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 ${
                                                    completedTopics.has(selectedTopic) ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
                                                }`}
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                {completedTopics.has(selectedTopic) ? 'Topic Mastered' : 'Execute Completion'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
