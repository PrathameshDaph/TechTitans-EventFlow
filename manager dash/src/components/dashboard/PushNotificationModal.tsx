import React, { useState } from 'react';
import {
  X,
  Radio,
  Send,
  AlertTriangle,
  Users,
  Shield,
  UserCheck,
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  Volume2,
} from 'lucide-react';
import { sendPushNotification, PushNotificationPayload } from '../../services/api';
import { useOperational } from '../../context/OperationalContext';

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTargetRole?: string;
  defaultTarget?: string;
}

const PRESET_BROADCASTS = [
  {
    tag: '🚨 GATE SURGE',
    title: 'Ingress Bottleneck Advisory: Divert to Gate A1 / D1',
    message: 'Gate C1 queue has reached 1,400+ attendees. Volunteers at South Concourse please divert new arrivals toward Gate A1 and Gate D1.',
    severity: 'HIGH' as const,
    role: 'volunteer',
    gate: 'Gate C1',
    block: 'C BLOCK',
    action: 'Direct incoming queue to overflow lane A1.',
  },
  {
    tag: '📢 AMBER ALERT',
    title: 'Missing Child Alert: Aarav Patel (Age 7)',
    message: 'Child last seen near Gate 3 Concourse wearing a blue jersey and white cap. All volunteers and stewards please inspect turnstiles.',
    severity: 'CRITICAL' as const,
    role: 'all',
    gate: 'Gate 3',
    block: 'C BLOCK',
    action: 'Inspect sector turnstiles and call Operations if spotted.',
  },
  {
    tag: '⚡ CREW DISPATCH',
    title: 'Urgent Crowd Control: Block B Aisle Clearance',
    message: 'Stairwell B2 experiencing high aisle blockage. Field crew units ALPHA-01 and ALPHA-02 please report for clearance.',
    severity: 'HIGH' as const,
    role: 'crew',
    gate: 'Gate B2',
    block: 'B BLOCK',
    action: 'Clear stairwell ingress routes immediately.',
  },
  {
    tag: '🌦️ WEATHER ALERT',
    title: 'Weather Twin Advisory: Rain Squall Approaching',
    message: 'Precipitation expected in 15 minutes. Secure all electrical equipment, open covered concourses, and guide fans under canopy.',
    severity: 'HIGH' as const,
    role: 'all',
    gate: 'All Gates',
    block: 'All Blocks',
    action: 'Open sheltered pathways and ready umbrellas.',
  },
  {
    tag: '📋 SHIFT BRIEFING',
    title: 'Operations Briefing at Halftime (20:45)',
    message: 'All sector leads and volunteers report to designated muster points for food zone crowd control protocol briefing.',
    severity: 'LOW' as const,
    role: 'volunteer',
    gate: 'All Gates',
    block: 'Muster Point 1',
    action: 'Check in on the CREW_IT mobile app.',
  },
];

const ROSTER_PEOPLE = [
  { id: 'V001', name: 'Aarav Patel', role: 'Volunteer (Gate 2 Lead)', type: 'volunteer' },
  { id: 'V002', name: 'Diya Sharma', role: 'Volunteer (Gate 4 Support)', type: 'volunteer' },
  { id: 'V003', name: 'Rohan Mehta', role: 'Volunteer (Lost & Found)', type: 'volunteer' },
  { id: 'V004', name: 'Ananya Iyer', role: 'Volunteer (Medical Desk)', type: 'volunteer' },
  { id: 'V005', name: 'Kabir Khan', role: 'Volunteer (Crowd Marshal)', type: 'volunteer' },
  { id: 'AAA001', name: 'Rajesh Kumar (ALPHA-01)', role: 'Field Crew Steward', type: 'crew' },
  { id: 'AAB002', name: 'Amit Verma (ALPHA-02)', role: 'Field Crew Security', type: 'crew' },
];

