'use client';
import React, { useState } from 'react';
import { Activity, BarChart2, Clock, CheckCircle, AlertTriangle, Layers, Cpu } from 'lucide-react';

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

const PROGRESS_ITEMS = [
  { id: 'cp1', activity: 'Foundation Pile Casting — Zone A', planned: 100, actual: 100, status: 'COMPLETE', date: '2026-05-10' },
  { id: 'cp2', activity: 'Ground Floor Beam & Slab Concrete Pour', planned: 100, actual: 96, status: 'COMPLETE', date: '2026-05-18' },
  { id: 'cp3', activity: 'Column Reinforcement Placement — Level 1', planned: 100, actual: 88, status: 'IN_PROGRESS', date: '2026-05-28' },
  { id: 'cp4', activity: 'Level 1 Formwork Erection', planned: 80, actual: 65, status: 'IN_PROGRESS', date: '2026-05-30' },
  { id: 'cp5', activity: 'Level 1 Concrete Pouring', planned: 40, actual: 0, status: 'PENDING', date: '2026-06-05' },
  { id: 'cp6', activity: 'Level 2 Rebar Prefabrication', planned: 20, actual: 10, status: 'IN_PROGRESS', date: '2026-06-10' },
  { id: 'cp7', activity: 'Curing — Ground Floor Slab', planned: 100, actual: 100, status: 'COMPLETE', date: '2026-05-25' },
  { id: 'cp8', activity: 'Level 2 Formwork Erection', planned: 0, actual: 0, status: 'NOT_STARTED', date: '2026-06-18' },
];

const CONCRETE_POURS = [
  { id: 'PO-001', element: 'Ground Floor Slab S1', volume: '84 m³', grade: 'M30', date: '2026-05-18', slump: '95mm', temp: '28°C', cubesSent: 6, status: 'CURED' },
  { id: 'PO-002', element: 'Column C1–C9 (Level 0)', volume: '22 m³', grade: 'M40', date: '2026-05-22', slump: '102mm', temp: '30°C', cubesSent: 4, status: 'CURING' },
  { id: 'PO-003', element: 'Retaining Wall W4', volume: '18 m³', grade: 'M25', date: '2026-05-26', slump: '88mm', temp: '27°C', cubesSent: 4, status: 'CURING' },
  { id: 'PO-004', element: 'Staircase Beam & Slab', volume: '14 m³', grade: 'M30', date: '2026-05-29', slump: '100mm', temp: '29°C', cubesSent: 3, status: 'FRESH' },
];

const STATUS_COLORS = {
  COMPLETE:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  IN_PROGRESS: 'bg-orange-50 text-orange-700 border border-orange-200',
  PENDING:     'bg-slate-50 text-slate-400 border border-slate-200',
  NOT_STARTED: 'bg-white text-slate-300 border border-slate-100',
  CURED:       'bg-emerald-50 text-emerald-700 border border-emerald-200',
  CURING:      'bg-gray-50 text-gray-600 border border-gray-200 animate-pulse',
  FRESH:       'bg-amber-50 text-amber-600 border border-amber-200',
};

