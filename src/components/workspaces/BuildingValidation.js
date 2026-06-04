'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useCRMStore } from '@/store/crmStore';
import { 
  Activity, 
  Cpu, 
  Layers, 
  Sigma, 
  Upload, 
  Play, 
  Check, 
  AlertTriangle, 
  Clock, 
  Sliders, 
  ShieldAlert, 
  Wrench,
  FileText
} from 'lucide-react';

function LevelCard({ icon: Icon, title, children, className = '', headerAction = null, footerText = null }) {
  return (
    <div className={`zoho-card flex flex-col ${className}`}>
      <div className="zoho-card-header">
        {Icon && <Icon className="h-4 w-4 text-gray-700 flex-shrink-0" />}
        <span className="font-bold text-gray-800 text-[10.5px] uppercase tracking-wide">{title}</span>
        {headerAction && <div className="ml-auto flex-shrink-0">{headerAction}</div>}
      </div>
      <div className="zoho-card-body space-y-4 flex-1 flex flex-col justify-between">
        {children}
      </div>
      {footerText && (
        <div className="zoho-card-footer">
          <span className="text-gray-500 font-semibold text-[9px] uppercase tracking-normal">{footerText}</span>
        </div>
      )}
    </div>
  );
}

export default function BuildingValidation({ selectedElement, setSelectedElement }) {
  const addTicket = useCRMStore(state => state.addTicket);
  const mountRef = useRef(null);

  // 1. Manual Parameter Inputs State
  const [buildingType, setBuildingType] = useState('Commercial'); // Residential, Commercial, Industrial
  const [floors, setFloors] = useState(5); // 1 to 15 floors
  const [floorHeight, setFloorHeight] = useState(3.5); // 3.0m - 4.5m
  const [soilType, setSoilType] = useState('Clay'); // Hard Rock, Sandy Soil, Clay, Silt
  const [seismicZone, setSeismicZone] = useState('Zone IV'); // Zone II, Zone III, Zone IV, Zone V
  const [concreteGrade, setConcreteGrade] = useState('M25'); // M20, M25, M30, M40
  const [beamDepth, setBeamDepth] = useState(500); // 300mm - 800mm
  const [columnWidth, setColumnWidth] = useState(450); // 300mm - 800mm
  const [liveLoad, setLiveLoad] = useState(4.0); // 1.5 - 10.0 kN/m²
  const [deadLoad, setDeadLoad] = useState(5.5); // 3.0 - 15.0 kN/m²

  // 2. File Upload List State (Simulated BIM/CAD ingestion)
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isScanningFile, setIsScanningFile] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // 3. View Port View Modes
  // 'Normal', 'Skeleton', 'Stress Heatmap', 'Load Flow', 'Crack Prediction', 'Corrosion', 'Seismic', 'Wind', 'Flood', 'Fire', 'X-Ray'
  const [viewMode, setViewMode] = useState('Stress Heatmap');

  // 4. Simulation sliders
  const [earthquakeMagnitude, setEarthquakeMagnitude] = useState(0.0); // 0.0 to 9.0 Richter
  const [windSpeed, setWindSpeed] = useState(15); // km/h
  const [floodHeight, setFloodHeight] = useState(0); // 0m to 8m depth
  const [fireTemp, setFireTemp] = useState(25); // 25°C to 1000°C temperature
  const [timeProgression, setTimeProgression] = useState('Present'); // Present, +1 Year, +5 Years, +10 Years, +25 Years

  // 5. Calculations Logs
  const [calculationFeed, setCalculationFeed] = useState([
    { id: 1, type: 'SYS', text: 'AI Validation Engine initialized in Standby mode.' }
  ]);

  // Three.js animation references
  const viewModeRef = useRef(viewMode);
  const floorsRef = useRef(floors);
  const heightRef = useRef(floorHeight);
  const magnitudeRef = useRef(earthquakeMagnitude);
  const windRef = useRef(windSpeed);
  const floodRef = useRef(floodHeight);
  const fireRef = useRef(fireTemp);
  const timeRef = useRef(timeProgression);
  const colWidthRef = useRef(columnWidth);

  useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);
  useEffect(() => { floorsRef.current = floors; }, [floors]);
  useEffect(() => { heightRef.current = floorHeight; }, [floorHeight]);
  useEffect(() => { magnitudeRef.current = earthquakeMagnitude; }, [earthquakeMagnitude]);
  useEffect(() => { windRef.current = windSpeed; }, [windSpeed]);
  useEffect(() => { floodRef.current = floodHeight; }, [floodHeight]);
  useEffect(() => { fireRef.current = fireTemp; }, [fireTemp]);
  useEffect(() => { timeRef.current = timeProgression; }, [timeProgression]);
  useEffect(() => { colWidthRef.current = columnWidth; }, [columnWidth]);

  // Engineering Calculations Engine
  // Young's modulus approximation based on Concrete strength (GPa)
  const getModulusOfElasticity = () => {
    switch (concreteGrade) {
      case 'M20': return 22.3;
      case 'M25': return 25.0;
      case 'M30': return 27.3;
      case 'M40': return 31.6;
      default: return 25.0;
    }
  };

  const calculateStructuralMetrics = () => {
    // Thermal concrete weakening factor: Concrete begins losing capacity above 200°C
    const thermalReduction = fireTemp > 200 ? Math.max(0.15, 1 - (fireTemp - 200) / 940) : 1.0;
    const E = getModulusOfElasticity() * thermalReduction; // GPa under thermal stress
    const I = (Math.pow(columnWidth / 1000, 4) / 12); // column moment of inertia m⁴
    const H = floorHeight; // m
    const P = (liveLoad + deadLoad) * 35; // Total column load estimate in kN
    
    // Euler Buckling Load: P_cr = (pi² * E * I) / (KL)² where K=1 (hinged columns approximation)
    const E_Pa = E * 1e9;
    const P_cr = (Math.PI * Math.PI * E_Pa * I) / Math.pow(H, 2) / 1000; // in kN

    // Deflection under wind/seismic bending stress (mm estimate)
    const deflection = Math.max(0.1, (windSpeed * Math.pow(H, 3) * 1000) / (3 * E_Pa * I * 100000)).toFixed(2);

    // Stress = F / Area
    const area = Math.pow(columnWidth / 1000, 2);
    const stress = (P / area / 1000).toFixed(2); // MPa

    // Soil Bearing Limit Penalty - saturated/flooded soil loses up to 50% capacity
    const saturationFactor = floodHeight > 1.5 ? Math.max(0.45, 1 - (floodHeight * 0.08)) : 1.0;
    let soilFactor = 250; // kN/m² limit
    if (soilType === 'Clay') soilFactor = 120;
    if (soilType === 'Silt') soilFactor = 75;
    if (soilType === 'Hard Rock') soilFactor = 600;
    soilFactor = soilFactor * saturationFactor;

    const foundationPressure = (P * floors) / (area * 9); // multi-column distribution
    const bearingSafetyFactor = (soilFactor / (foundationPressure || 1)).toFixed(2);

    // Health Score calculation
    let baseScore = 98;
    if (bearingSafetyFactor < 1.0) baseScore -= 18;
    if (bearingSafetyFactor < 0.6) baseScore -= 12;
    if (deflection > 15) baseScore -= 12;
    if (P > P_cr * 0.4) baseScore -= 15;
    if (seismicZone === 'Zone V' && concreteGrade === 'M20') baseScore -= 10;
    if (timeProgression === '+10 Years') baseScore -= 8;
    if (timeProgression === '+25 Years') baseScore -= 18;
    
    // Thermal disaster penalties
    if (fireTemp > 100) baseScore -= Math.min(40, (fireTemp - 100) * 0.06);
    // Flood saturation penalty
    if (floodHeight > 2.0) baseScore -= Math.min(20, floodHeight * 2.5);
    // Seismic shaking penalty
    if (earthquakeMagnitude > 4.0) baseScore -= (earthquakeMagnitude - 4) * 8;

    return {
      stressMpa: stress,
      deflectionMm: deflection,
      bucklingK_N: P_cr.toFixed(0),
      soilSafety: bearingSafetyFactor,
      healthScore: Math.max(12, Math.round(baseScore)),
      structuralLoadKn: P.toFixed(1)
    };
  };

  const metrics = calculateStructuralMetrics();

  const seismicComplianceWarning = (seismicZone === 'Zone IV' || seismicZone === 'Zone V') && (concreteGrade === 'M20' || concreteGrade === 'M25');
  const slendernessWarning = columnWidth < 450 && floors >= 8;
  const beamDeflectionWarning = beamDepth < 500 && liveLoad >= 6.0;
  const floodSaturationWarning = floodHeight > 2.0 && (soilType === 'Clay' || soilType === 'Silt');
  const thermalModulusWarning = fireTemp > 200;

  // 6. Real-time Calculation Ticker logger
  useEffect(() => {
    const logInterval = setInterval(() => {
      const formulas = [
        `CALC STRESS: σ = P/A = ${(metrics.structuralLoadKn / 1000).toFixed(2)} / ${Math.pow(columnWidth/1000, 2).toFixed(3)} = ${metrics.stressMpa} MPa`,
        `CALC DEFLECTION: δ_max = FL³ / 3EI = ${metrics.deflectionMm} mm`,
        `BUCKLING LIMIT: P_cr = π²EI / (KL)² = ${metrics.bucklingK_N} kN`,
        `SOIL BEARING SAFETY INDEX: SF_soil = ${metrics.soilSafety} (LIMIT: ${Math.round(soilType === 'Clay' ? 120 * (floodHeight > 1.5 ? Math.max(0.45, 1 - (floodHeight * 0.08)) : 1.0) : soilType === 'Silt' ? 75 * (floodHeight > 1.5 ? Math.max(0.45, 1 - (floodHeight * 0.08)) : 1.0) : 250)} kN/m²)`,
        `SEISMIC DYNAMIC MOTION: m·x'' + c·x' + k·x = F(t) // Peak Displacement: ${(metrics.deflectionMm * (1 + earthquakeMagnitude * 0.5)).toFixed(2)} mm`,
        `THERMAL CAPACITY: E(T) = E₀·[1 - (T-200)/940] = ${(getModulusOfElasticity() * (fireTemp > 200 ? Math.max(0.15, 1 - (fireTemp - 200) / 940) : 1.0)).toFixed(2)} GPa`,
        `SYS TELEMETRY: Time horizon = ${timeProgression} // View mode = ${viewMode}`
      ];
      const randomFormula = formulas[Math.floor(Math.random() * formulas.length)];
      setCalculationFeed(prev => [
        { id: Date.now(), type: 'MATH', text: randomFormula },
        ...prev.slice(0, 10)
      ]);
    }, 4500);

    return () => clearInterval(logInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, columnWidth, soilType, timeProgression, viewMode, earthquakeMagnitude, floodHeight, fireTemp]);

  // 7. Simulated CAD plan scanner
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newFile = {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'INGESTING'
    };

    setUploadedFiles(prev => [...prev, newFile]);
    setIsScanningFile(true);
    setScanProgress(0);

    // Dynamic scanner interval
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setScanProgress(progress);
      
      setCalculationFeed(prev => [
        { id: Date.now() + progress, type: 'AI_SCAN', text: `Analyzing floorplan matrix vectors ${progress}%...` },
        ...prev
      ]);

      if (progress >= 100) {
        clearInterval(interval);
        setIsScanningFile(false);
        setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'PARSED' } : f));
        
        // Auto-configure building parameters based on drawing
        setFloors(8);
        setBuildingType('Commercial');
        setConcreteGrade('M40');
        setColumnWidth(600);
        setBeamDepth(650);
        setLiveLoad(6.0);

        setCalculationFeed(prev => [
          { id: Date.now() + 200, type: 'AI_INGEST', text: `BIM Parser Success: Extracted 8 Floors, columns: 600mm, Concrete: M40.` },
          ...prev
        ]);
        alert('AI Structural Drawings Analysis Complete! Auto-loaded building parameters.');
      }
    }, 800);
  };

  // 8. Dynamic 3D Building Simulation Viewport (Three.js WebGL)
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Standard CAD Blueprint Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.FogExp2(0xffffff, 0.008);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(24, 28, 44);
    camera.lookAt(0, 8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Resize Observer for dynamic, responsive WebGL viewport scaling
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          renderer.setSize(newWidth, newHeight);
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
        }
      }
    });
    resizeObserver.observe(currentMount);

    // Monochrome Lights for engineering shadows
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight1.position.set(20, 50, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x9ca3af, 0.4);
    dirLight2.position.set(-20, 20, -20);
    scene.add(dirLight2);

    // --- High-Performance Shared Material Cache ---
    const materials = {
      normalSolid: new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.8 }),
      normalWire: new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
      rebarSolid: new THREE.MeshStandardMaterial({ color: 0xe5e7eb }),
      foundSolid: new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.9 }),
      foundWire: new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
      slabSolid: new THREE.MeshStandardMaterial({ color: 0xf9fafb, roughness: 0.95 }),
      slabWire: new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
      beamSolid: new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.85 }),
      beamWire: new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
      
      // Stress Heatmap States
      greenStress: new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.8 }),
      yellowStress: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 }),
      orangeStress: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.8 }),
      redStress: new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.8 }),
      
      // Crack Prediction States
      crackCritical: new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 }),
      crackNormal: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }),
      
      // Corrosion States
      corrodedCritical: new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.8 }),
      corrodedCaution: new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.8 }),
      corrodedNormal: new THREE.MeshStandardMaterial({ color: 0xf9fafb, roughness: 0.8 }),
      
      // Fire State
      fireNormal: new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.8 })
    };

    // 1. Dynamic Wavy Ground Soil Mesh (Seismic Plane)
    const groundGeo = new THREE.PlaneGeometry(120, 120, 30, 30);
    const groundMesh = new THREE.Mesh(groundGeo, materials.foundWire); // Share wire material
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = 0;
    scene.add(groundMesh);

    // 2. Rising Flood Water Plane
    const waterGeo = new THREE.BoxGeometry(80, 1, 80);
    const waterMat = new THREE.MeshStandardMaterial({ 
      color: 0x3b82f6, 
      transparent: true, 
      opacity: 0.45, 
      roughness: 0.1 
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -6, 0);
    scene.add(waterMesh);

    // 3. Fire Ignition / Pulsing Heat Source Node
    const fireMeshGeo = new THREE.SphereGeometry(1.2, 12, 12);
    const fireMeshMat = new THREE.MeshBasicMaterial({ 
      color: 0xef4444, 
      transparent: true, 
      opacity: 0.8 
    });
    const fireMesh = new THREE.Mesh(fireMeshGeo, fireMeshMat);
    fireMesh.position.set(0, 2.3, 0); // Positioned near center column, first floor
    scene.add(fireMesh);

    // 4. Wind Streamline Particles
    const windParticles = [];
    const windCount = 60;
    const windGeo = new THREE.SphereGeometry(0.1, 4, 4);
    const windMat = new THREE.MeshBasicMaterial({ color: 0x6b7280, transparent: true, opacity: 0.7 });
    for (let i = 0; i < windCount; i++) {
      const wp = new THREE.Mesh(windGeo, windMat);
      wp.position.set(
        Math.random() * 60 - 30,
        Math.random() * 45 + 0.6,
        Math.random() * 30 - 15
      );
      scene.add(wp);
      windParticles.push(wp);
    }

    // 5. Load Flow Downward Particles
    const flowParticles = [];
    const flowCount = 45;
    const flowGeo = new THREE.SphereGeometry(0.08, 4, 4);
    const flowMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    for (let i = 0; i < flowCount; i++) {
      const fp = new THREE.Mesh(flowGeo, flowMat);
      scene.add(fp);
      flowParticles.push(fp);
    }

    // 6. Growing 3D Jagged Crack Vector Lines
    const crackGroup = new THREE.Group();
    scene.add(crackGroup);

    // Hydrostatic pressure vector arrows list
    const hydroArrows = [];

    // Structure Assembly Group
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    // Generate physical building structural skeleton
    const pillarMeshes = [];
    const beamMeshes = [];
    const slabMeshes = [];

    const rebuildStructuralScene = (numFloors, flHeight, colW) => {
      // Clear previous group children
      while(buildingGroup.children.length > 0){ 
        buildingGroup.remove(buildingGroup.children[0]); 
      }
      pillarMeshes.length = 0;
      beamMeshes.length = 0;
      slabMeshes.length = 0;

      // 1. Foundation Base Pad Plane
      const foundGeo = new THREE.BoxGeometry(18, 0.8, 18);
      const fSolid = new THREE.Mesh(foundGeo, materials.foundSolid);
      const fWire = new THREE.Mesh(foundGeo, materials.normalWire);
      fSolid.position.y = 0.4;
      fWire.position.y = 0.4;
      fSolid.userData = {
        type: 'Foundation Base Pad',
        initialX: 0,
        initialY: 0.4,
        initialZ: 0
      };
      fWire.userData = { isWire: true };
      buildingGroup.add(fSolid, fWire);

      // Coordinates columns relative offsets
      const colCoords = [
        { x: -6, z: -6 }, { x: 0, z: -6 }, { x: 6, z: -6 },
        { x: -6, z: 0 },  { x: 0, z: 0 },  { x: 6, z: 0 },
        { x: -6, z: 6 },  { x: 0, z: 6 },  { x: 6, z: 6 }
      ];

      // Reconstruct Multi-story frame structure
      for (let f = 0; f < numFloors; f++) {
        const floorY = f * flHeight + flHeight / 2 + 0.8;
        const colRadius = (colW / 1000) * 0.9;
        const colHeight = flHeight;

        // Render Columns for this story
        colCoords.forEach((coord, idx) => {
          const colGeo = new THREE.CylinderGeometry(colRadius, colRadius * 1.05, colHeight, 8);
          
          const colSolid = new THREE.Mesh(colGeo, materials.normalSolid);
          const colWire = new THREE.Mesh(colGeo, materials.normalWire);
          colSolid.position.set(coord.x, floorY, coord.z);
          colWire.position.set(coord.x, floorY, coord.z);
          
          colWire.userData = { isWire: true };
          colSolid.userData = {
            type: 'Structural Column Pillar',
            name: `Column C-${f + 1}0${idx + 1}`,
            floor: f + 1,
            coordinates: `X: ${coord.x}m, Z: ${coord.z}m`,
            stressLevel: (idx === 4 && f === 0) ? 'CRITICAL FAILURE' : (f === 0 ? 'CAUTION' : 'NOMINAL'),
            loadLimit: `${(metrics.structuralLoadKn * (1.5 - f * 0.08)).toFixed(0)} kN`,
            initialX: coord.x,
            initialY: floorY,
            initialZ: coord.z,
            gravityVelocity: 0,
            isCollapsed: false
          };

          buildingGroup.add(colSolid, colWire);
          pillarMeshes.push(colSolid);

          // Internal steel reinforcing rebar mesh visualization (Internal X-Ray Mode)
          const rebarGeo = new THREE.CylinderGeometry(colRadius * 0.08, colRadius * 0.08, colHeight, 4);
          
          const rebar1 = new THREE.Mesh(rebarGeo, materials.rebarSolid);
          const rebar1_W = new THREE.Mesh(rebarGeo, materials.normalWire);
          rebar1.position.set(coord.x + colRadius * 0.4, floorY, coord.z + colRadius * 0.4);
          rebar1_W.position.set(coord.x + colRadius * 0.4, floorY, coord.z + colRadius * 0.4);
          rebar1.userData = { isRebar: true, parentPillar: colSolid };
          rebar1_W.userData = { isRebar: true, parentPillar: colSolid };
          
          const rebar2 = new THREE.Mesh(rebarGeo, materials.rebarSolid);
          const rebar2_W = new THREE.Mesh(rebarGeo, materials.normalWire);
          rebar2.position.set(coord.x - colRadius * 0.4, floorY, coord.z - colRadius * 0.4);
          rebar2_W.position.set(coord.x - colRadius * 0.4, floorY, coord.z - colRadius * 0.4);
          rebar2.userData = { isRebar: true, parentPillar: colSolid };
          rebar2_W.userData = { isRebar: true, parentPillar: colSolid };

          buildingGroup.add(rebar1, rebar1_W, rebar2, rebar2_W);
        });

        // Render Connecting Beams for this story (Horizontal X & Transverse Z frame)
        const bThickness = colRadius * 0.85;
        const bDepth = beamDepth / 1000;
        const xBeamGeo = new THREE.BoxGeometry(6.0 - colRadius, bDepth, bThickness);
        const zBeamGeo = new THREE.BoxGeometry(bThickness, bDepth, 6.0 - colRadius);

        colCoords.forEach((coord, idx) => {
          // Connect X direction
          if (idx % 3 !== 2) {
            const nextCoord = colCoords[idx + 1];
            const midX = (coord.x + nextCoord.x) / 2;
            const midZ = coord.z;
            const beamSolid = new THREE.Mesh(xBeamGeo, materials.beamSolid);
            const beamWire = new THREE.Mesh(xBeamGeo, materials.normalWire);
            const beamY = floorY + colHeight / 2 - bDepth / 2;
            
            beamSolid.position.set(midX, beamY, midZ);
            beamWire.position.set(midX, beamY, midZ);
            beamWire.userData = { isWire: true };
            beamSolid.userData = {
              type: 'Structural Connecting Beam',
              name: `Beam B-${f + 1}0${idx + 1}_X`,
              floor: f + 1,
              coordinates: `From X:${coord.x} to ${nextCoord.x}, Z:${midZ}`,
              stressLevel: (idx === 4 && f === 0) ? 'CRITICAL FAILURE' : (f === 0 ? 'CAUTION' : 'NOMINAL'),
              loadLimit: `${(metrics.structuralLoadKn * 0.65).toFixed(0)} kN`,
              initialX: midX,
              initialY: beamY,
              initialZ: midZ
            };
            buildingGroup.add(beamSolid, beamWire);
            beamMeshes.push(beamSolid);
          }

          // Connect Z direction
          if (idx < 6) {
            const nextCoord = colCoords[idx + 3];
            const midX = coord.x;
            const midZ = (coord.z + nextCoord.z) / 2;
            const beamSolid = new THREE.Mesh(zBeamGeo, materials.beamSolid);
            const beamWire = new THREE.Mesh(zBeamGeo, materials.normalWire);
            const beamY = floorY + colHeight / 2 - bDepth / 2;

            beamSolid.position.set(midX, beamY, midZ);
            beamWire.position.set(midX, beamY, midZ);
            beamWire.userData = { isWire: true };
            beamSolid.userData = {
              type: 'Structural Connecting Beam',
              name: `Beam B-${f + 1}0${idx + 1}_Z`,
              floor: f + 1,
              coordinates: `X:${midX}, From Z:${coord.z} to ${nextCoord.z}`,
              stressLevel: (idx === 4 && f === 0) ? 'CRITICAL FAILURE' : (f === 0 ? 'CAUTION' : 'NOMINAL'),
              loadLimit: `${(metrics.structuralLoadKn * 0.65).toFixed(0)} kN`,
              initialX: midX,
              initialY: beamY,
              initialZ: midZ
            };
            buildingGroup.add(beamSolid, beamWire);
            beamMeshes.push(beamSolid);
          }
        });

        // Render Slabs for this floor level (thickness 0.2m)
        const slabGeo = new THREE.BoxGeometry(14.5, 0.2, 14.5);
        
        const slabSolid = new THREE.Mesh(slabGeo, materials.slabSolid);
        const slabWire = new THREE.Mesh(slabGeo, materials.normalWire);
        const slabY = floorY + colHeight / 2 + 0.1;
        
        slabSolid.position.set(0, slabY, 0);
        slabWire.position.set(0, slabY, 0);
        slabWire.userData = { isWire: true };

        slabSolid.userData = {
          type: 'Structural Concrete Slab Floor',
          name: `Slab S-${f + 1}01`,
          floor: f + 1,
          coordinates: 'Full Span Section Grid',
          stressLevel: 'NOMINAL',
          loadLimit: `${liveLoad} kN/m²`,
          initialX: 0,
          initialY: slabY,
          initialZ: 0
        };

        buildingGroup.add(slabSolid, slabWire);
        slabMeshes.push(slabSolid);
      }
    };

    rebuildStructuralScene(floorsRef.current, heightRef.current, colWidthRef.current);

    // --- Styling applier function: swaps material references based on active mode ---
    const applyStructuralStyles = (activeMode, timeStep, liveLoadVal, activeFloodHeightVal, fireTempVal) => {
      buildingGroup.children.forEach(mesh => {
        const isRebar = mesh.userData.isRebar;
        const userData = mesh.userData;

        if (isRebar) {
          mesh.visible = activeMode === 'X-Ray';
          return;
        }

        if (userData.isWire) {
          mesh.visible = true;
          mesh.material = materials.normalWire;
          return;
        }

        if (userData.type) {
          const isCriticalElement = userData.stressLevel === 'CRITICAL FAILURE';
          const isCautionElement = userData.stressLevel === 'CAUTION';

          // Default visibility: hidden in Skeleton, visible otherwise
          mesh.visible = activeMode !== 'Skeleton';

          if (activeMode === 'Stress Heatmap') {
            if (isCriticalElement) {
              mesh.material = materials.redStress;
            } else if (isCautionElement) {
              mesh.material = materials.orangeStress;
            } else if (userData.floor <= 2 && (liveLoadVal > 6.0 || activeFloodHeightVal > 3.0)) {
              mesh.material = materials.yellowStress;
            } else {
              mesh.material = materials.greenStress;
            }
          } 
          else if (activeMode === 'Crack Prediction') {
            mesh.material = isCriticalElement ? materials.crackCritical : materials.crackNormal;
          } 
          else if (activeMode === 'Corrosion') {
            if (isCriticalElement || timeStep === '+25 Years') {
              mesh.material = materials.corrodedCritical;
            } else if (isCautionElement || timeStep === '+10 Years') {
              mesh.material = materials.corrodedCaution;
            } else {
              mesh.material = materials.corrodedNormal;
            }
          } 
          else if (activeMode === 'Fire') {
            mesh.material = materials.fireNormal;
          }
          else {
            // Normal view or Skeleton mode (skeleton hides solid meshes anyway)
            if (userData.type.includes('Column')) {
              mesh.material = materials.normalSolid;
            } else if (userData.type.includes('Beam')) {
              mesh.material = materials.beamSolid;
            } else if (userData.type.includes('Slab')) {
              mesh.material = materials.slabSolid;
            } else {
              mesh.material = materials.foundSolid;
            }
          }
        }
      });
    };

    // Rays clicking handlers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Camera Navigation spherical coordinate variables
    const targetPoint = new THREE.Vector3(0, floorsRef.current * heightRef.current * 0.4, 0);
    const spherical = new THREE.Spherical();
    const tempOffset = new THREE.Vector3().copy(camera.position).sub(targetPoint);
    spherical.setFromVector3(tempOffset);

    let isDragging = false;
    let dragMode = 'none'; // 'rotate', 'pan'
    const prevMouse = { x: 0, y: 0 };
    let startX = 0;
    let startY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      prevMouse.x = e.clientX;
      prevMouse.y = e.clientY;
      if (e.button === 0) {
        if (e.shiftKey) {
          dragMode = 'pan';
        } else {
          dragMode = 'rotate';
        }
      } else if (e.button === 2) {
        dragMode = 'pan';
      }
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      prevMouse.x = e.clientX;
      prevMouse.y = e.clientY;

      if (dragMode === 'rotate') {
        spherical.theta -= deltaX * 0.005;
        spherical.phi -= deltaY * 0.005;
        spherical.phi = Math.max(0.05, Math.min(Math.PI / 2 - 0.05, spherical.phi));
      } else if (dragMode === 'pan') {
        const heading = new THREE.Vector3();
        camera.getWorldDirection(heading);
        heading.y = 0;
        heading.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(heading, camera.up).normalize();

        const up = new THREE.Vector3(0, 1, 0);
        const factor = spherical.radius * 0.0012;

        targetPoint.addScaledVector(right, -deltaX * factor);
        targetPoint.addScaledVector(up, deltaY * factor);
      }

      const offset = new THREE.Vector3().setFromSpherical(spherical);
      camera.position.copy(targetPoint).add(offset);
      camera.lookAt(targetPoint);
    };

    const onMouseUp = () => {
      isDragging = false;
      dragMode = 'none';
    };

    const onWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.04;
      spherical.radius = Math.max(8, Math.min(220, spherical.radius + zoomFactor));

      const offset = new THREE.Vector3().setFromSpherical(spherical);
      camera.position.copy(targetPoint).add(offset);
      camera.lookAt(targetPoint);
    };

    const onContextMenu = (e) => {
      e.preventDefault();
    };

    const handleModelClick = (e) => {
      // Differentiate between drag and click
      const distance = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2));
      if (distance > 5) return; // ignore click if dragging

      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pillarMeshes.concat(beamMeshes).concat(slabMeshes));

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const data = clickedMesh.userData;

        // Custom engineering risk matrix details
        const isCritical = data.stressLevel === 'CRITICAL FAILURE';
        
        setSelectedElement({
          type: data.type,
          id: data.name,
          metrics: {
            ElevationHeight: `${(data.floor * heightRef.current).toFixed(1)} meters`,
            GridLocation: data.coordinates,
            DesignStressLoads: data.loadLimit,
            ConcreteGradeSpec: concreteGrade,
            CalculatedStressFactor: isCritical ? `${metrics.stressMpa} MPa` : `${(metrics.stressMpa * 0.35).toFixed(2)} MPa`,
            CalculatedShearMoment: `${(liveLoad * 11.2).toFixed(1)} kN·m`,
            SectionSafetyFactor: isCritical ? metrics.soilSafety : '2.95',
            StructuralAnomalies: isCritical ? 'DEFLECTION EXCEEDS ELASTIC STAGE LIMIT (Paris Law Crack Propagation)' : 'NOMINAL'
          }
        });
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('contextmenu', onContextMenu);
    renderer.domElement.addEventListener('click', handleModelClick);

    // Animation & simulation loop
    const clock = new THREE.Clock();

    // Event-Driven Registers
    let lastAppliedMode = '';
    let lastAppliedMagnitude = -1;
    let lastAppliedWind = -1;
    let lastAppliedFlood = -1;
    let lastAppliedFire = -1;
    let lastAppliedTime = '';

    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Retrieve state triggers dynamically
      const activeMode = viewModeRef.current;
      const shakeRichter = magnitudeRef.current;
      const windSpeedValue = windRef.current;
      const activeFloodHeight = floodRef.current;
      const activeFireTemp = fireRef.current;
      const timeStep = timeRef.current;

      const stateChanged = (
        activeMode !== lastAppliedMode ||
        shakeRichter !== lastAppliedMagnitude ||
        windSpeedValue !== lastAppliedWind ||
        activeFloodHeight !== lastAppliedFlood ||
        activeFireTemp !== lastAppliedFire ||
        timeStep !== lastAppliedTime
      );

      if (stateChanged) {
        lastAppliedMode = activeMode;
        lastAppliedMagnitude = shakeRichter;
        lastAppliedWind = windSpeedValue;
        lastAppliedFlood = activeFloodHeight;
        lastAppliedFire = activeFireTemp;
        lastAppliedTime = timeStep;

        // Perform single styling update pass
        applyStructuralStyles(activeMode, timeStep, liveLoad, activeFloodHeight, activeFireTemp);
      }

      // --- 1. Ground Seismic Waves (Dynamic vertex calculations) ---
      if (activeMode === 'Seismic' && shakeRichter > 0) {
        const pos = groundGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const xVal = pos.getX(i);
          const yVal = pos.getY(i);
          const dist = Math.sqrt(xVal * xVal + yVal * yVal);
          const zOffset = Math.sin(dist * 0.45 - time * 18) * (shakeRichter * 0.14);
          pos.setZ(i, zOffset);
        }
        groundGeo.computeVertexNormals();
        groundGeo.attributes.position.needsUpdate = true;
      } else if (stateChanged) {
        // Reset ground to flat plane only once on mode switch
        const pos = groundGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          pos.setZ(i, 0);
        }
        groundGeo.attributes.position.needsUpdate = true;
      }

      // --- 2. Flood Hydrostatic Water Rise ---
      if (activeMode === 'Flood' && activeFloodHeight > 0) {
        waterMesh.visible = true;
        waterMesh.position.y = activeFloodHeight / 2 + Math.sin(time * 3) * 0.04;
        waterMesh.scale.y = activeFloodHeight;

        if (hydroArrows.length === 0) {
          const arrowDir = new THREE.Vector3(1, 0, 0);
          const arrowLoc = new THREE.Vector3(-10, activeFloodHeight * 0.5, 0);
          const arrow = new THREE.ArrowHelper(arrowDir, arrowLoc, activeFloodHeight * 1.5, 0x000000, 0.7, 0.35);
          scene.add(arrow);
          hydroArrows.push(arrow);
        } else {
          hydroArrows.forEach(arrow => {
            arrow.visible = true;
            arrow.position.set(-10, activeFloodHeight * 0.5, 0);
            arrow.setLength(activeFloodHeight * 1.5, 0.7, 0.35);
          });
        }
      } else if (stateChanged) {
        waterMesh.visible = false;
        waterMesh.position.y = -6;
        hydroArrows.forEach(arrow => { arrow.visible = false; });
      }

      // --- 3. Fire Pulsing Source ---
      if (activeMode === 'Fire') {
        fireMesh.visible = true;
        const pulse = 0.8 + Math.sin(time * 14) * 0.2 * (activeFireTemp / 400);
        fireMesh.scale.set(pulse, pulse, pulse);
      } else if (stateChanged) {
        fireMesh.visible = false;
      }

      // --- 4. Wind Particles ---
      if (activeMode === 'Wind') {
        windParticles.forEach(wp => {
          wp.visible = true;
          wp.position.x += (windSpeedValue / 150) * 1.6 + 0.1;
          
          if (wp.position.x > -10 && wp.position.x < 10) {
            const wrapFactor = Math.max(0.1, (10 - Math.abs(wp.position.x)) / 10);
            if (wp.position.z > 0) {
              wp.position.z += wrapFactor * 0.1;
            } else {
              wp.position.z -= wrapFactor * 0.1;
            }
          }

          if (wp.position.x > 30) {
            wp.position.x = -30;
            wp.position.y = Math.random() * (floorsRef.current * heightRef.current) + 0.8;
            wp.position.z = Math.random() * 30 - 15;
          }
        });
      } else if (stateChanged) {
        windParticles.forEach(wp => { wp.visible = false; });
      }

      // --- 5. Downward Load Flow Particles ---
      if (activeMode === 'Load Flow') {
        const colCoords = [
          { x: -6, z: -6 }, { x: 0, z: -6 }, { x: 6, z: -6 },
          { x: -6, z: 0 },  { x: 0, z: 0 },  { x: 6, z: 0 },
          { x: -6, z: 6 },  { x: 0, z: 6 },  { x: 6, z: 6 }
        ];
        flowParticles.forEach((fp, idx) => {
          fp.visible = true;
          const colIdx = idx % 9;
          const col = colCoords[colIdx];
          const totalHt = floorsRef.current * heightRef.current;
          const flowSpeed = 2.0 + (liveLoad / 2.2);
          const timeOffset = idx * 0.3;
          const currentY = totalHt - ((time + timeOffset) * flowSpeed) % totalHt;
          fp.position.set(col.x, currentY + 0.8, col.z);
        });
      } else if (stateChanged) {
        flowParticles.forEach(fp => { fp.visible = false; });
      }

      // --- 6. Crack Growth & Wiggle ---
      if (activeMode === 'Crack Prediction' || timeStep === '+25 Years') {
        crackGroup.visible = true;
        if (crackGroup.children.length === 0) {
          const pData = [];
          let cx = 0; let cy = 0.8; let cz = 0;
          const crackSegments = 12;
          for (let i = 0; i < crackSegments; i++) {
            const nx = cx + (Math.random() - 0.5) * 0.2;
            const ny = cy + (heightRef.current / crackSegments);
            const nz = cz + (Math.random() - 0.5) * 0.2;
            pData.push(new THREE.Vector3(cx, cy, cz));
            pData.push(new THREE.Vector3(nx, ny, nz));
            cx = nx; cy = ny; cz = nz;
          }
          const cGeo = new THREE.BufferGeometry().setFromPoints(pData);
          const cMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
          const cLine = new THREE.LineSegments(cGeo, cMat);
          crackGroup.add(cLine);
        }
        crackGroup.children.forEach(c => {
          c.scale.x = 1.0 + Math.sin(time * 8) * 0.02;
        });
      } else if (stateChanged) {
        crackGroup.visible = false;
        while (crackGroup.children.length > 0) {
          crackGroup.remove(crackGroup.children[0]);
        }
      }

      // --- 7. Dynamic Deforming, Sways & Earthquake/Wind animations ---
      const hasSeismicSway = shakeRichter > 0;
      const hasWindSway = activeMode === 'Wind' && windSpeedValue > 15;
      const hasFireDeformation = activeMode === 'Fire';
      const hasSeismicCollapse = activeMode === 'Seismic' && shakeRichter > 7.0;

      if (hasSeismicSway || hasWindSway || hasFireDeformation || hasSeismicCollapse) {
        const amp = (shakeRichter / 9.0) * 0.85;
        const freq = 32 + shakeRichter * 6;
        const windSwayAmp = (windSpeedValue / 150) * 0.65;

        buildingGroup.children.forEach((mesh, idx) => {
          const isRebar = mesh.userData.isRebar;
          const userData = mesh.userData;

          if (isRebar) {
            if (activeMode === 'X-Ray' && mesh.userData.parentPillar) {
              mesh.position.y = mesh.userData.parentPillar.position.y;
              mesh.rotation.copy(mesh.userData.parentPillar.rotation);
            }
            return;
          }

          if (userData.isWire) return;
          if (!userData.type) return;

          const isCriticalElement = userData.stressLevel === 'CRITICAL FAILURE';
          const isCautionElement = userData.stressLevel === 'CAUTION';

          // Initialize/Reset positions
          let targetX = userData.initialX;
          let targetY = userData.initialY;
          let targetZ = userData.initialZ;
          let targetRotZ = 0;
          let targetRotX = 0;

          // Apply Seismic Collapse debris physics
          if (hasSeismicCollapse && isCriticalElement) {
            mesh.userData.gravityVelocity = (mesh.userData.gravityVelocity || 0) + 0.15;
            const fallenY = Math.max(0.4, userData.initialY - mesh.userData.gravityVelocity * 0.06);
            targetY = fallenY;
            
            if (fallenY > 0.5) {
              targetRotZ = mesh.rotation.z + 0.04;
              targetRotX = mesh.rotation.x + 0.025;
            } else {
              targetX = userData.initialX + (idx % 2 === 0 ? 0.8 : -0.8);
              targetZ = userData.initialZ + (idx % 3 === 0 ? 0.6 : -0.6);
            }
          }

          // Apply Seismic / Wind Lateral Sways
          if (userData.initialY > 0.8) {
            if (hasSeismicSway) {
              const swayMultiplier = (userData.initialY / (floorsRef.current * heightRef.current)) * amp;
              targetX += Math.sin(time * freq) * swayMultiplier * 0.8;
              targetZ += Math.cos(time * (freq - 4)) * swayMultiplier * 0.4;
            }
            if (hasWindSway) {
              const heightSwayFactor = (userData.initialY / 30) * windSwayAmp;
              targetX += Math.sin(time * 2.2) * heightSwayFactor;
            }
          }

          // Apply Fire thermal bending deformation
          if (hasFireDeformation) {
            const distToFire = mesh.position.distanceTo(fireMesh.position);
            if (distToFire < 12) {
              const colorRatio = Math.max(0, 1 - (distToFire / 12));
              const deformation = colorRatio * (activeFireTemp / 1000) * 0.16;
              if (userData.type.includes('Beam')) {
                targetY -= deformation * 1.5;
              } else if (userData.type.includes('Column')) {
                targetX += Math.sin(time * 3) * deformation * 0.12;
              }

              // Dynamic glowing red-hot thermal gradient color update (needed every frame as fire pulses)
              mesh.material.color.setRGB(0.95, 0.85 - colorRatio * 0.65, 0.85 - colorRatio * 0.85);
            } else {
              mesh.material.color.setHex(0xf3f4f6);
            }
          }

          // Apply static lifetime progression structural sagging
          if (timeStep === '+10 Years' && isCriticalElement) {
            targetY -= 0.05;
          } else if (timeStep === '+25 Years' && (isCriticalElement || isCautionElement)) {
            targetY -= 0.12;
            targetX += 0.04;
          }

          mesh.position.set(targetX, targetY, targetZ);
          if (hasSeismicCollapse && isCriticalElement) {
            mesh.rotation.z = targetRotZ;
            mesh.rotation.x = targetRotX;
          }
        });
      } else if (stateChanged) {
        // If state changed and no active sway animations, reset positions/rotations once
        buildingGroup.children.forEach(mesh => {
          const isRebar = mesh.userData.isRebar;
          const userData = mesh.userData;

          if (isRebar) {
            if (activeMode === 'X-Ray' && mesh.userData.parentPillar) {
              mesh.position.y = mesh.userData.parentPillar.position.y;
              mesh.rotation.copy(mesh.userData.parentPillar.rotation);
            }
            return;
          }

          if (userData.isWire) return;
          if (!userData.type) return;

          const isCriticalElement = userData.stressLevel === 'CRITICAL FAILURE';
          const isCautionElement = userData.stressLevel === 'CAUTION';

          let targetX = userData.initialX;
          let targetY = userData.initialY;
          let targetZ = userData.initialZ;

          // Apply static lifetime progression structural fatigue sagging
          if (timeStep === '+10 Years' && isCriticalElement) {
            targetY -= 0.05;
          } else if (timeStep === '+25 Years' && (isCriticalElement || isCautionElement)) {
            targetY -= 0.12;
            targetX += 0.04;
          }

          mesh.position.set(targetX, targetY, targetZ);
          mesh.rotation.set(0, 0, 0);
          mesh.userData.gravityVelocity = 0; // reset seismic gravity velocity
        });
      }

      // Continuous dynamic camera track orbit rotation
      buildingGroup.rotation.y = Math.sin(time * 0.06) * 0.035;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (renderer && renderer.domElement && currentMount) {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('wheel', onWheel);
        renderer.domElement.removeEventListener('contextmenu', onContextMenu);
        renderer.domElement.removeEventListener('click', handleModelClick);
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      window.removeEventListener('resize', handleResize);

      // Clean up geometries and materials in scene to avoid memory leaks
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      // Dispose shared materials cache
      Object.values(materials).forEach((mat) => {
        if (mat && typeof mat.dispose === 'function') {
          mat.dispose();
        }
      });

      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floors, floorHeight, columnWidth, concreteGrade, liveLoad]);

  const triggerAIRecommendationLog = () => {
    let alertText = "Building segment is fully compliant with structural safety specifications.";
    let severity = "LOW";
    let title = "Routine structural telemetry verification - nominal values matching simulation metrics";
    let confidence = 98.2;

    if (thermalModulusWarning) {
      title = `Urgent thermal remediation: SACRIFICIAL FIREPROOFING required for column structural twin due to fire exposure (${fireTemp}°C)`;
      severity = "CRITICAL";
      confidence = 94.6;
    } else if (floodSaturationWarning) {
      title = `Foundation durability corrective action: PILE FOUNDATION reinforcement required under extreme sub-grade moisture saturation`;
      severity = "CRITICAL";
      confidence = 92.8;
    } else if (seismicComplianceWarning) {
      title = `Seismic retrofitting required: CONCRETE CONFINEMENT upgrade to M40 High-Strength Concrete in high hazard seismic zone`;
      severity = "HIGH";
      confidence = 96.4;
    } else if (slendernessWarning) {
      title = `Slenderness ratio correction: Column cross-section width enlargement to 600mm to prevent critical buckling failure`;
      severity = "MEDIUM";
      confidence = 89.5;
    } else if (beamDeflectionWarning) {
      title = `Flexural flexure upgrade: Deep Beam depth expansion to 650mm to mitigate structural deflection under live load limits`;
      severity = "MEDIUM";
      confidence = 91.2;
    }

    addTicket({
      accountId: 'acc-1',
      title,
      severity,
      assetName: `Building Segment Twin`,
      confidence
    });
    alert(`Logged Safety Compliance Ticket into Core SSOT Database:\n\n[${severity}] ${title}`);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 font-mono text-xs text-black">
      
      {/* 1. Parameters Left Control Panel */}
      <div className="xl:col-span-1 space-y-6 flex flex-col justify-between">
        
        {/* Param Inputs Form */}
        <LevelCard
          icon={Wrench}
          title="Parameters Console"
          headerAction={<span className="text-[8px] px-1.5 py-0.5 border border-black bg-black text-white font-bold rounded-sm uppercase">MANUAL</span>}
          footerText="Adjust variables to run multi-physics structural twin simulations"
        >
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Building Type</label>
              <select 
                value={buildingType} 
                onChange={(e) => setBuildingType(e.target.value)}
                className="w-full p-1 border border-[#c8c8c8] rounded-[3px] bg-white focus:outline-none text-[10px]"
              >
                <option value="Commercial">Commercial Structural</option>
                <option value="Residential">Residential Block</option>
                <option value="Industrial">Industrial Plant</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Floors: {floors}</label>
                <input 
                  type="range" min="1" max="15" value={floors}
                  onChange={(e) => setFloors(Number(e.target.value))}
                  className="w-full accent-black cursor-ew-resize"
                />
              </div>
              <div>
                <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Height: {floorHeight}m</label>
                <input 
                  type="range" min="3.0" max="4.5" step="0.1" value={floorHeight}
                  onChange={(e) => setFloorHeight(Number(e.target.value))}
                  className="w-full accent-black cursor-ew-resize"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Concrete Spec</label>
                <select 
                  value={concreteGrade} 
                  onChange={(e) => setConcreteGrade(e.target.value)}
                  className="w-full p-1 border border-[#c8c8c8] rounded-[3px] bg-white focus:outline-none text-[9px]"
                >
                  <option value="M20">M20 Concrete</option>
                  <option value="M25">M25 Grade</option>
                  <option value="M30">M30 Structural</option>
                  <option value="M40">M40 High-Strength</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Soil Profile</label>
                <select 
                  value={soilType} 
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full p-1 border border-[#c8c8c8] rounded-[3px] bg-white focus:outline-none text-[9px]"
                >
                  <option value="Hard Rock">Hard Rock (600 kPa)</option>
                  <option value="Sandy Soil">Sandy Soil (250 kPa)</option>
                  <option value="Clay">Soft Clay (120 kPa)</option>
                  <option value="Silt">Silt/Marsh (75 kPa)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Col Width: {columnWidth}mm</label>
                <input 
                  type="range" min="300" max="800" step="50" value={columnWidth}
                  onChange={(e) => setColumnWidth(Number(e.target.value))}
                  className="w-full accent-black cursor-ew-resize"
                />
              </div>
              <div>
                <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Beam Depth: {beamDepth}mm</label>
                <input 
                  type="range" min="300" max="800" step="50" value={beamDepth}
                  onChange={(e) => setBeamDepth(Number(e.target.value))}
                  className="w-full accent-black cursor-ew-resize"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-[#eeeeee] pt-2 mt-2">
              <div>
                <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Seismic Zone</label>
                <select 
                  value={seismicZone} 
                  onChange={(e) => setSeismicZone(e.target.value)}
                  className="w-full p-1 border border-[#c8c8c8] rounded-[3px] bg-white focus:outline-none text-[9px]"
                >
                  <option value="Zone II">Zone II (Low)</option>
                  <option value="Zone III">Zone III (Mod)</option>
                  <option value="Zone IV">Zone IV (High)</option>
                  <option value="Zone V">Zone V (Severe)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Live load: {liveLoad} kN</label>
                <input 
                  type="range" min="1.5" max="10.0" step="0.5" value={liveLoad}
                  onChange={(e) => setLiveLoad(Number(e.target.value))}
                  className="w-full accent-black cursor-ew-resize"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-[#eeeeee] pt-2 mt-2">
              <div>
                <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Flood Depth: {floodHeight}m</label>
                <input 
                  type="range" min="0.0" max="8.0" step="0.5" value={floodHeight}
                  onChange={(e) => setFloodHeight(Number(e.target.value))}
                  className="w-full accent-black cursor-ew-resize"
                />
              </div>
              <div>
                <label className="block font-bold text-[9px] uppercase text-gray-500 mb-0.5">Fire Temp: {fireTemp}°C</label>
                <input 
                  type="range" min="25" max="1000" step="25" value={fireTemp}
                  onChange={(e) => setFireTemp(Number(e.target.value))}
                  className="w-full accent-black cursor-ew-resize"
                />
              </div>
            </div>
          </div>
        </LevelCard>

        {/* 2. File Upload CAD Ingestion */}
        <LevelCard
          icon={Upload}
          title="Ingest Drawings (CAD/BIM)"
          footerText="Extracting coordinate vectors for 3D digital twin"
        >
          <div className="space-y-3">
            <div className="border border-dashed border-[#cccccc] rounded-[3px] p-3 bg-gray-50 text-center relative cursor-pointer group hover:bg-gray-100 transition-colors">
              <input 
                type="file" accept=".dwg,.ifc,.pdf,.png,.jpg" 
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isScanningFile}
              />
              <FileText className="h-5 w-5 mx-auto text-gray-500 mb-1 group-hover:scale-105 transition-transform" />
              <span className="text-[9px] font-bold uppercase block text-black">Upload .dwg / .ifc / drawings</span>
              <span className="text-[7.5px] text-gray-400 block mt-0.5">AI automatically extracts coordinates</span>
            </div>

            {/* Upload progress & queue */}
            {isScanningFile && (
              <div className="p-2 border border-[#d4d4d4] rounded bg-white space-y-1.5 text-[8.5px]">
                <div className="flex justify-between font-bold">
                  <span className="animate-pulse">PARSING VECTORS...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 border border-[#d4d4d4] rounded overflow-hidden">
                  <div style={{ width: `${scanProgress}%` }} className="h-full bg-black transition-all"></div>
                </div>
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center p-1.5 border border-[#d4d4d4] rounded bg-gray-50 text-[8px] font-bold">
                    <span className="truncate w-3/5 text-gray-700">{file.name}</span>
                    <span className="text-[7px] text-gray-400">{file.size}</span>
                    <span className={`px-1 border rounded-sm text-[7px] ${file.status === 'PARSED' ? 'bg-black text-white border-black' : 'border-[#d4d4d4] bg-white text-gray-500 animate-pulse'}`}>
                      {file.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </LevelCard>

      </div>

      {/* 2. Interactive Viewport & Render View modes */}
      <div className="xl:col-span-2 space-y-4 flex flex-col">
        
        {/* Unified 3D Structural Twin Zoho Card Container */}
        <div className="zoho-card flex flex-col flex-1 justify-between" style={{ minHeight: '460px' }}>
          
          {/* View selector — fully closed button strip acting as card header */}
          <div className="workspace-tabs flex-shrink-0 select-none">
            {['Skeleton', 'Stress Heatmap', 'Load Flow', 'Crack Prediction', 'Corrosion', 'Seismic', 'Wind', 'Flood', 'Fire', 'X-Ray'].map((mode) => {
              const isActive = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`workspace-tab ${isActive ? 'active' : ''}`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* WebGL viewport body */}
          <div 
            ref={mountRef}
            className="w-full relative bg-white overflow-hidden flex-1"
            style={{ padding: '0px', minHeight: '340px' }}
          >
            <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
              <div className="p-1.5 border border-[#d4d4d4] bg-white/95 text-[8.5px] font-bold uppercase shadow-sm rounded-sm text-gray-800">
                Concrete strength: <span className="underline">{concreteGrade}</span> (E: {getModulusOfElasticity()} GPa)
              </div>
              {metrics.healthScore < 80 && (
                <div className="p-1.5 border border-black bg-black text-white text-[7.5px] font-bold uppercase animate-pulse flex items-center gap-1 shadow-sm rounded-sm">
                  <AlertTriangle className="h-3.5 w-3.5 text-white" /> CRITICAL SETTLEMENT LIMIT SPIKE
                </div>
              )}
            </div>
          </div>

          {/* Physics HUD — skeuomorphic card footer */}
          <div className="zoho-card-footer flex flex-wrap items-center justify-between gap-3 text-gray-500 select-none font-mono text-[8px] font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-gray-600 text-white rounded-[1px] uppercase tracking-wider text-[7px] font-bold">PHYSICS HUD</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[7.5px]">
              <div>MESH: <span className="text-gray-700 font-bold uppercase">3D Timoshenko Beams</span></div>
              <div>STORY: <span className="text-gray-700 font-bold uppercase">{floors} Floors ({floorHeight}m)</span></div>
              <div>MODE: <span className="text-gray-700 font-bold uppercase underline">{viewMode}</span></div>
              <div>SWAY: <span className="text-gray-700 font-bold uppercase">{windSpeed > 15 ? `${(windSpeed * 0.12).toFixed(1)} cm/s` : 'NOMINAL'}</span></div>
            </div>
          </div>

        </div>

        {/* Dynamic Physics Simulation sliders panel */}
        <LevelCard
          icon={Sliders}
          title="Environmental Disaster Controllers"
          footerText="Simulating cyclic earthquake load waves and dynamic hurricane drift forces"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[9px]">
            {/* Timeline Degradation */}
            <div className="space-y-2">
              <p className="font-bold uppercase tracking-wider text-[9px] text-gray-700 flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" /> Lifetime Progression
              </p>
              <div className="flex border border-[#c8c8c8] bg-white rounded overflow-hidden">
                {['Present', '+1 Year', '+5 Years', '+10 Years', '+25 Years'].map((step) => (
                  <button
                    key={step}
                    onClick={() => setTimeProgression(step)}
                    className={`flex-1 py-1 text-[7.5px] font-bold border-r last:border-r-0 border-[#c8c8c8] transition-colors cursor-pointer ${
                      timeProgression === step 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
              <p className="text-[7.5px] text-gray-400 font-mono italic">
                {timeProgression === 'Present' && '// Geometry fully aligned with blueprint spec.'}
                {timeProgression === '+1 Year' && '// Minor concrete shrinkage cracking simulated.'}
                {timeProgression === '+5 Years' && '// Steel rebar corrosion begins. Modulus reduction modeled.'}
                {timeProgression === '+10 Years' && '// Tension fatigue loss. Cracking indices: +4.2%.'}
                {timeProgression === '+25 Years' && '// CRITICAL: Spalling and core delamination risk spikes by 28%.'}
              </p>
            </div>

            {/* Dynamic Earthquake Richter */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-[9px] uppercase text-gray-700">
                <span className="flex items-center gap-1"><ShieldAlert className="h-4 w-4 text-gray-500" /> Seismic Richter</span>
                <span>{earthquakeMagnitude.toFixed(1)} M_w</span>
              </div>
              <input
                type="range" min="0.0" max="9.0" step="0.5" value={earthquakeMagnitude}
                onChange={(e) => setEarthquakeMagnitude(Number(e.target.value))}
                className="w-full accent-black cursor-ew-resize"
              />
              <div className="flex justify-between text-[7.5px] text-gray-400">
                <span>0.0 Magnitude</span>
                <span>9.0 Richter Scale</span>
              </div>
            </div>

            {/* Wind speed */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-[9px] uppercase text-gray-700">
                <span className="flex items-center gap-1"><Sliders className="h-4 w-4 text-gray-500" /> Wind Gust Speed</span>
                <span>{windSpeed} km/h</span>
              </div>
              <input
                type="range" min="0" max="150" value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full accent-black cursor-ew-resize"
              />
              <div className="flex justify-between text-[7.5px] text-gray-400">
                <span>0 km/h</span>
                <span>150 km/h (Cat 5 Hurricane)</span>
              </div>
            </div>
          </div>
        </LevelCard>

      </div>

      {/* 3. Right Analytics Output & Summary diagnostics */}
      <div className="xl:col-span-1 space-y-4 flex flex-col justify-between">
        
        {/* Core health scorecard */}
        <LevelCard
          icon={Activity}
          title="Structural Health Audits"
          footerText="Overall safety score calculated based on ACI 318 code criteria"
        >
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            {/* Health index card */}
            <div className="p-3 border border-[#d4d4d4] rounded bg-gray-50 text-center relative">
              <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Overall Building Health</p>
              <p className="text-3xl font-black font-mono mt-1 text-black">{metrics.healthScore} / 100</p>
              <span className={`text-[8px] px-1.5 py-0.5 border inline-block mt-2 font-bold rounded-sm ${metrics.healthScore < 80 ? 'bg-black text-white border-black animate-pulse' : 'border-[#d4d4d4] bg-white text-gray-700'}`}>
                {metrics.healthScore >= 90 ? 'STRUCTURALLY SECURE' : metrics.healthScore >= 80 ? 'STABILIZED WARNING' : 'CRITICAL DEFICIT'}
              </span>
            </div>

            {/* Risk Factors grids */}
            <div className="space-y-2 text-[9px] font-bold">
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500 uppercase">Seismic Risk Rating</span>
                <span className={seismicZone === 'Zone V' ? 'underline font-black text-black' : 'text-gray-700'}>
                  {seismicZone === 'Zone V' ? 'HIGH RISK' : seismicZone === 'Zone IV' ? 'MODERATE' : 'LOW RISK'}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500 uppercase">Wind Sway deflection</span>
                <span className="text-gray-700">{Number(metrics.deflectionMm) > 8 ? 'WARNING LIMIT' : 'SAFE'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500 uppercase">Foundation Settlement</span>
                <span className={Number(metrics.soilSafety) < 1.0 ? 'underline font-black text-black' : 'text-gray-700'}>
                  {Number(metrics.soilSafety) < 1.0 ? 'CRITICAL LIMIT' : 'NOMINAL'}
                </span>
              </div>
            </div>
          </div>
        </LevelCard>

        {/* Senior AI Compliance Inspector */}
        <LevelCard
          icon={ShieldAlert}
          title="Senior AI Code Compliance"
          footerText="Real-time compliance validation checking against ACI & IS codes"
        >
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {seismicComplianceWarning && (
              <div className="p-2 border border-[#d4d4d4] rounded-[3px] bg-white text-[8px] space-y-1 shadow-sm">
                <div className="flex justify-between items-center border-b border-[#eeeeee] pb-0.5">
                  <span className="font-black text-black">ACI 318 §18.7</span>
                  <span className="text-[6.5px] font-black border border-black bg-black text-white px-0.5 rounded-[1px]">NON-COMPLIANT</span>
                </div>
                <p className="font-bold text-gray-800 uppercase">Seismic Confinement Warning</p>
                <p className="text-[7.5px] text-gray-500 font-semibold uppercase leading-normal">
                  Seismic zone ({seismicZone}) and structural grade ({concreteGrade}) are non-compliant under high hazard conditions. Confinement failure risk.
                </p>
                <p className="text-[7px] text-black font-black uppercase border-t border-dashed border-gray-200 pt-0.5 mt-0.5">RECOM: Upgrade concrete spec to M30/M40.</p>
              </div>
            )}
            {slendernessWarning && (
              <div className="p-2 border border-[#d4d4d4] rounded-[3px] bg-white text-[8px] space-y-1 shadow-sm">
                <div className="flex justify-between items-center border-b border-[#eeeeee] pb-0.5">
                  <span className="font-black text-black">IS 456 CL. 26.5</span>
                  <span className="text-[6.5px] font-black border border-black bg-black text-white px-0.5 rounded-[1px]">WARNING LIMIT</span>
                </div>
                <p className="font-bold text-gray-800 uppercase">Column Slenderness Spike</p>
                <p className="text-[7.5px] text-gray-500 font-semibold uppercase leading-normal">
                  Column width ({columnWidth}mm) fails safety limit for a {floors}-story system. Buckling force limit critical ({metrics.bucklingK_N} kN).
                </p>
                <p className="text-[7px] text-black font-black uppercase border-t border-dashed border-gray-200 pt-0.5 mt-0.5">RECOM: Expand column size to 500mm+.</p>
              </div>
            )}
            {beamDeflectionWarning && (
              <div className="p-2 border border-[#d4d4d4] rounded-[3px] bg-white text-[8px] space-y-1 shadow-sm">
                <div className="flex justify-between items-center border-b border-[#eeeeee] pb-0.5">
                  <span className="font-black text-black">ACI 318 §10.7</span>
                  <span className="text-[6.5px] font-black border border-black bg-black text-white px-0.5 rounded-[1px]">STRESS THRESHOLD</span>
                </div>
                <p className="font-bold text-gray-800 uppercase">Flexural Deflection Span</p>
                <p className="text-[7.5px] text-gray-500 font-semibold uppercase leading-normal">
                  Deep beam section depth ({beamDepth}mm) is non-compliant under high live loading ({liveLoad} kN). Shear limit risk.
                </p>
                <p className="text-[7px] text-black font-black uppercase border-t border-dashed border-gray-200 pt-0.5 mt-0.5">RECOM: Increase beam depth to 600mm+.</p>
              </div>
            )}
            {floodSaturationWarning && (
              <div className="p-2 border border-[#d4d4d4] rounded-[3px] bg-white text-[8px] space-y-1 shadow-sm">
                <div className="flex justify-between items-center border-b border-[#eeeeee] pb-0.5">
                  <span className="font-black text-black">IS 456 TAB. 19</span>
                  <span className="text-[6.5px] font-black border border-black bg-black text-white px-0.5 rounded-[1px]">CRITICAL EXPOSURE</span>
                </div>
                <p className="font-bold text-gray-800 uppercase">Sub-grade Moisture Saturation</p>
                <p className="text-[7.5px] text-gray-500 font-semibold uppercase leading-normal">
                  Soil type ({soilType}) saturated under {floodHeight}m flooding. Bearing index is critical ({metrics.soilSafety}). Piping danger.
                </p>
                <p className="text-[7px] text-black font-black uppercase border-t border-dashed border-gray-200 pt-0.5 mt-0.5">RECOM: Deploy deep foundation piles, waterproof.</p>
              </div>
            )}
            {thermalModulusWarning && (
              <div className="p-2 border border-[#d4d4d4] rounded-[3px] bg-white text-[8px] space-y-1 shadow-sm">
                <div className="flex justify-between items-center border-b border-[#eeeeee] pb-0.5">
                  <span className="font-black text-black">ACI 318 §21.2.2</span>
                  <span className="text-[6.5px] font-black border border-black bg-black text-white px-0.5 rounded-[1px]">THERMAL FAILURE</span>
                </div>
                <p className="font-bold text-gray-800 uppercase">Thermal Modulus Sagging</p>
                <p className="text-[7.5px] text-gray-500 font-semibold uppercase leading-normal">
                  Concrete strength modulus deteriorated under fire temp ({fireTemp}°C). Elastic safety factor compromised.
                </p>
                <p className="text-[7px] text-black font-black uppercase border-t border-dashed border-gray-200 pt-0.5 mt-0.5">RECOM: Apply sacrificial fireproofing, activate sprinklers.</p>
              </div>
            )}
            {!seismicComplianceWarning && !slendernessWarning && !beamDeflectionWarning && !floodSaturationWarning && !thermalModulusWarning && (
              <div className="p-3 border border-dashed border-gray-300 rounded text-center text-gray-400 text-[8px] font-bold uppercase select-none">
                &radic; ALL CODES FULLY COMPLIANT (ACI 318 & IS 456)
              </div>
            )}
          </div>
        </LevelCard>

        {/* Math Calculation Log display */}
        <LevelCard
          icon={Sigma}
          title="Engineering Calculations Log"
          footerText="Real-time mathematical telemetry logged to core SSOT"
        >
          <div className="flex-grow bg-gray-50 border border-[#d4d4d4] rounded-[3px] p-2 font-mono text-[7.5px] leading-normal overflow-y-auto max-h-[130px] space-y-1.5 select-all pr-1">
            {calculationFeed.map((feed) => (
              <div key={feed.id} className="border-b border-gray-200 last:border-b-0 pb-1 text-gray-700">
                <span className="text-[6.5px] border border-black bg-black text-white px-0.5 rounded font-black mr-1 uppercase">
                  {feed.type}
                </span>
                {feed.text}
              </div>
            ))}
          </div>
        </LevelCard>

        {/* AI validation controls trigger */}
        <LevelCard
          icon={Cpu}
          title="AI Recommendation Actions"
          footerText="Commit safety upgrades tickets to corporate compliance logs"
        >
          <div className="space-y-3">
            <button
              onClick={triggerAIRecommendationLog}
              className="w-full btn-skeuo-dark text-[8.5px] uppercase tracking-wider text-center"
            >
              Log Safety Upgrades Ticket
            </button>
          </div>
        </LevelCard>

      </div>

    </div>
  );
}

