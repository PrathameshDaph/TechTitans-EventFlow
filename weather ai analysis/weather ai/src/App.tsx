import React from 'react';
import { TwinProvider, useTwin } from './context/TwinContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { DemoTourModal } from './components/common/DemoTourModal';
import { CommandCenter } from './components/pages/CommandCenter';
import { WeatherIntelligence } from './components/pages/WeatherIntelligence';
import { DigitalTwinMap } from './components/pages/DigitalTwinMap';
import { ImpactPropagation } from './components/pages/ImpactPropagation';
import { WhatIfSimulator } from './components/pages/WhatIfSimulator';
import { LiveVsSimulation } from './components/pages/LiveVsSimulation';
import { SocialSignals } from './components/pages/SocialSignals';
import { AiRecommendations } from './components/pages/AiRecommendations';
import { EntityGraph } from './components/pages/EntityGraph';
import { Radio, ShieldCheck, Activity, Cpu } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useTwin();

  return (
    <main className="max-w-[1720px] mx-auto px-4 lg:px-8 py-6">
      {activeTab === 'command-center' && <CommandCenter />}
      {activeTab === 'weather-intel' && <WeatherIntelligence />}
      {activeTab === 'twin-map' && <DigitalTwinMap />}
      {activeTab === 'impact-propagation' && <ImpactPropagation />}
      {activeTab === 'what-if' && <WhatIfSimulator />}
      {activeTab === 'live-vs-sim' && <LiveVsSimulation />}
      {activeTab === 'social-signals' && <SocialSignals />}
      {activeTab === 'recommendations' && <AiRecommendations />}
      {activeTab === 'entity-graph' && <EntityGraph />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <TwinProvider>
      <div className="min-h-screen flex flex-col bg-subtle-pattern text-[#2A211D]">
        <Header />
        <Navigation />
        <div className="flex-1">
          <MainContent />
        </div>
        <DemoTourModal />

        {/* Mission Control Footer */}
        <footer className="mt-auto border-t border-[#E4DED3] bg-[#EFE8DB]/40 px-4 lg:px-8 py-3 text-xs font-mono text-[#756D66]">
          <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2F7D45] animate-ping" />
              <strong className="text-[#2A211D]">WEATHER TWIN AI CORE</strong>
              <span>|</span>
              <span>100K CAPACITY STADIUM HOSPITALITY & TRAVEL DIGITAL TWIN</span>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#2B1710]" />
                CASCADE LATENCY: <strong>14ms</strong>
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F7D45]" />
                DETERMINISTIC SIMULATION: <strong>ACTIVE</strong>
              </span>
              <span>|</span>
              <span>STANDALONE PROTOTYPE v2.4</span>
            </div>
          </div>
        </footer>
      </div>
    </TwinProvider>
  );
};

export default App;
