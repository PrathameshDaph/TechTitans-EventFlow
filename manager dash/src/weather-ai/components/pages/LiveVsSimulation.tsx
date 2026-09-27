import React from 'react';
import { useTwin } from '../../context/TwinContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Columns,
  Radio,
  Sliders,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

export const LiveVsSimulation: React.FC = () => {
  const {
    liveWeather,
    liveState,
    liveCascade,
    simParams,
    simCascade,
    simulatedState,
    viewMode,
    setViewMode,
    resetSimulationToLive,
    setActiveTab,
    playOperationalChime,
  } = useTwin();

  const metricsComparison = [
    {
      label: 'Precipitation Rate',
      live: `${liveWeather.rainfall} mm/hr`,
      sim: `${simParams.rainfall} mm/hr`,
      delta: `+${Math.max(0, simParams.rainfall - liveWeather.rainfall)} mm/hr`,
      critical: simParams.rainfall > 40,
    },
    {
      label: 'Corridor Traffic Congestion',
      live: `${liveState.trafficCongestion}%`,
      sim: `${simulatedState.trafficCongestion}%`,
      delta: `+${simulatedState.trafficCongestion - liveState.trafficCongestion}%`,
      critical: simulatedState.trafficCongestion > 70,
    },
    {
      label: 'Parking Lot Saturation',
      live: `${liveState.parkingUtilization}%`,
      sim: `${simulatedState.parkingUtilization}%`,
      delta: `+${simulatedState.parkingUtilization - liveState.parkingUtilization}%`,
      critical: simulatedState.parkingUtilization > 80,
    },
    {
      label: 'Stadium Ingress Crowd Inside',
      live: `${liveState.stadiumCrowd.toLocaleString()} (${((liveState.stadiumCrowd / liveState.capacity) * 100).toFixed(0)}%)`,
      sim: `${simulatedState.stadiumCrowd.toLocaleString()} (${((simulatedState.stadiumCrowd / simulatedState.capacity) * 100).toFixed(0)}%)`,
      delta: `${simulatedState.stadiumCrowd - liveState.stadiumCrowd} fans`,
      critical: false,
    },
    {
      label: 'Gate 4 Turnstile Wait Time',
      live: `${liveState.gateWaitTime} min`,
      sim: `${simulatedState.gateWaitTime} min`,
      delta: `+${simulatedState.gateWaitTime - liveState.gateWaitTime} min`,
      critical: simulatedState.gateWaitTime > 12,
    },
    {
      label: 'Average Traveler Delay',
      live: `+${liveState.travelerAverageDelay} min`,
      sim: `+${simulatedState.travelerAverageDelay} min`,
      delta: `+${simulatedState.travelerAverageDelay - liveState.travelerAverageDelay} min`,
      critical: simulatedState.travelerAverageDelay > 15,
    },
    {
      label: 'Active Workforce On Duty',
      live: `${liveState.staffOnDuty}/${liveState.staffRequired}`,
      sim: `${simulatedState.staffOnDuty}/${simulatedState.staffRequired}`,
      delta: `${simulatedState.staffOnDuty - liveState.staffOnDuty} staff`,
      critical: simulatedState.staffOnDuty / simulatedState.staffRequired < 0.8,
    },
    {
      label: 'Public Transit Surge Demand',
      live: `${liveState.transitDemand}%`,
      sim: `${simulatedState.transitDemand}%`,
      delta: `+${simulatedState.transitDemand - liveState.transitDemand}%`,
      critical: simulatedState.transitDemand > 80,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner (Requirement 13) */}
      <div className="bg-[#6B46C1]/10 border-2 border-[#6B46C1] rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B46C1] text-[#FFFEFB] flex items-center justify-center shrink-0">
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#6B46C1] font-display">
              LIVE OPERATIONS VS DIGITAL TWIN SIMULATION SANDBOX
            </h2>
            <p className="text-xs text-[#2A211D] font-mono">
              Strictly sandboxed execution. Simulated stress states do not interfere with live stadium controls.
            </p>
          </div>
        </div>

        <div className="bg-[#6B46C1] text-[#FFFEFB] font-mono text-xs font-black px-4 py-2 rounded-xl shrink-0 uppercase shadow-subtle">
          SIMULATION ONLY — NO CHANGES APPLIED TO REAL OPERATIONS
        </div>
      </div>

      {/* Side-by-Side Dual Columns (Requirement 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: LIVE WORLD */}
        <div className="glass-card rounded-2xl p-6 border-2 border-[#2F7D45]/40 bg-[#FFFEFB]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4DED3]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2F7D45] animate-ping" />
              <h3 className="text-base font-black text-[#2A211D] font-display">
                LIVE WORLD (ACTUAL BASELINE)
              </h3>
            </div>
            <StatusBadge level={liveCascade.overallRisk} size="md" />
          </div>

          <div className="space-y-3 mb-6 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] flex justify-between items-center">
              <span className="text-[#756D66]">Rainfall Intensity:</span>
              <strong className="text-sm text-[#2A211D]">{liveWeather.rainfall} mm/hr</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] flex justify-between items-center">
              <span className="text-[#756D66]">Corridor Traffic:</span>
              <strong className="text-sm text-[#2A211D]">{liveState.trafficCongestion}%</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] flex justify-between items-center">
              <span className="text-[#756D66]">Parking Saturation:</span>
              <strong className="text-sm text-[#2A211D]">{liveState.parkingUtilization}%</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] flex justify-between items-center">
              <span className="text-[#756D66]">Stadium Crowd Ingress:</span>
              <strong className="text-sm text-[#2A211D]">
                {((liveState.stadiumCrowd / liveState.capacity) * 100).toFixed(0)}% ({liveState.stadiumCrowd.toLocaleString()} fans)
              </strong>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] flex justify-between items-center">
              <span className="text-[#756D66]">Overall Operational Risk:</span>
              <strong className="text-sm text-[#2F7D45] uppercase">{liveCascade.overallRisk}</strong>
            </div>
          </div>

          <div className="bg-[#2F7D45]/10 p-3.5 rounded-xl border border-[#2F7D45]/30 flex items-center gap-2.5 text-xs font-mono text-[#2F7D45]">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Telemetry locked to physical stadium precinct sensors.</span>
          </div>
        </div>

        {/* Column 2: DIGITAL TWIN SIMULATION */}
        <div className="glass-card rounded-2xl p-6 border-2 border-[#6B46C1]/50 bg-[#FFFEFB]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4DED3]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#6B46C1] animate-pulse" />
              <h3 className="text-base font-black text-[#6B46C1] font-display">
                DIGITAL TWIN SIMULATION (SANDBOX)
              </h3>
            </div>
            <StatusBadge level={simCascade.overallRisk} size="md" />
          </div>

          <div className="space-y-3 mb-6 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] flex justify-between items-center">
              <span className="text-[#756D66]">Simulated Rainfall:</span>
              <strong className="text-sm text-[#D9822B]">{simParams.rainfall} mm/hr</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] flex justify-between items-center">
              <span className="text-[#756D66]">Simulated Traffic:</span>
              <strong className="text-sm text-[#D92D3A]">{simulatedState.trafficCongestion}%</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] flex justify-between items-center">
              <span className="text-[#756D66]">Simulated Parking:</span>
              <strong className="text-sm text-[#D9822B]">{simulatedState.parkingUtilization}%</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] flex justify-between items-center">
              <span className="text-[#756D66]">Simulated Crowd Inside:</span>
              <strong className="text-sm text-[#2A211D]">
                {((simulatedState.stadiumCrowd / simulatedState.capacity) * 100).toFixed(0)}% ({simulatedState.stadiumCrowd.toLocaleString()} fans)
              </strong>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] flex justify-between items-center">
              <span className="text-[#756D66]">Simulated Ecosystem Risk:</span>
              <strong className={`text-sm uppercase ${
                simCascade.overallRisk === 'CRITICAL' ? 'text-[#D92D3A]' : 'text-[#D9822B]'
              }`}>
                {simCascade.overallRisk}
              </strong>
            </div>
          </div>

          <div className="bg-[#6B46C1]/10 p-3.5 rounded-xl border border-[#6B46C1]/30 flex items-center gap-2.5 text-xs font-mono text-[#6B46C1]">
            <Sparkles className="w-5 h-5 shrink-0" />
            <span>Deterministic prediction sandbox running in isolated state.</span>
          </div>
        </div>
      </div>

      {/* Delta Breakdown Comparison Table */}
      <div className="glass-card rounded-2xl p-6 border border-[#E4DED3]">
        <h3 className="text-sm font-black text-[#2B1710] font-mono uppercase tracking-wider mb-4">
          SIDE-BY-SIDE ECOSYSTEM DELTA MATRIX
        </h3>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[650px] text-xs font-mono">
            <thead>
              <tr className="border-b border-[#E4DED3] text-[11px] font-bold text-[#756D66] uppercase">
                <th className="py-2.5 px-3">Ecosystem Dimension</th>
                <th className="py-2.5 px-3">Live World Baseline</th>
                <th className="py-2.5 px-3">Digital Twin Simulation</th>
                <th className="py-2.5 px-3 text-right">Projected Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DED3]/60">
              {metricsComparison.map((row) => (
                <tr key={row.label} className="hover:bg-[#EFE8DB]/30 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold text-[#2A211D]">
                    {row.label}
                  </td>
                  <td className="py-3 px-3 text-[#756D66]">{row.live}</td>
                  <td className="py-3 px-3 font-bold text-[#2A211D]">{row.sim}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-black px-2 py-0.5 rounded ${
                        row.critical
                          ? 'bg-[#D92D3A]/10 text-[#D92D3A]'
                          : 'bg-[#D9822B]/10 text-[#D9822B]'
                      }`}
                    >
                      {row.delta}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
