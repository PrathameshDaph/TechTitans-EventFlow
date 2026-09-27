import React from 'react';
import { useOperational } from '../context/OperationalContext';
import { Car, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ParkingData } from '../types';

export const ParkingPage: React.FC = () => {
  const { parking, applyRecommendation, addToast } = useOperational();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-[#2B211B]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-7 border border-[#E3DDD2] shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B66A4C] font-black">
              VEHICULAR INGRESS & PARKING HUBS
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              ● 4 PERIMETER LOTS CONNECTED
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B211B] tracking-tight mt-1">
            PARKING & MOBILITY COMMAND
          </h1>
          <p className="text-xs sm:text-sm text-[#766C63] mt-1 max-w-2xl">
            Real-time induction loop counts, bay occupancy saturation alerts, and dynamic expressway VMS diversion management.
          </p>
        </div>
      </div>

      {/* Parking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {parking.map((p) => {
          const isCritical = p.status === 'CRITICAL';
          const isHigh = p.status === 'HIGH';

          return (
            <div
              key={p.id}
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
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs ${
                        isCritical ? 'bg-[#DC2626] text-white' : 'bg-[#2B211B] text-[#F6F3ED]'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-black text-sm text-[#2B211B] block">
                        {p.code} — {p.name}
                      </span>
                      <span className="text-[11px] text-[#806C5D] font-mono">
                        Rate: +{p.incomingRate} cars/min
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase ${
                      isCritical
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : isHigh
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#E8F5E9] text-[#2E7D32]'
                    }`}
                  >
                    {p.occupancyPercent}% FULL ({p.status})
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-[#EEE9DF] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      p.occupancyPercent >= 90
                        ? 'bg-[#DC2626]'
                        : p.occupancyPercent >= 80
                        ? 'bg-[#D97706]'
                        : 'bg-[#2E7D32]'
                    }`}
                    style={{ width: `${p.occupancyPercent}%` }}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2]">
                    <span className="text-[9px] text-[#806C5D] uppercase block">CAPACITY</span>
                    <span className="text-base font-black text-[#2B211B] mt-0.5 block">{p.capacity}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2]">
                    <span className="text-[9px] text-[#806C5D] uppercase block">OCCUPIED</span>
                    <span className="text-base font-black text-[#2B211B] mt-0.5 block">{p.occupied}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2]">
                    <span className="text-[9px] text-[#806C5D] uppercase block">AVAILABLE</span>
                    <span className="text-base font-black text-[#2E7D32] mt-0.5 block">{p.available}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#E3DDD2] flex items-center justify-between gap-2">
                <button
                  onClick={() => addToast('info', 'Traffic Telemetry', `VMS signage check completed for ${p.code}.`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Inspect Sensors
                </button>
                {isHigh && (
                  <button
                    onClick={() => applyRecommendation('rec-003')}
                    className="py-2 px-3 rounded-xl bg-[#B66A4C] hover:bg-[#9E563A] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    Divert Inbound Traffic
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
