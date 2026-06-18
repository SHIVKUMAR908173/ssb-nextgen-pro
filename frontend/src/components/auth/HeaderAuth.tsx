'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

export default function HeaderAuth() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-slate-700 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="bg-orange-500 hover:bg-orange-400 text-black px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 shadow-lg shadow-orange-500/20"
      >
        Sign In
      </Link>
    );
  }

  const initials = (user.user_metadata?.full_name || user.email || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 hover:bg-white/5 rounded-xl px-2 py-1 transition-all"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-black flex items-center justify-center font-black text-sm shadow-lg shadow-orange-500/20">
          {initials}
        </div>
        <ChevronDown size={14} className={`text-slate-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#0f172a] border border-[#1E3A5F] rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-[#1E3A5F]">
            <p className="text-sm font-black text-white truncate">{user.user_metadata?.full_name || 'Officer'}</p>
            <p className="text-[10px] text-slate-500 font-bold truncate">{user.email}</p>
          </div>
          <div className="p-2">
            <Link
              href="/journey"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold"
            >
              <User size={16} /> My Progress
            </Link>
            <Link
              href="/support"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold"
            >
              <Settings size={16} /> Settings
            </Link>
            <button
              onClick={() => { setMenuOpen(false); signOut(); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm font-bold w-full text-left"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
