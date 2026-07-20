'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper, Globe, Shield, Zap, TrendingUp, Calendar, ChevronRight, Share2, X, ExternalLink } from 'lucide-react'

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: string;
  category: string;
}

interface MappedNewsItem {
  id: string;
  category: string;
  title: string;
  desc: string;
  time: string;
  image: string;
  featured: boolean;
  url: string;
}

const FALLBACK_IMAGES = [
  '/assets/news/fallback_1.png',
  '/assets/news/fallback_2.png',
  '/assets/news/fallback_3.png',
];

const CATEGORY_TABS = ['All', 'Indian Army', 'Indian Navy', 'Indian Air Force', 'Defence Tech', 'Border Security', 'SSB/Recruitment'] as const;
type CategoryFilter = typeof CATEGORY_TABS[number];

const LOCAL_FALLBACK: MappedNewsItem[] = [
  {
    id: 'local-1',
    category: 'Military Tech',
    title: 'Indian Army to Induct 100 More K9-Vajra Self-Propelled Howitzers',
    desc: 'The Ministry of Defense has cleared the procurement of an additional 100 units of the K9-Vajra 155mm/52 calibre tracked self-propelled howitzers.',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1590496793907-353664d4b172?q=80&w=1000&auto=format&fit=crop',
    featured: true,
    url: '#'
  },
  {
    id: 'local-2',
    category: 'Geopolitics',
    title: 'QUAD Naval Exercises Begin in the Indo-Pacific Region',
    desc: 'Naval forces from India, USA, Japan, and Australia have commenced the Malabar exercise to strengthen maritime security.',
    time: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop',
    url: '#',
    featured: false,
  },
  {
    id: 'local-3',
    category: 'National Security',
    title: 'New Cybersecurity Policy for Critical Infrastructure Defense',
    desc: 'The National Security Council has proposed a revamped framework to protect the country\'s digital borders against state-sponsored actors.',
    time: '8 hours ago',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    url: '#',
    featured: false,
  }
];

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'Recent';
  }
}

function SkeletonCard({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`bg-[#162840] rounded-[${featured ? '48' : '32'}px] overflow-hidden border border-white/5 animate-pulse`}>
      {featured && <div className="h-96 bg-slate-800/50" />}
      <div className={`${featured ? 'p-12' : 'p-6'} space-y-4`}>
        <div className="h-3 w-24 bg-slate-700 rounded-full" />
        <div className="h-6 w-3/4 bg-slate-700 rounded-lg" />
        {featured && <div className="h-4 w-full bg-slate-700/50 rounded-lg" />}
        {featured && <div className="h-4 w-2/3 bg-slate-700/50 rounded-lg" />}
      </div>
    </div>
  );
}

function SkeletonSideCard() {
  return (
    <div className="bg-[#162840] rounded-[32px] p-6 border border-[#1E3A5F] flex gap-6 animate-pulse">
      <div className="w-24 h-24 rounded-2xl bg-slate-800/50 shrink-0" />
      <div className="space-y-3 flex-1">
        <div className="h-2 w-16 bg-slate-700 rounded-full" />
        <div className="h-4 w-full bg-slate-700 rounded-lg" />
        <div className="h-2 w-20 bg-slate-700/50 rounded-full" />
      </div>
    </div>
  );
}

