import React, { useState } from 'react';
import { useOperational } from '../../context/OperationalContext';
import {
  X,
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Shield,
  FileCheck,
} from 'lucide-react';

export const EmergencyAuthorizationModal: React.FC = () => {
  const {
    selectedIncidentForAuth,
    setSelectedIncidentForAuth,
    authorizeIncidentAction,
    addToast,
  } = useOperational();

  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState<boolean>(false);
  const [managerNotes, setManagerNotes] = useState<string>('Confirmed on-site status via CCTV & Field Radio.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!selectedIncidentForAuth) return null;

  const handleClose = () => {
    setSelectedIncidentForAuth(null);
    setHasConfirmedCheckbox(false);
  };

  const handleAuthorize = async () => {
    if (!hasConfirmedCheckbox || isSubmitting) return;
    setIsSubmitting(true);
    await authorizeIncidentAction(selectedIncidentForAuth.id, 'AUTHORIZE', managerNotes);
    setIsSubmitting(false);
    handleClose();
  };

  const handleReject = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await authorizeIncidentAction(selectedIncidentForAuth.id, 'REJECT', managerNotes);
    setIsSubmitting(false);
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2B211B]/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Emergency Authorization"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-[#FECACA] shadow-elevated overflow-hidden text-[#2B211B] animate-in zoom-in-95 duration-200">
        {/* Urgent Header */}
        <div className="p-5 bg-gradient-to-r from-[#FFF5F5] to-white border-b border-[#FECACA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center shadow-md">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-[#DC2626] tracking-wider uppercase">
                  SAFETY GOVERNANCE PROTOCOL
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[9px] font-mono font-black">
                  CRITICAL
                </span>
              </div>
              <h3 className="text-base font-black text-[#2B211B] tracking-tight">
                HUMAN AUTHORIZATION REQUIRED
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl hover:bg-[#FEE2E2] flex items-center justify-center text-[#806C5D] hover:text-[#DC2626] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Incident Summary Card */}
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#806C5D]">INCIDENT ID:</span>
              <span className="font-black text-[#2B211B]">{selectedIncidentForAuth.id.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#806C5D]">LOCATION:</span>
              <span className="font-bold text-[#2B211B]">{selectedIncidentForAuth.locationName}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#806C5D]">ASSIGNED CREW:</span>
              <span className="font-bold text-[#2B211B]">{selectedIncidentForAuth.assignedCrewName || 'Delta Unit'}</span>
            </div>

            <p className="text-xs text-[#5A4638] pt-2 border-t border-[#E3DDD2]/70 leading-relaxed">
              {selectedIncidentForAuth.description}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#FDE68A] space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[#B45309] uppercase block">
              PROPOSED OPERATIONAL RESPONSE:
            </span>
            <p className="text-xs font-semibold text-[#2B211B] leading-relaxed">
              {selectedIncidentForAuth.recommendedResponse}
            </p>
          </div>

          {/* Manager Confirmation Checkbox (Safety Barrier) */}
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#FECACA] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasConfirmedCheckbox}
              onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#DC2626] focus:ring-[#DC2626] border-[#FECACA]"
            />
            <span className="text-xs text-[#7F1D1D] leading-snug">
              I, <strong>Event Operations Manager (MGR-0082)</strong>, verify on-site telemetry and explicitly authorize execution of this emergency containment action.
            </span>
          </label>

          {/* Manager Notes */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-[#806C5D] uppercase mb-1">
              DECISION AUDIT NOTES (LOGGED TO DATABASE)
            </label>
            <input
              type="text"
              value={managerNotes}
              onChange={(e) => setManagerNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAuthorize}
              disabled={!hasConfirmedCheckbox || isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-black text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              AUTHORIZE RESPONSE
            </button>

            <button
              onClick={handleReject}
              disabled={isSubmitting}
              className="py-3 px-4 rounded-xl bg-[#EEE9DF] hover:bg-[#E2DBD0] text-[#5A4638] font-mono font-bold text-xs transition-colors cursor-pointer"
            >
              REJECT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
