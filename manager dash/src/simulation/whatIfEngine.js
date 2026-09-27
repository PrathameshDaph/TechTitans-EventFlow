/**
 * LIVE SIMULATION OF WHAT-IF — COMPREHENSIVE DETERMINISTIC SCENARIO ENGINE
 * Multi-Component Support for:
 * 8 Stadium Blocks (101-108), 8 Gates (A1-D2), 4 Zones (1-4), 8 Parking Sectors (P1-P8)
 * 11 Hourly Timesteps (3:00 PM to 1:00 AM) + Custom Multipliers & Disruptions
 */

export const WHATIF_CONFIG = {
  eventName: "Stadium Mega Event (125k Surge WHAT-IF)",
  baselineVisitors: 100000,
  defaultMultiplier: 1.25,

  // 11 Hourly Timesteps spanning 3:00 PM to 1:00 AM
  timesteps: [
    { idx: 0, time: "3:00 PM", label: "3:00 PM (Gates Open / Early Arrival)", phase: "EARLY_ARRIVAL", cumArrivalPct: 0.10, stepRateFactor: 0.10, inVenuePct: 0.08, inTransitPct: 0.02, inEgressPct: 0.00 },
    { idx: 1, time: "4:00 PM", label: "4:00 PM (Arrival Surge Wave)", phase: "PRE_MATCH_SURGE", cumArrivalPct: 0.35, stepRateFactor: 0.25, inVenuePct: 0.28, inTransitPct: 0.07, inEgressPct: 0.00 },
    { idx: 2, time: "4:30 PM", label: "4:30 PM (🔴 PEAK INGRESS RUSH / 125k SURGE)", phase: "PEAK_INGRESS_RUSH", cumArrivalPct: 0.75, stepRateFactor: 0.40, inVenuePct: 0.65, inTransitPct: 0.10, inEgressPct: 0.00 },
    { idx: 3, time: "5:30 PM", label: "5:30 PM (Event Commences / Late Ingress)", phase: "EVENT_START", cumArrivalPct: 0.94, stepRateFactor: 0.19, inVenuePct: 0.90, inTransitPct: 0.04, inEgressPct: 0.00 },
    { idx: 4, time: "7:00 PM", label: "7:00 PM (Full Arena Saturation / 100k Seated)", phase: "FULL_ARENA", cumArrivalPct: 0.99, stepRateFactor: 0.05, inVenuePct: 0.97, inTransitPct: 0.02, inEgressPct: 0.00 },
    { idx: 5, time: "8:30 PM", label: "8:30 PM (Peak Event / Concourse Activity)", phase: "MID_EVENT", cumArrivalPct: 1.00, stepRateFactor: 0.01, inVenuePct: 0.98, inTransitPct: 0.02, inEgressPct: 0.00 },
    { idx: 6, time: "9:30 PM", label: "9:30 PM (Halftime / Intermission Movement)", phase: "INTERMISSION", cumArrivalPct: 1.00, stepRateFactor: 0.02, inVenuePct: 0.95, inTransitPct: 0.05, inEgressPct: 0.00 },
    { idx: 7, time: "10:30 PM", label: "10:30 PM (Event Finale / Pre-Exit Wave)", phase: "FINALE", cumArrivalPct: 1.00, stepRateFactor: 0.04, inVenuePct: 0.92, inTransitPct: 0.04, inEgressPct: 0.04 },
    { idx: 8, time: "11:30 PM", label: "11:30 PM (Mass Egress Commences)", phase: "MASS_EGRESS", cumArrivalPct: 1.00, stepRateFactor: 0.35, inVenuePct: 0.55, inTransitPct: 0.20, inEgressPct: 0.45 },
    { idx: 9, time: "12:05 AM", label: "12:05 AM (🔴 MIDNIGHT DISPERSAL PEAK)", phase: "MIDNIGHT_DISPERSAL", cumArrivalPct: 1.00, stepRateFactor: 0.25, inVenuePct: 0.15, inTransitPct: 0.15, inEgressPct: 0.85 },
    { idx: 10, time: "1:00 AM", label: "1:00 AM (Final Clearance / District Normal)", phase: "DISTRICT_CLEAR", cumArrivalPct: 1.00, stepRateFactor: 0.05, inVenuePct: 0.02, inTransitPct: 0.03, inEgressPct: 0.98 }
  ],

  riskThresholds: {
    LOW: { min: 0, max: 60, label: 'LOW', color: '#10b981', bg: 'rgba(16, 185, 129, 0.18)', badge: '🟢 LOW' },
    MODERATE: { min: 60, max: 75, label: 'MODERATE', color: '#eab308', bg: 'rgba(234, 179, 8, 0.18)', badge: '🟡 MODERATE' },
    HIGH: { min: 75, max: 90, label: 'HIGH', color: '#f97316', bg: 'rgba(249, 115, 22, 0.18)', badge: '🟠 HIGH' },
    CRITICAL: { min: 90, max: 999, label: 'CRITICAL', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.25)', badge: '🔴 CRITICAL' }
  }
};

