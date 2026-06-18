'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Hand, LightbulbIcon, Lock, Menu, Play, RotateCcw, ShieldAlert, Zap } from 'lucide-react';

const TOTAL_LEVELS = 70;

type Tool = 'FATTA' | 'BALLI' | 'ROPE' | 'NONE';
type ZoneColor = 'WHITE' | 'RED' | 'BLUE' | 'YELLOW';

interface Platform {
  id: string;
  x: number;
  width: number;
  color: ZoneColor;
  label: string;
}

interface PlacedTool {
  id: string;
  tool: Tool;
  fromPlatformId: string;
  toPlatformId: string;
}

const LEVEL_1_SCENARIO: Platform[] = [
  { id: 'start', x: 0, width: 4, color: 'WHITE', label: 'START LINE' },
  { id: 'p1', x: 8, width: 3, color: 'RED', label: 'RED BARREL' },
  { id: 'p2', x: 14, width: 3, color: 'BLUE', label: 'BLUE DRUM' },
  { id: 'finish', x: 20, width: 4, color: 'YELLOW', label: 'FINISH LINE' }
];

const TOOL_LENGTH: Record<Exclude<Tool, 'NONE'>, number> = {
  FATTA: 6,
  BALLI: 8,
  ROPE: 10
};

export default function GtoSimulator() {
  const [currentScreen, setCurrentScreen] = useState<'MAP' | 'SIMULATOR'>('MAP');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [heldTool, setHeldTool] = useState<Tool>('NONE');
  const [placedTools, setPlacedTools] = useState<PlacedTool[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [penaltyLog, setPenaltyLog] = useState<{ msg: string; type: 'error' | 'success' }[]>([
    { msg: 'Select a level to deploy the engine.', type: 'success' }
  ]);
  const [showHint, setShowHint] = useState(false);

  const levels = useMemo(() => Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1), []);

  const logMsg = (msg: string, type: 'error' | 'success') => {
    setPenaltyLog(prev => [{ msg, type }, ...prev].slice(0, 20));
  };

  const resetSandbox = () => {
    setHeldTool('NONE');
    setPlacedTools([]);
    setSelectedPlatform(null);
    setPenaltyLog([{ msg: 'Level initiated. Awaiting candidate action.', type: 'success' }]);
    setShowHint(false);
  };

  const handleLevelSelect = (level: number) => {
    if (level > unlockedLevel) return;
    setSelectedLevel(level);
    resetSandbox();
    setCurrentScreen('SIMULATOR');
    logMsg(`Level ${level} loaded. Strict bounds active.`, 'success');
  };

  const handlePlatformClick = (platform: Platform) => {
    if (heldTool === 'NONE') {
      if (platform.color === 'RED') {
        logMsg('Rule of Colors Violation: men cannot step on RED.', 'error');
      } else {
        logMsg(`Candidate stepped on ${platform.label} safely.`, 'success');
      }
      return;
    }

    if (heldTool === 'ROPE') {
      logMsg('Rope selected. Use FATTA or BALLI for this bridge test.', 'success');
      setHeldTool('NONE');
      return;
    }

    if (!selectedPlatform) {
      setSelectedPlatform(platform.id);
      logMsg(`Anchor point 1 set on ${platform.label}. Select second anchor.`, 'success');
      return;
    }

    if (selectedPlatform === platform.id) {
      setSelectedPlatform(null);
      logMsg('Selection cancelled.', 'success');
      return;
    }

    const fromPlat = LEVEL_1_SCENARIO.find(p => p.id === selectedPlatform);
    if (!fromPlat) return;

    if (fromPlat.color === 'RED' || platform.color === 'RED') {
      logMsg('Rule of Colors Violation: material cannot touch RED.', 'error');
      setSelectedPlatform(null);
      setHeldTool('NONE');
      return;
    }

    if (fromPlat.color === 'BLUE' || platform.color === 'BLUE') {
      logMsg('Material cannot be placed on BLUE in this sandbox.', 'error');
      setSelectedPlatform(null);
      setHeldTool('NONE');
      return;
    }

    const distance = Math.abs(platform.x - fromPlat.x) - (fromPlat.width / 2 + platform.width / 2);
    const toolLength = TOOL_LENGTH[heldTool as Exclude<Tool, 'NONE'>];

    if (distance > toolLength) {
      logMsg(`Physics violation: ${heldTool} cannot bridge a ${distance.toFixed(1)}ft gap.`, 'error');
    } else {
      setPlacedTools(prev => [...prev, {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tool: heldTool,
        fromPlatformId: fromPlat.id,
        toPlatformId: platform.id
      }]);
      logMsg(`${heldTool} placed successfully between ${fromPlat.label} and ${platform.label}.`, 'success');
      if (platform.id === 'finish' || fromPlat.id === 'finish') {
        logMsg('TASK COMPLETED! Bridging successful to Finish Line.', 'success');
        if (selectedLevel === unlockedLevel) setUnlockedLevel(prev => prev + 1);
      }
    }

    setSelectedPlatform(null);
    setHeldTool('NONE');
  };

  return (
    <div className="w-full bg-[#050B14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-slate-200 min-h-[760px] flex flex-col relative select-none">
      <header className="bg-[#0f172a] border-b border-emerald-900/50 p-5 flex justify-between items-center z-20 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-black tracking-widest uppercase text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 border border-emerald-400 flex items-center justify-center text-xs text-white font-black uppercase shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              GTO
            </span>
            Karmana <span className="text-emerald-500">Physics Engine</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-widest uppercase text-emerald-500/80">
            SSB Progressive Group Task Simulator • Strict Bounds Active
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          {currentScreen === 'SIMULATOR' && (
            <button
              onClick={() => setCurrentScreen('MAP')}
              className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-white hover:text-emerald-400 bg-white/5 px-4 py-2 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Menu className="w-4 h-4" /> Levels
            </button>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {currentScreen === 'MAP' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 p-8 overflow-y-auto custom-scrollbar relative"
          >
            <div className="absolute inset-0 bg-emerald-500/5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>

            <div className="text-center mb-12 relative z-10">
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
                Tactical <span className="text-emerald-500">Grid</span>
              </h3>
              <p className="text-slate-400 font-bold max-w-xl mx-auto text-sm uppercase tracking-widest">
                Progressive Group Tasks (1-40) • Half Group Tasks (41-55) • Command Tasks (56-70)
              </p>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-4 max-w-6xl mx-auto relative z-10">
              {levels.map(levelId => {
                const isUnlocked = levelId <= unlockedLevel;
                const typeClass = levelId > 55
                  ? 'from-purple-600 to-purple-900 border-purple-500/50'
                  : levelId > 40
                    ? 'from-blue-600 to-blue-900 border-blue-500/50'
                    : 'from-emerald-600 to-emerald-900 border-emerald-500/50';

                return (
                  <button
                    key={levelId}
                    onClick={() => handleLevelSelect(levelId)}
                    disabled={!isUnlocked}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all ${
                      isUnlocked
                        ? `bg-gradient-to-br ${typeClass} hover:scale-105 hover:shadow-[0_0_25px_rgba(52,211,153,0.4)] cursor-pointer text-white`
                        : 'bg-gradient-to-br from-[#0f172a] to-[#020617] border-white/5 text-slate-700 cursor-not-allowed'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <span className="text-2xl font-black tracking-tighter drop-shadow-md">{levelId}</span>
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/50 absolute bottom-2">Unlocked</span>
                      </>
                    ) : (
                      <Lock className="w-6 h-6 mb-1 opacity-20" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-4 relative z-10">
              {[
                { label: 'PGT', color: 'bg-emerald-500' },
                { label: 'HGT', color: 'bg-blue-500' },
                { label: 'CT', color: 'bg-purple-500' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <div className={`w-3 h-3 rounded ${item.color}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col relative bg-[#0a1120]"
          >
            <div className="flex-1 relative overflow-hidden flex flex-col justify-end">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-repeat opacity-20"></div>
              <div className="absolute top-8 left-8 text-emerald-500 font-black tracking-widest uppercase text-xl">
                Level {selectedLevel} <span className="text-slate-500 text-sm">/ Progressive Group Task</span>
              </div>

              <div className="absolute top-8 right-8 flex gap-3">
                <button
                  onClick={resetSandbox}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 border border-white/10 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <div className="relative w-full h-96 pb-20 px-20 flex items-end">
                {LEVEL_1_SCENARIO.map(plat => {
                  const leftPx = plat.x * 40;
                  const widthPx = plat.width * 40;
                  const isSelected = selectedPlatform === plat.id;

                  let bgColor = 'bg-slate-300';
                  let borderColor = 'border-slate-100';
                  if (plat.color === 'RED') { bgColor = 'bg-red-500'; borderColor = 'border-red-300'; }
                  if (plat.color === 'BLUE') { bgColor = 'bg-blue-500'; borderColor = 'border-blue-300'; }
                  if (plat.color === 'YELLOW') { bgColor = 'bg-yellow-500'; borderColor = 'border-yellow-300'; }
                  if (plat.color === 'WHITE') { bgColor = 'bg-white'; borderColor = 'border-white'; }

                  return (
                    <div
                      key={plat.id}
                      onClick={() => handlePlatformClick(plat)}
                      className={`absolute bottom-10 h-32 flex flex-col items-center justify-start cursor-pointer group transition-all ${
                        isSelected ? 'shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-[1.02] z-20' : 'hover:brightness-125 z-10'
                      }`}
                      style={{ left: `${leftPx}px`, width: `${widthPx}px` }}
                    >
                      <div className={`w-full h-8 ${bgColor} border-t-4 border-l-4 ${borderColor} skew-x-[-20deg] origin-bottom-left shadow-lg`}></div>
                      <div className={`w-full h-full ${bgColor} brightness-75 border-l-4 ${borderColor} border-opacity-50 relative flex items-center justify-center`}>
                        <span className="text-[10px] font-black text-black/50 rotate-90 whitespace-nowrap tracking-widest">{plat.label}</span>
                      </div>

                      {isSelected && (
                        <div className="absolute -top-10 text-[10px] font-black bg-emerald-500 text-black px-2 py-1 rounded animate-bounce tracking-widest">
                          TARGETING
                        </div>
                      )}
                    </div>
                  );
                })}

                {placedTools.map(t => {
                  const fromP = LEVEL_1_SCENARIO.find(p => p.id === t.fromPlatformId);
                  const toP = LEVEL_1_SCENARIO.find(p => p.id === t.toPlatformId);
                  if (!fromP || !toP) return null;

                  const startX = fromP.x * 40 + fromP.width * 20;
                  const endX = toP.x * 40 + toP.width * 20;
                  const left = Math.min(startX, endX);
                  const width = Math.abs(endX - startX);

                  return (
                    <motion.div
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      key={t.id}
                      className={`absolute bottom-[160px] h-3 z-30 shadow-2xl flex items-center justify-center ${
                        t.tool === 'FATTA'
                          ? 'bg-amber-600 border-t-2 border-amber-400'
                          : 'bg-orange-800 border-t-2 border-orange-600 rounded-full h-4'
                      }`}
                      style={{ left: `${left}px`, width: `${width}px` }}
                    >
                      <span className="text-[8px] font-black text-white/50 tracking-widest bg-black/50 px-1 rounded">
                        {t.tool}
                      </span>
                    </motion.div>
                  );
                })}

                <div className="absolute bottom-10 left-0 w-full h-1 bg-white/10 z-0"></div>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-yellow-500/50 rounded-2xl p-6 flex gap-4 shadow-[0_0_50px_rgba(234,179,8,0.15)] max-w-lg z-50"
                    >
                      <LightbulbIcon className="w-8 h-8 text-yellow-500 shrink-0" />
                      <div>
                        <h4 className="text-yellow-500 font-black uppercase tracking-widest text-[10px] mb-1">GTO Guidance</h4>
                        <p className="text-slate-300 text-sm font-bold leading-relaxed">
                          The finish line is only reachable after solving the bridge gap with a valid tool placement.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="h-72 bg-[#0f172a] border-t border-emerald-900/50 flex flex-col md:flex-row relative z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="w-full md:w-1/3 p-8 border-r border-white/5 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px]"></div>
                <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-500 mb-6 flex items-center gap-2 relative z-10">
                  <Hand className="w-4 h-4" /> Squad Loadout
                </h4>
                <div className="grid grid-cols-2 gap-4 flex-1 relative z-10">
                  {(['FATTA', 'BALLI', 'ROPE', 'NONE'] as Tool[]).map(tool => (
                    <button
                      key={tool}
                      onClick={() => {
                        setHeldTool(tool);
                        setSelectedPlatform(null);
                      }}
                      className={`rounded-xl border font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center ${
                        heldTool === tool
                          ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105'
                          : 'bg-black/40 border-white/10 text-slate-500 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {tool === 'FATTA' && <span className="w-8 h-1 bg-current rounded mr-2"></span>}
                      {tool === 'BALLI' && <span className="w-8 h-2 bg-current rounded-full mr-2"></span>}
                      {tool}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4 text-center">
                  Select tool, then click 2 structures to bridge
                </p>
              </div>

              <div className="flex-1 p-8 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-500 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Physics Evaluator Log
                  </h4>
                  <button
                    onClick={() => setShowHint(v => !v)}
                    className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-yellow-500 hover:text-black hover:bg-yellow-500 px-4 py-2 rounded-xl border border-yellow-500/30 transition-all"
                  >
                    <Zap className="w-3 h-3" /> Hint
                  </button>
                </div>
                <div className="flex-1 bg-[#020617] rounded-2xl border border-white/5 p-5 overflow-y-auto custom-scrollbar font-mono text-[11px] leading-relaxed flex flex-col gap-3 shadow-inner">
                  {penaltyLog.map((log, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className={`p-3 rounded-lg border-l-4 flex items-start gap-3 ${
                        log.type === 'error'
                          ? 'bg-red-500/10 border-red-500 text-red-200'
                          : 'bg-emerald-500/10 border-emerald-500 text-emerald-200'
                      }`}
                    >
                      {log.type === 'error'
                        ? <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                        : <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                      <span className="font-bold">{log.msg}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
