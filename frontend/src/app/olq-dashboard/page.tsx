'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Settings, 
  TrendingUp, 
  Calendar,
  Target,
  BarChart3,
  Download,
  RefreshCw,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  getCurrentOLQScores,
  getDailySummary,
  getOLQTrends,
  getOLQConfiguration,
  OLQ_LABELS,
  calculateFactorScores
} from '@/lib/api/olq-tracker'
import OLQConfigurationPanel from '@/components/olq/OLQConfigurationPanel'

const OlqRadarChart = dynamic(() => import('@/components/charts/OlqRadarChart'), { ssr: false })

// Mock user ID - in production this would come from auth context
const USER_ID = 'demo-user-001'

type ViewMode = 'overview' | 'configuration' | 'trends'

export default function OLQDashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [currentScores, setCurrentScores] = useState<number[]>([])
  const [targetScores, setTargetScores] = useState<number[]>([])
  const [factorScores, setFactorScores] = useState<Record<string, number>>({})
  const [dailySummaries, setDailySummaries] = useState<any[]>([])
  const [trends, setTrends] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Load current OLQ scores
      const scoresData = await getCurrentOLQScores(USER_ID)
      setCurrentScores(scoresData.scores)
      setLastUpdated(scoresData.last_updated)

      // Load configuration for target scores
      const config = await getOLQConfiguration(USER_ID)
      const targets = OLQ_LABELS.map((_, index) => {
        const key = ['effective_intelligence', 'reasoning_ability', 'organizing_ability', 'power_of_expression', 
                     'social_adaptability', 'cooperation', 'sense_of_responsibility', 'initiative', 
                     'self_confidence', 'speed_of_decision', 'ability_to_influence', 'liveliness', 
                     'determination', 'courage', 'stamina'][index]
        return config.targets[key] || 7
      })
      setTargetScores(targets)

      // Calculate factor scores
      setFactorScores(calculateFactorScores(scoresData.scores))

      // Load daily summaries
      const summaries = await getDailySummary(USER_ID, 7)
      setDailySummaries(summaries)

      // Load trends
      const trendData = await getOLQTrends(USER_ID, 30)
      setTrends(trendData)

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-500'
    if (score >= 6) return 'text-amber-500'
    return 'text-red-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/10 border-emerald-500/20'
    if (score >= 6) return 'bg-amber-500/10 border-amber-500/20'
    return 'bg-red-500/10 border-red-500/20'
  }

  const getProgressWidth = (score: number) => {
    return `${(score / 10) * 100}%`
  }

  if (viewMode === 'configuration') {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode('overview')}
            className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </button>
        </div>
        <OLQConfigurationPanel userId={USER_ID} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
          <div className="h-4 w-px bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OLQ Tracking Active</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-black uppercase tracking-widest text-[8px] transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
          <button
            onClick={() => setViewMode('configuration')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-500 font-black uppercase tracking-widest text-[8px] transition-all"
          >
            <Settings className="w-3 h-3" />
            Configure
          </button>
        </div>
      </div>

      {/* Main Title */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] rounded-3xl md:rounded-[48px] p-12 overflow-hidden border border-white/5 relative shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Real-time Tracking</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
            OLQ <span className="text-emerald-500">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-lg font-bold max-w-2xl">
            Track your 15 Officer Like Qualities across all assessments. Monitor daily progress, 
            identify strengths and areas for improvement.
          </p>
          {lastUpdated && (
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-4">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </motion.div>

      {/* Factor Scores Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(factorScores).map(([factor, score]) => (
          <motion.div
            key={factor}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-[#162840] rounded-[32px] p-8 border shadow-xl ${getScoreBgColor(score)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0f172a] flex items-center justify-center">
                <Target className={`w-6 h-6 ${getScoreColor(score)}`} />
              </div>
              <span className={`text-2xl font-black ${getScoreColor(score)}`}>
                {score.toFixed(1)}
              </span>
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight mb-2">
              {factor}
            </h3>
            <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${score >= 8 ? 'bg-emerald-500' : score >= 6 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: getProgressWidth(score) }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Chart */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-[#1E3A5F] rounded-3xl md:rounded-[48px] p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live Telemetry</span>
            </div>
          </div>
          <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-white uppercase tracking-tight">
            <BarChart3 size={24} className="text-emerald-500" />
            Performance Radar
          </h3>
          <div className="h-[500px] w-full">
            <OlqRadarChart 
              userId={USER_ID}
              showTargets={true}
              targetScores={targetScores}
            />
          </div>
        </div>

        {/* OLQ Details */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">
            OLQ Breakdown
          </h3>
          {OLQ_LABELS.map((label, index) => {
            const score = currentScores[index] || 5
            const target = targetScores[index] || 7
            const diff = score - target
            
            return (
              <div 
                key={label}
                className="bg-[#162840] rounded-2xl p-6 border border-[#1E3A5F] hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">{label}</span>
                  <span className={`text-lg font-black ${getScoreColor(score)}`}>
                    {score.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#0f172a] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getScoreColor(score).replace('text-', 'bg-')}`}
                      style={{ width: getProgressWidth(score) }}
                    />
                  </div>
                  {diff >= 0 ? (
                    <span className="text-[8px] font-black text-emerald-500">
                      +{diff.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-[8px] font-black text-red-500">
                      {diff.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">
                    Target: {target}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Daily Summary */}
      <div className="bg-[#0f172a] border border-[#1E3A5F] rounded-3xl md:rounded-[48px] p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8">
          <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full flex items-center gap-2">
            <Calendar className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">7-Day Summary</span>
          </div>
        </div>
        <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-white uppercase tracking-tight">
          <TrendingUp size={24} className="text-blue-500" />
          Daily Progress
        </h3>
        
        {dailySummaries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailySummaries.slice(0, 6).map((summary, index) => (
              <div 
                key={summary.date}
                className="bg-[#162840] rounded-2xl p-6 border border-[#1E3A5F]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-white">
                    {new Date(summary.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {summary.assessment_count} tests
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">
                    {summary.overall_daily_score?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">/ 100</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 font-bold">No daily summaries available yet. Complete assessments to see progress.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          href="/vacha/assessment"
          className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] hover:border-emerald-500/30 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
            <Activity className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            Take Assessment
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Complete tests to update your OLQ scores
          </p>
        </Link>

        <Link 
          href="/olq-dashboard/history"
          className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] hover:border-purple-500/30 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
            <Activity className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            Test History
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Review past assessments & feedback
          </p>
        </Link>

        <Link 
          href="/"
          className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] hover:border-orange-500/30 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
            <LayoutDashboard className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            Main Dashboard
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Return to command center
          </p>
        </Link>

        <button
          onClick={() => {
            // Export functionality
            const data = {
              scores: currentScores,
              factors: factorScores,
              dailySummaries,
              trends,
              exportedAt: new Date().toISOString()
            }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `olq-report-${new Date().toISOString().split('T')[0]}.json`
            a.click()
          }}
          className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] hover:border-blue-500/30 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
            <Download className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            Export Report
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Download your OLQ data
          </p>
        </button>
      </div>
    </div>
  )
}

// Import LayoutDashboard for the quick actions
import { LayoutDashboard } from 'lucide-react'