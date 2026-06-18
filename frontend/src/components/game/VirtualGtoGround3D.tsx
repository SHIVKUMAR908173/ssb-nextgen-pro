'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Lock, Zap, AlertTriangle, LightbulbIcon, Hand, 
  ShieldAlert, CheckCircle, RotateCcw, Play, Pause, 
  Trophy, Star, Clock, Volume2, VolumeX, Eye, Move3d
} from 'lucide-react';

// ============================================
// Three.js Dynamic Import (avoid SSR issues)
// ============================================

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ============================================
// Types
// ============================================

type Tool = 'FATTA' | 'BALLI' | 'ROPE' | 'PLANK' | 'DRUM' | 'NONE';
type ZoneColor = 'WHITE' | 'RED' | 'BLUE' | 'YELLOW' | 'GREEN';
type TaskType = 'PGT' | 'HGT' | 'CT' | 'FGT';

interface Platform3D {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: ZoneColor;
  label: string;
  type: 'platform' | 'barrel' | 'drum' | 'wall' | 'trench';
}

interface PlacedTool3D {
  id: string;
  tool: Tool;
  fromPlatformId: string;
  toPlatformId: string;
}

interface GameProgress {
  levelId: number;
  completed: boolean;
  stars: number;
  timeTaken: number;
  bestScore: number;
  attempts: number;
}

// ============================================
// Color Mappings
// ============================================

const COLOR_MAP: Record<ZoneColor, number> = {
  WHITE: 0xe2e8f0,
  RED: 0xef4444,
  BLUE: 0x3b82f6,
  YELLOW: 0xeab308,
  GREEN: 0x22c55e
};

const TOOL_COLORS: Record<Tool, number> = {
  FATTA: 0x92400e,
  BALLI: 0xea580c,
  ROPE: 0x6b7280,
  PLANK: 0x78350f,
  DRUM: 0x374151,
  NONE: 0x9ca3af
};

type ScenarioKey =
  | 'burma_bridge'
  | 'long_jump_drum'
  | 'high_jump_bar'
  | 'rope_bridge'
  | 'figure_of_eight'
  | 'spiders_web'
  | 'double_wall'
  | 'single_wall'
  | 'tire_carry'
  | 'obstacle_runs';

const SCENARIO_BANK: Array<{
  key: ScenarioKey;
  label: string;
  hint: string;
  preferredTool: Exclude<Tool, 'NONE'>;
}> = [
  { key: 'burma_bridge', label: 'Burma Bridge', hint: 'Balance across a narrow crossing with a safe anchor gap.', preferredTool: 'ROPE' },
  { key: 'long_jump_drum', label: 'Long Jump Drum', hint: 'Use the drum edge to bridge a short running gap.', preferredTool: 'BALLI' },
  { key: 'high_jump_bar', label: 'High Jump Bar', hint: 'Clear the elevated bar without touching red zones.', preferredTool: 'FATTA' },
  { key: 'rope_bridge', label: 'Rope Bridge', hint: 'Bridge a longer gap with a rope-style link.', preferredTool: 'ROPE' },
  { key: 'figure_of_eight', label: 'Figure of Eight', hint: 'Thread the path through two anchors with one clean route.', preferredTool: 'BALLI' },
  { key: 'spiders_web', label: "Spider's Web", hint: 'Move carefully through a dense obstacle cluster.', preferredTool: 'FATTA' },
  { key: 'double_wall', label: 'Double Wall', hint: 'Clear back-to-back barriers with precise placement.', preferredTool: 'PLANK' },
  { key: 'single_wall', label: 'Single Wall', hint: 'Use a direct line and keep your materials off red.', preferredTool: 'PLANK' },
  { key: 'tire_carry', label: 'Tire Carry', hint: 'Carry speed through a heavy-load route.', preferredTool: 'DRUM' },
  { key: 'obstacle_runs', label: 'Obstacle Run', hint: 'Chain the route quickly and finish cleanly.', preferredTool: 'BALLI' },
];

// ============================================
// Level Generation
// ============================================

interface GTOChallenge {
  id: number;
  name: string;
  type: TaskType;
  scenarioKey: ScenarioKey;
  scenarioLabel: string;
  description: string;
  platforms: Platform3D[];
  timeLimit: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  hints: string[];
}

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const scenarioForLevel = (level: number) => SCENARIO_BANK[(level - 1) % SCENARIO_BANK.length];

