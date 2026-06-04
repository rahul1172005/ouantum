'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Eye, Camera, AlertTriangle, CheckCircle, Upload, Cpu, FileText, Zap } from 'lucide-react';

function LevelCard({ icon: Icon, title, children, footerText = null, headerAction = null }) {
  return (
    <div className="zoho-card flex flex-col">
      <div className="zoho-card-header">
        {Icon && <Icon className="h-4 w-4 text-gray-700 flex-shrink-0" />}
        <span className="font-bold text-gray-800 text-[12px] uppercase tracking-wide">{title}</span>
        {headerAction && <div className="ml-auto flex-shrink-0">{headerAction}</div>}
      </div>
      <div className="zoho-card-body space-y-3 flex-1">{children}</div>
      {footerText && (
        <div className="zoho-card-footer">
          <span className="text-gray-500 font-semibold text-[12px] uppercase">{footerText}</span>
        </div>
      )}
    </div>
  );
}

const DEFECT_TYPES = [
  { id: 'crack',       label: 'Cracks',              color: '#ef4444', desc: 'Hairline to structural cracks detected via edge detection' },
  { id: 'honeycomb',   label: 'Honeycombing',         color: '#f97316', desc: 'Porous voids in concrete from poor compaction' },
  { id: 'spalling',    label: 'Spalling',             color: '#f59e0b', desc: 'Concrete surface flaking and breakage' },
  { id: 'corrosion',   label: 'Corrosion',            color: '#8b5cf6', desc: 'Rebar rust staining and surface oxidation' },
  { id: 'leakage',     label: 'Water Leakage',        color: '#3b82f6', desc: 'Seepage, efflorescence and moisture ingress' },
  { id: 'surface',     label: 'Surface Defects',      color: '#6b7280', desc: 'Scaling, crazing, pop-outs and bug holes' },
  { id: 'rebar',       label: 'Rebar Exposure',       color: '#dc2626', desc: 'Uncovered reinforcement bars' },
];

const SIMULATED_DETECTIONS = [
  { id: 'D001', type: 'crack',     confidence: 96.4, location: 'Zone A — Column C4', severity: 'CRITICAL', width: '2.4mm', length: '380mm', action: 'Epoxy injection grouting + structural monitoring' },
  { id: 'D002', type: 'spalling',  confidence: 89.2, location: 'Zone B — Slab S2', severity: 'HIGH',     area: '0.8 m²',                   action: 'Patch repair with polymer-modified mortar' },
  { id: 'D003', type: 'honeycomb', confidence: 94.1, location: 'Zone A — Beam B1', severity: 'HIGH',     depth: '65mm',                    action: 'Drill, clean and grout injection required' },
  { id: 'D004', type: 'corrosion', confidence: 91.8, location: 'Zone C — Rebar R7', severity: 'MEDIUM',  coverage: '18%',                  action: 'Chloride extraction + cathodic protection' },
  { id: 'D005', type: 'leakage',   confidence: 87.3, location: 'Zone B — Wall W3', severity: 'MEDIUM',  flow: '0.4 L/hr',                 action: 'Hydrophobic crystalline waterproofing coating' },
  { id: 'D006', type: 'rebar',     confidence: 99.1, location: 'Zone C — Pier P2', severity: 'CRITICAL', length: '120mm',                  action: 'Immediate cover restoration — IS 456 clause 26.4' },
];

const SOURCE_TYPES = ['Drone Images', 'CCTV Feed', 'Site Photos', 'Thermal Cam'];

