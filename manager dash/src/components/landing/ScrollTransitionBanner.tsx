import React, { useState, useEffect, useRef } from 'react';
import { Globe, Layers, Shield, Activity, Cpu } from 'lucide-react';

export const ScrollTransitionBanner: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const steps = [
    { title: 'Global Inbound', desc: '14 International corridors', icon: Globe },
    { title: 'Regional Transport', desc: 'Rail, bus & shuttle sync', icon: Layers },
    { title: 'Hospitality Web', desc: '40+ Accommodations synced', icon: Shield },
    { title: 'Perimeter Access', desc: '8 Synchronized gates', icon: Activity },
    { title: 'Event Intelligence', desc: 'Live Digital Twin & Flow Engine', icon: Cpu },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isInView, steps.length]);

  return (
    <div 
      id="flow-pipeline"
      ref={containerRef}
      className="relative z-20 py-16 bg-[#0a0608] border-y border-[#d97d97]/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2a131b]/60 border border-[#d97d97]/25 text-[11px] font-mono text-[#e294aa] mb-2.5">
            <span>SYNCHRONIZED FLOW TELEMETRY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-['Outfit']">
            From global movement <span className="text-[#e294aa]">→</span> to event intelligence.
          </h2>
          <p className="text-sm text-stone-400 mt-2 max-w-xl mx-auto font-light">
            Sequential perimeter orchestration connecting attendee migration from arrival to arena ingress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
          
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-[#d97d97]/10 via-[#d97d97]/35 to-[#d97d97]/10 -translate-y-4 pointer-events-none" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isHighlighted = isInView && activeStep === idx;

            return (
              <div 
                key={idx} 
                className={`relative group p-4 rounded-xl transition-all duration-500 ${
                  isHighlighted 
                    ? 'border-[#e294aa] shadow-[0_0_25px_rgba(217,125,151,0.3)] ring-2 ring-[#e294aa]/60 bg-gradient-to-b from-[#3b1923]/70 to-[#180d13] scale-[1.03] z-10' 
                    : 'glass-panel border-stone-800/80 hover:border-[#d97d97]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                    isHighlighted 
                      ? 'bg-[#d97d97]/30 text-[#f7d6de] shadow-sm' 
                      : 'bg-stone-900 text-stone-400 group-hover:text-[#e294aa]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <span className={`text-[10px] font-mono font-bold transition-colors ${
                    isHighlighted ? 'text-[#f7d6de]' : 'text-stone-500'
                  }`}>
                    0{idx + 1}
                  </span>
                </div>

                <div className={`font-semibold text-sm font-['Outfit'] transition-colors ${
                  isHighlighted ? 'text-white' : 'text-stone-300'
                }`}>
                  {step.title}
                </div>

                <div className={`text-xs mt-0.5 transition-colors ${
                  isHighlighted ? 'text-[#f7d6de]/90 font-medium' : 'text-stone-400'
                }`}>
                  {step.desc}
                </div>

                {isHighlighted && (
                  <div className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e294aa] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e294aa]"></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
