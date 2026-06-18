'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Target, Activity, FileText } from 'lucide-react'

interface EvaluationDetailsProps {
    submission: any
}

export default function EvaluationDetails({ submission }: EvaluationDetailsProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Safely parse feedback
    let feedback: any = {}
    try {
        if (typeof submission.ai_feedback === 'string') {
            feedback = JSON.parse(submission.ai_feedback)
        } else {
            feedback = submission.ai_feedback || {}
        }
    } catch (e) {
        feedback = { error: 'Failed to parse AI Feedback' }
    }

    // Normalize different AI response schemas
    const strengths = feedback.strengths || []
    const redFlags = feedback.redFlags || feedback.weaknesses || []
    const verdict = feedback.verdict || feedback.board_president_verdict || feedback.overall_verdict || 'Evaluation Complete'
    const advice = feedback.advice || feedback.training_prescription || feedback.recommendations || ''
    
    // Normalize OLQ Scores
    let olqScores = []
    if (Array.isArray(feedback.olqAnalysis)) {
        olqScores = feedback.olqAnalysis
    } else if (Array.isArray(feedback.olq_scores)) {
        olqScores = feedback.olq_scores.map((s: any) => ({
            olq: s.olq,
            score: s.score,
            note: s.verdict || s.note
        }))
    }

    // Safely extract user content
    let userContentStr = ''
    try {
        if (submission.content && typeof submission.content === 'object') {
             if (submission.content.response) userContentStr = submission.content.response;
             else if (submission.content.responses) userContentStr = JSON.stringify(submission.content.responses, null, 2);
             else userContentStr = JSON.stringify(submission.content, null, 2);
        } else {
            userContentStr = String(submission.content || 'No response recorded.')
        }
    } catch (e) {
        userContentStr = 'Error reading response.'
    }

    return (
        <div className="bg-[#162840] border border-[#1E3A5F] rounded-2xl overflow-hidden mb-4 shadow-xl">
            {/* Header / Summary Row */}
            <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="text-emerald-500 font-black uppercase tracking-widest text-xs bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            {submission.test_type}
                        </span>
                        <span className="text-slate-400 text-sm font-bold">
                            {new Date(submission.created_at).toLocaleString()}
                        </span>
                    </div>
                    <p className="text-white font-bold text-lg max-w-2xl truncate">
                        {verdict}
                    </p>
                </div>
                
                <div className="flex items-center gap-6">
                    {feedback.overall_srt_score || feedback.confidenceScore ? (
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Score</span>
                            <span className="text-2xl font-black text-white">
                                {feedback.overall_srt_score || feedback.confidenceScore}
                                <span className="text-sm text-slate-500">/100</span>
                            </span>
                        </div>
                    ) : null}
                    
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[#1E3A5F]"
                    >
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#0f172a]">
                            
                            {/* Left Column: Cadet Content & Feedback */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                                        <FileText size={16} /> Your Response
                                    </h4>
                                    <div className="bg-[#162840] p-4 rounded-xl text-slate-300 font-medium whitespace-pre-wrap text-sm border border-white/5">
                                        {userContentStr}
                                    </div>
                                </div>

                                {strengths.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                                            <CheckCircle size={16} /> Strengths
                                        </h4>
                                        <ul className="space-y-2">
                                            {strengths.map((s: string, i: number) => (
                                                <li key={i} className="flex gap-3 text-sm text-slate-300 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {redFlags.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-black text-red-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                                            <AlertTriangle size={16} /> Red Flags
                                        </h4>
                                        <ul className="space-y-2">
                                            {redFlags.map((r: string, i: number) => (
                                                <li key={i} className="flex gap-3 text-sm text-slate-300 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: OLQ Breakdown & Advice */}
                            <div className="space-y-6">
                                {olqScores.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                                            <Activity size={16} /> OLQ Analysis
                                        </h4>
                                        <div className="space-y-3">
                                            {olqScores.map((score: any, i: number) => (
                                                <div key={i} className="bg-[#162840] p-4 rounded-xl border border-white/5">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-white text-sm">{score.olq}</span>
                                                        <span className="font-black text-emerald-500">{score.score}/10</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 leading-relaxed">
                                                        {score.note}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {advice && (
                                    <div>
                                        <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                                            <Target size={16} /> Board Prescription
                                        </h4>
                                        <div className="bg-amber-500/5 p-5 rounded-xl border border-amber-500/20 text-sm text-amber-100 font-medium leading-relaxed">
                                            {advice}
                                        </div>
                                    </div>
                                )}
                                
                                {feedback.leadership_pattern && (
                                     <div>
                                         <h4 className="text-sm font-black text-purple-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                                             <Activity size={16} /> Leadership Pattern
                                         </h4>
                                         <div className="bg-purple-500/5 p-4 rounded-xl border border-purple-500/20 text-sm text-purple-200">
                                             {feedback.leadership_pattern}
                                         </div>
                                     </div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
