import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { realtimeService, RealtimeEvent } from '../services/realtime';
import {
  MapPin,
  Radio,
  LogOut,
  Bell,
  CheckCircle2,
  Navigation,
  Compass,
} from 'lucide-react';

export const VolunteerMobileView: React.FC = () => {
  const { currentUser, logout, connectionStatus } = useAuth();
  const [currentStation, setCurrentStation] = useState<string>(currentUser?.locationName || 'Gate 2 (North Concourse)');
  const [activeTask, setActiveTask] = useState<string>(currentUser?.task || 'Gate Ingress Wayfinding & Crowd Guidance');
  const [movementAlert, setMovementAlert] = useState<{
    from: string;
    to: string;
    reason: string;
    timestamp: string;
  } | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; time: string; type: string }>>([
    {
      id: 'vol-init-1',
      title: 'Station Checked In',
      message: 'You are stationed at Gate 2. Assist incoming spectators with barcode orientation.',
      time: '18:00',
      type: 'info',
    },
  ]);
  const [selectedGateHighlight, setSelectedGateHighlight] = useState<string>('gate-a2');

  // Listen to realtime events targeted at this volunteer
  useEffect(() => {
    const unsub = realtimeService.onEvent((event: RealtimeEvent) => {
      // Individual movement event
      if (event.type === 'movement') {
        const isMe = event.target === currentUser?.id || event.payload?.personId === currentUser?.id;
        if (isMe) {
          const newDest = event.payload?.to || 'Gate 5';
          const reason = event.payload?.reason || 'Crowd redistribution';

          setCurrentStation(newDest);
          setActiveTask(`Relocated: ${reason} at ${newDest}`);
          setMovementAlert({
            from: event.payload?.from || currentStation,
            to: newDest,
            reason,
            timestamp: event.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });

          setNotifications(prev => [
            {
              id: 'notif-' + Date.now(),
              title: 'Movement Assignment',
              message: `You have been requested to move to ${newDest}. Reason: ${reason}`,
              time: event.timestamp || 'Just now',
              type: 'movement',
            },
            ...prev,
          ]);

          if (newDest.toLowerCase().includes('5') || newDest.toLowerCase().includes('a1')) {
            setSelectedGateHighlight('gate-a1');
          } else if (newDest.toLowerCase().includes('2') || newDest.toLowerCase().includes('a2')) {
            setSelectedGateHighlight('gate-a2');
          }
        }
      }

      // Gate closure or crowd alerts
      if (event.type === 'gate_status_change' || event.type === 'crowd_alert' || event.type === 'emergency' || event.type === 'weather_alert') {
        setNotifications(prev => [
          {
            id: 'notif-' + Date.now(),
            title: event.type.replace(/_/g, ' ').toUpperCase(),
            message: event.payload?.message || event.payload?.instructions || event.payload?.notes || 'Operational update received from Command.',
            time: event.timestamp || 'Just now',
            type: event.type,
          },
          ...prev.slice(0, 10),
        ]);
      }
    });

    return () => unsub();
  }, [currentUser, currentStation]);

  const gatesList = [
    { id: 'gate-a1', code: 'A1', name: 'Gate 5 (North-West)', desc: 'North Stand Level 1 & 2', status: 'OPEN', wait: '3m' },
    { id: 'gate-a2', code: 'A2', name: 'Gate 2 (North-East)', desc: 'North Concourse', status: 'OPEN', wait: '4m' },
    { id: 'gate-b1', code: 'B1', name: 'Gate 4 (East-North)', desc: 'Tendulkar Stand', status: 'OPEN', wait: '5m' },
    { id: 'gate-b2', code: 'B2', name: 'Gate 4 (East-South)', desc: 'East Concourse', status: 'OPEN', wait: '6m' },
    { id: 'gate-c1', code: 'C1', name: 'Gate 3 (South-East)', desc: 'Garware & Merchant', status: 'CONGESTED', wait: '18m' },
    { id: 'gate-c2', code: 'C2', name: 'Gate 3 (South-West)', desc: 'South Concourse', status: 'CONGESTED', wait: '15m' },
    { id: 'gate-d1', code: 'D1', name: 'Gate 1 (West-South)', desc: 'VIP & Marine Drive', status: 'OPEN', wait: '2m' },
    { id: 'gate-d2', code: 'D2', name: 'Gate 1 (West-North)', desc: 'Divecha Pavilion', status: 'OPEN', wait: '2m' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#2B211B] font-sans pb-24 selection:bg-[#B66A4C] selection:text-white">
      {/* Top Mobile App Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E3DDD2] px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2B211B] text-white flex items-center justify-center font-black text-sm">
              VOL
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#B66A4C]">
                VOLUNTEER FIELD APP
              </div>
              <h1 className="text-sm font-black text-[#2B211B] flex items-center gap-1.5">
                <span>{currentUser?.name || 'Volunteer'}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E3DDD2] text-[#766C63]">
                  ID: {currentUser?.id || 'V001'}
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
        {/* Real-time Movement Request Alert Banner */}
        {movementAlert && (
          <div className="p-4 rounded-3xl bg-[#FEF2F2] border-2 border-[#DC2626] shadow-lg animate-in slide-in-from-top duration-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-black uppercase text-[#DC2626]">
                <Radio className="w-4 h-4 animate-ping text-[#DC2626]" />
                <span>URGENT MOVEMENT DIRECTIVE</span>
              </div>
              <span className="text-[10px] font-mono text-[#DC2626] font-bold">{movementAlert.timestamp}</span>
            </div>

            <div className="text-sm font-black text-[#2B211B]">
              Movement Assignment
            </div>
            <p className="text-xs text-[#521B1B] leading-relaxed">
              You have been requested to move to <strong className="text-[#DC2626]">{movementAlert.to}</strong>.
            </p>
            <div className="text-[11px] font-mono text-[#766C63] bg-white/80 p-2 rounded-xl border border-[#FCA5A5]">
              <strong>Reason:</strong> {movementAlert.reason}
            </div>

            <button
              onClick={() => {
                setSelectedGateHighlight('gate-a1');
                setMovementAlert(null);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>[VIEW ON MAP & ACKNOWLEDGE]</span>
            </button>
          </div>
        )}

        {/* Current Station & Assignment Card */}
        <div className="p-5 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-[#B66A4C]">
              ACTIVE DUTY STATION
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <CheckCircle2 className="w-3 h-3" /> ON DUTY
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] flex items-center justify-center text-[#B66A4C]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-black text-[#2B211B] leading-tight">
                {currentStation}
              </div>
              <div className="text-xs text-[#766C63] mt-0.5">
                {activeTask}
              </div>
            </div>
          </div>
        </div>

        {/* 8-Gate Stadium Wayfinding Map */}
        <div className="p-4 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#B66A4C]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B211B]">
                8-Gate Wayfinding Radar
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#766C63]">Tap to highlight</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {gatesList.map(g => {
              const isSelected = selectedGateHighlight === g.id;
              const isCongested = g.status === 'CONGESTED';
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGateHighlight(g.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#B66A4C] bg-[#FAF8F5] ring-2 ring-[#B66A4C]/20'
                      : 'border-[#E3DDD2] bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-[#2B211B]">{g.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        isCongested
                          ? 'bg-[#FEF2F2] text-[#DC2626]'
                          : 'bg-[#E8F5E9] text-[#2E7D32]'
                      }`}
                    >
                      {g.wait}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#766C63] truncate mt-0.5">{g.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Notifications Feed */}
        <div className="p-4 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#B66A4C]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B211B]">
                Targeted Live Advisories ({notifications.length})
              </h2>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.map(n => (
              <div
                key={n.id}
                className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2B211B] font-mono">{n.title}</span>
                  <span className="text-[10px] font-mono text-[#766C63]">{n.time}</span>
                </div>
                <p className="text-[11px] text-[#766C63] leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