export default function DefectDetection({ selectedElement, setSelectedElement }) {
  const [activeSource, setActiveSource] = useState('Drone Images');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzed, setAnalyzed] = useState(true);
  const canvasRef = useRef(null);

  // Draw simulated vision scan on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Background grid (concrete texture sim)
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for (let j = 0; j < canvas.height; j += 30) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }

    if (!analyzed) return;

    // Draw detection bounding boxes
    const boxes = [
      { x: 40, y: 50, w: 120, h: 30, color: '#ef4444', label: 'CRACK D001 96.4%' },
      { x: 230, y: 90, w: 100, h: 80, color: '#f59e0b', label: 'SPALLING D002 89.2%' },
      { x: 80, y: 160, w: 90, h: 60, color: '#f97316', label: 'HONEYCOMB D003 94.1%' },
      { x: 360, y: 50, w: 80, h: 70, color: '#8b5cf6', label: 'CORROSION D004 91.8%' },
      { x: 310, y: 160, w: 100, h: 50, color: '#3b82f6', label: 'LEAKAGE D005 87.3%' },
      { x: 460, y: 130, w: 70, h: 90, color: '#dc2626', label: 'REBAR D006 99.1%' },
    ];

    boxes.forEach(b => {
      ctx.strokeStyle = b.color; ctx.lineWidth = 2.5;
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y - 14, ctx.measureText(b.label).width + 8, 14);
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 8px Courier New';
      ctx.fillText(b.label, b.x + 4, b.y - 3);
    });
  }, [analyzed, activeSource]);

  const runAnalysis = () => {
    setIsAnalyzing(true); setAnalyzed(false); setProgress(0);
    let p = 0;
    const iv = setInterval(() => { p += 8; setProgress(p); if (p >= 100) { clearInterval(iv); setIsAnalyzing(false); setAnalyzed(true); } }, 150);
  };

  const filtered = activeFilter === 'all' ? SIMULATED_DETECTIONS : SIMULATED_DETECTIONS.filter(d => d.type === activeFilter);
  const criticalCount = SIMULATED_DETECTIONS.filter(d => d.severity === 'CRITICAL').length;

  return (
    <div className="space-y-4 font-mono text-xs text-black">

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Detections', value: SIMULATED_DETECTIONS.length, sub: 'AI identified' },
          { label: 'Critical Defects', value: criticalCount, sub: 'Immediate action' },
          { label: 'Avg Confidence', value: `${(SIMULATED_DETECTIONS.reduce((s,d) => s + d.confidence, 0) / SIMULATED_DETECTIONS.length).toFixed(1)}%`, sub: 'Vision model accuracy' },
          { label: 'Defect Types', value: DEFECT_TYPES.length, sub: 'Classes monitored' },
        ].map(kpi => (
          <div key={kpi.label} className="zoho-kpi-card flex-col items-start">
            <p className="zoho-kpi-label">{kpi.label}</p>
            <p className="zoho-kpi-value">{kpi.value}</p>
            <span className="zoho-kpi-badge">{kpi.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Left Controls */}
        <div className="xl:col-span-1 space-y-4">
          <LevelCard icon={Camera} title="Image Source" footerText="AI processes drone, CCTV and site images">
            <div className="space-y-1.5">
              {SOURCE_TYPES.map(s => (
                <button key={s} onClick={() => setActiveSource(s)}
                  className={`w-full text-left p-2 border text-[12px] font-bold uppercase rounded-[8px]-[8px] transition-colors ${activeSource === s ? 'bg-black text-white border-border-default' : 'bg-white border-[#d4d4d4] hover:bg-gray-50'}`}>
                  {s}
                </button>
              ))}
            </div>
          </LevelCard>

          <LevelCard icon={Eye} title="Defect Class Filter" footerText="Filter by defect category">
            <div className="space-y-1">
              <button onClick={() => setActiveFilter('all')} className={`w-full text-left p-1.5 border text-[12px] font-bold uppercase rounded-[8px]-[8px] ${activeFilter === 'all' ? 'bg-black text-white border-border-default' : 'bg-white border-[#d4d4d4]'}`}>
                All Classes ({SIMULATED_DETECTIONS.length})
              </button>
              {DEFECT_TYPES.map(d => (
                <button key={d.id} onClick={() => setActiveFilter(d.id)}
                  className={`w-full text-left p-1.5 border text-[12px] font-bold rounded-[8px]-[8px] flex items-center gap-1.5 ${activeFilter === d.id ? 'bg-black text-white border-border-default' : 'bg-white border-[#d4d4d4]'}`}>
                  <span style={{ width: 8, height: 8, background: d.color, display: 'inline-block', flexShrink: 0, borderRadius: 1 }} />
                  {d.label} ({SIMULATED_DETECTIONS.filter(x => x.type === d.id).length})
                </button>
              ))}
            </div>
          </LevelCard>
        </div>

        {/* Right — Vision Canvas + Detections */}
        <div className="xl:col-span-2 space-y-4">
          <LevelCard icon={Cpu} title="AI Vision Scan Viewport" footerText={`Source: ${activeSource} — Computer Vision Defect Detection`}
            headerAction={
              <button onClick={runAnalysis} disabled={isAnalyzing}
                className="btn-skeuo-dark text-[12px] uppercase tracking-wider px-3 py-1">
                {isAnalyzing ? `Analyzing ${progress}%` : 'Run AI Analysis'}
              </button>
            }>
            {isAnalyzing && (
              <div className="w-full h-1.5 bg-gray-100 border border-[#d4d4d4] rounded-[8px] overflow-hidden mb-2">
                <div style={{ width: `${progress}%` }} className="h-full bg-black transition-all animate-pulse" />
              </div>
            )}
            <canvas ref={canvasRef} width={580} height={260} className="w-full border border-[#d4d4d4] rounded-[8px]-[8px] block" />
            {!analyzed && !isAnalyzing && <p className="text-[12px] text-gray-400 text-center">{'Click "Run AI Analysis" to detect defects'}</p>}
          </LevelCard>

          <LevelCard icon={AlertTriangle} title="Detection Log" footerText="All defects logged to SSOT — NCR auto-generated on Critical">
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {filtered.map(d => {
                const defType = DEFECT_TYPES.find(t => t.id === d.type);
                return (
                  <div key={d.id} className="p-2 border border-[#d4d4d4] bg-white rounded-[8px]-[8px] cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedElement({ type: `AI Defect Detection — ${defType?.label}`, id: d.id, metrics: { Type: defType?.label, Location: d.location, Confidence: `${d.confidence}%`, Severity: d.severity, ...(d.width ? { Width: d.width, Length: d.length } : {}), ...(d.area ? { Area: d.area } : {}), ...(d.depth ? { Depth: d.depth } : {}), Action: d.action } })}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <span style={{ width: 8, height: 8, background: defType?.color, display: 'inline-block', borderRadius: 1 }} />
                        <span className="font-black text-[12px] uppercase">{d.id} — {defType?.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] text-gray-500">{d.confidence}% conf.</span>
                        <span className={`text-[12px] px-1.5 py-0.5 border rounded-[8px]-[8px] font-black uppercase ${d.severity === 'CRITICAL' ? 'bg-black text-white border-border-default animate-pulse' : d.severity === 'HIGH' ? 'bg-gray-700 text-white border-gray-700' : 'border-[#d4d4d4] text-gray-700'}`}>{d.severity}</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-gray-600 uppercase">{d.location}</p>
                    <p className="text-[12px] text-gray-400 mt-0.5 uppercase">{d.action}</p>
                  </div>
                );
              })}
            </div>
          </LevelCard>
        </div>
      </div>
    </div>
  );
}