export function getRiskMeta(utilizationPct) {
  let level = 'LOW';
  if (utilizationPct >= 90) level = 'CRITICAL';
  else if (utilizationPct >= 75) level = 'HIGH';
  else if (utilizationPct >= 60) level = 'MODERATE';
  
  return {
    level,
    ...WHATIF_CONFIG.riskThresholds[level],
    pct: Math.round(utilizationPct * 10) / 10
  };
}

export function getInfrastructureBlueprint() {
  return {
    stadium: {
      id: 'stadium-main',
      name: 'Main Stadium Arena',
      capacity: 100000,
      blocks: [
        { id: 'b-101', name: 'Block 101 (North Upper)', capacity: 12500, share: 0.125 },
        { id: 'b-102', name: 'Block 102 (North Lower)', capacity: 12500, share: 0.125 },
        { id: 'b-103', name: 'Block 103 (East Pavilion)', capacity: 12500, share: 0.125 },
        { id: 'b-104', name: 'Block 104 (East Concourse)', capacity: 12500, share: 0.125 },
        { id: 'b-105', name: 'Block 105 (South Upper)', capacity: 12500, share: 0.125 },
        { id: 'b-106', name: 'Block 106 (South Lower)', capacity: 12500, share: 0.125 },
        { id: 'b-107', name: 'Block 107 (West Suites)', capacity: 12500, share: 0.125 },
        { id: 'b-108', name: 'Block 108 (West Club Deck)', capacity: 12500, share: 0.125 }
      ]
    },
    gates: [
      { id: 'gate-a1', name: 'Gate A1 (NW Turnstiles)', capacity: 12000, nominalRate: 350, share: 0.12 },
      { id: 'gate-a2', name: 'Gate A2 (NE Express)', capacity: 15000, nominalRate: 420, share: 0.18 }, // Absorbs largest direct wave
      { id: 'gate-b1', name: 'Gate B1 (East Grand Plaza)', capacity: 15000, nominalRate: 400, share: 0.17 },
      { id: 'gate-b2', name: 'Gate B2 (East VIP & Media)', capacity: 9000, nominalRate: 240, share: 0.08 },
      { id: 'gate-c1', name: 'Gate C1 (South Boulevard)', capacity: 13000, nominalRate: 340, share: 0.13 },
      { id: 'gate-c2', name: 'Gate C2 (South Concourse)', capacity: 12000, nominalRate: 320, share: 0.11 },
      { id: 'gate-d1', name: 'Gate D1 (West Metro Link)', capacity: 14000, nominalRate: 380, share: 0.15 },
      { id: 'gate-d2', name: 'Gate D2 (West Transit Hub)', capacity: 10000, nominalRate: 280, share: 0.06 }
    ],
    zones: [
      { id: 'zone-1', name: 'Zone 1: North Fan Village & Plaza', capacity: 20000, areaSqM: 9000 },
      { id: 'zone-2', name: 'Zone 2: East Concourse & Promenade', capacity: 22000, areaSqM: 8500 },
      { id: 'zone-3', name: 'Zone 3: South Gate Boulevard', capacity: 18000, areaSqM: 7500 },
      { id: 'zone-4', name: 'Zone 4: West Metro Interchange', capacity: 25000, areaSqM: 9500 }
    ],
    parking: [
      { id: 'p1', name: 'P1 (North-West General)', capacity: 2000, priority: 1 },
      { id: 'p2', name: 'P2 (North-East Surface)', capacity: 2000, priority: 2 },
      { id: 'p3', name: 'P3 (East Multi-Tier Deck)', capacity: 2500, priority: 3 },
      { id: 'p4', name: 'P4 (East VIP & Hospitality)', capacity: 1500, priority: 4 },
      { id: 'p5', name: 'P5 (South Boulevard Lot)', capacity: 2000, priority: 5 },
      { id: 'p6', name: 'P6 (South Express Lot)', capacity: 2000, priority: 6 },
      { id: 'p7', name: 'P7 (West Metro Park & Ride)', capacity: 2500, priority: 7 },
      { id: 'p8', name: 'P8 (West Bus & Shuttle Hub)', capacity: 1500, priority: 8 }
    ]
  };
}

