/**
 * EVENTFLOW COMMAND CENTER — MAIN APPLICATION COORDINATOR
 * Seamlessly coordinates 3 major views:
 * 1. LIVE MONITORING (Digital twin presentation simulation)
 * 2. WHAT-IF (Manual scenario builder & crowd simulation comparison)
 * 3. WHAT-IF LIVE (Continuous live sensor stream, 30-min AI predictions & hybrid simulation)
 */

import { SimulationEngine } from './simulationEngine.js';
import { DigitalTwinRenderer } from './digitalTwinRenderer.js';
import { ChartsManager } from './chartsManager.js';
import { AlertSystem } from './alertSystem.js';
import { WhatIfAdvisor } from './whatIfAdvisor.js';
import { WhatIfManualEngine } from './whatIfManualEngine.js';
import { WhatIfLiveEngine } from './whatIfLiveEngine.js';

class App {
  constructor() {
    this.activeView = "live-monitoring";

    // Engines
    this.simEngine = new SimulationEngine();
    this.manualEngine = new WhatIfManualEngine();
    this.liveEngine = new WhatIfLiveEngine();

    // Helpers
    this.alertSystem = new AlertSystem();
    this.charts = new ChartsManager();
    this.renderer = null;
    this.activeQuestion = "q_crowd_increasing";

    // Canvases
    this.whatIfCanvas = null;
    this.liveCvCanvas = null;
    this.liveFlowCanvas = null;

    this.initDOM();
    this.bindNavigation();
    this.bindLiveMonitoringEvents();
    this.bindWhatIfManualEvents();
    this.bindWhatIfLiveEvents();
    this.startGlobalAnimationLoop();

    // Auto-start default simulation
    this.simEngine.start();
  }

  initDOM() {
    // 1. Digital Twin Canvas for Live Monitoring
    const canvas = document.getElementById("digitalTwinCanvas");
    if (canvas) {
      this.renderer = new DigitalTwinRenderer(canvas);
      window.addEventListener("resize", () => {
        if (this.renderer) this.renderer.resize();
      });
    }

    // 2. Charts
    this.charts.init({
      crowdCanvas: document.getElementById("chartCrowdVsTime"),
      parkingCanvas: document.getElementById("chartParkingVsTime"),
      flowCanvas: document.getElementById("chartEntriesVsExits"),
      gateCanvas: document.getElementById("chartGateTraffic"),
      zoneCanvas: document.getElementById("chartZoneDensity")
    });

    // 3. What-If Manual Canvas
    this.whatIfCanvas = document.getElementById("whatIfCanvas");

    // 4. What-If Live Canvases
    this.liveCvCanvas = document.getElementById("liveCvCanvas");
    this.liveFlowCanvas = document.getElementById("liveFlowCanvas");

    // Subscriptions
    this.simEngine.subscribe((state) => this.onSimulationUpdate(state));
    this.manualEngine.subscribe((state) => this.onWhatIfManualUpdate(state));
    this.liveEngine.subscribe((state) => this.onWhatIfLiveUpdate(state));

    // Initial state trigger
    this.onSimulationUpdate(this.simEngine.getState());

    // Handle initial hash routing if present
    const hash = window.location.hash.replace("#/", "").replace("#", "");
    if (hash === "whatif" || hash === "what-if") {
      this.switchView("whatif");
    } else if (hash === "whatif-live" || hash === "what-if-live") {
      this.switchView("whatif-live");
    } else {
      this.switchView("live-monitoring");
    }
  }

