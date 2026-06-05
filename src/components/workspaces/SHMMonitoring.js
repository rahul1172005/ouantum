'use client';
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    
    const drawStream = () => {
      ctx.fillStyle = '#fffbf7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#fde8d3';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 25) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 25) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
      }
      // Baseline
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      // Primary waveform — orange
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin((x + time) * 0.04) * 30 + Math.cos((x + time) * 0.08) * 10;
        if (x === 0) ctx.moveTo(x, canvas.height / 2 + y);
        else ctx.lineTo(x, canvas.height / 2 + y);
      }
      ctx.stroke();
      // Secondary waveform — amber dashed
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.cos((x + time) * 0.05) * 20 + Math.sin((x + time) * 0.02) * 15;
        if (x === 0) ctx.moveTo(x, canvas.height / 2 + y);
        else ctx.lineTo(x, canvas.height / 2 + y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      time += 2;
      animationId = requestAnimationFrame(drawStream);
    };
    drawStream();
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const canvas = fftRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let offset = 0;
    
    const drawFFT = () => {
      ctx.fillStyle = '#fffbf7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#fde8d3';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      const barWidth = 6;
      const spacing = 4;
      const count = Math.floor(canvas.width / (barWidth + spacing));
      for (let i = 0; i < count; i++) {
        const noise = Math.sin(i * 0.5 + offset) * 15 + Math.cos(i * 0.1 - offset) * 10;
        const baseHeight = 15 + (i % 5) * 8 + noise;
        const finalHeight = Math.max(5, Math.min(canvas.height - 10, baseHeight));
        // Gradient orange bars
        const grad = ctx.createLinearGradient(0, canvas.height - finalHeight, 0, canvas.height);
        grad.addColorStop(0, '#f97316');
        grad.addColorStop(1, '#fbbf24');
        ctx.fillStyle = grad;
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
    let strainVal = '112 με';
    let tiltVal = '0.01°';
    if (sensorId === 'ACCEL-02') { strainVal = '245 με'; tiltVal = '0.05°'; }
    else if (sensorId === 'STRAIN-09') { strainVal = '310 με (HIGH)'; tiltVal = '0.12°'; }
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
      <div className="xl:col-span-1 space-y-4">
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Activity className="h-3.5 w-3.5 text-orange-500" />
            SENSOR ARRAY CHANNELS
          </div>
          <div className="zoho-card-body space-y-1.5">
            {['ACCEL-01', 'ACCEL-02', 'STRAIN-09', 'TILT-04', 'ACOUSTIC-12', 'TEMP-32'].map((sensor) => (
              <button
                key={sensor}
                onClick={() => handleSensorSelect(sensor)}
                style={activeSensor === sensor ? {
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  border: 'none',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px 0 rgba(249,115,22,0.25)'
                } : {}}
                className={`w-full text-left p-2.5 border font-bold transition-all flex items-center justify-between rounded-lg ${
                  activeSensor === sensor 
                    ? 'text-white' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-orange-200 hover:bg-orange-50'
                }`}
              >
                <span>{sensor}</span>
                <span className={`h-2.5 w-2.5 rounded-full ${activeSensor === sensor ? 'bg-white' : 'bg-orange-400'}`}></span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sensor Diagnostics */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Cpu className="h-3.5 w-3.5 text-orange-500" />
            CHANNEL SPECIFICATIONS
          </div>
          <div className="zoho-card-body space-y-2 text-[12px]">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">STRAIN TELEMETRY:</span>
              <span className="font-bold text-slate-800">{sensorValues.strain}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">TILT TELEMETRY:</span>
              <span className="font-bold text-slate-800">{sensorValues.tilt}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">THERMAL SPEC:</span>
              <span className="text-slate-800">{sensorValues.temp}</span>
            </div>
            <button 
              onClick={triggerManualAlert}
              className="w-full mt-2 py-2 font-bold uppercase text-[12px] flex items-center justify-center gap-1.5 rounded-lg transition-all bg-black text-white"
            >
              <Bell className="h-3 w-3" /> Simulate Resonance Spike
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Real-time plotting streams */}
      <div className="xl:col-span-3 space-y-4">
        
        {/* Real-time Oscillation Plot */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Activity className="h-3.5 w-3.5 text-orange-500" />
            <span>SYNCHRONIZED ACCELEROMETER STREAM (NODE: {activeSensor})</span>
            <div className="ml-auto flex items-center gap-3 text-[12px] text-slate-400 font-normal">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full bg-orange-500 inline-block"></span> X-AXIS
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-b-2 border-dashed border-amber-400 inline-block"></span> Y-AXIS
              </span>
              <span className="text-orange-500 font-semibold">RATE: 200 Hz</span>
            </div>
          </div>
          <div className="zoho-card-body">
            <div className="w-full h-[180px] rounded-xl overflow-hidden border border-orange-100">
              <canvas ref={canvasRef} width={650} height={180} className="w-full h-full block" />
            </div>
          </div>
        </div>

        {/* FFT spectral density & Live log streams split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* FFT Spectral Graph */}
          <div className="zoho-card">
            <div className="zoho-card-header">
              <Layers className="h-3.5 w-3.5 text-orange-500" />
              FFT ACOUSTIC FREQUENCY DISTRIBUTION
            </div>
            <div className="zoho-card-body">
              <div className="w-full h-[120px] rounded-xl overflow-hidden border border-orange-100">
                <canvas ref={fftRef} width={300} height={120} className="w-full h-full block" />
              </div>
              <div className="flex justify-between text-[12px] text-slate-400 mt-2">
                <span>0 Hz (DC)</span>
                <span>100 Hz (Nyquist)</span>
              </div>
            </div>
          </div>

          {/* Alarm system logs */}
          <div className="zoho-card">
            <div className="zoho-card-header">
              <Bell className="h-3.5 w-3.5 text-orange-500" />
              SHM SYSTEM EVENT LOGS
            </div>
            <div className="zoho-card-body">
              <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1 font-mono text-[12px]">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded-lg text-[12px] ${
                      log.severity === 'CRITICAL' 
                        ? 'bg-red-50 border border-red-200 text-red-700 font-bold' 
                        : 'bg-slate-50 text-slate-600 border border-slate-100'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-[11px] mb-0.5">
                      <span className={log.severity === 'CRITICAL' ? 'text-red-500' : 'text-orange-500'}>{log.time}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${log.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{log.severity}</span>
                    </div>
                    <p className="leading-relaxed">{log.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
