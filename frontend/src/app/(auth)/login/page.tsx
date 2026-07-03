'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Mail, Lock, ArrowRight, Loader2, AlertCircle, Sparkles, Eye, EyeOff, Clock } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const urlError = searchParams.get('error');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) { 
        setError(signInError.message); 
        if (signInError.message.includes('locked') || signInError.message.includes('Too many')) {
          setIsLocked(true);
        }
        setLoading(false); 
        return; 
      }
      window.location.href = redirectTo;
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during sign in. Check your network or configuration.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}` },
      });
      if (oauthError) { setError(oauthError.message); setLoading(false); }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}` },
      });
      if (oauthError) { setError(oauthError.message); setLoading(false); }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="lg:hidden flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center"><Shield size={20} className="text-black" /></div>
        <div><h1 className="text-xl font-black uppercase tracking-tight">SSB PREP</h1></div>
      </div>
      <div className="space-y-2">
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2 max-w-fit">
          <Sparkles size={12} className="text-emerald-500" /><span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Secure Access</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Sign In</h2>
        <p className="text-slate-500 font-bold text-sm">Enter your credentials to access the command center.</p>
      </div>

      {(error || urlError) && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
          {isLocked ? <Clock size={18} className="text-red-500 flex-shrink-0 mt-0.5" /> : <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />}
          <div>
            <p className="text-red-400 text-sm font-bold">{error || 'Authentication failed. Please try again.'}</p>
            {isLocked && <p className="text-red-400/80 text-xs mt-1">Please wait 15 minutes before trying again.</p>}
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
            <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="officer@example.com" required className="w-full bg-[#0f172a] border border-[#1E3A5F] rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="login-password" className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
            <input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-[#0f172a] border border-[#1E3A5F] rounded-2xl pl-12 pr-12 py-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 text-black font-black py-4 rounded-2xl uppercase tracking-widest text-[11px] shadow-2xl shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Access Command Center</span><ArrowRight size={16} /></>}
        </button>
      </form>

      <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#1E3A5F]" /></div><div className="relative flex justify-center text-[10px]"><span className="bg-[#020617] px-4 text-slate-600 font-black uppercase tracking-widest">Or Continue With</span></div></div>

      <div className="grid grid-cols-1 gap-3">
        {process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true' && (
          <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-[#0f172a] border border-[#1E3A5F] hover:border-white/20 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
        )}
        
        {process.env.NEXT_PUBLIC_ENABLE_GITHUB_AUTH === 'true' && (
          <button onClick={handleGithubLogin} disabled={loading} className="w-full bg-[#0f172a] border border-[#1E3A5F] hover:border-white/20 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </button>
        )}
      </div>

      <p className="text-center text-sm text-slate-600 font-bold">New recruit?{' '}<Link href="/signup" className="text-orange-500 hover:text-orange-400 font-black transition-colors">Create Account</Link></p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2d4a] to-[#1a3d6e] flex-col justify-between p-16">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-orange-500 blur-[150px]" />
          <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-emerald-500 blur-[200px]" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center">
            <Shield size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">SSB PREP</h1>
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">by SSB NEXTGEN</p>
          </div>
        </div>
        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl font-black text-white leading-tight uppercase tracking-tight">
            Your Mission<br /><span className="text-orange-500">Starts Here.</span>
          </h2>
          <p className="text-slate-400 text-lg font-bold leading-relaxed max-w-md italic">
            &quot;Access AI-powered psychometric evaluations, OIR test batteries, and officer-grade tactical mentoring.&quot;
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {['YK', 'AS', 'RJ', 'MP'].map((init, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 border-2 border-[#0f2d4a] flex items-center justify-center text-[10px] font-black text-black">{init}</div>
              ))}
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">2,400+ Officers Trained</p>
          </div>
        </div>
        <div className="relative z-10 text-[10px] text-slate-600 font-bold uppercase tracking-widest">© 2026 SSB NEXTGEN</div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#020617]">
        <Suspense fallback={<div className="flex items-center gap-3 text-slate-500"><Loader2 className="animate-spin w-5 h-5"/><span>Loading secure channel...</span></div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