  /* =========================================================================
     NAVIGATION SYSTEM
     ========================================================================= */
  bindNavigation() {
    const tabBtns = document.querySelectorAll(".nav-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const viewName = btn.dataset.view;
        this.switchView(viewName);
      });
    });

    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "");
      if (hash && (hash === "live-monitoring" || hash === "whatif" || hash === "whatif-live")) {
        this.switchView(hash);
      }
    });
  }

  switchView(viewName) {
    this.activeView = viewName;
    window.location.hash = `#/${viewName}`;

    // Update Tab Buttons
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    // Update View Panels
    document.querySelectorAll(".app-view").forEach(view => {
      view.classList.remove("active");
    });

    if (viewName === "live-monitoring") {
      const el = document.getElementById("viewLiveMonitoring");
      if (el) el.classList.add("active");
      document.getElementById("masterClockHud")?.style.setProperty("display", "flex");
      document.getElementById("masterTimelineBar")?.style.setProperty("display", "flex");
      if (this.renderer) this.renderer.resize();
    } else if (viewName === "whatif") {
      const el = document.getElementById("viewWhatIf");
      if (el) el.classList.add("active");
      document.getElementById("masterClockHud")?.style.setProperty("display", "none");
      document.getElementById("masterTimelineBar")?.style.setProperty("display", "none");
      this.onWhatIfManualUpdate(this.manualEngine.getState());
    } else if (viewName === "whatif-live") {
      const el = document.getElementById("viewWhatIfLive");
      if (el) el.classList.add("active");
      document.getElementById("masterClockHud")?.style.setProperty("display", "none");
      document.getElementById("masterTimelineBar")?.style.setProperty("display", "none");
      this.onWhatIfLiveUpdate(this.liveEngine.getFullState());
    }
  }

  /* =========================================================================
     VIEW 1: LIVE MONITORING CONTROLS & UPDATES
     ========================================================================= */
  bindLiveMonitoringEvents() {
    const btnStartDemo = document.getElementById("btnStartDemo");
    if (btnStartDemo) {
      btnStartDemo.addEventListener("click", () => {
        this.simEngine.reset();
        this.simEngine.setSpeed(10);
        this.simEngine.start();
        this.updateSpeedUI(10);
      });
    }

    const btnPlayPause = document.getElementById("btnPlayPause");
    if (btnPlayPause) {
      btnPlayPause.addEventListener("click", () => {
        this.simEngine.togglePlay();
        btnPlayPause.innerHTML = (!this.simEngine.isRunning || this.simEngine.isPaused) ? "▶ Resume" : "⏸ Pause";
      });
    }

    const btnReset = document.getElementById("btnReset");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        this.simEngine.reset();
        this.simEngine.setSpeed(2);
        this.simEngine.start();
        this.updateSpeedUI(2);
      });
    }

    const speedButtons = document.querySelectorAll(".speed-btn");
    speedButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const spd = parseInt(e.target.dataset.speed, 10);
        this.simEngine.setSpeed(spd);
        this.updateSpeedUI(spd);
      });
    });

    const scrubber = document.getElementById("timelineScrubber");
    if (scrubber) {
      scrubber.addEventListener("input", (e) => {
        this.simEngine.jumpToTime(parseFloat(e.target.value));
      });
    }

    const btnZoomIn = document.getElementById("btnZoomIn");
    const btnZoomOut = document.getElementById("btnZoomOut");
    const btnResetView = document.getElementById("btnResetView");
    if (btnZoomIn) btnZoomIn.addEventListener("click", () => { if (this.renderer) this.renderer.scale *= 1.2; });
    if (btnZoomOut) btnZoomOut.addEventListener("click", () => { if (this.renderer) this.renderer.scale *= 0.8; });
    if (btnResetView) btnResetView.addEventListener("click", () => { if (this.renderer) this.renderer.resetView(); });

    const qSelect = document.getElementById("whatIfQuestionSelect");
    if (qSelect) {
      qSelect.addEventListener("change", (e) => {
        this.activeQuestion = e.target.value;
        this.updateWhatIfAdvisorOutput(this.simEngine.getState());
      });
    }
  }

  updateSpeedUI(spd) {
    document.querySelectorAll(".speed-btn").forEach(b => {
      b.classList.toggle("active", parseInt(b.dataset.speed, 10) === spd);
    });
  }

  onSimulationUpdate(state) {
    if (!state) return;

    try {
      // Clock
      const timeDisplay = document.getElementById("simClockTime");
      if (timeDisplay) timeDisplay.textContent = state.formattedTime;

      const phasePill = document.getElementById("simPhasePill");
      if (phasePill && state.timelinePhase) {
        phasePill.textContent = state.timelinePhase.title;
        phasePill.className = "phase-pill " + (
          state.isPeakArrival || state.isPeakExit || state.overflowCount > 5000 ? "peak" :
          state.simMinute < 1025 ? "arrival" :
          state.simMinute < 1380 ? "event" : "exit"
        );
      }

      const stageStatus = document.getElementById("centerStageMatchStatus");
      if (stageStatus && state.timelinePhase) {
        stageStatus.textContent = `${state.formattedTime} (${state.timelinePhase.phase})`;
      }

      const btnPlayPause = document.getElementById("btnPlayPause");
      if (btnPlayPause) {
        btnPlayPause.innerHTML = (!state.isRunning || state.isPaused) ? "▶ Resume" : "⏸ Pause";
      }

      // KPIs
      this.setElemText("kpiTotalPeople", state.totalPeople.toLocaleString());
      this.setElemText("kpiTotalEntries", state.totalEntries.toLocaleString());
      this.setElemText("kpiTotalExits", state.totalExits.toLocaleString());

      const occPercent = ((state.currentOccupancy / state.stadiumCapacity) * 100).toFixed(1);
      let occLabel = `${state.currentOccupancy.toLocaleString()} (${occPercent}%)`;
      if (state.overflowCount > 0) {
        occLabel += ` [⚠️ +${state.overflowCount.toLocaleString()} Over]`;
      }
      this.setElemText("kpiStadiumOccupancy", occLabel);
      this.setElemText("kpiParkingOccupancy", `${state.parkingOccupancyPct}%`);
      this.setElemText("kpiActiveVehicles", state.totalVehicles.toLocaleString());
      this.setElemText("kpiActiveGates", `${state.activeGatesCount || 8} / 8 ONLINE`);

      const densityElem = document.getElementById("kpiCrowdDensity");
      if (densityElem) {
        densityElem.textContent = state.globalCrowdDensity;
        densityElem.className = `kpi-value badge-status badge-${state.globalCrowdDensity.toLowerCase()}`;
      }

      const critElem = document.getElementById("kpiCriticalZones");
      if (critElem) critElem.textContent = `${state.criticalZonesCount} ZONES`;

      // Seating Blocks Chips
      const blocksBox = document.getElementById("blocksMatrixChips");
      if (blocksBox && state.blocks) {
        blocksBox.innerHTML = Object.keys(state.blocks).map(bk => {
          const b = state.blocks[bk];
          let col = "#1c1815";
          if (b.pct >= 95) col = "#dc2626";
          else if (b.pct >= 75) col = "#ea580c";
          else if (b.pct >= 40) col = "#ca6510";
          return `
            <div class="block-chip" style="border-color:${col}44;">
              <span class="block-chip-title">${b.id.toUpperCase()}</span>
              <span class="block-chip-pct" style="color:${col};">${b.pct}%</span>
            </div>
          `;
        }).join("");
      }

      // Peak banner
      const peakBanner = document.getElementById("peakFloatingBanner");
      if (peakBanner) {
        if (state.isPeakArrival) {
          peakBanner.style.display = "flex";
          peakBanner.innerHTML = "🔴 125,000 ARRIVAL PEAK (+25k OVERFLOW SURGE)";
        } else if (state.isPeakExit) {
          peakBanner.style.display = "flex";
          peakBanner.innerHTML = "🔴 125,000 MIDNIGHT EXIT PEAK (12:05 AM)";
        } else if (state.overflowCount > 10000) {
          peakBanner.style.display = "flex";
          peakBanner.innerHTML = `⚠️ STADIUM FULL (100k/100k) — +${state.overflowCount.toLocaleString()} IN CONCOURSE`;
        } else {
          peakBanner.style.display = "none";
        }
      }

      // Scrubber
      const scrubber = document.getElementById("timelineScrubber");
      if (scrubber) scrubber.value = state.simMinute;

      // Charts & Advisor
      if (this.activeView === "live-monitoring") {
        this.charts.update(state);
        this.updateWhatIfAdvisorOutput(state);
        this.updateAlertFeed(state);
      }
    } catch (err) {
      console.error("Simulation UI update error:", err);
    }
  }

  updateWhatIfAdvisorOutput(state) {
    const box = document.getElementById("whatIfAnswerBox");
    if (!box || !state) return;
    try {
      const ans = WhatIfAdvisor.answerQuestion(this.activeQuestion, state);
      if (!ans) return;

      let metricsHtml = "";
      if (ans.metrics && Array.isArray(ans.metrics)) {
        metricsHtml = ans.metrics.map(m => `
          <div class="advisor-metric-item">
            <div class="advisor-metric-label">${m.label}</div>
            <div class="advisor-metric-val">${m.value}</div>
          </div>
        `).join("");
      }

      box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <strong style="font-size:11px; color:var(--color-espresso);">${ans.title || "Crowd Intelligence"}</strong>
          <span class="badge-status" style="background:#faf7f2; color:${ans.color || 'var(--color-espresso)'}; border:1px solid var(--border-strong); font-size:8px;">${ans.badge || "LIVE"}</span>
        </div>
        <div class="advisor-answer-text">${ans.answer || ""}</div>
        <div class="advisor-metrics-grid">${metricsHtml}</div>
        <div class="advisor-recommendation" style="margin-top:4px;">💡 ${ans.recommendation || ""}</div>
      `;
    } catch (e) {
      console.error("Advisor update error:", e);
    }
  }

  updateAlertFeed(state) {
    const feed = document.getElementById("liveAlertFeed");
    if (!feed || !state) return;
    try {
      const alerts = this.alertSystem.evaluate(state) || [];
      if (alerts.length === 0) {
        feed.innerHTML = `
          <div class="alert-item" style="border-left-color: var(--color-success);">
            <span class="alert-item-time">${state.formattedTime}</span>
            <span class="alert-item-text">All 8 blocks and perimeter gates operating nominally.</span>
          </div>
        `;
        return;
      }
      feed.innerHTML = alerts.map(a => `
        <div class="alert-item ${a.level.toLowerCase()}">
          <span class="alert-item-time">${a.time}</span>
          <span class="alert-item-text"><strong>${a.title}</strong>: ${a.message}</span>
        </div>
      `).join("");
    } catch (e) {
      console.error("Alert feed update error:", e);
    }
  }

  /* =========================================================================
     VIEW 2: WHAT-IF MANUAL SCENARIO
     ========================================================================= */
  bindWhatIfManualEvents() {
    const btnRun = document.getElementById("btnRunWhatIfManual");
    if (btnRun) {
      btnRun.addEventListener("click", () => {
        btnRun.textContent = "⏳ Running What-If Simulation...";
        this.manualEngine.startSimulation();
        setTimeout(() => {
          btnRun.innerHTML = "<span>⚡</span> Run What-If Simulation";
        }, 500);
      });
    }

    const attendeesSelect = document.getElementById("whatIfAttendeesSelect");
    if (attendeesSelect) {
      attendeesSelect.addEventListener("change", (e) => {
        const val = parseInt(e.target.value, 10);
        this.manualEngine.setWhatIfCrowd(val);
      });
    }

    const gateBSelect = document.getElementById("whatIfGateBShare");
    if (gateBSelect) {
      gateBSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val === "extreme") {
          this.manualEngine.setGateShare("gateB", 0.40);
        } else if (val === "high") {
          this.manualEngine.setGateShare("gateB", 0.28);
        } else {
          this.manualEngine.setGateShare("gateB", 0.125);
        }
      });
    }

    document.querySelectorAll(".preset-chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        document.querySelectorAll(".preset-chip").forEach(c => c.style.borderColor = "var(--border-strong)");
        e.target.style.borderColor = "var(--color-espresso)";

        const preset = e.target.dataset.preset;
        if (preset === "baseline") {
          if (attendeesSelect) attendeesSelect.value = "100000";
          if (gateBSelect) gateBSelect.value = "normal";
          this.manualEngine.setExpectedCrowd(100000);
          this.manualEngine.setWhatIfCrowd(100000);
          this.manualEngine.setGateShare("gateB", 0.25);
        } else if (preset === "surge_25k") {
          if (attendeesSelect) attendeesSelect.value = "125000";
          this.manualEngine.setExpectedCrowd(100000);
          this.manualEngine.setWhatIfCrowd(125000);
        } else if (preset === "gate_b_jam") {
          if (attendeesSelect) attendeesSelect.value = "125000";
          if (gateBSelect) gateBSelect.value = "extreme";
          this.manualEngine.setWhatIfCrowd(125000);
          this.manualEngine.setGateShare("gateB", 0.40);
        } else if (preset === "parking_p1_full") {
          if (attendeesSelect) attendeesSelect.value = "140000";
          this.manualEngine.setWhatIfCrowd(140000);
          this.manualEngine.setParkingSurge(35);
        }
      });
    });
  }

  onWhatIfManualUpdate(state) {
    if (!state || !state.results) return;
    const res = state.results;

    // Update Comparison Matrix Table
    this.setElemText("compWhatIfAttend", res.scenario.totalCrowd ? res.scenario.totalCrowd.toLocaleString() : "125,000");
    if (res.scenario.gates && res.scenario.gates.gateB) {
      this.setElemText("compWhatIfGateB", `${res.scenario.gates.gateB.queue || 860} pax`);
      this.setElemText("whatifFootGateB", `Queue: ${res.scenario.gates.gateB.queue || 860} pax · Flow: 1,100/h`);
    }
    if (res.scenario.gates && res.scenario.gates.gateA) {
      this.setElemText("whatifFootGateA", `Queue: ${res.scenario.gates.gateA.queue || 420} pax · Flow: 3,200/h`);
    }
    if (res.scenario.gates && res.scenario.gates.gateC) {
      this.setElemText("whatifFootGateC", `Queue: ${res.scenario.gates.gateC.queue || 310} pax · Flow: 3,800/h`);
    }

    if (res.scenario.parkingOccupancyPct !== undefined) {
      this.setElemText("compWhatIfParking", `${res.scenario.parkingOccupancyPct}%`);
      this.setElemText("whatifFootParking", `${res.scenario.parkingOccupancyPct}% Full · ${res.scenario.parkingRemaining || 300} free`);
    }

    const badge = document.getElementById("whatifTwinRiskBadge");
    if (badge && res.scenario.overallRisk) {
      badge.textContent = `${res.scenario.overallRisk} CONGESTION`;
      badge.className = `badge-status badge-${res.scenario.overallRisk.toLowerCase() === "critical" || res.scenario.overallRisk.toLowerCase() === "high" ? "critical" : "normal"}`;
    }
  }

  /* =========================================================================
     VIEW 3: WHAT-IF LIVE EVENTS & UPDATES
     ========================================================================= */
  bindWhatIfLiveEvents() {
    const btnResetMods = document.getElementById("btnResetLiveModifiers");
    if (btnResetMods) {
      btnResetMods.addEventListener("click", () => {
        const modArr = document.getElementById("liveModArrivalSelect");
        const modGate = document.getElementById("liveModGateBSelect");
        const modPark = document.getElementById("liveModParkingSelect");
        if (modArr) modArr.value = "1.00";
        if (modGate) modGate.value = "0";
        if (modPark) modPark.value = "0";
      });
    }
  }

  onWhatIfLiveUpdate(data) {
    if (this.activeView !== "whatif-live") return;
    const live = data.live;
    const proj = data.projection;

    this.setElemText("liveLastUpdatedText", data.lastUpdatedText);
    this.setElemText("liveKpiCrowd", live.currentCrowd.toLocaleString());
    this.setElemText("liveKpiEntries", live.totalEntries.toLocaleString());
    this.setElemText("liveKpiExits", live.totalExits.toLocaleString());
    this.setElemText("liveKpiVehicles", live.activeVehicles.toLocaleString());
    this.setElemText("liveKpiParking", `${live.parkingUtilizationPct}%`);
    this.setElemText("liveParkingSubText", `${live.parkingOccupied.toLocaleString()} / ${live.parkingCapacity.toLocaleString()} Slots`);
    this.setElemText("liveKpiCriticalGate", `${live.criticalGate} (${live.gates.gateB.queue} Q)`);
    this.setElemText("liveKpiRisk", live.overallRisk);

    const riskEl = document.getElementById("liveKpiRisk");
    if (riskEl) {
      riskEl.style.color = live.overallRisk === "HIGH" ? "var(--color-danger)" : live.overallRisk === "MODERATE" ? "var(--color-warning)" : "var(--color-success)";
    }

    const gContainer = document.getElementById("liveGatesContainer");
    if (gContainer) {
      gContainer.innerHTML = ["gateA", "gateB", "gateC"].map(gKey => {
        const g = live.gates[gKey];
        return `
          <div class="live-gate-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="font-size:10.5px; color:var(--color-espresso);">${g.name.split(" ")[0]} ${g.name.split(" ")[1]}</strong>
              <span class="badge-status badge-${g.status.toLowerCase()}">${g.status}</span>
            </div>
            <div style="font-size:9px; color:var(--text-dim); display:flex; justify-content:space-between; margin-top:2px;">
              <span>People: <strong style="color:var(--color-espresso);">${g.people.toLocaleString()}</strong></span>
              <span>Flow: <strong style="color:var(--color-espresso);">${g.flowPerHour}/hr</strong></span>
            </div>
            <div style="font-size:9px; color:var(--text-dim); margin-top:1px;">
              Queue: <strong style="color:${g.queue > 400 ? "var(--color-danger)" : "var(--color-success)"};">${g.queue}</strong>
            </div>
          </div>
        `;
      }).join("");
    }

    this.setElemText("liveParkOccupiedNum", live.parkingOccupied.toLocaleString());
    this.setElemText("liveParkAvailableNum", (live.parkingCapacity - live.parkingOccupied).toLocaleString());
    this.setElemText("liveParkUtilNum", `${live.parkingUtilizationPct}%`);
    this.setElemText("liveParkInflowNum", `${live.parkingInflowPerMin} / min`);

    const overflowTag = document.getElementById("liveParkingOverflowTag");
    if (overflowTag) {
      if (live.parkingOccupied >= live.parkingCapacity) {
        overflowTag.textContent = "⚠️ PARKING OVERFLOW";
        overflowTag.className = "badge-status badge-critical";
      } else {
        overflowTag.textContent = "SLOTS AVAILABLE";
        overflowTag.className = `badge-status badge-${live.parkingUtilizationPct > 80 ? "orange" : "green"}`;
      }
    }

    this.setElemText("liveArrivalRateText", `${proj.arrivalRatePerMin} people/min`);
    this.setElemText("liveTrendText", proj.trendText);
    this.setElemText("projCrowdNum", proj.projectedCrowd.toLocaleString());
    this.setElemText("projCrowdDelta", `+${proj.crowdDelta.toLocaleString()} pax`);
    this.setElemText("projGateBQueueNum", proj.projectedGateBQueue.toString());
    this.setElemText("projParkingPct", `${proj.projectedParkingPct}%`);
    this.setElemText("projRiskLevel", proj.projectedRisk);
    this.setElemText("projActionText", proj.recommendedAction);

    this.setElemText("hybridCurrentCrowd", live.currentCrowd.toLocaleString());
    this.setElemText("hybridProjectedCrowd", proj.projectedCrowd.toLocaleString());
    this.setElemText("hybridCrowdDiff", `+${proj.crowdDelta.toLocaleString()}`);
  }

  /* =========================================================================
     GLOBAL ANIMATION LOOP (60 FPS RENDERER)
     ========================================================================= */
  startGlobalAnimationLoop() {
    const loop = () => {
      if (this.renderer && this.activeView === "live-monitoring") {
        this.renderer.render(this.simEngine.getState());
      }
      if (this.activeView === "whatif") {
        if (!this.whatIfCanvas) {
          this.whatIfCanvas = document.getElementById("whatIfCanvas");
        }
        if (this.whatIfCanvas) {
          this.manualEngine.renderCanvas(this.whatIfCanvas);
        }
      }
      if (this.activeView === "whatif-live") {
        if (this.liveCvCanvas) this.liveEngine.renderLiveCvCanvas(this.liveCvCanvas);
        if (this.liveFlowCanvas) this.liveEngine.renderLiveVenueFlowCanvas(this.liveFlowCanvas);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  setElemText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
}

// Ensure App initializes whether DOM is loading or already interactive
function initApp() {
  if (!window.app) {
    window.app = new App();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
