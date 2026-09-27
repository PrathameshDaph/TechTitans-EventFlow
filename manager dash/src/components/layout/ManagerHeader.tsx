import React, { useState } from 'react';
import { useOperational } from '../../context/OperationalContext';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Shield,
  Bell,
  Sparkles,
  User,
  Play,
  Pause,
  ChevronDown,
  CloudSun,
  Sliders,
  Smartphone,
  LogOut,
  Radio,
  Send,
} from 'lucide-react';
import { SystemHealthPopover } from './SystemHealthPopover';
import { PushNotificationModal } from '../dashboard/PushNotificationModal';

export const ManagerHeader: React.FC = () => {
  const { currentUser, logout, connectionStatus } = useAuth();
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);
  const {
    eventMeta,
    notifications,
    incidents,
    userSosAlerts,
    isSimulating,
    setIsSimulating,
    setIsNavDrawerOpen,
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    isSystemHealthOpen,
    setIsSystemHealthOpen,
    activeRoute,
    setActiveRoute,
  } = useOperational();

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeSosCount = userSosAlerts.filter(s => s.status !== 'RESOLVED').length;
  const isCommandMap = activeRoute === '/manager' || activeRoute === '/manager/command' || activeRoute === '/';

  return isCommandMap ? (
    /* Floating Glass Header for Command Map View (Zero card obstruction, pure map surface) */
    <header className="fixed top-2 sm:top-3.5 left-0 right-0 z-40 pointer-events-none px-3 sm:px-5 flex items-center justify-between gap-2 text-[#2B211B]">
      {/* LEFT FLOATING CAPSULE: Menu Drawer & Brand Identity */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 bg-white/94 backdrop-blur-2xl rounded-full border border-[#E3DDD2] shadow-glass">
        <button
          onClick={() => setIsNavDrawerOpen(true)}
          className="w-8 h-8 rounded-full hover:bg-[#EEE9DF] flex items-center justify-center text-[#2B211B] transition-colors cursor-pointer"
          title="Open Event Navigation"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-4 h-4 text-[#B66A4C]" />
        </button>

        <div
          onClick={() => setActiveRoute('/manager')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-7 h-7 rounded-full bg-[#2B211B] text-[#F6F3ED] flex items-center justify-center shadow-xs">
            <Shield className="w-3.5 h-3.5 text-[#B66A4C]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black tracking-tight text-[#2B211B]">
              EventFlow
            </span>
            <span className="text-[9px] font-mono font-black text-[#B66A4C] uppercase tracking-wider">
              TWIN
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-[#E3DDD2] hidden sm:block" />

        {/* Live Operational Status */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32]" />
          </span>
          <span className="text-[10px] font-mono font-black tracking-wider text-[#1E6B24] uppercase">
            LIVE
          </span>
        </div>
      </div>

      {/* CENTER FLOATING PILL: Event Meta & Sync State */}
      <div className="pointer-events-auto hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/94 backdrop-blur-2xl rounded-full border border-[#E3DDD2] shadow-glass">
        <span className="text-xs font-black text-[#2B211B] tracking-tight">
          {eventMeta.name}
        </span>
        <div className="h-3 w-px bg-[#E3DDD2]" />
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className="flex items-center gap-1 text-[10px] font-mono text-[#806C5D] hover:text-[#2B211B] transition-colors cursor-pointer"
          title={isSimulating ? 'Pause simulation stream' : 'Resume simulation stream'}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3 h-3 text-[#D97706]" />
              <span>3s Sync</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-[#2E7D32]" />
              <span className="text-[#DC2626] font-bold">PAUSED</span>
            </>
          )}
        </button>
      </div>

      {/* RIGHT FLOATING CAPSULE: System Health, AI, Alerts, Profile */}
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-2 sm:px-2.5 py-1 bg-white/94 backdrop-blur-2xl rounded-full border border-[#E3DDD2] shadow-glass">
        {/* System Status */}
        <div className="relative">
          <button
            onClick={() => setIsSystemHealthOpen(!isSystemHealthOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-[#EEE9DF] text-[10px] font-mono font-bold text-[#5A4638] transition-colors cursor-pointer"
            aria-label="System status"
          >
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="hidden lg:inline text-[#2B211B]">ONLINE</span>
            <ChevronDown className="w-3 h-3 text-[#806C5D]" />
          </button>
          <SystemHealthPopover />
        </div>

        {/* Weather AI Button */}
        <button
          onClick={() => setActiveRoute('/manager/weather')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#B66A4C]/30 text-[#2B211B] transition-all group cursor-pointer"
          title="Launch Weather Twin AI"
          aria-label="Launch Weather Twin AI"
        >
          <CloudSun className="w-3.5 h-3.5 text-[#B66A4C] group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono font-bold hidden md:inline">Weather AI</span>
        </button>

        {/* Fan App Button */}
        <button
          onClick={() => setActiveRoute('/manager/attendees')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#B66A4C]/30 text-[#2B211B] transition-all group cursor-pointer"
          title="Launch Fan App Command Hub"
          aria-label="Launch Fan App Command Hub"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#B66A4C] group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono font-bold hidden md:inline">Fan App</span>
          {activeSosCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-[#DC2626] text-white animate-pulse">
              {activeSosCount}
            </span>
          )}
        </button>

        {/* Push Notification Broadcast Button */}
        <button
          onClick={() => setIsPushModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#2B211B] hover:text-[#F6F3ED] border border-[#B66A4C]/40 text-[#2B211B] transition-all group cursor-pointer shadow-xs"
          title="Dispatch Live Push Notification to Volunteers & Field Crew"
          aria-label="Dispatch Push Notification"
        >
          <Radio className="w-3.5 h-3.5 text-[#B66A4C] group-hover:text-[#F6F3ED] group-hover:scale-110 transition-transform animate-pulse" />
          <span className="text-[11px] font-mono font-bold hidden md:inline">Push Alert</span>
        </button>

        {/* Ask AI Button */}
        <button
          onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#B66A4C]/30 text-[#2B211B] transition-all group cursor-pointer"
          aria-label="Ask EventFlow AI"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B66A4C] group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono font-bold hidden sm:inline">Ask AI</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setActiveRoute('/manager/alerts')}
          className="relative p-1.5 rounded-full hover:bg-[#EEE9DF] text-[#5A4638] hover:text-[#2B211B] transition-colors cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[8px] font-mono font-bold text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Manager Profile & Logout */}
        <div className="flex items-center gap-1.5 pl-1 border-l border-[#E3DDD2]">
          <div className="w-7 h-7 rounded-full bg-[#EEE9DF] border border-[#E3DDD2] flex items-center justify-center text-[#2B211B] flex-shrink-0" title={`Logged in as ${currentUser?.name || 'Manager'} (${currentUser?.id || 'mgr-001'})`}>
            <span className="text-xs">{currentUser?.avatar || '👨‍💼'}</span>
          </div>
          <button
            onClick={() => logout()}
            className="p-1 rounded-full hover:bg-[#FEF2F2] text-[#806C5D] hover:text-[#DC2626] transition-colors cursor-pointer"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <PushNotificationModal
        isOpen={isPushModalOpen}
        onClose={() => setIsPushModalOpen(false)}
      />
    </header>
  ) : (
    /* Standard Full-width Header for Analytical & Information Pages */
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#E3DDD2] shadow-soft text-[#2B211B]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 relative">

        {/* LEFT: Menu Drawer Trigger & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setIsNavDrawerOpen(true)}
            className="w-9 h-9 rounded-xl hover:bg-[#EEE9DF] border border-[#E3DDD2] flex items-center justify-center text-[#2B211B] transition-colors cursor-pointer"
            title="Open Event Navigation"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div
            onClick={() => setActiveRoute('/manager')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-[#2B211B] text-[#F6F3ED] flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4 text-[#B66A4C]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#2B211B]">
                EventFlow
              </span>
              <span className="text-[10px] font-mono font-black text-[#B66A4C] uppercase tracking-wider">
                TWIN
              </span>
            </div>
          </div>
        </div>

        {/* CENTER: Event Name & Live Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 bg-[#FAF8F5]/90 border border-[#E3DDD2] rounded-full shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32]" />
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-black tracking-wider text-[#1E6B24] uppercase">
              LIVE
            </span>
          </div>

          <div className="h-3 w-px bg-[#E3DDD2]" />

          <span className="text-xs sm:text-sm font-extrabold text-[#2B211B] tracking-tight truncate max-w-[140px] sm:max-w-none">
            {eventMeta.name}
          </span>

          <span className="hidden md:inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EEE9DF] text-[#5A4638]">
            35K CAPACITY
          </span>

          <div className="hidden lg:flex items-center h-3 w-px bg-[#E3DDD2]" />

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-[#806C5D] hover:text-[#2B211B] transition-colors cursor-pointer"
            title={isSimulating ? 'Pause simulation stream' : 'Resume simulation stream'}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3 h-3 text-[#D97706]" />
                <span>3s Sync</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#2E7D32]" />
                <span className="text-[#DC2626] font-bold">PAUSED</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT: Action Cluster (System Health, AI, Notifications, Profile) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* System Status Pill */}
          <div className="relative">
            <button
              onClick={() => setIsSystemHealthOpen(!isSystemHealthOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-[11px] font-mono font-bold text-[#5A4638] transition-colors cursor-pointer"
              aria-label="System status"
            >
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              <span className="hidden md:inline">SYSTEM:</span>
              <span className="text-[#2B211B]">ONLINE</span>
              <ChevronDown className="w-3 h-3 text-[#806C5D]" />
            </button>
            <SystemHealthPopover />
          </div>

          {/* Push Notification Broadcast Button */}
          <button
            onClick={() => setIsPushModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white hover:bg-[#2B211B] hover:text-[#F6F3ED] border border-[#B66A4C]/40 text-[#2B211B] transition-all group shadow-xs cursor-pointer"
            title="Dispatch Live Push Notification to Volunteers & Field Crew"
            aria-label="Dispatch Push Notification"
          >
            <Radio className="w-3.5 h-3.5 text-[#B66A4C] group-hover:text-[#F6F3ED] group-hover:scale-110 transition-transform animate-pulse" />
            <span className="text-xs font-mono font-bold hidden sm:inline">
              Push Notification
            </span>
          </button>

          {/* Weather AI Button */}
          <button
            onClick={() => setActiveRoute('/manager/weather')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-all group shadow-xs cursor-pointer ${
              activeRoute === '/manager/weather'
                ? 'bg-[#2B211B] text-[#F6F3ED]'
                : 'bg-white hover:bg-[#FAF8F5] border border-[#B66A4C]/40 text-[#2B211B]'
            }`}
            title="Launch Weather Twin AI"
          >
            <CloudSun className={`w-3.5 h-3.5 ${activeRoute === '/manager/weather' ? 'text-[#F6F3ED]' : 'text-[#B66A4C]'} group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-mono font-bold hidden sm:inline">
              Weather AI
            </span>
          </button>

          {/* Fan App Button */}
          <button
            onClick={() => setActiveRoute('/manager/attendees')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-all group shadow-xs cursor-pointer ${
              activeRoute === '/manager/attendees' || activeRoute === '/manager/user-app'
                ? 'bg-[#2B211B] text-[#F6F3ED]'
                : 'bg-white hover:bg-[#FAF8F5] border border-[#B66A4C]/40 text-[#2B211B]'
            }`}
            title="Launch Fan App Command Hub"
          >
            <Smartphone className={`w-3.5 h-3.5 ${activeRoute === '/manager/attendees' || activeRoute === '/manager/user-app' ? 'text-[#F6F3ED]' : 'text-[#B66A4C]'} group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-mono font-bold hidden sm:inline">
              Fan App
            </span>
            {activeSosCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-[#DC2626] text-white animate-pulse">
                {activeSosCount}
              </span>
            )}
          </button>

          {/* Ask EventFlow AI Button */}
          <button
            onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#B66A4C]/40 text-[#2B211B] transition-all group shadow-xs cursor-pointer"
            aria-label="Ask EventFlow AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B66A4C] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-mono font-bold hidden sm:inline">
              Ask AI
            </span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveRoute('/manager/alerts')}
            className="relative p-2 rounded-xl hover:bg-[#EEE9DF] border border-transparent hover:border-[#E3DDD2] text-[#5A4638] hover:text-[#2B211B] transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[9px] font-mono font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Manager Profile Chip & Logout */}
          <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-[#E3DDD2]">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#EEE9DF] border border-[#E3DDD2] flex items-center justify-center text-[#2B211B] flex-shrink-0">
              <span className="text-sm">{currentUser?.avatar || '👨‍💼'}</span>
            </div>
            <div className="hidden xl:flex flex-col text-left leading-none">
              <span className="text-xs font-extrabold text-[#2B211B] truncate max-w-[120px]">{currentUser?.name || 'Commander'}</span>
              <span className="text-[9px] font-mono text-[#806C5D] mt-0.5">ID: {currentUser?.id || 'mgr-001'}</span>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-xl hover:bg-[#FEF2F2] text-[#806C5D] hover:text-[#DC2626] transition-colors cursor-pointer ml-1"
              title="Logout Session"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <PushNotificationModal
        isOpen={isPushModalOpen}
        onClose={() => setIsPushModalOpen(false)}
      />
    </header>
  );
};
