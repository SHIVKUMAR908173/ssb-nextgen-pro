'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, Menu, Lock, Unlock, Zap, AlertTriangle, LightbulbIcon, 
  Hand, ShieldAlert, CheckCircle, RotateCcw, Play, Pause, SkipForward,
  Users, Target, Map, Footprints, Trophy, Star, Clock, RefreshCw,
  ChevronRight, ChevronLeft, Info, Settings, Volume2, VolumeX
} from 'lucide-react';

// ============================================
// GTO Virtual Ground Engine - 2.5D Isometric
// ============================================

// Types and Enums
type Tool = 'FATTA' | 'BALLI' | 'ROPE' | 'PLANK' | 'DRUM' | 'NONE';
type ZoneColor = 'WHITE' | 'RED' | 'BLUE' | 'YELLOW' | 'GREEN';
type TaskType = 'PGT' | 'HGT' | 'CT' | 'FGT';
type GameMode = 'PRACTICE' | 'TEST' | 'FREE';

interface IsometricPlatform {
  id: string;
  isoX: number; // Isometric X coordinate
  isoY: number; // Isometric Y coordinate  
  width: number;
  depth: number;
  height: number;
  color: ZoneColor;
  label: string;
  type: 'platform' | 'barrel' | 'drum' | 'wall' | 'trench' | 'balli';
}

interface PlacedTool {
  id: string;
  tool: Tool;
  fromPlatformId: string;
  toPlatformId: string;
  placementAngle: number;
}

interface Character {
  id: string;
  isoX: number;
  isoY: number;
  targetX: number;
  targetY: number;
  isMoving: boolean;
  isCarrying: Tool | null;
}

interface GTOChallenge {
  id: number;
  name: string;
  type: TaskType;
  description: string;
  platforms: IsometricPlatform[];
  availableTools: Tool[];
  timeLimit: number; // seconds
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  hints: string[];
  idealSolution: string[];
}

interface GameProgress {
  levelId: number;
  completed: boolean;
  stars: number;
  timeTaken: number;
  bestScore: number;
  attempts: number;
  lastPlayed: Date;
}

// ============================================
// Level Scenarios - 70+ Levels
// ============================================

const generateLevels = (): GTOChallenge[] => {
  const levels: GTOChallenge[] = [];
  
  // PGT Levels (1-40)
  for (let i = 1; i <= 40; i++) {
    const difficulty = i <= 10 ? 'Easy' : i <= 25 ? 'Medium' : i <= 35 ? 'Hard' : 'Expert';
    levels.push({
      id: i,
      name: `PGT Challenge ${i}`,
      type: 'PGT',
      description: `Progressive Group Task - Navigate all candidates across ${Math.floor(i/5) + 2} obstacles`,
      platforms: generatePGTPlatforms(i),
      availableTools: (['FATTA', 'BALLI', 'ROPE', 'PLANK'] as Tool[]).slice(0, Math.min(Math.floor(i/10) + 2, 4)),
      timeLimit: 180 + (i * 10),
      difficulty,
      hints: [
        'Analyze the color zones first',
        'Use intermediate supports for longer gaps',
        'Remember: Materials cannot touch RED zones'
      ],
      idealSolution: ['Bridge using FATTA', 'Use BALLI for longer gaps', 'Rope for lashing support']
    });
  }
  
  // HGT Levels (41-55)
  for (let i = 41; i <= 55; i++) {
    levels.push({
      id: i,
      name: `HGT Mission ${i - 40}`,
      type: 'HGT',
      description: `Half Group Task - Limited resources, maximum creativity`,
      platforms: generateHGTPlatforms(i),
      availableTools: (['FATTA', 'BALLI', 'ROPE'] as Tool[]).slice(0, Math.floor((i - 40) / 5) + 1),
      timeLimit: 150 + ((i - 40) * 15),
      difficulty: i <= 48 ? 'Medium' : 'Hard',
      hints: [
        'Think outside the box',
        'Combine tools for extended reach',
        'Use the terrain to your advantage'
      ],
      idealSolution: ['Create a bridge system', 'Use leverage principles', 'Team coordination essential']
    });
  }
  
  // CT Levels (56-70)
  for (let i = 56; i <= 70; i++) {
    levels.push({
      id: i,
      name: `Command Task ${i - 55}`,
      type: 'CT',
      description: `Solo Command Task - Lead yourself to victory`,
      platforms: generateCTPlatforms(i),
      availableTools: (['FATTA', 'BALLI', 'ROPE', 'PLANK', 'DRUM'] as Tool[]).slice(0, Math.floor((i - 55) / 3) + 2),
      timeLimit: 120 + ((i - 55) * 20),
      difficulty: i <= 62 ? 'Hard' : 'Expert',
      hints: [
        'You are the leader and the follower',
        'Plan each move carefully',
        'Efficiency is key'
      ],
      idealSolution: ['Scout the path first', 'Place tools strategically', 'Execute with precision']
    });
  }
  
  return levels;
};

