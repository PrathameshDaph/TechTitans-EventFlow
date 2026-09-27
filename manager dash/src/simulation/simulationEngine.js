/**
 * LIVE SIMULATION OF WHAT-IF — MEGA EVENT 125,000 ATTENDEES SIMULATOR
 * Scenario: 100,000 Expected vs 125,000 Actual Attendees (+25,000 Surge Overflow)
 * 8 Stadium Blocks (12,500 each = 100k capacity)
 * 4 Concourse Zones (Holding the 25k overflow)
 * 8 Perimeter Gates (A1–D2) & 8 Parking Sectors (P1–P8, 16k capacity)
 */

export class SimulationEngine {
  constructor(customConfig = {}) {
    this.config = {
      expectedCrowd: 100000,
      actualCrowd: 125000,
      stadiumCapacity: 100000,
      parkingTotalCapacity: 16000,
      startSimMinute: 15 * 60, // 3:00 PM (900 min)
      endSimMinute: 25.5 * 60, // 1:30 AM (1530 min)
      baseArrivalRate: 1.0,
      baseExitRate: 1.0,
      scenario: "surge_125k", // "surge_125k" vs "nominal_100k"
      ...customConfig
    };

    this.listeners = new Set();
    this.history = [];
    this.reset();
  }

  setScenario(scenarioKey) {
    this.config.scenario = scenarioKey;
    if (scenarioKey === "nominal_100k") {
      this.config.actualCrowd = 100000;
    } else {
      this.config.actualCrowd = 125000;
    }
    this.reset();
    this.start();
  }

