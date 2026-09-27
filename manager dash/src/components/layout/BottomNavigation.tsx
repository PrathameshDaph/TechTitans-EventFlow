import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { Home, Activity, MapPin, ClipboardCheck, Bell, Sparkles } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeRoute, setActiveRoute, alerts } = useOperational();
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const navItems = [
    { label: 'Home', route: '/manager', icon: Home },
    { label: 'Live', route: '/manager/live', icon: Activity },
    { label: 'Zones', route: '/manager/zones', icon: MapPin },
    { label: 'Tasks', route: '/manager/tasks', icon: ClipboardCheck },
    { label: 'Alerts', route: '/manager/alerts', icon: Bell, badge: unacknowledgedCount },
    { label: 'What-If', route: '/manager/what-if', icon: Sparkles },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 flex justify-center safe-bottom pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-around w-full max-w-md bg-white/95 backdrop-blur-md border border-border rounded-full px-2 py-1.5 shadow-[0_10px_30px_rgba(43,26,18,0.15)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.route;

          return (
            <button
              key={item.route}
              onClick={() => setActiveRoute(item.route)}
              className={`relative flex flex-col items-center justify-center min-w-[50px] py-1 px-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-secondary-text hover:text-primary'
              }`}
            >
              <div className="relative">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-beige shadow-sm scale-105'
                      : 'bg-transparent text-secondary'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.2px]' : 'stroke-[1.8px]'}`} />
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[8px] font-mono font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] tracking-tight mt-0.5 leading-none ${isActive ? 'font-black text-primary' : 'font-medium text-secondary-text'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
