import React, { useState } from 'react';
import {
  Bell,
  ShieldCheck,
  Menu,
  HelpCircle,
  Activity,
  Cpu
} from 'lucide-react';
import { useCRMStore, ROLES, WORKSPACES } from '@/store/crmStore';

export default function Topbar({ sidebarOpen, setSidebarOpen, setHelpOpen }) {
  const currentRole = useCRMStore(state => state.currentRole);
  const setRole = useCRMStore(state => state.setRole);
  const searchQuery = useCRMStore(state => state.searchQuery);
  const setSearchQuery = useCRMStore(state => state.setSearchQuery);
  const toggleCommandPalette = useCRMStore(state => state.toggleCommandPalette);
  const tickets = useCRMStore(state => state.tickets);

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const openTickets = tickets.filter(t => t.status === 'OPEN');

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 z-50 px-4 flex items-center justify-between border-b border-[#232f3e] select-none"
      style={{
        background: '#16191f',
        boxShadow: 'none'
      }}
    >
      {/* Brand & Left Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 hover:bg-neutral-800 text-gray-300 hover:text-white rounded cursor-pointer topbar-btn border border-transparent"
          style={{ background: 'transparent', boxShadow: 'none' }}
        >
          <Menu className="h-4.5 w-4.5" />
        </button>
        <div className="flex items-center">
          {/* OUANTUM logo from public folder */}
          <img
            src="/ouantum-logo.png"
            alt="OUANTUM"
            style={{
              height: 48,
              width: 'auto',
              display: 'block',
              objectFit: 'contain',
              /* ── Logo transform controls ── */
              transform: 'scale(3.2) translateX(0px) translateY(1.5px)',
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>

      {/* Middle search console (Ctrl+K Command Palette Trigger) */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6 relative">
        <div className="w-full relative flex items-center">
          <input
            type="text"
            placeholder="Search dashboard command..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => toggleCommandPalette(true)}
            className="w-full h-9 pl-3 pr-16 border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-neutral-500 focus:bg-white focus:text-neutral-900 rounded"
          />
          <span className="absolute right-2 px-1.5 py-0.5 rounded border border-neutral-700 text-[9px] bg-neutral-950 text-neutral-400 select-none">Ctrl + K</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">

        {/* Dynamic Platform Help Guide Trigger Button */}
        <button
          onClick={() => setHelpOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-gray-300 hover:text-white cursor-pointer topbar-btn"
          style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
        >
          <HelpCircle className="h-4 w-4 text-gray-400" />
          <span>HELP GUIDE</span>
        </button>



        {/* Dynamic RBAC Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-700 rounded text-[12px] font-semibold bg-neutral-800 text-white hover:bg-neutral-700 cursor-pointer topbar-btn"
          >
            <ShieldCheck className="h-4 w-4 text-gray-400" />
            <span><span className="hidden sm:inline">Scope: </span>{currentRole}</span>
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1 w-48 rounded border border-neutral-800 bg-neutral-900 shadow-xl p-1 z-50 text-white">
              <p className="text-[10px] font-medium text-gray-400 px-2 py-1 border-b border-neutral-800 mb-1">Select Access Scope</p>
              {Object.values(ROLES).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setRole(role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left text-xs font-semibold p-2 rounded transition-colors ${currentRole === role
                    ? 'text-white bg-[#ec7211] hover:bg-[#dd5a12]'
                    : 'text-gray-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  style={{
                    background: currentRole === role ? '#ec7211' : 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    color: '#ffffff',
                    textShadow: 'none'
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Notification Indicator */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 hover:bg-neutral-800 text-gray-300 hover:text-white rounded cursor-pointer topbar-btn"
            style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
          >
            <Bell className="h-4.5 w-4.5 text-gray-300" />
            {openTickets.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#d13212] border border-neutral-900"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded border border-neutral-800 bg-neutral-900 shadow-xl p-3 z-50 text-white">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-2">
                <span className="text-[11px] text-gray-400 font-bold">ACTIVE ANOMALY ALARMS ({openTickets.length})</span>
                <span className="text-[9px] border border-[#d13212] px-1 py-0.25 rounded font-bold bg-[#38110b] text-[#ffd5cc] animate-pulse">LIVE</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {openTickets.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No active anomalies detected.</p>
                ) : (
                  openTickets.map((t) => (
                    <div key={t.id} className="p-2 border border-neutral-800 rounded bg-neutral-950/50 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#ffd5cc] text-[9.5px] uppercase">{t.severity}</span>
                        <span className="text-gray-400 text-[9.5px]">{t.assetName}</span>
                      </div>
                      <p className="font-semibold mt-1 text-gray-200">{t.title}</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">Confidence: {t.confidence}%</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Core AI Avatar Indicator */}
        <div
          className="relative flex h-8 w-8 items-center justify-center border border-neutral-700 rounded bg-neutral-800 text-white shadow-none overflow-hidden"
        >
          <span className="text-[11px] text-white font-bold z-10">AI</span>
          <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-[#1d8102] border border-neutral-900"></span>
        </div>
      </div>
    </header>
  );
}