export const PushNotificationModal: React.FC<PushNotificationModalProps> = ({
  isOpen,
  onClose,
  defaultTargetRole = 'volunteer',
  defaultTarget = 'ALL',
}) => {
  const { addToast } = useOperational();

  const [audienceType, setAudienceType] = useState<'volunteer' | 'crew' | 'all_staff' | 'everyone' | 'individual'>(
    defaultTargetRole === 'crew' ? 'crew' : defaultTargetRole === 'volunteer' ? 'volunteer' : 'all_staff'
  );
  const [selectedPerson, setSelectedPerson] = useState<string>(defaultTarget !== 'ALL' ? defaultTarget : 'V001');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [gate, setGate] = useState('Gate 1');
  const [block, setBlock] = useState('A BLOCK');
  const [action, setAction] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const applyPreset = (preset: typeof PRESET_BROADCASTS[0]) => {
    setTitle(preset.title);
    setMessage(preset.message);
    setSeverity(preset.severity);
    setIsUrgent(preset.severity === 'CRITICAL');
    setGate(preset.gate);
    setBlock(preset.block);
    setAction(preset.action);
    if (preset.role === 'volunteer') setAudienceType('volunteer');
    else if (preset.role === 'crew') setAudienceType('crew');
    else setAudienceType('all_staff');
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);

    let targetRole = 'ALL';
    let target = 'ALL';
    let scope: 'broadcast' | 'role' | 'individual' = 'broadcast';

    if (audienceType === 'volunteer') {
      targetRole = 'volunteer';
      scope = 'role';
    } else if (audienceType === 'crew') {
      targetRole = 'crew';
      scope = 'role';
    } else if (audienceType === 'all_staff') {
      targetRole = 'volunteer,crew';
      scope = 'role';
    } else if (audienceType === 'individual') {
      target = selectedPerson;
      scope = 'individual';
    } else if (audienceType === 'everyone') {
      targetRole = 'ALL';
      target = 'ALL';
      scope = 'broadcast';
    }

    const payload: PushNotificationPayload = {
      title: title.trim(),
      message: message.trim(),
      type: isUrgent || severity === 'CRITICAL' ? 'MISSING_CHILD' : 'ANNOUNCEMENT',
      severity,
      target,
      targetRole,
      scope,
      location: `${gate} (${block})`,
      relatedGate: gate,
      relatedBlock: block,
      action: action.trim() || 'Follow field supervisor instructions.',
      recommendedAction: action.trim() || 'Follow field supervisor instructions.',
      senderName: 'Command Tower',
      isUrgent: isUrgent || severity === 'CRITICAL',
    };

    try {
      const result = await sendPushNotification(payload);
      setIsSending(false);
      setSentSuccess(true);
      addToast(
        'success',
        'Push Notification Dispatched',
        `Broadcast sent live to ${audienceType.toUpperCase()}: "${title}"`
      );

      setTimeout(() => {
        setSentSuccess(false);
        setTitle('');
        setMessage('');
        setAction('');
        onClose();
      }, 1400);
    } catch (err) {
      setIsSending(false);
      addToast('critical', 'Dispatch Failed', 'Could not broadcast push notification.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-[#E3DDD2] shadow-2xl flex flex-col text-[#2B211B] font-sans">
        
        {/* MODAL HEADER */}
        <div className="sticky top-0 z-10 px-5 sm:px-6 py-4 bg-white/95 backdrop-blur-md border-b border-[#E3DDD2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2B211B] text-[#F6F3ED] flex items-center justify-center shadow-md">
              <Radio className="w-5 h-5 text-[#B66A4C] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-[#2B211B]">
                  Dispatch Push Notification
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B66A4C]/15 text-[#B66A4C]">
                  LIVE REAL-TIME
                </span>
              </div>
              <p className="text-xs text-[#806C5D]">
                Instantly broadcast alerts directly to Volunteer & Field Crew mobile screens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EEE9DF] flex items-center justify-center text-[#806C5D] hover:text-[#2B211B] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSend} className="p-5 sm:p-6 space-y-5">
          
          {/* QUICK PRESETS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-[#806C5D] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B66A4C]" />
                Quick Operational Templates
              </label>
              <span className="text-[10px] font-mono text-[#806C5D]">1-Click Autofill</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_BROADCASTS.slice(0, 4).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="text-left p-2.5 rounded-xl border border-[#E3DDD2] hover:border-[#B66A4C] bg-[#FAF8F5] hover:bg-white transition-all text-xs group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[10px] text-[#B66A4C] group-hover:text-[#806C5D]">
                      {p.tag}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      p.severity === 'CRITICAL' ? 'bg-[#DC2626]/15 text-[#DC2626]' : 'bg-[#D97706]/15 text-[#D97706]'
                    }`}>
                      {p.severity}
                    </span>
                  </div>
                  <p className="font-bold text-[#2B211B] truncate group-hover:text-[#B66A4C] transition-colors">
                    {p.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#E3DDD2]" />

          {/* TARGET AUDIENCE SELECTOR */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#806C5D] uppercase tracking-wider mb-2">
              Target Audience
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAudienceType('volunteer')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  audienceType === 'volunteer'
                    ? 'bg-[#2B211B] text-[#F6F3ED] border-[#2B211B] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#5A4638] border-[#E3DDD2] hover:bg-[#EEE9DF]'
                }`}
              >
                <Users className="w-4 h-4 text-[#B66A4C]" />
                <span>All Volunteers</span>
              </button>

              <button
                type="button"
                onClick={() => setAudienceType('crew')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  audienceType === 'crew'
                    ? 'bg-[#2B211B] text-[#F6F3ED] border-[#2B211B] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#5A4638] border-[#E3DDD2] hover:bg-[#EEE9DF]'
                }`}
              >
                <Shield className="w-4 h-4 text-[#B66A4C]" />
                <span>Field Crew (CREW_IT)</span>
              </button>

              <button
                type="button"
                onClick={() => setAudienceType('all_staff')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  audienceType === 'all_staff'
                    ? 'bg-[#2B211B] text-[#F6F3ED] border-[#2B211B] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#5A4638] border-[#E3DDD2] hover:bg-[#EEE9DF]'
                }`}
              >
                <Users className="w-4 h-4 text-[#B66A4C]" />
                <span>Volunteers + Crew</span>
              </button>

              <button
                type="button"
                onClick={() => setAudienceType('individual')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  audienceType === 'individual'
                    ? 'bg-[#2B211B] text-[#F6F3ED] border-[#2B211B] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#5A4638] border-[#E3DDD2] hover:bg-[#EEE9DF]'
                }`}
              >
                <UserCheck className="w-4 h-4 text-[#B66A4C]" />
                <span>Specific Person</span>
              </button>

              <button
                type="button"
                onClick={() => setAudienceType('everyone')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer sm:col-span-2 ${
                  audienceType === 'everyone'
                    ? 'bg-[#2B211B] text-[#F6F3ED] border-[#2B211B] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#5A4638] border-[#E3DDD2] hover:bg-[#EEE9DF]'
                }`}
              >
                <Radio className="w-4 h-4 text-[#B66A4C]" />
                <span>Venue Wide (All Visitors & Volunteers)</span>
              </button>
            </div>

            {/* Individual Dropdown if selected */}
            {audienceType === 'individual' && (
              <div className="mt-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] animate-fade-in">
                <label className="block text-[11px] font-mono text-[#806C5D] mb-1">
                  Select Volunteer or Crew Member:
                </label>
                <select
                  value={selectedPerson}
                  onChange={e => setSelectedPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E3DDD2] rounded-xl text-xs font-bold text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
                >
                  {ROSTER_PEOPLE.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.name} ({p.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* SEVERITY & URGENCY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-[#806C5D] uppercase tracking-wider mb-1.5">
                Alert Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['LOW', 'HIGH', 'CRITICAL'] as const).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => {
                      setSeverity(sev);
                      if (sev === 'CRITICAL') setIsUrgent(true);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer text-center ${
                      severity === sev
                        ? sev === 'CRITICAL'
                          ? 'bg-[#DC2626] text-white shadow-md'
                          : sev === 'HIGH'
                          ? 'bg-[#D97706] text-white shadow-md'
                          : 'bg-[#2E7D32] text-white shadow-md'
                        : 'bg-[#FAF8F5] text-[#5A4638] border border-[#E3DDD2] hover:bg-[#EEE9DF]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E3DDD2] bg-[#FAF8F5] cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-[#B66A4C] rounded border-[#E3DDD2] focus:ring-[#B66A4C]"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#2B211B] flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#DC2626]" />
                    Trigger Loud Sound Alert
                  </span>
                  <p className="text-[10px] text-[#806C5D]">
                    Plays notification audio chime immediately on device
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* TITLE INPUT */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#806C5D] uppercase tracking-wider mb-1.5">
              Notification Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Ingress Overflow Alert — Open Gate 2 Lane B"
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] focus:bg-white border border-[#E3DDD2] focus:border-[#B66A4C] rounded-xl text-xs sm:text-sm font-semibold text-[#2B211B] placeholder-[#806C5D]/50 focus:outline-none transition-colors"
            />
          </div>

          {/* MESSAGE INPUT */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#806C5D] uppercase tracking-wider mb-1.5">
              Broadcast Message Body *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Provide exact operational instructions for field stewards and volunteers..."
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] focus:bg-white border border-[#E3DDD2] focus:border-[#B66A4C] rounded-xl text-xs sm:text-sm text-[#2B211B] placeholder-[#806C5D]/50 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* LOCATION & GATE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-[#806C5D] uppercase tracking-wider mb-1.5">
                Related Gate
              </label>
              <select
                value={gate}
                onChange={e => setGate(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E3DDD2] rounded-xl text-xs font-bold text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
              >
                <option value="All Gates">All Gates (Venue Wide)</option>
                <option value="Gate 1">Gate A1 (North-West Turnstiles)</option>
                <option value="Gate 2">Gate A2 (North Concourse)</option>
                <option value="Gate 3">Gate B1 (East Pavilion)</option>
                <option value="Gate 4">Gate B2 (Sachin Tendulkar Stand)</option>
                <option value="Gate 5">Gate C1 (Churchgate Link)</option>
                <option value="Gate 6">Gate C2 (Polly Umrigar Stand)</option>
                <option value="Gate 7">Gate D1 (Marine Drive West)</option>
                <option value="Gate 8">Gate D2 (Divecha Stand)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#806C5D] uppercase tracking-wider mb-1.5">
                Stadium Block / Zone
              </label>
              <select
                value={block}
                onChange={e => setBlock(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E3DDD2] rounded-xl text-xs font-bold text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
              >
                <option value="All Blocks">All Blocks</option>
                <option value="A BLOCK">A BLOCK (North Pavilion)</option>
                <option value="B BLOCK">B BLOCK (East Grandstand)</option>
                <option value="C BLOCK">C BLOCK (South Turnstiles)</option>
                <option value="D BLOCK">D BLOCK (West Grandstand)</option>
              </select>
            </div>
          </div>

          {/* RECOMMENDED ACTION */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#806C5D] uppercase tracking-wider mb-1.5">
              Recommended Action / Protocol
            </label>
            <input
              type="text"
              value={action}
              onChange={e => setAction(e.target.value)}
              placeholder="e.g. Inspect turnstiles, scan crowd tickets, or guide visitors."
              className="w-full px-3.5 py-2 bg-[#FAF8F5] focus:bg-white border border-[#E3DDD2] focus:border-[#B66A4C] rounded-xl text-xs text-[#2B211B] placeholder-[#806C5D]/50 focus:outline-none transition-colors"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E3DDD2]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E3DDD2] hover:bg-[#EEE9DF] text-xs font-bold text-[#5A4638] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSending || sentSuccess || !title.trim() || !message.trim()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-black transition-all shadow-md cursor-pointer ${
                sentSuccess
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#2B211B] hover:bg-[#3D2F27] text-[#F6F3ED] disabled:opacity-50'
              }`}
            >
              {isSending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>DISPATCHING...</span>
                </>
              ) : sentSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                  <span>DISPATCHED LIVE!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#B66A4C]" />
                  <span>DISPATCH PUSH TO APP</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
