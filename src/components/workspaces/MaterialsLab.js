import React, { useState, useEffect, useRef } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { FlaskConical, ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';

export default function MaterialsLab({ selectedElement, setSelectedElement }) {
  const [activeTab, setActiveTab] = useState('aggregate'); // aggregate, cement, concrete_mix, steel, water, bitumen, durability, test_matrix
  
  // 1. Sand & Aggregates State
  const [cumulativeRetained, setCumulativeRetained] = useState([0, 5, 15, 30, 65, 85, 95, 100]); // cumulative % retained on standard sieves
  const [crushingW1, setCrushingW1] = useState(3.0); // kg (total sample)
  const [crushingW2, setCrushingW2] = useState(0.42); // kg (passing 2.36mm after load)

  // 2. Cement State
  const [cementFineness, setCementFineness] = useState(320); // m2/kg (Blaine)
  const [vicatConsistency, setVicatConsistency] = useState(30); // % water for standard consistency
  const [initialSettingTime, setInitialSettingTime] = useState(45); // minutes
  const [finalSettingTime, setFinalSettingTime] = useState(240); // minutes

  // 3. Concrete Mix State
  const [concreteGrade, setConcreteGrade] = useState(35); // M35 (Characteristic strength fck)
  const [stdDeviation, setStdDeviation] = useState(5.0); // MPa (sigma based on quality control)
  const [slumpMetric, setSlumpMetric] = useState(85); // mm
  const [waterCementRatio, setWaterCementRatio] = useState(0.42);

  // 4. Steel State
  const [yieldStrength, setYieldStrength] = useState(500); // MPa (Fe500)
  const [ultimateStrength, setUltimateStrength] = useState(620); // MPa
  const [fatigueCycles, setFatigueCycles] = useState(1e5); // N cycles
  const [appliedDeltaStress, setAppliedDeltaStress] = useState(150); // MPa (delta sigma)
  const [initialCrackSize, setInitialCrackSize] = useState(0.5); // mm (a0)

  // 5. Water Quality State
  const [waterPH, setWaterPH] = useState(7.2);
  const [chloridesPPM, setChloridesPPM] = useState(320); // mg/L
  const [sulfatesPPM, setSulfatesPPM] = useState(210); // mg/L
  const [totalDissolvedSolids, setTotalDissolvedSolids] = useState(1200); // mg/L

  // 6. Admixtures & Bitumen State
  const [admixtureDosage, setAdmixtureDosage] = useState(0.8); // % by weight of cement
  const [bitumenPenetration, setBitumenPenetration] = useState(65); // 0.1 mm (Grade 60/70)
  const [marshallStability, setMarshallStability] = useState(11.2); // kN

  // 7. Durability State
  const [carbonationK, setCarbonationK] = useState(2.4); // mm/year^0.5 (diff coefficient)
  const [serviceYears, setServiceYears] = useState(25); 
  const [chlorideCoeff, setChlorideCoeff] = useState(1.5e-12); // m2/s
  const [rebarCoverDepth, setRebarCoverDepth] = useState(40); // mm

  // CRM Store Integration
  const accounts = useCRMStore(state => state.accounts);
  const deals = useCRMStore(state => state.deals);
  const addTicket = useCRMStore(state => state.addTicket);
  const [crmSuccess, setCrmSuccess] = useState('');

  // Sieve index array
  const sieveSizes = ['4.75mm', '2.36mm', '1.18mm', '600μm', '300μm', '150μm', '75μm', 'Pan'];

  // Calculations

  // Sand & Aggregates FM
  const finenessModulus = cumulativeRetained.reduce((acc, curr) => acc + curr, 0) / 100;
  const aggregateCrushingValue = (crushingW2 / crushingW1) * 100; // %

  // Concrete Target Mean Strength (IS 10262)
  const concreteTargetStrength = concreteGrade + 1.65 * stdDeviation; // f'ck = fck + 1.65*sigma
  const estimatedFlexuralStrength = 0.7 * Math.sqrt(concreteGrade); // f_cr = 0.7 * sqrt(fck)
  const structuralModulusOfElasticity = 5000 * Math.sqrt(concreteGrade); // Ec = 5000 * sqrt(fck)

  // Steel Fatigue Paris Law crack growth
  // da/dN = C * (dK)^m
  // dK = dSigma * sqrt(pi * a) * F  (assuming F = 1.12)
  const crackSizeMeters = initialCrackSize / 1000;
  const deltaK = appliedDeltaStress * Math.sqrt(Math.PI * crackSizeMeters) * 1.12; // MPa*m^0.5
  // Paris law constants for structural steel
  const parisC = 2e-11; 
  const parisM = 3.0;
  const crackGrowthRate = parisC * (deltaK ** parisM); // m/cycle
  const finalCrackSize = (crackSizeMeters + (crackGrowthRate * fatigueCycles)) * 1000; // back to mm

  // Durability
  const carbonationDepth = carbonationK * Math.sqrt(serviceYears); // d = k * sqrt(t)

  // Safety evaluations
  const isAggregateCritical = aggregateCrushingValue > 30; // >30% crushing value is unacceptable for wearing surfaces
  const isCementCritical = initialSettingTime < 30 || finalSettingTime > 600; // IS limit: min 30 mins
  const isConcreteMixCritical = concreteTargetStrength < concreteGrade;
  const isSteelCritical = yieldStrength < 500 || finalCrackSize > rebarCoverDepth;
  const isWaterCritical = waterPH < 6.0 || waterPH > 9.0 || chloridesPPM > 500 || sulfatesPPM > 400;
  const isBitumenCritical = marshallStability < 8.2;
  const isDurabilityCritical = carbonationDepth >= rebarCoverDepth;

  const systemAlertTriggered = isAggregateCritical || isCementCritical || isConcreteMixCritical || isSteelCritical || isWaterCritical || isBitumenCritical || isDurabilityCritical;

  const handleLogTicket = () => {
    if (accounts.length === 0) return;
    const targetAccount = accounts[0];
    const targetDeal = deals.find(d => d.accountId === targetAccount.id) || { id: null };

    let title = '';
    let severity = 'HIGH';

    if (activeTab === 'aggregate' && isAggregateCritical) {
      title = `Aggregate crushing strength breach: Crushing value (${aggregateCrushingValue.toFixed(1)}%) exceeds maximum limit (30%)`;
      severity = 'HIGH';
    } else if (activeTab === 'cement' && isCementCritical) {
      title = `Cement setting time violation: Initial setting time ${initialSettingTime} min is below IS 456 safe limit`;
      severity = 'HIGH';
    } else if (activeTab === 'steel' && finalCrackSize > rebarCoverDepth) {
      title = `Paris-Law steel fatigue crack growth warning: crack size (${finalCrackSize.toFixed(2)}mm) exceeds cover limit`;
      severity = 'CRITICAL';
    } else if (activeTab === 'water' && isWaterCritical) {
      title = `Water quality audit failure: pH/Chlorides exceed concrete mixing thresholds (Cl- = ${chloridesPPM}mg/L)`;
      severity = 'HIGH';
    } else if (activeTab === 'durability' && isDurabilityCritical) {
      title = `Concrete carbonation ingress alert: Carbonation depth (${carbonationDepth.toFixed(1)}mm) matches rebar cover`;
      severity = 'CRITICAL';
    } else {
      title = `Materials Intelligence Lab alert: Physical laboratory testing threshold breach`;
      severity = 'MEDIUM';
    }

    const ticket = {
      accountId: targetAccount.id,
      dealId: targetDeal.id,
      title,
      severity,
      assetName: 'Materials Lab Testing Matrix',
      confidence: 97.2
    };

    const res = addTicket(ticket);
    if (res.success) {
      setCrmSuccess(`SSOT LABORATORY TICKET: ${res.ticketId} under ${targetAccount.name}`);
      setTimeout(() => setCrmSuccess(''), 5000);
    }
  };

  const handleSelectMaterialNode = () => {
    setSelectedElement({
      type: 'Concrete Lab Specimen Cube',
      id: 'MT-CUBE-M35-08',
      metrics: {
        SpecimenType: '150mm Cast Cube',
        ConcreteGrade: `M${concreteGrade}`,
        TestedTargetStrength: `${concreteTargetStrength.toFixed(1)} MPa`,
        MeasuredSlumpValue: `${slumpMetric} mm`,
        WaterCementRatio: waterCementRatio,
        StructuralElasticModulus: `${structuralModulusOfElasticity.toFixed(0)} MPa`
      }
    });
  };

  // Custom sieve change handler
  const handleSieveChange = (index, value) => {
    const updated = [...cumulativeRetained];
    updated[index] = Math.min(100, Math.max(0, Number(value)));
    setCumulativeRetained(updated);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 font-mono text-xs text-black">
      
      {/* Top Banner Tab Controls */}
      <div className="col-span-1 xl:col-span-4 flex flex-wrap border-2 border-black bg-gray-50 p-1 gap-1">
        {[
          { id: 'aggregate', label: 'Sand & Aggregates' },
          { id: 'cement', label: 'Cement Quality' },
          { id: 'concrete_mix', label: 'Concrete Mix (IS 10262)' },
          { id: 'steel', label: 'Steel & Paris Law Fatigue' },
          { id: 'water', label: 'Water Quality Standards' },
          { id: 'bitumen', label: 'Bitumen & Admixtures' },
          { id: 'durability', label: 'Ingress & Durability' },
          { id: 'test_matrix', label: 'Testing Standard Matrix' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 border font-bold uppercase text-[9px] tracking-wide transition-all ${
              activeTab === tab.id
                ? 'bg-black text-white border-black shadow-[1px_1px_0px_rgba(0,0,0,0.15)]'
                : 'bg-white border-gray-300 hover:border-black text-gray-700 hover:text-black'
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
          <div className="zoho-card-header">
            <FlaskConical className="h-3.5 w-3.5" />
            <span>
              {activeTab === 'aggregate' && 'AGGREGATE GRADATION & CRUSHING'}
              {activeTab === 'cement' && 'VICAT & BLAINE PHYSICAL INDEX'}
              {activeTab === 'concrete_mix' && 'STRENGTH TARGET & WORKABILITY'}
              {activeTab === 'steel' && 'STEEL FATIGUE CYCLES'}
              {activeTab === 'water' && 'CHEMICAL MIX WATER LIMITS'}
              {activeTab === 'bitumen' && 'MARSHALL STABILITY PARAMETERS'}
              {activeTab === 'durability' && 'CONCRETE INGRESS DEPTHS'}
              {activeTab === 'test_matrix' && 'STANDARD REFERENCE METRIC TABLES'}
            </span>
            <span className="ml-auto text-[8px] bg-black text-white px-1 py-0.5">LAB INPUTS</span>
          </div>
          <div className="zoho-card-body">

          {activeTab === 'aggregate' && (
            <div className="space-y-3">
              <p className="font-bold text-[9px] border-b border-black pb-1 uppercase">Cumulative % Retained on Sieves:</p>
              <div className="grid grid-cols-2 gap-2 text-[9px]">
                {sieveSizes.map((size, idx) => (
                  <div key={idx} className="flex justify-between items-center border border-black p-1">
                    <span>{size}:</span>
                    <input 
                      type="number" max="100" min="0" value={cumulativeRetained[idx]} 
                      onChange={(e) => handleSieveChange(idx, e.target.value)}
                      className="w-12 text-right border-l border-black p-0.5 font-mono"
                    />
                  </div>
                ))}
              </div>

              <div className="border-t border-black pt-3 space-y-3">
                <p className="font-bold text-[9px] uppercase">Aggregate Crushing Value:</p>
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Total Sample Weight ($W_1$):</span>
                    <span>{crushingW1.toFixed(2)} kg</span>
                  </div>
                  <input 
                    type="range" min="1.0" max="5.0" step="0.1" value={crushingW1} 
                    onChange={(e) => setCrushingW1(Number(e.target.value))} 
                    className="w-full accent-black"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Weight passing 2.36mm Sieve ($W_2$):</span>
                    <span>{crushingW2.toFixed(2)} kg</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="1.5" step="0.02" value={crushingW2} 
                    onChange={(e) => setCrushingW2(Number(e.target.value))} 
                    className="w-full accent-black"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cement' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Blaine Fineness:</span>
                  <span>{cementFineness} m²/kg</span>
                </div>
                <input 
                  type="range" min="200" max="450" value={cementFineness} 
                  onChange={(e) => setCementFineness(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Vicat Standard Consistency Water:</span>
                  <span>{vicatConsistency}%</span>
                </div>
                <input 
                  type="range" min="22" max="38" value={vicatConsistency} 
                  onChange={(e) => setVicatConsistency(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Initial Setting Time:</span>
                  <span>{initialSettingTime} minutes</span>
                </div>
                <input 
                  type="range" min="15" max="90" value={initialSettingTime} 
                  onChange={(e) => setInitialSettingTime(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Final Setting Time:</span>
                  <span>{finalSettingTime} minutes</span>
                </div>
                <input 
                  type="range" min="120" max="720" value={finalSettingTime} 
                  onChange={(e) => setFinalSettingTime(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'concrete_mix' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Characteristic Strength ({"$f_{ck}$"}):</span>
                  <span>M{concreteGrade} MPa</span>
                </div>
                <input 
                  type="range" min="15" max="80" step="5" value={concreteGrade} 
                  onChange={(e) => setConcreteGrade(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Standard Deviation ($\sigma$):</span>
                  <span>{stdDeviation.toFixed(1)} MPa</span>
                </div>
                <input 
                  type="range" min="2.0" max="6.5" step="0.1" value={stdDeviation} 
                  onChange={(e) => setStdDeviation(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Measured Concrete Slump:</span>
                  <span>{slumpMetric} mm</span>
                </div>
                <input 
                  type="range" min="25" max="200" value={slumpMetric} 
                  onChange={(e) => setSlumpMetric(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Water-Cement Ratio (w/c):</span>
                  <span>{waterCementRatio}</span>
                </div>
                <input 
                  type="range" min="0.30" max="0.65" step="0.01" value={waterCementRatio} 
                  onChange={(e) => setWaterCementRatio(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'steel' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Steel Yield Strength ($f_y$):</span>
                  <span>Fe {yieldStrength} MPa</span>
                </div>
                <input 
                  type="range" min="250" max="600" step="50" value={yieldStrength} 
                  onChange={(e) => setYieldStrength(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Cyclic Stress Amplitude ($\Delta\sigma$):</span>
                  <span>{appliedDeltaStress} MPa</span>
                </div>
                <input 
                  type="range" min="50" max="300" step="10" value={appliedDeltaStress} 
                  onChange={(e) => setAppliedDeltaStress(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Initial Crack Size ($a_0$):</span>
                  <span>{initialCrackSize.toFixed(2)} mm</span>
                </div>
                <input 
                  type="range" min="0.1" max="5.0" step="0.1" value={initialCrackSize} 
                  onChange={(e) => setInitialCrackSize(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Applied Load Fatigue Cycles ($N$):</span>
                  <span>{fatigueCycles.toExponential(0)} cycles</span>
                </div>
                <input 
                  type="range" min="10000" max="500000" step="10000" value={fatigueCycles} 
                  onChange={(e) => setFatigueCycles(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'water' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Water pH level:</span>
                  <span>{waterPH}</span>
                </div>
                <input 
                  type="range" min="4.0" max="10.0" step="0.1" value={waterPH} 
                  onChange={(e) => setWaterPH(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Chlorides ($Cl^-$ concentration):</span>
                  <span>{chloridesPPM} mg/L (ppm)</span>
                </div>
                <input 
                  type="range" min="50" max="1000" step="10" value={chloridesPPM} 
                  onChange={(e) => setChloridesPPM(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Sulfates ({"$SO_4^{2-}$"} concentration):</span>
                  <span>{sulfatesPPM} mg/L</span>
                </div>
                <input 
                  type="range" min="50" max="800" step="10" value={sulfatesPPM} 
                  onChange={(e) => setSulfatesPPM(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Total Dissolved Solids (TDS):</span>
                  <span>{totalDissolvedSolids} mg/L</span>
                </div>
                <input 
                  type="range" min="100" max="3000" step="50" value={totalDissolvedSolids} 
                  onChange={(e) => setTotalDissolvedSolids(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'bitumen' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Superplasticizer Admixture Dosage:</span>
                  <span>{admixtureDosage}% by cement wt</span>
                </div>
                <input 
                  type="range" min="0.1" max="2.0" step="0.1" value={admixtureDosage} 
                  onChange={(e) => setAdmixtureDosage(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Bitumen Penetration Value:</span>
                  <span>{bitumenPenetration} (0.1 mm unit)</span>
                </div>
                <input 
                  type="range" min="30" max="100" step="5" value={bitumenPenetration} 
                  onChange={(e) => setBitumenPenetration(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Marshall Stability Load:</span>
                  <span>{marshallStability} kN</span>
                </div>
                <input 
                  type="range" min="5.0" max="18.0" step="0.2" value={marshallStability} 
                  onChange={(e) => setMarshallStability(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'durability' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Carbonation Coefficient ($k$):</span>
                  <span>{carbonationK} mm/year^0.5</span>
                </div>
                <input 
                  type="range" min="0.5" max="5.0" step="0.1" value={carbonationK} 
                  onChange={(e) => setCarbonationK(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Concrete Service Age ($t$):</span>
                  <span>{serviceYears} years</span>
                </div>
                <input 
                  type="range" min="1" max="100" value={serviceYears} 
                  onChange={(e) => setServiceYears(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Nominal Rebar Cover Depth:</span>
                  <span>{rebarCoverDepth} mm</span>
                </div>
                <input 
                  type="range" min="15" max="75" value={rebarCoverDepth} 
                  onChange={(e) => setRebarCoverDepth(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'test_matrix' && (
            <div className="space-y-2 text-[9.5px]">
              <p className="font-bold border-b border-black pb-1">KEY CIVIL TEST STANDARD CODES</p>
              <div className="border border-black overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100 border-b border-black font-black uppercase text-[8px]">
                      <th className="p-1 border-r border-black">Test Description</th>
                      <th className="p-1 border-r border-black">IS Code</th>
                      <th className="p-1">ASTM / BS Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-1 border-r border-black font-bold">Compressive Strength</td>
                      <td className="p-1 border-r border-black">IS 516 (15cm cubes)</td>
                      <td className="p-1">ASTM C39 (cylinders)</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 border-r border-black font-bold">Ultrasonic Pulse Velocity</td>
                      <td className="p-1 border-r border-black">IS 13311 (Part 1)</td>
                      <td className="p-1">ASTM C597</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 border-r border-black font-bold">Rebound Hammer</td>
                      <td className="p-1 border-r border-black">IS 13311 (Part 2)</td>
                      <td className="p-1">ASTM C805</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 border-r border-black font-bold">California Bearing Ratio</td>
                      <td className="p-1 border-r border-black">IS 2720 (Part 16)</td>
                      <td className="p-1">ASTM D1883</td>
                    </tr>
                    <tr>
                      <td className="p-1 border-r border-black font-bold">Standard Penetration Test</td>
                      <td className="p-1 border-r border-black">IS 2131</td>
                      <td className="p-1">ASTM D1586</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Diagnostic Specimen Node trigger */}
        <button
          onClick={handleSelectMaterialNode}
          className="w-full py-2 bg-white text-black border-2 border-black hover:bg-black hover:text-white font-bold uppercase text-[9px] transition-colors shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-0.5"
        >
          INSPECT CONCRETE TEST CUBES
        </button>

      </div>

      {/* Main Results Display & CAD Viewport */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Real-time Math Output Card */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Sliders className="h-3.5 w-3.5" />
            <span>DERIVED MATH VECTORS</span>
            <span className="ml-auto text-[8px] bg-black text-white px-1">OUTPUTS</span>
          </div>
          <div className="zoho-card-body">

          {activeTab === 'aggregate' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1 bg-black text-white px-1 font-black">
                <span>Fineness Modulus (FM) of Sand:</span>
                <span className="font-mono">{finenessModulus.toFixed(2)}</span>
              </div>
              <p className="text-[8.5px] font-bold text-gray-500 mt-1 uppercase">
                * Soil Classification: {finenessModulus > 3.2 ? 'Coarse Aggregate' : finenessModulus > 2.9 ? 'Coarse Sand' : finenessModulus > 2.6 ? 'Medium Sand' : finenessModulus > 2.2 ? 'Fine Sand' : 'Very Fine Clay/Silt'}
              </p>
              
              <div className="flex justify-between border-b border-gray-100 py-1 pt-2 font-bold bg-gray-50 px-1 border-t border-black">
                <span>Aggregate Crushing Value (ACV):</span>
                <span className={`font-mono ${isAggregateCritical ? 'underline font-black' : ''}`}>{aggregateCrushingValue.toFixed(2)}%</span>
              </div>
              <div className="pt-1 text-[8.5px] text-gray-500 font-bold">
                {isAggregateCritical ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-black block text-center">
                    BREACH: Crushing strength &gt; 30% is unsuitable for heavy wearing pavement!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Crushing value satisfies Indian road specs (IRC).</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cement' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Cement Specific Surface Area:</span>
                <span className="font-mono font-bold">{cementFineness} m²/kg</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Water Consistency Standard Volume:</span>
                <span className="font-mono font-bold">{(vicatConsistency * 0.78).toFixed(1)} ml / 300g sample</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Setting Times (Initial / Final):</span>
                <span className="font-mono">{initialSettingTime} min / {finalSettingTime} min</span>
              </div>
              <div className="pt-1 text-[8.5px] text-gray-500 font-bold">
                {initialSettingTime < 30 ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-black block text-center">
                    BREACH: Cement sets too rapidly! Initial limit is minimum 30 minutes under IS 4031.
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Cement hydration setting parameters are nominal.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'concrete_mix' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Target Mean Strength ({"$f'_{ck}$"}):</span>
                <span className="font-mono font-bold">{concreteTargetStrength.toFixed(2)} MPa</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Derived Modulus of Elasticity ($E_c$):</span>
                <span className="font-mono font-bold">{structuralModulusOfElasticity.toFixed(0)} MPa</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Flexural Strength ({"$f_{cr}$"}):</span>
                <span className="font-mono font-bold">{estimatedFlexuralStrength.toFixed(2)} MPa</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Workability State (Slump):</span>
                <span className="font-mono uppercase">
                  {slumpMetric > 150 ? 'High (Flowing)' : slumpMetric > 100 ? 'Medium-High' : slumpMetric > 50 ? 'Medium (Pumping)' : 'Low (Pavement)'} ({slumpMetric}mm)
                </span>
              </div>
            </div>
          )}

          {activeTab === 'steel' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Crack Intensity Stress Factor ($\Delta K$):</span>
                <span className="font-mono font-bold">{deltaK.toFixed(2)} MPa·m⁰·⁵</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Paris Law Propagation Rate ($da/dN$):</span>
                <span className="font-mono font-bold">{crackGrowthRate.toExponential(4)} m/cycle</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Projected Crack Length ($a_f$):</span>
                <span className="font-mono">{finalCrackSize.toFixed(3)} mm</span>
              </div>
              <div className="pt-1 text-[8.5px] text-gray-500 font-bold">
                {finalCrackSize > rebarCoverDepth ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-black block text-center">
                    HAZARD: Steel fatigue crack growth exceeds concrete protection cover depth!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Fatigue crack propagation within safety margins.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'water' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Acid/Base state (pH Value):</span>
                <span className="font-mono font-bold">{waterPH}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Chlorides (Max Limit 500 mg/L):</span>
                <span className="font-mono font-bold">{chloridesPPM} mg/L</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Sulfates (Max Limit 400 mg/L):</span>
                <span className="font-mono font-bold">{sulfatesPPM} mg/L</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Aggregate Suitability Verdict:</span>
                <span className="font-mono uppercase font-black">{isWaterCritical ? 'UNFIT FOR MIXING' : 'APPROVED'}</span>
              </div>
            </div>
          )}

          {activeTab === 'bitumen' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Estimated Bitumen Viscosity Grade:</span>
                <span className="font-mono font-bold">VG-{bitumenPenetration < 45 ? '40' : bitumenPenetration < 60 ? '30' : '10'}</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Marshall Structural Stability:</span>
                <span className="font-mono">{marshallStability.toFixed(1)} kN</span>
              </div>
              <div className="pt-1 text-[8.5px] text-gray-500 font-bold">
                {marshallStability < 8.2 ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-black block text-center">
                    BREACH: Bitumen stability is below minimum 8.2 kN highway paving requirement!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Bituminous mix satisfies design criteria.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'durability' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Nominal Rebar Cover Depth:</span>
                <span className="font-mono font-bold">{rebarCoverDepth} mm</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>{"Carbonation Ingress Depth ($d = k \\sqrt{t}$):"}</span>
                <span className="font-mono">{carbonationDepth.toFixed(1)} mm</span>
              </div>
              <div className="pt-1 text-[8.5px] text-gray-500 font-bold">
                {carbonationDepth >= rebarCoverDepth ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-black block text-center">
                    WARNING: Structural rebar carbonation depassivation & corrosion risk!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Rebar protected by passivated concrete cover buffer.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'test_matrix' && (
            <div className="space-y-1 text-[8px] text-gray-500 font-bold leading-normal">
              <p>* ISO & ASTM Testing standards require cast cylinder/cube verification every 50 m³ of poured structural volume.</p>
              <p>* Calibration interval of loading compression machines is standard 6 months.</p>
            </div>
          )}
          </div>
        </div>

        {/* Dynamic plotting chart CAD layout */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Sliders className="h-3.5 w-3.5" />
            LAB ANALYTIC VECTOR CHART
          </div>
          <div className="zoho-card-body">
          
          <div className="h-[180px] w-full border border-black bg-white relative overflow-hidden select-none">
            <svg viewBox="0 0 320 180" className="w-full h-full absolute inset-0">
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Draw stress-strain curve for concrete or fatigue steel curve */}
              {activeTab === 'concrete_mix' ? (
                <g>
                  {/* Axes */}
                  <line x1="40" y1="140" x2="300" y2="140" stroke="#000000" strokeWidth="1.5" />
                  <line x1="40" y1="20" x2="40" y2="140" stroke="#000000" strokeWidth="1.5" />
                  <text x="300" y="150" fontSize="7" fontWeight="bold" textAnchor="end">Strain (ε)</text>
                  <text x="35" y="15" fontSize="7" fontWeight="bold" transform="rotate(-90 35 15)" textAnchor="end">Stress (σ, MPa)</text>

                  {/* Parabolic stress curve */}
                  {/* Peak at strain = 0.002, ultimate strain = 0.0035 */}
                  <path d={`M 40 140 Q 150 ${140 - concreteGrade * 2.2} 240 ${140 - concreteGrade * 2.0} T 280 140`} fill="none" stroke="#000000" strokeWidth="2.5" />
                  <line x1="40" y1={140 - concreteGrade * 2.0} x2="280" y2={140 - concreteGrade * 2.0} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
                  <text x="45" y={135 - concreteGrade * 2.0} fontSize="8" fontWeight="bold">fck = {concreteGrade} MPa</text>

                  {/* Target mean indicator */}
                  <line x1="40" y1={140 - concreteTargetStrength * 2.0} x2="280" y2={140 - concreteTargetStrength * 2.0} stroke="#000000" strokeWidth="1.5" strokeDasharray="2,2" />
                  <text x="45" y={135 - concreteTargetStrength * 2.0} fontSize="8" fontWeight="black">Target f&apos;ck = {concreteTargetStrength.toFixed(1)} MPa</text>
                </g>
              ) : activeTab === 'steel' ? (
                <g>
                  {/* Steel fatigue cyclic Paris growth curve */}
                  <line x1="40" y1="140" x2="300" y2="140" stroke="#000000" strokeWidth="1.5" />
                  <line x1="40" y1="20" x2="40" y2="140" stroke="#000000" strokeWidth="1.5" />
                  <text x="300" y="150" fontSize="7" fontWeight="bold" textAnchor="end">Fatigue Cycles (N)</text>
                  <text x="35" y="15" fontSize="7" fontWeight="bold" transform="rotate(-90 35 15)" textAnchor="end">Crack Size (a, mm)</text>

                  {/* Exponential growth curve */}
                  <path d={`M 40 130 C 100 130, 200 125, 280 ${140 - finalCrackSize * 3}`} fill="none" stroke="#000000" strokeWidth="2.5" />
                  <circle cx="280" cy={140 - finalCrackSize * 3} r="3.5" fill="#000000" />
                  <text x="270" y={130 - finalCrackSize * 3} fontSize="8" fontWeight="black" textAnchor="end">af = {finalCrackSize.toFixed(2)} mm</text>
                  
                  {/* Rebar cover depth line */}
                  <line x1="40" y1={140 - rebarCoverDepth * 2} x2="300" y2={140 - rebarCoverDepth * 2} stroke="#000000" strokeWidth="1" strokeDasharray="3,3" />
                  <text x="45" y={135 - rebarCoverDepth * 2} fontSize="8" fontWeight="bold" fill="#000000">Nominal Cover Depth ({rebarCoverDepth}mm)</text>
                </g>
              ) : (
                <g>
                  {/* generic bar graph representing standard values vs tested values */}
                  <rect x="60" y="40" width="30" height="100" fill="none" stroke="#000000" strokeWidth="1.5" />
                  <text x="75" y="152" fontSize="7" fontWeight="bold" textAnchor="middle">IS REQUIREMENT</text>
                  
                  <rect x="180" y={systemAlertTriggered ? "70" : "50"} width="30" height={systemAlertTriggered ? "70" : "90"} fill="#000000" />
                  <text x="195" y="152" fontSize="7" fontWeight="bold" textAnchor="middle">TESTED SAMPLE</text>
                  <text x="195" y={systemAlertTriggered ? "65" : "45"} fontSize="8" fontWeight="black" textAnchor="middle">
                    {systemAlertTriggered ? 'FAIL' : 'PASS'}
                  </text>
                </g>
              )}
            </svg>
          </div>
          </div>
        </div>

        {/* CRM Compliance Lock In system */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <CheckCircle2 className="h-3.5 w-3.5" />
            CRM INTEGRITY LOCK-IN
          </div>
          <div className="zoho-card-body">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div>
              <p className="text-[10px] uppercase font-black flex items-center gap-1.5 text-black">
                {systemAlertTriggered ? (
                  <>
                    <ShieldAlert className="h-4.5 w-4.5 text-black" />
                    LAB SPECS OUT OF COMPLIANCE
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5 text-black" />
                    LAB TESTING NOMINAL
                  </>
                )}
              </p>
              <p className="text-[8px] text-gray-500 font-mono mt-0.5 leading-relaxed">
                Syncs batch laboratory testing metrics directly with the active CRM SSOT records.
              </p>
            </div>
            
            <button
              onClick={handleLogTicket}
              className={`px-4 py-2 border-2 font-bold uppercase text-[9.5px] transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-0.5 ${
                systemAlertTriggered 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              LOG LABORATORY TICKET
            </button>
          </div>

          {crmSuccess && (
            <div className="p-2 border border-black bg-gray-50 text-black font-black uppercase text-[8px] text-center">
              {crmSuccess}
            </div>
          )}
          </div>
        </div>

      </div>

    </div>
  );
}
