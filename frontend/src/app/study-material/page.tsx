'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Shield, Sword, Plane, Target, Flame, Clock, TrendingUp, Sparkles, ChevronRight, Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useStudyProgress } from '@/lib/useStudyProgress'
import { ProgressRing, StreakBadge, DailyTargetWidget } from '@/components/study/StudyComponents'
import { createClient } from '@/lib/supabase/client'

// Types for Supabase Data
interface DbExam {
    id: string
    title: string
    category: string
    description: string
    color: string
}

interface DbTopic {
    id: string
}

const EXAM_CARDS = [
    { id: 'ssb', label: 'SSB Interview', icon: Target },
    { id: 'nda', label: 'NDA', icon: Shield },
    { id: 'cds', label: 'CDS', icon: Sword },
    { id: 'afcat', label: 'AFCAT', icon: Plane },
]

const colorMap: Record<string, { gradient: string; border: string; text: string; ring: string; glow: string; bg: string }> = {
    red: { gradient: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20', text: 'text-red-400', ring: '#ef4444', glow: 'shadow-red-500/10', bg: 'bg-red-500/10' },
    emerald: { gradient: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20', text: 'text-emerald-400', ring: '#10b981', glow: 'shadow-emerald-500/10', bg: 'bg-emerald-500/10' },
    amber: { gradient: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20', text: 'text-amber-400', ring: '#f59e0b', glow: 'shadow-amber-500/10', bg: 'bg-amber-500/10' },
    blue: { gradient: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400', ring: '#3b82f6', glow: 'shadow-blue-500/10', bg: 'bg-blue-500/10' },
}

export default function StudyMaterialPage() {
    const { progress, loaded, getProgressPercent, getCompletedCount } = useStudyProgress()
    const supabase = createClient()

    const [exams, setExams] = useState<DbExam[]>([])
    const [examTopicMap, setExamTopicMap] = useState<Record<string, string[]>>({})
    const [dbLoading, setDbLoading] = useState(true)

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                // 1. Fetch Exams
                const { data: examsData } = await supabase.from('study_exams').select('*')
                if (examsData) setExams(examsData)

                // 2. Fetch Topics count per exam to calculate stats
                // In a real large-scale app, you'd want a view or aggregation for this.
                // For now, we do a join: exams -> subjects -> chapters -> topics
                const { data: topicsData } = await supabase
                    .from('study_topics')
                    .select('id, chapter_id, study_chapters(subject_id, study_subjects(exam_id))')

                const topicMap: Record<string, string[]> = {}
                if (topicsData) {
                    topicsData.forEach((t: any) => {
                        const examId = t.study_chapters?.study_subjects?.exam_id
                        if (examId) {
                            if (!topicMap[examId]) topicMap[examId] = []
                            topicMap[examId].push(t.id)
                        }
                    })
                }
                setExamTopicMap(topicMap)
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setDbLoading(false)
            }
        }
        fetchDashboardData()
    }, [supabase])

    if (dbLoading || !loaded) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-olive" />
            </div>
        )
    }

    // Calculate stats
    let totalTopics = 0
    let totalCompleted = 0
    const examStats: Record<string, { total: number; completed: number; percent: number }> = {}

    for (const exam of exams) {
        const topicIds = examTopicMap[exam.id] || []
        const completed = getCompletedCount(topicIds)
        const percent = getProgressPercent(topicIds)
        examStats[exam.id] = { total: topicIds.length, completed, percent }
        totalTopics += topicIds.length
        totalCompleted += completed
    }

    const overallPercent = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-slate-500 hover:text-olive-light font-black uppercase tracking-widest text-[10px] transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    {progress.currentStreak > 0 && (
                        <StreakBadge streak={progress.currentStreak} />
                    )}
                    <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Library Active (Live Data)</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[32px] overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-olive/15 via-slate-900/80 to-slate-950" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-olive/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px]" />

                <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="space-y-5 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="bg-olive/15 border border-olive/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-olive-light" />
                                <span className="text-[10px] font-black text-olive-light uppercase tracking-[0.2em]">Learning Journey</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                            Study <span className="text-olive-light">Material</span>
                        </h1>
                        <p className="text-slate-400 max-w-xl text-sm md:text-base font-semibold leading-relaxed">
                            Structured, bite-sized study modules mapped to official UPSC syllabus. Track your progress, build streaks, and master every topic.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <ProgressRing
                            percent={overallPercent}
                            size={100}
                            strokeWidth={7}
                            color="#527256"
                        />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall</p>
                            <p className="text-xs font-bold text-slate-500">{totalCompleted}/{totalTopics} topics</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: BookOpen, label: 'Total Topics', value: `${totalTopics}`, sub: 'Across all exams' },
                    { icon: TrendingUp, label: 'Completed', value: `${totalCompleted}`, sub: `${overallPercent}% done` },
                    { icon: Flame, label: 'Current Streak', value: `${progress.currentStreak}`, sub: 'Days active' },
                    { icon: Clock, label: 'Study Time', value: `${Math.round(progress.totalStudyTimeMinutes)}m`, sub: 'Total invested' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-slate-900/40 border border-white/[0.06] rounded-2xl p-5 space-y-3"
                    >
                        <stat.icon className="w-5 h-5 text-olive-light" />
                        <div>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Daily Target */}
            <DailyTargetWidget completedToday={progress.completedTopics.length % 5} targetPerDay={3} />

            {/* Exam Cards Grid */}
            <div className="space-y-5">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Select Your Exam</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exams.map((exam, i) => {
                        const stats = examStats[exam.id] || { total: 0, completed: 0, percent: 0 }
                        const colors = colorMap[exam.color] || colorMap.emerald
                        const cardIcon = EXAM_CARDS.find(c => c.id === exam.id)?.icon || BookOpen

                        return (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <Link href={`/study-material/${exam.id}`} className="block group">
                                    <div className={`bg-slate-900/50 border border-white/[0.06] rounded-[28px] p-8 transition-all duration-500 hover:border-olive/25 hover:shadow-2xl ${colors.glow} hover:-translate-y-1.5 relative overflow-hidden`}>
                                        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${colors.gradient} rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                        <div className="relative z-10 flex items-start justify-between gap-4">
                                            <div className="space-y-5 flex-1 min-w-0">
                                                <div className={`w-14 h-14 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                                                    {React.createElement(cardIcon, { className: `w-7 h-7 ${colors.text}` })}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{exam.title}</h2>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed line-clamp-2">
                                                        {exam.description}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${stats.percent}%` }}
                                                            transition={{ duration: 1, delay: i * 0.1 }}
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: colors.ring }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-bold text-slate-500">
                                                            {stats.completed}/{stats.total} topics
                                                        </span>
                                                        <span className={`text-[10px] font-black ${colors.text}`}>
                                                            {stats.percent}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <ProgressRing
                                                percent={stats.percent}
                                                size={56}
                                                strokeWidth={4}
                                                color={colors.ring}
                                            />
                                        </div>

                                        <div className="mt-6 pt-5 border-t border-white/[0.04]">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text} flex items-center gap-1.5 group-hover:gap-3 transition-all`}>
                                                {stats.percent > 0 ? (
                                                    <><Zap className="w-3.5 h-3.5" /> Continue Learning</>
                                                ) : (
                                                    <><BookOpen className="w-3.5 h-3.5" /> Start Learning</>
                                                )}
                                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Footer */}
            <p className="text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pt-6">
                SuperKalam Integrated · Live Database Powered
            </p>
        </div>
    )
}
