import React, { useState, useEffect, useRef } from 'react';

const galleryItems = [
  // 1. Top-Center
  {
    id: 1,
    title: 'Open-Air Amphitheater Festival',
    image: '/assets/amphitheater-concert.jpg',
    posDesktop: { top: '3%', left: '37%' },
    width: 'w-64 sm:w-80 md:w-92',
    aspect: 'aspect-[16/10]',
    baseRot: 1.5,
    depth: 1.3,
  },
  // 2. Top-Left
  {
    id: 2,
    title: 'World Stadium Championship',
    image: '/assets/stadium-cinematic.jpg',
    posDesktop: { top: '7%', left: '7%' },
    width: 'w-64 sm:w-80 md:w-96',
    aspect: 'aspect-[16/10]',
    baseRot: -4,
    depth: 1.45,
  },
  // 3. Top-Right
  {
    id: 3,
    title: 'Global Night Music Festival',
    image: '/assets/concert-festival.jpg',
    posDesktop: { top: '9%', right: '6%' },
    width: 'w-64 sm:w-80 md:w-96',
    aspect: 'aspect-[16/10]',
    baseRot: 4.5,
    depth: 0.95,
  },
  // 4. Mid-Left
  {
    id: 4,
    title: 'World Summit & Innovation Expo',
    image: '/assets/summit-convention.jpg',
    posDesktop: { top: '40%', left: '2%' },
    width: 'w-60 sm:w-72 md:w-84',
    aspect: 'aspect-[16/10]',
    baseRot: 3,
    depth: 1.2,
  },
  // 5. Mid-Right
  {
    id: 5,
    title: 'Indoor Arena Finals',
    image: '/assets/sports-championship.jpg',
    posDesktop: { top: '42%', right: '2%' },
    width: 'w-64 sm:w-76 md:w-88',
    aspect: 'aspect-[16/10]',
    baseRot: -3.5,
    depth: 1.55,
  },
  // 6. Bottom-Left
  {
    id: 6,
    title: 'Waterfront Cultural Gathering',
    image: '/assets/cultural-festival.jpg',
    posDesktop: { bottom: '7%', left: '9%' },
    width: 'w-64 sm:w-80 md:w-96',
    aspect: 'aspect-[16/10]',
    baseRot: -2.5,
    depth: 0.85,
  },
  // 7. Bottom-Right
  {
    id: 7,
    title: 'Multimodal Transit Corridor',
    image: '/assets/mobility-hub.jpg',
    posDesktop: { bottom: '6%', right: '8%' },
    width: 'w-64 sm:w-80 md:w-96',
    aspect: 'aspect-[16/10]',
    baseRot: 3.5,
    depth: 1.15,
  },
  // 8. Bottom-Center
  {
    id: 8,
    title: 'Smart Turnstiles & Ingress Hub',
    image: '/assets/crowd-entry.jpg',
    posDesktop: { bottom: '2%', left: '38%' },
    width: 'w-56 sm:w-68 md:w-76',
    aspect: 'aspect-[16/10]',
    baseRot: -1.5,
    depth: 1.35,
  }
];

export default function EventStoriesGallery() {
  const containerRef = useRef(null);
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const [renderedMouse, setRenderedMouse] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    targetMouseRef.current = { x, y };
  };

  const handleMouseLeave = () => {
    targetMouseRef.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    let animId;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const loop = () => {
      const target = targetMouseRef.current;
      const current = currentMouseRef.current;

      current.x = lerp(current.x, target.x, 0.06);
      current.y = lerp(current.y, target.y, 0.06);

      setRenderedMouse({ x: current.x, y: current.y });
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section 
      id="gallery"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-20 w-full min-h-[920px] lg:min-h-[1120px] bg-[#0a0608] overflow-hidden flex items-center justify-center py-24 select-none"
    >
      {/* Deep ambient glow in rose-gold & wine */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] bg-gradient-to-r from-[#5c2a35]/25 via-[#d97d97]/20 to-transparent blur-[160px] rounded-full pointer-events-none" />

      {/* CENTER STATEMENT */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center pointer-events-none">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-['Outfit'] leading-[1.1]">
          Every Event Tells <br />
          <span className="bg-gradient-to-r from-[#f7d6de] via-[#e294aa] to-white bg-clip-text text-transparent">
            a Bigger Story
          </span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-stone-300 font-light tracking-wider">
          People. Places. Movement. One connected story.
        </p>
      </div>

      {/* FLOATING 3D IMAGE CANVAS (DESKTOP) - FULL CIRCLE */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {galleryItems.map((item) => {
          const shiftX = renderedMouse.x * 35 * item.depth;
          const shiftY = renderedMouse.y * 35 * item.depth;
          const rotTilt = item.baseRot + renderedMouse.x * 4 * item.depth;

          const isHovered = hoveredId === item.id;
          const isOtherHovered = hoveredId !== null && !isHovered;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                ...item.posDesktop,
                transform: `translate3d(${shiftX}px, ${shiftY}px, 0px) rotate(${rotTilt}deg) scale(${isHovered ? 1.08 : 1})`,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s, filter 0.4s',
              }}
              className={`absolute pointer-events-auto rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#d97d97]/60 shadow-2xl shadow-black/90 cursor-pointer ${item.width} ${item.aspect} ${
                isHovered 
                  ? 'z-30 ring-2 ring-[#e294aa]/60 shadow-[#5c2a35]/60 brightness-105' 
                  : isOtherHovered 
                    ? 'opacity-60 brightness-75 z-10' 
                    : 'opacity-90 hover:opacity-100 z-10'
              }`}
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover object-center filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* MOBILE / TABLET VIEW */}
      <div className="md:hidden absolute inset-0 pt-60 px-4 grid grid-cols-2 gap-3 pointer-events-none overflow-hidden opacity-40">
        {galleryItems.slice(0, 4).map((item) => (
          <div 
            key={item.id} 
            className="rounded-xl overflow-hidden border border-white/10 aspect-[16/10]"
          >
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>

    </section>
  );
}
