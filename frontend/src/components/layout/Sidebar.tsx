"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  BookOpen, 
  Map, 
  Clock, 
  Globe, 
  BarChart3, 
  IdCard, 
  Lightbulb, 
  Image as ImageIcon, 
  Brain, 
  MessageSquare, 
  HelpCircle, 
  PenTool, 
  Users, 
  Video, 
  Dumbbell, 
  Trophy,
  Users2,
  Mic2,
  Backpack,
  LifeBuoy,
  Target,
  Box,
  Footprints,
  Mountain,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Assessment Hub', icon: ClipboardCheck, href: '/vacha/assessment' },
  { name: 'SSB Journey', icon: Map, href: '/journey' },
  { name: 'Daily Practice', icon: Clock, href: '/practice' },
  { name: 'Daily News', icon: Globe, href: '/news', badge: 'LIVE', badgeColor: 'bg-red-500' },
  { name: 'Study Material', icon: BookOpen, href: '/study-material' },
  { name: 'Free Resources', icon: BookOpen, href: '/resources' },
  { name: 'PIQ Form', icon: IdCard, href: '/piq' },
  { name: 'Squadron Board', icon: Trophy, href: '/vacha/leaderboard' },
  { name: 'OIR Test', icon: Lightbulb, href: '/oir' },
  { name: 'PPDT Round', icon: ImageIcon, href: '/vacha/ppdt' },
  { name: 'CSSS Stage-1 Screening', icon: ClipboardCheck, href: '/vacha/stage1', badge: 'NEW', badgeColor: 'bg-emerald-500' },
  { name: 'Psychology (Mansa)', icon: Brain, href: '/mansa' },
  { name: 'TAT (Psychology)', icon: Target, href: '/mansa/tat' },
  { name: 'WAT (Psychology)', icon: MessageSquare, href: '/mansa/wat' },
  { name: 'SRT (Psychology)', icon: HelpCircle, href: '/mansa/srt' },
  { name: 'Self Description', icon: PenTool, href: '/mansa/self-description' },
  { name: 'GTO Command Center', icon: Map, href: '/karmana/gto', badge: 'NEW', badgeColor: 'bg-orange-500' },
  { name: 'Group Discussion', icon: MessageSquare, href: '/karmana/gd' },
  { name: 'GPE Planning', icon: Users2, href: '/karmana/gpe' },
  { name: 'PGT / HGT / CT (3D)', icon: Box, href: '/karmana/pgt' },
  { name: 'Individual Obstacles', icon: Footprints, href: '/karmana/io' },
  { name: 'Snake Race', icon: Zap, href: '/karmana/snake-race' },
  { name: 'Outdoor Tasks', icon: Mountain, href: '/karmana/outdoor' },
  { name: 'Lecturette', icon: Mic2, href: '/vacha/lecturette', badge: 'NEW', badgeColor: 'bg-emerald-500' },
  { name: '1:1 Personal Interview', icon: Video, href: '/vacha/interview', badge: 'VIRTUAL', badgeColor: 'bg-red-500' },
  { name: 'Fitness Tracker', icon: Dumbbell, href: '/vacha/fitness' },
  { name: 'Support Desk', icon: LifeBuoy, href: '/support' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed top-0 left-0 w-[260px] h-screen bg-[#0f172a] border-r border-white/5 flex flex-col z-50 overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out",
      !isOpen && "-translate-x-full lg:translate-x-0"
    )}>
      {/* Branding Header */}
      <div className="p-6 mb-4">
        <h1 className="font-black text-xl tracking-tighter text-white flex flex-col">
          <span className="flex items-center gap-1">
            SSB <span className="text-emerald-400">PREP</span>
          </span>
        </h1>
        <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">by SSB NEXTGEN</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 pb-12">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg text-slate-400 transition-all hover:bg-white/5 hover:text-white group relative",
                isActive && "bg-white/10 text-yellow-400 font-semibold"
              )}
            >
              <item.icon size={18} className={cn("opacity-70 group-hover:opacity-100", isActive && "opacity-100 text-yellow-400")} />
              <span className="text-sm font-black uppercase tracking-widest text-[10px]">{item.name}</span>
              
              {item.badge && (
                <span className={cn(
                  "ml-auto text-[8px] font-black px-1.5 py-0.5 rounded text-white tracking-tighter",
                  item.badgeColor
                )}>
                  {item.badge}
                </span>
              )}

              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-l-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
