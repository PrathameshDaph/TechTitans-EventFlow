import React, { useState } from 'react';
import { useOperational } from '../context/OperationalContext';
import {
  Users,
  Shield,
  MapPin,
  CheckCircle2,
  Clock,
  Radio,
  Search,
  Filter,
  Battery,
  PhoneCall,
  AlertOctagon,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { CrewData } from '../types';

export const CrewPage: React.FC = () => {
  const { crew, reassignCrew, updateCrewDutyStatus, userSosAlerts, addToast, setActiveRoute } = useOperational();
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCrew, setSelectedCrew] = useState<CrewData | null>(null);
  const [reassignLocation, setReassignLocation] = useState<string>('');
  const [reassignTask, setReassignTask] = useState<string>('');

  const activeCount = crew.filter(c => c.status === 'ACTIVE' || c.status === 'ON_TASK').length;
  const availableCount = crew.filter(c => c.status === 'AVAILABLE').length;
  const sosAssignedCount = crew.filter(c => c.task.toUpperCase().includes('SOS')).length;
  const unassignedSosCount = userSosAlerts.filter(s => s.status === 'TRIGGERED').length;

  const filteredCrew = crew.filter(c => {
    const matchesRole = filterRole === 'ALL' || c.role === filterRole;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesSearch =
      c.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.task.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrew || !reassignLocation.trim() || !reassignTask.trim()) return;
    reassignCrew(selectedCrew.id, reassignLocation, reassignTask);
    setSelectedCrew(null);
    setReassignLocation('');
    setReassignTask('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-[#2B211B] pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-7 border border-[#E3DDD2] shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B66A4C] font-black">
              PERSONNEL DEPLOYMENT & FIELD DISPATCH
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              ● 18 OPERATIONAL FIELD UNITS
            </span>
            {sosAssignedCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] animate-pulse">
                ⚡ {sosAssignedCount} ON FAN SOS DISPATCH
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B211B] tracking-tight mt-1 flex items-center gap-2.5">
            <Users className="w-8 h-8 text-[#B66A4C]" />
            CREW OPERATIONS HUB
          </h1>
          <p className="text-xs sm:text-sm text-[#766C63] mt-1 max-w-2xl">
            Live telemetry tracking of tactical security, ground stewards, paramedics, and turnstile operators across all 8 Wankhede Stadium sectors. Integrated directly with Fan SOS and Gate Ingress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3.5 py-2 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] font-bold">
            {availableCount} Available for Dispatch
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] text-[#2B211B] font-bold">
            {activeCount} Active on Duty
          </div>
          {unassignedSosCount > 0 && (
            <button
              onClick={() => setActiveRoute('/manager/attendees')}
              className="px-3.5 py-2 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>{unassignedSosCount} Unassigned Fan SOS</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#E3DDD2] shadow-soft">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#806C5D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search callsign, name, sector..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 border-r border-[#E3DDD2] pr-2">
            {['ALL', 'AVAILABLE', 'ACTIVE', 'ON_TASK'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#B66A4C] text-white'
                    : 'text-[#806C5D] hover:bg-[#FAF8F5] hover:text-[#2B211B]'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1">
            {['ALL', 'VOLUNTEER', 'STEWARD', 'SECURITY', 'MEDICAL_RESPONDER', 'LOGISTICS'].map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterRole === role
                    ? 'bg-[#2B211B] text-white shadow-sm'
                    : 'text-[#806C5D] hover:bg-[#FAF8F5] hover:text-[#2B211B]'
                }`}
              >
                {role.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Movement Dispatch Action Panel (TEST 1) */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-[#E3DDD2] shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#B66A4C] animate-pulse" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B211B]">
              Real-Time Personnel Movement Dispatch (Single Command Trigger)
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E3DDD2] text-[#766C63]">
            WebSocket Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          <div>
            <label className="text-[10px] font-mono text-[#806C5D] font-bold block mb-1">SELECT PERSON</label>
            <select
              id="quick-person-select"
              defaultValue="V001"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DDD2] text-xs font-mono font-bold text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
            >
              <option value="V001">Volunteer V001 (Aarav Mehta - Gate 2)</option>
              <option value="V002">Volunteer V002 (Diya Roy - Gate 3)</option>
              <option value="V003">Volunteer V003 (Karan Johar - Gate 4)</option>
              <option value="AAA001">Crew AAA001 (Rajesh Kumar - Gate A1)</option>
              <option value="AAB002">Crew AAB002 (Amit Verma - Gate A2)</option>
              <option value="crew-03">Crew ALPHA-03 (Vikram Singh - Gate C1)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-[#806C5D] font-bold block mb-1">CURRENT LOCATION</label>
            <input
              type="text"
              id="quick-from-input"
              defaultValue="Gate 2 (North Concourse)"
              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs text-[#766C63] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-[#806C5D] font-bold block mb-1">TARGET DESTINATION</label>
            <select
              id="quick-dest-select"
              defaultValue="Gate 5 (North Stand East)"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DDD2] text-xs font-mono font-bold text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
            >
              <option value="Gate 5 (North Stand East)">Gate 5 (North Stand East)</option>
              <option value="Gate 2 (North Concourse)">Gate 2 (North Concourse)</option>
              <option value="Gate 4 (East Concourse)">Gate 4 (East Concourse)</option>
              <option value="Gate 1 (West Pavilion)">Gate 1 (West Pavilion)</option>
              <option value="Gate 3 (Garware Stand)">Gate 3 (Garware Stand)</option>
              <option value="Gate 6 (Vijay Merchant)">Gate 6 (Vijay Merchant)</option>
              <option value="Gate 7 (Gavaskar Pavilion)">Gate 7 (Gavaskar Pavilion)</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => {
                const personSelect = document.getElementById('quick-person-select') as HTMLSelectElement;
                const destSelect = document.getElementById('quick-dest-select') as HTMLSelectElement;
                const fromInput = document.getElementById('quick-from-input') as HTMLInputElement;

                const personId = personSelect?.value || 'V001';
                const dest = destSelect?.value || 'Gate 5 (North Stand East)';
                const from = fromInput?.value || 'Gate 2';

                reassignCrew(personId, dest, 'Crowd redistribution');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#2B211B] hover:bg-[#1A1410] text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#B66A4C]" />
              <span>DISPATCH MOVEMENT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Crew Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrew.map(c => {
          const isAvailable = c.status === 'AVAILABLE';
          const isOnSos = c.task.toUpperCase().includes('SOS');
          const battery = c.batteryLevel ?? 88;

          return (
            <div
              key={c.id}
              className={`p-5 rounded-3xl bg-white border shadow-soft flex flex-col justify-between space-y-4 hover:border-[#B66A4C] transition-all ${
                isOnSos ? 'border-[#FCA5A5] ring-2 ring-[#FCA5A5]/30' : 'border-[#E3DDD2]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs ${
                        isOnSos
                          ? 'bg-[#FEF2F2] text-[#DC2626]'
                          : isAvailable
                          ? 'bg-[#E8F5E9] text-[#2E7D32]'
                          : 'bg-[#2B211B] text-[#F6F3ED]'
                      }`}
                    >
                      {isOnSos ? <AlertOctagon className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-mono font-black text-xs text-[#2B211B] block">
                        {c.callsign}
                      </span>
                      <span className="text-[11px] text-[#806C5D] font-medium">{c.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Battery indicator */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#806C5D]">
                      <Battery className="w-3 h-3 text-[#2E7D32]" />
                      {battery}%
                    </span>

                    <span
                      className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${
                        isOnSos
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                          : isAvailable
                          ? 'bg-[#E8F5E9] text-[#2E7D32]'
                          : 'bg-[#FEF3C7] text-[#D97706]'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#806C5D] uppercase">ROLE:</span>
                    <span className="font-bold text-[#2B211B]">{c.role.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#806C5D] uppercase">SECTOR:</span>
                    <span className="font-bold text-[#B66A4C] truncate ml-2">{c.locationName}</span>
                  </div>
                  <div className="pt-1 border-t border-[#E3DDD2]/80">
                    <span className="text-[10px] text-[#806C5D] uppercase block">ACTIVE DIRECTIVE:</span>
                    <span className={`block font-medium mt-0.5 ${isOnSos ? 'text-[#DC2626] font-bold' : 'text-[#2B211B]'}`}>
                      {c.task}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#E3DDD2] space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCrew(c);
                      setReassignLocation(c.locationName);
                      setReassignTask(c.task);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    Reassign Task
                  </button>
                  <button
                    onClick={() => addToast('info', 'Radio Link', `Pinging ${c.callsign} on tactical Channel 4. Audio link active.`)}
                    className="py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-[#2B211B] text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3 h-3 text-[#B66A4C]" />
                    Radio
                  </button>
                </div>

                {/* Quick Duty Status Switcher */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#806C5D] bg-[#FAF8F5] p-1 rounded-xl border border-[#E3DDD2]">
                  <span className="px-2">DUTY:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateCrewDutyStatus(c.id, 'AVAILABLE')}
                      className={`px-2 py-0.5 rounded-lg cursor-pointer transition-colors ${
                        c.status === 'AVAILABLE' ? 'bg-[#2E7D32] text-white font-bold' : 'hover:bg-[#EEE9DF]'
                      }`}
                    >
                      Avail
                    </button>
                    <button
                      onClick={() => updateCrewDutyStatus(c.id, 'ON_TASK')}
                      className={`px-2 py-0.5 rounded-lg cursor-pointer transition-colors ${
                        c.status === 'ON_TASK' ? 'bg-[#D97706] text-white font-bold' : 'hover:bg-[#EEE9DF]'
                      }`}
                    >
                      On Task
                    </button>
                    <button
                      onClick={() => updateCrewDutyStatus(c.id, 'ACTIVE')}
                      className={`px-2 py-0.5 rounded-lg cursor-pointer transition-colors ${
                        c.status === 'ACTIVE' ? 'bg-[#2B211B] text-white font-bold' : 'hover:bg-[#EEE9DF]'
                      }`}
                    >
                      Active
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reassign Modal */}
      {selectedCrew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B211B]/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 border border-[#E3DDD2] shadow-elevated w-full max-w-md space-y-4">
            <h3 className="text-base font-black text-[#2B211B]">
              REASSIGN CREW • {selectedCrew.callsign}
            </h3>
            <form onSubmit={handleReassignSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono font-bold text-[#806C5D] uppercase mb-1">
                  NEW LOCATION SECTOR
                </label>
                <input
                  type="text"
                  value={reassignLocation}
                  onChange={(e) => setReassignLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
                  placeholder="e.g. Gate G3 South Plaza"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#806C5D] uppercase mb-1">
                  TACTICAL TASK DIRECTIVE
                </label>
                <input
                  type="text"
                  value={reassignTask}
                  onChange={(e) => setReassignTask(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
                  placeholder="e.g. Clear queue spillover and direct fans to G4"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white font-mono font-bold text-xs cursor-pointer"
                >
                  DISPATCH DIRECTIVE
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCrew(null)}
                  className="py-2.5 px-4 rounded-xl bg-[#EEE9DF] hover:bg-[#E2DBD0] text-[#5A4638] font-mono font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
