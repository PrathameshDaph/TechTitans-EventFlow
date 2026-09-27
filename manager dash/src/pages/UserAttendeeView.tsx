import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { realtimeService, RealtimeEvent } from '../services/realtime';
import {
  Ticket,
  Bell,
  AlertOctagon,
  LogOut,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const UserAttendeeView: React.FC = () => {
  const { currentUser, logout, connectionStatus } = useAuth();
  const [sosSent, setSosSent] = useState<boolean>(false);
  const [advisories, setAdvisories] = useState<Array<{ id: string; title: string; message: string; time: string }>>([
    {
      id: 'adv-01',
      title: 'Gate 5 Ingress Open',
      message: 'Fast track lane operational for Level 2 Premium Pavilion ticket holders.',
      time: '18:14',
    },
  ]);
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  useEffect(() => {
    const unsub = realtimeService.onEvent((event: RealtimeEvent) => {
      // Gate changes
      if (event.type === 'gate_status_change') {
        const gate = event.payload?.gate?.name || 'Gate';
        const status = event.payload?.status || 'UPDATED';
        setAdvisories(prev => [
          {
            id: 'gate-' + Date.now(),
            title: `Gate Advisory: ${gate}`,
            message: event.payload?.notes || `${gate} status is now ${status}. Please check directional signage.`,
            time: event.timestamp || 'Just now',
          },
          ...prev,
        ]);
      }

      // Weather Warning
      if (event.type === 'weather_alert') {
        setAdvisories(prev => [
          {
            id: 'wea-' + Date.now(),
            title: 'WEATHER ADVISORY',
            message: event.payload?.advisoryText || 'Weather update from Stadium Operations.',
            time: event.timestamp || 'Just now',
          },
          ...prev,
        ]);
      }

      // Emergency Broadcast
      if (event.type === 'emergency') {
        setEmergencyAlert(event.payload?.instructions || 'Emergency protocol initiated. Follow steward directions.');
      }
    });

    return () => unsub();
  }, []);

  const handleTriggerSos = async () => {
    setSosSent(true);
    realtimeService.emitEvent({
      type: 'emergency',
      source: `User ${currentUser?.name || 'Fan'} (${currentUser?.id})`,
      target: 'ALL_CREW',
      scope: 'broadcast',
      payload: {
        userId: currentUser?.id,
        userName: currentUser?.name,
        seat: currentUser?.seatNumber || 'Block 5, Row K, Seat 42',
        block: currentUser?.assignedBlock || 'Block 5',
        phone: currentUser?.phone || '+91 98201 23456',
        instructions: `FAN SOS TRIGGERED: Medical/Security assistance requested at ${currentUser?.assignedBlock || 'Block 5'} (${currentUser?.seatNumber || 'Row K • Seat 42'}).`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#2B211B] font-sans pb-24 selection:bg-[#B66A4C] selection:text-white">
      {/* Mobile App Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E3DDD2] px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2B211B] text-white flex items-center justify-center font-black text-xs">
              ALL
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B66A4C]">
                ALLIN FAN PORTAL
              </div>
              <h1 className="text-sm font-black text-[#2B211B] flex items-center gap-1.5">
                <span>{currentUser?.name || 'Spectator'}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E3DDD2] text-[#766C63]">
                  ID: {currentUser?.id || 'user_0001'}
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
        {/* Emergency Alert Banner */}
        {emergencyAlert && (
          <div className="p-4 rounded-3xl bg-[#FEF2F2] border-2 border-[#DC2626] shadow-lg space-y-1 text-xs">
            <div className="flex items-center gap-2 font-mono font-bold text-[#DC2626] uppercase">
              <AlertOctagon className="w-4 h-4" />
              <span>STADIUM SAFETY ADVISORY</span>
            </div>
            <p className="text-[#521B1B] font-medium">{emergencyAlert}</p>
          </div>
        )}

        {/* Digital Match Pass Card */}
        <div className="p-5 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#B66A4C]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B211B]">
                DIGITAL MATCH PASS
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              VERIFIED ENTRY
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-lg font-black text-[#2B211B]">
              India vs Pakistan — Wankhede Arena
            </div>
            <div className="text-xs text-[#766C63]">
              Saturday • Gates Open 16:00 • Ingress Active
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] text-center">
            <div>
              <div className="text-[10px] font-mono text-[#806C5D] uppercase">Assigned Gate</div>
              <div className="text-xs font-black text-[#2B211B] mt-0.5">{currentUser?.assignedGate || 'Gate 5 (North)'}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#806C5D] uppercase">Seating Block</div>
              <div className="text-xs font-black text-[#2B211B] mt-0.5">{currentUser?.assignedBlock || 'Block 5'}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#806C5D] uppercase">Seat</div>
              <div className="text-xs font-black text-[#2B211B] mt-0.5">{currentUser?.seatNumber || 'Row K • 42'}</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#766C63] pt-1">
            <span>Pass: {currentUser?.ticketId || 'ALLIN-WAN-2026-9842'}</span>
            <span className="flex items-center gap-1 text-[#2E7D32]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Scanned at Turnstile
            </span>
          </div>
        </div>

        {/* Rapid Fan SOS Assistance */}
        <div className="p-4 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B211B]">
                Immediate Assistance (Fan SOS)
              </h2>
            </div>
          </div>

          <p className="text-xs text-[#766C63]">
            Need medical help or security support? Tapping this sends your exact seat location ({currentUser?.assignedBlock || 'Block 5'}, {currentUser?.seatNumber || 'Row K • 42'}) directly to stadium emergency dispatchers.
          </p>

          <button
            onClick={handleTriggerSos}
            disabled={sosSent}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              sosSent
                ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white active:scale-[0.99]'
            }`}
          >
            {sosSent ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>EMERGENCY DISPATCH NOTIFIED • STEWARDS EN ROUTE</span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-4 h-4" />
                <span>REQUEST IMMEDIATE STADIUM SOS DISPATCH</span>
              </>
            )}
          </button>
        </div>

        {/* Live Advisories Feed */}
        <div className="p-4 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#B66A4C]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B211B]">
                Live Stadium Advisories ({advisories.length})
              </h2>
            </div>
          </div>

          <div className="space-y-2">
            {advisories.map(a => (
              <div
                key={a.id}
                className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2B211B] font-mono">{a.title}</span>
                  <span className="text-[10px] font-mono text-[#766C63]">{a.time}</span>
                </div>
                <p className="text-[11px] text-[#766C63] leading-relaxed">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
