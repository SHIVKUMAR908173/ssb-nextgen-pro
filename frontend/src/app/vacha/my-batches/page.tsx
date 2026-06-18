'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, User, Shield, MessageCircle, Calendar, ArrowLeft, Radio, Sparkles, Target, Zap } from 'lucide-react'
import Link from 'next/link'

const SQUAD_MEMBERS = [
  { name: 'Rahul Sharma', role: 'Squad Leader', chestNo: '14', status: 'Online' },
  { name: 'Priya Verma', role: 'Member', chestNo: '02', status: 'Offline' },
  { name: 'Amit Singh', role: 'Member', chestNo: '21', status: 'Online' },
  { name: 'Sneha Kapur', role: 'Member', chestNo: '09', status: 'Training' },
]

export default function MyBatchesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Squad Uplink Secured</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] rounded-[48px] p-12 overflow-hidden border border-white/5 relative shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-6">
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mx-auto md:mx-0">
                 <Radio className="w-3 h-3 text-indigo-500" />
                 <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Deployment Alpha Active</span>
              </div>
              <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none text-center md:text-left">
                 Batch <span className="text-indigo-600">#2024</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-bold text-center md:text-left">
                 Coordinated training for Alpha Squad. Real-time peer assessment and collaborative tactical development.
              </p>
           </div>
           
           <div className="bg-[#162840] border border-white/5 rounded-[40px] p-10 text-center min-w-[280px] shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"></div>
              <Users className="w-16 h-16 text-indigo-500 mx-auto mb-6 relative z-10" />
              <p className="text-4xl font-black text-white relative z-10">12</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2 relative z-10">Active Cadets</p>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Squad Roster */}
         <div className="lg:col-span-8 bg-[#162840] rounded-[48px] p-12 border border-[#1E3A5F] shadow-2xl space-y-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Target className="w-8 h-8 text-indigo-500" />
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">Squad Roster</h2>
               </div>
               <div className="flex items-center gap-2 bg-[#0f172a] px-4 py-2 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">4 Active Now</span>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {SQUAD_MEMBERS.map((member, i) => (
                 <motion.div 
                   key={member.name}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-[#0f172a] rounded-[32px] p-8 border border-white/5 hover:border-indigo-500/30 transition-all group flex items-center justify-between shadow-xl"
                 >
                    <div className="flex items-center gap-8">
                       <div className="w-20 h-20 bg-[#162840] rounded-[24px] flex items-center justify-center text-slate-700 group-hover:text-indigo-500 transition-colors border border-white/5 relative">
                          <User className="w-10 h-10" />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#0f172a] ${
                             member.status === 'Online' ? 'bg-emerald-500' : member.status === 'Training' ? 'bg-yellow-500' : 'bg-slate-800'
                          }`}></div>
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-white uppercase tracking-tight">{member.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{member.role}</span>
                             <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                             <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{member.status}</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Chest No.</p>
                       <p className="text-4xl font-black text-indigo-600 tabular-nums">{member.chestNo}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Sidebar Comms */}
         <div className="lg:col-span-4 space-y-8">
            <section className="bg-[#162840] rounded-[40px] p-10 border border-[#1E3A5F] shadow-2xl h-fit">
               <div className="flex items-center gap-4 mb-10">
                  <MessageCircle className="w-6 h-6 text-indigo-500" />
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Tactical Comms</h2>
               </div>
               
               <div className="space-y-6">
                  <div className="bg-[#0f172a] rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
                     <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Mentor Brief
                     </p>
                     <p className="text-sm font-bold text-slate-300 leading-relaxed italic relative z-10">
                        "Cadets, emphasize Social Adaptability in today's GD simulation. Group cohesion is paramount."
                     </p>
                  </div>
                  <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/20 transition-all active:scale-95">
                     Enter Squad Channel
                  </button>
               </div>
            </section>

            <section className="bg-[#0f172a] rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
               <div className="flex items-center gap-3 mb-6 relative z-10">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Ops Calendar</h3>
               </div>
               <div className="space-y-1 relative z-10">
                  <p className="text-3xl font-black text-white uppercase tracking-tight tabular-nums">20:00 IST</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Psychology Intensive Session</p>
               </div>
               <div className="mt-8 flex items-center gap-3 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                  <Zap className="w-4 h-4 fill-current animate-pulse" />
                  Direct Link Active
               </div>
            </section>
         </div>
      </div>

    </div>
  )
}
