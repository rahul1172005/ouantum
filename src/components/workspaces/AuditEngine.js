import React, { useState } from 'react';
import { ClipboardCheck, Mic, Paperclip, CheckSquare, Square, Trash2, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export default function AuditEngine({ selectedElement, setSelectedElement }) {
  const [activeCategory, setActiveCategory] = useState('Structural');
  const [voiceInput, setVoiceInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const [auditChecklist, setAuditChecklist] = useState([
    { id: 1, text: 'Inspect rebar corrosion exposure on pier columns', checked: true, category: 'Structural' },
    { id: 2, text: 'Execute ultrasonic pulse velocity test on deck spans', checked: false, category: 'Structural' },
    { id: 3, text: 'Confirm seismic isolation bearing alignment clearances', checked: false, category: 'Structural' },
    { id: 4, text: 'Verify site scaffolding load clearances', checked: true, category: 'Safety' },
    { id: 5, text: 'Audit gas detection sensors and emergency alarm networks', checked: false, category: 'Safety' },
    { id: 6, text: 'Review material compliance tensile test records for Batch 24B', checked: false, category: 'Material' },
  ]);

  const [evidenceList, setEvidenceList] = useState([
    { id: 1, name: 'rebar_corrosion_pier42.jpeg', coords: '19.0330° N, 72.8184° E', timestamp: '2026-05-21 11:24', size: '2.4 MB' },
    { id: 2, name: 'ultrasonic_span4_telemetry.csv', coords: '19.0332° N, 72.8189° E', timestamp: '2026-05-21 12:02', size: '14.2 KB' }
  ]);

  const handleToggleCheck = (id) => {
    setAuditChecklist(auditChecklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceInput('Parsed voice input: "Found localized shear degradation, width 2.4mm, along the base of Pier 42 columns during drone visual inspect."');
      const newEvidence = {
        id: Date.now(),
        name: 'voice_memo_pier42.wav',
        coords: '19.0330° N, 72.8184° E',
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        size: '124 KB'
      };
      setEvidenceList([newEvidence, ...evidenceList]);
      setSelectedElement({
        type: 'Voice Inspector Memo',
        id: 'VM-Pier42',
        metrics: {
          ParsedTranscript: 'Localized shear degradation, width 2.4mm, along the base of Pier 42 columns.',
          SpeakerIdentity: 'Dr. Rajesh Mehta (Chief Auditor)',
          GPSAnchor: '19.0330° N, 72.8184° E',
          SystemValidation: 'VERIFIED COMPLIANCE LOGGED'
        }
      });
    } else {
      setIsRecording(true);
      setVoiceInput('Listening...');
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    const mockFiles = ['spall_thermal_scan.png', 'core_tensile_report.pdf', 'deflection_matrix_log.csv'];
    const name = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    const newEvidence = {
      id: Date.now(),
      name,
      coords: '19.0330° N, 72.8184° E',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      size: '1.2 MB'
    };
    setEvidenceList([newEvidence, ...evidenceList]);
  };

  const handleDeleteEvidence = (id) => {
    setEvidenceList(evidenceList.filter(ev => ev.id !== id));
  };

  const categories = ['Structural', 'Safety', 'Material'];
  const completedCount = auditChecklist.filter(i => i.category === activeCategory && i.checked).length;
  const totalCount = auditChecklist.filter(i => i.category === activeCategory).length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Category selector & checklist controls */}
      <div className="xl:col-span-2 space-y-4">
        
        {/* Checklist Workspace */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <ClipboardCheck className="h-3.5 w-3.5 text-orange-500" />
            <span>SMART INSPECTION TASK LISTS</span>
            <div className="ml-auto flex rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={activeCategory === cat ? {
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#ffffff',
                    border: 'none'
                  } : {}}
                  className={`px-3 py-1.5 border-r last:border-r-0 border-slate-200 text-[11px] font-bold uppercase transition-colors ${
                    activeCategory === cat ? '' : 'bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="zoho-card-body space-y-3">
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-1">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${(completedCount/totalCount)*100}%`, background: 'linear-gradient(90deg, #f97316, #ea580c)' }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">{completedCount}/{totalCount} done</span>
            </div>
            {auditChecklist.filter(item => item.category === activeCategory).map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleToggleCheck(item.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  item.checked 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-orange-50/50'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {item.checked ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-[12px] ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.text}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    SCOPE: {item.category.toUpperCase()} | REQUIRED VERIFICATION LOG
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI voice inspection recorder */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Mic className="h-3.5 w-3.5 text-orange-500" />
            AI VOICE INSPECTION ASSISTANT
          </div>
          <div className="zoho-card-body">
            <div className="flex gap-4 items-start">
              <button 
                onClick={handleVoiceRecord}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all min-w-[80px] shadow-sm ${
                  isRecording 
                    ? 'bg-red-500 text-white shadow-red-200' 
                    : 'bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100'
                }`}
              >
                <Mic className={`h-6 w-6 ${isRecording ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] font-bold uppercase">{isRecording ? 'Listening' : 'Record'}</span>
              </button>
              <div className="flex-1 space-y-2">
                <div className="w-full min-h-16 p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-600 overflow-y-auto">
                  {voiceInput || 'Standby. Click record to capture audit verbal findings.'}
                </div>
                <p className="text-[11px] text-slate-400 italic">AI converts raw speech matrix into compliance checklists and logs.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Upload evidence & Metadata logs */}
      <div className="xl:col-span-1 space-y-4">
        
        {/* Upload portal */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <Paperclip className="h-3.5 w-3.5 text-orange-500" />
            EVIDENCE UPLOAD MATRIX
          </div>
          <div className="zoho-card-body">
            <div 
              onClick={handleFileUpload}
              className="w-full border-2 border-dashed border-orange-200 rounded-xl p-6 text-center hover:bg-orange-50 hover:border-orange-400 cursor-pointer transition-all space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mx-auto">
                <Paperclip className="h-5 w-5 text-orange-500" />
              </div>
              <p className="font-bold text-[12px] text-slate-700">Drag / Drop Evidence Material</p>
              <p className="text-[11px] text-slate-400">Supports JPEG visual annotations, CSV telemetry files, PDFs.</p>
            </div>
          </div>
        </div>

        {/* Evidence files list */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <ClipboardCheck className="h-3.5 w-3.5 text-orange-500" />
            AUDIT EVIDENCE LOGS
          </div>
          <div className="zoho-card-body space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
            {evidenceList.map((ev) => (
              <div key={ev.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 relative space-y-1.5">
                <button 
                  onClick={() => handleDeleteEvidence(ev.id)}
                  className="absolute top-2 right-2 text-slate-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <p className="font-bold text-[12px] text-slate-700 truncate pr-5">{ev.name}</p>
                <div className="space-y-1 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-orange-400" />
                    <span>{ev.coords}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-orange-400" />
                    <span>{ev.timestamp}</span>
                  </div>
                  <div className="text-slate-300">SIZE: {ev.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