const generateLevels = (): GTOChallenge[] => {
  const levels: GTOChallenge[] = [];

  for (let i = 1; i <= 70; i++) {
    let type: TaskType = 'PGT';
    if (i > 55) type = 'CT';
    else if (i > 40) type = 'HGT';

    const difficulty = i <= 10 ? 'Easy' : i <= 25 ? 'Medium' : i <= 35 ? 'Hard' : 'Expert';
    const scenario = scenarioForLevel(i);

    levels.push({
      id: i,
      name: `${scenario.label} ${i}`,
      type,
      scenarioKey: scenario.key,
      scenarioLabel: scenario.label,
      description: scenario.hint,
      platforms: generatePlatforms(i, type, scenario.key),
      timeLimit: 180 + (i * 10),
      difficulty,
      hints: [
        scenario.hint,
        'Analyze the color zones first',
        'Remember: Materials cannot touch RED zones'
      ]
    });
  }

  return levels;
};

const generatePlatforms = (level: number, type: TaskType, scenarioKey: ScenarioKey): Platform3D[] => {
  const random = createSeededRandom(level * (type === 'PGT' ? 17 : type === 'HGT' ? 29 : 41));
  const widthOffset = scenarioKey === 'burma_bridge' || scenarioKey === 'rope_bridge' ? 0.25 : 0;
  const zOffset = scenarioKey === 'figure_of_eight' || scenarioKey === 'spiders_web' ? 2.2 : 0.8;
  const platforms: Platform3D[] = [
    { id: 'start', x: -10, y: 0, z: 0, width: 4, depth: 4, height: 1, color: 'WHITE', label: 'START', type: 'platform' },
    { id: 'finish', x: 10 + (level * 0.5), y: 0, z: 0, width: 4, depth: 4, height: 1, color: 'YELLOW', label: 'FINISH', type: 'platform' }
  ];

  const numPlatforms = Math.min(Math.floor(level / 4) + 2, 8);
  const colors: ZoneColor[] = ['RED', 'BLUE', 'GREEN'];
  const types: Platform3D['type'][] = ['platform', 'barrel', 'drum', 'wall'];

  for (let i = 1; i < numPlatforms; i++) {
    const t = types[Math.floor(random() * types.length)];
    const scenarioBias = scenarioKey === 'tire_carry' ? 1.4 : scenarioKey === 'obstacle_runs' ? 1.8 : 1;
    platforms.push({
      id: `p${i}`,
      x: (-10 + (10 + level * 0.5)) * (i / numPlatforms),
      y: (random() - 0.5) * 2,
      z: ((random() - 0.5) * zOffset) * scenarioBias,
      width: 2 + random() * (2 + widthOffset),
      depth: 2 + random() * 2,
      height: 0.5 + random() * 1.5,
      color: colors[Math.floor(random() * colors.length)],
      label: `${scenarioKey.toUpperCase().replaceAll('_', ' ')} ${i}`,
      type: t
    });
  }

  return platforms;
};

// ============================================
// 3D Scene Component
// ============================================

