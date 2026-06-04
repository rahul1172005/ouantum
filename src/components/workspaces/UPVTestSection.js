'use client';
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BarChart2, 
  AlertTriangle, 
  ShieldAlert, 
  Cpu, 
  FileText, 
  Download, 
  CheckCircle, 
  TrendingUp, 
  Grid, 
  Info, 
  Settings, 
  Eye,
  Award
} from 'lucide-react';
import { useCRMStore } from '@/store/crmStore';

function SubCard({ icon: Icon, title, children, footerText = null, headerAction = null }) {
  return (
    <div className="border border-[#d4d4d4] bg-white rounded-[8px]-[8px] flex flex-col shadow-[inset_1px_1px_0_rgba(255,255,255,0.95)]">
      <div className="bg-gradient-to-b from-[#fbfbfb] to-[#ececec] border-b border-[#c8c8c8] px-3 py-2 flex items-center gap-1.5 min-h-[36px]">
        {Icon && <Icon className="h-3.5 w-3.5 text-gray-700 flex-shrink-0" />}
        <span className="font-bold text-gray-800 text-[12px] uppercase tracking-wide">{title}</span>
        {headerAction && <div className="ml-auto flex-shrink-0">{headerAction}</div>}
      </div>
      <div className="p-4 space-y-3 flex-1">
        {children}
      </div>
      {footerText && (
        <div className="bg-[#f4f5f6] border-t border-[#d4d4d4] px-3 py-2.5">
          <span className="text-gray-500 font-semibold text-[12px] uppercase tracking-normal">{footerText}</span>
        </div>
      )}
    </div>
  );
}

function OscilloscopePanel({ activePt, selectedPointId }) {
  const [waveProgress, setWaveProgress] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const startTime = Date.now();
    const transitTime = activePt?.time || 120;
    const duration = (transitTime / 110) * 0.8; 

    const update = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = (elapsed % duration) / duration;
      setWaveProgress(progress);
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedPointId, activePt]);

  const transitTime = activePt?.time || 120;
  const velocity = activePt?.velocity || 4.0;
  const isBad = selectedPointId === 'P5';
  const isWarn = selectedPointId === 'P3';
  const color = isBad ? '#ef4444' : isWarn ? '#eab308' : '#10b981';
  
  // Calculate xStart (arrival position based on transit time)
  // Maps 110us to x=50, 180us to x=130
  const xStart = 50 + Math.min(Math.max((transitTime - 110) / (180 - 110), 0), 1) * 80;
  
  // Physical parameters based on velocity
  let amp = 24;
  let attenuationFactor = 0.9;
  let wVisual = 15;
  
  if (velocity > 4.5) {
    amp = 24;
    attenuationFactor = 0.95;
    wVisual = 15;
  } else if (velocity >= 3.5) {
    amp = 20;
    attenuationFactor = 0.8;
    wVisual = 12;
  } else if (velocity >= 3.0) {
    amp = 15;
    attenuationFactor = 0.5;
    wVisual = 10;
  } else {
    amp = 10;
    attenuationFactor = 0.25;
    wVisual = 7.5;
  }

  // Center of the wave packet moves across the screen
  const xCenter = 20 + waveProgress * 170;
  const sigma = 10; // Width of the wave packet envelope

  // Determine current packet center and amplitude decay
  let packetCenter = xCenter;
  let decayFactor = 1.0;
  
  if (xCenter < xStart) {
    packetCenter = xCenter;
    decayFactor = 1.0;
  } else {
    packetCenter = xStart;
    // Decay the amplitude as time progresses past arrival
    decayFactor = Math.exp(-0.04 * (xCenter - xStart));
  }

  let points = [];
  for (let x = 0; x <= 200; x += 1) {
    // 1. Static trigger pulse at x=20
    const triggerEnvelope = Math.exp(-Math.pow(x - 20, 2) / (2 * 4 * 4));
    const triggerY = Math.sin(((x - 20) * 2 * Math.PI) / 8) * 8 * triggerEnvelope;

    // 2. Traveling/Received wave packet
    const envelope = Math.exp(-Math.pow(x - packetCenter, 2) / (2 * sigma * sigma));
    const currentAmp = amp * attenuationFactor * decayFactor;
    const waveY = Math.sin(((x - packetCenter) * 2 * Math.PI) / wVisual) * currentAmp * envelope;

    const y = 30 + triggerY + waveY;
    if (x === 0) {
      points.push(`M 0 ${y.toFixed(1)}`);
    } else {
      points.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  }
  const dPath = points.join(' ');

  return (
    <div className="p-3 border border-[#d4d4d4] rounded-[8px]-[8px] bg-black text-white space-y-1.5 flex flex-col justify-between flex-1">
      <div className="flex justify-between items-center text-[12px] text-gray-400 font-bold uppercase">
        <span>Ultrasonic Signal Waveform</span>
        <span className="animate-pulse text-[#10b981]">● LIVE RX SIGNAL</span>
      </div>
      <div className="h-20 bg-gray-950 border border-gray-800 rounded-[8px] relative overflow-hidden flex items-center">
        <svg className="w-full h-full" viewBox="0 0 200 60">
          <line x1="0" y1="30" x2="200" y2="30" stroke="#1f2937" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="60" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="100" y1="0" x2="100" y2="60" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="150" y1="0" x2="150" y2="60" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2,2" />

          <path 
            d={dPath} 
            fill="none" 
            stroke={color} 
            strokeWidth="1.5" 
          />
        </svg>
      </div>
      <div className="flex justify-between text-[12px] text-gray-500 font-bold uppercase">
        <span>Transit Time: {activePt?.time} us</span>
        <span>Amplitude: {selectedPointId === 'P5' ? 'LOW (ATTENUATED)' : 'NOMINAL'}</span>
      </div>
    </div>
  );
}

