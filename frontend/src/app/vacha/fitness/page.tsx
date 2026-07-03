'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Dumbbell, Timer, Zap, Loader2, ShieldCheck, Crosshair, Map, ShieldAlert, Lock, Unlock, ArrowLeft, Heart, Scale, Ruler } from 'lucide-react'
import Link from 'next/link'

const INDIVIDUAL_OBSTACLES = [
    { name: 'Single Ramp', reqRunMinutes: 14, reqPushups: 0, reqPullups: 0, icon: '📈' },
    { name: 'Double Barrel Jump', reqRunMinutes: 12, reqPushups: 0, reqPullups: 0, icon: '🛢️' },
    { name: 'Balancing Beam', reqRunMinutes: 15, reqPushups: 20, reqPullups: 0, icon: '⚖️' },
    { name: 'Screen Jump', reqRunMinutes: 11, reqPushups: 10, reqPullups: 0, icon: '🪟' },
    { name: 'Parallel Ropes', reqRunMinutes: 15, reqPushups: 30, reqPullups: 6, icon: '➰' },
    { name: 'Double Platform', reqRunMinutes: 12, reqPushups: 20, reqPullups: 8, icon: '🪜' },
    { name: 'Double Ditch', reqRunMinutes: 10, reqPushups: 20, reqPullups: 0, icon: '🕳️' },
    { name: 'Commando Walk', reqRunMinutes: 13, reqPushups: 30, reqPullups: 4, icon: '🌉' },
    { name: "Tarzan's Swing", reqRunMinutes: 15, reqPushups: 40, reqPullups: 12, icon: '🧗' },
    { name: "Tiger's Leap", reqRunMinutes: 15, reqPushups: 45, reqPullups: 15, icon: '🐅' }
]

const parseRunTimeToMinutes = (timeStr: string) => {
    const parts = timeStr.split(':')
    if (parts.length === 2) return parseInt(parts[0]) + (parseInt(parts[1]) / 60)
    return 20
}

interface WorkoutPlan {
    pti_assessment: string;
    nutrition_directive: string;
    projected_12_week_outcome: {
        run_2_4km_time: string;
        pushups: string;
        pullups: string;
    };
    routine_phases: {
        phase_name: string;
        focus: string;
        weekly_schedule: { day: string; workout: string }[];
    }[];
}

