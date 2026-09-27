# 🏟️ EventFlow (Tech Titans) — Real-Time Crowd Orchestration & Stadium Operations Ecosystem

[![GitHub Repo](https://img.shields.io/badge/GitHub-TechTitans--EventFlow-181717?style=for-the-badge&logo=github)](https://github.com/PrathameshDaph/TechTitans-EventFlow)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/PrathameshDaph/TechTitans-EventFlow)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com/deploy?repo=https://github.com/PrathameshDaph/TechTitans-EventFlow)

---

## 🌟 Overview

**EventFlow** is an intelligent, full-stack stadium orchestration, live crowd telemetry, and emergency response management platform built by **Tech Titans**. It unites stadium managers, field crew, and fans into a single reactive real-time loop.

---

## 🏗️ Monorepo Architecture

```
TECH TITANS/
├── HACHCELESTIAL Landing Page/   # 🌐 3D EventFlow Experience & Interactive Portal (React 19, Three.js, Vite)
├── manager dash/                 # 📊 Operations Manager Command Center (React, TypeScript, Recharts, Leaflet)
├── server/                       # 📡 Real-Time WebSocket & REST API Hub (Node.js, Express, ws)
├── What if ANALYSIS/             # 🔮 Digital Twin Simulation Engine (Vite, Standalone Twin)
├── weather ai analysis/          # 🌦️ Predictive Weather Impact Twin (React, AI telemetry)
├── ALLin - user app/             # 📱 Fan & Attendee Mobile Experience (Flutter/Dart)
└── CREW_IT - crew app/           # 👷 Ground Crew Operations Dispatch (Flutter/Dart)
```

---

## 🚀 Instant Deployment Guide

### Option 1: Deploy to Vercel (Frontends)

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import the repository: `https://github.com/PrathameshDaph/TechTitans-EventFlow`
3. **Deploy Manager Dashboard**:
   - **Root Directory**: Select `manager dash`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: `VITE_API_URL=https://your-backend-url.onrender.com/api`
4. **Deploy Landing Page**:
   - Create another project in Vercel, select the same repo, and set **Root Directory** to `HACHCELESTIAL Landing Page`.

---

### Option 2: Deploy Full-Stack to Render (Backend + Frontends)

1. Connect your GitHub account to [Render](https://dashboard.render.com).
2. Click **New +** -> **Blueprint**.
3. Select `PrathameshDaph/TechTitans-EventFlow`.
4. Render will automatically detect [`render.yaml`](./render.yaml) and provision:
   - `eventflow-backend` (Node.js API + WebSocket server)
   - `eventflow-manager-dashboard` (Static React SPA)
   - `eventflow-landing` (Static Landing Page)

---

## 💻 Local Development Setup

### 1. Install & Start Backend Server
```bash
node server/index.js
# Backend runs at http://localhost:8000 (WebSocket: ws://localhost:8000/ws)
```

### 2. Start Manager Dashboard
```bash
cd "manager dash"
npm install
npm run dev
# Dashboard runs at http://localhost:5174
```

### 3. Start Landing Page
```bash
cd "HACHCELESTIAL Landing Page"
npm install
npm run dev
# Landing portal runs at http://localhost:5173
```

### 4. Start What-If Digital Twin Simulation
```bash
cd "What if ANALYSIS"
npm install
npm run dev
# Simulation runs at http://localhost:8080
```

---

## 🛡️ Key Capabilities
- **Live Crowd Heatmaps & Telemetry**: Dynamic gate density and capacity tracking.
- **Dynamic Emergency Routing**: Immediate evacuation pathway computing and broadcast.
- **Incident Dispatch Matrix**: Direct crew task assignment and status tracking.
- **Fan Broadcasts & Alerts**: Instant zone-targeted push notifications.
- **Predictive What-If Twin**: Real-time simulation of gate blockages, surges, and weather impacts.

---
**Crafted with pride by Tech Titans**
