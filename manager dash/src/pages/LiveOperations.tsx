import React from 'react';
import { useOperational } from '../context/OperationalContext';
import { OperationalMap } from '../components/map/OperationalMap';
import { GateCard } from '../components/dashboard/GateCard';
import { ZoneCard } from '../components/dashboard/ZoneCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  DoorOpen,
  MapPin,
  Car,
  Bus,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
} from 'lucide-react';

export const LiveOperations: React.FC = () => {
  const {
    totalAttendees,
    occupancyPercent,
    entryRate,
    exitRate,
    netFlow,
    gates,
    zones,
    parking,
    transit,
    setActiveRoute,
  } = useOperational();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl md:rounded-[22px] p-5 sm:p-7 border border-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#2E7D32] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-light-brown font-bold">
              REAL-TIME FIELD TELEMETRY STREAM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight mt-1">
            LIVE OPERATIONS
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text mt-1 max-w-2xl">
            Continuous synchronized multi-sensor monitoring across all turnstiles, sector perimeters, parking nodes, and transit corridors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-beige border border-border flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
            <span className="text-xs font-mono font-bold text-primary">
              All 142 Telemetry Sensors Active
            </span>
          </div>
        </div>
      </div>

      {/* 1. Interactive Stylized Live Event Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold font-mono text-primary uppercase">
            VENUE SPATIAL HEAT & BOTTLENECK MAP
          </h2>
          <span className="text-xs font-mono text-secondary-text">
            Pulse indicates active crowd density stress
          </span>
        </div>
        <OperationalMap />
      </div>

      {/* 2. Live Crowd Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-border shadow-soft">
          <span className="text-[11px] font-mono uppercase text-secondary-text font-bold block">
            LIVE ATTENDEES
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-primary mt-1">
            {totalAttendees.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-secondary-text">
            {occupancyPercent}% venue capacity
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-soft">
          <span className="text-[11px] font-mono uppercase text-secondary-text font-bold block">
            LIVE ENTRY INGRESS
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2E7D32] mt-1 flex items-center">
            <ArrowUpRight className="w-6 h-6 mr-1" />
            {entryRate.toLocaleString()}
            <span className="text-xs font-normal text-secondary-text">/m</span>
          </div>
          <span className="text-xs font-mono text-secondary-text">Across 5 perimeter gates</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-soft">
          <span className="text-[11px] font-mono uppercase text-secondary-text font-bold block">
            LIVE EXIT EGRESS
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#D97706] mt-1 flex items-center">
            <ArrowDownRight className="w-6 h-6 mr-1" />
            {exitRate.toLocaleString()}
            <span className="text-xs font-normal text-secondary-text">/m</span>
          </div>
          <span className="text-xs font-mono text-secondary-text">Smooth egress flow</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-soft">
          <span className="text-[11px] font-mono uppercase text-secondary-text font-bold block">
            NET VELOCITY
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-primary mt-1">
            +{netFlow.toLocaleString()}
            <span className="text-xs font-normal text-secondary-text">/m</span>
          </div>
          <span className="text-xs font-mono text-[#2E7D32] font-semibold">Positive filling rate</span>
        </div>
      </div>

      {/* 3. Live Gates Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-secondary" />
            <h3 className="text-lg sm:text-xl font-bold font-mono text-primary uppercase">
              LIVE GATES & TURNSTILE QUEUES
            </h3>
          </div>
          <span className="text-xs font-mono text-secondary-text">
            5 / 5 Gates Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {gates.map((gate) => (
            <GateCard key={gate.id} gate={gate} />
          ))}
        </div>
      </div>

      {/* 4. Live Zones Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary" />
            <h3 className="text-lg sm:text-xl font-bold font-mono text-primary uppercase">
              LIVE ZONE CAPACITIES & DENSITY (A–E)
            </h3>
          </div>
          <span className="text-xs font-mono text-secondary-text">
            Continuous optical & RFID sensors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </div>

      {/* 5. Live Parking & Transport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Parking */}
        <div className="lg:col-span-6 bg-white rounded-2xl md:rounded-[22px] p-5 sm:p-6 border border-border shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-secondary" />
              <h3 className="text-base sm:text-lg font-bold font-mono text-primary uppercase">
                LIVE PARKING STATUS
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
              P1 Saturated
            </span>
          </div>

          <div className="space-y-3.5">
            {parking.map((p) => (
              <div key={p.id} className="p-3.5 rounded-xl bg-[#FCFAF7] border border-border">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-primary">{p.name}</span>
                    <span className="text-xs font-mono text-secondary-text">({p.current} / {p.capacity})</span>
                  </div>
                  <StatusBadge status={p.status} size="sm" showPulse={p.status === 'CRITICAL'} />
                </div>
                <ProgressBar value={p.occupancyPercent} height="sm" variant="auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Live Transport */}
        <div className="lg:col-span-6 bg-white rounded-2xl md:rounded-[22px] p-5 sm:p-6 border border-border shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-secondary" />
              <h3 className="text-base sm:text-lg font-bold font-mono text-primary uppercase">
                LIVE MULTI-MODAL TRANSPORT
              </h3>
            </div>
            <span className="text-xs font-mono text-secondary-text">
              Updated 20s ago
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#FCFAF7] border border-border">
              <span className="text-[10px] font-mono text-secondary-text uppercase font-bold">Active Shuttles</span>
              <div className="text-xl font-black font-mono text-primary mt-1">
                {transit.activeShuttles} <span className="text-xs font-normal text-secondary-text">/ {transit.totalShuttles} Fleet</span>
              </div>
              <span className="text-[10px] text-[#2E7D32] font-mono font-bold">7 Reserve available</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FCFAF7] border border-border">
              <span className="text-[10px] font-mono text-secondary-text uppercase font-bold">Metro Wait Time</span>
              <div className="text-xl font-black font-mono text-primary mt-1">
                {transit.metroWaitMinutes} min
              </div>
              <span className="text-[10px] text-[#D97706] font-mono font-bold">Kurla Concourse</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFFDF5] border border-[#FDE68A] flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-bold text-[#975A16] block uppercase font-mono">Dynamic Recommendation:</span>
              <span className="text-primary font-medium">{transit.recommendedAction}</span>
            </div>
            <button
              onClick={() => setActiveRoute('/manager/what-if')}
              className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold transition-colors whitespace-nowrap shadow-sm"
            >
              Simulate Fleet Surge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
