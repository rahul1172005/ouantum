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
import { AppShell } from '@/components/layout/AppShell';
import CommandPalette from '@/components/ui/CommandPalette';
import ExecutiveDashboard from '@/components/dashboards/ExecutiveDashboard';
import HelpGuide from '@/components/ui/HelpGuide';

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

// Phase 2 — Full Platform Expansion
import DefectDetection from '@/components/workspaces/DefectDetection';
import SiteInspection from '@/components/workspaces/SiteInspection';
import ConstructionMonitor from '@/components/workspaces/ConstructionMonitor';
import ComplianceEngine from '@/components/workspaces/ComplianceEngine';

export default function Home() {
  const [inApp, setInApp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showNewDropdown, setShowNewDropdown] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const currentWorkspace = useCRMStore(state => state.currentWorkspace);
  const setWorkspace = useCRMStore(state => state.setWorkspace);
  const activities = useCRMStore(state => state.activities);
  const fetchBackendData = useCRMStore(state => state.fetchBackendData);

  // Load real-time database data from PostgreSQL backend on mount
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Auto-expand Contextual Inspector when a workspace node/element is selected
  useEffect(() => {
    if (selectedElement) {
      const timer = setTimeout(() => {
        setInspectorOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedElement]);

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
      <>
        <HelpGuide isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
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
              <img
                src="/ouantum-logo.png"
                alt="OUANTUM"
                style={{
                  height: 60,
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  /* ── Logo transform controls ── */
                  transform: 'scale(3.1) translateX(0px) translateY(0px)',
                  transformOrigin: 'left center',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setHelpOpen(true)}
                style={{
                  fontFamily: "'VT323', 'Courier New', monospace",
                  padding: '8px 22px',
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.6)',
                  color: '#000000',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  borderRadius: '8px'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
              >
                HELP GUIDE ?
              </button>
              <button
                onClick={handleLaunchCommandCenter}
                style={{
                  fontFamily: "'VT323', 'Courier New', monospace",
                  padding: '8px 22px',
                  background: '#000000',
                  border: '1px solid rgba(0,0,0,1)',
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  borderRadius: '8px'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#222222'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#000000'; }}
              >
                INITIALIZE KERNEL →
              </button>
            </div>
          </div>

          {/* ── Center Content Area ── */}
          <div style={{ position: 'relative', zIndex: 20, width: '100%', maxWidth: 1080, textAlign: 'center', margin: 'auto 0', padding: '48px 0' }}>
            {/* ── Hero title — Press Start 2P for exact pixel font match ── */}
            <div style={{ marginBottom: 48 }}>
              <img
                src="/ouantum-logo.png"
                alt="OUANTUM"
                style={{
                  height: 'clamp(90px, 14vw, 160px)',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto 28px auto',
                  /* ── Logo transform controls ── */
                  transform: 'scale(6.15) translateX(0px) translateY(0px)',
                  transformOrigin: 'center center',
                }}
              />
              <div style={{ fontSize: 18, color: 'rgba(0,0,0,0.55)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'VT323', monospace" }}>
                OPERATING SYSTEM FOR INFRASTRUCTURE INTELLIGENCE
              </div>
            </div>

            {/* ── CTA ── */}
            <div style={{ display: 'flex', flexDirection: 'column', sm: 'row', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setHelpOpen(true)}
                style={{
                  fontFamily: "'VT323', 'Courier New', monospace",
                  padding: '12px 52px',
                  background: '#ffffff',
                  border: '2px solid #000000',
                  color: '#000000',
                  fontSize: 20,
                  fontWeight: 400,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  borderRadius: '10px'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f2f2f2'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
              >
                PLATFORM HELP GUIDE ?
              </button>
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
                  borderRadius: '10px'
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
      </>
    );
  }

  /* ------------------- 2. ENTERPRISE CRM DASHBOARD ------------------- */
  return (
    <>
      <CommandPalette />
      <HelpGuide isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      
      <AppShell
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setHelpOpen={setHelpOpen}
      >
        {/* Main workspace display area */}
        <main className="flex-1 overflow-hidden flex flex-col min-w-0 bg-white border border-border-default rounded-none m-4 shadow-card">

            {/* 1. Zoho Reports Tab Bar */}
            <div className="workspace-tabs flex-shrink-0 select-none">
              <div className="workspace-tab">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 2.5C1.5 2.22386 1.72386 2 2 2H5.5L7.5 4H14C14.2761 4 14.5 4.22386 14.5 4.5V13.5C14.5 13.7761 14.2761 14 14 14H2C1.72386 14 1.5 13.7761 1.5 13.5V2.5Z" fill="#F8C444" stroke="#DCA224" strokeWidth="0.8" />
                  <path d="M2 4.5H14V13H2V4.5Z" fill="#FDE69E" />
                </svg>
                <span>Explorer</span>
              </div>
              <div className="workspace-tab active">
                {currentWorkspace.includes('OVERVIEW') ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8" />
                    <rect x="3" y="3" width="4.5" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5" />
                    <rect x="8.5" y="3" width="4.5" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5" />
                    <rect x="3" y="8.5" width="10" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5" />
                  </svg>
                ) : currentWorkspace.includes('STUDIO') || currentWorkspace.includes('LAB') || currentWorkspace.includes('CENTER') || currentWorkspace.includes('SAFETY') ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8" />
                    <rect x="3.5" y="7.5" width="2" height="5.5" fill="#336600" stroke="#224400" strokeWidth="0.5" />
                    <rect x="7.5" y="5.5" width="2" height="7.5" fill="#E68A00" stroke="#CC7A00" strokeWidth="0.5" />
                    <rect x="11.5" y="3.5" width="2" height="9.5" fill="#CC0000" stroke="#990000" strokeWidth="0.5" />
                    <line x1="2.5" y1="13" x2="13.5" y2="13" stroke="#555555" strokeWidth="0.8" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="2.5" width="13" height="11" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8" />
                    <rect x="1.5" y="2.5" width="13" height="3" fill="#E68A00" stroke="#E68A00" strokeWidth="0.8" />
                    <line x1="1.5" y1="8.5" x2="14.5" y2="8.5" stroke="#DDDDDD" strokeWidth="0.8" />
                    <line x1="1.5" y1="11.5" x2="14.5" y2="11.5" stroke="#DDDDDD" strokeWidth="0.8" />
                    <line x1="5.5" y1="5.5" x2="5.5" y2="13.5" stroke="#DDDDDD" strokeWidth="0.8" />
                    <line x1="10.5" y1="5.5" x2="10.5" y2="13.5" stroke="#DDDDDD" strokeWidth="0.8" />
                  </svg>
                )}
                <span className="font-bold text-gray-800 text-[12px] uppercase">
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
                  className="toolbar-btn text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 2.5C1.5 2.22386 1.72386 2 2 2H5.5L7.5 4H14C14.2761 4 14.5 4.22386 14.5 4.5V13.5C14.5 13.7761 14.2761 14 14 14H2C1.72386 14 1.5 13.7761 1.5 13.5V2.5Z" fill="#F8C444" stroke="#DCA224" strokeWidth="0.8" />
                    <path d="M2 4.5H14V13H2V4.5Z" fill="#FDE69E" />
                    <circle cx="12" cy="10" r="3.5" fill="#336600" stroke="#ffffff" strokeWidth="0.5" />
                    <line x1="12" y1="8.5" x2="12" y2="11.5" stroke="#ffffff" strokeWidth="0.8" />
                    <line x1="10.5" y1="10" x2="13.5" y2="10" stroke="#ffffff" strokeWidth="0.8" />
                  </svg>
                  <span>New</span>
                  <span className="text-[12px] text-gray-500">▼</span>
                </button>

                {showNewDropdown && (
                  <div className="absolute left-0 mt-1 w-44 bg-white border border-[#d5dbdb] rounded shadow-lg z-50 py-1">
                    <button
                      onClick={() => { setShowNewDropdown(false); alert("Enforcing new table constraints: Select related workspace category in explorer tree."); }}
                      className="w-full text-left px-3 py-2 hover:bg-[#f1f3f3] text-xs text-[#16191f] flex items-center gap-2 cursor-pointer border-none bg-transparent"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="2.5" width="13" height="11" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8" />
                        <rect x="1.5" y="2.5" width="13" height="3" fill="#E68A00" stroke="#E68A00" strokeWidth="0.8" />
                        <line x1="1.5" y1="8.5" x2="14.5" y2="8.5" stroke="#DDDDDD" strokeWidth="0.8" />
                        <line x1="1.5" y1="11.5" x2="14.5" y2="11.5" stroke="#DDDDDD" strokeWidth="0.8" />
                        <line x1="5.5" y1="5.5" x2="5.5" y2="13.5" stroke="#DDDDDD" strokeWidth="0.8" />
                        <line x1="10.5" y1="5.5" x2="10.5" y2="13.5" stroke="#DDDDDD" strokeWidth="0.8" />
                      </svg>
                      <span>New Table</span>
                    </button>
                    <button
                      onClick={() => { setShowNewDropdown(false); alert("Enforcing new report constraints: Select related workspace category in explorer tree."); }}
                      className="w-full text-left px-3 py-2 hover:bg-[#f1f3f3] text-xs text-[#16191f] flex items-center gap-2 cursor-pointer border-none bg-transparent"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8" />
                        <rect x="3.5" y="7.5" width="2" height="5.5" fill="#336600" stroke="#224400" strokeWidth="0.5" />
                        <rect x="7.5" y="5.5" width="2" height="7.5" fill="#E68A00" stroke="#CC7A00" strokeWidth="0.5" />
                        <rect x="11.5" y="3.5" width="2" height="9.5" fill="#CC0000" stroke="#990000" strokeWidth="0.5" />
                        <line x1="2.5" y1="13" x2="13.5" y2="13" stroke="#555555" strokeWidth="0.8" />
                      </svg>
                      <span>New Report</span>
                    </button>
                    {/* Highlighted New Dashboard with red box to match reference image */}
                    <button
                      onClick={() => { setShowNewDropdown(false); alert("Enforcing new dashboard constraints: Select related workspace category in explorer tree."); }}
                      className="w-full text-left px-3 py-2 hover:bg-[#f1f3f3] text-xs text-[#16191f] flex items-center gap-2 border border-[#d13212] rounded-sm cursor-pointer bg-transparent"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8" />
                        <rect x="3" y="3" width="4.5" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5" />
                        <rect x="8.5" y="3" width="4.5" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5" />
                        <rect x="3" y="8.5" width="10" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5" />
                      </svg>
                      <span>New Dashboard</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => { setShowNewDropdown(false); alert("Enforcing new folder constraints: System directory is managed under master compliance rules."); }}
                      className="w-full text-left px-3 py-2 hover:bg-[#f1f3f3] text-xs text-[#16191f] flex items-center gap-2 cursor-pointer border-none bg-transparent"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 2.5C1.5 2.22386 1.72386 2 2 2H5.5L7.5 4H14C14.2761 4 14.5 4.22386 14.5 4.5V13.5C14.5 13.7761 14.2761 14 14 14H2C1.72386 14 1.5 13.7761 1.5 13.5V2.5Z" fill="#F8C444" stroke="#DCA224" strokeWidth="0.8" />
                        <path d="M2 4.5H14V13H2V4.5Z" fill="#FDE69E" />
                      </svg>
                      <span>New Folder</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Refresh button */}
              <button
                onClick={() => alert("Refreshed active workspace telemetry.")}
                className="toolbar-btn text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#1d8102]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5V1L10.5 3L8 5V3.5C5.51472 3.5 3.5 5.51472 3.5 8C3.5 10.4853 5.51472 12.5 8 12.5C10.4853 12.5 12.5 10.4853 12.5 8H13.5Z" fill="#1d8102" />
                </svg>
                <span>Refresh</span>
              </button>

              {/* Import button */}
              <button
                onClick={() => alert("Import wizard: Choose file to ingest (supported: CSV, XLS, JSON, DWG, PDF).")}
                className="toolbar-btn text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-gray-600" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12V13.5C2 13.7761 2.22386 14 2.5 14H13.5C13.7761 14 14 13.7761 14 13.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Import</span>
              </button>

              {/* Share button */}
              <button
                onClick={() => alert("Share dialog: Copy workspace portal link or send secure email invite.")}
                className="toolbar-btn text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-gray-600" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5C13.1046 5 14 4.10457 14 3C14 1.89543 13.1046 1 12 1C10.8954 1 10 1.89543 10 3C10 3.11184 10.0092 3.22153 10.0268 3.32835L5.83067 5.42641C5.0747 4.55598 3.95156 4 2.7 4C1.20883 4 0 5.20883 0 6.7C0 8.19117 1.20883 9.4 2.7 9.4C3.95156 9.4 5.0747 8.84402 5.83067 7.97359L10.0268 10.0716C10.0092 10.1785 10 10.2882 10 10.4C10 11.5046 10.8954 12.4 12 12.4C13.1046 12.4 14 11.5046 14 10.4C14 9.29543 13.1046 8.4 12 8.4C10.8954 8.4 10 9.29543 10 10.4C10 10.4357 10.001 10.4711 10.003 10.5064L5.80682 8.40833C5.93297 8.11894 6 7.80164 6 7.47C6 7.13836 5.93297 6.82106 5.80682 6.53167L10.003 4.43359C10.001 4.46889 10 4.50428 10 4.54C10 5.10457 10.8954 5.54 12 5.54Z" fill="currentColor" />
                </svg>
                <span>Share</span>
              </button>

              {/* Delete button */}
              <button
                onClick={() => alert("Action restricted: Deletion of workspace core tables violates compliance rules.")}
                className="toolbar-btn toolbar-btn-danger text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#d13212]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L12 12M12 4L4 12" stroke="#d13212" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Delete</span>
              </button>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Exit Portal Link */}
              <button
                onClick={() => setInApp(false)}
                className="toolbar-btn text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 text-gray-400" />
                <span>Exit Workspace</span>
              </button>

            </div>

            {/* Dotted border separator */}
            <div className="border-b border-dashed border-[#cccccc] flex-shrink-0"></div>

            {/* Scrollable Viewport Pane — Master Page Shell Wrapper */}
            <div
              className="workspace-viewport flex-1 min-h-0 overflow-y-auto"
              style={{
                background: '#f2f3f3',
                border: 'none',
                boxShadow: 'none',
                padding: '20px',
                margin: '0',
              }}
            >
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
              {currentWorkspace === WORKSPACES.DEFECT_DETECTION && (
                <DefectDetection selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.SITE_INSPECTION && (
                <SiteInspection selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.CONSTRUCTION_MONITOR && (
                <ConstructionMonitor selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
              {currentWorkspace === WORKSPACES.COMPLIANCE_ENGINE && (
                <ComplianceEngine selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
              )}
            </div>
          </main>

          {/* Right Control Panel: Zoho-style contextual inspector */}
          {/* Right Control Panel: Zoho-style collapsible contextual inspector */}
          <aside
            style={{
              width: inspectorOpen ? 280 : 48,
              flexShrink: 0,
              background: '#ffffff',
              borderLeft: '1px solid #eaeded',
              display: 'flex',
              flexDirection: 'column',
              fontSize: 12,
              color: '#2d2d2d',
              overflow: 'hidden',
              transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'sticky',
              top: '64px',
              height: 'calc(100vh - 64px)',
              alignSelf: 'flex-start',
            }}
          >
            {inspectorOpen ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: 280 }}>
                {/* Inspector header */}
                <div style={{
                  padding: '12px 14px',
                  background: '#ffffff',
                  borderBottom: '1px solid #eaeded',
                  fontWeight: 600,
                  fontSize: 11.5,
                  color: '#3d3d3d',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>Contextual Inspector</span>
                  <button
                    onClick={() => setInspectorOpen(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 'bold',
                      color: '#888',
                      cursor: 'pointer',
                      padding: '0 4px',
                    }}
                    title="Collapse Panel"
                  >
                    ▶
                  </button>
                </div>

                <div style={{ padding: 14, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {selectedElement ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                      {/* Element identity card */}
                      <div style={{
                        padding: '10px 12px',
                        background: '#ffffff',
                        border: '1px solid #d5dbdb',
                        borderRadius: 4,
                        boxShadow: '0 1px 1px 0 rgba(0,28,36,0.15)',
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555555', marginBottom: 4 }}>Selected Element</div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: '#1a1a1a', wordBreak: 'break-all' }}>{selectedElement.type}</div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2, wordBreak: 'break-all' }}>{selectedElement.id}</div>
                      </div>

                      {/* Metrics table */}
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#545b64', marginBottom: 7, paddingBottom: 5, borderBottom: '1px solid #eaeded' }}>Diagnostics Metrics</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                          <tbody>
                            {Object.entries(selectedElement.metrics || {}).map(([key, value]) => (
                              <tr key={key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '6px 8px', fontWeight: 600, fontSize: 12, color: '#666', background: '#fafafa', width: '48%', borderRight: '1px solid #ebebeb' }}>
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
                        border: '1px solid #d5dbdb',
                        borderRadius: 4,
                        boxShadow: '0 1px 1px 0 rgba(0,28,36,0.15)',
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#555555', marginBottom: 6 }}>AI Diagnostic Analysis</div>
                        <p style={{ fontSize: 12, lineHeight: 1.55, color: '#3d3d3d', margin: 0 }}>
                          {selectedElement.type.includes('Node') && 'Stress concentrations detected under cyclic load triggers. Monitor displacement velocity channels continuously.'}
                          {selectedElement.type.includes('Member') && 'Corrosion profile suggests fatigue threshold margin at 78.4%. Standard validation lifecycle recommended.'}
                          {selectedElement.type.includes('Twin') && 'Anchor wireframe degradation factor simulated. Maintain continuous sensor feeds to optimize forecasting models.'}
                          {selectedElement.type.includes('Ultrasonic') && 'Acoustic signal path analysis verifies micro-delamination indices. Scheduled thermal validation is advised.'}
                          {selectedElement.type.includes('Vibration') && 'Vibration telemetry frequencies matched with structural eigenmodes. Zero structural divergence detected.'}
                          {selectedElement.type.includes('GIS') && 'Geospatial telemetry shows nominal site coordinates. Drainage and topographic vectors are stable.'}
                          {selectedElement.type.includes('Asset') && 'General structural assets tracking nominal lifecycle values. Next inspection recommended in 6 months.'}
                          {!['Node', 'Member', 'Twin', 'Ultrasonic', 'Vibration', 'GIS', 'Asset'].some(k => selectedElement.type.includes(k)) && 'Continuous monitoring active. Telemetrical values match active simulation constraints.'}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedElement(null)}
                        style={{
                          padding: '8px 0',
                          width: '100%',
                          background: '#ffffff',
                          border: '1px solid #545b64',
                          borderRadius: 4,
                          fontWeight: 700,
                          fontSize: 12,
                          color: '#545b64',
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
                        border: '1px solid #d5dbdb',
                        borderRadius: 4,
                        fontSize: 12,
                        color: '#545b64',
                        lineHeight: 1.5,
                        boxShadow: '0 1px 1px 0 rgba(0,28,36,0.15)',
                      }}>
                        Select any structural member, node, transducer, or digital twin asset in the active workspace to load contextual telemetric data here.
                      </div>

                      {/* Mini Activity Feed */}
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#545b64', marginBottom: 8, paddingBottom: 5, borderBottom: '1px solid #eaeded' }}>Active Project Events</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                          {activities.slice(0, 4).map((act) => (
                            <div key={act.id} style={{
                              padding: '8px 10px',
                              border: '1px solid #d5dbdb',
                              borderRadius: 4,
                              background: '#ffffff',
                              boxShadow: '0 1px 1px 0 rgba(0,28,36,0.15)',
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#555555', textTransform: 'uppercase' }}>{act.type}</span>
                                <span style={{ fontSize: 12, color: '#aaa' }}>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p style={{ fontSize: 12, color: '#3d3d3d', margin: 0, lineHeight: 1.4 }}>{act.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shortcuts */}
                      <div style={{
                        padding: '10px 12px',
                        background: '#ffffff',
                        border: '1px solid #d5dbdb',
                        borderRadius: 4,
                        boxShadow: '0 1px 1px 0 rgba(0,28,36,0.15)',
                        fontSize: 12,
                        color: '#545b64',
                        lineHeight: 1.8,
                      }}>
                        <div style={{ fontWeight: 700, color: '#333', marginBottom: 5, fontSize: 12 }}>Sys Shortcuts</div>
                        <div>Ctrl + K — AI Command Palette</div>
                        <div>Esc — Clear inspection</div>
                        <div>Sidebar — Workspace switch</div>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Collapsed Minimap-style Strip */
              <div
                onClick={() => setInspectorOpen(true)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: 12,
                  cursor: 'pointer',
                  background: '#f8f9fa',
                  transition: 'background 0.15s',
                  width: 48,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#eaeaea'}
                onMouseLeave={e => e.currentTarget.style.background = '#f8f9fa'}
                title="Expand Inspector"
              >
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 20 }}>
                  ◀
                </div>
                <div style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontWeight: 700,
                  fontSize: 12,
                  color: '#555',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  Contextual Inspector
                </div>
              </div>
            )}
          </aside>
        </AppShell>
      </>
    );
  }
