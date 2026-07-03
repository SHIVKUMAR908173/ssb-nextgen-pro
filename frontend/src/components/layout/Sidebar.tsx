"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  BookOpen, 
  Map, 
  Clock, 
  Globe, 
  IdCard, 
  Lightbulb, 
  Image as ImageIcon, 
  Brain, 
  MessageSquare, 
  HelpCircle, 
  PenTool, 
  Users2,
  Video, 
  Dumbbell, 
  Trophy,
  Mic2,
  LifeBuoy,
  Target,
  Box,
  Footprints,
  Mountain,
  Zap,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItem {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
      { name: 'Assessment Hub', icon: ClipboardCheck, href: '/vacha/assessment' },
      { name: 'SSB Journey', icon: Map, href: '/journey' },
      { name: 'Daily Practice', icon: Clock, href: '/practice' },
    ]
  },
  {
    title: 'Resources',
    items: [
      { name: 'Daily News', icon: Globe, href: '/news', badge: 'LIVE', badgeColor: 'bg-red-500' },
      { name: 'Study Material', icon: BookOpen, href: '/study-material' },
      { name: 'Free Resources', icon: BookOpen, href: '/resources' },
      { name: 'PIQ Form', icon: IdCard, href: '/piq' },
      { name: 'Squadron Board', icon: Trophy, href: '/vacha/leaderboard' },
    ]
  },
  {
    title: 'Stage I — Screening',
    items: [
      { name: 'OIR Test', icon: Lightbulb, href: '/oir' },
      { name: 'PPDT Round', icon: ImageIcon, href: '/vacha/ppdt' },
      { name: 'CSSS Stage-1', icon: ClipboardCheck, href: '/vacha/stage1', badge: 'NEW', badgeColor: 'bg-emerald-500' },
    ]
  },
  {
    title: 'Stage II — Psychology',
    items: [
      { name: 'Psychology Hub', icon: Brain, href: '/mansa' },
      { name: 'TAT', icon: Target, href: '/mansa/tat' },
      { name: 'WAT', icon: MessageSquare, href: '/mansa/wat' },
      { name: 'SRT', icon: HelpCircle, href: '/mansa/srt' },
      { name: 'Self Description', icon: PenTool, href: '/mansa/self-description' },
    ]
  },
  {
    title: 'Stage II — GTO',
    items: [
      { name: 'GTO Command', icon: Map, href: '/karmana/gto', badge: 'NEW', badgeColor: 'bg-orange-500' },
      { name: 'Group Discussion', icon: MessageSquare, href: '/karmana/gd' },
      { name: 'GPE Planning', icon: Users2, href: '/karmana/gpe' },
      { name: 'PGT / HGT / CT', icon: Box, href: '/karmana/pgt' },
      { name: 'Obstacles', icon: Footprints, href: '/karmana/io' },
      { name: 'Snake Race', icon: Zap, href: '/karmana/snake-race' },
      { name: 'Outdoor Tasks', icon: Mountain, href: '/karmana/outdoor' },
    ]
  },
  {
    title: 'Stage II — Interview',
    items: [
      { name: 'Lecturette', icon: Mic2, href: '/vacha/lecturette', badge: 'NEW', badgeColor: 'bg-emerald-500' },
      { name: 'Personal Interview', icon: Video, href: '/vacha/interview', badge: 'AI', badgeColor: 'bg-red-500' },
    ]
  },
  {
    title: 'More',
    items: [
      { name: 'Fitness Tracker', icon: Dumbbell, href: '/vacha/fitness' },
      { name: 'Support Desk', icon: LifeBuoy, href: '/support' },
    ]
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  // Track which sections are collapsed; all open by default
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsed(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLinkClick = () => {
    // Auto-close sidebar on mobile
    onClose?.();
  };

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 w-[260px] h-screen bg-[#0f172a] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ease-in-out",
        !isOpen && "-translate-x-full lg:translate-x-0"
      )}
      aria-label="Main navigation"
    >
      {/* Branding Header */}
      <div className="p-6 mb-2 shrink-0">
        <Link href="/" onClick={handleLinkClick} className="block">
          <h1 className="font-black text-xl tracking-tighter text-white flex flex-col">
            <span className="flex items-center gap-1">
              SSB <span className="text-emerald-400">PREP</span>
            </span>
          </h1>
          <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">by SSB NEXTGEN</p>
        </Link>
      </div>

      {/* Scrollable Nav with gradient indicators */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {/* Top fade indicator */}
        <div className="sticky top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#0f172a] to-transparent z-10 pointer-events-none" />
        
        <nav className="px-4 pb-12 space-y-1">
          {navSections.map((section) => {
            const isCollapsed = collapsed[section.title];
            const hasActiveItem = section.items.some(item => pathname === item.href);
            
            return (
              <div key={section.title} className="mb-1">
                {/* Section Header - Collapsible */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] hover:text-slate-300 transition-colors"
                  aria-expanded={!isCollapsed}
                >
                  <span className={cn(hasActiveItem && !isCollapsed && "text-slate-300")}>{section.title}</span>
                  <ChevronDown 
                    size={12} 
                    className={cn(
                      "transition-transform duration-200",
                      isCollapsed && "-rotate-90"
                    )} 
                  />
                </button>

                {/* Section Items */}
                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link 
                          key={item.name} 
                          href={item.href}
                          onClick={handleLinkClick}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 transition-all hover:bg-white/5 hover:text-white group relative",
                            isActive && "bg-white/10 text-white font-semibold"
                          )}
                        >
                          <item.icon size={16} className={cn("opacity-70 group-hover:opacity-100 shrink-0", isActive && "opacity-100 text-emerald-400")} />
                          <span className="text-xs font-bold uppercase tracking-wide">{item.name}</span>
                          
                          {item.badge && (
                            <span className={cn(
                              "ml-auto text-[8px] font-black px-1.5 py-0.5 rounded text-white tracking-tighter shrink-0",
                              item.badgeColor
                            )}>
                              {item.badge}
                            </span>
                          )}

                          {isActive && (
                            <div className="absolute right-0 top-1 bottom-1 w-1 bg-emerald-400 rounded-l-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom fade indicator */}
        <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0f172a] to-transparent z-10 pointer-events-none" />
      </div>
    </aside>
  );
}