export default function PhysicalTrainingPage() {
    const [height, setHeight] = useState<string>('175')
    const [weight, setWeight] = useState<string>('70')
    const [currentRun, setCurrentRun] = useState<string>('12:00')
    const [currentPushups, setCurrentPushups] = useState<string>('20')
    const [currentPullups, setCurrentPullups] = useState<string>('2')
    
    const [isGenerating, setIsGenerating] = useState(false)
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
    const [apiError, setApiError] = useState<string | null>(null)

    const [isTracking, setIsTracking] = useState(false)
    const [activeMode, setActiveMode] = useState<'PUSHUPS' | 'RUNNING' | null>(null)
    const [repCount, setRepCount] = useState(0)
    const [stepCount, setStepCount] = useState(0)
    const [sensorError, setSensorError] = useState<string | null>(null)

    const lastYRef = useRef<number>(0)
    const lastZRef = useRef<number>(0)
    const repPhaseRef = useRef<'DOWN' | 'UP'>('DOWN')
    const stepPhaseRef = useRef<'STILL' | 'MOVING'>('STILL')

    const generateWorkoutPlan = async () => {
        setIsGenerating(true)
        setApiError(null)
        const h = parseFloat(height)
        const w = parseFloat(weight)
        const bmi = w / ((h / 100) * (h / 100))

        try {
            const res = await fetch('/api/fitness-coach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    height_cm: h,
                    weight_kg: w,
                    bmi: parseFloat(bmi.toFixed(2)),
                    run_2_4km_time: currentRun,
                    pushups_count: parseInt(currentPushups),
                    situps_count: parseInt(currentPushups),
                    pullups_count: parseInt(currentPullups)
                })
            })
            const data = await res.json()
            if (data.status === 'success') setWorkoutPlan(data.data)
            else throw new Error(data.error)
        } catch (e: any) {
            setApiError(e.message || 'Failed to connect to Master Chief AI.')
        } finally {
            setIsGenerating(false)
        }
    }

    const requestDeviceMotionPermission = async () => {
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceMotionEvent as any).requestPermission()
                if (permissionState === 'granted') startTracking()
                else setSensorError('Permission to access device motion was denied.')
            } catch (error) {
                setSensorError('Error requesting device motion permission.')
            }
        } else startTracking()
    }

    const startTracking = () => {
        if (!activeMode) {
            setSensorError('Select a training mode (Pushups or Running) first.')
            return
        }
        setSensorError(null)
        setRepCount(0)
        setStepCount(0)
        setIsTracking(true)
        window.addEventListener('devicemotion', handleMotion)
    }

    const stopTracking = () => {
        setIsTracking(false)
        window.removeEventListener('devicemotion', handleMotion)
        setActiveMode(null)
    }

    const handleMotion = (event: DeviceMotionEvent) => {
        if (!event.accelerationIncludingGravity) return;
        const { y, z } = event.accelerationIncludingGravity;
        if (activeMode === 'PUSHUPS' && z !== null) {
            if (z > 8 && repPhaseRef.current === 'DOWN') repPhaseRef.current = 'UP'
            else if (z < 1 && repPhaseRef.current === 'UP') {
                repPhaseRef.current = 'DOWN'
                setRepCount(prev => prev + 1)
            }
            lastZRef.current = z
        }
        if (activeMode === 'RUNNING' && y !== null) {
            const deltaY = Math.abs(y - lastYRef.current)
            if (deltaY > 2.5 && stepPhaseRef.current === 'STILL') {
                stepPhaseRef.current = 'MOVING'
                setStepCount(prev => prev + 1)
            } else if (deltaY < 1.0) stepPhaseRef.current = 'STILL'
            lastYRef.current = y
        }
    }

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
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PTI Uplink Active</span>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0f172a] rounded-[48px] p-12 overflow-hidden border border-white/5 relative shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
                <div className="relative z-10 space-y-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
                        <Activity className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Cadet Conditioning</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                        Physical <span className="text-emerald-500">Forge</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl text-lg font-bold">
                        AI-powered progressive overload training protocols. Track your metrics and unlock individual obstacles (IO) benchmarks.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profiler Column */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="bg-[#162840] rounded-[40px] p-10 border border-[#1E3A5F] shadow-2xl space-y-8">
                        <div className="flex items-center gap-3">
                            <Crosshair className="w-6 h-6 text-emerald-500" />
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Cadet Stats</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Height (CM)</label>
                                    <div className="relative">
                                        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                        <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 pl-12 text-white font-black focus:border-emerald-500 transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Weight (KG)</label>
                                    <div className="relative">
                                        <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 pl-12 text-white font-black focus:border-emerald-500 transition-all outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pushups</label>
                                    <input type="number" value={currentPushups} onChange={e => setCurrentPushups(e.target.value)} className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-white font-black focus:border-emerald-500 transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pullups</label>
                                    <input type="number" value={currentPullups} onChange={e => setCurrentPullups(e.target.value)} className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-white font-black focus:border-emerald-500 transition-all outline-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">2.4KM Run Time (MM:SS)</label>
                                <input type="text" value={currentRun} onChange={e => setCurrentRun(e.target.value)} className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-white font-black focus:border-emerald-500 transition-all outline-none" />
                            </div>

                            <button 
                                onClick={generateWorkoutPlan}
                                disabled={isGenerating}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-black py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-emerald-600/20 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                            >
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                                {isGenerating ? 'Analyzing Vitals...' : 'Generate 12-Week Protocol'}
                            </button>
                        </div>
                    </section>

                    <section className="bg-[#162840] rounded-[40px] p-10 border border-[#1E3A5F] shadow-2xl space-y-6">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-blue-500" />
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Live Telemetry</h2>
                        </div>
                        
                        {!isTracking ? (
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => { setActiveMode('PUSHUPS'); requestDeviceMotionPermission(); }} className="p-6 rounded-3xl bg-[#0f172a] border border-white/5 text-slate-500 hover:text-white hover:border-blue-500 transition-all flex flex-col items-center gap-3">
                                    <Dumbbell className="w-8 h-8" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Pushups</span>
                                </button>
                                <button onClick={() => { setActiveMode('RUNNING'); requestDeviceMotionPermission(); }} className="p-6 rounded-3xl bg-[#0f172a] border border-white/5 text-slate-500 hover:text-white hover:border-blue-500 transition-all flex flex-col items-center gap-3">
                                    <Timer className="w-8 h-8" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Running</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-black/40 rounded-[32px] p-10 text-center border border-blue-500/20 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 relative z-10">{activeMode}</p>
                                    <p className="text-7xl font-black text-white relative z-10 tabular-nums">
                                        {activeMode === 'PUSHUPS' ? repCount : stepCount}
                                    </p>
                                </div>
                                <button onClick={stopTracking} className="w-full py-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    Abort Tracking
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                {/* AI Output Column */}
                <div className="lg:col-span-8">
                    {workoutPlan ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#162840] rounded-[48px] p-12 border border-[#1E3A5F] shadow-2xl h-full space-y-12 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                                <ShieldCheck className="w-10 h-10 text-emerald-500" />
                                <div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">PTI Protocol Active</h2>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Master Chief Directive • 12-Week Evolution</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-[#0f172a] rounded-[32px] p-8 border border-white/5">
                                    <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Initial Assessment</h3>
                                    <p className="text-slate-300 text-sm font-bold leading-relaxed italic">"{workoutPlan.pti_assessment}"</p>
                                </div>
                                <div className="bg-[#0f172a] rounded-[32px] p-8 border border-white/5">
                                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Nutritional Intake</h3>
                                    <p className="text-slate-300 text-sm font-bold leading-relaxed">{workoutPlan.nutrition_directive}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4">Phase Evolution</h3>
                                {workoutPlan.routine_phases.map((phase, i) => (
                                    <div key={i} className="bg-[#0f172a] rounded-[32px] border border-white/5 overflow-hidden">
                                        <div className="bg-emerald-500/5 p-8 border-b border-white/5">
                                            <h4 className="text-lg font-black text-white uppercase tracking-tight">{phase.phase_name}</h4>
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">{phase.focus}</p>
                                        </div>
                                        <div className="p-8 grid gap-4">
                                            {phase.weekly_schedule.map((day, di) => (
                                                <div key={di} className="flex gap-6 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-24 shrink-0 mt-1">{day.day}</span>
                                                    <p className="text-slate-300 text-sm font-bold">{day.workout}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-[#162840] rounded-[48px] border-4 border-dashed border-[#1E3A5F] h-full min-h-[600px] flex flex-col items-center justify-center p-12 text-center text-slate-700">
                            <Map className="w-20 h-20 mb-6 opacity-20" />
                            <h3 className="text-2xl font-black uppercase tracking-widest">Protocol Dormant</h3>
                            <p className="text-slate-600 max-w-sm font-bold text-sm mt-2 uppercase tracking-wider">Input vitals to synchronize with Master Chief's training matrix.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Obstacle Matrix */}
            <div className="bg-[#162840] rounded-[48px] p-12 border border-[#1E3A5F] shadow-2xl">
                <div className="flex items-center gap-4 mb-12">
                    <Heart className="w-8 h-8 text-emerald-500" />
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Individual Obstacles (IO)</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">GTO Clearance Capability Matrix</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {INDIVIDUAL_OBSTACLES.map((ob, i) => {
                        const runMins = parseRunTimeToMinutes(currentRun || '14:00');
                        const pshps = parseInt(currentPushups || '0');
                        const pllps = parseInt(currentPullups || '0');
                        const isUnlocked = runMins <= ob.reqRunMinutes && pshps >= ob.reqPushups && pllps >= ob.reqPullups;

                        return (
                            <motion.div key={i} className={`p-8 rounded-[32px] border flex flex-col items-center text-center gap-4 transition-all ${isUnlocked ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-black/20 border-white/5 opacity-40 grayscale'}`}>
                                <div className="text-4xl">{ob.icon}</div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">{ob.name}</h4>
                                {isUnlocked ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest">
                                        <Unlock className="w-3 h-3" /> Ready
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 text-slate-500 rounded-full border border-white/5 text-[8px] font-black uppercase tracking-widest">
                                        <Lock className="w-3 h-3" /> Locked
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}
