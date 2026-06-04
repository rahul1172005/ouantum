import React, { useState } from 'react';
import { FileText, Edit, Printer, CheckSquare, Sparkles, HelpCircle } from 'lucide-react';

export default function ReportingStudio({ selectedElement, setSelectedElement }) {
  const [activeTemplate, setActiveTemplate] = useState('compliance');
  const [reportTitle, setReportTitle] = useState('STRUCTURAL COMPLIANCE AUDIT RECORD - BWSL4');
  const [reportContent, setReportContent] = useState(
    '1.0 EXECUTIVE OVERVIEW\nDuring non-destructive testing and strain sensor analysis on the Bandra-Worli Sea Link segment, localized anomalies were logged. Crack propagation models indicate normal Paris Law tolerances, however secondary shear fatigue on Pier Column 42 exceeds standard baseline safety factor limits.\n\n2.0 TECHNICAL VERIFICATIONS\n- Average loading stress: 150 kN\n- Max bridge deflection: 2.82 mm\n- Rebar corrosion loss index: 0.60 mm\n- Core cavitation void density: 0.42% (Compliance limits: <0.20%)\n\n3.0 REMEDIAL STRATEGIES\n- Schedule immediate core injection drill reinforcement.\n- Deploy continuous strain and vibration sensor arrays.\n- Perform weekly autonomous drone inspection scans.'
  );

  const handleAutoWrite = () => {
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
  };

  const handlePrint = () => {
    alert('Document sent to engineering print matrix...');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-black">
      
      {/* Template selector controls */}
      <div className="xl:col-span-1 space-y-4">
        
        <div className="zoho-card">
          <div className="zoho-card-header">
            <FileText className="h-3.5 w-3.5" />
            REPORT TEMPLATE BUILDER
          </div>
          <div className="zoho-card-body space-y-2">
            {['compliance', 'structural', 'ndt'].map((temp) => (
              <button
                key={temp}
                onClick={() => setActiveTemplate(temp)}
                className={`w-full text-left p-3 border-2 transition-colors ${
                  activeTemplate === temp ? 'bg-black text-white border-black font-bold' : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="uppercase font-bold text-[10px]">
                  {temp === 'compliance' && 'COMPLIANCE AUDIT AUDITING'}
                  {temp === 'structural' && 'STRUCTURAL DESIGN MATRIX'}
                  {temp === 'ndt' && 'NDT TELEMETRY SUMMARY'}
                </span>
                <p className={`text-[8px] mt-1 ${activeTemplate === temp ? 'text-gray-300' : 'text-gray-500'}`}>
                  {temp === 'compliance' && 'Synthesizes site compliance, voice memos, and ISO safety standards.'}
                  {temp === 'structural' && 'Outputs Modulus calculations, deflection formulas, and bending stress.'}
                  {temp === 'ndt' && 'Compiles ultrasonic oscilloscope scans and radiographical voids.'}
                </p>
              </button>
            ))}
            <button 
              onClick={handleAutoWrite}
              className="w-full py-2 bg-black text-white hover:bg-gray-800 border border-black font-bold uppercase text-[9px] flex items-center justify-center gap-1"
            >
              <Sparkles className="h-4 w-4" /> AI Auto-Write Report
            </button>
          </div>
        </div>

        {/* System parameters context */}
        <div className="zoho-card">
          <div className="zoho-card-header">
            <HelpCircle className="h-3.5 w-3.5" />
            ACTIVE DATA FEEDS
          </div>
          <div className="zoho-card-body space-y-1 text-[9px]">
            <div className="flex items-center justify-between">
              <span>Applied Force (P):</span>
              <span>150 kN</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Paris Fatigue constant:</span>
              <span>1.2e-11</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Acoustic Sync rate:</span>
              <span>99.8%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Print Preview Canvas panel */}
      <div className="xl:col-span-2 space-y-4">
        
        <div className="zoho-card">
          <div className="zoho-card-header">
            <FileText className="h-3.5 w-3.5" />
            <span>PROFESSIONAL BLUEPRINT PRINT PREVIEW</span>
            <button 
              onClick={handlePrint}
              className="ml-auto px-3 py-1 border border-gray-400 hover:bg-gray-50 flex items-center gap-1.5 font-bold font-mono text-[9px] uppercase"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
            </button>
          </div>
          <div className="zoho-card-body">
            {/* Paper visual sheet */}
            <div className="border-2 border-black p-8 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] relative flex flex-col justify-between min-h-[460px] text-black">
              {/* Double technical borders */}
              <div className="absolute inset-2 border-4 border-double border-black pointer-events-none" />

              <div className="space-y-6 z-10 p-2">
                {/* Header specifications block */}
                <div className="border-b-2 border-black pb-4 grid grid-cols-2 gap-4 font-mono text-[9px] text-black">
                  <div>
                    <p className="font-black text-xs tracking-wider uppercase">OUANTUM CRM SYSTEMS</p>
                    <p className="mt-1">PROJECT: suspension Link bridge-42</p>
                    <p>OWNER: MSRDC Transit Authority</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">DOC ID: {activeTemplate.toUpperCase()}-2026-0521</p>
                    <p>DATE: 2026-05-21 12:44</p>
                    <p className="font-bold border border-black inline-block px-1 mt-1">RESTRICTED // TECHNICAL AUDIT</p>
                  </div>
                </div>

                {/* Document Title */}
                <div className="text-center font-bold text-xs uppercase tracking-widest border border-black p-1 bg-gray-50">
                  {reportTitle}
                </div>

                {/* Content Field */}
                <textarea
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className="w-full h-[220px] bg-transparent border-none outline-none font-mono text-[10px] leading-relaxed resize-none text-black select-text"
                />
              </div>

              {/* Footer signatures */}
              <div className="grid grid-cols-2 gap-8 border-t border-black pt-4 z-10 p-2 text-[8px] font-mono uppercase text-gray-500">
                <div>
                  <p>APPROVED BY: COMPLIANCE KERNEL AI</p>
                  <div className="mt-1.5 h-6 border-b border-dashed border-black w-2/3" />
                  <p className="mt-1">AUTONOMOUS SIGNATURE MATRIX</p>
                </div>
                <div className="text-right">
                  <p>AUDITOR SIGN-OFF: DR. R. MEHTA</p>
                  <div className="mt-1.5 h-6 border-b border-dashed border-black w-2/3 ml-auto" />
                  <p className="mt-1">CHIEF STRUCTURAL COMPLIANCE ENGINE</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
