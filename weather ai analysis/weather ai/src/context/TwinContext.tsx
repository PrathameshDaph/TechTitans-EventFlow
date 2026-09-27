import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  DigitalTwinState,
  WeatherCondition,
  WeatherForecastHour,
  SimulationParams,
  SocialSignal,
  AiRecommendation,
  WeatherScenario,
  RiskLevel,
  ImpactMetric
} from '../types';
import { BASELINE_LIVE_STATE, DEMO_WEATHER_BASELINE, INITIAL_AI_RECOMMENDATIONS } from '../data/demoData';
import { INITIAL_SOCIAL_SIGNALS } from '../data/socialSignalsData';
import { fetchLiveWeather, getDemoWeatherData } from '../services/weatherService';
import { calculateWeatherCascade, CascadeEngineResult } from '../simulation/cascadeEngine';

interface TwinContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // View Mode: 'LIVE' or 'SIMULATION'
  viewMode: 'LIVE' | 'SIMULATION';
  setViewMode: (mode: 'LIVE' | 'SIMULATION') => void;

  // Live World State
  liveWeather: WeatherCondition;
  liveForecast: WeatherForecastHour[];
  liveState: DigitalTwinState;
  liveCascade: CascadeEngineResult;

  // Simulation Parameters & State
  simParams: SimulationParams;
  setSimParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  simCascade: CascadeEngineResult;
  simulatedState: DigitalTwinState;
  activeScenario: WeatherScenario;
  applyScenarioPreset: (scenario: WeatherScenario) => void;
  runSimulation: () => void;
  resetSimulationToLive: () => void;

  // Weather Provider Mode
  weatherSourceMode: 'AUTO_LIVE' | 'DEMO_MODE';
  setWeatherSourceMode: (mode: 'AUTO_LIVE' | 'DEMO_MODE') => void;
  selectedStadiumLocation: string;
  setSelectedStadiumLocation: (locId: string) => void;
  refreshLiveWeather: () => Promise<void>;
  isLoadingWeather: boolean;

  // Map Layer Toggles
  mapLayers: {
    weather: boolean;
    traffic: boolean;
    parking: boolean;
    crowd: boolean;
    transport: boolean;
    hotels: boolean;
    restaurants: boolean;
    socialSignals: boolean;
    predictedImpact: boolean;
  };
  toggleMapLayer: (layerName: string) => void;

  // Social Signals
  socialSignals: SocialSignal[];
  addSocialSignal: (sig: Omit<SocialSignal, 'id' | 'timestamp'>) => void;

  // AI Recommendations
  recommendations: AiRecommendation[];
  simulateRecommendation: (id: string) => void;
  applyRecommendation: (id: string) => void;

  // Demo Presentation Walkthrough
  isDemoTourOpen: boolean;
  setIsDemoTourOpen: (open: boolean) => void;
  demoTourStep: number;
  setDemoTourStep: (step: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;

  // Sound FX
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playOperationalChime: (type?: 'alert' | 'click' | 'sim') => void;
}

const TwinContext = createContext<TwinContextType | undefined>(undefined);

