/**
 * WHAT-IF MANUAL SCENARIO SIMULATION ENGINE
 * Multi-parameter deterministic simulator for event managers:
 * - Expected vs What-If Total Crowd (10,000 -> 12,500, etc.)
 * - Progressive Arrival Time Modeling (Start -> Peak -> Event Start)
 * - Gate Distribution (Gate A, B, C) with 100% normalization
 * - Gate Capacities & Congestion / Queue Dynamics
 * - Parking Capacities, Vehicle Inflow %, and Overflow Analysis
 * - Multi-Agent Crowd Flow Visualizer on HTML5 Canvas
 * - Real-time Baseline vs User Scenario Comparison
 */

export class WhatIfManualEngine {
  constructor() {
    this.baseline = {
      expectedCrowd: 10000,
      arrivalStart: "15:00", // 3:00 PM
      peakArrival: "17:30",  // 5:30 PM
      eventStart: "18:00",   // 6:00 PM
      gates: {
        gateA: { name: "Gate A (North Boulevard)", share: 0.30, capacity: 3500 },
        gateB: { name: "Gate B (East Grand Plaza)", share: 0.25, capacity: 3000 },
        gateC: { name: "Gate C (South Metro Link)", share: 0.45, capacity: 4000 }
      },
      parking: {
        capacity: 5000,
        vehicleRatio: 4.0, // 1 car per 4 people
        inflowSurgePct: 0  // +0%
      }
    };

    this.scenario = {
      expectedCrowd: 10000,
      whatIfCrowd: 12500,
      crowdMultiplier: 1.25,
      arrivalStart: "15:00",
      peakArrival: "17:30",
      eventStart: "18:00",
      gates: {
        gateA: { name: "Gate A (North Boulevard)", share: 0.30, capacity: 3500 },
        gateB: { name: "Gate B (East Grand Plaza)", share: 0.25, capacity: 3000 },
        gateC: { name: "Gate C (South Metro Link)", share: 0.45, capacity: 4000 }
      },
      parking: {
        capacity: 5000,
        vehicleRatio: 4.0,
        inflowSurgePct: 20 // +20%
      },
      other: {
        entryRateMultiplier: 1.0,
        exitRateMultiplier: 1.0,
        simDurationHours: 6.0
      }
    };

    this.listeners = new Set();
    this.simRunning = false;
    this.simProgress = 0; // 0 to 1
    this.simSpeed = 1.0;
    this.agents = [];
    this.calculatedResults = null;
    this.lastTimestamp = performance.now();

    // Compute initial calculation
    this.runCalculation();
    this.initVisualAgents();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const data = this.getState();
    this.listeners.forEach(cb => cb(data));
  }

  setMultiplier(mult) {
    this.scenario.crowdMultiplier = mult;
    this.scenario.whatIfCrowd = Math.round(this.scenario.expectedCrowd * mult);
    this.runCalculation();
    this.notify();
  }

  setExpectedCrowd(val) {
    const num = Math.max(100, Math.min(200000, parseInt(val, 10) || 10000));
    this.scenario.expectedCrowd = num;
    this.scenario.whatIfCrowd = Math.round(num * this.scenario.crowdMultiplier);
    this.runCalculation();
    this.notify();
  }

  setWhatIfCrowd(val) {
    const num = Math.max(100, Math.min(200000, parseInt(val, 10) || 12500));
    this.scenario.whatIfCrowd = num;
    this.scenario.crowdMultiplier = parseFloat((num / (this.scenario.expectedCrowd || 1)).toFixed(2));
    this.runCalculation();
    this.notify();
  }

  setGateShare(gateKey, pct) {
    const p = Math.max(0, Math.min(100, parseFloat(pct) || 0));
    if (this.scenario.gates[gateKey]) {
      this.scenario.gates[gateKey].share = p / 100;
    }
    this.runCalculation();
    this.notify();
  }

  normalizeGateShares() {
    const total = Object.values(this.scenario.gates).reduce((acc, g) => acc + g.share, 0);
    if (total > 0) {
      Object.keys(this.scenario.gates).forEach(k => {
        this.scenario.gates[k].share = parseFloat((this.scenario.gates[k].share / total).toFixed(4));
      });
    } else {
      this.scenario.gates.gateA.share = 0.333;
      this.scenario.gates.gateB.share = 0.333;
      this.scenario.gates.gateC.share = 0.334;
    }
    this.runCalculation();
    this.notify();
  }

