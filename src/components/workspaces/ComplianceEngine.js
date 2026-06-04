'use client';
import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle, BookOpen, Cpu, BarChart2 } from 'lucide-react';

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

const STANDARDS = [
  {
    id: 'IS456',  code: 'IS 456:2000',  name: 'Plain & Reinforced Concrete', org: 'BIS',
    clauses: [
      { cl: '26.4', title: 'Nominal Cover to Reinforcement', status: 'COMPLIANT',    finding: 'Cover 42mm — exceeds minimum 40mm (moderate exposure)' },
      { cl: '8.2',  title: 'Workability of Concrete',       status: 'COMPLIANT',    finding: 'Slump 95mm — within 80–120mm range for columns' },
      { cl: '15.2', title: 'Frequency of Sampling',         status: 'NON_COMPLIANT', finding: 'Only 4 cubes taken per pour — IS 456 requires 6 per 50m³' },
      { cl: '26.5', title: 'Minimum Steel Requirements',     status: 'COMPLIANT',    finding: 'Steel ratio 1.2% — within 0.8–4% IS 456 limits' },
    ]
  },
  {
    id: 'ACI318', code: 'ACI 318-19', name: 'Building Code for Structural Concrete', org: 'ACI',
    clauses: [
      { cl: '§18.7', title: 'Seismic Confinement',           status: 'COMPLIANT',    finding: 'Tie spacing 100mm — satisfies SDC D requirements' },
      { cl: '§10.7', title: 'Slenderness Limits',            status: 'COMPLIANT',    finding: 'Column slenderness ratio 22 — below critical 40' },
      { cl: '§21.2', title: 'Fire Resistance Rating',        status: 'NON_COMPLIANT', finding: 'Cover 38mm — ACI requires minimum 40mm for 2hr fire rating' },
      { cl: '§25.5', title: 'Lap Splice Length',             status: 'NON_COMPLIANT', finding: 'Lap 380mm provided, 480mm required for M30 + fy 500' },
    ]
  },
  {
    id: 'ASTM',   code: 'ASTM C39',   name: 'Compressive Strength of Cylinders', org: 'ASTM',
    clauses: [
      { cl: '9.1',  title: 'Age at Test',                   status: 'COMPLIANT',    finding: '28-day test conducted per schedule' },
      { cl: '7.3',  title: 'Specimen Diameter Tolerance',   status: 'COMPLIANT',    finding: 'Cylinder diameter 150mm ± 2mm within tolerance' },
      { cl: '8.5',  title: 'Loading Rate',                  status: 'COMPLIANT',    finding: '0.25 MPa/s — within 0.15–0.35 MPa/s requirement' },
    ]
  },
  {
    id: 'IS13311', code: 'IS 13311-1', name: 'Ultrasonic Pulse Velocity', org: 'BIS',
    clauses: [
      { cl: '4.1',  title: 'Transducer Frequency',         status: 'COMPLIANT',    finding: '54 kHz transducers used — compliant' },
      { cl: '5.3',  title: 'Pulse Velocity Interpretation', status: 'COMPLIANT',    finding: '4320 m/s — Excellent (>4000 m/s threshold)' },
      { cl: '6.2',  title: 'Test Grid Spacing',             status: 'NON_COMPLIANT', finding: 'Grid spacing 350mm — standard requires ≤300mm for slabs' },
    ]
  },
  {
    id: 'IRC',    code: 'IRC 112:2020', name: 'Concrete Road Bridges', org: 'IRC',
    clauses: [
      { cl: '11.2', title: 'Durability Exposure Class',    status: 'COMPLIANT',    finding: 'XS2 (sea exposure) — marine-grade concrete M35 used' },
      { cl: '16.3', title: 'Min Prestress Reinforcement',  status: 'COMPLIANT',    finding: 'Prestress ratio 0.4% — meets IRC 112 minimum' },
    ]
  },
];

const STATUS_STYLE = {
  COMPLIANT:     'bg-white text-gray-700 border-[#d4d4d4]',
  NON_COMPLIANT: 'bg-black text-white border-border-default animate-pulse',
};

