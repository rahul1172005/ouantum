'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Eye, ShieldAlert, Cpu, Activity, Layers, Radio, Zap, Thermometer, Waves, BarChart2, AlertTriangle } from 'lucide-react';
import UPVTestSection from './UPVTestSection';

function LevelCard({ icon: Icon, title, children, footerText = null, headerAction = null }) {
  return (
    <div className="zoho-card flex flex-col">
      <div className="zoho-card-header">
        {Icon && <Icon className="h-4 w-4 text-gray-700 flex-shrink-0" />}
        <span className="font-bold text-gray-800 text-[12px] uppercase tracking-wide">{title}</span>
        {headerAction && <div className="ml-auto flex-shrink-0">{headerAction}</div>}
      </div>
      <div className="zoho-card-body space-y-3 flex-1">
        {children}
      </div>
      {footerText && (
        <div className="zoho-card-footer">
          <span className="text-gray-500 font-semibold text-[12px] uppercase tracking-normal">{footerText}</span>
        </div>
      )}
    </div>
  );
}

const NDT_MODES = [
  { id: 'upv',         label: 'UPV',             fullLabel: 'Ultrasonic Pulse Velocity',   standard: 'IS 13311-1' },
  { id: 'rebound',     label: 'Rebound',          fullLabel: 'Rebound Hammer Test',         standard: 'IS 13311-2' },
  { id: 'halfcell',    label: 'Half Cell',        fullLabel: 'Half Cell Potential',         standard: 'ASTM C876'  },
  { id: 'covermeter',  label: 'Cover Meter',      fullLabel: 'Cover Meter (Rebar Depth)',   standard: 'BS 1881'    },
  { id: 'gpr',         label: 'GPR',              fullLabel: 'Ground Penetrating Radar',    standard: 'ASTM D4748' },
  { id: 'impactecho',  label: 'Impact Echo',      fullLabel: 'Impact Echo Test',            standard: 'ASTM C1383' },
  { id: 'pulseecho',   label: 'Pulse Echo',       fullLabel: 'Pulse Echo (UT Reflection)',  standard: 'EN 12668'   },
  { id: 'irt',         label: 'IRT',              fullLabel: 'Infrared Thermography',       standard: 'ASTM E1156' },
  { id: 'acoustic',    label: 'Acoustic',         fullLabel: 'Acoustic Emission Testing',   standard: 'ASTM E1316' },
  { id: 'radiography', label: 'Radiography',      fullLabel: 'Radiographic Testing (RT)',   standard: 'ASTM E94'   },
  { id: 'magparticle', label: 'Mag Particle',     fullLabel: 'Magnetic Particle Testing',  standard: 'ASTM E1444' },
  { id: 'dyepenetrant',label: 'Dye Penetrant',    fullLabel: 'Dye Penetrant Testing (PT)', standard: 'ASTM E165'  },
  { id: 'eddycurrent', label: 'Eddy Current',     fullLabel: 'Eddy Current Testing (ET)',  standard: 'ASTM E243'  },
  { id: 'resistivity', label: 'Resistivity',      fullLabel: 'Resistivity Testing',        standard: 'BS 1881'    },
  { id: 'carbonation', label: 'Carbonation',      fullLabel: 'Carbonation Depth Testing',  standard: 'BS EN 14630'},
  { id: 'corrosion',   label: 'Corrosion Mon.',   fullLabel: 'Corrosion Monitoring',        standard: 'NACE SP0169'},
];