  setGateCapacity(gateKey, cap) {
    const val = Math.max(500, Math.min(20000, parseInt(cap, 10) || 3000));
    if (this.scenario.gates[gateKey]) {
      this.scenario.gates[gateKey].capacity = val;
    }
    this.runCalculation();
    this.notify();
  }

  setParkingParams(capacity, inflowSurgePct, ratio) {
    if (capacity !== undefined) this.scenario.parking.capacity = Math.max(100, parseInt(capacity, 10) || 5000);
    if (inflowSurgePct !== undefined) this.scenario.parking.inflowSurgePct = parseFloat(inflowSurgePct) || 0;
    if (ratio !== undefined) this.scenario.parking.vehicleRatio = Math.max(1, parseFloat(ratio) || 4);
    this.runCalculation();
    this.notify();
  }

  setArrivalTimes(start, peak, event) {
    if (start) this.scenario.arrivalStart = start;
    if (peak) this.scenario.peakArrival = peak;
    if (event) this.scenario.eventStart = event;
    this.runCalculation();
    this.notify();
  }

  applyPreset(presetKey) {
    switch (presetKey) {
      case "normal":
        this.scenario.expectedCrowd = 10000;
        this.scenario.whatIfCrowd = 10000;
        this.scenario.crowdMultiplier = 1.0;
        this.scenario.arrivalStart = "15:00";
        this.scenario.peakArrival = "17:30";
        this.scenario.eventStart = "18:00";
        this.scenario.gates.gateA.share = 0.30;
        this.scenario.gates.gateB.share = 0.25;
        this.scenario.gates.gateC.share = 0.45;
        this.scenario.gates.gateA.capacity = 3500;
        this.scenario.gates.gateB.capacity = 3000;
        this.scenario.gates.gateC.capacity = 4000;
        this.scenario.parking.capacity = 5000;
        this.scenario.parking.inflowSurgePct = 0;
        this.scenario.parking.vehicleRatio = 4.0;
        break;

      case "high_crowd":
        this.scenario.expectedCrowd = 10000;
        this.scenario.whatIfCrowd = 12500;
        this.scenario.crowdMultiplier = 1.25;
        this.scenario.parking.inflowSurgePct = 20;
        this.scenario.gates.gateA.share = 0.30;
        this.scenario.gates.gateB.share = 0.25;
        this.scenario.gates.gateC.share = 0.45;
        break;

      case "extreme_crowd":
        this.scenario.expectedCrowd = 10000;
        this.scenario.whatIfCrowd = 15000;
        this.scenario.crowdMultiplier = 1.50;
        this.scenario.parking.inflowSurgePct = 40;
        this.scenario.gates.gateA.share = 0.35;
        this.scenario.gates.gateB.share = 0.35;
        this.scenario.gates.gateC.share = 0.30;
        break;

      case "parking_surge":
        this.scenario.expectedCrowd = 10000;
        this.scenario.whatIfCrowd = 11000;
        this.scenario.crowdMultiplier = 1.10;
        this.scenario.parking.capacity = 5000;
        this.scenario.parking.inflowSurgePct = 30;
        this.scenario.parking.vehicleRatio = 3.0; // 1 car per 3 people
        break;

      case "gate_b_surge":
        this.scenario.expectedCrowd = 10000;
        this.scenario.whatIfCrowd = 12500;
        this.scenario.crowdMultiplier = 1.25;
        this.scenario.gates.gateA.share = 0.20;
        this.scenario.gates.gateB.share = 0.50; // +40% surge into B
        this.scenario.gates.gateC.share = 0.30;
        this.scenario.parking.inflowSurgePct = 20;
        break;

      case "early_arrival":
        this.scenario.expectedCrowd = 10000;
        this.scenario.whatIfCrowd = 12000;
        this.scenario.crowdMultiplier = 1.20;
        this.scenario.arrivalStart = "14:00"; // 1 hour earlier
        this.scenario.peakArrival = "16:30";
        this.scenario.eventStart = "18:00";
        this.scenario.parking.inflowSurgePct = 15;
        break;
    }

    this.runCalculation();
    this.notify();
  }

  resetToBaseline() {
    this.scenario = JSON.parse(JSON.stringify(this.baseline));
    this.scenario.whatIfCrowd = 10000;
    this.scenario.crowdMultiplier = 1.0;
    this.runCalculation();
    this.initVisualAgents();
    this.notify();
  }