const GTO3DScene: React.FC<{
  platforms: Platform3D[];
  placedTools: PlacedTool3D[];
  selectedPlatform: string | null;
  onPlatformClick: (platform: Platform3D) => void;
  cameraMode: 'orbit' | 'firstPerson';
}> = ({ platforms, placedTools, selectedPlatform, onPlatformClick, cameraMode }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const platformMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const toolMeshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.Fog(0x0a1628, 20, 100);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x10b981, 0.3, 30);
    pointLight1.position.set(-5, 5, -5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xf59e0b, 0.3, 30);
    pointLight2.position.set(5, 5, 5);
    scene.add(pointLight2);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1e293b,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 50, 0x10b981, 0x1e293b);
    gridHelper.position.y = 0;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Create platforms
    const createPlatform = (platform: Platform3D) => {
      const geometry = new THREE.BoxGeometry(platform.width, platform.height, platform.depth);
      const material = new THREE.MeshStandardMaterial({
        color: COLOR_MAP[platform.color],
        roughness: 0.5,
        metalness: 0.3,
        transparent: platform.color === 'RED',
        opacity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(platform.x, platform.y + platform.height / 2, platform.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { platformId: platform.id, platform };
      
      // Add edges for better visibility
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true }));
      mesh.add(line);

      scene.add(mesh);
      platformMeshesRef.current.set(platform.id, mesh);
    };

    platforms.forEach(createPlatform);

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (!renderer.domElement || !cameraRef.current) return;
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(Array.from(platformMeshesRef.current.values()));

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const platform = clickedMesh.userData.platform as Platform3D;
        if (platform) {
          onPlatformClick(platform);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();

      // Pulse effect for selected platform
      platformMeshesRef.current.forEach((mesh, id) => {
        if (id === selectedPlatform) {
          const time = Date.now() * 0.003;
          const pulse = (Math.sin(time) + 1) * 0.5 * 0.3 + 0.7;
          (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x10b981);
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 0.5;
        } else {
          (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x000000);
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [platforms, onPlatformClick]);

  // Update placed tools
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const disposeMaterial = (material: THREE.Material | THREE.Material[]) => {
      if (Array.isArray(material)) {
        material.forEach(item => item.dispose());
        return;
      }

      material.dispose();
    };

    // Remove old tool meshes
    toolMeshesRef.current.forEach(mesh => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      disposeMaterial(mesh.material);
    });
    toolMeshesRef.current = [];

    // Create new tool meshes
    placedTools.forEach(placedTool => {
      const fromPlatform = platforms.find(p => p.id === placedTool.fromPlatformId);
      const toPlatform = platforms.find(p => p.id === placedTool.toPlatformId);
      
      if (!fromPlatform || !toPlatform) return;

      const startPos = new THREE.Vector3(fromPlatform.x, fromPlatform.y + fromPlatform.height, fromPlatform.z);
      const endPos = new THREE.Vector3(toPlatform.x, toPlatform.y + toPlatform.height, toPlatform.z);
      
      const distance = startPos.distanceTo(endPos);
      const direction = new THREE.Vector3().subVectors(endPos, startPos).normalize();
      
      // Create tool geometry based on type
      let geometry: THREE.BufferGeometry;
      if (placedTool.tool === 'ROPE') {
        // Create curved rope
        const curve = new THREE.CatmullRomCurve3([
          startPos,
          new THREE.Vector3(
            (startPos.x + endPos.x) / 2,
            Math.max(startPos.y, endPos.y) + 1,
            (startPos.z + endPos.z) / 2
          ),
          endPos
        ]);
        geometry = new THREE.TubeGeometry(curve, 8, 0.05, 4, false);
      } else if (placedTool.tool === 'BALLI') {
        geometry = new THREE.CylinderGeometry(0.08, 0.08, distance, 8);
      } else {
        geometry = new THREE.BoxGeometry(distance, 0.15, 0.5);
      }

      const material = new THREE.MeshStandardMaterial({
        color: TOOL_COLORS[placedTool.tool],
        roughness: 0.7,
        metalness: 0.2
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Position and rotate
      const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
      mesh.position.copy(midPoint);
      
      if (placedTool.tool !== 'ROPE') {
        mesh.lookAt(endPos);
        mesh.rotateX(Math.PI / 2);
      }

      mesh.castShadow = true;
      scene.add(mesh);
      toolMeshesRef.current.push(mesh);
    });
  }, [placedTools, platforms]);

  // Camera mode switching
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    
    if (cameraMode === 'firstPerson') {
      controlsRef.current.enabled = false;
      cameraRef.current.position.set(0, 2, 5);
      cameraRef.current.lookAt(0, 0, 0);
    } else {
      controlsRef.current.enabled = true;
    }
  }, [cameraMode]);

  return <div ref={mountRef} className="w-full h-full rounded-xl overflow-hidden" />;
};

// ============================================
// Main Component
// ============================================

