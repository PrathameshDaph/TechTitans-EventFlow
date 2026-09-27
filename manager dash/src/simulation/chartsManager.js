/**
 * LIVE SIMULATION OF WHAT-IF — REAL-TIME CHARTS MANAGER (125k ATTENDEES ENGINE)
 * Warm Sand & Espresso Luxury Dashboard Visualizer
 */

export class ChartsManager {
  constructor() {
    this.crowdCanvas = null;
    this.parkingCanvas = null;
    this.flowCanvas = null;
    this.gateCanvas = null;
    this.zoneCanvas = null;
  }

  init(domRefs) {
    this.crowdCanvas = domRefs.crowdCanvas;
    this.parkingCanvas = domRefs.parkingCanvas;
    this.flowCanvas = domRefs.flowCanvas;
    this.gateCanvas = domRefs.gateCanvas;
    this.zoneCanvas = domRefs.zoneCanvas;
  }

  update(state) {
    if (this.crowdCanvas) this.renderCrowdVsTime(this.crowdCanvas, state);
    if (this.parkingCanvas) this.renderParkingVsTime(this.parkingCanvas, state);
    if (this.flowCanvas) this.renderEntriesVsExits(this.flowCanvas, state);
    if (this.gateCanvas) this.renderGateTraffic(this.gateCanvas, state);
    if (this.zoneCanvas) this.renderZoneDensity(this.zoneCanvas, state);
  }

