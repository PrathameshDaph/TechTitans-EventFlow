import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Lock, Mail } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#10070c] border border-[#d97d97]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#5c2a35]/60">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#1c0d16] text-[#c2b2b9] hover:text-white border border-[#d97d97]/20 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header with EF Ribbon Logo */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-xl overflow-hidden shadow-lg shadow-[#5c2a35]/40 border border-[#d97d97]/30 bg-[#1c0d16] p-1.5">
            <img 
              src="/assets/event-flow-logo.png" 
              alt="Event Flow Logo"
              className="w-full h-full object-contain filter contrast-110"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">
              EVENT <span className="text-[#e294aa] font-light">FLOW</span>
            </h3>
            <p className="text-[11px] font-mono text-[#d97d97]/80 uppercase">
              Operations Command Portal
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#3b1923]/60 border border-[#e294aa]/60 text-[#f7d6de] flex items-center justify-center mx-auto shadow-lg shadow-[#5c2a35]/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit']">Authentication Verified</h4>
            <p className="text-xs text-[#c2b2b9]">Loading Event Flow operations command matrix...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#e2d5da] uppercase mb-1.5">
                Operations Email
              </label>
              <div className="relative">
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@eventflow.orchestra"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#190c14] border border-[#d97d97]/25 focus:border-[#e294aa] text-sm text-white placeholder-stone-500 outline-none font-sans transition-colors"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#e2d5da] uppercase mb-1.5">
                Security Token / Key
              </label>
              <div className="relative">
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#190c14] border border-[#d97d97]/25 focus:border-[#e294aa] text-sm text-white placeholder-stone-500 outline-none font-sans transition-colors"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#d97d97] via-[#a64d67] to-[#5c2a35] hover:from-[#e294aa] hover:to-[#6e3340] text-white font-bold text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#5c2a35]/60 transition-all cursor-pointer"
            >
              <span>Authenticate Operations Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#d97d97]/15 text-center text-[11px] font-mono text-[#d97d97]/75">
          Made By Tech Titans
        </div>

      </div>
    </div>
  );
}
