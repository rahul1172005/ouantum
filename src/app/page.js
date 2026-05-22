'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowRightLeft,
  Compass, 
  Activity,
  Map, 
  Cpu,
  Layers
} from 'lucide-react';
import { useCRMStore, WORKSPACES } from '@/store/crmStore';
import Sidebar from '@/components/ui/Sidebar';
import Topbar from '@/components/ui/Topbar';
import CommandPalette from '@/components/ui/CommandPalette';
import ExecutiveDashboard from '@/components/dashboards/ExecutiveDashboard';

// Import all 9 newly developed engineering workspaces
import StructuralStudio from '@/components/workspaces/StructuralStudio';
import DigitalTwin from '@/components/workspaces/DigitalTwin';
import NDTLab from '@/components/workspaces/NDTLab';
import SHMMonitoring from '@/components/workspaces/SHMMonitoring';
import AuditEngine from '@/components/workspaces/AuditEngine';
import PredictiveAI from '@/components/workspaces/PredictiveAI';
import GISEngine from '@/components/workspaces/GISEngine';
import ReportingStudio from '@/components/workspaces/ReportingStudio';
import EmergencySystem from '@/components/workspaces/EmergencySystem';
import BuildingValidation from '@/components/workspaces/BuildingValidation';
import CivilOSWorkspace from '@/components/workspaces/CivilOSWorkspace';
 
// New Workspaces for Master Factor Architecture
import GeotechnicalEngine from '@/components/workspaces/GeotechnicalEngine';
import MaterialsLab from '@/components/workspaces/MaterialsLab';
import StructuralSafety from '@/components/workspaces/StructuralSafety';
import ProjectIntelligence from '@/components/workspaces/ProjectIntelligence';

