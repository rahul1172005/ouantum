'use client';
import React, { useState } from 'react';
import { Search, Bell, ShieldCheck, HelpCircle, Menu, ChevronDown } from 'lucide-react';
import { useCRMStore, ROLES } from '@/store/crmStore';

export function Header({ sidebarOpen, setSidebarOpen, setHelpOpen }) {
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
    <header className="fixed top-0 left-0 right-0 h-16 z-50 px-4 bg-white border-b border-border-default flex items-center justify-between select-none">
      
      {/* Brand & Left controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 hover:bg-surface-hover text-text-secondary hover:text-text-primary rounded cursor-pointer border-none bg-transparent flex items-center justify-center"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center">
          <img
            src="/ouantum-logo.png"
            alt="OUANTUM"
            style={{
              height: 48,
              width: 'auto',
              display: 'block',
              objectFit: 'contain',
              transform: 'scale(3.2) translateX(0px) translateY(1.5px)',
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>

      {/* Middle search console (Ctrl+K Command Palette Trigger) */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6 relative">
        <div className="w-full relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search dashboard command... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => toggleCommandPalette(true)}
            className="w-full h-[34px] pl-9 pr-16 border border-border-input bg-surface-input text-text-primary placeholder:text-text-muted text-xs focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 rounded"
          />
          <span className="absolute right-2 px-1.5 py-0.5 rounded border border-border-default text-[12px] bg-surface-footer text-text-muted select-none">Ctrl + K</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Dynamic Help Guide Trigger */}
        <button
          onClick={() => setHelpOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-text-secondary hover:text-text-primary cursor-pointer border-none bg-transparent"
        >
          <HelpCircle className="h-4 w-4 text-text-secondary" />
          <span>HELP GUIDE</span>
        </button>

        {/* Dynamic RBAC Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-3 h-[34px] border border-border-input rounded text-[12px] font-semibold bg-surface-footer text-text-primary hover:bg-surface-hover cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-text-secondary" />
            <span>Scope: {currentRole}</span>
            <ChevronDown className="h-3 w-3 text-text-muted" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1 w-48 rounded border border-border-default bg-surface-body shadow-lg p-1 z-50">
              <p className="text-[12px] font-medium text-text-muted px-2 py-1 border-b border-border-default mb-1">Select Access Scope</p>
              {Object.values(ROLES).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setRole(role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left text-xs font-semibold p-2 rounded transition-colors border-none bg-transparent cursor-pointer ${
                    currentRole === role
                      ? 'text-white bg-btn-primary hover:bg-btn-primary-hv'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`}
                  style={{
                    background: currentRole === role ? '#0073e6' : 'transparent',
                    color: currentRole === role ? '#ffffff' : 'inherit'
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
            className="relative p-2 hover:bg-surface-hover text-text-secondary hover:text-text-primary rounded cursor-pointer border-none bg-transparent flex items-center justify-center"
          >
            <Bell className="h-5 w-5 text-text-secondary" />
            {openTickets.length > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-btn-danger border border-surface-body"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded border border-border-default bg-surface-body shadow-lg p-3 z-50 text-text-primary">
              <div className="flex items-center justify-between border-b border-border-default pb-1.5 mb-2">
                <span className="text-[12px] text-text-secondary font-bold">ACTIVE ANOMALY ALARMS ({openTickets.length})</span>
                <span className="text-[12px] border border-border-error px-1 py-0.25 rounded font-bold bg-state-error text-text-danger animate-pulse">LIVE</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {openTickets.length === 0 ? (
                  <p className="text-xs text-text-muted text-center py-4">No active anomalies detected.</p>
                ) : (
                  openTickets.map((t) => (
                    <div key={t.id} className="p-2 border border-border-default rounded bg-surface-footer text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-text-danger text-[12px] uppercase">{t.severity}</span>
                        <span className="text-text-secondary text-[12px]">{t.assetName}</span>
                      </div>
                      <p className="font-semibold mt-1 text-text-primary">{t.title}</p>
                      <p className="text-[12px] text-text-muted mt-0.5">Confidence: {t.confidence}%</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User initials box */}
        <div className="relative flex h-8 w-8 items-center justify-center border border-border-default rounded bg-btn-primary text-white shadow-none overflow-hidden select-none">
          <span className="text-[12px] text-white font-bold">AI</span>
          <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-border-success border border-white"></span>
        </div>

      </div>
    </header>
  );
}
