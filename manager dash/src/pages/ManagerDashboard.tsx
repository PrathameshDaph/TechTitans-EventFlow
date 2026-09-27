import React, { useState } from 'react';
import { RealVenueCommandMap } from '../components/map/RealVenueCommandMap';
import { EventPulsePanel } from '../components/map/EventPulsePanel';
import { Activity } from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const [isPulseOpen, setIsPulseOpen] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden text-[#2B211B] select-none pointer-events-none">
      {/* Optional Floating Pulse HUD Trigger - Unobtrusive & Off by default */}
      <div className="hidden xl:block absolute top-16 right-48 z-[1000] pointer-events-auto">
        <button
          onClick={() => setIsPulseOpen(!isPulseOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-glass border cursor-pointer ${
            isPulseOpen
              ? 'bg-[#2B211B] text-[#F6F3ED] border-[#2B211B]'
              : 'bg-white/94 backdrop-blur-xl text-[#5A4638] hover:text-[#2B211B] border-[#E3DDD2]'
          }`}
          title="Toggle live telemetry pulse HUD"
        >
          <Activity className="w-3.5 h-3.5 text-[#B66A4C]" />
          <span>PULSE HUD</span>
        </button>

        {isPulseOpen && (
          <div className="absolute top-10 right-0 max-w-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <EventPulsePanel />
          </div>
        )}
      </div>
    </div>
  );
};