export default function VirtualGtoGround3D() {
  const [currentScreen, setCurrentScreen] = useState<'MAP' | 'GAME'>('MAP');
  const [selectedLevel, setSelectedLevel] = useState<GTOChallenge | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [gameProgress, setGameProgress] = useState<Record<number, GameProgress>>({});
  
  // Game State
  const [heldTool, setHeldTool] = useState<Tool>('NONE');
  const [placedTools, setPlacedTools] = useState<PlacedTool3D[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [penaltyLog, setPenaltyLog] = useState<{msg: string, type: 'error' | 'success'}[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'firstPerson'>('orbit');

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('gto_3d_progress');
    if (saved) {
      const parsed = JSON.parse(saved) as Record<number, GameProgress>;
      setGameProgress(parsed);
      const values = Object.values(parsed);
      const maxUnlocked = Math.max(...values.map(p => p.levelId * (p.completed ? 1 : 0)), 0) + 1;
      setUnlockedLevels(Math.max(maxUnlocked, 1));
    }
  }, []);

  // Save progress
  const saveProgress = useCallback((levelId: number, progress: Partial<GameProgress>) => {
    setGameProgress(prev => {
      const existing = prev[levelId];
      const updated: GameProgress = {
        levelId,
        completed: progress.completed ?? existing?.completed ?? false,
        stars: progress.stars ?? existing?.stars ?? 0,
        timeTaken: progress.timeTaken ?? existing?.timeTaken ?? 0,
        bestScore: Math.max(progress.bestScore ?? 0, existing?.bestScore ?? 0),
        attempts: (existing?.attempts ?? 0) + 1
      };
      const newProgress = { ...prev, [levelId]: updated };
      localStorage.setItem('gto_3d_progress', JSON.stringify(newProgress));
      return newProgress;
    });
  }, []);

  // Timer
  useEffect(() => {
    if (isPaused || timeRemaining <= 0 || currentScreen !== 'GAME') return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          logMsg("TIME'S UP!", 'error');
          setIsPaused(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPaused, timeRemaining, currentScreen]);

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
    setPenaltyLog([{msg: "Level Initiated. Select a platform to start.", type: 'success'}]);
    setShowHint(false);
    setScore(0);
    setStars(0);
    if (level) setTimeRemaining(level.timeLimit);
  };

  const handlePlatformClick = useCallback((platform: Platform3D) => {
    if (heldTool === 'NONE') {
      if (platform.color === 'RED') {
        logMsg("Rule Violation: Cannot step on RED zone!", 'error');
        setScore(prev => Math.max(0, prev - 10));
      } else {
        logMsg(`Moved to ${platform.label}`, 'success');
        setScore(prev => prev + 5);
      }
      return;
    }

    if (!selectedPlatform) {
      setSelectedPlatform(platform.id);
      logMsg(`Anchor 1 set on ${platform.label}. Select second anchor.`, 'success');
    } else {
      if (selectedPlatform === platform.id) {
        setSelectedPlatform(null);
        return;
      }

      const fromPlatform = selectedLevel?.platforms.find(p => p.id === selectedPlatform);
      if (!fromPlatform) return;

      // Color rules
      if (fromPlatform.color === 'RED' || platform.color === 'RED') {
        logMsg("Violation: Material cannot touch RED!", 'error');
        setScore(prev => Math.max(0, prev - 15));
        setSelectedPlatform(null);
        return;
      }

      // Distance check
      const distance = Math.sqrt(
        Math.pow(platform.x - fromPlatform.x, 2) + 
        Math.pow(platform.z - fromPlatform.z, 2)
      );

      const toolLengths: Record<Tool, number> = {
        FATTA: 5, BALLI: 8, ROPE: 12, PLANK: 6, DRUM: 2, NONE: 0
      };

      if (distance > toolLengths[heldTool]) {
        logMsg(`Too far! ${heldTool} max: ${toolLengths[heldTool]} units`, 'error');
        setScore(prev => Math.max(0, prev - 5));
      } else {
        setPlacedTools(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          tool: heldTool,
          fromPlatformId: fromPlatform.id,
          toPlatformId: platform.id
        }]);
        logMsg(`${heldTool} placed successfully!`, 'success');
        setScore(prev => prev + 25);

        if (platform.id === 'finish' || fromPlatform.id === 'finish') {
          completeLevel();
        }
      }
      setSelectedPlatform(null);
      setHeldTool('NONE');
    }
  }, [heldTool, selectedPlatform, selectedLevel]);

  const completeLevel = () => {
    const timeBonus = Math.floor(timeRemaining / 10);
    const finalScore = score + timeBonus;
    const earnedStars = finalScore > 100 ? 3 : finalScore > 50 ? 2 : 1;

    setStars(earnedStars);
    logMsg(`COMPLETE! Score: ${finalScore} | ${'⭐'.repeat(earnedStars)}`, 'success');

    if (selectedLevel) {
      saveProgress(selectedLevel.id, {
        completed: true,
        stars: earnedStars,
        timeTaken: selectedLevel.timeLimit - timeRemaining,
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
    <div className="w-full bg-[#050B14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[700px] flex flex-col relative">
      
      {/* Header */}
      <header className="bg-[#0f172a] border-b border-emerald-900/50 p-5 flex justify-between items-center z-20 relative">
        <div>
          <h2 className="text-xl font-black tracking-widest uppercase text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 border border-emerald-400 flex items-center justify-center text-xs font-black">
              3D
            </span>
            Virtual GTO Ground <span className="text-emerald-500">3D Engine</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-widest uppercase">
            Full 3D • PGT/HGT/CT • 70 Levels
          </p>
        </div>
        <div className="flex items-center gap-4">
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
            className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-white hover:text-emerald-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10 transition-colors"
          >
            <Menu className="w-4 h-4" /> {currentScreen === 'MAP' ? 'Play' : 'Levels'}
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
            className="flex-1 p-8 overflow-y-auto relative"
          >
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
                3D Tactical <span className="text-emerald-500">Grid</span>
              </h3>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                PGT (1-40) • HGT (41-55) • CT (56-70)
              </p>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-4 max-w-6xl mx-auto">
              {levels.map((level) => {
                const isUnlocked = level.id <= unlockedLevels;
                const progress = gameProgress[level.id];
                
                let typeColor = 'from-emerald-600 to-emerald-900';
                if (level.type === 'HGT') typeColor = 'from-blue-600 to-blue-900';
                if (level.type === 'CT') typeColor = 'from-purple-600 to-purple-900';
                if (!isUnlocked) typeColor = 'from-slate-800 to-slate-900';

                return (
                  <button
                    key={level.id}
                    onClick={() => isUnlocked && handleLevelSelect(level)}
                    disabled={!isUnlocked}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all 
                      ${isUnlocked ? `bg-gradient-to-br ${typeColor} hover:scale-105 hover:shadow-[0_0_25px_rgba(52,211,153,0.4)] text-white` : 'bg-gradient-to-br from-[#0f172a] to-[#020617] border-white/5 text-slate-700 cursor-not-allowed'}
                    `}
                  >
                    {isUnlocked ? (
                      <>
                        <span className="text-2xl font-black tracking-tighter">{level.id}</span>
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/50">{level.type}</span>
                        {progress?.completed && (
                          <div className="absolute top-1 right-1 flex gap-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Star key={i} className="w-2 h-2" fill={i < (progress.stars || 0) ? '#fbbf24' : 'none'} stroke={i < (progress.stars || 0) ? '#fbbf24' : '#475569'} />
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
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col relative"
          >
            {/* Game Info Bar */}
            <div className="bg-[#0f172a]/80 backdrop-blur border-b border-white/5 p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">{selectedLevel?.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedLevel?.scenarioLabel} • {selectedLevel?.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCameraMode(m => m === 'orbit' ? 'firstPerson' : 'orbit')} className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <Move3d className="w-4 h-4 text-emerald-500" />
                </button>
                <button onClick={() => setIsPaused(!isPaused)} className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  {isPaused ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4 text-emerald-500" />}
                </button>
                <button onClick={() => resetGame(selectedLevel || undefined)} className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 3D Scene */}
            <div className="flex-1 relative">
              <GTO3DScene
                platforms={selectedLevel?.platforms || []}
                placedTools={placedTools}
                selectedPlatform={selectedPlatform}
                onPlatformClick={handlePlatformClick}
                cameraMode={cameraMode}
              />

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
                      <p className="text-slate-300 text-sm font-bold leading-relaxed">{selectedLevel.hints[0]}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Control Panel */}
            <div className="h-56 bg-[#0f172a] border-t border-emerald-900/50 flex flex-col md:flex-row">
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
                      className={`rounded-xl border font-black uppercase text-xs tracking-widest transition-all
                        ${heldTool === tool ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-black/40 border-white/10 text-slate-500 hover:text-white'}
                      `}
                    >
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
                  <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-yellow-500 hover:text-black hover:bg-yellow-500 px-4 py-2 rounded-xl border border-yellow-500/30 transition-all">
                    <Zap className="w-3 h-3"/> Hint
                  </button>
                </div>
                <div className="flex-1 bg-[#020617] rounded-2xl border border-white/5 p-4 overflow-y-auto font-mono text-[10px] leading-relaxed flex flex-col gap-2">
                  {penaltyLog.map((log, i) => (
                    <div key={i} className={`p-2 rounded-lg border-l-4 flex items-start gap-2 ${log.type === 'error' ? 'bg-red-500/10 border-red-500 text-red-200' : 'bg-emerald-500/10 border-emerald-500 text-emerald-200'}`}>
                      {log.type === 'error' ? <ShieldAlert className="w-3 h-3 text-red-500 shrink-0"/> : <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0"/>}
                      <span className="font-bold">{log.msg}</span>
                    </div>
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
