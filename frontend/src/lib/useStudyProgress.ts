'use client'

import { useState, useEffect, useCallback } from 'react'

interface StudyProgress {
  completedTopics: string[]
  bookmarkedTopics: string[]
  currentStreak: number
  lastStudyDate: string
  totalStudyTimeMinutes: number
  topicNotes: Record<string, string>
}

const STORAGE_KEY = 'ssb-study-progress'

const DEFAULT_PROGRESS: StudyProgress = {
  completedTopics: [],
  bookmarkedTopics: [],
  currentStreak: 0,
  lastStudyDate: '',
  totalStudyTimeMinutes: 0,
  topicNotes: {},
}

function loadProgress(): StudyProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROGRESS
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_PROGRESS
  }
}

function saveProgress(progress: StudyProgress) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // localStorage full or unavailable
  }
}

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayISO(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function useStudyProgress() {
  const [progress, setProgress] = useState<StudyProgress>(DEFAULT_PROGRESS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = loadProgress()
    // Update streak on load
    const today = getTodayISO()
    const yesterday = getYesterdayISO()
    if (saved.lastStudyDate !== today && saved.lastStudyDate !== yesterday) {
      saved.currentStreak = 0
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(saved)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true)
  }, [])



  const markTopicComplete = useCallback((topicId: string) => {
    setProgress(prev => {
      if (prev.completedTopics.includes(topicId)) return prev
      const today = getTodayISO()
      const yesterday = getYesterdayISO()
      let newStreak = prev.currentStreak
      if (prev.lastStudyDate === yesterday || prev.lastStudyDate === '') {
        newStreak = prev.currentStreak + 1
      } else if (prev.lastStudyDate !== today) {
        newStreak = 1
      }
      const updated: StudyProgress = {
        ...prev,
        completedTopics: [...prev.completedTopics, topicId],
        currentStreak: newStreak,
        lastStudyDate: today,
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const unmarkTopicComplete = useCallback((topicId: string) => {
    setProgress(prev => {
      const updated: StudyProgress = {
        ...prev,
        completedTopics: prev.completedTopics.filter(id => id !== topicId),
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const toggleBookmark = useCallback((topicId: string) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarkedTopics.includes(topicId)
      const updated: StudyProgress = {
        ...prev,
        bookmarkedTopics: isBookmarked
          ? prev.bookmarkedTopics.filter(id => id !== topicId)
          : [...prev.bookmarkedTopics, topicId],
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const isCompleted = useCallback((topicId: string) => {
    return progress.completedTopics.includes(topicId)
  }, [progress.completedTopics])

  const isBookmarked = useCallback((topicId: string) => {
    return progress.bookmarkedTopics.includes(topicId)
  }, [progress.bookmarkedTopics])

  const addStudyTime = useCallback((minutes: number) => {
    setProgress(prev => {
      const updated: StudyProgress = {
        ...prev,
        totalStudyTimeMinutes: prev.totalStudyTimeMinutes + minutes,
        lastStudyDate: getTodayISO(),
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const getProgressPercent = useCallback((allTopicIds: string[]): number => {
    if (allTopicIds.length === 0) return 0
    const completed = allTopicIds.filter(id => progress.completedTopics.includes(id)).length
    return Math.round((completed / allTopicIds.length) * 100)
  }, [progress.completedTopics])

  const getCompletedCount = useCallback((allTopicIds: string[]): number => {
    return allTopicIds.filter(id => progress.completedTopics.includes(id)).length
  }, [progress.completedTopics])

  return {
    progress,
    loaded,
    markTopicComplete,
    unmarkTopicComplete,
    toggleBookmark,
    isCompleted,
    isBookmarked,
    addStudyTime,
    getProgressPercent,
    getCompletedCount,
  }
}
