'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 pt-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 text-amber-500 mb-8">
          <BookOpen size={32} />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Terms of Service</h1>
        </div>
        
        <div className="bg-[#0f172a] border border-[#1E3A5F] rounded-3xl p-8 space-y-8 text-slate-300">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last updated: June 2026</p>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">1. Acceptance of Terms</h2>
             <p className="leading-relaxed font-bold">
               By accessing and using SSB NEXTGEN PRO, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree with these terms, you must discontinue use immediately.
             </p>
          </section>
          
          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">2. Eligibility</h2>
             <p className="leading-relaxed font-bold">
               You must be at least 18 years of age to use this service. By creating an account, you represent and warrant that you are at least 18 years old and that your use of SSB NEXTGEN PRO does not violate any applicable law or regulation.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">3. Service Description</h2>
             <p className="leading-relaxed font-bold">
               SSB NEXTGEN PRO is an educational and preparation platform intended for candidates preparing for the Services Selection Board (SSB). The AI-generated scores, OLQ profiles, and feedback are for guidance and self-improvement purposes only and do not guarantee actual selection at any SSB center. Results should be used as supplementary preparation material.
             </p>
          </section>
          
          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">4. User Conduct</h2>
             <p className="leading-relaxed font-bold">
               Users must conduct themselves with integrity. The following activities are strictly prohibited:
             </p>
             <ul className="list-disc list-inside space-y-2 text-sm font-bold text-slate-400 pl-4">
               <li>Abuse of AI generation systems or automated scraping of content</li>
               <li>Sharing of account credentials with other individuals</li>
               <li>Attempting to reverse-engineer or extract proprietary algorithms</li>
               <li>Posting or distributing test content, datasets, or AI evaluations publicly</li>
               <li>Using the platform for any purpose other than SSB preparation</li>
             </ul>
             <p className="leading-relaxed font-bold">
               Violation of these terms will result in immediate termination of service without notice or refund.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">5. Intellectual Property</h2>
             <p className="leading-relaxed font-bold">
               All content, including situational reaction tests, psychometric images, TAT/PPDT datasets, OIR question banks, GPE scenarios, and proprietary AI evaluation algorithms, remain the exclusive property of SSB NEXTGEN PRO. Unauthorized reproduction, distribution, or commercial use is strictly prohibited and may result in legal action.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">6. Disclaimer of Warranties</h2>
             <p className="leading-relaxed font-bold">
               SSB NEXTGEN PRO is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied. We do not guarantee that the service will be uninterrupted, error-free, or that AI evaluations will be perfectly accurate. The platform is a preparation aid, not a certified assessment tool.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">7. Limitation of Liability</h2>
             <p className="leading-relaxed font-bold">
               In no event shall SSB NEXTGEN PRO, its creators, or affiliates be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount paid by you, if any, for access to the platform.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">8. Account Termination</h2>
             <p className="leading-relaxed font-bold">
               We reserve the right to suspend or terminate your account at our discretion if we determine that you have violated these terms. You may also request voluntary account deletion at any time by contacting our support team.
             </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-widest">9. Contact</h2>
             <p className="leading-relaxed font-bold">
               For questions about these Terms of Service, contact us at support@ssbnextgen.com.
             </p>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