export default function DailyNewsPage() {
  const [liveNews, setLiveNews] = useState<MappedNewsItem[]>([]);
  const [feedSource, setFeedSource] = useState<'live' | 'static' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [selectedArticle, setSelectedArticle] = useState<MappedNewsItem | null>(null);

  const fetchNews = useCallback(() => {
    setIsLoading(true);
    fetch(`/api/news`)
      .then(res => res.json())
      .then((data: { articles: NewsArticle[]; source: 'live' | 'static'; total: number }) => {
        if (data.articles && data.articles.length > 0) {
          const mappedNews: MappedNewsItem[] = data.articles.map((item, idx) => ({
            id: item.id || `article-${idx}`,
            category: item.category || item.source || 'Defence News',
            title: item.title,
            desc: item.description,
            time: item.publishedAt ? formatTimeAgo(item.publishedAt) : 'Recent',
            image: item.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
            featured: idx === 0,
            url: item.url,
          }));
          setLiveNews(mappedNews);
          setFeedSource(data.source);
          setLastRefresh(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
        } else {
          setLiveNews(LOCAL_FALLBACK);
          setFeedSource('static');
        }
      })
      .catch(err => {
        console.error("Backend not reachable. Using fallback local data.", err);
        setLiveNews(LOCAL_FALLBACK);
        setFeedSource('static');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchNews();
    // Auto-refresh every 5 minutes for real-time intel
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filteredNews = useMemo(() => {
    if (activeCategory === 'All') return liveNews;
    return liveNews.filter(item => item.category === activeCategory);
  }, [liveNews, activeCategory]);

  // Make first item in filtered set the featured one
  const displayNews = useMemo(() => {
    if (filteredNews.length === 0) return [];
    return filteredNews.map((item, idx) => ({
      ...item,
      featured: idx === 0,
    }));
  }, [filteredNews]);

  const isConnected = feedSource === 'live';

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* News Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#0f172a] rounded-3xl md:rounded-[48px] p-12 overflow-hidden border border-white/5"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
           <div>
             <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-fit mb-8">
               <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">Defence Brief · Updated Daily</span>
             </div>
             
             <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
               Daily Defense <span className="text-yellow-500">News</span>
             </h1>
             
             <p className="text-slate-400 max-w-2xl text-lg font-bold leading-relaxed">
               Stay ahead of the curve with real-time geopolitical updates and military advancements. Essential for Current Affairs and Lecturette preparation.
             </p>
           </div>
           
           <div className="mt-8 md:mt-0 flex flex-col items-end gap-3">
              {/* Source Badge */}
              {feedSource && (
                <div className="flex items-center gap-2">
                  {feedSource === 'live' ? (
                    <span className="bg-red-500/10 border border-red-500/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Live</span>
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                      <Shield className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Curated</span>
                    </span>
                  )}
                </div>
              )}

              {/* Uplink Status */}
              <div className="bg-[#162840] border border-white/5 rounded-2xl p-6 flex items-center gap-4 text-center">
                 <Zap className={`w-8 h-8 ${isConnected ? 'text-green-500' : 'text-slate-500'} ${isConnected ? 'animate-pulse' : ''}`} />
                 <div className="text-left">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uplink Status</p>
                    <p className={`font-bold text-sm uppercase ${isConnected ? 'text-green-500' : 'text-slate-400'}`}>
                      {isConnected ? 'API Live' : 'Local Fallback'}
                    </p>
                    {lastRefresh && <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1">Last sync: {lastRefresh}</p>}
                 </div>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === tab
                ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500'
                : 'bg-[#162840] border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <SkeletonCard featured />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <SkeletonSideCard />
            <SkeletonSideCard />
            <SkeletonSideCard />
          </div>
        </div>
      ) : displayNews.length === 0 ? (
        <div className="py-20 text-center space-y-6 bg-[#0f172a] rounded-[40px] border border-white/5">
          <Shield className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">No intel in this category</p>
        </div>
      ) : (
        /* Featured Story + Sidebar */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8">
              {displayNews.filter(n => n.featured).map((item) => (
                <motion.div 
                  key={item.id}
                  onClick={() => setSelectedArticle(item)}
                  whileHover={{ y: -5 }}
                  className="group bg-[#162840] rounded-3xl md:rounded-[48px] overflow-hidden border border-white/5 flex flex-col h-full shadow-2xl cursor-pointer"
                >
                 <div className="h-96 relative overflow-hidden">
                    <img 
                       src={item.image} 
                       alt={item.title} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" 
                       onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES[0] }}
                    />
                    <div className="absolute top-6 left-6 flex items-center gap-2">
                       <span className="bg-yellow-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-black shadow-xl">{item.category}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#162840] to-transparent"></div>
                 </div>
                 <div className="p-12 space-y-6 -mt-20 relative z-10">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                          <Calendar className="w-4 h-4" />
                          {item.time}
                       </div>
                       <button className="text-slate-500 hover:text-yellow-500 transition-colors">
                          <Share2 className="w-5 h-5" />
                       </button>
                    </div>
                    <h2 className="text-4xl font-black text-white leading-tight uppercase tracking-tight group-hover:text-yellow-400 transition-colors">
                       {item.title}
                    </h2>
                    <p className="text-lg text-slate-400 font-bold leading-relaxed">
                       {item.desc}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-black text-yellow-500 uppercase tracking-widest hover:gap-3 transition-all pt-4 group-hover:text-yellow-400">
                       Analyze In Depth <ChevronRight className="w-4 h-4" />
                    </div>
                 </div>
                </motion.div>
              ))}
           </div>

           <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F]">
                 <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">Trending Topics</h3>
                 <div className="space-y-4">
                    {['Indo-Pacific Strategy', 'Agnipath Scheme', 'IAF Modernization', 'LAC Standoff'].map((tag) => (
                      <button key={tag} className="w-full flex items-center justify-between p-4 bg-[#0f172a] rounded-2xl hover:bg-yellow-500/10 hover:text-yellow-500 transition-all group border border-white/5">
                         <span className="text-xs font-bold uppercase tracking-tight text-slate-400 group-hover:text-yellow-500">{tag}</span>
                         <TrendingUp className="w-4 h-4 text-slate-600 group-hover:text-yellow-500" />
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 {displayNews.filter(n => !n.featured).map((item) => (
                   <motion.div 
                     onClick={() => setSelectedArticle(item)}
                     key={item.id}
                     whileHover={{ x: 5 }}
                     className="bg-[#162840] rounded-[32px] p-6 border border-[#1E3A5F] flex gap-6 group cursor-pointer block"
                   >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                         <img 
                            src={item.image} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform opacity-70" 
                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES[1] }}
                         />
                      </div>
                      <div className="space-y-2">
                         <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">{item.category}</p>
                         <h4 className="text-sm font-black text-white leading-tight uppercase tracking-tight group-hover:text-yellow-400 transition-colors">{item.title}</h4>
                         <p className="text-[10px] font-bold text-slate-500">{item.time}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>

              {/* YouTube Defense Intel */}
              <div className="bg-[#162840] rounded-[32px] p-8 border border-[#1E3A5F]">
                 <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">Defense YouTube Channels</h3>
                 <div className="space-y-4">
                    {[
                      { name: 'Defence Direct Education', desc: 'SSB Strategies & OIR', url: 'https://youtube.com/@defencedirecteducation' },
                      { name: 'SSBCrack Exams', desc: 'Interviews & Psych', url: 'https://youtube.com/@SSBCrackExams' },
                      { name: 'The Fauji Show', desc: 'Ex-Assessor Insights', url: 'https://youtube.com/@TheFaujiShow' }
                    ].map((yt) => (
                      <a key={yt.name} href={yt.url} target="_blank" rel="noreferrer" className="block w-full p-4 bg-[#0f172a] rounded-2xl hover:bg-red-500/10 hover:border-red-500/30 transition-all group border border-white/5">
                         <p className="text-xs font-black uppercase tracking-tight text-slate-300 group-hover:text-red-400 mb-1">{yt.name}</p>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{yt.desc}</p>
                      </a>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#0f172a] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full h-64 sm:h-80 relative shrink-0">
                <img 
                   src={selectedArticle.image} 
                   alt={selectedArticle.title} 
                   className="w-full h-full object-cover" 
                   onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES[2] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
                <div className="absolute bottom-6 left-8 flex items-center gap-3">
                  <span className="bg-yellow-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-black">
                    {selectedArticle.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                    {selectedArticle.time}
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight uppercase tracking-tight mb-6">
                  {selectedArticle.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-slate-300 font-bold leading-relaxed whitespace-pre-wrap">
                    {selectedArticle.desc || 'No extended intelligence summary available for this briefing.'}
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Source: Intelligence Network
                  </p>
                  <a 
                    href={selectedArticle.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-full font-black tracking-widest uppercase flex justify-center items-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/20"
                  >
                    Read Full Source <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
