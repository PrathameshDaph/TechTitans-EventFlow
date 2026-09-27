import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { Clock, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export const ForecastChart: React.FC = () => {
  const { occupancyPercent, timeToOvercapacityMinutes, overallRisk } = useOperational();

  const forecastPoints = [
    { label: 'NOW', percent: occupancyPercent, count: 78420, isActual: true },
    { label: '+30 MIN', percent: 84, count: 84000, isActual: false },
    { label: '+60 MIN', percent: 91, count: 91000, isActual: false },
    { label: '+120 MIN', percent: 96, count: 96000, isActual: false },
  ];

  const chartData = [
    { time: 'T-60m', actual: 64, predicted: null },
    { time: 'T-30m', actual: 71, predicted: null },
    { time: 'NOW', actual: occupancyPercent, predicted: occupancyPercent },
    { time: '+30m', actual: null, predicted: 84 },
    { time: '+60m', actual: null, predicted: 91 },
    { time: '+90m', actual: null, predicted: 94 },
    { time: '+120m', actual: null, predicted: 96 },
  ];

  return (
    <div className="bg-white rounded-2xl md:rounded-[22px] p-5 sm:p-6 border border-border shadow-soft flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-beige text-primary flex items-center justify-center">
            <Clock className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-light-brown font-bold">
              PREDICTIVE CAPACITY AI
            </span>
            <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight">
              CROWD FORECAST
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={overallRisk} showPulse={overallRisk === 'HIGH' || overallRisk === 'CRITICAL'} />
        </div>
      </div>

      {/* 4 Time Stages Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-4">
        {forecastPoints.map((item) => (
          <div
            key={item.label}
            className={`p-3 rounded-xl border text-center transition-all ${
              item.isActual
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-[#FCFAF7] border-border hover:border-light-brown'
            }`}
          >
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
              item.isActual ? 'text-beige' : 'text-secondary-text'
            }`}>
              {item.label}
            </span>
            <div className={`text-xl sm:text-2xl font-black font-mono mt-1 ${
              item.isActual ? 'text-white' : item.percent >= 90 ? 'text-[#DC2626]' : 'text-primary'
            }`}>
              {item.percent}%
            </div>
            <span className={`text-[10px] font-mono ${
              item.isActual ? 'text-beige/80' : 'text-secondary-text'
            }`}>
              ~{item.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Time to Overcapacity Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#FFF5F5] to-[#FCFAF7] border border-[#FECACA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#DC2626] text-white flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-secondary-text font-bold">
              TIME TO OVERCAPACITY
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#DC2626] tracking-tight">
              {timeToOvercapacityMinutes} MINUTES
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-secondary-text">RISK:</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-extrabold bg-[#DC2626] text-white shadow-sm">
            HIGH
          </span>
        </div>
      </div>

      {/* Forecast Line Chart */}
      <div className="mt-4 pt-3">
        <div className="flex items-center justify-between mb-2 text-xs font-mono text-secondary-text">
          <span className="font-semibold uppercase">Capacity Trajectory Forecast</span>
          <span className="flex items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-primary inline-block" /> Actual
            </span>
            <span className="flex items-center gap-1 text-secondary-text">
              <span className="w-3 h-0.5 bg-secondary-text border-t border-dashed inline-block" /> Predicted
            </span>
          </span>
        </div>

        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#766C63" fontSize={11} tickLine={false} />
              <YAxis stroke="#766C63" fontSize={11} domain={[50, 100]} tickFormatter={(v) => `${v}%`} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E5DED3',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
                formatter={(value: any, name: any) => [
                  `${value}% occupancy`,
                  name === 'actual' ? 'Live Telemetry' : 'Predicted Trajectory',
                ]}
              />
              <ReferenceLine y={95} stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'Critical Threshold (95%)', fill: '#DC2626', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2B1A12"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2B1A12' }}
                name="actual"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#8A6040"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#8A6040' }}
                name="predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
