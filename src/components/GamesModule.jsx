import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Lock } from 'lucide-react';

export const GamesModule = () => {
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative bg-[#2A2A2A] rounded-2xl p-12 border-2 border-white/5 opacity-50 shadow-2xl transition-all duration-300 flex flex-col items-center gap-8 w-full md:-translate-y-6"
    >
      <div className="p-5 bg-black/50 rounded-2xl border border-white/5 relative">
        <Gamepad2 size={52} className="text-gray-500" strokeWidth={1.5} />
        <div className="absolute -top-2 -right-2 bg-[#111] p-1.5 rounded-full border border-gray-700">
          <Lock size={14} className="text-gray-500" />
        </div>
      </div>
      <span className="font-mono text-xl font-black tracking-[0.2em] text-gray-400 uppercase">OYUNLAR</span>
    </motion.div>
  );
};