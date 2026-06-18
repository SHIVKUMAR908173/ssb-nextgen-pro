'use client'
import React, { useEffect, useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'
import { OLQ_LABELS } from '@/lib/api/olq-tracker'

interface RadarProps {
    scores?: number[] // Optional: Array of 15 integers corresponding to OLQs
    userId?: string // Optional: User ID to fetch real data
    showTargets?: boolean // Optional: Show target scores as second trace
    targetScores?: number[] // Optional: Target scores to display
}

export default function OlqRadarChart({ 
    scores: propScores, 
    userId, 
    showTargets = false,
    targetScores: propTargetScores
}: RadarProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [scores, setScores] = useState<number[]>(propScores || Array(15).fill(0))
    const [targetScores, setTargetScores] = useState<number[]>(propTargetScores || Array(15).fill(7))

    useEffect(() => { 
        setIsMounted(true)
        if (propScores && propScores.length > 0) {
            setScores(propScores)
        } else {
            setScores(Array(15).fill(0))
        }
        
        if (propTargetScores) {
            setTargetScores(propTargetScores)
        }
    }, [propScores, propTargetScores])

    if (!isMounted) {
        return <div className="h-96 w-full animate-pulse bg-white/5 rounded-xl flex items-center justify-center">
            <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Loading Radar...</span>
        </div>
    }

    // Format data for recharts
    const chartData = OLQ_LABELS.map((label, index) => ({
        subject: label,
        current: scores[index] || 0,
        target: targetScores[index] || 0
    }))

    return (
        <div className="w-full h-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#e2e8f0', fontSize: 10 }}
                    />
                    <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 10]} 
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        tickCount={6}
                    />
                    <Radar
                        name="Current Assessed Level"
                        dataKey="current"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="#10b981"
                        fillOpacity={0.3}
                    />
                    {showTargets && (
                        <Radar
                            name="Target Level"
                            dataKey="target"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            fill="#f59e0b"
                            fillOpacity={0.1}
                        />
                    )}
                    {showTargets && (
                        <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8', paddingTop: '20px' }} />
                    )}
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
