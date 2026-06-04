import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  HelpCircle, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Layers, 
  Terminal, 
  AlertTriangle,
  FileCheck,
  Grid,
  Info,
  Sliders,
  Play
} from 'lucide-react';

const SECTIONS = {
  WELCOME: 'WELCOME',
  NAVIGATION: 'NAVIGATION',
  TABLES: 'TABLES',
  LABS: 'LABS',
  IOT: 'IOT',
  CIVIL_LEVELS: 'CIVIL_LEVELS',
  SYSTEMS: 'SYSTEMS',
  COMMANDS: 'COMMANDS'
};

export default function HelpGuide({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState(SECTIONS.WELCOME);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#00070d]/40 backdrop-blur-sm select-none">
      <div 
        className="w-full max-w-5xl h-[90vh] bg-white border border-[#d5dbdb] shadow-[0_4px_20px_0_rgba(0,28,36,0.3)] overflow-hidden flex flex-col text-[#16191f] font-sans"
        style={{ borderRadius: '4px' }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#eaeded] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-[#545b64]" />
            <h2 className="text-sm font-bold text-[#16191f] font-sans">
              Ouantum OS - Comprehensive Systems & Features Reference Manual
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 border border-[#545b64] hover:bg-[#f1f3f3] hover:text-[#16191f] rounded-[8px]-[4px] transition-all flex items-center justify-center cursor-pointer bg-white text-[#545b64]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Inner Columns Layout */}
        <div className="flex flex-1 min-h-0">
          
          {/* Left Sidebar Sections Navigation */}
          <aside className="w-64 bg-white border-r border-[#eaeded] p-3 overflow-y-auto flex flex-shrink-0 flex-col gap-0.5">
            <p className="text-[12px] font-bold uppercase text-[#545b64] px-2.5 py-1.5 tracking-wider">
              Reference Manual Chapters
            </p>
            
            <button 
              onClick={() => setActiveSection(SECTIONS.WELCOME)}
              className={`w-full text-left text-xs px-3 py-2 rounded-[8px]-none transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === SECTIONS.WELCOME 
                  ? 'bg-[#f1f3f3] text-[#16191f] font-bold border-l-[3px] border-[#ec7211] pl-[9px]' 
                  : 'text-[#545b64] hover:bg-[#f1f3f3] hover:text-[#16191f] border-l-[3px] border-transparent pl-[9px]'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5 flex-shrink-0 text-[#0073bb]" />
              <span>Platform Core Overview</span>
            </button>

            <button 
              onClick={() => setActiveSection(SECTIONS.NAVIGATION)}
              className={`w-full text-left text-xs px-3 py-2 rounded-[8px]-none transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === SECTIONS.NAVIGATION 
                  ? 'bg-[#f1f3f3] text-[#16191f] font-bold border-l-[3px] border-[#ec7211] pl-[9px]' 
                  : 'text-[#545b64] hover:bg-[#f1f3f3] hover:text-[#16191f] border-l-[3px] border-transparent pl-[9px]'
              }`}
            >
              <Layers className="h-3.5 w-3.5 flex-shrink-0 text-[#8c43fc]" />
              <span>UI Shell & Inspector Control</span>
            </button>

            <button 
              onClick={() => setActiveSection(SECTIONS.TABLES)}
              className={`w-full text-left text-xs px-3 py-2 rounded-[8px]-none transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === SECTIONS.TABLES 
                  ? 'bg-[#f1f3f3] text-[#16191f] font-bold border-l-[3px] border-[#ec7211] pl-[9px]' 
                  : 'text-[#545b64] hover:bg-[#f1f3f3] hover:text-[#16191f] border-l-[3px] border-transparent pl-[9px]'
              }`}
            >
              <Grid className="h-3.5 w-3.5 flex-shrink-0 text-[#ec7211]" />
              <span>Tables & Reports</span>
            </button>

            <button 
              onClick={() => setActiveSection(SECTIONS.LABS)}
              className={`w-full text-left text-xs px-3 py-2 rounded-[8px]-none transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === SECTIONS.LABS 
                  ? 'bg-[#f1f3f3] text-[#16191f] font-bold border-l-[3px] border-[#ec7211] pl-[9px]' 
                  : 'text-[#545b64] hover:bg-[#f1f3f3] hover:text-[#16191f] border-l-[3px] border-transparent pl-[9px]'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 flex-shrink-0 text-[#1d8102]" />
              <span>Engineering Labs</span>
            </button>

            <button 
              onClick={() => setActiveSection(SECTIONS.IOT)}
              className={`w-full text-left text-xs px-3 py-2 rounded-[8px]-none transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === SECTIONS.IOT 
                  ? 'bg-[#f1f3f3] text-[#16191f] font-bold border-l-[3px] border-[#ec7211] pl-[9px]' 
                  : 'text-[#545b64] hover:bg-[#f1f3f3] hover:text-[#16191f] border-l-[3px] border-transparent pl-[9px]'
              }`}
            >
              <Activity className="h-3.5 w-3.5 flex-shrink-0 text-[#d13212]" />
              <span>Live IoT & Twins</span>
            </button>

            <button 
              onClick={() => setActiveSection(SECTIONS.CIVIL_LEVELS)}
              className={`w-full text-left text-xs px-3 py-2 rounded-[8px]-none transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === SECTIONS.CIVIL_LEVELS 
                  ? 'bg-[#f1f3f3] text-[#16191f] font-bold border-l-[3px] border-[#ec7211] pl-[9px]' 
                  : 'text-[#545b64] hover:bg-[#f1f3f3] hover:text-[#16191f] border-l-[3px] border-transparent pl-[9px]'
              }`}
            >
              <Sliders className="h-3.5 w-3.5 flex-shrink-0 text-[#0073bb]" />
              <span>Civil OS Lifecycle Levels 1-11</span>
            </button>

            <button 
              onClick={() => setActiveSection(SECTIONS.SYSTEMS)}
              className={`w-full text-left text-xs px-3 py-2 rounded-[8px]-none transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === SECTIONS.SYSTEMS 
                  ? 'bg-[#f1f3f3] text-[#16191f] font-bold border-l-[3px] border-[#ec7211] pl-[9px]' 
                  : 'text-[#545b64] hover:bg-[#f1f3f3] hover:text-[#16191f] border-l-[3px] border-transparent pl-[9px]'
              }`}
            >
              <FileCheck className="h-3.5 w-3.5 flex-shrink-0 text-[#8c43fc]" />
              <span>Systems & Compliance</span>
            </button>

            <button 
              onClick={() => setActiveSection(SECTIONS.COMMANDS)}
              className={`w-full text-left text-xs px-3 py-2 rounded-[8px]-none transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === SECTIONS.COMMANDS 
                  ? 'bg-[#f1f3f3] text-[#16191f] font-bold border-l-[3px] border-[#ec7211] pl-[9px]' 
                  : 'text-[#545b64] hover:bg-[#f1f3f3] hover:text-[#16191f] border-l-[3px] border-transparent pl-[9px]'
              }`}
            >
              <Terminal className="h-3.5 w-3.5 flex-shrink-0 text-[#545b64]" />
              <span>AI Command Console</span>
            </button>

            <div className="mt-auto p-3 border border-[#eaeded] bg-[#f2f3f3] rounded-[8px]-[4px] text-[12px] text-[#545b64] font-sans leading-relaxed">
              <span className="font-bold text-[#16191f] block mb-0.5">Quick Directives</span>
              Type Ctrl + K to launch Command directives anytime.
            </div>
          </aside>

          {/* Right Scrollable Detailed Guide Reading Pane */}
          <main className="flex-1 p-8 overflow-y-auto bg-white font-sans text-[13px] text-[#16191f] leading-relaxed">
            
            {/* 1. WELCOME SECTION */}
            {activeSection === SECTIONS.WELCOME && (
              <div className="space-y-5">
                <div className="border-b border-[#eaeded] pb-3">
                  <h3 className="text-lg font-bold text-[#16191f] flex items-center gap-2 font-sans">
                    Platform Core Overview
                  </h3>
                  <p className="text-[12px] text-[#545b64] mt-1 font-sans">Introduction to high-fidelity structural health command center philosophy.</p>
                </div>
                
                <p className="font-sans">
                  Ouantum is a next-generation civil engineering operating system. It acts as a Single Source of Truth (SSOT) for asset timelines, loading fatigue indices, ultrasonic pulse diagnostics, live strain telemetry, and 3D digital twin states.
                </p>

                <div className="space-y-3">
                  <h4 className="font-bold text-[#16191f] text-[13px] uppercase tracking-wider font-sans">Core Operating Rules:</h4>
                  
                  <div className="p-4 border border-[#eaeded] border-l-4 border-l-[#0073bb] rounded-[8px]-[4px] bg-[#ebf3fb] space-y-1.5 font-sans">
                    <p className="font-bold text-[#16191f] text-[13px]">Rule 1: Single Source of Truth (SSOT)</p>
                    <p className="text-[#545b64] text-[12px] leading-relaxed">Every contact, deal, ticket, sensor feed, and document must belong to a canonical Account (example: MSRDC). Isolated orphan records are programmatically blocked to preserve database integrity.</p>
                  </div>

                  <div className="p-4 border border-[#eaeded] border-l-4 border-l-[#ec7211] rounded-[8px]-[4px] bg-[#fffbf7] space-y-1.5 font-sans">
                    <p className="font-bold text-[#16191f] text-[13px]">Rule 2: AI Must Assist, Not Decide</p>
                    <p className="text-[#545b64] text-[12px] leading-relaxed">Artificial intelligence processes live strain feeds, models crack propagation, and highlights critical alarms, but the final safety validation checks and audit records require manual engineering signatures.</p>
                  </div>
                </div>

                <div className="p-4 border border-[#eaeded] border-l-4 border-l-[#0073bb] bg-[#ebf3fb] rounded-[8px]-[4px] text-[#16191f] font-sans">
                  <span className="font-bold block mb-1 text-[13px]">Role-Based Access Control (RBAC) Switcher</span>
                  <span className="text-[12px] text-[#545b64]">Access is governed by zero-trust Role-Based Access Control (RBAC). Use the Scope switcher in the Topbar to switch access levels (example: Admin, Sales/Ops, Viewer) to test view limitations.</span>
                </div>
              </div>
            )}

            {/* 2. UI SHELL & INSPECTOR */}
            {activeSection === SECTIONS.NAVIGATION && (
              <div className="space-y-5">
                <div className="border-b border-[#eaeded] pb-3">
                  <h3 className="text-lg font-bold text-[#16191f] flex items-center gap-2 font-sans">
                    UI Shell & Contextual Inspector Controls
                  </h3>
                  <p className="text-[12px] text-[#545b64] mt-1 font-sans">Understanding the user interface layout and interactive panels.</p>
                </div>

                <div className="space-y-4">
                  <div className="border-l-2 border-[#8c43fc] pl-4 space-y-1.5 font-sans">
                    <span className="font-bold text-[#16191f] uppercase tracking-wide text-[12px]">1. The Top Navigation Controls</span>
                    <p className="text-[#545b64] text-[12px] leading-relaxed">
                      Displays the Ouantum brand, central search input, active RBAC Scope Switcher, live Anomaly Alarms feed (which flashes red and alerts you of live structural deviations), and the active AI Avatar.
                    </p>
                  </div>

                  <div className="border-l-2 border-[#8c43fc] pl-4 space-y-1.5 font-sans">
                    <span className="font-bold text-[#16191f] uppercase tracking-wide text-[12px]">2. Collapsible Explorer Sidebar</span>
                    <p className="text-[#545b64] text-[12px] leading-relaxed">
                      Located on the left. Houses the workspace directory divided into organized folders. Click folder headings to expand/collapse. The sidebar can be collapsed completely using the arrow button to maximize screen workspace size.
                    </p>
                  </div>

                  <div className="border-l-2 border-[#8c43fc] pl-4 space-y-1.5 font-sans">
                    <span className="font-bold text-[#16191f] uppercase tracking-wide text-[12px]">3. Contextual Inspector Sliding Panel</span>
                    <p className="text-[#545b64] text-[12px] leading-relaxed">
                      Located on the right. When you click concrete crack cells, WebGL 3D columns, or sensor registers in any active workspace, the Inspector immediately slides open to show detailed data fields, historical charts, and custom AI diagnostics.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TABLES & REPORTS */}
            {activeSection === SECTIONS.TABLES && (
              <div className="space-y-5">
                <div className="border-b border-[#eaeded] pb-3">
                  <h3 className="text-lg font-bold text-[#16191f] flex items-center gap-2 font-sans">
                    Tables & Reports Workspaces
                  </h3>
                  <p className="text-[12px] text-[#545b64] mt-1 font-sans">Deep explanation of tables, schedules, and PDF compilers.</p>
                </div>

                <div className="space-y-4">
                  {/* Executive Overview */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">1. Executive Overview</span>
                      <span className="border-[#ffeeba] text-[#ec7211] rounded-[8px]-[4px] bg-[#fff3cd] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">High-level executive metrics including: Total assets inspected, critical alerts flagged, mean structural safety factor, and concrete void logs.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Gives decision-makers an instant overview of overall bridge network health, ensuring visual clarity on urgent defect anomalies.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Review core KPI widgets. Click on concrete crack rows in the anomalies table to immediately populate the right Inspector panel.</span>
                    </div>
                  </div>

                  {/* Civil & Infrastructure OS */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">2. Civil & Infrastructure OS</span>
                      <span className="border-[#ffeeba] text-[#ec7211] rounded-[8px]-[4px] bg-[#fff3cd] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Concrete loading deflection values, Pier Columns, aggregate moisture levels, and steel reinforcement stress thresholds.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Enforces structural engineering compliance, helping civil teams verify that actual site loading stresses do not breach baseline safety values.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Click the &quot;Record Stress Check&quot; button to input live inspection metrics (must be signed by logged inspector) or filter records by specific bridge segments.</span>
                    </div>
                  </div>

                  {/* Project Lifecycle Intel */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">3. Project Lifecycle Intel</span>
                      <span className="border-[#ffeeba] text-[#ec7211] rounded-[8px]-[4px] bg-[#fff3cd] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Timeline tracking schedules, site inspection checklists, active budgets, and engineer team profiles.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Maintains project execution transparency, monitoring bridge reinforcement milestones against designated budgets and standard guidelines.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Switch tabs (Overview, Timeline, Team) to pivot views. You can check off checklist tasks or select team avatars to inspect certification levels in the Inspector.</span>
                    </div>
                  </div>

                  {/* Reporting & Intel Studio */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">4. Reporting & Intel Studio</span>
                      <span className="border-[#ffeeba] text-[#ec7211] rounded-[8px]-[4px] bg-[#fff3cd] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Compiled PDF safety audits, parameter scopes, NDT validation indicators, and compliance reports.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Automates document generation, allowing teams to deliver audited compliance sheets to governmental oversight committees instantly.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Adjust the generation parameters (vibration tolerances, NDT scope) using inputs, click &quot;Ingest Telemetry&quot;, then click &quot;Download Compliance PDF&quot; or &quot;Download Raw CSV&quot; to retrieve compiled data.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ENGINEERING LABS */}
            {activeSection === SECTIONS.LABS && (
              <div className="space-y-5">
                <div className="border-b border-[#eaeded] pb-3">
                  <h3 className="text-lg font-bold text-[#16191f] flex items-center gap-2 font-sans">
                    Engineering Lab Analytics
                  </h3>
                  <p className="text-[12px] text-[#545b64] mt-1 font-sans">Material testing, stress factor slides, and NDT transit velocity wave data.</p>
                </div>

                <div className="space-y-4">
                  {/* Materials Intelligence Lab */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">1. Materials Intelligence Lab</span>
                      <span className="border-[#c3e6cb] text-[#1d8102] rounded-[8px]-[4px] bg-[#edf7ed] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Concrete cylinder compressive stress-strain curves, aggregate mixes, yield points, and load test limits.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Verifies raw concrete aggregate batches, ensuring material compression strength exceeds structural baseline design parameters before pouring.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Select material cylinder specs in the specimen table. Review compression curve load limits, or input a custom aggregate mix to test yield stress points.</span>
                    </div>
                  </div>

                  {/* Structural Safety & Stability */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">2. Structural Safety & Stability</span>
                      <span className="border-[#c3e6cb] text-[#1d8102] rounded-[8px]-[4px] bg-[#edf7ed] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Live safety factor ratios, calculated as: Stress Allowable / stress Maximum for all load-bearing columns.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Establishes precise threshold margins for structural safety, letting inspectors identify loading zones nearing physical stress limits.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Slide the &quot;Dead Load Weight Override&quot; and &quot;Dynamic Traffic Weight Override&quot; sliders to dynamically calculate safety factors in real-time. Select specific columns to check local loading stress values.</span>
                    </div>
                  </div>

                  {/* Structural Analysis Studio */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">3. Structural Analysis Studio</span>
                      <span className="border-[#c3e6cb] text-[#1d8102] rounded-[8px]-[4px] bg-[#edf7ed] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Shear stress calculations, fatigue sags under structural loads, and localized pier concrete cavitation values.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Calculates shear fatigue along main piers, warning civil teams of micro-fracturing under cyclic traffic loading.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Click the &quot;Trigger Shear Stress Calculations&quot; button to run the analytical solver. Select columns in the data grids to inspect cavitation limits.</span>
                    </div>
                  </div>

                  {/* NDT Intelligence Lab */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">4. NDT Intelligence Lab</span>
                      <span className="border-[#c3e6cb] text-[#1d8102] rounded-[8px]-[4px] bg-[#edf7ed] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Ultrasonic non-destructive testing wave charts, transit velocities, and void percentage distributions.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Inspects void formations and micro-delaminations deep within reinforced concrete members without damaging the structure.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Select active test modes (Ultrasonic Pulse Velocity, Dynamic Elastic Modulus, Acoustic Void Inspection) using workspace tabs. Review wave transit charts and record diagnostics data.</span>
                    </div>
                  </div>

                  {/* AI Defect Detection */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">5. AI Defect Detection</span>
                      <span className="border-[#c3e6cb] text-[#1d8102] rounded-[8px]-[4px] bg-[#edf7ed] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Autonomous drone camera feeds mapping pixel cracks, concrete fractures, and mm defect propagation dimensions.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Automates visual inspections using computer vision neural models, highlighting fracturing models instantly.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Toggle categories (All, Critical, Active) using filter buttons. Click on identified crack highlights directly on the canvas to inspect precise pixel dimensions.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. LIVE IOT & TWINS */}
            {activeSection === SECTIONS.IOT && (
              <div className="space-y-5">
                <div className="border-b border-[#eaeded] pb-3">
                  <h3 className="text-lg font-bold text-[#16191f] flex items-center gap-2 font-sans">
                    Live IoT & Digital Twins
                  </h3>
                  <p className="text-[12px] text-[#545b64] mt-1 font-sans">WebGL 3D visual twin controllers, live scrolling waveforms, emergency responders.</p>
                </div>

                <div className="space-y-4">
                  {/* SHM Monitoring Center */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">1. SHM Monitoring Center</span>
                      <span className="border-[#f5c6cb] text-[#d13212] rounded-[8px]-[4px] bg-[#f8d7da] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Real-time scrolling strain gauge telemetry (micro-strain) and concrete micro-vibration channels (Hertz).</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Provides continuous active monitoring of environmental wind and traffic loads, alerting teams immediately if thresholds are breached.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Observe scrolling live waves. Click on individual sensor registers in the data table to load real-time coordinates into the Right Inspector panel.</span>
                    </div>
                  </div>

                  {/* Digital Twin Engine */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">2. Digital Twin Engine</span>
                      <span className="border-[#f5c6cb] text-[#d13212] rounded-[8px]-[4px] bg-[#f8d7da] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">An interactive 3D WebGL structural columns wireframe model illustrating tension levels through thermal colors (green is nominal, red is danger).</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Allows engineers to locate and visualize load concentrations directly on a virtual representation of the physical assets.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Click and drag with mouse inside the viewport to rotate/pan. Scroll wheel to zoom. Click directly on structural column nodes to inspect load coordinates.</span>
                    </div>
                  </div>

                  {/* AI Structural Validation */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">3. AI Structural Validation & Simulation Engine</span>
                      <span className="border-[#f5c6cb] text-[#d13212] rounded-[8px]-[4px] bg-[#f8d7da] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Theoretical Finite Element Analysis (FEA) simulations plotted alongside actual physical sensor telemetry values.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Identifies divergence between predicted loading behaviors and real physical measurements to catch design errors.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Click &quot;Run AI Comparative Analysis&quot; to run the mathematical validation solver. Review deviations and check flagged structural members.</span>
                    </div>
                  </div>

                  {/* Infrastructure GIS Engine */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">4. Infrastructure GIS Engine</span>
                      <span className="border-[#f5c6cb] text-[#d13212] rounded-[8px]-[4px] bg-[#f8d7da] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Geospatial elevation plots, bridge GPS telemetry markers, topological mapping, and drainage channels.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Monitors geological settling, tectonic shifting, and topological structural displacements over long timelines.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Toggle topological/elevation overlays using map control options. Click column coordinates to inspect details.</span>
                    </div>
                  </div>

                  {/* Emergency Response System */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">5. Emergency Response System</span>
                      <span className="border-[#f5c6cb] text-[#d13212] rounded-[8px]-[4px] bg-[#f8d7da] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Platform critical warning levels, broadcast notifications registry, active structural alarms, and sire control keys.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Triggers absolute crisis emergency protocol actions (sirens, broadcast SMS alerts) to clear physical sites in danger.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Click the large &quot;ACTIVATE SYSTEM EMERGENCY SIREN&quot; button to toggle alert banners on. Review generated active anomalies to trigger alerts.</span>
                    </div>
                  </div>

                  {/* Digital Site Inspection */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">6. Digital Site Inspection & NCR</span>
                      <span className="border-[#f5c6cb] text-[#d13212] rounded-[8px]-[4px] bg-[#f8d7da] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Active non-conformance logs (NCRs), field inspector logs, and certification stamp registries.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Immutably logs site inspection records for regulatory quality assurance audits.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Filter field logs using category headers. Click specific non-conformance cards to log detailed NCR status indicators in the Inspector.</span>
                    </div>
                  </div>

                  {/* Construction Monitoring */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">7. Construction Progress Monitoring</span>
                      <span className="border-[#f5c6cb] text-[#d13212] rounded-[8px]-[4px] bg-[#f8d7da] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Gantt scheduling tracks, planned vs actual telemetry timelines, physical progress meters, and task milestones.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Visualizes delay risk and structural construction velocity, ensuring key progress parameters are mapped accurately.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Analyze Gantt bars. Click on scheduling rows to inspect precise milestone dates and active work parameters.</span>
                    </div>
                  </div>

                  {/* Geotechnical & Hydrology Engine */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">8. Geotechnical & Hydrology Engine</span>
                      <span className="border-[#f5c6cb] text-[#d13212] rounded-[8px]-[4px] bg-[#f8d7da] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Groundwater moisture sensors, sub-grade soil compaction levels, bore-hole drill parameters, and retaining wall stability equations.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Evaluates soil stability and moisture vectors to prevent retaining wall sliding, tipping, or sub-grade foundation sinking.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Slide soil parameters to calculate active earth pressure. Run moisture simulations, or click bore-hole nodes in the geotechnical charts.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. CIVIL OS LIFECYCLE LEVELS */}
            {activeSection === SECTIONS.CIVIL_LEVELS && (
              <div className="space-y-5">
                <div className="border-b border-[#eaeded] pb-3">
                  <h3 className="text-lg font-bold text-[#16191f] flex items-center gap-2 font-sans">
                    Civil OS Lifecycle Explorer Levels 1-11
                  </h3>
                  <p className="text-[12px] text-[#545b64] mt-1 font-sans">Detailed structural documentation for each of the 11 integrated lifecycle stages.</p>
                </div>

                <div className="space-y-5">
                  
                  {/* Level 1 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 1: Pre-Construction Intel</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Terzaghi bearing capacity inputs (Soil Cohesion, Surcharge Pressure, Soil Unit Weight, Foundation Width), topographic LiDAR coordinates radars, and municipal approval checkers.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Validates geologic foundations, maps topography, and logs legal permit compliance before physical construction sweeps begin.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Slide capacity sliders to simulate Terzaghi bearing safety factors. Click topographic survey waypoints (WP-101, WP-102, WP-103) to inspect radar elevation. Toggle municipal clearances to run permit audits.</span>
                    </div>
                  </div>

                  {/* Level 2 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 2: Design & Planning</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Mechanical/Electrical/Plumbing (MEP) load values (HVAC kW, Drainage GPM, Electrical kVA), ventilation daylights hour settings, solar radiant flux calculations, and BIM Level 5 coordination rework clash lists.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Prevents substation power overflows, calculates natural ventilation thermal sags, and identifies hard and clearance clashes inside BIM files.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Adjust MEP sliders to test substation grid limits. Adjust solar timeline sliders to calculate radiant flux. Click &quot;Issue Rework Ticket&quot; on BIM clash list items to log action.</span>
                    </div>
                  </div>

                  {/* Level 3 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 3: Procurement Logistics</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Aggregates sieve modulations, sand quarry source locations, cement mixing concrete transport metrics (Cement drum RPM rotation, temperature), and logistics tracking.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Logs aggregate particle grades and cement mix temperatures to assure top-quality concrete chemical hydration during transport.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Select active quarry sources. Set aggregate grading fineness modulus sliders. Adjust concrete drum rotation speeds and cement temperatures to verify nominal transport states.</span>
                    </div>
                  </div>

                  {/* Level 4 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 4: Execution Intelligence</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Smart PPE safety gate status (helmets, vests, pass/fail state checklists) and active worker entry camera sweeps.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Enforces occupational gate site safety protocols, auto-flagging breaches directly inside the SSOT database.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Click the &quot;Trigger Smart PPE Webcam Scan&quot; button to simulate AI safety gate checks. View pass/fail listings and automatically generate high-priority safety tickets on failed items.</span>
                    </div>
                  </div>

                  {/* Level 5 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 5: Advanced QA/QC LIMS</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">LIMS concrete grade compression limits (actual vs target MPa), slump cone height indexes, steel yield strength metrics, and ultrasonic acoustic speeds.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Provides high-fidelity laboratory verification of concrete and steel material strength, generating anomalies on failures.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Switch tabs (Cube, Slump, Steel, NDT). Adjust compressive force parameters to calculate MPa values. Click the &quot;Certify Sample & Log Results&quot; button to compile certificate or trigger tickets on failures.</span>
                    </div>
                  </div>

                  {/* Level 6 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 6: Live Operations SCADA</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Real-time vibration frequency waves (Hz), strain gauge stress matrices (micro-strain), and interactive SCADA canvas grids.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Monitors physical load fluctuations under daily city traffic to prevent micro-structural fatigue.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Observe active SCADA grid canvas wave cycles. Adjust SCADA vibration frequency and strain sliders to verify wave behavior in real-time.</span>
                    </div>
                  </div>

                  {/* Level 7 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 7: Disaster Simulation</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Dynamic earthquake Richter indicators, flood water depth variables, and structural deflection responses.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Simulates extreme environmental sags to evaluate the structural integrity of foundations under natural crisis stress.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Slide the Richter and Flood Depth sliders to simulate extreme structural sags. Observe live wave fluctuations on the SCADA grid below.</span>
                    </div>
                  </div>

                  {/* Level 8 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 8: Financial ERP Engine</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Asset inventories, planned vs actual material quantities (OPC Cement, Steel Rebar, Sand), and planned vs actual unit costs.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Tracks procurement expenses against initial financial planning budgets, showing structural cost variances.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Review material logs in the inventory grid. Inspect planned and actual quantities to monitor budget margins.</span>
                    </div>
                  </div>

                  {/* Level 9 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 9: Post-Construction Life</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Infrastructure lifespan age calendars and long-term structural maintenance projections.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Calculates structural degradation timelines to help city planners budget for structural repairs.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Slide the lifecycle age years slider forward to simulate degradation rates up to 50 years. Review changes in structural metrics.</span>
                    </div>
                  </div>

                  {/* Level 10 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 10: National Smart City OS</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Macro-urban transit integrations, municipal bridge networks safety logs, and traffic load densities.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Aggregates overall safety records across multiple transit bridges to monitor metropolitan infrastructure safety.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Review urban bridge charts and check general safety index metrics across transit nodes.</span>
                    </div>
                  </div>

                  {/* Level 11 */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <span className="font-bold text-[#16191f] text-[13px] block border-b border-[#eaeded] pb-1.5 font-sans">Level 11: Future Generative AI</span>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Generative AI structural column optimization specs, structural weight savings, carbon footprint reduction indices, and rebar layouts.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Optimizes physical designs using generative models to save steel weight and lower carbon mix indices.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Select generative design goals (example: Reduce Pillar Cross Section, Optimize Rebar Steel Layout, Max Carbon Absorption Mix). Click the &quot;Run Generative AI Design&quot; button to compile dynamic specs.</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 7. SYSTEMS & COMPLIANCE */}
            {activeSection === SECTIONS.SYSTEMS && (
              <div className="space-y-5">
                <div className="border-b border-[#eaeded] pb-3">
                  <h3 className="text-lg font-bold text-[#16191f] flex items-center gap-2 font-sans">
                    Systems, Auditing & Compliance
                  </h3>
                  <p className="text-[12px] text-[#545b64] mt-1 font-sans">Immutable security logs, 15-year AI decay timelines, and standard checking dashboards.</p>
                </div>

                <div className="space-y-4">
                  {/* Audit Intelligence Engine */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">1. Audit Intelligence Engine</span>
                      <span className="border-[#d6c4ff] text-[#8c43fc] rounded-[8px]-[4px] bg-[#f3efff] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Cryptographically signed access records, user action logs, and scope switcher audit ledgers.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Assures rigorous data compliance (SOC-2, ISO-27001) by immutably logging all user and admin actions.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Search and filter user logs using the interactive datagrid, or select rows to verify the cryptographic signature.</span>
                    </div>
                  </div>

                  {/* Predictive AI Engine */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">2. Predictive AI Engine</span>
                      <span className="border-[#d6c4ff] text-[#8c43fc] rounded-[8px]-[4px] bg-[#f3efff] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">Compressive decay forecasting models, Paris crack propagation timelines, and 15-year safety index predictions.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Enables preventative maintenance scheduling, predicting when physical members will decline below threshold levels.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Slide the &quot;15-Year Timeline Simulator&quot; slider forward to run AI projection algorithms. Select columns to verify forecasted safety coefficients.</span>
                    </div>
                  </div>

                  {/* Standards & Compliance Engine */}
                  <div className="p-4 border border-[#eaeded] rounded-[8px]-[4px] bg-white shadow-[0_1px_1px_0_rgba(0,28,36,0.15)] space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-[#eaeded] pb-2">
                      <span className="font-bold text-[#16191f] text-[13px]">3. Standards & Compliance Engine</span>
                      <span className="border-[#d6c4ff] text-[#8c43fc] rounded-[8px]-[4px] bg-[#f3efff] px-2 py-0.5 text-[12px] font-bold">WORKSPACE</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHAT IT INDICATES:</strong>
                      <span className="text-[#16191f] text-[12px]">ISO checklists, GDPR status indicators, sensor calibrations validation registers, and compliance alarms.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">WHY IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Guarantees all physical sensors and platform processes meet designated safety standards.</span>
                    </div>
                    <div>
                      <strong className="text-[#545b64] text-[12px] font-bold block mb-0.5">HOW IT IS USED:</strong>
                      <span className="text-[#16191f] text-[12px]">Filter check lists by standard category tabs. Review compliance flags and run checks on sensor status coordinates.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. AI COMMAND PALETTE */}
            {activeSection === SECTIONS.COMMANDS && (
              <div className="space-y-5">
                <div className="border-b border-[#eaeded] pb-3">
                  <h3 className="text-lg font-bold text-[#16191f] flex items-center gap-2 font-sans">
                    AI Command Console Core Directives
                  </h3>
                  <p className="text-[12px] text-[#545b64] mt-1 font-sans">Ingesting direct instructions through keyboard shortcuts.</p>
                </div>

                <p className="font-sans">
                  Ouantum OS provides a keyboard-driven search console to easily search engineering files, swap roles, and execute diagnostics directives.
                </p>

                <div className="p-4 border border-[#eaeded] bg-[#f2f3f3] rounded-[8px]-[4px] space-y-3 text-[13px] leading-relaxed text-[#16191f] font-sans">
                  <span className="font-bold text-[#16191f] block text-[13px]">HOW IT IS USED:</span>
                  <div>
                    <strong className="text-[#545b64] text-[12px] block font-bold">Step 1: Open the Console</strong>
                    <span className="text-[#16191f] text-[12px]">Press Ctrl + K anywhere inside the dashboard.</span>
                  </div>
                  <div>
                    <strong className="text-[#545b64] text-[12px] block font-bold">Step 2: Enter Search Query</strong>
                    <span className="text-[#16191f] text-[12px]">Type words to query specific accounts, team members, or core directives (example: &quot;simulation&quot;).</span>
                  </div>
                  <div>
                    <strong className="text-[#545b64] text-[12px] block font-bold">Step 3: Ingest Directive</strong>
                    <span className="text-[#16191f] text-[12px]">Click on any command card (example: ANALYZE PILLAR B12) or click the EXEC badge to execute the action immediately.</span>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#f2f3f3] border-t border-[#eaeded] font-sans text-[12px] text-[#545b64] font-semibold flex-shrink-0">
          <span>Ouantum OS Infrastructure Intelligence Console v1.0</span>
          <span>© 2026 Ouantum Inc • All Rights Reserved</span>
        </div>

      </div>
    </div>
  );
}
