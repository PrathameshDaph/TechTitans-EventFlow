import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { HeroGlobe } from './HeroGlobe';
import { StadiumTransitionSection } from './StadiumTransitionSection';
import { ScrollTransitionBanner } from './ScrollTransitionBanner';
import { EventStoriesGallery } from './EventStoriesGallery';
import { CoreCapabilities } from './CoreCapabilities';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Footer } from './Footer';
import { LandingLoginModal } from './LandingLoginModal';

export const LandingPage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0608] text-[#f7eff2] font-sans selection:bg-[#d97d97]/40 selection:text-[#f7d6de]">
      {/* 1. Top Navigation Bar */}
      <Navbar onLoginClick={handleOpenLogin} />

      {/* 2. Hero 3D Rotating Globe */}
      <HeroGlobe onLoginClick={handleOpenLogin} />

      {/* 3. Stadium Background Transition Section */}
      <StadiumTransitionSection />

      {/* 4. Sequential Telemetry Highlight Pipeline: 1 -> 2 -> 3 -> 4 -> 5 */}
      <ScrollTransitionBanner />

      {/* 5. Spatial Gallery */}
      <EventStoriesGallery />

      {/* 6. Core Orchestration Capabilities Explorer */}
      <CoreCapabilities />

      {/* 7. Interactive Before vs After Simulation Slider */}
      <BeforeAfterSlider />

      {/* 8. Clean Premium Footer with 'Made By Tech Titans' */}
      <Footer onLoginClick={handleOpenLogin} />

      {/* 9. Operations Login Modal */}
      <LandingLoginModal 
        isOpen={isLoginOpen} 
        onClose={handleCloseLogin} 
      />
    </div>
  );
};
