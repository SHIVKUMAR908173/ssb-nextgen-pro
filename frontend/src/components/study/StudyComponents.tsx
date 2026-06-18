'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
  Flame,
  Target,
  Zap,
  Trophy,
  XCircle,
  Sparkles,
  Star,
  FileText,
  Play,
  Lock,
} from 'lucide-react'

/* ───────────────────────── PROGRESS RING ───────────────────────── */
export function ProgressRing({
  percent,
  size = 64,
  strokeWidth = 5,
  className = '',
  showLabel = true,
  color,
}: {
  percent: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const accentColor = color || (percent === 100 ? '#10b981' : '#527256')

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <span className="absolute text-[10px] font-black text-white/80">
          {percent}%
        </span>
      )}
    </div>
  )
}

/* ───────────────────────── STREAK BADGE ───────────────────────── */
export function StreakBadge({ streak, className = '' }: { streak: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 bg-gradient-to-r from-orange-500/15 to-red-500/15 border border-orange-500/20 px-3 py-1.5 rounded-full ${className}`}>
      <Flame className="w-3.5 h-3.5 text-orange-400" />
      <span className="text-[10px] font-black text-orange-300 uppercase tracking-widest">
        {streak} Day{streak !== 1 ? 's' : ''} Streak
      </span>
    </div>
  )
}

/* ───────────────────────── TOPIC STATUS ICON ───────────────────────── */
export function TopicStatusIcon({ status }: { status: 'completed' | 'in-progress' | 'locked' | 'unread' }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
    case 'in-progress':
      return (
        <div className="w-4.5 h-4.5 rounded-full border-2 border-amber-400 flex items-center justify-center shrink-0">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
        </div>
      )
    case 'locked':
      return <Lock className="w-4 h-4 text-slate-600 shrink-0" />
    default:
      return <Circle className="w-4.5 h-4.5 text-slate-600 shrink-0" />
  }
}

/* ───────────────────────── TOPIC CARD ───────────────────────── */
export function TopicCard({
  title,
  type,
  readTime,
  status,
  isActive,
  onClick,
  isBookmarked,
}: {
  title: string
  type: string
  readTime: string
  status: 'completed' | 'in-progress' | 'locked' | 'unread'
  isActive: boolean
  onClick: () => void
  isBookmarked?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={status === 'locked'}
      className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all duration-300 group relative ${
        isActive
          ? 'bg-olive/15 border-olive/40 shadow-lg shadow-olive/5'
          : status === 'locked'
          ? 'bg-slate-900/30 border-slate-800/50 opacity-50 cursor-not-allowed'
          : 'bg-slate-900/30 border-white/5 hover:border-olive/20 hover:bg-slate-800/40'
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-3 bottom-3 w-1 bg-olive rounded-r-full" />
      )}
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <TopicStatusIcon status={status} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h4 className={`text-sm font-bold leading-snug truncate ${
            isActive ? 'text-white' : status === 'completed' ? 'text-slate-400 line-through decoration-olive/30' : 'text-slate-300'
          }`}>
            {title}
          </h4>
          <div className="flex items-center gap-2">
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
              isActive ? 'bg-olive/20 text-olive-light' : 'bg-white/5 text-slate-500'
            }`}>
              {type}
            </span>
            <span className="text-[9px] text-slate-500 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" /> {readTime}
            </span>
          </div>
        </div>
        {isBookmarked && (
          <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-1" />
        )}
      </div>
    </button>
  )
}

