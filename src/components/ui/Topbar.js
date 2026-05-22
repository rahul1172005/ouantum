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

export default function Topbar({ sidebarOpen, setSidebarOpen }) {
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
      className="fixed top-0 left-0 right-0 h-16 z-50 px-4 flex items-center justify-between border-b border-[#cccccc] select-none"
      style={{
        background: 'linear-gradient(to bottom, #fdfdfd 0%, #eaeaea 100%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      {/* Brand & Left Controls */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 border border-[#b5b5b5] hover:bg-gray-100 rounded bg-white text-gray-700 topbar-btn shadow-[0_1px_1px_rgba(0,0,0,0.05)] cursor-pointer"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>
        <div className="flex items-center gap-2">
          {/* Web 2.0 styled logo symbol */}
          <div 
            className="flex h-8 w-8 items-center justify-center border border-[#9c9c9c] rounded bg-gradient-to-br from-[#4A90E2] to-[#0033cc] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
          >
            <span className="font-bold text-sm text-shadow">Ω</span>
          </div>
          <div>
            <h1 className="text-[13px] font-bold text-gray-800 tracking-wide flex items-center gap-1.5">
              Ouantum
              <span className="text-[9px] px-1 py-0.25 rounded border border-[#0033cc] font-medium bg-[#ebf3fb] text-[#0033cc]">v1.5</span>
            </h1>
            <p className="text-[9px] text-gray-500 font-medium tracking-wide">Infrastructure Intelligence OS</p>
          </div>
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
            className="w-full h-7 pl-3 pr-16 border border-[#b5b5b5] bg-white text-gray-800 placeholder-gray-400 text-xs focus:outline-none focus:border-[#0033cc] rounded shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
          />
          <span className="absolute right-2 px-1.5 py-0.5 rounded border border-[#cccccc] text-[9px] bg-gray-50 text-gray-500 select-none">Ctrl + K</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        


        {/* Dynamic RBAC Role Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#b5b5b5] rounded text-[11px] font-bold bg-gradient-to-b from-white to-[#f0f0f0] text-gray-700 hover:from-white hover:to-[#e6e6e6] shadow-[0_1px_1px_rgba(0,0,0,0.05)] cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-gray-500" />
            <span>Scope: {currentRole}</span>
          </button>
          
          {showRoleDropdown && (
            <div className="absolute right-0 mt-1 w-48 rounded border border-[#cccccc] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.15)] p-1 z-50">
              <p className="text-[10px] font-medium text-gray-400 px-2 py-1 border-b border-gray-100 mb-1">Select Access Scope</p>
              {Object.values(ROLES).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setRole(role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left text-xs font-semibold p-2 rounded transition-colors ${
                    currentRole === role 
                      ? 'text-white bg-[#0033cc] hover:bg-[#0022aa]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{
                    background: currentRole === role ? '#0033cc' : 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    color: currentRole === role ? '#ffffff' : '#333333',
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
            className="relative p-1.5 border border-[#b5b5b5] rounded bg-gradient-to-b from-white to-[#f0f0f0] text-gray-700 hover:from-white hover:to-[#e6e6e6] shadow-[0_1px_1px_rgba(0,0,0,0.05)] cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5 text-gray-600" />
            {openTickets.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#cc0000] border border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded border border-[#cccccc] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] p-3 z-50 text-gray-800">
              <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-2">
                <span className="text-[11px] text-gray-500 font-bold">ACTIVE ANOMALY ALARMS ({openTickets.length})</span>
                <span className="text-[9px] border border-[#cc0000] px-1 py-0.25 rounded font-bold bg-[#fff0f0] text-[#cc0000] animate-pulse">LIVE</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {openTickets.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No active anomalies detected.</p>
                ) : (
                  openTickets.map((t) => (
                    <div key={t.id} className="p-2 border border-[#e0e0e0] rounded bg-[#fafafa] text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#cc0000] text-[9.5px] uppercase">{t.severity}</span>
                        <span className="text-gray-500 text-[9.5px]">{t.assetName}</span>
                      </div>
                      <p className="font-semibold mt-1 text-gray-800">{t.title}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Confidence: {t.confidence}%</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Core AI Avatar Indicator */}
        <div 
          className="relative flex h-8 w-8 items-center justify-center border border-[#9c9c9c] rounded bg-gradient-to-b from-[#f9f9f9] to-[#dfdfdf] shadow-[0_1px_1px_rgba(0,0,0,0.05)] overflow-hidden"
          style={{ textShadow: '0 1px 0 #ffffff' }}
        >
          <span className="text-[11px] text-[#333333] font-bold z-10">AI</span>
          <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-[#336600] border border-white"></span>
        </div>
      </div>
    </header>
  );
}