const generatePGTPlatforms = (level: number): IsometricPlatform[] => {
  const platforms: IsometricPlatform[] = [
    { id: 'start', isoX: 0, isoY: 0, width: 80, depth: 60, height: 20, color: 'WHITE', label: 'START', type: 'platform' },
    { id: 'finish', isoX: 400 + (level * 15), isoY: 0, width: 80, depth: 60, height: 20, color: 'YELLOW', label: 'FINISH', type: 'platform' }
  ];
  
  // Add intermediate platforms based on level
  const numPlatforms = Math.min(Math.floor(level / 4) + 2, 8);
  for (let i = 1; i < numPlatforms; i++) {
    const colors: ZoneColor[] = ['RED', 'BLUE', 'GREEN'];
    const types: IsometricPlatform['type'][] = ['platform', 'barrel', 'drum', 'wall'];
    platforms.push({
      id: `p${i}`,
      isoX: (400 + (level * 15)) * (i / numPlatforms),
      isoY: (Math.random() - 0.5) * 60,
      width: 40 + Math.random() * 30,
      depth: 40 + Math.random() * 20,
      height: 15 + Math.random() * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      label: `${types[Math.floor(Math.random() * types.length)].toUpperCase()} ${i}`,
      type: types[Math.floor(Math.random() * types.length)]
    });
  }
  
  return platforms;
};

const generateHGTPlatforms = (level: number): IsometricPlatform[] => {
  return generatePGTPlatforms(level).slice(0, -1).concat(
    generatePGTPlatforms(level).slice(-1)
  );
};

const generateCTPlatforms = (level: number): IsometricPlatform[] => {
  return generatePGTPlatforms(level);
};

// ============================================
// Isometric Rendering Engine
// ============================================

