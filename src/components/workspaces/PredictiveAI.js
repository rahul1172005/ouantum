import React, { useState } from 'react';
import { BrainCircuit, Percent, TrendingUp, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

export default function PredictiveAI({ selectedElement, setSelectedElement }) {
  const [crackCycles, setCrackCycles] = useState(120); // thousands of cycles
  const [deltaK, setDeltaK] = useState(25); // MPa.m^0.5
  const [corrosionYears, setCorrosionYears] = useState(5); // years

  // Paris' Law Crack Growth Calculation
  // da/dN = C * (Delta K)^m
  // C = 1.2e-11 (standard structural steel constant)
  // m = 3.0
  const calculateCrackGrowth = () => {
    const C = 1.2e-11;
    const m = 3.0;
    const growthPerCycle = C * Math.pow(deltaK, m); // meters per cycle
    const totalGrowthMm = (growthPerCycle * crackCycles * 1000 * 1000).toFixed(4); // mm
    const currentLengthMm = (1.5 + Number(totalGrowthMm)).toFixed(2);
    
    return {
      growthPerCycle: (growthPerCycle * 1e9).toFixed(2), // nm/cycle
      totalGrowthMm,
      currentLengthMm
    };
  };

  const calculateCorrosionThickness = () => {
    // 0.12 mm/year steel loss
    const rateMmPerYear = 0.12;
    const initialThickness = 24.0; // mm
    const thicknessLoss = (rateMmPerYear * corrosionYears).toFixed(2);
    const remainingThickness = (initialThickness - thicknessLoss).toFixed(2);
    const strengthPercentage = (100 - (thicknessLoss / initialThickness * 100)).toFixed(1);

    return {
      thicknessLoss,
      remainingThickness,
      strengthPercentage
    };
  };

  const crackData = calculateCrackGrowth();
  const corrosionData = calculateCorrosionThickness();

  const handleRowClick = (anomaly, e) => {
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Workspace 6-1: Crack Growth Paris Law Simulator */}
      <div className="xl:col-span-1 space-y-6">
        
        <div className="border-2 border-black p-4 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <BrainCircuit className="h-4.5 w-4.5" /> Paris&apos; Law Fracture Model
            </span>
            <span className="text-[9px] px-1 py-0.5 border border-black bg-black text-white">ACTIVE</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold mb-1 uppercase tracking-wide text-[9px]">Cycles (N): {crackCycles}k cycles</label>
              <input 
                type="range" 
                min="10" 
                max="500" 
                value={crackCycles} 
                onChange={(e) => setCrackCycles(Number(e.target.value))}
                className="w-full accent-black cursor-ew-resize"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 uppercase tracking-wide text-[9px]">Stress Intensity (ΔK): {deltaK} MPa·m⁰·⁵</label>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={deltaK} 
                onChange={(e) => setDeltaK(Number(e.target.value))}
                className="w-full accent-black cursor-ew-resize"
              />
            </div>
          </div>

          {/* Mathematical output stats */}
          <div className="p-3 border border-black bg-gray-50 space-y-2 text-[10px]">
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span>CRACK LENGTH RATE:</span>
              <span className="font-bold">{crackData.growthPerCycle} nm/cycle</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span>INCREMENTAL PROPAGATION:</span>
              <span className="font-bold">{crackData.totalGrowthMm} mm</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>PROJECTED LENGTH:</span>
              <span className="underline">{crackData.currentLengthMm} mm</span>
            </div>
          </div>
        </div>

        {/* Structural Collapse Risk estimation HUD */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">Prognostic Structural Collapse Odds</p>
          
          <div className="p-3 border-2 border-dashed border-black text-center bg-gray-50 space-y-2">
            <span className="text-gray-500 text-[9px] uppercase block">AI 20-Year Failure Probability</span>
            <span className="text-3xl font-black font-mono block">
              {(0.05 + (crackCycles * deltaK * 0.0003) + (corrosionYears * 0.4)).toFixed(2)}%
            </span>
            <span className="text-[8px] px-1 border border-black inline-block uppercase bg-white">NOMINAL DESIGN INDEX</span>
          </div>
        </div>

      </div>

      {/* Workspace 6-2: Corrosion weakening rates */}
      <div className="xl:col-span-1 space-y-6">
        
        <div className="border-2 border-black p-4 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Percent className="h-4.5 w-4.5" /> Corrosion intelligence
            </span>
            <span className="text-[9px] px-1.5 py-0.5 border border-black">MODEL</span>
          </div>

          <div>
            <label className="block font-bold mb-1.5 uppercase tracking-wide text-[9px]">Corrosion exposure timeframe: {corrosionYears} Years</label>
            <input 
              type="range" 
              min="0" 
              max="30" 
              value={corrosionYears} 
              onChange={(e) => setCorrosionYears(Number(e.target.value))}
              className="w-full accent-black cursor-ew-resize"
            />
            <div className="flex justify-between text-[8px] text-gray-500 mt-1">
              <span>0 YEARS</span>
              <span>30 YEARS</span>
            </div>
          </div>

          <div className="space-y-2 text-[10px]">
            <div className="p-2 border border-black bg-gray-50">
              <span className="text-gray-500 text-[8px] uppercase">Thickness loss</span>
              <p className="font-bold text-sm mt-0.5">{corrosionData.thicknessLoss} mm</p>
            </div>
            
            <div className="p-2 border border-black bg-gray-50">
              <span className="text-gray-500 text-[8px] uppercase">Remaining metal rebar thickness</span>
              <p className="font-bold text-sm mt-0.5">{corrosionData.remainingThickness} mm</p>
            </div>

            <div className="p-2 border border-black bg-gray-50">
              <span className="text-gray-500 text-[8px] uppercase">Calculated Yield strength remaining</span>
              <p className="font-bold text-sm mt-0.5">{corrosionData.strengthPercentage}%</p>
            </div>
          </div>
        </div>

      </div>

      {/* Workspace 6-3: Financial Leakage AI audits */}
      <div className="xl:col-span-1 space-y-6">
        
        <div className="border-2 border-black p-4 bg-white space-y-3 flex flex-col h-full justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <DollarSign className="h-4.5 w-4.5" /> Procurement leakage AI
              </span>
              <span className="text-[8px] text-gray-500">3 ISSUES FOUND</span>
            </div>

            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
              {anomalies.map((anom) => (
                <div 
                  key={anom.id} 
                  onClick={(e) => handleRowClick(anom, e)}
                  className="p-2.5 border border-black bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex justify-between items-center font-bold">
                    <span>{anom.id} | {anom.vendor}</span>
                    <span className="border border-black px-1 text-[8px] bg-white">{anom.risk}</span>
                  </div>
                  <p className="text-[10px] text-gray-700">{anom.issue}</p>
                  <div className="flex justify-between text-[8px] text-gray-500 font-mono">
                    <span>EST. LEAKAGE: {anom.overcharge}</span>
                    <span>CONFIDENCE: {anom.conf}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 border border-dashed border-gray-400 bg-gray-100 text-[9px] leading-relaxed">
            Click anomaly cards to load deep-contract audit ledgers into the Right Control panel.
          </div>
        </div>

      </div>

    </div>
  );
}
