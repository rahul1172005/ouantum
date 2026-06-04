import React, { useState, useEffect, useRef } from 'react';
import { AlertOctagon, ShieldAlert, Key, CheckSquare, XSquare, Zap, Eye } from 'lucide-react';

export default function EmergencySystem({ selectedElement, setSelectedElement }) {
  const [isSystemIsolated, setIsSystemIsolated] = useState(false);
  const [seismicShutoff, setSeismicShutoff] = useState(false);
  const [barrierLock, setBarrierLock] = useState(false);
  const [personnelEvac, setPersonnelEvac] = useState(false);
  const [triggerModal, setTriggerModal] = useState(false);

  const canvasRef = useRef(null);

  // Live ticking seismic danger earthquake graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let offset = 0;
    
    const drawSeismicDanger = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Warning panel HUD */}
      <div className="xl:col-span-1 space-y-4">
        
        {/* Warning striping board */}
        <div className="zoho-card">
          <div className="zoho-card-header" style={{ background: 'repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 8px, #333 8px, #333 16px)', color: '#fff' }}>
            <AlertOctagon className="h-3.5 w-3.5 animate-pulse" />
            RED ALERT STATE V
          </div>
          <div className="zoho-card-body space-y-3">
            <p className="font-black text-center text-xs uppercase">EMERGENCY EXECUTIVE COMMAND</p>
            <p className="text-[12px] leading-relaxed text-center text-gray-700">
              Seismic loadings exceed 4.2 coefficient margins. Rapid displacement shear cracks detected on primary suspension anchorage joints.
            </p>
            <div className="p-3 border border-border-default bg-gray-50 text-[12px] space-y-1 font-bold">
              <div className="flex justify-between">
                <span>COLLAPSE DANGER ODDS:</span>
                <span className="underline animate-pulse">CRITICAL RANGE</span>
              </div>
              <div className="flex justify-between">
                <span>ACTIVE SITE PERSONNEL:</span>
                <span>18 WORKERS</span>
              </div>
              <div className="flex justify-between">
                <span>ISOLATION PROTOCOL:</span>
                <span>{isSystemIsolated ? 'LEVEL IV ACTIVE' : 'STANDBY'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Lock Control Switches */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Key className="h-3.5 w-3.5" />
            AUTONOMIC ISOLATION CLEARANCES
          </div>
          <div className="zoho-card-body space-y-2">
            <button
              onClick={() => setSeismicShutoff(!seismicShutoff)}
              className="w-full p-2 border border-border-default flex items-center justify-between font-bold"
            >
              <span>1. ENGAGE SEISMIC SHUTOFF VALVES</span>
              <span className={`px-2 py-0.5 border text-[12px] ${seismicShutoff ? 'bg-black text-white' : 'bg-white'}`}>
                {seismicShutoff ? 'ENGAGED' : 'OFFLINE'}
              </span>
            </button>
            <button
              onClick={() => setBarrierLock(!barrierLock)}
              className="w-full p-2 border border-border-default flex items-center justify-between font-bold"
            >
              <span>2. LOCK METRO TRACK BARRIERS</span>
              <span className={`px-2 py-0.5 border text-[12px] ${barrierLock ? 'bg-black text-white' : 'bg-white'}`}>
                {barrierLock ? 'LOCKED' : 'OPEN'}
              </span>
            </button>
            <button
              onClick={() => setPersonnelEvac(!personnelEvac)}
              className="w-full p-2 border border-border-default flex items-center justify-between font-bold"
            >
              <span>3. SIRENS EVACUATION PROTOCOL</span>
              <span className={`px-2 py-0.5 border text-[12px] ${personnelEvac ? 'bg-black text-white' : 'bg-white'}`}>
                {personnelEvac ? 'EVACUATING' : 'SILENT'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Evacuation plan schematic & Seismic graph */}
      <div className="xl:col-span-2 space-y-4">
        
        {/* Seismic Telemetry Wave */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Zap className="h-3.5 w-3.5" />
            HIGH-FREQUENCY SEISMIC TRANSDUCER FEEDS
            <span className="ml-auto text-[12px] text-gray-500 font-normal">MAGNITUDE RATINGS: CRITICAL PEAK</span>
          </div>
          <div className="zoho-card-body">
            <div className="w-full h-[150px] border border-border-default bg-white">
              <canvas ref={canvasRef} width={500} height={150} className="w-full h-full block" />
            </div>
          </div>
        </div>

        {/* Master override trigger card */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <ShieldAlert className="h-3.5 w-3.5" />
            FINAL CORE SYSTEM OVERRIDE
          </div>
          <div className="zoho-card-body flex flex-col items-center justify-center space-y-4 py-6">
            <div className="text-center space-y-1.5">
              <p className="text-[12px] text-gray-500 max-w-md mx-auto">
                Warning: Activating the Master Isolation protocol engages hydraulic locks across NH Bridge Pier 42 and suspends metro systems immediately.
              </p>
            </div>

            {!isSystemIsolated ? (
              <button 
                onClick={() => setTriggerModal(true)}
                className="px-6 py-3 border border-border-default border-border-default bg-black text-white font-black hover:bg-gray-800 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <ShieldAlert className="h-5 w-5 text-white" /> Trigger manual system isolation
              </button>
            ) : (
              <div className="p-4 border-2 border-dashed border-border-default bg-black text-white text-center w-full max-w-md font-bold space-y-1.5">
                <p className="text-xs font-black uppercase">SYSTEM SECURED // LOCKDOWN EFFECTIVE</p>
                <p className="text-[12px] text-gray-300 font-normal">All hydraulic isolators deployed. Metro train arrays stopped in Station 4A.</p>
                <button 
                  onClick={() => setIsSystemIsolated(false)}
                  className="mt-2 text-[12px] underline text-white bg-transparent border-none font-bold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border-default p-6 bg-white space-y-6">
            <div className="flex items-start gap-4">
              <AlertOctagon className="h-8 w-8 text-black flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-black text-sm uppercase">VERIFY SYSTEM LOCKOUT PROTOCOL</p>
                <p className="text-[12px] text-gray-700 leading-relaxed font-mono">
                  This action suspends transit lines, locks pneumatic anchor columns, and triggers state evacuation channels. Under RBAC Policy Tier 1, this represents an irreversible logging action.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleSystemIsolation}
                className="flex-1 py-2 bg-black text-white font-black hover:bg-gray-800 border border-border-default uppercase text-[12px]"
              >
                PROCEED (KEY IN)
              </button>
              <button 
                onClick={() => setTriggerModal(false)}
                className="flex-1 py-2 bg-white text-black font-bold hover:bg-gray-100 border border-border-default uppercase text-[12px]"
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