  renderCrowdVsTime(canvas, state) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement.clientWidth;
    const h = 170;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);

    const padL = 46, padR = 14, padT = 18, padB = 22;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const maxScale = 130000; // 125k crowd scale

    // Grid lines (Warm Sand)
    ctx.strokeStyle = "rgba(222, 214, 200, 0.7)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();

      const val = Math.round(maxScale - (maxScale / 4) * i);
      ctx.fillStyle = "#7d756c";
      ctx.font = "8.5px JetBrains Mono, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(val / 1000)}k`, padL - 6, y + 3);
    }

    // 100,000 Expected Capacity Red Dashed Threshold Line
    const y100k = padT + plotH - (100000 / maxScale) * plotH;
    ctx.strokeStyle = "rgba(220, 38, 38, 0.75)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, y100k);
    ctx.lineTo(w - padR, y100k);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 8px Inter, sans-serif";
    ctx.fillText("100k CAP", w - padR - 5, y100k - 4);

    // X-Axis Time Markers
    const timeLabels = [
      { min: 900, label: "3:00 PM" },
      { min: 985, label: "4:25 PM" },
      { min: 1200, label: "8:00 PM" },
      { min: 1410, label: "11:30 PM" },
      { min: 1445, label: "12:05 AM" },
      { min: 1530, label: "1:30 AM" }
    ];

    timeLabels.forEach(t => {
      const x = padL + ((t.min - 900) / (1530 - 900)) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.strokeStyle = (t.min === 985 || t.min === 1445) ? "rgba(220, 38, 38, 0.35)" : "rgba(222, 214, 200, 0.6)";
      ctx.stroke();

      ctx.fillStyle = (t.min === 985 || t.min === 1445) ? "#dc2626" : "#7d756c";
      ctx.font = "8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(t.label, x, h - 5);
    });

    // Live Total People In Simulation Curve (Espresso / Charcoal Gradient)
    if (state.history && state.history.length > 1) {
      const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
      grad.addColorStop(0, "rgba(35, 29, 23, 0.25)");
      grad.addColorStop(1, "rgba(35, 29, 23, 0.02)");

      ctx.beginPath();
      const firstX = padL + ((state.history[0].simMinute - 900) / (1530 - 900)) * plotW;
      ctx.moveTo(firstX, padT + plotH);

      state.history.forEach((pt, i) => {
        const x = padL + ((pt.simMinute - 900) / (1530 - 900)) * plotW;
        const y = padT + plotH - (Math.min(maxScale, pt.totalPeople) / maxScale) * plotH;
        if (i === 0) ctx.lineTo(x, y);
        else ctx.lineTo(x, y);
      });

      const lastPt = state.history[state.history.length - 1];
      const lastX = padL + ((lastPt.simMinute - 900) / (1530 - 900)) * plotW;
      ctx.lineTo(lastX, padT + plotH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Stroke
      ctx.beginPath();
      state.history.forEach((pt, i) => {
        const x = padL + ((pt.simMinute - 900) / (1530 - 900)) * plotW;
        const y = padT + plotH - (Math.min(maxScale, pt.totalPeople) / maxScale) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#1c1815";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Current Point Marker
      const currentX = padL + ((state.simMinute - 900) / (1530 - 900)) * plotW;
      const currentY = padT + plotH - (Math.min(maxScale, state.totalPeople) / maxScale) * plotH;

      ctx.beginPath();
      ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
      ctx.fillStyle = (state.isPeakArrival || state.isPeakExit || state.overflowCount > 5000) ? "#dc2626" : "#1c1815";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  renderParkingVsTime(canvas, state) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement.clientWidth;
    const h = 135;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);
    const padL = 36, padR = 14, padT = 14, padB = 20;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    ctx.strokeStyle = "rgba(222, 214, 200, 0.7)";
    ctx.lineWidth = 1;
    [0, 25, 50, 75, 100].forEach(p => {
      const y = padT + plotH - (p / 100) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();

      ctx.fillStyle = "#7d756c";
      ctx.font = "8px JetBrains Mono, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${p}%`, padL - 5, y + 3);
    });

    if (state.history && state.history.length > 1) {
      ctx.beginPath();
      state.history.forEach((pt, i) => {
        const x = padL + ((pt.simMinute - 900) / (1530 - 900)) * plotW;
        const y = padT + plotH - (pt.parkingPct / 100) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#ca6510";
      ctx.lineWidth = 2.2;
      ctx.stroke();

      const lastX = padL + ((state.simMinute - 900) / (1530 - 900)) * plotW;
      const lastY = padT + plotH - (state.parkingOccupancyPct / 100) * plotH;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ca6510";
      ctx.fill();
    }
  }

  renderEntriesVsExits(canvas, state) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement.clientWidth;
    const h = 135;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);
    const padL = 36, padR = 14, padT = 14, padB = 20;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const maxVal = 125000;

    ctx.strokeStyle = "rgba(222, 214, 200, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    ctx.lineTo(w - padR, padT + plotH);
    ctx.stroke();

    if (state.history && state.history.length > 1) {
      ctx.beginPath();
      state.history.forEach((pt, i) => {
        const x = padL + ((pt.simMinute - 900) / (1530 - 900)) * plotW;
        const y = padT + plotH - (Math.min(maxVal, pt.entries) / maxVal) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      state.history.forEach((pt, i) => {
        const x = padL + ((pt.simMinute - 900) / (1530 - 900)) * plotW;
        const y = padT + plotH - (Math.min(maxVal, pt.exits) / maxVal) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  renderGateTraffic(canvas, state) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement.clientWidth;
    const h = 135;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);
    if (!state.gates) return;

    const padL = 28, padR = 10, padT = 12, padB = 22;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const gateKeys = Object.keys(state.gates);
    const barW = plotW / gateKeys.length - 6;

    gateKeys.forEach((k, i) => {
      const g = state.gates[k];
      const x = padL + i * (barW + 6);
      const queueH = Math.min(plotH, (g.queue / 1200) * plotH);
      const y = padT + plotH - queueH;

      ctx.fillStyle = g.queue > 600 ? "#dc2626" : (g.queue > 300 ? "#ca6510" : "#15803d");
      ctx.fillRect(x, y, barW, queueH);

      ctx.fillStyle = "#7d756c";
      ctx.font = "8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(k.toUpperCase(), x + barW / 2, h - 6);
    });
  }

  renderZoneDensity(canvas, state) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement.clientWidth;
    const h = 135;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);
    if (!state.zones) return;

    const padL = 28, padR = 10, padT = 12, padB = 22;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const zoneKeys = Object.keys(state.zones);
    const barW = plotW / zoneKeys.length - 8;

    zoneKeys.forEach((k, i) => {
      const z = state.zones[k];
      const x = padL + i * (barW + 8);
      const pctH = (z.density / 100) * plotH;
      const y = padT + plotH - pctH;

      ctx.fillStyle = z.density > 80 ? "#dc2626" : (z.density > 60 ? "#ca6510" : "#15803d");
      ctx.fillRect(x, y, barW, pctH);

      ctx.fillStyle = "#7d756c";
      ctx.font = "8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Z${k.slice(-1)}`, x + barW / 2, h - 6);
    });
  }
}