export default function ComplianceEngine({ selectedElement, setSelectedElement }) {
  const [activeStd, setActiveStd] = useState('IS456');
  const [activeTab, setActiveTab] = useState('Clause Check');

  const std = STANDARDS.find(s => s.id === activeStd);
  const allClauses = STANDARDS.flatMap(s => s.clauses.map(c => ({ ...c, code: s.code })));
  const nonCompliant = allClauses.filter(c => c.status === 'NON_COMPLIANT');
  const compliant = allClauses.filter(c => c.status === 'COMPLIANT');
  const complianceScore = Math.round(compliant.length / allClauses.length * 100);

  return (
    <div className="space-y-4 font-mono text-xs text-black">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Compliance Score', value: `${complianceScore}%`, sub: 'Across all standards' },
          { label: 'Standards Checked', value: STANDARDS.length, sub: 'IS, ACI, ASTM, IRC, BS' },
          { label: 'Non-Conformances', value: nonCompliant.length, sub: 'Require action' },
          { label: 'Total Clauses', value: allClauses.length, sub: 'Clauses verified by AI' },
        ].map(kpi => (
          <div key={kpi.label} className="zoho-kpi-card flex-col items-start">
            <p className="zoho-kpi-label">{kpi.label}</p>
            <p className="zoho-kpi-value">{kpi.value}</p>
            <span className="zoho-kpi-badge">{kpi.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Left: Standards List */}
        <div className="xl:col-span-1 space-y-2">
          <LevelCard icon={BookOpen} title="Select Standard" footerText="AI checks compliance automatically">
            <div className="space-y-1.5">
              {STANDARDS.map(s => {
                const nc = s.clauses.filter(c => c.status === 'NON_COMPLIANT').length;
                return (
                  <button key={s.id} onClick={() => setActiveStd(s.id)}
                    className={`w-full text-left p-2 border rounded-[8px]-[8px] transition-colors ${activeStd === s.id ? 'bg-black text-white border-border-default' : 'bg-white border-[#d4d4d4] hover:bg-gray-50'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-[12px] font-black uppercase ${activeStd === s.id ? 'text-white' : 'text-gray-800'}`}>{s.code}</span>
                      {nc > 0 && <span className={`text-[12px] px-1 border rounded-[8px]-[8px] font-black ${activeStd === s.id ? 'border-white text-white' : 'border-border-default text-black animate-pulse'}`}>{nc} NC</span>}
                    </div>
                    <p className={`text-[12px] mt-0.5 ${activeStd === s.id ? 'text-gray-300' : 'text-gray-500'}`}>{s.name}</p>
                    <p className={`text-[12px] mt-0.5 font-bold ${activeStd === s.id ? 'text-gray-400' : 'text-gray-400'}`}>{s.org}</p>
                  </button>
                );
              })}
            </div>
          </LevelCard>
        </div>

        {/* Right: Compliance Details */}
        <div className="xl:col-span-3 space-y-4">
          <div className="zoho-card">
            <div className="workspace-tabs select-none">
              {['Clause Check', 'Non-Conformances', 'Summary Report'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`workspace-tab ${activeTab === t ? 'active' : ''}`}>{t}</button>
              ))}
            </div>
            <div className="zoho-card-body space-y-4">

              {activeTab === 'Clause Check' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-[12px] uppercase">{std.code}</span>
                    <span className="text-[12px] text-gray-500">— {std.name}</span>
                    <span className="text-[12px] text-gray-400 ml-auto">{std.org}</span>
                  </div>
                  <table className="w-full text-[12px]">
                    <thead><tr><th>Clause</th><th>Title</th><th>AI Finding</th><th>Status</th></tr></thead>
                    <tbody>
                      {std.clauses.map(c => (
                        <tr key={c.cl} className="cursor-pointer" onClick={() => setSelectedElement({ type: 'Compliance Clause', id: `${std.code} §${c.cl}`, metrics: { Standard: std.code, Clause: c.cl, Title: c.title, Finding: c.finding, Status: c.status } })}>
                          <td className="font-black">{c.cl}</td>
                          <td className="font-semibold">{c.title}</td>
                          <td className="text-gray-600 text-[12px]">{c.finding}</td>
                          <td><span className={`text-[12px] px-1.5 py-0.5 border rounded-[8px]-[8px] font-black uppercase ${STATUS_STYLE[c.status]}`}>{c.status.replace('_',' ')}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'Non-Conformances' && (
                <div className="space-y-2">
                  <p className="text-[12px] text-gray-500 uppercase font-bold">{nonCompliant.length} non-conformances across all standards</p>
                  {nonCompliant.map((c, i) => (
                    <div key={i} className="p-2.5 border border-border-default bg-white rounded-[8px]-[8px] space-y-1">
                      <div className="flex justify-between">
                        <span className="font-black text-[12px] uppercase">{c.code} — Cl. {c.cl}</span>
                        <span className="text-[12px] px-1.5 py-0.5 bg-black text-white border-border-default border rounded-[8px]-[8px] font-black uppercase animate-pulse">NON-COMPLIANT</span>
                      </div>
                      <p className="text-[12px] font-bold text-gray-800">{c.title}</p>
                      <p className="text-[12px] text-gray-600">{c.finding}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Summary Report' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {STANDARDS.map(s => {
                      const nc = s.clauses.filter(c => c.status === 'NON_COMPLIANT').length;
                      const total = s.clauses.length;
                      const pct = Math.round((total - nc) / total * 100);
                      return (
                        <div key={s.id} className="p-3 border border-[#d4d4d4] bg-gray-50 rounded-[8px]-[8px] space-y-2">
                          <div className="flex justify-between">
                            <span className="font-black text-[12px] uppercase">{s.code}</span>
                            <span className={`text-[12px] px-1.5 py-0.5 border rounded-[8px]-[8px] font-black ${nc > 0 ? 'bg-black text-white border-border-default' : 'bg-white text-gray-700 border-[#d4d4d4]'}`}>{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-[8px]-[8px] overflow-hidden">
                            <div style={{ width: `${pct}%` }} className="h-full bg-black" />
                          </div>
                          <p className="text-[12px] text-gray-500">{total - nc} compliant / {nc} non-conformance{nc !== 1 ? 's' : ''}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 border border-[#d4d4d4] bg-white rounded-[8px]-[8px] text-[12px] space-y-1.5">
                    <p className="font-black uppercase">AI Compliance Assessment</p>
                    <p className="text-gray-700">Overall compliance score: <span className="font-black">{complianceScore}%</span> across {STANDARDS.length} active standards.</p>
                    <p className="text-gray-700"><span className="font-black">{nonCompliant.length} non-conformances</span> require corrective action before structural sign-off.</p>
                    <p className="text-gray-700">Priority action: Rectify lap splice lengths (ACI 318 §25.5) and cube sampling frequency (IS 456 Cl.15.2).</p>
                  </div>
                </div>
              )}
            </div>
            <div className="zoho-card-footer">
              <span className="text-gray-500 font-semibold text-[12px] uppercase">Standards & Compliance Engine — ASTM | BIS | ACI | ISO | IRC — AI auto-checks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
