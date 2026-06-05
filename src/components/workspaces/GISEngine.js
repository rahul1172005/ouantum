import React, { useState } from 'react';
import { Map, Layers, Radio, ShieldAlert, Target, Compass, Video, Crosshair } from 'lucide-react';

export default function GISEngine({ selectedElement, setSelectedElement }) {
  const [activeLayer, setActiveLayer] = useState('sensors');
  const [droneZoom, setDroneZoom] = useState(1.0);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const assets = [
    { id: 'ASSET-42', name: 'BWSL Pier 42 Support Anchor', x: 220, y: 110, risk: 'HIGH', sensors: 4 },
    { id: 'ASSET-89', name: 'CMRL Underground Tunnel Section 3', x: 380, y: 150, risk: 'NOMINAL', sensors: 12 },
    { id: 'ASSET-12', name: 'NH-4 Highway Overpass Connector', x: 140, y: 80, risk: 'CRITICAL', sensors: 3 }
  ];

  const riskColor = (risk) => ({
    CRITICAL: '#ef4444',
    HIGH: '#f97316',
    NOMINAL: '#10b981'
  }[risk] || '#6b7280');

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
    setSelectedElement({
      type: 'GIS Infrastructure Asset',
      id: asset.id,
      metrics: {
        AssetLabel: asset.name,
        Coordinates: `LAT: 19.03° N, LON: 72.81° E`,
        AuditedRiskIndex: asset.risk,
        ActiveSensorNodeCount: `${asset.sensors} Nodes`
      }
    });
  };

  const layers = [
    { id: 'sensors', label: 'SENSOR ARRAY HUDS', desc: 'Active dynamic telemetry nodes mapped across regional bridge pillars and metro rails.', icon: Radio },
    { id: 'risk', label: 'STRUCTURAL RISK ZONES', desc: 'Risk mapping based on fracture propagation thresholds and loading fatigue index.', icon: ShieldAlert },
    { id: 'geology', label: 'GEOLOGICAL FAULT SCHEMATIC', desc: 'Traces underground seismic shifting zones, oceanic currents, and water pressure vectors.', icon: Layers }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Sidebar Layer Selectors */}
      <div className="xl:col-span-1 space-y-4">
        
        {/* Layer Manager */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Map className="h-3.5 w-3.5 text-orange-500" />
            GIS TOPOGRAPHY LAYERS
          </div>
          <div className="zoho-card-body space-y-2">
            {layers.map((layer) => {
              const LayerIcon = layer.icon;
              const isActive = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                    borderColor: '#fed7aa'
                  } : {}}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                    isActive ? 'border-orange-200' : 'bg-white border-slate-200 hover:bg-orange-50 hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wide ${isActive ? 'text-orange-700' : 'text-slate-700'}`}>
                      {layer.label}
                    </span>
                    <LayerIcon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                  </div>
                  <p className={`text-[11px] mt-1.5 leading-relaxed ${isActive ? 'text-orange-600' : 'text-slate-400'}`}>
                    {layer.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Asset details HUD */}
        {selectedAsset && (
          <div className="zoho-card">
            <div className="zoho-card-header">
              <Target className="h-3.5 w-3.5 text-orange-500" />
              ASSET GEO-TELEMETRY
            </div>
            <div className="zoho-card-body space-y-2.5 text-[12px]">
              <div className="font-bold p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-800 text-[11px] truncate">{selectedAsset.name}</div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500">COORDINATES:</span>
                <span className="text-slate-700">19.033° N, 72.818° E</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500">RISK EVALUATION:</span>
                <span 
                  className="font-bold text-[11px] px-2 py-0.5 rounded-full"
                  style={{ color: riskColor(selectedAsset.risk), backgroundColor: riskColor(selectedAsset.risk) + '15' }}
                >
                  {selectedAsset.risk}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">ACTIVE SENSORS:</span>
                <span className="text-slate-700 font-semibold">{selectedAsset.sensors} Transducers</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Map Schematic & Drone visual inspect */}
      <div className="xl:col-span-2 space-y-4">
        
        {/* Main Vector Schematic Map */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Map className="h-3.5 w-3.5 text-orange-500" />
            <span>REGIONAL INFRASTRUCTURE TOPOGRAPHIC MAP</span>
            <span className="ml-auto text-[11px] text-slate-400 font-normal">Select asset coordinates to target drone inspect</span>
          </div>
          <div className="zoho-card-body">
            <div className="w-full h-[280px] rounded-xl overflow-hidden border border-slate-200 relative" style={{ background: '#f8fafc' }}>
              {/* Grid overlay */}
              <div className="absolute inset-0 cad-grid rounded-xl" />
              <svg viewBox="0 0 550 280" className="w-full h-full absolute inset-0">
                {/* Main bridge line */}
                <path d="M 0 100 Q 150 140 250 80 T 550 180 L 550 280 L 0 280 Z" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <path d="M 120 0 Q 220 80 300 40 T 480 90 L 550 50 L 550 0 Z" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="80" y1="90" x2="480" y2="190" stroke="#94a3b8" strokeWidth="3" />
                <line x1="80" y1="90" x2="480" y2="190" stroke="#f97316" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.6" />
                <text x="280" y="125" fill="#94a3b8" fontSize="7" fontWeight="600" transform="rotate(14 280 125)">
                  SUSPENSION BRIDGELINK SECTOR 4
                </text>
                {activeLayer === 'geology' && (
                  <path d="M 40 40 L 150 180 L 320 220 L 520 260" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="1,6" opacity="0.6" />
                )}
                {activeLayer === 'risk' && (
                  <g>
                    <circle cx="220" cy="110" r="45" fill="rgba(239,68,68,0.05)" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
                    <text x="220" y="60" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#ef4444">STRUCTURAL RISK CORRIDOR</text>
                  </g>
                )}
                {assets.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  const color = riskColor(asset.risk);
                  return (
                    <g key={asset.id} className="cursor-pointer" onClick={() => handleAssetClick(asset)}>
                      {/* Pulse ring */}
                      {activeLayer === 'sensors' && (
                        <circle cx={asset.x} cy={asset.y} r="20" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                      )}
                      {isSelected && (
                        <circle cx={asset.x} cy={asset.y} r="12" fill={color} opacity="0.15" />
                      )}
                      <circle cx={asset.x} cy={asset.y} r="6" fill={isSelected ? color : '#ffffff'} stroke={color} strokeWidth="2" />
                      {isSelected && (
                        <circle cx={asset.x} cy={asset.y} r="3" fill="#ffffff" />
                      )}
                      <text x={asset.x + 12} y={asset.y + 4} fill="#475569" fontSize="7" fontWeight="bold">{asset.id}</text>
                    </g>
                  );
                })}
              </svg>
              {/* Legend */}
              <div className="absolute bottom-3 left-3 p-2 rounded-lg bg-white/90 border border-slate-200 text-[10px] font-mono space-y-0.5 shadow-sm">
                <div className="text-slate-600">GEO-GRID: WGS-84</div>
                <div className="text-slate-600">BEARING: 12.4° NNE</div>
                <div className="text-orange-500 font-bold">LAYER: {activeLayer.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Drone Camera Feed Simulator */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Video className="h-3.5 w-3.5 text-orange-500" />
            <span>LIVE DRONE INSPECTION VIEWFINDER (SIMULATED)</span>
            <div className="ml-auto flex items-center gap-2 text-[11px] font-normal text-slate-500">
              <span>ZOOM:</span>
              <input 
                type="range" min="1.0" max="8.0" step="0.5" value={droneZoom}
                onChange={(e) => setDroneZoom(Number(e.target.value))}
                className="w-20 cursor-ew-resize"
                style={{ accentColor: '#f97316' }}
              />
              <span className="font-bold text-orange-600">{droneZoom.toFixed(1)}x</span>
            </div>
          </div>
          <div className="zoho-card-body">
            <div className="w-full h-[160px] rounded-xl overflow-hidden border border-slate-200 relative flex flex-col justify-between p-3" style={{ background: '#0f172a' }}>
              {/* Crosshair overlay */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <svg className="w-full h-full" style={{ opacity: 0.4 }}>
                  <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#f97316" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="#f97316" strokeWidth="1" strokeDasharray="4,4" />
                  <circle cx="50%" cy="50%" r="40" fill="none" stroke="#f97316" strokeWidth="0.75" />
                  <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#f97316" strokeWidth="1" className="animate-pulse" />
                </svg>
              </div>
              {/* HUD Top */}
              <div className="flex justify-between w-full font-mono text-[11px] text-orange-400 font-bold z-10">
                <div className="space-y-0.5">
                  <div>ALTITUDE: 42.8m</div>
                  <div>YAW: 104.2° PITCH: -24.8°</div>
                </div>
                <div className="text-right space-y-0.5">
                  <div className="animate-pulse text-orange-300 font-black">● DRONE SCANNERS RUNNING</div>
                  <div className="text-orange-500">AUTOPILOT PATROL TRACK 3B</div>
                </div>
              </div>
              {/* HUD Bottom */}
              <div className="z-10 flex items-center gap-2">
                <Crosshair className="h-3.5 w-3.5 text-orange-400" />
                <span className="font-mono text-[11px] text-orange-300 font-bold">
                  TARGET LOCK: {selectedAsset ? selectedAsset.id : 'SEARCHING FOR SURFACE ANOMALIES...'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
