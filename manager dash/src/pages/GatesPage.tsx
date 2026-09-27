import React, { useState } from 'react';
import { useOperational } from '../context/OperationalContext';
import { DoorOpen, ShieldAlert, Navigation } from 'lucide-react';
import { GateData } from '../types';

export const GatesPage: React.FC = () => {
  const { gates, setSelectedEntity, applyRecommendation, addToast, triggerGateEmergency, triggerGateStatusChange } = useOperational();
  const [filterBlock, setFilterBlock] = useState<string>('ALL');

  const filteredGates = gates.filter(g => {
    if (filterBlock === 'ALL') return true;
    return g.blockName === filterBlock;
  });

  const totalFlow = gates.reduce((acc, g) => acc + g.currentFlow, 0);
  const totalQueue = gates.reduce((acc, g) => acc + g.queueCount, 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-[#2B211B]">
      {/* Header */}
      <div className="liquid-glass-card rounded-3xl p-5 sm:p-7 shadow-glass space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#B66A4C] font-black">
                8 PERIMETER GATES (A1–D2) • CIRCULAR OVAL FLOW
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                ● REAL-TIME TURNSTILE SYNC
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B211B] tracking-tight mt-1">
              PERIMETER GATES & INGRESS FLOW
            </h1>
            <p className="text-xs sm:text-sm text-[#806C5D] mt-1 max-w-2xl">
              Organized along the stadium perimeter (Gate A1, A2, B1, B2, C1, C2, D1, D2) feeding directly into corresponding internal blocks and sections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                triggerGateEmergency('Gate 4', 'Gate 4 Concourse Emergency Alert', 'Perimeter sensor triggered at Gate 4 concourse. Rapid security unit dispatched.', 'HIGH');
              }}
              className="px-3.5 py-2 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Test 2: Trigger Gate 4 Emergency"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>TEST: GATE 4 EMERGENCY</span>
            </button>

            <button
              onClick={() => {
                triggerGateStatusChange('gate-c1', 'CLOSED', 'Simulated What-If diversion: Gate 3 closed. Diverting arriving fans to Gate 6 and Gate 1.');
              }}
              className="px-3.5 py-2 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Test 4: What-If Close Gate 3"
            >
              <DoorOpen className="w-3.5 h-3.5" />
              <span>WHAT-IF: CLOSE GATE 3</span>
            </button>

            <button
              onClick={() => {
                applyRecommendation('rec-001');
                addToast('success', 'Diversion Triggered', 'Pedestrian turnstiles redirected to Gate A1 & D1');
              }}
              className="px-4 py-2 rounded-2xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-glass cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#B66A4C]" />
              EQUALIZE TURNSTILES
            </button>
          </div>
        </div>

        {/* Filter Block Tabs */}
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#E3DDD2]/60 overflow-x-auto no-scrollbar">
          {['ALL', 'A BLOCK', 'B BLOCK', 'C BLOCK', 'D BLOCK'].map((b) => (
            <button
              key={b}
              onClick={() => setFilterBlock(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                filterBlock === b
                  ? 'bg-[#2B211B] text-[#F6F3ED] shadow-sm'
                  : 'bg-white/60 hover:bg-white text-[#806C5D] border border-white/70'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Gate KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            TOTAL INGRESS VELOCITY
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2B211B] mt-1">
            {totalFlow.toLocaleString()}
            <span className="text-xs font-normal text-[#806C5D]"> /min</span>
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Across 8 active gates</span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            TOTAL TURNSTILE QUEUE
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2B211B] mt-1">
            {totalQueue.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Spectators in buffer</span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#DC2626] font-bold block">
            CONGESTED GATE
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#DC2626] mt-1">
            GATE C1
          </div>
          <span className="text-xs font-mono text-[#DC2626]">Wait: ~18.5 mins</span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#2E7D32] font-bold block">
            RECOMMENDED ENTRY
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2E7D32] mt-1">
            GATE A1 / D1
          </div>
          <span className="text-xs font-mono text-[#2E7D32]">Wait: &lt;3.5 mins</span>
        </div>
      </div>

      {/* 8 Gates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGates.map((gate) => {
          const isBottleneck = gate.status === 'CONGESTED' || gate.densityPercent >= 85;
          const isBusy = gate.status === 'BUSY' || gate.densityPercent >= 70;

          return (
            <div
              key={gate.id}
              className={`p-4 rounded-2xl liquid-glass-card shadow-glass flex flex-col justify-between space-y-3 transition-all hover:scale-[1.01] ${
                isBottleneck
                  ? 'border-[#FECACA] ring-2 ring-[#DC2626]/20'
                  : isBusy
                  ? 'border-[#FDE68A]'
                  : 'border-white/70'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isBottleneck
                          ? 'bg-[#DC2626] text-white animate-pulse'
                          : isBusy
                          ? 'bg-[#D97706] text-white'
                          : 'bg-[#2B211B] text-[#F6F3ED]'
                      }`}
                    >
                      <DoorOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-black text-sm text-[#2B211B] block">
                        {gate.name}
                      </span>
                      <span className="text-[10px] text-[#806C5D] font-mono">{gate.blockName} • Sec {gate.connectedSection}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase ${
                      isBottleneck
                        ? 'bg-[#FEE2E2] text-[#DC2626] animate-pulse'
                        : isBusy
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#E8F5E9] text-[#2E7D32]'
                    }`}
                  >
                    {gate.status}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white/60 border border-white/80">
                    <span className="text-[9px] text-[#806C5D] uppercase block">FLOW RATE</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base font-black text-[#2B211B]">{gate.currentFlow.toLocaleString()}</span>
                      <span className="text-[9px] text-[#806C5D]">/m</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/60 border border-white/80">
                    <span className="text-[9px] text-[#806C5D] uppercase block">QUEUE</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-base font-black ${isBottleneck ? 'text-[#DC2626]' : 'text-[#2B211B]'}`}>
                        {gate.queueCount}
                      </span>
                      <span className="text-[9px] text-[#806C5D]">fans</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/60 border border-white/80 col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[#806C5D] uppercase">AVG WAIT TIME:</span>
                      <span className={`text-xs font-black ${isBottleneck ? 'text-[#DC2626]' : isBusy ? 'text-[#D97706]' : 'text-[#2E7D32]'}`}>
                        ~{gate.waitTimeMinutes} mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                {gate.recommendedAction && (
                  <div className="p-2 rounded-xl bg-white/70 border border-[#E3DDD2] text-[10px] font-mono leading-tight">
                    <span className="text-[#806C5D] block">{gate.recommendedAction}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#E3DDD2]/60">
                <button
                  onClick={() => setSelectedEntity({
                    id: gate.id,
                    type: 'GATE',
                    code: gate.code,
                    name: gate.name,
                    zone: gate.zoneName,
                    status: gate.status,
                    capacity: gate.capacity,
                    currentLoad: gate.currentFlow,
                    lat: gate.lat,
                    lng: gate.lng,
                    x: gate.x,
                    y: gate.y,
                    metadata: { ...gate },
                  })}
                  className="w-full py-2 px-3 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Inspect Gate Telemetry
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
