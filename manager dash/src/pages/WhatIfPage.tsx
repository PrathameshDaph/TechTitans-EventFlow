import React, { useEffect, useRef, useState, useMemo } from 'react';
import '../simulation/styles.css';
import { SimulationEngine } from '../simulation/simulationEngine.js';
import { DigitalTwinRenderer } from '../simulation/digitalTwinRenderer.js';
import { ChartsManager } from '../simulation/chartsManager.js';
import { AlertSystem } from '../simulation/alertSystem.js';
import { WhatIfAdvisor } from '../simulation/whatIfAdvisor.js';
import { WhatIfManualEngine } from '../simulation/whatIfManualEngine.js';
import { WhatIfLiveEngine } from '../simulation/whatIfLiveEngine.js';

export const WhatIfPage: React.FC = () => {
  // Navigation View Tab: 'live-monitoring' | 'whatif' | 'whatif-live'
  const [activeView, setActiveView] = useState<'live-monitoring' | 'whatif' | 'whatif-live'>('live-monitoring');

  // Engines Refs
  const simEngineRef = useRef<any>(null);
  const manualEngineRef = useRef<any>(null);
  const liveEngineRef = useRef<any>(null);
  const alertSystemRef = useRef<any>(null);
  const chartsRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Canvas Refs
  const digitalTwinCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const whatIfCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const liveCvCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const liveFlowCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Chart Canvas Refs
  const chartCrowdCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartParkingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartFlowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartGateCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartZoneCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation State
  const [simState, setSimState] = useState<any>(null);
  const [speed, setSpeed] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeQuestion, setActiveQuestion] = useState<string>('q_crowd_increasing');

  // Manual What-If State
  const [manualState, setManualState] = useState<any>(null);
  const [selectedManualPreset, setSelectedManualPreset] = useState<string>('surge_25k');
  const [manualAttendees, setManualAttendees] = useState<number>(125000);
  const [manualTurnstiles, setManualTurnstiles] = useState<string>('1.0');
  const [manualGateBShare, setManualGateBShare] = useState<string>('extreme');
  const [manualShuttles, setManualShuttles] = useState<string>('5');
  const [isManualSimulating, setIsManualSimulating] = useState<boolean>(false);

  // Live What-If State
  const [liveData, setLiveData] = useState<any>(null);
  const [liveInterval, setLiveInterval] = useState<number>(1000);
  const [liveSource, setLiveSource] = useState<'demo' | 'camera'>('demo');
  const [livePreset, setLivePreset] = useState<string>('normal_flow');
  const [liveModArrival, setLiveModArrival] = useState<string>('1.20');
  const [liveModGateB, setLiveModGateB] = useState<string>('0');
  const [liveModParking, setLiveModParking] = useState<string>('0');

  // Initialize Engines & Loop
  useEffect(() => {
    // 1. Instantiate Core Simulation Engines
    const simEngine = new SimulationEngine();
    const manualEngine = new WhatIfManualEngine();
    const liveEngine = new WhatIfLiveEngine();
    const alertSystem = new AlertSystem();
    const charts = new ChartsManager();

    simEngineRef.current = simEngine;
    manualEngineRef.current = manualEngine;
    liveEngineRef.current = liveEngine;
    alertSystemRef.current = alertSystem;
    chartsRef.current = charts;

    // 2. Setup Digital Twin Renderer
    if (digitalTwinCanvasRef.current) {
      rendererRef.current = new DigitalTwinRenderer(digitalTwinCanvasRef.current);
    }

    // 3. Setup Charts
    charts.init({
      crowdCanvas: chartCrowdCanvasRef.current,
      parkingCanvas: chartParkingCanvasRef.current,
      flowCanvas: chartFlowCanvasRef.current,
      gateCanvas: chartGateCanvasRef.current,
      zoneCanvas: chartZoneCanvasRef.current,
    });

    // 4. Subscriptions
    const unsubSim = simEngine.subscribe((state: any) => {
      setSimState(state);
      setIsPlaying(state.isRunning && !state.isPaused);
      if (chartsRef.current) {
        chartsRef.current.update(state);
      }
    });

    const unsubManual = manualEngine.subscribe((state: any) => {
      setManualState(state);
    });

    const unsubLive = liveEngine.subscribe((data: any) => {
      setLiveData(data);
    });

    // Initial state seeds
    const initialSim = simEngine.getState();
    setSimState(initialSim);
    setManualState(manualEngine.getState());
    setLiveData(liveEngine.getFullState());

    // 5. Start Simulation
    simEngine.start();

    // 6. Global Animation Loop (60 FPS)
    const animLoop = () => {
      if (activeView === 'live-monitoring') {
        if (rendererRef.current && simEngineRef.current) {
          rendererRef.current.render(simEngineRef.current.getState());
        }
      } else if (activeView === 'whatif') {
        if (whatIfCanvasRef.current && manualEngineRef.current) {
          manualEngineRef.current.renderCanvas(whatIfCanvasRef.current);
        }
      } else if (activeView === 'whatif-live') {
        if (liveEngineRef.current) {
          if (liveCvCanvasRef.current) liveEngineRef.current.renderLiveCvCanvas(liveCvCanvasRef.current);
          if (liveFlowCanvasRef.current) liveEngineRef.current.renderLiveVenueFlowCanvas(liveFlowCanvasRef.current);
        }
      }
      animFrameIdRef.current = requestAnimationFrame(animLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(animLoop);

    // Window resize handler
    const handleResize = () => {
      if (rendererRef.current) rendererRef.current.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      unsubSim();
      unsubManual();
      unsubLive();
      simEngine.destroy();
      liveEngine.destroy();
    };
  }, []);

  // When activeView changes, re-sync canvas sizes or state
  useEffect(() => {
    if (activeView === 'live-monitoring') {
      setTimeout(() => {
        if (rendererRef.current) rendererRef.current.resize();
      }, 50);
    }
  }, [activeView]);

  // Advisor Q&A computation
  const advisorAnswer = useMemo(() => {
    if (!simState) return null;
    try {
      return WhatIfAdvisor.answerQuestion(activeQuestion, simState);
    } catch {
      return null;
    }
  }, [activeQuestion, simState]);

  // Alert Feed computation
  const activeAlerts = useMemo(() => {
    if (!simState || !alertSystemRef.current) return [];
    try {
      return alertSystemRef.current.evaluate(simState) || [];
    } catch {
      return [];
    }
  }, [simState]);

  // Playback Control Handlers
  const handlePlayPause = () => {
    if (!simEngineRef.current) return;
    simEngineRef.current.togglePlay();
    const st = simEngineRef.current.getState();
    setIsPlaying(st.isRunning && !st.isPaused);
  };

  const handleStartDemo = () => {
    if (!simEngineRef.current) return;
    simEngineRef.current.reset();
    simEngineRef.current.setSpeed(10);
    simEngineRef.current.start();
    setSpeed(10);
    setIsPlaying(true);
  };

  const handleReset = () => {
    if (!simEngineRef.current) return;
    simEngineRef.current.reset();
    simEngineRef.current.setSpeed(2);
    simEngineRef.current.start();
    setSpeed(2);
    setIsPlaying(true);
  };

  const handleSpeedSelect = (spd: number) => {
    if (!simEngineRef.current) return;
    simEngineRef.current.setSpeed(spd);
    setSpeed(spd);
  };

  const handleTimelineScrub = (val: number) => {
    if (!simEngineRef.current) return;
    simEngineRef.current.jumpToTime(val);
  };

  // Zoom Controls
  const handleZoomIn = () => {
    if (rendererRef.current) rendererRef.current.scale *= 1.2;
  };
  const handleZoomOut = () => {
    if (rendererRef.current) rendererRef.current.scale *= 0.8;
  };
  const handleResetView = () => {
    if (rendererRef.current) rendererRef.current.resetView();
  };

  // Manual What-If Presets & Inputs
  const handleManualPreset = (preset: string) => {
    setSelectedManualPreset(preset);
    if (!manualEngineRef.current) return;

    if (preset === 'baseline') {
      setManualAttendees(100000);
      setManualGateBShare('normal');
      manualEngineRef.current.setExpectedCrowd(100000);
      manualEngineRef.current.setWhatIfCrowd(100000);
      manualEngineRef.current.setGateShare('gateB', 25);
    } else if (preset === 'surge_25k') {
      setManualAttendees(125000);
      setManualGateBShare('extreme');
      manualEngineRef.current.setExpectedCrowd(100000);
      manualEngineRef.current.setWhatIfCrowd(125000);
      manualEngineRef.current.setGateShare('gateB', 40);
    } else if (preset === 'gate_b_jam') {
      setManualAttendees(125000);
      setManualGateBShare('extreme');
      manualEngineRef.current.setWhatIfCrowd(125000);
      manualEngineRef.current.setGateShare('gateB', 40);
    } else if (preset === 'parking_p1_full') {
      setManualAttendees(140000);
      manualEngineRef.current.setWhatIfCrowd(140000);
      manualEngineRef.current.setParkingParams(5000, 35, 4.0);
    }
  };

  const handleRunManualSimulation = () => {
    if (!manualEngineRef.current) return;
    setIsManualSimulating(true);
    manualEngineRef.current.startSimulation();
    setTimeout(() => {
      setIsManualSimulating(false);
    }, 500);
  };

  // Live What-If Modifiers & Presets
  const handleLivePreset = (presetKey: string) => {
    setLivePreset(presetKey);
    if (!liveEngineRef.current) return;
    liveEngineRef.current.applyLivePreset(presetKey);
    const mod = liveEngineRef.current.liveModifiers;
    setLiveModArrival(mod.arrivalRateMultiplier.toFixed(2));
    setLiveModGateB(mod.gateBSurgePct.toString());
    setLiveModParking(mod.parkingSurgePct.toString());
  };

  const handleResetLiveModifiers = () => {
    if (!liveEngineRef.current) return;
    liveEngineRef.current.resetModifiers();
    setLiveModArrival('1.00');
    setLiveModGateB('0');
    setLiveModParking('0');
    setLivePreset('normal_flow');
  };

  // Safe accessor helpers
  const sim = simState || {
    formattedTime: '03:00 PM',
    simMinute: 900,
    totalPeople: 1400,
    totalEntries: 850,
    totalExits: 60,
    currentOccupancy: 800,
    stadiumCapacity: 100000,
    parkingOccupancyPct: 8.5,
    totalVehicles: 1360,
    activeGatesCount: 8,
    globalCrowdDensity: 'LOW',
    criticalZonesCount: 0,
    overflowCount: 0,
    isPeakArrival: false,
    isPeakExit: false,
    timelinePhase: { phase: 'ARRIVAL_GATES_OPEN', title: '3:00 PM — Gates Open' },
    blocks: {},
  };

  const manualRes = manualState?.results?.scenario || {
    totalCrowd: 125000,
    gates: {
      gateA: { queue: 420, flowPerHour: 3200 },
      gateB: { queue: 860, flowPerHour: 1100 },
      gateC: { queue: 310, flowPerHour: 3800 },
    },
    parkingOccupancyPct: 94,
    parkingRemaining: 300,
    overallRisk: 'HIGH',
  };

  const live = liveData?.live || {
    currentCrowd: 10842,
    totalEntries: 7420,
    totalExits: 1240,
    activeVehicles: 2860,
    parkingCapacity: 5000,
    parkingOccupied: 3920,
    parkingUtilizationPct: 78.4,
    parkingInflowPerMin: 32,
    criticalGate: 'Gate B',
    overallRisk: 'HIGH',
    gates: {
      gateA: { name: 'Gate A (North)', people: 3200, flowPerHour: 620, queue: 210, status: 'NORMAL' },
      gateB: { name: 'Gate B (East)', people: 4800, flowPerHour: 1100, queue: 680, status: 'HIGH' },
      gateC: { name: 'Gate C (South)', people: 2842, flowPerHour: 540, queue: 180, status: 'NORMAL' },
    },
  };

  const proj = liveData?.projection || {
    arrivalRatePerMin: 620,
    trendText: 'Increasing (+12.4%/hr)',
    projectedCrowd: 12900,
    crowdDelta: 2058,
    projectedGateBQueue: 850,
    projectedParkingPct: 94.2,
    projectedRisk: 'HIGH',
    recommendedAction: 'Deploy 4 auxiliary turnstiles at Gate B immediately & activate Concourse Overflow Zone 2.',
  };

  return (
    <div className="simulation-hub-root space-y-4 animate-in fade-in duration-300">
      <div className="app-container">
        {/* =========================================================================
            TOP MASTER SIMULATION & NAVIGATION HUD
            ========================================================================= */}
        <header className="app-header">
          <div className="logo-area">
            <div className="logo-icon">⚡</div>
            <div>
              <h1 className="logo-title" style={{ fontSize: '14.5px', margin: 0, lineHeight: 1.2 }}>
                EVENTFLOW AI COMMAND CENTER
              </h1>
              <span className="logo-subtitle" style={{ fontSize: '9px' }}>
                Wankhede Stadium • Crowd Flow, Gate Congestion & Parking Digital Twin
              </span>
            </div>
          </div>

          {/* MASTER NAVIGATION TABS: LIVE MONITORING / WHAT-IF / WHAT-IF LIVE */}
          <nav className="nav-tabs-bar">
            <button
              onClick={() => setActiveView('live-monitoring')}
              className={`nav-tab-btn ${activeView === 'live-monitoring' ? 'active' : ''}`}
            >
              <span>📡</span> LIVE MONITORING
            </button>
            <button
              onClick={() => setActiveView('whatif')}
              className={`nav-tab-btn tab-whatif ${activeView === 'whatif' ? 'active' : ''}`}
            >
              <span>🔮</span> WHAT-IF SCENARIOS
            </button>
            <button
              onClick={() => setActiveView('whatif-live')}
              className={`nav-tab-btn tab-whatif-live ${activeView === 'whatif-live' ? 'active' : ''}`}
            >
              <span>⚡</span> WHAT-IF LIVE (AI TWIN)
            </button>
          </nav>

          {/* Master Simulation Clock (Visible in Live Monitoring) */}
          {activeView === 'live-monitoring' && (
            <div className="master-clock-hud">
              <div>
                <div className="clock-label">SIMULATION TIME</div>
                <div className="clock-digits">{sim.formattedTime}</div>
              </div>
              <div
                className={`phase-pill ${
                  sim.isPeakArrival || sim.isPeakExit || sim.overflowCount > 5000
                    ? 'peak'
                    : sim.simMinute < 1025
                    ? 'arrival'
                    : sim.simMinute < 1380
                    ? 'event'
                    : 'exit'
                }`}
              >
                {sim.timelinePhase?.title || '3:00 PM — Gates Open'}
              </div>
            </div>
          )}

          {/* Controls & Speed Switcher */}
          <div className="header-actions">
            <button onClick={handleStartDemo} className="btn btn-primary" title="Start fast simulation demo">
              ▶ Start Demo
            </button>

            <button onClick={handlePlayPause} className="btn btn-secondary">
              {isPlaying ? '⏸ Pause' : '▶ Resume'}
            </button>

            <button onClick={handleReset} className="btn btn-secondary">
              🔄 Reset
            </button>

            {/* Speed Selector */}
            <div className="speed-group">
              {[1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedSelect(s)}
                  className={`speed-btn ${speed === s ? 'active' : ''}`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* =========================================================================
            MAIN VIEWS CONTAINER
            ========================================================================= */}
        <div className="views-container">
          {/* =========================================================================
              VIEW 1: LIVE MONITORING (3-Column Digital Twin Canvas & Analytics)
              ========================================================================= */}
          <section className={`app-view ${activeView === 'live-monitoring' ? 'active' : ''}`}>
            <div className="main-layout">
              {/* Left Sidebar: Live Telemetry & KPI Cards */}
              <aside className="sidebar-left">
                <div className="panel-header">
                  <div className="panel-title">📊 Live Dashboard Telemetry</div>
                  <span className="badge-status badge-critical" style={{ fontSize: '8px' }}>
                    125k ACTIVE
                  </span>
                </div>

                <div className="kpi-grid">
                  {/* Total People */}
                  <div className="kpi-card full-width">
                    <span className="kpi-label">TOTAL PEOPLE IN SIMULATION</span>
                    <div className="kpi-value">{sim.totalPeople?.toLocaleString()}</div>
                    <span className="kpi-sub">Target: 125,000 Actual Attendees</span>
                  </div>

                  {/* Total Entries */}
                  <div className="kpi-card">
                    <span className="kpi-label">TOTAL ENTRIES</span>
                    <div className="kpi-value" style={{ color: 'var(--color-success)' }}>
                      {sim.totalEntries?.toLocaleString()}
                    </div>
                    <span className="kpi-sub">Turnstiles processed</span>
                  </div>

                  {/* Total Exits */}
                  <div className="kpi-card">
                    <span className="kpi-label">TOTAL EXITS</span>
                    <div className="kpi-value" style={{ color: 'var(--color-danger)' }}>
                      {sim.totalExits?.toLocaleString()}
                    </div>
                    <span className="kpi-sub">Completed egress</span>
                  </div>

                  {/* Current Stadium Occupancy */}
                  <div className="kpi-card full-width">
                    <span className="kpi-label">CURRENT STADIUM OCCUPANCY</span>
                    <div className="kpi-value">
                      {sim.currentOccupancy?.toLocaleString()} (
                      {((sim.currentOccupancy / sim.stadiumCapacity) * 100).toFixed(1)}%)
                      {sim.overflowCount > 0 && ` [⚠️ +${sim.overflowCount.toLocaleString()} Over]`}
                    </div>
                    <span className="kpi-sub">Max Seating: 100,000 (8 Blocks)</span>
                  </div>

                  {/* Parking Occupancy */}
                  <div className="kpi-card">
                    <span className="kpi-label">PARKING OCCUPANCY</span>
                    <div className="kpi-value" style={{ color: 'var(--color-warning)' }}>
                      {sim.parkingOccupancyPct}%
                    </div>
                    <span className="kpi-sub">16,000 Slots (P1–P8)</span>
                  </div>

                  {/* Active Vehicles */}
                  <div className="kpi-card">
                    <span className="kpi-label">VEHICLES</span>
                    <div className="kpi-value">{sim.totalVehicles?.toLocaleString()}</div>
                    <span className="kpi-sub">Inbound / Parked / Out</span>
                  </div>

                  {/* Active Gates */}
                  <div className="kpi-card">
                    <span className="kpi-label">ACTIVE GATES</span>
                    <div className="kpi-value">{sim.activeGatesCount || 8} / 8 ONLINE</div>
                    <span className="kpi-sub">Gates A1–D2 Monitored</span>
                  </div>

                  {/* Crowd Density */}
                  <div className="kpi-card">
                    <span className="kpi-label">CROWD DENSITY</span>
                    <div className={`kpi-value badge-status badge-${sim.globalCrowdDensity?.toLowerCase()}`}>
                      {sim.globalCrowdDensity}
                    </div>
                    <span className="kpi-sub">Global Safety Index</span>
                  </div>

                  {/* Critical Zones */}
                  <div className="kpi-card full-width">
                    <span className="kpi-label">CRITICAL ZONES</span>
                    <div className="kpi-value" style={{ color: 'var(--color-success)' }}>
                      {sim.criticalZonesCount} ZONES
                    </div>
                    <span className="kpi-sub">4 Concourse Zones Monitored</span>
                  </div>
                </div>

                {/* 8 Stadium Seating Blocks Status Grid */}
                <div className="blocks-matrix-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        color: 'var(--text-dim)',
                        textTransform: 'uppercase',
                      }}
                    >
                      🏟️ 8 Seating Blocks (100k Cap)
                    </span>
                    <span style={{ fontSize: '8.5px', color: 'var(--text-main)', fontWeight: 700 }}>12.5k each</span>
                  </div>
                  <div className="blocks-grid">
                    {sim.blocks &&
                      Object.keys(sim.blocks).map((bk) => {
                        const b = sim.blocks[bk];
                        let col = '#1c1815';
                        if (b.pct >= 95) col = '#dc2626';
                        else if (b.pct >= 75) col = '#ea580c';
                        else if (b.pct >= 40) col = '#ca6510';
                        return (
                          <div key={b.id} className="block-chip" style={{ borderColor: `${col}44` }}>
                            <span className="block-chip-title">{b.id.toUpperCase()}</span>
                            <span className="block-chip-pct" style={{ color: col }}>
                              {b.pct}%
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Real-Time Alerts Panel */}
                <div className="panel-header" style={{ marginTop: '4px' }}>
                  <div className="panel-title">🚨 Real-Time Alert Feed</div>
                  <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>Dynamic Thresholds</span>
                </div>
                <div className="alert-feed">
                  {activeAlerts.length === 0 ? (
                    <div className="alert-item" style={{ borderLeftColor: 'var(--color-success)' }}>
                      <span className="alert-item-time">{sim.formattedTime}</span>
                      <span className="alert-item-text">All 8 blocks and perimeter gates operating nominally.</span>
                    </div>
                  ) : (
                    activeAlerts.map((a: any, idx: number) => (
                      <div key={idx} className={`alert-item ${a.level?.toLowerCase()}`}>
                        <span className="alert-item-time">{a.time}</span>
                        <span className="alert-item-text">
                          <strong>{a.title}</strong>: {a.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </aside>

              {/* Center: Live Digital Twin 2D Simulation Map */}
              <section className="center-stage">
                <div className="stage-top-banner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="match-tag">🏏 WANKHEDE STADIUM MEGA EVENT</span>
                    <span className="config-tag">8 Blocks • 8 Gates • 4 Zones • 8 Parking Lots</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="stage-time-tag">
                      {sim.formattedTime} ({sim.timelinePhase?.phase})
                    </span>
                  </div>
                </div>

                {/* Peak Flow Floating Warning Banner */}
                {(sim.isPeakArrival || sim.isPeakExit || sim.overflowCount > 10000) && (
                  <div className="peak-floating-banner">
                    {sim.isPeakArrival
                      ? '🔴 125,000 ARRIVAL PEAK (+25k OVERFLOW SURGE)'
                      : sim.isPeakExit
                      ? '🔴 125,000 MIDNIGHT EXIT PEAK (12:05 AM)'
                      : `⚠️ STADIUM FULL (100k/100k) — +${sim.overflowCount?.toLocaleString()} IN CONCOURSE`}
                  </div>
                )}

                <div className="canvas-wrapper">
                  <canvas ref={digitalTwinCanvasRef} id="digitalTwinCanvas" />
                </div>

                {/* Overlay Map Navigation Controls */}
                <div className="map-overlay-controls">
                  <button onClick={handleZoomIn} className="map-control-btn" title="Zoom In">
                    +
                  </button>
                  <button onClick={handleZoomOut} className="map-control-btn" title="Zoom Out">
                    −
                  </button>
                  <button onClick={handleResetView} className="map-control-btn" title="Reset View">
                    ⟲
                  </button>
                </div>
              </section>

              {/* Right Sidebar: WHAT-IF Intelligence & Real-Time Charts */}
              <aside className="sidebar-right">
                {/* WHAT-IF Scenario Intelligence Assistant */}
                <div className="whatif-advisor-card">
                  <div className="whatif-advisor-header">
                    <div className="whatif-advisor-title">🔮 WHAT-IF 125k Crisis Intelligence</div>
                    <span className="badge-status badge-critical">LIVE AI</span>
                  </div>

                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    Ask real-time questions about the 125,000 crowd surge & bottlenecks:
                  </div>

                  <select
                    value={activeQuestion}
                    onChange={(e) => setActiveQuestion(e.target.value)}
                    className="question-select"
                  >
                    <option value="q_crowd_increasing">Where is the crowd increasing?</option>
                    <option value="q_gate_critical">Which gate is becoming critical?</option>
                    <option value="q_people_entering">How many people are entering?</option>
                    <option value="q_people_leaving">How many people are leaving?</option>
                    <option value="q_highest_density_zone">Which zone has the highest crowd density?</option>
                    <option value="q_parking_remaining">How much parking capacity remains?</option>
                    <option value="q_parking_congested">Which parking area is becoming congested?</option>
                    <option value="q_current_bottleneck">Where is the current bottleneck?</option>
                  </select>

                  {/* Dynamic Answer Output Box */}
                  {advisorAnswer && (
                    <div className="advisor-output-box">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}
                      >
                        <strong style={{ fontSize: '11px', color: 'var(--color-espresso)' }}>
                          {advisorAnswer.title || 'Crowd Intelligence'}
                        </strong>
                        <span
                          className="badge-status"
                          style={{
                            background: '#faf7f2',
                            color: advisorAnswer.color || 'var(--color-espresso)',
                            border: '1px solid var(--border-strong)',
                            fontSize: '8px',
                          }}
                        >
                          {advisorAnswer.badge || 'LIVE'}
                        </span>
                      </div>
                      <div className="advisor-answer-text">{advisorAnswer.answer}</div>
                      {advisorAnswer.metrics && Array.isArray(advisorAnswer.metrics) && (
                        <div className="advisor-metrics-grid">
                          {advisorAnswer.metrics.map((m: any, i: number) => (
                            <div key={i} className="advisor-metric-item">
                              <div className="advisor-metric-label">{m.label}</div>
                              <div className="advisor-metric-val">{m.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="advisor-recommendation" style={{ marginTop: '4px' }}>
                        💡 {advisorAnswer.recommendation}
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Chart 1: Crowd vs Simulation Time */}
                <div className="chart-box">
                  <div className="chart-title-bar">
                    <span className="chart-title">📈 Crowd vs Time (125k Scale)</span>
                    <span style={{ fontSize: '8.5px', color: 'var(--color-danger)', fontWeight: 700 }}>
                      100k Cap / 125k Actual
                    </span>
                  </div>
                  <canvas ref={chartCrowdCanvasRef} className="chart-canvas" height="170" />
                </div>

                {/* Live Chart 2: Parking Occupancy vs Time */}
                <div className="chart-box">
                  <div className="chart-title-bar">
                    <span className="chart-title">🚗 Parking Occupancy vs Time</span>
                    <span style={{ fontSize: '8.5px', color: 'var(--color-warning)', fontWeight: 700 }}>
                      16,000 Slots (P1–P8)
                    </span>
                  </div>
                  <canvas ref={chartParkingCanvasRef} className="chart-canvas" height="140" />
                </div>

                {/* Live Chart 3: Entries vs Exits Rate */}
                <div className="chart-box">
                  <div className="chart-title-bar">
                    <span className="chart-title">⇄ Entries vs Exits</span>
                    <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>Cumulative 125k Flow</span>
                  </div>
                  <canvas ref={chartFlowCanvasRef} className="chart-canvas" height="140" />
                </div>

                {/* Live Chart 4: Gate Traffic Matrix */}
                <div className="chart-box">
                  <div className="chart-title-bar">
                    <span className="chart-title">🚪 8 Gates Queues & Load</span>
                    <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>Gates A1–D2</span>
                  </div>
                  <canvas ref={chartGateCanvasRef} className="chart-canvas" height="140" />
                </div>

                {/* Live Chart 5: Zone Density Breakdown */}
                <div className="chart-box">
                  <div className="chart-title-bar">
                    <span className="chart-title">📍 4 Zones Overflow Density</span>
                    <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>Crowd Safety</span>
                  </div>
                  <canvas ref={chartZoneCanvasRef} className="chart-canvas" height="140" />
                </div>
              </aside>
            </div>
          </section>

          {/* =========================================================================
              VIEW 2: WHAT-IF (Manual Scenario Simulation Page)
              ========================================================================= */}
          <section className={`app-view ${activeView === 'whatif' ? 'active' : ''}`}>
            <div className="whatif-page-layout">
              {/* Left: Scenario Config */}
              <div className="whatif-config-panel">
                <div className="config-section-card">
                  <div className="config-section-header">
                    <span className="config-section-title">🔮 WHAT-IF SCENARIO BUILDER</span>
                    <span
                      className="badge-status badge-purple"
                      style={{
                        background: '#f5f0e8',
                        color: 'var(--color-espresso)',
                        border: '1px solid var(--border-strong)',
                      }}
                    >
                      CONFIGURATOR
                    </span>
                  </div>

                  <div className="presets-bar">
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--color-warning)' }}>PRESETS:</span>
                    <button
                      onClick={() => handleManualPreset('baseline')}
                      className="preset-chip"
                      style={{
                        borderColor: selectedManualPreset === 'baseline' ? 'var(--color-espresso)' : 'var(--border-strong)',
                      }}
                    >
                      100k Standard
                    </button>
                    <button
                      onClick={() => handleManualPreset('surge_25k')}
                      className="preset-chip"
                      style={{
                        borderColor: selectedManualPreset === 'surge_25k' ? 'var(--color-espresso)' : 'var(--border-strong)',
                      }}
                    >
                      +25k Surge (125k)
                    </button>
                    <button
                      onClick={() => handleManualPreset('gate_b_jam')}
                      className="preset-chip"
                      style={{
                        borderColor: selectedManualPreset === 'gate_b_jam' ? 'var(--color-espresso)' : 'var(--border-strong)',
                      }}
                    >
                      Gate B Jam
                    </button>
                    <button
                      onClick={() => handleManualPreset('parking_p1_full')}
                      className="preset-chip"
                      style={{
                        borderColor: selectedManualPreset === 'parking_p1_full' ? 'var(--color-espresso)' : 'var(--border-strong)',
                      }}
                    >
                      P1-P3 Parking Saturated
                    </button>
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">Total Inflow Attendees</label>
                      <select
                        value={manualAttendees}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setManualAttendees(val);
                          manualEngineRef.current?.setWhatIfCrowd(val);
                        }}
                        className="input-field"
                      >
                        <option value={100000}>100,000 (Arena Seating Limit)</option>
                        <option value={115000}>115,000 (+15k Overflow)</option>
                        <option value={125000}>125,000 (+25k Mega Surge)</option>
                        <option value={140000}>140,000 (+40k Overcrowded)</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Turnstile Scanner Flow</label>
                      <select
                        value={manualTurnstiles}
                        onChange={(e) => {
                          setManualTurnstiles(e.target.value);
                          if (manualEngineRef.current) {
                            manualEngineRef.current.scenario.other.entryRateMultiplier = parseFloat(e.target.value);
                            manualEngineRef.current.runCalculation();
                            manualEngineRef.current.notify();
                          }
                        }}
                        className="input-field"
                      >
                        <option value="1.0">100% (Standard 8s/pax)</option>
                        <option value="0.8">80% (Minor Ticketing Glitch)</option>
                        <option value="0.6">60% (Turnstile Breakdown)</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">Gate B Load Share</label>
                      <select
                        value={manualGateBShare}
                        onChange={(e) => {
                          const val = e.target.value;
                          setManualGateBShare(val);
                          if (val === 'extreme') manualEngineRef.current?.setGateShare('gateB', 40);
                          else if (val === 'high') manualEngineRef.current?.setGateShare('gateB', 28);
                          else manualEngineRef.current?.setGateShare('gateB', 12.5);
                        }}
                        className="input-field"
                      >
                        <option value="normal">Normal (12.5% Share)</option>
                        <option value="high">High Concentration (28%)</option>
                        <option value="extreme">Extreme Surge (40%)</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Parking Shuttles</label>
                      <select
                        value={manualShuttles}
                        onChange={(e) => {
                          setManualShuttles(e.target.value);
                          manualEngineRef.current?.setParkingParams(5000, 20, 4.0);
                        }}
                        className="input-field"
                      >
                        <option value="5">5 min headway</option>
                        <option value="2">2 min Express</option>
                        <option value="12">12 min Traffic Gridlock</option>
                      </select>
                    </div>
                  </div>

                  <button onClick={handleRunManualSimulation} className="btn-run-simulation">
                    <span>⚡</span> {isManualSimulating ? '⏳ Running What-If Simulation...' : 'Run What-If Simulation'}
                  </button>
                </div>

                {/* Comparison Matrix */}
                <div className="comparison-matrix-card">
                  <span className="config-section-title">📊 Baseline vs What-If Comparison</span>
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Baseline</th>
                        <th>What-If</th>
                        <th>Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Peak Attendance</td>
                        <td>100,000</td>
                        <td>{manualRes.totalCrowd?.toLocaleString() || '125,000'}</td>
                        <td>
                          <span className="delta-badge delta-bad">
                            +{((manualRes.totalCrowd || 125000) - 100000).toLocaleString()} pax
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Gate B Queue</td>
                        <td>240 pax</td>
                        <td>{manualRes.gates?.gateB?.queue || 860} pax</td>
                        <td>
                          <span className="delta-badge delta-bad">
                            +{Math.round((((manualRes.gates?.gateB?.queue || 860) - 240) / 240) * 100)}% delay
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Parking Peak</td>
                        <td>78%</td>
                        <td>{manualRes.parkingOccupancyPct || 94}%</td>
                        <td>
                          <span className="delta-badge delta-bad">P1-P3 Full</span>
                        </td>
                      </tr>
                      <tr>
                        <td>Clearance Time</td>
                        <td>42 mins</td>
                        <td>74 mins</td>
                        <td>
                          <span className="delta-badge delta-bad">+32 mins</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Scenario Intelligence & Mitigation Plan */}
              <div className="whatif-preview-panel">
                <div className="live-projection-banner">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '14px',
                          fontWeight: 800,
                          color: 'var(--color-espresso)',
                        }}
                      >
                        🔮 AI MITIGATION & ACTION PLAN
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Preemptive deployment instructions to prevent stadium perimeter failure
                      </div>
                    </div>
                    <span className="badge-status badge-critical">HIGH RISK</span>
                  </div>

                  <div className="projection-grid">
                    <div className="projection-metric-box">
                      <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>DEPLOY TURNSTILES</span>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '16px',
                          fontWeight: 800,
                          color: 'var(--color-espresso)',
                        }}
                      >
                        +4 Units
                      </div>
                      <span style={{ fontSize: '8.5px', color: 'var(--color-success)' }}>-16m Queue</span>
                    </div>
                    <div className="projection-metric-box">
                      <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>OPEN CONCOURSE OVERFLOW</span>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '16px',
                          fontWeight: 800,
                          color: 'var(--color-espresso)',
                        }}
                      >
                        Zone 2 & 3
                      </div>
                      <span style={{ fontSize: '8.5px', color: 'var(--color-success)' }}>-40% Density</span>
                    </div>
                    <div className="projection-metric-box">
                      <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>TRAFFIC DIVERSION</span>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '16px',
                          fontWeight: 800,
                          color: 'var(--color-espresso)',
                        }}
                      >
                        P5 to P8
                      </div>
                      <span style={{ fontSize: '8.5px', color: 'var(--color-success)' }}>2,800 Free</span>
                    </div>
                    <div className="projection-metric-box">
                      <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>SAFETY STEWARDS</span>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '16px',
                          fontWeight: 800,
                          color: 'var(--color-espresso)',
                        }}
                      >
                        +12 Staff
                      </div>
                      <span style={{ fontSize: '8.5px', color: 'var(--color-success)' }}>Active at Gate B</span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--color-success-bg)',
                      borderLeft: '3px solid var(--color-success)',
                      padding: '10px 12px',
                      borderRadius: '6px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: 'var(--color-success)',
                        marginBottom: '2px',
                      }}
                    >
                      💡 AI RECOMMENDATION:
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      Activate 4 auxiliary turnstiles at Gate B immediately and redirect spectator queue into Concourse
                      Zone 2.
                    </div>
                  </div>
                </div>

                {/* Interactive What-If Digital Twin Simulation Arena Canvas */}
                <div className="whatif-arena-card">
                  <div className="whatif-arena-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>🗺️</span>
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '12px',
                            fontWeight: 800,
                            color: 'var(--color-espresso)',
                          }}
                        >
                          WHAT-IF CROWD DYNAMICS & PERIMETER DIGITAL TWIN
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                          Deterministic flow modeling, turnstile choke-points, gate queues & lot saturation
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge-status badge-success" style={{ fontSize: '8px' }}>
                        ● 60 FPS TWIN
                      </span>
                      <span
                        className={`badge-status ${
                          manualRes.overallRisk === 'CRITICAL' || manualRes.overallRisk === 'HIGH'
                            ? 'badge-critical'
                            : 'badge-normal'
                        }`}
                        style={{ fontSize: '8px' }}
                      >
                        {manualRes.overallRisk || 'HIGH'} CONGESTION
                      </span>
                    </div>
                  </div>

                  {/* Interactive Canvas Container */}
                  <div className="whatif-canvas-wrap">
                    <canvas ref={whatIfCanvasRef} id="whatIfCanvas" width="800" height="400" />
                  </div>

                  {/* Bottom Arena Status Strip */}
                  <div className="whatif-arena-footer">
                    <div className="arena-foot-item">
                      <span className="arena-foot-label">GATE A (NORTH)</span>
                      <span className="arena-foot-val">
                        Queue: {manualRes.gates?.gateA?.queue || 420} pax · Flow:{' '}
                        {manualRes.gates?.gateA?.flowPerHour || '3,200'}/h
                      </span>
                    </div>
                    <div className="arena-foot-item">
                      <span className="arena-foot-label">GATE B (EAST SURGE)</span>
                      <span className="arena-foot-val" style={{ color: 'var(--color-danger)' }}>
                        Queue: {manualRes.gates?.gateB?.queue || 860} pax · Flow:{' '}
                        {manualRes.gates?.gateB?.flowPerHour || '1,100'}/h
                      </span>
                    </div>
                    <div className="arena-foot-item">
                      <span className="arena-foot-label">GATE C (METRO LINK)</span>
                      <span className="arena-foot-val">
                        Queue: {manualRes.gates?.gateC?.queue || 310} pax · Flow:{' '}
                        {manualRes.gates?.gateC?.flowPerHour || '3,800'}/h
                      </span>
                    </div>
                    <div className="arena-foot-item">
                      <span className="arena-foot-label">PARKING SATURATION</span>
                      <span className="arena-foot-val" style={{ color: 'var(--color-warning)' }}>
                        {manualRes.parkingOccupancyPct || 94}% ({manualRes.parkingRemaining || 300} free)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              VIEW 3: WHAT-IF LIVE (Live-Data-Driven Scenario Page & AI Projections)
              ========================================================================= */}
          <section className={`app-view ${activeView === 'whatif-live' ? 'active' : ''}`}>
            <div className="whatif-live-layout">
              {/* Top Live Command Toolbar */}
              <div className="live-top-toolbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span className="live-status-pill">
                    <span className="pulse-dot"></span> ● LIVE
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    Last Updated:{' '}
                    <strong style={{ color: 'var(--color-espresso)', fontFamily: 'var(--font-mono)' }}>
                      {liveData?.lastUpdatedText || 'Just now'}
                    </strong>
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    Update Interval:
                    <select
                      value={liveInterval}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setLiveInterval(val);
                        liveEngineRef.current?.setUpdateInterval(val);
                      }}
                      className="scenario-select"
                      style={{
                        border: '1px solid var(--border-strong)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        background: '#fff',
                        marginLeft: '4px',
                      }}
                    >
                      <option value={1000}>1 sec (Real-time)</option>
                      <option value={2000}>2 sec</option>
                      <option value={5000}>5 sec</option>
                    </select>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    DATA SOURCE:
                  </span>
                  <select
                    value={liveSource}
                    onChange={(e) => {
                      const val = e.target.value as 'demo' | 'camera';
                      setLiveSource(val);
                      liveEngineRef.current?.setMode(val);
                    }}
                    className="scenario-select"
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 10px',
                      color: 'var(--color-espresso)',
                      fontWeight: 700,
                    }}
                  >
                    <option value="camera">📹 LIVE CAMERA / CCTV FEED</option>
                    <option value="demo">📊 DEMO LIVE DATA</option>
                  </select>
                </div>
              </div>

              {/* Top Dynamic Live KPI Cards Strip */}
              <div className="live-kpi-strip">
                <div className="live-kpi-card">
                  <span className="live-kpi-title">👥 CURRENT CROWD</span>
                  <div className="live-kpi-num">{live.currentCrowd?.toLocaleString()}</div>
                  <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>Active inside perimeter</span>
                </div>

                <div className="live-kpi-card">
                  <span className="live-kpi-title">📥 ENTRIES</span>
                  <div className="live-kpi-num" style={{ color: 'var(--color-success)' }}>
                    {live.totalEntries?.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>Through turnstiles</span>
                </div>

                <div className="live-kpi-card">
                  <span className="live-kpi-title">📤 EXITS</span>
                  <div className="live-kpi-num" style={{ color: 'var(--color-danger)' }}>
                    {live.totalExits?.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>Egress complete</span>
                </div>

                <div className="live-kpi-card">
                  <span className="live-kpi-title">🚗 VEHICLES</span>
                  <div className="live-kpi-num">{live.activeVehicles?.toLocaleString()}</div>
                  <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>Inbound & parked</span>
                </div>

                <div className="live-kpi-card">
                  <span className="live-kpi-title">🅿️ PARKING</span>
                  <div className="live-kpi-num" style={{ color: 'var(--color-warning)' }}>
                    {live.parkingUtilizationPct}%
                  </div>
                  <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>
                    {live.parkingOccupied?.toLocaleString()} / {live.parkingCapacity?.toLocaleString()} Slots
                  </span>
                </div>

                <div className="live-kpi-card">
                  <span className="live-kpi-title">🚪 CRITICAL GATE</span>
                  <div className="live-kpi-num" style={{ color: 'var(--color-danger)', fontSize: '16px' }}>
                    {live.criticalGate} ({live.gates?.gateB?.queue} Q)
                  </div>
                  <span style={{ fontSize: '8.5px', color: 'var(--color-danger)' }}>Bottleneck Warning</span>
                </div>

                <div className="live-kpi-card">
                  <span className="live-kpi-title">⚠️ LIVE RISK</span>
                  <div
                    className="live-kpi-num"
                    style={{
                      color:
                        live.overallRisk === 'HIGH'
                          ? 'var(--color-danger)'
                          : live.overallRisk === 'MODERATE'
                          ? 'var(--color-warning)'
                          : 'var(--color-success)',
                    }}
                  >
                    {live.overallRisk}
                  </div>
                  <span style={{ fontSize: '8.5px', color: 'var(--color-warning)' }}>Safety Threshold</span>
                </div>
              </div>

              {/* Main 2-Column Split: Left = Live Feeds & Gates, Right = AI Projections */}
              <div className="live-main-split">
                {/* Left Column: Live Vision, Gate Load, Density Map */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Live Video / CV Detection Canvas */}
                  <div className="live-card-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="config-section-title">📹 LIVE SENSOR / CCTV OPTICAL COUNTING</span>
                      <span className="badge-status badge-green">LIVE CV STREAM</span>
                    </div>
                    <div className="live-cv-canvas-wrap">
                      <canvas ref={liveCvCanvasRef} id="liveCvCanvas" style={{ width: '100%', height: '100%', display: 'block' }} />
                    </div>
                  </div>

                  {/* Live Gate Monitoring Strip */}
                  <div className="live-card-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="config-section-title">🚪 LIVE GATE-BY-GATE TELEMETRY</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>Real-Time Flow</span>
                    </div>
                    <div className="live-gates-grid">
                      {['gateA', 'gateB', 'gateC'].map((gKey) => {
                        const g = live.gates?.[gKey];
                        if (!g) return null;
                        return (
                          <div key={gKey} className="live-gate-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: '10.5px', color: 'var(--color-espresso)' }}>
                                {g.name.split(' ')[0]} {g.name.split(' ')[1]}
                              </strong>
                              <span className={`badge-status badge-${g.status?.toLowerCase()}`}>{g.status}</span>
                            </div>
                            <div
                              style={{
                                fontSize: '9px',
                                color: 'var(--text-dim)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '2px',
                              }}
                            >
                              <span>
                                People: <strong style={{ color: 'var(--color-espresso)' }}>{g.people?.toLocaleString()}</strong>
                              </span>
                              <span>
                                Flow: <strong style={{ color: 'var(--color-espresso)' }}>{g.flowPerHour}/hr</strong>
                              </span>
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '1px' }}>
                              Queue:{' '}
                              <strong
                                style={{
                                  color: g.queue > 400 ? 'var(--color-danger)' : 'var(--color-success)',
                                }}
                              >
                                {g.queue}
                              </strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Parking Capacity & Inflow */}
                  <div className="live-card-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="config-section-title">🅿️ LIVE PARKING LOT STATUS</span>
                      <span
                        className={`badge-status ${
                          live.parkingOccupied >= live.parkingCapacity
                            ? 'badge-critical'
                            : live.parkingUtilizationPct > 80
                            ? 'badge-orange'
                            : 'badge-green'
                        }`}
                      >
                        {live.parkingOccupied >= live.parkingCapacity ? '⚠️ PARKING OVERFLOW' : 'SLOTS AVAILABLE'}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '6px',
                        background: '#faf7f2',
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>CAPACITY</div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            fontWeight: 800,
                            color: 'var(--color-espresso)',
                          }}
                        >
                          5,000
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>OCCUPIED</div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            fontWeight: 800,
                            color: 'var(--color-warning)',
                          }}
                        >
                          {live.parkingOccupied?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>AVAILABLE</div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            fontWeight: 800,
                            color: 'var(--color-success)',
                          }}
                        >
                          {(live.parkingCapacity - live.parkingOccupied)?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>UTILIZATION</div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            fontWeight: 800,
                            color: 'var(--color-warning)',
                          }}
                        >
                          {live.parkingUtilizationPct}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>INFLOW RATE</div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            fontWeight: 800,
                            color: 'var(--color-espresso)',
                          }}
                        >
                          {live.parkingInflowPerMin} / min
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Density Map */}
                  <div className="live-card-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="config-section-title">📍 LIVE VENUE CROWD FLOW & DENSITY MAP</span>
                      <div style={{ display: 'flex', gap: '4px', fontSize: '8.5px' }}>
                        <span className="badge-status badge-green">&lt;60%</span>
                        <span className="badge-status badge-yellow">60-75%</span>
                        <span className="badge-status badge-orange">75-90%</span>
                        <span className="badge-status badge-red">&gt;90%</span>
                      </div>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '260px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <canvas ref={liveFlowCanvasRef} id="liveFlowCanvas" style={{ width: '100%', height: '100%', display: 'block' }} />
                    </div>
                  </div>
                </div>

                {/* Right Column: AI 30-Min Trend Projection & Live + What-If Perturbation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* SECTION 1: AI 30-MINUTE FORWARD PROJECTION */}
                  <div className="live-projection-banner">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '14px',
                            fontWeight: 800,
                            color: 'var(--color-espresso)',
                          }}
                        >
                          🔮 NEXT 30 MINUTES AI TREND PROJECTION
                        </div>
                        <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                          Continuously calculated from active real-time baseline trajectory
                        </div>
                      </div>
                      <span
                        className="badge-status"
                        style={{
                          background: '#faf7f2',
                          color: 'var(--color-espresso)',
                          border: '1px solid var(--border-strong)',
                        }}
                      >
                        PREDICTED
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        background: '#faf7f2',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        marginTop: '2px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>CURRENT LIVE INFLOW:</span>
                        <strong
                          style={{
                            color: 'var(--color-espresso)',
                            fontSize: '12px',
                            fontFamily: 'var(--font-mono)',
                            marginLeft: '4px',
                          }}
                        >
                          {proj.arrivalRatePerMin} people/min
                        </strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>TREND DIRECTION:</span>
                        <strong
                          style={{
                            color: 'var(--color-warning)',
                            fontSize: '11px',
                            marginLeft: '4px',
                          }}
                        >
                          {proj.trendText}
                        </strong>
                      </div>
                    </div>

                    {/* 4 Projection Key Outcome Cards */}
                    <div className="projection-grid">
                      <div className="projection-metric-box">
                        <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>PROJECTED CROWD (30m)</span>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '16px',
                            fontWeight: 800,
                            color: 'var(--color-espresso)',
                          }}
                        >
                          {proj.projectedCrowd?.toLocaleString()}
                        </div>
                        <span style={{ fontSize: '8.5px', color: 'var(--color-danger)' }}>
                          +{proj.crowdDelta?.toLocaleString()} pax
                        </span>
                      </div>

                      <div className="projection-metric-box">
                        <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>PREDICTED GATE B QUEUE</span>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '16px',
                            fontWeight: 800,
                            color: 'var(--color-danger)',
                          }}
                        >
                          {proj.projectedGateBQueue}
                        </div>
                        <span style={{ fontSize: '8.5px', color: 'var(--color-danger)' }}>🔴 Bottleneck Risk</span>
                      </div>

                      <div className="projection-metric-box">
                        <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>PREDICTED PARKING</span>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '16px',
                            fontWeight: 800,
                            color: 'var(--color-warning)',
                          }}
                        >
                          {proj.projectedParkingPct}%
                        </div>
                        <span style={{ fontSize: '8.5px', color: 'var(--color-warning)' }}>Near Capacity</span>
                      </div>

                      <div className="projection-metric-box">
                        <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>PREDICTED RISK</span>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '16px',
                            fontWeight: 800,
                            color: 'var(--color-danger)',
                          }}
                        >
                          {proj.projectedRisk}
                        </div>
                        <span style={{ fontSize: '8.5px', color: 'var(--color-danger)' }}>Action Required</span>
                      </div>
                    </div>

                    {/* AI Recommendation Action */}
                    <div
                      style={{
                        background: 'var(--color-success-bg)',
                        borderLeft: '3px solid var(--color-success)',
                        padding: '10px 12px',
                        borderRadius: '4px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          color: 'var(--color-success)',
                          marginBottom: '2px',
                        }}
                      >
                        💡 RECOMMENDED PREEMPTIVE ACTION:
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-main)', lineHeight: 1.35 }}>
                        {proj.recommendedAction}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: LIVE + MANUAL SCENARIO PERTURBATIONS */}
                  <div className="live-card-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="config-section-title">⚡ LIVE + WHAT-IF SCENARIO SIMULATION</span>
                        <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>
                          Modify the real-time live situation with hypothetical stresses
                        </div>
                      </div>
                      <button
                        onClick={handleResetLiveModifiers}
                        className="btn btn-secondary"
                        style={{ fontSize: '9px', padding: '3px 8px' }}
                      >
                        🔄 Reset Modifiers
                      </button>
                    </div>

                    {/* Live Presets */}
                    <div className="presets-bar" style={{ marginTop: '4px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-warning)' }}>
                        LIVE PRESETS:
                      </span>
                      <button
                        onClick={() => handleLivePreset('normal_flow')}
                        className="preset-chip"
                        style={{
                          borderColor: livePreset === 'normal_flow' ? 'var(--color-espresso)' : 'var(--border-strong)',
                        }}
                      >
                        Normal Flow (+0%)
                      </button>
                      <button
                        onClick={() => handleLivePreset('high_crowd')}
                        className="preset-chip"
                        style={{
                          borderColor: livePreset === 'high_crowd' ? 'var(--color-espresso)' : 'var(--border-strong)',
                        }}
                      >
                        +25% Inflow Surge
                      </button>
                      <button
                        onClick={() => handleLivePreset('extreme_crowd')}
                        className="preset-chip"
                        style={{
                          borderColor: livePreset === 'extreme_crowd' ? 'var(--color-espresso)' : 'var(--border-strong)',
                        }}
                      >
                        +50% Extreme Surge
                      </button>
                      <button
                        onClick={() => handleLivePreset('gate_b_surge')}
                        className="preset-chip"
                        style={{
                          borderColor: livePreset === 'gate_b_surge' ? 'var(--color-espresso)' : 'var(--border-strong)',
                        }}
                      >
                        +40% Gate B Surge
                      </button>
                      <button
                        onClick={() => handleLivePreset('parking_surge')}
                        className="preset-chip"
                        style={{
                          borderColor: livePreset === 'parking_surge' ? 'var(--color-espresso)' : 'var(--border-strong)',
                        }}
                      >
                        +30% Vehicle Inflow
                      </button>
                    </div>

                    {/* Modifier Form */}
                    <div className="input-row" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginTop: '4px' }}>
                      <div className="input-group">
                        <label className="input-label">"What if Inflow increases by:"</label>
                        <select
                          value={liveModArrival}
                          onChange={(e) => {
                            setLiveModArrival(e.target.value);
                            liveEngineRef.current?.setArrivalModifier(e.target.value);
                          }}
                          className="input-field"
                        >
                          <option value="1.00">+0% (Baseline Live)</option>
                          <option value="1.10">+10% Surge</option>
                          <option value="1.20">+20% Surge</option>
                          <option value="1.30">+30% Surge</option>
                          <option value="1.50">+50% Major Surge</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="input-label">"What if Gate B receives:"</label>
                        <select
                          value={liveModGateB}
                          onChange={(e) => {
                            setLiveModGateB(e.target.value);
                            liveEngineRef.current?.setGateBModifier(e.target.value);
                          }}
                          className="input-field"
                        >
                          <option value="0">+0% Normal Share</option>
                          <option value="20">+20% Surge</option>
                          <option value="40">+40% Concentrated Rush</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="input-label">"What if Parking Inflow:"</label>
                        <select
                          value={liveModParking}
                          onChange={(e) => {
                            setLiveModParking(e.target.value);
                            liveEngineRef.current?.setParkingModifier(e.target.value);
                          }}
                          className="input-field"
                        >
                          <option value="0">+0% Normal</option>
                          <option value="20">+20% Vehicles</option>
                          <option value="35">+35% Surge</option>
                        </select>
                      </div>
                    </div>

                    {/* COMPARISON: CURRENT LIVE vs PROJECTED RESULT */}
                    <div
                      style={{
                        background: '#faf7f2',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        marginTop: '6px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: 'var(--color-espresso)',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>📊 LIVE BASELINE + WHAT-IF CHANGE = PROJECTED RESULT</span>
                        <span className="badge-status badge-high">REAL-TIME FORECAST</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                        <div
                          style={{
                            background: '#ffffff',
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <div style={{ fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                            CURRENT LIVE
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '18px',
                              fontWeight: 800,
                              color: 'var(--color-espresso)',
                            }}
                          >
                            {live.currentCrowd?.toLocaleString()}
                          </div>
                          <span style={{ fontSize: '8.5px', color: 'var(--text-dim)' }}>Active now</span>
                        </div>

                        <div
                          style={{
                            background: '#ffffff',
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-strong)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '9px',
                              color: 'var(--color-espresso)',
                              textTransform: 'uppercase',
                              fontWeight: 800,
                            }}
                          >
                            PROJECTED RESULT
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '18px',
                              fontWeight: 800,
                              color: 'var(--color-espresso)',
                            }}
                          >
                            {proj.projectedCrowd?.toLocaleString()}
                          </div>
                          <span style={{ fontSize: '8.5px', color: 'var(--color-warning)' }}>
                            At {liveModArrival}× arrival rate
                          </span>
                        </div>

                        <div
                          style={{
                            background: '#ffffff',
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <div style={{ fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                            DIFFERENCE
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '18px',
                              fontWeight: 800,
                              color: 'var(--color-danger)',
                            }}
                          >
                            +{proj.crowdDelta?.toLocaleString()}
                          </div>
                          <span style={{ fontSize: '8.5px', color: 'var(--color-danger)' }}>Expected increase</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* =========================================================================
            BOTTOM SYNCHRONIZED EVENT TIMELINE BAR (Active on Live Monitoring)
            ========================================================================= */}
        {activeView === 'live-monitoring' && (
          <footer className="app-timeline-bar">
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
              TIMELINE:
            </span>
            <div className="timeline-track-wrapper">
              <div className="timeline-milestones">
                <span>3:00 PM (Gates Open)</span>
                <span>3:45 PM (Inflow Ramp)</span>
                <span className="timeline-milestone-marker peak">🔴 4:25 PM (125k Peak)</span>
                <span>8:00 PM (Match/Event)</span>
                <span>11:30 PM (Egress)</span>
                <span className="timeline-milestone-marker peak">🔴 12:05 AM (125k Exit)</span>
                <span>12:40 AM (Dissipation)</span>
              </div>
              <input
                type="range"
                className="timeline-scrubber"
                min={900}
                max={1530}
                step={1}
                value={sim.simMinute || 900}
                onChange={(e) => handleTimelineScrub(parseFloat(e.target.value))}
              />
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};
