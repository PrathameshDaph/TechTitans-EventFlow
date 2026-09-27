import React, { useState, useEffect } from 'react';
import { LogIn } from 'lucide-react';

export default function Navbar({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0a0608]/90 backdrop-blur-xl border-b border-[#d97d97]/20 py-3 shadow-2xl shadow-black/80' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo with Event Flow Ribbon Logo */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-[#d97d97]/20 border border-[#d97d97]/30 group-hover:border-[#e294aa] transition-colors bg-[#140c10] p-1">
            <img 
              src="/assets/event-flow-logo.png" 
              alt="Event Flow Logo"
              className="w-full h-full object-contain filter contrast-110"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-widest text-white flex items-center gap-1.5 font-['Outfit']">
              EVENT <span className="text-[#e294aa] font-light">FLOW</span>
            </span>
            <span className="text-[10px] tracking-wider text-[#d97d97]/75 uppercase font-mono">
              Event Intelligence OS
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider text-stone-300 uppercase">
          <a href="#hero" className="hover:text-[#e294aa] transition-colors py-1">Overview</a>
          <a href="#flow-pipeline" className="hover:text-[#e294aa] transition-colors py-1">Flow Pipeline</a>
          <a href="#gallery" className="hover:text-[#e294aa] transition-colors py-1">Event Stories</a>
          <a href="#capabilities" className="hover:text-[#e294aa] transition-colors py-1">Capabilities</a>
          <a href="#simulation" className="hover:text-[#e294aa] transition-colors py-1">Simulation</a>
        </nav>

        {/* Right Action: Log In Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onLoginClick}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d97d97]/25 via-[#a64d67]/30 to-[#5c2a35]/40 hover:from-[#d97d97]/40 hover:to-[#5c2a35]/60 border border-[#d97d97]/40 hover:border-[#e294aa] text-white font-medium text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-black/60 hover:shadow-[#d97d97]/25 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-[#e294aa]" />
            <span>Log In</span>
          </button>
        </div>

      </div>
    </header>
  );
}
