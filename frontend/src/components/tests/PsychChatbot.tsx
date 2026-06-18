import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, X, Bot, User, Loader2, Sparkles, FileText, Image as ImageIcon, MessageSquare, Plus, Menu, Mic, MicOff, Camera, Volume2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
    files?: { name: string; type: string; preview?: string }[]
    timestamp: Date
}

export default function PsychChatbot() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [history, setHistory] = useState([
        { id: '1', title: 'Tips for Personal Interview', date: 'Yesterday' },
        { id: '2', title: 'TAT Story Evaluation', date: '3 days ago' },
        { id: '3', title: 'General Info', date: 'Last week' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [filePreviews, setFilePreviews] = useState<string[]>([])
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const recognitionRef = useRef<any>(null)
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
        }
    }, [input])

    // Cleanup file previews
    useEffect(() => {
        return () => {
            filePreviews.forEach(url => URL.revokeObjectURL(url))
        }
    }, [filePreviews])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        addFiles(selectedFiles)
        if (e.target) e.target.value = ''
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        addFiles(selectedFiles)
        if (e.target) e.target.value = ''
    }

    const addFiles = (newFiles: File[]) => {
        const combined = [...files, ...newFiles].slice(0, 5)
        setFiles(combined)

        // Generate previews for images
        const previews = combined.map(f => {
            if (f.type.startsWith('image/')) {
                return URL.createObjectURL(f)
            }
            return ''
        })
        setFilePreviews(previews)
    }

    const removeFile = (index: number) => {
        if (filePreviews[index]) URL.revokeObjectURL(filePreviews[index])
        setFiles(prev => prev.filter((_, i) => i !== index))
        setFilePreviews(prev => prev.filter((_, i) => i !== index))
    }

    // Voice Recording with Web Speech API
    const toggleVoiceRecording = useCallback(() => {
        if (isRecording) {
            // Stop recording
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            setIsRecording(false)
            setRecordingTime(0)
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
            return
        }

        // Start recording
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!SpeechRecognition) {
            alert('Voice input is not supported in your browser. Please use Chrome or Edge.')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-IN'

        recognition.onresult = (event: any) => {
            let finalTranscript = ''
            let interimTranscript = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' '
                } else {
                    interimTranscript += transcript
                }
            }
            if (finalTranscript) {
                setInput(prev => prev + finalTranscript)
            }
        }

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)
            setIsRecording(false)
            setRecordingTime(0)
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
        }

        recognition.onend = () => {
            setIsRecording(false)
            setRecordingTime(0)
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
        }

        recognitionRef.current = recognition
        recognition.start()
        setIsRecording(true)
        setRecordingTime(0)
        recordingTimerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1)
        }, 1000)
    }, [isRecording])

    const sendMessage = async () => {
        if (!input.trim() && files.length === 0) return
        
        const fileInfo = files.map((f, i) => ({ name: f.name, type: f.type, preview: filePreviews[i] || undefined }))
        const userMsg: ChatMessage = {
            role: 'user',
            content: input.trim() || (files.length > 0 ? `[Sent ${files.length} file(s)]` : ''),
            files: fileInfo.length > 0 ? fileInfo : undefined,
            timestamp: new Date()
        }
        
        // Stop recording if active
        if (isRecording) toggleVoiceRecording()
        
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setFiles([])
        setFilePreviews([])
        setIsLoading(true)
        if (textareaRef.current) textareaRef.current.style.height = 'auto'

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) })
            })

            const data = await response.json()
            const assistantMsg: ChatMessage = {
                role: 'assistant',
                content: data.reply || data.fallbackMessage || 'I apologize, but I am unable to process your request right now. Please try again.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, assistantMsg])
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Connection error. Please check your internet and try again.',
                timestamp: new Date()
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const formatRecordingTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />
        return <FileText className="w-4 h-4" />
    }

    const TypewriterMarkdown = ({ content, animate }: { content: string, animate: boolean }) => {
        const [displayed, setDisplayed] = useState(animate ? '' : content)
        
        useEffect(() => {
            if (!animate) return
            let i = 0
            const timer = setInterval(() => {
                if (i < content.length) {
                    setDisplayed(content.substring(0, i + 1))
                    i++
                } else {
                    clearInterval(timer)
                }
            }, 10)
            return () => clearInterval(timer)
        }, [content, animate])

        return (
            <div className="text-sm font-medium leading-relaxed markdown-body [&>p]:mb-3 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>h1]:text-lg [&>h1]:font-bold [&>h2]:text-md [&>h2]:font-bold [&>pre]:bg-black/50 [&>pre]:p-3 [&>pre]:rounded-lg [&>code]:bg-black/30 [&>code]:px-1 [&>code]:rounded">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayed}</ReactMarkdown>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-140px)] min-h-[600px] w-full max-w-6xl mx-auto bg-[#0f172a] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
            
            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-[#0d1424] border-r border-white/5 flex flex-col overflow-hidden shrink-0"
                    >
                        <div className="p-4 border-b border-white/5">
                            <button 
                                onClick={() => setMessages([])}
                                className="w-full bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-colors"
                            >
                                <Plus className="w-4 h-4" /> New Chat
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            <div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 px-2">Recent Sessions</p>
                                <div className="space-y-1">
                                    {history.map(h => (
                                        <button key={h.id} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3 group">
                                            <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                                            <div className="truncate flex-1">
                                                <p className="text-xs font-bold text-slate-300 truncate">{h.title}</p>
                                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{h.date}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Header */}
                <div className="bg-[#162840] border-b border-white/5 p-6 flex items-center gap-4">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/20 shrink-0">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Brigadier AI Mentor</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Online • Ready to Assist</span>
                    </div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">AI Powered</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full gap-8 text-center">
                        <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                            <Sparkles className="w-12 h-12 text-purple-500" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">How can I help you today?</h3>
                            <p className="text-slate-500 font-bold text-sm max-w-md">Ask me anything about SSB preparation, OLQs, psychology tests, interview techniques, or defence knowledge. Upload files, images, or use voice input!</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                            {[
                                'How to write a good TAT story?',
                                'Tips for Personal Interview',
                                'Explain all 15 OLQs',
                                'How to handle GD stress?'
                            ].map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setInput(q); }}
                                    className="text-left p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all text-sm font-bold text-slate-400 hover:text-white"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`max-w-[75%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                            {/* File/Image Previews in Messages */}
                            {msg.files && msg.files.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {msg.files.map((f, fi) => (
                                        <div key={fi}>
                                            {f.preview && f.type.startsWith('image/') ? (
                                                <div className="relative rounded-xl overflow-hidden border border-white/10 w-32 h-32">
                                                    <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                                        <p className="text-[9px] font-bold text-white truncate">{f.name}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                                                    {getFileIcon(f.type)}
                                                    <span className="text-xs font-bold text-slate-400">{f.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#162840] text-slate-200 border border-white/5'}`}>
                                {msg.role === 'user' ? (
                                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                ) : (
                                    <TypewriterMarkdown content={msg.content} animate={idx === messages.length - 1} />
                                )}
                            </div>
                            <p className={`text-[10px] font-bold text-slate-600 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                {formatTime(msg.timestamp)}
                            </p>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-[#162840] border border-white/5 p-4 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-sm font-bold text-slate-400">Brigadier is thinking...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* File Preview Strip */}
            {files.length > 0 && (
                <div className="px-6 py-3 border-t border-white/5 bg-[#0d1424] flex flex-wrap gap-3">
                    {files.map((file, i) => (
                        <div key={i} className="relative group">
                            {file.type.startsWith('image/') && filePreviews[i] ? (
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                                    <img src={filePreviews[i]} alt={file.name} className="w-full h-full object-cover" />
                                    <button onClick={() => removeFile(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                                    {getFileIcon(file.type)}
                                    <span className="text-xs font-bold text-slate-400 max-w-[120px] truncate">{file.name}</span>
                                    <button onClick={() => removeFile(i)} className="text-slate-600 hover:text-red-400 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Voice Recording Indicator */}
            {isRecording && (
                <div className="px-6 py-3 bg-red-500/10 border-t border-red-500/20 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-black text-red-400 uppercase tracking-widest">Recording... {formatRecordingTime(recordingTime)}</span>
                    <button onClick={toggleVoiceRecording} className="ml-auto text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-300">
                        Stop ■
                    </button>
                </div>
            )}

            {/* Input Area — Gemini-style */}
            <div className="p-4 bg-[#0d1424] border-t border-white/5">
                <div className="flex items-end gap-2 bg-[#162840] rounded-2xl border border-white/10 focus-within:border-purple-500/40 transition-colors p-3">
                    {/* File Upload */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-500 hover:text-purple-400 transition-colors shrink-0"
                        title="Attach file (PDF, DOC, TXT)"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Image Upload */}
                    <button
                        onClick={() => imageInputRef.current?.click()}
                        className="p-2 text-slate-500 hover:text-purple-400 transition-colors shrink-0"
                        title="Upload image"
                    >
                        <Camera className="w-5 h-5" />
                    </button>
                    <input
                        ref={imageInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    {/* Text Input */}
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage()
                            }
                        }}
                        placeholder={isRecording ? "Listening... speak now" : "Ask anything about SSB preparation..."}
                        rows={1}
                        className="flex-1 bg-transparent text-white placeholder-slate-600 focus:outline-none resize-none text-sm font-medium leading-relaxed max-h-[200px]"
                    />

                    {/* Voice Input */}
                    <button
                        onClick={toggleVoiceRecording}
                        className={`p-2 rounded-xl transition-all shrink-0 ${
                            isRecording 
                                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' 
                                : 'text-slate-500 hover:text-purple-400'
                        }`}
                        title={isRecording ? 'Stop recording' : 'Voice input'}
                    >
                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    {/* Send */}
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || (!input.trim() && files.length === 0)}
                        className="p-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-all shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center justify-between mt-2 px-1">
                    <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                        Brigadier AI may make mistakes. Verify important information.
                    </p>
                    <div className="flex items-center gap-3 text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Paperclip className="w-3 h-3" /> Files</span>
                        <span className="flex items-center gap-1"><Camera className="w-3 h-3" /> Images</span>
                        <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> Voice</span>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}
