/**
 * WHAT-IF LIVE DATA ENGINE & AI PROJECTION ENGINE
 * Continuous real-time data acquisition, live CV camera/sensor stream with fast pedestrian movement,
 * Optical tripwire crossing detection with dynamic GREEN color transition,
 * Live Telemetry, Dynamic Gates & Parking, Live Density Zones,
 * 30-Minute AI Trend Projection, and Live + Manual Hybrid Scenario Simulation.
 */

export class WhatIfLiveEngine {
  constructor() {
    this.mode = "demo"; // "demo" or "camera"
    this.updateIntervalMs = 1000;
    this.lastUpdated = new Date();
    this.listeners = new Set();
    this.timerId = null;
    this.cameraStream = null;
    this.tripwireCounter = 4800;

    // Central Live State (Real-time telemetry)
    this.liveState = {
      currentCrowd: 10842,
      totalEntries: 7420,
      totalExits: 1240,
      activeVehicles: 2860,
      parkingCapacity: 5000,
      parkingOccupied: 3920,
      parkingUtilizationPct: 78.4,
      parkingInflowPerMin: 32,
      arrivalRatePerMin: 620,
      exitRatePerMin: 110,
      criticalGate: "Gate B",
      overallRisk: "HIGH",
      trendDirection: "Increasing (+12.4%/hr)",
      
      // Gate-wise Live Telemetry
      gates: {
        gateA: { name: "Gate A (North Boulevard)", people: 3200, flowPerHour: 620, queue: 210, capacityPerHour: 3500, status: "NORMAL" },
        gateB: { name: "Gate B (East Grand Plaza)", people: 4800, flowPerHour: 1100, queue: 680, capacityPerHour: 3000, status: "HIGH" },
        gateC: { name: "Gate C (South Metro Link)", people: 2842, flowPerHour: 540, queue: 180, capacityPerHour: 4000, status: "NORMAL" }
      },

      // Venue Density Zones
      zones: {
        gateA_plaza: { name: "Gate A Plaza", count: 2100, capacity: 4000, densityLevel: "GREEN", pct: 52.5, status: "Normal" },
        gateB_plaza: { name: "Gate B Grand Concourse", count: 4800, capacity: 5000, densityLevel: "RED", pct: 96.0, status: "Critical" },
        food_court: { name: "Food Court Promenade", count: 2400, capacity: 3000, densityLevel: "ORANGE", pct: 80.0, status: "High" },
        parking_hub: { name: "West Parking Hub", count: 3920, capacity: 5000, densityLevel: "YELLOW", pct: 78.4, status: "Moderate" },
        stadium_bowl: { name: "Main Stadium Bowl", count: 6200, capacity: 10000, densityLevel: "YELLOW", pct: 62.0, status: "Moderate" }
      }
    };

    // Manual perturbation modifiers applied to Live Baseline
    this.liveModifiers = {
      arrivalRateMultiplier: 1.0,
      gateBSurgePct: 0,
      parkingSurgePct: 0
    };

    // Computer vision mock/live tracking boxes
    this.cvDetections = [];
    this.initCvDetections();

    // Start background live pulse
    this.startLivePulse();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const data = this.getFullState();
    this.listeners.forEach(cb => cb(data));
  }

  setMode(mode) {
    this.mode = mode;
    this.notify();
  }

  setUpdateInterval(ms) {
    this.updateIntervalMs = ms;
    this.restartTimer();
  }

  setArrivalModifier(mult) {
    this.liveModifiers.arrivalRateMultiplier = parseFloat(mult) || 1.0;
    this.notify();
  }

  setGateBModifier(pct) {
    this.liveModifiers.gateBSurgePct = parseFloat(pct) || 0;
    this.notify();
  }

  setParkingModifier(pct) {
    this.liveModifiers.parkingSurgePct = parseFloat(pct) || 0;
    this.notify();
  }

  applyLivePreset(presetKey) {
    switch (presetKey) {
      case "normal_flow":
        this.liveModifiers.arrivalRateMultiplier = 1.0;
        this.liveModifiers.gateBSurgePct = 0;
        this.liveModifiers.parkingSurgePct = 0;
        break;

      case "high_crowd":
        this.liveModifiers.arrivalRateMultiplier = 1.25;
        this.liveModifiers.parkingSurgePct = 20;
        break;

      case "extreme_crowd":
        this.liveModifiers.arrivalRateMultiplier = 1.50;
        this.liveModifiers.gateBSurgePct = 40;
        this.liveModifiers.parkingSurgePct = 35;
        break;

      case "gate_b_surge":
        this.liveModifiers.arrivalRateMultiplier = 1.20;
        this.liveModifiers.gateBSurgePct = 40;
        break;

      case "parking_surge":
        this.liveModifiers.arrivalRateMultiplier = 1.15;
        this.liveModifiers.parkingSurgePct = 30;
        break;

      case "early_surge":
        this.liveModifiers.arrivalRateMultiplier = 1.30;
        this.liveModifiers.gateBSurgePct = 25;
        break;
    }
    this.notify();
  }

