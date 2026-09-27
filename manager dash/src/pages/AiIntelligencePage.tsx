import React, { useState } from 'react';
import { useOperational } from '../context/OperationalContext';
import {
  Sparkles,
  Database,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  TrendingUp,
  Cpu,
  ArrowRight,
  Filter,
  Layers,
} from 'lucide-react';

export const AiIntelligencePage: React.FC = () => {
  const {
    recommendations,
    aiDataset,
    eventMeta,
    zones,
    gates,
    incidents,
    applyRecommendation,
    dismissRecommendation,
    setSelectedIncidentForAuth,
    addToast,
  } = useOperational();

  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'audit' | 'dataset'>('overview');

  // Decision Audit History Mock Records
  const decisionHistory = [
    {
      id: 'aud-001',
      timestamp: '18:15',
      event: 'PS8 Mega Event',
      location: 'Gate G3 & G4',
      inputData: 'Gate G3 Inflow 1,680/min, Queue 1,420 (88% cap)',
      recommendation: 'Divert 15% influx from G3 toward G1 and G4',
      reason: 'Gate 3 ingress bottleneck with 14 min turnstile delay',
      severity: 'HIGH',
      managerDecision: 'AUTHORIZED & EXECUTED',
      result: 'Queue reduced by 320 spectators in 15 mins',
    },
    {
      id: 'aud-002',
      timestamp: '18:24',
      event: 'PS8 Mega Event',
      location: 'Zone D Power Room',
      inputData: 'Thermal spike, sprinkler sensor trip at 18:22',
      recommendation: 'Trigger industrial fire suppression & clear EXIT4 route',
      reason: 'Confirmed electrical flare-up in auxiliary corridor',
      severity: 'CRITICAL',
      managerDecision: 'PENDING MANAGER AUTHORIZATION',
      result: 'Perimeter holding; awaits human verification',
    },
    {
      id: 'aud-003',
      timestamp: '17:50',
      event: 'PS8 Mega Event',
      location: 'Parking P02',
      inputData: 'Occupancy reached 87% (1,740 / 2,000 stalls)',
      recommendation: 'Broadcast VMS diversion to steer inbound cars to P03',
      reason: 'Avoid North access roundabout gridlock',
      severity: 'MEDIUM',
      managerDecision: 'EXECUTED AUTOMATICALLY (LOW/MED POLICY)',
      result: 'P02 ingress normalized to 14 cars/min',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-[#2B211B]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-7 border border-[#E3DDD2] shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B66A4C] font-black">
              INTELLIGENT DECISION SUPPORT SYSTEM
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              ● EXPLAINABLE AI ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B211B] tracking-tight mt-1">
            AI INTELLIGENCE & CONTEXT
          </h1>
          <p className="text-xs sm:text-sm text-[#766C63] mt-1 max-w-2xl">
            Ground-truth transparency: review what the AI knows from the database, what directives it recommended, why, and the complete manager decision audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#E3DDD2]">
          <Cpu className="w-5 h-5 text-[#B66A4C]" />
          <div className="text-left font-mono">
            <span className="text-[9px] text-[#806C5D] block uppercase font-bold">Inference Engine</span>
            <span className="text-xs font-bold text-[#2B211B]">EventFlow v3.2</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#E3DDD2] shadow-soft">
        {[
          { key: 'overview', label: 'AI Overview & Context', icon: Sparkles },
          { key: 'recommendations', label: `Active Directives (${recommendations.length})`, icon: TrendingUp },
          { key: 'audit', label: 'Decision Audit Trail', icon: History },
          { key: 'dataset', label: `ai_dataset (${aiDataset.length} Records)`, icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2B211B] text-white shadow-sm'
                  : 'text-[#806C5D] hover:bg-[#F6F3ED] hover:text-[#2B211B]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CONTEXT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase">WHAT THE AI KNOWS NOW</span>
              <h3 className="text-base font-black text-[#2B211B]">Current Spatial Context</h3>
              <p className="text-xs text-[#5A4638] leading-relaxed">
                Ingesting live feeds across 5 zones, 5 ingress gates, 2 medical stations, 4 parking hubs, and 18 active crew members.
              </p>
              <div className="pt-2 border-t border-[#E3DDD2] flex items-center justify-between text-xs font-mono">
                <span className="text-[#806C5D]">Hotspots Detected:</span>
                <span className="font-bold text-[#DC2626]">Zone E (96%), G3 (88%)</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase">SOURCE OF TRUTH</span>
              <h3 className="text-base font-black text-[#2B211B]">Database Synchronization</h3>
              <p className="text-xs text-[#5A4638] leading-relaxed">
                Direct integration with `access_point_pedestrian_flow`, `locations`, and `ai_dataset` tables. No ungrounded hallucinations.
              </p>
              <div className="pt-2 border-t border-[#E3DDD2] flex items-center justify-between text-xs font-mono">
                <span className="text-[#806C5D]">Sync Rate:</span>
                <span className="font-bold text-[#2E7D32]">Continuous 3s Heartbeat</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase">SAFETY CONSTRAINTS</span>
              <h3 className="text-base font-black text-[#2B211B]">Human-In-The-Loop</h3>
              <p className="text-xs text-[#5A4638] leading-relaxed">
                Strict safety policy: LOW and MEDIUM directives can execute automatically. CRITICAL actions require human authorization.
              </p>
              <div className="pt-2 border-t border-[#E3DDD2] flex items-center justify-between text-xs font-mono">
                <span className="text-[#806C5D]">Critical Incidents:</span>
                <span className="font-bold text-[#DC2626]">1 Pending Authorization</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(rec => (
            <div
              key={rec.id}
              className={`p-5 rounded-3xl bg-white border shadow-soft flex flex-col justify-between space-y-4 ${
                rec.severity === 'CRITICAL' ? 'border-[#FECACA] ring-2 ring-[#DC2626]/20' : 'border-[#E3DDD2]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase ${
                      rec.severity === 'CRITICAL'
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : rec.severity === 'HIGH'
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#E8F5E9] text-[#2E7D32]'
                    }`}
                  >
                    {rec.severity} SEVERITY
                  </span>
                  <span className="text-[10px] font-mono text-[#806C5D] font-bold">
                    CONFIDENCE: {rec.confidence.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#2B211B] leading-snug">
                  {rec.title}
                </h3>
                <p className="text-xs text-[#5A4638] leading-relaxed">
                  {rec.description}
                </p>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-1 text-xs font-mono">
                  <span className="text-[9px] font-bold text-[#806C5D] uppercase block">WHY RECOMMENDED:</span>
                  <span className="text-[#2B211B] block">{rec.reason}</span>
                  <span className="text-[9px] text-[#B66A4C] block pt-1">Grounded in: {rec.sourceRecord}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E3DDD2] flex items-center justify-between gap-2">
                {rec.requiresHumanAuth ? (
                  <button
                    onClick={() => {
                      const inc = incidents.find(i => i.severity === 'CRITICAL');
                      if (inc) setSelectedIncidentForAuth(inc);
                      else addToast('info', 'Human Verification', 'Please authorize via the Emergency Desk.');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    AUTHORIZE PROTOCOL
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => applyRecommendation(rec.id)}
                      disabled={rec.applied}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      {rec.applied ? 'APPLIED' : 'EXECUTE ACTION'}
                    </button>
                    <button
                      onClick={() => dismissRecommendation(rec.id)}
                      className="py-2 px-3 rounded-xl bg-[#EEE9DF] hover:bg-[#E2DBD0] text-[#5A4638] text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-[#E3DDD2] shadow-soft overflow-hidden">
          <div className="p-5 border-b border-[#E3DDD2] bg-[#FAF8F5] flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#2B211B]">EXPLAINABLE DECISION AUDIT LOG</h3>
              <p className="text-xs text-[#766C63] font-mono mt-0.5">
                Full chronological ledger of input telemetry, AI directives, manager decisions, and systemic outcomes.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#806C5D]">
              Tamper-evident DB synced
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E3DDD2] text-[#806C5D] uppercase text-[10px]">
                  <th className="p-3.5 pl-5">Time & ID</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Input Telemetry</th>
                  <th className="p-3.5">Recommendation & Reason</th>
                  <th className="p-3.5">Manager Action</th>
                  <th className="p-3.5 pr-5">System Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DDD2]">
                {decisionHistory.map(row => (
                  <tr key={row.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="p-3.5 pl-5">
                      <span className="font-bold text-[#2B211B] block">{row.timestamp}</span>
                      <span className="text-[10px] text-[#806C5D]">{row.id}</span>
                    </td>
                    <td className="p-3.5 font-bold text-[#2B211B]">{row.location}</td>
                    <td className="p-3.5 text-[#5A4638] max-w-xs">{row.inputData}</td>
                    <td className="p-3.5 text-[#2B211B] max-w-xs">
                      <span className="font-bold block">{row.recommendation}</span>
                      <span className="text-[10px] text-[#806C5D] block">{row.reason}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black ${
                          row.severity === 'CRITICAL'
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : 'bg-[#E8F5E9] text-[#2E7D32]'
                        }`}
                      >
                        {row.managerDecision}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-[#2E7D32] font-semibold">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RAW AI DATASET */}
      {activeTab === 'dataset' && (
        <div className="bg-white rounded-3xl border border-[#E3DDD2] shadow-soft overflow-hidden">
          <div className="p-5 border-b border-[#E3DDD2] bg-[#FAF8F5] flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#2B211B]">LIVE ai_dataset DATABASE TABLE</h3>
              <p className="text-xs text-[#766C63] font-mono mt-0.5">
                Exact table representation matching event operational schema. Source of truth for all predictive engines.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#2E7D32]">
              ● STREAM ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E3DDD2] text-[#806C5D] uppercase text-[10px]">
                  <th className="p-3.5 pl-5">AI Record ID</th>
                  <th className="p-3.5">Event ID</th>
                  <th className="p-3.5">Metric Type</th>
                  <th className="p-3.5">Value</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Source Table</th>
                  <th className="p-3.5 pr-5">Recorded At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DDD2]">
                {aiDataset.map(row => (
                  <tr key={row.ai_record_id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="p-3.5 pl-5 font-bold text-[#B66A4C]">{row.ai_record_id}</td>
                    <td className="p-3.5 text-[#5A4638]">{row.event_id}</td>
                    <td className="p-3.5 font-bold text-[#2B211B]">{row.metric_type}</td>
                    <td className="p-3.5 font-black text-[#2B211B]">{row.metric_value.toLocaleString()}</td>
                    <td className="p-3.5 text-[#5A4638]">{row.location}</td>
                    <td className="p-3.5 text-[#806C5D]">{row.source_table}</td>
                    <td className="p-3.5 pr-5 text-[#806C5D]">{new Date(row.recorded_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
