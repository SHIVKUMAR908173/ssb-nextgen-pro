'use client';

import React, { useState, useEffect } from 'react';

export default function ServerStatusBadge() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const baseUrl = apiUrl.replace(/\/api\/v1$/, '');
        const res = await fetch(`${baseUrl}/health`, { 
          signal: AbortSignal.timeout(3000) 
        });
        const data = await res.json();
        setStatus(data.status === 'healthy' ? 'online' : 'offline');
      } catch {
        setStatus('offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
      status === 'online' 
        ? 'bg-emerald-500/10 border-emerald-500/20' 
        : status === 'offline'
          ? 'bg-red-500/10 border-red-500/20'
          : 'bg-white/5 border-white/10'
    }`}>
      <span className={`w-2 h-2 rounded-full ${
        status === 'online' 
          ? 'bg-emerald-500 animate-pulse' 
          : status === 'offline'
            ? 'bg-red-500'
            : 'bg-yellow-500 animate-pulse'
      }`} />
      <span className={`text-[10px] font-black tracking-tighter ${
        status === 'online' 
          ? 'text-emerald-400' 
          : status === 'offline'
            ? 'text-red-400'
            : 'text-yellow-400'
      }`}>
        {status === 'online' ? 'SERVER ONLINE' : status === 'offline' ? 'SERVER OFFLINE' : 'CONNECTING...'}
      </span>
    </div>
  );
}
