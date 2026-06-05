'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useCRMStore, WORKSPACES, ROLES } from '@/store/crmStore';

// Sleek Huly-style vector logos & icons

const QuantumFuturisticLogo = () => (
  <img 
    src="/logo-white.png" 
    alt="Ouantum Logo" 
    className="object-contain rounded-md" 
    style={{
      width: '36px',
      height: '36px',
      display: 'block',
      transform: 'scale(1.4) translateX(0px) translateY(0px)',
      transformOrigin: 'center center'
    }}
  />
);

const MenuToggleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SearchProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M4 18a5 5 0 0110 0" />
    <circle cx="16.5" cy="14.5" r="2.5" />
    <path d="M18.5 16.5l2 2" />
  </svg>
);

const ChecklistIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const HelpIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ── Explorer Item Icons — Vintage Windows 95/98 style ──────────────────────
// Classic 16-color palette: navy #000080, forest green #008000, maroon #800000
// teal #008080, olive #808000. Small bevel + inner highlight for retro depth.

const DashboardIcon = () => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 16, height: 16, borderRadius: 2, flexShrink: 0,
    background: '#000080',
    border: '1px solid #000040',
    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.35), 1px 1px 0 #00003a',
  }}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <rect x="1"   y="1"   width="3" height="3" fill="#ffffff" opacity="0.95"/>
      <rect x="5.5" y="1"   width="3" height="3" fill="#ffffff" opacity="0.55"/>
      <rect x="1"   y="5.5" width="3" height="3" fill="#ffffff" opacity="0.55"/>
      <rect x="5.5" y="5.5" width="3" height="3" fill="#ffffff" opacity="0.95"/>
    </svg>
  </span>
);

const TableIcon = () => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 16, height: 16, borderRadius: 2, flexShrink: 0,
    background: '#008000',
    border: '1px solid #004000',
    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.35), 1px 1px 0 #002800',
  }}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <rect x="1" y="1"   width="8" height="2"   fill="#ffffff" opacity="0.95"/>
      <rect x="1" y="4"   width="8" height="1.5" fill="#ffffff" opacity="0.50"/>
      <rect x="1" y="6.5" width="8" height="1.5" fill="#ffffff" opacity="0.50"/>
      <line x1="1" y1="3.2" x2="9" y2="3.2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
    </svg>
  </span>
);

const ChartIcon = () => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 16, height: 16, borderRadius: 2, flexShrink: 0,
    background: '#800000',
    border: '1px solid #400000',
    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.35), 1px 1px 0 #2a0000',
  }}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <rect x="1"   y="6"   width="2"   height="3" fill="#ffffff" opacity="0.95"/>
      <rect x="4"   y="3.5" width="2"   height="5.5" fill="#ffffff" opacity="0.95"/>
      <rect x="7"   y="1"   width="2"   height="8" fill="#ffffff" opacity="0.95"/>
      <line x1="1" y1="9.2" x2="9" y2="9.2" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
    </svg>
  </span>
);

// ── Vintage folder icons — classic Windows 95 yellow folder ─────────────────
const FolderOpenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 4h4l1.5-1.5H13v1H2L1 12V4z" fill="#c0a030" stroke="#806800" strokeWidth="0.5"/>
    <path d="M2 5h11l-1.5 7H1L2 5z" fill="#ffd040" stroke="#c09000" strokeWidth="0.5"/>
    <path d="M2 5h11" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
  </svg>
);

const FolderClosedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="5" width="12" height="7" rx="1" fill="#ffd040" stroke="#c09000" strokeWidth="0.5"/>
    <path d="M1 5h5l1-1.5h6V5" fill="#c0a030" stroke="#806800" strokeWidth="0.5"/>
    <line x1="1" y1="6" x2="13" y2="6" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
  </svg>
);

// ── Vintage chevron — pixel-art triangle arrow ───────────────────────────────
const ChevronDownIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 3.5l3 3 3-3" stroke="#888888" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
  </svg>
);