export function runWhatIfCalculation(multiplier = 1.25, isOptimized = false, customTweaks = {}) {
  const infra = getInfrastructureBlueprint();
  const baselineVisitors = WHATIF_CONFIG.baselineVisitors; // 100,000
  const simulatedVisitors = Math.round(baselineVisitors * multiplier);
  const additionalVisitors = simulatedVisitors - baselineVisitors;

  const gateMods = customTweaks.gateModifiers || {};
  const parkMods = customTweaks.parkingModifiers || {};
  const blockMods = customTweaks.blockModifiers || {};
  const zoneMods = customTweaks.zoneModifiers || {};

  const timeline = WHATIF_CONFIG.timesteps.map((ts) => {
    const cumArrivals = Math.round(simulatedVisitors * ts.cumArrivalPct);
    const activeInVenue = Math.round(simulatedVisitors * ts.inVenuePct);
    const activeInTransit = Math.round(simulatedVisitors * ts.inTransitPct);
    const activeInEgress = Math.round(simulatedVisitors * ts.inEgressPct);
    const stepArrivalRate = Math.round(simulatedVisitors * ts.stepRateFactor);

    const isIngressRush = ts.idx === 1 || ts.idx === 2;
    const isEgressPhase = ts.idx >= 8;

    // 1. 8 Seating Blocks
    const blocks = infra.stadium.blocks.map(b => {
      const bMod = blockMods[b.id] ?? 1.0;
      const effectiveCap = Math.round(b.capacity * bMod);
      const bLoad = Math.min(effectiveCap, Math.round(activeInVenue * b.share));
      const bUtil = Math.min(100, Math.round((bLoad / (effectiveCap || 1)) * 1000) / 10);
      return {
        id: b.id,
        name: b.name,
        capacity: effectiveCap,
        currentLoad: bLoad,
        utilization: bUtil,
        risk: getRiskMeta(bUtil)
      };
    });

    // 2. 8 Perimeter Gates
    const gates = infra.gates.map(g => {
      const gMod = gateMods[g.id] ?? 1.0;
      const effectiveCap = Math.round(g.capacity * gMod);
      const effectiveRate = Math.round(g.nominalRate * gMod);

      let share = g.share;
      if (isOptimized) share = 1 / infra.gates.length;

      const gPaxHr = Math.round(stepArrivalRate * share);
      const gPaxMin = Math.round(gPaxHr / 60);

      let queueLen = 0;
      let queueWaitMins = 0;

      if (effectiveRate <= 0) {
        queueWaitMins = 45;
        queueLen = gPaxHr;
      } else if (isIngressRush) {
        const excess = Math.max(0, gPaxMin - (effectiveRate * 0.55));
        queueLen = Math.round(excess * 32 + (ts.idx === 2 ? 600 : 200) * (multiplier > 1.2 ? 1.4 : 1.0));
        queueWaitMins = Math.round((queueLen / effectiveRate) * 10) / 10;
      } else if (isEgressPhase) {
        const egressMin = Math.round((stepArrivalRate * share) / 60);
        queueLen = Math.max(0, Math.round((egressMin - effectiveRate * 0.6) * 16));
        queueWaitMins = Math.round((queueLen / effectiveRate) * 10) / 10;
      } else {
        queueLen = Math.round(gPaxMin * 1.5);
        queueWaitMins = Math.max(0.5, Math.round((queueLen / effectiveRate) * 10) / 10);
      }

      if (isOptimized) {
        queueWaitMins = Math.max(1.0, Math.round(queueWaitMins * 0.3 * 10) / 10);
        queueLen = Math.round(queueLen * 0.32);
      }

      const gUtil = Math.min(100, Math.round(((gPaxHr + queueLen) / (effectiveCap || 1)) * 1000) / 10);

      return {
        id: g.id,
        name: g.name,
        capacity: effectiveCap,
        currentQueue: queueLen,
        waitMinutes: queueWaitMins,
        utilization: gUtil,
        risk: getRiskMeta(gUtil)
      };
    });

    // 3. 4 Concourse Crowd Zones
    let totalOverflowOutside = 0;
    if (activeInVenue > infra.stadium.capacity) {
      totalOverflowOutside = activeInVenue - infra.stadium.capacity;
    }

    const zones = infra.zones.map((z, idx) => {
      const zMod = zoneMods[z.id] ?? 1.0;
      const effectiveCap = Math.round(z.capacity * zMod);
      const share = [0.32, 0.28, 0.18, 0.22][idx];
      const zLoad = Math.round((activeInTransit * share) + (totalOverflowOutside * share) + (stepArrivalRate * 0.08 * share));
      const zUtil = Math.min(100, Math.round((zLoad / (effectiveCap || 1)) * 1000) / 10);

      return {
        id: z.id,
        name: z.name,
        capacity: effectiveCap,
        currentCount: zLoad,
        utilization: zUtil,
        risk: getRiskMeta(zUtil)
      };
    });

    // 4. 8 Parking Sectors
    const totalVehiclesNeeded = Math.round(simulatedVisitors * 0.22);
    const parkingLots = infra.parking.map((p, idx) => {
      const pMod = parkMods[p.id] ?? 1.0;
      const effectiveCap = Math.round(p.capacity * pMod);
      const pShare = [0.15, 0.14, 0.18, 0.09, 0.13, 0.10, 0.14, 0.07][idx];
      const pLoad = Math.min(effectiveCap, Math.round(totalVehiclesNeeded * ts.cumArrivalPct * pShare));
      const pUtil = Math.min(100, Math.round((pLoad / (effectiveCap || 1)) * 1000) / 10);

      return {
        id: p.id,
        name: p.name,
        capacity: effectiveCap,
        occupied: pLoad,
        utilization: pUtil,
        risk: getRiskMeta(pUtil)
      };
    });

    // Summary Aggregates
    const criticalEntities = [
      ...blocks.filter(b => b.risk.level === 'CRITICAL'),
      ...gates.filter(g => g.risk.level === 'CRITICAL'),
      ...zones.filter(z => z.risk.level === 'CRITICAL'),
      ...parkingLots.filter(p => p.risk.level === 'CRITICAL')
    ];

    const maxGateWait = Math.max(...gates.map(g => g.waitMinutes));
    const avgGateWait = Math.round((gates.reduce((acc, g) => acc + g.waitMinutes, 0) / gates.length) * 10) / 10;
    const avgParkingUtil = Math.round((parkingLots.reduce((acc, p) => acc + p.utilization, 0) / parkingLots.length) * 10) / 10;
    const overallSafetyScore = Math.max(15, Math.round(100 - (criticalEntities.length * 9) - (maxGateWait * 1.5)));

    return {
      stepInfo: ts,
      activeInVenue,
      activeInTransit,
      activeInEgress,
      totalOverflowOutside,
      blocks,
      gates,
      zones,
      parkingLots,
      maxGateWait,
      avgGateWait,
      avgParkingUtil,
      overallSafetyScore,
      criticalCount: criticalEntities.length,
      criticalList: criticalEntities.map(c => c.name)
    };
  });

  // Overall Scenario Insights
  const peakIngressStep = timeline[2];
  const peakEgressStep = timeline[9];

  return {
    scenarioMeta: {
      multiplier,
      simulatedVisitors,
      additionalVisitors,
      isOptimized
    },
    timeline,
    peakIngressStep,
    peakEgressStep
  };
}
