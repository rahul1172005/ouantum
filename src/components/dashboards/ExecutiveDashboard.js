'use client';
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  IndianRupee,
  Activity,
  Gauge,
  ShieldAlert,
  FileSpreadsheet,
  Plus,
  Circle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useCRMStore } from '@/store/crmStore';

/* ------------------------------------------------------------------ */
/*  India SVG map — clickable hotspots                                  */
/* ------------------------------------------------------------------ */
const IndiaMap = ({ onHotspotClick }) => (
  <svg viewBox="0 0 400 450" className="w-full h-full max-h-[260px] select-none">
    <path
      d="M150 40 L190 30 L210 60 L240 80 L250 110 L230 140 L240 180 L270 200 L250 250 L200 320 L160 380 L170 410 L160 430 L150 410 L140 370 L110 320 L90 280 L100 240 L120 220 L90 180 L80 140 L100 90 Z"
      fill="#f8fafc"
      stroke="#cbd5e1"
      strokeWidth="2"
    />
    {/* Mumbai */}
    <g className="cursor-pointer group" onClick={() => onHotspotClick({ name: 'MSRDC — Bandra-Worli Sea Link', loc: 'Mumbai, MH', score: 84, activeDeals: '₹4.5 Cr' })}>
      <circle cx="108" cy="270" r="10" fill="#2563eb" opacity="0.25" className="animate-pulse" />
      <circle cx="108" cy="270" r="5" fill="#2563eb" className="group-hover:scale-125 transition-transform duration-200" style={{ transformOrigin: '108px 270px' }} />
      <text x="120" y="274" fill="#334155" fontSize="9" fontWeight="700" className="group-hover:fill-blue-600 transition-colors">MUMBAI [BWSL]</text>
    </g>
    {/* Chennai */}
    <g className="cursor-pointer group" onClick={() => onHotspotClick({ name: 'CMRL — Chennai Metro Line 3', loc: 'Chennai, TN', score: 92, activeDeals: '₹12.0 Cr' })}>
      <circle cx="152" cy="370" r="10" fill="#2563eb" opacity="0.25" className="animate-pulse" />
      <circle cx="152" cy="370" r="5" fill="#2563eb" className="group-hover:scale-125 transition-transform duration-200" style={{ transformOrigin: '152px 370px' }} />
      <text x="164" y="374" fill="#334155" fontSize="9" fontWeight="700" className="group-hover:fill-blue-600 transition-colors">CHENNAI [CMRL]</text>
    </g>
    {/* Delhi */}
    <g className="cursor-pointer group" onClick={() => onHotspotClick({ name: 'NHAI — Highway Bridge-42', loc: 'New Delhi, DL', score: 78, activeDeals: '₹8.5 Cr' })}>
      <circle cx="140" cy="120" r="10" fill="#2563eb" opacity="0.25" className="animate-pulse" />
      <circle cx="140" cy="120" r="5" fill="#2563eb" className="group-hover:scale-125 transition-transform duration-200" style={{ transformOrigin: '140px 120px' }} />
      <text x="152" y="124" fill="#334155" fontSize="9" fontWeight="700" className="group-hover:fill-blue-600 transition-colors">DELHI [NHAI]</text>
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/*  KPI card                                                            */
/* ------------------------------------------------------------------ */
function KpiCard({ label, value, badge }) {
  return (
    <div className="zoho-kpi-card">
      <div className="flex-1 min-w-0 w-full">
        <div className="zoho-kpi-label">{label}</div>
        <div className="zoho-kpi-value">{value}</div>
        {badge && (
          <span className="zoho-kpi-badge">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section card header                                                 */
/* ------------------------------------------------------------------ */
function CardHeader({ label }) {
  return (
    <div className="zoho-card-header">
      <span>{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main dashboard                                                      */
/* ------------------------------------------------------------------ */
export default function ExecutiveDashboard({ selectedElement, setSelectedElement }) {
  const accounts  = useCRMStore(state => state.accounts);
  const deals     = useCRMStore(state => state.deals);
  const tickets   = useCRMStore(state => state.tickets);
  const activities = useCRMStore(state => state.activities);
  const addDeal   = useCRMStore(state => state.addDeal);

  const [sensorStream, setSensorStream] = useState(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      time: `${i}:00`,
      vibration: +(1.2 + Math.sin(i * 0.5) * 0.4 + (i === 12 ? 1.8 : 0)).toFixed(3),
    }));
  });

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [newDealTitle,   setNewDealTitle]   = useState('');
  const [newDealAmount,  setNewDealAmount]  = useState('');
  const [newDealAccount, setNewDealAccount] = useState('acc-1');

  useEffect(() => {
    const iv = setInterval(() => {
      setSensorStream(prev => {
        const t = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return [...prev.slice(1), {
          time: t,
          vibration: +(1.2 + Math.sin(Date.now() * 0.001) * 0.5 + (Math.random() > 0.85 ? 1.5 : 0)).toFixed(3),
        }];
      });
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const totalDealValue      = deals.reduce((s, d) => s + d.amount, 0);
  const criticalAlarmsCount = tickets.filter(t => t.status === 'OPEN' && (t.severity === 'CRITICAL' || t.severity === 'HIGH')).length;

  const handleCreateDeal = (e) => {
    e.preventDefault();
    if (!newDealTitle || !newDealAmount) return;
    const res = addDeal({
      accountId: newDealAccount,
      title:     newDealTitle,
      amount:    parseFloat(newDealAmount),
      stage:     'Proposal',
      healthScore: 100,
      closeDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    });
    if (res.success) {
      setNewDealTitle('');
      setNewDealAmount('');
      alert('Maintenance contract recorded successfully.');
    }
  };

  const handleHotspotClick = (asset) => {
    setSelectedAsset(asset);
    setSelectedElement({
      type: 'Regional Hotspot Telemetry',
      id: asset.name.split(' ')[0],
      metrics: {
        RegionalHealthIndex: `${asset.score}%`,
        ContractValueScope:  asset.activeDeals,
        LocationCoordinates: asset.loc,
      },
    });
  };

  /* ── stage badge colors ── */
  const stageBadge = (stage) => {
    const map = {
      Proposal:    { bg: '#fff8e1', color: '#b45309', border: '#fde68a' },
      Negotiation: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
      'Due Diligence': { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
      Closed:      { bg: '#f9fafb', color: '#374151', border: '#d1d5db' },
    };
    return map[stage] || { bg: '#f4f4f4', color: '#555', border: '#ddd' };
  };

  /* ── health score color ── */
  const healthColor = (score) => '#1a1a1a';

  return (
    <div className="flex flex-col gap-6">

      {/* ── Row 1: KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          label="Active Asset Owners"
          value={accounts.length}
          badge="3 Portfolios"
          icon={Gauge}
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />
        <KpiCard
          label="Active Sensor Alerts"
          value={criticalAlarmsCount}
          badge={criticalAlarmsCount > 0 ? "Critical Alerts Active" : "No Critical Anomalies"}
          icon={ShieldAlert}
          iconBg={criticalAlarmsCount > 0 ? '#fef2f2' : '#f0fdf4'}
          iconColor={criticalAlarmsCount > 0 ? '#ef4444' : '#10b981'}
        />
        <KpiCard
          label="CRM Pipeline Value"
          value={`₹${(totalDealValue / 10000000).toFixed(2)} Cr`}
          badge={`${deals.length} Active Contracts`}
          icon={IndianRupee}
          iconBg="#f0fdf4"
          iconColor="#10b981"
        />
        <KpiCard
          label="AI Diagnostic Trust"
          value="94.8%"
          badge="Calibrated"
          icon={TrendingUp}
          iconBg="#eff6ff"
          iconColor="#2563eb"
        />
      </div>

      {/* ── Row 2: Map | Chart | Log ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Regional map */}
        <div className="zoho-card flex flex-col min-h-[380px]">
          <CardHeader icon={MapPin} label="Regional Hotspot Index" iconColor="#2563eb" />
          <div className="zoho-card-body flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 flex justify-center items-center py-2">
              <IndiaMap onHotspotClick={handleHotspotClick} />
            </div>
          </div>
          <div className="zoho-card-footer px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {selectedAsset ? (
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-xs">{selectedAsset.name}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">{selectedAsset.loc}</span>
                </div>
                <span className="text-xs font-bold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                  Index: {selectedAsset.score}%
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
                Click highlighted hotspots to view details
              </span>
            )}
          </div>
        </div>

        {/* Acoustic telemetry chart */}
        <div className="zoho-card flex flex-col min-h-[380px]">
          <CardHeader icon={Activity} label="Live Acoustic Telemetry" iconColor="#2563eb" />
          <div className="zoho-card-body flex-1 flex flex-col gap-3 overflow-hidden">
            <div className="text-xs font-semibold text-slate-400">
              Channel Feed: Pillar-B12 Strain Transducers
            </div>
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sensorStream} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs flex flex-col gap-1">
                            <span className="font-mono text-slate-400">{payload[0].payload.time}</span>
                            <span className="font-bold text-orange-400">Vibration: {payload[0].value} Hz</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="vibration" stroke="#2563eb" strokeWidth={2.5} fill="url(#vibGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="zoho-card-footer px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
              <Activity size={13} className="text-blue-500 animate-pulse" /> Sensor Link Matrix On-Site
            </span>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider scale-90">
              SECURE
            </span>
          </div>
        </div>

        {/* AI Diagnostics log */}
        <div className="zoho-card flex flex-col min-h-[380px]">
          <CardHeader icon={ShieldCheck} label="AI Diagnostics HUD Log" iconColor="#2563eb" />
          <div className="zoho-card-body flex-1 flex flex-col gap-3 overflow-y-auto max-h-[320px]">
            <div className="flex flex-col gap-3">
              {activities.map((act) => {
                const isCritical = act.critical;
                return (
                  <div
                    key={act.id}
                    className={`p-3.5 rounded-xl border transition-all duration-200 ${
                      isCritical
                        ? 'bg-rose-50/70 border-rose-100 text-rose-800 shadow-[0_4px_12px_rgba(244,63,94,0.02)]'
                        : act.type.includes('DRONE')
                        ? 'bg-blue-50/70 border-blue-100 text-blue-800'
                        : 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[11px] font-bold tracking-wider uppercase ${
                        isCritical ? 'text-rose-600' : act.type.includes('DRONE') ? 'text-blue-600' : 'text-emerald-600'
                      }`}>{act.type}</span>
                      <span className="text-[11px] font-mono opacity-60">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed font-semibold opacity-90">{act.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ── Row 3: Deal table + Create form ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

        {/* Pipeline contract table */}
        <div className="zoho-card flex flex-col">
          <CardHeader icon={FileSpreadsheet} label="Active High-Value Maintenance Pipeline Contracts" iconColor="#10b981" />
          <div className="zoho-card-body p-0 flex-1">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Project Name', 'Account Entity', 'Contract Value', 'Pipeline Stage', 'Safety Index'].map(h => (
                      <th key={h} className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-left bg-slate-50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => {
                    const acc = accounts.find(a => a.id === deal.accountId);
                    const getStageStyles = (stage) => {
                      const map = {
                        Proposal: 'bg-amber-50 text-amber-600 border border-amber-200',
                        Negotiation: 'bg-blue-50 text-blue-600 border border-blue-200',
                        'Due Diligence': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
                        Closed: 'bg-slate-50 text-slate-600 border border-slate-200',
                      };
                      return map[stage] || 'bg-slate-50 text-slate-600 border border-slate-200';
                    };
                    const getHealthColor = (score) => {
                      if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
                      if (score >= 80) return 'text-amber-600 bg-amber-50 border-amber-100';
                      return 'text-rose-600 bg-rose-50 border-rose-100';
                    };
                    return (
                      <tr key={deal.id} className="border-b border-slate-100 hover:bg-orange-50/20 transition-colors duration-150">
                        <td className="px-5 py-4 font-bold text-slate-800">{deal.title}</td>
                        <td className="px-5 py-4 text-slate-500 font-semibold">{acc ? acc.name : 'Unknown Entity'}</td>
                        <td className="px-5 py-4 font-bold text-blue-600">₹{(deal.amount / 10000000).toFixed(2)} Cr</td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStageStyles(deal.stage)}`}>
                            {deal.stage}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] ${getHealthColor(deal.healthScore)}`}>
                            {deal.healthScore}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Create form */}
        <div className="zoho-card flex flex-col">
          <CardHeader icon={Plus} label="Create Maintenance Contract" iconColor="#2563eb" />
          <div className="zoho-card-body p-6 flex flex-col h-full justify-between">
            <form onSubmit={handleCreateDeal} className="flex flex-col gap-4">

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Contract Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bandra Piling Repairs..."
                  value={newDealTitle}
                  onChange={e => setNewDealTitle(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5000000"
                    value={newDealAmount}
                    onChange={e => setNewDealAmount(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Asset Owner
                  </label>
                  <select
                    value={newDealAccount}
                    onChange={e => setNewDealAccount(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 font-bold py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border-none"
              >
                <Plus size={16} /> Enforce Contract Entry
              </button>

            </form>

            <p className="mt-4 pt-4 border-t border-dashed border-slate-100 text-xs text-slate-400 leading-relaxed font-semibold">
              Notice: Strict CRM governance constraints enforced (SSOT). All creations are cascading and immutable.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