export const TwinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('command-center');
  const [viewMode, setViewMode] = useState<'LIVE' | 'SIMULATION'>('LIVE');

  // Weather Settings
  const [weatherSourceMode, setWeatherSourceMode] = useState<'AUTO_LIVE' | 'DEMO_MODE'>('DEMO_MODE');
  const [selectedStadiumLocation, setSelectedStadiumLocation] = useState<string>('ahmedabad');
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // Live Data
  const [liveWeather, setLiveWeather] = useState<WeatherCondition>(DEMO_WEATHER_BASELINE);
  const [liveForecast, setLiveForecast] = useState<WeatherForecastHour[]>(getDemoWeatherData(10).forecast);
  const [liveState, setLiveState] = useState<DigitalTwinState>(BASELINE_LIVE_STATE);

  // Simulation Parameters (Defaults to 60 mm/hr test case)
  const [simParams, setSimParams] = useState<SimulationParams>({
    rainfall: 60,
    temperature: 28,
    stormDuration: 45,
    windSpeed: 28,
    floodingSeverity: 'MEDIUM',
    impactZone: 'Ecosystem-Wide Perimeter'
  });

  const [activeScenario, setActiveScenario] = useState<WeatherScenario>('HEAVY_RAIN');

  // Map Layer Controls
  const [mapLayers, setMapLayers] = useState({
    weather: true,
    traffic: true,
    parking: true,
    crowd: true,
    transport: true,
    hotels: true,
    restaurants: true,
    socialSignals: true,
    predictedImpact: true
  });

  // Social Signals & Recommendations
  const [socialSignals, setSocialSignals] = useState<SocialSignal[]>(INITIAL_SOCIAL_SIGNALS);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>(INITIAL_AI_RECOMMENDATIONS);

  // Guided Tour
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [demoTourStep, setDemoTourStep] = useState<number>(1);

  // Sound
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Play subtle synthesized audio cues
  const playOperationalChime = (type: 'alert' | 'click' | 'sim' = 'click') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'alert') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === 'sim') {
        osc.frequency.setValueAtTime(587, audioCtx.currentTime);
        osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch (e) {
      // AudioContext might be blocked until user gesture
    }
  };

  // Compute Live Cascade (Normal 10mm rain)
  const liveCascade = useMemo(() => {
    return calculateWeatherCascade(
      {
        rainfall: liveWeather.rainfall,
        windSpeed: liveWeather.windSpeed,
        temperature: liveWeather.temperature,
        stormDuration: 30,
        floodingSeverity: 'LOW'
      },
      BASELINE_LIVE_STATE
    );
  }, [liveWeather]);

  // Compute Simulated Cascade (Dynamic sliders)
  const simCascade = useMemo(() => {
    return calculateWeatherCascade(
      {
        rainfall: simParams.rainfall,
        windSpeed: simParams.windSpeed,
        temperature: simParams.temperature,
        stormDuration: simParams.stormDuration,
        floodingSeverity: simParams.floodingSeverity
      },
      BASELINE_LIVE_STATE
    );
  }, [simParams]);

  const simulatedState = simCascade.state;

  // Toggle Map Layer
  const toggleMapLayer = (layerName: string) => {
    setMapLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName as keyof typeof prev]
    }));
  };

  // Fetch / Refresh Live Weather
  const refreshLiveWeather = async () => {
    setIsLoadingWeather(true);
    if (weatherSourceMode === 'AUTO_LIVE') {
      const data = await fetchLiveWeather(selectedStadiumLocation);
      setLiveWeather(data.current);
      setLiveForecast(data.forecast);
    } else {
      const data = getDemoWeatherData(10);
      setLiveWeather(data.current);
      setLiveForecast(data.forecast);
    }
    setIsLoadingWeather(false);
  };

  useEffect(() => {
    refreshLiveWeather();
  }, [weatherSourceMode, selectedStadiumLocation]);

  // Scenario Presets Handler
  const applyScenarioPreset = (scenario: WeatherScenario) => {
    setActiveScenario(scenario);
    playOperationalChime('sim');

    switch (scenario) {
      case 'NORMAL':
        setSimParams({
          rainfall: 0,
          temperature: 28,
          stormDuration: 0,
          windSpeed: 8,
          floodingSeverity: 'LOW',
          impactZone: 'Ecosystem-Wide Perimeter'
        });
        break;
      case 'LIGHT_RAIN':
        setSimParams({
          rainfall: 10,
          temperature: 27,
          stormDuration: 25,
          windSpeed: 16,
          floodingSeverity: 'LOW',
          impactZone: 'North Ingress Corridor'
        });
        break;
      case 'HEAVY_RAIN':
        setSimParams({
          rainfall: 60,
          temperature: 24,
          stormDuration: 60,
          windSpeed: 38,
          floodingSeverity: 'MEDIUM',
          impactZone: 'Stadium Core & South Gate 4'
        });
        break;
      case 'EXTREME_STORM':
        setSimParams({
          rainfall: 95,
          temperature: 21,
          stormDuration: 120,
          windSpeed: 64,
          floodingSeverity: 'HIGH',
          impactZone: 'Full 10km Stadium Radius'
        });
        break;
      case 'FLOOD_EVENT':
        setSimParams({
          rainfall: 120,
          temperature: 20,
          stormDuration: 180,
          windSpeed: 75,
          floodingSeverity: 'HIGH',
          impactZone: 'Ring Road Low-Lying Underpasses'
        });
        break;
    }
  };

  const runSimulation = () => {
    setViewMode('SIMULATION');
    playOperationalChime('sim');
    // Add simulation trace to social signals
    addSocialSignal({
      source: 'Venue Sensor',
      author: 'What-If Simulation Sandbox',
      location: `Zone: ${simParams.impactZone}`,
      text: `SIMULATION ACTIVE: ${simParams.rainfall} mm/hr rainfall injected. Traveler delay projected +${simCascade.metrics.find(m => m.id === 'travel-delay')?.changeLabel}. Risk: ${simCascade.overallRisk}.`,
      signalType: 'SIMULATED',
      confidence: 88,
      potentialImpact: 'Simulation sandbox updated without altering live operational state.',
      sentiment: simCascade.overallRisk === 'CRITICAL' ? 'critical' : simCascade.overallRisk === 'HIGH' ? 'warning' : 'neutral',
      isDemo: true
    });
  };

  const resetSimulationToLive = () => {
    setViewMode('LIVE');
    applyScenarioPreset('LIGHT_RAIN');
    playOperationalChime('click');
  };

  const addSocialSignal = (sig: Omit<SocialSignal, 'id' | 'timestamp'>) => {
    const newSig: SocialSignal = {
      ...sig,
      id: `sig-${Date.now()}`,
      timestamp: 'Just now'
    };
    setSocialSignals((prev) => [newSig, ...prev]);
  };

  const simulateRecommendation = (id: string) => {
    playOperationalChime('sim');
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, simulatedStatus: 'SIMULATED' } : rec
      )
    );
  };

  const applyRecommendation = (id: string) => {
    playOperationalChime('alert');
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, simulatedStatus: 'APPLIED' } : rec
      )
    );
  };

  // Demo Presentation Tour Navigation
  const nextDemoStep = () => {
    setDemoTourStep((s) => {
      const next = Math.min(10, s + 1);
      executeTourStepActions(next);
      return next;
    });
  };

  const prevDemoStep = () => {
    setDemoTourStep((s) => {
      const prev = Math.max(1, s - 1);
      executeTourStepActions(prev);
      return prev;
    });
  };

  const executeTourStepActions = (step: number) => {
    switch (step) {
      case 1:
        setActiveTab('command-center');
        setViewMode('LIVE');
        applyScenarioPreset('LIGHT_RAIN');
        break;
      case 2:
        setActiveTab('weather-intel');
        break;
      case 3:
        setActiveTab('twin-map');
        break;
      case 4:
        setActiveTab('what-if');
        setSimParams((p) => ({ ...p, rainfall: 60 }));
        break;
      case 5:
        runSimulation();
        break;
      case 6:
        setActiveTab('impact-propagation');
        break;
      case 7:
        setActiveTab('twin-map');
        setViewMode('SIMULATION');
        break;
      case 8:
        setActiveTab('recommendations');
        break;
      case 9:
        setActiveTab('weather-intel');
        break;
      case 10:
        setActiveTab('live-vs-sim');
        setViewMode('LIVE');
        break;
    }
  };

  return (
    <TwinContext.Provider
      value={{
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        liveWeather,
        liveForecast,
        liveState,
        liveCascade,
        simParams,
        setSimParams,
        simCascade,
        simulatedState,
        activeScenario,
        applyScenarioPreset,
        runSimulation,
        resetSimulationToLive,
        weatherSourceMode,
        setWeatherSourceMode,
        selectedStadiumLocation,
        setSelectedStadiumLocation,
        refreshLiveWeather,
        isLoadingWeather,
        mapLayers,
        toggleMapLayer,
        socialSignals,
        addSocialSignal,
        recommendations,
        simulateRecommendation,
        applyRecommendation,
        isDemoTourOpen,
        setIsDemoTourOpen,
        demoTourStep,
        setDemoTourStep,
        nextDemoStep,
        prevDemoStep,
        soundEnabled,
        setSoundEnabled,
        playOperationalChime
      }}
    >
      {children}
    </TwinContext.Provider>
  );
};

export const useTwin = () => {
  const context = useContext(TwinContext);
  if (!context) {
    throw new Error('useTwin must be used within a TwinProvider');
  }
  return context;
};
