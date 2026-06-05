'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
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
  const [helpOpen, setHelpOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [contentHeight, setContentHeight] = useState(0);
  const mainRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track real rendered height of main content so we can cancel the dead space
  // that transform:scale() leaves in the layout box (layout box stays full size,
  // only the visual rendering shrinks). Formula: deadSpace = height * (1 - scale)
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mainRef.current]);

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
  const availableWidth = windowWidth - (sidebarOpen ? 304 : 64) - (inspectorOpen ? 280 : 48) - 32;
  const baseWidth = windowWidth - 144;
  const scaleFactor = Math.max(0.3, Math.min(1.0, availableWidth / baseWidth));

  return (
    <>
      <CommandPalette />
      <HelpGuide isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      
      <AppShell
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setHelpOpen={setHelpOpen}
        onExit={() => setInApp(false)}
      >
        {/* Main viewport container - scrollable at parent level */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar my-4 ml-4 relative flex flex-col min-w-0 min-h-0 h-[calc(100vh-32px)]"
          style={{
            width: `${availableWidth}px`,
            transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Scaling wrapper: transform:scale keeps layout box at original dims so
               the parent overflow-y-auto can measure full scroll height correctly.
               Negative marginBottom + marginRight collapse the dead layout space
               on both axes when scaleFactor < 1 (sidebar minimized / window narrow) */}
          <div
            style={{
              width: `${baseWidth}px`,
              transform: `scale(${scaleFactor})`,
              transformOrigin: 'top left',
              // Vertical dead space: contentHeight * (1 - scaleFactor)
              marginBottom: contentHeight > 0 ? `${contentHeight * (scaleFactor - 1)}px` : 0,
              // Horizontal dead space: baseWidth * (1 - scaleFactor)
              marginRight: `${baseWidth * (scaleFactor - 1)}px`,
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0,
            }}
          >
          {/* Main workspace display area */}
          <main
            ref={mainRef}
            className="flex flex-col min-w-0"
            style={{
              width: `${baseWidth}px`,
              height: 'auto',
              background: '#ffffff',
              border: '1px solid #d4d4d4',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
            }}
          >
            {/* Viewport Pane — Master Page Shell Wrapper */}
            <div
              className="workspace-viewport"
              style={{
                background: '#f0f0f0',
                border: 'none',
                boxShadow: 'none',
                padding: '24px',
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
          </div>
        </div>

          {/* Right Control Panel: Huly-style collapsible contextual inspector */}
          <aside
            className="custom-scrollbar contextual-inspector"
            style={{
              width: inspectorOpen ? 280 : 48,
              flexShrink: 0,
              background: '#111214',
              borderLeft: '1px solid #1c1e22',
              display: 'flex',
              flexDirection: 'column',
              fontSize: 12,
              color: '#ffffff',
              overflow: 'hidden',
              transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'sticky',
              top: '0px',
              height: '100vh',
              alignSelf: 'flex-start',
            }}
          >
            {inspectorOpen ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: 280 }}>
                {/* Inspector header */}
                <div style={{
                  padding: '16px 14px',
                  background: '#111214',
                  borderBottom: '1px solid #1c1e22',
                  fontWeight: 600,
                  fontSize: 11.5,
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', fontSize: '11px', color: '#8f9298' }}>Contextual Inspector</span>
                  <button
                    onClick={() => setInspectorOpen(false)}
                    className="icon-btn inspector-collapse-btn"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 'bold',
                      color: '#8f9298',
                      cursor: 'pointer',
                      padding: '0 4px',
                    }}
                    title="Collapse Panel"
                    onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8f9298'}
                  >
                    ▶
                  </button>
                </div>

                <div className="custom-scrollbar" style={{ padding: 14, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {selectedElement ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                      {/* Element identity card */}
                      <div style={{
                        padding: '12px',
                        background: '#1a1c20',
                        border: '1px solid #2a2d34',
                        borderRadius: 8,
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8f9298', marginBottom: 6 }}>Selected Element</div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#ffffff', wordBreak: 'break-all' }}>{selectedElement.type}</div>
                        <div style={{ fontSize: 11, color: '#8f9298', marginTop: 4, fontFamily: 'monospace', wordBreak: 'break-all' }}>{selectedElement.id}</div>
                      </div>

                      {/* Metrics table */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#8f9298', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #1c1e22' }}>Diagnostics Metrics</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                          <tbody>
                            {Object.entries(selectedElement.metrics || {}).map(([key, value]) => (
                              <tr key={key} style={{ borderBottom: '1px solid #1c1e22' }}>
                                <td style={{ padding: '8px', fontWeight: 600, fontSize: 11, color: '#8f9298', background: '#141517', width: '48%', borderRight: '1px solid #1c1e22' }}>
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </td>
                                <td style={{ padding: '8px', color: '#ffffff', fontWeight: 600, fontFamily: typeof value === 'number' || !isNaN(Number(value)) || value.toString().includes('%') || value.toString().includes('Hz') ? 'monospace' : 'inherit' }}>{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* AI analysis */}
                      <div style={{
                        padding: '12px',
                        background: '#1a1c20',
                        border: '1px solid #2a2d34',
                        borderRadius: 8,
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8f9298', marginBottom: 8 }}>AI Diagnostic Analysis</div>
                        <p style={{ fontSize: 12, lineHeight: 1.6, color: '#e2e8f0', margin: 0 }}>
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
                        className="inspector-clear-btn"
                        style={{
                          padding: '10px 0',
                          width: '100%',
                          background: '#1a1c20',
                          border: '1px solid #2a2d34',
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: 12,
                          color: '#ffffff',
                          cursor: 'pointer',
                          transition: 'background 0.15s, border-color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#22242a'; e.currentTarget.style.borderColor = '#4a90e2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#1a1c20'; e.currentTarget.style.borderColor = '#2a2d34'; }}
                      >
                        Clear Selection (Esc)
                      </button>

                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                      <div style={{
                        padding: '12px',
                        background: '#1a1c20',
                        border: '1px solid #2a2d34',
                        borderRadius: 8,
                        fontSize: 12,
                        color: '#8f9298',
                        lineHeight: 1.6,
                      }}>
                        Select any structural member, node, transducer, or digital twin asset in the active workspace to load contextual telemetric data here.
                      </div>

                      {/* Mini Activity Feed */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#8f9298', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #1c1e22' }}>Active Project Events</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {activities.slice(0, 4).map((act) => (
                            <div key={act.id} style={{
                              padding: '10px',
                              border: '1px solid #2a2d34',
                              borderRadius: 8,
                              background: '#1a1c20',
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: act.critical ? '#ff6b6b' : '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{act.type}</span>
                                <span style={{ fontSize: 11, color: '#8f9298', fontFamily: 'monospace' }}>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p style={{ fontSize: 12, color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>{act.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shortcuts */}
                      <div style={{
                        padding: '12px',
                        background: '#1a1c20',
                        border: '1px solid #2a2d34',
                        borderRadius: 8,
                        fontSize: 12,
                        color: '#8f9298',
                        lineHeight: 1.8,
                      }}>
                        <div style={{ fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontSize: 11 }}>Sys Shortcuts</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>AI Palette:</span>
                          <span style={{ fontFamily: 'monospace', color: '#ffffff' }}>Ctrl + K</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Clear Selection:</span>
                          <span style={{ fontFamily: 'monospace', color: '#ffffff' }}>Esc</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Workspace Switch:</span>
                          <span style={{ fontFamily: 'monospace', color: '#ffffff' }}>Sidebar</span>
                        </div>
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
                  paddingTop: 16,
                  cursor: 'pointer',
                  background: '#111214',
                  transition: 'background 0.15s',
                  width: 48,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a1c20'}
                onMouseLeave={e => e.currentTarget.style.background = '#111214'}
                title="Expand Inspector"
              >
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#8f9298', marginBottom: 24 }}>
                  ◀
                </div>
                <div style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontWeight: 700,
                  fontSize: 11,
                  color: '#8f9298',
                  letterSpacing: '0.15em',
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
