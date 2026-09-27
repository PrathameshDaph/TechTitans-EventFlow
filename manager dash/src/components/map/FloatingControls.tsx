import React, { useState } from 'react';
import { useOperational } from '../../context/OperationalContext';
import {
  Layers,
  Sparkles,
  AlertTriangle,
  Flame,
  Check,
  ArrowRight,
  Shield,
  Eye,
  SlidersHorizontal,
  X,
  Compass,
} from 'lucide-react';
import { MapLayerState } from '../../types';

export const FloatingControls: React.FC = () => {
  const {
    mapLayers,
    toggleMapLayer,
    recommendations,
    incidents,
    applyRecommendation,
    dismissRecommendation,
    setIsEmergencySheetOpen,
    setSelectedIncidentForAuth,
    setIsAiAssistantOpen,
  } = useOperational();

  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);

  // Active top recommendation
  const activeRec = recommendations.find(r => r.status === 'PENDING') || recommendations[0];
  const criticalIncident = incidents.find(i => i.severity === 'CRITICAL' && i.status === 'ACTIVE');

  // Count active layers
  const activeLayersCount = Object.values(mapLayers).filter(Boolean).length;

  const layerItems: { key: keyof MapLayerState; label: string; icon: string }[] = [
    { key: 'crowdDensity', label: 'Crowd Density Heatmap', icon: '👥' },
    { key: 'gates', label: 'Gates & Turnstiles', icon: '🚪' },
    { key: 'emergencyExits', label: 'Emergency Exits', icon: '🚪' },
    { key: 'medical', label: 'Medical Stations', icon: '🏥' },
    { key: 'crew', label: 'Field Crew Locations', icon: '👷' },
    { key: 'parking', label: 'Parking Occupancy', icon: '🚗' },
    { key: 'incidents', label: 'Incident Markers', icon: '⚠️' },
    { key: 'recommendations', label: 'AI Directives', icon: '✨' },
    { key: 'routes', label: 'Operational Routes', icon: '↗️' },
    { key: 'cameras', label: 'Surveillance CCTVs', icon: '📹' },
  ];

  return (
    <div className="pointer-events-none relative z-30">
      {/* 1. BOTTOM-LEFT: FLOATING MAP LAYERS PILL & POPOVER */}
      <div className="absolute left-4 bottom-4 pointer-events-auto">
        <div className="relative">
          <button
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className="glass-pill px-3.5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer text-[#2B211B] text-xs font-mono font-bold"
            aria-expanded={isLayersOpen}
            aria-label="Map Layers Menu"
          >
            <Layers className="w-4 h-4 text-[#B66A4C]" />
            <span>LAYERS ({activeLayersCount}/10)</span>
          </button>

          {/* Floating Layers Dropdown Popover */}
          {isLayersOpen && (
            <div className="absolute bottom-12 left-0 w-64 bg-white/95 backdrop-blur-xl border border-[#E3DDD2] rounded-2xl shadow-elevated p-3 space-y-1 animate-in fade-in zoom-in-95 duration-150 text-[#2B211B]">
              <div className="flex items-center justify-between pb-2 border-b border-[#E3DDD2] px-1">
                <span className="text-[10px] font-mono font-black text-[#806C5D] uppercase tracking-wider">
                  TOGGLE MAP LAYERS
                </span>
                <button
                  onClick={() => setIsLayersOpen(false)}
                  className="text-[#806C5D] hover:text-[#2B211B] p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-0.5 pt-1">
                {layerItems.map((item) => {
                  const isActive = mapLayers[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleMapLayer(item.key)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#F6F3ED] text-[#2B211B] font-bold'
                          : 'text-[#806C5D] hover:bg-[#F6F3ED]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-[#2B211B] border-[#2B211B] text-white'
                            : 'border-[#D8CEBF] bg-white'
                        }`}
                      >
                        {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. BOTTOM-CENTER: FLOATING AI RECOMMENDATION PILL / QUICK ACTION */}
      {activeRec && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 pointer-events-auto max-w-lg w-full px-4 hidden md:block">
          <div className="glass-pill px-4 py-2.5 rounded-full flex items-center justify-between gap-3 text-xs shadow-elevated border border-[#B66A4C]/30 bg-white/95">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#B66A4C]/15 text-[#B66A4C] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#B66A4C]" />
              </div>
              <div className="truncate">
                <span className="font-mono font-black text-[#2B211B] mr-2">
                  AI RECOMMENDATION:
                </span>
                <span className="text-[#5A4638] font-medium truncate">
                  {activeRec.recommendedAction}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => applyRecommendation(activeRec.id)}
                className="px-3 py-1 rounded-full bg-[#2B211B] hover:bg-[#3d2f26] text-white font-mono font-bold text-[11px] transition-colors cursor-pointer"
              >
                Execute
              </button>
              <button
                onClick={() => dismissRecommendation(activeRec.id)}
                className="px-2.5 py-1 rounded-full bg-[#EEE9DF] hover:bg-[#E2DBD0] text-[#5A4638] font-mono text-[11px] transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOTTOM-RIGHT: FLOATING EMERGENCY SHORTCUT */}
      <div className="absolute right-4 bottom-4 pointer-events-auto">
        <button
          onClick={() => {
            if (criticalIncident) {
              setSelectedIncidentForAuth(criticalIncident);
            } else {
              setIsEmergencySheetOpen(true);
            }
          }}
          className={`glass-pill px-4 py-2.5 rounded-full flex items-center gap-2 cursor-pointer text-xs font-mono font-extrabold shadow-elevated transition-all ${
            criticalIncident
              ? 'bg-[#FEE2E2]/95 border-[#DC2626] text-[#DC2626] pulse-critical'
              : 'text-[#2B211B] hover:border-primary'
          }`}
          aria-label="Emergency Response"
        >
          {criticalIncident ? (
            <>
              <Flame className="w-4 h-4 text-[#DC2626] animate-bounce" />
              <span>CRITICAL INCIDENT (AUTH REQ)</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>EMERGENCY DESK</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
