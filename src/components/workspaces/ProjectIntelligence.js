import React, { useState } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { BrainCircuit, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ProjectIntelligence({ selectedElement, setSelectedElement }) {
  const [activeTab, setActiveTab] = useState('planning'); // planning, execution, climate, qa_qc, shm_iot, digital_eng, lifecycle, ai_intel
  
  // 1. Planning State
  const [projectBudget, setProjectBudget] = useState(250); // million INR
  const [scheduleDelayDays, setScheduleDelayDays] = useState(15);
  const [riskFactorPlanning, setRiskFactorPlanning] = useState(0.35); // 0-1 scale

  // 2. Execution State
  const [craneRadius, setCraneRadius] = useState(12.0); // meters
  const [loadWeight, setLoadWeight] = useState(8.5); // tons
  const [craneCapacityMax, setCraneCapacityMax] = useState(15.0); // tons
  const [labourEfficiency, setLabourEfficiency] = useState(82); // %

  // 3. Environmental & Climate State
  const [ambientTemp, setAmbientTemp] = useState(38); // Celsius
  const [relativeHumidity, setRelativeHumidity] = useState(45); // %
  const [annualRainfall, setAnnualRainfall] = useState(1200); // mm

  // 4. QA/QC Master State
  const [ncrCount, setNcrCount] = useState(3);
  const [toleranceBreachVal, setToleranceBreachVal] = useState(4.2); // mm
  const [qaAuditScore, setQaAuditScore] = useState(91); // %

  // 5. SHM & IoT State
  const [sensorNoiseFloor, setSensorNoiseFloor] = useState(0.05); // mV
  const [sampledStrain, setSampledStrain] = useState(140); // microstrain
  const [liveDisplacement, setLiveDisplacement] = useState(12.5); // mm

  // 6. Digital Engineering State
  const [bimClashesCount, setBimClashesCount] = useState(8);
  const [femMeshNodes, setFemMeshNodes] = useState(45000); // nodes

  // 7. Lifecycle State
  const [initialCapitalCost, setInitialCapitalCost] = useState(120); // millions
  const [annualMaintenanceCost, setAnnualMaintenanceCost] = useState(4.5); // millions/yr
  const [lifecycleSpan, setLifecycleSpan] = useState(50); // years
  const [salvageValue, setSalvageValue] = useState(10); // millions

  // 8. AI Intelligence State
  const [aiConfidenceRate, setAiConfidenceRate] = useState(94.2); // %
  const [sensorTelemetryDrift, setSensorTelemetryDrift] = useState(0.02); // drift ratio

  // CRM Store Integration
  const accounts = useCRMStore(state => state.accounts);
  const deals = useCRMStore(state => state.deals);
  const addTicket = useCRMStore(state => state.addTicket);
  const [crmSuccess, setCrmSuccess] = useState('');

  // Calculations

  // Execution: Crane stability factor
  const craneUtilization = (loadWeight / (craneCapacityMax * (10 / craneRadius))) * 100;

  // Climate: Concrete curing evaporation rate: E = 5 * ([Tc^2.5 - rH*Ta^2.5]...) -> simplified index
  const concreteEvaporationIndex = (ambientTemp * 0.08) - (relativeHumidity * 0.02); // kg/m2/hr

  // Lifecycle: Life Cycle Cost (LCC) = Ci + Sum(Cm / (1+r)^t) - Cd/(1+r)^n
  const discountRate = 0.06; // 6%
  // NPV of recurring maintenance
  let npvMaintenance = 0;
  for (let t = 1; t <= lifecycleSpan; t++) {
    npvMaintenance += annualMaintenanceCost / Math.pow(1 + discountRate, t);
  }
  const npvSalvage = salvageValue / Math.pow(1 + discountRate, lifecycleSpan);
  const lifeCycleCostTotal = initialCapitalCost + npvMaintenance - npvSalvage;

  // AI model drift index
  const modelAccuracyDegradation = (sensorTelemetryDrift * 15.0) + (100 - aiConfidenceRate);

  // Safety Triggers
  const isPlanningCritical = riskFactorPlanning > 0.7 || scheduleDelayDays > 45;
  const isExecutionCritical = craneUtilization > 95 || labourEfficiency < 65;
  const isClimateCritical = concreteEvaporationIndex > 1.0; // Evaporation > 1.0 kg/m2/hr causes cracking
  const isQaCritical = ncrCount > 5 || toleranceBreachVal > 5.0 || qaAuditScore < 85;
  const isShmCritical = liveDisplacement > 25.0; // Max allowed displacement
  const isDigitalCritical = bimClashesCount > 15;
  const isLifecycleCritical = lifeCycleCostTotal > 250;
  const isAiCritical = modelAccuracyDegradation > 15.0;

  const systemAlertTriggered = isPlanningCritical || isExecutionCritical || isClimateCritical || isQaCritical || isShmCritical || isDigitalCritical || isLifecycleCritical || isAiCritical;

  const handleLogTicket = () => {
    if (accounts.length === 0) return;
    const targetAccount = accounts[0];
    const targetDeal = deals.find(d => d.accountId === targetAccount.id) || { id: null };

    let title = '';
    let severity = 'HIGH';

    if (activeTab === 'execution' && craneUtilization > 95) {
      title = `Construction crane safety overload hazard: Operating crane utilization at ${craneUtilization.toFixed(1)}% capacity`;
      severity = 'CRITICAL';
    } else if (activeTab === 'climate' && concreteEvaporationIndex > 1.0) {
      title = `Extreme environment concrete curing warning: Evaporation rate (${concreteEvaporationIndex.toFixed(2)} kg/m²/hr) causes plastic shrinkage cracks`;
      severity = 'HIGH';
    } else if (activeTab === 'qa_qc' && toleranceBreachVal > 5.0) {
      title = `QA/QC tolerance compliance violation: structural displacement delta (${toleranceBreachVal} mm) exceeds 5.0mm structural allowance`;
      severity = 'HIGH';
    } else if (activeTab === 'shm_iot' && liveDisplacement > 25.0) {
      title = `SHM IoT real-time displacement warning: Bridge deck translation (${liveDisplacement}mm) breaches safety threshold`;
      severity = 'CRITICAL';
    } else if (activeTab === 'ai_intel' && modelAccuracyDegradation > 15.0) {
      title = `AI model drift anomaly detected: prediction reliability drops. Triggering retrain process`;
      severity = 'MEDIUM';
    } else {
      title = `Project Lifecycle Intelligence alert: Operational parameters exceeded standard values`;
      severity = 'HIGH';
    }

    const ticket = {
      accountId: targetAccount.id,
      dealId: targetDeal.id,
      title,
      severity,
      assetName: 'Core Sector-A Civil Framework',
      confidence: 93.8
    };

    const res = addTicket(ticket);
    if (res.success) {
      setCrmSuccess(`SSOT OPERATION TICKET: ${res.ticketId} under ${targetAccount.name}`);
      setTimeout(() => setCrmSuccess(''), 5000);
    }
  };

  const handleSelectProjectNode = () => {
    setSelectedElement({
      type: 'Project Lifecycle Core Node',
      id: 'PJ-LIFE-INFRA-4A',
      metrics: {
        InitialCapitalCost: `₹${initialCapitalCost}M`,
        TotalLifeCycleCost: `₹${lifeCycleCostTotal.toFixed(1)}M`,
        ActiveBIMClashes: bimClashesCount,
        QA_AuditScore: `${qaAuditScore}%`,
        CraneUtilization: `${craneUtilization.toFixed(1)}%`,
        EvaporationLossRate: `${concreteEvaporationIndex.toFixed(2)} kg/m²/hr`
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 font-mono text-xs text-black">
      
      {/* Top Banner Tab Controls */}
      <div className="col-span-1 xl:col-span-4 flex flex-wrap border border-border-default bg-gray-50 p-1 gap-1">
        {[
          { id: 'planning', label: 'Project Planning & Risk' },
          { id: 'execution', label: 'Construction Execution & Crane' },
          { id: 'climate', label: 'Climate & Evaporation' },
          { id: 'qa_qc', label: 'QA/QC Audits & NCR' },
          { id: 'shm_iot', label: 'SHM IoT Sensors' },
          { id: 'digital_eng', label: 'BIM & FEM Digital Twin' },
          { id: 'lifecycle', label: 'LCC Life Cycle Costs' },
          { id: 'ai_intel', label: 'AI Confidence & Drift' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 border font-bold uppercase text-[12px] tracking-wide transition-all ${
              activeTab === tab.id
                ? 'bg-black text-white border-border-default shadow-sm'
                : 'bg-white border-gray-300 hover:border-border-default text-gray-700 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Parameters Panel */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Dynamic Parameter Sliders */}
        <div className="zoho-card">
          <div className="zoho-card-header flex justify-between items-center">
            <span className="font-bold uppercase tracking-wider text-[12px]">
              {activeTab === 'planning' && 'PROJECT COST RISK SCENARIOS'}
              {activeTab === 'execution' && 'HEAVY EQUIPMENT & PRODUCTIVITY'}
              {activeTab === 'climate' && 'ENVIRONMENTAL CURING MATRIX'}
              {activeTab === 'qa_qc' && 'NCR AND TOLERANCE COMPLIANCE'}
              {activeTab === 'shm_iot' && 'SENSOR ACCURACY TELEMETRY'}
              {activeTab === 'digital_eng' && 'FEM SOLVER MESH NODE COMPACT'}
              {activeTab === 'lifecycle' && 'DISCOUNT RATE CAPITAL VALUE'}
              {activeTab === 'ai_intel' && 'PREDICTIVE AI SIGNAL DRIFT'}
            </span>
            <span className="text-[12px] bg-black text-white px-1.5 py-0.5 rounded-[8px]-[1px]">OPS INPUTS</span>
          </div>
          <div className="zoho-card-body space-y-4">

          {activeTab === 'planning' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Authorized Project Budget:</span>
                  <span>₹ {projectBudget} Million</span>
                </div>
                <input 
                  type="range" min="50" max="1000" step="10" value={projectBudget} 
                  onChange={(e) => setProjectBudget(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Schedule Critical Path Delay:</span>
                  <span>{scheduleDelayDays} days</span>
                </div>
                <input 
                  type="range" min="0" max="90" value={scheduleDelayDays} 
                  onChange={(e) => setScheduleDelayDays(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Risk Planning Factor index:</span>
                  <span>{(riskFactorPlanning * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0.05" max="0.95" step="0.05" value={riskFactorPlanning} 
                  onChange={(e) => setRiskFactorPlanning(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'execution' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Crane Working Radius ($R$):</span>
                  <span>{craneRadius.toFixed(1)} meters</span>
                </div>
                <input 
                  type="range" min="4.0" max="30.0" step="0.5" value={craneRadius} 
                  onChange={(e) => setCraneRadius(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Suspended Load Weight:</span>
                  <span>{loadWeight.toFixed(1)} Tons</span>
                </div>
                <input 
                  type="range" min="1.0" max="25.0" step="0.5" value={loadWeight} 
                  onChange={(e) => setLoadWeight(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Max Rated Structural Crane capacity:</span>
                  <span>{craneCapacityMax} Tons</span>
                </div>
                <input 
                  type="range" min="5" max="50" value={craneCapacityMax} 
                  onChange={(e) => setCraneCapacityMax(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Workforce Labour Efficiency:</span>
                  <span>{labourEfficiency}%</span>
                </div>
                <input 
                  type="range" min="40" max="100" value={labourEfficiency} 
                  onChange={(e) => setLabourEfficiency(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'climate' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Ambient Site Temperature:</span>
                  <span>{ambientTemp} °C</span>
                </div>
                <input 
                  type="range" min="15" max="50" value={ambientTemp} 
                  onChange={(e) => setAmbientTemp(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Relative Humidity ($rH$):</span>
                  <span>{relativeHumidity}%</span>
                </div>
                <input 
                  type="range" min="10" max="95" value={relativeHumidity} 
                  onChange={(e) => setRelativeHumidity(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Annual Rainfall:</span>
                  <span>{annualRainfall} mm</span>
                </div>
                <input 
                  type="range" min="200" max="3000" step="50" value={annualRainfall} 
                  onChange={(e) => setAnnualRainfall(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'qa_qc' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Logged NCR (Non-Conformance Reports):</span>
                  <span>{ncrCount} reports open</span>
                </div>
                <input 
                  type="range" min="0" max="10" value={ncrCount} 
                  onChange={(e) => setNcrCount(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Measured Component Tolerance deviation:</span>
                  <span>{toleranceBreachVal.toFixed(1)} mm</span>
                </div>
                <input 
                  type="range" min="0.5" max="8.0" step="0.1" value={toleranceBreachVal} 
                  onChange={(e) => setToleranceBreachVal(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>QA Compliance Audit Score:</span>
                  <span>{qaAuditScore}%</span>
                </div>
                <input 
                  type="range" min="70" max="100" value={qaAuditScore} 
                  onChange={(e) => setQaAuditScore(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'shm_iot' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Live Telemetry Strain value:</span>
                  <span>{sampledStrain} microstrain ($\mu\epsilon$)</span>
                </div>
                <input 
                  type="range" min="10" max="400" value={sampledStrain} 
                  onChange={(e) => setSampledStrain(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Live Concrete Deck Displacement:</span>
                  <span>{liveDisplacement.toFixed(1)} mm</span>
                </div>
                <input 
                  type="range" min="1.0" max="40.0" step="0.5" value={liveDisplacement} 
                  onChange={(e) => setLiveDisplacement(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Sensor Ambient Noise Floor:</span>
                  <span>{sensorNoiseFloor.toFixed(3)} mV</span>
                </div>
                <input 
                  type="range" min="0.005" max="0.2" step="0.005" value={sensorNoiseFloor} 
                  onChange={(e) => setSensorNoiseFloor(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'digital_eng' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>BIM Architectural Clashes detected:</span>
                  <span>{bimClashesCount} active clashes</span>
                </div>
                <input 
                  type="range" min="0" max="25" value={bimClashesCount} 
                  onChange={(e) => setBimClashesCount(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>FEM Solver Mesh Density:</span>
                  <span>{femMeshNodes.toLocaleString()} nodes</span>
                </div>
                <input 
                  type="range" min="10000" max="150000" step="5000" value={femMeshNodes} 
                  onChange={(e) => setFemMeshNodes(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'lifecycle' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Initial Capital Cost ($C_i$):</span>
                  <span>₹ {initialCapitalCost} Million</span>
                </div>
                <input 
                  type="range" min="20" max="300" value={initialCapitalCost} 
                  onChange={(e) => setInitialCapitalCost(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Annual Maintenance ($C_m$):</span>
                  <span>₹ {annualMaintenanceCost.toFixed(1)} Million/yr</span>
                </div>
                <input 
                  type="range" min="0.5" max="15.0" step="0.1" value={annualMaintenanceCost} 
                  onChange={(e) => setAnnualMaintenanceCost(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Designed Service Lifecycle:</span>
                  <span>{lifecycleSpan} years</span>
                </div>
                <input 
                  type="range" min="10" max="100" step="5" value={lifecycleSpan} 
                  onChange={(e) => setLifecycleSpan(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'ai_intel' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Active AI Confidence Rate:</span>
                  <span>{aiConfidenceRate.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="70" max="99" step="0.5" value={aiConfidenceRate} 
                  onChange={(e) => setAiConfidenceRate(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Sensor Telemetry Parameter Drift:</span>
                  <span>{(sensorTelemetryDrift * 100).toFixed(1)}% drift</span>
                </div>
                <input 
                  type="range" min="0.01" max="0.15" step="0.01" value={sensorTelemetryDrift} 
                  onChange={(e) => setSensorTelemetryDrift(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Diagnostic Project Node trigger */}
        <button
          onClick={handleSelectProjectNode}
          className="w-full py-2 bg-white text-black border border-border-default hover:bg-black hover:text-white font-bold uppercase text-[12px] transition-colors shadow-sm hover:shadow-none translate-y-0 hover:translate-y-0.5"
        >
          INSPECT CORE LIFECYCLE NODE
        </button>

      </div>

      {/* Main Results Display & CAD Viewport */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Real-time Math Output Card */}
        <div className="zoho-card">
          <div className="zoho-card-header flex justify-between items-center">
            <span className="font-bold uppercase tracking-wider text-[12px]">DERIVED MATH VECTORS</span>
            <span className="text-[12px] bg-black text-white px-1.5 py-0.5 rounded-[8px]-[1px]">OUTPUTS</span>
          </div>
          <div className="zoho-card-body space-y-3">

          {activeTab === 'planning' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Weighted Planning Risk Index:</span>
                <span className="font-mono font-bold">{(riskFactorPlanning * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Cost Risk Exposure sum:</span>
                <span className="font-mono font-bold">₹ {(projectBudget * riskFactorPlanning).toFixed(1)} M</span>
              </div>
              <div className="flex justify-between border-t border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Schedule Critical-Path Alert:</span>
                <span className="font-mono uppercase">{scheduleDelayDays > 30 ? 'CRITICAL SLIPPAGE' : 'STABLE'} ({scheduleDelayDays} days)</span>
              </div>
            </div>
          )}

          {activeTab === 'execution' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Total Workforce Labour Factor:</span>
                <span className="font-mono font-bold">{labourEfficiency}% PRODUCTIVE</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Crane Operational Load Moment:</span>
                <span className="font-mono font-bold">{(loadWeight * craneRadius).toFixed(1)} T·m</span>
              </div>
              <div className="flex justify-between border-t-2 border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Crane Capacity Utilization Index:</span>
                <span className="font-mono">{craneUtilization.toFixed(1)}%</span>
              </div>
              <div className="pt-1 text-[12px] text-gray-500 font-bold">
                {craneUtilization > 95 ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-border-default block text-center">
                    BREACH: Lift operation exceeds safe crane load radius limits! Tipping danger!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Crane structural operations are within margins.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'climate' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Concrete Evaporation rate:</span>
                <span className="font-mono font-bold">{concreteEvaporationIndex.toFixed(2)} kg/m²/hr</span>
              </div>
              <div className="flex justify-between border-b border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Curing Cracking Risk level:</span>
                <span className="font-mono uppercase">{concreteEvaporationIndex > 1.0 ? 'CRITICAL (BREACH)' : 'LOW'}</span>
              </div>
              <p className="text-[12px] text-gray-500 font-bold leading-normal pt-1">
                * Environmental action: Ambient evaporation &gt; 1.0 kg/m²/hr requires immediate fogging curing or aliphatic compound misting to prevent micro-cracks.
              </p>
            </div>
          )}

          {activeTab === 'qa_qc' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Open NCR Quality Index:</span>
                <span className="font-mono font-bold">{ncrCount} defects registered</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>QA compliance Audit:</span>
                <span className="font-mono font-bold">{qaAuditScore}% conformance</span>
              </div>
              <div className="flex justify-between border-t border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Maximum Concrete Tolerance Deviation:</span>
                <span className="font-mono">{toleranceBreachVal.toFixed(1)} mm</span>
              </div>
              <div className="pt-1 text-[12px] text-gray-500 font-bold">
                {toleranceBreachVal > 5.0 ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-border-default block text-center">
                    BREACH: Tolerance deviation exceeds structural design code limit (5mm)!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Alignment parameters are within tolerance.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'shm_iot' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Live strain telemetry value:</span>
                <span className="font-mono font-bold">{sampledStrain} $\mu\epsilon$</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Sensor noise spectral margin:</span>
                <span className="font-mono font-bold">{sensorNoiseFloor.toFixed(3)} mV</span>
              </div>
              <div className="flex justify-between border-t-2 border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Deck displacement translation:</span>
                <span className="font-mono">{liveDisplacement.toFixed(1)} mm</span>
              </div>
              <div className="pt-1 text-[12px] text-gray-500 font-bold">
                {liveDisplacement > 25.0 ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-border-default block text-center">
                    DANGER: Live deck displacement exceeds maximum structural limits (25mm)!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ IoT strain & deck translations stable.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'digital_eng' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Active BIM clash index:</span>
                <span className="font-mono font-bold">{bimClashesCount} structural clashes</span>
              </div>
              <div className="flex justify-between border-b border-border-default py-1 bg-black text-white px-1 font-black">
                <span>FEM Mesh Solver Nodes count:</span>
                <span className="font-mono">{femMeshNodes.toLocaleString()} DOF</span>
              </div>
              <p className="text-[12px] text-gray-500 font-bold leading-normal pt-1">
                * BIM coordination note: Complete clash resolution prior to issuing final construction blueprint files to prevent field coordination failures.
              </p>
            </div>
          )}

          {activeTab === 'lifecycle' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Capital Cost ($C_i$):</span>
                <span className="font-mono font-bold">₹ {initialCapitalCost} Million</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>NPV Maintenance Cost ($C_m$):</span>
                <span className="font-mono font-bold">₹ {npvMaintenance.toFixed(1)} Million</span>
              </div>
              <div className="flex justify-between border-t-2 border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Final Life Cycle Cost (LCC):</span>
                <span className="font-mono">₹ {lifeCycleCostTotal.toFixed(1)} Million</span>
              </div>
            </div>
          )}

          {activeTab === 'ai_intel' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Neural model classification rate:</span>
                <span className="font-mono font-bold">{aiConfidenceRate.toFixed(1)}% Confidence</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Sensor drift drift:</span>
                <span className="font-mono font-bold">{(sensorTelemetryDrift * 100).toFixed(1)}% / month</span>
              </div>
              <div className="flex justify-between border-t border-border-default py-1 bg-black text-white px-1 font-black">
                <span>AI Accuracy Degradation Index:</span>
                <span className="font-mono">{modelAccuracyDegradation.toFixed(2)} %</span>
              </div>
              <div className="pt-1 text-[12px] text-gray-500 font-bold">
                {modelAccuracyDegradation > 15.0 ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-border-default block text-center">
                    BREACH: High AI model drift! retrain recommended to sync weights.
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Neural network weights are calibrated.</span>
                )}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Dynamic plotting chart CAD layout */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <span className="font-bold uppercase tracking-wider text-[12px]">PROJECT LOGISTICS PLOT</span>
          </div>
          <div className="zoho-card-body space-y-3">
            <div className="h-[180px] w-full border border-border-default bg-white relative overflow-hidden select-none">
            <svg viewBox="0 0 520 180" className="w-full h-full absolute inset-0">
              <rect width="100%" height="100%" fill="url(#grid)" />

              {activeTab === 'planning' ? (
                <g>
                  {/* Gantt Timeline visualization */}
                  <text x="20" y="30" fontSize="8" fontWeight="bold">Task 1: Geotechnical Drills</text>
                  <rect x="140" y="22" width="100" height="10" fill="none" stroke="#000000" strokeWidth="1.5" />
                  
                  <text x="20" y="60" fontSize="8" fontWeight="bold">Task 2: Foundation Pour</text>
                  <rect x="230" y="52" width="120" height="10" fill="none" stroke="#000000" strokeWidth="1.5" />
                  
                  <text x="20" y="90" fontSize="8" fontWeight="bold">Task 3: Superstructure</text>
                  <rect x="340" y="82" width="160" height="10" fill="none" stroke="#000000" strokeWidth="1.5" />

                  {/* Delay overlay line */}
                  <line x1={230 + scheduleDelayDays * 2} y1="20" x2={230 + scheduleDelayDays * 2} y2="120" stroke="#000000" strokeWidth="1.5" strokeDasharray="3,3" />
                  <text x={235 + scheduleDelayDays * 2} y="130" fontSize="7" fontWeight="black">PROJECT DELAY DELTA</text>
                </g>
              ) : activeTab === 'lifecycle' ? (
                <g>
                  {/* Cost distribution bar */}
                  <text x="20" y="40" fontSize="8" fontWeight="bold">Capital Cost: ₹{initialCapitalCost}M</text>
                  <rect x="140" y="32" width={initialCapitalCost * 1.2} height="12" fill="none" stroke="#000000" strokeWidth="1.5" />

                  <text x="20" y="85" fontSize="8" fontWeight="bold">NPV Maintenance: ₹{npvMaintenance.toFixed(0)}M</text>
                  <rect x="140" y="77" width={npvMaintenance * 1.2} height="12" fill="#000000" />

                  <line x1="20" y1="130" x2="480" y2="130" stroke="#000000" strokeWidth="1" />
                  <text x="20" y="145" fontSize="8" fontWeight="black">TOTAL LIFE-CYCLE VALUE (LCC): ₹{lifeCycleCostTotal.toFixed(1)}M</text>
                </g>
              ) : (
                <g>
                  {/* Generic structural wireframe grid mapping nodes */}
                  <circle cx="100" cy="50" r="5" fill="none" stroke="#000000" strokeWidth="1.5" />
                  <circle cx="200" cy="50" r="5" fill="none" stroke="#000000" strokeWidth="1.5" />
                  <circle cx="300" cy="50" r="5" fill="none" stroke="#000000" strokeWidth="1.5" />
                  <circle cx="150" cy="120" r="5" fill="#000000" />
                  <circle cx="250" cy="120" r="5" fill="none" stroke="#000000" strokeWidth="1.5" />
                  
                  {/* Connection lines */}
                  <line x1="105" y1="50" x2="195" y2="50" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="205" y1="50" x2="295" y2="50" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="100" y1="55" x2="148" y2="117" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="200" y1="55" x2="152" y2="117" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="200" y1="55" x2="248" y2="117" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="300" y1="55" x2="252" y2="117" stroke="#9ca3af" strokeWidth="1" />
                  
                  <text x="155" y="132" fontSize="7" fontWeight="black">CRITICAL PATH NODE</text>
                </g>
              )}
            </svg>
          </div>
          </div>
        </div>

        {/* CRM Compliance Lock In system */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <span className="font-bold uppercase tracking-wider text-[12px]">CRM INTEGRITY LOCK-IN</span>
          </div>
          <div className="zoho-card-body space-y-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div>
              <p className="text-[12px] uppercase font-black flex items-center gap-1.5 text-black">
                {systemAlertTriggered ? (
                  <>
                    <ShieldAlert className="h-4.5 w-4.5 text-black" />
                    PROJECT BOUNDARIES BREACHED
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5 text-black" />
                    PROJECT PARAMETERS APPROVED
                  </>
                )}
              </p>
              <p className="text-[12px] text-gray-500 font-mono mt-0.5 leading-relaxed">
                Aggregates execution logistics. Escalates extreme environmental and safety parameters to CRM.
              </p>
            </div>
            
            <button
              onClick={handleLogTicket}
              className={`px-4 py-2 border-2 font-bold uppercase text-[12px] transition-all cursor-pointer shadow-sm hover:shadow-none translate-y-0 hover:translate-y-0.5 ${
                systemAlertTriggered 
                  ? 'bg-black text-white border-border-default' 
                  : 'bg-white text-black border-border-default hover:bg-gray-100'
              }`}
            >
              LOG OPERATIONS TICKET
            </button>
          </div>

          {crmSuccess && (
            <div className="p-2 border border-border-default bg-gray-50 text-black font-black uppercase text-[12px] text-center">
              {crmSuccess}
            </div>
          )}
          </div>
        </div>

      </div>

    </div>
  );
}
