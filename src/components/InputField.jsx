import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const InputField = ({ label, type, name, value, onChange, placeholder, icon: Icon, disabled = false, min, max, isSecret = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isSecret ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4">
      <label className="block text-xs font-black text-gray-400 mb-1 font-mono tracking-wider uppercase">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {Icon && <Icon className="h-5 w-5 text-gray-500" />}
        </div>
        <input
          type={inputType} name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          min={min} max={max}
          className={`block w-full pl-10 ${isSecret ? 'pr-10' : 'pr-3'} py-3 bg-[#111] border border-white/10 rounded-lg focus:ring-[#FDB912] focus:border-[#FDB912] sm:text-sm transition-colors text-white font-mono disabled:opacity-50`}
          required
        />
        {isSecret && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};