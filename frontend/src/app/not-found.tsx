'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 space-y-8 max-w-2xl"
      >
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-[#162840] border border-[#1E3A5F] flex items-center justify-center text-amber-500 shadow-2xl relative">
            <ShieldAlert size={48} />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-black text-amber-500 uppercase tracking-widest">
            Sector Not Found
          </h2>
          <p className="text-slate-400 text-lg font-bold max-w-md mx-auto">
            The coordinates you provided do not exist in this sector. Verify your navigation data and return to base.
          </p>
        </div>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-4 rounded-xl uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={20} />
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}
