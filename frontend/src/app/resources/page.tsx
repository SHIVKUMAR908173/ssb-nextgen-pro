'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Users, HelpCircle, FileText, Info, Shield, Award, MapPin, ChevronRight, Video, PlayCircle, GraduationCap, Download } from 'lucide-react'

// Import Massive Local Databases
import gdTopicsData from '@/data/gd_topics.json'
import interviewQuestionsExpanded from '@/data/interview_questions_expanded.json'
import lecturetteTopicsData from '@/data/lecturette_topics.json'
import youtubeVideosData from '@/data/youtube_masterclass.json'
import writtenExamsData from '@/data/written_exams.json'

const TABS = [
  { id: 'static-gk', label: 'Static Defence GK', icon: BookOpen },
  { id: 'gd-topics', label: 'GD Topics', icon: Users },
  { id: 'interview-questions', label: 'Interview Questions', icon: HelpCircle },
  { id: 'lecturette-topics', label: 'Lecturette Topics', icon: BookOpen },
  { id: 'video-masterclass', label: 'YouTube Masterclass', icon: Video },
]

const GK_SUBTABS = [
  { id: 'services-info', label: 'Services Info', icon: Info },
  { id: 'ranks', label: 'Ranks', icon: Shield },
  { id: 'commands', label: 'Commands', icon: MapPin },
]

const SERVICES_DATA = [
  {
    name: 'Indian Army',
    motto: 'Seva Paramo Dharma (Service Before Self)',
    day: '15 January',
    headquarters: 'New Delhi',
    chief: 'Chief of the Army Staff (COAS) - General Upendra Dwivedi',
    borderColor: 'border-green-500/20',
    bgColor: 'bg-green-500/5',
    iconColor: 'text-green-500',
    labelColor: 'text-green-400'
  },
  {
    name: 'Indian Navy',
    motto: 'Sham No Varunah (May the Lord of Water be auspicious unto us)',
    day: '04 December',
    headquarters: 'New Delhi',
    chief: 'Chief of the Naval Staff (CNS) - Admiral Dinesh Kumar Tripathi',
    borderColor: 'border-blue-500/20',
    bgColor: 'bg-blue-500/5',
    iconColor: 'text-blue-500',
    labelColor: 'text-blue-400'
  },
  {
    name: 'Indian Air Force',
    motto: 'Nabham Sparsham Deeptam (Touch the sky with glory)',
    day: '08 October',
    headquarters: 'New Delhi',
    chief: 'Chief of the Air Staff (CAS) - Air Chief Marshal Amar Preet Singh',
    borderColor: 'border-sky-500/20',
    bgColor: 'bg-sky-500/5',
    iconColor: 'text-sky-500',
    labelColor: 'text-sky-400'
  }
]

const BLOG_DATA = [
  { 
    title: 'Indian Navy Commissions INS Jatayu at Minicoy', 
    category: 'Naval Operations', 
    date: 'Today', 
    desc: 'In a major strategic move to bolster security in the Indian Ocean Region, the Indian Navy commissioned its new base INS Jatayu at Minicoy island in Lakshadweep.'
  },
  { 
    title: 'DRDO Conducts Successful Flight Test of Agni-5 MIRV', 
    category: 'Strategic Defense', 
    date: 'Yesterday', 
    desc: 'Mission Divyastra marked a historic milestone as DRDO successfully flight-tested the Agni-5 ballistic missile equipped with Multiple Independently Targetable Re-entry Vehicle (MIRV) technology.'
  },
  { 
    title: 'Indian Army Contingent Departs for Exercise LAMITIYE', 
    category: 'Joint Exercises', 
    date: '2 Days Ago', 
    desc: 'An Indian Army contingent departed for Seychelles to participate in the 10th edition of the Joint Military Exercise LAMITIYE, enhancing interoperability in sub-conventional operations.'
  },
  { 
    title: 'IAF\'s Exercise Vayu Shakti 2024 Concludes in Pokhran', 
    category: 'Air Force', 
    date: 'Last Week', 
    desc: 'The Indian Air Force demonstrated its full-spectrum combat capabilities, including the indigenous Tejas and Prachand helicopters, during a massive firepower demonstration at Pokhran range.'
  },
  { 
    title: 'Cabinet Approves 5th Generation Fighter Aircraft (AMCA) Project', 
    category: 'Procurement', 
    date: 'Last Week', 
    desc: 'The Cabinet Committee on Security has cleared the Rs 15,000 crore project to design and develop the Advanced Medium Combat Aircraft (AMCA), India\'s stealth fighter.'
  },
  { 
    title: 'First Batch of Women Agniveers Pass Out from INS Chilka', 
    category: 'Personnel', 
    date: '2 Weeks Ago', 
    desc: 'Creating history, the first batch of Agniveers, including 273 women, passed out from the portal of INS Chilka after successful completion of their training.'
  }
]

