import React, { useState } from 'react';
import { useOperational } from '../context/OperationalContext';
import { AlertCard } from '../components/dashboard/AlertCard';
import { AlertSeverity } from '../types';
import { Bell, AlertTriangle, AlertOctagon, CheckCheck, Sparkles, Filter } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, activityFeed } = useOperational();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const unackCount = alerts.filter(a => !a.acknowledged).length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;

  const handleAcknowledgeAll = () => {
    alerts.forEach((a) => {
      if (!a.acknowledged) acknowledgeAlert(a.id);
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl md:rounded-[22px] p-5 sm:p-7 border border-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-light-brown font-bold">
              EVENT SURGE & ANOMALY DETECTION ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight mt-1">
            ALERT CENTER
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text mt-1 max-w-2xl">
            Live automated warnings on turnstile backlogs, zone safety thresholds, parking saturation, and transit spikes.
          </p>
        </div>

        {unackCount > 0 && (
          <button
            onClick={handleAcknowledgeAll}
            className="px-4 py-2.5 rounded-xl bg-beige hover:bg-beige-dark text-primary text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-sm self-start md:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-light-brown" />
            ACKNOWLEDGE ALL ({unackCount})
          </button>
        )}
      </div>

      {/* Alert Severity Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-border shadow-soft">
          <span className="text-[10px] font-mono uppercase text-secondary-text font-bold block">
            TOTAL ACTIVE INCIDENTS
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-primary mt-1">
            {alerts.length}
          </div>
          <span className="text-xs font-mono text-secondary-text">{unackCount} unacknowledged</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#FECACA] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#DC2626] font-bold block">
            CRITICAL SEVERITY
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#DC2626] mt-1">
            {criticalCount}
          </div>
          <span className="text-xs font-mono text-[#DC2626] font-semibold">Immediate action required</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold block">
            HIGH SEVERITY
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#D97706] mt-1">
            {highCount}
          </div>
          <span className="text-xs font-mono text-[#D97706]">Monitoring escalations</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#F2FBF4] border border-[#C2E7C6] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#2E7D32] font-bold block">
            AVERAGE RESPONSE TIME
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2E7D32] mt-1">
            2.4 min
          </div>
          <span className="text-xs font-mono text-[#2E7D32]">Within SLA safety window</span>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white rounded-2xl border border-border shadow-soft">
        <div className="flex items-center gap-1.5">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => {
            const count = sev === 'ALL' ? alerts.length : alerts.filter(a => a.severity === sev).length;

            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                  filterSeverity === sev
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary-text hover:text-primary hover:bg-beige/70'
                }`}
              >
                <span>{sev}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterSeverity === sev ? 'bg-beige text-primary' : 'bg-beige text-secondary-text'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-secondary-text px-2">
          {filteredAlerts.length} alerts displayed
        </span>
      </div>

      {/* Real-Time Live Activity Feed */}
      <div className="bg-white rounded-3xl p-6 border border-[#E3DDD2] shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2B211B] text-white flex items-center justify-center font-mono font-bold text-xs">
              ⚡
            </div>
            <div>
              <h2 className="text-base font-black text-[#2B211B]">
                REAL-TIME VENUE ACTIVITY FEED
              </h2>
              <p className="text-xs text-[#766C63]">
                Chronological live stream of movements, gate status changes, emergencies, and weather telemetry.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] font-bold">
            ● LIVE STREAMING
          </span>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {activityFeed && activityFeed.length > 0 ? (
            activityFeed.map((item) => {
              const isMovement = item.type === 'movement';
              const isEmergency = item.type === 'emergency';
              const isWeather = item.type === 'weather_alert';
              const isGate = item.type === 'gate_status_change' || item.type === 'gate_alert';

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] hover:bg-white transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#2B211B]">
                        {item.timestamp}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                          isEmergency
                            ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                            : isWeather
                            ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                            : isMovement
                            ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                            : isGate
                            ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                            : 'bg-[#F3F4F6] text-[#374151]'
                        }`}
                      >
                        {item.badge || item.type.toUpperCase()}
                      </span>
                    </div>

                    {item.source && (
                      <span className="text-[10px] font-mono text-[#806C5D]">
                        Source: {item.source}
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold text-[#2B211B] flex items-center gap-2">
                    <span>{item.title}</span>
                  </div>

                  <p className="text-xs text-[#5A4638] leading-relaxed">
                    {item.message}
                  </p>

                  {item.from && item.to && (
                    <div className="text-[11px] font-mono font-semibold text-[#B66A4C] pt-1">
                      {item.from} → {item.to}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs font-mono text-[#766C63]">
              No events recorded yet. Perform actions to see real-time feed updates.
            </div>
          )}
        </div>
      </div>

      {/* Alert Cards List */}
      {filteredAlerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-border">
          <Bell className="w-10 h-10 text-secondary-text mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-bold text-primary font-mono">No alerts matching this filter</h3>
          <p className="text-xs text-secondary-text mt-1">All systems operating within normal parameters.</p>
        </div>
      )}
    </div>
  );
};

