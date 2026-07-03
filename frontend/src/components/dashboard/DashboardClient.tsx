'use client';

import { 
  Trophy, 
  Brain, 
  Flame, 
  Star,
  Lightbulb,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  Video,
  ChevronRight,
  ShieldAlert,
  Target,
  LayoutDashboard,
  Map,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Radio,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TacticalMarquee from './TacticalMarquee';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { getDashboardData, type DashboardData } from '@/lib/dashboard-data';
import { updateStreak } from '@/lib/streak-manager';

const OlqRadarChart = dynamic(() => import('../charts/OlqRadarChart'), { ssr: false });
const ProgressLineChart = dynamic(() => import('../charts/ProgressLineChart'), { ssr: false });

const modules = [
  { name: 'OIR Test', desc: 'Officer Intelligence Rating — Verbal & Non-verbal reasoning tests with 96 sets.', icon: Lightbulb, color: 'orange', tag: '96 Sets', path: '/oir' },
  { name: 'Assessment Hub', desc: 'Full-spectrum Stage I & Stage II evaluation matrix with AI tracking.', icon: LayoutDashboard, color: 'emerald', tag: 'Full Suite', path: '/vacha/assessment' },
  { name: 'TAT (Psychology)', desc: 'Thematic Apperception Test — Write stories based on images shown.', icon: ImageIcon, color: 'purple', tag: 'Psychology', path: '/mansa/tat' },
  { name: 'Virtual Interview', desc: 'Practice your personal interview with Col. Arjun Singh (Virtual IO).', icon: Video, color: 'cyan', tag: 'AI Voice', path: '/vacha/interview' },
  { name: 'Daily News', desc: 'Real-time geopolitical updates and military advancements.', icon: Globe, color: 'blue', tag: 'Intel', path: '/news' },
  { name: 'Study Material', desc: 'Curated resources for SSB, NDA, CDS, and AFCAT examinations.', icon: BookOpen, color: 'orange', tag: 'Library', path: '/study-material' },
];

const MENTOR_QUOTES = [
  "Candidate, your 'Power of Expression' is trending high. Focus on 'Group Influence' in upcoming tactical tasks. The board values consistency over flashes of brilliance.",
  "Remember, the GTO doesn't look for the strongest person, but the most cooperative and practical thinker. Keep your ideas grounded.",
  "In your TAT stories, ensure your hero is proactive, not reactive. A true officer creates solutions before problems escalate.",
  "Your interview is a conversation, not an interrogation. Maintain composure, speak the truth, and show confidence in your journey.",
  "Speed in OIR is crucial, but accuracy is paramount. Do not rush blindly; trust your training and process each question methodically.",
  "Leadership is action, not position. Show your leadership through deeds in the GTO tasks.",
  "When the mind is controlled, the body follows. Stay calm under pressure during the Command Task.",
  "An officer's courage is tested not just in battle, but in the truth they speak during the interview.",
  "Your Self-Description is your anchor. Do not portray an ideal version; portray the real, improving you.",
  "A proactive hero in TAT doesn't wait for tragedy to strike to do their duty.",
  "It is not about dominating the group discussion, but about steering it towards a logical conclusion.",
  "Your physical stamina will get you through the obstacles, but mental stamina gets you recommended.",
  "Treat the assessors as silent observers. Do not look at them; focus on your group.",
  "A half-hearted attempt is worse than no attempt. Commit fully to every obstacle.",
  "Your WAT responses reflect your subconscious. Keep them positive, constructive, and action-oriented.",
  "In SRT, never leave a situation unresolved. An officer always completes the task.",
  "Don't memorize answers for the interview. Speak from the heart, and back it with facts.",
  "The chest number is an identity. Respect it, and make the board remember it for the right reasons.",
  "PPDT is about perception. See what is there, not what you want to see.",
  "Every setback in the GTO tasks is an opportunity to show your resilience.",
  "Cooperation is the bedrock of the armed forces. Show it in every group task.",
  "Your voice in the GD should be the voice of reason, not just the loudest voice.",
  "Listen as much as you speak. A good leader is always a good listener.",
  "The Military Planning Exercise tests your logic, not your imagination. Stick to the resources given.",
  "In the command task, if your subordinates fail, you fail. Lead them well.",
  "Your hobbies define your downtime. Make sure they reflect an active, inquisitive mind.",
  "A true leader takes the blame and shares the credit.",
  "The IO wants to know 'who' you are, not just 'what' you have done.",
  "Don't fake a smile. Let your genuine enthusiasm for the forces shine through.",
  "A strong story has a clear past, a logical present, and a positive future.",
  "Don't write about superheroes. Write about ordinary people doing extraordinary things.",
  "Your handwriting in the psych tests is the first impression. Keep it legible.",
  "A blank SRT is a skipped responsibility. Attempt everything.",
  "The conference is the final check. Maintain the same demeanor you had on day one.",
  "Don't fear the cross-questioning. It means they are interested in you.",
  "An officer never gives up. Show that fighting spirit until the last second.",
  "Your PIQ form is your blueprint. Know every single detail you have written.",
  "The obstacles are just wood and rope. The real test is your mind.",
  "In the snake race, the snake is your responsibility. Never drop it.",
  "Your general awareness reflects your curiosity about the world you will defend.",
  "Be brutally honest about your weaknesses in the SD, and equally vocal about how you are fixing them.",
  "A loud voice doesn't equal confidence. Clarity of thought does.",
  "If you don't know the answer, say so. Integrity is tested constantly.",
  "Don't be a follower, but know when to support a good idea.",
  "Every word in your TAT story should drive the narrative forward.",
  "The group obstacle race tests your team spirit under physical stress.",
  "Don't let one bad test affect the next. Compartmentalize like a true soldier.",
  "The psychologist reads between the lines. Keep your thoughts aligned with your actions.",
  "Your posture speaks before you do. Walk in with your head held high.",
  "In the SSB, you are competing with the standard, not with each other.",
  "The final recommendation is just the beginning. The real training starts after."
];

export default function DashboardClient({ initialDashData }: { initialDashData: DashboardData | null }) {
  const { user } = useAuth();
  const [dashData, setDashData] = useState<DashboardData | null>(initialDashData);
  const [loading, setLoading] = useState(!initialDashData);
  const [quote, setQuote] = useState(MENTOR_QUOTES[0]);
  const supabase = createClient();

  const stats = [
    { name: 'Overall Progress', value: dashData ? `${dashData.overallProgress}%` : '0%', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Tests Completed', value: `${dashData?.testsCompleted ?? 0}`, icon: Brain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Current Streak', value: `${dashData?.currentStreak ?? 0} Days`, icon: Flame, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Avg Score', value: `${dashData?.avgScore ?? 0}`, icon: Star, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const radarScores = dashData?.radarData && dashData.radarData.length > 0
    ? dashData.radarData.map(d => d.score)
    : Array(15).fill(0);

  const history = dashData?.trajectoryData
    ? dashData.trajectoryData.map(d => ({ date: d.date, score: d.score ?? 0 }))
    : [];

  useEffect(() => {
    // Rotating Quotes based on date seed
    const todayStr = new Date().toDateString();
    let seed = 0;
    for (let i = 0; i < todayStr.length; i++) {
      seed += todayStr.charCodeAt(i);
    }
    setQuote(MENTOR_QUOTES[seed % MENTOR_QUOTES.length]);

    if (!user?.id) {
      setLoading(false);
      return;
    }

    // Update streak on every load
    updateStreak(user.id, supabase).catch(console.error);

    // Fetch dashboard data from Supabase
    getDashboardData(user.id, supabase)
      .then(setDashData)
      .catch(console.error)
      .finally(() => setLoading(false));

    // Real-time: refresh dashboard on new session or profile changes
    const fetchFreshData = () => getDashboardData(user.id, supabase).then(setDashData);
    
    const channel = supabase.channel('dash_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assessment_sessions', filter: `user_id=eq.${user.id}` }, fetchFreshData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_progress', filter: `user_id=eq.${user.id}` }, fetchFreshData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_streaks', filter: `user_id=eq.${user.id}` }, fetchFreshData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assessment_profiles', filter: `user_id=eq.${user.id}` }, fetchFreshData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Show sign-in prompt for unauthenticated visitors
  if (!user && !loading) {
    return (
      <div className="space-y-12 pb-20">
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-[#0f2d4a]/40 backdrop-blur-xl p-8 md:p-16 border border-white/10 shadow-[0_0_50px_rgba(30,58,95,0.5)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f2d4a]/80 via-[#1a3d6e]/50 to-[#020617]/90" />
          <div className="relative z-10 max-w-2xl space-y-6 mx-auto text-center md:text-left">
            <h1 className="text-4xl md:text-7xl font-black text-white leading-none uppercase tracking-tighter">
              SSB <span className="text-emerald-500">PREP</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">by SSB NEXTGEN</p>
            <p className="text-[#8BA0B8] text-lg font-bold leading-relaxed italic">
              &quot;AI-powered SSB preparation with virtual interviews, psychology tests, GTO simulations, and officer-grade tactical mentoring.&quot;
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4 justify-center md:justify-start">
              <Link href="/login" className="bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95">
                Sign In to Start
              </Link>
              <Link href="/signup" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                Create Account
              </Link>
            </div>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-[120px]" 
          />
        </motion.section>

        {/* Show modules grid for discovery */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Target className="w-8 h-8 text-orange-500" />
            <h3 className="font-black text-2xl tracking-tight uppercase text-white">Training Modules</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((mod, index) => (
              <Link key={mod.name} href={mod.path}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group bg-[#162840]/80 backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-[#1a3050] hover:border-orange-500/50 transition-all cursor-pointer relative overflow-hidden block shadow-xl hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]"
                >
                  <div className="w-14 h-14 bg-[#0f172a] rounded-2xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-500/20 transition-all duration-500 border border-white/5 shadow-inner relative z-10">
                    <mod.icon size={26} />
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors relative z-10">{mod.name}</h4>
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed mb-6 uppercase tracking-widest relative z-10">{mod.desc}</p>
                  <span className="inline-block text-[9px] font-black text-orange-500 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20 uppercase tracking-[0.2em] relative z-10">
                    {mod.tag}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Tactical Marquee */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="-mx-4 lg:-mx-8 overflow-hidden"
      >
        <TacticalMarquee />
      </motion.div>

      {/* Welcome Banner */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl md:rounded-[48px] bg-[#0f2d4a]/40 backdrop-blur-xl p-8 md:p-16 border border-white/10 shadow-[0_0_50px_rgba(30,58,95,0.5)]"
      >
        {/* Subtle pattern overlay (CSS-only, no external dependency) */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2d4a]/80 via-[#1a3d6e]/50 to-[#020617]/90"></div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit">
            <Radio size={12} className="text-orange-500 animate-pulse" />
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Command Center: Active</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white leading-none uppercase tracking-tighter">
            SSB <span className="text-emerald-500">PREP</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">by SSB NEXTGEN</p>
          <p className="text-[#8BA0B8] text-lg font-bold leading-relaxed italic">
            &quot;Your SSB preparation journey continues. Track your reflexes, practice psych batteries, 
            and receive officer-grade feedback in real-time.&quot;
          </p>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-4">
             <Link href="/vacha/assessment" className="bg-orange-500 hover:bg-orange-400 text-black px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95">
                Initialize Mission
             </Link>
             <Link href="/guide" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                Read SOP
             </Link>
             <Link href="/profile" className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2">
                <Trophy size={14} /> Service Profile
             </Link>
          </div>
        </div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full translate-y-1/2 blur-[100px]" 
        />
      </motion.section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.name} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-[#162840]/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex items-center gap-6 hover:border-orange-500/50 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.name}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* OLQ Telemetry Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:col-span-8 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-[48px] p-12 relative overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute top-0 right-0 p-8">
             <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live Telemetry Feed</span>
             </div>
          </div>
          <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-white uppercase tracking-tight relative z-10">
            <ShieldAlert size={24} className="text-emerald-500 animate-pulse" />
            Performance Radar
          </h3>
          <div className="h-[450px] w-full relative z-10">
            <OlqRadarChart scores={radarScores} />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="lg:col-span-4 bg-gradient-to-br from-[#162840]/90 to-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-[48px] p-12 flex flex-col justify-center shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-20 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute -inset-24 bg-orange-500/5 rounded-full blur-[80px] group-hover:bg-orange-500/10 transition-colors duration-1000" />
          <div className="space-y-8 relative z-10">
            <div className="space-y-2">
               <h4 className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
                  <Sparkles size={14} className="animate-pulse" /> Mentor Briefing
               </h4>
               <p className="text-slate-200 font-bold leading-relaxed text-lg italic tracking-tight drop-shadow-md">
                &quot;{quote}&quot;
               </p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-[24px] border border-white/10 hover:bg-white/10 transition-colors cursor-default backdrop-blur-md">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xs font-black text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]">YK</div>
               <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">Major Yashkumar Yadav</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">SSB Tactical Mentor</p>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Historical Progress Chart Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-[48px] p-12 relative overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.3)]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute top-0 right-0 p-8">
           <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Historical Data</span>
           </div>
        </div>
        <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-white uppercase tracking-tight relative z-10">
          <Trophy size={24} className="text-blue-500" />
          Training Trajectory
        </h3>
        <div className="h-[350px] w-full relative z-10">
          <ProgressLineChart history={history} />
        </div>
      </motion.section>

      {/* Modules Grid */}
      <section className="space-y-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
             <Target className="w-8 h-8 text-orange-500 animate-pulse" />
             <h3 className="font-black text-2xl tracking-tight uppercase text-white">Training Modules</h3>
          </div>
          <Link href="/vacha/assessment" className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-2 hover:gap-4 transition-all">
            Full Sector Map <ArrowRight size={14} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, index) => (
            <Link key={mod.name} href={mod.path}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.3 + (index * 0.1) }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-[#162840]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 hover:bg-[#1a3050] hover:border-orange-500/50 transition-all cursor-pointer relative overflow-hidden block shadow-xl hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 bg-[#0f172a] rounded-2xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-500/20 transition-all duration-500 border border-white/5 shadow-inner relative z-10 group-hover:rotate-6 group-hover:scale-110">
                  <mod.icon size={26} />
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors relative z-10">{mod.name}</h4>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed mb-6 uppercase tracking-widest relative z-10">{mod.desc}</p>
                <div className="flex items-center justify-between relative z-10">
                   <span className="inline-block text-[9px] font-black text-orange-500 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20 uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                     {mod.tag}
                   </span>
                   <ArrowRight size={16} className="text-slate-500 group-hover:text-orange-500 group-hover:translate-x-2 transition-all duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-100 shadow-[0_-5px_20px_rgba(249,115,22,0.5)]" />
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
