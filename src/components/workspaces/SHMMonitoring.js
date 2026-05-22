import React, { useState, useEffect, useRef } from 'react';
import { Activity, Bell, ShieldAlert, Cpu, RefreshCw, Layers } from 'lucide-react';

export default function SHMMonitoring({ selectedElement, setSelectedElement }) {
  const [activeSensor, setActiveSensor] = useState('ACCEL-01');
  const [sensorValues, setSensorValues] = useState({ strain: '124 με', tilt: '0.02°', temp: '28.4°C' });
  const [logs, setLogs] = useState([
    { time: '12:44:12', msg: 'System Core synchronization complete // Node-32 online.', severity: 'INFO' },
    { time: '12:44:15', msg: 'Acoustic Emission threshold within normal limits.', severity: 'INFO' }
  ]);

  const canvasRef = useRef(null);
  const fftRef = useRef(null);

  // Real-time wave telemetry ticking logic using requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let time = 0;
    
    const drawStream = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Grid lines
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 25) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // X-Axis baseline
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Plot multi-axes waves
      // Accel X (Solid Black)
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin((x + time) * 0.04) * 30 + Math.cos((x + time) * 0.08) * 10;
        if (x === 0) ctx.moveTo(x, canvas.height / 2 + y);
        else ctx.lineTo(x, canvas.height / 2 + y);
      }
      ctx.stroke();

      // Accel Y (Dotted Gray)
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.cos((x + time) * 0.05) * 20 + Math.sin((x + time) * 0.02) * 15;
        if (x === 0) ctx.moveTo(x, canvas.height / 2 + y);
        else ctx.lineTo(x, canvas.height / 2 + y);
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      time += 2;
      animationId = requestAnimationFrame(drawStream);
    };

    drawStream();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // FFT frequency distribution ticking
  useEffect(() => {
    const canvas = fftRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let offset = 0;
    
    const drawFFT = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Draw FFT Bar spectrum in pure black and white hatches
      ctx.fillStyle = '#000000';
      const barWidth = 6;
      const spacing = 4;
      const count = Math.floor(canvas.width / (barWidth + spacing));
      
      for (let i = 0; i < count; i++) {
        // Procedural height fluctuating over time
        const noise = Math.sin(i * 0.5 + offset) * 15 + Math.cos(i * 0.1 - offset) * 10;
        const baseHeight = 15 + (i % 5) * 8 + noise;
        const finalHeight = Math.max(5, Math.min(canvas.height - 10, baseHeight));
        
        ctx.fillRect(i * (barWidth + spacing), canvas.height - finalHeight, barWidth, finalHeight);
      }

      offset += 0.05;
      animationId = requestAnimationFrame(drawFFT);
    };

    drawFFT();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const triggerManualAlert = () => {
    const timestamp = new Date().toTimeString().slice(0, 8);
    const newLog = {
      time: timestamp,
      msg: `[ALARM] Resonance threshold exceeded (4.8 Hz) in Sensor Node ${activeSensor}.`,
      severity: 'CRITICAL'
    };
    setLogs([newLog, ...logs]);
    
    setSelectedElement({
      type: 'Vibration Transducer Sensor',
      id: activeSensor,
      metrics: {
        DynamicTensionMetric: '48.9 kN',
        LocalFrequency: '4.8 Hz (RESONANCE WARNING)',
        OperationalTemp: '31.2°C',
        AcousticEmissions: 'High Decibel Burst'
      }
    });
  };

  const handleSensorSelect = (sensorId) => {
    setActiveSensor(sensorId);
    
    // Simulate updating parameters
    let strainVal = '112 με';
    let tiltVal = '0.01°';
    if (sensorId === 'ACCEL-02') {
      strainVal = '245 με';
      tiltVal = '0.05°';
    } else if (sensorId === 'STRAIN-09') {
      strainVal = '310 με (HIGH)';
      tiltVal = '0.12°';
    }

    setSensorValues({ strain: strainVal, tilt: tiltVal, temp: '29.1°C' });

    setSelectedElement({
      type: 'SHM Sensor Node',
      id: sensorId,
      metrics: {
        StrainGaugeValue: strainVal,
        InclinometerTilt: tiltVal,
        LocalSensorTemperature: '29.1°C',
        SyncRate: '99.8%'
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 font-mono text-xs text-black">
      
      {/* Sensor Selection Matrix */}
      <div className="xl:col-span-1 space-y-6">
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">Sensor Arrays Channels</p>
          
          <div className="space-y-1.5">
            {['ACCEL-01', 'ACCEL-02', 'STRAIN-09', 'TILT-04', 'ACOUSTIC-12', 'TEMP-32'].map((sensor) => (
              <button
                key={sensor}
                onClick={() => handleSensorSelect(sensor)}
                className={`w-full text-left p-2 border font-bold transition-all flex items-center justify-between ${
                  activeSensor === sensor 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
              >
                <span>{sensor}</span>
                <span className={`h-2.5 w-2.5 rounded-full border ${activeSensor === sensor ? 'bg-white border-white' : 'bg-black border-black'}`}></span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sensor Diagnostics */}
        <div className="border-2 border-black p-4 bg-white space-y-2">
          <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">Channel Specifications</p>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span>STRAIN TELEMETRY:</span>
              <span className="font-bold">{sensorValues.strain}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span>TILT TELEMETRY:</span>
              <span className="font-bold">{sensorValues.tilt}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span>THERMAL SPEC:</span>
              <span>{sensorValues.temp}</span>
            </div>
          </div>
          
          <button 
            onClick={triggerManualAlert}
            className="w-full mt-2 py-1.5 bg-black text-white hover:bg-gray-800 border border-black font-bold uppercase text-[9px] flex items-center justify-center gap-1"
          >
            <Bell className="h-3 w-3" /> Simulate Resonance Spike
          </button>
        </div>
      </div>

      {/* Synchronized Real-time plotting streams */}
      <div className="xl:col-span-3 space-y-6">
        
        {/* Real-time Oscillation Plot */}
        <div className="border-2 border-black p-4 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-black pb-1.5">
            <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Activity className="h-4 w-4" /> Synchronized Accelerometer Stream (Node: {activeSensor})
            </span>
            <div className="flex items-center gap-3 text-[9px] text-gray-500 font-mono">
              <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-black inline-block"></span> X-AXIS</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-1 border-b border-dashed border-gray-500 inline-block"></span> Y-AXIS</span>
              <span>RATE: 200 Hz</span>
            </div>
          </div>

          <div className="w-full h-[180px] border border-black bg-white">
            <canvas ref={canvasRef} width={650} height={180} className="w-full h-full block" />
          </div>
        </div>

        {/* FFT spectral density & Live log streams split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* FFT Spectral Graph */}
          <div className="border-2 border-black p-4 bg-white space-y-3">
            <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">FFT Acoustic Frequency Distribution</p>
            <div className="w-full h-[120px] border border-black bg-white">
              <canvas ref={fftRef} width={300} height={120} className="w-full h-full block" />
            </div>
            <div className="flex justify-between text-[8px] text-gray-500">
              <span>0 Hz (DC)</span>
              <span>100 Hz (Nyquist)</span>
            </div>
          </div>

          {/* Alarm system logs */}
          <div className="border-2 border-black p-4 bg-white space-y-3 flex flex-col justify-between">
            <p className="font-bold border-b border-black pb-1.5 uppercase text-[10px]">SHM System Event Logs</p>
            
            <div className="flex-1 max-h-[110px] overflow-y-auto space-y-1.5 pr-1 font-mono text-[9px]">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`p-1.5 border text-[9px] ${
                    log.severity === 'CRITICAL' 
                      ? 'bg-black text-white border-black font-bold' 
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between font-bold text-[8px]">
                    <span>{log.time} | {log.severity}</span>
                  </div>
                  <p className="mt-0.5 leading-relaxed">{log.msg}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
