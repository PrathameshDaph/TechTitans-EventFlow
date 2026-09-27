import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LogIn, ChevronRight } from 'lucide-react';

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

const HUBS = [
  { name: 'Mumbai (Event Node)', lat: 19.0760, lon: 72.8777, isTarget: true },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Frankfurt', lat: 50.1109, lon: 8.6821 },
];

export default function HeroGlobe({ onLoginClick }) {
  const mountRef = useRef(null);
  const sceneStateRef = useRef({
    globe: null,
    camera: null,
    mouseOffset: { x: 0, y: 0 }
  });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const normX = (clientX / window.innerWidth) * 2 - 1;
    const normY = -(clientY / window.innerHeight) * 2 + 1;
    sceneStateRef.current.mouseOffset = { x: normX * 0.18, y: normY * 0.18 };
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0608, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.5);
    sceneStateRef.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Starfield Background (Warm rose-tinted space dust)
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 25 + Math.random() * 40;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      starCoords[i] = radius * Math.sin(phi) * Math.cos(theta);
      starCoords[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starCoords[i + 2] = radius * Math.cos(phi);
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xc4a3ae,
      size: 0.65,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Globe with Texture
    const globeRadius = 2.0;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('/assets/earth-night.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
    });

    const globeMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.75,
      metalness: 0.15,
      emissive: new THREE.Color(0x1a0a12),
      emissiveIntensity: 0.35,
      bumpScale: 0.05
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    sceneStateRef.current.globe = globe;

    // Outer Atmosphere Glow in Rose Gold
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.05, 48, 48);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.88, 0.55, 0.64, 1.0) * intensity * 0.95;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Harmonized Lighting (Warm Rose Gold and Champagne)
    const ambientLight = new THREE.AmbientLight(0x220f18, 1.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xf4c2ce, 2.6);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const warmLight = new THREE.PointLight(0xa64d67, 2.0, 15);
    warmLight.position.set(-6, -2, 4);
    scene.add(warmLight);

    // Hub Markers and 3D Bezier Arcs in Rose Gold
    const hubMarkersGroup = new THREE.Group();
    globe.add(hubMarkersGroup);

    const targetHub = HUBS[0]; // Mumbai
    const targetPos = latLonToVector3(targetHub.lat, targetHub.lon, globeRadius);

    const curvesList = [];
    const particlesData = [];

    HUBS.forEach((hub, idx) => {
      const pos = latLonToVector3(hub.lat, hub.lon, globeRadius);

      const nodeGeo = new THREE.SphereGeometry(hub.isTarget ? 0.045 : 0.025, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: hub.isTarget ? 0xf7d6de : 0xd97d97
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      hubMarkersGroup.add(nodeMesh);

      const ringGeo = new THREE.RingGeometry(0.04, 0.07, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hub.isTarget ? 0xe294aa : 0xa64d67,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      hubMarkersGroup.add(ringMesh);

      if (!hub.isTarget) {
        const mid = new THREE.Vector3().addVectors(pos, targetPos).multiplyScalar(0.5);
        const distance = pos.distanceTo(targetPos);
        const elevation = 1.0 + distance * 0.35;
        mid.normalize().multiplyScalar(globeRadius * elevation);

        const curve = new THREE.QuadraticBezierCurve3(pos, mid, targetPos);
        curvesList.push(curve);

        const curvePoints = curve.getPoints(50);
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const curveMaterial = new THREE.LineBasicMaterial({
          color: idx % 2 === 0 ? 0xe294aa : 0xc06c84,
          transparent: true,
          opacity: 0.5
        });
        const curveLine = new THREE.Line(curveGeometry, curveMaterial);
        hubMarkersGroup.add(curveLine);

        for (let p = 0; p < 4; p++) {
          particlesData.push({
            curve: curve,
            progress: (p / 4) + Math.random() * 0.1,
            speed: 0.003 + Math.random() * 0.003,
            color: 0xf7d6de
          });
        }
      }
    });

    const pulseCount = particlesData.length;
    const pulseGeo = new THREE.BufferGeometry();
    const pulsePosArray = new Float32Array(pulseCount * 3);
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePosArray, 3));

    const pulseMat = new THREE.PointsMaterial({
      color: 0xf7d6de,
      size: 0.07,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const pulseSystem = new THREE.Points(pulseGeo, pulseMat);
    hubMarkersGroup.add(pulseSystem);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      globe.rotation.y += 0.0022;

      const mouse = sceneStateRef.current.mouseOffset;
      camera.position.x += (mouse.x - camera.position.x) * 0.05;
      camera.position.y += (mouse.y - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      const positions = pulseGeo.attributes.position.array;
      for (let i = 0; i < pulseCount; i++) {
        const p = particlesData[i];
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const pt = p.curve.getPoint(p.progress);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
      pulseGeo.attributes.position.needsUpdate = true;

      hubMarkersGroup.children.forEach((child) => {
        if (child.geometry instanceof THREE.RingGeometry) {
          const scale = 1 + Math.sin(elapsed * 4) * 0.25;
          child.scale.set(scale, scale, 1);
        }
      });

      atmosphere.scale.setScalar(1.04 + Math.sin(elapsed * 2) * 0.008);
      starField.rotation.y = elapsed * 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
    };
  }, []);

  return (
    <section 
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0608]"
    >
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 opacity-100"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center justify-center pt-20">
        
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-[#d97d97]/30 text-xs font-mono text-[#e294aa] mb-6 shadow-lg shadow-black/60">
          <span className="w-2 h-2 rounded-full bg-[#d97d97] animate-ping" />
          <span>AUTONOMOUS ORCHESTRATION ENGINE</span>
          <span className="text-stone-500">|</span>
          <span className="text-stone-400 font-sans">Event Flow Active</span>
        </div>

        {/* Hero Title in 'Alice' font */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal tracking-wide text-white uppercase drop-shadow-2xl font-['Alice',serif] leading-tight">
          EVENTS <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-[#f7d6de] via-[#e294aa] to-white bg-clip-text text-transparent">
            ORCHESTRATED
          </span>
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-stone-300 font-light tracking-wide max-w-xl">
          Intelligent coordination for events at scale.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={onLoginClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#d97d97] via-[#a64d67] to-[#5c2a35] hover:from-[#e294aa] hover:to-[#7a3444] text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-xl shadow-[#a64d67]/30 hover:shadow-[#d97d97]/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <LogIn className="w-4 h-4 text-[#f7d6de] group-hover:translate-x-0.5 transition-transform" />
            <span>Log In</span>
            <ChevronRight className="w-4 h-4 text-[#f7d6de] group-hover:translate-x-1 transition-transform" />
          </button>

          <a 
            href="#flow-pipeline"
            className="w-full sm:w-auto px-7 py-4 rounded-xl glass-panel hover:bg-stone-900/60 border border-stone-800 hover:border-[#d97d97]/50 text-stone-200 hover:text-white font-medium text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Explore Flow</span>
          </a>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0a0608] to-transparent pointer-events-none z-10" />
    </section>
  );
}
