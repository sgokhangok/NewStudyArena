import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, BookOpen, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useGlobalState } from '../context/GlobalState';
import { Toast } from './Toast';
import { InputField } from './InputField';

// KRİTİK: İsim tam olarak AuthModal olmalı!
export const AuthModal = ({ isOpen, onClose }) => {
  const { firebaseInstance, setCurrentUser } = useGlobalState();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ ad_soyad: '', email: '', sifre: '', sinif: '7' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseInstance) return;
    setLoading(true); setToast({ type: '', text: '' });
    const { auth, db } = firebaseInstance;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.sifre);
        onClose(); navigate('/lobby');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.sifre);
        const user = userCredential.user;
        try {
          await setDoc(doc(db, 'users', user.uid), {
            ad_soyad: formData.ad_soyad, email: formData.email,
            sinif: Number(formData.sinif), kayit_tarihi: serverTimestamp(), aktif_mi: true
          });
          setCurrentUser(user);
          setToast({ type: 'success', text: 'Kayıt başarılı! Lobiye yönlendiriliyorsunuz...' });
          setTimeout(() => { onClose(); navigate('/lobby'); }, 1500);
        } catch (dbError) {
          await deleteUser(user);
          setToast({ type: 'error', text: 'Veritabanı bağlantı hatası.' });
        }
      }
    } catch (error) {
      setToast({ type: 'error', text: "Giriş başarısız. Bilgileri kontrol edin." });
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#1a1a1a] border border-white/10 p-8 max-w-md w-full rounded-2xl relative my-8">
            <Toast alert={toast} />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white">{isLogin ? 'ARENA GİRİŞ' : 'YENİ KAYIT'}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white font-mono">[X]</button>
            </div>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <InputField label="Ad Soyad" type="text" name="ad_soyad" value={formData.ad_soyad} onChange={(e) => setFormData({...formData, ad_soyad: e.target.value})} placeholder="Ali Yılmaz" icon={User} disabled={loading} />
                  <InputField label="Sınıf" type="number" name="sinif" min="1" max="12" value={formData.sinif} onChange={(e) => setFormData({...formData, sinif: e.target.value})} placeholder="7" icon={BookOpen} disabled={loading} />
                </>
              )}
              <InputField label="E-Posta" type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="ogrenci@arena.com" icon={Mail} disabled={loading} />
              <InputField label="Şifre" type="password" isSecret={true} name="sifre" value={formData.sifre} onChange={(e) => setFormData({...formData, sifre: e.target.value})} placeholder="••••••••" icon={Lock} disabled={loading} />
              <button type="submit" disabled={loading} className="w-full mt-4 bg-white text-black font-black py-4 rounded-lg tracking-widest flex justify-center items-center gap-2 hover:bg-gray-200 transition-colors">
                {loading ? 'İŞLENİYOR...' : (isLogin ? 'SİSTEME GİR' : 'MÜHÜRLE VE KAYIT OL')}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm font-mono text-gray-500 hover:text-[#FDB912]">
                {isLogin ? 'Kayıt ol.' : 'Giriş yap.'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};