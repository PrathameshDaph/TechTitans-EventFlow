import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, ArrowRight, ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';

interface LandingLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LandingLoginModal: React.FC<LandingLoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter your user ID and password.');
      return;
    }

    setLoading(true);
    try {
      const successLogin = await login(username.trim(), password.trim());
      if (successLogin) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setError('Invalid user ID or password.');
      }
    } catch {
      setError('Invalid user ID or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u: string, p: string = '1234') => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#10070c] border border-[#d97d97]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#5c2a35]/60 text-white font-sans">
        
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
              Operational Authentication Portal
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#3b1923]/60 border border-[#e294aa]/60 text-[#f7d6de] flex items-center justify-center mx-auto shadow-lg shadow-[#5c2a35]/50 animate-bounce">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit']">Identity Authenticated</h4>
            <p className="text-xs text-[#c2b2b9]">Opening role interface matrix...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#FEF2F2]/10 border border-[#DC2626]/50 text-[#FCA5A5] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#DC2626]" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-[#e2d5da] uppercase mb-1.5">
                User ID / Username
              </label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. manager, AAA001, V001, user_0001"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#190c14] border border-[#d97d97]/25 focus:border-[#e294aa] text-sm text-white placeholder-stone-500 outline-none font-sans transition-colors"
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#e2d5da] uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#190c14] border border-[#d97d97]/25 focus:border-[#e294aa] text-sm text-white placeholder-stone-500 outline-none font-sans transition-colors"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#d97d97] via-[#a64d67] to-[#5c2a35] hover:from-[#e294aa] hover:to-[#6e3340] text-white font-bold text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#5c2a35]/60 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Terminal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick-Fill Demo Pills */}
        <div className="mt-5 pt-4 border-t border-[#d97d97]/15">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#d97d97]/80 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick Demo Identities:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => handleQuickFill('manager', '1234')}
              className="py-1.5 px-2 rounded-lg bg-[#190c14] hover:bg-[#25101c] border border-[#d97d97]/20 text-[#f7d6de] text-left transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Manager</span>
              <span className="text-[#d97d97]">manager</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('AAA001', '1234')}
              className="py-1.5 px-2 rounded-lg bg-[#190c14] hover:bg-[#25101c] border border-[#d97d97]/20 text-[#f7d6de] text-left transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Crew</span>
              <span className="text-[#d97d97]">AAA001</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('V001', '1234')}
              className="py-1.5 px-2 rounded-lg bg-[#190c14] hover:bg-[#25101c] border border-[#d97d97]/20 text-[#f7d6de] text-left transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Volunteer</span>
              <span className="text-[#d97d97]">V001</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('user_0001', '1234')}
              className="py-1.5 px-2 rounded-lg bg-[#190c14] hover:bg-[#25101c] border border-[#d97d97]/20 text-[#f7d6de] text-left transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Attendee</span>
              <span className="text-[#d97d97]">user_0001</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#d97d97]/10 text-center text-[10px] font-mono text-[#d97d97]/60">
          Made By Tech Titans
        </div>

      </div>
    </div>
  );
};
