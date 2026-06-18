'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Trophy, Timer, Zap, ChevronRight, Star, Shield, ArrowLeft } from 'lucide-react';

// 10 authentic SSB Individual Obstacles with real scoring
const OBSTACLES = [
  { id: 1, name: 'Monkey Crawl', marks: 2, timeLimit: 25, desc: 'Crawl face-up along a horizontal rope using hands and feet', color: 'emerald', instruction: 'Hold the rope with both hands and feet, face upward. Move forward using alternating hand-foot coordination. Don\'t let your body sag!', technique: 'Hook ankles over rope, pull with arms, push with legs in rhythm.' },
  { id: 2, name: 'Double Ditch', marks: 3, timeLimit: 20, desc: 'Jump across two consecutive ditches without stopping', color: 'blue', instruction: 'Sprint and jump the first ditch, maintain momentum, immediately jump the second. Land on both feet.', technique: 'Build speed in approach run. Jump at 45° angle. Use arms for thrust.' },
  { id: 3, name: 'Zig-Zag Balance', marks: 2, timeLimit: 30, desc: 'Walk across a zig-zag wooden beam without falling', color: 'amber', instruction: 'Arms out for balance. Look at the end point, not your feet. Walk heel-to-toe at each turn.', technique: 'Shift weight to the inner foot at each turn. Slow and steady wins.' },
  { id: 4, name: 'High Jump', marks: 4, timeLimit: 15, desc: 'Jump over a bar set at increasing heights', color: 'red', instruction: 'Approach at 30° angle. Plant the takeoff foot firmly. Scissors kick over the bar.', technique: 'Approach from dominant side. Drive knee up aggressively. Arch over the bar.' },
  { id: 5, name: 'Long Jump', marks: 3, timeLimit: 15, desc: 'Clear a marked distance in a single leap', color: 'purple', instruction: 'Full sprint approach. Hit the board with your stronger foot. Extend both legs forward on landing.', technique: 'Build max speed. Jump at 20-25° angle. Swing arms forward on takeoff.' },
  { id: 6, name: 'Rope Climbing', marks: 5, timeLimit: 40, desc: 'Climb a vertical rope to touch the top marker', color: 'orange', instruction: 'Lock the rope between your feet. Pull up with both arms, push up with legs. Alternate grip-pull-push.', technique: 'S-wrap: rope over one foot, under the other. Use legs more than arms to conserve energy.' },
  { id: 7, name: 'Tarzan Swing', marks: 4, timeLimit: 20, desc: 'Swing across a gap using a hanging rope', color: 'cyan', instruction: 'Grip high on the rope. Run and jump, swing your body forward. Release at the highest point.', technique: 'Grip overhand. Tuck knees at bottom of swing for momentum. Extend legs before release.' },
  { id: 8, name: 'Burma Bridge', marks: 3, timeLimit: 35, desc: 'Cross a rope bridge using one foot rope and two hand ropes', color: 'lime', instruction: 'Stand on bottom rope, hold both side ropes. Shuffle sideways. Keep center of gravity low.', technique: 'Move one foot at a time. Grip side ropes firmly. Look ahead, not down.' },
  { id: 9, name: 'Commando Walk', marks: 3, timeLimit: 25, desc: 'Walk across a single log elevated at height', color: 'pink', instruction: 'Step confidently. Arms out to sides. Walk in a straight line looking at the far end.', technique: 'Small quick steps. Engage core for balance. Don\'t stop in the middle.' },
  { id: 10, name: 'Screen Jump', marks: 5, timeLimit: 20, desc: 'Jump from height onto a net/screen and climb down', color: 'yellow', instruction: 'Stand at the edge. Jump outward (not downward). Grab the net on landing. Climb down controlled.', technique: 'Bend knees on impact. Grab with both hands immediately. Descend using 3-point contact.' },
];

type GameState = 'menu' | 'briefing' | 'playing' | 'result' | 'summary';

interface ObstacleResult {
  obstacleId: number;
  completed: boolean;
  timeTaken: number;
  score: number;
}

