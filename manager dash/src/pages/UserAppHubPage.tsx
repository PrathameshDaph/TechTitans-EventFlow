import React, { useState } from 'react';
import { useOperational } from '../context/OperationalContext';
import {
  Smartphone,
  Ticket,
  UtensilsCrossed,
  PackageSearch,
  AlertOctagon,
  Radio,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  Phone,
  QrCode,
  Sparkles,
  RefreshCw,
  BellRing,
  Coffee,
} from 'lucide-react';
import { UserFoodOrder, UserLostFoundReport, UserSosAlert, FanAdvisoryBroadcast } from '../types';

export const UserAppHubPage: React.FC = () => {
  const {
    userTickets,
    userOrders,
    lostFoundReports,
    userSosAlerts,
    fanBroadcasts,
    scanTicketPass,
    advanceOrderStatus,
    updateLostFoundState,
    dispatchCrewToSos,
    resolveSosAlert,
    sendFanBroadcast,
    crew,
    addToast,
  } = useOperational();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'ORDERS' | 'LOST_FOUND' | 'SOS' | 'BROADCAST'>('TICKETS');

  // Search and filter states
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketBlockFilter, setTicketBlockFilter] = useState('ALL');
  const [manualScanId, setManualScanId] = useState('');

  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  const [lostFoundStatusFilter, setLostFoundStatusFilter] = useState<string>('ALL');

  // Broadcast composer state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastBlock, setBroadcastBlock] = useState('ALL');
  const [broadcastType, setBroadcastType] = useState<FanAdvisoryBroadcast['type']>('ANNOUNCEMENT');

  // Crew dispatch dropdown state for SOS
  const [selectedCrewForSos, setSelectedCrewForSos] = useState<{ [alertId: string]: string }>({});

  // Calculations
  const scannedTicketsCount = userTickets.filter(t => t.isScanned).length;
  const inPrepOrdersCount = userOrders.filter(o => o.status === 'IN_PREPARATION' || o.status === 'PLACED').length;
  const readyOrdersCount = userOrders.filter(o => o.status === 'READY_FOR_PICKUP').length;
  const activeLostFoundCount = lostFoundReports.filter(lf => lf.status !== 'CLAIMED_RETURNED').length;
  const activeSosCount = userSosAlerts.filter(s => s.status !== 'RESOLVED').length;

  const totalConcessionRevenue = userOrders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);

  // Filtered lists
  const filteredTickets = userTickets.filter(t => {
    const matchesBlock = ticketBlockFilter === 'ALL' || t.block === ticketBlockFilter;
    const matchesSearch =
      t.visitorName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.ticketId.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.seat.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.gate.toLowerCase().includes(ticketSearch.toLowerCase());
    return matchesBlock && matchesSearch;
  });

  const filteredOrders = userOrders.filter(o => {
    return orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
  });

  const filteredLostFound = lostFoundReports.filter(lf => {
    return lostFoundStatusFilter === 'ALL' || lf.status === lostFoundStatusFilter;
  });

  const handleManualScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualScanId.trim()) return;
    await scanTicketPass(manualScanId.trim());
    setManualScanId('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    sendFanBroadcast(broadcastTitle, broadcastMessage, broadcastBlock, broadcastType);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  const applyTemplate = (title: string, message: string, block: string, type: FanAdvisoryBroadcast['type']) => {
    setBroadcastTitle(title);
    setBroadcastMessage(message);
    setBroadcastBlock(block);
    setBroadcastType(type);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-[#2B211B] pb-24">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-7 border border-[#E3DDD2] shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B66A4C] font-black">
              ATTENDEE TELEMETRY & FAN OPERATIONS
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              ● 18,450 CONNECTED IN STADIUM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B211B] tracking-tight mt-1 flex items-center gap-2.5">
            <Smartphone className="w-8 h-8 text-[#B66A4C]" />
            FAN APP COMMAND HUB
          </h1>
          <p className="text-xs sm:text-sm text-[#766C63] mt-1 max-w-3xl">
            Central orchestration bridge for the <strong>ALLin User App</strong> ecosystem: live gate pass validation, pre-order concession counters, crowd lost & found custody, and fan emergency SOS response.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3.5 py-2 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] text-[#2B211B] font-bold">
            All 8 Blocks Synced
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#2E7D32] animate-pulse" />
            Live Bi-Directional Bridge
          </div>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('TICKETS')}
          className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer shadow-soft hover:border-[#B66A4C] ${
            activeTab === 'TICKETS' ? 'border-[#B66A4C] ring-2 ring-[#B66A4C]/20' : 'border-[#E3DDD2]'
          }`}
        >
          <div className="flex items-center justify-between text-[#806C5D] mb-1">
            <span className="text-[10px] font-mono font-bold uppercase">Pass Scans</span>
            <Ticket className="w-4 h-4 text-[#B66A4C]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2B211B]">
            {scannedTicketsCount} <span className="text-xs text-[#806C5D] font-normal">/ {userTickets.length}</span>
          </div>
          <div className="text-[10px] text-[#2E7D32] font-mono font-bold mt-1">
            {Math.round((scannedTicketsCount / userTickets.length) * 100)}% Ingress Cleared
          </div>
        </div>

        <div
          onClick={() => setActiveTab('ORDERS')}
          className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer shadow-soft hover:border-[#B66A4C] ${
            activeTab === 'ORDERS' ? 'border-[#B66A4C] ring-2 ring-[#B66A4C]/20' : 'border-[#E3DDD2]'
          }`}
        >
          <div className="flex items-center justify-between text-[#806C5D] mb-1">
            <span className="text-[10px] font-mono font-bold uppercase">Concessions</span>
            <UtensilsCrossed className="w-4 h-4 text-[#B66A4C]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2B211B]">
            {inPrepOrdersCount + readyOrdersCount} <span className="text-xs text-[#806C5D] font-normal">Active</span>
          </div>
          <div className="text-[10px] text-[#806C5D] font-mono mt-1">
            ₹{totalConcessionRevenue.toLocaleString()} Revenue
          </div>
        </div>

        <div
          onClick={() => setActiveTab('LOST_FOUND')}
          className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer shadow-soft hover:border-[#B66A4C] ${
            activeTab === 'LOST_FOUND' ? 'border-[#B66A4C] ring-2 ring-[#B66A4C]/20' : 'border-[#E3DDD2]'
          }`}
        >
          <div className="flex items-center justify-between text-[#806C5D] mb-1">
            <span className="text-[10px] font-mono font-bold uppercase">Lost & Found</span>
            <PackageSearch className="w-4 h-4 text-[#B66A4C]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2B211B]">
            {activeLostFoundCount} <span className="text-xs text-[#806C5D] font-normal">In Custody</span>
          </div>
          <div className="text-[10px] text-[#2E7D32] font-mono font-bold mt-1">
            {lostFoundReports.filter(l => l.status === 'CLAIMED_RETURNED').length} Reunited
          </div>
        </div>

        <div
          onClick={() => setActiveTab('SOS')}
          className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer shadow-soft hover:border-[#DC2626] ${
            activeTab === 'SOS' ? 'border-[#DC2626] ring-2 ring-[#DC2626]/20' : 'border-[#E3DDD2]'
          }`}
        >
          <div className="flex items-center justify-between text-[#806C5D] mb-1">
            <span className="text-[10px] font-mono font-bold uppercase">Fan SOS</span>
            <AlertOctagon className={`w-4 h-4 ${activeSosCount > 0 ? 'text-[#DC2626] animate-bounce' : 'text-[#806C5D]'}`} />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2B211B]">
            {activeSosCount} <span className="text-xs text-[#DC2626] font-normal font-mono">Urgent</span>
          </div>
          <div className="text-[10px] text-[#766C63] font-mono mt-1">
            Priority Field Triage
          </div>
        </div>

        <div
          onClick={() => setActiveTab('BROADCAST')}
          className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer shadow-soft hover:border-[#B66A4C] ${
            activeTab === 'BROADCAST' ? 'border-[#B66A4C] ring-2 ring-[#B66A4C]/20' : 'border-[#E3DDD2]'
          }`}
        >
          <div className="flex items-center justify-between text-[#806C5D] mb-1">
            <span className="text-[10px] font-mono font-bold uppercase">Fan Broadcasts</span>
            <Radio className="w-4 h-4 text-[#B66A4C]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2B211B]">
            {fanBroadcasts.length} <span className="text-xs text-[#806C5D] font-normal">Pushed</span>
          </div>
          <div className="text-[10px] text-[#2E7D32] font-mono font-bold mt-1">
            Instant Notification
          </div>
        </div>
      </div>

      {/* Navigation Module Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-[#E3DDD2] shadow-soft overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('TICKETS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'TICKETS'
              ? 'bg-[#2B211B] text-white shadow-sm'
              : 'text-[#806C5D] hover:bg-[#FAF8F5] hover:text-[#2B211B]'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Ticket Passes & Gate Ingress ({userTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ORDERS'
              ? 'bg-[#2B211B] text-white shadow-sm'
              : 'text-[#806C5D] hover:bg-[#FAF8F5] hover:text-[#2B211B]'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Concession Pre-Orders ({userOrders.length})</span>
          {inPrepOrdersCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FEF3C7] text-[#D97706]">
              {inPrepOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('LOST_FOUND')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'LOST_FOUND'
              ? 'bg-[#2B211B] text-white shadow-sm'
              : 'text-[#806C5D] hover:bg-[#FAF8F5] hover:text-[#2B211B]'
          }`}
        >
          <PackageSearch className="w-3.5 h-3.5" />
          <span>Lost & Found Registry ({lostFoundReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SOS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'SOS'
              ? 'bg-[#DC2626] text-white shadow-sm'
              : 'text-[#806C5D] hover:bg-[#FAF8F5] hover:text-[#DC2626]'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Attendee SOS Directives ({userSosAlerts.length})</span>
          {activeSosCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white text-[#DC2626] animate-pulse">
              {activeSosCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('BROADCAST')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'BROADCAST'
              ? 'bg-[#2B211B] text-white shadow-sm'
              : 'text-[#806C5D] hover:bg-[#FAF8F5] hover:text-[#2B211B]'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Broadcast Fan Advisory</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TICKETS & GATE INGRESS */}
      {/* ========================================================================= */}
      {activeTab === 'TICKETS' && (
        <div className="space-y-6">
          {/* Controls: Search, Filter & Manual Scanner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-4 bg-white rounded-3xl border border-[#E3DDD2] shadow-soft space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#806C5D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    placeholder="Search visitor, ticket ID, seat, gate..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                  {['ALL', 'Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6', 'Block 7', 'Block 8'].map(block => (
                    <button
                      key={block}
                      onClick={() => setTicketBlockFilter(block)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                        ticketBlockFilter === block
                          ? 'bg-[#2B211B] text-white'
                          : 'text-[#806C5D] hover:bg-[#FAF8F5] hover:text-[#2B211B]'
                      }`}
                    >
                      {block}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Turnstile Scan Simulator */}
            <form onSubmit={handleManualScanSubmit} className="p-4 bg-white rounded-3xl border border-[#E3DDD2] shadow-soft flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-mono font-bold text-[#806C5D] uppercase mb-1">
                  MANUAL INGRESS SCANNER
                </label>
                <div className="relative">
                  <QrCode className="w-4 h-4 text-[#806C5D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualScanId}
                    onChange={(e) => setManualScanId(e.target.value)}
                    placeholder="Enter or scan pass ID..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs text-[#2B211B] focus:outline-none focus:border-[#B66A4C] font-mono uppercase"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                Scan
              </button>
            </form>
          </div>

          {/* Ticket Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTickets.map(ticket => {
              return (
                <div
                  key={ticket.ticketId}
                  className={`p-5 rounded-3xl bg-white border shadow-soft flex flex-col justify-between space-y-4 transition-all ${
                    ticket.isScanned ? 'border-[#C8E6C9]' : 'border-[#E3DDD2] hover:border-[#B66A4C]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-[#B66A4C]">
                        {ticket.ticketId}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          ticket.isScanned
                            ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                            : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                        }`}
                      >
                        {ticket.isScanned ? `SCANNED (${ticket.scannedAt || 'IN VENUE'})` : 'PENDING INGRESS'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-[#2B211B]">{ticket.visitorName}</h4>
                      <p className="text-[11px] text-[#766C63] font-mono">{ticket.userPhone}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-[#806C5D]">
                        <span>BLOCK & SEAT:</span>
                        <span className="font-bold text-[#2B211B]">{ticket.block} • {ticket.row} {ticket.seat}</span>
                      </div>
                      <div className="flex justify-between text-[#806C5D]">
                        <span>INGRESS GATE:</span>
                        <span className="font-bold text-[#B66A4C]">{ticket.gate}</span>
                      </div>
                      <div className="flex justify-between text-[#806C5D] pt-1 border-t border-[#E3DDD2]">
                        <span>TIER:</span>
                        <span className="truncate max-w-[150px] text-[#2B211B]">{ticket.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E3DDD2]">
                    {!ticket.isScanned ? (
                      <button
                        onClick={() => scanTicketPass(ticket.ticketId)}
                        className="w-full py-2 px-3 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                        Authorize Turnstile Scan
                      </button>
                    ) : (
                      <div className="py-1.5 px-3 rounded-xl bg-[#E8F5E9] text-[#2E7D32] text-xs font-mono font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                        Checked In Successfully
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONCESSION PRE-ORDERS */}
      {/* ========================================================================= */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-6">
          {/* Order Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#E3DDD2] shadow-soft">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['ALL', 'PLACED', 'IN_PREPARATION', 'READY_FOR_PICKUP', 'COMPLETED'].map(status => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    orderStatusFilter === status
                      ? 'bg-[#2B211B] text-white shadow-sm'
                      : 'text-[#806C5D] hover:bg-[#FAF8F5] hover:text-[#2B211B]'
                  }`}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-[#806C5D] font-bold">
              Showing {filteredOrders.length} concession orders
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map(order => {
              const isReady = order.status === 'READY_FOR_PICKUP';
              const isInPrep = order.status === 'IN_PREPARATION';
              const isPlaced = order.status === 'PLACED';
              const isCompleted = order.status === 'COMPLETED';

              return (
                <div
                  key={order.orderId}
                  className="p-5 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft flex flex-col justify-between space-y-4 hover:border-[#B66A4C] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-[#2B211B]">
                          {order.orderId}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E3DDD2] text-[#806C5D]">
                          Ref: {order.referenceCode}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isReady
                            ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                            : isInPrep
                            ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                            : isPlaced
                            ? 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]'
                            : 'bg-[#F3F4F6] text-[#4B5563]'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-[#2B211B] flex items-center justify-between">
                        <span>{order.userName}</span>
                        <span className="text-sm font-bold text-[#B66A4C]">₹{order.totalAmount}</span>
                      </h4>
                      <p className="text-[11px] text-[#806C5D] font-mono">{order.userPhone} • {order.block}</p>
                    </div>

                    {/* Items List */}
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-1.5 text-xs font-mono">
                      <div className="text-[10px] text-[#806C5D] uppercase font-bold border-b border-[#E3DDD2] pb-1">
                        ITEMS PREPARATION LIST:
                      </div>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-[#2B211B] flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-[#2E7D32]' : 'bg-[#DC2626]'}`} />
                            {item.quantity}x {item.itemName}
                          </span>
                          <span className="text-[#806C5D]">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-[#806C5D]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B66A4C]" />
                        {order.pickupCounter}
                      </span>
                      <span className="flex items-center gap-1 text-[#2B211B] font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#806C5D]" />
                        {order.pickupServingTime}
                      </span>
                    </div>
                  </div>

                  {/* Status Advancement Button */}
                  <div className="pt-2 border-t border-[#E3DDD2] flex items-center gap-2">
                    {isPlaced && (
                      <button
                        onClick={() => advanceOrderStatus(order.orderId, 'IN_PREPARATION')}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                      >
                        Start Prep in Kitchen
                      </button>
                    )}
                    {isInPrep && (
                      <button
                        onClick={() => advanceOrderStatus(order.orderId, 'READY_FOR_PICKUP')}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                      >
                        Mark Ready for Counter Pickup
                      </button>
                    )}
                    {isReady && (
                      <button
                        onClick={() => advanceOrderStatus(order.orderId, 'COMPLETED')}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                      >
                        Complete Handover to Fan
                      </button>
                    )}
                    {isCompleted && (
                      <div className="flex-1 py-2 text-center text-xs font-mono font-bold text-[#2E7D32]">
                        ✓ Order Fulfilled
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LOST & FOUND REGISTRY */}
      {/* ========================================================================= */}
      {activeTab === 'LOST_FOUND' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#E3DDD2] shadow-soft">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['ALL', 'SUBMITTED', 'UNDER_INVESTIGATION', 'FOUND_SECURED', 'CLAIMED_RETURNED'].map(status => (
                <button
                  key={status}
                  onClick={() => setLostFoundStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    lostFoundStatusFilter === status
                      ? 'bg-[#2B211B] text-white shadow-sm'
                      : 'text-[#806C5D] hover:bg-[#FAF8F5] hover:text-[#2B211B]'
                  }`}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-[#806C5D] font-bold">
              {filteredLostFound.length} items logged
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLostFound.map(item => {
              const isFound = item.status === 'FOUND_SECURED';
              const isClaimed = item.status === 'CLAIMED_RETURNED';

              return (
                <div
                  key={item.reportId}
                  className="p-5 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft flex flex-col justify-between space-y-4 hover:border-[#B66A4C] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-[#B66A4C]">
                        {item.reportId}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isClaimed
                            ? 'bg-[#E8F5E9] text-[#2E7D32]'
                            : isFound
                            ? 'bg-[#E0F2FE] text-[#0369A1]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono font-bold uppercase text-[#806C5D]">
                        {item.category}
                      </div>
                      <h4 className="text-sm font-black text-[#2B211B] mt-0.5">
                        {item.description}
                      </h4>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#806C5D]">LOCATION:</span>
                        <span className="font-bold text-[#2B211B]">{item.block}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#806C5D]">REPORTER:</span>
                        <span className="font-bold text-[#2B211B]">{item.reporterName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#806C5D]">CONTACT:</span>
                        <span className="font-bold text-[#B66A4C]">{item.contactNumber}</span>
                      </div>
                      <div className="pt-1 border-t border-[#E3DDD2]">
                        <span className="text-[#806C5D] block text-[10px]">CUSTODY NOTES:</span>
                        <span className="text-[#2B211B] block font-medium mt-0.5">{item.additionalDetails}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E3DDD2] flex items-center gap-2">
                    {!isClaimed ? (
                      <>
                        <button
                          onClick={() => updateLostFoundState(item.reportId || item.id || '', 'FOUND_SECURED', 'Item stored in Central Safe')}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-[#2B211B] text-xs font-mono font-bold transition-colors cursor-pointer"
                        >
                          Mark Secured
                        </button>
                        <button
                          onClick={() => updateLostFoundState(item.reportId || item.id || '', 'CLAIMED_RETURNED', 'Handed over to verified owner')}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                        >
                          Return to Owner
                        </button>
                      </>
                    ) : (
                      <div className="w-full py-2 text-center text-xs font-mono font-bold text-[#2E7D32] bg-[#E8F5E9] rounded-xl">
                        ✓ Case Closed & Returned
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ATTENDEE SOS DIRECTIVES */}
      {/* ========================================================================= */}
      {activeTab === 'SOS' && (
        <div className="space-y-6">
          <div className="p-4 rounded-3xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black text-[#991B1B]">HIGH-PRIORITY ATTENDEE PANIC & SOS INBOX</h4>
              <p className="text-xs text-[#B91C1C] mt-0.5">
                Signals triggered by fans using the ALLin user mobile application emergency panic button. Review coordinates, dispatch nearest tactical crew immediately, and track resolution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userSosAlerts.map(alert => {
              const isTriggered = alert.status === 'TRIGGERED';
              const isDispatched = alert.status === 'CREW_DISPATCHED';
              const isResolved = alert.status === 'RESOLVED';

              return (
                <div
                  key={alert.alertId}
                  className={`p-5 rounded-3xl bg-white border shadow-soft flex flex-col justify-between space-y-4 transition-all ${
                    isTriggered
                      ? 'border-[#DC2626] ring-2 ring-[#DC2626]/20'
                      : isDispatched
                      ? 'border-[#D97706]'
                      : 'border-[#C8E6C9]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-[#DC2626] flex items-center gap-1">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        {alert.alertId}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isTriggered
                            ? 'bg-[#FEE2E2] text-[#DC2626] animate-pulse'
                            : isDispatched
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#E8F5E9] text-[#2E7D32]'
                        }`}
                      >
                        {alert.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-[#2B211B]">{alert.userName}</h4>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#806C5D]">
                          {alert.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#806C5D] font-mono mt-0.5">
                        {alert.userPhone} • {alert.block} ({alert.seat})
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-[#806C5D] uppercase block">FAN'S DISTRESS SIGNAL:</span>
                        <p className="text-[#2B211B] font-medium mt-0.5 leading-relaxed">{alert.message}</p>
                      </div>

                      {alert.assignedCrewCallsign && (
                        <div className="pt-2 border-t border-[#E3DDD2] flex items-center justify-between text-xs">
                          <span className="text-[10px] text-[#806C5D] uppercase">ASSIGNED UNIT:</span>
                          <span className="font-bold text-[#B66A4C]">{alert.assignedCrewCallsign}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Crew Dispatcher */}
                  <div className="pt-2 border-t border-[#E3DDD2] space-y-2">
                    {!isResolved ? (
                      <>
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedCrewForSos[alert.alertId] || ''}
                            onChange={(e) => setSelectedCrewForSos({ ...selectedCrewForSos, [alert.alertId]: e.target.value })}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs font-mono text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
                          >
                            <option value="">Select Crew Unit to Dispatch...</option>
                            {crew
                              .filter(c => c.status === 'AVAILABLE' || c.status === 'ACTIVE')
                              .map(c => (
                                <option key={c.id} value={c.id}>
                                  {c.callsign} ({c.role.replace('_', ' ')})
                                </option>
                              ))}
                          </select>
                          <button
                            onClick={() => {
                              const crewId = selectedCrewForSos[alert.alertId];
                              if (!crewId) {
                                addToast('warning', 'Select Crew', 'Please select a crew unit from the list to dispatch.');
                                return;
                              }
                              dispatchCrewToSos(alert.alertId, crewId);
                            }}
                            className="py-1.5 px-3 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Dispatch
                          </button>
                        </div>

                        <button
                          onClick={() => resolveSosAlert(alert.alertId)}
                          className="w-full py-1.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#E8F5E9] border border-[#E3DDD2] hover:border-[#C8E6C9] text-[#2E7D32] text-xs font-mono font-bold transition-colors cursor-pointer"
                        >
                          Mark Situation Resolved
                        </button>
                      </>
                    ) : (
                      <div className="py-2 text-center text-xs font-mono font-bold text-[#2E7D32] bg-[#E8F5E9] rounded-xl">
                        ✓ Situation Cleared & Attended
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BROADCAST FAN ADVISORY */}
      {/* ========================================================================= */}
      {activeTab === 'BROADCAST' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Broadcast Composer */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-4">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#B66A4C]" />
              <h3 className="text-base font-black text-[#2B211B]">
                COMPOSE REAL-TIME FAN PUSH NOTIFICATION
              </h3>
            </div>
            <p className="text-xs text-[#766C63]">
              Pushes immediate audio-haptic alerts to spectators' mobile devices running ALLin inside Wankhede Stadium.
            </p>

            {/* Quick Templates */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase">
                QUICK TACTICAL PRESETS:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      'Gate 3 Ingress Surge -> Use Gate 2',
                      'Gate 3 wait is currently 18 minutes. Head 40 meters north towards Gate 2 for immediate entry under 3 mins.',
                      'Block 3',
                      'CONGESTION_REDIRECT'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-[11px] font-mono text-[#2B211B] transition-colors cursor-pointer"
                >
                  ⚡ Gate 3 Surge Redirect
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      'Parking Lot P04 Full -> Shuttle Available',
                      'Parking P04 is at capacity. Arriving vehicles please divert to Marine Drive Plaza. Shuttles running every 4 mins.',
                      'ALL',
                      'PARKING_UPDATE'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-[11px] font-mono text-[#2B211B] transition-colors cursor-pointer"
                >
                  🚗 Parking Diversion
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      'Innings Break Food Counters Open',
                      'Innings break approaching in 10 mins. Pre-order your snacks now on BOOK NOW to skip lines at your block kiosk.',
                      'ALL',
                      'ANNOUNCEMENT'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-[11px] font-mono text-[#2B211B] transition-colors cursor-pointer"
                >
                  🍔 Concession Rush Call
                </button>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#806C5D] uppercase mb-1">
                    TARGET AUDIENCE SECTOR
                  </label>
                  <select
                    value={broadcastBlock}
                    onChange={(e) => setBroadcastBlock(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
                  >
                    <option value="ALL">Entire Stadium (All 8 Blocks)</option>
                    <option value="Block 1">Block 1 (West Pavilion)</option>
                    <option value="Block 2">Block 2 (North Concourse)</option>
                    <option value="Block 3">Block 3 (Garware Stand)</option>
                    <option value="Block 4">Block 4 (East Concourse)</option>
                    <option value="Block 5">Block 5 (North Stand East)</option>
                    <option value="Block 6">Block 6 (Vijay Merchant)</option>
                    <option value="Block 7">Block 7 (Sunil Gavaskar)</option>
                    <option value="Block 8">Block 8 (South Stand)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#806C5D] uppercase mb-1">
                    ADVISORY CLASSIFICATION
                  </label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
                  >
                    <option value="ANNOUNCEMENT">Official Announcement</option>
                    <option value="CONGESTION_REDIRECT">Congestion Redirect Directive</option>
                    <option value="PARKING_UPDATE">Parking & Transit Update</option>
                    <option value="WEATHER_ADVISORY">Weather & Hydration Advisory</option>
                    <option value="SAFETY_DIRECTIVE">Safety & Evacuation Directive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#806C5D] uppercase mb-1">
                  HEADLINE TITLE
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Ingress Flow Advisory: Gate 3 Divert"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#806C5D] uppercase mb-1">
                  NOTIFICATION BODY
                </label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={3}
                  placeholder="Enter the full message to display in the user notification shade..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-[#2B211B] focus:outline-none focus:border-[#B66A4C]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-soft"
              >
                <Send className="w-4 h-4 text-[#B66A4C]" />
                TRANSMIT BROADCAST DIRECTIVE TO FAN APPS
              </button>
            </form>
          </div>

          {/* Broadcast History */}
          <div className="p-6 rounded-3xl bg-white border border-[#E3DDD2] shadow-soft space-y-4">
            <h3 className="text-sm font-black text-[#2B211B] flex items-center gap-2">
              <BellRing className="w-4 h-4 text-[#B66A4C]" />
              TRANSMITTED FEED LOG
            </h3>

            <div className="space-y-3">
              {fanBroadcasts.map(b => (
                <div key={b.id} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2B211B]">{b.title}</span>
                    <span className="text-[10px] text-[#806C5D]">{b.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#766C63] font-sans leading-relaxed">{b.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#806C5D] pt-1 border-t border-[#E3DDD2]">
                    <span>Target: {b.targetBlock}</span>
                    <span className="text-[#B66A4C]">{b.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
