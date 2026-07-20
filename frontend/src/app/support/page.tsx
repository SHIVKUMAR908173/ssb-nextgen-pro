'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LifeBuoy, Mail, Star, Send, MessageSquare, CheckCircle2, User, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Removed SAMPLE_FEEDBACK to make it a raw support form

export default function SupportPage() {
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', rating: 0, message: '' })
  const [hoverRating, setHoverRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackForm.name || !feedbackForm.message || feedbackForm.rating === 0) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFeedbackForm({ name: '', email: '', rating: 0, message: '' })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </Link>
      </div>

      {/* Support Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl md:rounded-[48px] p-16 border border-white/5 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
           <div className="w-20 h-20 bg-yellow-500 rounded-[32px] flex items-center justify-center text-black shadow-2xl shadow-yellow-500/20 mb-4">
              <LifeBuoy className="w-10 h-10" />
           </div>
           <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
             Support <span className="text-yellow-400">Desk</span>
           </h1>
           <p className="text-slate-400 max-w-xl text-lg font-bold leading-relaxed">
             Share your feedback, report bugs, or suggest features. Your input directly shapes the platform.
           </p>
        </div>
      </motion.div>

      {/* Email Contact Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] flex flex-col items-center text-center gap-4 hover:border-yellow-500/50 transition-all cursor-pointer group">
           <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
           </div>
           <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Email Support</h3>
              <p className="text-xs font-bold text-slate-400 tracking-widest mt-1">nextgenssb@gmail.com</p>
           </div>
        </div>
        <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] flex flex-col items-center text-center gap-4">
           <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <MessageSquare className="w-6 h-6" />
           </div>
           <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Response Time</h3>
              <p className="text-xs font-bold text-slate-400 tracking-widest mt-1">Within 24 Hours</p>
           </div>
        </div>
      </div>

      {/* Feedback Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f172a] rounded-3xl md:rounded-[48px] p-12 border border-yellow-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-black">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Submit Feedback</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Help us improve the platform</p>
            </div>
          </div>

          <AnimatePresence>
            {submitted && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-8 flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <p className="text-emerald-400 font-black uppercase tracking-widest text-sm">Feedback submitted successfully! Thank you for helping us improve.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Your Name *</label>
                <input
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Cadet Name"
                  className="w-full bg-[#162840] border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 transition-colors font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Email (Optional)</label>
                <input
                  value={feedbackForm.email}
                  onChange={(e) => setFeedbackForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="cadet@example.com"
                  type="email"
                  className="w-full bg-[#162840] border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 transition-colors font-bold"
                />
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Rating *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setFeedbackForm(f => ({ ...f, rating: star }))}
                    className="transition-transform hover:scale-125"
                  >
                    <Star className={`w-8 h-8 ${(hoverRating || feedbackForm.rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'} transition-colors`} />
                  </button>
                ))}
                {feedbackForm.rating > 0 && (
                  <span className="text-xs font-black text-yellow-400 uppercase tracking-widest self-center ml-3">
                    {feedbackForm.rating === 5 ? 'Excellent!' : feedbackForm.rating === 4 ? 'Good' : feedbackForm.rating === 3 ? 'Average' : feedbackForm.rating === 2 ? 'Below Average' : 'Poor'}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Your Feedback *</label>
              <textarea
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Tell us what you liked, what can be improved, or report any bugs..."
                rows={5}
                className="w-full bg-[#162840] border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 transition-colors font-bold resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!feedbackForm.name || !feedbackForm.message || feedbackForm.rating === 0}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-700 disabled:text-slate-500 text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-xl shadow-yellow-500/20 flex items-center gap-3"
            >
              <Send className="w-4 h-4" /> Submit Feedback
            </button>
          </form>
        </div>
      </motion.div>

      {/* Removed Cadet Feedback Wall to focus on real cadet messaging */}
    </div>
  )
}
