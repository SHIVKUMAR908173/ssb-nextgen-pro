'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ShieldCheck, Loader2, Minimize2, Sparkles, Volume2, ChevronDown, RotateCcw, ImageIcon, Trash2, Paperclip, FileText, File } from 'lucide-react';

interface UploadedFile {
  name: string;
  type: string;
  content: string; // extracted text content
  base64?: string;
  size: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  file?: UploadedFile;
  timestamp: Date;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Simple markdown-like renderer for bold and bullets
function renderContent(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold text
    let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-400 font-black">$1</strong>');
    // Bullet points
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      const bullet = line.trim().replace(/^[-•]\s/, '');
      processed = bullet.replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-400 font-black">$1</strong>');
      return (
        <div key={i} className="flex gap-2 items-start pl-2 py-0.5">
          <span className="text-yellow-500 mt-0.5 text-xs">▸</span>
          <span dangerouslySetInnerHTML={{ __html: processed }} />
        </div>
      );
    }
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return <p key={i} dangerouslySetInnerHTML={{ __html: processed }} className="py-0.5" />;
  });
}

export default function TacticalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome',
      role: 'assistant', 
      content: "Major Yashkumar Yadav here. I've been posted at 3 different SSBs and I've seen every type of candidate walk through those gates. Some get recommended, most get returned — and the difference is always preparation.\n\nYou're on the SSB PREP platform now, which means you've already shown initiative. That's OLQ #8 — **Initiative**. Good start.\n\nWhat do you need help with today, Candidate? OIR strategy? Psychology tests? GTO planning? Or just a reality check before your board date?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isOpen, scrollToBottom]);

  // Detect scroll position for "scroll to bottom" button
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShowScrollBtn(!isNearBottom);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File too large. Max 5MB allowed.');
      return;
    }

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedFile({
          name: file.name,
          type: file.type,
          content: '',
          base64: event.target?.result as string,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setSelectedFile({
          name: file.name,
          type: file.type,
          content: text.substring(0, 15000), // Limit to ~15k chars for AI context
          size: file.size
        });
      };
      reader.readAsText(file);
    }
    
    if (docInputRef.current) {
      docInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage && !selectedFile) || isLoading) return;

    // Build the message content - include file text if uploaded
    let messageContent = input;
    if (selectedFile && selectedFile.content) {
      messageContent = `[Uploaded File: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)}KB)]\n\n--- FILE CONTENT ---\n${selectedFile.content}\n--- END FILE ---\n\n${input || 'Please analyze this document and provide a summary with key points.'}`;
    } else if (selectedFile && selectedFile.base64 && !input) {
      messageContent = 'Please analyze this PDF document and provide a summary with key points.';
    }

    const userMsg: Message = { 
      id: `user-${Date.now()}`,
      role: 'user', 
      content: messageContent,
      image: selectedImage || undefined,
      file: selectedFile || undefined,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/tactical-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg].map(m => ({ 
            role: m.role, 
            content: m.content, 
            media: m.image || m.file?.base64 
          }))
        }),
      });
      if (!response.ok) throw new Error('Network error');
      if (!response.body) throw new Error('No body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedResponse = '';

      const asstId = `asst-${Date.now()}`;
      setMessages(prev => [...prev, { 
        id: asstId,
        role: 'assistant', 
        content: '',
        timestamp: new Date()
      }]);

      setIsLoading(false); // Done loading initial connection, now streaming

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        streamedResponse += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === asstId ? { ...msg, content: streamedResponse } : msg
          )
        );
      }
    } catch (error) {
      setIsLoading(false);
      // Network error — use local fallback
      const fallbackAnswer = getLocalFallback(userMsg.content);
      setMessages(prev => [...prev, {
        id: `fb-${Date.now()}`,
        role: 'assistant',
        content: fallbackAnswer,
        timestamp: new Date()
      }]);
    }
  };

  // Local Tactical Manual — serves answers when AI is offline
  const getLocalFallback = (query: string): string => {
    const q = query.toLowerCase();
    const TACTICAL_MANUAL: { keywords: string[]; answer: string }[] = [
      {
        keywords: ['olq', '15 olq', 'officer like qualities', 'qualities'],
        answer: "**The 15 Officer Like Qualities (OLQs)** assessed at every SSB:\n\n- **Effective Intelligence** — Ability to find practical solutions\n- **Reasoning Ability** — Logical and analytical thinking\n- **Organizing Ability** — Planning and resource management\n- **Power of Expression** — Clear communication (verbal + written)\n- **Social Adaptability** — Fitting into diverse groups\n- **Cooperation** — Teamwork under pressure\n- **Sense of Responsibility** — Owning your actions\n- **Initiative** — Acting without being told\n- **Self Confidence** — Believing in your abilities\n- **Speed of Decision** — Quick, calculated judgment\n- **Ability to Influence the Group** — Natural leadership\n- **Liveliness** — Energy and enthusiasm\n- **Determination** — Persistence against odds\n- **Courage** — Physical and moral bravery\n- **Stamina** — Physical and mental endurance\n\nThese are NOT 15 separate checkboxes. The Board looks for a **consistent pattern** across Psychology, GTO, and Interview. Show 5-6 OLQs strongly, and you're in the recommended zone."
      },
      {
        keywords: ['tat', 'thematic apperception', 'story writing', 'picture story'],
        answer: "**TAT (Thematic Apperception Test) — Board President's Guide:**\n\n- **Format**: 12 pictures shown for 30 seconds each. You write a story for 4 minutes per picture.\n- **What they assess**: Your subconscious projection. The hero of your story IS you.\n\n**Golden Rules:**\n- Always have a **single hero** (your age, your gender)\n- Hero must **identify a problem → take initiative → lead a team → solve it**\n- Show **positive emotions** — determination, compassion, responsibility\n- End every story on a **successful, forward-looking note**\n- AVOID: Death, violence, depression, pessimism, supernatural elements\n\n**Pro Tip**: The 12th picture is a **blank card** — this reveals your DEEPEST aspiration. Write about your most genuine life goal."
      },
      {
        keywords: ['wat', 'word association'],
        answer: "**WAT (Word Association Test) — Board President's Guide:**\n\n- **Format**: 60 words shown for 15 seconds each\n- **Task**: Write a sentence using that word\n\n**What the psychologist reads:**\n- Your sentence reveals your **dominant thought patterns**\n- Positive, action-oriented sentences = Officer mindset\n- Passive, negative, or violent sentences = Red flag\n\n**Example:**\n- Word: **FAILURE**\n- ❌ Weak: \"Failure is painful\"\n- ✅ Strong: \"He treated every failure as a stepping stone to success\"\n\n**Practice**: Write 60 sentences daily. Timer: 15 seconds per word. Your speed and consistency matter."
      },
      {
        keywords: ['srt', 'situation reaction'],
        answer: "**SRT (Situation Reaction Test) — Board President's Guide:**\n\n- **Format**: 60 situations in 30 minutes (30 seconds each)\n- **Task**: Write what YOU would do\n\n**The 4-Step Formula:**\n1. **Assess** the situation calmly\n2. **Take initiative** — don't wait for others\n3. **Lead and coordinate** with available people\n4. **Follow through** to completion\n\n**Never write:**\n- \"I would call the police\" (passive, avoidant)\n- \"I would panic\" (emotional instability)\n- \"I would fight\" (aggression)\n\n**Always write:**\n- Specific, practical, immediate action\n- Show leadership, courage, and social responsibility"
      },
      {
        keywords: ['interview', 'personal interview', 'io', 'piq'],
        answer: "**Personal Interview — Board President's Intelligence:**\n\n- **Duration**: 30-45 minutes, one-on-one with the Interviewing Officer (IO)\n- **Based on**: Your PIQ (Personal Information Questionnaire)\n\n**The IO is checking:**\n- Can you handle pressure while staying composed?\n- Are your answers CONSISTENT with your PIQ?\n- Do you show genuine passion or rehearsed responses?\n\n**5 Killer Tips:**\n1. Know your PIQ by heart — every word you wrote will be questioned\n2. Be SPECIFIC — \"I organized a blood donation camp for 200 students\" beats \"I help society\"\n3. Admit weaknesses honestly, then show how you're working on them\n4. Know your service (Army/Navy/Air Force) deeply — regiments, equipment, recent operations\n5. Current affairs from the last 6 months — focus on defense, geopolitics, technology"
      },
      {
        keywords: ['gto', 'group testing', 'outdoor', 'command task'],
        answer: "**GTO Tasks — Complete Tactical Breakdown:**\n\n**Day 3 (GTO-1):**\n- Group Discussion (2 topics)\n- Group Planning Exercise (GPE)\n- Progressive Group Task (PGT)\n- Half Group Task (HGT)\n\n**Day 4 (GTO-2):**\n- Lecturette (3 minutes, 4 topics to choose from)\n- Individual Obstacles (10 obstacles, 3 min timer)\n- Command Task (YOU lead 2-3 subordinates)\n- Final Group Task\n\n**What the GTO watches:**\n- Who initiates ideas first?\n- Who organizes the group naturally?\n- Who stays calm when the plan fails?\n- Who helps others without being asked?"
      },
      {
        keywords: ['tips', 'strategy', 'crack', 'prepare', 'help', 'how to'],
        answer: "**Major Yashkumar's Top 5 Rules for SSB:**\n\n1. **Be Yourself** — The board has seen 10,000 coached candidates. They detect acting in 10 seconds.\n2. **Show initiative, not dominance** — Speak first, but listen actively. Lead when needed, follow gracefully when someone else leads.\n3. **Consistency is EVERYTHING** — Your psychology responses, GTO behavior, and interview answers must tell the SAME story about who you are.\n4. **Physical fitness is non-negotiable** — It shows discipline, stamina, and determination. Run 2.4km under 11 minutes.\n5. **Read newspapers daily** — Not just headlines. Understand WHY events happen. Form opinions. The IO will ask \"What do you think about...?\"\n\n*\"An officer is not someone who knows all the answers. An officer is someone who stays calm when there ARE no answers.\"* — Major Yashkumar Yadav"
      }
    ];

    for (const entry of TACTICAL_MANUAL) {
      if (entry.keywords.some(kw => q.includes(kw))) {
        return `📡 *[Offline Mode — Local Tactical Manual]*\n\n${entry.answer}`;
      }
    }

    return "📡 *[Offline Mode]* — Major Yashkumar's AI uplink is temporarily at capacity. I'm operating on local intel.\n\nI can still help with:\n- **15 OLQs** — Ask me \"What are the 15 OLQs?\"\n- **TAT/WAT/SRT** — Ask me about any psychology test\n- **Personal Interview** — Ask me for interview tips\n- **GTO Tasks** — Ask me about Group Testing\n- **General Strategy** — Ask me \"How to crack SSB?\"\n\nType one of these topics and I'll brief you from my tactical manual.";
  };

  const resetChat = () => {
    setMessages([{
      id: 'welcome-reset',
      role: 'assistant',
      content: "Session cleared. Major Yashkumar Yadav standing by for your next query. What aspect of SSB preparation do you want to focus on, Candidate?",
      timestamp: new Date()
    }]);
  };

  const messageCount = messages.filter(m => m.role === 'user').length;

  return (
    <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-4 w-[calc(100vw-32px)] sm:w-[460px] h-[70vh] sm:h-[720px] max-h-[calc(100vh-120px)] bg-[#0a101e] border border-[#1E3A5F] rounded-[28px] shadow-2xl shadow-black/50 flex flex-col overflow-hidden fixed bottom-20 right-4 sm:relative sm:bottom-auto sm:right-auto"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#0f1c30] via-[#162840] to-[#0f1c30] border-b border-[#1E3A5F] flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center text-black font-black shadow-lg shadow-yellow-500/30 text-lg">
                    YK
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0f1c30] animate-pulse"></div>
                </div>
                <div>
                   <h3 className="text-white text-sm font-black uppercase tracking-wider">Maj. Yashkumar Yadav</h3>
                   <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      <span className="text-[9px] text-yellow-500/80 font-black uppercase tracking-[0.2em]">SSB Tactical Mentor</span>
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-1 relative z-10">
                <button 
                  onClick={resetChat}
                  title="Reset conversation"
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-600 hover:text-yellow-500 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-600 hover:text-white transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Session Info Bar */}
            <div className="px-5 py-2 bg-[#0d1526] border-b border-[#1E3A5F]/50 flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Secure Channel • AES-256</span>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{messageCount} messages sent</span>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar relative"
              style={{ background: 'linear-gradient(180deg, #080e1a 0%, #0a101e 100%)' }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[88%] ${msg.role === 'user' ? 'flex flex-col items-end' : 'flex gap-3'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center text-[10px] text-black font-black shrink-0 mt-1 shadow-sm">
                        YK
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      {msg.file && (
                        <div className={`rounded-xl border border-[#1E3A5F]/60 p-3 flex items-center gap-3 bg-[#0f1c30] max-w-xs ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-yellow-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{msg.file.name}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{(msg.file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      )}
                      {msg.image && (
                        <div className={`rounded-xl overflow-hidden border border-[#1E3A5F]/60 max-w-xs ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                          <img src={msg.image} alt="Upload" className="w-full h-auto object-cover max-h-48" />
                        </div>
                      )}
                      {msg.content && (
                        <div className={`
                          p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm
                          ${msg.role === 'user' 
                            ? 'bg-[#1e293b] border border-[#334155]/60 text-white font-medium rounded-br-sm' 
                            : 'bg-[#141e30] border border-[#1E3A5F]/60 text-slate-200 rounded-bl-sm'}
                        `}>
                          {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
                        </div>
                      )}
                      <p className={`text-[9px] font-bold mt-1 ${msg.role === 'user' ? 'text-right text-slate-600' : 'text-slate-700 ml-1'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center text-[10px] text-black font-black shrink-0 mt-1 shadow-sm">
                      YK
                    </div>
                    <div className="bg-[#141e30] border border-[#1E3A5F]/60 p-4 rounded-2xl rounded-bl-sm flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Major is analyzing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-[#162840] border border-[#1E3A5F] text-slate-400 p-2 rounded-full shadow-xl z-50 hover:text-yellow-500 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="bg-[#0d1526] border-t border-[#1E3A5F] flex flex-col px-4 pt-3 pb-4">
              {/* File & Image Previews */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-[#141e30] border border-yellow-500/20 rounded-xl px-3 py-2 group">
                    <FileText className="w-4 h-4 text-yellow-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate max-w-[140px]">{selectedFile.name}</p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {selectedImage && (
                  <div className="relative self-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#1E3A5F] relative group">
                      <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button 
                          onClick={() => setSelectedImage(null)}
                          className="p-1.5 bg-red-500 rounded-md text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative flex items-end gap-2 bg-[#141e30] border border-[#1E3A5F] rounded-[24px] p-2 transition-all focus-within:border-yellow-500/40 focus-within:ring-1 focus-within:ring-yellow-500/10">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload image"
                  className="p-2.5 text-slate-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-white/5 shrink-0"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input 
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button 
                  onClick={() => docInputRef.current?.click()}
                  title="Upload document (PDF, TXT, DOC)"
                  className="p-2.5 text-slate-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-white/5 shrink-0"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="file"
                  accept=".txt,.md,.csv,.json,.doc,.pdf,.rtf"
                  className="hidden"
                  ref={docInputRef}
                  onChange={handleDocUpload}
                />
                
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                      if (inputRef.current) inputRef.current.style.height = 'auto';
                    }
                  }}
                  rows={1}
                  placeholder="Ask Major Yashkumar or upload files..."
                  className="flex-1 bg-transparent border-none py-3 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:ring-0 resize-none max-h-[120px] custom-scrollbar"
                />
                
                <button
                  onClick={() => {
                    handleSend();
                    if (inputRef.current) inputRef.current.style.height = 'auto';
                  }}
                  disabled={(!input.trim() && !selectedImage && !selectedFile) || isLoading}
                  className="w-10 h-10 shrink-0 bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 disabled:opacity-30 disabled:cursor-not-allowed text-black rounded-full flex items-center justify-center transition-all shadow-lg shadow-yellow-500/20 active:scale-95 mb-0.5 mr-0.5"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <p className="text-[8px] text-slate-700 font-bold text-center mt-3 uppercase tracking-widest">
                Powered by SSB NextGen · Files & Images Supported
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-2xl relative group
          ${isOpen 
            ? 'bg-[#141e30] border border-[#1E3A5F] text-slate-400 hover:text-white' 
            : 'bg-gradient-to-br from-yellow-500 to-amber-600 text-black shadow-yellow-500/30'}
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#020617] text-[9px] font-black text-white flex items-center justify-center animate-pulse">
              1
            </span>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-[#141e30] border border-[#1E3A5F] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl whitespace-nowrap">
                Ask Major Yashkumar
              </div>
            </div>
          </>
        )}
      </motion.button>
    </div>
  );
}
