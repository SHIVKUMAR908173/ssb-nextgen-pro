'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Brain, Image, PenTool, MessageSquare, Zap, UserCircle, Users, Flag, Mic2, Target, CheckCircle2, Lock, ArrowLeft, Radio, Sparkles, ChevronRight, ClipboardCheck, FileText, Download, Calendar, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'

type AssessmentItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  desc: string;
  href: string;
  status: string;
  locked?: boolean;
}

type AssessmentModule = {
  category: string;
  items: AssessmentItem[];
}

const ASSESSMENT_MODULES: AssessmentModule[] = [
  {
    category: 'Stage I: Screening',
    items: [
      { id: 'oir', label: 'OIR Test', icon: Brain, desc: '3,840 questions. 96 practice sets.', href: '/oir', status: 'Ready' },
      { id: 'ppdt', label: 'PPDT Round', icon: Image, desc: 'Picture perception and description test.', href: '/vacha/ppdt', status: 'Ready' },
      { id: 'csss', label: 'CSSS Stage-1 Screening', icon: ClipboardCheck, desc: 'New Computerised Stage-1 (CSS + OPAM).', href: '/vacha/stage1', status: 'Ready' },
    ]
  },
  {
    category: 'Stage II: Psychology',
    items: [
      { id: 'tat', label: 'TAT (Psychology)', icon: PenTool, desc: '11+1 TAT picture carousel analysis.', href: '/mansa/tat', status: 'Ready' },
      { id: 'wat', label: 'WAT (Psychology)', icon: MessageSquare, desc: 'Subconscious response evaluation.', href: '/mansa/wat', status: 'Ready' },
      { id: 'srt', label: 'SRT (Psychology)', icon: Zap, desc: '60 real-life situational reactions.', href: '/mansa/srt', status: 'Ready' },
      { id: 'sd', label: 'Self Description', icon: UserCircle, desc: 'Personal trait assessment.', href: '/mansa/self-description', status: 'Ready' },
    ]
  },
  {
    category: 'Stage II: GTO Grounds',
    items: [
      { id: 'gpe', label: 'Group Planning', icon: Target, desc: 'Map reading and planning exercise.', href: '/karmana/gpe', status: 'Ready' },
      { id: 'structures', label: 'GTO Structures', icon: Flag, desc: 'PGT, HGT, and Command Task.', href: '/karmana/gto', status: 'Ready' },
    ]
  },
  {
    category: 'Stage II: Interview',
    items: [
      { id: 'interview', label: '1:1 Virtual Interview', icon: Mic2, desc: 'Face Col. Arjun Singh (AI IO).', href: '/vacha/interview', status: 'Ready' },
    ]
  }
]