const IsometricCanvas: React.FC<{
  platforms: IsometricPlatform[];
  placedTools: PlacedTool[];
  characters: Character[];
  selectedTool: Tool;
  onPlatformClick: (platform: IsometricPlatform) => void;
  selectedPlatform: string | null;
}> = ({ platforms, placedTools, characters, selectedTool, onPlatformClick, selectedPlatform }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  
  // Isometric projection functions
  const isoToScreen = (isoX: number, isoY: number, isoZ: number = 0) => {
    const angle = Math.PI / 6; // 30 degrees for isometric
    const screenX = (isoX - isoY) * Math.cos(angle);
    const screenY = (isoX + isoY) * Math.sin(angle) - isoZ;
    return { x: screenX, y: screenY };
  };
  
  const drawPlatform = (ctx: CanvasRenderingContext2D, platform: IsometricPlatform) => {
    const { x: sx, y: sy } = isoToScreen(platform.isoX, platform.isoY, 0);
    const { x: sx2, y: sy2 } = isoToScreen(platform.isoX + platform.width, platform.isoY + platform.depth, platform.height);
    
    // Calculate isometric corners
    const corners = [
      isoToScreen(platform.isoX, platform.isoY, 0),
      isoToScreen(platform.isoX + platform.width, platform.isoY, 0),
      isoToScreen(platform.isoX + platform.width, platform.isoY + platform.depth, 0),
      isoToScreen(platform.isoX, platform.isoY + platform.depth, 0),
    ];
    
    const topCorners = corners.map(c => {
      const z = platform.height;
      const angle = Math.PI / 6;
      return {
        x: c.x,
        y: c.y - z * camera.zoom
      };
    });
    
    // Color mapping
    const colorMap: Record<ZoneColor, { top: string; side: string; front: string }> = {
      WHITE: { top: '#e2e8f0', side: '#cbd5e1', front: '#94a3b8' },
      RED: { top: '#ef4444', side: '#dc2626', front: '#b91c1c' },
      BLUE: { top: '#3b82f6', side: '#2563eb', front: '#1d4ed8' },
      YELLOW: { top: '#eab308', side: '#ca8a04', front: '#a16207' },
      GREEN: { top: '#22c55e', side: '#16a34a', front: '#15803d' }
    };
    
    const colors = colorMap[platform.color];
    const isSelected = selectedPlatform === platform.id;
    
    // Draw front face
    ctx.beginPath();
    ctx.moveTo((corners[0].x) * camera.zoom + 400, (corners[0].y) * camera.zoom + 200);
    ctx.lineTo((corners[1].x) * camera.zoom + 400, (corners[1].y) * camera.zoom + 200);
    ctx.lineTo((corners[1].x) * camera.zoom + 400, ((corners[1].y) + platform.height) * camera.zoom + 200);
    ctx.lineTo((corners[0].x) * camera.zoom + 400, ((corners[0].y) + platform.height) * camera.zoom + 200);
    ctx.closePath();
    ctx.fillStyle = colors.front;
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#fff' : 'rgba(255,255,255,0.3)';
    ctx.lineWidth = isSelected ? 3 : 1;
    ctx.stroke();
    
    // Draw side face
    ctx.beginPath();
    ctx.moveTo((corners[1].x) * camera.zoom + 400, (corners[1].y) * camera.zoom + 200);
    ctx.lineTo((corners[2].x) * camera.zoom + 400, (corners[2].y) * camera.zoom + 200);
    ctx.lineTo((corners[2].x) * camera.zoom + 400, ((corners[2].y) + platform.height) * camera.zoom + 200);
    ctx.lineTo((corners[1].x) * camera.zoom + 400, ((corners[1].y) + platform.height) * camera.zoom + 200);
    ctx.closePath();
    ctx.fillStyle = colors.side;
    ctx.fill();
    ctx.stroke();
    
    // Draw top face
    ctx.beginPath();
    ctx.moveTo((topCorners[0].x) * camera.zoom + 400, (topCorners[0].y) * camera.zoom + 200);
    ctx.lineTo((topCorners[1].x) * camera.zoom + 400, (topCorners[1].y) * camera.zoom + 200);
    ctx.lineTo((topCorners[2].x) * camera.zoom + 400, (topCorners[2].y) * camera.zoom + 200);
    ctx.lineTo((topCorners[3].x) * camera.zoom + 400, (topCorners[3].y) * camera.zoom + 200);
    ctx.closePath();
    ctx.fillStyle = colors.top;
    ctx.fill();
    ctx.stroke();
    
    // Selection glow
    if (isSelected) {
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    // Label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(platform.label, (corners[0].x + corners[2].x) / 2 * camera.zoom + 400, ((corners[0].y + corners[2].y) / 2) * camera.zoom + 190);
  };
  
  const drawPlacedTool = (ctx: CanvasRenderingContext2D, tool: PlacedTool) => {
    const fromPlatform = platforms.find(p => p.id === tool.fromPlatformId);
    const toPlatform = platforms.find(p => p.id === tool.toPlatformId);
    if (!fromPlatform || !toPlatform) return;
    
    const fromPos = isoToScreen(fromPlatform.isoX + fromPlatform.width / 2, fromPlatform.isoY + fromPlatform.depth / 2, fromPlatform.height);
    const toPos = isoToScreen(toPlatform.isoX + toPlatform.width / 2, toPlatform.isoY + toPlatform.depth / 2, toPlatform.height);
    
    const toolColors: Record<Tool, string> = {
      FATTA: '#92400e',
      BALLI: '#ea580c',
      ROPE: '#6b7280',
      PLANK: '#78350f',
      DRUM: '#374151',
      NONE: '#9ca3af'
    };
    
    ctx.beginPath();
    ctx.moveTo(fromPos.x * camera.zoom + 400, fromPos.y * camera.zoom + 200);
    ctx.lineTo(toPos.x * camera.zoom + 400, toPos.y * camera.zoom + 200);
    ctx.strokeStyle = toolColors[tool.tool];
    ctx.lineWidth = tool.tool === 'ROPE' ? 2 : 6;
    ctx.setLineDash(tool.tool === 'ROPE' ? [5, 3] : []);
    ctx.stroke();
    ctx.setLineDash([]);
  };
  
  const drawCharacter = (ctx: CanvasRenderingContext2D, char: Character) => {
    const pos = isoToScreen(char.isoX, char.isoY, 30);
    
    // Character body
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(pos.x * camera.zoom + 400, pos.y * camera.zoom + 200, 8 * camera.zoom, 0, Math.PI * 2);
    ctx.fill();
    
    // Character shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(pos.x * camera.zoom + 400, pos.y * camera.zoom + 220, 6 * camera.zoom, 3 * camera.zoom, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Carrying indicator
    if (char.isCarrying) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(char.isCarrying, pos.x * camera.zoom + 400, pos.y * camera.zoom + 185);
    }
  };
  
  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    // Sort platforms by depth for proper rendering order
    const sortedPlatforms = [...platforms].sort((a, b) => 
      (a.isoX + a.isoY) - (b.isoX + b.isoY)
    );
    
    // Draw platforms
    sortedPlatforms.forEach(platform => drawPlatform(ctx, platform));
    
    // Draw placed tools
    placedTools.forEach(tool => drawPlacedTool(ctx, tool));
    
    // Draw characters
    characters.forEach(char => drawCharacter(ctx, char));
    
  }, [platforms, placedTools, characters, camera]);
  
  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full h-full rounded-xl"
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f172a 100%)' }}
    />
  );
};