export default function IOObstacleGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentObstacle, setCurrentObstacle] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [results, setResults] = useState<ObstacleResult[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [requiredClicks, setRequiredClicks] = useState(0);
  const [phase, setPhase] = useState<'approach' | 'execute' | 'finish'>('approach');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const obstacle = OBSTACLES[currentObstacle];

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev >= obstacle.timeLimit) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            handleObstacleEnd(false);
            return prev;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning, obstacle?.timeLimit]);

  const startGame = () => {
    setCurrentObstacle(0);
    setResults([]);
    setGameState('briefing');
  };

  const startObstacle = () => {
    setTimer(0);
    setClickCount(0);
    setPhase('approach');
    const clicks = Math.floor(Math.random() * 5) + 8; // 8-12 clicks needed
    setRequiredClicks(clicks);
    setIsTimerRunning(true);
    setGameState('playing');
  };

  const handleClick = () => {
    if (!isTimerRunning) return;
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount <= Math.floor(requiredClicks * 0.3)) {
      setPhase('approach');
    } else if (newCount <= Math.floor(requiredClicks * 0.8)) {
      setPhase('execute');
    } else {
      setPhase('finish');
    }

    if (newCount >= requiredClicks) {
      setIsTimerRunning(false);
      handleObstacleEnd(true);
    }
  };

  const handleObstacleEnd = useCallback((completed: boolean) => {
    const timeTaken = timer;
    const timeRatio = obstacle ? timeTaken / obstacle.timeLimit : 1;
    let score = 0;
    if (completed && obstacle) {
      if (timeRatio <= 0.5) score = obstacle.marks;
      else if (timeRatio <= 0.75) score = Math.ceil(obstacle.marks * 0.75);
      else score = Math.ceil(obstacle.marks * 0.5);
    }

    setResults(prev => [...prev, {
      obstacleId: obstacle?.id || 0,
      completed,
      timeTaken: Math.round(timeTaken * 10) / 10,
      score
    }]);
    setGameState('result');
  }, [timer, obstacle]);

  const nextObstacle = () => {
    if (currentObstacle < 9) {
      setCurrentObstacle(prev => prev + 1);
      setGameState('briefing');
    } else {
      setGameState('summary');
    }
  };

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const maxScore = OBSTACLES.reduce((sum, o) => sum + o.marks, 0);
  const progressPct = obstacle ? (clickCount / requiredClicks) * 100 : 0;
  const timerPct = obstacle ? (timer / obstacle.timeLimit) * 100 : 0;

  // Rating based on total score
  const getRating = () => {
    const pct = (totalScore / maxScore) * 100;
    if (pct >= 85) return { label: 'OUTSTANDING', color: 'text-yellow-400', desc: 'Board-recommended performance. You demonstrated exceptional physical courage and determination.' };
    if (pct >= 65) return { label: 'ABOVE AVERAGE', color: 'text-emerald-400', desc: 'Strong showing. Your stamina and speed of decision are commendable.' };
    if (pct >= 45) return { label: 'AVERAGE', color: 'text-blue-400', desc: 'Decent attempt. Focus on building upper body strength and explosive power.' };
    return { label: 'BELOW AVERAGE', color: 'text-red-400', desc: 'Needs significant improvement. Daily physical training is non-negotiable.' };
  };

  return (
    <div className="w-full bg-[#0a0f1a] border border-white/10 rounded-3xl overflow-hidden min-h-[700px] flex flex-col relative select-none">
      
      {/* Header */}
      <header className="bg-[#0f172a] border-b border-emerald-900/50 p-5 flex justify-between items-center z-20">
        <div>
          <h2 className="text-lg font-black tracking-widest uppercase text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-emerald-600 border border-emerald-400 flex items-center justify-center text-[10px] text-white font-black">IO</span>
            Individual Obstacles Course
          </h2>
          <p className="text-[10px] text-emerald-500/80 font-black mt-1 tracking-widest uppercase">10 Obstacles • 3 Minutes • Real SSB Scoring</p>
        </div>
        {gameState !== 'menu' && gameState !== 'summary' && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {currentObstacle + 1} / 10
            </span>
            <span className="text-sm font-black text-emerald-400">{totalScore} pts</span>
          </div>
        )}
      </header>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* MENU SCREEN */}
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20">
                <Shield className="w-12 h-12 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-3">Individual Obstacles</h2>
                <p className="text-slate-500 font-bold max-w-md mx-auto text-sm">Complete all 10 obstacles as fast as possible. Tap rapidly to clear each obstacle. Your speed and completion rate determine your GTO score.</p>
              </div>
              <div className="grid grid-cols-5 gap-3 max-w-lg">
                {OBSTACLES.map((o, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <p className="text-lg font-black text-white">{i + 1}</p>
                    <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest truncate">{o.name}</p>
                  </div>
                ))}
              </div>
              <button onClick={startGame} className="px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl flex items-center gap-3 shadow-2xl shadow-emerald-500/20 transition-all active:scale-95">
                <Play className="w-4 h-4 fill-current" /> Start Course
              </button>
            </motion.div>
          )}

          {/* BRIEFING SCREEN */}
          {gameState === 'briefing' && (
            <motion.div key="briefing" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8"
            >
              <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Obstacle {currentObstacle + 1} of 10</span>
              </div>
              <h2 className="text-5xl font-black text-white uppercase tracking-tight">{obstacle.name}</h2>
              <p className="text-slate-400 font-bold text-lg max-w-lg">{obstacle.desc}</p>
              
              <div className="bg-[#0f172a] rounded-2xl p-8 border border-white/5 max-w-lg w-full text-left space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Points Available</span>
                  <span className="text-2xl font-black text-yellow-400">{obstacle.marks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Time Limit</span>
                  <span className="text-2xl font-black text-red-400">{obstacle.timeLimit}s</span>
                </div>
                <hr className="border-white/5" />
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Technique</p>
                  <p className="text-slate-300 text-sm font-bold leading-relaxed">{obstacle.technique}</p>
                </div>
              </div>

              <button onClick={startObstacle} className="px-12 py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl flex items-center gap-3 shadow-2xl transition-all active:scale-95">
                <Zap className="w-4 h-4" /> GO!
              </button>
            </motion.div>
          )}

          {/* PLAYING SCREEN */}
          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Timer Bar */}
              <div className="relative h-3 bg-slate-900">
                <motion.div
                  className={`h-full transition-all ${timerPct > 80 ? 'bg-red-500' : timerPct > 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(timerPct, 100)}%` }}
                />
              </div>

              {/* Main Tap Area */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 relative"
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
              >
                {/* Phase Indicator */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                    phase === 'approach' ? 'text-blue-400' : phase === 'execute' ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {phase === 'approach' ? '⚡ Approaching...' : phase === 'execute' ? '🔥 Executing...' : '✅ Almost there!'}
                  </span>
                </div>

                {/* Timer Display */}
                <div className="absolute top-6 right-8">
                  <p className={`text-4xl font-black tabular-nums ${timerPct > 80 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    {timer.toFixed(1)}s
                  </p>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-right">/ {obstacle.timeLimit}s</p>
                </div>

                {/* Obstacle Name */}
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">{obstacle.name}</h2>
                
                {/* Progress Ring */}
                <div className="relative w-48 h-48 mb-6">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeWidth="6" />
                    <circle cx="50" cy="50" r="44" fill="none"
                      stroke={phase === 'finish' ? '#22c55e' : phase === 'execute' ? '#eab308' : '#3b82f6'}
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${progressPct * 2.76} 276`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-5xl font-black text-white">{Math.round(progressPct)}%</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Progress</p>
                  </div>
                </div>

                {/* Tap instruction */}
                <motion.p
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="text-slate-500 font-black text-sm uppercase tracking-widest"
                >
                  ⚡ TAP RAPIDLY TO CLEAR ⚡
                </motion.p>

                {/* Click counter */}
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mt-4">
                  {clickCount} / {requiredClicks} actions
                </p>
              </div>
            </motion.div>
          )}

          {/* RESULT SCREEN */}
          {gameState === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6"
            >
              {results[results.length - 1]?.completed ? (
                <>
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <Trophy className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-black text-emerald-400 uppercase">Cleared!</h2>
                  <p className="text-slate-400 font-bold">Time: {results[results.length - 1]?.timeTaken}s / {obstacle.timeLimit}s</p>
                  <p className="text-2xl font-black text-yellow-400">+{results[results.length - 1]?.score} Points</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                    <Timer className="w-10 h-10 text-red-400" />
                  </div>
                  <h2 className="text-3xl font-black text-red-400 uppercase">Time Up!</h2>
                  <p className="text-slate-400 font-bold">You ran out of time on {obstacle.name}</p>
                  <p className="text-2xl font-black text-slate-600">0 Points</p>
                </>
              )}
              <button onClick={nextObstacle} className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center gap-3 transition-all border border-white/10">
                {currentObstacle < 9 ? 'Next Obstacle' : 'View Final Report'} <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* SUMMARY SCREEN */}
          {gameState === 'summary' && (
            <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex-1 p-10 overflow-y-auto custom-scrollbar"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Course Complete</h2>
                <p className={`text-2xl font-black ${getRating().color} uppercase tracking-widest`}>{getRating().label}</p>
                <p className="text-slate-500 font-bold mt-2 max-w-md mx-auto text-sm">{getRating().desc}</p>
              </div>

              <div className="flex justify-center gap-6 mb-10">
                <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 text-center min-w-[120px]">
                  <p className="text-3xl font-black text-yellow-400">{totalScore}</p>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Score</p>
                </div>
                <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 text-center min-w-[120px]">
                  <p className="text-3xl font-black text-white">{maxScore}</p>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Max</p>
                </div>
                <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 text-center min-w-[120px]">
                  <p className="text-3xl font-black text-emerald-400">{results.filter(r => r.completed).length}</p>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Cleared</p>
                </div>
              </div>

              {/* Individual Results */}
              <div className="space-y-3 max-w-2xl mx-auto">
                {results.map((r, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${r.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-slate-600 w-8">{i + 1}</span>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-tight">{OBSTACLES[i].name}</p>
                        <p className="text-[10px] font-bold text-slate-500">{r.timeTaken}s / {OBSTACLES[i].timeLimit}s</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {r.completed ? (
                        <span className="text-emerald-400 font-black text-sm">+{r.score}</span>
                      ) : (
                        <span className="text-red-400 font-black text-xs uppercase">Failed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <button onClick={startGame} className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center gap-3 mx-auto transition-all active:scale-95">
                  <RotateCcw className="w-4 h-4" /> Retry Course
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