  runCalculation() {
    // 1. Validate Gate Distribution
    const rawSum = this.scenario.gates.gateA.share + this.scenario.gates.gateB.share + this.scenario.gates.gateC.share;
    const isGateSumValid = Math.abs(rawSum - 1.0) < 0.01;

    // 2. Compute Baseline Metrics
    const baseCrowd = this.baseline.expectedCrowd;
    const baseVehicles = Math.round((baseCrowd / this.baseline.parking.vehicleRatio) * (1 + this.baseline.parking.inflowSurgePct / 100));
    const baseParkingOccPct = Math.min(100, Math.round((baseVehicles / this.baseline.parking.capacity) * 1000) / 10);
    const baseGateA_Pax = Math.round(baseCrowd * this.baseline.gates.gateA.share);
    const baseGateB_Pax = Math.round(baseCrowd * this.baseline.gates.gateB.share);
    const baseGateC_Pax = Math.round(baseCrowd * this.baseline.gates.gateC.share);
    
    // Baseline Queues & Congestion (Peak hour = ~40% of crowd in 1 hour)
    const basePeakHourPax = baseCrowd * 0.40;
    const baseGateA_Queue = Math.max(0, Math.round((basePeakHourPax * this.baseline.gates.gateA.share) - (this.baseline.gates.gateA.capacity * 0.7)));
    const baseGateB_Queue = Math.max(0, Math.round((basePeakHourPax * this.baseline.gates.gateB.share) - (this.baseline.gates.gateB.capacity * 0.7)));
    const baseGateC_Queue = Math.max(0, Math.round((basePeakHourPax * this.baseline.gates.gateC.share) - (this.baseline.gates.gateC.capacity * 0.7)));
    const baseMaxQueue = Math.max(baseGateA_Queue, baseGateB_Queue, baseGateC_Queue, 420);

    // 3. Compute What-If Scenario Metrics
    const scCrowd = this.scenario.whatIfCrowd;
    const crowdDelta = scCrowd - baseCrowd;
    const crowdPctIncrease = parseFloat(((crowdDelta / baseCrowd) * 100).toFixed(1));

    // Gate pax allocation
    const scGateA_Pax = Math.round(scCrowd * this.scenario.gates.gateA.share);
    const scGateB_Pax = Math.round(scCrowd * this.scenario.gates.gateB.share);
    const scGateC_Pax = Math.round(scCrowd * this.scenario.gates.gateC.share);

    // Scenario Queues & Congestion
    // Peak hour arrival compression: shorter window = higher peak arrival factor
    const peakFactor = 0.44; // 44% arrives in the concentrated peak hour
    const scPeakHourPax = scCrowd * peakFactor;

    const scGateA_Inflow = Math.round(scPeakHourPax * this.scenario.gates.gateA.share);
    const scGateB_Inflow = Math.round(scPeakHourPax * this.scenario.gates.gateB.share);
    const scGateC_Inflow = Math.round(scPeakHourPax * this.scenario.gates.gateC.share);

    // Dynamic queue formula: excess arrival over effective hourly throughput
    const calcQueue = (inflow, cap) => {
      const effectiveCap = cap * 0.72; // effective processing efficiency
      const excess = inflow - effectiveCap;
      if (excess <= 0) return Math.round(inflow * 0.08); // nominal queue
      return Math.round(excess * 1.35 + (inflow * 0.1));
    };

    const scGateA_Queue = calcQueue(scGateA_Inflow, this.scenario.gates.gateA.capacity);
    const scGateB_Queue = calcQueue(scGateB_Inflow, this.scenario.gates.gateB.capacity);
    const scGateC_Queue = calcQueue(scGateC_Inflow, this.scenario.gates.gateC.capacity);

    const calcWaitMins = (q, cap) => {
      if (cap <= 0) return 60;
      return Math.max(1.0, Math.round((q / (cap / 60)) * 10) / 10);
    };

    const scGateA_Wait = calcWaitMins(scGateA_Queue, this.scenario.gates.gateA.capacity);
    const scGateB_Wait = calcWaitMins(scGateB_Queue, this.scenario.gates.gateB.capacity);
    const scGateC_Wait = calcWaitMins(scGateC_Queue, this.scenario.gates.gateC.capacity);

    const scMaxQueue = Math.max(scGateA_Queue, scGateB_Queue, scGateC_Queue);
    let criticalGate = "Gate A";
    if (scGateB_Queue >= scGateA_Queue && scGateB_Queue >= scGateC_Queue) criticalGate = "Gate B";
    else if (scGateC_Queue >= scGateA_Queue && scGateC_Queue >= scGateB_Queue) criticalGate = "Gate C";

    // 4. Parking Calculations
    const baseCarCount = Math.round(scCrowd / this.scenario.parking.vehicleRatio);
    const scVehicles = Math.round(baseCarCount * (1 + this.scenario.parking.inflowSurgePct / 100));
    const scParkingCap = this.scenario.parking.capacity;
    const scParkingOccPct = Math.round((scVehicles / scParkingCap) * 1000) / 10;
    const scParkingRemaining = Math.max(0, scParkingCap - scVehicles);
    const scParkingOverflow = Math.max(0, scVehicles - scParkingCap);
    const scParkingUtilization = Math.min(100, scParkingOccPct);

    // 5. Crowd Density & Critical Zones
    // Standard venue area: 8,000 sq meters concourse
    const venueArea = 8000;
    const maxDensity = parseFloat(((scCrowd * 0.45) / venueArea).toFixed(2)); // pax/m²
    let densityLevel = "LOW";
    if (maxDensity >= 5.0 || scParkingOccPct >= 95 || scMaxQueue > 650) densityLevel = "CRITICAL";
    else if (maxDensity >= 3.8 || scParkingOccPct >= 85 || scMaxQueue > 500) densityLevel = "HIGH";
    else if (maxDensity >= 2.5 || scParkingOccPct >= 70) densityLevel = "MODERATE";

    // Critical zones detection
    const criticalZones = [];
    if (scGateA_Queue > 450) criticalZones.push({ name: "Gate A North Plaza", level: "HIGH", pax: scGateA_Queue });
    if (scGateB_Queue > 500) criticalZones.push({ name: "Gate B Grand Concourse", level: "CRITICAL", pax: scGateB_Queue });
    if (scGateC_Queue > 500) criticalZones.push({ name: "Gate C Metro Interchange", level: "HIGH", pax: scGateC_Queue });
    if (scParkingOverflow > 0) criticalZones.push({ name: "Parking Perimeter / Overflow Zone", level: "CRITICAL", pax: scParkingOverflow });
    if (scCrowd > 12000) criticalZones.push({ name: "Central Food & Fan Promenade", level: "HIGH", pax: Math.round(scCrowd * 0.18) });

    // Overall Risk
    let overallRisk = "LOW";
    if (densityLevel === "CRITICAL" || scParkingOverflow > 0 || scMaxQueue >= 650) overallRisk = "CRITICAL";
    else if (densityLevel === "HIGH" || scParkingOccPct >= 85 || scMaxQueue >= 480) overallRisk = "HIGH";
    else if (densityLevel === "MODERATE" || scParkingOccPct >= 70) overallRisk = "MODERATE";

    this.calculatedResults = {
      isGateSumValid,
      baseline: {
        totalCrowd: baseCrowd,
        parkingOccupancyPct: baseParkingOccPct,
        maxQueue: baseMaxQueue,
        densityLevel: "MODERATE",
        overallRisk: "LOW",
        vehicles: baseVehicles,
        criticalGate: "Gate A",
        criticalZonesCount: 0
      },
      scenario: {
        totalCrowd: scCrowd,
        crowdDelta,
        crowdPctIncrease,
        parkingOccupancyPct: scParkingOccPct,
        parkingRemaining: scParkingRemaining,
        parkingOverflow: scParkingOverflow,
        parkingUtilization: scParkingUtilization,
        vehicles: scVehicles,
        maxQueue: scMaxQueue,
        criticalGate,
        maxDensity,
        densityLevel,
        criticalZones,
        criticalZonesCount: criticalZones.length,
        overallRisk,
        gates: {
          gateA: { name: this.scenario.gates.gateA.name, pax: scGateA_Pax, queue: scGateA_Queue, waitMins: scGateA_Wait, sharePct: Math.round(this.scenario.gates.gateA.share * 100), capacity: this.scenario.gates.gateA.capacity, status: scGateA_Queue > 500 ? "CRITICAL" : scGateA_Queue > 350 ? "HIGH" : "NORMAL" },
          gateB: { name: this.scenario.gates.gateB.name, pax: scGateB_Pax, queue: scGateB_Queue, waitMins: scGateB_Wait, sharePct: Math.round(this.scenario.gates.gateB.share * 100), capacity: this.scenario.gates.gateB.capacity, status: scGateB_Queue > 500 ? "CRITICAL" : scGateB_Queue > 350 ? "HIGH" : "NORMAL" },
          gateC: { name: this.scenario.gates.gateC.name, pax: scGateC_Pax, queue: scGateC_Queue, waitMins: scGateC_Wait, sharePct: Math.round(this.scenario.gates.gateC.share * 100), capacity: this.scenario.gates.gateC.capacity, status: scGateC_Queue > 500 ? "CRITICAL" : scGateC_Queue > 350 ? "HIGH" : "NORMAL" }
        }
      }
    };

    return this.calculatedResults;
  }

