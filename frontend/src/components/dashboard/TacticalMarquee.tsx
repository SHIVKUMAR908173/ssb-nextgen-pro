'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ARMY_QUOTES = [
  { text: "Either I will come back after hoisting the Tricolour, or I will come back wrapped in it, but I will be back for sure.", author: "Capt Vikram Batra" },
  { text: "Some goals are so worthy, it's glorious even to fail.", author: "Capt Manoj Kumar Pandey" },
  { text: "If death strikes before I prove my blood, I swear I'll kill Death.", author: "Capt Manoj Kumar Pandey" },
  { text: "The safety, honour and welfare of your country come first, always and every time.", author: "Chetwode Motto" },
  { text: "We fight to win and win with a knock out, because there are no runners up in war.", author: "Gen J.J. Singh" },
  { text: "I shall not withdraw an inch but will fight to our last man and our last round.", author: "Major Somnath Sharma" },
  { text: "Quartered in many a land, they found a soldier's grave; for they knew that to die for their country was the best use of the life they gave.", author: "Unknown Soldier" },
  { text: "To find us, you must be good. To catch us, you must be fast. To beat us, you must be joking.", author: "Special Forces Motto" }
];

export default function TacticalMarquee() {
  return (
    <div className="w-full bg-yellow-500/10 border-y border-yellow-500/20 py-3 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#020617] to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#020617] to-transparent z-10"></div>
      
      <motion.div 
        animate={{ x: [0, -2000] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {[...ARMY_QUOTES, ...ARMY_QUOTES].map((quote, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-yellow-600"></span>
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest italic">
              "{quote.text}"
            </span>
            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] bg-yellow-500/10 px-2 py-1 rounded">
              - {quote.author}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