  reset() {
    this.simMinute = this.config.startSimMinute;
    this.speed = 2;
    this.isRunning = true; // AUTO-START IMMEDIATELY ON LOAD!
    this.isPaused = false;
    this.lastTickTimestamp = performance.now();
    this.history = [];

    // Global Metrics
    this.totalPeople = 1200;
    this.totalEntries = 850;
    this.totalExits = 60;
    this.currentOccupancy = 800;
    this.parkingOccupancyPct = 8.5;
    this.totalVehicles = 1360;
    this.activeVehiclesCount = 140;
    this.activeGatesCount = 8;
    this.globalCrowdDensity = "LOW";
    this.criticalZonesCount = 0;
    this.isPeakArrival = false;
    this.isPeakExit = false;
    this.overflowCount = 0; // People outside stadium when 100k cap is reached

    // 1. 8 STADIUM SEATING BLOCKS (8 x 12,500 = 100,000 Capacity)
    this.blocks = {
      "b-101": { id: "b-101", name: "Block 101 (North Upper)", capacity: 12500, current: 100, pct: 0.8, status: "LOW", angle: -Math.PI * 0.4 },
      "b-102": { id: "b-102", name: "Block 102 (North Lower)", capacity: 12500, current: 110, pct: 0.9, status: "LOW", angle: -Math.PI * 0.25 },
      "b-103": { id: "b-103", name: "Block 103 (East Pavilion)", capacity: 12500, current: 120, pct: 1.0, status: "LOW", angle: 0 },
      "b-104": { id: "b-104", name: "Block 104 (East Concourse)", capacity: 12500, current: 105, pct: 0.8, status: "LOW", angle: Math.PI * 0.25 },
      "b-105": { id: "b-105", name: "Block 105 (South Upper)", capacity: 12500, current: 95, pct: 0.8, status: "LOW", angle: Math.PI * 0.4 },
      "b-106": { id: "b-106", name: "Block 106 (South Lower)", capacity: 12500, current: 90, pct: 0.7, status: "LOW", angle: Math.PI * 0.75 },
      "b-107": { id: "b-107", name: "Block 107 (West Suites)", capacity: 12500, current: 100, pct: 0.8, status: "LOW", angle: Math.PI },
      "b-108": { id: "b-108", name: "Block 108 (West Club Deck)", capacity: 12500, current: 80, pct: 0.6, status: "LOW", angle: -Math.PI * 0.75 }
    };

    // 2. 4 CONCOURSE & SURROUNDING CROWD ZONES
    this.zones = {
      "zone-1": { id: "zone-1", name: "Zone 1: North Fan Village & Plaza", currentCount: 420, capacity: 18000, density: 2.3, status: "LOW", color: "#10b981", cx: 400, cy: 150 },
      "zone-2": { id: "zone-2", name: "Zone 2: East Concourse & Food Promenade", currentCount: 460, capacity: 20000, density: 2.3, status: "LOW", color: "#10b981", cx: 640, cy: 360 },
      "zone-3": { id: "zone-3", name: "Zone 3: South Gate Boulevard", currentCount: 380, capacity: 18000, density: 2.1, status: "LOW", color: "#10b981", cx: 400, cy: 570 },
      "zone-4": { id: "zone-4", name: "Zone 4: West Transit & Metro Interchange", currentCount: 520, capacity: 24000, density: 2.2, status: "LOW", color: "#10b981", cx: 160, cy: 360 }
    };

    // 3. 8 ENTRY / EXIT GATES (Perimeter Gates A1–D2)
    this.gates = {
      "gate-a1": { id: "gate-a1", name: "Gate A1 (NW Turnstiles)", queue: 15, entered: 110, capacity: 850, serviceRate: 60, utilization: 8, status: "LOW", density: 8, x: 270, y: 220 },
      "gate-a2": { id: "gate-a2", name: "Gate A2 (NE Express)", queue: 24, entered: 180, capacity: 950, serviceRate: 70, utilization: 12, status: "LOW", density: 10, x: 530, y: 220 },
      "gate-b1": { id: "gate-b1", name: "Gate B1 (East Grand Plaza)", queue: 28, entered: 210, capacity: 900, serviceRate: 65, utilization: 14, status: "LOW", density: 12, x: 590, y: 320 },
      "gate-b2": { id: "gate-b2", name: "Gate B2 (East VIP & Media)", queue: 10, entered: 85, capacity: 600, serviceRate: 45, utilization: 6, status: "LOW", density: 5, x: 590, y: 400 },
      "gate-c1": { id: "gate-c1", name: "Gate C1 (South Boulevard)", queue: 20, entered: 150, capacity: 850, serviceRate: 60, utilization: 10, status: "LOW", density: 9, x: 530, y: 500 },
      "gate-c2": { id: "gate-c2", name: "Gate C2 (South Concourse)", queue: 14, entered: 105, capacity: 800, serviceRate: 55, utilization: 7, status: "LOW", density: 7, x: 270, y: 500 },
      "gate-d1": { id: "gate-d1", name: "Gate D1 (West Metro Link)", queue: 30, entered: 230, capacity: 950, serviceRate: 70, utilization: 15, status: "LOW", density: 13, x: 210, y: 400 },
      "gate-d2": { id: "gate-d2", name: "Gate D2 (West Transit Hub)", queue: 18, entered: 140, capacity: 850, serviceRate: 60, utilization: 9, status: "LOW", density: 8, x: 210, y: 320 }
    };

    // 4. 8 PARKING SECTORS (Total = 16,000 Capacity)
    this.parkingSections = {
      "p1": { id: "p1", name: "P1 (North-West General)", capacity: 2000, occupied: 170, enteringRate: 12, leavingRate: 0, queue: 0, utilization: 8.5, status: "Normal", x: 80, y: 70, w: 120, h: 70 },
      "p2": { id: "p2", name: "P2 (North-East Surface)", capacity: 2000, occupied: 180, enteringRate: 14, leavingRate: 0, queue: 0, utilization: 9.0, status: "Normal", x: 600, y: 70, w: 120, h: 70 },
      "p3": { id: "p3", name: "P3 (East Multi-Tier Deck)", capacity: 2500, occupied: 220, enteringRate: 16, leavingRate: 0, queue: 0, utilization: 8.8, status: "Normal", x: 650, y: 220, w: 110, h: 75 },
      "p4": { id: "p4", name: "P4 (East VIP & Hospitality)", capacity: 1500, occupied: 130, enteringRate: 9, leavingRate: 0, queue: 0, utilization: 8.6, status: "Normal", x: 650, y: 430, w: 110, h: 75 },
      "p5": { id: "p5", name: "P5 (South Boulevard Lot)", capacity: 2000, occupied: 160, enteringRate: 12, leavingRate: 0, queue: 0, utilization: 8.0, status: "Normal", x: 600, y: 580, w: 120, h: 70 },
      "p6": { id: "p6", name: "P6 (South Express Lot)", capacity: 2000, occupied: 150, enteringRate: 11, leavingRate: 0, queue: 0, utilization: 7.5, status: "Normal", x: 80, y: 580, w: 120, h: 70 },
      "p7": { id: "p7", name: "P7 (West Metro Park & Ride)", capacity: 2500, occupied: 210, enteringRate: 18, leavingRate: 0, queue: 0, utilization: 8.4, status: "Normal", x: 40, y: 220, w: 110, h: 75 },
      "p8": { id: "p8", name: "P8 (West Bus & Shuttle Hub)", capacity: 1500, occupied: 140, enteringRate: 8, leavingRate: 0, queue: 0, utilization: 9.3, status: "Normal", x: 40, y: 430, w: 110, h: 75 }
    };

    this.initMicroAgents();
    this.recordHistoryPoint();
    this.emitUpdate();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emitUpdate() {
    const state = this.getState();
    this.listeners.forEach(cb => cb(state));
  }

  setSpeed(newSpeed) {
    this.speed = Math.max(1, Math.min(60, newSpeed));
    if (this.isPaused) {
      this.resume();
    }
    this.emitUpdate();
  }

  start() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = true;
    this.isPaused = false;
    this.lastTickTimestamp = performance.now();
    this.loop();
    this.emitUpdate();
  }

  pause() {
    this.isPaused = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.emitUpdate();
  }

  destroy() {
    this.pause();
    this.isRunning = false;
    this.listeners.clear();
  }

