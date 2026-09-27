import React from 'react';
import { useTwin } from '../../context/TwinContext';
import {
  LayoutDashboard,
  CloudSun,
  MapPin,
  GitFork,
  SlidersHorizontal,
  Columns,
  MessageSquareShare,
  Bot,
  Network,
  AlertCircle
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, viewMode, playOperationalChime, liveCascade, simCascade } = useTwin();

  const currentRisk = viewMode === 'LIVE' ? liveCascade.overallRisk : simCascade.overallRisk;

  const navItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, badge: null },
    { id: 'weather-intel', label: 'Weather Intelligence', icon: CloudSun, badge: null },
    { id: 'twin-map', label: 'Digital Twin Map', icon: MapPin, badge: 'Live GIS' },
    { id: 'impact-propagation', label: 'Impact Propagation', icon: GitFork, badge: 'Cascade' },
    { id: 'what-if', label: 'What-If Simulator', icon: SlidersHorizontal, badge: 'Sandbox' },
    { id: 'live-vs-sim', label: 'Live vs Simulation', icon: Columns, badge: null },
    { id: 'social-signals', label: 'Social Signals', icon: MessageSquareShare, badge: '8 feeds' },
    { id: 'recommendations', label: 'AI Recommendations', icon: Bot, badge: '5 actions' },
    { id: 'entity-graph', label: 'Entity Graph', icon: Network, badge: 'Nodes' },
  ];

  return (
    <nav className="bg-[#EFE8DB]/60 border-b border-[#E4DED3] px-4 lg:px-8 py-2 overflow-x-auto custom-scrollbar">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-2 min-w-max">
        <div className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playOperationalChime('click');
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-150 font-mono tracking-wide ${
                  isActive
                    ? 'bg-[#2B1710] text-[#FFFEFB] shadow-subtle'
                    : 'text-[#756D66] hover:text-[#2A211D] hover:bg-[#FFFEFB]/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#EFE8DB]' : 'text-[#756D66]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isActive
                        ? 'bg-[#FFFEFB]/20 text-[#FFFEFB]'
                        : 'bg-[#E4DED3] text-[#756D66]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Operational Status Pill */}
        <div className="hidden 2xl:flex items-center gap-2 bg-[#FFFEFB] px-3 py-1.5 rounded-lg border border-[#E4DED3] text-[11px] font-mono">
          <span className="text-[#756D66]">ECOSYSTEM RISK:</span>
          <span
            className={`font-black uppercase ${
              currentRisk === 'CRITICAL'
                ? 'text-[#D92D3A]'
                : currentRisk === 'HIGH'
                ? 'text-[#D9822B]'
                : currentRisk === 'MODERATE'
                ? 'text-[#D9822B]'
                : 'text-[#2F7D45]'
            }`}
          >
            ● {currentRisk}
          </span>
          <span className="text-[#9C948B]">|</span>
          <span className="text-[#756D66]">ENGINE:</span>
          <span className="text-[#2A211D] font-bold">DETERMINISTIC V2</span>
        </div>
      </div>
    </nav>
  );
};
