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
      fill="#f5f5f5"
      stroke="#b0b0b0"
      strokeWidth="1.5"
    />
    {/* Mumbai */}
    <g className="cursor-pointer" onClick={() => onHotspotClick({ name: 'MSRDC — Bandra-Worli Sea Link', loc: 'Mumbai, MH', score: 84, activeDeals: '₹4.5 Cr' })}>
      <circle cx="108" cy="270" r="5" fill="#333333" />
      <circle cx="108" cy="270" r="9" fill="none" stroke="#333333" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
      <text x="120" y="274" fill="#1a1a1a" fontSize="8.5" fontWeight="600">MUMBAI [BWSL]</text>
    </g>
    {/* Chennai */}
    <g className="cursor-pointer" onClick={() => onHotspotClick({ name: 'CMRL — Chennai Metro Line 3', loc: 'Chennai, TN', score: 92, activeDeals: '₹12.0 Cr' })}>
      <circle cx="152" cy="370" r="5" fill="#333333" />
      <circle cx="152" cy="370" r="9" fill="none" stroke="#333333" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
      <text x="164" y="374" fill="#1a1a1a" fontSize="8.5" fontWeight="600">CHENNAI [CMRL]</text>
    </g>
    {/* Delhi */}
    <g className="cursor-pointer" onClick={() => onHotspotClick({ name: 'NHAI — Highway Bridge-42', loc: 'New Delhi, DL', score: 78, activeDeals: '₹8.5 Cr' })}>
      <circle cx="140" cy="120" r="5" fill="#333333" />
      <circle cx="140" cy="120" r="9" fill="none" stroke="#333333" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
      <text x="152" y="124" fill="#1a1a1a" fontSize="8.5" fontWeight="600">DELHI [NHAI]</text>
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/*  KPI card                                                            */
/* ------------------------------------------------------------------ */
function KpiCard({ label, value, badge, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="zoho-kpi-card">
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="zoho-kpi-label">{label}</div>
        <div className="zoho-kpi-value">{value}</div>
        {badge && <div className="zoho-kpi-badge">{badge}</div>}
      </div>
      <div className="zoho-kpi-icon">
        {Icon && <Icon size={17} color="#444" />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section card header                                                 */
/* ------------------------------------------------------------------ */
function CardHeader({ icon: Icon, label, iconColor }) {
  return (
    <div className="zoho-card-header">
      {Icon && <Icon size={14} color={iconColor || '#555'} />}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Row 1: KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <KpiCard
          label="Active Asset Owners"
          value={accounts.length}
          badge="3 Portfolios"
          icon={Gauge}
          iconBg="#f0f6ff"
          iconColor="#0d6efd"
        />
        <KpiCard
          label="Active Sensor Alerts"
          value={criticalAlarmsCount}
          badge="Real-Time"
          icon={ShieldAlert}
          iconBg={criticalAlarmsCount > 0 ? '#fdecea' : '#f0fdf4'}
          iconColor={criticalAlarmsCount > 0 ? '#c0392b' : '#217346'}
        />
        <KpiCard
          label="CRM Pipeline Value"
          value={`₹${(totalDealValue / 10000000).toFixed(2)} Cr`}
          badge={`${deals.length} Contracts`}
          icon={IndianRupee}
          iconBg="#f0fdf4"
          iconColor="#217346"
        />
        <KpiCard
          label="AI Diagnostic Trust"
          value="94.8%"
          badge="Calibrated"
          icon={TrendingUp}
          iconBg="#f0f6ff"
          iconColor="#0d6efd"
        />
      </div>

      {/* ── Row 2: Map | Chart | Log ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>

        {/* Regional map */}
        <div className="zoho-card" style={{ minHeight: 360, display: 'flex', flexDirection: 'column' }}>
          <CardHeader icon={MapPin} label="Regional Hotspot Index" iconColor="#444" />
          <div className="zoho-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 84px)', overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IndiaMap onHotspotClick={handleHotspotClick} />
            </div>
          </div>
          <div className="zoho-card-footer" style={{ height: 42, overflow: 'hidden' }}>
            {selectedAsset ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '12px', lineHeight: 1.1 }}>{selectedAsset.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#555', marginTop: 1 }}>
                  <span>{selectedAsset.loc}</span>
                  <span style={{ fontWeight: 700, color: '#333' }}>Index: {selectedAsset.score}%</span>
                </div>
              </div>
            ) : (
              <span style={{ color: '#777', fontSize: '12px' }}>Click highlighted hotspots to view details</span>
            )}
          </div>
        </div>

        {/* Acoustic telemetry chart */}
        <div className="zoho-card" style={{ minHeight: 360, display: 'flex', flexDirection: 'column' }}>
          <CardHeader icon={Activity} label="Live Acoustic Telemetry" iconColor="#444" />
          <div className="zoho-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 84px)', gap: 10, overflow: 'hidden' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
              Channel Feed: Pillar-B12 Strain Transducers
            </div>
            <div style={{ flex: 1, minHeight: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sensorStream} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#777777" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#777777" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#888' }} tickLine={false} axisLine={{ stroke: '#ccc' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#888' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #b0b0b0',
                      borderRadius: 2,
                      fontSize: 12,
                      boxShadow: '1px 2px 5px rgba(0,0,0,0.15)',
                    }}
                    itemStyle={{ color: '#333' }}
                  />
                  <Area type="monotone" dataKey="vibration" stroke="#555555" strokeWidth={1.8} fill="url(#vibGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="zoho-card-footer">
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Activity size={12} color="#555" /> Sensor Link Matrix On-Site
            </span>
            <span style={{
              background: 'linear-gradient(to bottom, #eee, #ddd)',
              color: '#333',
              border: '1px solid #b0b0b0',
              borderRadius: 2,
              padding: '2px 7px',
              fontSize: 12,
              fontWeight: 700,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
            }}>SECURE</span>
          </div>
        </div>

        {/* AI Diagnostics log */}
        <div className="zoho-card" style={{ minHeight: 360, display: 'flex', flexDirection: 'column' }}>
          <CardHeader icon={ShieldCheck} label="AI Diagnostics HUD Log" iconColor="#444" />
          <div className="zoho-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 42px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    padding: '8px 10px',
                    border: act.critical ? 'none' : '1px solid #d8d8d8',
                    borderRadius: 2,
                    background: act.critical
                      ? 'repeating-linear-gradient(45deg,#3d3d3d,#3d3d3d 6px,#4a4a4a 6px,#4a4a4a 12px)'
                      : 'linear-gradient(to bottom, #fafafa, #f3f3f3)',
                    color: act.critical ? '#fff' : '#2d2d2d',
                    boxShadow: act.critical ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.8)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: act.critical ? '#ffd580' : '#555555',
                    }}>{act.type}</span>
                    <span style={{ fontSize: 12, color: act.critical ? '#ccc' : '#999' }}>
                      {new Date(act.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, lineHeight: 1.5, margin: 0 }}>{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Row 3: Deal table + Create form ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3.5">

        {/* Pipeline contract table */}
        <div className="zoho-card">
          <CardHeader icon={FileSpreadsheet} label="Active High-Value Maintenance Pipeline Contracts" iconColor="#217346" />
          <div className="zoho-card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Project Name', 'Account Entity', 'Contract Value', 'Pipeline Stage', 'Safety Index'].map(h => (
                      <th key={h} style={{
                        padding: '8px 12px',
                        background: '#f4f4f5',
                        borderBottom: '1px solid #e0e0e0',
                        fontWeight: 600,
                        fontSize: 12,
                        color: '#555',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => {
                    const acc = accounts.find(a => a.id === deal.accountId);
                    const { bg, color, border } = stageBadge(deal.stage);
                    return (
                      <tr key={deal.id} style={{ borderBottom: '1px solid #eeeeee', background: '#fff' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1a1a1a' }}>{deal.title}</td>
                        <td style={{ padding: '8px 12px', color: '#555' }}>{acc ? acc.name : 'Unknown Entity'}</td>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#217346' }}>₹{(deal.amount / 10000000).toFixed(2)} Cr</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 7px',
                            borderRadius: 2,
                            fontSize: 12,
                            fontWeight: 700,
                            background: 'linear-gradient(to bottom, #f5f5f5, #e5e5e5)',
                            color: '#333',
                            border: '1px solid #c0c0c0',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                          }}>{deal.stage}</span>
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{ fontWeight: 700, color: healthColor(deal.healthScore) }}>
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
        <div className="zoho-card">
          <CardHeader icon={Plus} label="Create Maintenance Contract" iconColor="#0d6efd" />
          <div className="zoho-card-body">
            <form onSubmit={handleCreateDeal} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>
                  Contract Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bandra Piling Repairs..."
                  value={newDealTitle}
                  onChange={e => setNewDealTitle(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5000000"
                    value={newDealAmount}
                    onChange={e => setNewDealAmount(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>
                    Asset Owner
                  </label>
                  <select
                    value={newDealAccount}
                    onChange={e => setNewDealAccount(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '7px 0',
                  background: 'linear-gradient(to bottom, #f0f0f0, #d8d8d8)',
                  color: '#1a1a1a',
                  border: '1px solid #a0a0a0',
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.10)',
                  textShadow: '0 1px 0 rgba(255,255,255,0.7)',
                }}
              >
                <Plus size={14} /> Enforce Contract Entry
              </button>

            </form>

            <p style={{ marginTop: 14, paddingTop: 10, borderTop: '1px dashed #e0e0e0', fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>
              Notice: Strict CRM governance constraints enforced (SSOT). All creations are cascading and immutable.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
