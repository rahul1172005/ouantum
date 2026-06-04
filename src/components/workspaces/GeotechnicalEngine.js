import React, { useState } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { Mountain, ShieldAlert, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function GeotechnicalEngine({ selectedElement, setSelectedElement }) {
  const [activeTab, setActiveTab] = useState('soil'); // soil, rock, groundwater, drainage, shallow, deep, liquefaction
  
  // Soil Properties State
  const [soilCohesion, setSoilCohesion] = useState(25); // kPa (c)
  const [soilAngle, setSoilAngle] = useState(30); // degrees (phi)
  const [soilUnitWeight, setSoilUnitWeight] = useState(18); // kN/m3 (gamma)
  const [footingWidth, setFootingWidth] = useState(2.0); // meters (B)
  const [footingDepth, setFootingDepth] = useState(1.5); // meters (Df)
  const [hydraulicGradient, setHydraulicGradient] = useState(0.4);
  const [permeabilityCoeff, setPermeabilityCoeff] = useState(1e-4); // cm/s

  // Rock Properties State
  const [rockUCS, setRockUCS] = useState(85); // MPa
  const [rockRQD, setRockRQD] = useState(75); // %
  const [jointSpacing, setJointSpacing] = useState(0.5); // meters
  const [jointCondition, setJointCondition] = useState('moderately_rough'); // rough, moderately_rough, smooth, slickensided
  const [groundwaterRock, setGroundwaterRock] = useState('damp'); // dry, damp, wet, dripping, flowing

  // Groundwater & Uplift State
  const [waterTableDepth, setWaterTableDepth] = useState(2.5); // m
  const [porePressureIndex, setPorePressureIndex] = useState(12); // kPa
  const [structuralUpliftArea, setStructuralUpliftArea] = useState(120); // m2
  const [upliftHead, setUpliftHead] = useState(3.0); // m

  // Drainage Design State
  const [rationalC, setRationalC] = useState(0.7); // Runoff Coefficient
  const [rainIntensity, setRainIntensity] = useState(120); // mm/hr
  const [drainageArea, setDrainageArea] = useState(4.5); // Hectares
  const [manningsN, setManningsN] = useState(0.013); // Concrete channel rough
  const [channelSlope, setChannelSlope] = useState(0.02); // m/m
  const [hydraulicRadius, setHydraulicRadius] = useState(0.8); // m

  // Shallow Foundations Settlement State
  const [appliedLoad, setAppliedLoad] = useState(1200); // kN
  const [compressionIndex, setCompressionIndex] = useState(0.25); // Cc
  const [layerThickness, setLayerThickness] = useState(4.0); // meters
  const [voidRatio, setVoidRatio] = useState(0.75); // e0
  const [initialEffectiveStress, setInitialEffectiveStress] = useState(80); // kPa

  // Deep Foundations (Pile Capacity) State
  const [pileDiameter, setPileDiameter] = useState(0.6); // m
  const [pileLength, setPileLength] = useState(15); // m
  const [soilSkinFriction, setSoilSkinFriction] = useState(45); // kPa (f)
  const [endBearingResistance, setEndBearingResistance] = useState(800); // kPa (qp)

  // Liquefaction State
  const [sptBlowCount, setSptBlowCount] = useState(12); // N-value
  const [maxAcceleration, setMaxAcceleration] = useState(0.25); // amax/g
  const [totalOverburdenStress, setTotalOverburdenStress] = useState(110); // kPa (sigma_v)
  const [effectiveOverburdenStress, setEffectiveOverburdenStress] = useState(70); // kPa (sigma'_v)

  // CRM Store Integration
  const accounts = useCRMStore(state => state.accounts);
  const deals = useCRMStore(state => state.deals);
  const addTicket = useCRMStore(state => state.addTicket);
  const [crmSuccess, setCrmSuccess] = useState('');

  // Engineering Equations & Calculations

  // Soil Calculations
  // Terzaghi Bearing Capacity approximation
  const deg2rad = (deg) => deg * Math.PI / 180;
  const phiRad = deg2rad(soilAngle);
  // Bearing capacity factors (simplification of Terzaghi)
  const Nq = Math.tan(deg2rad(45 + soilAngle / 2)) ** 2 * Math.exp(Math.PI * Math.tan(phiRad));
  const Nc = soilAngle > 0 ? (Nq - 1) / Math.tan(phiRad) : 5.7;
  const Ngamma = 2 * (Nq + 1) * Math.tan(phiRad); // Vesic approximation
  const ultimateBearingCapacity = (soilCohesion * Nc) + (soilUnitWeight * footingDepth * Nq) + (0.5 * soilUnitWeight * footingWidth * Ngamma);
  const safeBearingCapacity = ultimateBearingCapacity / 3.0; // Factor of Safety = 3
  const flowVelocity = permeabilityCoeff * hydraulicGradient; // Darcy: v = k * i

  // Rock calculations
  // Rock Mass Rating (RMR) - Simplified Estimation
  const rcsVal = rockUCS > 250 ? 15 : rockUCS > 100 ? 12 : rockUCS > 50 ? 7 : rockUCS > 25 ? 4 : 2;
  const rqdVal = rockRQD > 90 ? 20 : rockRQD > 75 ? 17 : rockRQD > 50 ? 13 : rockRQD > 25 ? 8 : 3;
  const spacingVal = jointSpacing > 2 ? 20 : jointSpacing > 0.6 ? 15 : jointSpacing > 0.2 ? 10 : jointSpacing > 0.06 ? 8 : 5;
  const jointCondVal = jointCondition === 'rough' ? 25 : jointCondition === 'moderately_rough' ? 20 : jointCondition === 'smooth' ? 10 : 0;
  const gwVal = groundwaterRock === 'dry' ? 15 : groundwaterRock === 'damp' ? 10 : groundwaterRock === 'wet' ? 7 : groundwaterRock === 'dripping' ? 4 : 0;
  const rmrScore = rcsVal + rqdVal + spacingVal + jointCondVal + gwVal;
  const rockClass = rmrScore > 80 ? 'Class I (Very Good Rock)' : rmrScore > 60 ? 'Class II (Good Rock)' : rmrScore > 40 ? 'Class III (Fair Rock)' : rmrScore > 20 ? 'Class IV (Poor Rock)' : 'Class V (Very Poor Rock)';

  // Groundwater calculations
  const waterDensity = 9.81; // kN/m3
  const hydrostaticPressure = waterDensity * (upliftHead); // kPa
  const upliftForce = hydrostaticPressure * structuralUpliftArea; // kN
  const seepageForcePerUnitVol = hydraulicGradient * waterDensity; // kN/m3

  // Drainage calculations
  // Rational formula: Q = (C * i * A) / 360  (where A is in hectares, i is in mm/hr, Q is in m3/s)
  const peakRunoff = (rationalC * rainIntensity * drainageArea) / 360;
  // Manning's equation: V = (1/n) * R^(2/3) * S^(1/2)
  const flowVelocityManning = (1 / manningsN) * (hydraulicRadius ** (2 / 3)) * (Math.sqrt(channelSlope));

  // Shallow Foundation calculations
  // Primary Consolidation Settlement: S = Cc * H / (1 + e0) * log10((s'0 + ds') / s'0)
  const footingArea = footingWidth * footingWidth;
  const deltaStress = appliedLoad / footingArea; // stress increment at center of clay layer
  const settlement = ((compressionIndex * layerThickness) / (1 + voidRatio)) * Math.log10((initialEffectiveStress + deltaStress) / initialEffectiveStress) * 1000; // in mm

  // Deep Pile calculations
  // Qu = Qskin + Qbase
  const pileArea = Math.PI * (pileDiameter / 2) ** 2;
  const pilePerimeter = Math.PI * pileDiameter;
  const skinFrictionForce = soilSkinFriction * pilePerimeter * pileLength;
  const endBearingForce = endBearingResistance * pileArea;
  const ultimatePileCapacity = skinFrictionForce + endBearingForce;
  const safePileCapacity = ultimatePileCapacity / 2.5; // FOS = 2.5

  // Liquefaction calculations (Seed & Idriss)
  // CSR = 0.65 * (sigma_v / sigma'_v) * (amax / g) * rd
  const rd = 1.0 - (0.00765 * waterTableDepth); // correction factor at depth
  const csr = 0.65 * (totalOverburdenStress / effectiveOverburdenStress) * maxAcceleration * rd;
  // CRR simplified correlation from SPT N
  const crr = 0.833 * (sptBlowCount / 100) + 0.05; 
  const factorOfSafetyLiquefaction = crr / csr;
  const liquefactionRisk = factorOfSafetyLiquefaction < 1.0 ? 'CRITICAL RISK (FOS < 1.0)' : factorOfSafetyLiquefaction < 1.2 ? 'MODERATE RISK' : 'LOW RISK';

  // System Health and Risk Trigger
  const activeFOS = activeTab === 'soil' ? safeBearingCapacity / 100 : 
                    activeTab === 'liquefaction' ? factorOfSafetyLiquefaction : 
                    activeTab === 'shallow' ? (settlement < 50 ? 2.0 : 0.8) : 1.5;
  const systemAlertTriggered = activeFOS < 1.0;

  const handleLogTicket = () => {
    if (accounts.length === 0) return;
    const targetAccount = accounts[0]; // MSRDC
    const targetDeal = deals.find(d => d.accountId === targetAccount.id) || { id: null };

    let title = '';
    let severity = 'HIGH';
    if (activeTab === 'soil') {
      title = `Bearing capacity failure warning: Safe bearing capacity drops below limit (${safeBearingCapacity.toFixed(1)} kPa)`;
      severity = 'HIGH';
    } else if (activeTab === 'liquefaction') {
      title = `Soil liquefaction hazard registered: FOS = ${factorOfSafetyLiquefaction.toFixed(2)}`;
      severity = 'CRITICAL';
    } else if (activeTab === 'shallow') {
      title = `Clay layer consolidation settlement anomaly: ${settlement.toFixed(1)}mm exceeds 50mm limit`;
      severity = 'HIGH';
    } else {
      title = `Geotechnical safety limit breach detected on live inspection telemetry`;
      severity = 'MEDIUM';
    }

    const ticket = {
      accountId: targetAccount.id,
      dealId: targetDeal.id,
      title,
      severity,
      assetName: 'Geotech Section Block-C4',
      confidence: 94.6
    };

    const res = addTicket(ticket);
    if (res.success) {
      setCrmSuccess(`SSOT TICKET REGISTERED: ${res.ticketId} under ${targetAccount.name}`);
      setTimeout(() => setCrmSuccess(''), 5000);
    }
  };

  const handleSelectSoilNode = () => {
    setSelectedElement({
      type: 'Geotechnical Soil Core Stratum',
      id: 'GT-SOIL-CORE-24B',
      metrics: {
        StratumDepthRange: '1.5m to 6.0m (Soft Clay)',
        CohesionIntercept: `${soilCohesion} kPa`,
        FrictionAngle: `${soilAngle}°`,
        ProctorDryDensity: `${soilUnitWeight} kN/m³`,
        HydraulicConductivity: `${permeabilityCoeff} cm/s`,
        SafeBearingCapacity: `${safeBearingCapacity.toFixed(1)} kPa`
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 font-mono text-xs text-black">
      
      {/* Top Banner Tab Controls */}
      <div className="col-span-1 xl:col-span-4 flex flex-wrap border border-border-default bg-gray-50 p-1 gap-1">
        {[
          { id: 'soil', label: 'Soil Properties (IS 6403)' },
          { id: 'rock', label: 'Rock Mass (RMR/Q)' },
          { id: 'groundwater', label: 'Hydrology & Seepage' },
          { id: 'drainage', label: 'Drainage (Rational/Manning)' },
          { id: 'shallow', label: 'Shallow Footing (Settlement)' },
          { id: 'deep', label: 'Deep Foundations (Piles)' },
          { id: 'liquefaction', label: 'Liquefaction (SPT/Seed)' },
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
        <div className="border border-border-default p-4 bg-white space-y-4">
          <div className="border-b border-border-default pb-1.5 flex justify-between items-center">
            <span className="font-bold uppercase tracking-wider text-[12px]">
              {activeTab === 'soil' && 'SOIL STRENGTH PARAMETERS'}
              {activeTab === 'rock' && 'ROCK INDEX & JOINT GEOMETRIES'}
              {activeTab === 'groundwater' && 'GROUNDWATER CONSTRAINTS'}
              {activeTab === 'drainage' && 'STORMWATER DRAINAGE COEFFICIENTS'}
              {activeTab === 'shallow' && 'FOUNDATION LOADS & STRATA'}
              {activeTab === 'deep' && 'PILE PIER DIMENSION VECTORS'}
              {activeTab === 'liquefaction' && 'SEISMIC OVERBURDEN INDEX'}
            </span>
            <span className="text-[12px] bg-black text-white px-1 py-0.5">INPUTS</span>
          </div>

          {activeTab === 'soil' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Soil Cohesion intercept ($c$):</span>
                  <span>{soilCohesion} kPa</span>
                </div>
                <input 
                  type="range" min="5" max="100" value={soilCohesion} 
                  onChange={(e) => setSoilCohesion(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Angle of Shear Resistance ($\phi$):</span>
                  <span>{soilAngle}°</span>
                </div>
                <input 
                  type="range" min="0" max="45" value={soilAngle} 
                  onChange={(e) => setSoilAngle(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Soil Dry Unit Weight ($\gamma$):</span>
                  <span>{soilUnitWeight} kN/m³</span>
                </div>
                <input 
                  type="range" min="12" max="22" value={soilUnitWeight} 
                  onChange={(e) => setSoilUnitWeight(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold mb-1">Footing Width (B, m):</label>
                  <input 
                    type="number" step="0.1" min="0.5" max="10" value={footingWidth}
                    onChange={(e) => setFootingWidth(Number(e.target.value))}
                    className="w-full border border-border-default p-1 font-mono text-[12px]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Footing Depth (Df, m):</label>
                  <input 
                    type="number" step="0.1" min="0.5" max="10" value={footingDepth}
                    onChange={(e) => setFootingDepth(Number(e.target.value))}
                    className="w-full border border-border-default p-1 font-mono text-[12px]"
                  />
                </div>
              </div>

              <div className="border-t border-border-default pt-3">
                <div className="flex justify-between font-bold mb-1">
                  <span>Hydraulic Gradient ($i$):</span>
                  <span>{hydraulicGradient}</span>
                </div>
                <input 
                  type="range" min="0.05" max="1.0" step="0.05" value={hydraulicGradient} 
                  onChange={(e) => setHydraulicGradient(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'rock' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Unconfined Compressive Strength (UCS):</span>
                  <span>{rockUCS} MPa</span>
                </div>
                <input 
                  type="range" min="5" max="300" value={rockUCS} 
                  onChange={(e) => setRockUCS(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Rock Quality Designation (RQD):</span>
                  <span>{rockRQD}%</span>
                </div>
                <input 
                  type="range" min="10" max="100" value={rockRQD} 
                  onChange={(e) => setRockRQD(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Joint Discontinuity Spacing:</span>
                  <span>{jointSpacing} meters</span>
                </div>
                <input 
                  type="range" min="0.02" max="3" step="0.05" value={jointSpacing} 
                  onChange={(e) => setJointSpacing(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Joint Surface Condition:</label>
                <select 
                  value={jointCondition} 
                  onChange={(e) => setJointCondition(e.target.value)} 
                  className="w-full border border-border-default p-1 bg-white"
                >
                  <option value="rough">Rough, highly undulating, unweathered (Rating: 25)</option>
                  <option value="moderately_rough">Moderately rough, slightly weathered (Rating: 20)</option>
                  <option value="smooth">Smooth, planar, slickensided/weathered (Rating: 10)</option>
                  <option value="slickensided">Slickensided, gouge filled (Rating: 0)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Groundwater Water Inflow:</label>
                <select 
                  value={groundwaterRock} 
                  onChange={(e) => setGroundwaterRock(e.target.value)} 
                  className="w-full border border-border-default p-1 bg-white"
                >
                  <option value="dry">Dry (Rating: 15)</option>
                  <option value="damp">Damp, minor seepage (Rating: 10)</option>
                  <option value="wet">Wet, steady flow (Rating: 7)</option>
                  <option value="dripping">Dripping, high pressure (Rating: 4)</option>
                  <option value="flowing">Flowing (Rating: 0)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'groundwater' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Water Table Depth (below footing):</span>
                  <span>{waterTableDepth} meters</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="0.5" value={waterTableDepth} 
                  onChange={(e) => setWaterTableDepth(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Artesian Excess Uplift Head:</span>
                  <span>{upliftHead} m</span>
                </div>
                <input 
                  type="range" min="0.5" max="8.0" step="0.1" value={upliftHead} 
                  onChange={(e) => setUpliftHead(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Structural Foundation Base Area:</span>
                  <span>{structuralUpliftArea} m²</span>
                </div>
                <input 
                  type="range" min="20" max="500" value={structuralUpliftArea} 
                  onChange={(e) => setStructuralUpliftArea(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'drainage' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Runoff Coefficient ($C$):</span>
                  <span>{rationalC} (Concrete/Urban)</span>
                </div>
                <input 
                  type="range" min="0.2" max="0.95" step="0.05" value={rationalC} 
                  onChange={(e) => setRationalC(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Rainfall Intensity ($i$):</span>
                  <span>{rainIntensity} mm/hr</span>
                </div>
                <input 
                  type="range" min="10" max="250" value={rainIntensity} 
                  onChange={(e) => setRainIntensity(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Catchment Drainage Area ($A$):</span>
                  <span>{drainageArea} Hectares</span>
                </div>
                <input 
                  type="range" min="0.5" max="50" step="0.5" value={drainageArea} 
                  onChange={(e) => setDrainageArea(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold mb-1">Manning&apos;s $n$ rough:</label>
                  <input 
                    type="number" step="0.001" min="0.009" max="0.04" value={manningsN}
                    onChange={(e) => setManningsN(Number(e.target.value))}
                    className="w-full border border-border-default p-1 font-mono text-[12px]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Slope (S, m/m):</label>
                  <input 
                    type="number" step="0.001" min="0.001" max="0.1" value={channelSlope}
                    onChange={(e) => setChannelSlope(Number(e.target.value))}
                    className="w-full border border-border-default p-1 font-mono text-[12px]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shallow' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Applied Structural Column Load ($P$):</span>
                  <span>{appliedLoad} kN</span>
                </div>
                <input 
                  type="range" min="200" max="5000" step="50" value={appliedLoad} 
                  onChange={(e) => setAppliedLoad(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Clay Compression Index ($C_c$):</span>
                  <span>{compressionIndex}</span>
                </div>
                <input 
                  type="range" min="0.05" max="0.6" step="0.01" value={compressionIndex} 
                  onChange={(e) => setCompressionIndex(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Clay Layer Thickness ($H$):</span>
                  <span>{layerThickness} meters</span>
                </div>
                <input 
                  type="range" min="1.0" max="15.0" step="0.5" value={layerThickness} 
                  onChange={(e) => setLayerThickness(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold mb-1">Void Ratio ($e_0$):</label>
                  <input 
                    type="number" step="0.05" min="0.3" max="2.0" value={voidRatio}
                    onChange={(e) => setVoidRatio(Number(e.target.value))}
                    className="w-full border border-border-default p-1 font-mono text-[12px]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Effective Stress ({"$\\sigma'_0$"}, kPa):</label>
                  <input 
                    type="number" step="5" min="10" max="300" value={initialEffectiveStress}
                    onChange={(e) => setInitialEffectiveStress(Number(e.target.value))}
                    className="w-full border border-border-default p-1 font-mono text-[12px]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deep' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Bored Pile Diameter ($D$):</span>
                  <span>{pileDiameter} meters</span>
                </div>
                <input 
                  type="range" min="0.3" max="2.5" step="0.05" value={pileDiameter} 
                  onChange={(e) => setPileDiameter(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Pile Shaft Length ($L$):</span>
                  <span>{pileLength} meters</span>
                </div>
                <input 
                  type="range" min="5" max="40" step="1" value={pileLength} 
                  onChange={(e) => setPileLength(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Average Soil Skin Friction ($f_s$):</span>
                  <span>{soilSkinFriction} kPa</span>
                </div>
                <input 
                  type="range" min="10" max="150" value={soilSkinFriction} 
                  onChange={(e) => setSoilSkinFriction(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>End Bearing Resistance ($q_p$):</span>
                  <span>{endBearingResistance} kPa</span>
                </div>
                <input 
                  type="range" min="100" max="3000" step="50" value={endBearingResistance} 
                  onChange={(e) => setEndBearingResistance(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

          {activeTab === 'liquefaction' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>SPT $N$-Value (uncorrected):</span>
                  <span>{sptBlowCount} blows / 30cm</span>
                </div>
                <input 
                  type="range" min="3" max="50" value={sptBlowCount} 
                  onChange={(e) => setSptBlowCount(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Peak Ground Acceleration ({"$a_{max}/g$"}):</span>
                  <span>{maxAcceleration} g</span>
                </div>
                <input 
                  type="range" min="0.05" max="0.6" step="0.01" value={maxAcceleration} 
                  onChange={(e) => setMaxAcceleration(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Total Overburden Stress ($\sigma_v$):</span>
                  <span>{totalOverburdenStress} kPa</span>
                </div>
                <input 
                  type="range" min="20" max="300" value={totalOverburdenStress} 
                  onChange={(e) => setTotalOverburdenStress(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Effective Overburden Stress ({"$\\sigma'_v$"}):</span>
                  <span>{effectiveOverburdenStress} kPa</span>
                </div>
                <input 
                  type="range" min="10" max="250" value={effectiveOverburdenStress} 
                  onChange={(e) => setEffectiveOverburdenStress(Number(e.target.value))} 
                  className="w-full accent-black"
                />
              </div>
            </div>
          )}

        </div>

        {/* Diagnostic Core Stratum Node trigger */}
        <button
          onClick={handleSelectSoilNode}
          className="w-full py-2 bg-white text-black border border-border-default hover:bg-black hover:text-white font-bold uppercase text-[12px] transition-colors shadow-sm hover:shadow-none translate-y-0 hover:translate-y-0.5"
        >
          INSPECT GT-SOIL-CORE STRATA
        </button>

      </div>

      {/* Main Results Display & CAD Viewport */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Real-time Math Output Card */}
        <div className="border border-border-default p-4 bg-white space-y-3">
          <div className="border-b border-border-default pb-1.5 flex justify-between items-center">
            <span className="font-bold uppercase tracking-wider text-[12px]">DERIVED MATH VECTORS</span>
            <span className="text-[12px] bg-black text-white px-1">OUTPUTS</span>
          </div>

          {activeTab === 'soil' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Terzaghi Cohesion factor ($N_c$):</span>
                <span className="font-mono font-bold">{Nc.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Overburden factor ($N_q$):</span>
                <span className="font-mono font-bold">{Nq.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Unit Weight factor ($N_\gamma$):</span>
                <span className="font-mono font-bold">{Ngamma.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1 bg-gray-50 px-1 font-bold">
                <span>Ultimate Bearing Capacity ({"$q_{ult}$"}):</span>
                <span className="font-mono">{ultimateBearingCapacity.toFixed(1)} kPa</span>
              </div>
              <div className="flex justify-between border-b border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Safe Bearing Capacity (FOS=3):</span>
                <span className="font-mono">{safeBearingCapacity.toFixed(1)} kPa</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Darcy Seepage Velocity ($v = ki$):</span>
                <span className="font-mono font-bold">{(flowVelocity * 100).toFixed(4)} mm/s</span>
              </div>
            </div>
          )}

          {activeTab === 'rock' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Strength Parameter Rating:</span>
                <span className="font-bold">{rcsVal} / 15</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>RQD Fraction Rating:</span>
                <span className="font-bold">{rqdVal} / 20</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Joint Spacing Rating:</span>
                <span className="font-bold">{spacingVal} / 20</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Joint Condition Rating:</span>
                <span className="font-bold">{jointCondVal} / 25</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Groundwater Seepage Rating:</span>
                <span className="font-bold">{gwVal} / 15</span>
              </div>
              <div className="flex justify-between border-b border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Final Rock Mass Rating (RMR):</span>
                <span className="font-mono">{rmrScore} / 100</span>
              </div>
              <div className="pt-1 flex justify-between font-bold">
                <span>Rock Mass Classification:</span>
                <span className="underline uppercase">{rockClass}</span>
              </div>
            </div>
          )}

          {activeTab === 'groundwater' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Hydrostatic Pressure ($\gamma_w \cdot h$):</span>
                <span className="font-mono font-bold">{hydrostaticPressure.toFixed(1)} kPa</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Seepage Force Volumetric ($i \cdot \gamma_w$):</span>
                <span className="font-mono font-bold">{seepageForcePerUnitVol.toFixed(2)} kN/m³</span>
              </div>
              <div className="flex justify-between border-t border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Foundation Uplift Buoyancy:</span>
                <span className="font-mono">{upliftForce.toFixed(0)} kN</span>
              </div>
              <p className="text-[12px] text-gray-500 font-bold leading-normal pt-1">
                * Buoyancy check: Ensure dead load of foundation concrete exceeds the {upliftForce.toFixed(0)} kN force vector by a safety factor of 1.25.
              </p>
            </div>
          )}

          {activeTab === 'drainage' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Peak Stormwater Runoff ($Q$):</span>
                <span className="font-mono font-bold">{peakRunoff.toFixed(3)} m³/sec</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Hydraulic Channel Gradient ($S$):</span>
                <span className="font-mono font-bold">{channelSlope} m/m</span>
              </div>
              <div className="flex justify-between border-b border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Manning&apos;s Outflow Velocity ($V$):</span>
                <span className="font-mono">{flowVelocityManning.toFixed(2)} m/s</span>
              </div>
              <p className="text-[12px] text-gray-500 font-bold leading-normal pt-1">
                * Capacity design: Channel cross-section must exceed {(peakRunoff / flowVelocityManning).toFixed(3)} m² area to prevent localized urban flooding.
              </p>
            </div>
          )}

          {activeTab === 'shallow' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Footing Surface Area:</span>
                <span className="font-mono font-bold">{footingArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Applied Vertical Pressure ($\Delta\sigma$):</span>
                <span className="font-mono font-bold">{deltaStress.toFixed(1)} kPa</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Log Consolidation Ratio:</span>
                <span className="font-mono font-bold">{Math.log10((initialEffectiveStress + deltaStress) / initialEffectiveStress).toFixed(3)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Primary Settlement ($S_c$):</span>
                <span className="font-mono">{settlement.toFixed(1)} mm</span>
              </div>
              <div className="pt-1 text-[12px] text-gray-500 font-bold">
                {settlement > 50 ? (
                  <span className="text-black font-black uppercase bg-gray-100 px-1 border border-border-default block text-center">
                    BREACH: Settlement exceeds standard 50mm allowance limit for clay layers!
                  </span>
                ) : (
                  <span className="text-gray-600 block text-center">✓ Settlement within structural code limits.</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'deep' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Pile Perimeter Friction Area:</span>
                <span className="font-mono font-bold">{(pilePerimeter * pileLength).toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Shaft Skin Friction Resistance ($Q_s$):</span>
                <span className="font-mono font-bold">{(skinFrictionForce / 10).toFixed(1)} tons</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>End Bearing Resistance Force ($Q_b$):</span>
                <span className="font-mono font-bold">{(endBearingForce / 10).toFixed(1)} tons</span>
              </div>
              <div className="flex justify-between border-t border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Safe Pile Load Capacity (FOS=2.5):</span>
                <span className="font-mono">{(safePileCapacity / 10).toFixed(1)} Metric Tons</span>
              </div>
            </div>
          )}

          {activeTab === 'liquefaction' && (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Cyclic Stress Ratio (CSR):</span>
                <span className="font-mono font-bold">{csr.toFixed(3)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Cyclic Resistance Ratio (CRR):</span>
                <span className="font-mono font-bold">{crr.toFixed(3)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span>Factor of Safety ({"$FS_{liq}$"}):</span>
                <span className={`font-mono font-bold ${factorOfSafetyLiquefaction < 1.0 ? 'text-black bg-gray-150 px-1 font-black' : ''}`}>
                  {factorOfSafetyLiquefaction.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border-default py-1 bg-black text-white px-1 font-black">
                <span>Liquefaction Susceptibility:</span>
                <span className="font-mono">{liquefactionRisk}</span>
              </div>
            </div>
          )}

        </div>

        {/* CAD Cross Section Map Representation */}
        <div className="border border-border-default p-4 bg-white space-y-3">
          <p className="font-bold border-b border-border-default pb-1.5 uppercase text-[12px]">STRATIGRAPHY CROSS-SECTION PLOT</p>
          
          <div className="h-[180px] w-full border border-border-default bg-white relative overflow-hidden select-none">
            <svg viewBox="0 0 600 180" className="w-full h-full absolute inset-0">
              {/* Grid Background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Stratum soil layers */}
              {/* Layer 1: Silt */}
              <rect x="0" y="20" width="100%" height="40" fill="none" stroke="#000000" strokeWidth="1" strokeDasharray="2,2" />
              <text x="10" y="35" fontSize="8" fontWeight="bold">Stratum A: Silty Sand (0.0m - 1.5m)</text>

              {/* Layer 2: Soft Clay */}
              <rect x="0" y="60" width="100%" height="60" fill="none" stroke="#000000" strokeWidth="1" />
              <path d="M 0 90 Q 150 70 300 90 T 600 90" fill="none" stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,4" />
              <text x="10" y="75" fontSize="8" fontWeight="bold">Stratum B: Soft Marine Clay (1.5m - 6.0m)</text>

              {/* Layer 3: Bedrock */}
              <rect x="0" y="120" width="100%" height="60" fill="none" stroke="#000000" strokeWidth="2" />
              {/* Hashed rock lines */}
              <line x1="20" y1="120" x2="40" y2="180" stroke="#000000" strokeWidth="1" />
              <line x1="80" y1="120" x2="100" y2="180" stroke="#000000" strokeWidth="1" />
              <line x1="140" y1="120" x2="160" y2="180" stroke="#000000" strokeWidth="1" />
              <line x1="200" y1="120" x2="220" y2="180" stroke="#000000" strokeWidth="1" />
              <line x1="260" y1="120" x2="280" y2="180" stroke="#000000" strokeWidth="1" />
              <line x1="320" y1="120" x2="340" y2="180" stroke="#000000" strokeWidth="1" />
              <line x1="380" y1="120" x2="400" y2="180" stroke="#000000" strokeWidth="1" />
              <text x="10" y="135" fontSize="8" fontWeight="black" className="bg-white px-1">Stratum C: Basalt Bedrock (6.0m+)</text>

              {/* Water Table overlay indicator */}
              <line x1="0" y1={40 + waterTableDepth * 10} x2="600" y2={40 + waterTableDepth * 10} stroke="#000000" strokeWidth="2" />
              <polygon points={`10,${40 + waterTableDepth*10} 5,${33 + waterTableDepth*10} 15,${33 + waterTableDepth*10}`} fill="#000000" />
              <text x="22" y={38 + waterTableDepth * 10} fontSize="8" fontWeight="bold">LIVE GWT LINE ({waterTableDepth.toFixed(1)}m)</text>

              {/* Concrete Footing representation */}
              {activeTab === 'soil' || activeTab === 'shallow' ? (
                <g>
                  {/* Footing Column */}
                  <rect x="220" y="0" width="20" height="40" fill="none" stroke="#000000" strokeWidth="2.5" />
                  {/* Footing Slab */}
                  <rect 
                    x={230 - (footingWidth * 25)} 
                    y="40" 
                    width={footingWidth * 50} 
                    height="12" 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="3" 
                  />
                  <text x="240" y="35" fontSize="7" fontWeight="bold" textAnchor="middle">COLUMN</text>
                  <text x="230" y="49" fontSize="7" fontWeight="black" textAnchor="middle" fill="#000000">B = {footingWidth}m</text>
                </g>
              ) : null}

              {/* Deep Pile representation */}
              {activeTab === 'deep' ? (
                <g>
                  <rect x="220" y="0" width="20" height="40" fill="none" stroke="#000000" strokeWidth="2" />
                  {/* Pile Pier */}
                  <rect 
                    x={230 - (pileDiameter * 20)} 
                    y="40" 
                    width={pileDiameter * 40} 
                    height={pileLength * 3.5} 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="3.5" 
                  />
                  <line x1="230" y1="40" x2="230" y2={40 + pileLength * 3.5} stroke="#000000" strokeWidth="1" strokeDasharray="3,3" />
                  <text x="235" y="55" fontSize="7" fontWeight="black">L = {pileLength}m</text>
                </g>
              ) : null}
            </svg>
          </div>
        </div>

        {/* CRM Compliance Lock In system */}
        <div className="border border-border-default p-4 bg-white space-y-3">
          <p className="font-bold border-b border-border-default pb-1.5 uppercase text-[12px]">CRM INTEGRITY LOCK-IN</p>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div>
              <p className="text-[12px] uppercase font-black flex items-center gap-1.5 text-black">
                {systemAlertTriggered ? (
                  <>
                    <ShieldAlert className="h-4.5 w-4.5 text-black" />
                    GT SAFETY PARAMETERS EXCEEDED
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5 text-black" />
                    GT TELEMETRY NOMINAL
                  </>
                )}
              </p>
              <p className="text-[12px] text-gray-500 font-mono mt-0.5 leading-relaxed">
                Matches current values to safety limits under IS 6403 and IS 2911 engineering codes.
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
              LOG COMPLIANCE TICKET
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
  );
}
