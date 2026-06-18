'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const OIRVisualTest = dynamic(
  () => import('@/components/tests/OIRVisualTest'),
  { ssr: false }
)

export default function OirVisualPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Link 
          href="/oir"
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to OIR Hub
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visual Matrix Active</span>
        </div>
      </div>
      <div className="bg-[#0f172a] rounded-[48px] p-4 shadow-2xl border border-white/5 overflow-hidden min-h-[600px]">
        <OIRVisualTest />
      </div>
    </div>
  )
}
