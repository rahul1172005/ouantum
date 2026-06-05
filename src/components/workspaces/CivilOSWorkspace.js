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

function LevelCard({ icon: Icon, title, children, className = '', headerAction = null, flex = false, footer = null }) {
  return (
    <div className={`zoho-card flex flex-col ${className}`}>
      <div className="zoho-card-header">
        {Icon && <Icon className="h-4 w-4 text-gray-700 flex-shrink-0" />}
        <span className="font-bold text-gray-800 text-[12px] uppercase tracking-wide">{title}</span>
        {headerAction && <div className="ml-auto flex-shrink-0">{headerAction}</div>}
      </div>
      <div className={`zoho-card-body ${flex ? 'flex-1 flex flex-col justify-between' : ''} space-y-4`}>
        {children}
      </div>
      <div className="zoho-card-footer">
        <span className="text-gray-500 font-semibold text-[12px] uppercase tracking-normal">
          {footer || 'Click highlighted items to view real-time data logs'}
        </span>
      </div>
    </div>
  );
}

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
    <div className="min-h-[500px] bg-[#f8f9fa] flex flex-col text-gray-800 relative select-none rounded-[8px] border border-[#cccccc] shadow-sm">

      {/* Background Engineering Grids Overlay */}
      <div className="absolute inset-0 cad-grid opacity-30 pointer-events-none z-0"></div>

      {/* Header Watermark */}
      <div className="relative border-b border-[#cccccc] bg-gradient-to-b from-[#fdfdfd] to-[#eaeaea] p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 z-10 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        <div>
          <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
            <Globe className="h-4.5 w-4.5 text-black" /> CIVIL & INFRASTRUCTURE OS [COCKPIT ENGINE]
            <span className="text-[12px] px-1.5 py-0.5 rounded-[8px] border border-border-default font-bold bg-gray-50 text-black uppercase tracking-normal">LEVELS 1-11</span>
          </h2>
          <p className="text-[12px] text-gray-500 font-semibold tracking-normal mt-0.5">
            System status: nominal // 42hz IoT stream telemetry active // SSOT linked
          </p>
        </div>

        {/* Active level metrics */}
        <div className="flex gap-2">
          <div className="border border-[#dddddd] px-2.5 py-1.5 bg-white text-[12px] font-bold text-[#0b4c8c] rounded-[8px] shadow-sm flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-black flex-shrink-0" />
            <span>QA/QC TARGETS:</span>
            <span className="bg-[#f4f5f6] border border-[#d4d4d4] text-[#0b4c8c] px-1.5 py-0.5 rounded-[8px]-[3px] text-[12px] uppercase font-extrabold">PASSING</span>
          </div>
          <div className="border border-[#dddddd] px-2.5 py-1.5 bg-white text-[12px] font-bold text-[#0b4c8c] rounded-[8px] shadow-sm flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-black flex-shrink-0" />
            <span>CRM TICKETS:</span>
            <span className="bg-[#f4f5f6] border border-[#d4d4d4] text-[#0b4c8c] px-1.5 py-0.5 rounded-[8px]-[3px] text-[12px] font-extrabold">{tickets.filter(t => t.status === 'OPEN').length} OPEN</span>
          </div>
        </div>
      </div>

      {/* Core Split Screen Layout */}
      <div className="flex-1 flex flex-col lg:flex-row z-10">

        {/* Left Side: 11 levels Navigation (1/4 columns) */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-[#cccccc] flex flex-col justify-between bg-[#f4f6f8]">
          <div className="px-3 py-2 bg-[#eaecee] border-b border-[#cccccc] flex items-center font-bold text-gray-700 text-xs">
            <span>Lifecycle Explorer Index</span>
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
                  className={`w-full flex items-center justify-between p-2 rounded-[8px] text-[12px] font-bold uppercase transition-all border ${isSelected
                      ? 'bg-[#e2e2e2] text-black border-[#b8b8b8] shadow-sm'
                      : 'text-[#2d2d2d] bg-transparent border-transparent hover:underline hover:bg-[#ececec]'
                    }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[12px] px-1.5 py-0.5 border rounded-[8px]-[8px] font-semibold flex-shrink-0 ${isSelected ? 'border-[#a8a8a8] bg-white text-black' : 'border-gray-300 bg-gray-50 text-gray-600'}`}>L{lvl.num}</span>
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate max-w-[125px] xl:max-w-[155px] text-left">{lvl.name}</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[#cccccc] bg-white space-y-1">
            <div className="flex justify-between items-center text-[12px] uppercase font-bold text-gray-500">
              <span>Cockpit Telemetry</span>
              <span className="h-2 w-2 rounded-[8px]-full bg-black"></span>
            </div>
            <div className="text-[12px] text-gray-700 leading-normal uppercase">
              Load Factors: <span className="font-bold text-black">Nominal</span><br />
              W/C Ratio Index: <span className="font-bold">0.42</span><br />
              Cloud Sync: <span className="font-bold text-black">Online</span>
            </div>
          </div>
        </div>

        {/* Right Side: Active Workspace (3/4 columns) */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-x-hidden">

          {/* LEVEL 1: PRE-CONSTRUCTION INTELLIGENCE */}
          {activeLevel === 1 && (
            <div className="space-y-6">
              <LevelCard
                icon={Compass}
                title="Level 1 - Terzaghi Ultimate Bearing Capacity Simulator"
                footer="Soil bearing capacities simulated under Terzaghi mechanics"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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

                  <div className="border border-dashed border-[#c8c8c8] rounded-[8px]-[3px] p-3 bg-white flex flex-col justify-between">
                    <div className="space-y-2 text-[12px] font-mono">
                      <p className="font-bold border-b border-[#eeeeee] pb-1 uppercase">TERZAGHI PHYSICS FORMULA</p>
                      <p className="italic bg-gray-50 p-1.5 border border-[#e8e8e8] rounded-[8px]-[2px] font-semibold select-all text-center">
                        q_u = c·N_c + q·N_q + 0.5·γ·B·N_γ
                      </p>
                      <p className="text-[12px] text-gray-500 uppercase leading-normal">
                        Assuming General Shear parameters: N_c = 15.0 // N_q = 8.5 // N_γ = 6.2 (Bearing capacity factors relative to soil shear plane).
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-[#eeeeee] flex justify-between items-center">
                      <div>
                        <p className="text-[12px] text-gray-500 uppercase">Allowable Capacity (q_a = q_u / 3)</p>
                        <p className="text-sm font-black text-black">{allowableCapacity} kPa</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] text-gray-500 uppercase">Soil Safety Multiplier</p>
                        <span className={`text-[12px] px-2 py-0.5 border rounded-[8px]-[2px] font-bold ${Number(soilSafetyIndex) >= 1.0 ? 'bg-[#2d2d2d] text-white border-[#2d2d2d]' : 'border-[#d4d4d4] text-[#2d2d2d] bg-gray-100 animate-pulse'}`}>
                          {soilSafetyIndex} x (Target: 1.0x)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </LevelCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 3. GIS Waypoint Simulator */}
                <LevelCard
                  icon={Map}
                  title="Level 1 - LiDAR Terrain Scanning & GIS mapping"
                  footer="LiDAR mesh data streams live to GIS database"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] font-bold uppercase text-gray-700">Asset Target Area</span>
                    <select
                      value={gisLocation} onChange={(e) => {
                        setGisLocation(e.target.value);
                        setSelectedWaypoint(null);
                      }}
                      className="border border-[#c8c8c8] bg-white p-1 text-[12px] font-bold focus:outline-none"
                    >
                      <option>Bandra-Worli (Mumbai)</option>
                      <option>Chennai Metro Line 3</option>
                      <option>Narmada River Bridge (GJ)</option>
                    </select>
                  </div>

                  <div className="border border-[#d4d4d4] bg-white h-28 relative overflow-hidden flex flex-col justify-center items-center rounded-[8px]-[3px] shadow-inner">
                    <div className="absolute inset-0 cad-grid opacity-60 pointer-events-none"></div>
                    <span className="text-[12px] text-gray-400 absolute top-1 left-1 font-semibold uppercase">TOPOGRAPHIC GRID RADAR</span>

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
                          className={`h-8 w-16 btn-skeuo text-[12px] flex flex-col items-center justify-center font-bold tracking-wider cursor-pointer ${selectedWaypoint?.id === dot.id ? 'btn-skeuo-dark text-white' : ''
                            }`}
                          style={{ minHeight: 'auto', padding: '2px 4px' }}
                        >
                          <span>{dot.id}</span>
                          <span className="text-[6.5px] font-normal font-mono">{dot.elev}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedWaypoint && (
                    <div className="mt-2 text-[12px] font-mono bg-white border border-[#d4d4d4] rounded-[8px]-[3px] p-2 uppercase font-semibold leading-tight text-gray-700">
                      Waypoint: {selectedWaypoint.id} <br />
                      Coordinates: {selectedWaypoint.lat}, {selectedWaypoint.lng} <br />
                      Elevation: {selectedWaypoint.elev} | Sub-grade Water Table: {selectedWaypoint.wt}
                    </div>
                  )}
                </LevelCard>

                {/* 4. Legal permit tracker */}
                <LevelCard
                  icon={FileText}
                  title="Level 1 - Legal approvals & Zoning Clearances"
                  footer="Municipal and environmental clearance ledger sync active"
                >
                  <div className="space-y-1.5 pt-1">
                    {Object.keys(permits).map((permitKey) => (
                      <label key={permitKey} className="flex items-center justify-between text-[12px] font-bold uppercase cursor-pointer hover:bg-gray-50 p-1 border border-transparent rounded-[8px] hover:border-[#c8c8c8]">
                        <span className="flex items-center gap-1.5 text-gray-700">
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
                        <span className={`text-[12px] px-1.5 py-0.5 border rounded-[8px]-[2px] font-bold ${permits[permitKey] ? 'bg-[#2d2d2d] text-white border-[#2d2d2d]' : 'border-[#d4d4d4] text-gray-700 bg-white'}`}>
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
                      className="flex-1 btn-skeuo-dark text-center"
                    >
                      Audit Regulatory Compliances
                    </button>
                  </div>

                  {permitScanResult && (
                    <div className={`mt-2 p-2.5 rounded-[8px] border text-[12px] font-semibold uppercase ${permitScanResult.includes('✓') ? 'bg-[#f4f5f6] border-[#d4d4d4] text-black' : 'bg-[#2d2d2d] text-white border-[#2d2d2d] font-bold animate-pulse'}`}>
                      {permitScanResult}
                    </div>
                  )}
                </LevelCard>

              </div>
            </div>
          )}

          {/* LEVEL 2: DESIGN & PLANNING INTELLIGENCE */}
          {activeLevel === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* MEP balance */}
                <LevelCard
                  icon={Wrench}
                  title="Level 2 - MEP Engineering Load Balance Gauges"
                  footer="Substation capacity monitored relative to building demand"
                >
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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

                  <div className="mt-4 pt-3 border-t border-[#eeeeee] flex justify-between items-center text-[12px] font-bold">
                    <span className="text-gray-700">GRID OVERLOAD RISK STATUS:</span>
                    <span className={`px-2 py-0.5 border rounded-[8px]-[2px] ${electricalKva > 850 ? 'bg-[#2d2d2d] text-white border-[#2d2d2d] animate-pulse' : 'border-[#d4d4d4] bg-white text-gray-700'}`}>
                      {electricalKva > 850 ? 'CRITICAL EXCESSED (850 kVA Limit)' : 'STABLE'}
                    </span>
                  </div>
                </LevelCard>

                {/* Sunlight optimization */}
                <LevelCard
                  icon={Layers}
                  title="Level 2 - Ventilation & Sunlight Thermal Flow"
                  footer="Daylight coefficient calibrated to building orientation"
                >
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[12px] font-bold uppercase">
                      <span>Solar Angle Time of Day</span>
                      <span>{timeOfDay}:00 hrs</span>
                    </div>
                    <input
                      type="range" min="8" max="18" value={timeOfDay}
                      onChange={(e) => setTimeOfDay(Number(e.target.value))}
                      className="w-full accent-black cursor-ew-resize"
                    />

                    <div className="text-[12px] font-mono space-y-1 pt-2 uppercase text-gray-700">
                      <div className="flex justify-between">
                        <span>Calculated Solar Radiant Flux:</span>
                        <span className="font-bold text-gray-900">{(Math.sin((timeOfDay - 6) * Math.PI / 12) * 850).toFixed(0)} W/m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emergency Evacuation Egress Speed:</span>
                        <span className="font-bold text-gray-900">4.2m/s (Egress route open)</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Natural daylight coefficient:</span>
                        <span className="font-semibold">{timeOfDay >= 11 && timeOfDay <= 14 ? 'EXCELLENT (0.84)' : 'NOMINAL (0.42)'}</span>
                      </div>
                    </div>
                  </div>
                </LevelCard>

              </div>

              {/* BIM Level 1-7 Clash detector */}
              <LevelCard
                icon={Check}
                title="Level 2 - BIM Level 1–7 Clash Detection Platform"
                headerAction={<span className="text-[12px] bg-[#2d2d2d] text-white border border-[#2d2d2d] rounded-[8px]-[2px] px-1.5 py-0.5 font-bold uppercase">BIM MODEL: LEVEL 5 (LOD-400)</span>}
                footer="Unified BIM coordination room and clash detection matrix"
              >
                <div className="border border-[#d4d4d4] rounded-[8px]-[3px] overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left font-mono text-[12px] leading-normal border-collapse no-vertical-borders">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[#d4d4d4] font-bold uppercase text-[12px] text-gray-600">
                        <th className="p-2">Element Structural A</th>
                        <th className="p-2">Element Mech/Elec B</th>
                        <th className="p-2">Clash Type</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">CRM Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bimClashes.map((clash) => (
                        <tr key={clash.id} className="border-b border-[#eeeeee] last:border-b-0 hover:bg-[#f0f6ff] transition-colors">
                          <td className="p-2 font-bold uppercase text-gray-800">{clash.elementA}</td>
                          <td className="p-2 font-bold uppercase text-gray-800">{clash.elementB}</td>
                          <td className="p-2">
                            <span className={`px-1.5 py-0.5 border rounded-[8px]-[2px] text-[12px] font-bold ${clash.type === 'Hard Clash' ? 'bg-[#2d2d2d] text-white border-[#2d2d2d]' : 'bg-gray-50 text-gray-700 border-[#d4d4d4]'}`}>
                              {clash.type}
                            </span>
                          </td>
                          <td className="p-2 font-bold">
                            {clash.resolved ? (
                              <span className="text-gray-600 bg-gray-50 border border-[#d4d4d4] px-1.5 py-0.5 rounded-[8px]-[2px] text-[12px]">RESOLVED</span>
                            ) : (
                              <span className="bg-[#2d2d2d] text-white border border-[#2d2d2d] px-1.5 py-0.5 rounded-[8px]-[2px] text-[12px] animate-pulse">PENDING</span>
                            )}
                          </td>
                          <td className="p-2">
                            {!clash.resolved ? (
                              <button
                                onClick={() => handleResolveBimClash(clash.id)}
                                className="btn-skeuo text-[12px] uppercase font-bold px-2 py-0.5 rounded-[8px]-[2px]"
                                style={{ minHeight: 'auto', padding: '3px 6px' }}
                              >
                                Issue Rework Ticket
                              </button>
                            ) : (
                              <span className="text-[12px] text-gray-500 italic">Ticket Logged [SSOT]</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </LevelCard>
            </div>
          )}

          {/* LEVEL 3: PROCUREMENT & SUPPLY CHAIN */}
          {activeLevel === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Quarry sourcing grading */}
                <LevelCard
                  icon={Database}
                  title="Level 3 - Quarry & Aggregates Source Origin"
                  footer="Sieve fineness grading conforms to IS 383 specification standards"
                >
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-[12px] font-bold uppercase">
                      <span className="text-gray-700">Source Quarry</span>
                      <select
                        value={quarrySource} onChange={(e) => setQuarrySource(e.target.value)}
                        className="border border-[#c8c8c8] bg-white p-1 text-[12px] focus:outline-none"
                      >
                        <option>Pune Aggregate Quarry</option>
                        <option>Ennore River Sand (TN)</option>
                        <option>Vizag Steel Rebar Plant</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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

                  <div className="border border-[#d4d4d4] p-3 rounded-[8px]-[3px] bg-white font-mono text-[12px] space-y-1.5 uppercase font-semibold text-gray-700">
                    <p className="font-bold border-b border-[#eeeeee] pb-0.5 text-gray-800">AGGREGATE SIEVE ANALYSIS</p>
                    <div className="flex justify-between">
                      <span>Passing 4.75mm Sieve:</span>
                      <span className="text-gray-900 font-bold">{Math.min(100, 95 + (aggregateSieveModulus - 2.8) * 8).toFixed(1)}% (Grading Zone II)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passing 150μm Sieve:</span>
                      <span className="text-gray-900 font-bold">{(5 - (aggregateSieveModulus - 2.8) * 2).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sustainability carbon Rating:</span>
                      <span className="bg-[#2d2d2d] text-white border border-[#2d2d2d] px-1 rounded-[8px]-[2px]">VERIFIED CLEAN SOURCING (A+)</span>
                    </div>
                  </div>
                </LevelCard>

                {/* Logistics tracker */}
                <LevelCard
                  icon={Truck}
                  title="Level 3 - Cement Logistics Transit Controller"
                  footer="Mixer rotation speeds synced to telemetry receiver"
                >
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[12px] font-mono font-bold uppercase">
                        <span>Active Cement Drum Rotation Speed</span>
                        <span>{cementDrumRPM} RPM</span>
                      </div>
                      <input
                        type="range" min="6" max="18" value={cementDrumRPM}
                        onChange={(e) => setCementDrumRPM(Number(e.target.value))}
                        className="w-full accent-black cursor-ew-resize"
                      />
                    </div>

                    <div className="text-[12px] font-mono space-y-1 pt-2 uppercase font-semibold text-gray-700">
                      <div className="flex justify-between">
                        <span>Transit Truck ID:</span>
                        <span className="text-gray-900">MH-12-CT-8942 // Cement mixer</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Concrete Slurry Temperature:</span>
                        <span className={`font-bold ${cementTemp > 32 ? 'text-black font-extrabold animate-pulse' : 'text-gray-900'}`}>{cementTemp}°C (Safe limit &lt; 32°C)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transit duration:</span>
                        <span className="text-gray-900">42 mins | Delay prediction: NIL</span>
                      </div>
                    </div>
                  </div>
                </LevelCard>

              </div>

              {/* Vendor Intelligence */}
              <LevelCard
                icon={Users}
                title="Level 3 - Vendor Intelligence System"
                headerAction={<span className="text-[12px] bg-[#2d2d2d] text-white border border-[#2d2d2d] rounded-[8px]-[2px] px-1.5 py-0.5 font-bold uppercase">FRAUD DETECTION MODULE ACTIVE</span>}
                footer="Supplier audit trials and risk evaluation statistics"
              >
                <div className="border border-[#d4d4d4] rounded-[8px]-[3px] overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left font-mono text-[12px] border-collapse no-vertical-borders">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[#d4d4d4] font-bold uppercase text-[12px] text-gray-600">
                        <th className="p-2">Supplier Name</th>
                        <th className="p-2">Material Supplied</th>
                        <th className="p-2">Historical Defect Rate</th>
                        <th className="p-2">Financial Stability Score</th>
                        <th className="p-2">Fraud Risk Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#eeeeee] hover:bg-[#f0f6ff] transition-colors">
                        <td className="p-2 font-bold uppercase text-gray-800">Deccan Cement Corp</td>
                        <td className="p-2 text-gray-700">Cement (OPC-53)</td>
                        <td className="p-2 text-gray-700">0.4% (Nominal)</td>
                        <td className="p-2 font-bold text-gray-800">94 / 100</td>
                        <td className="p-2"><span className="px-1.5 py-0.5 border border-[#d4d4d4] rounded-[8px]-[2px] text-[12px] bg-gray-50 text-gray-600 font-bold">SAFE</span></td>
                      </tr>
                      <tr className="border-b border-[#eeeeee] hover:bg-[#f0f6ff] transition-colors">
                        <td className="p-2 font-bold uppercase text-gray-800">Western Aggregate Mining</td>
                        <td className="p-2 text-gray-700">Coarse Aggregate</td>
                        <td className="p-2 text-gray-700">3.8% (Elevated)</td>
                        <td className="p-2 font-bold text-gray-800">81 / 100</td>
                        <td className="p-2"><span className="px-1.5 py-0.5 border border-[#d4d4d4] rounded-[8px]-[2px] text-[12px] bg-[#fdfdfd] text-gray-700 font-bold">LOW VARIANCE</span></td>
                      </tr>
                      <tr className="hover:bg-[#f0f6ff] transition-colors">
                        <td className="p-2 font-bold uppercase text-gray-800">Vizag Steel Depot</td>
                        <td className="p-2 text-gray-700">Steel rebars</td>
                        <td className="p-2 text-gray-700">0.1% (Excellent)</td>
                        <td className="p-2 font-bold text-gray-800">98 / 100</td>
                        <td className="p-2"><span className="px-1.5 py-0.5 border border-[#d4d4d4] rounded-[8px]-[2px] text-[12px] bg-gray-50 text-gray-600 font-bold">SAFE</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </LevelCard>
            </div>
          )}

          {/* LEVEL 4: CONSTRUCTION EXECUTION */}
          {activeLevel === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Smart PPE scanner */}
                <LevelCard
                  icon={HardHat}
                  title="Level 4 - Smart PPE Camera Gate Scanner"
                  footer="Smart PPE camera feeds processed automatically via on-site AI edge server"
                >
                  <div className="border border-[#d4d4d4] bg-white p-3 h-28 relative overflow-hidden flex flex-col justify-center items-center rounded-[8px]-[3px] shadow-inner">
                    <div className="absolute inset-0 cad-grid opacity-50 pointer-events-none"></div>
                    <span className="text-[12px] text-gray-400 absolute top-1 left-1 font-semibold uppercase">SITE PORTAL WEBCAM SCAN</span>

                    {scanningPpe ? (
                      <div className="text-center space-y-2">
                        <span className="animate-spin h-5 w-5 border-2 border-[#2d2d2d] border-t-transparent rounded-[8px]-full block mx-auto"></span>
                        <span className="text-[12px] font-black uppercase tracking-wider block text-gray-700">Scanning labour face profile...</span>
                      </div>
                    ) : (
                      <button
                        onClick={handlePpeWebcamScan}
                        className="btn-skeuo"
                      >
                        Trigger Smart PPE Gate Check
                      </button>
                    )}
                  </div>

                  {latestPpeAlert && (
                    <div className={`mt-2 p-2.5 border rounded-[8px] font-semibold text-[12px] uppercase ${latestPpeAlert.includes('✓') ? 'bg-[#f4f5f6] border-[#d4d4d4] text-black' : 'bg-[#2d2d2d] text-white border-[#2d2d2d] animate-pulse'}`}>
                      {latestPpeAlert}
                    </div>
                  )}
                </LevelCard>

                {/* Workforce metrics */}
                <LevelCard
                  icon={Users}
                  title="Level 4 - Workforce Productivity & Fatigue"
                  footer="Real-time personnel fatigue values tracked from RFID telemetry"
                >
                  <div className="border border-[#d4d4d4] rounded-[8px]-[3px] overflow-hidden bg-white shadow-sm">
                    <table className="w-full text-left font-mono text-[12px] border-collapse no-vertical-borders">
                      <thead>
                        <tr className="bg-gray-50 border-b border-[#d4d4d4] font-bold uppercase text-[12px] text-gray-600">
                          <th className="p-1.5">Labour Name</th>
                          <th className="p-1.5">Duty Role</th>
                          <th className="p-1.5">Fatigue</th>
                          <th className="p-1.5">Zoning safety</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#eeeeee] hover:bg-[#f0f6ff] transition-colors">
                          <td className="p-1.5 font-bold text-gray-800">R. Jadhav</td>
                          <td className="p-1.5 text-gray-700">Rebar Welder</td>
                          <td className="p-1.5 text-gray-700">NOMINAL (12%)</td>
                          <td className="p-1.5 text-gray-900 font-bold">VERIFIED</td>
                        </tr>
                        <tr className="hover:bg-[#f0f6ff] transition-colors">
                          <td className="p-1.5 font-bold text-gray-800">S. Pillai</td>
                          <td className="p-1.5 text-gray-700">Masonry Expert</td>
                          <td className="p-1.5 text-gray-700 text-black font-semibold">ELEVATED (48%)</td>
                          <td className="p-1.5"><span className="bg-[#2d2d2d] text-white border border-[#2d2d2d] rounded-[8px]-[2px] px-1.5 py-0.5 text-[12px] font-bold animate-pulse">BREACH ALERT</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </LevelCard>

              </div>

              {/* Progress AI */}
              <LevelCard
                icon={Activity}
                title="Level 4 - Construction GANTT & Delay Tracker"
                footer="Aggregated schedule diagnostics compiled from field manager report"
              >
                <div className="space-y-2 bg-white border border-[#d4d4d4] rounded-[8px]-[3px] p-3 shadow-sm text-[12px] font-mono font-semibold uppercase text-gray-700">
                  <div className="flex justify-between text-gray-500 font-bold border-b border-[#eeeeee] pb-1.5">
                    <span>Task Name</span>
                    <span>Target completion date // delay variance</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>01. Foundation concreting:</span>
                    <span className="text-gray-900 font-bold">COMPLETED // 0 days delay</span>
                  </div>
                  <div className="flex justify-between border-t border-[#eeeeee] pt-1.5">
                    <span>02. Column Pillar reinforcements:</span>
                    <span className="text-gray-900 font-bold">COMPLETED // +2 days delay</span>
                  </div>
                  <div className="flex justify-between border-t border-[#eeeeee] pt-1.5">
                    <span>03. Slab Level-3 concrete pour:</span>
                    <span className="bg-[#2d2d2d] text-white border border-[#2d2d2d] rounded-[8px]-[2px] px-1.5 py-0.5 text-[12px] font-bold animate-pulse">IN PROGRESS // +4 days delay predicted</span>
                  </div>
                </div>
              </LevelCard>
            </div>
          )}

          {/* LEVEL 5: ADVANCED QA/QC (LIMS) */}
          {activeLevel === 5 && (
            <div className="zoho-card flex flex-col">
              {/* LIMS Subtab selector acting as unified Card Header */}
              <div className="workspace-tabs flex-shrink-0 select-none">
                {[
                  { id: 'Cube', label: 'Concrete Compressive Strength' },
                  { id: 'Slump', label: 'Slump Cone & Workability' },
                  { id: 'NDT', label: 'Ultrasonic Pulse NDT & Yield' }
                ].map((tab) => {
                  const isActive = activeSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSubTab(tab.id)}
                      className={`workspace-tab ${isActive ? 'active' : ''}`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* LIMS Content Body */}
              <div className="zoho-card-body space-y-4">
                {/* LIMS SUBTAB: Concrete cube test */}
                {activeSubTab === 'Cube' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[12px] font-bold uppercase text-gray-700">
                          <span>Designed Concrete Grade</span>
                          <select
                            value={limsConcreteGrade} onChange={(e) => setLimsConcreteGrade(e.target.value)}
                            className="border border-[#cccccc] bg-white p-1 text-[12px] focus:outline-none"
                          >
                            <option>M20</option>
                            <option>M25</option>
                            <option>M30</option>
                            <option>M40</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[12px] font-bold uppercase text-gray-700">
                            <span>Ultimate Compressive Load (P)</span>
                            <span className="font-mono">{limsCompressiveForce} kN</span>
                          </div>
                          <input
                            type="range" min="200" max="1100" value={limsCompressiveForce}
                            onChange={(e) => setLimsCompressiveForce(Number(e.target.value))}
                            className="w-full accent-black cursor-ew-resize"
                          />
                          <div className="flex justify-between text-[12px] text-gray-500 font-mono">
                            <span>200 kN</span>
                            <span>1100 kN</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-[#fdfdfd] border border-[#cccccc] rounded-[8px] shadow-sm flex flex-col justify-between">
                        <div className="space-y-1.5 text-[12px] text-gray-700">
                          <p className="font-bold border-b border-[#eeeeee] pb-1 text-gray-800 uppercase text-[12px]">Cube physical specifications</p>
                          <div className="flex justify-between">
                            <span>Standard cube dimensions:</span>
                            <span className="font-semibold text-gray-900">150mm x 150mm x 150mm</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cross sectional Area (A):</span>
                            <span className="font-semibold text-gray-900">22,500 mm² (0.0225 m²)</span>
                          </div>
                          <div className="flex justify-between border-t border-[#eeeeee] pt-1 text-gray-800 font-bold">
                            <span>Target Strength (f<sub>ck</sub>):</span>
                            <span>{concreteTarget} MPa (min limit)</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Calculated Strength (P/A):</span>
                            <span className={concretePassed ? 'text-black font-extrabold' : 'bg-black text-white px-1 font-bold animate-pulse'}>
                              {concreteMpa} MPa
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-2 border-t border-[#eeeeee]">
                          <button
                            onClick={handleCertifyConcreteCube}
                            className="w-full btn-skeuo-dark"
                          >
                            Certify strength and log to CRM
                          </button>
                        </div>
                      </div>
                    </div>

                    {limsLogMsg && (
                      <div className={`p-2.5 border rounded-[8px]-[3px] font-semibold text-[12px] ${concretePassed ? 'bg-[#f4f5f6] border-[#d4d4d4] text-[#2d2d2d]' : 'bg-[#2d2d2d] text-white border-[#2d2d2d] animate-pulse'}`}>
                        {limsLogMsg}
                      </div>
                    )}
                  </div>
                )}

                {/* LIMS SUBTAB: Slump test */}
                {activeSubTab === 'Slump' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[12px] font-bold uppercase text-gray-700">
                          <span>Measured Slump Height</span>
                          <span className="font-mono">{limsSlumpConeValue} mm</span>
                        </div>
                        <input
                          type="range" min="10" max="180" value={limsSlumpConeValue}
                          onChange={(e) => setLimsSlumpConeValue(Number(e.target.value))}
                          className="w-full accent-black cursor-ew-resize"
                        />
                        <div className="flex justify-between text-[12px] text-gray-500 font-mono">
                          <span>10 mm (Dry mix)</span>
                          <span>180 mm (High slump flow)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-[#fdfdfd] border border-[#cccccc] rounded-[8px] shadow-sm flex flex-col justify-between text-[12px] text-gray-700">
                      <div className="space-y-1.5">
                        <p className="font-bold border-b border-[#eeeeee] pb-1 text-gray-800 uppercase text-[12px]">Slump grading classification</p>
                        <div className="flex justify-between">
                          <span>Slump Height:</span>
                          <span className="font-semibold text-gray-900">{limsSlumpConeValue} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Workability Grade:</span>
                          <span className="font-bold text-black border-b border-border-default">
                            {limsSlumpConeValue < 25 && 'VERY LOW (Zero Slump)'}
                            {limsSlumpConeValue >= 25 && limsSlumpConeValue < 75 && 'LOW (Dry Slump)'}
                            {limsSlumpConeValue >= 75 && limsSlumpConeValue < 125 && 'MEDIUM (Pillar Concrete)'}
                            {limsSlumpConeValue >= 125 && 'HIGH (Flowing pump)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated w/c ratio:</span>
                          <span className="font-semibold font-mono text-gray-900">{(0.35 + limsSlumpConeValue * 0.0015).toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LIMS SUBTAB: NDT */}
                {activeSubTab === 'NDT' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[12px] font-bold uppercase text-gray-700">
                          <span>Ultrasonic wave velocity</span>
                          <span className="font-mono">{limsAcousticSpeed} m/s</span>
                        </div>
                        <input
                          type="range" min="2000" max="5000" step="50" value={limsAcousticSpeed}
                          onChange={(e) => setLimsAcousticSpeed(Number(e.target.value))}
                          className="w-full accent-black cursor-ew-resize"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[12px] font-bold uppercase text-gray-700">
                          <span>Steel Yield strength (Fy)</span>
                          <span className="font-mono">{limsSteelYieldStrength} MPa</span>
                        </div>
                        <input
                          type="range" min="300" max="650" value={limsSteelYieldStrength}
                          onChange={(e) => setLimsSteelYieldStrength(Number(e.target.value))}
                          className="w-full accent-black cursor-ew-resize"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-[#fdfdfd] border border-[#cccccc] rounded-[8px] shadow-sm flex flex-col justify-between text-[12px] text-gray-700">
                      <div className="space-y-1.5">
                        <p className="font-bold border-b border-[#eeeeee] pb-1 text-gray-800 uppercase text-[12px]">Acoustic & steel properties</p>
                        <div className="flex justify-between">
                          <span>Concrete NDT Quality:</span>
                          <span className="font-bold text-black uppercase">
                            {limsAcousticSpeed >= 4000 ? 'EXCELLENT' : limsAcousticSpeed >= 3200 ? 'GOOD' : 'POOR'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Steel Grade Equivalent:</span>
                          <span className="font-semibold text-gray-900">Fe-{limsSteelYieldStrength > 500 ? '550D' : '500'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Defect Void Index:</span>
                          <span className={`font-bold rounded-[8px]-[2px] px-1.5 py-0.5 ${limsAcousticSpeed < 3000 ? 'bg-[#2d2d2d] text-white border border-[#2d2d2d] font-bold animate-pulse' : 'text-gray-900 border border-transparent'}`}>
                            {limsAcousticSpeed < 3000 ? 'HIGH VOIDS WARNING' : 'NOMINAL'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="zoho-card-footer">
                <span className="text-gray-500 font-semibold text-[12px] uppercase tracking-normal">
                  LIMS concrete mix testing station calibrated to regional ACI thresholds // SSOT certified
                </span>
              </div>
            </div>
          )}

          {/* LEVEL 6: LIVE OPERATIONS & SCADA */}
          {activeLevel === 6 && (
            <div className="space-y-6">
              <LevelCard
                icon={Radio}
                title="Level 6 - Live Operations PLC SCADA Telemetry"
                footer="SCADA PLC Telemetry Stream Sync: 42Hz Active // nominal loop duration: 4ms"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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

                  <div className="border border-[#d4d4d4] bg-white p-4 relative flex flex-col justify-center items-center rounded-[8px]-[3px] shadow-inner">
                    <span className="absolute -top-2.5 left-3 text-[12px] font-bold uppercase z-10">SCADA OSCILLATOR SPECTRUM</span>
                    <canvas ref={scadaCanvasRef} width={280} height={90} className="w-full h-24 bg-white" />
                  </div>
                </div>
              </LevelCard>
            </div>
          )}

          {/* LEVEL 7: DISASTER SIMULATION */}
          {activeLevel === 7 && (
            <div className="space-y-6">
              <LevelCard
                icon={Sliders}
                title="Level 7 - Multi-Physics Disaster Simulation Engine"
                footer="Disaster simulation suite synchronized with structural stress forecasts"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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
                      <div className="flex justify-between text-[12px] font-bold uppercase">
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

                  <div className="border border-dashed border-[#c8c8c8] p-3 rounded-[8px]-[3px] bg-white text-[12px] font-mono uppercase font-semibold flex flex-col justify-between text-gray-700">
                    <div className="space-y-1.5">
                      <p className="font-bold border-b border-[#eeeeee] pb-0.5 text-gray-800 uppercase">Computed disaster stress indexes</p>
                      <div className="flex justify-between">
                        <span>Ground Shear Force increment:</span>
                        <span className="text-gray-900 font-bold">{(disasterEarthquake * 42.5).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hydrostatic pressure on foundation:</span>
                        <span className="text-gray-900 font-bold">{(disasterFloodDepth * 9.81).toFixed(2)} kPa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </LevelCard>
            </div>
          )}

          {/* LEVEL 8: FINANCIAL ERP & CARBON */}
          {activeLevel === 8 && (
            <div className="space-y-6">
              <LevelCard
                icon={BarChart2}
                title="Level 8 - ERP Inventory & materials cost tracker"
                headerAction={<span className="text-[12px] bg-[#2d2d2d] text-white border border-[#2d2d2d] rounded-[8px]-[2px] px-1.5 py-0.5 font-bold uppercase">PLANNED VS ACTUAL SPEND</span>}
                footer="ERP Financial ledger linked with project accounts // carbon offset verified"
              >
                <div className="border border-[#d4d4d4] rounded-[8px]-[3px] overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left font-mono text-[12px] border-collapse no-vertical-borders">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[#d4d4d4] font-bold uppercase text-[12px] text-gray-600">
                        <th className="p-2">Material Spec</th>
                        <th className="p-2">Planned Qty</th>
                        <th className="p-2">Actual Qty</th>
                        <th className="p-2">Planned Price</th>
                        <th className="p-2">Actual Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {erpInventory.map((item) => {
                        const isRiverSand = item.material.includes('River Sand');
                        return (
                          <tr key={item.id} className={`border-b border-[#eeeeee] last:border-b-0 hover:bg-[#f0f6ff] transition-colors ${isRiverSand ? 'bg-[#f0f6ff]' : ''}`}>
                            <td className="p-2 font-bold uppercase text-gray-800">{item.material}</td>
                            <td className="p-2 text-gray-700">{item.plannedQty} {item.unit}</td>
                            <td className="p-2 text-gray-700">{item.actualQty} {item.unit}</td>
                            <td className="p-2 font-bold text-gray-800">₹{item.plannedCost}</td>
                            <td className="p-2 font-bold text-gray-800">₹{item.actualCost}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </LevelCard>
            </div>
          )}

          {/* LEVEL 9: POST-CONSTRUCTION LIFE */}
          {activeLevel === 9 && (
            <div className="space-y-6">
              <LevelCard
                icon={Clock}
                title="Level 9 - Expected Structural Decay & Lifespan"
                footer="Acoustic aging and elasticity forecast module online // lifecycle prediction"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[12px] font-bold uppercase">
                      <span>Lifespan aging slider</span>
                      <span>+ {lifecycleAgeYears} Years</span>
                    </div>
                    <input
                      type="range" min="0" max="50" value={lifecycleAgeYears}
                      onChange={(e) => setLifecycleAgeYears(Number(e.target.value))}
                      className="w-full accent-black cursor-ew-resize"
                    />
                  </div>

                  <div className="border border-dashed border-[#c8c8c8] p-3 rounded-[8px]-[3px] bg-white text-[12px] font-mono uppercase font-semibold flex flex-col justify-between text-gray-700">
                    <div className="space-y-1.5">
                      <p className="font-bold border-b border-[#eeeeee] pb-0.5 text-gray-800 uppercase">Lifespan structural forecast</p>
                      <div className="flex justify-between">
                        <span>Aggregate corrosion factor:</span>
                        <span className="text-gray-900 font-bold">{(lifecycleAgeYears * 0.15).toFixed(2)} mm rust thickness</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Concrete Elasticity decay:</span>
                        <span className="text-gray-900 font-bold">{(lifecycleAgeYears * 0.42).toFixed(1)}% tension loss</span>
                      </div>
                    </div>
                  </div>
                </div>
              </LevelCard>
            </div>
          )}

          {/* LEVEL 10: NATIONAL INFRASTRUCTURE SYSTEM */}
          {activeLevel === 10 && (
            <div className="space-y-6">
              <LevelCard
                icon={Globe}
                title="Level 10 - Municipal Utilities Smart City Control Desk"
                footer="Smart City macro-utility grid indicators active // municipal systems online"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="zoho-card p-4 flex flex-col justify-between items-center text-center bg-[#fdfdfd] border border-[#d4d4d4] rounded-[8px]-[3px] shadow-sm">
                    <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Power Grid Strain</span>
                    <span className="text-xs font-black text-gray-850 mt-1">420 kW</span>
                    <span className="text-[12px] mt-2 px-2 py-0.5 border border-[#d4d4d4] bg-gray-50 font-bold uppercase rounded-[8px]-[2px] text-gray-700">SAFE</span>
                  </div>
                  <div className="zoho-card p-4 flex flex-col justify-between items-center text-center bg-[#fdfdfd] border border-[#d4d4d4] rounded-[8px]-[3px] shadow-sm">
                    <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Water Pressure</span>
                    <span className="text-xs font-black text-gray-850 mt-1">45 PSI</span>
                    <span className="text-[12px] mt-2 px-2 py-0.5 border border-[#d4d4d4] bg-gray-50 font-bold uppercase rounded-[8px]-[2px] text-gray-700">STABLE</span>
                  </div>
                  <div className="zoho-card p-4 flex flex-col justify-between items-center text-center bg-[#fdfdfd] border border-[#d4d4d4] rounded-[8px]-[3px] shadow-sm">
                    <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Transit Operations</span>
                    <span className="text-xs font-black text-gray-850 mt-1">98.4%</span>
                    <span className="text-[12px] mt-2 px-2 py-0.5 border border-[#d4d4d4] bg-gray-50 font-bold uppercase rounded-[8px]-[2px] text-gray-700">ON-TIME</span>
                  </div>
                </div>
              </LevelCard>
            </div>
          )}

          {/* LEVEL 11: FUTURE TECH */}
          {activeLevel === 11 && (
            <div className="space-y-6">
              <LevelCard
                icon={Cpu}
                title="Level 11 - Generative Engineering AI Design Workspace"
                footer="AI Generative synthesis engine: calibrated and running"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[12px] font-bold uppercase text-gray-700">
                      <span>Generative Design optimization target</span>
                      <select
                        value={aiDesignGoal} onChange={(e) => setAiDesignGoal(e.target.value)}
                        className="border border-[#cccccc] bg-white p-1 text-[12px] focus:outline-none"
                      >
                        <option>Reduce Pillar Cross Section</option>
                        <option>Optimize Rebar Steel Layout</option>
                        <option>Max Carbon Absorption Mix</option>
                      </select>
                    </div>

                    <button
                      onClick={handleGenerativeAI}
                      disabled={isAiGenerating}
                      className="w-full btn-skeuo-dark"
                    >
                      {isAiGenerating ? 'AI Synthesizing design arrays...' : 'Generate Optimized Design Blueprint'}
                    </button>
                  </div>

                  <div className="p-3 bg-[#fdfdfd] border border-[#cccccc] rounded-[8px]-[3px] shadow-sm text-[12px] flex flex-col justify-between min-h-[140px] text-gray-700">
                    {aiDesignOutput ? (
                      <div className="space-y-2">
                        <p className="font-bold border-b border-[#eeeeee] pb-1 text-gray-800 uppercase text-[12px]">GENERATED BLUEPRINT [COORDINATES]:</p>
                        <p className="text-[12px] text-gray-500">{aiDesignOutput.layoutSpec}</p>
                        <div className="flex justify-between border-t border-[#eeeeee] pt-1">
                          <span>Weight savings achieved:</span>
                          <span className="font-bold text-gray-900">{aiDesignOutput.weightSaved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbon reduction factor:</span>
                          <span className="font-bold text-gray-900">{aiDesignOutput.carbonSaved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Safety Factor compliance:</span>
                          <span className="bg-[#2d2d2d] text-white border border-[#2d2d2d] rounded-[8px]-[2px] px-1.5 py-0.5 font-bold">{aiDesignOutput.safetyFactor}x</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center text-gray-400 font-bold uppercase text-[12px]">
                        Select target goal and press Generate.
                      </div>
                    )}
                  </div>
                </div>
              </LevelCard>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