  resume() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = true;
    this.isPaused = false;
    this.lastTickTimestamp = performance.now();
    this.loop();
    this.emitUpdate();
  }

  togglePlay() {
    if (!this.isRunning || this.isPaused) this.resume();
    else this.pause();
  }

  jumpToTime(targetMinutes) {
    this.simMinute = Math.max(this.config.startSimMinute, Math.min(this.config.endSimMinute, targetMinutes));
    this.recalculateStateFromTime(this.simMinute);
    this.emitUpdate();
  }

  loop() {
    if (!this.isRunning || this.isPaused) return;

    const now = performance.now();
    const deltaMs = Math.min(200, now - (this.lastTickTimestamp || now));
    this.lastTickTimestamp = now;

    // 1 real second = 1 sim minute at 1x speed
    const advanceMinutes = (deltaMs / 1000) * (this.speed / 1.0);
    this.advanceSimulation(advanceMinutes);

    if (this.simMinute < this.config.endSimMinute) {
      this.rafId = requestAnimationFrame(() => this.loop());
    } else {
      this.isRunning = false;
      this.isPaused = false;
      this.emitUpdate();
    }
  }

  advanceSimulation(simMinutesDelta) {
    const prevMinute = this.simMinute;
    this.simMinute += simMinutesDelta;

    this.evaluateMacroModel(simMinutesDelta);
    this.updateMicroAgents(simMinutesDelta);

    if (Math.floor(this.simMinute / 1.5) !== Math.floor(prevMinute / 1.5)) {
      this.recordHistoryPoint();
    }

    this.emitUpdate();
  }

  /**
   * 125,000 ACTUAL ATTENDEES (vs 100,000 Expected) Flux Curves
   */
  getInstantaneousRates(simMin) {
    let arrivalFlux = 0; // people / min
    let exitFlux = 0;
    const isSurge = (this.config.scenario === "surge_125k");
    const surgeMult = isSurge ? 1.28 : 1.0;

    // 1. ARRIVAL SURGE (3:00 PM to 5:15 PM)
    if (simMin >= 900 && simMin <= 1040) {
      const t = simMin;
      const mean = 985; // 4:25 PM peak
      const sigma = 30;
      const gaussianPeak = Math.exp(-Math.pow(t - mean, 2) / (2 * sigma * sigma));
      const earlyRush = Math.exp(-Math.pow(t - 955, 2) / (2 * 25 * 25)) * 0.7;

      // In 125k surge scenario, inflow peaks at ~3,400 people/min!
      arrivalFlux = (gaussianPeak * 3100 + earlyRush * 1600) * surgeMult * this.config.baseArrivalRate;
      arrivalFlux = Math.max(140, arrivalFlux);
    } else if (simMin < 900) {
      arrivalFlux = 80;
    } else {
      // Late arrivals / overflow concourse crowd
      arrivalFlux = Math.max(20, 150 * Math.exp(-(simMin - 1040) / 45));
    }

    // 2. MIDNIGHT EXIT SURGE (11:00 PM to 1:30 AM)
    if (simMin >= 1370 && simMin <= 1530) {
      const t = simMin;
      const mean = 1445; // 12:05 AM peak egress
      const sigma = 24;
      const mainSurge = Math.exp(-Math.pow(t - mean, 2) / (2 * sigma * sigma));
      const earlySurge = Math.exp(-Math.pow(t - 1410, 2) / (2 * 25 * 25)) * 0.45;

      // In 125k surge scenario, egress peaks at ~4,200 people/min!
      exitFlux = (mainSurge * 3900 + earlySurge * 1700) * surgeMult * this.config.baseExitRate;
      exitFlux = Math.max(30, exitFlux);
    } else if (simMin >= 1040 && simMin < 1370) {
      // Concession / Halftime movement
      exitFlux = 45 + Math.sin(simMin / 15) * 20;
    } else {
      exitFlux = 8;
    }

    return { arrivalFlux, exitFlux };
  }

  evaluateMacroModel(dt) {
    const { arrivalFlux, exitFlux } = this.getInstantaneousRates(this.simMinute);

    this.isPeakArrival = (arrivalFlux > 2100) && (this.simMinute >= 945 && this.simMinute <= 1015);
    this.isPeakExit = (exitFlux > 2200) && (this.simMinute >= 1415 && this.simMinute <= 1475);

    const incoming = arrivalFlux * dt;
    const leaving = exitFlux * dt;

    // Total people in ecosystem (reaches 125,000 in surge scenario)
    const isSurge = (this.config.scenario === "surge_125k");
    const targetCap = this.config.stadiumCapacity; // 100,000

    // Seating occupancy in stadium bowl (max 100,000)
    if (this.currentOccupancy + incoming - leaving <= targetCap) {
      this.totalEntries += incoming;
      this.totalExits += leaving;
      this.currentOccupancy = Math.max(0, Math.min(targetCap, this.currentOccupancy + incoming - leaving));
      this.overflowCount = 0;
    } else {
      const allowedIn = Math.max(0, targetCap - this.currentOccupancy);
      this.totalEntries += allowedIn;
      this.totalExits += leaving;
      this.currentOccupancy = targetCap;
      
      // Excess people accumulated in outer concourse zones (the +25k overflow!)
      if (isSurge && this.simMinute >= 980 && this.simMinute <= 1380) {
        this.overflowCount = Math.min(25000, Math.round((this.simMinute - 980) * 125 + 5000));
      }
    }

    // Total active people in the digital twin
    const extBase = (arrivalFlux * 4.5) + (exitFlux * 6.8) + this.overflowCount;
    this.totalPeople = Math.round(this.currentOccupancy + extBase);

    // Update 8 Seating Blocks (12,500 each)
    const blockKeys = Object.keys(this.blocks);
    const occRatio = this.currentOccupancy / targetCap;

    blockKeys.forEach((bk, i) => {
      const blk = this.blocks[bk];
      const factor = 0.94 + (i % 3) * 0.06;
      blk.current = Math.min(blk.capacity, Math.round(blk.capacity * occRatio * factor));
      blk.pct = parseFloat(((blk.current / blk.capacity) * 100).toFixed(1));

      if (blk.pct >= 95) blk.status = "CRITICAL";
      else if (blk.pct >= 80) blk.status = "HIGH";
      else if (blk.pct >= 40) blk.status = "MODERATE";
      else blk.status = "LOW";
    });

    // 8 Gates Evaluation & Extreme Queue Loading
    let totalQueueSum = 0;
    const gateKeys = Object.keys(this.gates);

    gateKeys.forEach((gk) => {
      const g = this.gates[gk];
      let gateShare = 0.125;
      if (gk === "gate-a2" || gk === "gate-b1") gateShare = 0.18;
      if (gk === "gate-d1") gateShare = 0.16;
      if (gk === "gate-b2") gateShare = 0.08;

      // Automatic emergency diversion when Gate A2 queue > 400
      if (this.gates["gate-a2"].queue > 400) {
        if (gk === "gate-a2") gateShare *= 0.55;
        if (gk === "gate-a1" || gk === "gate-c2") gateShare *= 1.45;
      }
      if (this.gates["gate-b1"].queue > 450) {
        if (gk === "gate-b1") gateShare *= 0.55;
        if (gk === "gate-c1") gateShare *= 1.45;
      }

      const isExit = this.simMinute >= 1370;
      const gIn = !isExit ? (incoming * gateShare) : (leaving * 0.04);
      const gOut = isExit ? (leaving * gateShare) : (incoming * 0.85);

      if (!isExit) {
        g.queue = Math.max(10, g.queue + (gIn - g.serviceRate * (dt * 1.1)));
        g.entered += gIn;
      } else {
        g.queue = Math.max(10, g.queue + (gOut - g.serviceRate * (dt * 1.25)));
      }

      g.queue = Math.min(980, g.queue);
      g.utilization = Math.min(100, Math.round((g.queue / g.capacity) * 100));
      g.density = Math.min(100, Math.round((g.queue / (g.capacity * 0.7)) * 100));

      if (g.utilization >= 85 || g.queue >= 450) g.status = "CRITICAL";
      else if (g.utilization >= 65 || g.queue >= 250) g.status = "HIGH";
      else if (g.utilization >= 35 || g.queue >= 90) g.status = "MODERATE";
      else g.status = "LOW";

      totalQueueSum += g.queue;
    });

    // 8 Parking Sectors (Total 16,000 Capacity)
    const vInFlux = arrivalFlux * 0.20; // 1 vehicle per 5 attendees
    const vOutFlux = exitFlux * 0.22;
    let totalOccVehicles = 0;
    const parkKeys = Object.keys(this.parkingSections);

    parkKeys.forEach((pk, idx) => {
      const p = this.parkingSections[pk];
      const weight = (idx === 0 || idx === 1) ? 0.16 : (idx === 2 || idx === 6) ? 0.18 : 0.10;
      const vIn = vInFlux * weight * dt;
      const vOut = vOutFlux * weight * dt;

      p.occupied = Math.max(100, Math.min(p.capacity, p.occupied + vIn - vOut));
      p.enteringRate = Math.round(vIn * 60);
      p.leavingRate = Math.round(vOut * 60);
      p.utilization = parseFloat(((p.occupied / p.capacity) * 100).toFixed(1));

      if (this.simMinute >= 1380) {
        p.queue = Math.min(420, Math.round((vOut * 3.5) + (p.occupied > p.capacity * 0.7 ? 60 : 15)));
      } else {
        p.queue = Math.min(220, Math.round(vIn * 1.8));
      }

      if (p.utilization >= 94) p.status = "Full";
      else if (p.utilization >= 80) p.status = "Nearly Full";
      else if (p.utilization >= 45) p.status = "Filling";
      else p.status = "Normal";

      totalOccVehicles += p.occupied;
    });

    this.parkingOccupancyPct = parseFloat(((totalOccVehicles / this.config.parkingTotalCapacity) * 100).toFixed(1));
    this.totalVehicles = Math.round(totalOccVehicles);
    this.activeVehiclesCount = Math.round(totalOccVehicles * 0.08 + (vInFlux + vOutFlux) * 1.5);

    // 4 Concourse Zones (Absorbs 25k overflow!)
    this.criticalZonesCount = 0;
    const isExitPhase = this.simMinute >= 1370;

    Object.keys(this.zones).forEach((zk) => {
      const z = this.zones[zk];
      let share = 0.25;
      if (zk === "zone-1") share = !isExitPhase ? 0.34 : 0.18;
      if (zk === "zone-2") share = 0.28;
      if (zk === "zone-3") share = isExitPhase ? 0.34 : 0.18;
      if (zk === "zone-4") share = 0.28;

      const activeFlow = isExitPhase ? leaving : incoming;
      // In surge scenario, zones absorb the +25k overflow crowd outside gates!
      const zoneOverflow = this.overflowCount * share;
      z.currentCount = Math.round(z.capacity * 0.08 + activeFlow * share * 4.5 + zoneOverflow + (totalQueueSum / 4));
      z.currentCount = Math.min(z.capacity, Math.max(120, z.currentCount));
      z.density = parseFloat(((z.currentCount / z.capacity) * 100).toFixed(1));

      if (z.density >= 85) {
        z.status = "CRITICAL";
        z.color = "#ef4444";
        this.criticalZonesCount++;
      } else if (z.density >= 65) {
        z.status = "HIGH";
        z.color = "#f97316";
      } else if (z.density >= 35) {
        z.status = "MODERATE";
        z.color = "#eab308";
      } else {
        z.status = "LOW";
        z.color = "#10b981";
      }
    });

    // Global Safety Level
    if (this.criticalZonesCount >= 2 || totalQueueSum > 1600 || this.isPeakArrival || this.isPeakExit || this.overflowCount > 10000) {
      this.globalCrowdDensity = "CRITICAL";
    } else if (this.criticalZonesCount === 1 || totalQueueSum > 900 || this.parkingOccupancyPct > 85) {
      this.globalCrowdDensity = "HIGH";
    } else if (this.totalPeople > 25000 || totalQueueSum > 400) {
      this.globalCrowdDensity = "MODERATE";
    } else {
      this.globalCrowdDensity = "LOW";
    }
  }

  initMicroAgents() {
    this.agents = [];
    this.vehicles = [];

    const gateKeys = Object.keys(this.gates);
    const parkKeys = Object.keys(this.parkingSections);
    const blockKeys = Object.keys(this.blocks);

    // 1. 350 Pedestrian Agents (Spectators entering, seating in blocks, or overflow in concourses)
    for (let i = 0; i < 350; i++) {
      const isOverflow = (i >= 260); // 90 overflow agents stay in concourse zones
      const assignedBlkKey = blockKeys[i % blockKeys.length];
      const assignedGateKey = gateKeys[i % gateKeys.length];
      const assignedParkKey = parkKeys[i % parkKeys.length];

      this.agents.push({
        id: `agent-${i}`,
        assignedGate: assignedGateKey,
        assignedParking: assignedParkKey,
        assignedBlock: assignedBlkKey,
        isOverflow: isOverflow,
        overflowZone: `zone-${(i % 4) + 1}`,
        seatRadius: 118 + Math.random() * 32, // Strictly 118..150 px from center (within seating block ring)
        seatAngleOffset: (Math.random() - 0.5) * 0.45,
        speed: 0.85 + Math.random() * 0.7,
        offsetAngle: Math.random() * Math.PI * 2,
        progress: Math.random(),
        x: 400,
        y: 360,
        color: "#38bdf8"
      });
    }

    // 2. ACTIVE VEHICLES SIMULATION (Stationary Parked + Continuous Circulating Traffic in P1–P8 + Highway Cruisers)
    this.vehicles = [];
    let vehId = 0;

    // A. 32 Active Circulating Parking Vehicles (4 per lot continuously entering, navigating aisles, and exiting)
    parkKeys.forEach((pk, pIdx) => {
      const p = this.parkingSections[pk];
      const isTop = p.y < 150;
      const isBottom = p.y > 500;
      const isEast = p.x > 500;
      const isWest = p.x < 200;

      for (let v = 0; v < 4; v++) {
        const aisleY = p.y + 20 + (v % 3) * 16;
        const entryX = isEast ? p.x + p.w + 10 : isWest ? p.x - 10 : p.x + p.w / 2;
        const entryY = isTop ? 45 : isBottom ? 675 : p.y + p.h / 2;

        this.vehicles.push({
          id: `circ-${pk}-${v}`,
          assignedParking: pk,
          isCirculatingInLot: true,
          lot: p,
          phase: v * 0.25, // Staggered cycle
          speed: 0.00065 + Math.random() * 0.00035,
          progress: (v * 0.25) % 1.0,
          type: (v === 0) ? "bus" : "car",
          color: (v === 0) ? "#38bdf8" : (v === 1) ? "#facc15" : (v === 2) ? "#f8fafc" : "#34d399",
          isParked: false,
          heading: 0,
          x: p.x + 20,
          y: aisleY
        });
      }
    });

    // B. 24 Highway & Perimeter Arterial Cruisers
    for (let i = 0; i < 24; i++) {
      this.vehicles.push({
        id: `cruiser-${i}`,
        isCruiser: true,
        roadIndex: i % 4,
        speed: 0.00035 + Math.random() * 0.00020,
        progress: (i / 24),
        type: (i % 4 === 0) ? "bus" : "car",
        color: (i % 3 === 0) ? "#38bdf8" : (i % 2 === 0) ? "#f8fafc" : "#facc15",
        heading: 0,
        x: 400,
        y: 45
      });
    }
  }

  updateMicroAgents(dt) {
    const isExit = this.simMinute >= 1370;
    const isRush = this.isPeakArrival || this.isPeakExit;
    const mult = isRush ? 1.2 : 1.0;
    const timeFactor = 0.35 + Math.min(0.45, dt * 0.4);

    // 1. UPDATE PEDESTRIAN AGENTS
    this.agents.forEach(agent => {
      agent.progress += 0.0014 * agent.speed * mult * timeFactor;
      if (agent.progress > 1.0) {
        agent.progress = 0;
      }

      const gate = this.gates[agent.assignedGate] || this.gates["gate-a1"];
      const park = this.parkingSections[agent.assignedParking] || this.parkingSections["p1"];
      const pX = park.x + park.w / 2;
      const pY = park.y + park.h / 2;

      // Handle Overflow Spectators (Stay in Concourse Zones 1–4 outside the stadium shell)
      if (agent.isOverflow) {
        const zone = this.zones[agent.overflowZone] || this.zones["zone-1"];
        const zAngle = agent.offsetAngle + agent.progress * Math.PI * 2;
        const zDist = 20 + Math.sin(agent.progress * 6) * 35;
        agent.x = zone.cx + Math.cos(zAngle) * (zDist * 1.5);
        agent.y = zone.cy + Math.sin(zAngle) * zDist;
        agent.color = (this.overflowCount > 0) ? "#f97316" : "#38bdf8";
        return;
      }

      // Normal Ticket-holders: Path from parking -> Gate -> Seating Block Ring
      const blk = this.blocks[agent.assignedBlock] || this.blocks["b-101"];
      const blockAngle = blk.angle;
      const seatAngle = blockAngle + agent.seatAngleOffset;
      const seatRadius = agent.seatRadius;

      const seatX = 400 + Math.cos(seatAngle) * seatRadius;
      const seatY = 360 + Math.sin(seatAngle) * (seatRadius * 0.76);

      const aisleX = 400 + Math.cos(blockAngle) * 165;
      const aisleY = 360 + Math.sin(blockAngle) * 125;

      if (!isExit) {
        if (agent.progress < 0.35) {
          const t = agent.progress / 0.35;
          agent.x = pX + (gate.x - pX) * t + Math.cos(agent.offsetAngle + t * 4) * 8;
          agent.y = pY + (gate.y - pY) * t + Math.sin(agent.offsetAngle + t * 4) * 8;
          agent.color = (gate.status === "CRITICAL") ? "#ef4444" : (gate.status === "HIGH") ? "#f97316" : "#38bdf8";
        } else if (agent.progress < 0.70) {
          const t = (agent.progress - 0.35) / 0.35;
          agent.x = gate.x + (aisleX - gate.x) * t + Math.cos(agent.offsetAngle) * 4;
          agent.y = gate.y + (aisleY - gate.y) * t + Math.sin(agent.offsetAngle) * 4;
          agent.color = "#10b981";
        } else if (agent.progress < 0.90) {
          const t = (agent.progress - 0.70) / 0.20;
          agent.x = aisleX + (seatX - aisleX) * t;
          agent.y = aisleY + (seatY - aisleY) * t;
          agent.color = "#10b981";
        } else {
          agent.x = seatX + Math.cos(agent.offsetAngle + this.simMinute * 0.1) * 1.5;
          agent.y = seatY + Math.sin(agent.offsetAngle + this.simMinute * 0.1) * 1.5;
          agent.color = "#34d399";
        }
      } else {
        if (agent.progress < 0.30) {
          const t = agent.progress / 0.30;
          agent.x = seatX + (aisleX - seatX) * t;
          agent.y = seatY + (aisleY - seatY) * t;
          agent.color = "#f43f5e";
        } else if (agent.progress < 0.65) {
          const t = (agent.progress - 0.30) / 0.35;
          agent.x = aisleX + (gate.x - aisleX) * t + Math.cos(agent.offsetAngle) * 6;
          agent.y = aisleY + (gate.y - aisleY) * t + Math.sin(agent.offsetAngle) * 6;
          agent.color = "#f43f5e";
        } else {
          const t = (agent.progress - 0.65) / 0.35;
          agent.x = gate.x + (pX - gate.x) * t + Math.cos(agent.offsetAngle) * 10;
          agent.y = gate.y + (pY - gate.y) * t + Math.sin(agent.offsetAngle) * 10;
          agent.color = this.isPeakExit ? "#ef4444" : "#fbbf24";
        }
      }

      const distFromCenter = Math.hypot(agent.x - 400, (agent.y - 360) / 0.76);
      if (distFromCenter < 88) {
        const pushAngle = Math.atan2((agent.y - 360) / 0.76, agent.x - 400);
        agent.x = 400 + Math.cos(pushAngle) * 118;
        agent.y = 360 + Math.sin(pushAngle) * (118 * 0.76);
      }
    });

    // 2. UPDATE ACTIVE VEHICLES (Calm realistic cruising speed)
    this.vehicles.forEach(veh => {
      if (veh.isCruiser) {
        // Highway cruiser smooth continuous loop
        veh.progress = (veh.progress + veh.speed * timeFactor * 0.35) % 1.0;
        const outerLoop = [
          [30, 45], [770, 45], [770, 675], [30, 675], [30, 45]
        ];
        const seg = Math.floor(veh.progress * 4);
        const subT = (veh.progress * 4) - seg;
        const pA = outerLoop[seg], pB = outerLoop[(seg + 1) % 4];
        veh.x = pA[0] + (pB[0] - pA[0]) * subT;
        veh.y = pA[1] + (pB[1] - pA[1]) * subT;
        veh.heading = Math.atan2(pB[1] - pA[1], pB[0] - pA[0]);
        veh.isParked = false;
        return;
      }

      if (veh.isCirculatingInLot) {
        // Smooth parking lot circulation
        veh.progress = (veh.progress + veh.speed * timeFactor * 0.35) % 1.0;
        const p = veh.lot;

        // Path: [Perimeter Road] -> [Lot Entry Ramp] -> [Drive Down Center Aisle] -> [End Loop / Bay Maneuver] -> [Exit Ramp] -> [Perimeter Road]
        const aisleY = p.y + p.h / 2;
        const aisleX = p.x + p.w / 2;
        let path = [];

        if (p.y < 200) { // Top lots (P1, P2)
          path = [
            [aisleX, 50],
            [p.x + 18, 50],
            [p.x + 18, aisleY],
            [p.x + p.w - 18, aisleY],
            [p.x + p.w - 18, aisleY + 6],
            [p.x + 22, aisleY + 6],
            [p.x + p.w - 20, 50],
            [aisleX, 50]
          ];
        } else if (p.y > 500) { // Bottom lots (P5, P6)
          path = [
            [aisleX, 670],
            [p.x + p.w - 18, 670],
            [p.x + p.w - 18, aisleY],
            [p.x + 18, aisleY],
            [p.x + 18, aisleY - 6],
            [p.x + p.w - 22, aisleY - 6],
            [p.x + 20, 670],
            [aisleX, 670]
          ];
        } else if (p.x > 500) { // East lots (P3, P4)
          path = [
            [770, aisleY],
            [p.x + p.w - 15, aisleY],
            [p.x + 18, aisleY],
            [p.x + 18, aisleY + 8],
            [p.x + p.w - 18, aisleY + 8],
            [p.x + p.w - 15, aisleY],
            [770, aisleY]
          ];
        } else { // West lots (P7, P8)
          path = [
            [30, aisleY],
            [p.x + 15, aisleY],
            [p.x + p.w - 18, aisleY],
            [p.x + p.w - 18, aisleY - 8],
            [p.x + 18, aisleY - 8],
            [p.x + 15, aisleY],
            [30, aisleY]
          ];
        }

        const numSegs = path.length - 1;
        const totalProgress = veh.progress * numSegs;
        const segIdx = Math.min(numSegs - 1, Math.floor(totalProgress));
        const subT = totalProgress - segIdx;
        const p1 = path[segIdx];
        const p2 = path[segIdx + 1];

        veh.x = p1[0] + (p2[0] - p1[0]) * subT;
        veh.y = p1[1] + (p2[1] - p1[1]) * subT;
        veh.heading = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        veh.isParked = false;
      }
    });
  }

  recordHistoryPoint() {
    this.history.push({
      simMinute: this.simMinute,
      time: this.getFormattedTime(),
      totalPeople: this.totalPeople,
      occupancy: this.currentOccupancy,
      entries: Math.round(this.totalEntries),
      exits: Math.round(this.totalExits),
      parkingPct: this.parkingOccupancyPct,
      overflow: this.overflowCount,
      isArrivalPeak: this.isPeakArrival,
      isExitPeak: this.isPeakExit
    });
    if (this.history.length > 350) this.history.shift();
  }

  recalculateStateFromTime(targetMin) {
    this.simMinute = targetMin;
    const isSurge = (this.config.scenario === "surge_125k");

    if (targetMin <= 900) {
      this.currentOccupancy = 800; this.totalEntries = 950; this.totalExits = 50; this.parkingOccupancyPct = 8.5; this.overflowCount = 0;
    } else if (targetMin <= 960) {
      const prog = (targetMin - 900) / 60;
      this.currentOccupancy = 800 + prog * 28000; this.totalEntries = this.currentOccupancy + 400; this.totalExits = 120; this.parkingOccupancyPct = 8.5 + prog * 44; this.overflowCount = 0;
    } else if (targetMin <= 1020) {
      const prog = (targetMin - 960) / 60;
      this.currentOccupancy = Math.min(100000, 28800 + prog * 72000); this.totalEntries = this.currentOccupancy + 600; this.totalExits = 350; this.parkingOccupancyPct = 52.5 + prog * 44;
      if (isSurge && prog > 0.6) this.overflowCount = Math.round((prog - 0.6) * 45000);
    } else if (targetMin <= 1380) {
      this.currentOccupancy = 99800; this.totalEntries = 100000; this.totalExits = 1800; this.parkingOccupancyPct = 96.4;
      this.overflowCount = isSurge ? 25000 : 0;
    } else if (targetMin <= 1470) {
      const prog = (targetMin - 1380) / 90;
      this.currentOccupancy = Math.max(1200, 99800 - (prog * 95000)); this.totalEntries = 100000; this.totalExits = 1800 + (prog * 95000); this.parkingOccupancyPct = Math.max(8.0, 96.4 - (prog * 86));
      this.overflowCount = Math.max(0, 25000 - (prog * 25000));
    } else {
      this.currentOccupancy = 600; this.totalEntries = 100000; this.totalExits = 99400; this.parkingOccupancyPct = 8.0; this.overflowCount = 0;
    }

    this.evaluateMacroModel(1.0);
    this.recordHistoryPoint();
  }

  getFormattedTime() {
    const totalMinutes = Math.floor(this.simMinute);
    let hours24 = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const ampm = hours24 >= 12 ? "PM" : "AM";
    let hours12 = hours24 % 12;
    if (hours12 === 0) hours12 = 12;
    const padMin = minutes < 10 ? "0" + minutes : minutes;
    const padHr = hours12 < 10 ? "0" + hours12 : hours12;
    return `${padHr}:${padMin} ${ampm}`;
  }

  getTimelinePhase() {
    const min = this.simMinute;
    const isSurge = (this.config.scenario === "surge_125k");
    if (min < 930) return { title: "3:00 PM — Gates Open / Arrival Trickle", phase: "GATES_OPEN" };
    if (min < 960) return { title: "3:30 PM — Massive Inflow Ramp (125k Surge)", phase: "INFLOW_RAMP" };
    if (min < 990) return { title: "4:00 PM — High Arrival Rush Across 8 Gates", phase: "ARRIVAL_RUSH" };
    if (min < 1025) return { title: isSurge ? "4:30 PM — 🔴 125,000 PEAK ARRIVAL SURGE (+25k OVERFLOW)" : "4:30 PM — 🔴 MAJOR ARRIVAL PEAK", phase: "PEAK_INGRESS_RUSH" };
    if (min < 1380) return { title: isSurge ? "5:00 PM–11:00 PM — Match/Event: 100k Inside + 25k Concourse Surge" : "5:00 PM–11:00 PM — Event in Progress (100k Capacity)", phase: "MATCH_LIVE" };
    if (min < 1440) return { title: "11:30 PM — Egress Wave Commencing", phase: "EGRESS_WAVE" };
    if (min < 1475) return { title: "12:05 AM — 🔴 MAJOR MIDNIGHT EXIT SURGE (125k EGRESS)", phase: "PEAK_EGRESS_RUSH" };
    return { title: "12:40 AM+ — Final Crowd & Traffic Dissipation", phase: "DISSIPATION" };
  }

  getState() {
    return {
      simMinute: this.simMinute,
      formattedTime: this.getFormattedTime(),
      speed: this.speed,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      scenario: this.config.scenario,
      expectedCrowd: this.config.expectedCrowd,
      actualCrowd: this.config.actualCrowd,
      totalPeople: this.totalPeople,
      totalEntries: Math.round(this.totalEntries),
      totalExits: Math.round(this.totalExits),
      currentOccupancy: Math.round(this.currentOccupancy),
      stadiumCapacity: this.config.stadiumCapacity,
      overflowCount: this.overflowCount,
      parkingOccupancyPct: this.parkingOccupancyPct,
      totalVehicles: this.totalVehicles,
      activeVehiclesCount: this.activeVehiclesCount,
      activeGatesCount: this.activeGatesCount,
      globalCrowdDensity: this.globalCrowdDensity,
      criticalZonesCount: this.criticalZonesCount,
      isPeakArrival: this.isPeakArrival,
      isPeakExit: this.isPeakExit,
      blocks: this.blocks,
      zones: this.zones,
      gates: this.gates,
      parkingSections: this.parkingSections,
      agents: this.agents,
      vehicles: this.vehicles,
      history: this.history,
      timelinePhase: this.getTimelinePhase()
    };
  }
}
