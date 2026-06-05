import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCRMStore } from '@/store/crmStore';
import { Cpu, AlertTriangle, Wind, ShieldAlert, Activity } from 'lucide-react';

export default function Twin3D() {
  const mountRef = useRef(null);
  const tickets = useCRMStore(state => state.tickets);
  const addTicket = useCRMStore(state => state.addTicket);

  const [windSpeed, setWindSpeed] = useState(24); // km/h
  const [seismicActivity, setSeismicActivity] = useState(0.0); // Richters
  const [activeLayer, setActiveLayer] = useState('Stress Heatmap');
  const [selectedNode, setSelectedNode] = useState(null);

  // Reference variables to interact with Three.js scene from react controls
  const windRef = useRef(windSpeed);
  const seismicRef = useRef(seismicActivity);
  const layerRef = useRef(activeLayer);

  useEffect(() => {
    windRef.current = windSpeed;
  }, [windSpeed]);

  useEffect(() => {
    seismicRef.current = seismicActivity;
  }, [seismicActivity]);

  useEffect(() => {
    layerRef.current = activeLayer;
  }, [activeLayer]);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE, CAMERA, RENDERER setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050816);
    scene.fog = new THREE.FogExp2(0x050816, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 25, 65);
    camera.lookAt(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // LIGHTING setup (futuristic metallic/orange accents)
    const ambientLight = new THREE.AmbientLight(0x0d162d, 2.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xea580c, 2.0);
    dirLight1.position.set(20, 40, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7b61ff, 1.5);
    dirLight2.position.set(-20, 20, -20);
    scene.add(dirLight2);

    // PROCEDURAL BRIDGE MODELING
    const bridgeGroup = new THREE.Group();
    scene.add(bridgeGroup);

    // Bridge Deck (Slab)
    const deckGeo = new THREE.BoxGeometry(100, 1.5, 8);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x111b30,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = 10;
    bridgeGroup.add(deck);

    // Bridge Grid / Guidelines (Futuristic hologram style)
    const gridHelper = new THREE.GridHelper(120, 40, 0xea580c, 0x0b1224);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Support Pillars & Stress Nodes
    const pillars = [];
    const pillarPositions = [-40, -20, 0, 20, 40];
    const nodeMeshes = [];

    pillarPositions.forEach((x, index) => {
      // Pillar cylinder
      const pHeight = 10;
      const pillarGeo = new THREE.CylinderGeometry(1.2, 1.6, pHeight, 16);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: index === 2 ? 0xff4d6d : 0x00ffb2, // Center pillar Pillar B-12 stressed
        roughness: 0.1,
        metalness: 0.9,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, pHeight / 2, 0);
      bridgeGroup.add(pillar);
      pillars.push(pillar);

      // Spherical Interactive Stress Node at top of each pillar
      const nodeGeo = new THREE.SphereGeometry(1.5, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: index === 2 ? 0xff4d6d : 0x00ffb2, // Pillar B-12 (index 2) is red
        transparent: true,
        opacity: 0.85,
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(x, 10.8, 0);
      node.userData = {
        name: `Support Node P-${index + 10}`,
        stress: index === 2 ? '94%' : `${60 + index * 5}%`,
        status: index === 2 ? 'CRITICAL STRESS' : 'HEALTHY',
        vibration: '0.12 mm/s',
      };
      bridgeGroup.add(node);
      nodeMeshes.push(node);
    });

    // Pylon & Cabling system (Suspension Bridge design)
    const pylonGeo = new THREE.CylinderGeometry(0.8, 1.2, 25, 8);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x0b1224, metalness: 0.9, roughness: 0.1 });
    
    // Left Pylon
    const pylonL = new THREE.Mesh(pylonGeo, pylonMat);
    pylonL.position.set(-30, 20, 0);
    bridgeGroup.add(pylonL);
    
    // Right Pylon
    const pylonR = new THREE.Mesh(pylonGeo, pylonMat);
    pylonR.position.set(30, 20, 0);
    bridgeGroup.add(pylonR);

    // Particle Traffic flow (flowing lights)
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = [];

    for (let i = 0; i < particleCount; i++) {
      // position particles along bridge deck length
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = 11; // just above deck
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6; // random lanes

      colors[i * 3] = 1.0;     // R
      colors[i * 3 + 1] = 0.35; // G (Orange)
      colors[i * 3 + 2] = 0.0;  // B

      speeds.push(0.1 + Math.random() * 0.15);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const trafficParticles = new THREE.Points(particleGeo, particleMat);
    bridgeGroup.add(trafficParticles);

    // ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Retrieve dynamic parameters from React state refs
      const wind = windRef.current;
      const seismic = seismicRef.current;
      const layer = layerRef.current;

      // 1. Procedural Wind sway & vibrations
      const windAmplitude = (wind / 120) * 0.4;
      const windFreq = time * 3.5;
      deck.position.z = Math.sin(windFreq) * windAmplitude;

      // 2. Procedural Seismic deflection (Earthquake load)
      if (seismic > 0) {
        const shake = Math.sin(time * 25) * (seismic * 0.35);
        bridgeGroup.position.x = shake;
        bridgeGroup.position.y = Math.cos(time * 20) * (seismic * 0.15);
        
        // Dynamically color pillars to dangerous red as load spikes
        nodeMeshes.forEach(n => {
          n.material.color.setHex(0xff4d6d);
        });
      } else {
        // Reset base colors according to active layer
        bridgeGroup.position.set(0, 0, 0);
        nodeMeshes.forEach((n, idx) => {
          if (layer === 'Stress Heatmap') {
            n.material.color.setHex(idx === 2 ? 0xff4d6d : 0x00ffb2);
          } else if (layer === 'Corrosion Overlay') {
            n.material.color.setHex(idx === 4 ? 0xff9f43 : 0xea580c);
          } else {
            n.material.color.setHex(0xea580c); // Raw telemetry
          }
        });
      }

      // 3. Update Traffic Flowing particles
      const posArr = trafficParticles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += speeds[i]; // Move forward along X-axis
        
        // Loop back when particle falls off edge
        if (posArr[i * 3] > 50) {
          posArr[i * 3] = -50;
        }

        // Apply wind deflection to vehicles
        posArr[i * 3 + 2] += Math.sin(time + i) * (windAmplitude * 0.05);
      }
      trafficParticles.geometry.attributes.position.needsUpdate = true;

      // Rotating pylons subtly to feel premium/dynamic
      pylonL.rotation.y = time * 0.05;
      pylonR.rotation.y = time * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // INTERACTION setup (Raycaster to select bridge nodes)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const clickedNode = intersects[0].object;
        setSelectedNode(clickedNode.userData);
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // HANDLE RESIZE
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const currentMount = mountRef.current;

    return () => {
      if (renderer && renderer.domElement && currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Quick failure simulation triggers (inserts ticket)
  const triggerCollapseAnomaly = () => {
    addTicket({
      accountId: 'acc-1',
      title: 'Structural Integrity Degradation (Seismic Load)',
      severity: 'CRITICAL',
      assetName: 'Bandra-Worli Bridge Segment 4',
      confidence: 96.5,
    });
  };

  return (
    <div className="h-full flex flex-col glass-panel rounded-[8px]-xl overflow-hidden border border-[#ea580c]/10 bg-primary-bg/70">
      {/* 3D Render Frame */}
      <div className="flex-1 min-h-[350px] relative" ref={mountRef}>
        
        {/* Layer Toggles Floating Overlay */}
        <div className="absolute top-4 left-4 z-20 flex gap-2 font-mono text-[12px]">
          {['Stress Heatmap', 'Corrosion Overlay', 'Sensor Array'].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded-[8px]-md border ${
                activeLayer === layer 
                  ? 'bg-[#ea580c]/20 text-[#ea580c] border-[#ea580c]/50 neon-glow-orange' 
                  : 'bg-black/60 text-metallic-gray border-white/10 hover:text-white-text'
              }`}
            >
              {layer.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Selected Sensor Diagnostics details */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-20 w-64 p-3 rounded-[8px]-lg glass-panel bg-black/85 border-[#ea580c]/30 font-mono text-xs animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
              <span className="text-[#ea580c] font-bold flex items-center gap-1"><Cpu className="h-3.5 w-3.5" /> telemetry</span>
              <button onClick={() => setSelectedNode(null)} className="text-metallic-gray hover:text-white">&times;</button>
            </div>
            <p className="text-white-text font-bold mb-1">{selectedNode.name}</p>
            <div className="space-y-1 text-metallic-gray text-[12px]">
              <div className="flex justify-between">
                <span>STRESS LEVEL:</span>
                <span className={selectedNode.status === 'CRITICAL STRESS' ? 'text-danger-red font-bold' : 'text-success-green'}>
                  {selectedNode.stress}
                </span>
              </div>
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className={selectedNode.status === 'CRITICAL STRESS' ? 'text-danger-red font-bold animate-pulse' : 'text-success-green'}>
                  {selectedNode.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VIBRATION:</span>
                <span className="text-white-text">{selectedNode.vibration}</span>
              </div>
            </div>
            {selectedNode.status === 'CRITICAL STRESS' && (
              <button 
                onClick={triggerCollapseAnomaly}
                className="w-full mt-3 py-1 bg-danger-red/20 text-danger-red border border-danger-red/40 hover:bg-danger-red/35 rounded-[8px] text-[12px] uppercase font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <ShieldAlert className="h-3 w-3" /> Log Critical Ticket
              </button>
            )}
          </div>
        )}

        {/* Dynamic Watermark HUD */}
        <div className="absolute bottom-4 left-4 z-20 font-mono text-[12px] text-metallic-gray/70 space-y-0.5">
          <p>OBJECT TYPE: PROTOTYPICAL SUSPENSION CABLE BRIDGE</p>
          <p>COORDINATE SYST: WGS-84 | CHENNAI PORT HUDS</p>
          <p>ENGINE: WEBGL | THREE.JS 3D TWIN RENDERER</p>
        </div>
      </div>

      {/* Physics Deflection simulation control panel */}
      <div className="p-4 border-t border-[#ea580c]/10 bg-secondary-bg/90 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        
        {/* Wind sway slider */}
        <div>
          <div className="flex justify-between text-metallic-gray mb-1.5">
            <span className="flex items-center gap-1"><Wind className="h-3.5 w-3.5 text-[#ea580c]" /> WIND FORCE SIM</span>
            <span className="text-[#ea580c]">{windSpeed} km/h</span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            value={windSpeed}
            onChange={(e) => setWindSpeed(Number(e.target.value))}
            className="w-full h-1 bg-black/60 rounded-[8px]-lg appearance-none cursor-pointer accent-orange-600"
          />
          <div className="flex justify-between text-[12px] text-metallic-gray/50 mt-1">
            <span>0 km/h (CALM)</span>
            <span>180 km/h (GALE)</span>
          </div>
        </div>

        {/* Earthquake load slider */}
        <div>
          <div className="flex justify-between text-metallic-gray mb-1.5">
            <span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5 text-alert-orange" /> SEISMIC LOAD</span>
            <span className="text-alert-orange">{seismicActivity.toFixed(1)} Richter</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="8.0"
            step="0.5"
            value={seismicActivity}
            onChange={(e) => setSeismicActivity(Number(e.target.value))}
            className="w-full h-1 bg-black/60 rounded-[8px]-lg appearance-none cursor-pointer accent-alert-orange"
          />
          <div className="flex justify-between text-[12px] text-metallic-gray/50 mt-1">
            <span>0.0 (STEADY)</span>
            <span>8.0 (DEVASTATING)</span>
          </div>
        </div>

        {/* Diagnostics options */}
        <div className="flex flex-col justify-center">
          <p className="text-[12px] text-metallic-gray uppercase tracking-wider mb-2 font-bold flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-danger-red animate-pulse" /> SIMULATION DEGRADATION
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => { setWindSpeed(150); setSeismicActivity(0); }}
              className="flex-1 py-1.5 bg-[#ea580c]/10 hover:bg-[#ea580c]/20 border border-[#ea580c]/30 rounded-[8px] text-[12px] font-bold text-white transition-colors"
            >
              TYPHOON SWAY
            </button>
            <button 
              onClick={() => { setSeismicActivity(6.5); setWindSpeed(10); }}
              className="flex-1 py-1.5 bg-danger-red/10 hover:bg-danger-red/20 border border-danger-red/30 rounded-[8px] text-[12px] font-bold text-white transition-colors"
            >
              SEISMIC SHAKE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
