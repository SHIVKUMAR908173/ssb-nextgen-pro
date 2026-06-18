'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Clock, FileText, LayoutList, MessageSquare, ShieldAlert, Sparkles, Target, Zap } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { STUDY_CATEGORIES } from '@/data/study_architecture'
import ReactMarkdown from 'react-markdown'

// Mock Data Fetcher for Chapter Content
const getChapterContent = (chapterId: string) => {
    // This would normally fetch from Supabase or MDX files
    return `
# Tactical Briefing: Core Concepts

Welcome to this intelligence briefing. Your objective is to internalize these concepts for rapid recall during assessment.

## 1. Primary Objectives
- Understand the foundational rules
- Apply logic to dynamic scenarios
- Maintain structural integrity of thought

> [!IMPORTANT]
> The Board President looks for clarity of thought over complex vocabulary. Keep it simple and effective.

## 2. Core Frameworks
When presented with a situation, follow this protocol:
1. **Analyze**: Identify the root cause
2. **Prioritize**: Life > Property > Time
3. **Execute**: Name the specific action
4. **Conclude**: State the final outcome

### Example Scenario
*Situation*: You see a man drowning.
*Action*: Jump in, pull him out, give CPR if needed, and call an ambulance.

---

### Flashcard Review
- **OIR**: Officer Intelligence Rating
- **TAT**: Thematic Apperception Test
- **WAT**: Word Association Test

*Mastery of these concepts is non-negotiable for Stage 1 clearance.*
    `
}

export default function PragyaReaderPage() {
    const params = useParams()
    const router = useRouter()
    const chapterId = params.chapter as string

    // Find chapter metadata
    let chapterMeta: any = null
    let moduleMeta: any = null
    let categoryMeta: any = null

    for (const cat of STUDY_CATEGORIES) {
        for (const mod of cat.modules) {
            const chap = mod.chapters.find(c => c.id === chapterId)
            if (chap) {
                chapterMeta = chap
                moduleMeta = mod
                categoryMeta = cat
                break
            }
        }
        if (chapterMeta) break
    }

    const [content, setContent] = useState('')
    const [progress, setProgress] = useState(0)
    const [isCompleted, setIsCompleted] = useState(false)

    useEffect(() => {
        if (!chapterMeta) return
        // Fetch content
        setContent(getChapterContent(chapterId))
        
        // Track scroll progress
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight
            const currentProgress = (window.scrollY / totalHeight) * 100
            setProgress(Math.min(100, Math.max(0, currentProgress)))
            if (currentProgress > 95) setIsCompleted(true)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [chapterId, chapterMeta])

    if (!chapterMeta) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <ShieldAlert className="w-16 h-16 text-slate-600" />
                <h1 className="text-3xl font-black text-white uppercase">Intelligence File Not Found</h1>
                <Link href="/pragya" className="text-indigo-400 font-bold hover:underline">Return to Hub</Link>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen pb-32">
            
            {/* Progress Bar (Fixed Top) */}
            <div className="fixed top-0 left-0 w-full h-1 bg-[#0f172a] z-50">
                <div 
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="max-w-4xl mx-auto space-y-12 pt-8 px-4 md:px-0">
                
                {/* Header Navigation */}
                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500 mb-8">
                    <Link href="/pragya" className="hover:text-white transition-colors">Pragya Hub</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-400">{categoryMeta.title}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-indigo-400">{moduleMeta.title}</span>
                </div>

                {/* Chapter Hero */}
                <div className="space-y-6 border-b border-white/5 pb-12">
                    <div className="flex items-center gap-3">
                        <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                            {chapterMeta.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                            ${chapterMeta.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              chapterMeta.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                              'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            {chapterMeta.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 text-[9px] font-black uppercase tracking-widest ml-auto">
                            <Clock className="w-3 h-3" /> {chapterMeta.readTime} MIN READ
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
                        {chapterMeta.title}
                    </h1>
                    <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl">
                        {chapterMeta.description}
                    </p>
                </div>

                {/* Markdown Content */}
                <div className="prose prose-invert prose-indigo max-w-none prose-headings:uppercase prose-headings:tracking-tight prose-headings:font-black prose-h1:text-4xl prose-h2:text-2xl prose-p:font-medium prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-indigo-400 prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-500/5 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-bold prose-strong:text-white pb-20">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>

            </div>

            {/* Completion Toolbar (Fixed Bottom) */}
            <AnimatePresence>
                {isCompleted && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="fixed bottom-0 left-0 w-full bg-[#0f172a]/90 backdrop-blur-xl border-t border-white/5 py-4 z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="max-w-4xl mx-auto px-4 md:px-0 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase tracking-tight">Intelligence Acquired</h4>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">+50 XP • Topic Completed</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 w-full md:w-auto">
                                <Link href="/pragya" className="flex-1 md:flex-none px-6 py-3 bg-[#162840] hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all text-center">
                                    Return to Hub
                                </Link>
                                <button onClick={() => router.push('/pragya')} className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-xl shadow-indigo-500/20 text-center flex items-center justify-center gap-2">
                                    Next Module <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
