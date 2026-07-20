'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, Clock, Users, Lightbulb, Target, Search, Play, Square, RotateCcw, Radio, Mic, MicOff, Volume2 } from 'lucide-react'
import Link from 'next/link'
import io, { Socket } from 'socket.io-client'

import gdData from '@/data/gd_60_sets.json'

interface GDTopic {
  topic: string;
  category: string;
  key_points: string[];
}

const GD_TOPICS: GDTopic[] = gdData.sets.flatMap(s => s.topics)

const STRATEGIES = [
  { icon: '⚡', title: 'Enter Early', desc: 'Make your first point within the first 2 minutes. Use a fact, statistic, or a recent event to open strong.' },
  { icon: '🧠', title: 'Structure Your Argument', desc: 'Follow the Point → Proof → Impact framework. State your claim, back it with evidence, show its consequence.' },
  { icon: '🤝', title: 'Build on Others', desc: 'Reference other speakers: "Building on what X said..." This shows cooperation and active listening.' },
  { icon: '📊', title: 'Use Data & Facts', desc: 'Quote recent statistics, government reports, or real-world examples. Avoid vague generalizations.' },
  { icon: '🎯', title: 'Summarize to Lead', desc: 'Near the end, offer a balanced summary covering all perspectives. This naturally positions you as a leader.' }
]

const GD_DURATION = 600 // 10 minutes in seconds

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    }
  ]
}