// Simulated result data per test mode
const NDT_RESULTS = {
  upv: { readings: ['4320 m/s','4510 m/s','3980 m/s','4150 m/s','4640 m/s'], verdict: 'GOOD', note: 'V > 4000 m/s: Excellent concrete quality (IS 13311-1)' },
  rebound: { readings: ['38','41','35','42','39'], verdict: 'GOOD', note: 'Rebound Index 35–45: Concrete fck ≈ 28–35 MPa' },
  halfcell: { readings: ['-180 mV','-220 mV','-310 mV','-160 mV','-290 mV'], verdict: 'WARNING', note: '>-200mV: 10% corrosion probability. >-350mV: 90% probability' },
  covermeter: { readings: ['42mm','38mm','51mm','45mm','29mm'], verdict: 'WARNING', note: 'Min cover 40mm IS456. One reading critically low at 29mm' },
  gpr: { readings: ['Rebar at 45mm','Void at 120mm','Delamination 180mm','Clear','Moisture pocket 90mm'], verdict: 'CRITICAL', note: 'Delamination and moisture pocket detected — further investigation required' },
  impactecho: { readings: ['2400 Hz','2380 Hz','1850 Hz','2410 Hz','2390 Hz'], verdict: 'WARNING', note: 'Low freq anomaly at Pt.3 indicates internal void' },
  pulseecho: { readings: ['Thickness: 248mm','250mm','247mm','210mm','249mm'], verdict: 'WARNING', note: 'Pt.4 thickness deficit: possible section loss from corrosion' },
  irt: { readings: ['22.4°C','24.1°C','31.6°C','22.8°C','23.2°C'], verdict: 'CRITICAL', note: 'Thermal anomaly at Pt.3 (+9°C delta): delamination or moisture intrusion' },
  acoustic: { readings: ['12 events/hr','8 events/hr','47 events/hr','10 events/hr','15 events/hr'], verdict: 'WARNING', note: 'Elevated AE events at Pt.3 indicate active crack propagation' },
  radiography: { readings: ['0.12% void','0.09% void','0.41% void','0.11% void','0.38% void'], verdict: 'CRITICAL', note: 'Voids at Pt.3 & Pt.5 exceed 0.2% design limit — remediation required' },
  magparticle: { readings: ['No indication','No indication','Linear indication 6mm','No indication','No indication'], verdict: 'WARNING', note: 'Linear indication at Pt.3 — surface crack confirmed. Document & monitor' },
  dyepenetrant: { readings: ['No bleed-out','No bleed-out','Strong bleed-out','Faint bleed-out','No bleed-out'], verdict: 'WARNING', note: 'Penetrant bleed-out at Pt.3 confirms open surface crack' },
  eddycurrent: { readings: ['Phase 42°','Phase 44°','Phase 71°','Phase 43°','Phase 68°'], verdict: 'CRITICAL', note: 'High phase angles at Pt.3 & Pt.5: corrosion-induced conductivity loss' },
  resistivity: { readings: ['28 kΩ·cm','31 kΩ·cm','8 kΩ·cm','29 kΩ·cm','12 kΩ·cm'], verdict: 'CRITICAL', note: '<10 kΩ·cm: High corrosion risk (Pt.3). 10–20: Moderate (Pt.5)' },
  carbonation: { readings: ['12mm','14mm','28mm','11mm','22mm'], verdict: 'WARNING', note: 'Carbonation front approaching rebar at Pt.3 (28mm depth vs 29mm cover)' },
  corrosion: { readings: ['0.1 μA/cm²','0.08 μA/cm²','0.89 μA/cm²','0.12 μA/cm²','0.54 μA/cm²'], verdict: 'CRITICAL', note: '>0.5 μA/cm²: Active corrosion (Pt.3, Pt.5). Immediate remediation required' },
};

const VERDICT_STYLE = {
  GOOD:     'border-gray-300 bg-white text-gray-800',
  WARNING:  'border-border-default bg-white text-black',
  CRITICAL: 'border-border-default bg-black text-white animate-pulse',
};

