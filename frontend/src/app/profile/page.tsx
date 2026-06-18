'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Activity, ShieldCheck, Sword, Crosshair, Map, Shield } from 'lucide-react';
import { fetchProfile, logEvent, getRankInfo, GamificationProfile } from '@/lib/gamification';

export default function ProfileDashboard() {
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = "test-user-1"; // Using dummy user for MVP

  useEffect(() => {
    async function loadData() {
      try {
        // Automatically award daily login if needed
        await logEvent(userId, "daily_login");
        const data = await fetchProfile(userId);
        setProfile(data);
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!profile) return null;

  const { currentRank, nextRank, progressToNext, xpToNext } = getRankInfo(profile.xp);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield className="w-64 h-64" />
          </div>
          
          <div className="flex items-center gap-6 z-10">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-slate-900">
                {currentRank.icon}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-800 border border-slate-700 text-emerald-400 font-bold px-3 py-1 rounded-full text-sm">
                Lv.{currentRank.level}
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">SSB Aspirant</h1>
              <p className="text-emerald-400 font-medium text-lg tracking-wide uppercase">{currentRank.title}</p>
            </div>
          </div>

          <div className="flex gap-4 z-10">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px]">
              <Flame className="w-8 h-8 text-orange-500 mb-2" />
              <span className="text-2xl font-bold text-white">{profile.dailyLogin.loginStreak}</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Day Streak</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px]">
              <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
              <span className="text-2xl font-bold text-white">{profile.xp}</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Total XP</span>
            </div>
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Next Promotion</h3>
              <p className="text-sm text-slate-400">
                {nextRank ? `${xpToNext} XP needed for ${nextRank.title}` : 'Maximum rank achieved'}
              </p>
            </div>
            {nextRank && (
              <div className="text-2xl bg-slate-800 p-2 rounded-lg border border-slate-700">
                {nextRank.icon}
              </div>
            )}
          </div>
          
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
            />
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Stats Breakdown */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Task Completion Mastery
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-emerald-500/50 transition-colors">
                <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">OIR Sets</div>
                  <div className="text-xl font-bold text-white">{profile.taskCompletions['oir_speed_test']?.completions || 0}</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-purple-500/50 transition-colors">
                <div className="bg-purple-500/20 p-3 rounded-lg text-purple-400">
                  <Crosshair className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Psych Tests</div>
                  <div className="text-xl font-bold text-white">{profile.taskCompletions['psych_test']?.completions || 0}</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-orange-500/50 transition-colors">
                <div className="bg-orange-500/20 p-3 rounded-lg text-orange-400">
                  <Sword className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Interviews</div>
                  <div className="text-xl font-bold text-white">{profile.taskCompletions['mock_interview']?.completions || 0}</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-teal-500/50 transition-colors">
                <div className="bg-teal-500/20 p-3 rounded-lg text-teal-400">
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">GPE Solved</div>
                  <div className="text-xl font-bold text-white">{profile.taskCompletions['gpe_task']?.completions || 0}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Log */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col h-[400px]"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Recent Service Record
            </h2>
            
            <div className="overflow-y-auto pr-2 space-y-4 flex-1">
              {profile.events.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">No recent activity</div>
              ) : (
                [...profile.events].reverse().map((ev, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-slate-800/30 rounded-lg border border-slate-800/50">
                    <div className={`p-2 rounded-full mt-1 ${ev.type === 'daily_login' ? 'bg-orange-500/20 text-orange-400' : ev.type === 'streak_bonus' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {ev.type === 'daily_login' ? <Flame className="w-4 h-4" /> : ev.type === 'streak_bonus' ? <Star className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-200 capitalize">
                          {ev.type.replace('_', ' ')}
                        </span>
                        <span className="text-emerald-400 font-bold">+{ev.xpDelta} XP</span>
                      </div>
                      <div className="text-xs text-slate-500 flex justify-between">
                        <span>{ev.taskKey || 'Platform'}</span>
                        <span>{new Date(ev.occurredAtIso).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