export default function GDPage() {
  const [search, setSearch] = useState('')
  const [practiceMode, setPracticeMode] = useState(false)
  const [liveMode, setLiveMode] = useState(false)
  const [currentTopic, setCurrentTopic] = useState<GDTopic | null>(null)
  const [timeLeft, setTimeLeft] = useState(GD_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  
  // AI GTO Assessor states
  const [transcript, setTranscript] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [gtoResult, setGtoResult] = useState<any>(null)
  const recognitionRef = useRef<any>(null)
  const [aiSessionState, setAiSessionState] = useState<any>(null)
  const [isAiThinking, setIsAiThinking] = useState(false)
  
  // Socket & WebRTC states
  const [socket, setSocket] = useState<Socket | null>(null)
  const [roomId] = useState('gd-room-1')
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  
  const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({})
  const peersRef = useRef<{ [id: string]: RTCPeerConnection }>({})
  const localStreamRef = useRef<MediaStream | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRefs = useRef<{ [id: string]: HTMLAudioElement | null }>({})

  const filtered = GD_TOPICS.filter(t => t.topic.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (recognitionRef.current) recognitionRef.current.stop()
      cleanupWebRTC()
    }
  }, [])

  const cleanupWebRTC = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    Object.values(peersRef.current).forEach(pc => pc.close())
    peersRef.current = {}
    if (socket) socket.disconnect()
  }

  // --- WebRTC Logic ---
  const startLiveMode = async () => {
    setLiveMode(true)
    setPracticeMode(false)
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      setLocalStream(stream)
      localStreamRef.current = stream
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const newSocket = io(backendUrl)
      setSocket(newSocket)

      newSocket.on('connect', () => {
        newSocket.emit('join_gd_room', { roomId, username: `Cadet-${newSocket.id?.slice(0,4)}` })
      })

      newSocket.on('all_users', (usersInRoom: string[]) => {
        usersInRoom.forEach(userId => {
          createPeerConnection(userId, newSocket, stream, true)
        })
      })

      newSocket.on('user_joined', (userId: string) => {
        createPeerConnection(userId, newSocket, stream, false)
      })

      newSocket.on('webrtc_offer', async (payload: { caller: string, sdp: RTCSessionDescriptionInit }) => {
        let pc = peersRef.current[payload.caller]
        if (!pc) {
           pc = createPeerConnection(payload.caller, newSocket, stream, false)
        }
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        newSocket.emit('webrtc_answer', { target: payload.caller, sdp: pc.localDescription })
      })

      newSocket.on('webrtc_answer', async (payload: { caller: string, sdp: RTCSessionDescriptionInit }) => {
        const pc = peersRef.current[payload.caller]
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp))
        }
      })

      newSocket.on('webrtc_ice_candidate', async (payload: { caller: string, candidate: RTCIceCandidateInit }) => {
        const pc = peersRef.current[payload.caller]
        if (pc) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(payload.candidate))
          } catch (e) {
            console.error("Error adding ice candidate", e)
          }
        }
      })

      newSocket.on('user_left', (userId: string) => {
        if (peersRef.current[userId]) {
          peersRef.current[userId].close()
          delete peersRef.current[userId]
        }
        setPeers(prev => {
          const newPeers = { ...prev }
          delete newPeers[userId]
          return newPeers
        })
      })

      newSocket.on('topic_assigned', ({ topic }: { topic: GDTopic }) => {
        setCurrentTopic(topic)
        setTimeLeft(GD_DURATION)
        setIsRunning(true)
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current)
              setIsRunning(false)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      })
      
    } catch (err) {
      console.error("Microphone access denied or failed", err)
      alert("Microphone access is required for Live GD Voice Room.")
      setLiveMode(false)
    }
  }

  const createPeerConnection = (userId: string, sck: Socket, stream: MediaStream, isInitiator: boolean) => {
    const pc = new RTCPeerConnection(ICE_SERVERS)
    peersRef.current[userId] = pc

    stream.getTracks().forEach(track => pc.addTrack(track, stream))

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sck.emit('webrtc_ice_candidate', { target: userId, candidate: event.candidate })
      }
    }

    pc.ontrack = (event) => {
      setPeers(prev => ({ ...prev, [userId]: event.streams[0] }))
    }

    if (isInitiator) {
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer).then(() => {
          sck.emit('webrtc_offer', { target: userId, sdp: pc.localDescription })
        })
      })
    }

    return pc
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  // Bind audio streams to elements when they arrive
  useEffect(() => {
    Object.entries(peers).forEach(([userId, stream]) => {
      const audioEl = audioRefs.current[userId]
      if (audioEl && audioEl.srcObject !== stream) {
        audioEl.srcObject = stream
      }
    })
  }, [peers])

  const broadcastTopic = () => {
    if (!socket) return
    const randomTopic = GD_TOPICS[Math.floor(Math.random() * GD_TOPICS.length)]
    socket.emit('start_gd_topic', { roomId, topic: randomTopic })
  }

  // --- AI Assessor API ---
  const evaluateGTO = async (scenario: string, response_text: string) => {
    if (!response_text.trim()) return
    setIsEvaluating(true)
    try {
      const res = await fetch(`/api/evaluate-gpe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          solution: response_text,
          timeUsed: 300, // Approximate 5 mins for GD points
          scenarioType: scenario 
        })
      })
      const data = await res.json()
      if (data && data.gto_board_verdict) {
        setGtoResult(data)
      } else {
        setGtoResult(data.evaluation || data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsEvaluating(false)
    }
  }

  // --- AI Simulator Practice Logic ---
  const startPractice = async (topicObj?: GDTopic) => {
    cleanupWebRTC()
    const selected = topicObj || GD_TOPICS[Math.floor(Math.random() * GD_TOPICS.length)]
    setCurrentTopic(selected)
    setTimeLeft(GD_DURATION)
    setPracticeMode(true)
    setLiveMode(false)
    setIsRunning(true)
    
    setTranscript('')
    setGtoResult(null)
    setAiSessionState(null)
    
    try {
      const res = await fetch('/api/gto/gd/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: `session_${Date.now()}` })
      })
      const data = await res.json()
      // Override the random backend topic with our selected frontend topic for UI consistency
      data.state.topic = selected.topic; 
      setAiSessionState(data.state)
    } catch (e) {
      console.error("GD Init Error:", e)
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.onresult = (event: any) => {
        let current = ''
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript + ' '
        }
        setTranscript(current)
      }
      try {
        recognitionRef.current.start()
      } catch (e) { console.error("Mic error:", e) }
    }
    
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setIsRunning(false)
          if (recognitionRef.current) recognitionRef.current.stop()
          evaluateGTO(selected.topic, transcript)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopPractice = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRunning(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const submitTurnToAI = async () => {
    if (!transcript.trim() || !aiSessionState) return;
    
    setIsAiThinking(true);
    const userMessage = transcript;
    
    // Clear transcript for next turn
    setTranscript('');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setTimeout(() => {
        try { recognitionRef.current.start() } catch (e) {}
      }, 500);
    }

    try {
      const res = await fetch('/api/gto/gd/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: aiSessionState,
          userMessage
        })
      });
      const data = await res.json();
      setAiSessionState(data.state);

      // Speak AI responses
      if ('speechSynthesis' in window) {
        data.aiResponses.forEach((resp: any) => {
          const utterance = new SpeechSynthesisUtterance(`${resp.speakerName} says: ${resp.content}`);
          window.speechSynthesis.speak(utterance);
        });
      }

      if (data.state.completed) {
        setIsRunning(false);
        if (recognitionRef.current) recognitionRef.current.stop();
        evaluateGTO(currentTopic!.topic, data.state.history.map((h:any) => h.content).join(" "));
      }
    } catch (e) {
      console.error("GD Turn Error:", e);
    } finally {
      setIsAiThinking(false);
    }
  }

  const resetPractice = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (recognitionRef.current) recognitionRef.current.stop()
    cleanupWebRTC()
    setPracticeMode(false)
    setLiveMode(false)
    setIsRunning(false)
    setTimeLeft(GD_DURATION)
    setTranscript('')
    setGtoResult(null)
  }

  const timerPercent = (timeLeft / GD_DURATION) * 100
  const timerColor = timerPercent > 50 ? 'bg-emerald-500' : timerPercent > 20 ? 'bg-amber-500' : 'bg-red-500'
  const timerGlow = timerPercent > 50 ? 'shadow-emerald-500/50' : timerPercent > 20 ? 'shadow-amber-500/50' : 'shadow-red-500/50'
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link href="/karmana/gto" className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Command Center
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">GTO Phase II</span>
        </div>
      </div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl md:rounded-[48px] bg-gradient-to-br from-[#064e3b] via-[#043b2f] to-[#022c22] p-12 md:p-16 border border-emerald-500/20 shadow-2xl text-center">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
            <MessageSquare className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Group Task • Verbal</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">
            Group <span className="text-emerald-400">Discussion</span>
          </h1>
          <p className="text-emerald-100/70 font-bold text-lg max-w-2xl mx-auto">
            Two topics are given — one formal, one informal. The group discusses each for <strong className="text-white">10 minutes</strong>. 
            Assessors evaluate your reasoning, communication, and team dynamics.
          </p>
          <div className="flex justify-center gap-6">
            {[
              { icon: Clock, label: '20 Min', sub: 'Total Duration' },
              { icon: Users, label: '8-10', sub: 'Group Size' },
              { icon: Target, label: '150 XP', sub: 'Reward' },
            ].map(s => (
              <div key={s.sub} className="bg-[#0f172a]/60 rounded-2xl px-6 py-4 border border-white/10 text-center">
                <s.icon className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-white font-black text-lg">{s.label}</p>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Controller Area */}
      {!practiceMode && !liveMode && (
        <div className="flex justify-center gap-6">
          <button onClick={() => startPractice()} className="flex items-center gap-3 px-10 py-5 bg-[#1e293b] text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#334155] transition-all shadow-xl hover:-translate-y-1">
            <Play className="w-5 h-5 fill-current text-emerald-500" /> Solo Practice
          </button>
          
          <button onClick={startLiveMode} className="flex items-center gap-3 px-10 py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover:-translate-y-1">
            <Radio className="w-5 h-5 fill-current" /> Join Live Voice Room
          </button>
        </div>
      )}

      {/* Live Mode Interface */}
      {liveMode && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-[#162840] rounded-[40px] p-8 border border-[#1E3A5F] space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                   <h2 className="text-white font-black uppercase tracking-widest">Live Voice Room: {roomId}</h2>
               </div>
               <div className="flex items-center gap-4">
                 <button onClick={toggleMute} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                   {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                   {isMuted ? 'Muted' : 'Mic Active'}
                 </button>
                 <button onClick={resetPractice} className="text-xs text-slate-400 uppercase font-black tracking-widest hover:text-white">Leave Room</button>
               </div>
            </div>

            {currentTopic ? (
               <div className="bg-[#0f172a] rounded-3xl p-8 border border-emerald-500/20 text-center">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3">Active Discussion Topic</p>
                  <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">{currentTopic.topic}</h2>
                  
                  <div className="mt-8">
                     <span className={`font-mono text-4xl font-black tabular-nums ${timerColor} text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]`}>
                        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                     </span>
                  </div>
               </div>
            ) : (
               <div className="bg-[#0f172a] rounded-3xl p-12 border border-white/5 text-center space-y-6">
                  <Radio className="w-12 h-12 text-slate-500 mx-auto animate-pulse" />
                  <p className="text-slate-400 font-bold">Waiting for moderator to broadcast a topic...</p>
                  <button onClick={broadcastTopic} className="px-6 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-emerald-500/20">
                     Broadcast Random Topic
                  </button>
               </div>
            )}
          </div>

          <div className="bg-[#0f172a] border border-white/5 rounded-[40px] p-6">
             <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4 border-b border-white/5 pb-4">
               Voice Participants ({Object.keys(peers).length + 1})
             </h3>
             
             <div className="space-y-3">
                {/* Self */}
                <div className="flex items-center justify-between bg-[#1e293b] rounded-2xl p-4 border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-400 font-bold text-xs">ME</span>
                    </div>
                    <span className="text-white font-medium text-sm">You</span>
                  </div>
                  {isMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                </div>

                {/* Peers */}
                {Object.entries(peers).map(([userId, stream]) => (
                  <div key={userId} className="flex items-center justify-between bg-[#162840] rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-slate-300 font-medium text-sm">Cadet-{userId.slice(0,4)}</span>
                    </div>
                    <Volume2 className="w-4 h-4 text-emerald-400/50" />
                    <audio 
                      ref={el => { audioRefs.current[userId] = el }} 
                      autoPlay 
                      className="hidden" 
                    />
                  </div>
                ))}
             </div>
          </div>
        </motion.div>
      )}

      {/* Solo Practice Mode */}
      {practiceMode && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#162840] rounded-[40px] p-8 border border-[#1E3A5F] space-y-6">
          {/* Timer Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Countdown Timer</span>
              <span className={`font-mono text-3xl font-black tabular-nums ${timerPercent > 50 ? 'text-emerald-500' : timerPercent > 20 ? 'text-amber-500' : 'text-red-500'}`}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${timerColor} shadow-lg ${timerGlow} transition-colors duration-500`}
                animate={{ width: `${timerPercent}%` }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </div>
          </div>
          {/* Topic Display */}
          <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/5 text-center">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3">Discussion Topic</p>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">{currentTopic?.topic}</h2>
            {currentTopic && (
              <div className="mt-6 bg-[#162840] border border-white/5 rounded-2xl p-6 text-left inline-block w-full max-w-3xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Suggested Key Points to Include</p>
                <div className="flex flex-wrap gap-2">
                  {currentTopic.key_points.map((pt, idx) => (
                    <span key={idx} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold">
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {isRunning ? (
              <button onClick={stopPractice} className="flex items-center gap-2 px-8 py-4 bg-red-500/20 text-red-500 border border-red-500/30 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500/30 transition-all">
                <Square className="w-4 h-4" /> Pause
              </button>
            ) : timeLeft > 0 ? (
              <button onClick={() => startPractice(currentTopic || undefined)} className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-all shadow-lg">
                <Play className="w-4 h-4" /> Resume
              </button>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-2xl font-black text-amber-500 uppercase tracking-tight">⏰ Time's Up!</p>
                <p className="text-slate-400 text-sm font-bold">Assess your points, structure, and participation quality</p>
              </div>
            )}
            <button onClick={resetPractice} className="flex items-center gap-2 px-6 py-4 bg-white/5 text-slate-400 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
              <RotateCcw className="w-4 h-4" /> End Practice
            </button>
          </div>
          {timeLeft === 0 && !isRunning && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
              <p className="text-emerald-400 font-black text-sm uppercase tracking-widest">Self-Assessment Checkpoint</p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {['Did I enter early?', 'Did I use data/examples?', 'Did I summarize?'].map(q => (
                  <div key={q} className="bg-[#0f172a] rounded-xl p-3 text-slate-400 text-xs font-bold">{q}</div>
                ))}
              </div>
            </div>
          )}

          {/* AI Live Transcript */}
          {practiceMode && aiSessionState && !gtoResult && (
             <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6">
               <div className="mb-6 space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                 {aiSessionState.history.slice(1).map((h: any, i: number) => (
                   <div key={i} className={`p-3 rounded-xl max-w-[80%] ${h.role === 'user' ? 'bg-emerald-500/20 border-emerald-500/30 ml-auto border' : 'bg-[#1e293b] border-white/5 border'}`}>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{h.speakerName}</p>
                     <p className="text-white text-sm">{h.content}</p>
                   </div>
                 ))}
                 {isAiThinking && (
                   <div className="p-3 rounded-xl max-w-[80%] bg-[#1e293b] border-white/5 border">
                     <p className="text-slate-400 text-sm animate-pulse">...</p>
                   </div>
                 )}
               </div>

               <div className="flex gap-4 items-end">
                 <div className="flex-1 bg-[#1e293b] rounded-xl p-4 border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <Mic className="w-3 h-3 text-red-500 animate-pulse" /> Live Speech (Speak now)
                   </p>
                   <p className="text-slate-300 italic text-sm min-h-[40px]">{transcript || "Waiting for speech..."}</p>
                 </div>
                 <button 
                   onClick={submitTurnToAI}
                   disabled={isAiThinking || !transcript.trim()}
                   className="px-6 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-colors shrink-0"
                 >
                   Send Turn
                 </button>
               </div>
             </div>
          )}

          {/* AI GTO Assessor Result */}
          {isEvaluating && (
             <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center animate-pulse">
               <Radio className="w-8 h-8 text-emerald-400 mx-auto mb-3 animate-bounce" />
               <h3 className="text-emerald-400 font-black uppercase tracking-widest">Brigadier GTO Analyzing Speech...</h3>
               <p className="text-slate-400 text-xs mt-2">Evaluating Practical Intelligence & Group Dynamics</p>
             </div>
          )}

          {gtoResult && (
             <div className="bg-[#064e3b] border border-emerald-500/50 rounded-2xl p-8 shadow-2xl shadow-emerald-500/20">
               <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4 mb-4">
                 <div className="bg-emerald-500 text-black px-3 py-1 rounded-full font-black text-sm uppercase tracking-widest">
                   Score: {gtoResult.recommendation_score}/5
                 </div>
                 <h3 className="text-emerald-300 font-black uppercase tracking-widest">AI GTO Feedback</h3>
               </div>
               
               <div className="space-y-4">
                 <div className="bg-black/20 rounded-xl p-4 border border-emerald-500/10">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Practical Intelligence</p>
                    <p className="text-emerald-100/90 text-sm">{gtoResult.practical_intelligence}</p>
                 </div>
                 
                 <div className="bg-black/20 rounded-xl p-4 border border-emerald-500/10">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Group Dynamics Analysis</p>
                    <p className="text-emerald-100/90 text-sm">{gtoResult.group_dynamics}</p>
                 </div>

                 <div className="bg-black/20 rounded-xl p-4 border border-emerald-500/10">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">GTO Internal Thoughts</p>
                    <p className="text-slate-300 italic text-sm">"{gtoResult.gto_thoughts}"</p>
                 </div>
               </div>
             </div>
          )}
        </motion.div>
      )}

      {/* Strategy Cards */}
      <div>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Tactical Strategy — 5 Key Moves</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STRATEGIES.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-[#0f172a] rounded-[32px] p-6 border border-white/5 hover:border-emerald-500/30 transition-all text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="text-white font-black uppercase tracking-tight text-sm mb-2">{s.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-[32px] p-8">
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-5 flex items-center gap-2">
            <span>✅</span> Do's — What Gets You Noticed
          </h3>
          <ul className="space-y-3">
            {[
              'Enter the discussion within the first 2 minutes',
              'Use the Point → Proof → Impact structure',
              'Reference current affairs, data, and real examples',
              'Acknowledge and build on others\' points',
              'Offer a balanced summary near the end',
              'Maintain positive body language and eye contact'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="text-slate-300 text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/5 border border-red-500/15 rounded-[32px] p-8">
          <h3 className="text-red-400 font-black uppercase tracking-widest text-[10px] mb-5 flex items-center gap-2">
            <span>❌</span> Don'ts — Red Flags
          </h3>
          <ul className="space-y-3">
            {[
              'Don\'t shout, interrupt, or talk over others',
              'Don\'t stay completely silent — it\'s worse than a bad point',
              'Don\'t make personal attacks on other candidates',
              'Don\'t monopolize — speak 3-4 times, not 10',
              'Don\'t use vague statements without evidence',
              'Don\'t change your stance just to agree with the majority'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span className="text-slate-400 text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 50 Topic Bank */}
      <div className="bg-[#0f172a] rounded-3xl md:rounded-[48px] p-8 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">GD Topic Bank</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{GD_TOPICS.length} Recent SSB Topics</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search topics..."
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {filtered.map((topic, i) => (
            <div key={i} className="flex flex-col gap-2 bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => startPractice(topic)}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-emerald-500 w-6">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-slate-300 text-sm font-bold">{topic.topic}</span>
              </div>
              <div className="pl-9 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#1e293b] border border-slate-700 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{topic.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
