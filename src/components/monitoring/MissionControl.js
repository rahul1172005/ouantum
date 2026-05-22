import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Tv, 
  AlertTriangle, 
  Flame, 
  UserX, 
  Compass, 
  Activity, 
  Volume2, 
  VolumeX,
  Gauge
} from 'lucide-react';
import { useCRMStore } from '@/store/crmStore';

export default function MissionControl() {
  const tickets = useCRMStore(state => state.tickets);
  const addTicket = useCRMStore(state => state.addTicket);

  const [emergencyActive, setEmergencyActive] = useState(false);
  const [muteSound, setMuteSound] = useState(true);
  const [droneAlt, setDroneAlt] = useState(42); // meters
  const [gasLevel, setGasLevel] = useState(12); // ppm
  const [loadLevel, setLoadLevel] = useState(48); // tons

  // Simulated live telemetry fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setDroneAlt(prev => Math.max(10, Math.min(120, prev + (Math.random() - 0.5) * 4)));
      setGasLevel(prev => Math.max(5, Math.min(100, prev + (Math.random() - 0.5) * 3)));
      setLoadLevel(prev => Math.max(30, Math.min(180, prev + (Math.random() - 0.5) * 6)));
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Trigger emergency override
  const handleEmergencyTrigger = () => {
    const nextState = !emergencyActive;
    setEmergencyActive(nextState);

    if (nextState) {
      addTicket({
        accountId: 'acc-1',
        title: 'MANUAL MISSION CONTROL EMERGENCY TRIGGERED: GAS & COMPLIANCE ANOMALY DETECTED',
        severity: 'CRITICAL',
        assetName: 'Core Infrastructure Hub',
        confidence: 100
      });
    }
  };

  return (
    <div className={`space-y-6 transition-all duration-500 p-2 rounded-xl ${
      emergencyActive ? 'bg-danger-red/10 border border-danger-red/40 scanlines relative overflow-hidden' : ''
    }`}>
      
      {/* 1. Header Alarm Command Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-electric-blue/15 pb-4">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-electric-blue flex items-center gap-2">
            <Video className="h-5 w-5 animate-pulse" /> Live NASA-Style Mission Control Center
          </h2>
          <p className="text-[10px] font-mono text-metallic-gray mt-1 uppercase">PORT HUDS: MUMBAI SEA LINK | SENSOR NODE FEED ARRAY</p>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-3 font-mono text-xs">
          
          {/* Mute alerts clicker */}
          <button 
            onClick={() => setMuteSound(!muteSound)}
            className={`p-2 rounded border transition-colors ${
              muteSound ? 'bg-white/5 text-metallic-gray border-white/10' : 'bg-electric-blue/15 text-electric-blue border-electric-blue/30'
            }`}
          >
            {muteSound ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5 animate-bounce" />}
          </button>

          {/* EMERGENCY ALARM OVERRIDE BUTTON */}
          <button
            onClick={handleEmergencyTrigger}
            className={`px-4 py-2 rounded font-bold uppercase border transition-all ${
              emergencyActive 
                ? 'bg-danger-red text-white border-danger-red neon-glow-red' 
                : 'bg-danger-red/15 text-danger-red border-danger-red/30 hover:bg-danger-red/35'
            }`}
          >
            {emergencyActive ? 'DISARM ALARM OVERRIDE' : 'FORCE EMERGENCY ALARM'}
          </button>

        </div>
      </div>

      {/* 2. Grid split panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CCTV AI Detection feed wireframe */}
        <div className="glass-panel rounded-xl overflow-hidden border border-electric-blue/15 bg-black/60 min-h-[300px] flex flex-col justify-between">
          <div className="p-3 border-b border-white/5 bg-secondary-bg/85 flex items-center justify-between font-mono text-xs">
            <span className="flex items-center gap-1.5 font-bold"><Tv className="h-4 w-4 text-electric-blue" /> CCTV AI-CAMERA 04</span>
            <span className="text-success-green animate-pulse">REC (1080P)</span>
          </div>
          
          {/* AI Bounding Boxes procedural animation */}
          <div className="flex-1 min-h-[220px] relative bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* Camera grid line overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(0,212,255,0.02),rgba(0,212,255,0.02))] bg-[size:100%_8px,8px_100%] pointer-events-none"></div>
            
            {/* Visualizer wireframe lines */}
            <svg className="absolute inset-0 w-full h-full opacity-40">
              <path d="M 20 20 L 120 180 L 220 80 L 320 200" stroke="#00d4ff" strokeWidth="1" fill="none" />
              <rect x="50" y="40" width="80" height="90" stroke="#7b61ff" strokeWidth="1.5" fill="none" className="animate-pulse" />
              <rect x="180" y="110" width="90" height="60" stroke="#ff4d6d" strokeWidth="1.5" fill="none" />
            </svg>

            {/* Bounding box overlays text */}
            <div className="absolute top-10 left-16 border border-ai-purple bg-ai-purple/10 px-1 py-0.5 rounded text-[8px] font-mono text-ai-purple">
              NODE B-12 | STRAIN CHECK: 94%
            </div>
            
            <div className="absolute bottom-24 right-20 border border-danger-red bg-danger-red/10 px-1 py-0.5 rounded text-[8px] font-mono text-danger-red animate-pulse">
              HAZARD: PILLAR ANOMALY DETECTED
            </div>

            {/* Simulated target crosshair */}
            <div className="w-12 h-12 rounded-full border border-dashed border-electric-blue/40 flex items-center justify-center animate-spin-slow">
              <div className="w-2 h-2 rounded-full bg-electric-blue animate-ping"></div>
            </div>
          </div>
          
          <div className="p-2.5 bg-secondary-bg/85 font-mono text-[9px] text-metallic-gray flex justify-between">
            <span>AZIMUTH: 184.22 | ELEV: -12.4</span>
            <span>MODEL: YOLOv8 INTEL CORE</span>
          </div>
        </div>

        {/* Drone Inspections Path telemetry */}
        <div className="glass-panel rounded-xl overflow-hidden border border-electric-blue/15 bg-black/60 min-h-[300px] flex flex-col justify-between">
          <div className="p-3 border-b border-white/5 bg-secondary-bg/85 flex items-center justify-between font-mono text-xs">
            <span className="flex items-center gap-1.5 font-bold"><Compass className="h-4 w-4 text-electric-blue animate-spin-slow" /> AUTONOMOUS DRONE APEX-9</span>
            <span className="text-electric-blue animate-pulse">NAV LOCK ON</span>
          </div>

          <div className="flex-1 min-h-[220px] relative bg-slate-950 p-4 font-mono text-[10px] space-y-3">
            <p className="text-metallic-gray">LIVE FLIGHT MATRIX TELEMETRY</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-2.5 bg-black/60 rounded border border-white/5">
                <p className="text-metallic-gray/70">ALTITUDE</p>
                <p className="text-base font-bold text-white-text mt-0.5">{droneAlt.toFixed(1)} M</p>
              </div>
              <div className="p-2.5 bg-black/60 rounded border border-white/5">
                <p className="text-metallic-gray/70">GPS FIX STATUS</p>
                <p className="text-base font-bold text-success-green mt-0.5">3D SECURE</p>
              </div>
              <div className="p-2.5 bg-black/60 rounded border border-white/5">
                <p className="text-metallic-gray/70">WIND LOAD RESIST</p>
                <p className="text-base font-bold text-alert-orange mt-0.5">38.4 KM/H</p>
              </div>
              <div className="p-2.5 bg-black/60 rounded border border-white/5">
                <p className="text-metallic-gray/70">AUTONOMY DEVIATION</p>
                <p className="text-base font-bold text-electric-blue mt-0.5">0.12%</p>
              </div>
            </div>

            {/* Simulated flight path bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] text-metallic-gray">
                <span>FLIGHT PATROL PATH PROGRESS</span>
                <span>84%</span>
              </div>
              <div className="w-full h-1.5 bg-black/80 rounded overflow-hidden">
                <div className="h-full bg-electric-blue rounded" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-secondary-bg/85 font-mono text-[9px] text-metallic-gray flex justify-between">
            <span>TX LOCK: 98% (ENCRYPTED)</span>
            <span>BATTERY LIFE: 68%</span>
          </div>
        </div>

        {/* Gas leak, overload, and worker safety logs */}
        <div className="glass-panel rounded-xl overflow-hidden border border-electric-blue/15 bg-black/60 min-h-[300px] flex flex-col justify-between">
          <div className="p-3 border-b border-white/5 bg-secondary-bg/85 flex items-center justify-between font-mono text-xs">
            <span className="flex items-center gap-1.5 font-bold"><Activity className="h-4 w-4 text-electric-blue" /> ENVIRONMENTAL HAZARD INTELLIGENCE</span>
            <span className="text-[10px] text-metallic-gray">NODE SENSORS</span>
          </div>

          <div className="flex-1 min-h-[220px] p-4 font-mono text-xs space-y-4">
            
            {/* Carbon monoxide/Gas check */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-metallic-gray">
                <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-danger-red" /> Toxic Gas Feed (CO/CH4)</span>
                <span className={gasLevel > 50 ? 'text-danger-red font-bold' : 'text-success-green'}>{gasLevel.toFixed(1)} PPM</span>
              </div>
              <div className="w-full h-2 bg-black rounded overflow-hidden">
                <div className={`h-full rounded transition-all duration-500 ${gasLevel > 50 ? 'bg-danger-red' : 'bg-success-green'}`} style={{ width: `${Math.min(100, gasLevel)}%` }}></div>
              </div>
            </div>

            {/* Overload force load */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-metallic-gray">
                <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5 text-electric-blue" /> Live Bearing Overload Stress</span>
                <span className="text-white-text">{loadLevel.toFixed(1)} Tons</span>
              </div>
              <div className="w-full h-2 bg-black rounded overflow-hidden">
                <div className="h-full bg-electric-blue rounded transition-all duration-500" style={{ width: `${Math.min(100, (loadLevel / 200) * 100)}%` }}></div>
              </div>
            </div>

            {/* Safety tracker */}
            <div className="space-y-1">
              <span className="text-metallic-gray flex items-center gap-1"><UserX className="h-3.5 w-3.5 text-alert-orange" /> Active Personnel Safety Tracking</span>
              <div className="p-2.5 bg-black/60 rounded border border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
                  <span className="text-white-text font-bold">14 Active Personnel on Site</span>
                </div>
                <span className="text-metallic-gray uppercase text-[9px]">RESTRICTED SECTOR ACC</span>
              </div>
            </div>

          </div>

          <div className="p-2.5 bg-secondary-bg/85 font-mono text-[9px] text-metallic-gray flex justify-between border-t border-white/5">
            <span>ZONE: WEST_SECTOR_LINK_PIER_42</span>
            <span>INTELL: SAFE</span>
          </div>
        </div>

      </div>

      {/* Full screen active alarm flashing warning overlay */}
      {emergencyActive && (
        <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg bg-danger-red border-2 border-white text-white font-mono text-xs flex items-center gap-3 animate-bounce shadow-2xl neon-glow-red">
          <AlertTriangle className="h-6 w-6 animate-pulse" />
          <div>
            <p className="font-bold uppercase tracking-wider">SYSTEM-WIDE CRITICAL SIREN ENABLED</p>
            <p className="text-[10px] opacity-90">Auto-logging diagnostics reports. Dispatching engineering drone squads...</p>
          </div>
        </div>
      )}

    </div>
  );
}
