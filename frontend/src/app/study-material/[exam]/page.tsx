'use client'

import React, { use, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, BookOpen, ChevronRight, CheckCircle2, Award,
    Target, HelpCircle, Radio, Check, Play, FileText, Download,
    Eye, X, ChevronLeft, Printer, Video, FileCode, Loader2,
    Bookmark, BookmarkCheck, Flame, Clock, Sparkles, Star,
    ChevronDown, Zap, Trophy, Lock, Circle, PanelLeftClose, PanelLeftOpen,
    GraduationCap, Film
} from 'lucide-react'
import Link from 'next/link'
import { useStudyProgress } from '@/lib/useStudyProgress'
import {
    ProgressRing, StreakBadge, TopicCard, ChapterAccordion,
    SubjectSection, KeyTakeaways, QuickQuiz, DailyTargetWidget
} from '@/components/study/StudyComponents'
import { createClient } from '@/lib/supabase/client'
import { getTopic } from '@/lib/study-content'
import { ContentRenderer } from '@/components/study/ContentRenderer'

/* ─── Types ─── */
type ExamKey = 'nda' | 'cds' | 'afcat' | 'ssb'

interface QuickQuizData {
    question: string
    options: string[]
    answer: string
    explanation?: string
}

interface Topic {
    id: string
    chapter_id: string
    title: string
    type: string
    readTime: string
    content: string
    keyTakeaways?: string[]
    quickQuiz?: QuickQuizData
    youtubeUrl?: string
}

interface Chapter {
    id: string
    name: string
    estimatedTime: string
    topics: Topic[]
}

interface Subject {
    id: string
    name: string
    icon: string
    chapters: Chapter[]
}

interface PdfPage {
    page_number: number
    section: string
    content: string
}

interface PdfResource {
    id: string
    filename: string
    title: string
    description: string
    pages: PdfPage[]
}

interface VideoLecture {
    id: string
    title: string
    description: string
    videoId: string
    duration: string
    instructor: string
}

interface ExamData {
    title: string
    category: string
    description: string
    color: string
    subjects: Subject[]
    pdf_vault?: PdfResource[]
    video_vault?: VideoLecture[]
}

/* ─── Helpers ─── */
function getAllTopicIds(data: ExamData): string[] {
    const ids: string[] = []
    for (const s of data.subjects) {
        for (const c of s.chapters) {
            for (const t of c.topics) {
                ids.push(t.id)
            }
        }
    }
    return ids
}

function getSubjectTopicIds(subject: Subject): string[] {
    const ids: string[] = []
    for (const c of subject.chapters) {
        for (const t of c.topics) {
            ids.push(t.id)
        }
    }
    return ids
}

function getChapterTopicIds(chapter: Chapter): string[] {
    return chapter.topics.map(t => t.id)
}

function findTopicById(data: ExamData, topicId: string): Topic | null {
    for (const s of data.subjects) {
        for (const c of s.chapters) {
            for (const t of c.topics) {
                if (t.id === topicId) return t
            }
        }
    }
    return null
}

function findNextTopic(data: ExamData, currentId: string): string | null {
    const allTopics: string[] = getAllTopicIds(data)
    const idx = allTopics.indexOf(currentId)
    if (idx >= 0 && idx < allTopics.length - 1) return allTopics[idx + 1]
    return null
}

function findPrevTopic(data: ExamData, currentId: string): string | null {
    const allTopics: string[] = getAllTopicIds(data)
    const idx = allTopics.indexOf(currentId)
    if (idx > 0) return allTopics[idx - 1]
    return null
}

function extractYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)
    return match ? match[1] : null
}

const accentColors: Record<string, { text: string; bg: string; border: string; ring: string }> = {
    red: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', ring: '#ef4444' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', ring: '#10b981' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', ring: '#f59e0b' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', ring: '#3b82f6' },
}