export function Sidebar({ isOpen, setIsOpen, setHelpOpen, onExit }) {
  const currentWorkspace = useCRMStore(state => state.currentWorkspace);
  const setWorkspace = useCRMStore(state => state.setWorkspace);
  const currentRole = useCRMStore(state => state.currentRole);
  const setRole = useCRMStore(state => state.setRole);
  const tickets = useCRMStore(state => state.tickets);
  const resolveTicket = useCRMStore(state => state.resolveTicket);
  const toggleCommandPalette = useCRMStore(state => state.toggleCommandPalette);

  const [searchFilter, setSearchFilter] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const avatarRef = useRef(null);

  const openTickets = tickets.filter(t => t.status === 'OPEN');

  const [collapsedFolders, setCollapsedFolders] = useState({
    tablesAndReports: false,
    engineeringLabs: false,
    monitoringIoT: false,
    systemsSettings: false,
  });

  // Handle click outside popovers
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFolder = (folderKey) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }));
  };

  const folders = [
    {
      key: 'tablesAndReports',
      label: 'Tables & Reports',
      items: [
        { label: 'Executive Overview', type: 'dashboard', workspace: WORKSPACES.EXECUTIVE },
        { label: 'Civil & Infrastructure OS', type: 'table', workspace: WORKSPACES.CIVIL_OS },
        { label: 'Project Lifecycle Intel', type: 'table', workspace: WORKSPACES.PROJECT_INTEL },
        { label: 'Reporting & Intel Studio', type: 'chart', workspace: WORKSPACES.REPORTING }
      ]
    },
    {
      key: 'engineeringLabs',
      label: 'Engineering Lab Analytics',
      items: [
        { label: 'Materials Intelligence Lab', type: 'table', workspace: WORKSPACES.MATERIALS },
        { label: 'Structural Safety & Stability', type: 'table', workspace: WORKSPACES.STRUCTURAL_SAFETY },
        { label: 'Structural Analysis Studio', type: 'chart', workspace: WORKSPACES.STRUCTURAL },
        { label: 'NDT Intelligence Lab', type: 'chart', workspace: WORKSPACES.NDT },
        { label: 'AI Defect Detection', type: 'chart', workspace: WORKSPACES.DEFECT_DETECTION },
      ]
    },
    {
      key: 'monitoringIoT',
      label: 'Live Monitoring & IoT',
      items: [
        { label: 'SHM Monitoring Center', type: 'chart', workspace: WORKSPACES.SHM },
        { label: 'Digital Twin Engine', type: 'dashboard', workspace: WORKSPACES.TWIN },
        { label: 'AI Structural Validation', type: 'dashboard', workspace: WORKSPACES.VALIDATION },
        { label: 'Infrastructure GIS Engine', type: 'table', workspace: WORKSPACES.GIS },
        { label: 'Emergency Response System', type: 'dashboard', workspace: WORKSPACES.EMERGENCY },
        { label: 'Digital Site Inspection', type: 'table', workspace: WORKSPACES.SITE_INSPECTION },
        { label: 'Construction Monitoring', type: 'chart', workspace: WORKSPACES.CONSTRUCTION_MONITOR },
      ]
    },
    {
      key: 'systemsSettings',
      label: 'Systems & Settings',
      items: [
        { label: 'Audit Intelligence Engine', type: 'table', workspace: WORKSPACES.AUDIT },
        { label: 'Predictive AI Engine', type: 'chart', workspace: WORKSPACES.PREDICTIVE },
        { label: 'Standards & Compliance Engine', type: 'table', workspace: WORKSPACES.COMPLIANCE_ENGINE },
      ]
    }
  ];

  const getWorkspaceIcon = (type) => {
    switch (type) {
      case 'dashboard':
        return <DashboardIcon />;
      case 'chart':
        return <ChartIcon />;
      case 'table':
      default:
        return <TableIcon />;
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen z-50 flex select-none overflow-hidden font-sans">
      
      {/* 1. LEFT NARROW DOCK — HULY TYPE (64px) */}
      <aside className="w-16 h-full bg-[#0b0c0e] border-r border-[#1c1e22] flex flex-col items-center py-4 flex-shrink-0 z-20">
        
        {/* Brand Logo */}
        <div className="mb-6 cursor-pointer" onClick={() => setWorkspace(WORKSPACES.EXECUTIVE)}>
          <QuantumFuturisticLogo />
        </div>

        {/* Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all duration-150 ${
            isOpen ? 'bg-[#22242a] text-white' : 'bg-transparent text-[#8f9298] hover:bg-[#1a1c20] hover:text-white'
          }`}
          title={isOpen ? "Collapse Explorer" : "Expand Explorer"}
        >
          <MenuToggleIcon />
        </button>

        {/* Notifications Button */}
        <div className="relative mt-2" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all duration-150 ${
              showNotifications ? 'bg-[#22242a] text-white' : 'bg-transparent text-[#8f9298] hover:bg-[#1a1c20] hover:text-white'
            }`}
            title="Notifications"
          >
            <BellIcon />
            {openTickets.length > 0 && (
              <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-[#d32f2f] border-2 border-[#0b0c0e]"></span>
            )}
          </button>

          {/* Floaty Notifications Panel */}
          {showNotifications && (
            <div className="absolute left-14 top-0 w-80 rounded-xl border border-[#2a2d34] bg-[#141517] shadow-2xl p-4 z-50 text-white animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#2a2d34] pb-2 mb-3">
                <span className="text-[12px] text-[#8f9298] font-bold tracking-wider uppercase">Active Alarms ({openTickets.length})</span>
                <span className="text-[11px] border border-[#d32f2f] px-2 py-0.5 rounded-full font-bold bg-[#3a1d1d] text-[#ff6b6b] animate-pulse">LIVE</span>
              </div>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {openTickets.length === 0 ? (
                  <p className="text-[12px] text-[#8f9298] text-center py-6">No active anomalies detected.</p>
                ) : (
                  openTickets.map((t) => (
                    <div key={t.id} className="p-2.5 border border-[#2a2d34] rounded-lg bg-[#1a1c20] text-[12px]">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-[#ff6b6b] uppercase text-[11px] font-bold tracking-wider">{t.severity}</span>
                        <span className="text-[#8f9298] font-mono text-[11px]">{t.assetName}</span>
                      </div>
                      <p className="font-medium mt-1 text-white">{t.title}</p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#2a2d34]">
                        <span className="text-[11px] text-[#8f9298] font-mono">Confidence: {t.confidence}%</span>
                        <button 
                          onClick={() => resolveTicket(t.id)}
                          className="px-2 py-1 bg-[#1d8102] hover:bg-[#1a7002] text-white rounded text-[11px] font-bold border-none cursor-pointer transition-colors"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chat / AI button */}
        <button 
          onClick={() => toggleCommandPalette(true)}
          className="w-10 h-10 rounded-lg flex items-center justify-center border-none bg-transparent text-[#8f9298] hover:bg-[#1a1c20] hover:text-white cursor-pointer mt-2 transition-all duration-150"
          title="Command Palette & AI Chat (⌘K)"
        >
          <ChatIcon />
        </button>

        {/* Separator */}
        <div className="w-8 h-[1px] bg-[#1c1e22] my-3"></div>

        {/* Search Contacts icon */}
        <button 
          onClick={() => toggleCommandPalette(true)}
          className="w-10 h-10 rounded-lg flex items-center justify-center border-none bg-transparent text-[#8f9298] hover:bg-[#1a1c20] hover:text-white cursor-pointer transition-all duration-150"
          title="Search Entities & Profiles"
        >
          <SearchProfileIcon />
        </button>

        {/* Checklist / Tasks button */}
        <button 
          onClick={() => setWorkspace(WORKSPACES.PROJECT_INTEL)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all duration-150 ${
            currentWorkspace === WORKSPACES.PROJECT_INTEL ? 'bg-[#22242a] text-white' : 'bg-transparent text-[#8f9298] hover:bg-[#1a1c20] hover:text-white'
          }`}
          title="Project Events & Tasks"
        >
          <ChecklistIcon />
        </button>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Divider */}
        <div className="w-8 h-[1px] bg-[#1c1e22] my-3"></div>

        {/* Settings button */}
        <button 
          onClick={() => setWorkspace(WORKSPACES.COMPLIANCE_ENGINE)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all duration-150 ${
            currentWorkspace === WORKSPACES.COMPLIANCE_ENGINE ? 'bg-[#22242a] text-white' : 'bg-transparent text-[#8f9298] hover:bg-[#1a1c20] hover:text-white'
          }`}
          title="Standards & Compliance Settings"
        >
          <SettingsIcon />
        </button>

        {/* Help button */}
        <button 
          onClick={() => setHelpOpen(true)}
          className="w-10 h-10 rounded-lg flex items-center justify-center border-none bg-transparent text-[#8f9298] hover:bg-[#1a1c20] hover:text-white cursor-pointer mt-2 transition-all duration-150"
          title="Platform Help Guide"
        >
          <HelpIcon />
        </button>

        {/* Exit Workspace Button */}
        {onExit && (
          <button 
            onClick={onExit}
            className="w-10 h-10 rounded-lg flex items-center justify-center border-none bg-transparent text-[#8f9298] hover:bg-[#1a1c20] hover:text-[#d32f2f] cursor-pointer mt-2 transition-all duration-150"
            title="Exit Workspace"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}

        {/* User profile avatar with Active Status ring */}
        <div className="relative mt-2" ref={avatarRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4a90e2] to-[#357abd] flex items-center justify-center text-[12px] font-bold text-white border-none cursor-pointer shadow-md select-none relative group"
            title="Scope & Role Settings"
          >
            AG
            {/* Status dot in black ring */}
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#0b0c0e] flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-[#1d8102]"></span>
            </span>
          </button>

          {/* Floaty Role Selector Popover */}
          {showProfileMenu && (
            <div className="absolute left-14 bottom-0 w-52 rounded-xl border border-[#2a2d34] bg-[#141517] shadow-2xl p-2 z-50 text-white animate-fadeIn">
              <div className="px-2.5 py-1.5 border-b border-[#2a2d34] mb-1">
                <p className="text-[12px] font-semibold text-white">Dr. Rajesh Mehta</p>
                <p className="text-[11px] text-[#8f9298] mt-0.5">Role Governance</p>
              </div>
              <p className="text-[11px] font-bold text-[#8f9298] uppercase tracking-wider px-2.5 py-1 mt-1">Select Access Scope</p>
              <div className="space-y-0.5">
                {Object.values(ROLES).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setRole(role);
                      setShowProfileMenu(false);
                    }}
                    className={`w-full text-left text-[12px] font-semibold py-2 px-2.5 rounded-lg border-none bg-transparent cursor-pointer transition-colors ${
                      currentRole === role
                        ? 'text-white bg-[#0073e6] font-bold'
                        : 'text-[#8f9298] hover:bg-[#1a1c20] hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </aside>

      {/* 2. EXPLORER DRAWER (240px) */}
      <aside 
        className={`h-full bg-[#111214] border-r border-[#1c1e22] flex flex-col z-10 transition-all duration-200 overflow-hidden ${
          isOpen ? 'w-[240px] shadow-[10px_0_30px_rgba(0,0,0,0.35)]' : 'w-0'
        }`}
      >
        {/* Explorer Header */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-[#1c1e22] flex-shrink-0">
          <span className="text-[11px] font-bold text-[#8f9298] tracking-widest uppercase">Explorer</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-[#1c1e22] rounded text-[#8f9298] hover:text-white transition-colors border-none bg-transparent flex items-center justify-center cursor-pointer"
            title="Collapse Sidebar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Search & Refresh */}
        <div className="p-3 border-b border-[#1c1e22] bg-[#111214] space-y-2 flex-shrink-0">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full h-8 pl-3 pr-8 bg-[#191a1d] border border-[#2a2d34] text-white text-[12px] focus:outline-none focus:border-[#4a90e2] rounded-lg placeholder-[#5f6368]"
            />
            <span className="absolute right-2.5 text-[#5f6368]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          <div className="flex justify-between items-center text-[12px] text-[#8f9298] px-1">
            <span>Filter: Active</span>
            <button 
              onClick={() => setSearchFilter('')} 
              className="text-[#4a90e2] hover:text-[#357abd] hover:underline border-none bg-transparent text-[11px] cursor-pointer font-semibold"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Folders navigation tree */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-3 bg-[#111214] custom-scrollbar">
          {folders.map((folder) => {
            const collapsed = collapsedFolders[folder.key];
            const filteredItems = folder.items.filter(item => 
              item.label.toLowerCase().includes(searchFilter.toLowerCase())
            );

            if (searchFilter && filteredItems.length === 0) return null;

            return (
              <div key={folder.key} className="space-y-1">
                {/* Folder Header */}
                <div 
                  onClick={() => toggleFolder(folder.key)}
                  className="group flex items-center gap-2 py-1.5 px-2 hover:bg-[#1a1c20] rounded-lg transition-colors select-none cursor-pointer text-[11px] font-bold text-[#8f9298] uppercase tracking-wider"
                >
                  <span className={`transform transition-transform duration-150 ${collapsed ? '-rotate-90' : 'rotate-0'}`}>
                    <ChevronDownIcon />
                  </span>
                  <span className="mr-1.5">
                    {collapsed ? <FolderClosedIcon /> : <FolderOpenIcon />}
                  </span>
                  <span className="truncate">{folder.label}</span>
                </div>

                {/* Folder Items */}
                {!collapsed && (
                  <div className="pl-4 space-y-0.5 mt-0.5">
                    {filteredItems.map((item, idx) => {
                      const isActive = currentWorkspace === item.workspace;
                      return (
                        <button
                          key={`${item.label}-${idx}`}
                          onClick={() => setWorkspace(item.workspace)}
                          className={`group flex items-center justify-between py-1.5 px-2.5 text-[12px] font-normal transition-all rounded-lg select-none cursor-pointer w-full text-left border-none relative ${
                            isActive 
                              ? 'bg-[#1c1e22] text-white font-semibold' 
                              : 'text-[#8f9298] hover:bg-[#161719] hover:text-white'
                          }`}
                        >
                          {/* Selected marker blue line */}
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded bg-[#3b82f6]"></span>
                          )}
                          <div className="flex items-center gap-2 truncate">
                            <span>{getWorkspaceIcon(item.type)}</span>
                            <span className="truncate">{item.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

      </aside>

    </div>
  );
}
