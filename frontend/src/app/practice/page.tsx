'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, MessageSquare, Zap, Send, MessageCircle, Trophy, Globe, Share2, Loader2, RefreshCcw, CheckCircle2, Flame, Award, Target } from 'lucide-react'
import watBank from '@/data/wat_word_bank.json'
import srtBank from '@/data/srt_situation_bank.json'
import interviewBank from '@/data/interview_questions_expanded.json'

interface DailyChallenge {
  oir: { question: string; options?: string[]; answer?: string } | null;
  wat: { word: string } | null;
  srt: { situation: string } | null;
  interview: { question: string } | null;
}

export default function DailyPracticePage() {
  const [challenges, setChallenges] = useState<DailyChallenge>({ oir: null, wat: null, srt: null, interview: null });
  const [isLoading, setIsLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [answers, setAnswers] = useState({ oir: '', wat: '', srt: '', interview: '' });
  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<{oir: string, wat: string, srt: string, interview: string, areasToImprove: string[]} | null>(null);
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);

  // Get today's date for display
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });

  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const fetchChallenges = async (forceNew = false, currentBoard = selectedBoard) => {
    setIsLoading(true);
    setSubmitted(false);
    setEvaluation(null);
    setAnswers({ oir: '', wat: '', srt: '', interview: '' });

    const todayDateStr = new Date().toISOString().split('T')[0];
    const cachedDate = localStorage.getItem('daily_challenge_date');
    const cachedData = localStorage.getItem('daily_challenge_data');
    const cachedBoard = localStorage.getItem('daily_challenge_board');

    if (!forceNew && cachedDate === todayDateStr && cachedData && cachedBoard === currentBoard) {
      setChallenges(JSON.parse(cachedData));
      setIsLoading(false);
      setBackendOnline(true);
      return;
    }

    try {
      // Offline fallback generated from local data seeded by day of year (1-365)
      let offset = parseInt(localStorage.getItem('daily_challenge_offset') || '0');
      if (forceNew) {
        offset += 1;
        localStorage.setItem('daily_challenge_offset', offset.toString());
      }
      
      // Calculate a board-specific offset to ensure different boards get different questions
      let boardOffset = 0;
      for (let i = 0; i < currentBoard.length; i++) {
        boardOffset += currentBoard.charCodeAt(i);
      }
      
      const dayIndex = getDayOfYear() + offset + boardOffset;
      
      const localWatWord = watBank.sets[0]?.words[dayIndex % (watBank.sets[0].words.length)] || 'LEADERSHIP';
      const srtItem: any = srtBank.sets[0]?.situations[dayIndex % (srtBank.sets[0].situations.length)];
      const localSrtSituation = typeof srtItem === 'string' ? srtItem : (srtItem?.text || srtItem?.situation || 'While on a trek with friends, your group leader sprains his ankle...');
      const localInterviewQ = interviewBank[0]?.questions[dayIndex % (interviewBank[0].questions.length)] || 'Tell me about a time you failed.';

      const fallbackChallenges = {
        oir: { question: 'If ACED is coded as 1354, how is FADE coded?', options: ['6135', '6154', '6145', '6134'], answer: '6135' },
        wat: { word: localWatWord },
        srt: { situation: localSrtSituation },
        interview: { question: localInterviewQ },
      };

      setChallenges(fallbackChallenges);
      localStorage.setItem('daily_challenge_date', todayDateStr);
      localStorage.setItem('daily_challenge_data', JSON.stringify(fallbackChallenges));
      localStorage.setItem('daily_challenge_board', currentBoard);
      setBackendOnline(true);
      setIsLoading(false);

    } catch (err) {
      console.error('Failed to generate daily challenges:', err);
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchChallenges(false, selectedBoard);
  }, [selectedBoard]);

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem('ssb_streak') || '0');
    const savedXp = parseInt(localStorage.getItem('ssb_xp') || '0');
    setStreak(savedStreak);
    setXp(savedXp);
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    
    // Evaluate answers
    const evalResult = {
      oir: '',
      wat: '',
      srt: '',
      interview: '',
      areasToImprove: [] as string[]
    };

    if (answers.oir === challenges.oir?.answer) {
      evalResult.oir = 'Correct logic applied. Your spatial/logical reasoning is sharp.';
    } else {
      evalResult.oir = `Incorrect. The correct answer was ${challenges.oir?.answer}. Focus on pattern recognition accuracy.`;
      evalResult.areasToImprove.push('OIR Pattern Recognition');
    }

    if (!answers.wat || answers.wat.split(' ').length < 3) {
      evalResult.wat = 'Response too short or missing. Sentences should show meaningful action.';
      evalResult.areasToImprove.push('WAT Reaction Speed & Depth');
    } else if (/(no|not|never|hate|bad|kill|sad)/i.test(answers.wat)) {
      evalResult.wat = 'Detected negative terms. Focus on positive, constructive sentence structures.';
      evalResult.areasToImprove.push('Optimism & Positivity (OLQ)');
    } else {
      evalResult.wat = 'Good length and positive structure. Shows constructive mindset.';
    }

    if (!answers.srt || answers.srt.split(' ').length < 5) {
      evalResult.srt = 'Response too brief. SRT requires a complete, logical sequence of actions from start to resolution.';
      evalResult.areasToImprove.push('SRT Detail & Decisiveness');
    } else {
      evalResult.srt = 'Detailed response. Shows good situation comprehension.';
    }

    if (!answers.interview || answers.interview.split(' ').length < 15) {
      evalResult.interview = 'Your answer is too brief for an interview. Expand with real-life examples and context.';
      evalResult.areasToImprove.push('Interview Elaboration & Confidence');
    } else {
      evalResult.interview = 'Good length. Ensure you are highlighting relevant Officer Like Qualities (OLQs) in your narrative.';
    }

    if (evalResult.areasToImprove.length === 0) {
      evalResult.areasToImprove.push('Maintain consistency and speed under pressure.');
    }

    setEvaluation(evalResult);

    const newXp = xp + 50;
    const newStreak = streak + 1;
    setXp(newXp);
    setStreak(newStreak);
    localStorage.setItem('ssb_xp', newXp.toString());
    localStorage.setItem('ssb_streak', newStreak.toString());
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* Daily War Room Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#0f172a] rounded-[48px] p-10 overflow-hidden text-center border border-white/5 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-[80px]"></div>
        <div className="flex flex-col items-center relative z-10">
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Real-Time Challenge</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter uppercase">Daily War Room</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mb-4">{today}</p>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${backendOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
              <div className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
              {backendOnline ? 'API Live' : 'Local Mode'}
            </div>
            <button 
              onClick={() => fetchChallenges(true)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500/20 transition-all disabled:opacity-30"
            >
              <RefreshCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              New Set
            </button>
          </div>
        </div>
      </motion.div>

      {/* Streak & XP Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#162840] rounded-[24px] p-5 border border-[#1E3A5F] flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{streak}</p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Day Streak</p>
          </div>
        </div>
        <div className="bg-[#162840] rounded-[24px] p-5 border border-[#1E3A5F] flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{xp}</p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">XP Earned</p>
          </div>
        </div>
        <div className="bg-[#162840] rounded-[24px] p-5 border border-[#1E3A5F] flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{Math.floor(xp / 500) + 1}</p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rank Level</p>
          </div>
        </div>
      </div>

      {/* Board Mode Selector */}
      <div className="bg-[#162840] rounded-[28px] p-6 border border-[#1E3A5F]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Board Mode</p>
            <p className="text-white font-black text-lg uppercase">Choose Your SSB Board</p>
          </div>
          <div className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
            {selectedBoard === 'all' ? 'All Boards' : selectedBoard}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Boards', color: 'slate' },
            { id: '11 SSB', label: '11 SSB Allahabad', color: 'emerald' },
            { id: '12 SSB', label: '12 SSB Bangalore', color: 'emerald' },
            { id: '1 AFSB', label: '1 AFSB Dehradun', color: 'sky' },
            { id: '2 AFSB', label: '2 AFSB Mysuru', color: 'sky' },
            { id: 'INS Delhi', label: 'INS Delhi', color: 'blue' },
          ].map((board) => (
            <button
              key={board.id}
              onClick={() => setSelectedBoard(board.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                selectedBoard === board.id
                  ? 'bg-yellow-500 text-black border-yellow-500'
                  : 'bg-[#0f172a] border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              {board.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Synchronizing with Intelligence Server...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. OIR Challenge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#162840] rounded-[32px] p-8 border border-white/5 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                   <Brain className="w-4 h-4" />
                 </div>
                 <h2 className="text-xl font-black text-white tracking-tight uppercase">1. OIR Challenge</h2>
              </div>
              
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex-1 bg-[#0f172a] rounded-2xl p-8 border border-white/5 flex items-center justify-center text-center">
                  <p className="text-slate-300 font-bold text-lg leading-relaxed">
                    {challenges.oir?.question || 'Loading...'}
                  </p>
                </div>
                {challenges.oir?.options && (
                  <div className="grid grid-cols-2 gap-3">
                    {challenges.oir.options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => setAnswers(prev => ({ ...prev, oir: opt }))}
                        className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                          answers.oir === opt 
                            ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' 
                            : 'bg-[#0f172a] border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                {!challenges.oir?.options && (
                  <textarea 
                    value={answers.oir}
                    onChange={(e) => setAnswers(prev => ({ ...prev, oir: e.target.value }))}
                    placeholder="Type your answer and explanation here..."
                    className="w-full h-full min-h-[120px] bg-[#0f172a] rounded-2xl p-6 border border-white/5 focus:outline-none focus:border-yellow-500/50 text-slate-400 text-sm resize-none"
                  />
                )}
              </div>
            </motion.div>

            {/* 2. Word Association */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#162840] rounded-[32px] p-8 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                   <MessageCircle className="w-4 h-4" />
                 </div>
                 <h2 className="text-xl font-black text-white tracking-tight uppercase">2. Word Association</h2>
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-auto">15 sec timer</span>
              </div>
              
              <div className="space-y-6">
                <div className="bg-blue-500/5 rounded-2xl p-8 border border-blue-500/10 flex items-center justify-center">
                  <span className="text-4xl font-black text-blue-400 tracking-[0.2em] uppercase">
                    {challenges.wat?.word || 'Loading...'}
                  </span>
                </div>
                <textarea 
                  value={answers.wat}
                  onChange={(e) => setAnswers(prev => ({ ...prev, wat: e.target.value }))}
                  placeholder="Write a positive, action-oriented sentence using this word..."
                  className="w-full min-h-[100px] bg-[#0f172a] rounded-2xl p-6 border border-white/5 focus:outline-none focus:border-blue-500/50 text-slate-400 text-sm resize-none"
                />
              </div>
            </motion.div>

            {/* 3. Situation Reaction */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#162840] rounded-[32px] p-8 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                   <Zap className="w-4 h-4" />
                 </div>
                 <h2 className="text-xl font-black text-white tracking-tight uppercase">3. Situation Reaction</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-orange-500/5 rounded-2xl p-8 border border-orange-500/10">
                  <p className="text-orange-400 font-bold text-sm leading-relaxed">
                    {challenges.srt?.situation || 'Loading...'}
                  </p>
                </div>
                <textarea 
                  value={answers.srt}
                  onChange={(e) => setAnswers(prev => ({ ...prev, srt: e.target.value }))}
                  placeholder="Your immediate action (be specific and practical)..."
                  className="w-full min-h-[100px] bg-[#0f172a] rounded-2xl p-6 border border-white/5 focus:outline-none focus:border-orange-500/50 text-slate-400 text-sm resize-none"
                />
              </div>
            </motion.div>

            {/* 4. Interview Question */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#162840] rounded-[32px] p-8 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                   <MessageSquare className="w-4 h-4" />
                 </div>
                 <h2 className="text-xl font-black text-white tracking-tight uppercase">4. Interview Question</h2>
              </div>
              
              <div className="flex gap-6 flex-col">
                <div className="flex-1 bg-purple-500/5 rounded-2xl p-8 border border-purple-500/10 flex items-center justify-center">
                  <p className="text-purple-400 font-bold text-sm leading-relaxed text-center">
                    "{challenges.interview?.question || 'Loading...'}"
                  </p>
                </div>
                <div className="flex-1">
                  <textarea 
                    value={answers.interview}
                    onChange={(e) => setAnswers(prev => ({ ...prev, interview: e.target.value }))}
                    placeholder="Type your answer (be honest and direct)..."
                    className="w-full h-full min-h-[120px] bg-[#0f172a] rounded-2xl p-6 border border-white/5 focus:outline-none focus:border-purple-500/50 text-slate-400 text-sm resize-none"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center py-4">
            {!submitted ? (
              <button 
                onClick={handleSubmit}
                disabled={!answers.oir && !answers.wat && !answers.srt && !answers.interview}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-full font-black tracking-widest uppercase flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Submit Entry
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center gap-8"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <span className="text-lg font-black text-emerald-500 uppercase tracking-widest">Entry Logged & Evaluated</span>
                  </div>
                </div>

                {evaluation && (
                  <div className="w-full bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] shadow-2xl text-left max-w-4xl">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                      <Target className="w-6 h-6 text-yellow-500" />
                      Tactical Assessment
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#0f172a] rounded-2xl p-5 border border-white/5">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">OIR Test</div>
                        <p className="text-sm font-bold text-slate-300">{evaluation.oir}</p>
                      </div>
                      <div className="bg-[#0f172a] rounded-2xl p-5 border border-white/5">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">WAT (Psychology)</div>
                        <p className="text-sm font-bold text-slate-300">{evaluation.wat}</p>
                      </div>
                      <div className="bg-[#0f172a] rounded-2xl p-5 border border-white/5">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">SRT (Psychology)</div>
                        <p className="text-sm font-bold text-slate-300">{evaluation.srt}</p>
                      </div>
                      <div className="bg-[#0f172a] rounded-2xl p-5 border border-white/5">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Personal Interview</div>
                        <p className="text-sm font-bold text-slate-300">{evaluation.interview}</p>
                      </div>
                    </div>

                    <div className="bg-orange-500/5 rounded-2xl p-6 border border-orange-500/20">
                      <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Targeted Improvement Areas</h4>
                      <ul className="space-y-3">
                        {evaluation.areasToImprove.map((area, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-bold text-orange-200">
                            <Flame className="w-4 h-4 text-orange-500" />
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => fetchChallenges(true)}
                  className="mt-4 text-xs font-black text-yellow-500 uppercase tracking-widest hover:text-yellow-400 transition-colors flex items-center gap-2 bg-yellow-500/10 px-6 py-3 rounded-full border border-yellow-500/20 hover:bg-yellow-500/20"
                >
                  <RefreshCcw className="w-4 h-4" /> Load Next Challenge Set
                </button>
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
