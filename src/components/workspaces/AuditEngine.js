import React, { useState } from 'react';
import { ClipboardCheck, Mic, Paperclip, CheckSquare, Square, Trash2, MapPin, Calendar } from 'lucide-react';

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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Category selector & checklist controls */}
      <div className="xl:col-span-2 space-y-4">
        
        {/* Checklist Workspace */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span>SMART INSPECTION TASK LISTS</span>
            <div className="ml-auto flex border border-gray-400 rounded overflow-hidden">
              {['Structural', 'Safety', 'Material'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 border-r last:border-r-0 border-gray-400 transition-colors ${
                    activeCategory === cat ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="zoho-card-body space-y-2">
            {auditChecklist.filter(item => item.category === activeCategory).map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleToggleCheck(item.id)}
                className="flex items-start gap-3 p-3 border border-black bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="mt-0.5">
                  {item.checked ? (
                    <CheckSquare className="h-4 w-4 text-black" />
                  ) : (
                    <Square className="h-4 w-4 text-black" />
                  )}
                </div>
                <div>
                  <p className={`font-bold ${item.checked ? 'line-through text-gray-500' : 'text-black'}`}>
                    {item.text}
                  </p>
                  <span className="text-[8px] text-gray-500 font-mono">
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
            <Mic className="h-3.5 w-3.5" />
            AI VOICE INSPECTION ASSISTANT
          </div>
          <div className="zoho-card-body">
            <div className="flex gap-4 items-start">
              <button 
                onClick={handleVoiceRecord}
                className={`p-4 border-2 border-black flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  isRecording ? 'hazard-hatch-dark text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                <Mic className={`h-6 w-6 ${isRecording ? 'animate-pulse' : ''}`} />
                <span className="text-[8px] font-bold uppercase">{isRecording ? 'Listening' : 'Record Voice'}</span>
              </button>
              <div className="flex-1 space-y-2">
                <div className="w-full h-16 p-2 border border-black bg-gray-50 font-mono text-[9px] overflow-y-auto">
                  {voiceInput || 'Standby. Click record to capture audit verbal findings.'}
                </div>
                <p className="text-[8px] text-gray-500 italic">AI converts raw speech matrix into compliance checklists and logs.</p>
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
            <Paperclip className="h-3.5 w-3.5" />
            EVIDENCE UPLOAD MATRIX
          </div>
          <div className="zoho-card-body">
            <div 
              onClick={handleFileUpload}
              className="w-full border-2 border-dashed border-black p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors space-y-2"
            >
              <Paperclip className="h-6 w-6 mx-auto text-black" />
              <p className="font-bold text-[9px] uppercase">Drag / Drop evidence material</p>
              <p className="text-[8px] text-gray-500">Supports JPEG visual annotations, CSV telemetry files, PDFs.</p>
            </div>
          </div>
        </div>

        {/* Evidence files list */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <ClipboardCheck className="h-3.5 w-3.5" />
            AUDIT EVIDENCE LOGS
          </div>
          <div className="zoho-card-body space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {evidenceList.map((ev) => (
              <div key={ev.id} className="p-2 border border-black bg-gray-50 relative space-y-1">
                <button 
                  onClick={() => handleDeleteEvidence(ev.id)}
                  className="absolute top-1 right-1 text-gray-400 hover:text-black font-bold"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <p className="font-bold text-[9px] truncate pr-4">{ev.name}</p>
                <div className="space-y-0.5 text-[8px] text-gray-600 font-mono">
                  <div className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> {ev.coords}</div>
                  <div className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" /> {ev.timestamp}</div>
                  <div>SIZE: {ev.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
