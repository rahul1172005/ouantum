import React, { useState, useEffect, useRef } from 'react';
import { AlertOctagon, ShieldAlert, Key, CheckSquare, XSquare, Zap, Eye, Lock, Siren } from 'lucide-react';

export default function EmergencySystem({ selectedElement, setSelectedElement }) {
  const [isSystemIsolated, setIsSystemIsolated] = useState(false);
  const [seismicShutoff, setSeismicShutoff] = useState(false);
  const [barrierLock, setBarrierLock] = useState(false);
  const [personnelEvac, setPersonnelEvac] = useState(false);
  const [triggerModal, setTriggerModal] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let offset = 0;
    
    const drawSeismicDanger = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Grid
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
      }

      // Baseline
      ctx.strokeStyle = 'rgba(239,68,68,0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Seismic waveform
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const baseFreq = 0.08;
        let y = Math.sin((x + offset) * baseFreq) * 12;
        if (x > 150 && x < 250) {
          y += Math.sin(x * 0.5) * (45 * Math.sin(offset * 0.1));
        }
        if (x === 0) ctx.moveTo(x, canvas.height / 2 + y);
        else ctx.lineTo(x, canvas.height / 2 + y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // HUD labels
      ctx.fillStyle = 'rgba(239,68,68,0.7)';
      ctx.font = 'bold 7px Courier New';
      ctx.fillText('SEISMIC MAGNITUDE — LIVE TELEMETRY FEED', 8, 12);
      ctx.fillText(`PEAK: ${(4.2 + Math.sin(offset * 0.05) * 0.3).toFixed(2)} g`, 8, canvas.height - 6);
      ctx.fillStyle = 'rgba(248,113,113,0.5)';
      ctx.fillText(`OFFSET: ${(offset / 100).toFixed(1)}s`, canvas.width - 70, canvas.height - 6);

      offset += 3;
      animationId = requestAnimationFrame(drawSeismicDanger);
    };

    drawSeismicDanger();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleSystemIsolation = () => {
    setIsSystemIsolated(true);
    setSeismicShutoff(true);
    setBarrierLock(true);
    setPersonnelEvac(true);
    setTriggerModal(false);
    setSelectedElement({
      type: 'Emergency System State',
      id: 'SYS-LOCKDOWN-42',
      metrics: {
        IsolationCode: 'ISOLATION LEVEL IV ENGAGED',
        SeismicValves: 'SHUTDOWN DIRECTED',
        LockoutBarriers: 'SECURED & CLOSED',
        EvacuationAlert: 'SIRENS DEPLOYED ON-SITE',
        ActionTimestamp: new Date().toISOString().slice(11, 19)
      }
    });
  };

  const isolationItems = [
    { label: '1. ENGAGE SEISMIC SHUTOFF VALVES', state: seismicShutoff, setState: setSeismicShutoff, onLabel: 'ENGAGED', offLabel: 'OFFLINE' },
    { label: '2. LOCK METRO TRACK BARRIERS', state: barrierLock, setState: setBarrierLock, onLabel: 'LOCKED', offLabel: 'OPEN' },
    { label: '3. SIRENS EVACUATION PROTOCOL', state: personnelEvac, setState: setPersonnelEvac, onLabel: 'EVACUATING', offLabel: 'SILENT' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Warning panel HUD */}
      <div className="xl:col-span-1 space-y-4">
        
        {/* Warning board */}
        <div className="zoho-card overflow-hidden">
          <div className="zoho-card-header" style={{ 
            background: 'repeating-linear-gradient(45deg, #7f1d1d, #7f1d1d 8px, #991b1b 8px, #991b1b 16px)', 
            color: '#fff',
            borderBottom: '1px solid #dc2626'
          }}>
            <AlertOctagon className="h-3.5 w-3.5 animate-pulse text-red-300" />
            <span className="text-red-100">RED ALERT STATE V</span>
          </div>
          <div className="zoho-card-body space-y-3 bg-red-950/5">
            <p className="font-black text-center text-xs uppercase text-red-800">EMERGENCY EXECUTIVE COMMAND</p>
            <p className="text-[12px] leading-relaxed text-center text-slate-600">
              Seismic loadings exceed 4.2 coefficient margins. Rapid displacement shear cracks detected on primary suspension anchorage joints.
            </p>
            <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-[12px] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">COLLAPSE DANGER ODDS:</span>
                <span className="text-red-600 font-black animate-pulse">CRITICAL RANGE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">ACTIVE SITE PERSONNEL:</span>
                <span className="font-bold text-slate-800">18 WORKERS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">ISOLATION PROTOCOL:</span>
                <span className={`font-bold text-[11px] px-2 py-0.5 rounded-full ${isSystemIsolated ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-500'}`}>
                  {isSystemIsolated ? 'LEVEL IV ACTIVE' : 'STANDBY'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Lock Control Switches */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Key className="h-3.5 w-3.5 text-orange-500" />
            AUTONOMIC ISOLATION CLEARANCES
          </div>
          <div className="zoho-card-body space-y-2.5">
            {isolationItems.map((item, i) => (
              <button
                key={i}
                onClick={() => item.setState(!item.state)}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between font-bold transition-all ${
                  item.state 
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-orange-200 hover:bg-orange-50/50'
                }`}
              >
                <span className="text-[11px] text-left">{item.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-2 ${
                  item.state ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.state ? item.onLabel : item.offLabel}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Evacuation plan schematic & Seismic graph */}
      <div className="xl:col-span-2 space-y-4">
        
        {/* Seismic Telemetry Wave */}
        <div className="zoho-card overflow-hidden">
          <div className="zoho-card-header">
            <Zap className="h-3.5 w-3.5 text-red-500 animate-pulse" />
            HIGH-FREQUENCY SEISMIC TRANSDUCER FEEDS
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 font-bold animate-pulse">MAGNITUDE: CRITICAL PEAK</span>
          </div>
          <div className="zoho-card-body p-0">
            <div className="w-full h-[150px] bg-slate-900 rounded-b-2xl overflow-hidden">
              <canvas ref={canvasRef} width={500} height={150} className="w-full h-full block" />
            </div>
          </div>
        </div>

        {/* Master override trigger card */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <ShieldAlert className="h-3.5 w-3.5 text-orange-500" />
            FINAL CORE SYSTEM OVERRIDE
          </div>
          <div className="zoho-card-body flex flex-col items-center justify-center space-y-5 py-6">
            <div className="text-center space-y-2 max-w-md">
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Warning: Activating the Master Isolation protocol engages hydraulic locks across NH Bridge Pier 42 and suspends metro systems immediately.
              </p>
            </div>

            {!isSystemIsolated ? (
              <button 
                onClick={() => setTriggerModal(true)}
                className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
                style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', color: '#fff', border: 'none' }}
              >
                <ShieldAlert className="h-5 w-5" /> Trigger System Isolation
              </button>
            ) : (
              <div className="w-full max-w-md rounded-2xl border border-red-300 bg-red-50 p-5 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Lock className="h-5 w-5 text-red-600" />
                  <p className="text-sm font-black uppercase text-red-700">SYSTEM SECURED // LOCKDOWN EFFECTIVE</p>
                </div>
                <p className="text-[12px] text-red-600 leading-relaxed">All hydraulic isolators deployed. Metro train arrays stopped in Station 4A.</p>
                <button 
                  onClick={() => { setIsSystemIsolated(false); setSeismicShutoff(false); setBarrierLock(false); setPersonnelEvac(false); }}
                  className="mt-1 text-[11px] text-red-500 underline font-bold bg-transparent border-none cursor-pointer"
                >
                  Reset System State (Emergency Restore)
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {triggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl border border-red-300 bg-white p-6 space-y-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertOctagon className="h-7 w-7 text-red-600" />
              </div>
              <div className="space-y-1.5">
                <p className="font-black text-sm uppercase text-slate-800">VERIFY SYSTEM LOCKOUT PROTOCOL</p>
                <p className="text-[12px] text-slate-600 leading-relaxed font-mono">
                  This action suspends transit lines, locks pneumatic anchor columns, and triggers state evacuation channels. Under RBAC Policy Tier 1, this represents an irreversible logging action.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleSystemIsolation}
                className="flex-1 py-2.5 rounded-xl font-black uppercase text-[12px] text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', border: 'none' }}
              >
                PROCEED (KEY IN)
              </button>
              <button 
                onClick={() => setTriggerModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white text-slate-600 font-bold border border-slate-200 hover:bg-slate-50 uppercase text-[12px] transition-colors"
              >
                ABORT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
