import React from 'react';
import { ShieldAlert, Navigation } from 'lucide-react';

interface GPEScenarioMapProps {
    phase: 'READING' | 'WRITING';
    scenario: any;
}

export function GPEScenarioMap({ phase, scenario }: GPEScenarioMapProps) {
    const locations = scenario?.locations;
    const basePoint = locations?.base ? [locations.base] : [];
    const otherPoints = locations?.points || [];
    const allPoints = [...basePoint, ...otherPoints];

    return (
        <div className={`w-full md:w-1/2 bg-slate-800 border-r border-white/10 relative transition-all duration-1000 ease-in-out overflow-hidden ${phase === 'WRITING' ? 'filter blur-[10px] grayscale brightness-50 pointer-events-none' : ''}`}>
            {/* Terrain Background with Topographical Lines */}
            <div className="absolute inset-0 z-0">
                {/* Base terrain gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-slate-700/30 to-amber-900/20"></div>
                {/* Grid overlay */}
                <div className="absolute inset-0 z-0 opacity-15" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                {/* Topographical contour lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 0 15 Q 25 25 50 15 T 100 20" stroke="#10b981" strokeWidth="0.2" fill="none" />
                    <path d="M 0 35 Q 25 45 50 35 T 100 40" stroke="#10b981" strokeWidth="0.2" fill="none" />
                    <path d="M 0 60 Q 25 70 50 60 T 100 65" stroke="#10b981" strokeWidth="0.2" fill="none" />
                    <path d="M 0 80 Q 25 90 50 80 T 100 85" stroke="#10b981" strokeWidth="0.2" fill="none" />
                    {/* Hills */}
                    <ellipse cx="75" cy="25" rx="15" ry="10" stroke="#10b981" strokeWidth="0.2" fill="none" />
                    <ellipse cx="75" cy="25" rx="10" ry="7" stroke="#10b981" strokeWidth="0.2" fill="none" />
                    <ellipse cx="25" cy="80" rx="20" ry="12" stroke="#10b981" strokeWidth="0.2" fill="none" />
                </svg>
            </div>
            
            {/* Scale & Compass */}
            <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 rounded shadow-glass font-mono tracking-widest text-[10px] uppercase text-emerald-400 border border-emerald-500/30 z-20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gradient-to-r from-emerald-500 to-transparent rounded-full"></div>
                    <span>1 cm = 1 KM</span>
                </div>
            </div>
            <div className="absolute top-4 right-4 bg-black/80 w-14 h-14 rounded-full border border-white/10 flex flex-col items-center justify-center shadow-glass z-20 backdrop-blur-sm">
                <span className="text-red-500 text-sm font-black">N</span>
                <div className="w-0.5 h-8 bg-gradient-to-b from-red-500 to-white"></div>
                <span className="text-slate-400 text-[10px]">S</span>
            </div>

            {/* Distance Markers */}
            {phase === 'READING' && (
                <div className="absolute bottom-16 left-4 bg-black/80 px-3 py-1 rounded text-[8px] font-mono text-slate-400 z-20">
                    <div>Dynamic Map Mode</div>
                    <div>Scale: Approximate</div>
                </div>
            )}
            
            {/* Interactive Map Elements */}
            {phase === 'READING' && (
                <>
                    {/* River with animated flow */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>
                        {/* River path */}
                        <path d="M 0 50 Q 20 60 40 45 T 70 55 T 100 45" stroke="url(#riverGradient)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
                        {/* Roads */}
                        <path d="M 25 85 L 55 50 L 80 25" stroke="#78716c" strokeWidth="0.5" fill="none" strokeDasharray="1,1" opacity="0.6" />
                        <path d="M 25 85 L 50 85 L 75 65" stroke="#78716c" strokeWidth="0.5" fill="none" strokeDasharray="1,1" opacity="0.6" />
                    </svg>

                    {/* Dynamic Location Markers */}
                    {allPoints.map((point: any, i: number) => {
                        const pos = { x: point.x, y: point.y };
                        const label = point.name;
                        // Assign some basic coloring based on the first word or random
                        let colorClass = "bg-blue-600 border-blue-400 text-blue-500";
                        if (i === 0) colorClass = "bg-emerald-500/30 border-emerald-500 text-emerald-500";
                        if (i === allPoints.length - 1) colorClass = "bg-red-500/30 border-red-500 text-red-500";

                        return (
                            <div 
                                key={i}
                                className="absolute z-20 group cursor-pointer"
                                style={{ top: `${pos.y}%`, left: `${pos.x}%`, transform: 'translate(-50%, -50%)' }}
                            >
                                <div className="relative">
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${colorClass} backdrop-blur-md`}>
                                        <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                                    </div>
                                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider ${colorClass.split(' ')[2]}`}>
                                        {label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
            
            {/* Map Legend */}
            {phase === 'READING' && (
                <div className="absolute bottom-4 right-4 bg-black/80 p-3 rounded-lg border border-white/10 z-20 backdrop-blur-sm">
                    <div className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-2">Legend</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-[7px] text-slate-300">Critical</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-[7px] text-slate-300">Start</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-blue-600"></div>
                            <span className="text-[7px] text-slate-300">Location</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
