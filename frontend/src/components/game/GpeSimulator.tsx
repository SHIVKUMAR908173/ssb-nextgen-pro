'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Map, Navigation, PenTool, CheckCircle, ShieldAlert, Target } from 'lucide-react';
import gpeData from '@/data/gpe_60_sets.json';
import { useTimer } from '@/hooks/useTimer';
import { GPEScenarioMap } from './GPEScenarioMap';

const READING_TIME = 300; // 5 minutes (300 seconds)
const WRITING_TIME = 600; // 10 minutes (600 seconds)
const TOTAL_SETS = 60; // Total GPE sets available

// Type definitions for GPE scenario
interface GPEProblem {
  id: string | number;
  description: string;
  priority: string;
  urgency: string;
  category: string;
}

interface GPELocationPoint {
  name: string;
  x: number;
  y: number;
}

interface GPELocations {
  base: GPELocationPoint;
  points: GPELocationPoint[];
}

interface GPEScenario {
  title: string;
  narrative: string;
  current_time: string;
  deadline: string;
  group_size: string | number;
  resources: string[];
  problems: GPEProblem[];
  locations: GPELocations;
}

interface GPESet {
  set_id: number;
  name: string;
  scenario: GPEScenario;
}

export default function GpeSimulator() {
  const [phase, setPhase] = useState<'IDLE' | 'READING' | 'WRITING' | 'DONE'>('IDLE');
  const [plan, setPlan] = useState('');
  const [selectedSet, setSelectedSet] = useState(0); // Track selected GPE set (0-59)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get the current scenario based on selected set
  // Cycle through the 5 available scenarios for the 60 sets
  const getScenarioForSet = (setIndex: number): GPEScenario | null => {
    const sets = gpeData.sets as GPESet[];
    if (!sets || sets.length === 0) return null;
    
    // Cycle through available scenarios (5 scenarios for 60 sets)
    const scenarioIndex = setIndex % sets.length;
    const gpeSet = sets[scenarioIndex];
    
    return gpeSet?.scenario || null;
  };

  const currentScenario = getScenarioForSet(selectedSet);

  const handleTimerExpireRef = useRef<() => void>(() => {});
  const timer = useTimer({
    initialTime: READING_TIME,
    onExpire: () => handleTimerExpireRef.current?.(),
  });

  handleTimerExpireRef.current = () => {
    if (phase === 'READING') {
      setPhase('WRITING');
      timer.setTimeAndStart(WRITING_TIME);
    } else if (phase === 'WRITING') {
      submitPlan();
    }
  };

  useEffect(() => {
    if (phase === 'WRITING' && textareaRef.current) {
        textareaRef.current.focus();
    }
  }, [phase]);

  const startExercise = () => {
    setPhase('READING');
    timer.setTimeAndStart(READING_TIME);
    setPlan('');
  };

  const submitPlan = () => {
    setPhase('DONE');
  };



  return (
    <div className="w-full max-w-7xl mx-auto bg-charcoal border border-white/10 rounded-3xl shadow-glass overflow-hidden font-sans text-slate-200 min-h-[700px] flex flex-col relative">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-white/10 p-5 flex justify-between items-center z-20 shadow-lg">
        <div>
           <h2 className="text-xl font-black tracking-widest uppercase text-white shadow-neon flex items-center gap-2">
               <Navigation className="text-emerald-400" /> Karmana / Group Planning Exercise (GPE)
           </h2>
           <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest uppercase">
               Strategic Time Coordination & Resource Allocation
           </p>
        </div>
        
        <div className="flex items-center gap-4">
              {phase !== 'IDLE' && phase !== 'DONE' && (
                  <div className="bg-black/60 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 backdrop-blur-md transition-all shadow-glass">
                      <Clock className={`w-4 h-4 ${timer.timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                      <span className={`font-mono font-black text-xl tracking-widest ${timer.timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                          {timer.formattedTime}
                      </span>
                  </div>
              )}
             {phase === 'IDLE' && (
                 <button onClick={startExercise} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest shadow-lg transition-all">Begin GPE</button>
             )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row relative">
         
         {/* Phase Indicator Overlay */}
         <AnimatePresence>
            {phase === 'READING' && (
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-blue-600 border border-blue-400 text-white px-6 py-2 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] font-black uppercase tracking-widest text-sm flex gap-2 items-center">
                   <Map className="w-4 h-4"/> 5 Min Reading Phase
               </motion.div>
            )}
            {phase === 'WRITING' && (
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-red-600 border border-red-400 text-white px-6 py-2 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] font-black uppercase tracking-widest text-sm flex gap-2 items-center">
                   <PenTool className="w-4 h-4"/> 10 Min Writing Phase
               </motion.div>
            )}
         </AnimatePresence>

         {phase === 'IDLE' || phase === 'DONE' ? (
             <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black/40 text-center gap-6">
                 {phase === 'DONE' ? (
                     <>
                         <CheckCircle className="w-20 h-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                         <h3 className="text-3xl font-black uppercase tracking-widest text-white">Solution Submitted</h3>
                         <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-3xl w-full mt-4 text-left custom-scrollbar overflow-y-auto max-h-[400px]">
                             <h4 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4">Your Tactical Plan</h4>
                             <p className="text-slate-300 whitespace-pre-wrap">{plan || "No plan submitted. You froze under pressure."}</p>
                         </div>
                         <button onClick={() => setPhase('IDLE')} className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white uppercase text-[10px] font-bold tracking-widest rounded transition-colors border border-white/5">Return to Briefing</button>
                     </>
                 ) : (
                     <>
                         <Map className="w-20 h-20 text-slate-600" />
                         <h3 className="text-3xl font-black uppercase tracking-widest">GPE Model Sandbox</h3>
                         <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
                             You will first enter the <strong className="text-blue-400">5-Minute Reading Phase</strong> where you must analyze the scale model and narrative without taking notes. Then, the model will be obscured, and you will enter the strict <strong className="text-red-400">10-Minute Writing Phase</strong> to draft your detailed tactical solution.
                         </p>
                         
                         {/* Set Selection Grid */}
                         <div className="w-full max-w-2xl mt-8">
                             <div className="flex items-center justify-between mb-4">
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select GPE Set:</span>
                                 <span className="text-xs font-bold text-emerald-400">Set {selectedSet + 1} of {TOTAL_SETS}</span>
                             </div>
                             <div className="grid grid-cols-12 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                 {Array.from({ length: TOTAL_SETS }, (_, i) => {
                                     const isSelected = i === selectedSet;
                                     const difficulty = i < 20 ? 'bg-green-500/20 border-green-500/30 text-green-500' : 
                                                       i < 40 ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500' : 
                                                       'bg-red-500/20 border-red-500/30 text-red-500';
                                     return (
                                         <button
                                             key={i}
                                             onClick={() => setSelectedSet(i)}
                                             className={`
                                                 aspect-square rounded-lg border text-[8px] font-black transition-all
                                                 ${isSelected ? 'bg-emerald-500 text-white border-emerald-500 scale-110 shadow-lg' : difficulty}
                                                 hover:scale-105
                                             `}
                                         >
                                             {i + 1}
                                         </button>
                                     );
                                 })}
                             </div>
                             {/* Difficulty Legend */}
                             <div className="flex items-center justify-center gap-4 mt-4 text-[8px] font-black uppercase tracking-widest">
                                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Easy (1-20)</span>
                                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Medium (21-40)</span>
                                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Hard (41-60)</span>
                             </div>
                         </div>
                     </>
                 )}
             </div>
         ) : (
             <>
                  {/* Split Screen Left: Interactive Map Model */}
                  {/* Split Screen Left: Interactive Map Model */}
                  <GPEScenarioMap phase={phase} scenario={currentScenario} />

                 {/* Split Screen Right: Narrative & Writing */}
                 <div className="w-full md:w-1/2 flex flex-col bg-charcoal relative">
                     {phase === 'READING' && (
                         <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                                 <ShieldAlert className="w-6 h-6 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                 <h3 className="text-xl font-black uppercase tracking-widest text-white">
                                     {currentScenario?.title || 'Narrative Problem'}
                                 </h3>
                             </div>
                             
                             {currentScenario ? (
                                 <div className="space-y-4 text-sm leading-relaxed text-slate-300 font-medium tracking-wide">
                                     {/* Scenario Narrative */}
                                     <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                         <p className="text-slate-200 leading-relaxed">{currentScenario.narrative}</p>
                                     </div>
                                     
                                     {/* Time Information */}
                                     <div className="flex gap-4">
                                         <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg flex-1">
                                             <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Current Time</div>
                                             <div className="text-lg font-mono font-black text-blue-400">{currentScenario.current_time}</div>
                                         </div>
                                         <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex-1">
                                             <div className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Deadline</div>
                                             <div className="text-lg font-mono font-black text-red-400">{currentScenario.deadline}</div>
                                         </div>
                                     </div>
                                     
                                     {/* Problems List */}
                                     {currentScenario.problems && currentScenario.problems.length > 0 && (
                                         <div>
                                             <h4 className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-2">Problems to Solve:</h4>
                                             <ul className="space-y-2">
                                                 {currentScenario.problems.map((problem) => (
                                                     <li key={problem.id} className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/30 border border-white/5">
                                                         <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                                             problem.priority === 'High' ? 'bg-red-500' : 
                                                             problem.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                         }`}></span>
                                                         <span className="flex-1">{problem.description}</span>
                                                         <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">{problem.category}</span>
                                                     </li>
                                                 ))}
                                             </ul>
                                         </div>
                                     )}
                                     
                                     {/* Resources */}
                                     <div className="bg-amber-500/5 border border-amber-500/30 p-4 rounded-xl shadow-glass backdrop-blur">
                                         <strong className="block text-xs uppercase tracking-widest text-amber-500 mb-2">Available Resources</strong>
                                         <ul className="space-y-1">
                                             {currentScenario.resources.map((resource, idx) => (
                                                 <li key={idx} className="text-slate-300 text-sm flex items-center gap-2">
                                                     <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                                                     {resource}
                                                 </li>
                                             ))}
                                         </ul>
                                     </div>
                                     
                                     {/* Group Size */}
                                     <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg">
                                         <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Group Size</div>
                                         <div className="text-sm font-medium text-emerald-300">{currentScenario.group_size}</div>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="flex items-center justify-center h-full">
                                     <p className="text-slate-500">Loading scenario...</p>
                                 </div>
                             )}
                         </div>
                     )}

                     {phase === 'WRITING' && (
                         <div className="flex-1 flex flex-col p-8 h-full">
                             <div className="flex justify-between items-center mb-6">
                                  <h3 className="text-xl font-black uppercase tracking-[0.2em] text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">Tactical Solution Entry</h3>
                                  <span className="text-xs text-red-400 font-mono font-bold tracking-widest border border-red-500/30 px-3 py-1 bg-red-500/10 rounded">MODEL OBSCURED</span>
                             </div>
                             <textarea 
                                  ref={textareaRef}
                                  value={plan}
                                  onChange={(e) => setPlan(e.target.value)}
                                  placeholder="Formulate your structured solution... 
1. Priorities
2. Resource Allocation (Group splitting)
3. Step-by-step implementation
4. Distance/Time calculations"
                                  className="flex-1 w-full bg-slate-900/80 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none shadow-glass leading-loose"
                             />
                             <div className="mt-6 flex justify-between items-center border-t border-white/10 pt-4">
                                 <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest bg-black/40 px-3 py-1 rounded-full"><span className="text-white">{plan.split(/\s+/).filter(w => w.length > 0).length}</span> Words Logged</p>
                                 <button onClick={submitPlan} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-colors shadow-[0_4px_25px_rgba(16,185,129,0.4)]">
                                     Submit Plan 
                                 </button>
                             </div>
                         </div>
                     )}
                 </div>
             </>
         )}
      </div>
    </div>
  );
}
