import React from 'react';
import { useTwin } from '../../context/TwinContext';
import {
  Radio,
  PlayCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  Globe,
  Sliders,
  AlertTriangle,
  Zap,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { STADIUM_LOCATIONS } from '../../services/weatherService';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    liveWeather,
    liveCascade,
    simCascade,
    weatherSourceMode,
    setWeatherSourceMode,
    selectedStadiumLocation,
    setSelectedStadiumLocation,
    refreshLiveWeather,
    isLoadingWeather,
    setIsDemoTourOpen,
    soundEnabled,
    setSoundEnabled,
    playOperationalChime,
  } = useTwin();

  const currentRisk = viewMode === 'LIVE' ? liveCascade.overallRisk : simCascade.overallRisk;

  return (
    <header className="sticky top-0 z-50 bg-[#F7F4ED]/95 backdrop-blur-md border-b border-[#E4DED3] px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-[1720px] mx-auto flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        {/* Left: Branding & Event Meta */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2B1710] text-[#FFFEFB] flex items-center justify-center shadow-subtle border border-[#422820]">
              <Radio className="w-5 h-5 text-[#EFE8DB] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl lg:text-2xl font-black text-[#2B1710] tracking-tight font-display">
                  WEATHER TWIN AI
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#2B1710]/10 text-[#2B1710] font-bold border border-[#2B1710]/20">
                  v2.4 TWIN-CORE
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#756D66] uppercase tracking-wider font-mono">
                WEATHER-DRIVEN EVENT DIGITAL TWIN
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-[#E4DED3] hidden md:block" />

          {/* Event Context Box */}
          <div className="flex items-center gap-3 bg-[#FFFEFB] px-3.5 py-1.5 rounded-lg border border-[#E4DED3] shadow-subtle">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#756D66] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#D92D3A] animate-ping" />
                <span>LIVE EVENT</span>
              </div>
              <span className="text-xs font-bold text-[#2A211D]">
                INDIA vs PAKISTAN
              </span>
            </div>
            <div className="h-6 w-px bg-[#E4DED3]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold text-[#756D66] uppercase">
                VENUE
              </span>
              <span className="text-xs font-bold text-[#2A211D]">
                100K CAPACITY STADIUM
              </span>
            </div>
            <div className="h-6 w-px bg-[#E4DED3]" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-mono font-bold text-[#756D66] uppercase">
                DIGITAL TWIN
              </span>
              <StatusBadge level="ACTIVE" size="sm" showDot={true} />
            </div>
          </div>
        </div>

        {/* Right: Operational Controls & Mode Selector */}
        <div className="flex flex-wrap items-center justify-between xl:justify-end gap-3">
          {/* Weather Source Selector */}
          <div className="flex items-center gap-1 bg-[#EFE8DB]/80 p-1 rounded-lg border border-[#E4DED3]">
            <select
              value={weatherSourceMode}
              onChange={(e) => setWeatherSourceMode(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-[#2A211D] px-2 py-1 outline-none font-mono cursor-pointer"
            >
              <option value="DEMO_MODE">DEMO WEATHER (Ahmedabad 28°C)</option>
              <option value="AUTO_LIVE">LIVE WEATHER API (Global Open-Meteo)</option>
            </select>

            {weatherSourceMode === 'AUTO_LIVE' && (
              <select
                value={selectedStadiumLocation}
                onChange={(e) => setSelectedStadiumLocation(e.target.value)}
                className="bg-[#FFFEFB] text-xs font-medium text-[#2A211D] px-2 py-1 rounded border border-[#E4DED3] outline-none"
              >
                {STADIUM_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => {
                playOperationalChime('click');
                refreshLiveWeather();
              }}
              disabled={isLoadingWeather}
              title="Refresh Weather Telemetry"
              className="p-1 rounded text-[#756D66] hover:text-[#2B1710] hover:bg-[#FFFEFB] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Live vs Simulation Toggle Switch */}
          <div className="flex items-center bg-[#EFE8DB] p-1 rounded-lg border border-[#E4DED3]">
            <button
              onClick={() => {
                setViewMode('LIVE');
                playOperationalChime('click');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'LIVE'
                  ? 'bg-[#2B1710] text-[#FFFEFB] shadow-subtle'
                  : 'text-[#756D66] hover:text-[#2B1710]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#2F7D45]" />
              <span>LIVE WORLD</span>
            </button>
            <button
              onClick={() => {
                setViewMode('SIMULATION');
                playOperationalChime('sim');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'SIMULATION'
                  ? 'bg-[#6B46C1] text-[#FFFEFB] shadow-subtle'
                  : 'text-[#756D66] hover:text-[#6B46C1]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>SIMULATION SANDBOX</span>
            </button>
          </div>

          {/* Guided Demo Presentation Tour Trigger */}
          <button
            onClick={() => {
              playOperationalChime('click');
              setIsDemoTourOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#2B1710] text-[#FFFEFB] hover:bg-[#422820] text-xs font-bold font-mono tracking-wider transition-all shadow-subtle"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EFE8DB]" />
            <span>GUIDED DEMO (10 STEPS)</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playOperationalChime('click');
            }}
            title={soundEnabled ? 'Disable Operational Sound' : 'Enable Operational Sound'}
            className="p-2 rounded-lg bg-[#FFFEFB] border border-[#E4DED3] text-[#756D66] hover:text-[#2B1710] transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#2F7D45]" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
