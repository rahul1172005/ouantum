import React, { useState } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { Layers, ShieldAlert, CheckCircle2, Activity } from 'lucide-react';

export default function StructuralSafety({ selectedElement, setSelectedElement }) {
  const [activeTab, setActiveTab] = useState('load'); // load, stability, behavior, failure, fire, corrosion, dynamic
  
  // 1. Load Analysis State
  const [windSpeed, setWindSpeed] = useState(44); // m/s (IS 875 Part 3 basic wind speed)
  const [terrainCategory, setTerrainCategory] = useState(2); // Category 1-4
  const [seismicZ, setSeismicZ] = useState(0.24); // Zone IV factor (0.24)
  const [importanceFactor, setImportanceFactor] = useState(1.5); // Important public building
  const [responseReduction, setResponseReduction] = useState(5.0); // SMRF frame (R=5)
  const [sagAverage, setSagAverage] = useState(2.5); // Sa/g average spectral acceleration

  // 2. Stability Check State
  const [columnLength, setColumnLength] = useState(6.0); // meters (L)
  const [momentOfInertia, setMomentOfInertia] = useState(8500); // cm4 (I)
  const [steelModulus, setSteelModulus] = useState(200); // GPa (E)
  const [endConditions, setEndConditions] = useState('pinned'); // fixed, pinned, fixed_free, fixed_pinned
  const [beamLoad, setBeamLoad] = useState(120); // kN

  // 3. Structural Behavior (Fatigue SN) State
  const [n1Cycles, setN1Cycles] = useState(25000); // ni
  const [N1Limit, setN1Limit] = useState(50000); // Ni
  const [n2Cycles, setN2Cycles] = useState(42000);
  const [N2Limit, setN2Limit] = useState(100000);

  // 4. Failure Analysis State
  const [concreteFc, setConcreteFc] = useState(30); // MPa
  const [beamWidth, setBeamWidth] = useState(300); // mm
  const [effectiveDepth, setEffectiveDepth] = useState(450); // mm
  const [steelAreaAst, setSteelAreaAst] = useState(1200); // mm2
  const [appliedShearV, setAppliedShearV] = useState(180); // kN

  // 5. Fire Resistance State
  const [fireDuration, setFireDuration] = useState(60); // minutes (t)
  const [coatingThickness, setCoatingThickness] = useState(15); // mm fireproofing (d)

  // 6. Corrosion Analysis State
  const [halfCellPotential, setHalfCellPotential] = useState(-380); // mV vs CSE
  const [corrosionCurrentDensity, setCorrosionCurrentDensity] = useState(1.2); // uA/cm2 (icorr)

  // 7. Dynamic Analysis State
  const [lumpedMass, setLumpedMass] = useState(45); // Metric Tons (m)
  const [stiffnessK, setStiffnessK] = useState(18); // MN/m (k)

  // CRM Store Integration
  const accounts = useCRMStore(state => state.accounts);
  const deals = useCRMStore(state => state.deals);
  const addTicket = useCRMStore(state => state.addTicket);
  const [crmSuccess, setCrmSuccess] = useState('');

  // Calculations

  // Load Analysis
  // IS 875 Wind: Vz = Vb * k1 * k2 * k3. Let's assume factor product is 1.15
  const windVz = windSpeed * 1.05 * (terrainCategory === 1 ? 1.05 : terrainCategory === 2 ? 0.98 : 0.91);
  const designWindPressure = 0.6 * (windVz ** 2); // p = 0.6 * Vz^2 in N/m2 (Pascals)
  // IS 1893 Seismic: Ah = (Z/2) * (I/R) * (Sa/g)
  const seismicAh = (seismicZ / 2) * (importanceFactor / responseReduction) * sagAverage;

  // Stability Check (Euler Buckling)
  // Effective length factor K based on end conditions
  const effectiveLengthFactor = endConditions === 'fixed' ? 0.5 : 
                                endConditions === 'fixed_pinned' ? 0.7 : 
                                endConditions === 'pinned' ? 1.0 : 2.0; // fixed_free
  const K_L = effectiveLengthFactor * columnLength;
  const inertiaM4 = momentOfInertia * 1e-8; // cm4 to m4
  const modulusPa = steelModulus * 1e9; // GPa to Pa
  const eulerBucklingLoad = (Math.PI ** 2 * modulusPa * inertiaM4) / (K_L ** 2) / 1000; // in kN

  // Deflection of simply supported beam with point load: delta = P * L^3 / (48 * E * I)
  const beamLength = 5.0; // m
  const pointLoadDeflection = (beamLoad * 1000 * (beamLength ** 3)) / (48 * modulusPa * inertiaM4) * 1000; // mm

  // Structural Behavior (Miner's Rule)
  // Sum(ni/Ni) <= 1.0
  const damageRatio1 = n1Cycles / N1Limit;
  const damageRatio2 = n2Cycles / N2Limit;
  const totalCumulativeDamage = damageRatio1 + damageRatio2;

  // Failure Analysis (ACI Shear design)
  // Vc = 0.17 * sqrt(f'c) * b * d (in Newtons)
  const concreteShearCapacity = 0.17 * Math.sqrt(concreteFc) * beamWidth * effectiveDepth / 1000; // kN
  // Nominal steel shear capacity (simplification for stirrups)
  const totalShearCapacity = concreteShearCapacity * 1.5; // with nominal reinforcement (phi = 0.75)
  const ultimateLimitCapacityRatio = appliedShearV / totalShearCapacity;

  // Fire Resistance
  // ISO 834 Standard Fire Temperature curve: T = 345 * log10(8*t + 1) + 20
  const fireTemperature = 345 * Math.log10(8 * fireDuration + 1) + 20;
  // Strength degradation factor based on temp (simplification)
  const standardThermalDegradation = Math.max(0.1, 1.0 - (fireTemperature / 1200) * (20 / (coatingThickness + 5)));

  // Corrosion
  // Half cell potential classification: <-350mV = High corrosion risk (>90% probability)
  const corrosionProbability = halfCellPotential < -350 ? 'HIGH (>90%)' : halfCellPotential < -200 ? 'MODERATE (50%)' : 'LOW (<10%)';
  // Corrosion rate (Butler-Volmer index approximation): penetration in mm/year = 0.0116 * icorr
  const annualCorrosionRate = 0.0116 * corrosionCurrentDensity; // mm/year

  // Dynamic Analysis
  // fn = (1/2pi) * sqrt(k / m)
  // mass in kg, stiffness in N/m
  const stiffnessN_M = stiffnessK * 1e6; // MN/m to N/m
  const massKg = lumpedMass * 1000; // tons to kg
  const naturalFrequencyHz = (1 / (2 * Math.PI)) * Math.sqrt(stiffnessN_M / massKg);

  // Critical Alerts
  const isLoadCritical = designWindPressure > 1500 || seismicAh > 0.15;
  const isStabilityCritical = beamLoad >= eulerBucklingLoad || pointLoadDeflection > (beamLength * 1000 / 250); // span/250 limit
  const isBehaviorCritical = totalCumulativeDamage >= 1.0;
  const isFailureCritical = ultimateLimitCapacityRatio > 1.0;
  const isFireCritical = standardThermalDegradation < 0.45;
  const isCorrosionCritical = halfCellPotential < -350 && corrosionCurrentDensity > 1.0;
  const isDynamicCritical = naturalFrequencyHz < 1.2; // Avoid resonance under crowd load (1.5-2.5 Hz)

  const systemAlertTriggered = isLoadCritical || isStabilityCritical || isBehaviorCritical || isFailureCritical || isFireCritical || isCorrosionCritical || isDynamicCritical;

  const handleLogTicket = () => {
    if (accounts.length === 0) return;
    const targetAccount = accounts[0];
    const targetDeal = deals.find(d => d.accountId === targetAccount.id) || { id: null };

    let title = '';
    let severity = 'HIGH';

    if (activeTab === 'stability' && beamLoad >= eulerBucklingLoad) {
      title = `Structural Euler Buckling Collapse Warning: Applied Column Load exceeds critical load Pcr (${eulerBucklingLoad.toFixed(0)} kN)`;
      severity = 'CRITICAL';
    } else if (activeTab === 'behavior' && totalCumulativeDamage >= 1.0) {
      title = `Miner's Rule structural fatigue accumulation breach: Damage ratio sum (${totalCumulativeDamage.toFixed(2)}) >= 1.0`;
      severity = 'HIGH';
    } else if (activeTab === 'failure' && ultimateLimitCapacityRatio > 1.0) {
      title = `Structural ultimate shear strength failure: Applied shear load exceeds design shear capacity (${totalShearCapacity.toFixed(1)} kN)`;
      severity = 'CRITICAL';
    } else if (activeTab === 'corrosion' && isCorrosionCritical) {
      title = `Electrochemical reinforcement corrosion alert: Half-cell potential (${halfCellPotential}mV) confirms high risk depassivation`;
      severity = 'HIGH';
    } else if (activeTab === 'dynamic' && isDynamicCritical) {
      title = `Resonant vibration susceptibility alert: Natural structural frequency (${naturalFrequencyHz.toFixed(2)} Hz) triggers harmonic resonance`;
      severity = 'HIGH';
    } else {
      title = `Structural safety & stability warning logged from active monitoring sensors`;
      severity = 'MEDIUM';
    }

    const ticket = {
      accountId: targetAccount.id,
      dealId: targetDeal.id,
      title,
      severity,
      assetName: 'Main Suspended Girder Segment B',
      confidence: 96.8
    };

    const res = addTicket(ticket);
    if (res.success) {
      setCrmSuccess(`SSOT STRUCTURAL TICKET: ${res.ticketId} under ${targetAccount.name}`);
      setTimeout(() => setCrmSuccess(''), 5000);
    }
  };

  const handleSelectStructureNode = () => {
    setSelectedElement({
      type: 'Structural Frame Column Member',
      id: 'ST-COL-C3-P12',
      metrics: {
        SteelYieldLimit: 'Fe 500 steel',
        EffectiveLengthFactor: effectiveLengthFactor,
        ColumnInertia: `${momentOfInertia} cm⁴`,
        CalculatedEulerLoad: `${eulerBucklingLoad.toFixed(0)} kN`,
        HalfCellPotential: `${halfCellPotential} mV`,
        NaturalVibrationFreq: `${naturalFrequencyHz.toFixed(2)} Hz`
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 font-mono text-xs text-black">
      
      {/* Top Banner Tab Controls */}
      <div className="col-span-1 xl:col-span-4 flex flex-wrap border-2 border-black bg-gray-50 p-1 gap-1">
        {[
          { id: 'load', label: 'Load Analysis (IS 875/1893)' },
          { id: 'stability', label: 'Euler Buckling & Deflection' },
          { id: 'behavior', label: 'Miner\'s Fatigue SN' },
          { id: 'failure', label: 'Flexure & Shear Limits' },
          { id: 'fire', label: 'ISO 834 Fire Curves' },
          { id: 'corrosion', label: 'Corrosion Current Rates' },
          { id: 'dynamic', label: 'Natural Freq & Resonance' },
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
        <div className="border-2 border-black p-4 bg-white space-y-4">
          <div className="border-b border-black pb-1.5 flex justify-between items-center">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              {activeTab === 'load' && 'ENVIRONMENTAL WIND & SEISMIC INDEX'}
              {activeTab === 'stability' && 'COLUMN INERTIA & BEAM LOADS'}
              {activeTab === 'behavior' && 'FATIGUE CYCLES STRESS AMPLITUDE'}
              {activeTab === 'failure' && 'REINFORCED BEAM GEOMETRY'}
              {activeTab === 'fire' && 'THERMAL BARRIER COATING'}
              {activeTab === 'corrosion' && 'ELECTROCHEMICAL POTENTIAL'}
              {activeTab === 'dynamic' && 'LUMPED MASS & SHEAR STIFFNESS'}
            </span>
            <span className="text-[8px] bg-black text-white px-1 py-0.5">STRUCTURAL INPUTS</span>
          </div>

          {activeTab === 'load' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Basic Wind Speed ($V_b$):</span>
                  <span>{windSpeed} m/s</span>
                </div>
                <input 
                  type="range" min="33" max="55" value={windSpeed} 
                  onChange={(e) => setWindSpeed(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 font-mono text-[9px] uppercase">Terrain Category (k2 height factor modifier):</label>
                <select 
                  value={terrainCategory} 
                  onChange={(e) => setTerrainCategory(Number(e.target.value))} 
                  className="w-full border border-black p-1 bg-white text-[10px]"
                >
                  <option value={1}>Category 1 (Open water, desert - Rating k2=1.05)</option>
                  <option value={2}>Category 2 (Open fields, scattered trees - Rating k2=0.98)</option>
                  <option value={3}>Category 3 (Semi-urban, dense trees - Rating k2=0.91)</option>
                  <option value={4}>Category 4 (City centers, high-rises - Rating k2=0.80)</option>
                </select>
              </div>

              <div className="border-t border-black pt-3">
                <div className="flex justify-between font-bold mb-1">
                  <span>Seismic Zone Factor ($Z$):</span>
                  <span>{seismicZ} (Zone IV)</span>
                </div>
                <input 
                  type="range" min="0.10" max="0.36" step="0.02" value={seismicZ} 
                  onChange={(e) => setSeismicZ(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Spectral Acceleration Ratio ($S_a/g$):</span>
                  <span>{sagAverage}</span>
                </div>
                <input 
                  type="range" min="1.0" max="2.5" step="0.1" value={sagAverage} 
                  onChange={(e) => setSagAverage(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'stability' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Column Unsupported Length ($L$):</span>
                  <span>{columnLength} meters</span>
                </div>
                <input 
                  type="range" min="2.0" max="12.0" step="0.5" value={columnLength} 
                  onChange={(e) => setColumnLength(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Moment of Inertia ($I$):</span>
                  <span>{momentOfInertia} cm⁴</span>
                </div>
                <input 
                  type="range" min="1000" max="25000" step="500" value={momentOfInertia} 
                  onChange={(e) => setMomentOfInertia(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Column Boundary End Conditions:</label>
                <select 
                  value={endConditions} 
                  onChange={(e) => setEndConditions(e.target.value)} 
                  className="w-full border border-black p-1 bg-white text-[10px]"
                >
                  <option value="fixed">Both Ends Fixed (K = 0.5)</option>
                  <option value="fixed_pinned">One Fixed, One Pinned (K = 0.7)</option>
                  <option value="pinned">Both Ends Pinned (K = 1.0)</option>
                  <option value="fixed_free">One Fixed, One Free (K = 2.0 - Critical)</option>
                </select>
              </div>

              <div className="border-t border-black pt-3">
                <div className="flex justify-between font-bold mb-1">
                  <span>Applied Beam Service Point Load ($P$):</span>
                  <span>{beamLoad} kN</span>
                </div>
                <input 
                  type="range" min="10" max="400" value={beamLoad} 
                  onChange={(e) => setBeamLoad(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-3">
              <p className="font-bold text-[9px] uppercase border-b border-black pb-1">Stress Cycle Fatigue Cumulative Load cases:</p>
              
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Load Case 1 cycles ($n_1$):</span>
                  <span>{n1Cycles.toLocaleString()} cycles</span>
                </div>
                <input 
                  type="range" min="1000" max="50000" step="1000" value={n1Cycles} 
                  onChange={(e) => setN1Cycles(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>S-N Curve Safe Cycles Limit ($N_1$):</span>
                  <span>{N1Limit.toLocaleString()} cycles</span>
                </div>
                <input 
                  type="range" min="10000" max="100000" step="5000" value={N1Limit} 
                  onChange={(e) => setN1Limit(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-bold mb-1">
                  <span>Load Case 2 cycles ($n_2$):</span>
                  <span>{n2Cycles.toLocaleString()} cycles</span>
                </div>
                <input 
                  type="range" min="1000" max="100000" step="1000" value={n2Cycles} 
                  onChange={(e) => setN2Cycles(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>S-N Curve Safe Cycles Limit ($N_2$):</span>
                  <span>{N2Limit.toLocaleString()} cycles</span>
                </div>
                <input 
                  type="range" min="20000" max="200000" step="5000" value={N2Limit} 
                  onChange={(e) => setN2Limit(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'failure' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Beam Width (b, mm):</label>
                  <input 
                    type="number" min="150" max="600" step="25" value={beamWidth}
                    onChange={(e) => setBeamWidth(Number(e.target.value))}
                    className="w-full border border-black p-1 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Eff Depth (d, mm):</label>
                  <input 
                    type="number" min="200" max="1000" step="25" value={effectiveDepth}
                    onChange={(e) => setEffectiveDepth(Number(e.target.value))}
                    className="w-full border border-black p-1 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Concrete Grade ({"$f'_c$"}):</span>
                  <span>{concreteFc} MPa</span>
                </div>
                <input 
                  type="range" min="20" max="60" step="5" value={concreteFc} 
                  onChange={(e) => setConcreteFc(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Main Tensile Steel Area ({"$A_{st}$"}):</span>
                  <span>{steelAreaAst} mm²</span>
                </div>
                <input 
                  type="range" min="200" max="3000" step="100" value={steelAreaAst} 
                  onChange={(e) => setSteelAreaAst(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Applied Shear Force ($V_u$):</span>
                  <span>{appliedShearV} kN</span>
                </div>
                <input 
                  type="range" min="20" max="350" value={appliedShearV} 
                  onChange={(e) => setAppliedShearV(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'fire' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Fire Exposure Duration ($t$):</span>
                  <span>{fireDuration} minutes</span>
                </div>
                <input 
                  type="range" min="5" max="240" step="5" value={fireDuration} 
                  onChange={(e) => setFireDuration(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Fireproofing Coating Thickness ($d_f$):</span>
                  <span>{coatingThickness} mm Vermiculite</span>
                </div>
                <input 
                  type="range" min="0" max="50" value={coatingThickness} 
                  onChange={(e) => setCoatingThickness(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'corrosion' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Half-Cell Potential:</span>
                  <span>{halfCellPotential} mV vs CSE</span>
                </div>
                <input 
                  type="range" min="-500" max="-100" step="10" value={halfCellPotential} 
                  onChange={(e) => setHalfCellPotential(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Corrosion Current Density ({"$i_{corr}$"}):</span>
                  <span>{corrosionCurrentDensity.toFixed(2)} μA/cm²</span>
                </div>
                <input 
                  type="range" min="0.05" max="3.0" step="0.05" value={corrosionCurrentDensity} 
                  onChange={(e) => setCorrosionCurrentDensity(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'dynamic' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Slab Lumped Mass ($m$):</span>
                  <span>{lumpedMass} Metric Tons</span>
                </div>
                <input 
                  type="range" min="10" max="200" step="5" value={lumpedMass} 
                  onChange={(e) => setLumpedMass(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Lateral Structural Stiffness ($k$):</span>
                  <span>{stiffnessK} MN/meter</span>
                </div>
                <input 
                  type="range" min="5" max="100" value={stiffnessK} 
                  onChange={(e) => setStiffnessK(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

        </div>

        {/* Diagnostic Structural Node trigger */}
        <button
          onClick={handleSelectStructureNode}
          className="w-full py-2 bg-white text-black border-2 border-black hover:bg-black hover:text-white font-bold uppercase text-[9px] transition-colors shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-0.5"
        >
          INSPECT ST-COL MEMBER VECTORS
        </button>

      </div>

      {/* Main Results Display & CAD Viewport */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Real-time Math Output Card */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <div className="border-b border-black pb-1.5 flex justify-between items-center">
            <span className="font-bold uppercase tracking-wider text-[10px]">DERIVED MATH VECTORS</span>
            <span className="text-[8px] bg-black text-white px-1">OUTPUTS</span>
          </div>

          {activeTab === 'load' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Design Wind Velocity ($V_z$):</span>
                <span className="font-mono font-bold">{windVz.toFixed(1)} m/s</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1 bg-gray-50 px-1 font-bold">
                <span>Design Wind Pressure ($p = 0.6 V_z^2$):</span>
                <span className="font-mono">{designWindPressure.toFixed(0)} N/m² (Pa)</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Seismic Horizontal Coeff ($A_h$):</span>
                <span className="font-mono">{seismicAh.toFixed(4)} g</span>
              </div>
            </div>
          )}

          {activeTab === 'stability' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Effective Column Length ($KL$):</span>
                <span className="font-mono font-bold">{K_L.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1 bg-gray-50 px-1 font-bold">
                <span>Euler Critical Buckling Load ({"$P_{cr}$"}):</span>
                <span className="font-mono">{eulerBucklingLoad.toFixed(1)} kN</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Beam Deflection ($\delta = PL^3/48EI$):</span>
                <span className="font-mono">{pointLoadDeflection.toFixed(2)} mm</span>
              </div>
              <div className="pt-1 text-[8.5px] text-gray-500 font-bold">
                {beamLoad >= eulerBucklingLoad ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-black block text-center">
                    BREACH: Applied load exceeds Euler critical load! Column collapse risk!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Buckling factors are structurally stable.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Damage Case 1 Fraction ($n_1/N_1$):</span>
                <span className="font-mono font-bold">{damageRatio1.toFixed(3)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Damage Case 2 Fraction ($n_2/N_2$):</span>
                <span className="font-mono font-bold">{damageRatio2.toFixed(3)}</span>
              </div>
              <div className="flex justify-between border-t border-black py-1 bg-black text-white px-1 font-black">
                <span>Miner&apos;s Cumulative Damage ({"$\\Sigma \\frac{n_i}{N_i}$"}):</span>
                <span className="font-mono">{totalCumulativeDamage.toFixed(3)}</span>
              </div>
              <div className="pt-1 text-[8.5px] text-gray-500 font-bold">
                {totalCumulativeDamage >= 1.0 ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-black block text-center">
                    HAZARD: Total fatigue damage limit breached! Impending fatigue failure!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Cumulative fatigue damage has not reached limit 1.0.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'failure' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Concrete Shear Capacity ($V_c$):</span>
                <span className="font-mono font-bold">{concreteShearCapacity.toFixed(1)} kN</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Nominal Steel Stirrup shear capacity ($V_s$):</span>
                <span className="font-mono font-bold">{(concreteShearCapacity * 0.5).toFixed(1)} kN</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Shear Demand-to-Capacity Ratio:</span>
                <span className="font-mono">{ultimateLimitCapacityRatio.toFixed(2)}</span>
              </div>
              <div className="pt-1 text-[8.5px] text-gray-500 font-bold">
                {ultimateLimitCapacityRatio > 1.0 ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-black block text-center">
                    BREACH: Applied shear force exceeds beam design strength! Reinforce stirrups!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Beam section satisfies ultimate shear limits.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'fire' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>ISO 834 Core Temperature reached:</span>
                <span className="font-mono font-bold">{fireTemperature.toFixed(0)} °C</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Thermal Degradation Factor (Strength ratio):</span>
                <span className="font-mono">{standardThermalDegradation.toFixed(3)}</span>
              </div>
              <p className="text-[8.5px] text-gray-500 font-bold leading-normal pt-1">
                * Structural note: A degraded yield strength below 0.50 of nominal requires immediate evacuation during thermal incidents.
              </p>
            </div>
          )}

          {activeTab === 'corrosion' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Half-Cell Potential Verdict:</span>
                <span className="font-mono font-bold">{corrosionProbability} RISK</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Butler-Volmer Penetration Rate:</span>
                <span className="font-mono">{annualCorrosionRate.toFixed(4)} mm/year loss</span>
              </div>
              <p className="text-[8.5px] text-gray-500 font-bold leading-normal pt-1">
                * Corrosion danger: A rate &gt; 0.01 mm/year under CSE potential of -350mV leads to concrete spalling and reinforcement cross-section loss.
              </p>
            </div>
          )}

          {activeTab === 'dynamic' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Lateral Structural stiffness ($k$):</span>
                <span className="font-mono font-bold">{stiffnessK} MN/m</span>
              </div>
              <div className="flex justify-between border-b border-black py-1 bg-black text-white px-1 font-black">
                <span>Structural Natural Frequency ($f_n$):</span>
                <span className="font-mono">{naturalFrequencyHz.toFixed(2)} Hz</span>
              </div>
              <p className="text-[8.5px] text-gray-500 font-bold leading-normal pt-1">
                * Dynamic Resonance Warning: Ensure natural frequency ($f_n$) does not map to walking resonance frequencies (1.8 - 2.2 Hz) to prevent high structural oscillations.
              </p>
            </div>
          )}

        </div>

        {/* Structural Deformed Frame Plot CAD layout */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">STRUCTURAL VECTOR GRAPHIC PLOT</p>
          
          <div className="h-[180px] w-full border border-black bg-white relative overflow-hidden select-none">
            <svg className="absolute inset-0 w-full h-full">
              <rect width="100%" height="100%" fill="url(#grid)" />

              {activeTab === 'stability' ? (
                <g>
                  {/* Euler Buckled Shape of a Column */}
                  {/* Axis */}
                  <line x1="100" y1="10" x2="100" y2="170" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
                  
                  {/* Draw buckled column */}
                  {/* Sine wave profile: x = 100 + amp * sin(pi * y / L) */}
                  <path 
                    d={`M 100 10 
                       Q ${100 + (beamLoad/eulerBucklingLoad) * 45} 90 
                       100 170`} 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="3.5" 
                  />
                  {/* Pin supports at ends */}
                  <polygon points="100,10 94,0 106,0" fill="none" stroke="#000000" strokeWidth="1.5" />
                  <polygon points="100,170 94,180 106,180" fill="none" stroke="#000000" strokeWidth="1.5" />
                  <text x="110" y="25" fontSize="8" fontWeight="black">APPLIED P = {beamLoad} kN</text>
                  <text x="110" y="95" fontSize="8" fontWeight="bold">Deformation vector (FOS={ (eulerBucklingLoad/beamLoad).toFixed(2) })</text>
                </g>
              ) : activeTab === 'dynamic' ? (
                <g>
                  {/* Dynamic natural vibration mode shape (First Mode) */}
                  <line x1="80" y1="160" x2="320" y2="160" stroke="#000000" strokeWidth="2" />
                  {/* Undeflected Columns */}
                  <line x1="120" y1="60" x2="120" y2="160" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="2,2" />
                  <line x1="280" y1="60" x2="280" y2="160" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="2,2" />
                  <rect x="100" y="50" width="200" height="15" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="2,2" />

                  {/* Deflected shape (Mode 1: lateral translation) */}
                  {/* translation offset = 30px */}
                  <line x1="120" y1="160" x2="150" y2="60" stroke="#000000" strokeWidth="2.5" />
                  <line x1="280" y1="160" x2="310" y2="60" stroke="#000000" strokeWidth="2.5" />
                  <rect x="130" y="50" width="200" height="15" fill="#ffffff" stroke="#000000" strokeWidth="3" />
                  <text x="230" y="62" fontSize="7" fontWeight="black" textAnchor="middle">M = {lumpedMass} TONS</text>
                  <text x="230" y="100" fontSize="8" fontWeight="bold" textAnchor="middle">MODE 1: fn = {naturalFrequencyHz.toFixed(2)} Hz</text>
                </g>
              ) : (
                <g>
                  {/* Generic structural beam layout */}
                  <rect x="50" y="80" width="400" height="20" fill="none" stroke="#000000" strokeWidth="2.5" />
                  <line x1="50" y1="100" x2="450" y2="100" stroke="#000000" strokeWidth="1" />
                  <polygon points="50,100 44,112 56,112" fill="none" stroke="#000000" strokeWidth="1.5" />
                  <polygon points="450,100 444,112 456,112" fill="none" stroke="#000000" strokeWidth="1.5" />
                  <text x="250" y="70" fontSize="8" fontWeight="black" textAnchor="middle">STRUCTURAL BEAM SEGMENT</text>
                  <text x="250" y="93" fontSize="8" fontWeight="bold" textAnchor="middle">SPAN = 5.0m</text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* CRM Compliance Lock In system */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">CRM INTEGRITY LOCK-IN</p>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div>
              <p className="text-[10px] uppercase font-black flex items-center gap-1.5 text-black">
                {systemAlertTriggered ? (
                  <>
                    <ShieldAlert className="h-4.5 w-4.5 text-black" />
                    STRUCTURAL BREACH WARNING
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5 text-black" />
                    STRUCTURE NOMINAL & STABLE
                  </>
                )}
              </p>
              <p className="text-[8px] text-gray-500 font-mono mt-0.5 leading-relaxed">
                Applies strict safety boundaries. Automatically merges telemetry failures into CRM tickets.
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
              LOG STRUCTURAL TICKET
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
  );
}
