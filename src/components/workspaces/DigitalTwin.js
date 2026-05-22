import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCRMStore } from '@/store/crmStore';
import { Cpu, AlertTriangle, Wind, ShieldAlert, Activity, Eye, Layers, Clock } from 'lucide-react';

export default function DigitalTwin({ selectedElement, setSelectedElement }) {
  const mountRef = useRef(null);
  const addTicket = useCRMStore(state => state.addTicket);

  const [windSpeed, setWindSpeed] = useState(20); // km/h
  const [seismicActivity, setSeismicActivity] = useState(0.0); // Richters
  const [activeLayer, setActiveLayer] = useState('Stress Vector');
  const [selectedNode, setSelectedNode] = useState(null);
  const [timeStep, setTimeStep] = useState('Present'); // Present, +6M, +1Y, +5Y, +20Y

  // Reference variables for Three.js animation loops
  const windRef = useRef(windSpeed);
  const seismicRef = useRef(seismicActivity);
  const layerRef = useRef(activeLayer);
  const timeStepRef = useRef(timeStep);

  useEffect(() => { windRef.current = windSpeed; }, [windSpeed]);
  useEffect(() => { seismicRef.current = seismicActivity; }, [seismicActivity]);
  useEffect(() => { layerRef.current = activeLayer; }, [activeLayer]);
  useEffect(() => { timeStepRef.current = timeStep; }, [timeStep]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Monochromatic Light-themed Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.FogExp2(0xffffff, 0.015);

    // 2. High-Precision Perspective Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 30, 80);
    camera.lookAt(0, 5, 0);

    // 3. Renderer with high device pixel ratio
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 4. Monochrome lighting (Technical high-contrast outlines)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x000000, 1.2);
    dirLight1.position.set(20, 50, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x6b7280, 0.5);
    dirLight2.position.set(-20, 20, -20);
    scene.add(dirLight2);

    // 5. Grid Helper matching Light CAD Blueprint style
    const gridHelper = new THREE.GridHelper(160, 80, 0x000000, 0xe5e7eb);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 6. Assembly Group
    const bridgeGroup = new THREE.Group();
    scene.add(bridgeGroup);

    // --- High-Performance Shared Material Cache ---
    const materials = {
      deckSolidMat: new THREE.MeshStandardMaterial({
        color: 0xf9fafb,
        roughness: 0.8,
        metalness: 0.1,
      }),
      deckWireMat: new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
      }),
      pillarSolidMat: new THREE.MeshStandardMaterial({
        color: 0xf3f4f6,
        roughness: 0.9,
      }),
      pillarWireMat: new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
      }),
      nodeSolidNormal: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
      }),
      nodeSolidNominal: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.5,
      }),
      nodeSolidCaution: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.5,
      }),
      nodeSolidCritical: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.5,
      }),
      nodeWireMat: new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
      }),
      pylonSolidMat: new THREE.MeshStandardMaterial({
        color: 0xf3f4f6,
      }),
      pylonWireMat: new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
      }),
      trafficMat: new THREE.PointsMaterial({
        size: 1.0,
        color: 0x000000,
        transparent: true,
        opacity: 0.9,
      }),
      telemetryNominal: new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.5,
      }),
      fatigueWireMat: new THREE.MeshBasicMaterial({
        color: 0xef4444,
        wireframe: true,
      })
    };

    // 7. Base Deck Geometry
    const deckGeo = new THREE.BoxGeometry(110, 1.2, 10);
    const deckSolid = new THREE.Mesh(deckGeo, materials.deckSolidMat);
    const deckWire = new THREE.Mesh(deckGeo, materials.deckWireMat);
    deckSolid.position.y = 12;
    deckWire.position.y = 12;
    bridgeGroup.add(deckSolid);
    bridgeGroup.add(deckWire);

    // 8. Main Support Pillars (Procedurally generated)
    const pillars = [];
    const pillarPositions = [-44, -22, 0, 22, 44];
    const nodeMeshes = [];

    pillarPositions.forEach((x, index) => {
      // Pillar cylinder
      const pHeight = 12;
      const pillarGeo = new THREE.CylinderGeometry(1.6, 2.2, pHeight, 12);
      
      const pSolid = new THREE.Mesh(pillarGeo, materials.pillarSolidMat);
      const pWire = new THREE.Mesh(pillarGeo, materials.pillarWireMat);
      pSolid.position.set(x, pHeight / 2, 0);
      pWire.position.set(x, pHeight / 2, 0);
      
      bridgeGroup.add(pSolid);
      bridgeGroup.add(pWire);
      pillars.push(pSolid);

      // Interactive Stress Nodes
      const nodeGeo = new THREE.SphereGeometry(2.0, 12, 12);
      
      const nSolid = new THREE.Mesh(nodeGeo, materials.nodeSolidNormal);
      const nWire = new THREE.Mesh(nodeGeo, materials.nodeWireMat);
      nSolid.position.set(x, 12.8, 0);
      nWire.position.set(x, 12.8, 0);
      
      nSolid.userData = {
        name: `Anchor Point A-${index + 101}`,
        stress: index === 2 ? '91%' : `${40 + index * 8}%`,
        status: index === 2 ? 'FATIGUE DETECTED' : 'NOMINAL',
        acceleration: '0.04 m/s²',
      };
      
      bridgeGroup.add(nSolid);
      bridgeGroup.add(nWire);
      nodeMeshes.push(nSolid);
    });

    // Pylon & Cables suspension framework
    const pylonGeo = new THREE.CylinderGeometry(1.0, 1.8, 30, 8);

    const pylonL_S = new THREE.Mesh(pylonGeo, materials.pylonSolidMat);
    const pylonL_W = new THREE.Mesh(pylonGeo, materials.pylonWireMat);
    pylonL_S.position.set(-33, 24, 0);
    pylonL_W.position.set(-33, 24, 0);
    bridgeGroup.add(pylonL_S, pylonL_W);

    const pylonR_S = new THREE.Mesh(pylonGeo, materials.pylonSolidMat);
    const pylonR_W = new THREE.Mesh(pylonGeo, materials.pylonWireMat);
    pylonR_S.position.set(33, 24, 0);
    pylonR_W.position.set(33, 24, 0);
    bridgeGroup.add(pylonR_S, pylonR_W);

    // 9. Particles flow representing traffic vectors (Black points against white)
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 1] = 13;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      speeds.push(0.12 + Math.random() * 0.18);
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const trafficParticles = new THREE.Points(particleGeo, materials.trafficMat);
    bridgeGroup.add(trafficParticles);

    // --- Styling applier function: swaps material references based on active layer ---
    const applyStructuralStyles = (activeLayerVal, timeStepVal) => {
      // 1. Swap Deck materials based on layer
      if (activeLayerVal === 'Fatigue Grid') {
        deckWire.material = materials.fatigueWireMat;
      } else {
        deckWire.material = materials.deckWireMat;
      }

      // 2. Swap Node materials based on layer
      nodeMeshes.forEach((nSolid) => {
        const status = nSolid.userData.status;
        const stressPct = parseInt(nSolid.userData.stress) || 0;

        if (activeLayerVal === 'Stress Vector') {
          if (status === 'FATIGUE DETECTED') {
            nSolid.material = materials.nodeSolidCritical;
          } else if (stressPct >= 60) {
            nSolid.material = materials.nodeSolidCaution;
          } else {
            nSolid.material = materials.nodeSolidNominal;
          }
        } else if (activeLayerVal === 'Telemetry Arrays') {
          nSolid.material = materials.telemetryNominal;
        } else if (activeLayerVal === 'Fatigue Grid') {
          if (status === 'FATIGUE DETECTED') {
            nSolid.material = materials.nodeSolidCritical;
          } else {
            nSolid.material = materials.nodeSolidNominal;
          }
        } else {
          nSolid.material = materials.nodeSolidNormal;
        }
      });
    };

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    // Event-Driven Registers
    let lastAppliedLayer = '';
    let lastAppliedTime = '';
    let lastAppliedWind = -1;
    let lastAppliedSeismic = -1;

    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Retrieve reactive variables
      const wind = windRef.current;
      const seismic = seismicRef.current;
      const layer = layerRef.current;
      const timeStep = timeStepRef.current;

      const stateChanged = (
        layer !== lastAppliedLayer ||
        timeStep !== lastAppliedTime ||
        wind !== lastAppliedWind ||
        seismic !== lastAppliedSeismic
      );

      if (stateChanged) {
        lastAppliedLayer = layer;
        lastAppliedTime = timeStep;
        lastAppliedWind = wind;
        lastAppliedSeismic = seismic;

        // Perform material swap once on state transition
        applyStructuralStyles(layer, timeStep);
      }

      const hasWindSway = wind > 0;
      const hasSeismicActivity = seismic > 0;

      // Calculate time-series degradation displacement
      let degradationSway = 0;
      let degradationSag = 0;
      if (timeStep === '+6 Months') {
        degradationSag = -0.3;
      } else if (timeStep === '+1 Year') {
        degradationSag = -0.6;
        degradationSway = 0.1;
      } else if (timeStep === '+5 Years') {
        degradationSag = -1.5;
        degradationSway = 0.4;
      } else if (timeStep === '+20 Years') {
        degradationSag = -3.2; // heavy sagging deformation
        degradationSway = 1.0;
      }

      // 1. Wind & Degradation sags
      if (hasWindSway || stateChanged) {
        const windAmplitude = (wind / 120) * 0.5;
        const swayFreq = time * (1.5 + wind * 0.01);
        deckSolid.position.z = Math.sin(swayFreq) * windAmplitude + degradationSway;
        deckWire.position.z = deckSolid.position.z;
        
        deckSolid.position.y = 12 + degradationSag;
        deckWire.position.y = 12 + degradationSag;
      }

      // 2. Seismic vibrations
      if (hasSeismicActivity) {
        const shake = Math.sin(time * 30) * (seismic * 0.2);
        bridgeGroup.position.x = shake;
        bridgeGroup.position.y = Math.cos(time * 25) * (seismic * 0.08);
        
        nodeMeshes.forEach(n => {
          n.scale.set(1.5, 1.5, 1.5);
        });
      } else if (stateChanged) {
        // Reset positions/scales only once on state transition
        bridgeGroup.position.set(0, 0, 0);
        nodeMeshes.forEach((n) => {
          n.scale.set(1, 1, 1);
        });
      }

      // 3. Update Particle traffic flows (extremely cheap, keep continuously animated)
      const posArr = trafficParticles.geometry.attributes.position.array;
      const windAmplitude = (wind / 120) * 0.5;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += speeds[i];
        if (posArr[i * 3] > 55) {
          posArr[i * 3] = -55;
        }
        posArr[i * 3 + 2] += Math.sin(time + i) * (windAmplitude * 0.02);
      }
      trafficParticles.geometry.attributes.position.needsUpdate = true;

      // Slow rotation of camera/view scene (Group rotation is cheap)
      bridgeGroup.rotation.y = Math.sin(time * 0.1) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Intersection selection raycaster click handler
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
        
        // Update context-sensitive sidebar via prop
        setSelectedElement({
          type: 'Digital Twin Anchor',
          id: clickedNode.userData.name,
          metrics: {
            StressTension: clickedNode.userData.stress,
            VibrationTelemetry: clickedNode.userData.acceleration,
            OperationalStatus: clickedNode.userData.status,
            DegradationTensionLoss: timeStep === 'Present' ? '0.0%' : timeStep === '+20 Years' ? '28.4%' : '4.2%'
          }
        });
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

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
        renderer.domElement.removeEventListener('click', handleCanvasClick);
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerDiagnosticTicket = () => {
    addTicket({
      accountId: 'acc-1',
      title: `Fatigue failure threshold anomaly in Twin ${selectedNode?.name || 'Anchor'}`,
      severity: 'HIGH',
      assetName: 'Bridge Segment 101',
      confidence: 94.2,
    });
    alert('Logged High-Severity structural ticket.');
  };

  return (
    <div className="h-full flex flex-col border-2 border-black bg-white font-mono text-xs text-black">
      
      {/* 3D Wireframe Render Area */}
      <div className="flex-1 min-h-[360px] relative border-b border-black" ref={mountRef}>
        
        {/* Grayscale Wireframe Layer selector */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
          {['Stress Vector', 'Fatigue Grid', 'Telemetry Arrays'].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2.5 py-1 border text-[9px] uppercase font-bold transition-colors ${
                activeLayer === layer 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        {/* Selected Sensor Floating Inspector panel */}
        {selectedNode && (
          <div className="absolute top-3 right-3 z-20 w-60 p-3 border-2 border-black bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)] animate-in slide-in-from-right-2">
            <div className="flex items-center justify-between border-b border-black pb-1 mb-2 font-bold uppercase text-[9px]">
              <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> Telemetry</span>
              <button onClick={() => setSelectedNode(null)} className="font-bold text-xs">&times;</button>
            </div>
            <p className="font-bold text-[10px] uppercase border border-black p-1 bg-gray-50 mb-2">{selectedNode.name}</p>
            <div className="space-y-1 text-[9px]">
              <div className="flex justify-between">
                <span>STRESS LOAD:</span>
                <span className="font-bold">{selectedNode.stress}</span>
              </div>
              <div className="flex justify-between">
                <span>VIBRATION:</span>
                <span>{selectedNode.acceleration}</span>
              </div>
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="font-bold border border-black px-1 text-[8px]">{selectedNode.status}</span>
              </div>
            </div>
            
            <button 
              onClick={triggerDiagnosticTicket}
              className="w-full mt-3 py-1 bg-black text-white hover:bg-gray-800 text-[8px] uppercase font-bold text-center border border-black"
            >
              Log Failure Ticket
            </button>
          </div>
        )}

        {/* HUD coordinates watermark */}
        <div className="absolute bottom-3 left-3 z-20 text-[8px] text-gray-500 space-y-0.5 pointer-events-none">
          <div>MODEL SYSTEM: BRIDGE-SUSPENSION-STRUCT-A101</div>
          <div>SIMULATION CLOCK: {new Date().toISOString().slice(11, 19)}</div>
          <div>TIME HORIZON: {timeStep}</div>
        </div>

      </div>

      {/* Physics Engine & Degradation Timetravel control deck */}
      <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Degradation Timeline travel */}
        <div className="space-y-2">
          <p className="font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> AI Timeline Travel (Degradation)
          </p>
          <div className="flex border border-black bg-white rounded overflow-hidden">
            {['Present', '+6 Months', '+1 Year', '+5 Years', '+20 Years'].map((step) => (
              <button
                key={step}
                onClick={() => setTimeStep(step)}
                className={`flex-1 py-1 text-[8px] font-bold border-r last:border-r-0 border-black transition-colors ${
                  timeStep === step 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
          <p className="text-[8px] text-gray-500 font-mono italic">
            {timeStep === 'Present' && '// Geometry fully aligned with blueprint spec.'}
            {timeStep === '+6 Months' && '// Tension loss predicted. Sag: -0.3m.'}
            {timeStep === '+1 Year' && '// Localized microscopic cracking modeled near Anchor 103.'}
            {timeStep === '+5 Years' && '// Steel deck corrosion rate acceleration. Deflection sag: -1.5m.'}
            {timeStep === '+20 Years' && '// CRITICAL: Shear failure risk exceeds 42%. Extreme sag deformation.'}
          </p>
        </div>

        {/* Dynamic Forces */}
        <div className="space-y-2">
          <div className="flex justify-between font-bold text-[9px] uppercase">
            <span className="flex items-center gap-1"><Wind className="h-3.5 w-3.5" /> Wind Load Simulation</span>
            <span>{windSpeed} km/h</span>
          </div>
          <input
            type="range"
            min="0"
            max="150"
            value={windSpeed}
            onChange={(e) => setWindSpeed(Number(e.target.value))}
            className="w-full accent-black cursor-ew-resize"
          />
          <div className="flex justify-between text-[8px] text-gray-500">
            <span>0 km/h</span>
            <span>150 km/h</span>
          </div>
        </div>

        {/* Seismic Magnitude */}
        <div className="space-y-2">
          <div className="flex justify-between font-bold text-[9px] uppercase">
            <span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> Seismic Coefficient</span>
            <span>{seismicActivity.toFixed(1)} Richter</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="7.0"
            step="0.5"
            value={seismicActivity}
            onChange={(e) => setSeismicActivity(Number(e.target.value))}
            className="w-full accent-black cursor-ew-resize"
          />
          <div className="flex justify-between text-[8px] text-gray-500">
            <span>0.0 Magnitude</span>
            <span>7.0 Richter Scale</span>
          </div>
        </div>

      </div>

    </div>
  );
}