// ============================================
// Main Virtual GTO Ground Component
// ============================================

export default function VirtualGtoGround() {
  // State Management
  const [currentScreen, setCurrentScreen] = useState<'MAP' | 'GAME' | 'LEADERBOARD'>('MAP');
  const [selectedLevel, setSelectedLevel] = useState<GTOChallenge | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('PRACTICE');
  const [unlockedLevels, setUnlockedLevels] = useState<number>(1);
  const [gameProgress, setGameProgress] = useState<Record<number, GameProgress>>({});
  
  // Game State
  const [heldTool, setHeldTool] = useState<Tool>('NONE');
  const [placedTools, setPlacedTools] = useState<PlacedTool[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([
    { id: 'c1', isoX: 40, isoY: 30, targetX: 40, targetY: 30, isMoving: false, isCarrying: null }
  ]);
  const [penaltyLog, setPenaltyLog] = useState<{msg: string, type: 'error' | 'success'}[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Load progress from localStorage (will be replaced with DB calls)
  useEffect(() => {
    const savedProgress = localStorage.getItem('gto_progress');
    if (savedProgress) {
      setGameProgress(JSON.parse(savedProgress));
      const parsed = JSON.parse(savedProgress) as Record<number, GameProgress>;
      const maxUnlocked = Math.max(...Object.values(parsed).map((p) => p.levelId * (p.completed ? 1 : 0))) + 1;
      setUnlockedLevels(Math.max(maxUnlocked, 1));
    }
  }, []);
  
  // Save progress
  const saveProgress = useCallback((levelId: number, progress: Partial<GameProgress>) => {
    setGameProgress(prev => {
      const newProgress = {
        ...prev,
        [levelId]: {
          ...prev[levelId],
          levelId,
          ...progress,
          lastPlayed: new Date()
        }
      };
      localStorage.setItem('gto_progress', JSON.stringify(newProgress));
      return newProgress;
    });
  }, []);
  
  // Timer
  useEffect(() => {
    if (isPaused || timeRemaining <= 0 || currentScreen !== 'GAME') return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPaused, timeRemaining, currentScreen]);
  
  const handleTimeUp = () => {
    logMsg("TIME'S UP! Task incomplete.", 'error');
    setIsPaused(true);
  };
  
  const logMsg = (msg: string, type: 'error' | 'success') => {
    setPenaltyLog(prev => [{msg, type}, ...prev].slice(0, 50));
  };
  
  const handleLevelSelect = (level: GTOChallenge) => {
    if (level.id <= unlockedLevels) {
      setSelectedLevel(level);
      resetGame(level);
      setCurrentScreen('GAME');
      setTimeRemaining(level.timeLimit);
      setIsPaused(false);
    }
  };
  
  const resetGame = (level?: GTOChallenge) => {
    setHeldTool('NONE');
    setPlacedTools([]);
    setSelectedPlatform(null);
    setCharacters([
      { id: 'c1', isoX: 40, isoY: 30, targetX: 40, targetY: 30, isMoving: false, isCarrying: null }
    ]);
    setPenaltyLog([{msg: "Level Initiated. Awaiting candidate action.", type: 'success'}]);
    setShowHint(false);
    setScore(0);
    setStars(0);
    if (level) {
      setTimeRemaining(level.timeLimit);
    }
  };
  
  const handlePlatformClick = (platform: IsometricPlatform) => {
    // Mode 1: No tool selected - just move candidate
    if (heldTool === 'NONE') {
      // Check color rules
      if (platform.color === 'RED') {
        logMsg("Rule of Colors Violation: Men cannot step on Red zone.", 'error');
        setScore(prev => Math.max(0, prev - 10));
      } else {
        logMsg(`Candidate moved to ${platform.label} safely.`, 'success');
        setScore(prev => prev + 5);
      }
      return;
    }
    
    // Mode 2: Tool selected - place tool between platforms
    // At this point, heldTool is FATTA, BALLI, ROPE, PLANK, or DRUM
    const activeTool = heldTool;
    
    if (!selectedPlatform) {
        setSelectedPlatform(platform.id);
        logMsg(`Anchor point 1 set on ${platform.label}. Select second anchor.`, 'success');
      } else {
        if (selectedPlatform === platform.id) {
          setSelectedPlatform(null);
          return;
        }
        
        const fromPlatform = selectedLevel?.platforms.find(p => p.id === selectedPlatform);
        const toPlatform = platform;
        
        if (!fromPlatform || !toPlatform) return;
        
        // Rule of Colors Check
        if (fromPlatform.color === 'RED' || toPlatform.color === 'RED') {
          logMsg("Rule of Colors Violation: Material cannot touch Red zone.", 'error');
          setScore(prev => Math.max(0, prev - 15));
          setSelectedPlatform(null);
          return;
        }
        
        // Calculate distance and check tool length
        const distance = Math.sqrt(
          Math.pow(toPlatform.isoX - fromPlatform.isoX, 2) + 
          Math.pow(toPlatform.isoY - fromPlatform.isoY, 2)
        );
        
        const toolLengths: Record<Tool, number> = {
          FATTA: 100,
          BALLI: 150,
          ROPE: 200,
          PLANK: 120,
          DRUM: 50,
          NONE: 0
        };
        
        if (distance > toolLengths[heldTool]) {
          logMsg(`Physics Violation: ${heldTool} cannot bridge this gap (${Math.round(distance)} units).`, 'error');
          setScore(prev => Math.max(0, prev - 5));
        } else {
          // Valid placement
          setPlacedTools(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            tool: heldTool,
            fromPlatformId: fromPlatform.id,
            toPlatformId: toPlatform.id,
            placementAngle: Math.atan2(toPlatform.isoY - fromPlatform.isoY, toPlatform.isoX - fromPlatform.isoX)
          }]);
          logMsg(`${heldTool} placed successfully between ${fromPlatform.label} and ${toPlatform.label}.`, 'success');
          setScore(prev => prev + 25);
          
          // Check win condition
          if (toPlatform.id === 'finish' || fromPlatform.id === 'finish') {
            completeLevel();
          }
        }
        setSelectedPlatform(null);
        setHeldTool('NONE');
      }
  };
  
  const completeLevel = () => {
    const timeBonus = Math.floor(timeRemaining / 10);
    const finalScore = score + timeBonus;
    const earnedStars = finalScore > 100 ? 3 : finalScore > 50 ? 2 : 1;
    
    setStars(earnedStars);
    logMsg(`TASK COMPLETED! Score: ${finalScore} | Stars: ${'⭐'.repeat(earnedStars)}`, 'success');
    
    // Save progress
    if (selectedLevel) {
      saveProgress(selectedLevel.id, {
        completed: true,
        stars: earnedStars,
        timeTaken: (selectedLevel.timeLimit - timeRemaining),
        bestScore: Math.max(finalScore, gameProgress[selectedLevel.id]?.bestScore || 0),
        attempts: (gameProgress[selectedLevel.id]?.attempts || 0) + 1
      });
      
      if (selectedLevel.id >= unlockedLevels) {
        setUnlockedLevels(selectedLevel.id + 1);
      }
    }
    
    setIsPaused(true);
  };
  
  const levels = generateLevels();
  
  return (
    <div className="w-full bg-[#050B14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden font-sans text-slate-200 min-h-[700px] flex flex-col relative select-none">
      
      {/* Header */}
      <header className="bg-[#0f172a] border-b border-emerald-900/50 p-5 flex justify-between items-center z-20 shadow-xl relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-black tracking-widest uppercase text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 border border-emerald-400 flex items-center justify-center text-xs text-white font-black uppercase shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              GTO
            </span>
            Virtual Ground <span className="text-emerald-500">2.5D Engine</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-widest uppercase text-emerald-500/80">
            SSB Ground Tasks Simulator • Physics Rules Active • {selectedLevel?.type || 'Select Level'}
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          {currentScreen === 'GAME' && (
            <>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-black text-white">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-black text-white">{score}</span>
              </div>
            </>
          )}
          <button 
            onClick={() => setCurrentScreen(currentScreen === 'MAP' ? 'GAME' : 'MAP')} 
            className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-white hover:text-emerald-400 bg-white/5 px-4 py-2 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Menu className="w-4 h-4" /> {currentScreen === 'MAP' ? 'Play' : 'Levels'}
          </button>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-slate-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
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
                PGT (1-40) • HGT (41-55) • CT (56-70) • FGT (Special)
              </p>
            </div>
            
            {/* Level Grid */}
            <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-4 max-w-6xl mx-auto relative z-10">
              {levels.map((level) => {
                const isUnlocked = level.id <= unlockedLevels;
                const progress = gameProgress[level.id];
                
                let typeColor = 'from-emerald-600 to-emerald-900 border-emerald-500/50';
                if (level.type === 'HGT') typeColor = 'from-blue-600 to-blue-900 border-blue-500/50';
                if (level.type === 'CT') typeColor = 'from-purple-600 to-purple-900 border-purple-500/50';
                if (level.type === 'FGT') typeColor = 'from-orange-600 to-orange-900 border-orange-500/50';
                
                if (!isUnlocked) typeColor = 'from-slate-800 to-slate-900 border-white/5';
                
                return (
                  <button 
                    key={level.id}
                    onClick={() => isUnlocked && handleLevelSelect(level)}
                    disabled={!isUnlocked}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all 
                      ${isUnlocked ? `bg-gradient-to-br ${typeColor} hover:scale-105 hover:shadow-[0_0_25px_rgba(52,211,153,0.4)] cursor-pointer text-white` : 'bg-gradient-to-br from-[#0f172a] to-[#020617] border-white/5 text-slate-700 cursor-not-allowed'}
                    `}
                  >
                    {isUnlocked ? (
                      <>
                        <span className="text-2xl font-black tracking-tighter drop-shadow-md">{level.id}</span>
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/50">{level.type}</span>
                        {progress?.completed && (
                          <div className="absolute top-1 right-1 flex gap-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className="w-2 h-2" 
                                fill={i < (progress.stars || 0) ? '#fbbf24' : 'none'} 
                                stroke={i < (progress.stars || 0) ? '#fbbf24' : '#475569'} 
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Lock className="w-6 h-6 mb-1 opacity-20" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-12 flex justify-center gap-8 relative z-10">
              {[
                { label: 'PGT', color: 'bg-emerald-500', desc: 'Progressive Group Task' },
                { label: 'HGT', color: 'bg-blue-500', desc: 'Half Group Task' },
                { label: 'CT', color: 'bg-purple-500', desc: 'Command Task' },
                { label: 'FGT', color: 'bg-orange-500', desc: 'Final Group Task' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${item.color}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="game" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }} 
            className="flex-1 flex flex-col relative bg-[#0a1120]"
          >
            {/* Game Info Bar */}
            <div className="bg-[#0f172a]/80 backdrop-blur border-b border-white/5 p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">{selectedLevel?.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedLevel?.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  {isPaused ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4 text-emerald-500" />}
                </button>
                <button 
                  onClick={() => resetGame(selectedLevel || undefined)}
                  className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            
            {/* 2.5D Isometric Game View */}
            <div className="flex-1 relative overflow-hidden">
              <IsometricCanvas
                platforms={selectedLevel?.platforms || []}
                placedTools={placedTools}
                characters={characters}
                selectedTool={heldTool}
                onPlatformClick={handlePlatformClick}
                selectedPlatform={selectedPlatform}
              />
              
              {/* Pause Overlay */}
              {isPaused && timeRemaining > 0 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
                  <div className="bg-[#1e293b] border border-emerald-500/30 rounded-3xl p-12 text-center max-w-md">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Paused</h3>
                    <div className="flex gap-4 justify-center">
                      <button 
                        onClick={() => setIsPaused(false)}
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-2xl"
                      >
                        Resume
                      </button>
                      <button 
                        onClick={() => resetGame(selectedLevel || undefined)}
                        className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl"
                      >
                        Restart
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hint Overlay */}
              <AnimatePresence>
                {showHint && selectedLevel && (
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
                        {selectedLevel.hints[0]}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Bottom Control Panel */}
            <div className="h-64 bg-[#0f172a] border-t border-emerald-900/50 flex flex-col md:flex-row relative z-40">
              
              {/* Tool Selection */}
              <div className="w-full md:w-1/4 p-6 border-r border-white/5 flex flex-col">
                <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-500 mb-4 flex items-center gap-2">
                  <Hand className="w-4 h-4"/> Equipment
                </h4>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {(['FATTA', 'BALLI', 'ROPE', 'NONE'] as Tool[]).map(tool => (
                    <button 
                      key={tool}
                      onClick={() => { setHeldTool(tool); setSelectedPlatform(null); }}
                      className={`rounded-xl border font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center
                        ${heldTool === tool ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105' : 'bg-black/40 border-white/10 text-slate-500 hover:text-white hover:border-white/30'}
                      `}
                    >
                      {tool === 'FATTA' && <span className="w-6 h-1 bg-current rounded mr-2"></span>}
                      {tool === 'BALLI' && <span className="w-6 h-2 bg-current rounded-full mr-2"></span>}
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Log Console */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-500 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4"/> Physics Log
                  </h4>
                  <button 
                    onClick={() => setShowHint(!showHint)} 
                    className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-yellow-500 hover:text-black hover:bg-yellow-500 px-4 py-2 rounded-xl border border-yellow-500/30 transition-all"
                  >
                    <Zap className="w-3 h-3"/> Hint
                  </button>
                </div>
                <div className="flex-1 bg-[#020617] rounded-2xl border border-white/5 p-4 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-relaxed flex flex-col gap-2">
                  {penaltyLog.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-2 rounded-lg border-l-4 flex items-start gap-2
                        ${log.type === 'error' ? 'bg-red-500/10 border-red-500 text-red-200' : 'bg-emerald-500/10 border-emerald-500 text-emerald-200'}`}
                    >
                      {log.type === 'error' ? <ShieldAlert className="w-3 h-3 text-red-500 shrink-0"/> : <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0"/>}
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
