import React from 'react';
import { useOperational } from '../context/OperationalContext';
import {
  AlertTriangle,
  Flame,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  ShieldAlert,
} from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const {
    incidents,
    setSelectedIncidentForAuth,
    authorizeIncidentAction,
    addToast,
  } = useOperational();

  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status === 'ACTIVE').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-[#2B211B]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-7 border border-[#E3DDD2] shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#DC2626] font-black">
              INCIDENT TRIAGE & SAFETY DISPATCH
            </span>
            {criticalCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] animate-pulse">
                ● {criticalCount} CRITICAL AUTHORIZATION REQUIRED
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B211B] tracking-tight mt-1">
            INCIDENTS & EMERGENCY COMMAND
          </h1>
          <p className="text-xs sm:text-sm text-[#766C63] mt-1 max-w-2xl">
            Live incident queue, hazardous containment protocols, fire and medical escalation triage, and strict human authorization controls.
          </p>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incidents.map((inc) => {
          const isCritical = inc.severity === 'CRITICAL';
          const isPending = inc.status === 'ACTIVE';

          return (
            <div
              key={inc.id}
              className={`p-5 rounded-3xl bg-white border shadow-soft flex flex-col justify-between space-y-4 ${
                isCritical
                  ? 'border-[#FECACA] ring-2 ring-[#DC2626]/20 bg-gradient-to-b from-[#FFF5F5] to-white'
                  : 'border-[#E3DDD2]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                        isCritical ? 'bg-[#DC2626] text-white' : 'bg-[#D97706] text-white'
                      }`}
                    >
                      {inc.type === 'FIRE' ? <Flame className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-black text-[#2B211B] block">
                        {inc.id.toUpperCase()} • {inc.type}
                      </span>
                      <span className="text-[10px] font-mono text-[#806C5D]">{inc.timestamp}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase ${
                      isCritical
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : inc.severity === 'HIGH'
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#E8F5E9] text-[#2E7D32]'
                    }`}
                  >
                    {inc.severity} SEVERITY
                  </span>
                </div>

                <h3 className="text-base font-black text-[#2B211B] leading-snug">
                  {inc.title}
                </h3>
                <p className="text-xs text-[#5A4638] leading-relaxed">
                  {inc.description}
                </p>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#806C5D] uppercase">LOCATION:</span>
                    <span className="font-bold text-[#2B211B]">{inc.locationName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#806C5D] uppercase">ASSIGNED UNIT:</span>
                    <span className="font-bold text-[#2B211B]">{inc.assignedCrewName || 'Pending'}</span>
                  </div>
                  <div className="pt-1 border-t border-[#E3DDD2]/80">
                    <span className="text-[10px] text-[#806C5D] uppercase block">RECOMMENDED RESPONSE:</span>
                    <span className="text-[#2B211B] block font-medium">{inc.recommendedResponse}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#E3DDD2] flex items-center justify-between gap-2">
                {inc.requiresHumanAuth && inc.status === 'ACTIVE' ? (
                  <button
                    onClick={() => setSelectedIncidentForAuth(inc)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    REVIEW & AUTHORIZE PROTOCOL
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between text-xs font-mono">
                    <span className="text-[#2E7D32] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Status: {inc.status}
                    </span>
                    {inc.authorizedBy && (
                      <span className="text-[#806C5D] text-[10px]">
                        Auth by: {inc.authorizedBy} ({inc.authorizedAt})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
