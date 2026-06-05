'use client';
import React, { useState } from 'react';
import { ClipboardList, Camera, CheckCircle, AlertTriangle, FileText, Cpu, Clock, User } from 'lucide-react';

function LevelCard({ icon: Icon, title, children, footerText = null, headerAction = null }) {
  return (
    <div className="zoho-card flex flex-col">
      <div className="zoho-card-header">
        {Icon && <Icon className="h-4 w-4 text-orange-500 flex-shrink-0" />}
        <span className="font-semibold text-slate-700 text-[12px] uppercase tracking-wide">{title}</span>
        {headerAction && <div className="ml-auto flex-shrink-0">{headerAction}</div>}
      </div>
      <div className="zoho-card-body space-y-3 flex-1">{children}</div>
      {footerText && (
        <div className="zoho-card-footer">
          <span className="text-slate-400 font-semibold text-[11px] uppercase">{footerText}</span>
        </div>
      )}
    </div>
  );
}

const CHECKLIST_ITEMS = [
  { id: 'ci1',  category: 'Concrete', item: 'Concrete cover to reinforcement (IS 456 Cl.26.4)', method: 'Cover Meter + Visual', status: 'PASS' },
  { id: 'ci2',  category: 'Concrete', item: 'Surface finish and form face defects', method: 'Visual Inspection', status: 'FAIL' },
  { id: 'ci3',  category: 'Concrete', item: 'Honeycombing and segregation check', method: 'Visual + UPV', status: 'PASS' },
  { id: 'ci4',  category: 'Concrete', item: 'Curing adequacy (7-day minimum)', method: 'Site Log Review', status: 'PASS' },
  { id: 'ci5',  category: 'Rebar', item: 'Reinforcement diameter and spacing', method: 'Drawing Review + Measure', status: 'PASS' },
  { id: 'ci6',  category: 'Rebar', item: 'Lap length compliance (IS 456)', method: 'Tape Measure', status: 'FAIL' },
  { id: 'ci7',  category: 'Rebar', item: 'Stirrup spacing at column head', method: 'Visual + Measure', status: 'PASS' },
  { id: 'ci8',  category: 'Formwork', item: 'Formwork alignment and level', method: 'Spirit Level', status: 'PASS' },
  { id: 'ci9',  category: 'Formwork', item: 'Prop spacing and bracing adequacy', method: 'Visual + Measure', status: 'PENDING' },
  { id: 'ci10', category: 'Safety', item: 'Edge protection and fall guard nets', method: 'Visual Inspection', status: 'PASS' },
  { id: 'ci11', category: 'Safety', item: 'PPE compliance of site workers', method: 'Site Walk', status: 'FAIL' },
  { id: 'ci12', category: 'Safety', item: 'Housekeeping and material storage', method: 'Visual', status: 'PASS' },
];

const NCR_LOG = [
  { id: 'NCR-2026-001', raised: '2026-05-28', element: 'Column C4 — Zone A', defect: 'Surface honeycombing (depth 65mm)', severity: 'MAJOR', assignedTo: 'Site Engineer Ravi Kumar', dueDate: '2026-06-04', status: 'OPEN', action: 'Drill, clean, pressure grout injection per IS 516' },
  { id: 'NCR-2026-002', raised: '2026-05-29', element: 'Slab S2 — Zone B', defect: 'Insufficient lap length: 380mm vs 480mm required', severity: 'MAJOR', assignedTo: 'Structural Engineer Priya S.', dueDate: '2026-06-01', status: 'IN_PROGRESS', action: 'Add coupler or re-bar supplementary cage per structural drawing Rev C' },
  { id: 'NCR-2026-003', raised: '2026-05-30', element: 'Site Perimeter', defect: 'PPE non-compliance — 4 workers without helmets', severity: 'MINOR', assignedTo: 'Safety Officer Mohan R.', dueDate: '2026-05-31', status: 'CLOSED', action: 'Toolbox talk conducted. Mandatory PPE gate check implemented.' },
];

const STATUS_STYLE = {
  PASS:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  FAIL:    'bg-red-50 text-red-600 border-red-200',
  PENDING: 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse',
};

const NCR_STATUS = {
  OPEN:        'bg-red-50 text-red-600 border-red-200 animate-pulse',
  IN_PROGRESS: 'bg-orange-50 text-orange-600 border-orange-200',
  CLOSED:      'bg-emerald-50 text-emerald-600 border-emerald-200',
};

