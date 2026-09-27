import React, { useState } from 'react';
import { useTwin } from '../../context/TwinContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  MessageSquareShare,
  Radio,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  MapPin,
  Clock,
} from 'lucide-react';
import { SocialSignal } from '../../types';

export const SocialSignals: React.FC = () => {
  const { socialSignals, playOperationalChime } = useTwin();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSignals = socialSignals.filter((sig) => {
    const matchesType = filterType === 'ALL' || sig.signalType === filterType;
    const matchesSearch =
      searchQuery === '' ||
      sig.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sig.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sig.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#2B1710] font-display">
              REAL-WORLD SOCIAL SIGNALS & CROWD TELEMETRY
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFE8DB] text-[#2B1710] font-bold border border-[#E4DED3]">
              LIVE INGESTION
            </span>
          </div>
          <p className="text-xs text-[#756D66] font-mono">
            Public social signals, traffic sensors, crowd beacon logs, and AI predictive indicators
          </p>
        </div>

        {/* Demo Label Note (Requirement 16) */}
        <div className="flex items-center gap-2 text-xs font-mono bg-[#FFFEFB] px-3 py-1.5 rounded-lg border border-[#E4DED3]">
          <span className="w-2 h-2 rounded-full bg-[#2F7D45] animate-ping" />
          <span className="text-[#756D66]">DATA ADAPTER:</span>
          <strong className="text-[#2A211D]">DEMO PUBLIC SIGNALS STREAM</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-[#E4DED3] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          <span className="text-xs font-mono font-bold text-[#756D66] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            FILTER:
          </span>
          {['ALL', 'OBSERVED', 'PREDICTED', 'SIMULATED'].map((type) => (
            <button
              key={type}
              onClick={() => {
                playOperationalChime('click');
                setFilterType(type);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                filterType === type
                  ? 'bg-[#2B1710] text-[#FFFEFB] shadow-subtle'
                  : 'bg-[#EFE8DB]/70 text-[#756D66] hover:bg-[#EFE8DB]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#756D66] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search signals, gates, roads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F4ED] text-xs font-mono text-[#2A211D] pl-9 pr-3 py-2 rounded-lg border border-[#E4DED3] outline-none placeholder:text-[#9C948B]"
          />
        </div>
      </div>

      {/* Signals Feed Stream List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSignals.map((signal) => {
          let typeColor = 'bg-[#2F7D45]/10 text-[#2F7D45] border-[#2F7D45]/30';
          if (signal.signalType === 'PREDICTED') {
            typeColor = 'bg-[#D9822B]/10 text-[#D9822B] border-[#D9822B]/30';
          } else if (signal.signalType === 'SIMULATED') {
            typeColor = 'bg-[#6B46C1]/10 text-[#6B46C1] border-[#6B46C1]/30';
          }

          return (
            <div
              key={signal.id}
              className="glass-card rounded-2xl p-5 border border-[#E4DED3] hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header line: Source, Type Badge, Demo label */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#E4DED3]/60">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#2B1710]" />
                    <span className="text-xs font-bold text-[#2A211D] font-mono">
                      {signal.source}
                    </span>
                    <span className="text-[10px] text-[#756D66] font-mono">
                      ({signal.author})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${typeColor}`}
                    >
                      {signal.signalType}
                    </span>
                    {signal.isDemo && (
                      <span className="text-[9px] font-mono bg-[#EFE8DB] text-[#756D66] px-1.5 py-0.5 rounded font-medium">
                        DEMO SIGNAL
                      </span>
                    )}
                  </div>
                </div>

                {/* Signal Text */}
                <p className="text-xs text-[#2A211D] leading-relaxed mb-3 font-sans">
                  "{signal.text}"
                </p>
              </div>

              {/* Footer Meta & Potential Impact */}
              <div className="space-y-2 pt-2 border-t border-[#E4DED3]/60 text-xs font-mono">
                <div className="bg-[#F7F4ED] p-2.5 rounded-lg border border-[#E4DED3] flex items-center justify-between text-[11px]">
                  <span className="text-[#756D66]">POTENTIAL IMPACT:</span>
                  <strong className="text-[#D9822B]">{signal.potentialImpact}</strong>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#756D66]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D92D3A]" />
                    {signal.location}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {signal.timestamp}
                    </span>
                    <span className="font-bold text-[#2A211D]">
                      Conf: {signal.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
