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
      
      // Grid lines
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Base line
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Seismic wave plotting - large amplitudes representing critical load danger
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        // High frequency, high amplitude spikes
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
      <div className="xl:col-span-1 space-y-6">
        
        {/* Warning striping board */}
        <div className="border-4 border-double border-black p-4 bg-white space-y-4">
          
          {/* Hazard striped warning banner */}
          <div className="hazard-hatch h-8 flex items-center justify-center border-b border-black">
            <span className="bg-white text-black px-2 py-0.5 font-black uppercase text-[10px] tracking-wider border border-black flex items-center gap-1">
              <AlertOctagon className="h-4.5 w-4.5 animate-pulse" /> RED ALERT STATE V
            </span>
          </div>

          <p className="font-black text-center text-xs uppercase">EMERGENCY EXECUTIVE COMMAND</p>
          <p className="text-[10px] leading-relaxed text-center text-gray-700">
            Seismic loadings exceed 4.2 coefficient margins. Rapid displacement shear cracks detected on primary suspension anchorage joints.
          </p>

          <div className="p-3 border border-black bg-gray-50 text-[10px] space-y-1 font-bold">
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

        {/* Manual Lock Control Switches */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">Autonomic isolation clearances</p>
          
          <div className="space-y-2">
            <button
              onClick={() => setSeismicShutoff(!seismicShutoff)}
              className="w-full p-2 border border-black flex items-center justify-between font-bold"
            >
              <span>1. ENGAGE SEISMIC SHUTOFF VALVES</span>
              <span className={`px-2 py-0.5 border text-[8px] ${seismicShutoff ? 'bg-black text-white' : 'bg-white'}`}>
                {seismicShutoff ? 'ENGAGED' : 'OFFLINE'}
              </span>
            </button>

            <button
              onClick={() => setBarrierLock(!barrierLock)}
              className="w-full p-2 border border-black flex items-center justify-between font-bold"
            >
              <span>2. LOCK METRO TRACK BARRIERS</span>
              <span className={`px-2 py-0.5 border text-[8px] ${barrierLock ? 'bg-black text-white' : 'bg-white'}`}>
                {barrierLock ? 'LOCKED' : 'OPEN'}
              </span>
            </button>

            <button
              onClick={() => setPersonnelEvac(!personnelEvac)}
              className="w-full p-2 border border-black flex items-center justify-between font-bold"
            >
              <span>3. SIRENS EVACUATION PROTOCOL</span>
              <span className={`px-2 py-0.5 border text-[8px] ${personnelEvac ? 'bg-black text-white' : 'bg-white'}`}>
                {personnelEvac ? 'EVACUATING' : 'SILENT'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Evacuation plan schematic & Seismic graph */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Seismic Telemetry Wave */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-black pb-1.5">
            <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Zap className="h-4.5 w-4.5" /> High-frequency seismic transducer feeds
            </span>
            <span className="text-[9px] text-gray-500 font-mono">MAGNITUDE RATINGS: CRITICAL PEAK</span>
          </div>

          <div className="w-full h-[150px] border border-black bg-white">
            <canvas ref={canvasRef} width={500} height={150} className="w-full h-full block" />
          </div>
        </div>

        {/* Master override trigger card */}
        <div className="border-2 border-black p-6 bg-white flex flex-col items-center justify-center space-y-4">
          <div className="text-center space-y-1.5">
            <p className="font-black text-sm uppercase">FINAL CORE SYSTEM OVERRIDE</p>
            <p className="text-[10px] text-gray-500 max-w-md mx-auto">
              Warning: Activating the Master Isolation protocol engages hydraulic locks across NH Bridge Pier 42 and suspends metro systems immediately.
            </p>
          </div>

          {!isSystemIsolated ? (
            <button 
              onClick={() => setTriggerModal(true)}
              className="px-6 py-3 border-4 border-double border-black bg-black text-white font-black hover:bg-gray-800 text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <ShieldAlert className="h-5 w-5 text-white" /> Trigger manual system isolation
            </button>
          ) : (
            <div className="p-4 border-2 border-dashed border-black bg-black text-white text-center w-full max-w-md font-bold space-y-1.5">
              <p className="text-xs font-black uppercase">SYSTEM SECURED // LOCKDOWN EFFECTIVE</p>
              <p className="text-[9px] text-gray-300 font-normal">All hydraulic isolators deployed. Metro train arrays stopped in Station 4A.</p>
              <button 
                onClick={() => setIsSystemIsolated(false)}
                className="mt-2 text-[9px] underline text-white bg-transparent border-none font-bold"
              >
                Reset System State (Emergency Restore)
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Confirmation Modal */}
      {triggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm">
          <div className="w-full max-w-md border-4 border-black p-6 bg-white space-y-6">
            <div className="flex items-start gap-4">
              <AlertOctagon className="h-8 w-8 text-black flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-black text-sm uppercase">VERIFY SYSTEM LOCKOUT PROTOCOL</p>
                <p className="text-[10px] text-gray-700 leading-relaxed font-mono">
                  This action suspends transit lines, locks pneumatic anchor columns, and triggers state evacuation channels. Under RBAC Policy Tier 1, this represents an irreversible logging action.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleSystemIsolation}
                className="flex-1 py-2 bg-black text-white font-black hover:bg-gray-800 border border-black uppercase text-[10px]"
              >
                PROCEED (KEY IN)
              </button>
              <button 
                onClick={() => setTriggerModal(false)}
                className="flex-1 py-2 bg-white text-black font-bold hover:bg-gray-100 border border-black uppercase text-[10px]"
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
