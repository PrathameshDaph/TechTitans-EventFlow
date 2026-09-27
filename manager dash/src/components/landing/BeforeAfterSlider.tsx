import React, { useState, useRef, useCallback } from 'react';
import { AlertTriangle, CheckCircle, ArrowRightLeft } from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section 
      id="simulation"
      className="relative z-20 py-24 bg-[#0a0608] border-t border-[#d97d97]/15 overflow-hidden"
    >
      {/* Background ambient glow matching logo palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-r from-[#5c2a35]/25 via-[#d97d97]/15 to-transparent blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2a131b]/80 border border-[#d97d97]/30 text-xs font-mono text-[#f7d6de] mb-3 shadow-lg shadow-[#5c2a35]/25">
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#e294aa]" />
            <span>AI INTERVENTION RESOLUTION</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-['Outfit'] tracking-tight uppercase">
            BEFORE <span className="text-[#a64d67]/60 font-light">VS</span> <span className="bg-gradient-to-r from-[#f7d6de] via-[#e294aa] to-[#d97d97] bg-clip-text text-transparent">AFTER.</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[#dcd0d5] font-light max-w-xl mx-auto">
            Drag the slider to witness real-time AI autonomous rerouting dissolve perimeter bottlenecks in minutes.
          </p>

          {/* Preset Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => setSliderPosition(100)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer ${
                sliderPosition > 85 
                  ? 'bg-[#4a1c27]/70 text-[#f7d6de] border border-[#d97d97]/60 shadow-lg shadow-[#5c2a35]/50' 
                  : 'bg-[#140a0f]/60 text-stone-400 border border-[#d97d97]/15 hover:border-[#d97d97]/40'
              }`}
            >
              1. Unmanaged Bottleneck
            </button>
            <button
              onClick={() => setSliderPosition(50)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer ${
                sliderPosition >= 40 && sliderPosition <= 60 
                  ? 'bg-[#d97d97]/25 text-[#f7d6de] border border-[#e294aa] shadow-[0_0_15px_rgba(217,125,151,0.35)]' 
                  : 'bg-[#140a0f]/60 text-stone-400 border border-[#d97d97]/15 hover:border-[#d97d97]/40'
              }`}
            >
              Interactive Split
            </button>
            <button
              onClick={() => setSliderPosition(0)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer ${
                sliderPosition < 15 
                  ? 'bg-gradient-to-r from-[#8f3952]/90 to-[#d97d97]/50 text-white border border-[#f7d6de]/70 shadow-[0_0_20px_rgba(226,148,170,0.5)]' 
                  : 'bg-[#140a0f]/60 text-stone-400 border border-[#d97d97]/15 hover:border-[#d97d97]/40'
              }`}
            >
              2. AI-Optimized Flow
            </button>
          </div>
        </div>

        {/* Interactive Comparison Container */}
        <div 
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          className="relative h-[420px] sm:h-[540px] lg:h-[620px] w-full rounded-3xl overflow-hidden border border-[#d97d97]/30 select-none shadow-2xl shadow-black/90 cursor-ew-resize bg-[#0a0608]"
        >
          {/* Layer 2: AFTER IMAGE */}
          <div className="absolute inset-0 w-full h-full bg-[#0a0608]">
            <img 
              src="/assets/simulation-after.jpg" 
              alt="AI Optimized Event Flow"
              className="w-full h-full object-cover object-center pointer-events-none"
            />
            <div className="absolute top-6 right-6 px-4 py-2.5 rounded-2xl border border-[#e294aa]/60 bg-[#25101a]/90 backdrop-blur-xl shadow-xl shadow-[#5c2a35]/60 flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-[#f7d6de]" />
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-[#f7d6de] uppercase tracking-wider">
                  AFTER: AI ORCHESTRATED
                </div>
                <div className="text-[10px] text-[#e294aa] font-mono">
                  Dynamic Reroute • 0 Min Wait
                </div>
              </div>
            </div>
          </div>

          {/* Layer 1: BEFORE IMAGE */}
          <div 
            className="absolute inset-0 h-full overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="relative w-full h-full">
              <img 
                src="/assets/simulation-before.jpg" 
                alt="Unmanaged Event Bottleneck"
                className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                style={{ width: containerRef.current ? containerRef.current.clientWidth : '100%' }}
              />
              <div className="absolute top-6 left-6 px-4 py-2.5 rounded-2xl border border-[#5c2a35]/80 bg-[#12060b]/90 backdrop-blur-xl shadow-xl flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#d97d97] animate-pulse" />
                <div>
                  <div className="text-xs font-mono font-bold text-[#f7d6de] uppercase tracking-wider">
                    BEFORE: UNMANAGED CRISIS
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    Gate 2 Gridlock • Critical Bottleneck
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider Handle Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#f7d6de] via-[#e294aa] to-[#d97d97] shadow-[0_0_20px_rgba(226,148,170,0.85)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-gradient-to-b from-[#2a131c] to-[#12070d] border-2 border-[#e294aa] shadow-[0_0_25px_rgba(226,148,170,0.7)] flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 transition-transform active:scale-95">
              <ArrowRightLeft className="w-4 h-4 text-[#f7d6de]" />
            </div>
          </div>

          {/* Drag Instruction Helper */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full border border-[#d97d97]/25 bg-[#14080e]/85 backdrop-blur-md text-[11px] font-mono text-[#f7d6de] shadow-lg pointer-events-none tracking-wider">
            DRAG SLIDER TO REVEAL TRANSFORMATION
          </div>
        </div>

      </div>
    </section>
  );
};
