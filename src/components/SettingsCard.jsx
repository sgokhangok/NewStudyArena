import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

// ARENA SİSTEMİ: AYARLAR KART MODÜLÜ [cite: 101-102]
export const SettingsCard = ({ onClick }) => {
  return (
    <motion.button 
      type="button"
      onClick={onClick}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-[#111] rounded-2xl p-12 border-2 border-white/5 hover:border-white/20 shadow-2xl transition-all duration-500 flex flex-col items-center gap-8 w-full"
    >
      {/* İkon Konteynırı */}
      <div className="p-6 bg-black/40 rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors duration-500 shadow-inner relative">
        <Settings 
          size={56} 
          className="text-gray-500 group-hover:text-white transition-all duration-700 group-hover:rotate-90" 
          strokeWidth={1.5} 
        />
      </div>

      {/* Metin Alanı */}
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-xl font-black tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors uppercase">
          AYARLAR
        </span>
        <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
          Sistem Yapılandırması
        </span>
      </div>

      {/* Arka Plan Efekti */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
    </motion.button>
  );
};