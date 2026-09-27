import React, { useState, useRef } from 'react';
import { 
  Users, 
  Building, 
  Car, 
  Hotel, 
  Bot, 
  Sliders, 
  UserCheck, 
  Search, 
  Shield
} from 'lucide-react';

const capabilities = [
  {
    id: 'crowd',
    title: 'Crowd Intelligence',
    subtitle: 'Real-time density telemetry & dynamic surge prediction',
    icon: Users,
    tag: 'DYNAMIC INGRESS'
  },
  {
    id: 'venue',
    title: 'Venue Intelligence',
    subtitle: '8-block spatial monitoring & turnstile velocity control',
    icon: Building,
    tag: 'SPATIAL TWIN'
  },
  {
    id: 'mobility',
    title: 'Mobility Intelligence',
    subtitle: 'Arterial road synchronization, express rail & smart parking',
    icon: Car,
    tag: 'TRANSIT ARTERIES'
  },
  {
    id: 'hospitality',
    title: 'Hospitality Intelligence',
    subtitle: '40+ partner hotel capacity & synchronized shuttle fleets',
    icon: Hotel,
    tag: 'CONCIERGE WEB'
  },
  {
    id: 'copilot',
    title: 'AI Decision Support',
    subtitle: 'Predictive situation analysis & autonomous recommendations',
    icon: Bot,
    tag: 'DECISION CORE'
  },
  {
    id: 'simulation',
    title: 'Simulation & Optimization',
    subtitle: 'Sandbox testing for road closures & adverse weather scenarios',
    icon: Sliders,
    tag: 'DIGITAL SANDBOX'
  },
  {
    id: 'crew',
    title: 'Crew Operations',
    subtitle: 'Geofenced workforce dispatch & automated responder routing',
    icon: UserCheck,
    tag: 'FIELD RESPONSE'
  },
  {
    id: 'incident',
    title: 'Incident & Lost Support',
    subtitle: 'Rapid missing person alerts & sector-level incident dispatch',
    icon: Search,
    tag: 'RESOLVE MATRIX'
  },
];

function CapabilityFlashcard({ cap, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = cap.icon;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(${isHovered ? '12px' : '0px'})`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
      className={`relative p-6 rounded-2xl transition-all duration-300 border flex flex-col justify-between select-none overflow-hidden group ${
        isHovered
          ? 'border-[#e294aa] bg-gradient-to-br from-[#3b1923]/70 via-[#1e0e16]/90 to-[#0a0507] shadow-2xl shadow-[#5c2a35]/50 ring-1 ring-[#e294aa]/60'
          : 'border-[#d97d97]/20 hover:border-[#d97d97]/40 bg-gradient-to-b from-[#180d14]/70 to-[#0e070b]/90 backdrop-blur-md'
      }`}
    >
      {/* Decorative Ribbon Gradient Line on Card Edge */}
      <div 
        className={`absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-500 ${
          isHovered 
            ? 'opacity-100 bg-gradient-to-r from-[#5c2a35] via-[#e294aa] to-[#f7d6de]' 
            : 'opacity-0'
        }`} 
      />

      <div>
        {/* Top Icon & Tag */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl transition-all duration-300 border ${
            isHovered 
              ? 'bg-gradient-to-br from-[#d97d97] to-[#a64d67] text-white border-[#f7d6de]/30 shadow-lg shadow-[#5c2a35]/60 scale-105' 
              : 'bg-[#24111a] text-[#e294aa] border-[#d97d97]/20'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-[#e294aa]/80 tracking-widest">
              0{index + 1}
            </span>
          </div>
        </div>

        {/* Category Tag */}
        <div className="text-[9px] font-mono uppercase tracking-widest text-[#d97d97]/80 mb-1.5 font-semibold">
          {cap.tag}
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold font-['Outfit'] transition-colors ${
          isHovered ? 'text-white' : 'text-[#f7eff2]'
        }`}>
          {cap.title}
        </h3>

        {/* Short Subtitle */}
        <p className="mt-2 text-xs text-[#c2b2b9] font-light leading-relaxed">
          {cap.subtitle}
        </p>
      </div>

      {/* Bottom Accent Line on Hover */}
      <div className={`mt-5 pt-3.5 border-t border-[#d97d97]/15 flex items-center justify-between text-[11px] font-mono transition-colors ${
        isHovered ? 'text-[#f7d6de]' : 'text-stone-500'
      }`}>
        <span className="tracking-wider">AUTONOMOUS ENGINE</span>
        <span className={`text-xs transition-transform duration-300 ${isHovered ? 'translate-x-1 text-[#e294aa]' : ''}`}>
          →
        </span>
      </div>
    </div>
  );
}

export default function CoreCapabilities() {
  return (
    <section 
      id="capabilities"
      className="relative z-20 py-24 bg-[#0a0608] border-t border-[#d97d97]/15 overflow-hidden"
    >
      {/* Background ambient glow matching logo palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#5c2a35]/25 via-[#d97d97]/15 to-transparent blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2a131b]/80 border border-[#d97d97]/30 text-xs font-mono text-[#f7d6de] mb-3 shadow-lg shadow-[#5c2a35]/25">
            <Shield className="w-3.5 h-3.5 text-[#e294aa]" />
            <span>OPERATIONAL ARCHITECTURE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight uppercase">
            ORCHESTRATION <span className="bg-gradient-to-r from-[#f7d6de] via-[#e294aa] to-[#d97d97] bg-clip-text text-transparent">CAPABILITIES</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[#dcd0d5] font-light max-w-xl mx-auto">
            Eight synchronized modules delivering absolute situational control for mega gatherings.
          </p>
        </div>

        {/* 8 Flashcards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {capabilities.map((cap, idx) => (
            <CapabilityFlashcard key={cap.id} cap={cap} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
