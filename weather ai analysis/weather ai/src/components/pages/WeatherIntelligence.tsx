import React from 'react';
import { useTwin } from '../../context/TwinContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  CloudRain,
  Wind,
  Droplets,
  Eye,
  Zap,
  Gauge,
  Thermometer,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

export const WeatherIntelligence: React.FC = () => {
  const {
    liveWeather,
    liveForecast,
    liveCascade,
    simCascade,
    viewMode,
    simParams,
    weatherSourceMode,
    selectedStadiumLocation,
    setActiveTab,
  } = useTwin();

  const activeData = viewMode === 'LIVE' ? liveCascade : simCascade;
  const activeWeather =
    viewMode === 'LIVE'
      ? liveWeather
      : {
          ...liveWeather,
          temperature: simParams.temperature,
          rainfall: simParams.rainfall,
          windSpeed: simParams.windSpeed,
        };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#2B1710] font-display">
              WEATHER INTELLIGENCE & IMPACT FORECAST
            </h2>
            <StatusBadge level={activeData.weatherRisk} size="sm" />
          </div>
          <p className="text-xs text-[#756D66] font-mono mt-0.5">
            Atmospheric sensor telemetry, radar reflectivity, and ecosystem impact prediction matrix
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#FFFEFB] px-3 py-1.5 rounded-lg border border-[#E4DED3]">
          <span className="text-[#756D66]">STATION:</span>
          <strong className="text-[#2A211D]">{liveWeather.locationName}</strong>
          <span className="text-[#9C948B]">|</span>
          <span className="text-[#2F7D45] font-bold">● TELEMETRY SYNCED</span>
        </div>
      </div>

      {/* 1. CURRENT CONDITIONS (Requirement 7) */}
      <div className="glass-card rounded-2xl p-6 border border-[#E4DED3]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-[#2B1710] font-mono uppercase tracking-wider">
            ATMOSPHERIC TELEMETRY SENSORS (CURRENT CONDITIONS)
          </h3>
          <span className="text-xs font-mono text-[#756D66]">
            Source: <strong className="text-[#2A211D]">{liveWeather.source}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Temperature */}
          <div className="bg-[#F7F4ED] p-3.5 rounded-xl border border-[#E4DED3]">
            <div className="flex items-center gap-1.5 text-xs text-[#756D66] font-mono mb-1">
              <Thermometer className="w-3.5 h-3.5 text-[#D9822B]" />
              <span>TEMPERATURE</span>
            </div>
            <div className="text-2xl font-black text-[#2A211D] font-display">
              {activeWeather.temperature}°C
            </div>
            <div className="text-[10px] font-mono text-[#756D66] mt-0.5">
              Dew Point: {activeWeather.dewPoint}°C
            </div>
          </div>

          {/* Rainfall */}
          <div className="bg-[#F7F4ED] p-3.5 rounded-xl border border-[#E4DED3]">
            <div className="flex items-center gap-1.5 text-xs text-[#756D66] font-mono mb-1">
              <CloudRain className="w-3.5 h-3.5 text-[#2B6CB0]" />
              <span>RAINFALL</span>
            </div>
            <div className="text-2xl font-black text-[#2A211D] font-display">
              {activeWeather.rainfall} <span className="text-xs font-mono">mm/h</span>
            </div>
            <div className="text-[10px] font-mono text-[#2B6CB0] font-bold mt-0.5">
              Prob: {activeWeather.rainProbability}%
            </div>
          </div>

          {/* Wind Speed */}
          <div className="bg-[#F7F4ED] p-3.5 rounded-xl border border-[#E4DED3]">
            <div className="flex items-center gap-1.5 text-xs text-[#756D66] font-mono mb-1">
              <Wind className="w-3.5 h-3.5 text-[#756D66]" />
              <span>WIND SPEED</span>
            </div>
            <div className="text-2xl font-black text-[#2A211D] font-display">
              {activeWeather.windSpeed} <span className="text-xs font-mono">km/h</span>
            </div>
            <div className="text-[10px] font-mono text-[#756D66] mt-0.5">
              Gusts: {activeWeather.windSpeed + 12} km/h ENE
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-[#F7F4ED] p-3.5 rounded-xl border border-[#E4DED3]">
            <div className="flex items-center gap-1.5 text-xs text-[#756D66] font-mono mb-1">
              <Droplets className="w-3.5 h-3.5 text-[#2B6CB0]" />
              <span>HUMIDITY</span>
            </div>
            <div className="text-2xl font-black text-[#2A211D] font-display">
              {activeWeather.humidity}%
            </div>
            <div className="text-[10px] font-mono text-[#756D66] mt-0.5">
              High ambient moisture
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-[#F7F4ED] p-3.5 rounded-xl border border-[#E4DED3]">
            <div className="flex items-center gap-1.5 text-xs text-[#756D66] font-mono mb-1">
              <Eye className="w-3.5 h-3.5 text-[#2F7D45]" />
              <span>VISIBILITY</span>
            </div>
            <div className="text-2xl font-black text-[#2A211D] font-display">
              {activeWeather.visibility} <span className="text-xs font-mono">km</span>
            </div>
            <div className="text-[10px] font-mono text-[#756D66] mt-0.5">
              Minor spray fog
            </div>
          </div>

          {/* Storm Probability */}
          <div className="bg-[#F7F4ED] p-3.5 rounded-xl border border-[#E4DED3]">
            <div className="flex items-center gap-1.5 text-xs text-[#756D66] font-mono mb-1">
              <Zap className="w-3.5 h-3.5 text-[#D9822B]" />
              <span>STORM PROB</span>
            </div>
            <div className="text-2xl font-black text-[#D9822B] font-display">
              {activeWeather.stormProbability}%
            </div>
            <div className="text-[10px] font-mono text-[#756D66] mt-0.5">
              Baro: {activeWeather.pressure} hPa
            </div>
          </div>
        </div>
      </div>

      {/* 2. FORECAST TIMELINE (NOW, +30 MIN, +1 HR, +2 HR, +3 HR) */}
      <div className="glass-card rounded-2xl p-6 border border-[#E4DED3]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2B1710]" />
            <h3 className="text-sm font-black text-[#2B1710] font-mono uppercase tracking-wider">
              PRECIPITATION & WIND FORECAST TIMELINE (MATCH WINDOW)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#756D66]">
            Interval: 30-min resolution
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {liveForecast.map((hour, idx) => (
            <div
              key={hour.timeLabel}
              className={`p-4 rounded-xl border transition-all ${
                idx === 0
                  ? 'bg-[#2B1710] text-[#FFFEFB] border-[#2B1710] shadow-card'
                  : 'bg-[#F7F4ED] border-[#E4DED3] text-[#2A211D]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-black uppercase">
                  {hour.timeLabel}
                </span>
                <StatusBadge level={hour.risk} size="sm" showDot={false} />
              </div>

              <div className="text-xl font-black font-display mb-1">
                {hour.rainfall} <span className="text-xs font-mono">mm/h</span>
              </div>

              <div className={`text-xs font-medium mb-3 ${idx === 0 ? 'text-[#EFE8DB]' : 'text-[#756D66]'}`}>
                {hour.condition}
              </div>

              <div className={`pt-2 border-t text-[11px] font-mono space-y-1 ${
                idx === 0 ? 'border-[#422820] text-[#EFE8DB]' : 'border-[#E4DED3] text-[#756D66]'
              }`}>
                <div className="flex justify-between">
                  <span>Rain Prob:</span>
                  <strong>{hour.rainProb}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Wind:</span>
                  <strong>{hour.wind} km/h</strong>
                </div>
                <div className="flex justify-between">
                  <span>Temp:</span>
                  <strong>{hour.temp}°C</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. WEATHER IMPACT FORECAST MATRIX (Requirement 7) */}
      <div className="glass-card rounded-2xl p-6 border border-[#E4DED3]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E4DED3]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2B1710]" />
              <h3 className="text-sm font-black text-[#2B1710] font-mono uppercase tracking-wider">
                WEATHER IMPACT FORECAST MATRIX (UNCERTAINTY-AWARE)
              </h3>
            </div>
            <p className="text-xs text-[#756D66] font-mono">
              Deterministic cascade predictions with confidence intervals and risk ratings
            </p>
          </div>
          <button
            onClick={() => setActiveTab('impact-propagation')}
            className="px-3 py-1.5 rounded-lg bg-[#EFE8DB] hover:bg-[#E4DED3] text-xs font-bold font-mono text-[#2B1710] transition-colors"
          >
            VIEW FULL CASCADE CHAIN →
          </button>
        </div>

        {/* Impact Table / Grid */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E4DED3] text-[11px] font-mono font-bold text-[#756D66] uppercase">
                <th className="py-2.5 px-3">Ecosystem Vector</th>
                <th className="py-2.5 px-3">Baseline</th>
                <th className="py-2.5 px-3">Predicted Change</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Possible Uncertainty Range</th>
                <th className="py-2.5 px-3 text-right">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DED3]/60 text-xs font-mono">
              {activeData.metrics.map((metric) => (
                <tr key={metric.id} className="hover:bg-[#EFE8DB]/30 transition-colors">
                  <td className="py-3 px-3">
                    <strong className="text-[#2A211D] block font-sans font-bold text-sm">
                      {metric.name}
                    </strong>
                    <span className="text-[10px] text-[#756D66]">
                      {metric.formulaDescription}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#756D66]">
                    {metric.baselineValue} {metric.unit}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        metric.predictedChange > 15
                          ? 'bg-[#D92D3A]/10 text-[#D92D3A]'
                          : metric.predictedChange > 5
                          ? 'bg-[#D9822B]/10 text-[#D9822B]'
                          : 'bg-[#2F7D45]/10 text-[#2F7D45]'
                      }`}
                    >
                      {metric.changeLabel}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#E4DED3] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2B1710] h-full rounded-full"
                          style={{ width: `${metric.confidence}%` }}
                        />
                      </div>
                      <strong className="text-[#2A211D]">{metric.confidence}%</strong>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#2A211D] font-bold">
                    [{metric.possibleRange[0]}% — {metric.possibleRange[1]}%]
                  </td>
                  <td className="py-3 px-3 text-right">
                    <StatusBadge level={metric.riskLevel} size="sm" />
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