  initVisualAgents() {
    this.agents = [];
    const entityCount = Math.min(220, Math.round(35 + (this.scenario.whatIfCrowd / 12500) * 110));

    for (let i = 0; i < entityCount; i++) {
      // Pick random entry gate (A, B, or C) weighted by share
      const r = Math.random();
      let gateKey = "gateA";
      if (r > this.scenario.gates.gateA.share + this.scenario.gates.gateB.share) gateKey = "gateC";
      else if (r > this.scenario.gates.gateA.share) gateKey = "gateB";

      let startX = 140, startY = 80;
      if (gateKey === "gateB") { startX = 660; startY = 240; }
      else if (gateKey === "gateC") { startX = 400; startY = 560; }

      this.agents.push({
        id: i,
        gate: gateKey,
        x: startX + (Math.random() - 0.5) * 60,
        y: startY + (Math.random() - 0.5) * 60,
        targetX: 400 + (Math.random() - 0.5) * 220,
        targetY: 300 + (Math.random() - 0.5) * 180,
        speed: 0.8 + Math.random() * 1.2,
        progress: Math.random(),
        color: gateKey === "gateB" && this.scenario.gates.gateB.share >= 0.4 ? "#ef4444" : "#38bdf8",
        size: 2.5 + Math.random() * 2
      });
    }
  }