export default function UPVTestSection({ setSelectedElement }) {
  const addAuditLogEntry = useCRMStore(state => state.addAuditLogEntry);

  // Form Inputs state
  const [viewMode, setViewMode] = useState('3d');
  const [selectedPointId, setSelectedPointId] = useState('P5');
  const [structureId, setStructureId] = useState('BWSL-PILLAR-B12');
  const [elementType, setElementType] = useState('Column');
  const [concreteGrade, setConcreteGrade] = useState('M30');
  const [ageDays, setAgeDays] = useState(28);
  const [transmissionMethod, setTransmissionMethod] = useState('Direct');
  const [calibrationOk, setCalibrationOk] = useState(true);
  const [couplantType, setCouplantType] = useState('Grease');
  const [moistureCondition, setMoistureCondition] = useState('SSD');

  // Test readings (5 points)
  // Distance in mm, Time in microseconds. Default values represent standard quality concrete (~3.8 - 4.5 km/s)
  const [readings, setReadings] = useState([
    { id: 'P1', distance: 500, time: 110 }, // 4.55 km/s (Excellent)
    { id: 'P2', distance: 500, time: 118 }, // 4.24 km/s (Good)
    { id: 'P3', distance: 500, time: 142 }, // 3.52 km/s (Good/Medium) - point of interest
    { id: 'P4', distance: 500, time: 120 }, // 4.17 km/s (Good)
    { id: 'P5', distance: 500, time: 180 }, // 2.78 km/s (Doubtful) - defect point
  ]);

  // Sign-off State
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [engineerNotes, setEngineerNotes] = useState('');
  const [certificationCode, setCertificationCode] = useState('');

  // 3D Rotation Drag states
  const [rotationY, setRotationY] = useState(-15); // Start at a slight angle for better 3D visibility
  const [rotationX, setRotationX] = useState(18);  // Starts at standard tilted elevation
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    setRotationY(prev => (prev + deltaX * 0.6) % 360);
    setRotationX(prev => (prev - deltaY * 0.6) % 360);

    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mathematical 3D Projection Engine
  const thetaRad = (rotationY * Math.PI) / 180;
  const phiRad = (rotationX * Math.PI) / 180;
  
  const cosY = Math.cos(thetaRad);
  const sinY = Math.sin(thetaRad);
  const cosX = Math.cos(phiRad);
  const sinX = Math.sin(phiRad);

  const project = (x, y, z) => {
    // 1. Rotate Y-axis (theta)
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    
    // 2. Rotate X-axis (phi) - tilt column forward
    const x2 = x1;
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;
    
    // 3. Perspective mapping
    const D = 250; // Camera distance
    const scale = D / (D + z2);
    
    const u = 110 + x2 * scale;
    const v = 70 + y2 * scale;
    return { x: u, y: v, z: z2 };
  };

  // 1. Point calculations
  const calculatedReadings = readings.map(r => {
    // V (km/s) = Distance(mm) / Time(μs)
    const velocity = r.time > 0 ? parseFloat((r.distance / r.time).toFixed(3)) : 0;
    // Wavelength λ (mm) = (V (km/s) * 1000) / 54 (kHz)
    const wavelength = velocity > 0 ? parseFloat(((velocity * 1000) / 54).toFixed(2)) : 0;
    let classification = 'Doubtful';
    let statusClass = 'bg-black text-white border-border-default';
    if (velocity > 4.5) {
      classification = 'Excellent';
      statusClass = 'border-green-600 bg-green-50 text-green-700';
    } else if (velocity >= 3.5) {
      classification = 'Good';
      statusClass = 'border-[#d4d4d4] bg-gray-100 text-gray-800';
    } else if (velocity >= 3.0) {
      classification = 'Medium';
      statusClass = 'border-yellow-600 bg-yellow-50 text-yellow-700';
    }
    return { ...r, velocity, wavelength, classification, statusClass };
  });

  // 2. QA/QC Engine calculations
  const velocities = calculatedReadings.map(r => r.velocity);
  const numPoints = velocities.length;
  
  const meanVelocity = parseFloat((velocities.reduce((a, b) => a + b, 0) / numPoints).toFixed(3));
  
  const variance = velocities.reduce((a, b) => a + Math.pow(b - meanVelocity, 2), 0) / (numPoints - 1);
  const stdDev = parseFloat(Math.sqrt(variance).toFixed(3));
  
  const uniformityIndex = meanVelocity > 0 ? parseFloat(((stdDev / meanVelocity) * 100).toFixed(2)) : 0;
  const coVar = uniformityIndex;

  const minVal = Math.min(...velocities);
  const maxVal = Math.max(...velocities);
  const rangeRatio = meanVelocity > 0 ? parseFloat(((maxVal - minVal) / meanVelocity).toFixed(3)) : 0;

  // Z-scores and Outliers
  const zScores = calculatedReadings.map(r => {
    const z = stdDev > 0 ? parseFloat(((r.velocity - meanVelocity) / stdDev).toFixed(2)) : 0;
    const isOutlier = Math.abs(z) > 1.5; // Custom threshold due to 5 points
    return { id: r.id, zScore: z, isOutlier };
  });

  // Expected velocity gain at age t (days)
  // Grade lookup 28d velocity
  const v28Map = { M20: 3.8, M30: 4.2, M40: 4.6 };
  const v28 = v28Map[concreteGrade] || 4.2;
  // Strength ratio fraction (ACI 209 / IS 456 style model)
  const strengthFraction = ageDays / (4 + 0.85 * ageDays);
  // Velocity scales with square root of strength
  const velocityFraction = Math.sqrt(strengthFraction);
  const expectedVelocity = parseFloat((v28 * velocityFraction).toFixed(3));
  const velocityDeviation = expectedVelocity > 0 ? parseFloat((((meanVelocity - expectedVelocity) / expectedVelocity) * 100).toFixed(2)) : 0;

  // Reliability Score
  const reliabilityScore = Math.round(
    (numPoints / 5) * 40 +
    (calibrationOk ? 40 : 0) +
    (meanVelocity > 0 ? 20 : 0)
  );

  // Quality Score (0-100)
  const vNorm = Math.min(Math.max((meanVelocity - 2.0) / (4.8 - 2.0), 0), 1);
  const uiNorm = Math.min(Math.max(1 - (uniformityIndex / 25), 0), 1);
  const devNorm = Math.min(Math.max(1 - Math.abs(velocityDeviation) / 30, 0), 1);
  const qualityScore = Math.round((vNorm * 50) + (uiNorm * 30) + (devNorm * 20));

  // Risk Score
  const criticalityFactor = { Column: 1.2, Beam: 1.0, Slab: 0.8, Pier: 1.3 }[elementType] || 1.0;
  const riskScore = Math.round(Math.min((100 - qualityScore) * criticalityFactor, 100));

  // Failed Locations Count
  const failedLocationsCount = calculatedReadings.filter(r => r.velocity < 3.0).length;
  const criticalLocationsCount = calculatedReadings.filter(r => r.velocity < 2.5).length;
  const passFailRatio = parseFloat(((numPoints - failedLocationsCount) / numPoints).toFixed(2));

  // 3. Workmanship Defect Engine
  // Honeycombing Check: Local drop check
  const honeycombingProb = (() => {
    let maxDrop = 0;
    calculatedReadings.forEach((pt, i) => {
      const neighbours = calculatedReadings.filter((_, idx) => idx !== i);
      const avgNeighbours = neighbours.reduce((acc, curr) => acc + curr.velocity, 0) / neighbours.length;
      const drop = (avgNeighbours - pt.velocity) / avgNeighbours;
      if (drop > maxDrop) maxDrop = drop;
    });
    if (maxDrop > 0.25) return Math.round(85 + (maxDrop - 0.25) * 50);
    if (maxDrop > 0.15) return Math.round(40 + (maxDrop - 0.15) * 450);
    return Math.round(maxDrop * 200);
  })();

  // Voids Check: V < 2.5 km/s or Z-score < -1.8
  const voidsProb = (() => {
    const hasCritLow = velocities.some(v => v < 2.5);
    const hasZOutlier = zScores.some(zs => zs.zScore < -1.5);
    if (hasCritLow) return 92;
    if (hasZOutlier) return 70;
    if (meanVelocity < 3.3) return 40;
    return 12;
  })();

  // Segregation Check: CoV > 20% + no sharp single outlier (high uniform variability)
  const segregationProb = (() => {
    const hasSingleOutlier = zScores.some(zs => Math.abs(zs.zScore) > 1.8);
    if (coVar > 20 && !hasSingleOutlier) return 80;
    if (coVar > 15) return 50;
    return 15;
  })();

  // Poor Compaction Check: Mean V < 3.5 km/s + CoV < 12%
  const poorCompactionProb = (() => {
    if (meanVelocity < 3.5 && coVar < 12) return 85;
    if (meanVelocity < 3.8 && coVar < 15) return 60;
    return 8;
  })();

  // Cold Joints Check: Sharp step in velocity
  const coldJointsProb = (() => {
    let maxStep = 0;
    for (let i = 0; i < velocities.length - 1; i++) {
      const step = Math.abs(velocities[i] - velocities[i + 1]);
      if (step > maxStep) maxStep = step;
    }
    if (maxStep > 0.8) return 78;
    if (maxStep > 0.5) return 55;
    return 10;
  })();

  // Cracks Check: High travel times
  const cracksProb = (() => {
    const hasSpike = readings.some(r => r.time > 170);
    if (hasSpike && transmissionMethod === 'Indirect') return 88;
    if (hasSpike) return 72;
    return 14;
  })();

  // Inadequate Curing
  const inadequateCuringProb = (() => {
    if (velocityDeviation < -15 && ageDays > 7) return 75;
    if (velocityDeviation < -8) return 45;
    return 10;
  })();

  // Excess Water
  const excessWaterProb = (() => {
    if (velocityDeviation < -10 && ageDays <= 14) return 68;
    return 15;
  })();

  // Composite Defect Index (CDI)
  const defects = [
    { name: 'Honeycombing', prob: honeycombingProb, weight: 1.0 },
    { name: 'Voids', prob: voidsProb, weight: 1.2 },
    { name: 'Segregation', prob: segregationProb, weight: 0.8 },
    { name: 'Poor Compaction', prob: poorCompactionProb, weight: 0.9 },
    { name: 'Cold Joints', prob: coldJointsProb, weight: 0.7 },
    { name: 'Cracks', prob: cracksProb, weight: 1.1 },
    { name: 'Excess Water', prob: excessWaterProb, weight: 0.6 },
    { name: 'Inadequate Curing', prob: inadequateCuringProb, weight: 0.6 }
  ];
  
  const activeDefects = defects.filter(d => d.prob > 40);
  const weightedSum = activeDefects.reduce((acc, curr) => acc + curr.prob * curr.weight, 0);
  const totalWeight = activeDefects.reduce((acc, curr) => acc + curr.weight, 0);
  const compositeDefectIndex = totalWeight > 0 ? Math.min(Math.round(weightedSum / totalWeight), 100) : 0;

  // Primary Diagnosis
  const sortedDefects = [...defects].sort((a, b) => b.prob - a.prob);
  const primaryDefect = sortedDefects[0];
  const hasSubstantialDefect = primaryDefect.prob >= 40;

  // SIS calculation incorporating CDI
  const structuralIntegrityScore = Math.round(
    qualityScore * 0.5 + 
    (100 - compositeDefectIndex) * 0.3 + 
    (velocityDeviation >= -10 ? 20 : 0)
  );

  const possibleCausesText = (() => {
    if (!hasSubstantialDefect) {
      return "All scanning parameters verify nominal compliance thresholds. Concrete uniformity is stable and structural integrity indices exceed design margins. No anomalies detected.";
    }
    const causes = activeDefects.map(d => d.name.toLowerCase());
    return `Localized velocity reduction detected. Possible causes include ${causes.join(', ')}. ${primaryDefect.name} probability: ${primaryDefect.prob}%.`;
  })();

  // Trigger element selection mapping
  const selectScanPoint = (pt) => {
    const calculated = calculatedReadings.find(r => r.id === pt.id);
    const zScoreVal = zScores.find(zs => zs.id === pt.id)?.zScore || 0;
    
    setSelectedElement({
      type: `Ultrasonic Pulse Scan Point ${pt.id}`,
      id: `${structureId} - ${pt.id}`,
      metrics: {
        PointID: pt.id,
        Distance: `${pt.distance} mm`,
        TransitTime: `${pt.time} μs`,
        PulseVelocity: `${calculated.velocity} km/s`,
        Wavelength: `${calculated.wavelength} mm`,
        Classification: calculated.classification,
        ZScore: zScoreVal,
        Standard: 'IS 13311-1',
        Moisture: moistureCondition,
        Couplant: couplantType,
      }
    });
  };

  const selectSummaryElement = () => {
    setSelectedElement({
      type: 'UPV Quality Summary Diagnostics',
      id: `${structureId} - Summary`,
      metrics: {
        StructureID: structureId,
        ElementType: elementType,
        ConcreteGrade: concreteGrade,
        AgeDays: `${ageDays} Days`,
        MeanVelocity: `${meanVelocity} km/s`,
        UniformityIndex: `${uniformityIndex}%`,
        QualityScore: `${qualityScore}/100`,
        RiskScore: `${riskScore}/100`,
        PrimaryDiagnosis: hasSubstantialDefect ? `${primaryDefect.name} (${primaryDefect.prob}% Prob)` : 'NOMINAL / STABLE',
        SIS: `${structuralIntegrityScore}/100`,
        PassFailRatio: `${passFailRatio * 100}%`,
      }
    });
  };

  // Log initial render or change
  useEffect(() => {
    selectSummaryElement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structureId, elementType, concreteGrade, ageDays, meanVelocity]);

  // Handle Reading Changes
  const handleReadingChange = (id, field, value) => {
    const numericVal = value === '' ? 0 : parseFloat(value);
    setReadings(prev => prev.map(r => r.id === id ? { ...r, [field]: numericVal } : r));
  };

  // Perform Sign-Off Action
  const handleSignOff = () => {
    if (isSignedOff) return;
    const certCode = `CERT-UPV-${concreteGrade}-${Math.floor(100000 + Math.random() * 900000)}`;
    setCertificationCode(certCode);
    setIsSignedOff(true);

    const logMsg = `Certified & Signed Off UPV Structural Audit for ${structureId} (${elementType}). QS: ${qualityScore}, SIS: ${structuralIntegrityScore}, Verdict: ${qualityScore > 70 ? 'PASS' : 'WARNING/AUDIT'}`;
    addAuditLogEntry(logMsg, structureId);
    alert(`Audit Certified Successfully! Code: ${certCode}\nLogged to global CRM SSOT Audit Trail.`);
  };

  // Trigger PDF Download Simulation
  const handleDownloadReport = (type) => {
    const logMsg = `Downloaded ${type.toUpperCase()} Compliance Report for ${structureId}`;
    addAuditLogEntry(logMsg, structureId);
    alert(`Generating ${type.toUpperCase()} compliance dossier... Package compiled successfully. Download started.`);
  };

  return (
    <div className="space-y-4 text-xs font-mono text-black">
      
      {/* Dynamic Intake & Math Grid Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        
        {/* Left: Input Layer & Point Matrix */}
        <SubCard icon={Settings} title="Phase 1: Project & Reading Intake" footerText={`Active Device Status: ${calibrationOk ? 'CALIBRATED & CERTIFIED' : 'CALIBRATION EXPIRED - READONLY LOCKOUT'}`}>
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div>
              <label className="text-[12px] text-gray-500 font-bold block mb-1">Structure ID</label>
              <input 
                type="text" 
                value={structureId} 
                onChange={(e) => setStructureId(e.target.value.toUpperCase())}
                className="w-full border border-[#c8c8c8] px-1.5 py-1 rounded-[8px] bg-[#ffffff] text-[12px] focus:outline-none focus:border-border-default font-semibold"
              />
            </div>
            <div>
              <label className="text-[12px] text-gray-500 font-bold block mb-1">Element Type</label>
              <select 
                value={elementType} 
                onChange={(e) => setElementType(e.target.value)}
                className="w-full border border-[#c8c8c8] px-1.5 py-1 rounded-[8px] bg-[#ffffff] text-[12px] focus:outline-none focus:border-border-default font-semibold"
              >
                {['Column', 'Beam', 'Slab', 'Pier'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-gray-500 font-bold block mb-1">Concrete Grade</label>
              <select 
                value={concreteGrade} 
                onChange={(e) => setConcreteGrade(e.target.value)}
                className="w-full border border-[#c8c8c8] px-1.5 py-1 rounded-[8px] bg-[#ffffff] text-[12px] focus:outline-none focus:border-border-default font-semibold"
              >
                {['M20', 'M30', 'M40'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-gray-500 font-bold block mb-1">Concrete Age (Days)</label>
              <input 
                type="number" 
                min="1" 
                max="365"
                value={ageDays} 
                onChange={(e) => setAgeDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border border-[#c8c8c8] px-1.5 py-1 rounded-[8px] bg-[#ffffff] text-[12px] focus:outline-none focus:border-border-default font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 border-b border-[#e0e0e0] pb-3">
            <div>
              <label className="text-[12px] text-gray-500 font-bold block mb-1">Transmission</label>
              <select 
                value={transmissionMethod} 
                onChange={(e) => setTransmissionMethod(e.target.value)}
                className="w-full border border-[#c8c8c8] px-1.5 py-1 rounded-[8px] bg-[#ffffff] text-[12px] focus:outline-none focus:border-border-default font-semibold"
              >
                {['Direct', 'Semi-direct', 'Indirect'].map(m => <option key={m} value={m}>{m} Transmission</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-gray-500 font-bold block mb-1">Couplant Agent</label>
              <select 
                value={couplantType} 
                onChange={(e) => setCouplantType(e.target.value)}
                className="w-full border border-[#c8c8c8] px-1.5 py-1 rounded-[8px] bg-[#ffffff] text-[12px] focus:outline-none focus:border-border-default font-semibold"
              >
                {['Grease', 'Vaseline', 'Gel'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-gray-500 font-bold block mb-1">Moisture Matrix</label>
              <select 
                value={moistureCondition} 
                onChange={(e) => setMoistureCondition(e.target.value)}
                className="w-full border border-[#c8c8c8] px-1.5 py-1 rounded-[8px] bg-[#ffffff] text-[12px] focus:outline-none focus:border-border-default font-semibold"
              >
                {['Dry', 'Wet', 'SSD'].map(m => <option key={m} value={m}>{m} (Saturated Surface Dry)</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-gray-500 font-bold block mb-1">Calibration Check</label>
              <button 
                onClick={() => setCalibrationOk(!calibrationOk)}
                className={`w-full text-left border px-1.5 py-1 text-[12px] font-bold rounded-[8px] flex items-center justify-between ${calibrationOk ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}
              >
                <span>{calibrationOk ? 'ACTIVE' : 'LOCKOUT'}</span>
                <span className="text-[12px]">⚙️ Toggle</span>
              </button>
            </div>
          </div>

          {/* Readings Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-[#e0e0e0] text-gray-500 text-[12px]">
                  <th className="text-left pb-1.5 font-bold uppercase">Point</th>
                  <th className="text-left pb-1.5 font-bold uppercase">Path L (mm)</th>
                  <th className="text-left pb-1.5 font-bold uppercase">Time T (us)</th>
                  <th className="text-left pb-1.5 font-bold uppercase">Velocity V</th>
                  <th className="text-left pb-1.5 font-bold uppercase">Z-Score</th>
                  <th className="text-right pb-1.5 font-bold uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {calculatedReadings.map((r, i) => {
                  const z = zScores.find(zs => zs.id === r.id);
                  const isOut = z ? z.isOutlier : false;
                  return (
                    <tr 
                      key={r.id} 
                      onClick={() => selectScanPoint(r)}
                      className="border-b border-[#f0f0f0] hover:bg-[#f5f8fc] cursor-pointer transition-colors"
                    >
                      <td className="py-2 font-bold text-gray-800">{r.id}</td>
                      <td className="py-2">
                        <input 
                          type="number"
                          value={r.distance}
                          disabled={!calibrationOk}
                          onChange={(e) => handleReadingChange(r.id, 'distance', e.target.value)}
                          className="w-24 border border-[#c8c8c8] px-2 py-1 rounded-[8px] text-[12px] text-center focus:outline-none focus:border-border-default font-semibold disabled:bg-gray-100 disabled:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </td>
                      <td className="py-2">
                        <input 
                          type="number"
                          value={r.time}
                          disabled={!calibrationOk}
                          onChange={(e) => handleReadingChange(r.id, 'time', e.target.value)}
                          className="w-24 border border-[#c8c8c8] px-2 py-1 rounded-[8px] text-[12px] text-center focus:outline-none focus:border-border-default font-semibold disabled:bg-gray-100 disabled:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </td>
                      <td className="py-2 font-bold text-gray-900">{r.velocity} km/s</td>
                      <td className={`py-2 font-bold ${isOut ? 'text-red-600 animate-pulse' : 'text-gray-500'}`}>
                        {z ? z.zScore : '0.00'}
                      </td>
                      <td className="py-2 text-right">
                        <span className={`px-1.5 py-0.5 text-[12px] font-black border rounded-[8px]-[8px] uppercase tracking-wide ${r.statusClass}`}>
                          {r.classification}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SubCard>

        {/* Right: QA/QC Engine calculations */}
        <SubCard icon={BarChart2} title="Phase 2: QA/QC Validation Engine" footerText="IS 13311-1 / ASTM C597 compliant calculations updated instantly">
          
          {/* Diagnostic Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ['Mean Velocity', `${meanVelocity} km/s`, meanVelocity >= 3.5 ? 'PASS' : 'WARNING'],
              ['Uniformity Index', `${uniformityIndex}%`, uniformityIndex < 15 ? 'UNIFORM' : 'NON-UNIFORM'],
              ['Quality Score', `${qualityScore} / 100`, qualityScore > 70 ? 'OPTIMAL' : 'CRITICAL'],
              ['Risk Assessment', `${riskScore}%`, riskScore < 40 ? 'LOW RISK' : 'HIGH RISK'],
              ['Reliability Index', `${reliabilityScore}%`, reliabilityScore >= 80 ? 'HIGH' : 'LOW'],
              ['Integrity Score (SIS)', `${structuralIntegrityScore}%`, structuralIntegrityScore >= 70 ? 'STABLE' : 'AUDIT']
            ].map(([label, val, status]) => {
              const isCrit = status === 'WARNING' || status === 'NON-UNIFORM' || status === 'CRITICAL' || status === 'HIGH RISK' || status === 'AUDIT';
              return (
                <div key={label} className="p-2 border border-[#d4d4d4] bg-gray-50 rounded-[8px]-[8px]">
                  <span className="text-[12px] text-gray-500 uppercase font-bold block">{label}</span>
                  <div className="font-bold text-gray-800 text-[12px] mt-0.5">{val}</div>
                  <span className={`inline-block text-[12px] font-black uppercase mt-1 px-1 py-0.2 border rounded-[8px]-[8px] ${isCrit ? 'bg-black text-white border-border-default' : 'border-gray-300 text-gray-600'}`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Age Maturity Section */}
          <div className="border-t border-[#e0e0e0] pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-700 text-[12px] uppercase tracking-wide">Age Strength-Gain Maturity Curve</span>
              <span className="text-[12px] text-gray-500 uppercase">deviation from maturity curve</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              
              {/* Deviation Gauge Block */}
              <div className="h-36 p-4 border border-[#d4d4d4] rounded-[8px]-[8px] flex flex-col justify-center items-center bg-[#fafafa] text-center">
                <div className="text-[12px] text-gray-500 uppercase font-bold">Velocity Deviation</div>
                <div className={`text-lg font-black mt-2 ${velocityDeviation < -10 ? 'text-red-700 animate-pulse' : 'text-gray-800'}`}>
                  {velocityDeviation > 0 ? `+${velocityDeviation}` : velocityDeviation}%
                </div>
                <div className="text-[12px] text-gray-400 mt-2 uppercase font-bold">
                  {velocityDeviation < -10 ? 'INVESTIGATE AGE MISMATCH' : 'NOMINAL GAIN'}
                </div>
              </div>

              {/* Curve visualization in SVG */}
              <div className="sm:col-span-2 h-36 border border-[#d4d4d4] bg-white rounded-[8px]-[8px] p-3 relative flex items-center justify-center">
                <svg viewBox="0 0 260 80" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="15" y1="62" x2="245" y2="62" stroke="#eaeaea" strokeWidth="1" />
                  <line x1="15" y1="12" x2="245" y2="12" stroke="#eaeaea" strokeWidth="1" />
                  <line x1="45" y1="62" x2="45" y2="12" stroke="#eaeaea" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="85" y1="62" x2="85" y2="12" stroke="#eaeaea" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="145" y1="62" x2="145" y2="12" stroke="#eaeaea" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="215" y1="62" x2="215" y2="12" stroke="#eaeaea" strokeWidth="1" strokeDasharray="2,2" />
                  
                  {/* Expected strength-gain curve */}
                  <path 
                    d="M 15 62 Q 120 28 245 16" 
                    fill="none" 
                    stroke="#b5b5b5" 
                    strokeWidth="1.5" 
                  />
                  
                  {/* Legend Overlay (top left, extremely clear) */}
                  <text x="20" y="24" fontSize="9" fontWeight="black" fill="#000000">Actual: {meanVelocity} km/s</text>
                  <text x="20" y="34" fontSize="8" fontWeight="bold" fill="#777777">Expected: {expectedVelocity} km/s</text>
                  
                  {/* Actual point placement */}
                  {/* Normalize actual age (max 45) and mean velocity (max 5.2) */}
                  {(() => {
                    const normX = 15 + Math.min((ageDays / 45) * 230, 230);
                    const normY = 62 - Math.min((meanVelocity / 5.2) * 50, 50);
                    const expY = 62 - Math.min((expectedVelocity / 5.2) * 50, 50);
                    return (
                      <>
                        {/* Expected reference crosshair */}
                        <circle cx={normX} cy={expY} r="2" fill="#888" />
                        <line x1={normX} y1={expY} x2={normX} y2={normY} stroke="black" strokeWidth="0.8" strokeDasharray="2,1" />
                        {/* Actual indicator point */}
                        <circle cx={normX} cy={normY} r="4.5" fill="black" stroke="black" strokeWidth="1" />
                      </>
                    );
                  })()}
                  
                  {/* Axis labels */}
                  <text x="15" y="73" fontSize="9" fill="#888" textAnchor="middle">0d</text>
                  <text x="45" y="73" fontSize="9" fill="#888" textAnchor="middle">3d</text>
                  <text x="85" y="73" fontSize="9" fill="#888" textAnchor="middle">7d</text>
                  <text x="145" y="73" fontSize="9" fill="#888" textAnchor="middle">14d</text>
                  <text x="215" y="73" fontSize="9" fill="#888" textAnchor="middle">28d</text>
                  <text x="245" y="73" fontSize="9" fill="#888" fontWeight="bold" textAnchor="middle">Age</text>
                </svg>
              </div>

            </div>
          </div>
        </SubCard>

      </div>

            {/* Phase 3: 3D Digital Twin & Spatial Heatmap Simulation */}
      <SubCard 
        icon={Grid} 
        title="Phase 3: 3D Column Digital Twin & Spatial 2D Heatmap Simulation" 
        footerText="Real-time coordinate mapping — click nodes in either simulation to inspect"
      >
        <div className="space-y-6">
          
          {/* 1. Top Section: 2D Spatial Heatmap & Coordinate Readings */}
          <div className="border-b border-dashed border-[#d4d4d4] pb-6">
            <div className="text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>I. Spatial 2D Interpolation Grid Heatmap</span>
              <span className="text-[12px] text-gray-400 font-normal">Horizontal section view mapping</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* 2D Heatmap Canvas (lg:col-span-8) */}
              <div className="lg:col-span-8 border border-[#d4d4d4] bg-white rounded-[8px]-[8px] relative overflow-hidden h-[380px] md:h-[450px] flex flex-col justify-between p-4 select-none">
                <div className="flex justify-between w-full text-[12px] text-gray-500 font-bold z-20">
                  <span>ELEMENT LAYOUT AREA MATRIX</span>
                  <span>SPATIAL INTERPOLATION GRAPH (IDW)</span>
                </div>

                {/* Gradient representation mimicking IDW spatial interpolation */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.12] blur-xl">
                  {calculatedReadings.map((r, idx) => {
                    const coords = [
                      { x: '20%', y: '30%' },
                      { x: '50%', y: '25%' },
                      { x: '80%', y: '35%' },
                      { x: '35%', y: '70%' },
                      { x: '65%', y: '75%' }
                    ][idx];
                    
                    const isBad = r.velocity < 3.0;
                    const isWarn = r.velocity >= 3.0 && r.velocity < 3.5;
                    const color = isBad ? 'bg-red-600' : isWarn ? 'bg-yellow-500' : 'bg-green-500';
                    
                    return (
                      <div 
                        key={r.id} 
                        className={`absolute w-24 h-24 rounded-[8px]-full ${color}`}
                        style={{ left: coords.x, top: coords.y }}
                      />
                    );
                  })}
                </div>

                <svg viewBox="0 0 200 150" className="w-full h-full absolute inset-0 z-10">
                  {/* Structural boundary outline */}
                  <rect x="15" y="15" width="170" height="120" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="3,3" />
                  
                  {/* Coordinate mapping points */}
                  {(() => {
                    const pointsCoords = [
                      { id: 'P1', x: 40, y: 35 },
                      { id: 'P2', x: 100, y: 30 },
                      { id: 'P3', x: 160, y: 40 },
                      { id: 'P4', x: 70, y: 95 },
                      { id: 'P5', x: 130, y: 100 }
                    ];
                    
                    return pointsCoords.map(pt => {
                      const r = calculatedReadings.find(cr => cr.id === pt.id);
                      const isCrit = r.velocity < 3.0;
                      const isWarn = r.velocity >= 3.0 && r.velocity < 3.5;
                      const colorFill = isCrit ? '#000000' : isWarn ? '#eaeaea' : '#ffffff';
                      const strokeColor = '#000000';
                      const textFill = isCrit ? '#ffffff' : '#000000';
                      const isSelected = pt.id === selectedPointId;

                      return (
                        <g 
                          key={pt.id} 
                          className="cursor-pointer" 
                          onClick={() => {
                            const originalReading = readings.find(or => or.id === pt.id);
                            selectScanPoint(originalReading);
                          }}
                        >
                          {isSelected && (
                            <circle cx={pt.x} cy={pt.y} r="13" fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2" />
                          )}
                          <circle cx={pt.x} cy={pt.y} r="11" fill="transparent" stroke="rgba(0,0,0,0.1)" strokeWidth="1" className="hover:stroke-black transition-all" />
                          <circle cx={pt.x} cy={pt.y} r="8" fill={colorFill} stroke={strokeColor} strokeWidth="1.5" />
                          <text x={pt.x} y={pt.y + 2.5} textAnchor="middle" fill={textFill} fontSize="7" fontWeight="black">
                            {pt.id}
                          </text>
                          <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="#555" fontSize="5.5" fontWeight="bold">
                            {r.velocity} km/s
                          </text>
                        </g>
                      );
                    });
                  })()}
                </svg>

              </div>

              {/* 2D Grid Data Panel (lg:col-span-4) */}
              <div className="lg:col-span-4 flex flex-col justify-between h-[380px] md:h-[450px] gap-3">
                
                {/* Active Node Telemetry Details */}
                <div className="p-3 border border-[#d4d4d4] rounded-[8px]-[8px] bg-gray-50 space-y-2 flex-shrink-0">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                    <span className="text-[12px] text-gray-500 font-bold uppercase">Active Node Telemetry</span>
                    <span className={`px-1.5 py-0.5 text-[12px] font-black border rounded-[8px]-[8px] uppercase tracking-wide ${
                      calculatedReadings.find(r => r.id === selectedPointId)?.velocity < 3.0
                        ? 'bg-black text-white border-border-default animate-pulse'
                        : 'border-gray-300 text-gray-600'
                    }`}>
                      {selectedPointId}
                    </span>
                  </div>
                  {(() => {
                    const activePt = calculatedReadings.find(r => r.id === selectedPointId);
                    const activeZ = zScores.find(z => z.id === selectedPointId);
                    return (
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
                        <div>
                          <span className="text-[12px] text-gray-400 block font-bold uppercase">Velocity V</span>
                          <span className="font-bold text-gray-800">{activePt?.velocity} km/s</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-gray-400 block font-bold uppercase">Transit Time T</span>
                          <span className="font-bold text-gray-800">{activePt?.time} us</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-gray-400 block font-bold uppercase">Path Distance L</span>
                          <span className="font-bold text-gray-800">{activePt?.distance} mm</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-gray-400 block font-bold uppercase">Wavelength λ</span>
                          <span className="font-bold text-gray-800">{activePt?.wavelength} mm</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-gray-400 block font-bold uppercase">Z-Score Anomaly</span>
                          <span className={`font-bold ${activeZ?.isOutlier ? 'text-red-700 font-black' : 'text-gray-700'}`}>
                            {activeZ?.zScore}
                          </span>
                        </div>
                        <div>
                          <span className="text-[12px] text-gray-400 block font-bold uppercase">Excitation Freq</span>
                          <span className="font-bold text-gray-800">54 kHz</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[12px] text-gray-400 block font-bold uppercase">QA Verdict Classification</span>
                          <span className={`inline-block font-black uppercase text-[12px] mt-0.5 px-1 py-0.2 border rounded-[8px]-[8px] ${activePt?.statusClass}`}>
                            {activePt?.classification}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Checklist */}
                <div className="p-3 border border-[#d4d4d4] rounded-[8px]-[8px] bg-white flex-1 flex flex-col justify-between overflow-y-auto">
                  <span className="text-[12px] text-gray-500 font-bold block uppercase border-b border-gray-100 pb-1.5 mb-1.5">Point Status Checklist</span>
                  <div className="text-[12px] space-y-1.5 font-semibold text-gray-700">
                    {calculatedReadings.map(r => {
                      const isSelected = r.id === selectedPointId;
                      return (
                        <div 
                          key={r.id} 
                          onClick={() => selectScanPoint(r)}
                          className={`flex justify-between items-center p-1 rounded-[8px]-[8px] cursor-pointer transition-colors ${isSelected ? 'bg-gray-100 border border-gray-300' : 'hover:bg-gray-50'}`}
                        >
                          <span className="font-bold">Point {r.id}:</span>
                          <span className={r.velocity < 3.0 ? 'text-red-700 font-black animate-pulse' : 'text-green-700'}>
                            {r.velocity < 3.0 ? 'FAIL' : 'PASS'} ({r.velocity} km/s)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Spatial Score Block */}
                <div className="p-3 border border-[#d4d4d4] rounded-[8px]-[8px] bg-gray-50 space-y-1 flex-shrink-0">
                  <span className="text-[12px] text-gray-500 font-bold block uppercase">Spatial Anomaly Score</span>
                  <div className="text-lg font-black text-gray-800">
                    {Math.round((failedLocationsCount / numPoints) * 100)}%
                  </div>
                  <div className="text-[12px] text-gray-400 font-bold uppercase leading-relaxed">
                    {failedLocationsCount > 0 ? 'Localized Anomaly Flagged' : 'Nominal / Non-anomalous'}
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-[#d4d4d4] pt-4" />

          {/* 2. Bottom Section: 3D Isometric Digital Twin & Wave Telemetry */}
          <div>
            <div className="text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>II. 3D Isometric Column Digital Twin</span>
              <span className="text-[12px] text-gray-400 font-normal">Volumetric structural representation</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                     {/* 3D Simulation Canvas (lg:col-span-8) */}
              <div 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="lg:col-span-8 border border-[#d4d4d4] bg-white rounded-[8px]-[8px] relative overflow-hidden h-[380px] md:h-[450px] flex flex-col justify-between p-4 select-none"
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                
                {/* Title and HUD info */}
                <div className="flex justify-between w-full text-[12px] text-gray-500 font-bold z-20">
                  <span>3D ISOMETRIC COLUMN DIGITAL TWIN (DRAG TO ROTATE)</span>
                  <span>METHOD: {transmissionMethod.toUpperCase()}</span>
                </div>

                {/* 3D SVG Canvas */}
                <svg viewBox="0 0 220 150" className="w-full h-full absolute inset-0 z-10">
                  
                  {/* Gradients and Filters */}
                  <defs>
                    <radialGradient id="void-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="55%" stopColor="#ef4444" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Dotted reference outline bounds */}
                  <rect x="5" y="5" width="210" height="140" fill="none" stroke="#eaeaea" strokeWidth="0.8" />

                  {/* Compute Projected Coordinates for Render Items */}
                  {(() => {
                    // Vertices of the 3D concrete column
                    const v000 = project(-20, -45, -20); // Top Back Left
                    const v100 = project(20, -45, -20);  // Top Back Right
                    const v101 = project(20, -45, 20);   // Top Front Right
                    const v001 = project(-20, -45, 20);  // Top Front Left

                    const v010 = project(-20, 45, -20);  // Bottom Back Left
                    const v110 = project(20, 45, -20);   // Bottom Back Right
                    const v111 = project(20, 45, 20);    // Bottom Front Right
                    const v011 = project(-20, 45, 20);   // Bottom Front Left

                    // Rebar Vertices (4 main rebars inside the column)
                    const rb1_t = project(-14, -45, -14);
                    const rb1_b = project(-14, 45, -14);
                    const rb2_t = project(14, -45, -14);
                    const rb2_b = project(14, 45, -14);
                    const rb3_t = project(-14, -45, 14);
                    const rb3_b = project(-14, 45, 14);
                    const rb4_t = project(14, -45, 14);
                    const rb4_b = project(14, 45, 14);

                    // Void (honeycombing) center coordinates in 3D
                    const voidCenter = project(-5, 25, 5);

                    // Points configuration (tx, rx, label, isAnomaly, etc.)
                    const pointsDef = {
                      P1: { tx: [-20, -20, -10], rx: [20, -25, -10], isAnomaly: false, color: "#10b981", dur: "1.2s", label: "P1", fill: "#10b981", textColor: "#fff" },
                      P2: { tx: [20, -15, 10], rx: [-20, -12, 10], isAnomaly: false, color: "#10b981", dur: "1.3s", label: "P2", fill: "#10b981", textColor: "#fff" },
                      P3: { tx: [-20, 5, -5], rx: [20, 2, -5], isAnomaly: false, color: "#eab308", dur: "1.7s", label: "P3", fill: "#eab308", textColor: "#000" },
                      P4: { tx: [20, 25, -12], rx: [-20, 28, -12], isAnomaly: false, color: "#10b981", dur: "1.4s", label: "P4", fill: "#10b981", textColor: "#fff" },
                      P5: { tx: [-20, 30, 10], rx: [20, 27, 10], isAnomaly: true, color: "#ef4444", dur: "3.0s", label: "P5", fill: "#ef4444", textColor: "#fff" }
                    };

                    // Projected points list
                    const projectedPoints = Object.entries(pointsDef).map(([id, pt]) => {
                      const txProj = project(...pt.tx);
                      const rxProj = project(...pt.rx);
                      
                      // Click target point at the midpoint of TX and RX path
                      const midX = (pt.tx[0] + pt.rx[0]) / 2;
                      const midY = (pt.tx[1] + pt.rx[1]) / 2;
                      const midZ = (pt.tx[2] + pt.rx[2]) / 2;
                      const targetProj = project(midX, midY, midZ);
                      
                      const calculated = calculatedReadings.find(cr => cr.id === id);
                      return {
                        ...pt,
                        id,
                        tx: txProj,
                        rx: rxProj,
                        target: targetProj,
                        calculated
                      };
                    });

                    // Define faces and average depths
                    const faces = [
                      {
                        name: 'top',
                        points: [v000, v100, v101, v001],
                        fill: 'rgba(250, 250, 252, 0.95)',
                        stroke: '#888',
                      },
                      {
                        name: 'bottom',
                        points: [v010, v110, v111, v011],
                        fill: 'rgba(200, 202, 205, 0.95)',
                        stroke: '#888',
                      },
                      {
                        name: 'left',
                        points: [v000, v001, v011, v010],
                        fill: 'rgba(235, 237, 240, 0.9)',
                        stroke: '#888',
                      },
                      {
                        name: 'right',
                        points: [v100, v101, v111, v110],
                        fill: 'rgba(210, 212, 215, 0.9)',
                        stroke: '#888',
                      },
                      {
                        name: 'front',
                        points: [v001, v101, v111, v011],
                        fill: 'rgba(220, 222, 225, 0.9)',
                        stroke: '#888',
                      },
                      {
                        name: 'back',
                        points: [v000, v100, v110, v010],
                        fill: 'rgba(225, 227, 230, 0.9)',
                        stroke: '#888',
                      }
                    ];

                    // Sort elements by Z to implement Painter's Algorithm
                    const renderQueue = [];

                    // 1. Add faces
                    faces.forEach(f => {
                      const avgZ = f.points.reduce((sum, p) => sum + p.z, 0) / f.points.length;
                      renderQueue.push({
                        type: 'face',
                        z: avgZ,
                        data: f
                      });
                    });

                    // 2. Add Rebar lines
                    const rbLines = [
                      { p1: rb1_t, p2: rb1_b },
                      { p1: rb2_t, p2: rb2_b },
                      { p1: rb3_t, p2: rb3_b },
                      { p1: rb4_t, p2: rb4_b }
                    ];
                    rbLines.forEach((l, idx) => {
                      const avgZ = (l.p1.z + l.p2.z) / 2;
                      renderQueue.push({
                        type: 'rebar',
                        z: avgZ,
                        data: l,
                        id: `rb-${idx}`
                      });
                    });

                    // 3. Add Void Center glow
                    renderQueue.push({
                      type: 'void',
                      z: voidCenter.z,
                      data: voidCenter
                    });

                    // 4. Add Active Propagation Path & Probes (if selected)
                    const activeProjPt = projectedPoints.find(p => p.id === selectedPointId);
                    if (activeProjPt) {
                      const avgZ = (activeProjPt.tx.z + activeProjPt.rx.z) / 2;
                      renderQueue.push({
                        type: 'wave',
                        z: avgZ,
                        data: activeProjPt
                      });
                    }

                    // 5. Add Interactive Click Target Nodes
                    projectedPoints.forEach(pt => {
                      renderQueue.push({
                        type: 'node',
                        z: pt.target.z - 2, // Slightly offset towards viewer to stay clickable
                        data: pt
                      });
                    });

                    // Sort queue descending (furthest Z first)
                    renderQueue.sort((a, b) => b.z - a.z);

                    // Render in depth order
                    return renderQueue.map((item, idx) => {
                      if (item.type === 'face') {
                        const { points, fill, stroke } = item.data;
                        const ptsStr = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
                        return (
                          <polygon 
                            key={`face-${idx}`} 
                            points={ptsStr} 
                            fill={fill} 
                            stroke={stroke} 
                            strokeWidth="1" 
                          />
                        );
                      }

                      if (item.type === 'rebar') {
                        const { p1, p2 } = item.data;
                        return (
                          <line 
                            key={`rebar-${item.id}`}
                            x1={p1.x.toFixed(1)} 
                            y1={p1.y.toFixed(1)} 
                            x2={p2.x.toFixed(1)} 
                            y2={p2.y.toFixed(1)} 
                            stroke="#a1a1a1" 
                            strokeWidth="0.6" 
                            strokeDasharray="4,4" 
                          />
                        );
                      }

                      if (item.type === 'void') {
                        const vc = item.data;
                        return (
                          <circle 
                            key="void-glow-circle" 
                            cx={vc.x.toFixed(1)} 
                            cy={vc.y.toFixed(1)} 
                            r="18" 
                            fill="url(#void-glow)" 
                            className="animate-pulse pointer-events-none" 
                          />
                        );
                      }

                      if (item.type === 'wave') {
                        const pt = item.data;
                        const hasBending = pt.isAnomaly;
                        
                        let pathD = `M ${pt.tx.x.toFixed(1)} ${pt.tx.y.toFixed(1)}`;
                        if (hasBending) {
                          const midX = (pt.tx.x + pt.rx.x) / 2;
                          const midY = (pt.tx.y + pt.rx.y) / 2 - 12;
                          pathD += ` Q ${midX.toFixed(1)} ${midY.toFixed(1)}, ${pt.rx.x.toFixed(1)} ${pt.rx.y.toFixed(1)}`;
                        } else {
                          pathD += ` L ${pt.rx.x.toFixed(1)} ${pt.rx.y.toFixed(1)}`;
                        }

                        return (
                          <g key="active-wave-propagation" className="pointer-events-none">
                            <path 
                              id="wave-propagation-path-bottom" 
                              d={pathD} 
                              fill="none" 
                              stroke={pt.color} 
                              strokeWidth="1.2" 
                              strokeDasharray={pt.isAnomaly ? "2,1" : "3,3"} 
                            />
                            
                            <circle cx={pt.tx.x.toFixed(1)} cy={pt.tx.y.toFixed(1)} r="3.5" fill="#10b981" stroke="#000" strokeWidth="1" />
                            <text x={pt.tx.x - 6} y={pt.tx.y + 1.8} fontSize="5" fontWeight="bold" textAnchor="end" fill="#10b981">TX</text>
                            
                            <circle cx={pt.rx.x.toFixed(1)} cy={pt.rx.y.toFixed(1)} r="3.5" fill="#3b82f6" stroke="#000" strokeWidth="1" />
                            <text x={pt.rx.x + 6} y={pt.rx.y + 1.8} fontSize="5" fontWeight="bold" textAnchor="start" fill="#3b82f6">RX</text>

                            {pt.isAnomaly && (
                              <g>
                                <line x1={voidCenter.x.toFixed(1)} y1={voidCenter.y.toFixed(1)} x2={(voidCenter.x - 30).toFixed(1)} y2={(voidCenter.y - 25).toFixed(1)} stroke="#ef4444" strokeWidth="0.5" />
                                <rect x={(voidCenter.x - 55).toFixed(1)} y={(voidCenter.y - 35).toFixed(1)} width="48" height="10" fill="rgba(0,0,0,0.85)" rx="1" />
                                <text x={(voidCenter.x - 31).toFixed(1)} y={(voidCenter.y - 28.5).toFixed(1)} fill="#fff" fontSize="4.5" textAnchor="middle" fontWeight="bold">ANOMALY VOID</text>
                              </g>
                            )}
                          </g>
                        );
                      }

                      if (item.type === 'node') {
                        const pt = item.data;
                        const isSelected = pt.id === selectedPointId;
                        
                        return (
                          <g 
                            key={`node-${pt.id}`} 
                            className="cursor-pointer"
                            onClick={() => {
                              const originalReading = readings.find(r => r.id === pt.id);
                              selectScanPoint(originalReading);
                              setSelectedPointId(pt.id);
                            }}
                          >
                            {isSelected && (
                              <circle cx={pt.target.x.toFixed(1)} cy={pt.target.y.toFixed(1)} r="8.5" fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2" />
                            )}
                            <circle cx={pt.target.x.toFixed(1)} cy={pt.target.y.toFixed(1)} r="5.5" fill={isSelected ? 'black' : pt.fill} stroke="#000" strokeWidth="1" />
                            <text x={pt.target.x.toFixed(1)} y={(pt.target.y + 1.8).toFixed(1)} textAnchor="middle" fill={isSelected ? '#fff' : pt.textColor} fontSize="5.5" fontWeight="bold">
                              {pt.label}
                            </text>
                            <text x={pt.target.x.toFixed(1)} y={(pt.target.y - 7).toFixed(1)} textAnchor="middle" fill="#222" fontSize="5" fontWeight="black">
                              {pt.calculated.velocity} km/s
                            </text>
                          </g>
                        );
                      }

                      return null;
                    });
                  })()}

                </svg>

                {/* Telemetry info HUD */}
                <div className="flex justify-between w-full text-[12px] font-bold z-20 bg-gray-50/90 border border-gray-200 p-1 rounded-[8px]-[8px]">
                  {(() => {
                    const calculated = calculatedReadings.find(r => r.id === selectedPointId);
                    return (
                      <>
                        <span>ACTIVE: {selectedPointId}</span>
                        <span>VEL: {calculated?.velocity} km/s</span>
                        <span>TIME: {calculated?.time} us</span>
                      </>
                    );
                  })()}
                </div>

              </div>

              {/* 3D Telemetry Diagnostics HUD (lg:col-span-4) */}
              <div className="lg:col-span-4 flex flex-col justify-between h-[380px] md:h-[450px] gap-3">
                
                {/* 3D Transducers Metadata */}
                <div className="p-3 border border-[#d4d4d4] bg-gray-50 rounded-[8px]-[8px] space-y-1.5 text-[12px]">
                  <span className="text-[12px] text-gray-500 font-bold block uppercase border-b border-gray-200 pb-1 mb-1">Ultrasonic Calibration</span>
                  {(() => {
                    const activePt = calculatedReadings.find(r => r.id === selectedPointId);
                    return [
                      ['Excitation Pulser', '250V Pulse Energy'],
                      ['Transducer Freq', '54 kHz Nominal'],
                      ['Transmission Mode', `${transmissionMethod} Mode`],
                      ['Selected Point', selectedPointId],
                      ['Calculated Wavelength', `${activePt?.wavelength} mm`],
                      ['Actual Deviation', `${velocityDeviation}%`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-bold text-gray-800">{v}</span>
                      </div>
                    ));
                  })()}
                </div>

                {/* Oscilloscope Waveform Panel */}
                <OscilloscopePanel 
                  activePt={calculatedReadings.find(r => r.id === selectedPointId)} 
                  selectedPointId={selectedPointId} 
                />

                {/* HUD Action Status */}
                <div className="p-3 border border-[#d4d4d4] bg-gray-50 rounded-[8px]-[8px] text-[12px] leading-relaxed text-gray-500">
                  <span className="font-bold block text-gray-700 uppercase mb-0.5">Workstation Diagnostics</span>
                  Sensor parameters verified against IS 13311-1. Telemetry channels acquired at 1.2 megasamples/sec.
                </div>

              </div>

            </div>
          </div>

        </div>
      </SubCard>

      {/* Phase 4: AI Defect Diagnosis & Technical Guidelines */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        
        {/* Left: Workmanship Defect Engine */}
        <SubCard icon={Cpu} title="Phase 4: Workmanship Defect Engine" footerText="Calculated defect probability metrics using sensor variance logic">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Primary Diagnosis Output */}
            <div className="border border-[#c8c8c8] p-3 rounded-[8px]-[8px] bg-black text-white flex flex-col justify-between">
              <div>
                <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wide block">Primary AI Diagnosis</span>
                <div className="text-sm font-black uppercase mt-1">
                  {hasSubstantialDefect ? 'LOCALIZED ANOMALY DETECTED' : 'NOMINAL QUALITY SIGNATURE'}
                </div>
                <div className="text-[12px] text-gray-300 mt-2 font-sans font-semibold leading-relaxed">
                  {possibleCausesText}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-2.5 mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[12px] text-gray-400 block font-bold">CONFIDENCE</span>
                  <span className="text-[12px] font-black">{hasSubstantialDefect ? `${primaryDefect.prob}%` : '98.5%'}</span>
                </div>
                <div>
                  <span className="text-[12px] text-gray-400 block font-bold">COMPOSITE CDI</span>
                  <span className="text-[12px] font-black">{compositeDefectIndex} / 100</span>
                </div>
              </div>
            </div>

            {/* Defect List Bars */}
            <div className="space-y-1.5">
              <span className="text-[12px] text-gray-500 font-bold uppercase block tracking-wider mb-1">Probability Index per Defect</span>
              {defects.map(d => {
                const isHigh = d.prob >= 40;
                return (
                  <div key={d.name} className="space-y-0.5">
                    <div className="flex justify-between text-[12px] font-semibold text-gray-700">
                      <span>{d.name}</span>
                      <span className={isHigh ? 'font-bold text-red-600' : 'text-gray-500'}>{d.prob}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 border border-[#e0e0e0] rounded-[8px] overflow-hidden">
                      <div 
                        style={{ width: `${d.prob}%` }} 
                        className={`h-full transition-all ${isHigh ? 'bg-black' : 'bg-gray-400'}`} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Action Recommendations */}
          <div className="border-t border-[#e0e0e0] pt-2.5 space-y-1 text-[12px]">
            <span className="font-bold text-gray-700 uppercase block text-[12px]">AI Recommended Next Actions:</span>
            {hasSubstantialDefect ? (
              <>
                <div className="flex items-start gap-1 text-gray-700">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Action REQUIRED:</strong> Validate suspicious points (V &lt; 3.0 km/s) using mechanical Rebound Hammer (IS 13311-2) to isolate compaction voids.</span>
                </div>
                <div className="flex items-start gap-1 text-gray-700">
                  <span className="font-bold text-black">•</span>
                  <span>Verify curing records for the past 14 days. If moisture level was low, run a core compression validation.</span>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-1 text-gray-600">
                <span className="font-bold text-green-700">✓</span>
                <span>Structural telemetry is within nominal specification parameters. Proceed with scheduled construction stages. Record baseline logs.</span>
              </div>
            )}
          </div>
        </SubCard>

        {/* NDT Interpretation & Capabilities Matrix */}
        <SubCard icon={Info} title="NDT Interpretation & Capability Guide" footerText="Compliance matrix from IS 13311-1 and ACI standards">
          
          {/* Warning block */}
          <div className="p-2.5 border border-yellow-500 bg-yellow-50 text-[12px] text-yellow-800 rounded-[8px]-[8px] leading-relaxed flex items-start gap-2 shadow-[inset_1px_1px_0_rgba(255,255,255,0.95)]">
            <AlertTriangle className="h-4.5 w-4.5 text-yellow-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">UPV Standalone Limitations:</span> UPV is a quality assessment and anomaly indication tool, not a standalone defect identifier. Low velocity readings (e.g. &lt; 3.0 km/s) indicate localized density loss but cannot definitively isolate the cause (honeycombing vs voids vs cracks) without complementary rebound hammer or core sample testing.
            </div>
          </div>

          {/* Capability table */}
          <div className="overflow-x-auto pt-1">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#e0e0e0] text-gray-500 text-[12px] uppercase">
                  <th className="text-left pb-1 font-bold">Concrete Condition</th>
                  <th className="text-right pb-1 font-bold">Detection Capability</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Honeycombing / Air Pockets', 'High', 'bg-green-50 text-green-700 border-green-200'],
                  ['Voids / Cavities', 'High', 'bg-green-50 text-green-700 border-green-200'],
                  ['Concrete Compaction Quality', 'High', 'bg-green-50 text-green-700 border-green-200'],
                  ['Non-uniformity / Density Shifts', 'High', 'bg-green-50 text-green-700 border-green-200'],
                  ['Cracks & Internal Voids', 'High (if path interrupted)', 'bg-green-50 text-green-700 border-green-200'],
                  ['Segregation & Placement faults', 'Moderate to High', 'bg-yellow-50 text-yellow-700 border-yellow-200'],
                  ['Cold Joints & Layer Gaps', 'Moderate', 'bg-yellow-50 text-yellow-700 border-yellow-200'],
                  ['Improper Curing & Moisture Shift', 'Indirect / Calibrated', 'bg-gray-50 text-gray-600 border-gray-200']
                ].map(([cond, cap, badgeClass]) => (
                  <tr key={cond} className="border-b border-[#f0f0f0]">
                    <td className="py-1.5 font-semibold text-gray-800">{cond}</td>
                    <td className="py-1.5 text-right">
                      <span className={`px-1.5 py-0.5 text-[12px] font-black border rounded-[8px]-[8px] uppercase tracking-wide ${badgeClass}`}>
                        {cap}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubCard>

      </div>

      {/* Phase 5: Compliance Certification & Approvals */}
      <SubCard icon={Award} title="Phase 5: Compliance Certification & Approvals" footerText="Audit log trail requires valid certification signatures to release construction stages">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          
          {/* Notes input */}
          <div className="lg:col-span-2 space-y-2">
            <label className="text-[12px] text-gray-600 font-bold uppercase tracking-wider block">Engineering Certification Notes & Remarks</label>
            <textarea
              value={engineerNotes}
              disabled={isSignedOff}
              onChange={(e) => setEngineerNotes(e.target.value)}
              placeholder="Enter compliance clearance remarks, rebound hammer cross-check recommendations, or sign-off overrides..."
              className="w-full h-16 border border-[#c8c8c8] p-2 rounded-[8px] text-[12px] focus:outline-none focus:border-border-default font-semibold disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* Action and Stamp Block */}
          <div className="flex flex-col gap-2 justify-center">
            {isSignedOff ? (
              <div className="border border-green-500 bg-green-50 p-2.5 rounded-[8px]-[8px] flex items-center gap-2.5 shadow-[inset_1px_1px_0_rgba(255,255,255,0.95)]">
                <CheckCircle className="h-7 w-7 text-green-600 flex-shrink-0" />
                <div className="text-[12px]">
                  <div className="font-black text-green-800 uppercase tracking-wide">CLEARANCE CERTIFIED</div>
                  <div className="font-bold text-gray-600 mt-0.5">Code: {certificationCode}</div>
                  <div className="text-[12px] text-gray-500 uppercase mt-0.5">Logged to SSOT Audit Log</div>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleSignOff}
                disabled={!calibrationOk}
                className="w-full btn-skeuo-dark text-[12px] uppercase tracking-wider py-2.5 font-black flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Award className="h-4 w-4" />
                <span>Certify & Sign-off UPV Audit</span>
              </button>
            )}

            <div className="flex gap-2">
              <button 
                onClick={() => handleDownloadReport('pdf')}
                className="flex-1 btn-skeuo text-[12px] uppercase tracking-wider py-1.5 font-bold flex items-center justify-center gap-1"
              >
                <Download className="h-3 w-3" />
                <span>Dossier PDF</span>
              </button>
              <button 
                onClick={() => handleDownloadReport('csv')}
                className="flex-1 btn-skeuo text-[12px] uppercase tracking-wider py-1.5 font-bold flex items-center justify-center gap-1"
              >
                <FileText className="h-3 w-3" />
                <span>Raw CSV Log</span>
              </button>
            </div>
          </div>

        </div>
      </SubCard>

    </div>
  );
}
