import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const Toast = ({ alert }) => {
  if (!alert.text) return null;
  const isError = alert.type === 'error';
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} 
      className={`absolute top-4 left-1/2 -translate-x-1/2 p-4 rounded-lg flex items-center shadow-2xl border z-[200] min-w-[300px]
      ${isError ? 'bg-[#A90432]/90 text-white border-red-500' : 'bg-green-600/90 text-white border-green-400'}`}>
      {isError ? <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" /> : <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />}
      <span className="text-sm font-mono tracking-wide font-bold">{alert.text}</span>
    </motion.div>
  );
};