import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { DoorOpen, ArrowRight, ShieldAlert, Sparkles, MapPin, Gauge } from 'lucide-react';

export const GateDetailModal: React.FC = () => {
  const {
    selectedGate,
    setSelectedGate,
    setActiveRoute,
    applyRecommendation,
    recommendations,
  } = useOperational();

  if (!selectedGate) return null;

  const capacityPercent = Math.min(100, Math.round((selectedGate.entriesPerMin / selectedGate.capacityPerMin) * 100));

  const handleOpenWhatIf = () => {
    setSelectedGate(null);
    setActiveRoute('/manager/what-if');
  };

  const handleViewZone = () => {
    setSelectedGate(null);
    setActiveRoute('/manager/zones');
  };

  const handleApplyQuickDiversion = () => {
    const rec = recommendations.find(r => r.actionType === 'redirect_entry');
    if (rec) applyRecommendation(rec.id);
    setSelectedGate(null);
  };

  return (
    <Modal
      isOpen={!!selectedGate}
      onClose={() => setSelectedGate(null)}
      title={`${selectedGate.name} • OPERATIONAL BREAKDOWN`}
      subtitle={`Location: ${selectedGate.location} • Connected Hub: ${selectedGate.connectedZone}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Status banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#FCFAF7] border border-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary text-beige flex items-center justify-center font-mono font-bold">
              <DoorOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-light-brown uppercase">
                SECURITY & SCANNING POST
              </span>
              <h4 className="text-lg font-bold text-primary">
                {selectedGate.name} ({selectedGate.location})
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-secondary-text">Threat Level:</span>
            <StatusBadge status={selectedGate.risk} showPulse={selectedGate.risk === 'HIGH' || selectedGate.risk === 'CRITICAL'} />
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white border border-border">
            <span className="text-[10px] font-mono text-secondary-text uppercase font-bold">
              CURRENT FLOW
            </span>
            <div className="text-xl font-black font-mono text-primary mt-1">
              {selectedGate.entriesPerMin.toLocaleString()}
              <span className="text-xs font-normal text-secondary-text">/min</span>
            </div>
            <span className="text-[10px] text-secondary-text font-mono">Turnstile Ingress</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-border">
            <span className="text-[10px] font-mono text-secondary-text uppercase font-bold">
              ACTIVE QUEUE
            </span>
            <div className={`text-xl font-black font-mono mt-1 ${selectedGate.status === 'HIGH' ? 'text-[#DC2626]' : 'text-primary'}`}>
              {selectedGate.queueCount.toLocaleString()}
            </div>
            <span className="text-[10px] text-secondary-text font-mono">Persons in Line</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-border">
            <span className="text-[10px] font-mono text-secondary-text uppercase font-bold">
              PROJECTED (15 MIN)
            </span>
            <div className="text-xl font-black font-mono text-[#D97706] mt-1">
              {selectedGate.projectedQueue15m.toLocaleString()}
            </div>
            <span className="text-[10px] text-secondary-text font-mono">Predictive Horizon</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-border">
            <span className="text-[10px] font-mono text-secondary-text uppercase font-bold">
              RISK ASSESSMENT
            </span>
            <div className="text-lg font-black font-mono text-primary mt-1 flex items-center gap-1">
              <ShieldAlert className={`w-4 h-4 ${selectedGate.risk === 'HIGH' ? 'text-[#DC2626]' : 'text-[#2E7D32]'}`} />
              {selectedGate.risk}
            </div>
            <span className="text-[10px] text-secondary-text font-mono">Flow Velocity</span>
          </div>
        </div>

        {/* Load Progress bar */}
        <div className="p-4 rounded-xl bg-[#FCFAF7] border border-border">
          <div className="flex items-center justify-between text-xs font-mono text-secondary-text mb-1.5">
            <span className="font-semibold text-primary">Throughput Capacity Load</span>
            <span className="font-bold">{capacityPercent}% ({selectedGate.entriesPerMin} / {selectedGate.capacityPerMin} max/min)</span>
          </div>
          <ProgressBar value={capacityPercent} height="md" variant="auto" />
        </div>

        {/* AI Recommendation Box */}
        <div className="p-4 rounded-xl bg-[#FFFDF5] border border-[#FDE68A]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#975A16] uppercase">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            AI Operational Recommendation
          </div>
          <p className="text-sm font-semibold text-primary mt-1.5 leading-relaxed">
            “{selectedGate.recommendedAction}”
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-secondary-text font-mono">
              Estimated wait time reduction: <strong className="text-[#2E7D32]">~18%</strong>
            </span>
            {selectedGate.id === 'gate-3' && (
              <button
                onClick={handleApplyQuickDiversion}
                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold font-mono transition-colors shadow-sm"
              >
                Execute Diversion Now
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            onClick={() => setSelectedGate(null)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border hover:bg-beige text-xs font-bold text-secondary-text transition-colors"
          >
            Close Panel
          </button>
          <button
            onClick={handleViewZone}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-beige hover:bg-beige-dark text-xs font-bold text-primary transition-colors flex items-center justify-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-light-brown" />
            VIEW ZONE ({selectedGate.connectedZone})
          </button>
          <button
            onClick={handleOpenWhatIf}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-beige" />
            OPEN WHAT-IF SIMULATION
          </button>
        </div>
      </div>
    </Modal>
  );
};
