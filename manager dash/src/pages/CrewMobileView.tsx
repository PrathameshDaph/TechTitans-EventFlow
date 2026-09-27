import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { realtimeService, RealtimeEvent } from '../services/realtime';
import {
  Radio,
  LogOut,
  MapPin,
  AlertOctagon,
  Battery,
} from 'lucide-react';

export const CrewMobileView: React.FC = () => {
  const { currentUser, logout, connectionStatus } = useAuth();
  const [dutyStatus, setDutyStatus] = useState<string>(currentUser?.status || 'ACTIVE');
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [currentLocation, setCurrentLocation] = useState<string>(currentUser?.locationName || 'Gate A1 Vinoo Mankad Turnstiles');
  const [activeTask, setActiveTask] = useState<string>(currentUser?.task || 'Monitor North Turnstiles & Ingress Buffer');
  const [crewDispatches, setCrewDispatches] = useState<Array<{ id: string; title: string; message: string; priority: string; time: string; location: string }>>([
    {
      id: 'disp-01',
      title: 'Ingress Surge Monitor',
      message: 'Maintain turnstile throughput along North Concourse. Divert overflow to Gate A2.',
      priority: 'NORMAL',
      time: '18:15',
      location: 'Gate A1 Turnstiles',
    },
  ]);
  const [urgentEmergency, setUrgentEmergency] = useState<any | null>(null);

  useEffect(() => {
    const unsub = realtimeService.onEvent((event: RealtimeEvent) => {
      // Direct movement / task assignment
      if (event.type === 'movement' || event.type === 'task_assignment') {
        const isMe = event.target === currentUser?.id || event.payload?.personId === currentUser?.id;
        if (isMe) {
          const dest = event.payload?.to || currentLocation;
          const reason = event.payload?.reason || 'Tactical redistribution';
          setCurrentLocation(dest);
          setActiveTask(`Dispatch: ${reason} at ${dest}`);

          setCrewDispatches(prev => [
            {
              id: 'disp-' + Date.now(),
              title: 'Tactical Reassignment',
              message: `Reassigned to ${dest}. Reason: ${reason}`,
              priority: 'HIGH',
              time: event.timestamp || 'Just now',
              location: dest,
            },
            ...prev,
          ]);
        }
      }

      // Emergency Broadcast
      if (event.type === 'emergency') {
        setUrgentEmergency({
          title: event.payload?.incident?.title || 'Tactical Emergency Alert',
          description: event.payload?.instructions || 'Emergency protocol initiated. Report to designated sector lead.',
          location: event.payload?.location || 'Gate 4',
          severity: event.payload?.severity || 'HIGH',
          time: event.timestamp || 'Just now',
        });
      }

      // Weather Warning
      if (event.type === 'weather_alert') {
        setCrewDispatches(prev => [
          {
            id: 'disp-w-' + Date.now(),
            title: 'WEATHER ADVISORY',
            message: event.payload?.advisoryText || 'Severe weather conditions reported.',
            priority: 'HIGH',
            time: event.timestamp || 'Just now',
            location: 'Venue Wide',
          },
          ...prev,
        ]);
      }
    });

    return () => unsub();
  }, [currentUser, currentLocation]);

  const toggleDuty = (status: string) => {
    setDutyStatus(status);
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#2B211B] font-sans pb-24 selection:bg-[#B66A4C] selection:text-white">
      {/* Mobile App Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E3DDD2] px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2B211B] text-white flex items-center justify-center font-black text-xs">
              CREW
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B66A4C]">
                TACTICAL CREW TELEMETRY
              </div>
              <h1 className="text-sm font-black text-[#2B211B] flex items-center gap-1.5">
                <span>{currentUser?.name || 'Crew Member'}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E3DDD2] text-[#766C63]">
                  ID: {currentUser?.id || 'AAA001'}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                connectionStatus === 'CONNECTED'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                  : 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'CONNECTED' ? 'bg-[#2E7D32] animate-pulse' : 'bg-[#DC2626]'}`} />
              <span>{connectionStatus === 'CONNECTED' ? '● Live' : '○ Reconnecting...'}</span>
            </div>

            <button
              onClick={() => logout()}
              className="p-1.5 rounded-xl border border-[#E3DDD2] text-[#766C63] hover:bg-[#FAF8F5] hover:text-[#DC2626] transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-4 space-y-4">
        {/* Urgent Emergency Alert Banner */}
        {urgentEmergency && (
          <div className="p-4 rounded-3xl bg-[#FEF2F2] border-2 border-[#DC2626] shadow-lg animate-in slide-in-from-top duration-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-black uppercase text-[#DC2626]">
                <AlertOctagon className="w-4 h-4 text-[#DC2626]" />
                <span>ACTIVE EMERGENCY PROTOCOL</span>
              </div>
              <span className="text-[10px] font-mono text-[#DC2626] font-bold">{urgentEmergency.time}</span>
            </div>
            <div className="text-sm font-black text-[#2B211B]">{urgentEmergency.title}</div>
            <p className="text-xs text-[#521B1B]">{urgentEmergency.description}</p>
            <div className="text-[11px] font-mono text-[#766C63] bg-white p-2 rounded-xl border border-[#FCA5A5]">
              Location: <strong>{urgentEmergency.location}</strong> • Severity: <strong>{urgentEmergency.severity}</strong>
            </div>
          </div>
        )}

        {/* Crew Status & Sector Card */}
        <div className="p-5 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase text-[#B66A4C]">
                CALLSIGN: {currentUser?.callsign || 'ALPHA-01'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E3DDD2] text-[#766C63]">
                STEWARD LEAD
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-[#2E7D32] font-bold">
              <Battery className="w-3.5 h-3.5" />
              <span>{batteryLevel}%</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono text-[#806C5D] uppercase">Assigned Location</div>
            <div className="text-base font-black text-[#2B211B] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B66A4C]" />
              <span>{currentLocation}</span>
            </div>
            <div className="text-xs text-[#766C63] mt-1">{activeTask}</div>
          </div>

          {/* Duty Status Selector */}
          <div className="pt-2 border-t border-[#E3DDD2] space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase text-[#806C5D] block">
              Duty Readiness Status
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['AVAILABLE', 'ACTIVE', 'ON_TASK'].map(st => (
                <button
                  key={st}
                  onClick={() => toggleDuty(st)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                    dutyStatus === st
                      ? 'bg-[#2B211B] text-white shadow-sm'
                      : 'bg-[#FAF8F5] text-[#766C63] border border-[#E3DDD2] hover:bg-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Dispatch Orders */}
        <div className="p-4 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#B66A4C]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B211B]">
                Live Command Dispatches ({crewDispatches.length})
              </h2>
            </div>
          </div>

          <div className="space-y-2">
            {crewDispatches.map(d => (
              <div
                key={d.id}
                className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-[#2B211B]">{d.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold">
                    {d.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#766C63] leading-relaxed">{d.message}</p>
                <div className="flex items-center justify-between pt-1 border-t border-[#E3DDD2]/60 text-[10px] font-mono text-[#806C5D]">
                  <span>Sector: {d.location}</span>
                  <span className="text-[#B66A4C] font-bold">DISPATCHED BY COMMAND</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
