import React from 'react';
import { useTwin } from '../../context/TwinContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  SlidersHorizontal,
  CloudRain,
  Thermometer,
  Clock,
  Wind,
  Waves,
  MapPin,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertOctagon,
} from 'lucide-react';
import { WeatherScenario } from '../../types';

export const WhatIfSimulator: React.FC = () => {
  const {
    simParams,
    setSimParams,
    simCascade,
    activeScenario,
    applyScenarioPreset,
    runSimulation,
    resetSimulationToLive,
    setActiveTab,
    playOperationalChime,
  } = useTwin();

  const impactZones = [
    'Ecosystem-Wide Perimeter',
    'Stadium Core & South Gate 4',
    'North Ingress Corridor & P1',
    'Ring Road Low-Lying Underpasses',
    'Metro Station & West Rideshare Plaza',
    'Hospitality & Dining Precinct',
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#2B1710] font-display">
              WEATHER WHAT-IF SIMULATOR
            </h2>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#6B46C1] text-[#FFFEFB] font-bold">
              SANDBOX SIMULATION
            </span>
          </div>
          <p className="text-xs text-[#756D66] font-mono">
            Independent physics-based simulation sandbox with zero coupling or modifications to live operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetSimulationToLive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFE8DB] hover:bg-[#E4DED3] text-xs font-mono font-bold text-[#2B1710] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO LIVE BASELINE</span>
          </button>
          <button
            onClick={() => {
              runSimulation();
              setActiveTab('live-vs-sim');
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#6B46C1] hover:bg-[#553C9A] text-[#FFFEFB] text-xs font-mono font-bold shadow-card transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>EXECUTE & COMPARE →</span>
          </button>
        </div>
      </div>

      {/* Scenario Presets Bar (Requirement 14) */}
      <div className="glass-card rounded-2xl p-5 border border-[#E4DED3]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#756D66]">
            SCENARIO PRESETS (NORMAL VS EXTREME EVENTS)
          </h3>
          <span className="text-[11px] font-mono text-[#756D66]">
            Active: <strong className="text-[#2B1710]">{activeScenario}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'NORMAL', label: 'NORMAL WEATHER', rain: '0 mm/hr', risk: 'LOW' },
            { id: 'LIGHT_RAIN', label: 'LIGHT RAIN', rain: '10 mm/hr', risk: 'LOW' },
            { id: 'HEAVY_RAIN', label: 'HEAVY RAIN', rain: '60 mm/hr', risk: 'HIGH' },
            { id: 'EXTREME_STORM', label: 'EXTREME STORM', rain: '95 mm/hr', risk: 'CRITICAL' },
            { id: 'FLOOD_EVENT', label: 'FLOOD EVENT', rain: '120 mm/hr', risk: 'CRITICAL' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyScenarioPreset(preset.id as WeatherScenario)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeScenario === preset.id
                  ? 'bg-[#2B1710] text-[#FFFEFB] border-[#2B1710] shadow-card ring-2 ring-[#2B1710]/20'
                  : 'bg-[#F7F4ED] border-[#E4DED3] text-[#2A211D] hover:border-[#2B1710]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold uppercase truncate">
                  {preset.label}
                </span>
                <StatusBadge level={preset.risk} size="sm" showDot={false} />
              </div>
              <div className="text-lg font-black font-display text-[#D9822B]">
                {preset.rain}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Sliders & Controls Grid (Requirement 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-[#E4DED3] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DED3]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#2B1710]" />
                <h3 className="text-sm font-black text-[#2B1710] font-mono uppercase tracking-wider">
                  METEOROLOGICAL PARAMETER CONTROLS
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#756D66]">Continuous adjustments</span>
            </div>

            {/* 1. RAINFALL SLIDER */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-mono">
                <span className="text-xs font-bold text-[#756D66] flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-[#2B6CB0]" />
                  RAINFALL INTENSITY
                </span>
                <span className="text-base font-black text-[#2B1710]">
                  {simParams.rainfall} <span className="text-xs text-[#756D66]">mm/hr</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={simParams.rainfall}
                onChange={(e) => {
                  setSimParams((p) => ({ ...p, rainfall: Number(e.target.value) }));
                }}
                className="w-full accent-[#2B1710] cursor-pointer h-2 bg-[#E4DED3] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#756D66] mt-1">
                <span>0 mm/hr (Dry)</span>
                <span className="font-bold text-[#2B1710]">60 mm/hr (Benchmark)</span>
                <span>120 mm/hr (Torrential)</span>
              </div>
            </div>

            {/* 2. TEMPERATURE SLIDER */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-mono">
                <span className="text-xs font-bold text-[#756D66] flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-[#D9822B]" />
                  SURFACE TEMPERATURE
                </span>
                <span className="text-base font-black text-[#2A211D]">
                  {simParams.temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                step="1"
                value={simParams.temperature}
                onChange={(e) => {
                  setSimParams((p) => ({ ...p, temperature: Number(e.target.value) }));
                }}
                className="w-full accent-[#2B1710] cursor-pointer h-2 bg-[#E4DED3] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#756D66] mt-1">
                <span>15°C (Cool)</span>
                <span>28°C (Moderate)</span>
                <span>45°C (Extreme Heat)</span>
              </div>
            </div>

            {/* 3. STORM DURATION SLIDER */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-mono">
                <span className="text-xs font-bold text-[#756D66] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#756D66]" />
                  STORM DURATION
                </span>
                <span className="text-base font-black text-[#2A211D]">
                  {simParams.stormDuration} <span className="text-xs text-[#756D66]">min</span>
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={simParams.stormDuration}
                onChange={(e) => {
                  setSimParams((p) => ({ ...p, stormDuration: Number(e.target.value) }));
                }}
                className="w-full accent-[#2B1710] cursor-pointer h-2 bg-[#E4DED3] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#756D66] mt-1">
                <span>15 min (Brief Cell)</span>
                <span>60 min (1 Hour)</span>
                <span>180 min (Sustained Monsoon)</span>
              </div>
            </div>

            {/* 4. WIND SPEED SLIDER */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-mono">
                <span className="text-xs font-bold text-[#756D66] flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-[#756D66]" />
                  SUSTAINED WIND SPEED
                </span>
                <span className="text-base font-black text-[#2A211D]">
                  {simParams.windSpeed} <span className="text-xs text-[#756D66]">km/h</span>
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={simParams.windSpeed}
                onChange={(e) => {
                  setSimParams((p) => ({ ...p, windSpeed: Number(e.target.value) }));
                }}
                className="w-full accent-[#2B1710] cursor-pointer h-2 bg-[#E4DED3] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#756D66] mt-1">
                <span>5 km/h (Calm)</span>
                <span>35 km/h (Moderate Gale)</span>
                <span>80 km/h (Squall)</span>
              </div>
            </div>

            {/* 5. FLOODING SEVERITY (Requirement 12) */}
            <div>
              <label className="text-xs font-bold text-[#756D66] flex items-center gap-1.5 mb-2 font-mono">
                <Waves className="w-4 h-4 text-[#2B6CB0]" />
                FLOODING / WATERLOGGING SEVERITY
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSimParams((p) => ({ ...p, floodingSeverity: sev }))}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all ${
                      simParams.floodingSeverity === sev
                        ? sev === 'HIGH'
                          ? 'bg-[#D92D3A] text-[#FFFEFB]'
                          : sev === 'MEDIUM'
                          ? 'bg-[#D9822B] text-[#FFFEFB]'
                          : 'bg-[#2F7D45] text-[#FFFEFB]'
                        : 'bg-[#F7F4ED] text-[#756D66] border border-[#E4DED3]'
                    }`}
                  >
                    {sev} SEVERITY
                  </button>
                ))}
              </div>
            </div>

            {/* 6. LOCATION / IMPACT ZONE (Requirement 12) */}
            <div>
              <label className="text-xs font-bold text-[#756D66] flex items-center gap-1.5 mb-2 font-mono">
                <MapPin className="w-4 h-4 text-[#D92D3A]" />
                PRIMARY IMPACT ZONE FOCUS
              </label>
              <select
                value={simParams.impactZone}
                onChange={(e) => setSimParams((p) => ({ ...p, impactZone: e.target.value }))}
                className="w-full bg-[#F7F4ED] text-xs font-bold font-mono text-[#2A211D] p-3 rounded-xl border border-[#E4DED3] outline-none"
              >
                {impactZones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Simulation Output Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-[#E4DED3]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4DED3]">
              <h3 className="text-sm font-black text-[#2B1710] font-mono uppercase tracking-wider">
                SIMULATION OUTPUT TELEMETRY
              </h3>
              <StatusBadge level={simCascade.overallRisk} size="sm" />
            </div>

            {/* Main Risk Result Box */}
            <div className="bg-[#2B1710] text-[#FFFEFB] p-4 rounded-xl mb-4 border border-[#422820]">
              <div className="flex justify-between items-center mb-1 text-[11px] font-mono text-[#EFE8DB]">
                <span>PREDICTED ECOSYSTEM RISK</span>
                <span>CONFIDENCE: 89%</span>
              </div>
              <div className="text-2xl font-black font-display text-[#FFFEFB] flex items-center gap-2">
                <span>{simCascade.overallRisk}</span>
                <span className="text-xs font-mono font-normal text-[#EFE8DB]">
                  (Rain: {simParams.rainfall} mm/hr)
                </span>
              </div>
              <p className="text-xs text-[#EFE8DB] mt-2 font-sans leading-relaxed">
                {simCascade.summaryNarrative}
              </p>
            </div>

            {/* Quick Metrics Delta List */}
            <div className="space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between p-2.5 rounded-lg bg-[#F7F4ED] border border-[#E4DED3]">
                <span className="text-[#756D66]">Traveler Delay:</span>
                <strong className="text-[#D92D3A]">
                  +{simCascade.state.travelerAverageDelay} min (+{simCascade.metrics.find(m => m.id === 'travel-delay')?.predictedChange}%)
                </strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-[#F7F4ED] border border-[#E4DED3]">
                <span className="text-[#756D66]">Corridor Congestion:</span>
                <strong className="text-[#D9822B]">
                  {simCascade.state.trafficCongestion}% (+{simCascade.metrics.find(m => m.id === 'traffic-impact')?.predictedChange}%)
                </strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-[#F7F4ED] border border-[#E4DED3]">
                <span className="text-[#756D66]">Parking Saturation:</span>
                <strong className="text-[#D9822B]">
                  {simCascade.state.parkingUtilization}% (+{simCascade.metrics.find(m => m.id === 'parking-pressure')?.predictedChange}%)
                </strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-[#F7F4ED] border border-[#E4DED3]">
                <span className="text-[#756D66]">Gate 4 Wait Time:</span>
                <strong className="text-[#D92D3A]">
                  {simCascade.state.gateWaitTime} min
                </strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-[#F7F4ED] border border-[#E4DED3]">
                <span className="text-[#756D66]">Active Workforce:</span>
                <strong className="text-[#2A211D]">
                  {simCascade.state.staffOnDuty} / {simCascade.state.staffRequired}
                </strong>
              </div>
            </div>

            <button
              onClick={() => {
                runSimulation();
                setActiveTab('impact-propagation');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2B1710] hover:bg-[#422820] text-[#FFFEFB] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-subtle"
            >
              <Sparkles className="w-4 h-4 text-[#EFE8DB]" />
              <span>TRACE CASCADE PROPAGATION →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