export default function Home() {
  const [inApp, setInApp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showNewDropdown, setShowNewDropdown] = useState(false);
  
  const currentWorkspace = useCRMStore(state => state.currentWorkspace);
  const setWorkspace = useCRMStore(state => state.setWorkspace);
  const activities = useCRMStore(state => state.activities);

  // Escape key listener to clear inspected elements
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedElement(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Landing Page Industry rotating cards data
  const industries = [
    { name: 'Smart Transit Cities', desc: 'Predictive corrosion mapping & sensor grids', icon: Compass },
    { name: 'Suspension Bridges', desc: 'Real-time structural health tension checks', icon: Activity },
    { name: 'Highways & Expressways', desc: 'Autonomous NDT mobile diagnostic platforms', icon: Map },
    { name: 'Metro & Railway Systems', desc: 'Micro-vibration acoustic failure triggers', icon: Cpu },
  ];

  // AI Workflow data paths
  const workflowNodes = [
    { step: '01', title: 'Data Ingestion', desc: 'IoT Acoustic sensors stream 42Hz concrete vibration matrices.' },
    { step: '02', title: 'AI Diagnostics', desc: 'Deep learning neural models identify localized stress anomalies.' },
    { step: '03', title: 'Risk Verification', desc: 'Engineering teams validate crack anomalies via 3D twins.' },
    { step: '04', title: 'Compliance Sync', desc: 'Automated digital signatures cascade NDT audit reports.' },
  ];

  // CTA triggers app dashboard
  const handleLaunchCommandCenter = () => {
    setInApp(true);
    setWorkspace(WORKSPACES.EXECUTIVE);
  };

  /* ------------------- 1. PORTAL LANDING PAGE ------------------- */
  if (!inApp) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'VT323', 'Courier New', Courier, monospace",
        padding: '48px 24px',
        boxSizing: 'border-box',
      }}>

        {/* CRT scan lines on white — subtle dark horizontal bands */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.045) 0px, rgba(0,0,0,0.045) 1px, transparent 1px, transparent 4px)',
        }} />

        {/* Soft edge vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9,
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.10) 100%)',
        }} />

        {/* ── Top nav bar ── */}
        <div style={{ position: 'relative', zIndex: 20, width: '100%', maxWidth: 1080, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34,
              border: '2px solid rgba(0,0,0,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#000000',
              fontSize: 18, fontWeight: 900,
              fontFamily: "'VT323', monospace",
            }}>Ω</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#000000', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'VT323', monospace" }}>OUANTUM</div>
              <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'VT323', monospace" }}>STRUCTURAL INTELLIGENCE OS</div>
            </div>
          </div>
          <button
            onClick={handleLaunchCommandCenter}
            style={{
              fontFamily: "'VT323', 'Courier New', monospace",
              padding: '8px 22px',
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.6)',
              color: '#000000',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            INITIALIZE KERNEL →
          </button>
        </div>

        {/* ── Center Content Area ── */}
        <div style={{ position: 'relative', zIndex: 20, width: '100%', maxWidth: 1080, textAlign: 'center', margin: 'auto 0', padding: '48px 0' }}>
          {/* ── Hero title — Press Start 2P for exact pixel font match ── */}
          <div style={{ marginBottom: 48 }}>
            <h1 style={{
              fontFamily: "'Press Start 2P', 'Courier New', monospace",
              fontSize: 'clamp(28px, 4.5vw, 56px)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#000000',
              textTransform: 'uppercase',
              lineHeight: 1.3,
              margin: '0 0 20px',
            }}>
              OUANTUM OS
            </h1>
            <div style={{ fontSize: 18, color: 'rgba(0,0,0,0.55)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'VT323', monospace" }}>
              OPERATING SYSTEM FOR INFRASTRUCTURE INTELLIGENCE
            </div>
          </div>

          {/* ── CTA ── */}
          <div>
            <button
              onClick={handleLaunchCommandCenter}
              style={{
                fontFamily: "'VT323', 'Courier New', monospace",
                padding: '12px 52px',
                background: '#000000',
                border: '2px solid #000000',
                color: '#ffffff',
                fontSize: 20,
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#222222'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#000000'; }}
            >
              INITIALIZE WORKSPACE KERNEL →
            </button>
          </div>
        </div>

        {/* ── Bottom Copyright Footer ── */}
        <div style={{ position: 'relative', zIndex: 20, width: '100%', maxWidth: 1080, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'VT323', monospace" }}>
            © 2026 OUANTUM INC
          </div>
        </div>

      </div>
    );
  }

  /* ------------------- 2. ENTERPRISE CRM DASHBOARD ------------------- */
  return (
    <div className="min-h-screen bg-[#f0f2f5] relative text-[#2d2d2d] flex flex-col">
      {/* Search overlay & Command palette */}
      <CommandPalette />

      {/* Top Header Navigation bar */}
      <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        
        {/* Collapsible Left Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Middle workspace content + Right contextual inspector panel */}
        <div 
          className={`flex-1 flex flex-col lg:flex-row transition-all duration-200 ${
            sidebarOpen ? 'ml-60' : 'ml-14'
          }`}
        >
          {/* Main workspace display area */}
          <main className="flex-1 overflow-hidden flex flex-col min-w-0 bg-white border border-[#cccccc] rounded m-4 shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
            
            {/* 1. Zoho Reports Tab Bar */}
            <div className="workspace-tabs flex-shrink-0 select-none">
              <div className="workspace-tab">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 2.5C1.5 2.22386 1.72386 2 2 2H5.5L7.5 4H14C14.2761 4 14.5 4.22386 14.5 4.5V13.5C14.5 13.7761 14.2761 14 14 14H2C1.72386 14 1.5 13.7761 1.5 13.5V2.5Z" fill="#F8C444" stroke="#DCA224" strokeWidth="0.8"/>
                  <path d="M2 4.5H14V13H2V4.5Z" fill="#FDE69E"/>
                </svg>
                <span>Explorer</span>
              </div>
              <div className="workspace-tab active">
                {currentWorkspace.includes('OVERVIEW') ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8"/>
                    <rect x="3" y="3" width="4.5" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5"/>
                    <rect x="8.5" y="3" width="4.5" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5"/>
                    <rect x="3" y="8.5" width="10" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5"/>
                  </svg>
                ) : currentWorkspace.includes('STUDIO') || currentWorkspace.includes('LAB') || currentWorkspace.includes('CENTER') || currentWorkspace.includes('SAFETY') ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8"/>
                    <rect x="3.5" y="7.5" width="2" height="5.5" fill="#336600" stroke="#224400" strokeWidth="0.5"/>
                    <rect x="7.5" y="5.5" width="2" height="7.5" fill="#E68A00" stroke="#CC7A00" strokeWidth="0.5"/>
                    <rect x="11.5" y="3.5" width="2" height="9.5" fill="#CC0000" stroke="#990000" strokeWidth="0.5"/>
                    <line x1="2.5" y1="13" x2="13.5" y2="13" stroke="#555555" strokeWidth="0.8"/>
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="2.5" width="13" height="11" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8"/>
                    <rect x="1.5" y="2.5" width="13" height="3" fill="#E68A00" stroke="#E68A00" strokeWidth="0.8"/>
                    <line x1="1.5" y1="8.5" x2="14.5" y2="8.5" stroke="#DDDDDD" strokeWidth="0.8"/>
                    <line x1="1.5" y1="11.5" x2="14.5" y2="11.5" stroke="#DDDDDD" strokeWidth="0.8"/>
                    <line x1="5.5" y1="5.5" x2="5.5" y2="13.5" stroke="#DDDDDD" strokeWidth="0.8"/>
                    <line x1="10.5" y1="5.5" x2="10.5" y2="13.5" stroke="#DDDDDD" strokeWidth="0.8"/>
                  </svg>
                )}
                <span className="font-bold text-gray-800 text-[11.5px] uppercase">
                  {currentWorkspace.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* 2. Zoho Reports Action Toolbar */}
            <div className="workspace-toolbar flex-shrink-0 select-none">
              
              {/* "New" Dropdown Menu Button */}
              <div className="relative">
                <button 
                  onClick={() => setShowNewDropdown(!showNewDropdown)}
                  className="toolbar-btn text-xs font-bold text-gray-700 bg-transparent flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#eaeaea] cursor-pointer"
                  style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#333333', textShadow: 'none', fontStyle: 'normal' }}
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 2.5C1.5 2.22386 1.72386 2 2 2H5.5L7.5 4H14C14.2761 4 14.5 4.22386 14.5 4.5V13.5C14.5 13.7761 14.2761 14 14 14H2C1.72386 14 1.5 13.7761 1.5 13.5V2.5Z" fill="#F8C444" stroke="#DCA224" strokeWidth="0.8"/>
                    <path d="M2 4.5H14V13H2V4.5Z" fill="#FDE69E"/>
                    <circle cx="12" cy="10" r="3.5" fill="#336600" stroke="#ffffff" strokeWidth="0.5"/>
                    <line x1="12" y1="8.5" x2="12" y2="11.5" stroke="#ffffff" strokeWidth="0.8"/>
                    <line x1="10.5" y1="10" x2="13.5" y2="10" stroke="#ffffff" strokeWidth="0.8"/>
                  </svg>
                  <span>New</span>
                  <span className="text-[7px] text-gray-500">▼</span>
                </button>

                {showNewDropdown && (
                  <div className="absolute left-0 mt-1 w-44 bg-white border border-[#cccccc] rounded shadow-lg z-50 py-1">
                    <button 
                      onClick={() => { setShowNewDropdown(false); alert("Enforcing new table constraints: Select related workspace category in explorer tree."); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#e9f0f8] text-xs text-gray-700 flex items-center gap-2"
                      style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#333333', textShadow: 'none', fontStyle: 'normal' }}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="2.5" width="13" height="11" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8"/>
                        <rect x="1.5" y="2.5" width="13" height="3" fill="#E68A00" stroke="#E68A00" strokeWidth="0.8"/>
                        <line x1="1.5" y1="8.5" x2="14.5" y2="8.5" stroke="#DDDDDD" strokeWidth="0.8"/>
                        <line x1="1.5" y1="11.5" x2="14.5" y2="11.5" stroke="#DDDDDD" strokeWidth="0.8"/>
                        <line x1="5.5" y1="5.5" x2="5.5" y2="13.5" stroke="#DDDDDD" strokeWidth="0.8"/>
                        <line x1="10.5" y1="5.5" x2="10.5" y2="13.5" stroke="#DDDDDD" strokeWidth="0.8"/>
                      </svg>
                      <span>New Table</span>
                    </button>
                    <button 
                      onClick={() => { setShowNewDropdown(false); alert("Enforcing new report constraints: Select related workspace category in explorer tree."); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#e9f0f8] text-xs text-gray-700 flex items-center gap-2"
                      style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#333333', textShadow: 'none', fontStyle: 'normal' }}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8"/>
                        <rect x="3.5" y="7.5" width="2" height="5.5" fill="#336600" stroke="#224400" strokeWidth="0.5"/>
                        <rect x="7.5" y="5.5" width="2" height="7.5" fill="#E68A00" stroke="#CC7A00" strokeWidth="0.5"/>
                        <rect x="11.5" y="3.5" width="2" height="9.5" fill="#CC0000" stroke="#990000" strokeWidth="0.5"/>
                        <line x1="2.5" y1="13" x2="13.5" y2="13" stroke="#555555" strokeWidth="0.8"/>
                      </svg>
                      <span>New Report</span>
                    </button>
                    {/* Highlighted New Dashboard with red box to match reference image */}
                    <button 
                      onClick={() => { setShowNewDropdown(false); alert("Enforcing new dashboard constraints: Select related workspace category in explorer tree."); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#e9f0f8] text-xs text-gray-700 flex items-center gap-2 border border-red-600 rounded-sm"
                      style={{ background: 'transparent', boxShadow: 'none', color: '#333333', textShadow: 'none', fontStyle: 'normal' }}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8"/>
                        <rect x="3" y="3" width="4.5" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5"/>
                        <rect x="8.5" y="3" width="4.5" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5"/>
                        <rect x="3" y="8.5" width="10" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5"/>
                      </svg>
                      <span>New Dashboard</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={() => { setShowNewDropdown(false); alert("Enforcing new folder constraints: System directory is managed under master compliance rules."); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#e9f0f8] text-xs text-gray-700 flex items-center gap-2"
                      style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#333333', textShadow: 'none', fontStyle: 'normal' }}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 2.5C1.5 2.22386 1.72386 2 2 2H5.5L7.5 4H14C14.2761 4 14.5 4.22386 14.5 4.5V13.5C14.5 13.7761 14.2761 14 14 14H2C1.72386 14 1.5 13.7761 1.5 13.5V2.5Z" fill="#F8C444" stroke="#DCA224" strokeWidth="0.8"/>
                        <path d="M2 4.5H14V13H2V4.5Z" fill="#FDE69E"/>
                      </svg>
                      <span>New Folder</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Refresh button */}
              <button 
                onClick={() => alert("Refreshed active workspace telemetry.")}
                className="toolbar-btn text-xs font-bold text-gray-700 bg-transparent flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#eaeaea] cursor-pointer"
                style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#333333', textShadow: 'none', fontStyle: 'normal' }}
              >
                <svg className="w-3.5 h-3.5 text-[#336600]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5V1L10.5 3L8 5V3.5C5.51472 3.5 3.5 5.51472 3.5 8C3.5 10.4853 5.51472 12.5 8 12.5C10.4853 12.5 12.5 10.4853 12.5 8H13.5Z" fill="#336600"/>
                </svg>
                <span>Refresh</span>
              </button>

              {/* Import button */}
              <button 
                onClick={() => alert("Import wizard: Choose file to ingest (supported: CSV, XLS, JSON, DWG, PDF).")}
                className="toolbar-btn text-xs font-bold text-gray-700 bg-transparent flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#eaeaea] cursor-pointer"
                style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#333333', textShadow: 'none', fontStyle: 'normal' }}
              >
                <svg className="w-3.5 h-3.5 text-gray-600" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12V13.5C2 13.7761 2.22386 14 2.5 14H13.5C13.7761 14 14 13.7761 14 13.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Import</span>
              </button>

              {/* Share button */}
              <button 
                onClick={() => alert("Share dialog: Copy workspace portal link or send secure email invite.")}
                className="toolbar-btn text-xs font-bold text-gray-700 bg-transparent flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#eaeaea] cursor-pointer"
                style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#333333', textShadow: 'none', fontStyle: 'normal' }}
              >
                <svg className="w-3.5 h-3.5 text-gray-600" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5C13.1046 5 14 4.10457 14 3C14 1.89543 13.1046 1 12 1C10.8954 1 10 1.89543 10 3C10 3.11184 10.0092 3.22153 10.0268 3.32835L5.83067 5.42641C5.0747 4.55598 3.95156 4 2.7 4C1.20883 4 0 5.20883 0 6.7C0 8.19117 1.20883 9.4 2.7 9.4C3.95156 9.4 5.0747 8.84402 5.83067 7.97359L10.0268 10.0716C10.0092 10.1785 10 10.2882 10 10.4C10 11.5046 10.8954 12.4 12 12.4C13.1046 12.4 14 11.5046 14 10.4C14 9.29543 13.1046 8.4 12 8.4C10.8954 8.4 10 9.29543 10 10.4C10 10.4357 10.001 10.4711 10.003 10.5064L5.80682 8.40833C5.93297 8.11894 6 7.80164 6 7.47C6 7.13836 5.93297 6.82106 5.80682 6.53167L10.003 4.43359C10.001 4.46889 10 4.50428 10 4.54C10 5.10457 10.8954 5.54 12 5.54Z" fill="currentColor"/>
                </svg>
                <span>Share</span>
              </button>

              {/* Delete button */}
              <button 
                onClick={() => alert("Action restricted: Deletion of workspace core tables violates compliance rules.")}
                className="toolbar-btn text-xs font-bold text-[#cc0000] bg-transparent flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#fff0f0] cursor-pointer"
                style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#cc0000', textShadow: 'none', fontStyle: 'normal' }}
              >
                <svg className="w-3.5 h-3.5 text-[#cc0000]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L12 12M12 4L4 12" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Delete</span>
              </button>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Exit Portal Link */}
              <button 
                onClick={() => setInApp(false)}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
                style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#555555', textShadow: 'none', fontStyle: 'normal' }}
              >
                <ArrowRightLeft className="h-3.5 w-3.5 text-gray-400" />
                <span>Exit Workspace</span>
              </button>

            </div>

            {/* Dotted border separator */}
            <div className="border-b border-dashed border-[#cccccc] flex-shrink-0"></div>

            {/* Scrollable Viewport Pane */}
            <div className="flex-1 p-6 overflow-y-auto min-h-0 bg-white">
              {/* Render Active Component Workspace based on crmStore routing */}
              {currentWorkspace === WORKSPACES.EXECUTIVE && (
                <ExecutiveDashboard selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.STRUCTURAL && (
                <StructuralStudio selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.TWIN && (
                <DigitalTwin selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.NDT && (
                <NDTLab selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.SHM && (
                <SHMMonitoring selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.AUDIT && (
                <AuditEngine selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.PREDICTIVE && (
                <PredictiveAI selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.GIS && (
                <GISEngine selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.REPORTING && (
                <ReportingStudio selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.EMERGENCY && (
                <EmergencySystem selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.VALIDATION && (
                <BuildingValidation selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.CIVIL_OS && (
                <CivilOSWorkspace selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.GEOTECH && (
                <GeotechnicalEngine selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.MATERIALS && (
                <MaterialsLab selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.STRUCTURAL_SAFETY && (
                <StructuralSafety selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.PROJECT_INTEL && (
                <ProjectIntelligence selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
            </div>
          </main>

          {/* Right Control Panel: Zoho-style contextual inspector */}
          <aside
            style={{
              width: 280,
              flexShrink: 0,
              background: '#fff',
              borderLeft: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column',
              fontSize: 12,
              color: '#2d2d2d',
              overflowY: 'auto',
            }}
          >
            {/* Inspector header */}
            <div style={{
              padding: '10px 14px',
              background: '#f8f9fa',
              borderBottom: '1px solid #e3e3e3',
              fontWeight: 600,
              fontSize: 11.5,
              color: '#3d3d3d',
            }}>Contextual Inspector</div>

            <div style={{ padding: 14, flex: 1 }}>
              {selectedElement ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Element identity card */}
                  <div style={{
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #a8a8a8',
                    borderRadius: 3,
                    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.95), inset -1px -1px 0 rgba(0,0,0,0.06), 1px 2px 4px rgba(0,0,0,0.1)',
                  }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555555', marginBottom: 4 }}>Selected Element</div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: '#1a1a1a', wordBreak: 'break-all' }}>{selectedElement.type}</div>
                    <div style={{ fontSize: 10, color: '#888', marginTop: 2, wordBreak: 'break-all' }}>{selectedElement.id}</div>
                  </div>

                  {/* Metrics table */}
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: '#555', marginBottom: 7, paddingBottom: 5, borderBottom: '1px solid #ebebeb' }}>Diagnostics Metrics</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                      <tbody>
                        {Object.entries(selectedElement.metrics || {}).map(([key, value]) => (
                          <tr key={key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '6px 8px', fontWeight: 600, fontSize: 10.5, color: '#666', background: '#fafafa', width: '48%', borderRight: '1px solid #ebebeb' }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            <td style={{ padding: '6px 8px', color: '#1a1a1a', fontWeight: 600 }}>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* AI analysis */}
                  <div style={{
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #a8a8a8',
                    borderRadius: 3,
                    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.95), inset -1px -1px 0 rgba(0,0,0,0.06), 1px 2px 4px rgba(0,0,0,0.1)',
                  }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', color: '#555555', marginBottom: 6 }}>AI Diagnostic Analysis</div>
                    <p style={{ fontSize: 11.5, lineHeight: 1.55, color: '#3d3d3d', margin: 0 }}>
                      {selectedElement.type.includes('Node') && 'Stress concentrations detected under cyclic load triggers. Monitor displacement velocity channels continuously.'}
                      {selectedElement.type.includes('Member') && 'Corrosion profile suggests fatigue threshold margin at 78.4%. Standard validation lifecycle recommended.'}
                      {selectedElement.type.includes('Twin') && 'Anchor wireframe degradation factor simulated. Maintain continuous sensor feeds to optimize forecasting models.'}
                      {selectedElement.type.includes('Ultrasonic') && 'Acoustic signal path analysis verifies micro-delamination indices. Scheduled thermal validation is advised.'}
                      {selectedElement.type.includes('Vibration') && 'Vibration telemetry frequencies matched with structural eigenmodes. Zero structural divergence detected.'}
                      {selectedElement.type.includes('GIS') && 'Geospatial telemetry shows nominal site coordinates. Drainage and topographic vectors are stable.'}
                      {selectedElement.type.includes('Asset') && 'General structural assets tracking nominal lifecycle values. Next inspection recommended in 6 months.'}
                      {!['Node','Member','Twin','Ultrasonic','Vibration','GIS','Asset'].some(k => selectedElement.type.includes(k)) && 'Continuous monitoring active. Telemetrical values match active simulation constraints.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedElement(null)}
                    style={{
                      padding: '7px 0',
                      width: '100%',
                      background: 'linear-gradient(to bottom, #fdfdfd, #e8e8e8)',
                      border: '1px solid #c0c0c0',
                      borderRadius: 3,
                      fontWeight: 600,
                      fontSize: 11.5,
                      color: '#333',
                      cursor: 'pointer',
                    }}
                  >
                    Clear Selection (Esc)
                  </button>

                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  <div style={{
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #a8a8a8',
                    borderRadius: 3,
                    fontSize: 11.5,
                    color: '#555',
                    lineHeight: 1.5,
                    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.95), inset -1px -1px 0 rgba(0,0,0,0.06), 1px 2px 4px rgba(0,0,0,0.1)',
                  }}>
                    Select any structural member, node, transducer, or digital twin asset in the active workspace to load contextual telemetric data here.
                  </div>

                  {/* Mini Activity Feed */}
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: '#555', marginBottom: 8, paddingBottom: 5, borderBottom: '1px solid #ebebeb' }}>Active Project Events</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {activities.slice(0, 4).map((act) => (
                        <div key={act.id} style={{
                          padding: '8px 10px',
                          border: '1px solid #a8a8a8',
                          borderRadius: 3,
                          background: '#ffffff',
                          boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.95), inset -1px -1px 0 rgba(0,0,0,0.06), 1px 2px 4px rgba(0,0,0,0.1)',
                        }}>
                          <div style={{ display: 'flex', justifycontent: 'space-between', marginBottom: 3 }}>
                            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#555555', textTransform: 'uppercase' }}>{act.type}</span>
                            <span style={{ fontSize: 9.5, color: '#aaa' }}>{new Date(act.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                          </div>
                          <p style={{ fontSize: 11.5, color: '#3d3d3d', margin: 0, lineHeight: 1.4 }}>{act.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shortcuts */}
                  <div style={{
                    padding: '9px 11px',
                    background: '#ffffff',
                    border: '1px solid #a8a8a8',
                    borderRadius: 3,
                    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.95), inset -1px -1px 0 rgba(0,0,0,0.06), 1px 2px 4px rgba(0,0,0,0.1)',
                    fontSize: 11,
                    color: '#666',
                    lineHeight: 1.8,
                  }}>
                    <div style={{ fontWeight: 700, color: '#333', marginBottom: 5, fontSize: 10.5 }}>Sys Shortcuts</div>
                    <div>Ctrl + K — AI Command Palette</div>
                    <div>Esc — Clear inspection</div>
                    <div>Sidebar — Workspace switch</div>
                  </div>

                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
