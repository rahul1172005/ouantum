import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, 
  Send, 
  Bot, 
  HelpCircle, 
  LineChart, 
  Hourglass, 
  TrendingDown, 
  Mic, 
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useCRMStore } from '@/store/crmStore';

export default function AIAnalysisCenter() {
  const tickets = useCRMStore(state => state.tickets);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Ouantum AI Neural Agent online. Telemetry sync active. How can I assist you with infrastructure auditing, predictive wear mapping, or stress diagnostics?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [fatigueForecast, setFatigueForecast] = useState(() => {
    const data = [];
    for (let i = 0; i <= 6; i++) {
      const days = i * 30;
      data.push({
        day: `Day ${days}`,
        fatigue: 12 + Math.pow(i, 2.2) * 3, // Exponential wear
        limit: 80
      });
    }
    return data;
  });
  const waveformRef = useRef(null);

  // Procedural futuristic streaming sound wave visualization (Canvas)
  useEffect(() => {
    if (!waveformRef.current) return;
    const canvas = waveformRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      for (let x = 0; x < width; x++) {
        // Overlay multiple sine waves to form an authentic neural wave
        const y = centerY + 
          Math.sin(x * 0.05 + time) * 10 * Math.sin(x * 0.01) + 
          Math.cos(x * 0.03 - time * 0.5) * 5;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      time += 0.08;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputMessage('');
    setIsTyping(true);

    // AI typing simulator
    setTimeout(() => {
      let aiResponse = "Analyzed remote sensor registers. ";
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes('pillar') || lowerText.includes('b-12') || lowerText.includes('crack')) {
        aiResponse = "INTELLIGENCE UPDATE: Pillar B-12 acoustic emission sensor detects micro-crack propagation in the support cylinder. Stress index is at 94%. Recommendation: Schedule ultrasonic structural validation within 7 days. Critical failure probability remains low (3.2%) but velocity curve is warning.";
      } else if (lowerText.includes('corrosion') || lowerText.includes('nhai') || lowerText.includes('bridge')) {
        aiResponse = "DIAGNOSTIC REPORT: NHAI Highway Bridge-42 corrosion sensors near Pier 42 indicate chemical wear acceleration at +14% year-over-year. Structural steel density is within compliance safety tolerances (78%), but localized galvanic corrosion is mapped. Recommended action: Cathodic protection inspection.";
      } else if (lowerText.includes('ndt') || lowerText.includes('auditing')) {
        aiResponse = "NDT ANALYSIS: Standard Non-Destructive Testing protocols (Ultrasonic Velocity, Rebound Hammer, and Magnetic Particle) indicate structural concrete strength averages 42 MPa across current assets, satisfying global ISO compliance thresholds.";
      } else {
        aiResponse = "Diagnostic registers parsed. No immediate critical limits exceeded across passive strain gauges. Automated structural health audit reports compiled and queued for validation.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Columns: Chat intelligence console */}
      <div className="lg:col-span-2 glass-panel rounded-[8px]-xl border border-[#ea580c]/15 bg-secondary-bg/60 p-4 flex flex-col justify-between min-h-[460px]">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 font-mono text-xs">
          <span className="flex items-center gap-2 font-bold text-[#ea580c]">
            <Bot className="h-5 w-5 animate-pulse text-orange-500" /> Ouantum AI Operating Assistant
          </span>
          <span className="text-[12px] text-metallic-gray">CORE INTEGRATION V3.5</span>
        </div>

        {/* Text Feed messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 max-h-[300px]">
          {messages.map((msg, index) => (
            <div 
              key={index}
              className={`flex gap-3 max-w-[85%] font-mono text-xs ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {/* Avatar indicator */}
              <div className={`w-8 h-8 rounded-[8px]-full border flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-[#ea580c]/10 border-[#ea580c]/30 text-[#ea580c]' 
                  : 'bg-orange-500/10 border-orange-500/30 text-orange-600'
              }`}>
                {msg.role === 'user' ? 'U' : 'AI'}
              </div>

              {/* Message block */}
              <div className={`p-3 rounded-[8px]-lg border leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#ea580c]/10 border-[#ea580c]/20 text-white-text' 
                  : 'bg-black/40 border-white/5 text-metallic-gray'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-mono text-metallic-gray">
              <Bot className="h-4 w-4 text-orange-500 animate-bounce" /> Streaming AI metrics...
            </div>
          )}
        </div>

        {/* Dynamic Preset Questions triggers */}
        <div className="mb-4">
          <p className="text-[12px] font-mono text-metallic-gray uppercase tracking-wider mb-2 font-bold flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> Preset Diagnostic Enquiries
          </p>
          <div className="flex flex-wrap gap-2 text-[12px] font-mono">
            <button 
              onClick={() => handleSendMessage("Inspect structural health anomalies in Pillar B-12")}
              className="px-2.5 py-1.5 rounded-[8px] bg-black/40 hover:bg-orange-500/15 border border-white/5 hover:border-orange-500/40 text-metallic-gray hover:text-white-text transition-all"
            >
              Analyze Pillar B-12 Anomaly
            </button>
            <button 
              onClick={() => handleSendMessage("Perform risk forecast for NHAI Highway Bridge corrosion")}
              className="px-2.5 py-1.5 rounded-[8px] bg-black/40 hover:bg-orange-500/15 border border-white/5 hover:border-orange-500/40 text-metallic-gray hover:text-white-text transition-all"
            >
              Corrosion wear mapping NHAI
            </button>
          </div>
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Ask AI structure diagnostics, compliance safety index, or forecast failures..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full h-10 px-4 rounded-[8px]-lg bg-black/40 border border-white/10 text-white-text focus:outline-none focus:border-[#ea580c] transition-colors font-mono text-xs placeholder-metallic-gray/50"
            />
            {/* Holographic Waveform input canvas overlay */}
            <canvas ref={waveformRef} width="80" height="24" className="absolute right-4 top-2 opacity-65 pointer-events-none"></canvas>
          </div>
          <button 
            onClick={() => handleSendMessage()}
            className="w-10 h-10 rounded-[8px]-lg bg-orange-500/15 hover:bg-orange-500/35 text-orange-600 border border-orange-500/30 flex items-center justify-center transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Right Column: Predictive fatigue curves and charts */}
      <div className="glass-panel rounded-[8px]-xl border border-[#ea580c]/15 bg-secondary-bg/60 p-4 flex flex-col justify-between min-h-[460px]">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ea580c] flex items-center gap-1.5 border-b border-white/5 pb-2 mb-4">
            <LineChart className="h-4 w-4" /> 180-Day Structural Wear Forecasting
          </h3>
          <p className="text-[12px] text-metallic-gray font-mono mb-4">{"// TELEMETRY MODELLING: LOCAL EXPONENTIAL Concrete Wear Curves"}</p>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fatigueForecast}>
                <defs>
                  <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={8} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={8} />
                <Tooltip contentStyle={{ background: '#0b1224', border: '1px solid rgba(234, 88, 12, 0.2)', fontSize: '12px', fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="fatigue" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#colorFatigue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fatigue alerts diagnostics list */}
        <div className="mt-4 space-y-2 font-mono text-[12px]">
          <div className="p-2.5 bg-black/40 rounded-[8px] border border-white/5 flex items-center justify-between text-metallic-gray">
            <span className="flex items-center gap-1"><Cpu className="h-3.5 w-3.5 text-orange-500" /> MODEL ACCURACY CRITERION</span>
            <span className="text-white-text font-bold">R² = 0.985</span>
          </div>

          <div className="p-2.5 bg-black/40 rounded-[8px] border border-white/5 flex items-center justify-between text-metallic-gray">
            <span className="flex items-center gap-1"><Hourglass className="h-3.5 w-3.5 text-alert-orange" /> FATIGUE LIMIT VIOLATION</span>
            <span className="text-alert-orange font-bold">EST. DAY 210</span>
          </div>
        </div>

      </div>

    </div>
  );
}
