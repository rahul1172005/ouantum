import React, { useState } from 'react';
import { BrainCircuit, Percent, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, Zap } from 'lucide-react';

export default function PredictiveAI({ selectedElement, setSelectedElement }) {
  const [crackCycles, setCrackCycles] = useState(120);
  const [deltaK, setDeltaK] = useState(25);
  const [corrosionYears, setCorrosionYears] = useState(5);

  const calculateCrackGrowth = () => {
    const C = 1.2e-11;
    const m = 3.0;
    const growthPerCycle = C * Math.pow(deltaK, m);
    const totalGrowthMm = (growthPerCycle * crackCycles * 1000 * 1000).toFixed(4);
    const currentLengthMm = (1.5 + Number(totalGrowthMm)).toFixed(2);
    return {
      growthPerCycle: (growthPerCycle * 1e9).toFixed(2),
      totalGrowthMm,
      currentLengthMm
    };
  };

  const calculateCorrosionThickness = () => {
    const rateMmPerYear = 0.12;
    const initialThickness = 24.0;
    const thicknessLoss = (rateMmPerYear * corrosionYears).toFixed(2);
    const remainingThickness = (initialThickness - thicknessLoss).toFixed(2);
    const strengthPercentage = (100 - (thicknessLoss / initialThickness * 100)).toFixed(1);
    return { thicknessLoss, remainingThickness, strengthPercentage };
  };

  const crackData = calculateCrackGrowth();
  const corrosionData = calculateCorrosionThickness();

  const failureProbability = (0.05 + (crackCycles * deltaK * 0.0003) + (corrosionYears * 0.4)).toFixed(2);
  const isCritical = parseFloat(failureProbability) > 15;

  const handleRowClick = (anomaly) => {
    setSelectedElement({
      type: 'Predictive Financial Anomaly',
      id: anomaly.id,
      metrics: {
        AnomalousSurcharge: anomaly.overcharge,
        ConfidenceScore: anomaly.conf,
        RiskRating: anomaly.risk,
        AuditRemedy: 'Request procurement audit ledger'
      }
    });
  };

  const anomalies = [
    { id: 'FL-802', vendor: 'Apex Cement Ltd', issue: 'Surcharge double invoice billing discrepancy', overcharge: '₹14.2 Lakhs', conf: '98.5%', risk: 'CRITICAL' },
    { id: 'FL-944', vendor: 'Trident Steel Co', issue: 'Material yield stress spec certification fail', overcharge: '₹45.0 Lakhs', conf: '92.1%', risk: 'HIGH' },
    { id: 'FL-109', vendor: 'Southern Logistics', issue: 'Divergent transport fuel mileage markups', overcharge: '₹6.8 Lakhs', conf: '89.4%', risk: 'LOW' }
  ];

  const riskColors = {
    CRITICAL: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', text: 'text-red-600' },
    HIGH: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', text: 'text-orange-600' },
    LOW: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-600' }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Paris' Law Fracture Model */}
      <div className="xl:col-span-1 space-y-4">
        
        <div className="zoho-card">
          <div className="zoho-card-header">
            <BrainCircuit className="h-3.5 w-3.5 text-orange-500" />
            <span>PARIS' LAW FRACTURE MODEL</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200">ACTIVE</span>
          </div>
          <div className="zoho-card-body space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-slate-600 text-[11px] uppercase tracking-wide">Cycles (N)</label>
                <span className="text-orange-600 font-bold text-[12px]">{crackCycles}k cycles</span>
              </div>
              <input 
                type="range" min="10" max="500" value={crackCycles} 
                onChange={(e) => setCrackCycles(Number(e.target.value))}
                className="w-full cursor-ew-resize"
                style={{ accentColor: '#f97316' }}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-slate-600 text-[11px] uppercase tracking-wide">Stress Intensity (ΔK)</label>
                <span className="text-orange-600 font-bold text-[12px]">{deltaK} MPa·m⁰·⁵</span>
              </div>
              <input 
                type="range" min="5" max="50" value={deltaK}
                onChange={(e) => setDeltaK(Number(e.target.value))}
                className="w-full cursor-ew-resize"
                style={{ accentColor: '#f97316' }}
              />
            </div>
            <div className="rounded-xl border border-orange-100 bg-orange-50/50 overflow-hidden">
              <div className="flex justify-between items-center px-3 py-2 border-b border-orange-100">
                <span className="text-slate-500 text-[11px] uppercase">Crack Length Rate:</span>
                <span className="font-bold text-slate-800 text-[12px]">{crackData.growthPerCycle} nm/cycle</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 border-b border-orange-100">
                <span className="text-slate-500 text-[11px] uppercase">Incremental Propagation:</span>
                <span className="font-bold text-slate-800 text-[12px]">{crackData.totalGrowthMm} mm</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2">
                <span className="text-slate-600 text-[11px] uppercase font-semibold">Projected Length:</span>
                <span className="font-black text-orange-600 text-[13px]">{crackData.currentLengthMm} mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structural Collapse Risk */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
            PROGNOSTIC COLLAPSE ODDS
          </div>
          <div className="zoho-card-body">
            <div className={`rounded-xl p-4 text-center space-y-2 border ${isCritical ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
              <span className="text-slate-500 text-[11px] uppercase font-semibold block">AI 20-Year Failure Probability</span>
              <span className={`text-4xl font-black font-mono block ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
                {failureProbability}%
              </span>
              <span className={`text-[11px] px-3 py-1 rounded-full inline-block font-semibold ${isCritical ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                {isCritical ? 'RISK ELEVATED' : 'NOMINAL DESIGN INDEX'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Corrosion intelligence */}
      <div className="xl:col-span-1 space-y-4">
        
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Percent className="h-3.5 w-3.5 text-orange-500" />
            <span>CORROSION INTELLIGENCE</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold border border-gray-200">MODEL</span>
          </div>
          <div className="zoho-card-body space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-slate-600 text-[11px] uppercase tracking-wide">Exposure Timeframe</label>
                <span className="text-orange-600 font-bold text-[12px]">{corrosionYears} Years</span>
              </div>
              <input 
                type="range" min="0" max="30" value={corrosionYears}
                onChange={(e) => setCorrosionYears(Number(e.target.value))}
                className="w-full cursor-ew-resize"
                style={{ accentColor: '#f97316' }}
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 YEARS</span>
                <span>30 YEARS</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Thickness Loss', value: `${corrosionData.thicknessLoss} mm` },
                { label: 'Remaining Rebar Thickness', value: `${corrosionData.remainingThickness} mm` },
                { label: 'Yield Strength Remaining', value: `${corrosionData.strengthPercentage}%` }
              ].map((metric) => (
                <div key={metric.label} className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 text-[11px] uppercase">{metric.label}</span>
                  <span className="font-bold text-slate-800 text-[12px]">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Financial Leakage AI audits */}
      <div className="xl:col-span-1 space-y-4">
        
        <div className="zoho-card">
          <div className="zoho-card-header">
            <DollarSign className="h-3.5 w-3.5 text-orange-500" />
            <span>PROCUREMENT LEAKAGE AI</span>
            <span className="ml-auto text-[10px] text-slate-400 font-semibold">3 ISSUES FOUND</span>
          </div>
          <div className="zoho-card-body space-y-3">
            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {anomalies.map((anom) => {
                const colors = riskColors[anom.risk] || riskColors.LOW;
                return (
                  <div 
                    key={anom.id} 
                    onClick={() => handleRowClick(anom)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-slate-800 text-[12px]">{anom.id} — {anom.vendor}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${colors.badge}`}>{anom.risk}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-1.5">{anom.issue}</p>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className={`font-semibold ${colors.text}`}>LEAKAGE: {anom.overcharge}</span>
                      <span className="text-slate-400">CONF: {anom.conf}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-2.5 rounded-xl border border-orange-200 bg-orange-50 text-[11px] text-orange-700 leading-relaxed flex items-start gap-2">
              <Zap className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              Click anomaly cards to load deep-contract audit ledgers into the Right Control panel.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
