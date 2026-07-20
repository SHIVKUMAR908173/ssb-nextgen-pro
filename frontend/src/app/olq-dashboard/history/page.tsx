import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { getServerUser } from '@/lib/supabase/auth'
import { ArrowLeft, Clock, Activity } from 'lucide-react'
import Link from 'next/link'
import EvaluationDetails from '@/components/olq/EvaluationDetails'
import { redirect } from 'next/navigation'

export default async function HistoryDashboardPage() {
    // 1. Authenticate user
    const user = await getServerUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Fetch history from Supabase
    const supabase = await createClient()
    const { data: submissions, error } = await supabase
        .from('psych_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching submissions:', error)
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 p-6 md:p-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/olq-dashboard"
                        className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                    </Link>
                    <div className="h-4 w-px bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Historical Records
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Title */}
            <div className="bg-[#0f172a] rounded-3xl md:rounded-[48px] p-12 overflow-hidden border border-white/5 relative shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                            <Activity className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Psychological Profile</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                        Test <span className="text-blue-500">History</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-bold max-w-2xl">
                        Review your past assessments, analyze AI feedback, and track the evolution of your Officer Like Qualities.
                    </p>
                </div>
            </div>

            {/* Submissions List */}
            <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                    <Activity size={24} className="text-emerald-500" />
                    Past Assessments
                </h3>
                
                {submissions && submissions.length > 0 ? (
                    <div className="space-y-4">
                        {submissions.map((sub: any) => (
                            <EvaluationDetails key={sub.id} submission={sub} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#0f172a] rounded-3xl border border-white/5">
                        <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-slate-500" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">No History Found</h4>
                        <p className="text-slate-500">Take a psych assessment (WAT, TAT, SRT) to see your history here.</p>
                        <Link href="/practice" className="inline-block mt-6 px-6 py-3 bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-600 transition-colors">
                            Start Practicing
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
