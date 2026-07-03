'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TacticalChat from '@/components/chat/TacticalChat';
import HeaderAuth from '@/components/auth/HeaderAuth';
import Link from 'next/link';
import { Menu, LayoutDashboard, Brain, Map, BookOpen, User } from 'lucide-react';

import ServerStatusBadge from '@/components/layout/ServerStatusBadge';

const AUTH_ROUTES = ['/login', '/signup'];

// Map pathname to a human-readable page title
function getPageTitle(pathname: string): string {
  const titleMap: Record<string, string> = {
    '/': 'Dashboard',
    '/vacha/assessment': 'Assessment Hub',
    '/journey': 'SSB Journey',
    '/practice': 'Daily Practice',
    '/news': 'Daily News',
    '/study-material': 'Study Material',
    '/resources': 'Free Resources',
    '/piq': 'PIQ Form',
    '/vacha/leaderboard': 'Squadron Board',
    '/oir': 'OIR Test',
    '/vacha/ppdt': 'PPDT Round',
    '/vacha/stage1': 'CSSS Stage-1',
    '/mansa': 'Psychology Hub',
    '/mansa/tat': 'TAT',
    '/mansa/wat': 'WAT',
    '/mansa/srt': 'SRT',
    '/mansa/self-description': 'Self Description',
    '/karmana/gto': 'GTO Command',
    '/karmana/gd': 'Group Discussion',
    '/karmana/gpe': 'GPE Planning',
    '/karmana/pgt': 'PGT / HGT / CT',
    '/karmana/io': 'Obstacles',
    '/karmana/snake-race': 'Snake Race',
    '/karmana/outdoor': 'Outdoor Tasks',
    '/vacha/lecturette': 'Lecturette',
    '/vacha/interview': 'Personal Interview',
    '/vacha/fitness': 'Fitness Tracker',
    '/support': 'Support Desk',
    '/profile': 'Service Profile',
    '/guide': 'SOP Guide',
    '/olq-dashboard': 'OLQ Dashboard',
    '/pragya': 'Study Base',
  };
  return titleMap[pathname] || 'Command Center';
}

// Bottom nav items for mobile
const bottomNavItems = [
  { name: 'Home', icon: LayoutDashboard, href: '/' },
  { name: 'Tests', icon: Brain, href: '/vacha/assessment' },
  { name: 'GTO', icon: Map, href: '/karmana/gto' },
  { name: 'Study', icon: BookOpen, href: '/pragya' },
  { name: 'Profile', icon: User, href: '/profile' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // Auth pages render without sidebar/header (full-screen layout)
  if (isAuthPage) {
    return <>{children}</>;
  }

  const pageTitle = getPageTitle(pathname);

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-emerald-500 focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
      >
        Skip to content
      </a>

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex-1 lg:ml-[260px] min-h-screen flex flex-col relative w-full overflow-x-hidden pb-16 lg:pb-0">
          <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-emerald-400/5 to-transparent pointer-events-none" />
          <header className="h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase hidden sm:block">{pageTitle}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <ServerStatusBadge />
              </div>
              <HeaderAuth />
            </div>
          </header>
          <main id="main-content" className="p-4 lg:p-8 relative z-10 flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0f172a]/95 backdrop-blur-lg border-t border-white/10" aria-label="Mobile navigation">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all ${
                  isActive 
                    ? 'text-emerald-400' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-emerald-400' : ''} />
                <span className="text-[9px] font-black uppercase tracking-wider">{item.name}</span>
                {isActive && (
                  <div className="absolute top-0 w-8 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <TacticalChat />
    </>
  );
}
