'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Target, 
  TrendingUp, 
  Save, 
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import {
  getOLQConfiguration,
  updateOLQConfiguration,
  OLQConfiguration as OLQConfigType,
  OLQ_LABELS,
  OLQ_KEYS,
  OLQ_FACTOR_GROUPS
} from '@/lib/api/olq-tracker'

interface OLQConfigurationPanelProps {
  userId: string
  onClose?: () => void
}

interface FactorGroup {
  name: string
  olqs: string[]
  description: string
}

const FACTOR_GROUPS: FactorGroup[] = [
  {
    name: 'Planning & Organising',
    description: 'Cognitive abilities for problem-solving and execution',
    olqs: ['effective_intelligence', 'reasoning_ability', 'organizing_ability', 'power_of_expression']
  },
  {
    name: 'Social Adjustment',
    description: 'Interpersonal skills and team dynamics',
    olqs: ['social_adaptability', 'cooperation', 'sense_of_responsibility']
  },
  {
    name: 'Social Effectiveness',
    description: 'Leadership and influence capabilities',
    olqs: ['initiative', 'self_confidence', 'speed_of_decision', 'ability_to_influence']
  },
  {
    name: 'Dynamic',
    description: 'Mental and physical endurance traits',
    olqs: ['liveliness', 'determination', 'courage', 'stamina']
  }
]

export default function OLQConfigurationPanel({ userId, onClose }: OLQConfigurationPanelProps) {
  const [config, setConfig] = useState<OLQConfigType | null>(null)
  const [weights, setWeights] = useState<Record<string, number>>({})
  const [targets, setTargets] = useState<Record<string, number>>({})
  const [configName, setConfigName] = useState('Default')
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Planning & Organising': true,
    'Social Adjustment': true,
    'Social Effectiveness': true,
    'Dynamic': true
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConfiguration()
  }, [userId])

  const loadConfiguration = async () => {
    try {
      setIsLoading(true)
      const data = await getOLQConfiguration(userId)
      setConfig(data)
      setWeights(data.weights)
      setTargets(data.targets)
      setConfigName(data.configuration_name || 'Default')
      setNotes(data.notes || '')
    } catch (error) {
      console.error('Failed to load OLQ configuration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWeightChange = (olqKey: string, value: number) => {
    setWeights(prev => ({
      ...prev,
      [olqKey]: Math.max(0.5, Math.min(2.0, value))
    }))
  }

  const handleTargetChange = (olqKey: string, value: number) => {
    setTargets(prev => ({
      ...prev,
      [olqKey]: Math.max(1, Math.min(10, value))
    }))
  }

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveSuccess(false)
      
      await updateOLQConfiguration(userId, {
        weights,
        targets,
        configuration_name: configName,
        notes
      })
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save OLQ configuration:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default values?')) {
      const defaultWeights = OLQ_KEYS.reduce((acc, key) => ({
        ...acc,
        [key]: 1.0
      }), {})
      const defaultTargets = OLQ_KEYS.reduce((acc, key) => ({
        ...acc,
        [key]: 7
      }), {})
      
      setWeights(defaultWeights)
      setTargets(defaultTargets)
      setConfigName('Default')
      setNotes('')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-[#162840] rounded-[40px] p-12 border border-[#1E3A5F] shadow-xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-emerald-500 text-sm font-bold uppercase tracking-widest animate-pulse">
            Loading Configuration...
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#162840] rounded-[40px] p-12 border border-[#1E3A5F] shadow-xl space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Settings className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                OLQ Configuration
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Customize Assessment Parameters
              </p>
            </div>
          </div>
        </div>
        
        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
              Saved Successfully
            </span>
          </div>
        )}
      </div>

      {/* Configuration Name & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Configuration Name
          </label>
          <input
            type="text"
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#1E3A5F] rounded-2xl px-6 py-4 text-white font-bold text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            placeholder="My Configuration"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#1E3A5F] rounded-2xl px-6 py-4 text-white font-bold text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            placeholder="Optional notes..."
          />
        </div>
      </div>

      {/* Factor Groups */}
      <div className="space-y-6">
        {FACTOR_GROUPS.map((group) => (
          <div key={group.name} className="bg-[#0f172a] rounded-[32px] border border-[#1E3A5F] overflow-hidden">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.name)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    {group.name}
                  </h3>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    {group.description}
                  </p>
                </div>
              </div>
              {expandedGroups[group.name] ? (
                <ChevronUp className="w-5 h-5 text-slate-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-500" />
              )}
            </button>

            {/* Group Content */}
            {expandedGroups[group.name] && (
              <div className="px-6 pb-6 space-y-4">
                {group.olqs.map((olqKey) => {
                  const label = OLQ_LABELS[OLQ_KEYS.indexOf(olqKey)]
                  const weight = weights[olqKey] || 1.0
                  const target = targets[olqKey] || 7
                  
                  return (
                    <div key={olqKey} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-[#162840] rounded-2xl border border-[#1E3A5F]">
                      {/* OLQ Name */}
                      <div className="md:col-span-1">
                        <span className="text-sm font-bold text-white">
                          {label}
                        </span>
                      </div>

                      {/* Weight Slider */}
                      <div className="md:col-span-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest w-16">
                            Weight
                          </span>
                          <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={weight}
                            onChange={(e) => handleWeightChange(olqKey, parseFloat(e.target.value))}
                            className="flex-1 h-2 bg-[#1E3A5F] rounded-full appearance-none cursor-pointer accent-emerald-500"
                          />
                          <span className="text-sm font-black text-emerald-500 w-8 text-right">
                            {weight.toFixed(1)}x
                          </span>
                        </div>
                      </div>

                      {/* Target Input */}
                      <div className="md:col-span-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest w-16">
                            Target
                          </span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={target}
                            onChange={(e) => handleTargetChange(olqKey, parseInt(e.target.value))}
                            className="w-16 bg-[#1E3A5F] border border-[#334155] rounded-xl px-3 py-2 text-white font-black text-center text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                          />
                          <span className="text-[8px] font-bold text-slate-500">
                            /10
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[#1E3A5F]">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {/* Info Note */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-500 mb-2">Configuration Impact</p>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
            Weight multipliers affect how OLQ scores are calculated from assessments. 
            Higher weights (up to 2.0x) will amplify the importance of that OLQ in overall evaluations.
            Target scores serve as goals for tracking progress and will be displayed on the radar chart for comparison.
          </p>
        </div>
      </div>
    </motion.div>
  )
}