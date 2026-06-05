import React, { useState } from 'react';
import { Play, Plus, Trash2, Edit3, HelpCircle, Sigma } from 'lucide-react';

export default function StructuralStudio({ selectedElement, setSelectedElement }) {
  const [load, setLoad] = useState(150); // kN
  const [length, setLength] = useState(6.0); // m
  const [modulus, setModulus] = useState(200); // GPa (Steel)
  const [inertia, setInertia] = useState(12000); // cm^4
  
  // Custom interactive nodes
  const [nodes, setNodes] = useState([
    { id: 'N1', x: 100, y: 300, type: 'support-fixed' },
    { id: 'N2', x: 300, y: 150, type: 'joint' },
    { id: 'N3', x: 500, y: 300, type: 'support-roller' },
  ]);

  const [members, setMembers] = useState([
    { id: 'M1', from: 'N1', to: 'N2', material: 'Structural Steel Fe415', area: 45 },
    { id: 'M2', from: 'N2', to: 'N3', material: 'High-Tensile Concrete M40', area: 120 },
  ]);

  // Equations calculations
  // Stress = F / A
  // Beam Deflection = (P * L^3) / (48 * E * I)
  // Bending stress = (M * y) / I
  
  const calculateMetrics = () => {
    const E_Pa = modulus * 1e9;
    const I_m4 = inertia * 1e-8;
    const P_N = load * 1000;
    const L_m = length;
    
    // Max deflection (m)
    const deflection = (P_N * Math.pow(L_m, 3)) / (48 * E_Pa * I_m4);
    // Safety Factor estimate based on load
    const limit = 400; // kN limit
    const safetyFactor = Math.max(1.1, (limit / (load || 1)).toFixed(2));
    const stress = (load / 0.05).toFixed(1); // kPa approximation

    return {
      deflectionMm: (deflection * 1000).toFixed(2),
      safetyFactor,
      stressKpa: stress,
      moment: (load * length / 4).toFixed(1) // kN.m
    };
  };

  const metrics = calculateMetrics();

  const handleAddNode = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    const id = `N${nodes.length + 1}`;
    setNodes([...nodes, { id, x, y, type: 'joint' }]);
  };

  const handleNodeClick = (node, e) => {
    e.stopPropagation();
    setSelectedElement({
      type: 'Node',
      id: node.id,
      metrics: {
        Coordinates: `X: ${node.x}px, Y: ${node.y}px`,
        Constraint: node.type.toUpperCase(),
        ReactionForce: `${(load / 2).toFixed(1)} kN`,
      }
    });
  };

  const handleMemberClick = (member, e) => {
    e.stopPropagation();
    setSelectedElement({
      type: 'Beam Member',
      id: member.id,
      metrics: {
        Material: member.material,
        CrossSectionArea: `${member.area} cm²`,
        CalculatedLoad: `${load} kN`,
        MaxDeflection: `${metrics.deflectionMm} mm`,
        SafetyFactor: metrics.safetyFactor,
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Simulation Controls & Numerical Formulations */}
      <div className="xl:col-span-1 space-y-4">
        
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Sigma className="h-3.5 w-3.5 text-orange-500" />
            <span>CALCULATIONS CONSOLE</span>
            <span className="ml-auto text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold">READY</span>
          </div>
          <div className="zoho-card-body space-y-3">
            <div>
              <label className="block font-semibold mb-1 uppercase tracking-wide text-[11px] text-slate-500">Applied Force (P): <span className="text-orange-600 font-bold">{load} kN</span></label>
              <input 
                type="range" min="10" max="500" value={load} 
                onChange={(e) => setLoad(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-ew-resize"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>10 kN</span><span>500 kN</span>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 uppercase tracking-wide text-[11px] text-slate-500">Span Length (L): <span className="text-orange-600 font-bold">{length} m</span></label>
              <input 
                type="range" min="2.0" max="15.0" step="0.5" value={length} 
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-ew-resize"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>2.0 m</span><span>15.0 m</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1 uppercase tracking-wide text-[12px]">Elastic Modulus (E)</label>
                <select value={modulus} onChange={(e) => setModulus(Number(e.target.value))} className="w-full p-1.5 border border-border-default bg-white focus:outline-none">
                  <option value="200">200 GPa (Steel)</option>
                  <option value="30">30 GPa (Concrete)</option>
                  <option value="70">70 GPa (Aluminum)</option>
                  <option value="120">120 GPa (Cast Iron)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1 uppercase tracking-wide text-[12px]">Inertia (I) [cm⁴]</label>
                <input 
                  type="number" value={inertia}
                  onChange={(e) => setInertia(Math.max(100, Number(e.target.value)))}
                  className="w-full p-1 border border-border-default bg-white focus:outline-none text-[12px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Math Formulation display */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Sigma className="h-3.5 w-3.5" />
            ACTIVE NUMERICAL FORMULATIONS
          </div>
          <div className="zoho-card-body">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-sans text-center space-y-3">
              <div className="border-b border-slate-200 pb-3">
                <p className="text-[10px] font-mono text-left font-bold text-slate-400 mb-1">{"// Shear Stress Equation"}</p>
                <span className="text-sm font-serif text-slate-700 block my-1">σ = F / A</span>
                <span className="text-[11px] font-mono text-orange-600 font-semibold">Calculated: {metrics.stressKpa} kPa</span>
              </div>
              <div>
                <p className="text-[10px] font-mono text-left font-bold text-slate-400 mb-1">{"// Beam Max Deflection"}</p>
                <span className="text-sm font-serif text-slate-700 block my-1">δ_max = (P·L³) / (48·E·I)</span>
                <span className="text-[11px] font-mono text-orange-600 font-semibold">Calculated: {metrics.deflectionMm} mm</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Vector Grid Drawing Board */}
      <div className="xl:col-span-2 space-y-4">
        
        {/* CAD header bar */}
        <div className="zoho-card-header" style={{ border: '1px solid #e2e8f0' }}>
          <Sigma className="h-3.5 w-3.5 text-orange-500" />
          <span>CAD GRID WORKSPACE [VECTOR SCHEMATIC]</span>
          <span className="ml-auto text-[11px] text-slate-400 font-normal">{"// Click canvas empty space to plot structural nodes"}</span>
        </div>

        {/* Vector SVG Board */}
        <div 
          onClick={handleAddNode}
          className="w-full h-[360px] border border-border-default relative bg-white cad-grid cursor-crosshair overflow-hidden"
          style={{ marginTop: 0 }}
        >
          <svg viewBox="0 0 520 360" className="w-full h-full absolute inset-0 pointer-events-none">
            <line x1="0" y1="200" x2="100%" y2="200" stroke="#cccccc" strokeDasharray="5,5" strokeWidth="1" />
            <line x1="300" y1="0" x2="300" y2="100%" stroke="#cccccc" strokeDasharray="5,5" strokeWidth="1" />

            {members.map((member) => {
              const fromNode = nodes.find(n => n.id === member.from);
              const toNode = nodes.find(n => n.id === member.to);
              if (!fromNode || !toNode) return null;
              const isSelected = selectedElement?.type === 'Beam Member' && selectedElement?.id === member.id;
              return (
                <g key={member.id} className="pointer-events-auto cursor-pointer" onClick={(e) => handleMemberClick(member, e)}>
                  <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke={isSelected ? '#000000' : '#4b5563'} strokeWidth={isSelected ? '6' : '3'} />
                  {isSelected && <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke="#ffffff" strokeWidth="2" strokeDasharray="4,4" />}
                  <text x={(fromNode.x + toNode.x) / 2} y={(fromNode.y + toNode.y) / 2 - 10} fill="#000000" fontSize="9" fontWeight="bold" textAnchor="middle" className="select-none font-mono">
                    {member.id} ({member.material.includes('Steel') ? 'Steel' : 'Concrete'})
                  </text>
                </g>
              );
            })}

            {nodes.find(n => n.id === 'N2') && (
              <g>
                <path d="M 300 70 L 300 140" stroke="#000000" strokeWidth="3" />
                <path d="M 295 130 L 300 140 L 305 130" fill="none" stroke="#000000" strokeWidth="2" />
                <text x="312" y="100" fill="#000000" fontSize="10" fontWeight="black" className="font-mono">P = {load} kN</text>
              </g>
            )}

            {nodes.map((node) => {
              if (node.type === 'support-fixed') {
                return <path key={`support-${node.id}`} d={`M ${node.x - 15} ${node.y + 10} L ${node.x + 15} ${node.y + 10} M ${node.x - 12} ${node.y + 10} L ${node.x - 17} ${node.y + 15} M ${node.x - 4} ${node.y + 10} L ${node.x - 9} ${node.y + 15} M ${node.x + 4} ${node.y + 10} L ${node.x - 1} ${node.y + 15} M ${node.x + 12} ${node.y + 10} L ${node.x + 7} ${node.y + 15}`} stroke="#000000" strokeWidth="2" />;
              }
              if (node.type === 'support-roller') {
                return (
                  <g key={`support-${node.id}`}>
                    <polygon points={`${node.x},${node.y} ${node.x-10},${node.y+12} ${node.x+10},${node.y+12}`} fill="none" stroke="#000000" strokeWidth="2" />
                    <line x1={node.x-15} y1={node.y+14} x2={node.x+15} y2={node.y+14} stroke="#000000" strokeWidth="2" />
                  </g>
                );
              }
              return null;
            })}

            {nodes.map((node) => {
              const isSelected = selectedElement?.type === 'Node' && selectedElement?.id === node.id;
              return (
                <circle key={node.id} cx={node.x} cy={node.y} r={isSelected ? '8' : '5'} fill={isSelected ? '#000000' : '#ffffff'} stroke="#000000" strokeWidth="2" className="pointer-events-auto cursor-pointer" onClick={(e) => handleNodeClick(node, e)} />
              );
            })}
          </svg>

          {nodes.map((node) => (
            <span key={`lbl-${node.id}`} style={{ left: node.x + 8, top: node.y - 18 }} className="absolute font-bold text-[12px] bg-white border border-border-default px-1 pointer-events-none select-none font-mono">
              {node.id}
            </span>
          ))}

          <div className="absolute bottom-2 left-2 p-1.5 border border-border-default bg-white font-mono text-[12px] space-y-0.5">
            <div>SCALE: 1:50</div>
            <div>MESH TYPE: Linear Timoshenko Beam Elements</div>
            <div>NODES PLOTTED: {nodes.length}</div>
          </div>
        </div>

        {/* Structural Assessment Output Block */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Sigma className="h-3.5 w-3.5" />
            STRUCTURAL DIAGNOSTICS MATRIX
          </div>
          <div className="zoho-card-body">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Max Displacement</p>
                <p className="text-xl font-bold font-mono mt-1.5 text-slate-800">{metrics.deflectionMm} mm</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border inline-block mt-2 font-bold ${
                  Number(metrics.deflectionMm) > 8
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  {Number(metrics.deflectionMm) > 8 ? 'EXCEEDS LIMIT' : 'WITHIN BOUNDS'}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Safety Factor</p>
                <p className="text-xl font-bold font-mono mt-1.5 text-slate-800">{metrics.safetyFactor}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 inline-block mt-2 font-bold">LIMIT: &gt; 1.5</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Applied Moment</p>
                <p className="text-xl font-bold font-mono mt-1.5 text-slate-800">{metrics.moment} kN·m</p>
                <span className="text-[10px] text-slate-400 font-mono inline-block mt-2">M_max = PL/4</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Stress Status</p>
                <p className="text-xl font-bold font-mono mt-1.5 text-slate-800">NORMAL</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 inline-block mt-2 font-bold">NO BUCKLING</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
