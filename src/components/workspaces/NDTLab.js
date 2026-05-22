import React, { useState, useRef, useEffect } from 'react';
import { Eye, ShieldAlert, Cpu, ZoomIn, Activity, Layers } from 'lucide-react';

export default function NDTLab({ selectedElement, setSelectedElement }) {
  const [activeMode, setActiveMode] = useState('ultrasonic'); // ultrasonic, thermal, radiography
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 150, y: 120 });
  const [defects, setDefects] = useState([
    { id: 'DF-01', x: 120, y: 90, type: 'Micro-void Honeycomb', depth: '12cm', severity: 'HIGH' },
    { id: 'DF-02', x: 280, y: 160, type: 'Internal Structural Shear Crack', depth: '4.5cm', severity: 'CRITICAL' },
    { id: 'DF-03', x: 420, y: 100, type: 'Weld Density Slag Inclusion', depth: '8.2cm', severity: 'LOW' }
  ]);

  const canvasRef = useRef(null);

  // Simulated Ultrasonic Oscilloscope wave drawing
  useEffect(() => {
    if (activeMode !== 'ultrasonic') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let offset = 0;
    
    const drawOscilloscope = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Grid lines background
      ctx.strokeStyle = '#e5e7eb';
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
      
      // Zero-level line
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Plot signal wave
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Calculate proximity to simulated defect DF-02 (x=280)
      const distToDefect = Math.abs(mousePos.x - 280);
      const intensity = Math.max(0.1, 4 - distToDefect / 60); // Spikes wave when close

      for (let x = 0; x < canvas.width; x++) {
        // Base sine wave + spike anomaly
        const baseFreq = 0.05;
        const phase = offset;
        let y = Math.sin(x * baseFreq + phase) * 20;

        // Add high frequency crack anomaly reflection
        if (x > 220 && x < 340) {
          const anomalySpike = Math.sin(x * 0.4) * (15 * intensity);
          y += anomalySpike;
        }

        if (x === 0) {
          ctx.moveTo(x, canvas.height / 2 + y);
        } else {
          ctx.lineTo(x, canvas.height / 2 + y);
        }
      }
      
      ctx.stroke();
      offset += 0.15;
      animationId = requestAnimationFrame(drawOscilloscope);
    };

    drawOscilloscope();
    return () => cancelAnimationFrame(animationId);
  }, [activeMode, mousePos]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setMousePos({ x, y });
  };

  const handleDefectSelect = (defect) => {
    setSelectedElement({
      type: 'NDT Structural Defect',
      id: defect.id,
      metrics: {
        DefectClassification: defect.type,
        VoidEmbedmentDepth: defect.depth,
        LocalizedSeverityIndex: defect.severity,
        CoordinateScanPoints: `X: ${defect.x}px, Y: ${defect.y}px`
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Sidebar Controls */}
      <div className="xl:col-span-1 space-y-6">
        
        <div className="border-2 border-black p-4 bg-white space-y-4">
          <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">Non-Destructive Testing Console</p>
          
          <div className="space-y-2">
            <button
              onClick={() => setActiveMode('ultrasonic')}
              className={`w-full text-left p-3 border-2 transition-colors ${
                activeMode === 'ultrasonic' ? 'bg-black text-white border-black font-bold' : 'bg-white border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>1. ULTRASONIC SCANNING (UT)</span>
                <Activity className="h-4.5 w-4.5" />
              </div>
              <p className={`text-[9px] mt-1 ${activeMode === 'ultrasonic' ? 'text-gray-300' : 'text-gray-500'}`}>
                Thickness & micro-crack propagation mapping via pulse velocity waves.
              </p>
            </button>

            <button
              onClick={() => setActiveMode('thermal')}
              className={`w-full text-left p-3 border-2 transition-colors ${
                activeMode === 'thermal' ? 'bg-black text-white border-black font-bold' : 'bg-white border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>2. THERMAL IMAGING (IRT)</span>
                <Layers className="h-4.5 w-4.5" />
              </div>
              <p className={`text-[9px] mt-1 ${activeMode === 'thermal' ? 'text-gray-300' : 'text-gray-500'}`}>
                Identifies deep concrete delaminations, moisture pockets, and structural voids.
              </p>
            </button>

            <button
              onClick={() => setActiveMode('radiography')}
              className={`w-full text-left p-3 border-2 transition-colors ${
                activeMode === 'radiography' ? 'bg-black text-white border-black font-bold' : 'bg-white border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>3. RADIOGRAPHIC X-RAY (RT)</span>
                <Eye className="h-4.5 w-4.5" />
              </div>
              <p className={`text-[9px] mt-1 ${activeMode === 'radiography' ? 'text-gray-300' : 'text-gray-500'}`}>
                Radiographic dense scans. Evaluates weld inclusions, internal rebar configurations.
              </p>
            </button>
          </div>
        </div>

        {/* Scan Status HUD */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">Real-Time Scanner Telemetry</p>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span>SCAN PROBE POSITION:</span>
              <span className="font-bold">X:{mousePos.x}px Y:{mousePos.y}px</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span>PULSE EMISSION RATE:</span>
              <span>4.2 MHz</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span>REFLECTIVE GAIN:</span>
              <span>32.5 dB</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span>SIGNAL CONVERGENCE:</span>
              <span className="font-bold">98.4%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Viewport & Active Scan Canvas */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Dynamic Canvas Container */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              {activeMode === 'ultrasonic' && 'UT OSCILLOSCOPE TIME-OF-FLIGHT GRAPH'}
              {activeMode === 'thermal' && 'THERMAL CORE INFRARED MATRIX'}
              {activeMode === 'radiography' && 'RADIOGRAPHY DEEP CONCRETE INTERNAL SCAN'}
            </span>
            <span className="text-[9px] text-gray-500">Hover mouse inside scanner below</span>
          </div>

          {/* Interactive Screen */}
          <div 
            onMouseMove={handleMouseMove}
            className="w-full relative border border-black overflow-hidden bg-white select-none"
          >
            {activeMode === 'ultrasonic' && (
              <div className="h-[250px] relative">
                <canvas 
                  ref={canvasRef} 
                  width={550} 
                  height={250} 
                  className="w-full h-full block"
                />
                {/* Simulated Probe overlay */}
                <div 
                  className="absolute pointer-events-none border border-black px-1.5 py-0.5 bg-white font-bold text-[8px]"
                  style={{ left: mousePos.x + 8, top: mousePos.y - 12 }}
                >
                  UT-PROBE
                </div>
              </div>
            )}

            {activeMode === 'thermal' && (
              <div className="h-[250px] relative cad-grid cursor-crosshair flex flex-col justify-between p-4">
                {/* Generate simulated thermal hotspot representation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Draw a simulated circular thermal anomaly using concentric circles with monochrome dashes */}
                  <circle cx="280" cy="130" r="70" fill="none" stroke="#000000" strokeWidth="1" strokeDasharray="3,3" />
                  <circle cx="280" cy="130" r="50" fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="6,4" />
                  <circle cx="280" cy="130" r="30" fill="none" stroke="#000000" strokeWidth="2.5" />
                  <text x="280" y="130" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="bold" dy="3">
                    HOTSPOT {Math.max(12, (38 - Math.abs(mousePos.x - 280) / 10).toFixed(1))}°C
                  </text>
                </svg>

                {/* Simulated thermographic display watermark */}
                <div className="flex justify-between w-full font-mono text-[8px] text-gray-600 z-10">
                  <span>SCALE: CELSIUS DELTA</span>
                  <span>CALIBRATION: ACTIVE SHUTTER</span>
                </div>
                
                <div className="absolute pointer-events-none" style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}>
                  <div className="border border-black bg-white p-1 text-[8px] space-y-0.5">
                    <div>TEMP: {Math.max(18.2, (35.4 - Math.abs(mousePos.x - 280) / 8).toFixed(1))}°C</div>
                    <div>COORDS: {mousePos.x}, {mousePos.y}</div>
                  </div>
                </div>
              </div>
            )}

            {activeMode === 'radiography' && (
              <div className="h-[250px] relative bg-white flex flex-col justify-between p-3">
                {/* Structural schematic vector with rebar grid */}
                <svg className="absolute inset-0 w-full h-full">
                  {/* Base pillar outline */}
                  <rect x="50" y="40" width="450" height="170" fill="none" stroke="#000000" strokeWidth="3" />
                  
                  {/* Rebar lines - horizontal and vertical */}
                  <line x1="50" y1="80" x2="500" y2="80" stroke="#9ca3af" strokeWidth="1.5" />
                  <line x1="50" y1="120" x2="500" y2="120" stroke="#9ca3af" strokeWidth="1.5" />
                  <line x1="50" y1="160" x2="500" y2="160" stroke="#9ca3af" strokeWidth="1.5" />

                  {/* Vertical rebars */}
                  {[100, 160, 220, 280, 340, 400, 460].map(vX => (
                    <line key={vX} x1={vX} y1="40" x2={vX} y2="210" stroke="#9ca3af" strokeWidth="1.5" />
                  ))}

                  {/* Draw Interactive Defect Points */}
                  {defects.map((def) => {
                    const isSelected = selectedElement?.id === def.id;
                    return (
                      <g key={def.id} className="cursor-pointer" onClick={() => handleDefectSelect(def)}>
                        {/* Hashed pattern circle represent void */}
                        <circle 
                          cx={def.x} 
                          cy={def.y} 
                          r={isSelected ? '14' : '10'} 
                          fill="none" 
                          stroke="#000000" 
                          strokeWidth="2" 
                        />
                        {/* Dot in center */}
                        <circle cx={def.x} cy={def.y} r="2.5" fill="#000000" />
                        <line x1={def.x - 12} y1={def.y} x2={def.x + 12} y2={def.y} stroke="#000000" strokeWidth="1" />
                        <line x1={def.x} y1={def.y - 12} x2={def.x} y2={def.y + 12} stroke="#000000" strokeWidth="1" />
                        <text x={def.x + 15} y={def.y + 4} fill="#000000" fontSize="8" fontWeight="black" className="font-mono bg-white">
                          {def.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="z-10 w-full text-right font-mono text-[8px] text-gray-500">
                  <div>VOLTAGE: 220kV X-RAY TUBE</div>
                  <div>FILTER: 2.0mm COPPER</div>
                </div>

                <div className="z-10 p-1 border border-black bg-white font-mono text-[9px] w-fit">
                  Select defect nodes (DF-01, DF-02, DF-03) to run compliance evaluations
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Defect Compliance Review Card */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">NDT Assessment Output Log</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border border-black bg-gray-50 space-y-1">
              <p className="text-gray-500 text-[9px] uppercase">Weld Joint Integrities</p>
              <p className="text-sm font-bold">92.4% NOMINAL</p>
              <p className="text-[8px] text-gray-400">Class II radiograph certification</p>
            </div>

            <div className="p-3 border border-black bg-gray-50 space-y-1">
              <p className="text-gray-500 text-[9px] uppercase">Internal Cavitations</p>
              <p className="text-sm font-bold">0.42% VOID RATE</p>
              <p className="text-[8px] text-gray-400">Exceeds standard 0.2% concrete design margin</p>
            </div>

            <div className="p-3 border border-black bg-gray-50 space-y-1">
              <p className="text-gray-500 text-[9px] uppercase">Compliance Action</p>
              <p className="text-sm font-bold uppercase underline">DRILL CORE INJECT</p>
              <p className="text-[8px] text-gray-400">Recommended structural remedial treatment</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
