import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Save, Link as LinkIcon } from 'lucide-react';
import { useGlobalState } from '../context/GlobalState';

export const ArenaSettingsModal = ({ isOpen, onClose }) => {
  const { arenaSheetsLink, setArenaSheetsLink } = useGlobalState();
  const [linkInput, setLinkInput] = useState('');

  // Modül açıldığında mevcut kayıtlı linki kutuya yazdır
  useEffect(() => {
    if (isOpen) {
      setLinkInput(arenaSheetsLink || '');
    }
  }, [isOpen, arenaSheetsLink]);

  const handleSave = (e) => {
    e.preventDefault();
    setArenaSheetsLink(linkInput);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#1a1a1a] border border-[#FDB912]/30 p-8 max-w-lg w-full rounded-2xl shadow-[0_0_40px_rgba(253,185,18,0.15)] relative">
            
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-widest uppercase">
                <Database className="text-[#FDB912]" size={24}/> 
                ARENA VERİ TABANI
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[#FDB912] font-mono text-[10px] tracking-widest uppercase flex items-center gap-2">
                  <LinkIcon size={14}/> Google Sheets Kaynak Linki
                </label>
                <input 
                  type="text" 
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..." 
                  className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#FDB912] font-mono text-sm transition-colors"
                />
                <p className="text-gray-500 text-[10px] font-mono uppercase mt-2 leading-relaxed">
                  * Seçim ekranındaki "Test Envanterinin" otomatik çekileceği Herkese Açık Google Sheets bağlantı adresini girin.
                </p>
              </div>

              <button type="submit" className="w-full bg-[#FDB912] text-black font-black py-4 rounded-xl tracking-[0.2em] hover:bg-yellow-400 transition-colors flex justify-center items-center gap-2 uppercase">
                <Save size={18} /> Sistemi Güncelle
              </button>
            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};