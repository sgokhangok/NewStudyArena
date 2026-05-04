import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export const GatekeeperModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (password === '1234') { 
      setStatus('success');
      setTimeout(() => { 
        onSuccess(); // LobbyScreen'deki AdminModal'ı açar
        setPassword(''); 
        setStatus(null); 
      }, 1000);
    } else { 
      setStatus('error'); 
      setTimeout(() => setStatus(null), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }} 
            exit={{ scale: 0.9 }} 
            className="bg-[#111] border border-[#A90432]/40 p-8 max-w-sm w-full rounded-2xl relative overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-[#A90432] font-black tracking-widest flex items-center gap-2 uppercase text-sm">
                <ShieldCheck size={18} /> Yetkili Erişimi
              </h2>
              <button onClick={onClose} className="text-gray-600 hover:text-white font-mono text-xs">[X]</button>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <input 
                type="password" 
                autoFocus
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="ADMİN ANAHTARI" 
                className={`w-full bg-black text-[#A90432] border-2 p-4 font-mono text-center tracking-[0.4em] focus:outline-none rounded-xl transition-all ${status === 'error' ? 'border-[#A90432]' : 'border-[#A90432]/20'}`} 
              />
              <button 
                type="submit" 
                disabled={!password || status === 'success'} 
                className={`w-full font-black py-4 tracking-widest transition-all rounded-xl uppercase ${status === 'success' ? 'bg-green-600 text-white' : 'bg-[#222] border border-[#A90432]/30 text-[#A90432] hover:bg-[#A90432] hover:text-black'}`}
              >
                {status === 'success' ? 'ERİŞİM ONAYLANDI' : 'SİSTEME GİR'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};