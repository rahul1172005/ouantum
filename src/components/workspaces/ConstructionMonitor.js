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

const STATUS_COLORS = { COMPLETE: 'bg-gray-800 text-white', IN_PROGRESS: 'border border-border-default text-black bg-white', PENDING: 'border border-[#d4d4d4] text-gray-500', NOT_STARTED: 'border border-[#d4d4d4] text-gray-300', CURED: 'bg-gray-800 text-white', CURING: 'border border-border-default text-black animate-pulse', FRESH: 'border border-[#d4d4d4] text-gray-600' };

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
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-[12px] mb-2">
                <div className="flex items-center gap-1.5"><span className="inline-block w-8 h-2 bg-gray-300 border border-gray-400"/><span>Planned</span></div>
                <div className="flex items-center gap-1.5"><span className="inline-block w-8 h-2 bg-black"/><span>Actual</span></div>
              </div>
              {PROGRESS_ITEMS.map(p => (
                <div key={p.id} className="space-y-1 cursor-pointer" onClick={() => setSelectedElement({ type: 'Construction Activity', id: p.id, metrics: { Activity: p.activity, PlannedProgress: `${p.planned}%`, ActualProgress: `${p.actual}%`, Status: p.status, TargetDate: p.date, Variance: `${p.planned - p.actual}%` } })}>
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-gray-800 uppercase">{p.activity}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{p.actual}% / {p.planned}%</span>
                      <span className={`text-[12px] px-1.5 py-0.5 rounded-sm font-black uppercase ${STATUS_COLORS[p.status]}`}>{p.status.replace('_',' ')}</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-100 border border-[#d4d4d4] rounded-sm overflow-hidden relative">
                    <div style={{ width: `${p.planned}%` }} className="absolute h-full bg-gray-300 border-r border-gray-400" />
                    <div style={{ width: `${p.actual}%` }} className="absolute h-full bg-black" />
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
                    <td className="font-bold">{p.id}</td><td>{p.element}</td><td>{p.volume}</td><td className="font-bold">{p.grade}</td>
                    <td>{p.date}</td><td>{p.slump}</td><td>{p.temp}</td><td>{p.cubesSent}</td>
                    <td><span className={`text-[12px] px-1.5 py-0.5 rounded-sm font-black uppercase ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
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
                  <div key={p.id} className="p-3 border border-[#d4d4d4] bg-white rounded-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-[12px] uppercase">{p.element}</p>
                        <p className="text-[12px] text-gray-500">Grade {p.grade} — Poured {p.date}</p>
                      </div>
                      <span className={`text-[12px] px-1.5 py-0.5 rounded-sm font-black uppercase ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[12px]"><span className="text-gray-500">Curing Progress (28-day)</span><span className="font-bold">{curingPct}%</span></div>
                      <div className="w-full h-2 bg-gray-100 border border-[#d4d4d4] rounded-sm overflow-hidden">
                        <div style={{ width: `${curingPct}%` }} className="h-full bg-black transition-all" />
                      </div>
                      <p className="text-[12px] text-gray-400">Day {daysSince} of 28 minimum curing period</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'AI vs Actual' && (
            <div className="space-y-4">
              <div className="p-3 border border-[#d4d4d4] bg-gray-50 rounded-sm">
                <p className="text-[12px] font-bold uppercase text-gray-500 mb-2">AI Schedule Prediction vs Actual Progress</p>
                <div className="space-y-2">
                  {PROGRESS_ITEMS.map(p => {
                    // Deterministic shift based on item ID to keep component rendering pure
                    const idSum = p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1);
                    const pseudoRandomShift = (idSum % 9) - 4; // value between -4 and 4
                    const aiPredicted = Math.min(100, Math.max(0, p.planned + pseudoRandomShift));
                    const variance = p.actual - aiPredicted;
                    return (
                      <div key={p.id} className="flex justify-between text-[12px] border-b border-gray-200 pb-1">
                        <span className="text-gray-700 uppercase truncate w-2/3">{p.activity}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">AI: {aiPredicted}%</span>
                          <span className="font-bold">Actual: {p.actual}%</span>
                          <span className={`font-black ${variance >= 0 ? 'text-gray-700' : 'text-black underline'}`}>{variance >= 0 ? `+${variance}` : variance}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-3 border border-[#d4d4d4] bg-white rounded-sm text-[12px] space-y-1.5">
                <p className="font-black uppercase">AI Forecast Summary</p>
                <p className="text-gray-700">Overall project is <span className="font-black">4 days behind</span> the AI-predicted baseline schedule.</p>
                <p className="text-gray-700">Critical path delay: Level 1 Formwork Erection ({PROGRESS_ITEMS[3].actual}% vs {PROGRESS_ITEMS[3].planned}% planned).</p>
                <p className="text-gray-700">Recommended action: Deploy additional formwork crew to recover 15% progress within 5 working days.</p>
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
