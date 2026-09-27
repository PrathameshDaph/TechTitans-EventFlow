import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import {
  Map,
  BarChart3,
  Sparkles,
  AlertTriangle,
  Users,
  DoorOpen,
  MapPin,
  Sliders,
  CloudSun,
  Menu,
  Smartphone,
} from 'lucide-react';

export const DesktopNavigation: React.FC = () => {
  const {
    activeRoute,
    setActiveRoute,
    incidents,
    userSosAlerts,
    setIsNavDrawerOpen,
  } = useOperational();

  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status === 'ACTIVE').length;
  const sosActiveCount = userSosAlerts.filter(s => s.status !== 'RESOLVED').length;

  const navItems = [
    { label: 'Command', route: '/manager', icon: Map },
    { label: 'Intel', route: '/manager/analytics', icon: BarChart3 },
    { label: 'AI', route: '/manager/ai', icon: Sparkles, isAi: true },
    {
      label: 'Incidents',
      route: '/manager/incidents',
      icon: AlertTriangle,
      badge: criticalCount > 0 ? criticalCount : undefined,
      isCritical: criticalCount > 0,
    },
    { label: 'Crew', route: '/manager/crew', icon: Users },
    {
      label: 'Fan App',
      route: '/manager/attendees',
      icon: Smartphone,
      badge: sosActiveCount > 0 ? sosActiveCount : undefined,
      isCritical: sosActiveCount > 0,
    },
    { label: 'Gates', route: '/manager/gates', icon: DoorOpen },
    { label: 'Zones', route: '/manager/zones', icon: MapPin },
    { label: 'Weather AI', route: '/manager/weather', icon: CloudSun, isAi: true },
    { label: 'What-If', route: '/manager/what-if', icon: Sliders },
  ];

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-0 right-0 z-40 flex justify-center pointer-events-none px-2 sm:px-4">
      {/* Floating Pill Capsule Dock */}
      <nav
        className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 bg-white/94 backdrop-blur-2xl border border-[#E3DDD2] rounded-full px-2 py-1.5 shadow-elevated max-w-full overflow-x-auto no-scrollbar"
        role="navigation"
        aria-label="Operational Navigation Dock"
      >
        {/* Menu Drawer Button for Full Navigation */}
        <button
          onClick={() => setIsNavDrawerOpen(true)}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-full text-[#806C5D] hover:text-[#2B211B] hover:bg-[#F6F3ED] transition-colors cursor-pointer flex items-center gap-1"
          title="All Operational Modules"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-4 h-4 text-[#B66A4C]" />
          <span className="text-[10px] font-mono font-bold hidden xl:inline">MENU</span>
        </button>

        <div className="h-5 w-px bg-[#E3DDD2] mx-0.5" />

        {/* Primary Navigation Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.route;

            return (
              <button
                key={item.route}
                onClick={() => setActiveRoute(item.route)}
                className={`relative px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#2B211B] text-[#F6F3ED] shadow-sm scale-102'
                    : 'text-[#806C5D] hover:text-[#2B211B] hover:bg-[#F6F3ED]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? item.isAi ? 'text-[#F6F3ED]' : 'text-[#F6F3ED]'
                      : item.isAi ? 'text-[#B66A4C]' : 'text-[#806C5D]'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>

                {/* Critical Badge Indicator */}
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black ${
                      item.isCritical
                        ? 'bg-[#DC2626] text-white animate-pulse'
                        : 'bg-[#B66A4C] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
