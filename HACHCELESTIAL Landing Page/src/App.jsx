import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroGlobe from './components/HeroGlobe';
import StadiumTransitionSection from './components/StadiumTransitionSection';
import ScrollTransitionBanner from './components/ScrollTransitionBanner';
import EventStoriesGallery from './components/EventStoriesGallery';
import CoreCapabilities from './components/CoreCapabilities';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0608] text-[#f7eff2] font-sans selection:bg-[#d97d97]/40 selection:text-[#f7d6de]">
      {/* 1. Top Navigation Bar: Event Flow */}
      <Navbar onLoginClick={handleOpenLogin} />

      {/* 2. Hero 3D Rotating Globe (No zoom, constant size, looping arcs) */}
      <HeroGlobe onLoginClick={handleOpenLogin} />

      {/* 3. Stadium Background Transition Section below the globe */}
      <StadiumTransitionSection />

      {/* 4. Sequential Telemetry Highlight Pipeline: 1 -> 2 -> 3 -> 4 -> 5 */}
      <ScrollTransitionBanner />

      {/* 5. Redesigned Premium 3D Floating Spatial Gallery with Centered Statement */}
      <EventStoriesGallery />

      {/* 6. Core Orchestration Capabilities Explorer */}
      <CoreCapabilities />

      {/* 7. Interactive Before vs After Simulation Slider */}
      <BeforeAfterSlider />

      {/* 8. Clean Premium Footer with 'Made By Tech Titans' */}
      <Footer onLoginClick={handleOpenLogin} />

      {/* 9. Operations Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={handleCloseLogin} 
      />
    </div>
  );
}
