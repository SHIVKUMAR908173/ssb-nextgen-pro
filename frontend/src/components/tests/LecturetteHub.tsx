'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Loader2, Play, FileText, CheckCircle, Mic, Filter, ChevronRight } from 'lucide-react';
import LecturetteSimulator from './LecturetteSimulator';
import lecturetteData from '@/data/lecturette_60_sets.json';

interface LecturetteTopic {
  topic: string;
  category: string;
  key_points: string[];
  difficulty: string;
}

const ALL_TOPICS: LecturetteTopic[] = lecturetteData.sets.flatMap(s => s.topics);
const CATEGORIES = Array.from(new Set(ALL_TOPICS.map(t => t.category)));

// Board-wise topic affinity based on the new thematic categories
const BOARD_PREFERENCES: Record<string, string[]> = {
  'all':        CATEGORIES,
  '11 SSB Allahabad': ['Defense & Security', 'Society & National Issues', 'Geopolitics & International Relations'],
  '12 SSB Bangalore': ['Technology & Cyber', 'Geopolitics & International Relations'],
  '14 SSB Bhopal':    ['Society & National Issues', 'Defense & Security'],
  '17 SSB Bangalore': ['Technology & Cyber', 'Geopolitics & International Relations', 'Society & National Issues'],
  '21 SSB Bhopal':    ['Defense & Security', 'Geopolitics & International Relations'],
  '22 SSB Bhopal':    ['Technology & Cyber', 'Defense & Security'],
  '1 AFSB Dehradun':  ['Technology & Cyber', 'Geopolitics & International Relations', 'Defense & Security'],
  '2 AFSB Mysuru':    ['Technology & Cyber', 'Defense & Security'],
  'INS Delhi':        ['Geopolitics & International Relations', 'Defense & Security', 'Technology & Cyber'],
};

const BOARDS = Object.keys(BOARD_PREFERENCES);

interface LecturetteNotes {
  introduction: string;
  bodyPoints: string[];
  conclusion: string;
  timeDistribution: string;
}

