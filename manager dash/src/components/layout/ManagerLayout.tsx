import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { ManagerHeader } from './ManagerHeader';
import { DesktopNavigation } from './DesktopNavigation';
import { NavigationDrawer } from './NavigationDrawer';
import { ToastNotifications } from '../common/ToastNotifications';
import { IntelligenceSheet } from '../map/IntelligenceSheet';
import { EventFlowAssistant } from '../ai/EventFlowAssistant';
import { EmergencyAuthorizationModal } from '../emergency/EmergencyAuthorizationModal';
import { RealVenueCommandMap } from '../map/RealVenueCommandMap';

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children }) => {
  const { activeRoute } = useOperational();
  const isCommandMap = activeRoute === '/manager' || activeRoute === '/manager/command' || activeRoute === '/';

  return (
    <div className="min-h-screen bg-[#F6F3ED] text-[#2B211B] flex flex-col antialiased selection:bg-[#EEE9DF] selection:text-[#2B211B] relative overflow-x-hidden">
      {/* 1. Global Visual Digital Twin: Persistent Real Venue Command Map */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto">
        <RealVenueCommandMap isIntelMode={!isCommandMap} />
      </div>

      {/* Top Manager Header (Floating on Command Map, Sticky on other pages) */}
      <ManagerHeader />

      {/* Floating Real-time Operational Toast Manager */}
      <ToastNotifications />

      {/* Floating Navigation Slide-out Drawer */}
      <NavigationDrawer />

      {/* Right-Side Intelligence Sheet (Opens when any map entity/marker/alert is clicked) */}
      <IntelligenceSheet />

      {/* Floating Glass AI Assistant Chat Panel */}
      <EventFlowAssistant />

      {/* Safety Governance: Critical Incident Human Authorization Modal */}
      <EmergencyAuthorizationModal />

      {/* Main Content Area: Floating pass-through for Command Map, Containerized with Apple Liquid Glass for Intel & others */}
      {isCommandMap ? (
        <main className="fixed inset-0 w-screen h-screen overflow-hidden z-10 pointer-events-none p-0 m-0">
          {children}
        </main>
      ) : (
        <main className={`relative z-10 flex-1 w-full ${activeRoute === '/manager/what-if' || activeRoute === '/manager/weather' ? 'max-w-[1780px] px-2 sm:px-4' : 'max-w-7xl px-3 sm:px-4 md:px-6'} mx-auto pt-16 sm:pt-20 pb-24 sm:pb-28 pointer-events-auto`}>
          {children}
        </main>
      )}

      {/* Floating Bottom Capsule Navigation Dock */}
      <DesktopNavigation />
    </div>
  );
};
