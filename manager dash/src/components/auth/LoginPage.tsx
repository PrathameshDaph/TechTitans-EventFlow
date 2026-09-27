import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, KeyRound, User, ArrowRight, AlertCircle, Sparkles, Radio, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter your user ID and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(username.trim(), password.trim());
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Invalid user ID or password.');
    }
  };

  const handleQuickSelect = (id: string, pass: string) => {
    setUsername(id);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#2B211B] flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans selection:bg-[#B66A4C] selection:text-white">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2B211B] text-[#FAF8F5] flex items-center justify-center font-black text-xl shadow-md">
            EF
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-[#2B211B] block">EVENTFLOW</span>
            <span className="text-[10px] font-mono tracking-widest text-[#B66A4C] uppercase font-bold block">
              Mega-Event Digital Twin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#766C63] bg-white px-3.5 py-1.5 rounded-full border border-[#E3DDD2] shadow-xs">
          <Radio className="w-3.5 h-3.5 text-[#2E7D32] animate-pulse" />
          <span>CENTRAL TELEMETRY GATEWAY</span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white/90 backdrop-blur-xl border border-[#E3DDD2] rounded-3xl p-6 sm:p-9 shadow-soft space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] text-[#B66A4C] mb-2">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2B211B] tracking-tight">
              Event Identity Login
            </h1>
            <p className="text-xs sm:text-sm text-[#766C63]">
              Authenticate against the stadium digital twin master dataset to access your role-based interface.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2B211B] block uppercase tracking-wider font-mono">
                User ID / Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#806C5D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. AAA001, V001, user_0001, manager"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] text-sm text-[#2B211B] placeholder-[#A89F91] focus:outline-none focus:border-[#B66A4C] focus:ring-2 focus:ring-[#B66A4C]/10 transition-all font-mono"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2B211B] block uppercase tracking-wider font-mono">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#806C5D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] text-sm text-[#2B211B] placeholder-[#A89F91] focus:outline-none focus:border-[#B66A4C] focus:ring-2 focus:ring-[#B66A4C]/10 transition-all font-mono tracking-widest"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#2B211B] hover:bg-[#1A1410] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>AUTHENTICATE SESSION</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Helper from Database */}
          <div className="pt-4 border-t border-[#E3DDD2] space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#806C5D] font-bold uppercase">
              <span>Database Credentials</span>
              <span className="text-[#B66A4C]">Default Pass: 1234</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickSelect('manager', '1234')}
                className="p-2.5 rounded-xl border border-[#E3DDD2] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-left transition-all cursor-pointer"
              >
                <div className="font-bold text-[#2B211B] flex items-center gap-1.5">
                  <span>👔</span> Manager
                </div>
                <div className="text-[10px] font-mono text-[#766C63] mt-0.5">ID: manager</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('AAA001', '1234')}
                className="p-2.5 rounded-xl border border-[#E3DDD2] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-left transition-all cursor-pointer"
              >
                <div className="font-bold text-[#2B211B] flex items-center gap-1.5">
                  <span>👮</span> Crew Member
                </div>
                <div className="text-[10px] font-mono text-[#766C63] mt-0.5">ID: AAA001</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('V001', '1234')}
                className="p-2.5 rounded-xl border border-[#E3DDD2] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-left transition-all cursor-pointer"
              >
                <div className="font-bold text-[#2B211B] flex items-center gap-1.5">
                  <span>🙋</span> Volunteer
                </div>
                <div className="text-[10px] font-mono text-[#766C63] mt-0.5">ID: V001</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('user_0001', '1234')}
                className="p-2.5 rounded-xl border border-[#E3DDD2] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-left transition-all cursor-pointer"
              >
                <div className="font-bold text-[#2B211B] flex items-center gap-1.5">
                  <span>🎟️</span> Event User
                </div>
                <div className="text-[10px] font-mono text-[#766C63] mt-0.5">ID: user_0001</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-[11px] font-mono text-[#806C5D]">
        <span>Wankhede Stadium Mega-Event Digital Twin • Connected to EventFlow Realtime Server</span>
      </div>
    </div>
  );
};
