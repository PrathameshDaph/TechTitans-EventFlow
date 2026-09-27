import React from 'react';
import { useOperational } from '../context/OperationalContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  DoorOpen,
  Car,
  Shield,
  Clock,
  ArrowUpRight,
  Activity,
  Calendar,
  Sparkles,
  MapPin,
  Flame,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const {
    eventMeta,
    totalAttendees,
    maxVenueCapacity,
    gates,
    zones,
    externalZones,
    parking,
    crew,
    incidents,
    crowdHistory,
  } = useOperational();

  // Exactly 8 Gates Throughput Chart Data (Gate A1 - Gate D2)
  const gateData = gates.map(g => ({
    name: g.name,
    code: g.code,
    block: g.blockName,
    flow: g.currentFlow,
    queue: g.queueCount,
    status: g.status,
  }));

  // Exactly 8 Internal Stadium Sections (A1 - D2)
  const zoneDensityData = zones.map(z => ({
    name: z.code,
    fullName: z.name,
    block: z.blockName,
    density: z.densityPercent,
    count: z.currentCount,
  }));

  const mostCongestedGate = [...gates].sort((a, b) => b.densityPercent - a.densityPercent)[0] || gates[0];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-[#2B211B]">
      {/* Header — Translucent Liquid Glass Surface */}
      <div className="liquid-glass-card rounded-3xl p-5 sm:p-7 shadow-glass">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#B66A4C] font-black">
                DIGITAL TWIN SPATIAL INTEL
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F5E9]/90 text-[#2E7D32] border border-[#C8E6C9]">
                ● REAL-TIME TELEMETRY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B211B] tracking-tight mt-1">
              OPERATIONAL INTEL & ANALYTICS
            </h1>
            <p className="text-xs sm:text-sm text-[#806C5D] mt-1 max-w-2xl">
              Deep telemetry across the 8 internal stadium sections, 8 perimeter turnstile gates, and 4 external mobility corridors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E3DDD2] text-xs font-mono font-bold flex items-center gap-2 shadow-xs">
              <Calendar className="w-4 h-4 text-[#B66A4C]" />
              <span>Matchday Live Session (19:30 - 23:00)</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Strip — Translucent Glass Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            VENUE OCCUPANCY
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2B211B] mt-1">
            {totalAttendees.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">
            {Math.round((totalAttendees / maxVenueCapacity) * 100)}% of 35,000 capacity
          </span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            PEAK GATE VELOCITY
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#DC2626] mt-1 flex items-center">
            <ArrowUpRight className="w-6 h-6 mr-1" />
            {mostCongestedGate.currentFlow}
            <span className="text-xs font-normal text-[#806C5D]">/m</span>
          </div>
          <span className="text-xs font-mono text-[#806C5D]">{mostCongestedGate.name} ({mostCongestedGate.blockName})</span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            AVG INCIDENT RESPONSE
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2E7D32] mt-1">
            2.1 min
          </div>
          <span className="text-xs font-mono text-[#2E7D32]">Within 4.0 min target SLA</span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            CREW DEPLOYMENT
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2B211B] mt-1">
            83.3%
          </div>
          <span className="text-xs font-mono text-[#806C5D]">15 of 18 units on active duty</span>
        </div>
      </div>

      {/* 4 External Zones Status Row */}
      <div className="liquid-glass-card rounded-3xl p-5 border border-white/60 shadow-glass space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E3DDD2]/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#B66A4C]" />
            <h3 className="text-xs font-mono font-black text-[#2B211B] uppercase tracking-wider">
              4 EXTERNAL PERIMETER ZONES TELEMETRY
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#806C5D]">Multi-modal feeds</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {externalZones.map(ext => {
            const isHigh = ext.crowdLevel === 'HIGH';
            const isMed = ext.crowdLevel === 'MEDIUM';
            const dotColor = isHigh ? 'bg-[#DC2626]' : isMed ? 'bg-[#D97706]' : 'bg-[#2E7D32]';
            const badgeBg = isHigh ? 'bg-[#FEE2E2] text-[#DC2626]' : isMed ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#E8F5E9] text-[#2E7D32]';

            return (
              <div
                key={ext.id}
                className="p-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 shadow-xs flex flex-col justify-between space-y-2 hover:bg-white/80 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-black text-[#2B211B] block">
                      {ext.name}
                    </span>
                    <span className="text-[9px] font-mono text-[#806C5D] block">
                      {ext.subtitle}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${badgeBg}`}>
                    {ext.crowdLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E3DDD2]/50 text-[10px] font-mono">
                  <span className="text-[#806C5D]">{(ext.currentCount || 0).toLocaleString()} fans</span>
                  <span className="font-bold text-[#B66A4C]">{ext.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 1: Attendance Growth & Capacity Curve */}
      <div className="liquid-glass-card rounded-3xl p-5 sm:p-6 shadow-glass space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E3DDD2]/70">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#B66A4C] uppercase">
              VENUE TIME-SERIES TRAJECTORY
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#2B211B]">
              CROWD INTAKE CURVE vs 35,000 CAPACITY CEILING
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#B66A4C]" />
              <span>Actual Ingress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#DC2626]" />
              <span>Max Capacity (35,000)</span>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={crowdHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B66A4C" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#B66A4C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#806C5D" fontSize={11} tickLine={false} />
              <YAxis stroke="#806C5D" fontSize={11} domain={[0, 40000]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(227, 221, 210, 0.8)',
                  boxShadow: '0 8px 24px rgba(43,33,27,0.08)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <ReferenceLine y={35000} stroke="#DC2626" strokeDasharray="4 4" label={{ value: 'MAX 35K', fill: '#DC2626', fontSize: 10 }} />
              <Area type="monotone" dataKey="actual" stroke="#B66A4C" strokeWidth={3} fillOpacity={1} fill="url(#attendanceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: 8 Gates Ingress Comparison & 8 Sections Density Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 8 Gates Velocity BarChart */}
        <div className="liquid-glass-card rounded-3xl p-5 sm:p-6 shadow-glass space-y-4">
          <div className="pb-3 border-b border-[#E3DDD2]/70">
            <span className="text-[10px] font-mono font-bold text-[#B66A4C] uppercase">
              8 PERIMETER GATES INGRESS VELOCITY
            </span>
            <h3 className="text-base font-black text-[#2B211B]">
              GATE VELOCITY (PEOPLE / MIN)
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#806C5D" fontSize={10} tickLine={false} interval={0} angle={-25} textAnchor="end" height={45} />
                <YAxis stroke="#806C5D" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(14px)',
                    borderRadius: '14px',
                    border: '1px solid #E3DDD2',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="flow" radius={[8, 8, 0, 0]}>
                  {gateData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.status === 'CONGESTED' ? '#DC2626' : entry.flow >= 1000 ? '#D97706' : '#B66A4C'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-xs font-mono text-[#806C5D] block text-center">
            *Gate C1 is operating at 1,480/min bottleneck load; redirection directive active.
          </span>
        </div>

        {/* 8 Stadium Sections Crowd Density Breakdown */}
        <div className="liquid-glass-card rounded-3xl p-5 sm:p-6 shadow-glass space-y-4">
          <div className="pb-3 border-b border-[#E3DDD2]/70">
            <span className="text-[10px] font-mono font-bold text-[#B66A4C] uppercase">
              8 INTERNAL STADIUM SECTIONS DENSITY
            </span>
            <h3 className="text-base font-black text-[#2B211B]">
              SECTION OCCUPANCY PERCENTAGES (A1 - D2)
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneDensityData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#806C5D" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#806C5D" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(14px)',
                    borderRadius: '14px',
                    border: '1px solid #E3DDD2',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine x={70} stroke="#B66A4C" strokeDasharray="3 3" />
                <ReferenceLine x={85} stroke="#D97706" strokeDasharray="3 3" />
                <Bar dataKey="density" radius={[0, 8, 8, 0]}>
                  {zoneDensityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.density >= 85 ? '#DC2626' : entry.density >= 70 ? '#D97706' : '#2E7D32'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#806C5D]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2E7D32]" /> &lt;70% Normal</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D97706]" /> 70-84% Elevated</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#DC2626]" /> 85%+ High Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
};
