import React, { useState } from 'react';
import { useOperational } from '../../context/OperationalContext';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { MapPin, Users, Sparkles, UserPlus, Gauge, Clock, Check } from 'lucide-react';

export const ZoneDetailModal: React.FC = () => {
  const {
    selectedZone,
    setSelectedZone,
    setActiveRoute,
    createTask,
  } = useOperational();

  const [staffAssigned, setStaffAssigned] = useState(false);

  if (!selectedZone) return null;

  const handleOpenWhatIf = () => {
    setSelectedZone(null);
    setActiveRoute('/manager/what-if');
  };

  const handleViewFlow = () => {
    setSelectedZone(null);
    setActiveRoute('/manager/live');
  };

  const handleAssignStaff = () => {
    createTask(
      `DEPLOY SECURITY & MARSHALS TO ${selectedZone.name}`,
      selectedZone.occupancyPercent >= 90 ? 'CRITICAL' : 'HIGH',
      'Rapid Response Team Echo',
      selectedZone.subtitle,
      `Crowd density reached ${selectedZone.density}. Manage perimeter corridors and guide egress flow.`
    );
    setStaffAssigned(true);
    setTimeout(() => {
      setStaffAssigned(false);
      setSelectedZone(null);
      setActiveRoute('/manager/tasks');
    }, 900);
  };

  return (
    <Modal
      isOpen={!!selectedZone}
      onClose={() => setSelectedZone(null)}
      title={`${selectedZone.name} • ${selectedZone.subtitle}`}
      subtitle={`Total Venue Zone Allocation • Safe Capacity Limit: ${selectedZone.capacity.toLocaleString()} Attendees`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Header telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#FCFAF7] border border-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary text-beige flex items-center justify-center font-mono font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-light-brown uppercase">
                VENUE SECTOR ANALYSIS
              </span>
              <h4 className="text-lg font-bold text-primary">
                {selectedZone.name} — {selectedZone.subtitle}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-secondary-text">Status:</span>
            <StatusBadge status={selectedZone.status} showPulse={selectedZone.status === 'CRITICAL' || selectedZone.status === 'HIGH'} />
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white border border-border">
            <span className="text-[10px] font-mono text-secondary-text uppercase font-bold">
              CURRENT OCCUPANCY
            </span>
            <div className="text-xl font-black font-mono text-primary mt-1">
              {selectedZone.currentCount.toLocaleString()}
            </div>
            <span className="text-[10px] text-secondary-text font-mono">
              of {selectedZone.capacity.toLocaleString()} Max
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-border">
            <span className="text-[10px] font-mono text-secondary-text uppercase font-bold">
              UTILIZATION
            </span>
            <div className={`text-xl font-black font-mono mt-1 ${selectedZone.occupancyPercent >= 90 ? 'text-[#DC2626]' : 'text-primary'}`}>
              {selectedZone.occupancyPercent}%
            </div>
            <span className="text-[10px] text-secondary-text font-mono">Dynamic Capacity</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-border">
            <span className="text-[10px] font-mono text-secondary-text uppercase font-bold">
              CROWD DENSITY
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-primary mt-1 flex items-center gap-1">
              <Gauge className="w-4 h-4 text-light-brown" />
              {selectedZone.density}
            </div>
            <span className="text-[10px] text-secondary-text font-mono">Safety Index</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-border">
            <span className="text-[10px] font-mono text-secondary-text uppercase font-bold">
              NET INFLOW RATE
            </span>
            <div className="text-lg font-black font-mono text-[#2E7D32] mt-1">
              +{selectedZone.incomingRate - selectedZone.outgoingRate}/m
            </div>
            <span className="text-[10px] text-secondary-text font-mono">
              +{selectedZone.incomingRate} in / -{selectedZone.outgoingRate} out
            </span>
          </div>
        </div>

        {/* Capacity Progress */}
        <div className="p-4 rounded-xl bg-[#FCFAF7] border border-border">
          <div className="flex items-center justify-between text-xs font-mono text-secondary-text mb-1.5">
            <span className="font-semibold text-primary">Sector Capacity Threshold</span>
            <span className="font-bold">{selectedZone.occupancyPercent}%</span>
          </div>
          <ProgressBar value={selectedZone.occupancyPercent} height="md" variant="auto" />
        </div>

        {/* Predictive Horizon Timeline */}
        <div className="p-4 rounded-xl bg-white border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-secondary-text uppercase flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-secondary" />
              PREDICTIVE OCCUPANCY HORIZON
            </span>
            <span className="text-[11px] font-mono text-light-brown font-semibold">
              Proprietary LSTM Forecast
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#FCFAF7] border border-border">
              <span className="text-[11px] font-mono text-secondary-text font-bold">+30 MIN</span>
              <div className={`text-xl font-black font-mono mt-1 ${selectedZone.projected30m >= 95 ? 'text-[#DC2626]' : 'text-primary'}`}>
                {selectedZone.projected30m}%
              </div>
              <span className="text-[10px] font-mono text-secondary-text">Projected Surge</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FCFAF7] border border-border">
              <span className="text-[11px] font-mono text-secondary-text font-bold">+60 MIN</span>
              <div className={`text-xl font-black font-mono mt-1 ${selectedZone.projected60m >= 95 ? 'text-[#DC2626]' : 'text-primary'}`}>
                {selectedZone.projected60m}%
              </div>
              <span className="text-[10px] font-mono text-secondary-text">Projected Surge</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FCFAF7] border border-border">
              <span className="text-[11px] font-mono text-secondary-text font-bold">+120 MIN</span>
              <div className={`text-xl font-black font-mono mt-1 ${selectedZone.projected120m >= 95 ? 'text-[#DC2626]' : 'text-primary'}`}>
                {selectedZone.projected120m}%
              </div>
              <span className="text-[10px] font-mono text-secondary-text">Peak Finale</span>
            </div>
          </div>
        </div>

        {/* AI Action */}
        <div className="p-4 rounded-xl bg-[#FFFDF5] border border-[#FDE68A]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#975A16] uppercase">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            AI Recommended Operational Action
          </div>
          <p className="text-sm font-semibold text-primary mt-1.5 leading-relaxed">
            “{selectedZone.recommendedAction}”
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            onClick={() => setSelectedZone(null)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border hover:bg-beige text-xs font-bold text-secondary-text transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleViewFlow}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-beige hover:bg-beige-dark text-xs font-bold text-primary transition-colors flex items-center justify-center gap-1.5"
          >
            <Users className="w-4 h-4 text-light-brown" />
            VIEW FLOW IN LIVE MAP
          </button>
          <button
            onClick={handleAssignStaff}
            disabled={staffAssigned}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              staffAssigned ? 'bg-[#2E7D32] text-white' : 'bg-secondary hover:bg-primary text-white'
            }`}
          >
            {staffAssigned ? (
              <>
                <Check className="w-4 h-4" /> TASK DISPATCHED
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-beige" /> ASSIGN RAPID RESPONSE STAFF
              </>
            )}
          </button>
          <button
            onClick={handleOpenWhatIf}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-beige" />
            RUN WHAT-IF
          </button>
        </div>
      </div>
    </Modal>
  );
};
