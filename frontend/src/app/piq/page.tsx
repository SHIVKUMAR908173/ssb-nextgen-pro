'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, User, GraduationCap, Trophy, History, Save, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'
import { toast } from 'sonner'
import Link from 'next/link'

const STEPS = [
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'hobbies', label: 'Hobbies & Sports', icon: Trophy },
  { id: 'history', label: 'SSB History', icon: History },
]

export default function PiqFormPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    personal: { fullName: '', dob: '', fatherDetails: '', motherDetails: '' },
    education: {
      class10: { board: '', year: '', marks: '' },
      class12: { board: '', year: '', marks: '' },
      graduation: { board: '', year: '', marks: '' }
    },
    hobbies: { sports: '', interests: '' },
    history: { attempts: '', lastEntry: '', results: '' }
  })

  // Load existing PIQ data if available
  useEffect(() => {
    if (user?.id) {
      supabase.from('piq_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setFormData({
              personal: data.personal_details || formData.personal,
              education: data.education_details || formData.education,
              hobbies: data.hobbies_sports || formData.hobbies,
              history: data.ssb_history || formData.history
            })
            if (data.created_at) setIsSubmitted(true) // Show success screen if already submitted
          }
        })
    }
  }, [user])

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save PIQ')
      return
    }
    setIsSaving(true)
    try {
      const { error } = await supabase.from('piq_submissions').insert({
        user_id: user.id,
        personal_details: formData.personal,
        education_details: formData.education,
        hobbies_sports: formData.hobbies,
        ssb_history: formData.history
      })
      if (error) throw error
      setIsSubmitted(true)
      toast.success('PIQ successfully saved!')
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to save PIQ: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const updatePersonal = (field: string, value: string) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }))
  const updateEdu = (level: 'class10'|'class12'|'graduation', field: string, value: string) => 
    setFormData(prev => ({ ...prev, education: { ...prev.education, [level]: { ...prev.education[level], [field]: value } } }))
  const updateHobbies = (field: string, value: string) => setFormData(prev => ({ ...prev, hobbies: { ...prev.hobbies, [field]: value } }))
  const updateHistory = (field: string, value: string) => setFormData(prev => ({ ...prev, history: { ...prev.history, [field]: value } }))

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      
      {/* Progress Header */}
      <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F] shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg">
                  <FileText className="w-5 h-5" />
               </div>
               <div>
                  <h1 className="text-xl font-black text-white uppercase tracking-tight">Personal Information Questionnaire</h1>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DIPR Standard Form v2.1</p>
               </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
               {STEPS.map((step, i) => (
                  <React.Fragment key={step.id}>
                     <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all border
                        ${i <= currentStep ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}
                     `}>
                        {i < currentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                     </div>
                     {i < STEPS.length - 1 && <div className={`w-8 h-[1px] ${i < currentStep ? 'bg-yellow-500' : 'bg-slate-800'}`}></div>}
                  </React.Fragment>
               ))}
            </div>
         </div>

         <div className="flex items-center gap-4">
            {STEPS.map((step, i) => (
              <button 
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className={`
                  flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all border
                  ${i === currentStep ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-lg' : 'text-slate-500 border-white/5 hover:border-white/10'}
                `}
              >
                 <step.icon className={`w-4 h-4 ${i === currentStep ? 'text-yellow-500' : ''}`} />
                 <span className="text-[9px] font-black uppercase tracking-widest">{step.label}</span>
              </button>
            ))}
         </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#162840] rounded-[40px] p-12 border border-[#1E3A5F] min-h-[500px] flex flex-col shadow-2xl"
          >
             {currentStep === 0 && (
               <div className="space-y-8 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name (As per Matriculation)</label>
                        <input type="text" value={formData.personal.fullName} onChange={e => updatePersonal('fullName', e.target.value)} placeholder="John Doe" className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-yellow-500/50" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date of Birth</label>
                        <input type="date" value={formData.personal.dob} onChange={e => updatePersonal('dob', e.target.value)} className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-yellow-500/50" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Father's Name & Occupation</label>
                        <input type="text" value={formData.personal.fatherDetails} onChange={e => updatePersonal('fatherDetails', e.target.value)} placeholder="Mr. Smith, Civil Engineer" className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-yellow-500/50" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mother's Name & Occupation</label>
                        <input type="text" value={formData.personal.motherDetails} onChange={e => updatePersonal('motherDetails', e.target.value)} placeholder="Mrs. Smith, Teacher" className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-yellow-500/50" />
                     </div>
                  </div>
               </div>
             )}

             {currentStep === 1 && (
               <div className="space-y-8 flex-1">
                  <div className="bg-yellow-500/5 rounded-3xl p-6 border border-yellow-500/10 mb-8">
                     <p className="text-xs font-bold text-yellow-500/80 leading-relaxed">
                       Provide details of your educational journey starting from Class X. Include school names, boards, and percentages.
                     </p>
                  </div>
                  <div className="space-y-6 overflow-x-auto">
                     <div className="grid grid-cols-4 gap-4 pb-4 border-b border-white/5 min-w-[500px]">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Examination</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Board/Univ</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Year</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Marks %</span>
                     </div>
                     
                     <div className="grid grid-cols-4 gap-4 min-w-[500px]">
                        <span className="text-sm font-bold text-white py-3">Class X</span>
                        <input type="text" value={formData.education.class10.board} onChange={e => updateEdu('class10', 'board', e.target.value)} placeholder="CBSE" className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                        <input type="text" value={formData.education.class10.year} onChange={e => updateEdu('class10', 'year', e.target.value)} placeholder="2018" className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                        <input type="text" value={formData.education.class10.marks} onChange={e => updateEdu('class10', 'marks', e.target.value)} placeholder="92.4" className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                     </div>
                     <div className="grid grid-cols-4 gap-4 min-w-[500px]">
                        <span className="text-sm font-bold text-white py-3">Class XII</span>
                        <input type="text" value={formData.education.class12.board} onChange={e => updateEdu('class12', 'board', e.target.value)} placeholder="CBSE" className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                        <input type="text" value={formData.education.class12.year} onChange={e => updateEdu('class12', 'year', e.target.value)} placeholder="2020" className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                        <input type="text" value={formData.education.class12.marks} onChange={e => updateEdu('class12', 'marks', e.target.value)} placeholder="88.2" className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                     </div>
                     <div className="grid grid-cols-4 gap-4 min-w-[500px]">
                        <span className="text-sm font-bold text-white py-3">Graduation</span>
                        <input type="text" value={formData.education.graduation.board} onChange={e => updateEdu('graduation', 'board', e.target.value)} placeholder="Delhi Univ" className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                        <input type="text" value={formData.education.graduation.year} onChange={e => updateEdu('graduation', 'year', e.target.value)} placeholder="2023" className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                        <input type="text" value={formData.education.graduation.marks} onChange={e => updateEdu('graduation', 'marks', e.target.value)} placeholder="75.0" className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                     </div>

                  </div>
               </div>
             )}

             {currentStep === 2 && (
               <div className="space-y-8 flex-1">
                  <div className="grid grid-cols-1 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Games & Sports Participated</label>
                        <textarea value={formData.hobbies.sports} onChange={e => updateHobbies('sports', e.target.value)} placeholder="Football (Captain), Athletics (100m)..." className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-sm font-bold text-white h-32 focus:outline-none focus:border-yellow-500/50 resize-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hobbies & Interests</label>
                        <textarea value={formData.hobbies.interests} onChange={e => updateHobbies('interests', e.target.value)} placeholder="Reading military history, playing guitar, hiking..." className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-sm font-bold text-white h-32 focus:outline-none focus:border-yellow-500/50 resize-none" />
                     </div>
                  </div>
               </div>
             )}

             {currentStep === 3 && (
               <div className="space-y-8 flex-1">
                  <div className="bg-orange-500/5 rounded-3xl p-6 border border-orange-500/10 mb-8">
                     <p className="text-xs font-bold text-orange-400 leading-relaxed">
                       Be precise about your previous attempts. The selection board verifies this against central records.
                     </p>
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center gap-4 flex-col md:flex-row">
                        <div className="w-full md:flex-1 space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">No. of Previous Attempts</label>
                           <input type="number" value={formData.history.attempts} onChange={e => updateHistory('attempts', e.target.value)} placeholder="0" className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-yellow-500/50" />
                        </div>
                        <div className="w-full md:flex-[2] space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Entry Type</label>
                           <select value={formData.history.lastEntry} onChange={e => updateHistory('lastEntry', e.target.value)} className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-sm font-bold text-white appearance-none focus:outline-none focus:border-yellow-500/50">
                              <option value="">Select Entry</option>
                              <option value="NDA">NDA</option>
                              <option value="CDS">CDS</option>
                              <option value="AFCAT">AFCAT</option>
                              <option value="TES">TES / TGC</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Previous Results (Chest No., Batch, Center)</label>
                        <textarea value={formData.history.results} onChange={e => updateHistory('results', e.target.value)} placeholder="Chest No 14, 1 AFSB Varanasi, Screened Out..." className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-sm font-bold text-white h-32 focus:outline-none focus:border-yellow-500/50 resize-none" />
                     </div>
                  </div>
               </div>
             )}

             {/* Navigation Footer */}
             <div className="flex items-center justify-between pt-12 border-t border-white/5 mt-auto">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white disabled:opacity-0 transition-all"
                >
                   <ArrowLeft className="w-4 h-4" />
                   Previous Step
                </button>
                
                {currentStep === STEPS.length - 1 ? (
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-yellow-500/20 transition-all transform hover:-translate-y-1 disabled:opacity-50"
                  >
                     {isSaving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                     {isSaving ? 'Saving...' : 'Finalize & Save PIQ'}
                  </button>
                ) : (
                  <button 
                    onClick={nextStep}
                    className="bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 border border-white/5 transition-all transform hover:-translate-y-1"
                  >
                     Next Step
                     <ArrowRight className="w-4 h-4" />
                  </button>
                )}
             </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#162840] rounded-[40px] p-20 border border-[#1E3A5F] text-center space-y-8 shadow-2xl"
          >
             <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-black mx-auto shadow-xl shadow-yellow-500/20">
                <CheckCircle2 className="w-12 h-12" />
             </div>
             <div className="space-y-3">
                <h2 className="text-4xl font-black text-white uppercase tracking-tight">PIQ Secured</h2>
                <p className="text-slate-500 font-bold max-w-md mx-auto">
                  Your Personal Information Questionnaire has been successfully transmitted and saved securely to your profile.
                </p>
             </div>
             <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 max-w-sm mx-auto">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">Next Mission</p>
                <p className="text-sm font-bold text-white">1:1 Virtual Interview is now unlocked.</p>
             </div>
             <div className="flex items-center justify-center gap-4">
               <button 
                 onClick={() => setIsSubmitted(false)}
                 className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-white/5 transition-all"
               >
                  Edit Details
               </button>
               <Link 
                 href="/vacha/interview"
                 className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-500/20 transition-all flex items-center gap-2"
               >
                  Start Interview <ArrowRight className="w-4 h-4" />
               </Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
