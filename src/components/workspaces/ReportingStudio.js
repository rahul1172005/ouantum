import React, { useState } from 'react';
import { FileText, Edit, Printer, CheckSquare, Sparkles, HelpCircle, Bot, Activity } from 'lucide-react';

export default function ReportingStudio({ selectedElement, setSelectedElement }) {
  const [activeTemplate, setActiveTemplate] = useState('compliance');
  const [reportTitle, setReportTitle] = useState('STRUCTURAL COMPLIANCE AUDIT RECORD - BWSL4');
  const [reportContent, setReportContent] = useState(
    '1.0 EXECUTIVE OVERVIEW\nDuring non-destructive testing and strain sensor analysis on the Bandra-Worli Sea Link segment, localized anomalies were logged. Crack propagation models indicate normal Paris Law tolerances, however secondary shear fatigue on Pier Column 42 exceeds standard baseline safety factor limits.\n\n2.0 TECHNICAL VERIFICATIONS\n- Average loading stress: 150 kN\n- Max bridge deflection: 2.82 mm\n- Rebar corrosion loss index: 0.60 mm\n- Core cavitation void density: 0.42% (Compliance limits: <0.20%)\n\n3.0 REMEDIAL STRATEGIES\n- Schedule immediate core injection drill reinforcement.\n- Deploy continuous strain and vibration sensor arrays.\n- Perform weekly autonomous drone inspection scans.'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAutoWrite = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let summary = '';
      if (activeTemplate === 'compliance') {
        summary = `1.0 COMPLIANCE AUDIT EXECUTIVE SUMMARY\nThis document certifies compliance clearances for NHAI Bridge-42 and Bandra-Worli Sea Link. Based on NDT pulse velocity and ultrasonic diagnostics, core concrete densities fail standard SOC-2 / ISO-27001 industrial margins by +0.22% due to localized honeycombing cavities.\n\n2.0 ACTION PLAN\n- Enforce physical site barriers near Pier 42 within 48 hours.\n- Inject cement grout reinforcements to isolate cavitations.\n- Rescan rebar elements using 220kV X-Ray tubes by 2026-06-01.`;
        setReportTitle('AUTOMATED REGIONAL COMPLIANCE & SAFETY CLEARANCE REPORT');
      } else if (activeTemplate === 'structural') {
        summary = `1.0 STRUCTURAL STRESS & DEFLECTION REPORT\nCalculations compiled under Timoshenko linear beam formulations indicate maximum deflection under live load (150 kN) is 2.82 mm. Paris' Law fatigue analysis forecasts micro-crack expansion from 1.5mm to 1.8mm over 120,000 cyclic loads.\n\n2.0 STRUCTURAL INTEGRITY COEFFICIENT\n- Safety Factor Margin: 2.67\n- Applied Moment limit: 225.0 kN.m\n- Critical yield strength remains: 97.0%`;
        setReportTitle('AI-ASSISTED STRUCTURAL STRESS & DEFORMATION FORMULATION');
      } else {
        summary = `1.0 SHM SENSOR ARRAY DIAGNOSTIC ANALYSIS\nContinuous monitoring systems synchronized at 200 Hz across ACCEL-01, STRAIN-09, and TILT-04 telemetry nodes logged a brief resonance spike of 4.8 Hz. Average strain tension is steady at 124 microstrain.\n\n2.0 HARDWARE RELIABILITY CERTIFICATIONS\n- Core Synchronization rate: 99.8%\n- Node Operational Temperatures: 28.4°C to 31.2°C\n- Calibration Drift Status: PASS`;
        setReportTitle('DYNAMIC STRUCTURAL HEALTH MONITORING (SHM) ANALYTICAL HUD');
      }
      setReportContent(summary);
      setIsGenerating(false);
      setSelectedElement({
        type: 'Generated AI Report',
        id: activeTemplate.toUpperCase(),
        metrics: {
          DocumentTitle: reportTitle,
          GeneratedWordCount: '154 words',
          ComplianceValidation: 'COMPLIANT WITH ISO-14001',
          ReportAuditor: 'Ouantum AI Kernel System'
        }
      });
    }, 1200);
  };

  const handlePrint = () => {
    alert('Document sent to engineering print matrix...');
  };

  const templates = [
    { id: 'compliance', label: 'COMPLIANCE AUDIT', desc: 'Synthesizes site compliance, voice memos, and ISO safety standards.' },
    { id: 'structural', label: 'STRUCTURAL DESIGN', desc: 'Outputs Modulus calculations, deflection formulas, and bending stress.' },
    { id: 'ndt', label: 'NDT TELEMETRY', desc: 'Compiles ultrasonic oscilloscope scans and radiographical voids.' }
  ];

  const activeData = { applied: '150 kN', fatigue: '1.2e-11', acoustic: '99.8%' };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Template selector controls */}
      <div className="xl:col-span-1 space-y-4">
        
        <div className="zoho-card">
          <div className="zoho-card-header">
            <FileText className="h-3.5 w-3.5 text-orange-500" />
            REPORT TEMPLATE BUILDER
          </div>
          <div className="zoho-card-body space-y-2.5">
            {templates.map((temp) => (
              <button
                key={temp.id}
                onClick={() => setActiveTemplate(temp.id)}
                style={activeTemplate === temp.id ? {
                  background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                  borderColor: '#fed7aa'
                } : {}}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                  activeTemplate === temp.id ? 'border-orange-200' : 'bg-white border-slate-200 hover:bg-orange-50 hover:border-orange-200'
                }`}
              >
                <span className={`uppercase font-bold text-[11px] block mb-1 ${activeTemplate === temp.id ? 'text-orange-700' : 'text-slate-700'}`}>
                  {temp.label}
                </span>
                <p className={`text-[11px] leading-relaxed ${activeTemplate === temp.id ? 'text-orange-600' : 'text-slate-400'}`}>
                  {temp.desc}
                </p>
              </button>
            ))}
            <button 
              onClick={handleAutoWrite}
              disabled={isGenerating}
              className={`w-full py-2.5 rounded-xl font-bold uppercase text-[12px] flex items-center justify-center gap-2 transition-all ${
                isGenerating ? 'bg-orange-100 text-orange-400 cursor-wait' : 'bg-black text-white hover:opacity-90'
              }`}
            >
              {isGenerating ? (
                <><Activity className="h-4 w-4 animate-pulse" /> Generating...</>
              ) : (
                <><Bot className="h-4 w-4" /> AI Auto-Write Report</>
              )}
            </button>
          </div>
        </div>

        {/* System parameters context */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <HelpCircle className="h-3.5 w-3.5 text-orange-500" />
            ACTIVE DATA FEEDS
          </div>
          <div className="zoho-card-body space-y-2 text-[12px]">
            {[
              { label: 'Applied Force (P):', value: activeData.applied },
              { label: 'Paris Fatigue constant:', value: activeData.fatigue },
              { label: 'Acoustic Sync rate:', value: activeData.acoustic }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-b-0">
                <span className="text-slate-500">{item.label}</span>
                <span className="font-bold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Print Preview Canvas panel */}
      <div className="xl:col-span-2 space-y-4">
        
        <div className="zoho-card">
          <div className="zoho-card-header">
            <FileText className="h-3.5 w-3.5 text-orange-500" />
            <span>PROFESSIONAL BLUEPRINT PRINT PREVIEW</span>
            <button 
              onClick={handlePrint}
              className="ml-auto px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase text-slate-600 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
          </div>
          <div className="zoho-card-body">
            {/* Paper visual sheet */}
            <div className="border border-slate-200 rounded-xl bg-white shadow-sm relative flex flex-col justify-between min-h-[460px] overflow-hidden">
              
              {/* Orange top bar */}
              <div className="h-1.5 bg-gradient-to-r from-orange-400 to-amber-400" />

              <div className="space-y-5 p-8 z-10 flex-1">
                {/* Header specifications block */}
                <div className="border-b border-slate-200 pb-5 grid grid-cols-2 gap-4 font-mono text-[12px] text-slate-700">
                  <div>
                    <p className="font-black text-xs tracking-wider uppercase text-orange-600">OUANTUM CRM SYSTEMS</p>
                    <p className="mt-1.5 text-slate-600">PROJECT: Suspension Link Bridge-42</p>
                    <p className="text-slate-600">OWNER: MSRDC Transit Authority</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-700">DOC ID: {activeTemplate.toUpperCase()}-2026-0521</p>
                    <p className="text-slate-500 mt-0.5">DATE: 2026-05-21 12:44</p>
                    <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 font-bold">
                      RESTRICTED // TECHNICAL AUDIT
                    </span>
                  </div>
                </div>

                {/* Document Title */}
                <div className="text-center font-bold text-[11px] uppercase tracking-widest py-2 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  {reportTitle}
                </div>

                {/* Content Field */}
                <textarea
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className="w-full h-[220px] bg-transparent border-none outline-none font-mono text-[12px] leading-relaxed resize-none text-slate-700"
                  style={{ boxShadow: 'none', borderRadius: 0, padding: 0 }}
                />
              </div>

              {/* Footer signatures */}
              <div className="grid grid-cols-2 gap-8 border-t border-slate-200 px-8 py-5 text-[11px] font-mono uppercase text-slate-400 bg-slate-50">
                <div>
                  <p className="text-slate-500">APPROVED BY: COMPLIANCE KERNEL AI</p>
                  <div className="mt-2 h-5 border-b border-dashed border-slate-300 w-2/3" />
                  <p className="mt-1 text-slate-400">AUTONOMOUS SIGNATURE MATRIX</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500">AUDITOR SIGN-OFF: DR. R. MEHTA</p>
                  <div className="mt-2 h-5 border-b border-dashed border-slate-300 w-2/3 ml-auto" />
                  <p className="mt-1 text-slate-400">CHIEF STRUCTURAL COMPLIANCE ENGINE</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