/* ─── MAIN COMPONENT ─── */
export default function ExamPortalPage({ params }: { params: Promise<{ exam: string }> }) {
    const resolvedParams = use(params)
    const examId = resolvedParams.exam.toLowerCase() as ExamKey
    const supabase = createClient()

    const {
        loaded, progress, markTopicComplete, unmarkTopicComplete,
        toggleBookmark, isCompleted, isBookmarked, getProgressPercent, getCompletedCount
    } = useStudyProgress()

    // State
    const [data, setData] = useState<ExamData | null>(null)
    const [dbLoading, setDbLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'learn' | 'resources' | 'progress'>('learn')
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
    const [expandedSubjects, setExpandedSubjects] = useState<string[]>([])
    const [expandedChapters, setExpandedChapters] = useState<string[]>([])
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [showConfetti, setShowConfetti] = useState(false)

    // PDF / Video modals
    const [activePdf, setActivePdf] = useState<PdfResource | null>(null)
    const [activePdfPage, setActivePdfPage] = useState(0)
    const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null)

    // Fetch from Supabase
    useEffect(() => {
        async function fetchExamData() {
            try {
                // 1. Fetch Exam Meta
                const { data: examMeta } = await supabase.from('study_exams').select('*').eq('id', examId).single()
                if (!examMeta) return

                // 2. Fetch Subjects, Chapters, Topics
                const { data: subjectsData } = await supabase.from('study_subjects').select('*').eq('exam_id', examId).order('order_index')
                const { data: chaptersData } = await supabase.from('study_chapters').select('*, study_subjects!inner(exam_id)').eq('study_subjects.exam_id', examId).order('order_index')
                const { data: topicsData } = await supabase.from('study_topics').select('*, study_chapters!inner(study_subjects!inner(exam_id))').eq('study_chapters.study_subjects.exam_id', examId).order('order_index')

                // 3. Fetch Resources
                const { data: resourcesData } = await supabase.from('study_resources').select('*').eq('exam_id', examId)

                // Assemble Data Structure
                const subjects: Subject[] = (subjectsData || []).map(s => {
                    const sChapters = (chaptersData || []).filter(c => c.subject_id === s.id).map(c => {
                        const cTopics = (topicsData || []).filter(t => t.chapter_id === c.id).map(t => ({
                            id: t.id,
                            chapter_id: t.chapter_id,
                            title: t.title,
                            type: t.type,
                            readTime: t.read_time,
                            content: t.content,
                            keyTakeaways: t.key_takeaways,
                            quickQuiz: t.quick_quiz,
                            youtubeUrl: t.youtube_url
                        }))
                        return {
                            id: c.id,
                            name: c.name,
                            estimatedTime: c.estimated_time,
                            topics: cTopics
                        }
                    })
                    return {
                        id: s.id,
                        name: s.name,
                        icon: s.icon,
                        chapters: sChapters
                    }
                })

                const pdfVault: PdfResource[] = []
                const videoVault: VideoLecture[] = []
                
                if (resourcesData) {
                    resourcesData.forEach(r => {
                        if (r.resource_type === 'pdf') {
                            pdfVault.push({
                                id: r.id,
                                title: r.title,
                                filename: r.url || '',
                                description: r.description || '',
                                pages: r.metadata?.pages || []
                            })
                        } else if (r.resource_type === 'video') {
                            videoVault.push({
                                id: r.id,
                                title: r.title,
                                videoId: r.url || '',
                                description: r.description || '',
                                instructor: r.metadata?.instructor || 'Instructor',
                                duration: r.metadata?.duration || 'Unknown'
                            })
                        }
                    })
                }

                const assembledData: ExamData = {
                    title: examMeta.title,
                    category: examMeta.category,
                    description: examMeta.description,
                    color: examMeta.color,
                    subjects,
                    pdf_vault: pdfVault,
                    video_vault: videoVault
                }
                
                setData(assembledData)

                // Auto-expand first items
                if (assembledData.subjects.length > 0) {
                    const firstSubject = assembledData.subjects[0]
                    setExpandedSubjects([firstSubject.id])
                    if (firstSubject.chapters.length > 0) {
                        const firstChapter = firstSubject.chapters[0]
                        setExpandedChapters([firstChapter.id])
                        if (firstChapter.topics.length > 0) {
                            setSelectedTopicId(firstChapter.topics[0].id)
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching exam data:", error)
            } finally {
                setDbLoading(false)
            }
        }
        fetchExamData()
    }, [examId, supabase])


    const toggleSubject = useCallback((id: string) => {
        setExpandedSubjects(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }, [])

    const toggleChapter = useCallback((id: string) => {
        setExpandedChapters(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }, [])

    const handleMarkComplete = useCallback((topicId: string) => {
        if (isCompleted(topicId)) {
            unmarkTopicComplete(topicId)
        } else {
            markTopicComplete(topicId)
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 2000)
        }
    }, [isCompleted, markTopicComplete, unmarkTopicComplete])

    const handleNextTopic = useCallback(() => {
        if (!selectedTopicId || !data) return
        const next = findNextTopic(data, selectedTopicId)
        if (next) {
            setSelectedTopicId(next)
            // Auto-expand the chapter containing this topic
            for (const s of data.subjects) {
                for (const c of s.chapters) {
                    if (c.topics.some(t => t.id === next)) {
                        if (!expandedSubjects.includes(s.id)) setExpandedSubjects(prev => [...prev, s.id])
                        if (!expandedChapters.includes(c.id)) setExpandedChapters(prev => [...prev, c.id])
                    }
                }
            }
        }
    }, [selectedTopicId, data, expandedSubjects, expandedChapters])

    const handlePrevTopic = useCallback(() => {
        if (!selectedTopicId || !data) return
        const prev = findPrevTopic(data, selectedTopicId)
        if (prev) setSelectedTopicId(prev)
    }, [selectedTopicId, data])


    if (dbLoading || !loaded) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-olive" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Learning Database...</p>
                </div>
            </div>
        )
    }

    if (!data) return <div className="text-center p-10 text-white">Exam not found in database.</div>

    const colors = accentColors[data.color] || accentColors.emerald
    const currentTopic = selectedTopicId ? findTopicById(data, selectedTopicId) : null
    const allTopicIds = getAllTopicIds(data)
    const examPercent = getProgressPercent(allTopicIds)
    const examCompleted = getCompletedCount(allTopicIds)
    const currentIndex = selectedTopicId ? allTopicIds.indexOf(selectedTopicId) : -1
    const currentYoutubeId = currentTopic?.youtubeUrl ? extractYouTubeId(currentTopic.youtubeUrl) : null
    
    // Fetch local rich content if available
    const localTopicData = currentTopic ? getTopic(currentTopic.chapter_id, currentTopic.id) : null;

    /* ────────────────── RENDER ────────────────── */
    return (
        <div className="max-w-[1400px] mx-auto pb-20 px-4 md:px-6">
            {/* ── Header ── */}
            <div className="flex items-center justify-between py-4">
                <Link
                    href="/study-material"
                    className="flex items-center gap-2 text-slate-500 hover:text-olive-light font-black uppercase tracking-widest text-[10px] transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Library
                </Link>
                <div className="flex items-center gap-3">
                    {progress.currentStreak > 0 && <StreakBadge streak={progress.currentStreak} />}
                    <div className="flex items-center gap-2">
                        <ProgressRing percent={examPercent} size={32} strokeWidth={3} color={colors.ring} />
                        <span className="text-[10px] font-black text-slate-400">{examCompleted}/{allTopicIds.length}</span>
                    </div>
                </div>
            </div>

            {/* ── Compact Exam Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 rounded-[28px] p-6 md:p-8 border border-white/[0.06] mb-6 relative overflow-hidden"
            >
                <div className={`absolute top-0 right-0 w-[300px] h-[300px] ${colors.bg} rounded-full blur-[100px] opacity-50`} />
                <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full ${colors.bg} border ${colors.border} text-[9px] font-black ${colors.text} uppercase tracking-widest`}>
                                {data.category}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                            {data.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-slate-500">{data.subjects.length} subjects · {allTopicIds.length} topics</p>
                            <p className={`text-sm font-black ${colors.text}`}>{examPercent}% complete</p>
                        </div>
                        <ProgressRing percent={examPercent} size={64} strokeWidth={5} color={colors.ring} />
                    </div>
                </div>
                {/* Progress bar */}
                <div className="mt-5 w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${examPercent}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: colors.ring }}
                    />
                </div>
            </motion.div>

            {/* ── Tabs ── */}
            <div className="flex items-center gap-1 bg-slate-900/30 p-1 rounded-2xl border border-white/[0.04] mb-6 w-fit">
                {[
                    { key: 'learn' as const, label: 'Learn', icon: GraduationCap },
                    { key: 'resources' as const, label: 'Resources', icon: FileText },
                    { key: 'progress' as const, label: 'Progress', icon: Trophy },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            activeTab === tab.key
                                ? 'bg-olive/20 text-olive-light border border-olive/20'
                                : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ════════════════ TAB: LEARN ════════════════ */}
            {activeTab === 'learn' && (
                <div className="space-y-8">
                    <DailyTargetWidget completedToday={progress.completedTopics.length % 5} targetPerDay={3} />
                    <div className="flex gap-8 relative">
                    {/* ── LEFT: Subject/Chapter Tree Sidebar ── */}
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.aside
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 340, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="shrink-0 overflow-hidden hidden lg:block"
                            >
                                <div className="w-[340px] space-y-3 sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-2">
                                    <div className="flex items-center justify-between px-2 mb-2">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syllabus Tree</h3>
                                        <button
                                            onClick={() => setSidebarOpen(false)}
                                            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <PanelLeftClose className="w-4 h-4 text-slate-500" />
                                        </button>
                                    </div>

                                    {data.subjects.map(subject => {
                                        const subjectTopicIds = getSubjectTopicIds(subject)
                                        const subjectCompleted = getCompletedCount(subjectTopicIds)

                                        return (
                                            <SubjectSection
                                                key={subject.id}
                                                name={subject.name}
                                                icon={subject.icon}
                                                completedCount={subjectCompleted}
                                                totalCount={subjectTopicIds.length}
                                                isExpanded={expandedSubjects.includes(subject.id)}
                                                onToggle={() => toggleSubject(subject.id)}
                                            >
                                                {subject.chapters.map(chapter => {
                                                    const chapterTopicIds = getChapterTopicIds(chapter)
                                                    const chapterCompleted = getCompletedCount(chapterTopicIds)

                                                    return (
                                                        <ChapterAccordion
                                                            key={chapter.id}
                                                            title={chapter.name}
                                                            topicCount={chapterTopicIds.length}
                                                            completedCount={chapterCompleted}
                                                            estimatedTime={chapter.estimatedTime}
                                                            isExpanded={expandedChapters.includes(chapter.id)}
                                                            onToggle={() => toggleChapter(chapter.id)}
                                                        >
                                                            {chapter.topics.map(topic => (
                                                                <TopicCard
                                                                    key={topic.id}
                                                                    title={topic.title}
                                                                    type={topic.type}
                                                                    readTime={topic.readTime}
                                                                    status={
                                                                        isCompleted(topic.id) ? 'completed' :
                                                                        selectedTopicId === topic.id ? 'in-progress' : 'unread'
                                                                    }
                                                                    isActive={selectedTopicId === topic.id}
                                                                    isBookmarked={isBookmarked(topic.id)}
                                                                    onClick={() => setSelectedTopicId(topic.id)}
                                                                />
                                                            ))}
                                                        </ChapterAccordion>
                                                    )
                                                })}
                                            </SubjectSection>
                                        )
                                    })}
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Sidebar toggle (when collapsed) */}
                    {!sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="fixed left-[268px] top-24 z-20 p-2 bg-slate-800 border border-white/10 rounded-lg hover:bg-slate-700 transition-colors hidden lg:block"
                        >
                            <PanelLeftOpen className="w-4 h-4 text-slate-400" />
                        </button>
                    )}

                    {/* ── RIGHT: Content Reader ── */}
                    <div className="flex-1 min-w-0">
                        {currentTopic ? (
                            <motion.div
                                key={currentTopic.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Topic Header */}
                                <div className="bg-slate-900/50 rounded-[24px] p-7 border border-white/[0.06] space-y-4">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
                                                    {currentTopic.type}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {currentTopic.readTime}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-600">
                                                    {currentIndex + 1} of {allTopicIds.length}
                                                </span>
                                            </div>
                                            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                                                {currentTopic.title}
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => toggleBookmark(currentTopic.id)}
                                                className={`p-2.5 rounded-xl border transition-all ${
                                                    isBookmarked(currentTopic.id)
                                                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                        : 'bg-white/[0.03] border-white/[0.06] text-slate-500 hover:text-amber-400'
                                                }`}
                                            >
                                                {isBookmarked(currentTopic.id) ? (
                                                    <BookmarkCheck className="w-4.5 h-4.5" />
                                                ) : (
                                                    <Bookmark className="w-4.5 h-4.5" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleMarkComplete(currentTopic.id)}
                                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                                                    isCompleted(currentTopic.id)
                                                        ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400'
                                                        : 'bg-olive/15 border border-olive/25 text-olive-light hover:bg-olive/25'
                                                }`}
                                            >
                                                {isCompleted(currentTopic.id) ? (
                                                    <><CheckCircle2 className="w-4 h-4" /> Completed</>
                                                ) : (
                                                    <><Check className="w-4 h-4" /> Mark Complete</>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reading Progress */}
                                    <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${isCompleted(currentTopic.id) ? 'bg-emerald-400 w-full' : 'bg-olive w-1/3'} transition-all duration-500`} />
                                    </div>
                                </div>

                                {/* YouTube Video Embed (If AI generated from YouTube) */}
                                {currentYoutubeId && (
                                    <div className="bg-slate-900/40 rounded-[24px] border border-white/[0.06] overflow-hidden">
                                        <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                                            <Film className="w-4 h-4 text-red-500" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Video Lesson</span>
                                        </div>
                                        <div className="aspect-video w-full bg-black">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${currentYoutubeId}`}
                                                className="w-full h-full border-none"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Key Takeaways */}
                                {(localTopicData?.keyPoints || (currentTopic.keyTakeaways && currentTopic.keyTakeaways.length > 0)) && (
                                    <KeyTakeaways items={localTopicData?.keyPoints || currentTopic.keyTakeaways || []} />
                                )}

                                {/* Main Content */}
                                <div className="bg-slate-900/40 rounded-[32px] p-8 md:p-12 border border-white/[0.06] shadow-2xl">
                                    {localTopicData ? (
                                        <ContentRenderer blocks={localTopicData.content} />
                                    ) : examId === 'ssb' ? (
                                        <div className="bg-slate-800 border border-amber-500/30 rounded-xl p-6 text-center">
                                            <div className="text-amber-400 text-2xl mb-2">🚧</div>
                                            <p className="text-slate-300 font-semibold">Content Under Development</p>
                                            <p className="text-slate-500 text-sm mt-1">SSB module content will be available soon. Practice the tests directly!</p>
                                            <Link href="/mansa/tat" className="mt-4 inline-block bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm">
                                                Start TAT Practice →
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="text-slate-200 text-[16px] md:text-[18px] leading-[2.2] tracking-wide font-normal whitespace-pre-line">
                                            {currentTopic.content || "Content Under Development"}
                                        </div>
                                    )}
                                </div>

                                {/* Quick Quizzes */}
                                {localTopicData?.inlineQuiz ? (
                                    <div className="space-y-4">
                                        {localTopicData.inlineQuiz.map((quiz, idx) => (
                                            <QuickQuiz
                                                key={idx}
                                                question={quiz.question}
                                                options={quiz.options}
                                                answer={quiz.options[quiz.correct]}
                                                explanation={quiz.explanation}
                                            />
                                        ))}
                                    </div>
                                ) : currentTopic.quickQuiz && (
                                    <QuickQuiz
                                        question={currentTopic.quickQuiz.question}
                                        options={currentTopic.quickQuiz.options}
                                        answer={currentTopic.quickQuiz.answer}
                                        explanation={currentTopic.quickQuiz.explanation}
                                    />
                                )}

                                {/* Navigation Footer */}
                                <div className="flex items-center justify-between bg-slate-900/30 rounded-2xl p-4 border border-white/[0.04]">
                                    <button
                                        onClick={handlePrevTopic}
                                        disabled={currentIndex <= 0}
                                        className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] disabled:opacity-30 transition-all flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                                    </button>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                        {currentIndex + 1} / {allTopicIds.length}
                                    </span>
                                    <button
                                        onClick={handleNextTopic}
                                        disabled={currentIndex >= allTopicIds.length - 1}
                                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                                            isCompleted(currentTopic.id)
                                                ? 'bg-olive/20 text-olive-light border border-olive/25 hover:bg-olive/30'
                                                : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06]'
                                        } disabled:opacity-30`}
                                    >
                                        Next <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Confetti effect */}
                                <AnimatePresence>
                                    {showConfetti && (
                                        <motion.div
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 0 }}
                                            transition={{ duration: 2 }}
                                            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
                                        >
                                            <motion.div
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1.2, opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-3xl px-8 py-5 flex items-center gap-3"
                                            >
                                                <Trophy className="w-8 h-8 text-amber-400" />
                                                <div>
                                                    <p className="text-lg font-black text-white">Topic Complete!</p>
                                                    <p className="text-xs text-emerald-300 font-bold">Keep the momentum going 🔥</p>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="flex items-center justify-center min-h-[400px] bg-slate-900/20 rounded-3xl border border-white/[0.04]">
                                <div className="text-center space-y-3">
                                    <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                                    <p className="text-sm font-bold text-slate-500">Select a topic from the sidebar to start learning</p>
                                </div>
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            )}

            {/* ════════════════ TAB: RESOURCES ════════════════ */}
            {activeTab === 'resources' && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 max-w-5xl"
                >
                    {/* PDF Vault */}
                    {data.pdf_vault && data.pdf_vault.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <FileText className="w-4 h-4" /> Document Vault
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {data.pdf_vault.map((pdf, idx) => (
                                    <motion.div
                                        key={pdf.id}
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-slate-900/40 rounded-[24px] border border-white/[0.06] p-6 space-y-4 hover:border-olive/20 transition-all"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-olive/10 border border-olive/15 flex items-center justify-center text-olive-light shrink-0">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <h4 className="font-bold text-white text-sm leading-snug">{pdf.title}</h4>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                                                    {pdf.filename} · {pdf.pages.length} pages
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{pdf.description}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setActivePdf(pdf); setActivePdfPage(0); }}
                                                className="flex-1 py-2.5 bg-olive/10 hover:bg-olive/20 text-olive-light border border-olive/15 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> View
                                            </button>
                                            <button
                                                onClick={() => { setActivePdf(pdf); setActivePdfPage(0); setTimeout(() => window.print(), 300); }}
                                                className="flex-1 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border border-white/[0.06] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                            >
                                                <Printer className="w-3.5 h-3.5" /> Print
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Video Vault */}
                    {data.video_vault && data.video_vault.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Film className="w-4 h-4" /> Video Lectures
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {data.video_vault.map((vid, idx) => (
                                    <motion.div
                                        key={vid.id}
                                        initial={{ opacity: 0, scale: 0.97 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-slate-900/40 rounded-[24px] border border-white/[0.06] overflow-hidden group hover:border-red-500/20 transition-all"
                                    >
                                        {/* Thumbnail */}
                                        <div
                                            onClick={() => setActiveVideo(vid)}
                                            className="relative aspect-[16/9] w-full bg-slate-950 flex items-center justify-center cursor-pointer overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent z-10" />
                                            <div className="absolute inset-0 bg-gradient-to-br from-olive/10 to-red-600/10 group-hover:scale-105 transition-transform duration-700" />
                                            <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded z-20 backdrop-blur-sm">
                                                {vid.instructor}
                                            </span>
                                            <span className="absolute bottom-3 right-3 bg-slate-950/90 text-white text-[9px] font-bold px-2 py-0.5 rounded z-20">
                                                {vid.duration}
                                            </span>
                                            <div className="relative w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-all duration-300 z-20">
                                                <Play className="w-6 h-6 fill-white translate-x-0.5" />
                                            </div>
                                        </div>
                                        <div className="p-5 space-y-2">
                                            <h4 className="font-bold text-white text-sm leading-snug group-hover:text-red-400 transition-colors">{vid.title}</h4>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{vid.description}</p>
                                        </div>
                                        <div className="px-5 pb-5 flex gap-2">
                                            <button
                                                onClick={() => setActiveVideo(vid)}
                                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                            >
                                                <Play className="w-3.5 h-3.5 fill-white" /> Watch
                                            </button>
                                            <a
                                                href={`https://www.youtube.com/watch?v=${vid.videoId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="py-2.5 px-4 bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 border border-white/[0.06] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center"
                                            >
                                                YouTube
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(!data.pdf_vault || data.pdf_vault.length === 0) && (!data.video_vault || data.video_vault.length === 0) && (
                        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-white/[0.04]">
                            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-500">No resources loaded for this exam yet.</p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ════════════════ TAB: PROGRESS ════════════════ */}
            {activeTab === 'progress' && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 max-w-4xl"
                >
                    {/* Overall Stats */}
                    <div className="bg-slate-900/40 rounded-[28px] border border-white/[0.06] p-8 space-y-6">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Exam Overview</h3>
                        <div className="flex items-center gap-8 flex-wrap">
                            <ProgressRing percent={examPercent} size={100} strokeWidth={7} color={colors.ring} />
                            <div className="space-y-2">
                                <p className="text-3xl font-black text-white">{examPercent}%</p>
                                <p className="text-sm font-bold text-slate-400">{examCompleted} of {allTopicIds.length} topics completed</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Flame className="w-4 h-4 text-orange-400" />
                                        <span className="text-xs font-bold text-slate-400">{progress.currentStreak} day streak</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                                        <span className="text-xs font-bold text-slate-400">{progress.bookmarkedTopics.length} bookmarked</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Per-Subject Progress */}
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Subject Breakdown</h3>
                        {data.subjects.map(subject => {
                            const subjectTopicIds = getSubjectTopicIds(subject)
                            const subjectCompleted = getCompletedCount(subjectTopicIds)
                            const subjectPercent = getProgressPercent(subjectTopicIds)

                            return (
                                <div key={subject.id} className="bg-slate-900/30 rounded-2xl border border-white/[0.04] p-5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{subject.name}</h4>
                                        <span className={`text-sm font-black ${subjectPercent === 100 ? 'text-emerald-400' : colors.text}`}>
                                            {subjectPercent}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${subjectPercent === 100 ? 'bg-emerald-400' : ''}`}
                                            style={{ width: `${subjectPercent}%`, backgroundColor: subjectPercent === 100 ? undefined : colors.ring }}
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500">{subjectCompleted}/{subjectTopicIds.length} topics</p>

                                    {/* Chapter breakdown */}
                                    <div className="space-y-2 pl-4 border-l border-white/[0.04]">
                                        {subject.chapters.map(chapter => {
                                            const chTopicIds = getChapterTopicIds(chapter)
                                            const chCompleted = getCompletedCount(chTopicIds)
                                            const chPercent = getProgressPercent(chTopicIds)

                                            return (
                                                <div key={chapter.id} className="flex items-center justify-between py-1">
                                                    <div className="flex items-center gap-2">
                                                        {chPercent === 100 ? (
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                        ) : (
                                                            <Circle className="w-3.5 h-3.5 text-slate-600" />
                                                        )}
                                                        <span className={`text-xs font-bold ${chPercent === 100 ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
                                                            {chapter.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-500">{chCompleted}/{chTopicIds.length}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Bookmarked Topics */}
                    {progress.bookmarkedTopics.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black text-amber-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                <BookmarkCheck className="w-4 h-4" /> Bookmarked for Revision
                            </h3>
                            <div className="space-y-2">
                                {progress.bookmarkedTopics.map(topicId => {
                                    const topic = findTopicById(data, topicId)
                                    if (!topic) return null
                                    return (
                                        <button
                                            key={topicId}
                                            onClick={() => { setActiveTab('learn'); setSelectedTopicId(topicId); }}
                                            className="w-full text-left bg-slate-900/30 rounded-xl border border-amber-500/10 p-4 hover:border-amber-500/20 transition-all flex items-center justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <BookmarkCheck className="w-4 h-4 text-amber-400 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-bold text-white">{topic.title}</p>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{topic.type} · {topic.readTime}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-500" />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ════════════ PDF READER MODAL ════════════ */}
            <AnimatePresence>
                {activePdf && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 overflow-y-auto p-4 md:p-8 flex flex-col items-center"
                    >
                        <div className="w-full max-w-3xl flex justify-between items-center mb-6">
                            <div>
                                <span className="text-[9px] font-black bg-olive/20 text-olive-light px-3 py-1 rounded uppercase tracking-widest">Document Reader</span>
                                <h4 className="font-bold text-white text-lg mt-1">{activePdf.title}</h4>
                            </div>
                            <button onClick={() => setActivePdf(null)} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="active-pdf-page w-full max-w-3xl bg-slate-900/80 border border-white/[0.06] rounded-2xl p-8 md:p-10 space-y-6 min-h-[500px]">
                            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                                <span className="text-[10px] font-black text-olive-light uppercase tracking-widest">
                                    {activePdf.pages[activePdfPage]?.section}
                                </span>
                                <span className="text-[9px] font-bold text-slate-500">
                                    Page {activePdfPage + 1} of {activePdf.pages.length}
                                </span>
                            </div>
                            <div className="text-slate-300 text-sm leading-relaxed font-medium whitespace-pre-line font-mono">
                                {activePdf.pages[activePdfPage]?.content}
                            </div>
                        </div>

                        {activePdf.pages.length > 1 && (
                            <div className="mt-4 flex items-center gap-4 bg-slate-900/60 rounded-xl border border-white/[0.06] px-5 py-3">
                                <button
                                    onClick={() => setActivePdfPage(p => Math.max(0, p - 1))}
                                    disabled={activePdfPage === 0}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-all text-white"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-black text-slate-400">
                                    {activePdfPage + 1} / {activePdf.pages.length}
                                </span>
                                <button
                                    onClick={() => setActivePdfPage(p => Math.min(activePdf.pages.length - 1, p + 1))}
                                    disabled={activePdfPage === activePdf.pages.length - 1}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-all text-white"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ════════════ VIDEO PLAYER MODAL ════════════ */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center gap-6"
                    >
                        <div className="w-full max-w-4xl flex justify-between items-center text-white">
                            <div>
                                <span className="text-[9px] font-black bg-red-600 px-3 py-1 rounded text-white tracking-widest uppercase">Video Player</span>
                                <h4 className="font-bold text-lg mt-1">{activeVideo.title}</h4>
                            </div>
                            <button onClick={() => setActiveVideo(null)} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="w-full max-w-4xl aspect-[16/9] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
                            <iframe
                                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                                title={activeVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full border-none"
                            />
                        </div>
                        <div className="w-full max-w-4xl flex items-center justify-between text-white/60 text-xs">
                            <span>Instructor: <strong>{activeVideo.instructor}</strong></span>
                            <a
                                href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                            >
                                Open YouTube
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
