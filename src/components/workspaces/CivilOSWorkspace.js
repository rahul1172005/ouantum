'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  FileText,
  Globe,
  Radio,
  FileCheck2,
  Users,
  Compass,
  Map,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck,
  Truck,
  HardHat,
  Database,
  BarChart2
} from 'lucide-react';

export default function CivilOSWorkspace({ selectedElement, setSelectedElement }) {
  const addTicket = useCRMStore(state => state.addTicket);
  const addAccount = useCRMStore(state => state.addAccount);
  const accounts = useCRMStore(state => state.accounts);
  const tickets = useCRMStore(state => state.tickets);
  const activities = useCRMStore(state => state.activities);

  // Active level tab
  const [activeLevel, setActiveLevel] = useState(5); // Level 5 QA/QC LIMS is default
  const [activeSubTab, setActiveSubTab] = useState('Cube'); // default subtab inside Level 5

  // ------------------- LEVEL 1: PRE-CONSTRUCTION STATES -------------------
  const [soilCohesion, setSoilCohesion] = useState(25); // kPa
  const [soilSurcharge, setSoilSurcharge] = useState(15); // kPa
  const [soilUnitWeight, setSoilUnitWeight] = useState(18); // kN/m³
  const [foundationWidth, setFoundationWidth] = useState(2.0); // m
  const [gisLocation, setGisLocation] = useState('Bandra-Worli (Mumbai)');
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const [permits, setPermits] = useState({
    zoning: true,
    environmental: false,
    coastal: false,
    fireSafety: true
  });
  const [permitScanResult, setPermitScanResult] = useState('');

  // ------------------- LEVEL 2: DESIGN & PLANNING STATES -------------------
  const [hvacLoad, setHvacLoad] = useState(340); // kW
  const [waterFlow, setWaterFlow] = useState(45); // GPM
  const [electricalKva, setElectricalKva] = useState(620); // kVA
  const [timeOfDay, setTimeOfDay] = useState(12); // Hour
  const [bimClashes, setBimClashes] = useState([
    { id: 'clash-1', elementA: 'Column C-04', elementB: 'HVAC Duct H-103', type: 'Hard Clash', resolved: false },
    { id: 'clash-2', elementA: 'Slab S-02 (Level 3)', elementB: 'MEP Drainage P-2', type: 'Clearance Clash', resolved: false },
    { id: 'clash-3', elementA: 'Rebar Cage R-10', elementB: 'Anchor Bolt A-12', type: 'Hard Clash', resolved: true }
  ]);

  // ------------------- LEVEL 3: PROCUREMENT & SUPPLY STATES -------------------
  const [aggregateSieveModulus, setAggregateSieveModulus] = useState(2.8); // sand grading fineness modulus
  const [quarrySource, setQuarrySource] = useState('Pune Aggregate Quarry');
  const [cementDrumRPM, setCementDrumRPM] = useState(14); // RPM
  const [cementTemp, setCementTemp] = useState(26.5); // °C

  // ------------------- LEVEL 4: CONSTRUCTION EXECUTION STATES -------------------
  const [ppeGateChecks, setPpeGateChecks] = useState([
    { id: 'chk-1', name: 'Worker R. Jadhav', helmet: 'OK', vest: 'OK', status: 'PASS' },
    { id: 'chk-2', name: 'Worker S. Pillai', helmet: 'MISSING', vest: 'OK', status: 'FAIL' },
    { id: 'chk-3', name: 'Worker M. Fernandes', helmet: 'OK', vest: 'MISSING', status: 'FAIL' }
  ]);
  const [scanningPpe, setScanningPpe] = useState(false);
  const [latestPpeAlert, setLatestPpeAlert] = useState('');

  // ------------------- LEVEL 5: QA/QC LIMS STATES -------------------
  const [limsConcreteGrade, setLimsConcreteGrade] = useState('M25'); // M20, M25, M30, M40
  const [limsCompressiveForce, setLimsCompressiveForce] = useState(580); // kN force applied
  const [limsSlumpConeValue, setLimsSlumpConeValue] = useState(85); // mm slump height
  const [limsSteelYieldStrength, setLimsSteelYieldStrength] = useState(485); // MPa yield strength
  const [limsAcousticSpeed, setLimsAcousticSpeed] = useState(3850); // m/s NDT pulse velocity
  const [limsLogMsg, setLimsLogMsg] = useState('LIMS Testing Station Online. Load cube sample and click Certify.');

  // ------------------- LEVEL 6: LIVE OPERATIONS SCADA STATES -------------------
  const [scadaFrequency, setScadaFrequency] = useState(2.4); // Hz vibration
  const [scadaStressMicroStrain, setScadaStressMicroStrain] = useState(142); // micro-strain

  // ------------------- LEVEL 7: DISASTER SIMULATION STATES -------------------
  const [disasterEarthquake, setDisasterEarthquake] = useState(0.0);
  const [disasterFloodDepth, setDisasterFloodDepth] = useState(0.0);

  // ------------------- LEVEL 8: FINANCIAL ERP STATES -------------------
  const [erpInventory, setErpInventory] = useState([
    { id: 'inv-1', material: 'Cement (OPC-53)', plannedQty: 10000, actualQty: 9800, plannedCost: 450, actualCost: 462, unit: 'Bags' },
    { id: 'inv-2', material: 'Steel Rebar (Fe-500)', plannedQty: 250, actualQty: 265, plannedCost: 55000, actualCost: 54200, unit: 'Tons' },
    { id: 'inv-3', material: 'River Sand (Sieved)', plannedQty: 4500, actualQty: 4200, plannedCost: 2200, actualCost: 2450, unit: 'm³' },
    { id: 'inv-4', material: 'Coarse Aggregate (20mm)', plannedQty: 6000, actualQty: 6100, plannedCost: 1800, actualCost: 1750, unit: 'm³' }
  ]);

  // ------------------- LEVEL 9: POST-CONSTRUCTION LIFE STATES -------------------
  const [lifecycleAgeYears, setLifecycleAgeYears] = useState(0);

  // ------------------- LEVEL 11: FUTURE TECH STATES -------------------
  const [aiDesignGoal, setAiDesignGoal] = useState('Reduce Pillar Cross Section');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiDesignOutput, setAiDesignOutput] = useState(null);

  // ------------------- LIVE TICKERS FOR ANIMATED SCADA CANVASES -------------------
  const scadaCanvasRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const canvas = scadaCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let offset = 0;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw sensor waves
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      const amp = 30 + disasterEarthquake * 5;
      const freq = (scadaFrequency / 10) + (disasterEarthquake * 0.05);
      
      for (let x = 0; x < canvas.width; x++) {
        const y = (canvas.height / 2) + Math.sin((x * freq) + offset) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      offset += 0.08;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [scadaFrequency, disasterEarthquake]);

  // ------------------- COMPUTED VALUES & CRM INTERACTIONS -------------------

  // LEVEL 1: Terzaghi Bearing Capacity Calculation
  const getTerzaghiCapacity = () => {
    // Bearing capacity factors for general shear failure (approximated for Soil type)
    const Nc = 15.0;
    const Nq = 8.5;
    const Ny = 6.2;
    const c = soilCohesion;
    const q = soilSurcharge;
    const y = soilUnitWeight;
    const B = foundationWidth;

    // Ultimate Bearing Capacity Formula: qu = c*Nc + q*Nq + 0.5*y*B*Ny
    const qu = (c * Nc) + (q * Nq) + (0.5 * y * B * Ny);
    
    // Allowable bearing capacity with safety factor 3
    const qa = (qu / 3).toFixed(1);
    const safetyIndex = (qa / 120).toFixed(2); // 120 kPa target threshold
    return { qu: qu.toFixed(1), qa, safetyIndex };
  };

  const { qu: ultimateCapacity, qa: allowableCapacity, safetyIndex: soilSafetyIndex } = getTerzaghiCapacity();

  // LEVEL 5: Concrete Compressive Strength Calculation
  const getConcreteCubeMetrics = () => {
    const area = 0.0225; // 150mm * 150mm = 0.0225 m² area
    const loadN = limsCompressiveForce * 1000; // in Newtons
    const actualMpa = ((loadN / area) / 1e6).toFixed(2); // MPa

    let targetMpa = 25;
    if (limsConcreteGrade === 'M20') targetMpa = 20;
    if (limsConcreteGrade === 'M30') targetMpa = 30;
    if (limsConcreteGrade === 'M40') targetMpa = 40;

    const pass = Number(actualMpa) >= targetMpa;
    return { actualMpa, targetMpa, pass };
  };

  const { actualMpa: concreteMpa, targetMpa: concreteTarget, pass: concretePassed } = getConcreteCubeMetrics();

  // LEVEL 5 LIMS QA/QC CERTIFY ACTION (CRM Integrated)
  const handleCertifyConcreteCube = () => {
    // Auto-resolve associated deal
    const currentAccount = accounts[0] || { id: 'acc-1', name: 'MSRDC' };
    
    if (!concretePassed) {
      // Trigger Anomaly ticket immediately
      const ticketTitle = `LIMS QA/QC FAILURE: concrete ${limsConcreteGrade} strength lower than target`;
      const ticketDetail = {
        accountId: currentAccount.id,
        title: ticketTitle,
        severity: 'CRITICAL',
        assetName: `Batch Mix Concrete: Pillar Sector A4`,
        confidence: 99.8
      };
      
      const res = addTicket(ticketDetail);
      if (res.success) {
        setLimsLogMsg(`🚨 QA/QC REJECTED! Strength of ${concreteMpa} MPa failed to satisfy target ${concreteTarget} MPa. CRITICAL anomaly ticket generated in global SSOT.`);
      }
    } else {
      setLimsLogMsg(`✓ QA/QC APPROVED! Concrete ${limsConcreteGrade} cube strength verified at ${concreteMpa} MPa (Target: ${concreteTarget} MPa). Compliance certificate signed off and logged.`);
    }
  };

  // LEVEL 4 PPE SCAN SIMULATION
  const handlePpeWebcamScan = () => {
    setScanningPpe(true);
    setLatestPpeAlert('');
    
    setTimeout(() => {
      setScanningPpe(false);
      // Pick one randomly
      const roll = Math.random();
      const currentAccount = accounts[0] || { id: 'acc-1', name: 'MSRDC' };

      if (roll < 0.4) {
        setLatestPpeAlert('✓ PPE SCAN: SECURE SESSIONS. ALL ACTIVE LABOURS PROPERLY HELMETED.');
      } else if (roll < 0.7) {
        const ticketDetail = {
          accountId: currentAccount.id,
          title: `Smart PPE Breach: Worker S. Pillai detected without Helmet at Gate 2`,
          severity: 'HIGH',
          assetName: 'Core Construction Portal - Sector B',
          confidence: 94.5
        };
        addTicket(ticketDetail);
        setLatestPpeAlert('🚨 WARNING: Smart PPE Camera triggered safety violation! S. Pillai has helmet missing at Gate 2. CRM activity logged.');
      } else {
        const ticketDetail = {
          accountId: currentAccount.id,
          title: `Smart PPE Breach: Worker M. Fernandes detected without High-Visibility Vest`,
          severity: 'MEDIUM',
          assetName: 'Core Construction Portal - Sector B',
          confidence: 89.2
        };
        addTicket(ticketDetail);
        setLatestPpeAlert('🚨 WARNING: Smart PPE Camera triggered safety violation! M. Fernandes high-visibility vest is missing. Security checklist dispatched.');
      }
    }, 1200);
  };

  // LEVEL 2 BIM CLASH RESOLVER ACTION
  const handleResolveBimClash = (clashId) => {
    setBimClashes(prev => prev.map(c => c.id === clashId ? { ...c, resolved: true } : c));
    const target = bimClashes.find(c => c.id === clashId);
    
    // Log CRM ticket
    const currentAccount = accounts[0] || { id: 'acc-1', name: 'MSRDC' };
    addTicket({
      accountId: currentAccount.id,
      title: `BIM Clash Resolved: Rework ticket issued for ${target?.elementA} x ${target?.elementB}`,
      severity: 'LOW',
      assetName: 'BIM Model Level 3 DXF',
      confidence: 100.0
    });
  };

  // LEVEL 11 GENERATIVE DESIGN AI blue print trigger
  const handleGenerativeAI = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      let weightSaved = '18.4%';
      let carbonSaved = '22.3%';
      let safetyFactor = '2.4';
      let layoutSpec = 'Hollow circular concrete sections M40 reinforcing helical rebar cage Fe-550.';

      if (aiDesignGoal === 'Optimize Rebar Steel Layout') {
        weightSaved = '12.8%';
        carbonSaved = '15.9%';
        safetyFactor = '2.8';
        layoutSpec = 'Varying density steel rebars concentrically aligned near joints under high cyclic sags.';
      } else if (aiDesignGoal === 'Max Carbon Absorption Mix') {
        weightSaved = '-5.4% (Weight addition)';
        carbonSaved = '48.2%';
        safetyFactor = '2.1';
        layoutSpec = 'Fly ash based geopolymer concrete with mineralized aggregate matrix core.';
      }

      setAiDesignOutput({
        goal: aiDesignGoal,
        weightSaved,
        carbonSaved,
        safetyFactor,
        layoutSpec,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 1500);
  };

  return (
    <div className="min-h-[500px] border-4 border-double border-black bg-white flex flex-col font-mono text-black relative shadow-[4px_4px_0px_rgba(0,0,0,1)] select-none">
      
      {/* Background Engineering Grids Overlay */}
      <div className="absolute inset-0 cad-grid opacity-30 pointer-events-none z-0"></div>

      {/* Header Watermark */}
      <div className="relative border-b-2 border-black bg-gray-50 p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 z-10">
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="h-4.5 w-4.5" /> CIVIL & INFRASTRUCTURE OS [COCKPIT ENGINE]
            <span className="text-[8px] px-1 border border-black bg-black text-white">LEVELS 1-11</span>
          </h2>
          <p className="text-[8.5px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">
            System status: nominal // 42hz IoT stream telemetry active // SSOT linked
          </p>
        </div>
        
        {/* Active level metrics */}
        <div className="flex gap-2">
          <div className="border border-black px-2 py-0.5 bg-white text-[9px] font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <ShieldCheck className="h-3.5 w-3.5" /> QA/QC TARGETS: <span className="bg-black text-white px-1 text-[8px]">PASSING</span>
          </div>
          <div className="border border-black px-2 py-0.5 bg-black text-white text-[9px] font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <Database className="h-3.5 w-3.5" /> CRM TICKETS: {tickets.filter(t => t.status === 'OPEN').length} OPEN
          </div>
        </div>
      </div>

      {/* Core Split Screen Layout */}
      <div className="flex-1 flex flex-col lg:flex-row z-10">
        
        {/* Left Side: 11 levels Navigation (1/4 columns) */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r-2 border-black flex flex-col justify-between bg-gray-50">
          <div className="p-2 border-b border-black bg-white">
            <span className="text-[7.5px] font-bold border border-black px-1.5 py-0.5 uppercase tracking-widest text-gray-500 bg-gray-100 block text-center">
              Infrastructure Lifecycle Index
            </span>
          </div>
          
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {[
              { num: 1, name: 'Pre-Construction Intel', icon: Compass, status: 'Active' },
              { num: 2, name: 'Design & Planning', icon: Layers, status: 'Active' },
              { num: 3, name: 'Procurement Logistics', icon: Truck, status: 'Active' },
              { num: 4, name: 'Execution Intelligence', icon: HardHat, status: 'Gate Check' },
              { num: 5, name: 'Advanced QA/QC LIMS', icon: Sigma, status: 'Calibration' },
              { num: 6, name: 'Live Operations SCADA', icon: Radio, status: 'Sensors ON' },
              { num: 7, name: 'Disaster Simulation', icon: Sliders, status: 'Inactive' },
              { num: 8, name: 'Financial ERP Engine', icon: BarChart2, status: 'Budget OK' },
              { num: 9, name: 'Post-Construction Life', icon: Clock, status: 'Aging Ticker' },
              { num: 10, name: 'National Smart City OS', icon: Globe, status: 'Macro Graph' },
              { num: 11, name: 'Future Generative AI', icon: Cpu, status: 'Generative' },
            ].map((lvl) => {
              const Icon = lvl.icon;
              const isSelected = activeLevel === lvl.num;
              
              return (
                <button
                  key={lvl.num}
                  onClick={() => {
                    setActiveLevel(lvl.num);
                    if (lvl.num === 5) setActiveSubTab('Cube');
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded border font-mono text-[9px] uppercase font-bold tracking-wide transition-all ${
                    isSelected 
                      ? 'bg-black text-white border-black shadow-[2px_2px_0px_rgba(0,0,0,0.15)] font-black' 
                      : 'text-gray-600 bg-white border-transparent hover:border-black hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[7px] px-1 border ${isSelected ? 'border-white text-white' : 'border-black text-black'}`}>L{lvl.num}</span>
                    <Icon className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[110px]">{lvl.name}</span>
                  </div>
                  <ChevronRight className="h-3 w-3" />
                </button>
              );
            })}
          </nav>
          
          <div className="p-3 border-t border-black bg-white space-y-1">
            <div className="flex justify-between items-center text-[7.5px] uppercase font-bold text-gray-500">
              <span>ACTIVE COCKPIT TELEMETRY</span>
              <span className="animate-pulse">●</span>
            </div>
            <div className="text-[9px] font-mono leading-tight uppercase font-semibold text-black">
              LOAD FACTORS: NOMINAL<br />
              W/C RATIO INDEX: 0.42<br />
              CONCRETE CLOUD SYNC: ONLINE
            </div>
          </div>
        </div>

        {/* Right Side: Active Workspace (3/4 columns) */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-x-hidden">
          
          {/* LEVEL 1: PRE-CONSTRUCTION INTELLIGENCE */}
          {activeLevel === 1 && (
            <div className="space-y-6">
              <div className="border border-black p-3 bg-gray-50 relative">
                <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 1 - Land & Foundation Intelligence</span>
                
                <h3 className="font-bold text-[10px] uppercase border-b border-black pb-1 mb-3">Terzaghi Ultimate Bearing Capacity Simulator</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Soil Cohesion ($c$)</span>
                        <span>{soilCohesion} kPa</span>
                      </div>
                      <input
                        type="range" min="5" max="80" value={soilCohesion}
                        onChange={(e) => setSoilCohesion(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Surcharge Pressure ($q$)</span>
                        <span>{soilSurcharge} kPa</span>
                      </div>
                      <input
                        type="range" min="0" max="50" value={soilSurcharge}
                        onChange={(e) => setSoilSurcharge(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Soil Unit Weight ($\gamma$)</span>
                        <span>{soilUnitWeight} kN/m³</span>
                      </div>
                      <input
                        type="range" min="12" max="24" value={soilUnitWeight}
                        onChange={(e) => setSoilUnitWeight(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Foundation Width ($B$)</span>
                        <span>{foundationWidth} m</span>
                      </div>
                      <input
                        type="range" min="1.0" max="5.0" step="0.2" value={foundationWidth}
                        onChange={(e) => setFoundationWidth(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>
                  </div>

                  <div className="border border-dashed border-black p-3 bg-white flex flex-col justify-between">
                    <div className="space-y-2 text-[9px] font-mono">
                      <p className="font-bold border-b border-black pb-1 uppercase">TERZAGHI PHYSICS FORMULA</p>
                      <p className="italic bg-gray-50 p-1.5 border font-semibold select-all text-center">
                        q_u = c·N_c + q·N_q + 0.5·γ·B·N_γ
                      </p>
                      <p className="text-[7.5px] text-gray-500 uppercase leading-normal">
                        Assuming General Shear parameters: N_c = 15.0 // N_q = 8.5 // N_γ = 6.2 (Bearing capacity factors relative to soil shear plane).
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-black flex justify-between items-center">
                      <div>
                        <p className="text-[8px] text-gray-500 uppercase">Allowable Capacity (q_a = q_u / 3)</p>
                        <p className="text-sm font-black text-black">{allowableCapacity} kPa</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-gray-500 uppercase">Soil Safety Multiplier</p>
                        <span className={`text-[9px] px-1 border font-bold ${Number(soilSafetyIndex) >= 1.0 ? 'bg-black text-white border-black' : 'border-black text-black bg-red-100 animate-pulse'}`}>
                          {soilSafetyIndex} x (Target: 1.0x)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 3. GIS Waypoint Simulator */}
                <div className="border border-black p-3 bg-gray-50 relative">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">LiDAR Terrain Scanning & GIS mapping</span>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold uppercase">Asset Target Area</span>
                    <select 
                      value={gisLocation} onChange={(e) => {
                        setGisLocation(e.target.value);
                        setSelectedWaypoint(null);
                      }} 
                      className="border border-black bg-white p-1 text-[8.5px] font-bold focus:outline-none"
                    >
                      <option>Bandra-Worli (Mumbai)</option>
                      <option>Chennai Metro Line 3</option>
                      <option>Narmada River Bridge (GJ)</option>
                    </select>
                  </div>
                  
                  <div className="border border-black bg-white h-28 relative overflow-hidden flex flex-col justify-center items-center">
                    <div className="absolute inset-0 cad-grid opacity-60 pointer-events-none"></div>
                    <span className="text-[7.5px] text-gray-400 absolute top-1 left-1">TOPOGRAPHIC GRID RADAR</span>
                    
                    {/* Simulated survey dots */}
                    <div className="flex gap-4">
                      {[
                        { id: 'WP-101', lat: '19.0330° N', lng: '72.8167° E', elev: '12.4m', wt: '-2.4m' },
                        { id: 'WP-102', lat: '19.0342° N', lng: '72.8181° E', elev: '15.1m', wt: '-4.1m' },
                        { id: 'WP-103', lat: '19.0355° N', lng: '72.8194° E', elev: '9.8m', wt: '-1.1m' }
                      ].map((dot) => (
                        <button
                          key={dot.id}
                          onClick={() => setSelectedWaypoint(dot)}
                          className={`h-8 w-16 border border-black rounded text-[8px] flex flex-col items-center justify-center font-bold tracking-wider cursor-pointer shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                            selectedWaypoint?.id === dot.id ? 'bg-black text-white' : 'bg-gray-50 hover:bg-gray-200'
                          }`}
                        >
                          <span>{dot.id}</span>
                          <span className="text-[6.5px] font-normal font-mono">{dot.elev}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedWaypoint && (
                    <div className="mt-2 text-[8px] font-mono bg-white border border-black p-2 uppercase font-semibold leading-tight">
                      Waypoint: {selectedWaypoint.id} <br />
                      Coordinates: {selectedWaypoint.lat}, {selectedWaypoint.lng} <br />
                      Elevation: {selectedWaypoint.elev} | Sub-grade Water Table: {selectedWaypoint.wt}
                    </div>
                  )}
                </div>

                {/* 4. Legal permit tracker */}
                <div className="border border-black p-3 bg-gray-50 relative flex flex-col justify-between">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Legal approvals & Zoning Clearances</span>
                  <div className="space-y-1.5 pt-1">
                    {Object.keys(permits).map((permitKey) => (
                      <label key={permitKey} className="flex items-center justify-between text-[9px] font-bold uppercase cursor-pointer hover:bg-gray-100 p-1 border border-transparent hover:border-black">
                        <span className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={permits[permitKey]}
                            onChange={(e) => {
                              setPermits(prev => ({ ...prev, [permitKey]: e.target.checked }));
                              setPermitScanResult('');
                            }}
                            className="accent-black"
                          />
                          {permitKey.replace(/([A-Z])/g, ' $1').trim()} Clearance
                        </span>
                        <span className={`text-[7.5px] px-1 border font-bold ${permits[permitKey] ? 'bg-black text-white border-black' : 'border-black text-black bg-white'}`}>
                          {permits[permitKey] ? 'APPROVED' : 'PENDING'}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        const allApproved = Object.values(permits).every(Boolean);
                        if (allApproved) {
                          setPermitScanResult('✓ AI INSPECTOR: ALL MUNICIPAL BUILDING PERMITS VERIFIED. NOMINAL COMPLIANCE REACHED.');
                        } else {
                          setPermitScanResult('🚨 AI INSPECTOR: COMPLIANCE BREACH. missing environment/coastal approval certificates.');
                        }
                      }}
                      className="flex-1 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white text-black text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-0.5 text-center"
                    >
                      Audit Regulatory Compliances
                    </button>
                  </div>

                  {permitScanResult && (
                    <div className="mt-2 text-[7.5px] font-mono leading-snug uppercase border border-black p-1.5 bg-white font-semibold">
                      {permitScanResult}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* LEVEL 2: DESIGN & PLANNING INTELLIGENCE */}
          {activeLevel === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* MEP balance */}
                <div className="border border-black p-3 bg-gray-50 relative">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">MEP Engineering load balance gauges</span>
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Mechanical HVAC Load</span>
                        <span>{hvacLoad} kW</span>
                      </div>
                      <input
                        type="range" min="100" max="600" value={hvacLoad}
                        onChange={(e) => setHvacLoad(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Plumbing Drainage Flow</span>
                        <span>{waterFlow} GPM</span>
                      </div>
                      <input
                        type="range" min="10" max="150" value={waterFlow}
                        onChange={(e) => setWaterFlow(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Electrical Substation Demand</span>
                        <span>{electricalKva} kVA</span>
                      </div>
                      <input
                        type="range" min="200" max="1200" value={electricalKva}
                        onChange={(e) => setElectricalKva(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black flex justify-between items-center text-[9px] font-bold">
                    <span>GRID OVERLOAD RISK STATUS:</span>
                    <span className={`px-1 border ${electricalKva > 850 ? 'bg-black text-white border-black animate-pulse' : 'border-black bg-white text-black'}`}>
                      {electricalKva > 850 ? 'CRITICAL EXCESSED (850 kVA Limit)' : 'STABLE'}
                    </span>
                  </div>
                </div>

                {/* Sunlight optimization */}
                <div className="border border-black p-3 bg-gray-50 relative flex flex-col justify-between">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Ventilation & sunlight thermal flow</span>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[9px] font-bold uppercase">
                      <span>Solar Angle Time of Day</span>
                      <span>{timeOfDay}:00 hrs</span>
                    </div>
                    <input
                      type="range" min="8" max="18" value={timeOfDay}
                      onChange={(e) => setTimeOfDay(Number(e.target.value))}
                      className="w-full accent-black cursor-ew-resize"
                    />
                    
                    <div className="text-[8.5px] font-mono space-y-1 pt-2 uppercase">
                      <div className="flex justify-between">
                        <span>Calculated Solar Radiant Flux:</span>
                        <span className="font-bold">{(Math.sin((timeOfDay - 6) * Math.PI / 12) * 850).toFixed(0)} W/m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emergency Evacuation Egress Speed:</span>
                        <span className="font-bold">4.2m/s (Egress route open)</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Natural daylight coefficient:</span>
                        <span>{timeOfDay >= 11 && timeOfDay <= 14 ? 'EXCELLENT (0.84)' : 'NOMINAL (0.42)'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[7px] text-gray-500 italic mt-3">
                    Simulated in Bangalore grid. High space efficiency, sunlight ventilation loops validated.
                  </div>
                </div>

              </div>

              {/* BIM Level 1-7 Clash detector */}
              <div className="border border-black p-3 bg-gray-50 relative">
                <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 2 - BIM Level 1–7 clash detection platform</span>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-[9.5px] uppercase">Active Autodesk Revit / IFC Clashes</h3>
                  <span className="text-[8px] bg-black text-white px-1 font-bold">BIM MODEL: LEVEL 5 (LOD-400)</span>
                </div>

                <div className="border border-black overflow-hidden bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <table className="w-full text-left font-mono text-[9px]">
                    <thead>
                      <tr className="bg-gray-100 border-b border-black font-bold uppercase text-[7.5px]">
                        <th className="p-2 border-r border-black">Element Structural A</th>
                        <th className="p-2 border-r border-black">Element Mech/Elec B</th>
                        <th className="p-2 border-r border-black">Clash Type</th>
                        <th className="p-2 border-r border-black">Status</th>
                        <th className="p-2">CRM Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bimClashes.map((clash) => (
                        <tr key={clash.id} className="border-b border-black last:border-b-0">
                          <td className="p-2 border-r border-black font-semibold uppercase">{clash.elementA}</td>
                          <td className="p-2 border-r border-black font-semibold uppercase">{clash.elementB}</td>
                          <td className="p-2 border-r border-black">
                            <span className={`px-1 border text-[7.5px] font-bold ${clash.type === 'Hard Clash' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                              {clash.type}
                            </span>
                          </td>
                          <td className="p-2 border-r border-black font-bold">
                            {clash.resolved ? (
                              <span className="text-black bg-gray-100 border border-black px-1 text-[7.5px]">RESOLVED</span>
                            ) : (
                              <span className="bg-black text-white px-1 text-[7.5px] animate-pulse">PENDING</span>
                            )}
                          </td>
                          <td className="p-2">
                            {!clash.resolved ? (
                              <button
                                onClick={() => handleResolveBimClash(clash.id)}
                                className="px-2 py-0.5 border border-black bg-white hover:bg-black hover:text-white text-[7.5px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Issue Rework Ticket
                              </button>
                            ) : (
                              <span className="text-[7.5px] text-gray-500 italic">Ticket Logged [SSOT]</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 3: PROCUREMENT & SUPPLY CHAIN */}
          {activeLevel === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Quarry sourcing grading */}
                <div className="border border-black p-3 bg-gray-50 relative flex flex-col justify-between">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Quarry & aggregates source origin</span>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                      <span>Source Quarry</span>
                      <select 
                        value={quarrySource} onChange={(e) => setQuarrySource(e.target.value)} 
                        className="border border-black bg-white p-1 text-[8.5px] focus:outline-none"
                      >
                        <option>Pune Aggregate Quarry</option>
                        <option>Ennore River Sand (TN)</option>
                        <option>Vizag Steel Rebar Plant</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Sieve Fineness Modulus</span>
                        <span>{aggregateSieveModulus} mm (Sand)</span>
                      </div>
                      <input
                        type="range" min="1.8" max="3.5" step="0.1" value={aggregateSieveModulus}
                        onChange={(e) => setAggregateSieveModulus(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>
                  </div>

                  <div className="border border-black p-2 bg-white mt-3 font-mono text-[8.5px] space-y-1.5 uppercase font-semibold">
                    <p className="font-bold border-b border-black pb-0.5">AGGREGATE SIEVE ANALYSIS</p>
                    <div className="flex justify-between">
                      <span>Passing 4.75mm Sieve:</span>
                      <span>{Math.min(100, 95 + (aggregateSieveModulus - 2.8) * 8).toFixed(1)}% (Grading Zone II)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passing 150μm Sieve:</span>
                      <span>{(5 - (aggregateSieveModulus - 2.8) * 2).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sustainability carbon Rating:</span>
                      <span className="bg-black text-white px-1">VERIFIED CLEAN SOURCING (A+)</span>
                    </div>
                  </div>

                  <p className="text-[7.5px] text-gray-500 uppercase mt-2 leading-none">
                    * Aggregate grading complies with IS 383 specification standard criteria.
                  </p>
                </div>

                {/* Logistics tracker */}
                <div className="border border-black p-3 bg-gray-50 relative flex flex-col justify-between">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Cement Logistics Transit controller</span>
                  
                  <div className="space-y-3 pt-2">
                    <p className="text-[9px] font-bold uppercase border-b border-black pb-0.5 flex items-center gap-1.5">
                      <Truck className="h-4 w-4" /> Live Mixer Fleet Telemetry
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8.5px] font-mono font-bold uppercase">
                        <span>Active Cement Drum Rotation Speed</span>
                        <span>{cementDrumRPM} RPM</span>
                      </div>
                      <input
                        type="range" min="6" max="18" value={cementDrumRPM}
                        onChange={(e) => setCementDrumRPM(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>
                    
                    <div className="text-[8.5px] font-mono space-y-1 pt-2 uppercase font-semibold">
                      <div className="flex justify-between">
                        <span>Truck Dispatch ID:</span>
                        <span>MH-12-CT-8942 // Cement mixer</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Concrete Slurry Temperature:</span>
                        <span className={cementTemp > 32 ? 'text-red-600 animate-pulse' : ''}>{cementTemp}°C (Safe limit &lt; 32°C)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transit duration:</span>
                        <span>42 mins | Delay prediction: NIL</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[7.5px] text-gray-500 uppercase mt-2">
                    Sieve grading and logistics variables verified against site requirements.
                  </p>
                </div>

              </div>

              {/* Vendor Intelligence */}
              <div className="border border-black p-3 bg-gray-50 relative">
                <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 3 - Vendor Intelligence System</span>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-black uppercase">Material Vendor Fraud & Quality rating index</span>
                  <span className="text-[8px] bg-black text-white px-1 font-bold">FRAUD DETECTION MODULE ACTIVE</span>
                </div>

                <div className="border border-black overflow-hidden bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <table className="w-full text-left font-mono text-[9px]">
                    <thead>
                      <tr className="bg-gray-100 border-b border-black font-bold uppercase text-[7.5px]">
                        <th className="p-2 border-r border-black">Supplier Name</th>
                        <th className="p-2 border-r border-black">Material Supplied</th>
                        <th className="p-2 border-r border-black">Historical Defect Rate</th>
                        <th className="p-2 border-r border-black">Financial Stability Score</th>
                        <th className="p-2">Fraud Risk Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-2 border-r border-black font-bold uppercase">Deccan Cement Corp</td>
                        <td className="p-2 border-r border-black">Cement (OPC-53)</td>
                        <td className="p-2 border-r border-black">0.4% (Nominal)</td>
                        <td className="p-2 border-r border-black">94 / 100</td>
                        <td className="p-2"><span className="px-1 border border-black text-[7.5px] bg-gray-100">SAFE</span></td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 border-r border-black font-bold uppercase">Western Aggregate Mining</td>
                        <td className="p-2 border-r border-black">Coarse Aggregate</td>
                        <td className="p-2 border-r border-black">3.8% (Elevated)</td>
                        <td className="p-2 border-r border-black">81 / 100</td>
                        <td className="p-2"><span className="px-1 border border-black text-[7.5px] bg-yellow-100 font-bold">LOW VARIANCE</span></td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-black font-bold uppercase">Vizag Steel Depot</td>
                        <td className="p-2 border-r border-black">Steel rebars</td>
                        <td className="p-2 border-r border-black">0.1% (Excellent)</td>
                        <td className="p-2 border-r border-black">98 / 100</td>
                        <td className="p-2"><span className="px-1 border border-black text-[7.5px] bg-gray-100">SAFE</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 4: CONSTRUCTION EXECUTION */}
          {activeLevel === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Smart PPE scanner */}
                <div className="border border-black p-3 bg-gray-50 relative flex flex-col justify-between">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Smart PPE Camera gate scanner</span>
                  
                  <div className="space-y-3 pt-2">
                    <p className="text-[9px] font-bold uppercase border-b border-black pb-0.5 flex items-center gap-1.5">
                      <HardHat className="h-4 w-4" /> CV Smart PPE Webcam Simulation
                    </p>
                    
                    <div className="border border-black bg-white p-3 h-28 relative overflow-hidden flex flex-col justify-center items-center">
                      <div className="absolute inset-0 cad-grid opacity-50 pointer-events-none"></div>
                      <span className="text-[7.5px] text-gray-400 absolute top-1 left-1">SITE PORTAL WEBCAM SCAN</span>

                      {scanningPpe ? (
                        <div className="text-center space-y-2">
                          <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full block mx-auto"></span>
                          <span className="text-[8px] font-black uppercase tracking-wider block">Scanning labour face profile...</span>
                        </div>
                      ) : (
                        <button
                          onClick={handlePpeWebcamScan}
                          className="px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white text-black text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-0.5"
                        >
                          Trigger Smart PPE Gate Check
                        </button>
                      )}
                    </div>
                  </div>

                  {latestPpeAlert && (
                    <div className="mt-2 text-[7.5px] font-mono leading-snug uppercase border border-black p-1.5 bg-white font-semibold">
                      {latestPpeAlert}
                    </div>
                  )}

                  <p className="text-[7.5px] text-gray-500 uppercase mt-2">
                    * Automated PPE verification complying with ACI structural safety norms.
                  </p>
                </div>

                {/* Workforce metrics */}
                <div className="border border-black p-3 bg-gray-50 relative flex flex-col justify-between">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Workforce Productivity & fatigue</span>
                  
                  <div className="space-y-3 pt-2">
                    <p className="text-[9px] font-bold uppercase border-b border-black pb-0.5 flex items-center gap-1.5">
                      <Users className="h-4 w-4" /> Labour Attendance & safety records
                    </p>
                    
                    <div className="border border-black overflow-hidden bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      <table className="w-full text-left font-mono text-[8px]">
                        <thead>
                          <tr className="bg-gray-100 border-b border-black font-bold uppercase text-[7px]">
                            <th className="p-1.5 border-r border-black">Labour Name</th>
                            <th className="p-1.5 border-r border-black">Duty Role</th>
                            <th className="p-1.5 border-r border-black">Fatigue</th>
                            <th className="p-1.5">Zoning safety</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-1.5 border-r border-black font-bold">R. Jadhav</td>
                            <td className="p-1.5 border-r border-black">Rebar Welder</td>
                            <td className="p-1.5 border-r border-black">NOMINAL (12%)</td>
                            <td className="p-1.5 text-black font-bold">VERIFIED</td>
                          </tr>
                          <tr className="border-t border-black">
                            <td className="p-1.5 border-r border-black font-bold">S. Pillai</td>
                            <td className="p-1.5 border-r border-black">Masonry Expert</td>
                            <td className="p-1.5 border-r border-black">ELEVATED (48%)</td>
                            <td className="p-1.5 text-red-600 font-bold animate-pulse">BREACH ALERT</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p className="text-[7.5px] text-gray-500 uppercase mt-2">
                    Attendance vectors linked with Smart RFID safety badges.
                  </p>
                </div>

              </div>

              {/* Progress AI */}
              <div className="border border-black p-3 bg-gray-50 relative">
                <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 4 - Construction GANTT & delay tracker</span>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold uppercase">Autonomous schedule verification</span>
                  <span className="text-[8px] bg-black text-white px-1 font-bold">CONSTRUCTION PROGRESS RATE: 78.4%</span>
                </div>

                <div className="space-y-2 bg-white border border-black p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] text-[8.5px] font-mono font-semibold uppercase">
                  <div className="flex justify-between">
                    <span>Task Name:</span>
                    <span>Target completion date // delay variance</span>
                  </div>
                  <div className="flex justify-between border-t border-black pt-1.5">
                    <span>01. Foundation concreting:</span>
                    <span>COMPLETED // 0 days delay</span>
                  </div>
                  <div className="flex justify-between border-t border-black pt-1.5">
                    <span>02. Column Pillar reinforcements:</span>
                    <span>COMPLETED // +2 days delay</span>
                  </div>
                  <div className="flex justify-between border-t border-black pt-1.5">
                    <span>03. Slab Level-3 concrete pour:</span>
                    <span className="bg-black text-white px-1">IN PROGRESS // +4 days delay predicted</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 5: ADVANCED QA/QC (LIMS) */}
          {activeLevel === 5 && (
            <div className="space-y-6">
              
              {/* LIMS Subtab selector */}
              <div className="flex border border-black bg-white rounded overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                {[
                  { id: 'Cube', label: 'Concrete Cube Compressive Strength (LIMS)' },
                  { id: 'Slump', label: 'Slump Cone & Water/Cement Index' },
                  { id: 'NDT', label: 'Ultrasonic Pulse NDT & Steel Yield' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`flex-1 py-2 text-[9px] font-black border-r last:border-r-0 border-black uppercase tracking-wider transition-colors cursor-pointer ${
                      activeSubTab === tab.id 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* LIMS SUBTAB: Concrete cube test */}
              {activeSubTab === 'Cube' && (
                <div className="border border-black p-3 bg-gray-50 relative space-y-4">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 5 - Concrete Cube compression test station</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                        <span>Designed Concrete Grade</span>
                        <select 
                          value={limsConcreteGrade} onChange={(e) => setLimsConcreteGrade(e.target.value)} 
                          className="border border-black bg-white p-1 text-[8.5px] focus:outline-none"
                        >
                          <option>M20</option>
                          <option>M25</option>
                          <option>M30</option>
                          <option>M40</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                          <span>Ultimate Compressive Load ($P$)</span>
                          <span>{limsCompressiveForce} kN</span>
                        </div>
                        <input
                          type="range" min="200" max="1100" value={limsCompressiveForce}
                          onChange={(e) => setLimsCompressiveForce(Number(e.target.value))}
                          className="w-full accent-black cursor-ew-resize"
                        />
                        <div className="flex justify-between text-[7px] text-gray-500">
                          <span>200 kN</span>
                          <span>1100 kN</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-dashed border-black p-3 bg-white flex flex-col justify-between">
                      <div className="space-y-1.5 text-[8.5px] font-mono uppercase font-semibold">
                        <p className="font-bold border-b border-black pb-0.5">Cube physical specifications</p>
                        <div className="flex justify-between">
                          <span>Standard cube dimensions:</span>
                          <span>150mm x 150mm x 150mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cross sectional Area ($A$):</span>
                          <span>22500 mm² (0.0225 m²)</span>
                        </div>
                        <div className="flex justify-between border-t border-black pt-1 text-black font-bold">
                          <span>Target Strength (f<sub>ck</sub>):</span>
                          <span>{concreteTarget} MPa (min limit)</span>
                        </div>
                        <div className="flex justify-between text-black font-bold">
                          <span>Calculated Strength ($P/A$):</span>
                          <span className={concretePassed ? 'text-black' : 'text-red-600 animate-pulse'}>
                            {concreteMpa} MPa
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-black flex gap-2">
                        <button
                          onClick={handleCertifyConcreteCube}
                          className="w-full py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white text-black text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-0.5 text-center"
                        >
                          Certify strength and log to CRM
                        </button>
                      </div>
                    </div>
                  </div>

                  {limsLogMsg && (
                    <div className="text-[7.5px] font-mono leading-snug uppercase border border-black p-2 bg-white font-semibold">
                      {limsLogMsg}
                    </div>
                  )}
                </div>
              )}

              {/* LIMS SUBTAB: Slump test */}
              {activeSubTab === 'Slump' && (
                <div className="border border-black p-3 bg-gray-50 relative space-y-4">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 5 - Concrete slump cone workability index</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                          <span>Measured Slump Height</span>
                          <span>{limsSlumpConeValue} mm</span>
                        </div>
                        <input
                          type="range" min="10" max="180" value={limsSlumpConeValue}
                          onChange={(e) => setLimsSlumpConeValue(Number(e.target.value))}
                          className="w-full accent-black cursor-ew-resize"
                        />
                        <div className="flex justify-between text-[7px] text-gray-500">
                          <span>10 mm (Dry mix)</span>
                          <span>180 mm (High slump flow)</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-dashed border-black p-3 bg-white flex flex-col justify-between text-[8.5px] font-mono uppercase font-semibold">
                      <div className="space-y-1.5">
                        <p className="font-bold border-b border-black pb-0.5">Slump grading classification</p>
                        <div className="flex justify-between">
                          <span>Slump Height:</span>
                          <span>{limsSlumpConeValue} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Workability Grade:</span>
                          <span className="font-bold">
                            {limsSlumpConeValue < 25 && 'VERY LOW (Zero Slump)'}
                            {limsSlumpConeValue >= 25 && limsSlumpConeValue < 75 && 'LOW (Dry Slump mix)'}
                            {limsSlumpConeValue >= 75 && limsSlumpConeValue < 125 && 'MEDIUM (Pillar Concrete mix)'}
                            {limsSlumpConeValue >= 125 && 'HIGH (Flowing pump Concrete)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated w/c ratio:</span>
                          <span>{(0.35 + limsSlumpConeValue * 0.0015).toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LIMS SUBTAB: NDT */}
              {activeSubTab === 'NDT' && (
                <div className="border border-black p-3 bg-gray-50 relative space-y-4">
                  <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 5 - Ultrasonic pulse NDT & steel yield tests</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                          <span>Ultrasonic wave velocity</span>
                          <span>{limsAcousticSpeed} m/s</span>
                        </div>
                        <input
                          type="range" min="2000" max="5000" step="50" value={limsAcousticSpeed}
                          onChange={(e) => setLimsAcousticSpeed(Number(e.target.value))}
                          className="w-full accent-black cursor-ew-resize"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                          <span>Steel Yield strength ($F_y$)</span>
                          <span>{limsSteelYieldStrength} MPa</span>
                        </div>
                        <input
                          type="range" min="300" max="650" value={limsSteelYieldStrength}
                          onChange={(e) => setLimsSteelYieldStrength(Number(e.target.value))}
                          className="w-full accent-black cursor-ew-resize"
                        />
                      </div>
                    </div>

                    <div className="border border-dashed border-black p-3 bg-white flex flex-col justify-between text-[8.5px] font-mono uppercase font-semibold">
                      <div className="space-y-1.5">
                        <p className="font-bold border-b border-black pb-0.5">Acoustic & steel properties</p>
                        <div className="flex justify-between">
                          <span>Concrete NDT Quality:</span>
                          <span className="font-bold">
                            {limsAcousticSpeed >= 4000 ? 'EXCELLENT' : limsAcousticSpeed >= 3200 ? 'GOOD' : 'POOR'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Steel Grade Equivalent:</span>
                          <span>Fe-{limsSteelYieldStrength > 500 ? '550D' : '500'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Defect Void Index:</span>
                          <span>{limsAcousticSpeed < 3000 ? 'HIGH VOIDS WARNING' : 'NOMINAL'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* LEVEL 6: LIVE OPERATIONS & SCADA */}
          {activeLevel === 6 && (
            <div className="space-y-6">
              <div className="border border-black p-3 bg-gray-50 relative">
                <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 6 - Live Operations PLC SCADA Telemetry</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Pillar Eigenmode frequency</span>
                        <span>{scadaFrequency} Hz</span>
                      </div>
                      <input
                        type="range" min="1.0" max="15.0" step="0.2" value={scadaFrequency}
                        onChange={(e) => setScadaFrequency(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Strain gauge micro-strain</span>
                        <span>{scadaStressMicroStrain} με</span>
                      </div>
                      <input
                        type="range" min="50" max="500" value={scadaStressMicroStrain}
                        onChange={(e) => setScadaStressMicroStrain(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>
                  </div>

                  <div className="border border-black bg-white p-3 flex flex-col justify-center items-center relative overflow-hidden">
                    <span className="text-[7.5px] text-gray-400 absolute top-1 left-1">SCADA OSCILLATOR SPECTRUM</span>
                    <canvas ref={scadaCanvasRef} width={280} height={90} className="w-full h-24 border border-black bg-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 7: DISASTER SIMULATION */}
          {activeLevel === 7 && (
            <div className="space-y-6">
              <div className="border border-black p-3 bg-gray-50 relative">
                <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 7 - Multi-Physics Disaster Simulation Engine</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Richter Earthquake Shaking</span>
                        <span>{disasterEarthquake.toFixed(1)} Mw</span>
                      </div>
                      <input
                        type="range" min="0.0" max="9.0" step="0.5" value={disasterEarthquake}
                        onChange={(e) => setDisasterEarthquake(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span>Rising Flood Depth</span>
                        <span>{disasterFloodDepth.toFixed(1)} m</span>
                      </div>
                      <input
                        type="range" min="0.0" max="8.0" step="0.5" value={disasterFloodDepth}
                        onChange={(e) => setDisasterFloodDepth(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>
                  </div>

                  <div className="border border-dashed border-black p-3 bg-white text-[8.5px] font-mono uppercase font-semibold flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <p className="font-bold border-b border-black pb-0.5">Computed disaster stress indexes</p>
                      <div className="flex justify-between">
                        <span>Ground Shear Force increment:</span>
                        <span>{(disasterEarthquake * 42.5).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hydrostatic pressure on foundation:</span>
                        <span>{(disasterFloodDepth * 9.81).toFixed(2)} kPa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 8: FINANCIAL ERP & CARBON */}
          {activeLevel === 8 && (
            <div className="space-y-6">
              <div className="border border-black p-3 bg-gray-50 relative">
                <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 8 - ERP Inventory & materials cost tracker</span>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-black uppercase">Steel, Sand, Aggregates and cement Ledger</span>
                  <span className="text-[8px] bg-black text-white px-1 font-bold">PLANNED VS ACTUAL SPEND</span>
                </div>

                <div className="border border-black overflow-hidden bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <table className="w-full text-left font-mono text-[8px] leading-tight">
                    <thead>
                      <tr className="bg-gray-100 border-b border-black font-bold uppercase text-[7.5px]">
                        <th className="p-2 border-r border-black">Material Spec</th>
                        <th className="p-2 border-r border-black">Planned Qty</th>
                        <th className="p-2 border-r border-black">Actual Qty</th>
                        <th className="p-2 border-r border-black">Planned Price</th>
                        <th className="p-2">Actual Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {erpInventory.map((item) => (
                        <tr key={item.id} className="border-b border-black last:border-b-0">
                          <td className="p-2 border-r border-black font-bold uppercase">{item.material}</td>
                          <td className="p-2 border-r border-black">{item.plannedQty} {item.unit}</td>
                          <td className="p-2 border-r border-black">{item.actualQty} {item.unit}</td>
                          <td className="p-2 border-r border-black">₹{item.plannedCost}</td>
                          <td className="p-2">₹{item.actualCost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 9: POST-CONSTRUCTION LIFE */}
          {activeLevel === 9 && (
            <div className="space-y-6">
              <div className="border border-black p-3 bg-gray-50 relative">
                <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 9 - expected structural decay & lifespan</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-bold uppercase">
                      <span>Lifespan aging slider</span>
                      <span>+ {lifecycleAgeYears} Years</span>
                    </div>
                    <input
                      type="range" min="0" max="50" value={lifecycleAgeYears}
                      onChange={(e) => setLifecycleAgeYears(Number(e.target.value))}
                      className="w-full accent-black cursor-ew-resize"
                    />
                  </div>

                  <div className="border border-dashed border-black p-3 bg-white text-[8.5px] font-mono uppercase font-semibold flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <p className="font-bold border-b border-black pb-0.5">Lifespan structural forecast</p>
                      <div className="flex justify-between">
                        <span>Aggregate corrosion factor:</span>
                        <span>{(lifecycleAgeYears * 0.15).toFixed(2)} mm rust thickness</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Concrete Elasticity decay:</span>
                        <span>{(lifecycleAgeYears * 0.42).toFixed(1)}% tension loss</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 10: NATIONAL INFRASTRUCTURE SYSTEM */}
          {activeLevel === 10 && (
            <div className="space-y-6">
              <div className="border border-black p-3 bg-gray-50 relative">
                <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 10 - Municipal Utilities Smart City control desk</span>
                <div className="grid grid-cols-3 gap-4 pt-1">
                  <div className="border border-black p-3 bg-white uppercase font-bold text-center">
                    <p className="text-[8px] text-gray-500">Power grid strain</p>
                    <p className="text-xs">420 kW // SAFE</p>
                  </div>
                  <div className="border border-black p-3 bg-white uppercase font-bold text-center">
                    <p className="text-[8px] text-gray-500">Water pressure</p>
                    <p className="text-xs">45 PSI // STABLE</p>
                  </div>
                  <div className="border border-black p-3 bg-white uppercase font-bold text-center">
                    <p className="text-[8px] text-gray-500">Transit operations</p>
                    <p className="text-xs">98.4% ON-TIME</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 11: FUTURE TECH */}
          {activeLevel === 11 && (
            <div className="space-y-6">
              <div className="border border-black p-3 bg-gray-50 relative">
                <span className="text-[7.5px] font-bold border border-black px-1 bg-black text-white absolute -top-2 left-2">Level 11 - Generative Engineering AI design workspace</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                      <span>Generative Design optimization target</span>
                      <select 
                        value={aiDesignGoal} onChange={(e) => setAiDesignGoal(e.target.value)} 
                        className="border border-black bg-white p-1 text-[8.5px] focus:outline-none"
                      >
                        <option>Reduce Pillar Cross Section</option>
                        <option>Optimize Rebar Steel Layout</option>
                        <option>Max Carbon Absorption Mix</option>
                      </select>
                    </div>

                    <button
                      onClick={handleGenerativeAI}
                      disabled={isAiGenerating}
                      className="w-full py-2 border-2 border-black bg-white hover:bg-black hover:text-white text-black text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-0.5 text-center disabled:opacity-50"
                    >
                      {isAiGenerating ? 'AI Synthesizing design arrays...' : 'Generate Optimized Design Blueprint'}
                    </button>
                  </div>

                  <div className="border border-dashed border-black p-3 bg-white text-[8.5px] font-mono uppercase font-semibold flex flex-col justify-between min-h-[140px]">
                    {aiDesignOutput ? (
                      <div className="space-y-2">
                        <p className="font-bold border-b border-black pb-0.5 text-black">GENERATED BLUEPRINT [COORDINATES]:</p>
                        <p className="text-[7.5px] text-gray-500">{aiDesignOutput.layoutSpec}</p>
                        <div className="flex justify-between border-t border-black pt-1">
                          <span>Weight savings achieved:</span>
                          <span className="font-black text-black">{aiDesignOutput.weightSaved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbon reduction factor:</span>
                          <span className="font-black text-black">{aiDesignOutput.carbonSaved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Safety Factor compliance:</span>
                          <span className="bg-black text-white px-1 font-bold">{aiDesignOutput.safetyFactor}x</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center text-gray-400 font-bold uppercase text-[9px]">
                        Select target goal and press Generate.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
