import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import {
  X,
  Compass,
  Map,
  Users,
  DoorOpen,
  Car,
  AlertTriangle,
  Bell,
  Sparkles,
  BarChart3,
  Sliders,
  Shield,
  CloudSun,
  ListTodo,
  Smartphone,
  PackageSearch,
} from 'lucide-react';

export const NavigationDrawer: React.FC = () => {
  const {
    isNavDrawerOpen,
    setIsNavDrawerOpen,
    activeRoute,
    setActiveRoute,
    incidents,
    notifications,
    userSosAlerts,
  } = useOperational();

  if (!isNavDrawerOpen) return null;

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' && i.status === 'ACTIVE').length;
  const activeSos = userSosAlerts.filter(s => s.status !== 'RESOLVED').length;

  const navLinks = [
    { route: '/manager', label: 'Command Map', icon: Map, badge: 'PRIMARY GIS' },
    { route: '/manager/analytics', label: 'Intel & Analytics', icon: BarChart3, badge: 'TELEMETRY' },
    { route: '/manager/ai', label: 'AI Intelligence & Directives', icon: Sparkles, badge: 'EXPLAINABLE' },
    {
      route: '/manager/lost-found',
      label: 'Lost & Found Desk',
      icon: PackageSearch,
      badge: 'DESK',
    },
    { route: '/manager/crew', label: 'Crew & Resource Dispatch', icon: Shield, badge: '18 ACTIVE' },
    {
      route: '/manager/attendees',
      label: 'Fan App & Attendee Hub',
      icon: Smartphone,
      badge: activeSos > 0 ? `${activeSos} SOS` : '18.4K FANS',
      badgeColor: activeSos > 0 ? 'bg-[#FEE2E2] text-[#DC2626]' : undefined,
    },
    { route: '/manager/gates', label: 'Gates & Ingress Flow', icon: DoorOpen, badge: '5 GATES' },
    { route: '/manager/zones', label: 'Crowd Density & Zones', icon: Users, badge: '5 ZONES' },
    { route: '/manager/weather', label: 'Weather Twin AI & Cascade', icon: CloudSun, badge: 'WEATHER AI' },
    { route: '/manager/parking', label: 'Parking & Mobility', icon: Car, badge: '4 LOTS' },
    { route: '/manager/tasks', label: 'Operational Tasks', icon: ListTodo, badge: 'DISPATCH' },
    { route: '/manager/what-if', label: 'What-If Scenario Sandbox', icon: Sliders, badge: 'SIMULATION' },
    {
      route: '/manager/alerts',
      label: 'Notification Center',
      icon: Bell,
      badge: unreadNotifs > 0 ? `${unreadNotifs} UNREAD` : undefined,
    },
  ];

  const handleNavigate = (route: string) => {
    setActiveRoute(route);
    setIsNavDrawerOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex bg-[#2B211B]/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsNavDrawerOpen(false)}
    >
      <div
        className="w-80 max-w-[85vw] h-full bg-white border-r border-[#E3DDD2] shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E3DDD2] flex items-center justify-between bg-[#F8EDE8]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2B211B] text-[#F6F3ED] flex items-center justify-center font-mono font-black text-sm">
              EF
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-[#2B211B] block font-mono">
                EVENTFLOW COMMAND
              </span>
              <span className="text-[10px] text-[#806C5D] font-mono">PS8 Mega Event Digital Twin</span>
            </div>
          </div>
          <button
            onClick={() => setIsNavDrawerOpen(false)}
            className="p-1.5 rounded-lg text-[#806C5D] hover:text-[#2B211B] hover:bg-[#E3DDD2]/50 transition-colors cursor-pointer"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeRoute === link.route;

            return (
              <button
                key={link.route}
                onClick={() => handleNavigate(link.route)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2B211B] text-[#F6F3ED] shadow-sm'
                    : 'text-[#806C5D] hover:bg-[#F6F3ED] hover:text-[#2B211B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F6F3ED]' : 'text-[#B66A4C]'}`} />
                  <span>{link.label}</span>
                </div>

                {link.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${
                      link.badgeColor ||
                      (isActive
                        ? 'bg-white/20 text-[#F6F3ED]'
                        : 'bg-[#F8EDE8] text-[#B66A4C]')
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#E3DDD2] bg-[#F6F3ED] text-[11px] font-mono text-[#806C5D] space-y-1">
          <div className="flex justify-between">
            <span>OPERATIONAL GIS ENGINE</span>
            <span className="font-bold text-[#2E7D32]">ONLINE</span>
          </div>
          <div className="flex justify-between text-[10px] text-[#806C5D]">
            <span>Venue: PS8 Stadium Delhi</span>
            <span>28.5828° N, 77.2344° E</span>
          </div>
        </div>
      </div>
    </div>
  );
};