export default function AssessmentCenterPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [moduleStats, setModuleStats] = useState<Record<string, { completed: boolean, score: number | null }>>({});
  const reportRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = () => {
      if (user?.id) {
        fetch(`/api/assessment-profile?userId=${user.id}`)
          .then(res => res.json())
          .then(data => {
            if (!data.error) {
              setProfile(data);
            }
            setLoadingProfile(false);
          })
          .catch(err => {
            console.error(err);
            setLoadingProfile(false);
          });
      } else {
        setLoadingProfile(false);
      }
    };

    const fetchSessions = async () => {
      if (user?.id) {
        const supabase = createClient();
        const { data } = await supabase
          .from('assessment_sessions')
          .select('module, score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }); // Get latest score
          
        if (data) {
          const stats: Record<string, { completed: boolean, score: number | null }> = {};
          data.forEach(s => {
            if (!stats[s.module]) {
              stats[s.module] = { completed: true, score: s.score };
            }
          });
          setModuleStats(stats);
        }
      }
    };

    fetchProfile();
    fetchSessions();

    if (user?.id) {
      const supabase = createClient();
      const channel = supabase.channel('assessment_updates')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'assessment_sessions',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchProfile();
          fetchSessions();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#0f172a' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight; // Negative position to shift image up
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`SSB_Performance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadModuleReport = async (e: React.MouseEvent, item: AssessmentItem) => {
    e.preventDefault();
    if (!user) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('assessment_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('module', item.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFontSize(22);
      pdf.text(`SSB Evaluation Report: ${item.label}`, 20, 20);
      pdf.setFontSize(12);
      
      if (error || !data) {
        pdf.text('No assessment data found for this module yet.', 20, 40);
        pdf.text('Please complete the test first to generate a report.', 20, 50);
      } else {
        pdf.text(`Date: ${new Date(data.created_at).toLocaleString()}`, 20, 40);
        pdf.text(`Overall Score: ${data.score || 'N/A'} / 100`, 20, 50);
        
        pdf.setFontSize(16);
        pdf.text('AI Feedback & Observations:', 20, 70);
        
        pdf.setFontSize(10);
        let feedbackText = '';
        if (data.ai_feedback && typeof data.ai_feedback === 'object') {
           feedbackText = JSON.stringify(data.ai_feedback, null, 2);
        } else if (data.ai_feedback) {
           feedbackText = String(data.ai_feedback);
        } else {
           feedbackText = 'No specific AI feedback was recorded for this session.';
        }
        
        const splitText = pdf.splitTextToSize(feedbackText, 170);
        pdf.text(splitText, 20, 80);
      }
      
      pdf.save(`SSB_${item.id}_Report.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate individual report');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </Link>
        <button 
          onClick={downloadPDF} 
          disabled={isDownloading || !profile}
          className="bg-white hover:bg-slate-100 text-[#0f172a] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Download size={16} />}
          {isDownloading ? 'Generating...' : 'Download Full Report'}
        </button>
      </div>

      <div ref={reportRef} className="space-y-12 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f172a] rounded-[48px] p-16 overflow-hidden border border-white/5 relative shadow-2xl"
        >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto md:mx-0">
                 <Radio className="w-3 h-3 text-emerald-500" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Full Spectrum Evaluation</span>
              </div>
              <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none text-center md:text-left">
                 Assessment <span className="text-emerald-500">Center</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-bold text-center md:text-left">
                 Your unified performance report across all SSB modules. We track 15 Officer Like Qualities using advanced ML profiling.
              </p>
           </div>
        </div>
      </motion.div>

      {/* AI Assessment Profile */}
      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">AI Assessment Profile</h2>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>

        {loadingProfile ? (
           <div className="bg-[#162840] rounded-[40px] p-12 border border-[#1E3A5F] flex items-center justify-center min-h-[300px]">
             <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
           </div>
        ) : profile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#162840] rounded-[40px] p-8 md:p-12 border border-[#1E3A5F] shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left Column: Core Stats */}
              <div className="space-y-8 lg:col-span-1">
                <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/5 text-center">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Overall Officer Score</div>
                  <div className="text-7xl font-black text-emerald-500 mb-2">{profile.overallOfficerScore}<span className="text-2xl text-emerald-500/50">/100</span></div>
                  <div className={`text-sm font-black uppercase tracking-widest px-4 py-2 rounded-full inline-block mt-4 ${
                    profile.grade === 'RECOMMENDED' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
                    profile.grade === 'BORDERLINE' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                    'bg-red-500/20 text-red-500 border border-red-500/30'
                  }`}>
                    {profile.grade}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Predicted Outcome</h4>
                    <p className="text-sm font-bold text-slate-300">{profile.predictedOutcome}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Sessions Evaluated</span>
                    <span className="text-xl font-black text-white">{profile.sessionCount}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: OLQs & Improvements */}
              <div className="space-y-8 lg:col-span-2">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">15 Officer Like Qualities (OLQ) Ratings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(profile.olqScores).map(([key, score]: [string, any]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-[10px] font-black text-white">{score}/10</span>
                        </div>
                        <div className="h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${score >= 7 ? 'bg-emerald-500' : score >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${(score / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/5">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest">Targeted Improvement Roadmap</h3>
                  </div>
                  <div className="space-y-4">
                    {profile.improvementRoadmap.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                          item.priority === 'HIGH' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {item.priority}
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.olq.replace(/([A-Z])/g, ' $1').trim()}</div>
                          <p className="text-sm font-bold text-slate-400">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        ) : (
          <div className="bg-[#162840] rounded-[40px] p-12 border border-[#1E3A5F] flex flex-col items-center justify-center text-center min-h-[300px]">
             <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
             <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">No Assessment Data</h3>
             <p className="text-slate-400 font-bold max-w-md">Complete some tests in the Assessment Center below to generate your ML-driven SSB profile.</p>
          </div>
        )}
      </div>

      {/* Module Grid */}
      <div className="space-y-20 pt-12 border-t border-white/5">
        {ASSESSMENT_MODULES.map((module, i) => (
          <div key={module.category} className="space-y-8">
            <div className="flex items-center gap-6">
               <h2 className="text-2xl font-black text-white uppercase tracking-tight">{module.category}</h2>
               <div className="h-px flex-1 bg-white/5"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {module.items.map((item, j) => {
                 const stats = moduleStats[item.id];
                 const isCompleted = !!stats?.completed;
                 return (
                 <Link 
                   key={item.id}
                   href={item.locked ? '#' : item.href}
                   className={`
                     group relative bg-[#162840] rounded-[40px] p-8 border border-[#1E3A5F] flex flex-col gap-6 shadow-xl transition-all
                     ${item.locked ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:border-emerald-500/30 hover:bg-[#1a3050] hover:-translate-y-1'}
                   `}
                 >
                   <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${item.locked ? 'bg-[#0f172a] text-slate-700' : 'bg-[#0f172a] text-slate-400 group-hover:bg-emerald-500 group-hover:text-black shadow-2xl'}`}>
                         <item.icon className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {!item.locked && (
                           <div className={`flex items-center gap-2 px-3 py-1 text-[8px] font-black uppercase tracking-widest border rounded-full ${isCompleted ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                              <CheckCircle2 className="w-3 h-3" />
                              {isCompleted ? (stats.score !== null ? `SCORE: ${stats.score}` : 'COMPLETED') : 'READY'}
                           </div>
                        )}
                        {item.locked && <Lock className="w-4 h-4 text-slate-600 mt-1" />}
                        {!item.locked && isCompleted && (
                           <button 
                             onClick={(e) => downloadModuleReport(e, item)}
                             className="text-emerald-500 hover:text-emerald-400 p-2 rounded-full hover:bg-emerald-500/10 transition-colors"
                             title={`Download ${item.label} Report`}
                           >
                             <Download className="w-4 h-4" />
                           </button>
                        )}
                      </div>
                   </div>

                   <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">{item.label}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{item.desc}</p>
                   </div>

                   <div className={`mt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] transition-all ${item.locked ? 'text-slate-700' : 'text-emerald-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2'}`}>
                      Initialize Node <ChevronRight className="w-3 h-3" />
                   </div>
                 </Link>
               )})}
            </div>
          </div>
        ))}
      </div>

      </div>
    </div>
  )
}
