import React from 'react';
import { useTwin } from '../../context/TwinContext';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  CloudRain,
  ShieldAlert,
  Clock,
  Car,
  SquareParking,
  Users,
  UserCheck,
  AlertTriangle,
  Play,
  Flame,
  Activity,
  Compass,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const {
    viewMode,
    liveWeather,
    liveState,
    liveCascade,
    simParams,
    simCascade,
    simulatedState,
    setActiveTab,
    applyScenarioPreset,
    activeScenario,
    runSimulation,
    playOperationalChime,
  } = useTwin();

  const activeData = viewMode === 'LIVE' ? liveCascade : simCascade;
  const activeState = viewMode === 'LIVE' ? liveState : simulatedState;
  const activeWeather =
    viewMode === 'LIVE'
      ? liveWeather
      : {
          ...liveWeather,
          temperature: simParams.temperature,
          rainfall: simParams.rainfall,
          windSpeed: simParams.windSpeed,
          conditionText:
            simParams.rainfall > 50
              ? 'Severe Torrential Storm'
              : simParams.rainfall > 20
              ? 'Heavy Rain Band'
              : 'Scatter Showers',
        };

  return (
    <div className="space-y-6">
      {/* View Mode Banner if in Simulation Mode */}
      {viewMode === 'SIMULATION' && (
        <div className="bg-[#6B46C1]/10 border-2 border-[#6B46C1] rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs font-mono text-[#6B46C1] shadow-card animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6B46C1] animate-ping" />
            <strong className="font-bold text-sm uppercase">
              SIMULATION SANDBOX ACTIVE (SCENARIO: {activeScenario})
            </strong>
          </div>
          <span className="bg-[#6B46C1] text-[#FFFEFB] font-bold px-3 py-1 rounded text-[11px]">
            SIMULATION ONLY — NO CHANGES APPLIED TO REAL OPERATIONS
          </span>
        </div>
      )}

      {/* Main KPI Grid (Directly matching Requirement 5 specs) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2B1710]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-[#2B1710] font-mono">
              REAL-TIME MISSION TELEMETRY & IMPACT INDEX
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#756D66]">
            Updated: <strong className="text-[#2A211D]">{liveWeather.timestamp}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. CURRENT WEATHER */}
          <KpiCard
            title="CURRENT WEATHER"
            value={`${activeWeather.temperature}°C`}
            subtitle={`Rain Probability: ${activeWeather.rainProbability}% | Wind: ${activeWeather.windSpeed} km/h`}
            risk={activeData.weatherRisk}
            icon={<CloudRain className="w-4 h-4" />}
            onClick={() => setActiveTab('weather-intel')}
          />

          {/* 2. WEATHER RISK */}
          <KpiCard
            title="WEATHER RISK"
            value={activeData.weatherRisk}
            subtitle={`Intensity: ${activeWeather.rainfall} mm/hr | Radar: Active`}
            risk={activeData.weatherRisk}
            icon={<ShieldAlert className="w-4 h-4" />}
            onClick={() => setActiveTab('weather-intel')}
          />

          {/* 3. TRAVELER IMPACT */}
          <KpiCard
            title="TRAVELER IMPACT"
            value={`+${activeState.travelerAverageDelay} min`}
            subtitle="Delay on Main Urban Arteries"
            risk={activeState.travelerAverageDelay > 15 ? 'HIGH' : activeState.travelerAverageDelay > 8 ? 'MODERATE' : 'LOW'}
            icon={<Clock className="w-4 h-4" />}
            confidence={activeData.metrics.find((m) => m.id === 'travel-delay')?.confidence || 86}
            range="[+9m — +16m]"
            onClick={() => setActiveTab('impact-propagation')}
          />

          {/* 4. TRAFFIC IMPACT */}
          <KpiCard
            title="TRAFFIC IMPACT"
            value={`+${activeData.metrics.find((m) => m.id === 'traffic-impact')?.predictedChange || 18}%`}
            subtitle={`Ring Road Congestion: ${activeState.trafficCongestion}%`}
            risk={activeState.trafficCongestion > 70 ? 'HIGH' : 'MODERATE'}
            icon={<Car className="w-4 h-4" />}
            confidence={activeData.metrics.find((m) => m.id === 'traffic-impact')?.confidence || 84}
            range="[+14% — +23%]"
            onClick={() => setActiveTab('twin-map')}
          />

          {/* 5. PARKING PRESSURE */}
          <KpiCard
            title="PARKING PRESSURE"
            value={`+${activeData.metrics.find((m) => m.id === 'parking-pressure')?.predictedChange || 9}%`}
            subtitle={`Total Utilization: ${activeState.parkingUtilization}% (P1 & P2)`}
            risk={activeState.parkingUtilization > 80 ? 'HIGH' : 'MODERATE'}
            icon={<SquareParking className="w-4 h-4" />}
            confidence={82}
            range="[+7% — +13%]"
            onClick={() => setActiveTab('twin-map')}
          />

          {/* 6. CROWD IMPACT */}
          <KpiCard
            title="CROWD IMPACT"
            value={`+${activeData.metrics.find((m) => m.id === 'gate-crowd')?.predictedChange || 8}%`}
            subtitle={`Stadium Ingress: ${activeState.stadiumCrowd.toLocaleString()} fans`}
            risk={activeState.gateWaitTime > 12 ? 'HIGH' : 'MODERATE'}
            icon={<Users className="w-4 h-4" />}
            confidence={88}
            range="[+5% — +12%]"
            onClick={() => setActiveTab('twin-map')}
          />

          {/* 7. WORKFORCE IMPACT */}
          <KpiCard
            title="WORKFORCE IMPACT"
            value={`${activeData.metrics.find((m) => m.id === 'workforce-impact')?.predictedChange || -6}%`}
            subtitle={`Marshals On Duty: ${activeState.staffOnDuty}/${activeState.staffRequired}`}
            risk={activeState.staffOnDuty / activeState.staffRequired < 0.8 ? 'HIGH' : 'LOW'}
            icon={<UserCheck className="w-4 h-4" />}
            confidence={91}
            range="[-4% — -9%]"
            onClick={() => setActiveTab('recommendations')}
          />

          {/* 8. OVERALL OPERATIONAL RISK */}
          <KpiCard
            title="OVERALL OPERATIONAL RISK"
            value={activeData.overallRisk}
            subtitle={`Synthesis: ${activeData.summaryNarrative.slice(0, 52)}...`}
            risk={activeData.overallRisk}
            highlight={activeData.overallRisk === 'HIGH' || activeData.overallRisk === 'CRITICAL'}
            icon={<AlertTriangle className="w-4 h-4" />}
            onClick={() => setActiveTab('impact-propagation')}
          />
        </div>
      </div>

      {/* Middle Grid: Interactive Operational Center Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Digital Twin Status & Cascade summary (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-[#E4DED3]">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E4DED3]">
              <div>
                <h3 className="text-base font-black text-[#2B1710] font-display">
                  DIGITAL TWIN ECOSYSTEM TELEMETRY
                </h3>
                <p className="text-xs text-[#756D66] font-mono">
                  Real-time coupled state across stadium infrastructure
                </p>
              </div>
              <StatusBadge level={activeData.overallRisk} size="md" />
            </div>

            {/* Sub-system Bar Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#F7F4ED] p-3.5 rounded-xl border border-[#E4DED3]">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#756D66]">STADIUM INGRESS LOAD</span>
                  <strong className="text-[#2A211D]">
                    {((activeState.stadiumCrowd / activeState.capacity) * 100).toFixed(0)}%
                  </strong>
                </div>
                <div className="w-full bg-[#E4DED3] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2B1710] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(activeState.stadiumCrowd / activeState.capacity) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#756D66] mt-1">
                  <span>Capacity: 100,000</span>
                  <span>Inside: {activeState.stadiumCrowd.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-[#F7F4ED] p-3.5 rounded-xl border border-[#E4DED3]">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#756D66]">PARKING SATURATION</span>
                  <strong className="text-[#2A211D]">{activeState.parkingUtilization}%</strong>
                </div>
                <div className="w-full bg-[#E4DED3] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      activeState.parkingUtilization > 85
                        ? 'bg-[#D92D3A]'
                        : activeState.parkingUtilization > 70
                        ? 'bg-[#D9822B]'
                        : 'bg-[#2F7D45]'
                    }`}
                    style={{ width: `${activeState.parkingUtilization}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#756D66] mt-1">
                  <span>P1: 83% | P2: 55%</span>
                  <span>P3 Overflow: Ready</span>
                </div>
              </div>

              <div className="bg-[#F7F4ED] p-3.5 rounded-xl border border-[#E4DED3]">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#756D66]">ROAD CORRIDOR CONGESTION</span>
                  <strong className="text-[#2A211D]">{activeState.trafficCongestion}%</strong>
                </div>
                <div className="w-full bg-[#E4DED3] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      activeState.trafficCongestion > 70
                        ? 'bg-[#D92D3A]'
                        : activeState.trafficCongestion > 50
                        ? 'bg-[#D9822B]'
                        : 'bg-[#2F7D45]'
                    }`}
                    style={{ width: `${activeState.trafficCongestion}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#756D66] mt-1">
                  <span>Ring Road Speed: 32 km/h</span>
                  <span>North Link: Freeflow</span>
                </div>
              </div>

              <div className="bg-[#F7F4ED] p-3.5 rounded-xl border border-[#E4DED3]">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#756D66]">MULTIMODAL TRANSIT SURGE</span>
                  <strong className="text-[#2A211D]">{activeState.transitDemand}%</strong>
                </div>
                <div className="w-full bg-[#E4DED3] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2B6CB0] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${activeState.transitDemand}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#756D66] mt-1">
                  <span>Metro Headway: 3.5m</span>
                  <span>Shuttle Loop: 12 units</span>
                </div>
              </div>
            </div>

            {/* Narrative synthesis */}
            <div className="bg-[#EFE8DB]/80 p-3.5 rounded-xl border border-[#E4DED3] flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#2B1710] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono font-bold text-[#2B1710] uppercase mb-0.5">
                  AI DIGITAL TWIN SYNTHESIS
                </div>
                <p className="text-xs text-[#2A211D] leading-relaxed">
                  {activeData.summaryNarrative}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Scenario Preset Launcher */}
          <div className="glass-card rounded-2xl p-5 border border-[#E4DED3]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#756D66]">
                INSTANT SCENARIO SIMULATION PRESETS
              </h4>
              <span className="text-[10px] font-mono text-[#756D66]">Click to preview sandbox</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'NORMAL', label: 'NORMAL WEATHER', rain: '0 mm/hr' },
                { id: 'LIGHT_RAIN', label: 'LIGHT RAIN', rain: '10 mm/hr' },
                { id: 'HEAVY_RAIN', label: 'HEAVY RAIN', rain: '60 mm/hr' },
                { id: 'EXTREME_STORM', label: 'EXTREME STORM', rain: '95 mm/hr' },
                { id: 'FLOOD_EVENT', label: 'FLOOD EVENT', rain: '120 mm/hr' },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    playOperationalChime('sim');
                    applyScenarioPreset(sc.id as any);
                    setActiveTab('what-if');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    activeScenario === sc.id
                      ? 'bg-[#2B1710] text-[#FFFEFB] border-[#2B1710] shadow-subtle'
                      : 'bg-[#FFFEFB] border-[#E4DED3] text-[#2A211D] hover:border-[#2B1710]'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold uppercase truncate">{sc.label}</div>
                  <div className="text-xs font-bold text-[#D9822B] mt-0.5">{sc.rain}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Geospatial Radar & AI Action Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Mini Doppler Radar Screen */}
          <div className="glass-card rounded-2xl p-5 border border-[#E4DED3] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#2B1710]" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B1710]">
                  LIVE RADAR REFLECTIVITY & PRECIP ZONE
                </h4>
              </div>
              <span className="text-[10px] font-mono bg-[#EFE8DB] px-2 py-0.5 rounded font-bold text-[#756D66]">
                30 KM DOPPLER
              </span>
            </div>

            {/* Radar Canvas / Visualization */}
            <div className="relative w-full h-48 bg-[#2B1710] rounded-xl overflow-hidden flex items-center justify-center border border-[#422820]">
              {/* Concentric distance rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-[#EFE8DB]/20" />
                <div className="w-32 h-32 rounded-full border border-[#EFE8DB]/20 absolute" />
                <div className="w-44 h-44 rounded-full border border-[#EFE8DB]/20 absolute" />
                <div className="w-full h-px bg-[#EFE8DB]/15 absolute" />
                <div className="h-full w-px bg-[#EFE8DB]/15 absolute" />
              </div>

              {/* Animated Radar Sweep Line */}
              <div className="absolute inset-0 animate-radar-sweep pointer-events-none">
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-500/25 to-transparent origin-bottom-right" />
              </div>

              {/* Rain cloud heat spot */}
              <div
                className={`absolute w-24 h-24 rounded-full blur-xl transition-all duration-700 ${
                  activeWeather.rainfall > 45
                    ? 'bg-red-500/50 scale-125'
                    : activeWeather.rainfall > 20
                    ? 'bg-amber-500/40 scale-100'
                    : 'bg-emerald-500/30 scale-75'
                }`}
                style={{ top: '25%', left: '40%' }}
              />

              {/* Stadium Marker Pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-[#FFFEFB] border-2 border-[#D92D3A] animate-ping absolute" />
                <div className="w-4 h-4 rounded-full bg-[#D92D3A] border-2 border-[#FFFEFB] flex items-center justify-center text-[8px] text-white font-bold">
                  S
                </div>
                <span className="text-[9px] font-mono text-[#FFFEFB] font-bold bg-[#1C0F0A]/90 px-1.5 py-0.5 rounded mt-1 shadow">
                  100K STADIUM CORE
                </span>
              </div>

              {/* Bottom telemetry overlay */}
              <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] font-mono text-[#EFE8DB]">
                <span>CELL SPEED: {activeWeather.windSpeed} KM/H ENE</span>
                <span>PRECIP: {activeWeather.rainfall} MM/HR</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('twin-map')}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-[#EFE8DB] hover:bg-[#E4DED3] text-xs font-bold font-mono text-[#2B1710] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>OPEN FULL INTERACTIVE DIGITAL TWIN MAP</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top AI Recommendation Spotlight */}
          <div className="glass-card rounded-2xl p-5 border border-[#E4DED3]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D9822B] animate-ping" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B1710]">
                  TOP AI OPERATIONAL ADVISORY
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#2F7D45] font-bold">CONF: 89%</span>
            </div>

            <div className="bg-[#F7F4ED] p-3 rounded-xl border border-[#E4DED3] mb-3">
              <div className="text-xs font-bold text-[#2A211D] mb-1">
                OPEN OVERFLOW PARKING P3 & ACTIVATE DIVERSION
              </div>
              <p className="text-[11px] text-[#756D66]">
                P1 projected to exceed 90% capacity within 25 min due to rainfall diversion.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('recommendations')}
              className="w-full py-2 px-3 rounded-lg bg-[#2B1710] hover:bg-[#422820] text-[#FFFEFB] text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all shadow-subtle"
            >
              <span>VIEW ALL 5 AI RECOMMENDATIONS</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#EFE8DB]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
