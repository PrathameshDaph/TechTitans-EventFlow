import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { Database, Server, Radio, Sparkles, Map, RefreshCw, X, ShieldCheck } from 'lucide-react';

export const SystemHealthPopover: React.FC = () => {
  const { systemHealth, isSystemHealthOpen, setIsSystemHealthOpen, toggleApiMode } = useOperational();

  if (!isSystemHealthOpen) return null;

  return (
    <div className="absolute top-16 right-4 sm:right-20 z-50 w-72 sm:w-80 bg-white/95 backdrop-blur-2xl border border-[#E3DDD2] rounded-3xl shadow-elevated p-4 space-y-3.5 text-[#2B211B] animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#E3DDD2]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
          <span className="text-xs font-mono font-black uppercase text-[#2B211B]">
            SYSTEM TELEMETRY HEALTH
          </span>
        </div>
        <button
          onClick={() => setIsSystemHealthOpen(false)}
          className="text-[#806C5D] hover:text-[#2B211B] p-0.5"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-xs font-mono">
        {/* Database */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2]">
          <div className="flex items-center gap-2 text-[#5A4638]">
            <Database className="w-3.5 h-3.5 text-[#B66A4C]" />
            <span>Database</span>
          </div>
          <span className="inline-flex items-center gap-1 font-bold text-[#2E7D32]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
            {systemHealth.database}
          </span>
        </div>

        {/* Backend API */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2]">
          <div className="flex items-center gap-2 text-[#5A4638]">
            <Server className="w-3.5 h-3.5 text-[#B66A4C]" />
            <span>Backend API</span>
          </div>
          <span className="inline-flex items-center gap-1 font-bold text-[#2E7D32]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
            {systemHealth.backend}
          </span>
        </div>

        {/* Realtime Stream */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2]">
          <div className="flex items-center gap-2 text-[#5A4638]">
            <Radio className="w-3.5 h-3.5 text-[#B66A4C]" />
            <span>Realtime Telemetry</span>
          </div>
          <span className="inline-flex items-center gap-1 font-bold text-[#2E7D32]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
            {systemHealth.realtime}
          </span>
        </div>

        {/* AI Engine */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2]">
          <div className="flex items-center gap-2 text-[#5A4638]">
            <Sparkles className="w-3.5 h-3.5 text-[#B66A4C]" />
            <span>EventFlow AI</span>
          </div>
          <span className="inline-flex items-center gap-1 font-bold text-[#2E7D32]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
            {systemHealth.ai}
          </span>
        </div>

        {/* Map Engine */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2]">
          <div className="flex items-center gap-2 text-[#5A4638]">
            <Map className="w-3.5 h-3.5 text-[#B66A4C]" />
            <span>Digital Twin Map</span>
          </div>
          <span className="inline-flex items-center gap-1 font-bold text-[#2E7D32]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
            {systemHealth.map}
          </span>
        </div>
      </div>

      {/* Database Mode Switcher */}
      <div className="pt-2 border-t border-[#E3DDD2] space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#806C5D]">API DATA MODE:</span>
          <span className="font-extrabold text-[#2B211B]">{systemHealth.mode}</span>
        </div>
        <button
          onClick={toggleApiMode}
          className="w-full py-2 px-3 rounded-xl bg-[#F6F3ED] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 text-[#B66A4C]" />
          Toggle Mode ({systemHealth.mode === 'MOCK_MODE' ? 'Switch to Live API' : 'Switch to Mock Mode'})
        </button>
      </div>
    </div>
  );
};
