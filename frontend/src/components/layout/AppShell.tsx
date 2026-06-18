'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TacticalChat from '@/components/chat/TacticalChat';
import HeaderAuth from '@/components/auth/HeaderAuth';
import { Menu } from 'lucide-react';

const AUTH_ROUTES = ['/login', '/signup'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<'online' | 'degraded' | 'offline'>('online');
  const isAuthPage = AUTH_ROUTES.some(route => pathname.startsWith(route));

  useEffect(() => {
    const checkHealth = () => {
      fetch('/api/health', { cache: 'no-store' })
        .then(r => r.json())
        .then(d => setServerStatus(d.status === 'online' ? 'online' : d.status === 'degraded' ? 'degraded' : 'offline'))
        .catch(() => setServerStatus('offline'));
    };
    checkHealth();
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auth pages render without sidebar/header (full-screen layout)
  if (isAuthPage) {
    return <>{children}</>;
  }

  const statusColor = serverStatus === 'online' ? 'bg-green-500' : serverStatus === 'degraded' ? 'bg-amber-500' : 'bg-red-500';
  const statusText = serverStatus === 'online' ? 'SERVER ONLINE' : serverStatus === 'degraded' ? 'SERVER DEGRADED' : 'SERVER OFFLINE';

  return (
    <>
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex-1 lg:ml-[260px] min-h-screen flex flex-col relative w-full overflow-x-hidden">
          <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none" />
          <header className="h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase hidden sm:block">Command Center</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <span className={`w-2 h-2 rounded-full ${statusColor} ${serverStatus === 'online' ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] font-black text-white tracking-tighter">{statusText}</span>
              </div>
              <HeaderAuth />
            </div>
          </header>
          <main className="p-4 lg:p-8 relative z-10">
            {children}
          </main>
        </div>
      </div>
      <TacticalChat />
    </>
  );
}