export default function SiteInspection({ selectedElement, setSelectedElement }) {
  const [activeTab, setActiveTab] = useState('Checklist');
  const [checkItems, setCheckItems] = useState(CHECKLIST_ITEMS);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(CHECKLIST_ITEMS.map(c => c.category)))];
  const filtered = activeCategory === 'All' ? checkItems : checkItems.filter(c => c.category === activeCategory);

  const pass = checkItems.filter(c => c.status === 'PASS').length;
  const fail = checkItems.filter(c => c.status === 'FAIL').length;
  const pending = checkItems.filter(c => c.status === 'PENDING').length;

  const cycleStatus = (id) => {
    setCheckItems(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next = { PASS: 'FAIL', FAIL: 'PENDING', PENDING: 'PASS' };
      return { ...c, status: next[c.status] };
    }));
  };

  return (
    <div className="space-y-4 font-mono text-xs text-black">

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Check Points', value: checkItems.length, sub: 'Active inspection' },
          { label: 'Pass', value: pass, sub: `${Math.round(pass/checkItems.length*100)}% compliance` },
          { label: 'Non-Conformities', value: fail, sub: 'NCR raised' },
          { label: 'Open NCRs', value: NCR_LOG.filter(n => n.status === 'OPEN').length, sub: 'Awaiting closure' },
        ].map(kpi => (
          <div key={kpi.label} className="zoho-kpi-card flex-col items-start">
            <p className="zoho-kpi-label">{kpi.label}</p>
            <p className="zoho-kpi-value">{kpi.value}</p>
            <span className="zoho-kpi-badge">{kpi.sub}</span>
          </div>
        ))}
      </div>

      <div className="zoho-card">
        <div className="workspace-tabs select-none">
          {['Checklist', 'NCR Log', 'Corrective Actions'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`workspace-tab ${activeTab === t ? 'active' : ''}`}>{t}</button>
          ))}
        </div>
        <div className="zoho-card-body space-y-4">

          {activeTab === 'Checklist' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] px-3 py-1 border font-bold uppercase rounded-full transition-all ${
                      activeCategory === cat
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-600'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
              <table className="w-full text-[12px]">
                <thead>
                  <tr><th>Category</th><th>Inspection Item</th><th>Method</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id}>
                      <td><span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{c.category}</span></td>
                      <td className="font-medium text-slate-700">{c.item}</td>
                      <td className="text-slate-400 font-mono">{c.method}</td>
                      <td>
                        <button onClick={() => cycleStatus(c.id)}
                          className={`text-[10px] px-2.5 py-0.5 border rounded-full font-bold uppercase cursor-pointer tracking-wider transition-all ${STATUS_STYLE[c.status]}`}>
                          {c.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[12px] text-gray-400 italic">Click status badge to cycle PASS → FAIL → PENDING</p>
            </div>
          )}

          {activeTab === 'NCR Log' && (
            <div className="space-y-3">
              {NCR_LOG.map(ncr => (
                <div key={ncr.id}
                  className="p-4 border border-slate-200 bg-white rounded-2xl cursor-pointer hover:border-orange-200 hover:shadow-sm transition-all"
                  onClick={() => setSelectedElement({ type: 'Site Inspection NCR', id: ncr.id, metrics: { Element: ncr.element, Defect: ncr.defect, Severity: ncr.severity, AssignedTo: ncr.assignedTo, DueDate: ncr.dueDate, Status: ncr.status, CorrectiveAction: ncr.action } })}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-[12px] text-orange-600 font-mono">{ncr.id}</span>
                      <span className="text-[11px] text-slate-400 ml-2">Raised: {ncr.raised}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2.5 py-0.5 border rounded-full font-bold uppercase tracking-wider ${
                        ncr.severity === 'MAJOR'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>{ncr.severity}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 border rounded-full font-bold uppercase tracking-wider ${NCR_STATUS[ncr.status]}`}>{ncr.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <p className="text-[12px] font-bold text-slate-700 uppercase">{ncr.element}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">{ncr.defect}</p>
                  <div className="flex justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1"><User className="h-3 w-3 text-orange-400" />{ncr.assignedTo}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3 text-orange-400" />Due: {ncr.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Corrective Actions' && (
            <div className="space-y-3">
              {NCR_LOG.map(ncr => (
                <div key={ncr.id} className="p-4 border border-slate-200 bg-slate-50 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-[12px] uppercase text-slate-700 font-mono">{ncr.id}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 border rounded-full font-bold uppercase tracking-wider ${NCR_STATUS[ncr.status]}`}>{ncr.status.replace('_',' ')}</span>
                  </div>
                  <p className="text-[12px] text-slate-700 font-semibold">{ncr.element} — {ncr.defect}</p>
                  <div className="mt-3 p-3 border border-orange-100 bg-orange-50 rounded-xl">
                    <p className="text-[10px] text-orange-600 uppercase font-bold mb-1 tracking-wider">Corrective Action</p>
                    <p className="text-[12px] text-slate-700">{ncr.action}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="btn-skeuo text-[11px] uppercase">Verify Closure</button>
                    <button className="btn-skeuo text-[11px] uppercase">Reassign</button>
                    <button className="btn-skeuo-dark text-[11px] uppercase">Generate Report</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="zoho-card-footer">
          <span className="text-gray-500 font-semibold text-[12px] uppercase">Digital Site Inspection — Replace paper checklists with AI-assisted NCR workflow</span>
        </div>
      </div>
    </div>
  );
}
