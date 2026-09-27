import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import {
  X,
  DoorOpen,
  MapPin,
  Users,
  AlertTriangle,
  Flame,
  Plus,
  LogOut,
  Car,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  CornerDownRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const IntelligenceSheet: React.FC = () => {
  const {
    selectedEntity,
    setSelectedEntity,
    zones,
    gates,
    crew,
    routes,
    recommendations,
    applyRecommendation,
    setIsAiAssistantOpen,
    setSelectedIncidentForAuth,
    setActiveRoute,
    addToast,
  } = useOperational();

  if (!selectedEntity) return null;

  const handleClose = () => setSelectedEntity(null);

  // Find relevant AI recommendation for this entity if any
  const relevantRec = recommendations.find(
    r =>
      r.affectedLocation.toLowerCase().includes(selectedEntity.code.toLowerCase()) ||
      r.affectedLocation.toLowerCase().includes(selectedEntity.name.toLowerCase()) ||
      (selectedEntity.type === 'GATE' && r.id === 'rec-001' && selectedEntity.code === 'G3') ||
      (selectedEntity.type === 'ZONE' && r.id === 'rec-002' && selectedEntity.code === 'E')
  );

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg bg-white/95 backdrop-blur-2xl border-l border-[#E3DDD2] shadow-elevated flex flex-col animate-in slide-in-from-right duration-300 text-[#2B211B]"
      role="dialog"
      aria-label="Intelligence Sheet"
    >
      {/* Header */}
      <div className="p-5 border-b border-[#E3DDD2] bg-[#FAF8F5]/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#2B211B] text-[#F6F3ED] flex items-center justify-center font-bold">
            {selectedEntity.type === 'GATE' && <DoorOpen className="w-5 h-5 text-[#B66A4C]" />}
            {selectedEntity.type === 'ZONE' && <MapPin className="w-5 h-5 text-[#B66A4C]" />}
            {selectedEntity.type === 'EXTERNAL_ZONE' && <MapPin className="w-5 h-5 text-[#2E7D32]" />}
            {selectedEntity.type === 'MEDICAL' && <Plus className="w-5 h-5 text-[#2E7D32]" />}
            {selectedEntity.type === 'EXIT' && <LogOut className="w-5 h-5 text-[#2E7D32]" />}
            {selectedEntity.type === 'PARKING' && <Car className="w-5 h-5 text-[#B66A4C]" />}
            {selectedEntity.type === 'CREW' && <Users className="w-5 h-5 text-[#2B211B]" />}
            {selectedEntity.type === 'INCIDENT' && <AlertTriangle className="w-5 h-5 text-[#DC2626]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-[#806C5D] uppercase tracking-wider">
                {selectedEntity.type} TELEMETRY
              </span>
              <span
                className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full uppercase ${
                  selectedEntity.status === 'CRITICAL' || selectedEntity.status === 'CONGESTED'
                    ? 'bg-[#FEE2E2] text-[#DC2626]'
                    : selectedEntity.status === 'HIGH' || selectedEntity.status === 'ELEVATED'
                    ? 'bg-[#FEF3C7] text-[#D97706]'
                    : 'bg-[#E8F5E9] text-[#2E7D32]'
                }`}
              >
                {selectedEntity.status}
              </span>
            </div>
            <h2 className="text-lg font-black text-[#2B211B] tracking-tight">
              {selectedEntity.code} — {selectedEntity.name}
            </h2>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-9 h-9 rounded-xl hover:bg-[#EEE9DF] border border-transparent hover:border-[#E3DDD2] flex items-center justify-center text-[#806C5D] hover:text-[#2B211B] transition-colors cursor-pointer"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Entity Primary Metrics Card */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {selectedEntity.capacity && (
              <div>
                <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase block">CAPACITY</span>
                <span className="text-base font-mono font-black text-[#2B211B]">
                  {selectedEntity.capacity.toLocaleString()}
                </span>
              </div>
            )}

            {selectedEntity.currentLoad !== undefined && (
              <div>
                <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase block">
                  {selectedEntity.type === 'GATE' ? 'FLOW RATE' : 'OCCUPANCY / LOAD'}
                </span>
                <span className="text-base font-mono font-black text-[#2B211B]">
                  {selectedEntity.currentLoad.toLocaleString()}
                  {selectedEntity.type === 'GATE' && <span className="text-xs font-normal text-[#806C5D]"> /min</span>}
                </span>
              </div>
            )}

            {selectedEntity.metadata?.queueCount !== undefined && (
              <div>
                <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase block">QUEUE LENGTH</span>
                <span className="text-base font-mono font-black text-[#DC2626]">
                  {selectedEntity.metadata.queueCount} spectators
                </span>
              </div>
            )}

            {selectedEntity.metadata?.waitTimeMinutes !== undefined && (
              <div>
                <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase block">AVG WAIT TIME</span>
                <span className="text-base font-mono font-black text-[#D97706]">
                  ~{selectedEntity.metadata.waitTimeMinutes} mins
                </span>
              </div>
            )}

            {selectedEntity.metadata?.densityText && (
              <div>
                <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase block">SPATIAL DENSITY</span>
                <span className="text-base font-mono font-black text-[#2B211B]">
                  {selectedEntity.metadata.densityText}
                </span>
              </div>
            )}

            {selectedEntity.metadata?.available !== undefined && (
              <div>
                <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase block">AVAILABLE BAYS</span>
                <span className="text-base font-mono font-black text-[#2E7D32]">
                  {selectedEntity.metadata.available} stalls
                </span>
              </div>
            )}

            {selectedEntity.metadata?.task && (
              <div className="col-span-2">
                <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase block">ACTIVE TASK</span>
                <span className="text-sm font-medium text-[#2B211B]">
                  {selectedEntity.metadata.task}
                </span>
              </div>
            )}
          </div>

          {selectedEntity.zone && (
            <div className="pt-2 border-t border-[#E3DDD2]/80 flex items-center justify-between text-xs font-mono">
              <span className="text-[#806C5D]">LOCATION SECTOR:</span>
              <span className="font-bold text-[#2B211B]">{selectedEntity.zone}</span>
            </div>
          )}
        </div>

        {/* AI Recommendations Module for this Entity */}
        {relevantRec ? (
          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#FDE68A] space-y-3 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-black text-[#B45309] uppercase">
                <Sparkles className="w-4 h-4 text-[#B66A4C]" />
                AI RECOMMENDATION AVAILABLE
              </div>
              <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
                CONFIDENCE: {relevantRec.confidence.toUpperCase()}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-black text-[#2B211B]">{relevantRec.title}</h4>
              <p className="text-xs text-[#5A4638] mt-1 leading-relaxed">{relevantRec.description}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#FDE68A] text-xs font-mono">
              <span className="text-[9px] font-bold text-[#806C5D] uppercase block">RATIONALE:</span>
              <span className="text-[#2B211B]">{relevantRec.reason}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => applyRecommendation(relevantRec.id)}
                disabled={relevantRec.applied}
                className="flex-1 py-2 px-3 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {relevantRec.applied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                    APPLIED
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-3.5 h-3.5" />
                    EXECUTE ACTION
                  </>
                )}
              </button>

              <button
                onClick={() => setIsAiAssistantOpen(true)}
                className="py-2 px-3 rounded-xl bg-white hover:bg-[#EEE9DF] border border-[#E3DDD2] text-[#2B211B] text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                ASK AI WHY
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] text-center space-y-1">
            <span className="text-xs font-mono text-[#806C5D] block">
              No active AI intervention required for {selectedEntity.code}.
            </span>
            <span className="text-[11px] text-[#2E7D32] font-semibold">
              Telemetry within nominal thresholds.
            </span>
          </div>
        )}

        {/* Incident-Specific Emergency Human Authorization Callout */}
        {selectedEntity.type === 'INCIDENT' && selectedEntity.metadata?.requiresHumanAuth && (
          <div className="p-4 rounded-2xl bg-[#FFF5F5] border-2 border-[#FECACA] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-black text-[#DC2626]">
              <Shield className="w-4 h-4 text-[#DC2626]" />
              CRITICAL INCIDENT — HUMAN AUTHORIZATION REQUIRED
            </div>
            <p className="text-xs text-[#7F1D1D] leading-relaxed">
              Automated systems cannot execute high-risk suppression or full sector evacuation without verified manager credentials.
            </p>
            <button
              onClick={() => {
                const inc = {
                  id: selectedEntity.id,
                  title: selectedEntity.name,
                  description: selectedEntity.metadata?.description || '',
                  severity: selectedEntity.severity || 'CRITICAL',
                  type: 'FIRE' as any,
                  zoneId: 'zone-d',
                  locationName: selectedEntity.zone,
                  timestamp: selectedEntity.metadata?.timestamp || 'Just now',
                  status: 'ACTIVE' as any,
                  recommendedResponse: selectedEntity.metadata?.recommendedResponse || '',
                  requiresHumanAuth: true,
                  x: selectedEntity.x,
                  y: selectedEntity.y,
                };
                setSelectedIncidentForAuth(inc);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              REVIEW & AUTHORIZE PROTOCOL
            </button>
          </div>
        )}

        {/* Operational Actions Grid */}
        <div className="space-y-2 pt-2 border-t border-[#E3DDD2]">
          <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase tracking-wider block">
            OPERATIONAL ACTIONS
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (selectedEntity.type === 'GATE' && selectedEntity.code === 'G3') {
                  const z = zones.find(zn => zn.code === 'C');
                  if (z) {
                    setSelectedEntity({
                      id: z.id,
                      type: 'ZONE',
                      code: z.code,
                      name: z.name,
                      zone: z.name,
                      status: z.status,
                      capacity: z.capacity,
                      currentLoad: z.currentCount,
                      x: z.x,
                      y: z.y,
                      metadata: { densityPercent: z.densityPercent, densityText: z.densityText },
                    });
                  }
                } else {
                  setActiveRoute('/manager/zones');
                }
              }}
              className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-xs font-mono font-bold text-[#2B211B] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#B66A4C]" />
              View Zone
            </button>

            <button
              onClick={() => {
                setActiveRoute('/manager/tasks');
                addToast('info', 'Crew Dispatch', `Assigning tactical crew to ${selectedEntity.name}.`);
              }}
              className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-xs font-mono font-bold text-[#2B211B] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#B66A4C]" />
              Assign Crew
            </button>

            <button
              onClick={() => {
                addToast('info', 'Active Operational Route', `Highlighted tactical corridor for ${selectedEntity.code}.`);
              }}
              className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-xs font-mono font-bold text-[#2B211B] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-[#B66A4C]" />
              Open Route
            </button>

            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-xs font-mono font-bold text-[#2B211B] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B66A4C]" />
              Ask AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
