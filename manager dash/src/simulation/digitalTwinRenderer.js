/**
 * LIVE SIMULATION OF WHAT-IF — DIGITAL TWIN CANVAS RENDERER
 * Real-time dynamic visualizer for 125,000 attendee simulation,
 * 8 Stadium Blocks, 4 Zones, 8 Gates, 8 Parking Sectors & Overflows.
 */

export class DigitalTwinRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.lightAngle = 0;

    this.setupInteractivity();
  }

  setupInteractivity() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.dragStartX = e.clientX - this.offsetX;
      this.dragStartY = e.clientY - this.offsetY;
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      this.offsetX = e.clientX - this.dragStartX;
      this.offsetY = e.clientY - this.dragStartY;
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zf = e.deltaY < 0 ? 1.08 : 0.92;
      this.scale = Math.max(0.4, Math.min(3.5, this.scale * zf));
    }, { passive: false });
  }

  resetView() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  resize() {
    // Handled automatically in render() on every frame
  }

  render(state) {
    if (!this.canvas || !this.ctx || !state) return;
    try {
      const ctx = this.ctx;
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (w <= 0 || h <= 0) return;

      // Ensure canvas backing buffer matches physical device pixels
      const targetW = Math.floor(w * dpr);
      const targetH = Math.floor(h * dpr);
      if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
        this.canvas.width = targetW;
        this.canvas.height = targetH;
      }

      this.lightAngle += 0.007;

      // Reset transform to identity * DPR
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fill background
      ctx.fillStyle = "#0e0d0b";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      // Auto-fit 800x720 coordinate space into viewport frame
      const autoScale = Math.min(w / 800, h / 720) * 0.94;
      ctx.translate(w / 2 + this.offsetX, h / 2 + this.offsetY);
      ctx.scale(this.scale * autoScale, this.scale * autoScale);
      ctx.translate(-400, -360);

      // 1. Cybernetic Grid
      this.renderGrid(ctx);

      // 2. Road Network
      this.renderRoads(ctx, state);

      // 3. 8 Parking Sectors (P1 to P8)
      this.render8ParkingSectors(ctx, state);

      // 4. 4 Concourse Crowd Zones (Zone 1 to 4)
      this.render4Zones(ctx, state);

      // 5. Central Stadium & 8 Seating Blocks
      this.renderStadiumAnd8Blocks(ctx, state);

      // 6. 8 Perimeter Entry/Exit Gates
      this.render8Gates(ctx, state);

      // 7. Moving Vehicles
      this.renderVehicles(ctx, state);

      // 8. Moving Pedestrian Agents
      this.renderAgents(ctx, state);

      ctx.restore();
    } catch (err) {
      console.error("DigitalTwinRenderer error:", err);
    }
  }

  renderGrid(ctx) {
    ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 800; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 720);
      ctx.stroke();
    }
    for (let y = 0; y <= 720; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
    ctx.font = "bold 10px JetBrains Mono, monospace";
    ctx.fillText("▲ NORTH PLAZA ARTERIAL", 340, 20);
  }

  renderRoads(ctx, state) {
    const roads = [
      [[30, 50], [770, 50], [770, 670], [30, 670], [30, 50]],
      [[400, 10], [400, 140]],
      [[400, 580], [400, 710]],
      [[10, 360], [160, 360]],
      [[640, 360], [790, 360]],
      [[190, 160], [610, 160], [640, 560], [160, 560], [190, 160]]
    ];

    const isHeavy = state.parkingOccupancyPct > 80 || state.isPeakArrival || state.isPeakExit;

    roads.forEach(path => {
      ctx.beginPath();
      ctx.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length; i++) ctx.lineTo(path[i][0], path[i][1]);
      ctx.lineWidth = 20;
      ctx.strokeStyle = "#151e2e";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.lineWidth = 14;
      ctx.strokeStyle = isHeavy ? "#243247" : "#0c1322";
      ctx.stroke();

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isHeavy ? "rgba(249, 115, 22, 0.7)" : "rgba(56, 189, 248, 0.4)";
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  render8ParkingSectors(ctx, state) {
    const sectors = state.parkingSections;
    if (!sectors) return;

    Object.keys(sectors).forEach((pk, pIdx) => {
      const p = sectors[pk];
      const pct = p.utilization;

      let borderCol = "#38bdf8";
      let bgCol = "rgba(56, 189, 248, 0.08)";
      if (pct >= 90) {
        borderCol = "#ef4444";
        bgCol = "rgba(239, 68, 68, 0.20)";
      } else if (pct >= 75) {
        borderCol = "#f97316";
        bgCol = "rgba(249, 115, 22, 0.15)";
      } else if (pct >= 45) {
        borderCol = "#eab308";
        bgCol = "rgba(234, 179, 8, 0.12)";
      }

      // Parking boundary
      ctx.fillStyle = bgCol;
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 1.8;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeRect(p.x, p.y, p.w, p.h);

      // Central circulation aisle line
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(p.x + 8, p.y + p.h / 2);
      ctx.lineTo(p.x + p.w - 8, p.y + p.h / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw parking bay stalls & realistic parked vehicles (Top & Bottom rows, keeping center aisle open)
      const cols = 5;
      const parkedColors = ["#94a3b8", "#64748b", "#38bdf8", "#f8fafc", "#facc15", "#34d399", "#cbd5e1"];

      // Row 0: Top Stalls
      for (let c = 0; c < cols; c++) {
        const sx = p.x + 8 + c * 21;
        const sy = p.y + 15;

        // Stall outline
        ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(sx, sy, 16, 12);

        // Fill status
        const slotIdx = c;
        const slotThreshold = (slotIdx / (cols * 2)) * 100;
        const isSlotFilled = pct >= slotThreshold && ((c + pIdx) % 5 !== 0);

        if (isSlotFilled) {
          const col = parkedColors[(c * 3 + pIdx) % parkedColors.length];
          // Car Body
          ctx.fillStyle = col;
          ctx.fillRect(sx + 2, sy + 2, 12, 8);
          ctx.strokeStyle = "rgba(15, 23, 42, 0.85)";
          ctx.lineWidth = 0.6;
          ctx.strokeRect(sx + 2, sy + 2, 12, 8);
          // Windshield
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(sx + 5, sy + 3, 5, 5);
        }
      }

      // Row 1: Bottom Stalls
      for (let c = 0; c < cols; c++) {
        const sx = p.x + 8 + c * 21;
        const sy = p.y + p.h - 22;

        // Stall outline
        ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(sx, sy, 16, 12);

        // Fill status
        const slotIdx = cols + c;
        const slotThreshold = (slotIdx / (cols * 2)) * 100;
        const isSlotFilled = pct >= slotThreshold && ((c + pIdx + 2) % 4 !== 0);

        if (isSlotFilled) {
          const col = parkedColors[(c * 2 + pIdx + 3) % parkedColors.length];
          // Car Body
          ctx.fillStyle = col;
          ctx.fillRect(sx + 2, sy + 2, 12, 8);
          ctx.strokeStyle = "rgba(15, 23, 42, 0.85)";
          ctx.lineWidth = 0.6;
          ctx.strokeRect(sx + 2, sy + 2, 12, 8);
          // Windshield
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(sx + 5, sy + 3, 5, 5);
        }
      }

      // Parking Sector Header Tag
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9.5px Inter, sans-serif";
      ctx.fillText(p.name.split("(")[0].trim(), p.x + 6, p.y + 12);

      // Inflow / Outflow Arrow Indicator
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 8px JetBrains Mono, monospace";
      ctx.fillText("▲ IN/OUT", p.x + p.w - 44, p.y + 12);

      // Utilization Footer
      ctx.fillStyle = borderCol;
      ctx.font = "bold 8.5px JetBrains Mono, monospace";
      ctx.fillText(`${pct}% (${p.occupied}/${p.capacity})`, p.x + 6, p.y + p.h - 4);
    });
  }

  render4Zones(ctx, state) {
    const zones = state.zones;
    if (!zones) return;

    const zoneShapes = [
      { id: "zone-1", pts: [[260, 80], [540, 80], [520, 180], [280, 180]] },
      { id: "zone-2", pts: [[600, 180], [740, 200], [740, 520], [600, 500]] },
      { id: "zone-3", pts: [[280, 540], [520, 540], [540, 640], [260, 640]] },
      { id: "zone-4", pts: [[60, 200], [200, 180], [200, 500], [60, 520]] }
    ];

    zoneShapes.forEach(zs => {
      const z = zones[zs.id];
      if (!z) return;

      let borderCol = "#10b981";
      let fillCol = "rgba(16, 185, 129, 0.12)";
      if (z.status === "CRITICAL") {
        borderCol = "#ef4444";
        fillCol = "rgba(239, 68, 68, 0.28)";
      } else if (z.status === "HIGH") {
        borderCol = "#f97316";
        fillCol = "rgba(249, 115, 22, 0.2)";
      } else if (z.status === "MODERATE") {
        borderCol = "#eab308";
        fillCol = "rgba(234, 179, 8, 0.15)";
      }

      ctx.beginPath();
      ctx.moveTo(zs.pts[0][0], zs.pts[0][1]);
      for (let i = 1; i < zs.pts.length; i++) ctx.lineTo(zs.pts[i][0], zs.pts[i][1]);
      ctx.closePath();
      ctx.fillStyle = fillCol;
      ctx.fill();
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const cx = zs.pts.reduce((acc, p) => acc + p[0], 0) / zs.pts.length;
      const cy = zs.pts.reduce((acc, p) => acc + p[1], 0) / zs.pts.length;

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(z.name.split(":")[0], cx, cy - 4);

      ctx.fillStyle = borderCol;
      ctx.font = "bold 9px JetBrains Mono, monospace";
      ctx.fillText(`Density: ${z.density}% [${z.status}] (${z.currentCount.toLocaleString()})`, cx, cy + 8);
      ctx.textAlign = "start";
    });
  }

  renderStadiumAnd8Blocks(ctx, state) {
    const cx = 400;
    const cy = 360;
    const occRatio = Math.min(1.0, state.currentOccupancy / state.stadiumCapacity);

    // Searchlight sweep effects
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 4; i++) {
      const beamAngle = this.lightAngle + (i * Math.PI / 2);
      const grad = ctx.createRadialGradient(0, 0, 10, Math.cos(beamAngle) * 260, Math.sin(beamAngle) * 260, 90);
      grad.addColorStop(0, "rgba(56, 189, 248, 0.2)");
      grad.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 260, beamAngle - 0.25, beamAngle + 0.25);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Stadium Outer Shell Ring
    ctx.beginPath();
    ctx.ellipse(cx, cy, 175, 135, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#0c1527";
    ctx.strokeStyle = (occRatio > 0.95) ? "#ef4444" : "#38bdf8";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    // 8 SEATING BLOCKS (Blocks 101 to 108)
    const blockKeys = Object.keys(state.blocks || {});
    const totalBlocks = blockKeys.length || 8;
    const radiusOuterX = 160, radiusOuterY = 120;
    const radiusInnerX = 105, radiusInnerY = 80;

    blockKeys.forEach((bk, i) => {
      const blk = state.blocks[bk];
      const startAngle = (i * Math.PI * 2) / totalBlocks - (Math.PI / totalBlocks);
      const endAngle = ((i + 1) * Math.PI * 2) / totalBlocks - (Math.PI / totalBlocks);

      let blkCol = "rgba(16, 185, 129, 0.4)";
      if (blk.pct >= 95) blkCol = "rgba(239, 68, 68, 0.75)";
      else if (blk.pct >= 75) blkCol = "rgba(249, 115, 22, 0.6)";
      else if (blk.pct >= 40) blkCol = "rgba(234, 179, 8, 0.45)";

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, radiusOuterX, radiusOuterY, 0, startAngle, endAngle);
      ctx.ellipse(cx, cy, radiusInnerX, radiusInnerY, 0, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = blkCol;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      const midAngle = (startAngle + endAngle) / 2;
      const lx = cx + Math.cos(midAngle) * 132;
      const ly = cy + Math.sin(midAngle) * 100;

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(blk.id.toUpperCase(), lx, ly - 2);
      ctx.fillStyle = "#facc15";
      ctx.font = "bold 8px JetBrains Mono, monospace";
      ctx.fillText(`${blk.pct}%`, lx, ly + 8);
      ctx.restore();
    });

    // Inner Field Arena (Cricket Pitch Ground)
    ctx.beginPath();
    ctx.ellipse(cx, cy, 72, 52, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#047857";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();

    // Field Boundary Ring & Grass Cut Ring
    ctx.beginPath();
    ctx.ellipse(cx, cy, 64, 46, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Central Pitch Strip
    ctx.fillStyle = "#b4975a"; // Clay pitch brown
    ctx.fillRect(cx - 6, cy - 14, 12, 28);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 0.8;
    ctx.strokeRect(cx - 6, cy - 14, 12, 28);

    // Crease Lines & Wickets
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy - 10); ctx.lineTo(cx + 7, cy - 10);
    ctx.moveTo(cx - 7, cy + 10); ctx.lineTo(cx + 7, cy + 10);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Match Players & Umpires on the field (Distinct dots on pitch)
    const players = [
      { x: cx, y: cy - 9, col: "#38bdf8" },      // Batsman Striker
      { x: cx, y: cy + 9, col: "#38bdf8" },      // Non-Striker
      { x: cx, y: cy + 22, col: "#ef4444" },     // Bowler
      { x: cx - 18, y: cy - 2, col: "#ef4444" }, // Fielder
      { x: cx + 22, y: cy + 6, col: "#ef4444" }, // Fielder
      { x: cx, y: cy + 15, col: "#ffffff" }      // Umpire
    ];
    players.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = p.col;
      ctx.fill();
    });

    // Center Telemetry HUD
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("STADIUM BOWL", cx, cy - 22);

    ctx.font = "bold 12px JetBrains Mono, monospace";
    ctx.fillStyle = (occRatio > 0.95) ? "#ef4444" : "#38bdf8";
    ctx.fillText(`${Math.round(state.currentOccupancy).toLocaleString()} / 100k`, cx, cy + 26);

    ctx.font = "bold 8.5px Inter, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(`${((occRatio) * 100).toFixed(1)}% SEATED`, cx, cy + 37);

    if (state.overflowCount > 0) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 8px Inter, sans-serif";
      ctx.fillText(`⚠️ +${state.overflowCount.toLocaleString()} OVERFLOW`, cx, cy + 47);
    }

    ctx.textAlign = "start";
  }

  render8Gates(ctx, state) {
    const gates = state.gates;
    if (!gates) return;

    Object.keys(gates).forEach(gk => {
      const g = gates[gk];
      const gx = g.x;
      const gy = g.y;

      let statusColor = "#10b981";
      if (g.status === "CRITICAL") statusColor = "#ef4444";
      else if (g.status === "HIGH") statusColor = "#f97316";
      else if (g.status === "MODERATE") statusColor = "#eab308";

      ctx.fillStyle = "#111c30";
      ctx.strokeStyle = statusColor;
      ctx.lineWidth = 1.8;
      ctx.fillRect(gx - 26, gy - 16, 52, 32);
      ctx.strokeRect(gx - 26, gy - 16, 52, 32);

      ctx.beginPath();
      ctx.arc(gx, gy - 16, 4, 0, Math.PI * 2);
      ctx.fillStyle = statusColor;
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(g.name.split("(")[0].trim(), gx, gy - 3);

      ctx.fillStyle = statusColor;
      ctx.font = "bold 8px JetBrains Mono, monospace";
      ctx.fillText(`Q:${Math.round(g.queue)} [${g.utilization}%]`, gx, gy + 8);

      ctx.strokeStyle = statusColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const angle = Math.atan2(gy - 360, gx - 400);
      const qLen = Math.min(38, g.queue * 0.08);
      ctx.moveTo(gx + Math.cos(angle) * 18, gy + Math.sin(angle) * 18);
      ctx.lineTo(gx + Math.cos(angle) * (18 + qLen), gy + Math.sin(angle) * (18 + qLen));
      ctx.stroke();

      ctx.textAlign = "start";
    });
  }

  renderVehicles(ctx, state) {
    if (!state.vehicles || !Array.isArray(state.vehicles)) return;

    state.vehicles.forEach(veh => {
      if (typeof veh.x !== 'number' || typeof veh.y !== 'number') return;

      ctx.save();
      ctx.translate(veh.x, veh.y);
      if (typeof veh.heading === 'number') {
        ctx.rotate(veh.heading);
      }

      // Moving vehicle shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(0, 1, 6, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      if (veh.type === "bus") {
        // Express transit bus / shuttle
        ctx.fillStyle = veh.color || "#38bdf8";
        ctx.fillRect(-8, -4, 16, 8);
        ctx.strokeStyle = "#04101e";
        ctx.lineWidth = 1;
        ctx.strokeRect(-8, -4, 16, 8);
        // Windows
        ctx.fillStyle = "#0c1527";
        ctx.fillRect(-6, -3, 12, 2);
        ctx.fillRect(-6, 1, 12, 2);
        // Windshield
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(5, -3, 2.5, 6);
      } else {
        // Passenger car
        ctx.fillStyle = veh.color || "#f8fafc";
        ctx.fillRect(-5.5, -3, 11, 6);
        ctx.strokeStyle = "rgba(15, 23, 42, 0.9)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-5.5, -3, 11, 6);
        // Windshield & roof
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(-1.5, -2.2, 3.5, 4.4);
      }

      // Active Moving Headlights (Bright Yellow/White forward beams)
      ctx.fillStyle = "rgba(253, 224, 71, 0.9)";
      ctx.beginPath();
      ctx.arc(6.5, -2, 1.3, 0, Math.PI * 2);
      ctx.arc(6.5, 2, 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Headlight Beam Cone
      ctx.fillStyle = "rgba(253, 224, 71, 0.15)";
      ctx.beginPath();
      ctx.moveTo(6.5, 0);
      ctx.lineTo(20, -7);
      ctx.lineTo(20, 7);
      ctx.closePath();
      ctx.fill();

      // Taillights (Red glow behind)
      ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
      ctx.beginPath();
      ctx.arc(-6.5, -2, 1.2, 0, Math.PI * 2);
      ctx.arc(-6.5, 2, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  renderAgents(ctx, state) {
    if (!state.agents || !Array.isArray(state.agents)) return;

    state.agents.forEach(agent => {
      if (typeof agent.x !== 'number' || typeof agent.y !== 'number') return;
      ctx.beginPath();
      ctx.arc(agent.x, agent.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = agent.color || "#38bdf8";
      ctx.fill();
    });
  }
}
