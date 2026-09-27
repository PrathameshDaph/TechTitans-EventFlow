/**
 * LIVE SIMULATION OF WHAT-IF — INTELLIGENCE ADVISOR & WHAT-IF ENGINE
 * Answers questions tailored to the 125,000 Attendees Scenario (100,000 Expected, +25,000 Surge Overflow).
 */

export class WhatIfAdvisor {
  static answerQuestion(questionId, state) {
    const isSurge = (state.scenario === "surge_125k");

    switch (questionId) {
      case "q_crowd_increasing": {
        const isExit = state.simMinute >= 1370;
        if (isExit) {
          return {
            title: "Crowd Movement Vector: 125,000 Midnight Egress Surge",
            badge: state.isPeakExit ? "🔴 125k MIDNIGHT PEAK EXIT" : "EXIT PHASE",
            color: "#f43f5e",
            answer: `All 100,000 stadium seats plus the 25,000 concourse overflow crowd are rapidly exiting through Gates A1–D2 towards parking sectors P1–P8 and the West Metro Hub.`,
            metrics: [
              { label: "Active Egress Rate", value: `${Math.round(state.isPeakExit ? 4200 : 1600)} people/min` },
              { label: "Total Dispersing", value: "125,000 people" },
              { label: "Stadium Remaining", value: `${((state.currentOccupancy / state.stadiumCapacity) * 100).toFixed(1)}% seated` }
            ],
            recommendation: "Open all peripheral emergency egress gates, hold buses on standby, and prioritize outward arterial green wave signals."
          };
        } else {
          return {
            title: isSurge ? "Crowd Vector: 125,000 Inflow (+25k Over Capacity)" : "Crowd Vector: Nominal Inflow",
            badge: state.isPeakArrival ? "🔴 125k PEAK ARRIVAL SURGE" : "INBOUND",
            color: "#38bdf8",
            answer: isSurge && state.currentOccupancy >= 98000
              ? `Stadium has reached 100% capacity (100,000 seats filled!). An overflow of ${state.overflowCount.toLocaleString()} attendees is now accumulating in Concourse Zones 1–4.`
              : `A massive wave of 125,000 attendees is pouring in through Approach Arterials, heavily congesting Gate A2 and Gate B1 before filling Blocks 101–108.`,
            metrics: [
              { label: "Inflow Velocity", value: `${Math.round(state.isPeakArrival ? 3400 : 1100)} / min` },
              { label: "Overflow Outside", value: `${state.overflowCount.toLocaleString()} people` },
              { label: "Stadium Occupancy", value: `${state.currentOccupancy.toLocaleString()} / 100,000` }
            ],
            recommendation: isSurge && state.overflowCount > 5000
              ? "Close turnstiles, activate giant outdoor viewing screens in Zone 1 (Fan Village), and deploy riot barriers."
              : "Keep all 8 gate banks operating at maximum throughput."
          };
        }
      }

      case "q_gate_critical": {
        const gates = Object.values(state.gates);
        const criticalGate = gates.reduce((prev, curr) => (curr.queue > prev.queue ? curr : prev), gates[0]);
        const isCritical = criticalGate.status === "CRITICAL" || criticalGate.queue > 350;

        return {
          title: `Gate Telemetry: ${criticalGate.name}`,
          badge: criticalGate.status,
          color: isCritical ? "#ef4444" : "#10b981",
          answer: isCritical
            ? `${criticalGate.name} is experiencing extreme surge overload with a queue of ${Math.round(criticalGate.queue)} people (${criticalGate.utilization}% utilization) due to the 125k crowd influx.`
            : `All 8 gates are operating near capacity. Highest current load is at ${criticalGate.name} (${Math.round(criticalGate.queue)} people).`,
          metrics: [
            { label: "Gate Identifier", value: criticalGate.name.split("(")[0].trim() },
            { label: "Current Queue", value: `${Math.round(criticalGate.queue)} people` },
            { label: "Service Throughput", value: `${criticalGate.serviceRate * 60}/hr` },
            { label: "Gate Utilization", value: `${criticalGate.utilization}%` }
          ],
          recommendation: isCritical
            ? "Implement dynamic load diversion from Gate A2/B1 to Gate A1/C2 and increase security screening staff."
            : "Continue real-time gate load balancing."
        };
      }

      case "q_people_entering": {
        const inflowRate = (state.simMinute < 1250)
          ? (state.isPeakArrival ? 3400 : (state.simMinute < 960 ? 650 : 1800))
          : (state.isPeakExit ? 15 : 40);

        return {
          title: "Real-Time Inflow Telemetry (125k Event)",
          badge: `${inflowRate} / MIN`,
          color: "#10b981",
          answer: `Currently, approximately ${inflowRate.toLocaleString()} people per minute are entering through the 8 perimeter gates. Total entries to date: ${state.totalEntries.toLocaleString()} of 125,000.`,
          metrics: [
            { label: "Current Inflow Rate", value: `${inflowRate} / min` },
            { label: "Completed Entries", value: state.totalEntries.toLocaleString() },
            { label: "Expected vs Actual", value: "100k Expected / 125k Actual" }
          ],
          recommendation: state.isPeakArrival
            ? "Operate all 8 gate turnstile banks at 100% throughput capacity."
            : "Inflow pacing nominal."
        };
      }

      case "q_people_leaving": {
        const outflowRate = (state.simMinute >= 1370)
          ? (state.isPeakExit ? 4200 : (state.simMinute >= 1470 ? 950 : 1900))
          : 30;

        return {
          title: "Real-Time Egress Telemetry (125k Event)",
          badge: `${outflowRate} / MIN`,
          color: "#f43f5e",
          answer: `Currently, approximately ${outflowRate.toLocaleString()} people per minute are exiting the stadium complex. Total exits to date: ${state.totalExits.toLocaleString()} of 125,000.`,
          metrics: [
            { label: "Egress Velocity", value: `${outflowRate} / min` },
            { label: "Completed Exits", value: state.totalExits.toLocaleString() },
            { label: "Remaining in Stadium", value: state.currentOccupancy.toLocaleString() }
          ],
          recommendation: state.isPeakExit
            ? "Deploy crowd control marshals to West Metro Hub and prioritize outward traffic signals for outbound ring roads."
            : "Nominal exit pacing observed."
        };
      }

      case "q_highest_density_zone": {
        const zones = Object.values(state.zones);
        const topZone = zones.reduce((prev, curr) => (curr.density > prev.density ? curr : prev), zones[0]);

        return {
          title: `Highest Crowd Density: ${topZone.name}`,
          badge: `${topZone.density}% DENSITY`,
          color: topZone.status === "CRITICAL" ? "#ef4444" : topZone.status === "HIGH" ? "#f97316" : "#eab308",
          answer: `${topZone.name} has the highest crowd density at ${topZone.density}% with ${topZone.currentCount.toLocaleString()} occupants (holding overflow from the 125k crowd).`,
          metrics: [
            { label: "Zone Name", value: topZone.name.split(":")[0] },
            { label: "Occupancy Count", value: `${topZone.currentCount.toLocaleString()} / ${topZone.capacity.toLocaleString()}` },
            { label: "Safety Status", value: topZone.status }
          ],
          recommendation: topZone.density > 75
            ? "Implement temporary crowd metering barriers to prevent localized crush hazards."
            : "Zone density flowing within nominal safety margins."
        };
      }

      case "q_parking_remaining": {
        const totalCapacity = 16000;
        const occupied = state.totalVehicles;
        const available = Math.max(0, totalCapacity - occupied);

        return {
          title: "Parking Capacity (16,000 Total Spaces across P1–P8)",
          badge: `${available.toLocaleString()} SPACES REMAINING`,
          color: (state.parkingOccupancyPct > 85) ? "#ef4444" : (state.parkingOccupancyPct > 65) ? "#f97316" : "#10b981",
          answer: `Total parking across sectors P1–P8 is at ${state.parkingOccupancyPct}% occupancy. There are ${available.toLocaleString()} available vehicle spaces out of ${totalCapacity.toLocaleString()} capacity.`,
          metrics: [
            { label: "Occupied Spaces", value: occupied.toLocaleString() },
            { label: "Available Spaces", value: available.toLocaleString() },
            { label: "Parking Occupancy", value: `${state.parkingOccupancyPct}%` }
          ],
          recommendation: available < 2000
            ? "Activate electronic VMS road displays directing incoming vehicles to overflow parking."
            : "Adequate parking reserve available."
        };
      }

      case "q_parking_congested": {
        const parks = Object.values(state.parkingSections);
        const maxPark = parks.reduce((prev, curr) => (curr.utilization > prev.utilization ? curr : prev), parks[0]);

        return {
          title: `Most Congested Parking Sector: ${maxPark.name}`,
          badge: `${maxPark.utilization}% FULL`,
          color: maxPark.utilization >= 90 ? "#ef4444" : maxPark.utilization >= 75 ? "#f97316" : "#38bdf8",
          answer: `${maxPark.name} is currently the most filled parking sector at ${maxPark.utilization}% occupancy (${maxPark.occupied}/${maxPark.capacity} slots) with a queue of ${maxPark.queue} vehicles.`,
          metrics: [
            { label: "Sector Name", value: maxPark.name.split("(")[0].trim() },
            { label: "Vehicle Queue", value: `${maxPark.queue} vehicles` },
            { label: "Status", value: maxPark.status }
          ],
          recommendation: maxPark.utilization >= 85
            ? "Close sector approach ramp and redirect vehicles to South & West parking sectors."
            : "Balance incoming traffic across peripheral lanes."
        };
      }

      case "q_current_bottleneck":
      default: {
        let bottleneckType = "NONE";
        let bottleneckName = "System Nominal";
        let severity = "LOW";
        let desc = "All 8 blocks, 4 zones, 8 gates, and 8 parking sectors operating smoothly.";

        if (state.overflowCount > 10000) {
          bottleneckType = "STADIUM CAPACITY EXCEEDED (+25k OVERFLOW)";
          bottleneckName = "Outer Concourse Zones 1–4 & Gate Turnstiles";
          severity = "CRITICAL";
          desc = `125,000 attendees arrived when only 100,000 were expected! Stadium is 100% full, and an overflow of ${state.overflowCount.toLocaleString()} attendees is trapped in the perimeter concourse.`;
        } else if (state.isPeakExit) {
          bottleneckType = "MIDNIGHT EGRESS ARTERIES & PARKING OUTLETS";
          bottleneckName = "South Boulevard (Zone 3) & P5/P6 Outlets";
          severity = "CRITICAL";
          desc = "125,000 attendees simultaneously emptying from 8 Blocks and converging on exit turnstiles and parking exit booms.";
        } else if (state.isPeakArrival) {
          bottleneckType = "GATE ENTRY & NORTH CONCOURSE";
          bottleneckName = "Gate A2 (NE Express) & Gate B1";
          severity = "CRITICAL";
          desc = "Arrival surge of 3,400+ people/min creating queues at Gate A2 and filling parking sectors to 95%.";
        }

        return {
          title: `Primary System Bottleneck: ${bottleneckName}`,
          badge: severity,
          color: severity === "CRITICAL" ? "#ef4444" : severity === "HIGH" ? "#f97316" : "#10b981",
          answer: desc,
          metrics: [
            { label: "Identified Vector", value: bottleneckType },
            { label: "Severity Level", value: severity },
            { label: "Crisis Factor", value: isSurge ? "+25,000 Unplanned Attendees" : "Nominal Planning" }
          ],
          recommendation: state.overflowCount > 10000
            ? "Open auxiliary concourse gates, activate public address system for fan village live broadcast, and seal turnstiles."
            : (state.isPeakExit ? "Synchronize traffic lights for 100% outbound green wave." : "Balance gate loads.")
        };
      }
    }
  }
}