export default function FreeResourcesPage() {
  const [activeTab, setActiveTab] = useState('static-gk')
  const [activeSubTab, setActiveSubTab] = useState('services-info')

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#0f172a] rounded-[48px] p-16 overflow-hidden text-center border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
           <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 mb-6">
             <BookOpen className="w-3 h-3 text-emerald-400" />
             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Open Source Intelligence</span>
           </div>
           
           <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
             INDIA'S #1 <span className="text-emerald-500">Resource Library</span>
           </h1>
           
           <p className="text-slate-400 max-w-2xl text-lg leading-relaxed font-bold">
             The most comprehensive, curated open-source database for SSB Interview preparation. Access thousands of GD topics, PIQ questions, daily blogs, and masterclass videos.
           </p>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all border
              ${activeTab === tab.id ? 'bg-[#162840] text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] border-emerald-500/40 scale-105' : 'bg-[#162840]/40 text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'}
            `}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-400' : ''}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-[#162840] rounded-[48px] p-8 md:p-12 border border-[#1E3A5F] min-h-[500px] shadow-2xl relative overflow-hidden"
        >
          {activeTab === 'static-gk' && (
            <div className="space-y-12 relative z-10">
              <div className="flex flex-wrap gap-3 border-b border-white/5 pb-6">
                {GK_SUBTABS.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubTab(sub.id)}
                    className={`
                      px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 transition-all border
                      ${activeSubTab === sub.id ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg' : 'bg-[#0f172a] text-slate-500 border-white/5 hover:border-white/10'}
                    `}
                  >
                    <sub.icon className="w-3.5 h-3.5" />
                    {sub.label}
                  </button>
                ))}
              </div>

              {activeSubTab === 'services-info' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {SERVICES_DATA.map((service) => (
                    <div 
                      key={service.name}
                      className={`
                        ${service.bgColor} ${service.borderColor} border rounded-[32px] p-8 flex flex-col h-full
                        transition-all hover:shadow-2xl cursor-default group
                      `}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Shield className={`w-8 h-8 ${service.iconColor} group-hover:scale-110 transition-transform`} />
                        <h3 className={`text-2xl font-black uppercase tracking-tight ${service.labelColor}`}>{service.name}</h3>
                      </div>
                      <div className="space-y-5 flex-1">
                        <div className="bg-black/20 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Motto</p>
                          <p className="text-sm font-bold text-slate-200 leading-snug">{service.motto}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Service Day</p>
                          <p className="text-sm font-bold text-slate-200">{service.day}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Headquarters</p>
                          <p className="text-sm font-bold text-slate-200">{service.headquarters}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Chief</p>
                          <p className="text-sm font-bold text-slate-200 leading-tight">{service.chief}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}


              {activeSubTab === 'ranks' && (
                <div className="space-y-8">
                  {[
                    { service: 'Indian Army', color: 'green', ranks: ['Field Marshal', 'General', 'Lieutenant General', 'Major General', 'Brigadier', 'Colonel', 'Lieutenant Colonel', 'Major', 'Captain', 'Lieutenant', 'Second Lieutenant'] },
                    { service: 'Indian Navy', color: 'blue', ranks: ['Admiral of the Fleet', 'Admiral', 'Vice Admiral', 'Rear Admiral', 'Commodore', 'Captain', 'Commander', 'Lieutenant Commander', 'Lieutenant', 'Sub Lieutenant', 'Midshipman'] },
                    { service: 'Indian Air Force', color: 'sky', ranks: ['Marshal of the Air Force', 'Air Chief Marshal', 'Air Marshal', 'Air Vice Marshal', 'Air Commodore', 'Group Captain', 'Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer', 'Pilot Officer'] },
                  ].map((s) => (
                    <div key={s.service} className={`bg-${s.color}-500/5 border border-${s.color}-500/20 rounded-[32px] p-8`}>
                      <h4 className={`text-sm font-black text-${s.color}-400 uppercase tracking-widest mb-6 flex items-center gap-3`}>
                        <Award className="w-5 h-5" /> {s.service} — Officer Ranks (Senior → Junior)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {s.ranks.map((rank, i) => (
                          <div key={i} className="bg-black/20 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
                            <span className={`text-[10px] font-black text-${s.color}-500 bg-${s.color}-500/10 px-2 py-1 rounded`}>{i + 1}</span>
                            <span className="text-sm font-bold text-slate-200">{rank}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSubTab === 'commands' && (
                <div className="space-y-8">
                  {[
                    { service: 'Indian Army Commands', color: 'green', items: [
                      { name: 'Northern Command', hq: 'Udhampur', area: 'J&K, Ladakh' },
                      { name: 'Western Command', hq: 'Chandimandir', area: 'Punjab, Haryana, HP' },
                      { name: 'South Western Command', hq: 'Jaipur', area: 'Rajasthan, Gujarat' },
                      { name: 'Southern Command', hq: 'Pune', area: 'Maharashtra, Karnataka, TN, Kerala' },
                      { name: 'Eastern Command', hq: 'Kolkata', area: 'NE States, West Bengal' },
                      { name: 'Central Command', hq: 'Lucknow', area: 'UP, MP' },
                      { name: 'Army Training Command (ARTRAC)', hq: 'Shimla', area: 'All Training' },
                    ]},
                    { service: 'Indian Navy Commands', color: 'blue', items: [
                      { name: 'Western Naval Command', hq: 'Mumbai', area: 'Arabian Sea' },
                      { name: 'Eastern Naval Command', hq: 'Visakhapatnam', area: 'Bay of Bengal' },
                      { name: 'Southern Naval Command', hq: 'Kochi', area: 'Training Command' },
                      { name: 'Andaman & Nicobar Command', hq: 'Port Blair', area: 'Tri-Service (Joint)' },
                    ]},
                    { service: 'Indian Air Force Commands', color: 'sky', items: [
                      { name: 'Western Air Command', hq: 'New Delhi', area: 'Northern India' },
                      { name: 'Eastern Air Command', hq: 'Shillong', area: 'NE Region' },
                      { name: 'Central Air Command', hq: 'Prayagraj', area: 'Central India' },
                      { name: 'South Western Air Command', hq: 'Gandhinagar', area: 'Western India' },
                      { name: 'Southern Air Command', hq: 'Thiruvananthapuram', area: 'Southern India' },
                      { name: 'Training Command', hq: 'Bangalore', area: 'All Training' },
                      { name: 'Maintenance Command', hq: 'Nagpur', area: 'All Maintenance' },
                    ]},
                  ].map((cmd) => (
                    <div key={cmd.service} className={`bg-${cmd.color}-500/5 border border-${cmd.color}-500/20 rounded-[32px] p-8`}>
                      <h4 className={`text-sm font-black text-${cmd.color}-400 uppercase tracking-widest mb-6 flex items-center gap-3`}>
                        <MapPin className="w-5 h-5" /> {cmd.service}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cmd.items.map((item, i) => (
                          <div key={i} className="bg-black/20 rounded-2xl p-5 border border-white/5">
                            <p className="text-base font-black text-white mb-2">{item.name}</p>
                            <div className="flex gap-4">
                              <div><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">HQ:</span> <span className="text-xs font-bold text-slate-300">{item.hq}</span></div>
                              <div><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Area:</span> <span className="text-xs font-bold text-slate-300">{item.area}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'gd-topics' && (
            <div className="space-y-12 relative z-10">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                   <Users className="text-emerald-500 w-8 h-8" /> Group Discussion Databank
                 </h3>
                 <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                   {gdTopicsData.reduce((acc, cat) => acc + cat.topics.length, 0)} Active Topics
                 </span>
              </div>
              
              <div className="space-y-12">
                {gdTopicsData.map((category, idx) => (
                  <div key={idx}>
                    <h4 className="text-sm font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> {category.category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.topics.map((topic, i) => (
                        <div key={i} className="bg-[#0f172a] rounded-[24px] p-6 border border-white/5 hover:border-emerald-500/30 transition-all group shadow-xl">
                          <h3 className="text-lg font-black text-white leading-tight mb-3 group-hover:text-emerald-400 transition-colors">{topic.title}</h3>
                          <p className="text-xs font-bold text-slate-500 leading-relaxed">{topic.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'interview-questions' && (
            <div className="space-y-12 relative z-10">
              <div className="bg-[#0f172a] rounded-[40px] p-10 border border-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <HelpCircle className="text-emerald-500 w-8 h-8" /> High-Yield Personal Interview Questions
                  </h3>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                    100+ Questions Based on Real SSB
                  </span>
                </div>
                
                <div className="space-y-12">
                  {interviewQuestionsExpanded.map((cat, idx) => (
                     <div key={idx} className="space-y-4">
                        <h4 className="text-sm font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                           <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> {cat.category}
                        </h4>
                        <div className="space-y-2 max-w-4xl">
                           {cat.questions.map((q, i) => (
                             <div key={i} className="flex gap-4 items-start group p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                               <span className="text-xl font-black text-emerald-900 group-hover:text-emerald-500 transition-colors w-6">{i + 1}</span>
                               <p className="text-slate-300 font-bold text-lg leading-relaxed pt-0.5 group-hover:text-white transition-colors">{q}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lecturette-topics' && (
            <div className="space-y-12 relative z-10">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                   <BookOpen className="text-yellow-500 w-8 h-8" /> Lecturette Topics Databank
                 </h3>
                 <span className="text-[10px] font-black text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 uppercase tracking-widest">
                   {lecturetteTopicsData.boards.reduce((acc: number, b: any) => acc + b.topics.length, 0)} Topics Available
                 </span>
              </div>
              
              <div className="space-y-12">
                {lecturetteTopicsData.boards.map((board: any, idx: number) => (
                  <div key={idx}>
                    <h4 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> {board.name}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {board.topics.map((topic: string, i: number) => (
                        <div key={i} className="bg-[#0f172a] rounded-xl px-4 py-2 border border-white/5 hover:border-yellow-500/30 transition-all group shadow-sm">
                          <p className="text-xs font-bold text-slate-300 group-hover:text-yellow-400 transition-colors">{topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {activeTab === 'video-masterclass' && (
            <div className="space-y-12 relative z-10">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                   <Video className="text-red-500 w-8 h-8" /> Video Masterclass Hub
                 </h3>
                 <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-widest flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span> CURATED FROM YOUTUBE
                 </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {youtubeVideosData.map((vid: any, i: number) => (
                  <a href={vid.url} target="_blank" rel="noopener noreferrer" key={i} className="bg-[#0f172a] rounded-[32px] overflow-hidden border border-white/5 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] transition-all cursor-pointer group relative flex flex-col">
                     <div className="h-48 w-full relative overflow-hidden bg-slate-900 border-b border-white/5">
                       <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="w-14 h-14 text-white/80 group-hover:text-red-500 group-hover:scale-110 transition-all drop-shadow-2xl" />
                       </div>
                       <span className="absolute bottom-4 right-4 bg-black/90 text-white text-[10px] font-black px-2.5 py-1 rounded backdrop-blur-md border border-white/10">
                         {vid.duration}
                       </span>
                       <span className="absolute top-4 left-4 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-lg">
                         {vid.tag}
                       </span>
                     </div>
                     <div className="p-6 flex-1 flex flex-col justify-between">
                       <h4 className="text-base font-black text-white leading-snug mb-4 group-hover:text-red-400 transition-colors line-clamp-2">{vid.title}</h4>
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg w-fit">
                            <Video className="w-3.5 h-3.5 text-red-500" /> {vid.channel}
                          </p>
                          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-red-400 transition-colors flex items-center">Play on YouTube <ChevronRight className="w-3 h-3 inline" /></div>
                       </div>
                     </div>
                  </a>
                ))}
              </div>
            </div>
          )}


        </motion.div>
      </AnimatePresence>

    </div>
  )
}
