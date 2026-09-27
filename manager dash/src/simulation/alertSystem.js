/**
 * LIVE SIMULATION OF WHAT-IF — REAL-TIME ALERT SYSTEM
 * Dynamic rule-based threshold evaluation engine that generates live operational alerts.
 */

export class AlertSystem {
  constructor() {
    this.alerts = [];
    this.activeAlertIds = new Set();
  }

  evaluate(state) {
    const newAlerts = [];
    const timeStr = state.formattedTime;

    // 1. Peak Flow Alerts
    if (state.isPeakArrival) {
      this.pushAlert({
        id: "peak-arrival",
        level: "CRITICAL",
        icon: "🔴",
        time: timeStr,
        title: "PEAK ARRIVAL SURGE IN PROGRESS",
        message: "Entry flux exceeded 1,600 people/min. Gate B and North Approach undergoing maximum capacity stress."
      });
    } else {
      this.resolveAlert("peak-arrival");
    }

    if (state.isPeakExit) {
      this.pushAlert({
        id: "peak-exit",
        level: "CRITICAL",
        icon: "🔴",
        time: timeStr,
        title: "PEAK MIDNIGHT EXIT FLOW DETECTED",
        message: "Egress flux exceeded 2,200 people/min. Egress arteries and parking toll exits experiencing major surge."
      });
    } else {
      this.resolveAlert("peak-exit");
    }

    // 2. Parking Threshold Alerts
    if (state.parkingOccupancyPct >= 90) {
      this.pushAlert({
        id: "parking-critical",
        level: "CRITICAL",
        icon: "🔴",
        time: timeStr,
        title: "PARKING CAPACITY CRITICAL",
        message: `Total parking occupancy reached ${state.parkingOccupancyPct}%. Diverting incoming traffic to auxiliary overflow.`
      });
    } else if (state.parkingOccupancyPct >= 80) {
      this.pushAlert({
        id: "parking-warn",
        level: "WARNING",
        icon: "🟠",
        time: timeStr,
        title: "PARKING OCCUPANCY ABOVE 80%",
        message: `Parking utilization at ${state.parkingOccupancyPct}%. Remaining spots: ${Math.max(0, Math.round(12000 * (1 - state.parkingOccupancyPct/100)))}.`
      });
    } else {
      this.resolveAlert("parking-critical");
      this.resolveAlert("parking-warn");
    }

    // 3. Gate Threshold Alerts
    Object.keys(state.gates).forEach(key => {
      const g = state.gates[key];
      const alertId = `gate-${key}`;
      if (g.queue >= 350 || g.status === "CRITICAL") {
        this.pushAlert({
          id: alertId,
          level: "CRITICAL",
          icon: "🔴",
          time: timeStr,
          title: `${g.name.toUpperCase()} QUEUE EXCEEDED SAFE THRESHOLD`,
          message: `Live Queue is ${Math.round(g.queue)} people. Dynamic rerouting recommendation activated.`
        });
      } else if (g.queue >= 200 || g.status === "HIGH") {
        this.pushAlert({
          id: alertId,
          level: "WARNING",
          icon: "🟠",
          time: timeStr,
          title: `${g.name.toUpperCase()} QUEUE BUILDING RAPIDLY`,
          message: `Live Queue is ${Math.round(g.queue)} people (${g.utilization}% utilization).`
        });
      } else {
        this.resolveAlert(alertId);
      }
    });

    // 4. Zone Congestion Alerts
    Object.keys(state.zones).forEach(key => {
      const z = state.zones[key];
      const alertId = `zone-${key}`;
      if (z.density >= 85 || z.status === "CRITICAL") {
        this.pushAlert({
          id: alertId,
          level: "CRITICAL",
          icon: "🔴",
          time: timeStr,
          title: `${z.name.toUpperCase()} CRITICAL DENSITY DETECTED`,
          message: `Crowd density is ${z.density}% (${z.currentCount.toLocaleString()} occupants). Staggered release recommended.`
        });
      } else if (z.density >= 65 || z.status === "HIGH") {
        this.pushAlert({
          id: alertId,
          level: "WARNING",
          icon: "🟠",
          time: timeStr,
          title: `${z.name.toUpperCase()} DENSITY INCREASING`,
          message: `Crowd density reached ${z.density}%.`
        });
      } else {
        this.resolveAlert(alertId);
      }
    });

    // 5. Vehicle Traffic Alerts
    if (state.isPeakExit && state.activeVehiclesCount > 250) {
      this.pushAlert({
        id: "veh-congestion",
        level: "WARNING",
        icon: "🟠",
        time: timeStr,
        title: "VEHICLE EXIT QUEUE INCREASING",
        message: "Perimeter expressways and parking exit booths experiencing heavy discharge congestion."
      });
    } else {
      this.resolveAlert("veh-congestion");
    }

    return this.alerts;
  }

  pushAlert(alert) {
    const existingIndex = this.alerts.findIndex(a => a.id === alert.id);
    if (existingIndex >= 0) {
      // Update existing
      this.alerts[existingIndex] = { ...this.alerts[existingIndex], ...alert, updated: Date.now() };
    } else {
      // Add new
      this.alerts.unshift({ ...alert, created: Date.now() });
      if (this.alerts.length > 20) this.alerts.pop();
    }
  }

  resolveAlert(alertId) {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
  }

  getAlerts() {
    return this.alerts;
  }
}