  resetModifiers() {
    this.liveModifiers = {
      arrivalRateMultiplier: 1.0,
      gateBSurgePct: 0,
      parkingSurgePct: 0
    };
    this.notify();
  }

  startLivePulse() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.tick();
    }, this.updateIntervalMs);
  }

  restartTimer() {
    this.startLivePulse();
  }

  destroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.listeners.clear();
  }

  tick() {
    this.lastUpdated = new Date();

    // Smooth Brownian drift on arrival rate (600 - 750 pax/min)
    const drift = (Math.random() - 0.48) * 15;
    this.liveState.arrivalRatePerMin = Math.max(350, Math.min(950, Math.round(this.liveState.arrivalRatePerMin + drift)));
    
    // Increment arrivals and entries per second
    const newArrivals = Math.max(1, Math.round(this.liveState.arrivalRatePerMin / 60));
    const newExits = Math.max(0, Math.round(this.liveState.exitRatePerMin / 60 + (Math.random() - 0.5) * 2));

    this.liveState.totalEntries += newArrivals;
    this.liveState.totalExits += newExits;
    this.liveState.currentCrowd = Math.max(5000, this.liveState.totalEntries - this.liveState.totalExits + 4662);

    // Gate allocations
    const gateA_in = Math.round(newArrivals * 0.30);
    const gateB_in = Math.round(newArrivals * 0.45);
    const gateC_in = Math.round(newArrivals * 0.25);

    this.liveState.gates.gateA.people += gateA_in;
    this.liveState.gates.gateB.people += gateB_in;
    this.liveState.gates.gateC.people += gateC_in;

    // Gate queues fluctuation
    this.liveState.gates.gateA.queue = Math.max(50, Math.min(500, Math.round(this.liveState.gates.gateA.queue + (Math.random() - 0.5) * 6)));
    this.liveState.gates.gateB.queue = Math.max(450, Math.min(1200, Math.round(this.liveState.gates.gateB.queue + (Math.random() - 0.45) * 10)));
    this.liveState.gates.gateC.queue = Math.max(40, Math.min(400, Math.round(this.liveState.gates.gateC.queue + (Math.random() - 0.5) * 5)));

    this.liveState.gates.gateA.flowPerHour = Math.round(this.liveState.arrivalRatePerMin * 0.30 * 60 / 60) * 60;
    this.liveState.gates.gateB.flowPerHour = Math.round(this.liveState.arrivalRatePerMin * 0.45 * 60 / 60) * 60;
    this.liveState.gates.gateC.flowPerHour = Math.round(this.liveState.arrivalRatePerMin * 0.25 * 60 / 60) * 60;

    this.liveState.gates.gateA.status = this.liveState.gates.gateA.queue > 400 ? "HIGH" : "NORMAL";
    this.liveState.gates.gateB.status = this.liveState.gates.gateB.queue > 650 ? "CRITICAL" : this.liveState.gates.gateB.queue > 400 ? "HIGH" : "NORMAL";
    this.liveState.gates.gateC.status = this.liveState.gates.gateC.queue > 400 ? "HIGH" : "NORMAL";

    // Parking increments
    if (Math.random() > 0.4) {
      this.liveState.parkingOccupied = Math.min(5000, this.liveState.parkingOccupied + 1);
      this.liveState.activeVehicles += 1;
    }
    this.liveState.parkingUtilizationPct = parseFloat(((this.liveState.parkingOccupied / this.liveState.parkingCapacity) * 100).toFixed(1));

    // Zone Densities & Color thresholds
    const updateZone = (zKey, count, cap) => {
      const z = this.liveState.zones[zKey];
      z.count = count;
      z.capacity = cap;
      z.pct = parseFloat(((count / cap) * 100).toFixed(1));
      if (z.pct >= 90) { z.densityLevel = "RED"; z.status = "Critical"; }
      else if (z.pct >= 75) { z.densityLevel = "ORANGE"; z.status = "High"; }
      else if (z.pct >= 60) { z.densityLevel = "YELLOW"; z.status = "Moderate"; }
      else { z.densityLevel = "GREEN"; z.status = "Normal"; }
    };

    updateZone("gateA_plaza", this.liveState.gates.gateA.people, 4000);
    updateZone("gateB_plaza", this.liveState.gates.gateB.people, 5000);
    updateZone("food_court", Math.round(this.liveState.currentCrowd * 0.22), 3000);
    updateZone("parking_hub", this.liveState.parkingOccupied, 5000);
    updateZone("stadium_bowl", Math.round(this.liveState.currentCrowd * 0.65), 10000);

    // Critical Gate & Risk
    this.liveState.criticalGate = this.liveState.gates.gateB.queue > this.liveState.gates.gateA.queue ? "Gate B" : "Gate A";
    if (this.liveState.gates.gateB.queue > 650 || this.liveState.parkingUtilizationPct > 90) {
      this.liveState.overallRisk = "HIGH";
    } else if (this.liveState.gates.gateB.queue > 450 || this.liveState.parkingUtilizationPct > 75) {
      this.liveState.overallRisk = "MODERATE";
    } else {
      this.liveState.overallRisk = "NORMAL";
    }

    this.notify();
  }

  initCvDetections() {
    this.cvDetections = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      // Stagger initial Y positions for natural realistic pedestrian flow
      const startY = 20 + (i * 22) + Math.random() * 15;
      this.cvDetections.push({
        id: i + 101,
        x: 35 + Math.random() * 410,
        y: startY,
        w: 26 + Math.random() * 12,
        h: 52 + Math.random() * 18,
        confidence: 0.88 + Math.random() * 0.11,
        label: "Person",
        // NATURAL HUMAN WALKING PACE: 0.55 to 0.95 px per frame at 60 FPS
        speed: 0.55 + Math.random() * 0.40,
        crossed: startY >= 145,
        crossPulse: 0.0,
        swayOffset: Math.random() * Math.PI * 2
      });
    }
  }

  // 30-Minute AI Trend Projection Calculation
  compute30MinProjection() {
    const live = this.liveState;
    const mods = this.liveModifiers;

    const effectiveArrivalRate = live.arrivalRatePerMin * mods.arrivalRateMultiplier;
    const projectedNewArrivals = Math.round(effectiveArrivalRate * 30);
    const projectedNewExits = Math.round(live.exitRatePerMin * 30);

    const projectedCrowd = live.currentCrowd + projectedNewArrivals - projectedNewExits;

    const gateB_inflow30 = Math.round(projectedNewArrivals * (0.45 * (1 + mods.gateBSurgePct / 100)));
    const gateB_serviceCap30 = Math.round(live.gates.gateB.capacityPerHour * 0.5);
    const gateB_excess = Math.max(0, gateB_inflow30 - gateB_serviceCap30);
    const projectedGateBQueue = Math.min(1500, Math.round(live.gates.gateB.queue + gateB_excess * 0.7));

    const newVehicles30 = Math.round((projectedNewArrivals / 4.0) * (1 + mods.parkingSurgePct / 100));
    const projectedVehicles = live.activeVehicles + newVehicles30;
    const projectedParkingOcc = Math.min(5000, live.parkingOccupied + Math.round(newVehicles30 * 0.85));
    const projectedParkingPct = parseFloat(((projectedParkingOcc / live.parkingCapacity) * 100).toFixed(1));
    const isParkingOverflow = projectedParkingOcc >= live.parkingCapacity;

    let projectedRisk = "NORMAL";
    if (projectedGateBQueue > 750 || projectedParkingPct >= 92 || projectedCrowd > 12500) projectedRisk = "HIGH";
    else if (projectedGateBQueue > 500 || projectedParkingPct >= 80) projectedRisk = "MODERATE";

    return {
      currentCrowd: live.currentCrowd,
      arrivalRatePerMin: Math.round(effectiveArrivalRate),
      trendText: mods.arrivalRateMultiplier > 1.0 
        ? `Surge Applied (+${Math.round((mods.arrivalRateMultiplier - 1) * 100)}%)` 
        : live.trendDirection,
      projectedCrowd,
      crowdDelta: projectedCrowd - live.currentCrowd,
      projectedGateBQueue,
      gateBDelta: projectedGateBQueue - live.gates.gateB.queue,
      projectedParkingPct,
      projectedVehicles,
      isParkingOverflow,
      projectedRisk,
      recommendedAction: projectedGateBQueue > 800
        ? "Deploy 4 auxiliary turnstiles at Gate B immediately & activate Concourse Overflow Zone 2."
        : projectedParkingPct > 90
        ? "Direct inbound vehicles to Overflow Park & Ride lot P7."
        : "Maintain current flow routing; monitor Gate B turnstile throughput."
    };
  }

  renderLiveCvCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 480;
    const h = rect.height || 300;

    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Dark Camera HUD Background
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, w, h);

    // Simulated CCTV camera scanlines & feed background
    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.fillRect(10, 10, w - 20, h - 20);

    // Subtle scanlines
    ctx.fillStyle = "rgba(56, 189, 248, 0.025)";
    for (let y = 10; y < h - 10; y += 4) {
      ctx.fillRect(10, y, w - 20, 2);
    }

    // Camera Info Overlay Header
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 11px JetBrains Mono, monospace";
    ctx.fillText("CAM-04: GATE B & GRAND PLAZA INGRESS", 20, 28);
    ctx.fillStyle = "#10b981";
    ctx.fillText("● REC [LIVE FEED 1080p @ 60FPS]", w - 220, 28);

    // =========================================================================
    // VIRTUAL COUNTING TRIPWIRE LINE (Horizontal Ingress Line at y = 145)
    // =========================================================================
    const tripwireY = 145;

    // Glowing tripwire laser background
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(15, tripwireY);
    ctx.lineTo(w - 15, tripwireY);
    ctx.stroke();

    // Sharp dashed laser line
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(15, tripwireY);
    ctx.lineTo(w - 15, tripwireY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tripwire Laser Label
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 9px JetBrains Mono, monospace";
    ctx.fillText("⚡ OPTICAL INGRESS COUNTING LINE [▼ ENTRY DIRECTION ▼]", 22, tripwireY - 6);

    // =========================================================================
    // UPDATE & RENDER PERSON ENTITIES AT FAST SPEED + GREEN COLOR ON LINE CROSS
    // =========================================================================
    this.cvDetections.forEach(d => {
      // 1. Fast continuous downward movement
      d.y += d.speed;
      d.x += Math.sin(d.y * 0.04 + d.swayOffset) * 0.4; // natural subtle walking drift
      
      // Keep within bounds
      if (d.x < 25) d.x = 25;
      if (d.x > w - d.w - 25) d.x = w - d.w - 25;

      // 2. LINE CROSSING DETECTION: When entity center/bottom crosses tripwireY
      const entityCenterY = d.y + d.h * 0.6;
      if (entityCenterY >= tripwireY && !d.crossed) {
        d.crossed = true;
        d.crossPulse = 1.0; // Trigger green pulse flash
        this.tripwireCounter++;
      }

      // 3. COLOR SELECTION:
      // BEFORE LINE: Neon Cyan (#38bdf8) / Approaching Inbound
      // AFTER LINE: VIBRANT GLOWING GREEN (#10b981 / #22c55e) / Processed & Counted!
      const isGreen = d.crossed;
      const boxColor = isGreen ? "#10b981" : "#38bdf8";
      const tagText = isGreen 
        ? `Person ${(d.confidence * 100).toFixed(0)}% [COUNTED ✓]` 
        : `Person ${(d.confidence * 100).toFixed(0)}%`;

      // Draw Bounding Box
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = isGreen ? 2.2 : 1.5;
      ctx.strokeRect(d.x, d.y, d.w, d.h);

      // Draw Top Label Tag
      ctx.fillStyle = boxColor;
      const tagWidth = isGreen ? d.w + 48 : d.w + 14;
      ctx.fillRect(d.x, d.y - 14, tagWidth, 14);
      ctx.fillStyle = "#020617";
      ctx.font = "bold 8.5px JetBrains Mono, monospace";
      ctx.fillText(tagText, d.x + 3, d.y - 3);

      // Center tracking dot
      ctx.fillStyle = boxColor;
      ctx.beginPath();
      ctx.arc(d.x + d.w / 2, d.y + d.h / 2, isGreen ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Green ripple pulse effect on line cross
      if (d.crossPulse > 0) {
        ctx.strokeStyle = `rgba(16, 185, 129, ${d.crossPulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(d.x + d.w / 2, d.y + d.h / 2, 8 + (1.0 - d.crossPulse) * 16, 0, Math.PI * 2);
        ctx.stroke();
        d.crossPulse -= 0.04;
      }

      // 4. Recycle entity back to top when it exits the camera frame bottom
      if (d.y > h - 45) {
        d.y = 10 + Math.random() * 20;
        d.x = 25 + Math.random() * (w - 75);
        d.speed = 0.55 + Math.random() * 0.40;
        d.confidence = 0.88 + Math.random() * 0.11;
        d.crossed = false;
        d.crossPulse = 0.0;
        d.swayOffset = Math.random() * Math.PI * 2;
      }
    });

    // Bottom Telemetry Bar in Camera View
    ctx.fillStyle = "rgba(3, 7, 18, 0.9)";
    ctx.fillRect(10, h - 38, w - 20, 28);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 10px JetBrains Mono, monospace";
    ctx.fillText(`DETECTED: ${this.cvDetections.length} OBJECTS | OPTICAL COUNT: ${this.tripwireCounter.toLocaleString()} PAX | QUEUE: ${this.liveState.gates.gateB.queue}`, 20, h - 20);
  }

  renderLiveVenueFlowCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 600;
    const h = rect.height || 400;

    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = "#050914";
    ctx.fillRect(0, 0, w, h);

    const scale = Math.min(w / 600, h / 400) * 0.92;
    ctx.save();
    ctx.translate((w - 600 * scale) / 2, (h - 400 * scale) / 2);
    ctx.scale(scale, scale);

    // Grid
    ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 600; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 400); ctx.stroke(); }
    for (let y = 0; y <= 400; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(600, y); ctx.stroke(); }

    const z = this.liveState.zones;

    const getZColor = (lvl) => {
      switch (lvl) {
        case "RED": return "#ef4444";
        case "ORANGE": return "#f97316";
        case "YELLOW": return "#eab308";
        default: return "#10b981";
      }
    };

    const drawZone = (x, y, bw, bh, zObj, title) => {
      const col = getZColor(zObj.densityLevel);
      ctx.fillStyle = `${col}22`;
      ctx.fillRect(x, y, bw, bh);
      ctx.strokeStyle = col;
      ctx.lineWidth = zObj.densityLevel === "RED" ? 2.5 : 1.5;
      ctx.strokeRect(x, y, bw, bh);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText(title, x + 8, y + 18);
      ctx.font = "bold 11px JetBrains Mono, monospace";
      ctx.fillStyle = col;
      ctx.fillText(`${zObj.count.toLocaleString()} pax (${zObj.pct}%)`, x + 8, y + 34);
      ctx.font = "9px Inter, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`Status: ${zObj.status}`, x + 8, y + 48);
    };

    // 1. Gate A Ingress (Top Left)
    drawZone(30, 30, 160, 60, z.gateA_plaza, "🚪 GATE A (NORTH)");

    // 2. Gate B Ingress (Top Right)
    drawZone(410, 30, 160, 60, z.gateB_plaza, "🚪 GATE B (EAST)");

    // 3. West Parking (Bottom Left)
    drawZone(30, 300, 160, 65, z.parking_hub, "🅿️ PARKING HUB");

    // 4. Food Court Promenade (Middle Right)
    drawZone(410, 170, 160, 60, z.food_court, "🍔 FOOD COURT");

    // 5. Central Stadium Arena
    const arenaCol = getZColor(z.stadium_bowl.densityLevel);
    ctx.fillStyle = `${arenaCol}18`;
    ctx.strokeStyle = arenaCol;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(300, 200, 100, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🏟️ ARENA BOWL", 300, 195);
    ctx.font = "bold 11px JetBrains Mono, monospace";
    ctx.fillStyle = arenaCol;
    ctx.fillText(`${z.stadium_bowl.count.toLocaleString()} / ${z.stadium_bowl.capacity.toLocaleString()} (${z.stadium_bowl.pct}%)`, 300, 212);
    ctx.textAlign = "left";

    // 6. Flow arrows (Entering -> Gate -> Venue -> Internal -> Exit)
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(190, 60); ctx.lineTo(230, 150); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(410, 60); ctx.lineTo(370, 150); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(390, 210); ctx.lineTo(410, 200); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(300, 270); ctx.lineTo(300, 360); ctx.stroke();
    ctx.setLineDash([]);

    // Exit Marker at Bottom
    ctx.fillStyle = "rgba(244, 63, 94, 0.25)";
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 1.5;
    ctx.fillRect(230, 345, 140, 35);
    ctx.strokeRect(230, 345, 140, 35);
    ctx.fillStyle = "#f43f5e";
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`📤 MASS EGRESS / EXITS (${this.liveState.totalExits.toLocaleString()})`, 300, 367);
    ctx.textAlign = "left";

    ctx.restore();
  }

  getFullState() {
    const projection = this.compute30MinProjection();
    return {
      mode: this.mode,
      lastUpdatedText: this.lastUpdated.toLocaleTimeString(),
      live: this.liveState,
      modifiers: this.liveModifiers,
      projection
    };
  }
}
