'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 pt-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 text-amber-500 mb-8">
          <Shield size={32} />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Privacy Policy</h1>
        </div>
        
        <div className="bg-[#0f172a] border border-[#1E3A5F] rounded-3xl p-8 space-y-8 text-slate-300">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last updated: June 2026</p>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">1. Information Collection</h2>
             <p className="leading-relaxed font-bold">
               We collect data that you provide directly to us, including your name, email address, profile information, and assessment responses (TAT, WAT, SRT, OIR, GD, GPE, Interview, etc.). We also collect technical data such as IP address, browser type, and usage patterns to improve our AI evaluation engine.
             </p>
          </section>
          
          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">2. Use of Information</h2>
             <p className="leading-relaxed font-bold">
               The information collected is strictly used to evaluate your SSB preparation, provide personalized AI feedback, and calculate your Officer Like Qualities (OLQ) scores. Your data helps train the individual model tailored to your progress. Specifically, we use your data for:
             </p>
             <ul className="list-disc list-inside space-y-2 text-sm font-bold text-slate-400 pl-4">
               <li>AI-powered assessment scoring and feedback generation</li>
               <li>Tracking your study streaks, progress, and performance trends</li>
               <li>Generating your personalized OLQ profile and improvement roadmap</li>
               <li>Aggregated (anonymous) analytics to improve test content quality</li>
             </ul>
          </section>
          
          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">3. Data Storage & Processing</h2>
             <p className="leading-relaxed font-bold">
               Your data is stored securely using Supabase (powered by PostgreSQL) with Row Level Security (RLS) enforced — meaning only you can access your own data. Assessment responses are processed by AI services (Anthropic Claude, Google Gemini) for evaluation. Your responses are not used to train external AI models. API keys are stored server-side only and never exposed to the client.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">4. Data Security</h2>
             <p className="leading-relaxed font-bold">
               We employ industry-standard encryption for data at rest and in transit (TLS 1.3). Authentication is handled via Supabase Auth with secure cookie-based sessions. Your personal and psychometric data are securely stored and are not shared with any third-party marketing agencies, advertisers, or data brokers.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">5. Data Retention</h2>
             <p className="leading-relaxed font-bold">
               Your assessment data and profile information are retained as long as your account is active. You may request complete data deletion at any time by contacting us. Upon account deletion, all personal data including assessment sessions, OLQ profiles, and study progress will be permanently removed within 30 days.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">6. Third-Party Services</h2>
             <p className="leading-relaxed font-bold">
               We use the following third-party services: Supabase (database & authentication), Vercel (hosting), Anthropic (AI evaluation), and Google (AI services). Each processes your data in accordance with their respective privacy policies. We do not sell or share your personal data with any other third parties.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">7. Your Rights</h2>
             <p className="leading-relaxed font-bold">
               You have the right to: access your personal data, request corrections to inaccurate data, request deletion of your account and all associated data, export your assessment history, and opt out of any non-essential data collection.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">8. Contact Information</h2>
             <p className="leading-relaxed font-bold">
               For any privacy-related queries, data access requests, or to request data deletion, contact the administrator at support@ssbnextgen.com. We will respond to all privacy requests within 72 hours.
             </p>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
