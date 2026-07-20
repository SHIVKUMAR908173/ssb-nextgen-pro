'use client'

import React from 'react'
import { ArrowLeft, Brain, UserCircle } from 'lucide-react'
import Link from 'next/link'
import SdSimulator from '@/components/tests/SdSimulator'
import { motion } from 'framer-motion'

export default function SelfDescriptionPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      <div className="flex items-center justify-between">
        <Link href="/mansa" className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Psychology Hub
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Board President Psych · AI Active</span>
        </div>
      </div>

      <div className="bg-[#0f172a] rounded-3xl md:rounded-[48px] p-8 shadow-2xl border border-white/5">
         <SdSimulator />
      </div>

    </div>
  )
}
