import React from 'react';

export const StadiumTransitionSection: React.FC = () => {
  return (
    <section className="relative w-full h-[520px] sm:h-[620px] overflow-hidden bg-[#0a0608]">
      {/* Stadium Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter brightness-95 contrast-105"
        style={{ backgroundImage: `url('/assets/stadium-cinematic.jpg')` }}
      >
        <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#0a0608] via-[#0a0608]/75 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0a0608]/30 to-[#0a0608]/85" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#0a0608] via-[#0a0608]/75 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-14 pointer-events-none">
        <div className="max-w-xl">
          <div className="text-[11px] font-mono text-[#e294aa] uppercase tracking-widest mb-1.5 font-semibold">
            EVENT DESTINATION
          </div>
          <h3 className="text-3xl sm:text-4xl font-normal text-white font-['Alice',serif] drop-shadow-xl uppercase tracking-wide">
            Mass Gatherings, <br />
            <span className="text-[#f7d6de]">Harmonized in Real-Time.</span>
          </h3>
          <p className="mt-2.5 text-xs sm:text-sm text-stone-300 font-light max-w-md drop-shadow leading-relaxed">
            Continuous perimeter monitoring across entry gates, arrival avenues, and urban transit corridors.
          </p>
        </div>
      </div>
    </section>
  );
};