  startSimulation() {
    this.runCalculation();
    this.initVisualAgents();
    this.simRunning = true;
    this.simProgress = 0;
    this.lastTimestamp = performance.now();
    this.notify();
  }

  stopSimulation() {
    this.simRunning = false;
    this.notify();
  }

  renderCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 800;
    const h = rect.height || 500;

    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = "#050914";
    ctx.fillRect(0, 0, w, h);

    // Auto-fit coordinates [0, 0, 800, 600] to canvas
    const scale = Math.min(w / 800, h / 600) * 0.95;
    ctx.save();
    ctx.translate((w - 800 * scale) / 2, (h - 600 * scale) / 2);
    ctx.scale(scale, scale);

    // 1. Grid lines
    ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 800; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
    }
    for (let y = 0; y <= 600; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
    }

    const res = this.calculatedResults || this.runCalculation();

    // 2. Parking Zone (Top Left)
    const parkOcc = res.scenario.parkingOccupancyPct;
    const parkCol = parkOcc >= 90 ? "#ef4444" : parkOcc >= 75 ? "#f59e0b" : "#10b981";
    ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
    ctx.strokeStyle = parkCol;
    ctx.lineWidth = 2;
    ctx.fillRect(40, 30, 180, 110);
    ctx.strokeRect(40, 30, 180, 110);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("🅿️ MAIN PARKING HUB", 52, 54);
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.fillStyle = parkCol;
    ctx.fillText(`Occupancy: ${parkOcc}%`, 52, 74);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Inter, sans-serif";
    ctx.fillText(`Vehicles: ${res.scenario.vehicles.toLocaleString()} / ${this.scenario.parking.capacity.toLocaleString()}`, 52, 92);
    if (res.scenario.parkingOverflow > 0) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.fillText(`⚠️ OVERFLOW: +${res.scenario.parkingOverflow.toLocaleString()}`, 52, 110);
    } else {
      ctx.fillStyle = "#10b981";
      ctx.fillText(`Slots Remaining: ${res.scenario.parkingRemaining.toLocaleString()}`, 52, 110);
    }

    // 3. Gates A, B, C Zones & Queues
    const drawGate = (gx, gy, gKey, label) => {
      const gInfo = res.scenario.gates[gKey];
      const isCrit = gInfo.status === "CRITICAL";
      const isHigh = gInfo.status === "HIGH";
      const gColor = isCrit ? "#ef4444" : isHigh ? "#f97316" : "#10b981";

      // Gate outer glow
      ctx.fillStyle = isCrit ? "rgba(239, 68, 68, 0.15)" : "rgba(56, 189, 248, 0.1)";
      ctx.beginPath();
      ctx.arc(gx, gy, 45, 0, Math.PI * 2);
      ctx.fill();

      // Gate border
      ctx.strokeStyle = gColor;
      ctx.lineWidth = isCrit ? 3 : 1.5;
      ctx.stroke();

      // Gate label & queue
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, gx, gy - 12);
      ctx.font = "bold 12px JetBrains Mono, monospace";
      ctx.fillStyle = gColor;
      ctx.fillText(`Queue: ${gInfo.queue}`, gx, gy + 4);
      ctx.font = "9.5px Inter, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`${gInfo.pax.toLocaleString()} pax (${gInfo.sharePct}%)`, gx, gy + 18);
      ctx.fillText(`Wait: ~${gInfo.waitMins} min`, gx, gy + 30);
    };

    drawGate(150, 220, "gateA", "🚪 GATE A");
    drawGate(650, 220, "gateB", "🚪 GATE B");
    drawGate(400, 500, "gateC", "🚪 GATE C");

    // 4. Central Stadium Arena
    ctx.textAlign = "left";
    const arenaCrit = res.scenario.overallRisk === "CRITICAL";
    ctx.fillStyle = "rgba(10, 20, 40, 0.9)";
    ctx.strokeStyle = arenaCrit ? "#ef4444" : "rgba(56, 189, 248, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(400, 300, 160, 110, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Stadium Inner Field
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(400, 300, 85, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🏟️ MAIN EVENT ARENA", 400, 295);
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`WHAT-IF CROWD: ${res.scenario.totalCrowd.toLocaleString()}`, 400, 315);
    ctx.font = "10px Inter, sans-serif";
    ctx.fillStyle = arenaCrit ? "#ef4444" : "#10b981";
    ctx.fillText(`Risk Level: ${res.scenario.overallRisk} | Density: ${res.scenario.maxDensity} p/m²`, 400, 332);

    // 5. Flow pathways & Moving Particles
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    // Gate A to Arena
    ctx.beginPath(); ctx.moveTo(150, 220); ctx.quadraticCurveTo(260, 240, 320, 280); ctx.stroke();
    // Gate B to Arena
    ctx.beginPath(); ctx.moveTo(650, 220); ctx.quadraticCurveTo(540, 240, 480, 280); ctx.stroke();
    // Gate C to Arena
    ctx.beginPath(); ctx.moveTo(400, 500); ctx.quadraticCurveTo(400, 420, 400, 360); ctx.stroke();
    ctx.setLineDash([]);

    // Update & Draw Agents with smooth natural walking pace & green color when crossing gate boundary
    this.agents.forEach(ag => {
      ag.progress += (0.0035 * ag.speed * (this.simRunning ? 1.5 : 1.0));
      if (ag.progress > 1) ag.progress = 0;

      let gx = 150, gy = 220;
      if (ag.gate === "gateB") { gx = 650; gy = 220; }
      else if (ag.gate === "gateC") { gx = 400; gy = 500; }

      const curX = gx + (ag.targetX - gx) * ag.progress;
      const curY = gy + (ag.targetY - gy) * ag.progress;

      // Color changes to VIBRANT GREEN once agent crosses into venue (progress >= 0.45)
      const isPastGate = ag.progress >= 0.45;
      const agentColor = isPastGate ? "#10b981" : (ag.gate === "gateB" && this.scenario.gates.gateB.share >= 0.4 ? "#ef4444" : "#38bdf8");

      ctx.fillStyle = agentColor;
      ctx.beginPath();
      ctx.arc(curX, curY, isPastGate ? ag.size + 0.5 : ag.size, 0, Math.PI * 2);
      ctx.fill();

      // Subtle glow for entered attendees
      if (isPastGate) {
        ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
        ctx.beginPath();
        ctx.arc(curX, curY, ag.size + 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  getState() {
    if (!this.calculatedResults) this.runCalculation();
    return {
      scenario: this.scenario,
      baseline: this.baseline,
      results: this.calculatedResults,
      simRunning: this.simRunning
    };
  }
}