export default function NDTLab({ selectedElement, setSelectedElement }) {
  const [activeMode, setActiveMode] = useState('upv');
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 150, y: 120 });
  const canvasRef = useRef(null);

  const mode = NDT_MODES.find(m => m.id === activeMode);
  const result = NDT_RESULTS[activeMode];

  // Oscilloscope canvas — UPV / Pulse Echo / Acoustic / Eddy
  useEffect(() => {
    const waveformModes = ['upv', 'pulseecho', 'acoustic', 'eddycurrent'];
    if (!waveformModes.includes(activeMode)) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, offset = 0;

    const draw = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
      for (let j = 0; j < canvas.height; j += 20) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }
      ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2); ctx.stroke();
      ctx.strokeStyle = '#000000'; ctx.lineWidth = 2; ctx.beginPath();
      const distToDefect = Math.abs(mousePos.x - 280);
      const intensity = Math.max(0.1, 4 - distToDefect / 60);
      for (let x = 0; x < canvas.width; x++) {
        let y = Math.sin(x * 0.05 + offset) * 20;
        if (x > 220 && x < 340) y += Math.sin(x * 0.4) * (15 * intensity);
        x === 0 ? ctx.moveTo(x, canvas.height / 2 + y) : ctx.lineTo(x, canvas.height / 2 + y);
      }
      ctx.stroke();
      offset += 0.15;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [activeMode, mousePos]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) });
  };

  const triggerScan = () => {
    if (isScanning) return;
    setIsScanning(true); setScanProgress(0);
    let p = 0;
    const iv = setInterval(() => { p += 10; setScanProgress(p); if (p >= 100) { clearInterval(iv); setIsScanning(false); } }, 200);
  };

  const waveformModes = ['upv', 'pulseecho', 'acoustic', 'eddycurrent'];
  const thermalModes  = ['irt', 'corrosion'];
  const gridModes     = ['radiography', 'gpr', 'magparticle', 'dyepenetrant'];
  const meterModes    = ['rebound', 'halfcell', 'covermeter', 'impactecho', 'resistivity', 'carbonation'];

  return (
    <div className="space-y-4 font-mono text-xs text-black">

      {/* Module Header Card */}
      <LevelCard icon={Activity} title="NDT Intelligence Lab — Full Module" footerText="16 non-destructive test methods | IS, ASTM, BS, EN compliance">
        <div className="workspace-tabs select-none">
          {NDT_MODES.map((m) => (
            <button key={m.id} onClick={() => setActiveMode(m.id)} className={`workspace-tab ${activeMode === m.id ? 'active' : ''}`}>
              {m.label}
            </button>
          ))}
        </div>
      </LevelCard>

      {/* Main Test Area */}
      {activeMode === 'upv' ? (
        <UPVTestSection setSelectedElement={setSelectedElement} />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Left — Controls & Meta */}
        <div className="xl:col-span-1 space-y-4">
          <LevelCard icon={Cpu} title="Test Configuration" footerText={`Standard: ${mode.standard}`}>
            <div className="space-y-2 text-[12px]">
              <div className="p-2 border border-[#d4d4d4] bg-gray-50 rounded-sm">
                <p className="text-[12px] text-gray-500 uppercase font-bold">Full Test Name</p>
                <p className="font-bold text-gray-800 mt-0.5">{mode.fullLabel}</p>
              </div>
              <div className="p-2 border border-[#d4d4d4] bg-gray-50 rounded-sm">
                <p className="text-[12px] text-gray-500 uppercase font-bold">Compliance Standard</p>
                <p className="font-bold text-gray-800 mt-0.5">{mode.standard}</p>
              </div>
              <div className="p-2 border border-[#d4d4d4] bg-gray-50 rounded-sm">
                <p className="text-[12px] text-gray-500 uppercase font-bold">Scan Status</p>
                {isScanning ? (
                  <div className="mt-1 space-y-1">
                    <div className="flex justify-between text-[12px] font-bold"><span className="animate-pulse">SCANNING...</span><span>{scanProgress}%</span></div>
                    <div className="w-full h-1.5 bg-gray-100 border border-[#d4d4d4] rounded overflow-hidden">
                      <div style={{ width: `${scanProgress}%` }} className="h-full bg-black transition-all" />
                    </div>
                  </div>
                ) : (
                  <p className="font-bold text-gray-700 mt-0.5">STANDBY — {scanProgress === 100 ? 'SCAN COMPLETE' : 'READY'}</p>
                )}
              </div>
              <button onClick={triggerScan} disabled={isScanning} className="w-full btn-skeuo-dark text-[12px] uppercase tracking-wider mt-1">
                {isScanning ? 'Scanning...' : `Run ${mode.label} Scan`}
              </button>
            </div>
          </LevelCard>

          <LevelCard icon={ShieldAlert} title="Probe Telemetry" footerText="Live sensor acquisition parameters">
            <div className="space-y-1 text-[12px]">
              {[
                ['Probe Position', `X:${mousePos.x} Y:${mousePos.y}`],
                ['Frequency', activeMode === 'upv' ? '54 kHz' : activeMode === 'acoustic' ? '150 kHz' : activeMode === 'eddycurrent' ? '100 kHz' : '4.2 MHz'],
                ['Gain / dB', activeMode === 'rebound' ? 'N/A (Mechanical)' : '32.5 dB'],
                ['Signal Quality', '98.4%'],
                ['Scan Points', '5 of 5'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500 uppercase">{k}</span>
                  <span className="font-bold">{v}</span>
                </div>
              ))}
            </div>
          </LevelCard>
        </div>

        {/* Center — Scan Viewport */}
        <div className="xl:col-span-2 space-y-4">
          <LevelCard
            icon={Eye}
            title={`${mode.fullLabel} — Scan Viewport`}
            footerText="Hover over viewport to position scan probe"
            headerAction={
              <span className={`text-[12px] px-1.5 py-0.5 border rounded-sm font-black uppercase ${VERDICT_STYLE[result.verdict]}`}>
                {result.verdict}
              </span>
            }
          >
            <div onMouseMove={handleMouseMove} className="w-full border border-[#d4d4d4] bg-white overflow-hidden relative select-none" style={{ minHeight: 240 }}>

              {/* Waveform (UPV, Pulse Echo, Acoustic, Eddy) */}
              {waveformModes.includes(activeMode) && (
                <div className="h-[240px] relative">
                  <canvas ref={canvasRef} width={600} height={240} className="w-full h-full block" />
                  <div className="absolute pointer-events-none border border-border-default px-1.5 py-0.5 bg-white font-bold text-[12px]" style={{ left: mousePos.x + 8, top: Math.min(mousePos.y - 12, 200) }}>
                    {mode.label.toUpperCase()}-PROBE
                  </div>
                </div>
              )}

              {/* Thermal / Corrosion Map */}
              {thermalModes.includes(activeMode) && (
                <div className="h-[240px] relative cad-grid cursor-crosshair flex flex-col justify-between p-4">
                  <svg viewBox="0 0 600 240" className="absolute inset-0 w-full h-full pointer-events-none">
                    <circle cx="300" cy="120" r="80" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="3,3"/>
                    <circle cx="300" cy="120" r="55" fill="none" stroke="#000" strokeWidth="1.5" strokeDasharray="6,4"/>
                    <circle cx="300" cy="120" r="30" fill="none" stroke="#000" strokeWidth="2.5"/>
                    <text x="300" y="123" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">
                      {activeMode === 'irt' ? `${Math.max(12, (38 - Math.abs(mousePos.x - 300) / 10).toFixed(1))}°C` : `${(0.89 - Math.abs(mousePos.x - 300) / 1000).toFixed(2)} μA/cm²`}
                    </text>
                  </svg>
                  <div className="flex justify-between w-full text-[12px] text-gray-600 z-10">
                    <span>{activeMode === 'irt' ? 'SCALE: CELSIUS DELTA' : 'SCALE: CORROSION CURRENT'}</span>
                    <span>CALIBRATION: ACTIVE</span>
                  </div>
                  <div className="absolute pointer-events-none" style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}>
                    <div className="border border-border-default bg-white p-1 text-[12px] space-y-0.5">
                      <div>VAL: {activeMode === 'irt' ? `${Math.max(18, (35 - Math.abs(mousePos.x - 300) / 8).toFixed(1))}°C` : `${Math.max(0.08, (0.89 - Math.abs(mousePos.x - 300) / 800).toFixed(2))} μA/cm²`}</div>
                      <div>COORDS: {mousePos.x}, {mousePos.y}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid / Defect Map (Radiography, GPR, Mag Particle, Dye Penetrant) */}
              {gridModes.includes(activeMode) && (
                <div className="h-[240px] relative bg-white flex flex-col justify-between p-3">
                  <svg viewBox="0 0 600 240" className="absolute inset-0 w-full h-full">
                    <rect x="40" y="30" width="520" height="180" fill="none" stroke="#000" strokeWidth="2"/>
                    {[80,160,240,320,400,480,560].map(vX => <line key={vX} x1={vX} y1="30" x2={vX} y2="210" stroke="#e5e7eb" strokeWidth="1"/>)}
                    {[70,110,150,190].map(vY => <line key={vY} x1="40" y1={vY} x2="560" y2={vY} stroke="#e5e7eb" strokeWidth="1"/>)}
                    {[
                      {x:120, y:80,  label:'P1'},
                      {x:240, y:150, label:'P2'},
                      {x:360, y:100, label:'P3'},
                      {x:420, y:175, label:'P4'},
                      {x:500, y:80,  label:'P5'},
                    ].map(pt => {
                      const isCrit = pt.label === 'P3' || pt.label === 'P5';
                      return (
                        <g key={pt.label} className="cursor-pointer" onClick={() => setSelectedElement({ type: `NDT ${mode.fullLabel} Defect`, id: pt.label, metrics: { TestMethod: mode.fullLabel, Standard: mode.standard, Reading: result.readings[['P1','P2','P3','P4','P5'].indexOf(pt.label)], Verdict: result.verdict, Location: `X:${pt.x} Y:${pt.y}` } })}>
                          <circle cx={pt.x} cy={pt.y} r="10" fill={isCrit ? '#000' : 'none'} stroke="#000" strokeWidth="2"/>
                          <line x1={pt.x-12} y1={pt.y} x2={pt.x+12} y2={pt.y} stroke={isCrit ? '#fff' : '#000'} strokeWidth="1"/>
                          <line x1={pt.x} y1={pt.y-12} x2={pt.x} y2={pt.y+12} stroke={isCrit ? '#fff' : '#000'} strokeWidth="1"/>
                          <text x={pt.x+14} y={pt.y+4} fill="#000" fontSize="8" fontWeight="bold">{pt.label}</text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="z-10 text-right text-[12px] text-gray-500 font-mono">
                    <div>METHOD: {mode.fullLabel.toUpperCase()}</div>
                    <div>STD: {mode.standard}</div>
                  </div>
                </div>
              )}

              {/* Bar Chart / Meter (Rebound, Half Cell, Cover Meter, Impact Echo, Resistivity, Carbonation) */}
              {meterModes.includes(activeMode) && (
                <div className="h-[240px] relative bg-white p-4">
                  <div className="text-[12px] font-bold uppercase text-gray-500 mb-3">{mode.fullLabel} — 5 Point Scan Grid</div>
                  <div className="flex items-end justify-around h-[160px] border-b border-l border-[#d4d4d4]">
                    {result.readings.map((r, i) => {
                      const numVal = parseFloat(r.replace(/[^0-9.-]/g, ''));
                      const maxVal = Math.max(...result.readings.map(rv => Math.abs(parseFloat(rv.replace(/[^0-9.-]/g, '')))));
                      const h = Math.round((Math.abs(numVal) / maxVal) * 130);
                      const isCrit = i === 2 || i === 4;
                      return (
                        <div key={i} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setSelectedElement({ type: `NDT ${mode.fullLabel}`, id: `Point P${i+1}`, metrics: { TestMethod: mode.fullLabel, Standard: mode.standard, Reading: r, ScanPoint: `P${i+1}`, Verdict: isCrit ? result.verdict : 'NOMINAL' } })}>
                          <span className="text-[12px] font-bold text-gray-600">{r}</span>
                          <div style={{ height: `${h}px`, width: '28px' }} className={`${isCrit ? 'bg-black' : 'bg-gray-400'} border border-gray-500`} />
                          <span className="text-[12px] font-bold text-gray-700">P{i+1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Verdict banner */}
            <div className={`p-2 border rounded-sm text-[12px] font-bold uppercase leading-relaxed ${VERDICT_STYLE[result.verdict]}`}>
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              {result.note}
            </div>
          </LevelCard>

          {/* Results Table */}
          <LevelCard icon={BarChart2} title="Scan Point Readings" footerText={`${mode.standard} — all values logged to SSOT audit trail`}>
            <table className="w-full text-[12px]">
              <thead>
                <tr>
                  <th>Point</th><th>Reading</th><th>Threshold</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {result.readings.map((r, i) => {
                  const isCrit = (i === 2 || i === 4) && result.verdict !== 'GOOD';
                  return (
                    <tr key={i}>
                      <td>P{i+1}</td>
                      <td className="font-bold">{r}</td>
                      <td className="text-gray-500">{mode.standard}</td>
                      <td>
                        <span className={`px-1 py-0.5 text-[12px] font-black border rounded-sm uppercase ${isCrit ? 'bg-black text-white border-border-default' : 'border-[#d4d4d4] text-gray-600'}`}>
                          {isCrit ? result.verdict : 'PASS'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </LevelCard>
        </div>
      </div>
      )}
    </div>
  );
}
