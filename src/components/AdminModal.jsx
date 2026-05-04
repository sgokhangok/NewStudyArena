import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Lock, Terminal, Cpu } from 'lucide-react';
import { useGlobalState } from '../context/GlobalState';
import { InputField } from './InputField';

export const AdminModal = ({ isOpen, onClose }) => {
  const { systemConfig, setSystemConfig, aiConfig, setAiConfig, initFirebaseCore } = useGlobalState();
  const [firebaseForm, setFirebaseForm] = useState({ apiKey: '', authDomain: '', projectId: '' });
  const [aiForm, setAiForm] = useState({ geminiKey: '' });

  useEffect(() => {
    if (systemConfig) setFirebaseForm(systemConfig);
    if (aiConfig) setAiForm(aiConfig);
  }, [systemConfig, aiConfig, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('arena_secure_config', JSON.stringify(firebaseForm));
    localStorage.setItem('arena_ai_config', JSON.stringify(aiForm));
    setSystemConfig(firebaseForm);
    setAiConfig(aiForm);
    initFirebaseCore(firebaseForm);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1a1a1a] border border-[#FDB912]/30 p-8 max-w-md w-full rounded-2xl relative my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2"><Settings className="text-[#FDB912]"/> SİSTEM AYARLARI</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white">[X]</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border border-white/5 p-4 rounded-xl bg-black/30">
                 <div className="text-[#FDB912] font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2"><Shield size={14}/> 1. Firebase Konfigürasyonu</div>
                 <InputField label="API Key" type="password" isSecret={true} name="apiKey" value={firebaseForm.apiKey} onChange={(e) => setFirebaseForm({...firebaseForm, apiKey: e.target.value})} placeholder="AIzaSy..." icon={Lock} />
                 <InputField label="Auth Domain" type="text" name="authDomain" value={firebaseForm.authDomain} onChange={(e) => setFirebaseForm({...firebaseForm, authDomain: e.target.value})} placeholder="proje.firebaseapp.com" icon={Shield} />
                 <InputField label="Project ID" type="text" name="projectId" value={firebaseForm.projectId} onChange={(e) => setFirebaseForm({...firebaseForm, projectId: e.target.value})} placeholder="proje-id" icon={Terminal} />
              </div>
              <div className="border border-white/5 p-4 rounded-xl bg-black/30">
                 <div className="text-[#FDB912] font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2"><Cpu size={14}/> 2. AI Motoru Konfigürasyonu</div>
                 <InputField label="Gemini API Key" type="password" isSecret={true} name="geminiKey" value={aiForm.geminiKey} onChange={(e) => setAiForm({...aiForm, geminiKey: e.target.value})} placeholder="AIza..." icon={Lock} />
              </div>
              <button type="submit" className="w-full mt-4 bg-[#FDB912] text-black font-black py-4 rounded-lg tracking-widest hover:bg-yellow-400 transition-colors">KAYDET VE GÜNCELLE</button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};