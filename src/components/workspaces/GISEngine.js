import React, { useState } from 'react';
import { Map, Layers, Radio, ShieldAlert, Target, Compass, Video } from 'lucide-react';

export default function GISEngine({ selectedElement, setSelectedElement }) {
  const [activeLayer, setActiveLayer] = useState('sensors'); // sensors, risk, geology
  const [droneZoom, setDroneZoom] = useState(1.0);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const assets = [
    { id: 'ASSET-42', name: 'BWSL Pier 42 Support Anchor', x: 220, y: 110, risk: 'HIGH', sensors: 4 },
    { id: 'ASSET-89', name: 'CMRL Underground Tunnel Section 3', x: 380, y: 150, risk: 'NOMINAL', sensors: 12 },
    { id: 'ASSET-12', name: 'NH-4 Highway Overpass Connector', x: 140, y: 80, risk: 'CRITICAL', sensors: 3 }
  ];

  const handleAssetClick = (asset, e) => {
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Sidebar Layer Selectors */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* Layer Manager */}
        <div className="border-2 border-black p-4 bg-white space-y-4">
          <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">GIS Topography Layers</p>
          
          <div className="space-y-2">
            <button
              onClick={() => setActiveLayer('sensors')}
              className={`w-full text-left p-2.5 border-2 transition-colors ${
                activeLayer === 'sensors' ? 'bg-black text-white border-black font-bold' : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>1. SENSOR ARRAY HUDS</span>
                <Radio className="h-4 w-4" />
              </div>
              <p className={`text-[8px] mt-1 ${activeLayer === 'sensors' ? 'text-gray-300' : 'text-gray-500'}`}>
                Active dynamic telemetry nodes mapped across regional bridge pillars and metro rails.
              </p>
            </button>

            <button
              onClick={() => setActiveLayer('risk')}
              className={`w-full text-left p-2.5 border-2 transition-colors ${
                activeLayer === 'risk' ? 'bg-black text-white border-black font-bold' : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>2. STRUCTURAL RISK ZONES</span>
                <ShieldAlert className="h-4 w-4" />
              </div>
              <p className={`text-[8px] mt-1 ${activeLayer === 'risk' ? 'text-gray-300' : 'text-gray-500'}`}>
                Risk mapping based on fracture propagation thresholds and loading fatigue index.
              </p>
            </button>

            <button
              onClick={() => setActiveLayer('geology')}
              className={`w-full text-left p-2.5 border-2 transition-colors ${
                activeLayer === 'geology' ? 'bg-black text-white border-black font-bold' : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>3. GEOLOGICAL FAULT SCHEMATIC</span>
                <Layers className="h-4 w-4" />
              </div>
              <p className={`text-[8px] mt-1 ${activeLayer === 'geology' ? 'text-gray-300' : 'text-gray-500'}`}>
                Traces underground seismic shifting zones, oceanic currents, and water pressure vectors.
              </p>
            </button>
          </div>
        </div>

        {/* Selected Asset details HUD */}
        {selectedAsset && (
          <div className="border-2 border-black p-4 bg-white space-y-3">
            <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">Asset Geo-Telemetry</p>
            <div className="space-y-1.5 text-[9px]">
              <div className="font-bold border border-black p-1 bg-gray-50 uppercase text-[10px] truncate">{selectedAsset.name}</div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span>COORDINATES:</span>
                <span>19.033° N, 72.818° E</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span>RISK EVALUATION:</span>
                <span className="font-bold underline">{selectedAsset.risk}</span>
              </div>
              <div className="flex justify-between">
                <span>ACTIVE MONITOR SENSORS:</span>
                <span>{selectedAsset.sensors} Transducers</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Map Schematic & Drone visual inspect */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Main Vector Schematic Map */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Map className="h-4.5 w-4.5" /> Regional Infrastructure Topographic Map
            </span>
            <span className="text-[8px] text-gray-500">Select asset coordinates to target drone inspect</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full h-[280px] border border-black bg-white cad-grid relative overflow-hidden">
            <svg className="w-full h-full absolute inset-0">
              {/* Landmass outlines */}
              <path d="M 0 100 Q 150 140 250 80 T 550 180 L 550 280 L 0 280 Z" fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M 120 0 Q 220 80 300 40 T 480 90 L 550 50 L 550 0 Z" fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="3,3" />

              {/* Suspension Bridge path representation */}
              <line x1="80" y1="90" x2="480" y2="190" stroke="#000000" strokeWidth="4" />
              <line x1="80" y1="90" x2="480" y2="190" stroke="#ffffff" strokeWidth="2" strokeDasharray="4,4" />
              <text x="280" y="125" fill="#000000" fontSize="8" fontWeight="bold" transform="rotate(14 280 125)">
                SUSPENSION BRIDGELINK SECTOR 4
              </text>

              {/* Draw active geological fault line if selected */}
              {activeLayer === 'geology' && (
                <path d="M 40 40 L 150 180 L 320 220 L 520 260" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeDasharray="1,6" />
              )}

              {/* Draw risk area outline (hashed circle) */}
              {activeLayer === 'risk' && (
                <g>
                  <circle cx="220" cy="110" r="40" fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="4,4" />
                  <text x="220" y="65" textAnchor="middle" fontSize="7" fontWeight="bold">STRUCTURAL RISK CORRIDOR</text>
                </g>
              )}

              {/* Asset Markers */}
              {assets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <g 
                    key={asset.id} 
                    className="cursor-pointer" 
                    onClick={(e) => handleAssetClick(asset, e)}
                  >
                    <rect 
                      x={asset.x - 6} 
                      y={asset.y - 6} 
                      width="12" 
                      height="12" 
                      fill={isSelected ? '#000000' : '#ffffff'} 
                      stroke="#000000" 
                      strokeWidth="2" 
                    />
                    {activeLayer === 'sensors' && (
                      <circle cx={asset.x} cy={asset.y} r="18" fill="none" stroke="#4b5563" strokeWidth="1" strokeDasharray="2,2" />
                    )}
                    <text x={asset.x + 10} y={asset.y + 4} fill="#000000" fontSize="8" fontWeight="bold">
                      {asset.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map scale watermark */}
            <div className="absolute bottom-2 left-2 p-1 border border-black bg-white text-[8px] font-mono space-y-0.5">
              <div>GEO-GRID: WGS-84 METERS</div>
              <div>COMPASS BEARING: 12.4° NNE</div>
              <div>ACTIVE LAYER: {activeLayer.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Live Drone Camera Feed Simulator */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Video className="h-4.5 w-4.5" /> Live Drone Inspection Viewfinder (Simulated)
            </span>
            <div className="flex items-center gap-2 text-[9px]">
              <span>ZOOM MAGNIFY:</span>
              <input 
                type="range" 
                min="1.0" 
                max="8.0" 
                step="0.5" 
                value={droneZoom} 
                onChange={(e) => setDroneZoom(Number(e.target.value))}
                className="w-20 accent-black cursor-ew-resize"
              />
              <span className="font-bold">{droneZoom.toFixed(1)}x</span>
            </div>
          </div>

          {/* Viewfinder display */}
          <div className="w-full h-[180px] border border-black bg-white relative flex flex-col justify-between p-3 overflow-hidden">
            
            {/* Viewfinder crosshairs SVG overlay */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <svg className="w-full h-full">
                {/* Center target crosshair */}
                <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#000000" strokeWidth="1" strokeDasharray="6,4" />
                <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="#000000" strokeWidth="1" strokeDasharray="6,4" />
                <rect x="calc(50% - 15px)" y="calc(50% - 15px)" width="30" height="30" fill="none" stroke="#000000" strokeWidth="1.5" />
                <circle cx="50%" cy="50%" r="50" fill="none" stroke="#000000" strokeWidth="0.75" />
                
                {/* Visual scanning horizontal sweep line */}
                <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#000000" strokeWidth="1.5" className="animate-pulse" />
              </svg>
            </div>

            {/* Viewfinder Telemetry */}
            <div className="flex justify-between w-full font-mono text-[8px] text-black font-bold z-10">
              <div className="space-y-0.5">
                <div>ALTITUDE: 42.8m</div>
                <div>YAW: 104.2° Pitch: -24.8°</div>
              </div>
              <div className="text-right space-y-0.5">
                <div className="animate-pulse font-black">DRONE SCANNERS RUNNING</div>
                <div>AUTOPILOT PATROL TRACK 3B</div>
              </div>
            </div>

            <div className="z-10 p-1 border border-black bg-white font-mono text-[8px] w-fit">
              TARGET LOCK: {selectedAsset ? selectedAsset.id : 'SEARCHING FOR SURFACE ANOMALIES...'}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