export default function ConstructionMonitor({ selectedElement, setSelectedElement }) {
  const [activeTab, setActiveTab] = useState('Progress');

  const overallActual = Math.round(PROGRESS_ITEMS.reduce((s, p) => s + p.actual, 0) / PROGRESS_ITEMS.reduce((s, p) => s + p.planned, 0) * 100);
  const overallPlanned = Math.round(PROGRESS_ITEMS.reduce((s, p) => s + p.planned, 0) / (PROGRESS_ITEMS.length * 100) * 100);

  return (
    <div className="space-y-4 font-mono text-xs text-black">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Planned Progress', value: `${overallPlanned}%`, sub: 'Schedule target' },
          { label: 'Actual Progress', value: `${overallActual}%`, sub: `${overallPlanned > overallActual ? 'Behind schedule' : 'On track'}` },
          { label: 'Activities Complete', value: PROGRESS_ITEMS.filter(p => p.status === 'COMPLETE').length, sub: `of ${PROGRESS_ITEMS.length} total` },
          { label: 'Concrete Pours', value: CONCRETE_POURS.length, sub: `${CONCRETE_POURS.reduce((s,p) => s + parseFloat(p.volume), 0)} m³ total` },
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
          {['Progress', 'Concrete Register', 'Curing Log', 'AI vs Actual'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`workspace-tab ${activeTab === t ? 'active' : ''}`}>{t}</button>
          ))}
        </div>
        <div className="zoho-card-body space-y-4">

            {activeTab === 'Progress' && (
              <div className="space-y-4">
                <div className="flex items-center gap-5 text-[11px] mb-1">
                  <div className="flex items-center gap-2"><span className="inline-block w-8 h-2 rounded-sm bg-slate-200" /><span className="text-slate-400 font-semibold uppercase tracking-wider">Planned</span></div>
                  <div className="flex items-center gap-2"><span className="inline-block w-8 h-2 rounded-sm bg-gradient-to-r from-orange-400 to-amber-400" /><span className="text-slate-600 font-semibold uppercase tracking-wider">Actual</span></div>
                </div>
                {PROGRESS_ITEMS.map(p => (
                  <div key={p.id} className="space-y-1.5 cursor-pointer group" onClick={() => setSelectedElement({ type: 'Construction Activity', id: p.id, metrics: { Activity: p.activity, PlannedProgress: `${p.planned}%`, ActualProgress: `${p.actual}%`, Status: p.status, TargetDate: p.date, Variance: `${p.planned - p.actual}%` } })}>
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="font-semibold text-slate-700 uppercase group-hover:text-orange-600 transition-colors">{p.activity}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-slate-400 font-mono">{p.actual}% / {p.planned}%</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${STATUS_COLORS[p.status]}`}>{p.status.replace('_',' ')}</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                      <div style={{ width: `${p.planned}%` }} className="absolute h-full bg-slate-200 rounded-full" />
                      <div style={{ width: `${p.actual}%` }} className="absolute h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Concrete Register' && (
              <table className="w-full text-[12px]">
                <thead><tr><th>Pour ID</th><th>Element</th><th>Volume</th><th>Grade</th><th>Date</th><th>Slump</th><th>Temp</th><th>Cubes</th><th>Status</th></tr></thead>
                <tbody>
                  {CONCRETE_POURS.map(p => (
                    <tr key={p.id} className="cursor-pointer" onClick={() => setSelectedElement({ type: 'Concrete Pour Record', id: p.id, metrics: { Element: p.element, Volume: p.volume, Grade: p.grade, PourDate: p.date, SlumpValue: p.slump, Temperature: p.temp, CubesSent: p.cubesSent, Status: p.status } })}>
                      <td className="font-bold font-mono text-orange-600">{p.id}</td><td>{p.element}</td><td className="font-mono">{p.volume}</td><td className="font-bold">{p.grade}</td>
                      <td className="font-mono">{p.date}</td><td className="font-mono">{p.slump}</td><td className="font-mono">{p.temp}</td><td>{p.cubesSent}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'Curing Log' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONCRETE_POURS.filter(p => p.status !== 'FRESH').map(p => {
                  const daysSince = Math.round((new Date('2026-05-31') - new Date(p.date)) / 86400000);
                  const curingPct = Math.min(100, Math.round(daysSince / 28 * 100));
                  return (
                    <div key={p.id} className="p-4 border border-gray-200 bg-white rounded-xl space-y-3 hover:border-gray-400 hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-[12px] text-slate-800 uppercase">{p.element}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Grade {p.grade} — Poured {p.date}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Curing Progress (28-day)</span>
                          <span className="font-bold text-orange-600">{curingPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div style={{ width: `${curingPct}%` }} className="h-full bg-gradient-to-r from-gray-400 to-gray-700 rounded-full transition-all" />
                        </div>
                        <p className="text-[10px] text-slate-400">Day {daysSince} of 28 minimum curing period</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'AI vs Actual' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-3">AI Schedule Prediction vs Actual Progress</p>
                  <div className="space-y-2.5">
                    {PROGRESS_ITEMS.map(p => {
                      const idSum = p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1);
                      const pseudoRandomShift = (idSum % 9) - 4;
                      const aiPredicted = Math.min(100, Math.max(0, p.planned + pseudoRandomShift));
                      const variance = p.actual - aiPredicted;
                      return (
                        <div key={p.id} className="flex justify-between items-center text-[12px] border-b border-slate-200 pb-2">
                          <span className="text-slate-600 uppercase truncate w-2/3 font-medium">{p.activity}</span>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-slate-400 font-mono">AI: {aiPredicted}%</span>
                            <span className="font-bold text-slate-700">Act: {p.actual}%</span>
                            <span className={`font-bold text-[11px] px-2 py-0.5 rounded-full ${
                              variance >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'
                            }`}>{variance >= 0 ? `+${variance}` : variance}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50 text-[12px] space-y-2">
                  <p className="font-bold text-orange-700 uppercase tracking-wider text-[11px]">AI Forecast Summary</p>
                  <p className="text-slate-600">Overall project is <span className="font-bold text-orange-600">4 days behind</span> the AI-predicted baseline schedule.</p>
                  <p className="text-slate-600">Critical path delay: Level 1 Formwork Erection ({PROGRESS_ITEMS[3].actual}% vs {PROGRESS_ITEMS[3].planned}% planned).</p>
                  <p className="text-slate-600">Recommended action: Deploy additional formwork crew to recover 15% progress within 5 working days.</p>
                </div>
              </div>
            )}
        </div>
        <div className="zoho-card-footer">
          <span className="text-gray-500 font-semibold text-[12px] uppercase">Construction Monitoring — AI tracks planned vs actual progress in real-time</span>
        </div>
      </div>
    </div>
  );
}
