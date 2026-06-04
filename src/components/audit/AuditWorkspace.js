import React, { useState, useRef, useEffect } from 'react';
import { 
  ClipboardCheck, 
  PenTool, 
  Trash2, 
  ShieldCheck, 
  Award, 
  FileText,
  Camera,
  Activity,
  Plus
} from 'lucide-react';
import { useCRMStore } from '@/store/crmStore';

export default function AuditWorkspace() {
  const addTicket = useCRMStore(state => state.addTicket);

  const [currentScore, setCurrentScore] = useState(88); // Structural safety percentage
  const [selectedAuditType, setSelectedAuditType] = useState('Structural Assessment');
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Inspect Pier joints for galvanic concrete corrosion layers', checked: true },
    { id: 2, label: 'Measure concrete crack depth with Rebound Hammer NDT', checked: true },
    { id: 3, label: 'Map Pillar vibration amplitude levels matching local WGS-84 standard', checked: false },
    { id: 4, label: 'Inspect safety protective gear of site personnel', checked: true },
    { id: 5, label: 'Record high-voltage core bearing thermal sensors registers', checked: false }
  ]);
  const [isExporting, setIsExporting] = useState(false);
  
  // Sketch defect canvas state references
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ff4d6d'); // Neon pink/red defect highlighting
  const [brushSize, setBrushSize] = useState(3);

  // Initialize concrete texture in the background of drawing board
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Draw procedural gray concrete block grid
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }

    // Add visual structural guidelines
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const handleToggleCheck = (id) => {
    const updated = checklist.map(c => c.id === id ? { ...c, checked: !c.checked } : c);
    setChecklist(updated);

    // Auto update safety compliance score
    const checkedCount = updated.filter(c => c.checked).length;
    setCurrentScore(Math.round((checkedCount / updated.length) * 100));
  };

  // Drawing mouse handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const bounds = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - bounds.left,
      e.clientY - bounds.top
    );
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const bounds = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(
      e.clientX - bounds.left,
      e.clientY - bounds.top
    );
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw grids again
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }
  };

  // Log crack defect automatically to the CRM Tickets system
  const handleAutoLogCrackDefect = () => {
    addTicket({
      accountId: 'acc-1',
      title: `Concrete Structural Crack Defect logged via Canvas HUD Annotation`,
      severity: 'HIGH',
      assetName: 'Mumbai Bandra-Worli Sea Link [Pier Segment]',
      confidence: 94.2
    });
  };

  // Simulate PDF Report export logs
  const triggerPDFExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("SUCCESS // Ouantum Report Studio: Structural Compliance PDF report generated, signed, and cascading audit trails to parent Accounts!");
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Left Column: Checklist & Scoring metrics */}
      <div className="glass-panel rounded-xl border border-electric-blue/15 bg-secondary-bg/60 p-4 flex flex-col justify-between min-h-[460px]">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-electric-blue flex items-center gap-1.5 border-b border-white/5 pb-2 mb-4">
            <ClipboardCheck className="h-4 w-4" /> Compliance Audit Worksheets
          </h3>
          
          {/* Audit Type Picker dropdown */}
          <div className="mb-4">
            <label className="block text-metallic-gray font-mono text-[12px] uppercase mb-1">SELECT AUDIT PROTOCOL</label>
            <select
              value={selectedAuditType}
              onChange={(e) => setSelectedAuditType(e.target.value)}
              className="w-full h-9 px-3 rounded bg-black/40 border border-white/10 text-white-text focus:outline-none focus:border-electric-blue transition-colors font-mono text-xs"
            >
              {['Structural Assessment', 'Environmental Impact Study', 'Non-Destructive Concrete Testing', 'Safety Compliance Audit'].map(type => (
                <option key={type} value={type} className="bg-secondary-bg text-white-text">{type}</option>
              ))}
            </select>
          </div>

          {/* Audit NDT checklists */}
          <div className="space-y-3 font-mono text-xs mb-4">
            {checklist.map((item) => (
              <label 
                key={item.id}
                className="flex items-start gap-2.5 p-2 rounded bg-black/30 border border-white/5 hover:border-electric-blue/20 cursor-pointer transition-colors"
              >
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  onChange={() => handleToggleCheck(item.id)}
                  className="mt-0.5 rounded border-white/15 bg-transparent text-electric-blue accent-electric-blue focus:ring-0 focus:outline-none"
                />
                <span className={item.checked ? 'text-metallic-gray line-through' : 'text-white-text'}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic Compliance Rating Index meter */}
        <div className="space-y-3 border-t border-white/5 pt-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-metallic-gray">COMPLIANCE SAFETY RATING:</span>
            <span className={`font-bold ${currentScore >= 80 ? 'text-success-green' : 'text-alert-orange'}`}>
              {currentScore}%
            </span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={triggerPDFExport}
              disabled={isExporting}
              className="flex-1 h-10 bg-electric-blue/15 hover:bg-electric-blue/25 text-electric-blue border border-electric-blue/35 rounded font-bold font-mono text-xs uppercase flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="h-4 w-4" /> {isExporting ? 'COMPILING REPORT...' : 'EXPORT INTEL PDF'}
            </button>
          </div>
        </div>

      </div>

      {/* 2. Middle/Right Columns: Visual Defect Annotation Board Canvas */}
      <div className="lg:col-span-2 glass-panel rounded-xl border border-electric-blue/15 bg-secondary-bg/60 p-4 flex flex-col justify-between min-h-[460px]">
        <div>
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-electric-blue flex items-center gap-1.5">
              <PenTool className="h-4 w-4" /> Interactive NDT Concrete Defect Deflection Mapping Board
            </h3>
            <span className="text-[12px] font-mono text-metallic-gray">{"// PIER ANOMALY ANNOTATOR"}</span>
          </div>

          <p className="text-[12px] text-metallic-gray font-mono mb-3">
            Auditors can interact directly with the concrete panel blueprint below. Drag/draw on the slab to annotate cracks, micro-deflection paths, or concrete spelling anomalies.
          </p>

          {/* Interactive Annotation Canvas */}
          <div className="relative border border-white/10 rounded-lg overflow-hidden flex items-center justify-center bg-slate-950">
            <canvas
              ref={canvasRef}
              width="500"
              height="250"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair max-w-full"
            />
          </div>
        </div>

        {/* Drawing Controls overlay */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs border-t border-white/5 pt-3">
          
          {/* Defect severity brush colors */}
          <div className="flex items-center gap-3">
            <span className="text-metallic-gray text-[12px] uppercase">SEVERITY HIGHLIGHT:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setBrushColor('#ff4d6d')} // Critical defect color
                className={`w-5 h-5 rounded-full border bg-[#ff4d6d] ${brushColor === '#ff4d6d' ? 'ring-2 ring-electric-blue' : ''}`}
              />
              <button 
                onClick={() => setBrushColor('#ff9f43')} // Warning defect color
                className={`w-5 h-5 rounded-full border bg-[#ff9f43] ${brushColor === '#ff9f43' ? 'ring-2 ring-electric-blue' : ''}`}
              />
              <button 
                onClick={() => setBrushColor('#00ffb2')} // Normal inspection indicator
                className={`w-5 h-5 rounded-full border bg-[#00ffb2] ${brushColor === '#00ffb2' ? 'ring-2 ring-electric-blue' : ''}`}
              />
            </div>
          </div>

          {/* Clean / Log Actions */}
          <div className="flex gap-2">
            <button 
              onClick={handleAutoLogCrackDefect}
              className="px-3.5 py-2 bg-danger-red/15 hover:bg-danger-red/35 text-danger-red border border-danger-red/35 rounded font-bold text-[12px] uppercase flex items-center gap-1 transition-colors neon-glow-red"
            >
              <Camera className="h-3.5 w-3.5" /> Auto-log Anomaly
            </button>
            <button 
              onClick={clearCanvas}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-metallic-gray hover:text-white-text transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear Sketch
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
