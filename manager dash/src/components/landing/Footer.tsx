import React, { useEffect, useRef } from 'react';
import { ArrowUp, Mail, LogIn } from 'lucide-react';

interface FooterProps {
  onLoginClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLoginClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let mouse = { x: -1000, y: -1000 };
    const handleCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleCanvasMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleCanvasMouseMove);

    const nodeCount = 55;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.3,
      });
    }

    const pulses: Array<{
      from: { x: number; y: number };
      to: { x: number; y: number };
      progress: number;
      speed: number;
    }> = [];
    const maxPulses = 15;

    const spawnPulse = () => {
      if (pulses.length >= maxPulses) return;
      const i1 = Math.floor(Math.random() * nodeCount);
      const i2 = Math.floor(Math.random() * nodeCount);
      if (i1 === i2) return;
      const d = Math.hypot(nodes[i1].x - nodes[i2].x, nodes[i1].y - nodes[i2].y);
      if (d < 160) {
        pulses.push({
          from: nodes[i1],
          to: nodes[i2],
          progress: 0,
          speed: 0.008 + Math.random() * 0.012,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (Math.random() < 0.1) spawnPulse();

      for (let i = 0; i < nodeCount; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const mouseDist = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (mouseDist < 120) {
          const angle = Math.atan2(n.y - mouse.y, n.x - mouse.x);
          n.x += Math.cos(angle) * 0.8;
          n.y += Math.sin(angle) * 0.8;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = mouseDist < 120 ? 'rgba(247, 214, 222, 0.9)' : 'rgba(226, 148, 170, 0.55)';
        ctx.shadowColor = 'rgba(217, 125, 151, 0.6)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < nodeCount; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            const lineAlpha = (1 - dist / 150) * 0.22;
            ctx.strokeStyle = `rgba(217, 125, 151, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
        const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#f7d6de';
        ctx.shadowColor = '#e294aa';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <footer className="relative z-20 bg-[#070305] border-t border-[#d97d97]/20 pt-16 pb-12 overflow-hidden text-[#e2d5da] text-xs font-light">
      
      {/* Animated Neural Network Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0"
      />

      {/* Ambient glows */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[300px] bg-[#5c2a35]/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-[#e294aa]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#d97d97]/15">
          
          {/* Brand Info & Mission Statement */}
          <div className="md:col-span-12 lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-[#5c2a35]/50 border border-[#d97d97]/40 bg-[#160b11] p-1.5 group">
                <img 
                  src="/assets/event-flow-logo.png" 
                  alt="Event Flow Logo"
                  className="w-full h-full object-contain filter contrast-110"
                />
              </div>
              <div>
                <div className="font-extrabold text-white text-lg tracking-widest font-['Outfit']">
                  EVENT <span className="text-[#e294aa] font-light">FLOW</span>
                </div>
                <div className="text-[10px] font-mono text-[#d97d97]/80 uppercase tracking-widest">
                  Event Operations OS
                </div>
              </div>
            </div>

            <p className="text-xs text-[#c2b2b9] font-light leading-relaxed max-w-sm">
              The first AI-powered event management and crowd flow platform for stadiums, concerts, festivals, and conferences.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={onLoginClick}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d97d97]/30 via-[#a64d67]/35 to-[#5c2a35]/50 hover:from-[#d97d97]/50 hover:to-[#5c2a35]/70 border border-[#d97d97]/40 text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-black/80"
              >
                <LogIn className="w-3.5 h-3.5 text-[#e294aa]" />
                <span>Log In</span>
              </button>
              
              <a 
                href="mailto:contact@eventflow.orchestra" 
                className="p-2.5 rounded-xl border border-[#d97d97]/20 hover:border-[#e294aa] bg-[#1a0d14]/60 text-[#e294aa] hover:text-[#f7d6de] transition-colors"
                title="Direct Operations Contact"
              >
                <Mail className="w-4 h-4" />
              </a>

              <button 
                onClick={scrollToTop}
                className="p-2.5 rounded-xl border border-[#d97d97]/20 hover:border-[#e294aa] bg-[#1a0d14]/60 text-[#e294aa] hover:text-[#f7d6de] transition-colors cursor-pointer"
                title="Scroll To Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3 Subgrid Columns */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e294aa]" />
                <span>Capabilities</span>
              </div>
              <ul className="space-y-2.5 text-[11px] text-[#b8a6af]">
                <li><a href="#capabilities" className="hover:text-[#f7d6de] transition-colors">Crowd Intelligence</a></li>
                <li><a href="#capabilities" className="hover:text-[#f7d6de] transition-colors">Venue Intelligence</a></li>
                <li><a href="#capabilities" className="hover:text-[#f7d6de] transition-colors">Mobility Intelligence</a></li>
                <li><a href="#capabilities" className="hover:text-[#f7d6de] transition-colors">Hospitality Intelligence</a></li>
                <li><a href="#capabilities" className="hover:text-[#f7d6de] transition-colors">AI Decision Support</a></li>
                <li><a href="#capabilities" className="hover:text-[#f7d6de] transition-colors">Simulation & Optimization</a></li>
                <li><a href="#capabilities" className="hover:text-[#f7d6de] transition-colors">Crew Operations</a></li>
                <li><a href="#capabilities" className="hover:text-[#f7d6de] transition-colors">Incident Support</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e294aa]" />
                <span>Events</span>
              </div>
              <ul className="space-y-2.5 text-[11px] text-[#b8a6af]">
                <li><a href="#gallery" className="hover:text-[#f7d6de] transition-colors">Stadiums & Arenas</a></li>
                <li><a href="#gallery" className="hover:text-[#f7d6de] transition-colors">Music Festivals</a></li>
                <li><a href="#gallery" className="hover:text-[#f7d6de] transition-colors">Conferences & Expos</a></li>
                <li><a href="#gallery" className="hover:text-[#f7d6de] transition-colors">Cultural Gatherings</a></li>
                <li><a href="#flow-pipeline" className="hover:text-[#f7d6de] transition-colors">Transit Hubs</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e294aa]" />
                <span>Navigation</span>
              </div>
              <ul className="space-y-2.5 text-[11px] text-[#b8a6af]">
                <li><a href="#hero" className="hover:text-[#f7d6de] transition-colors">Overview</a></li>
                <li><a href="#flow-pipeline" className="hover:text-[#f7d6de] transition-colors">Flow Pipeline</a></li>
                <li><a href="#gallery" className="hover:text-[#f7d6de] transition-colors">Event Stories</a></li>
                <li><a href="#capabilities" className="hover:text-[#f7d6de] transition-colors">Capabilities</a></li>
                <li><a href="#simulation" className="hover:text-[#f7d6de] transition-colors">Before vs After</a></li>
                <li><button onClick={onLoginClick} className="hover:text-[#f7d6de] transition-colors text-left cursor-pointer">Log In</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[11px]">
          <div className="text-stone-400">
            &copy; {new Date().getFullYear()} EVENT FLOW. ALL RIGHTS RESERVED.
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3b1923]/70 via-[#220f18]/80 to-[#12070d]/90 border border-[#e294aa]/50 shadow-lg shadow-[#5c2a35]/40 group hover:border-[#f7d6de] transition-colors">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e294aa] opacity-85"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f7d6de]"></span>
            </span>
            <span className="text-[#f7d6de] font-bold tracking-wider uppercase text-xs">
              Made By Tech Titans
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