/* ───────────────────────── CHAPTER ACCORDION ───────────────────────── */
export function ChapterAccordion({
  title,
  topicCount,
  completedCount,
  estimatedTime,
  isExpanded,
  onToggle,
  children,
}: {
  title: string
  topicCount: number
  completedCount: number
  estimatedTime: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const percent = topicCount > 0 ? Math.round((completedCount / topicCount) * 100) : 0

  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
          isExpanded ? 'bg-white/[0.04] border border-white/[0.06]' : 'hover:bg-white/[0.03]'
        }`}
      >
        <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-xs font-black text-white uppercase tracking-wide truncate">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] text-slate-500 font-bold">
              {completedCount}/{topicCount} topics
            </span>
            <span className="text-[9px] text-slate-600">·</span>
            <span className="text-[9px] text-slate-500 font-bold">{estimatedTime}</span>
          </div>
        </div>
        {/* Mini progress bar */}
        <div className="w-16 shrink-0">
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percent === 100 ? 'bg-emerald-400' : 'bg-olive'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className={`text-[8px] font-black mt-0.5 block text-right ${
            percent === 100 ? 'text-emerald-400' : 'text-slate-500'
          }`}>
            {percent}%
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-6 space-y-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────────────── SUBJECT SECTION ───────────────────────── */
export function SubjectSection({
  name,
  icon: IconName,
  completedCount,
  totalCount,
  isExpanded,
  onToggle,
  children,
}: {
  name: string
  icon: string
  completedCount: number
  totalCount: number
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const IconComp = iconMap[IconName] || BookOpen

  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 border ${
          isExpanded
            ? 'bg-olive/10 border-olive/20'
            : 'bg-white/[0.02] border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]'
        }`}
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isExpanded ? 'bg-olive/20' : 'bg-white/5'
        }`}>
          <IconComp className={`w-4.5 h-4.5 ${isExpanded ? 'text-olive-light' : 'text-slate-400'}`} />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h2 className={`text-[11px] font-black uppercase tracking-widest truncate ${
            isExpanded ? 'text-olive-light' : 'text-slate-300'
          }`}>
            {name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percent === 100 ? 'bg-emerald-400' : 'bg-olive'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-slate-500">{percent}%</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden pl-2 space-y-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────────────── KEY TAKEAWAYS ───────────────────────── */
export function KeyTakeaways({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div className="bg-gradient-to-br from-olive/10 to-olive/5 border border-olive/15 rounded-2xl p-5 space-y-3">
      <h4 className="text-[10px] font-black text-olive-light uppercase tracking-widest flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5" /> Key Takeaways
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 font-medium leading-relaxed">
            <Star className="w-3.5 h-3.5 text-olive-light mt-1 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ───────────────────────── QUICK QUIZ ───────────────────────── */
export function QuickQuiz({
  question,
  options,
  answer,
  explanation,
}: {
  question: string
  options: string[]
  answer: string
  explanation?: string
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSelect = (opt: string) => {
    if (showResult) return
    setSelected(opt)
    setShowResult(true)
  }

  const isCorrect = selected === answer

  return (
    <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        <h4 className="text-[10px] font-black text-amber-300 uppercase tracking-widest">Quick Check</h4>
      </div>
      <p className="text-sm font-bold text-white leading-relaxed">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          const isThisCorrect = opt === answer
          const isThisSelected = opt === selected

          let style = 'bg-white/[0.03] border-white/[0.06] text-slate-300 hover:border-olive/30 hover:bg-white/[0.05]'
          if (showResult) {
            if (isThisCorrect) {
              style = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            } else if (isThisSelected) {
              style = 'bg-red-500/10 border-red-500/30 text-red-300'
            } else {
              style = 'bg-white/[0.02] border-white/[0.04] text-slate-500 opacity-50'
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={showResult}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between gap-3 ${style}`}
            >
              <span>{opt}</span>
              {showResult && isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {showResult && isThisSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {showResult && explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <div className={`p-4 rounded-xl border ${
              isCorrect
                ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-200'
                : 'bg-red-500/5 border-red-500/15 text-red-200'
            }`}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">
                {isCorrect ? '✓ Correct!' : '✗ Not quite'}
              </p>
              <p className="text-xs font-medium leading-relaxed opacity-80">{explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────────────── DAILY TARGET WIDGET ───────────────────────── */
export function DailyTargetWidget({
  completedToday,
  targetPerDay = 3,
}: {
  completedToday: number
  targetPerDay?: number
}) {
  const percent = Math.min(100, Math.round((completedToday / targetPerDay) * 100))
  const isComplete = completedToday >= targetPerDay

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${
      isComplete
        ? 'bg-emerald-500/5 border-emerald-500/20'
        : 'bg-white/[0.02] border-white/[0.06]'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className={`w-4 h-4 ${isComplete ? 'text-emerald-400' : 'text-olive-light'}`} />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Today&apos;s Goal</span>
        </div>
        {isComplete && <Trophy className="w-4 h-4 text-amber-400" />}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isComplete ? 'bg-emerald-400' : 'bg-olive'
            }`}
          />
        </div>
        <span className={`text-xs font-black ${isComplete ? 'text-emerald-400' : 'text-slate-400'}`}>
          {completedToday}/{targetPerDay}
        </span>
      </div>
      <p className="text-[9px] font-bold text-slate-500">
        {isComplete
          ? '🎉 Target achieved! Keep the momentum going.'
          : `Complete ${targetPerDay - completedToday} more topic${targetPerDay - completedToday !== 1 ? 's' : ''} to hit your daily goal.`
        }
      </p>
    </div>
  )
}

/* ───────────────────────── EXAM PROGRESS CARD ───────────────────────── */
export function ExamProgressCard({
  label,
  subtitle,
  icon: Icon,
  percent,
  topicCount,
  completedCount,
  href,
  accentColor = 'olive',
}: {
  label: string
  subtitle: string
  icon: React.ElementType
  percent: number
  topicCount: number
  completedCount: number
  href: string
  accentColor?: string
}) {
  const colorMap: Record<string, { bg: string; border: string; text: string; ring: string }> = {
    olive: { bg: 'bg-olive/10', border: 'border-olive/20', text: 'text-olive-light', ring: '#527256' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', ring: '#ef4444' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', ring: '#10b981' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', ring: '#f59e0b' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', ring: '#3b82f6' },
  }
  const colors = colorMap[accentColor] || colorMap.olive

  return (
    <a href={href} className="block group">
      <div className={`bg-slate-900/60 border border-white/[0.06] rounded-[28px] p-7 transition-all duration-500 hover:border-olive/25 hover:shadow-xl hover:shadow-olive/5 hover:-translate-y-1 relative overflow-hidden`}>
        {/* Subtle glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-4 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{label}</h2>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed line-clamp-2">
                {subtitle}
              </p>
            </div>
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${percent}%`, backgroundColor: colors.ring }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500">
                  {completedCount}/{topicCount} topics
                </span>
                <span className={`text-[9px] font-black ${colors.text}`}>
                  {percent}%
                </span>
              </div>
            </div>
          </div>

          <ProgressRing percent={percent} size={52} strokeWidth={4} color={colors.ring} />
        </div>

        {/* CTA */}
        <div className="mt-5 pt-4 border-t border-white/[0.04]">
          <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text} flex items-center gap-1.5 group-hover:gap-2.5 transition-all`}>
            {percent > 0 ? 'Continue Learning' : 'Start Learning'}
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </a>
  )
}

/* ───────────────────────── ICON MAP ───────────────────────── */
const iconMap: Record<string, React.ElementType> = {
  calculator: Target,
  book: BookOpen,
  globe: Target,
  shield: Target,
  brain: Target,
  flag: Target,
  target: Target,
  filetext: FileText,
  play: Play,
  default: BookOpen,
}
