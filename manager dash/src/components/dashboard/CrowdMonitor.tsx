import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { Users, ArrowUpRight, ArrowDownRight, Activity, Gauge } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export const CrowdMonitor: React.FC = () => {
  const {
    totalAttendees,
    maxVenueCapacity,
    entryRate,
    exitRate,
    netFlow,
    crowdDensityPercent,
    crowdHistory,
  } = useOperational();

  const formattedAttendees = totalAttendees.toLocaleString();

  return (
    <div className="bg-white rounded-2xl md:rounded-[22px] p-5 sm:p-6 border border-border shadow-soft flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-beige flex items-center justify-center">
            <Users className="w-5 h-5 text-beige" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-light-brown font-bold">
              REAL-TIME INGRESS SENSOR MESH
            </span>
            <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight">
              LIVE CROWD MONITOR
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-beige text-primary">
            <Activity className="w-3.5 h-3.5 text-secondary animate-pulse" />
            Active Scan: 99.8% Sync
          </span>
        </div>
      </div>

      {/* Hero Numbers */}
      <div className="py-5 sm:py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <span className="text-xs sm:text-sm font-bold tracking-wider text-secondary-text uppercase font-mono">
            PEOPLE INSIDE VENUE
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-primary">
              {formattedAttendees}
            </span>
            <span className="text-xs sm:text-sm font-mono text-secondary-text font-semibold">
              / {maxVenueCapacity.toLocaleString()} Max
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-end">
          <div className="px-3 py-1.5 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4 text-[#2E7D32]" />
            <span className="text-xs font-mono font-bold text-[#2E7D32]">
              +8.4% vs last hour
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[#FCFAF7] border border-border">
        {/* Entry Rate */}
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase text-secondary-text font-semibold">
            ENTRY RATE
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <ArrowUpRight className="w-4 h-4 text-[#2E7D32]" />
            <span className="text-base sm:text-lg font-mono font-black text-primary">
              {entryRate.toLocaleString()}
            </span>
            <span className="text-[11px] text-secondary-text font-mono">/ min</span>
          </div>
        </div>

        {/* Exit Rate */}
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase text-secondary-text font-semibold">
            EXIT RATE
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <ArrowDownRight className="w-4 h-4 text-[#D97706]" />
            <span className="text-base sm:text-lg font-mono font-black text-primary">
              {exitRate.toLocaleString()}
            </span>
            <span className="text-[11px] text-secondary-text font-mono">/ min</span>
          </div>
        </div>

        {/* Net Flow */}
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase text-secondary-text font-semibold">
            NET FLOW
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-base sm:text-lg font-mono font-black text-[#2E7D32]">
              +{netFlow.toLocaleString()}
            </span>
            <span className="text-[11px] text-secondary-text font-mono">/ min</span>
          </div>
        </div>

        {/* Crowd Density */}
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase text-secondary-text font-semibold">
            CROWD DENSITY
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Gauge className="w-4 h-4 text-light-brown" />
            <span className="text-base sm:text-lg font-mono font-black text-primary">
              {crowdDensityPercent}%
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-beige rounded text-secondary font-mono">
              MODERATE
            </span>
          </div>
        </div>
      </div>

      {/* Live Line / Area Chart */}
      <div className="mt-5 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-secondary-text font-mono uppercase">
            Hourly Crowd Velocity & Ingress Progression
          </span>
          <span className="text-[11px] font-mono text-light-brown font-semibold">
            10:00 - 13:00 Window
          </span>
        </div>

        <div className="h-44 sm:h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={crowdHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="actualFlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8A6040" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8A6040" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2B1A12" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2B1A12" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#766C63"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E5DED3' }}
              />
              <YAxis
                stroke="#766C63"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E5DED3' }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                domain={[50000, 100000]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E5DED3',
                  boxShadow: '0 8px 24px rgba(43, 26, 18, 0.1)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
                formatter={(value: any, name: any) => [
                  `${Number(value).toLocaleString()} attendees`,
                  name === 'actual' ? 'Live Telemetry' : 'AI Projected',
                ]}
              />
              <ReferenceLine y={90000} label={{ value: 'Capacity Warning (90k)', fill: '#DC2626', fontSize: 10 }} stroke="#DC2626" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#5A3826"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#actualFlowGrad)"
                name="actual"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#2B1A12"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#predictedGrad)"
                name="predicted"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