export default function LecturetteHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<LecturetteNotes | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);

  // Filter topics by board preference and category
  const filteredTopics = useMemo(() => {
    const boardCategories = BOARD_PREFERENCES[selectedBoard] || CATEGORIES;
    return ALL_TOPICS
      .filter(t => boardCategories.includes(t.category))
      .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
      .filter(t => t.topic.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [selectedBoard, selectedCategory, searchQuery]);

  // Topics by category for counts
  const topicsByCategory = useMemo(() => {
    const boardCategories = BOARD_PREFERENCES[selectedBoard] || CATEGORIES;
    const filtered = ALL_TOPICS.filter(t => boardCategories.includes(t.category));
    
    const counts: Record<string, number> = {};
    filtered.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }, [selectedBoard]);

  const handleGenerateNotes = async (topic: string) => {
    setSelectedTopic(topic);
    setIsGenerating(true);
    setGeneratedNotes(null);
    try {
      const res = await fetch('/api/lecturette-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (data.notes) setGeneratedNotes(data.notes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a2540] to-[#0f172a] rounded-[40px] p-10 border border-emerald-500/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Stage II — GTO</span>
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Lecturette Hub</h1>
            <p className="text-slate-400 text-sm font-medium max-w-md">
              Practice board-wise Lecturette topics. Select a topic, generate AI-structured 3-minute speech notes, then practice with a live timer.
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-black text-emerald-400">{filteredTopics.length}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Topics Available</p>
          </div>
        </div>
      </div>

      {/* Board Selector */}
      <div className="bg-[#162840] rounded-[32px] p-6 border border-[#1E3A5F]">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-4 h-4 text-emerald-400" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter by SSB Board</p>
          <span className="ml-auto text-[9px] text-slate-600 font-black uppercase tracking-widest">Board emphasis = most likely topics</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {BOARDS.map((board) => (
            <button
              key={board}
              onClick={() => { setSelectedBoard(board); setSelectedCategory('all'); }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                selectedBoard === board
                  ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-[#0f172a] border-white/5 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400'
              }`}
            >
              {board === 'all' ? '🌐 All Boards' : board}
            </button>
          ))}
        </div>

        {/* Category filter chips when board selected */}
        {selectedBoard !== 'all' && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Filter by Topic Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20'
                }`}
              >
                All Categories ({topicsByCategory.reduce((a, b) => a + b.count, 0)})
              </button>
              {topicsByCategory.map(({ category, count }) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                    selectedCategory === category
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20'
                  }`}
                >
                  {category} ({count})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Panel */}
      <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl text-slate-200 min-h-[600px] flex flex-col md:flex-row">

        {/* Sidebar: Topic List */}
        <div className="w-full md:w-2/5 bg-black/40 border-r border-white/10 flex flex-col">
          <div className="p-5 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${filteredTopics.length} topics...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {filteredTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">No topics found</p>
                <p className="text-slate-700 text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              filteredTopics.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGenerateNotes(t.topic)}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex justify-between items-center group
                    ${selectedTopic === t.topic
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                      : 'bg-transparent border-transparent hover:bg-slate-900 hover:border-white/5 text-slate-400'
                    }
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <span className="truncate pr-4 font-medium block">{t.topic}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.category}</span>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border tracking-widest ${t.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : t.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{t.difficulty}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${selectedTopic === t.topic ? 'text-emerald-400 opacity-100' : 'text-slate-500'}`} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gradient-to-br from-black/20 to-slate-900/40 p-8 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

          {!selectedTopic ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <FileText className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-widest text-slate-300 mb-2">Select a Topic</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                {selectedBoard === 'all'
                  ? 'Tap any topic to generate AI-structured 3-minute speech notes.'
                  : `Showing topics emphasized by ${selectedBoard}. Tap any to generate notes.`}
              </p>
            </div>
          ) : isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5 z-10">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
                <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-emerald-400 animate-spin" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-white text-center">RAG Pipeline Active</h3>
              <div className="text-slate-400 font-mono text-xs max-w-sm w-full space-y-2 mt-4">
                <p className="flex justify-between"><span>[SYSTEM] Querying Vector DB...</span> <CheckCircle className="w-3 h-3 text-emerald-500 inline"/></p>
                <p className="flex justify-between"><span>[SYSTEM] Retrieving context for "{selectedTopic.slice(0, 20)}..."</span> <CheckCircle className="w-3 h-3 text-emerald-500 inline"/></p>
                <p className="flex justify-between text-yellow-500 animate-pulse"><span>[SYSTEM] Structuring 3-Minute SSB Layout...</span> <Loader2 className="w-3 h-3 inline animate-spin"/></p>
              </div>
            </div>
          ) : generatedNotes ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 overflow-y-auto custom-scrollbar z-10"
            >
              <div className="mb-8 border-b border-white/10 pb-6">
                <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">{selectedTopic}</h2>
                <span className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded inline-block">
                  AI Structured Output: {generatedNotes.timeDistribution}
                </span>
              </div>

              <div className="space-y-6">
                {/* Introduction */}
                <div className="bg-slate-900 border border-t-4 border-white/5 border-t-emerald-500 rounded-xl p-6 shadow-glass">
                  <h4 className="text-emerald-400 text-xs uppercase font-black tracking-[0.2em] mb-3">Introductory Hook (30s)</h4>
                  <p className="text-slate-200 leading-relaxed font-medium">{generatedNotes.introduction}</p>
                </div>

                {/* Main Body */}
                <div className="bg-slate-900/80 border border-l-4 border-white/10 border-l-blue-500 rounded-xl p-6 shadow-glass">
                  <h4 className="text-blue-400 text-xs uppercase font-black tracking-[0.2em] mb-4">Core Arguments / Impact (2m)</h4>
                  <ul className="space-y-4">
                    {generatedNotes.bodyPoints.map((pt, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">{i+1}</span>
                        <p className="text-slate-300 leading-relaxed text-sm">{pt}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conclusion */}
                <div className="bg-slate-900 border border-t-4 border-white/5 border-t-yellow-500 rounded-xl p-6 shadow-glass mb-8">
                  <h4 className="text-yellow-400 text-xs uppercase font-black tracking-[0.2em] mb-3">Officer Conclusion (30s)</h4>
                  <p className="text-slate-200 leading-relaxed font-medium italic">"{generatedNotes.conclusion}"</p>
                </div>

                <button
                  onClick={() => setIsPracticing(true)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3"
                >
                  <Mic className="w-5 h-5" />
                  Start 3-Minute Practice & AI Audit
                </button>
              </div>
            </motion.div>
          ) : (
            // Topic selected but no notes generated yet (initial click in progress)
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <Play className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold uppercase tracking-widest text-slate-300 mb-2">Topic Selected</h3>
              <p className="text-sm text-slate-500">{selectedTopic}</p>
              <p className="text-xs text-slate-600 mt-2">Generating structured speech notes...</p>
            </div>
          )}

          {isPracticing && selectedTopic && (
            <LecturetteSimulator
              topic={selectedTopic}
              onClose={() => setIsPracticing(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
