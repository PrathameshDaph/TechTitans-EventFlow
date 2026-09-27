import React, { useState, useEffect } from 'react';
import { useOperational } from '../context/OperationalContext';
import {
  PackageSearch,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  Phone,
  User,
  Search,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const LostAndFoundPage: React.FC = () => {
  const {
    lostFoundReports,
    updateLostFoundState,
    addToast
  } = useOperational();

  const [activeTab, setActiveTab] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'MATCHED' | 'RETURNED' | 'CLOSED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // New report form state
  const [type, setType] = useState<'LOST' | 'FOUND'>('FOUND');
  const [category, setCategory] = useState('ELECTRONICS');
  const [itemTitle, setItemTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationFound, setLocationFound] = useState('Gate 3 (Section C)');
  const [reportedBy, setReportedBy] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || !description.trim()) return;

    try {
      const payload = {
        type,
        category,
        title: itemTitle,
        description,
        location: locationFound,
        reportedBy: reportedBy || 'Operations Desk',
        contactPhone: contactNumber,
        status: 'OPEN'
      };

      const res = await fetch('http://localhost:8000/api/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        addToast('success', 'Report Created', `Item ${data.item.id} registered into central repository`);
        setItemTitle('');
        setDescription('');
        setReportedBy('');
        setContactNumber('');
        setIsCreateOpen(false);
      }
    } catch (err) {
      console.error('Failed to create lost/found report:', err);
      addToast('critical', 'Error', 'Failed to submit lost/found report to server');
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/lost-found/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, resolvedBy: 'Commander (mgr-001)' })
      });

      if (res.ok) {
        updateLostFoundState(id, newStatus as any);
        addToast('info', 'Status Updated', `Item ${id} status changed to ${newStatus}`);
        if (selectedItem?.id === id) {
          setSelectedItem((prev: any) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const filteredItems = (lostFoundReports || []).filter(item => {
    if (activeTab !== 'ALL' && item.type !== activeTab) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchLoc = (item.location || '').toLowerCase().includes(q);
      const matchId = (item.id || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchLoc || matchId;
    }
    return true;
  });

  const openCount = (lostFoundReports || []).filter(i => i.status === 'OPEN').length;
  const matchedCount = (lostFoundReports || []).filter(i => i.status === 'MATCHED').length;
  const returnedCount = (lostFoundReports || []).filter(i => i.status === 'RETURNED').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-[#2B211B]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-7 border border-[#E3DDD2] shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B66A4C] font-black">
              ATTENDEE ASSET DESK & RECOVERY
            </span>
            {openCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                ● {openCount} OPEN CASES
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B211B] tracking-tight mt-1">
            LOST & FOUND COMMAND
          </h1>
          <p className="text-xs sm:text-sm text-[#766C63] mt-1 max-w-2xl">
            Real-time lost and found item management, attendee claims verification, inventory intake, and return logs across all gates and zones.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2B211B] hover:bg-[#1A1411] text-white text-xs font-bold font-mono transition-colors flex items-center gap-2 shadow-md self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C29B38]" />
          RECORD NEW ITEM
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E3DDD2] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            TOTAL INTAKE ITEMS
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2B211B] mt-1">
            {lostFoundReports?.length || 0}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Logged in Database</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E3DDD2] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            PENDING RECOVERY
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#D97706] mt-1">
            {openCount}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Active Inquiries</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E3DDD2] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            MATCHED / PENDING PICKUP
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2563EB] mt-1">
            {matchedCount}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Awaiting Owner</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E3DDD2] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            SUCCESSFULLY RETURNED
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2E7D32] mt-1">
            {returnedCount}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Verified & Closed</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#E3DDD2] shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Tabs */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E3DDD2]">
            {(['ALL', 'FOUND', 'LOST'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-[#2B211B] text-white shadow-xs'
                    : 'text-[#806C5D] hover:text-[#2B211B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs font-mono font-bold text-[#2B211B] focus:outline-none"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="OPEN">OPEN</option>
            <option value="MATCHED">MATCHED</option>
            <option value="RETURNED">RETURNED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#806C5D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, item name, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs font-mono font-medium text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
          />
        </div>
      </div>

      {/* Item Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isFound = item.type === 'FOUND';
            const isOpen = item.status === 'OPEN';
            const isMatched = item.status === 'MATCHED';
            const isReturned = item.status === 'RETURNED';

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft flex flex-col justify-between space-y-4 hover:border-[#B66A4C]/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase ${
                          isFound
                            ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                            : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-xs font-mono font-black text-[#2B211B]">
                        {item.id}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase ${
                        isOpen
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : isMatched
                          ? 'bg-[#DBEAFE] text-[#2563EB]'
                          : 'bg-[#E8F5E9] text-[#2E7D32]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#2B211B] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5A4638] mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#806C5D] uppercase">CATEGORY:</span>
                      <span className="font-bold text-[#2B211B]">{item.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#806C5D] uppercase">LOCATION:</span>
                      <span className="font-bold text-[#2B211B]">{item.location}</span>
                    </div>
                    {item.reportedBy && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#806C5D] uppercase">REPORTED BY:</span>
                        <span className="font-bold text-[#2B211B]">{item.reportedBy}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#806C5D] uppercase">LOGGED AT:</span>
                      <span className="text-[#806C5D]">{new Date(item.createdAt || item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-2 border-t border-[#E3DDD2] flex items-center gap-2">
                  {item.status === 'OPEN' && (
                    <button
                      onClick={() => handleStatusUpdate(item.id || item.reportId || '', 'MATCHED')}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1D4ED8] font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Matched
                    </button>
                  )}

                  {(item.status === 'OPEN' || item.status === 'MATCHED') && (
                    <button
                      onClick={() => handleStatusUpdate(item.id || item.reportId || '', 'RETURNED')}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#1E6B24] text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Returned
                    </button>
                  )}

                  {item.status === 'RETURNED' && (
                    <div className="w-full text-center py-1.5 text-xs font-mono font-bold text-[#2E7D32]">
                      ✓ Claim Verified & Returned
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E3DDD2]">
          <PackageSearch className="w-12 h-12 text-[#806C5D] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-[#2B211B] font-mono">No Lost & Found Items Found</h3>
          <p className="text-xs text-[#806C5D] mt-1">Try adjusting your search criteria or register a new intake.</p>
        </div>
      )}

      {/* Intake Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="RECORD LOST OR FOUND ITEM"
        subtitle="Intake attendee property claims into authoritative event database"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
                Report Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono font-bold text-[#2B211B]"
              >
                <option value="FOUND">FOUND ITEM (TURNED IN)</option>
                <option value="LOST">LOST ITEM (REPORTED MISSING)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono font-bold text-[#2B211B]"
              >
                <option value="ELECTRONICS">ELECTRONICS (PHONES, AIRPODS)</option>
                <option value="WALLETS_CARDS">WALLET / ID / CARDS</option>
                <option value="BAGS_CLOTHING">BAGS & APPAREL</option>
                <option value="KEYS">KEYS / BADGES</option>
                <option value="OTHER">OTHER MISCELLANEOUS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
              Item Title / Summary
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Midnight Blue iPhone 15 Pro in clear MagSafe case"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono font-bold text-[#2B211B]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
              Detailed Description & Distinguishing Marks
            </label>
            <textarea
              rows={3}
              required
              placeholder="Include color, stickers, scratches, lock screen photo description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono text-[#2B211B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
                Location Found / Lost
              </label>
              <input
                type="text"
                required
                value={locationFound}
                onChange={(e) => setLocationFound(e.target.value)}
                placeholder="e.g. Gate 3 / Zone C Concourse"
                className="w-full px-3 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono text-[#2B211B]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
                Reported By (Steward / Fan)
              </label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="e.g. Volunteer Diya Roy (VOL-002)"
                className="w-full px-3 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono text-[#2B211B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
              Contact Phone / Telegram ID (Optional)
            </label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono text-[#2B211B]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3DDD2]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#E3DDD2] hover:bg-[#FAF8F5] text-xs font-mono font-bold text-[#806C5D] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2B211B] hover:bg-[#1A1411] text-white text-xs font-mono font-bold transition-colors shadow-md cursor-pointer"
            >
              Register Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
