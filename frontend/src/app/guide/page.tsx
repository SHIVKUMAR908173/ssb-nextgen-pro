'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Video, Mic, Wifi, User, FileText, Brain, Mic2, AlertCircle, ChevronRight, ArrowLeft, Radio, Sparkles } from 'lucide-react'
import Link from 'next/link'

const REQUIREMENTS = [
  {
    icon: Video,
    label: 'Video Hardware',
    desc: 'High-definition webcam required. AI IO monitors non-verbal cues and posture.',
    color: 'blue'
  },
  {
    icon: Mic,
    label: 'Acoustic Feed',
    desc: 'Low-latency microphone. Clear audio is essential for real-time transcription.',
    color: 'purple'
  },
  {
    icon: Wifi,
    label: 'Digital Uplink',
    desc: 'Stable 4G/5G/Broadband. High bandwidth ensures seamless interaction.',
    color: 'emerald'
  }
]

const WORKFLOW = [
  {
    step: '01',
    icon: User,
    title: 'Candidate Authentication',
    desc: 'Establish your profile to sync mission progress across all tactical sectors.',
    link: 'Initiate Login',
    color: 'slate'
  },
  {
    icon: FileText,
    title: 'PIQ Matrix (Mandatory)',
    desc: 'The Personal Information Questionnaire is the core of your interview dossier. The AI IO decodes this data for targeted questioning.',
    alert: 'PIQ LOCK: Interview Sector remains inaccessible without valid form data.',
    link: 'Synchronize PIQ',
    color: 'yellow'
  },
  {
    icon: Brain,
    title: 'Psychology Operations',
    desc: 'Complete the full psych battery: PPDT, TAT, WAT, SRT, and SDT. Time-critical response protocols enforced.',
    color: 'purple'
  },
  {
    icon: Mic2,
    title: 'IO Verbal Assessment',
    desc: 'Direct engagement with the Virtual Interviewing Officer.',
    bullets: [
      'Maintain sustained eye contact with the primary lens.',
      'Operational clarity: Project confidence and logic.',
      'Interview duration: 30 minutes of deep situational audit.',
      'CIQ/PIQ grounding enforced throughout session.'
    ],
    link: 'Deploy Now',
    color: 'cyan'
  }
]

export default function PlatformGuidePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 text-white">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Node: SOP Active</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] rounded-[48px] p-16 overflow-hidden border border-white/5 relative shadow-2xl text-center"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px]"></div>
        <div className="relative z-10 space-y-8">
           <div className="bg-yellow-500/10 border border-yellow-500/20 px-6 py-2 rounded-full flex items-center gap-3 max-w-fit mx-auto">
              <ShieldCheck className="w-4 h-4 text-yellow-500" />
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Standard Operating Procedure</span>
           </div>
           
           <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
             Platform <span className="text-blue-500">Usage Guide</span>
           </h1>
           
           <p className="text-slate-400 max-w-3xl mx-auto text-xl leading-relaxed font-bold italic">
             &quot;This tactical environment simulates the high-stress conditions of the SSB. Adhere to these protocols to ensure accurate intelligence assessment.&quot;
           </p>
        </div>
      </motion.div>

      {/* Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {REQUIREMENTS.map((req, i) => (
          <motion.div
            key={req.label}
            whileHover={{ y: -5 }}
            className="bg-[#162840] rounded-[40px] p-10 shadow-2xl border border-[#1E3A5F] flex flex-col items-center text-center group"
          >
            <div className={`w-16 h-16 bg-[#0f172a] rounded-[20px] flex items-center justify-center text-${req.color}-500 mb-8 border border-white/5 group-hover:border-${req.color}-500/30 transition-all`}>
              <req.icon className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4">{req.label}</h3>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">{req.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Assessment Workflow */}
      <div className="bg-[#162840] rounded-[48px] p-16 shadow-2xl border border-[#1E3A5F] space-y-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
        
        <div className="flex items-center gap-4 relative z-10">
           <Radio className="w-8 h-8 text-blue-500" />
           <h2 className="text-3xl font-black text-white tracking-tight uppercase">Operational Workflow</h2>
        </div>

        <div className="space-y-16 relative">
          <div className="absolute left-7 top-10 bottom-10 w-px bg-white/5 hidden md:block"></div>

          {WORKFLOW.map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row gap-10 relative z-10"
            >
              <div className={`w-14 h-14 shrink-0 bg-[#0f172a] rounded-[20px] flex items-center justify-center text-white shadow-2xl border border-white/5 group transition-all`}>
                 {item.step ? <span className="font-black text-2xl tabular-nums">{item.step}</span> : <item.icon className="w-6 h-6" />}
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{item.title}</h3>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-3xl uppercase tracking-widest">{item.desc}</p>
                </div>

                {item.alert && (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 flex items-center gap-4 text-[9px] font-black text-yellow-500 uppercase tracking-[0.2em] max-w-fit">
                     <AlertCircle className="w-4 h-4" />
                     {item.alert}
                  </div>
                )}

                {item.bullets && (
                  <ul className="space-y-3">
                    {item.bullets.map((bullet, j) => (
                      <li key={j} className="text-[10px] font-bold text-slate-500 flex items-center gap-3 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 shadow-[0_0_8px_#0891b2]"></div>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                {item.link && (
                  <button className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] hover:gap-4 transition-all pt-2 group">
                     {item.link}
                     <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
