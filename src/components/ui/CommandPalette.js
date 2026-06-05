import React, { useEffect, useState, useRef } from 'react';
import { 
  Folder, 
  CornerDownLeft
} from 'lucide-react';
import {
  RetroSearchIcon,
  RetroXIcon,
  RetroActivityIcon,
  RetroZapIcon,
  RetroFileTextIcon,
  RetroCompassIcon,
  RetroTerminalIcon
} from './RetroIcons';
import { useCRMStore, WORKSPACES, ROLES } from '@/store/crmStore';


export default function CommandPalette() {
  const showCommandPalette = useCRMStore(state => state.showCommandPalette);
  const toggleCommandPalette = useCRMStore(state => state.toggleCommandPalette);
  const accounts = useCRMStore(state => state.accounts);
  const setWorkspace = useCRMStore(state => state.setWorkspace);
  const setRole = useCRMStore(state => state.setRole);

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Toggle with Ctrl+K key binding
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === 'Escape') {
        toggleCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  // Focus input when opened
  useEffect(() => {
    if (showCommandPalette && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCommandPalette]);

  if (!showCommandPalette) return null;

  // Exact capabilities from user prompt
  const engineeringCommands = [
    { label: 'Analyze Pillar B12', action: 'workspace', value: WORKSPACES.STRUCTURAL, icon: RetroActivityIcon },
    { label: 'Run crack propagation simulation', action: 'workspace', value: WORKSPACES.PREDICTIVE, icon: RetroZapIcon },
    { label: 'Generate structural report', action: 'workspace', value: WORKSPACES.REPORTING, icon: RetroFileTextIcon },
    { label: 'Show risk heatmap', action: 'workspace', value: WORKSPACES.TWIN, icon: RetroCompassIcon },
    { label: 'Predict corrosion failure', action: 'workspace', value: WORKSPACES.PREDICTIVE, icon: RetroTerminalIcon },
    { label: 'Open live sensors', action: 'workspace', value: WORKSPACES.SHM, icon: RetroActivityIcon },
    { label: 'Generate compliance audit', action: 'workspace', value: WORKSPACES.REPORTING, icon: RetroFileTextIcon },
    { label: 'Run seismic simulation', action: 'workspace', value: WORKSPACES.TWIN, icon: RetroZapIcon }
  ];

  const handleAction = (type, value) => {
    if (type === 'workspace') {
      setWorkspace(value);
    } else if (type === 'role') {
      setRole(value);
    }
    toggleCommandPalette(false);
    setQuery('');
  };

  // Filter commands and entities
  const filteredCommands = query === '' 
    ? engineeringCommands 
    : engineeringCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  const filteredAccounts = query === '' 
    ? accounts.slice(0, 2) 
    : accounts.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#00070d]/40 backdrop-blur-sm">
      <div 
        ref={containerRef}
        className="w-full max-w-2xl rounded-[8px] border border-[#cbd5e1] bg-[#ffffff] shadow-[0_4px_20px_0_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-[#16191f] font-sans"
      >
        {/* Search header bar */}
        <div className="flex items-center px-4 border-b border-[#cbd5e1] h-16 bg-gradient-to-b from-[#fbfbfb] to-[#ececec] flex-shrink-0">
          <div className="flex items-center flex-1 bg-white border border-[#cbd5e1] rounded-[6px] px-3 h-10 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-[#ea580c]/20 transition-all select-none">
            <RetroSearchIcon />
            <input
              ref={inputRef}
              type="search"
              placeholder="Search core command directives (e.g. 'Analyze Pillar B12')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="command-palette-input w-full h-full bg-transparent text-[13px] text-[#1f2937] placeholder-[#94a3b8] border-none outline-none focus:outline-none focus:ring-0 font-mono select-text"
              style={{ border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none', paddingLeft: '8px' }}
            />
          </div>
          <RetroXIcon 
            onClick={() => toggleCommandPalette(false)}
            className="ml-3 h-10 w-10 flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors hover:border-[#ea580c]"
          />
        </div>

        {/* List */}
        <div className="max-h-[26rem] overflow-y-auto p-5 space-y-5 text-[13px] font-sans">
          
          {/* Engineering Core Commands */}
          <div>
            <p className="text-[11px] text-[#64748b] uppercase tracking-wider mb-2.5 font-bold border-b border-[#eaeded] pb-1.5">Core Command Directives</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                return (
                  <button 
                    key={index}
                    onClick={() => handleAction(cmd.action, cmd.value)}
                    className="flex items-center justify-between p-2.5 rounded-[8px] border border-[#cbd5e1] bg-[#ffffff] hover:bg-[#fff7ed] hover:border-[#ea580c] text-left text-xs font-semibold text-[#1f2937] transition-all group min-w-0 cursor-pointer"
                  >
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      <Icon className="h-3.5 w-3.5 text-[#64748b] flex-shrink-0 group-hover:text-[#ea580c]" /> 
                      <span className="truncate group-hover:text-[#ea580c]">{cmd.label}</span>
                    </span>
                    <span className="text-[10px] border border-[#cbd5e1] bg-[#f8fafc] text-[#64748b] px-1.5 py-0.5 rounded-[4px] flex-shrink-0 ml-2 group-hover:border-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors font-bold">
                      EXEC
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CRM Account Entities */}
          {filteredAccounts.length > 0 && (
            <div>
              <p className="text-[11px] text-[#64748b] uppercase tracking-wider mb-2.5 font-bold border-b border-[#eaeded] pb-1.5">CRM Unified Asset Portfolios</p>
              <div className="space-y-1.5">
                {filteredAccounts.map((a) => (
                  <div 
                    key={a.id} 
                    onClick={() => handleAction('workspace', WORKSPACES.EXECUTIVE)}
                    className="flex items-center justify-between p-2.5 border border-[#cbd5e1] hover:border-[#ea580c] bg-[#f8fafc] hover:bg-[#fff7ed] rounded-[8px] cursor-pointer transition-all text-xs text-[#1f2937] group"
                  >
                    <span className="flex items-center gap-2 font-semibold text-[#1f2937] group-hover:text-[#ea580c]"><Folder className="h-3.5 w-3.5 text-[#64748b] flex-shrink-0 group-hover:text-[#ea580c]" /> <span className="truncate">{a.name}</span></span>
                    <span className="text-[11px] text-[#64748b] flex-shrink-0 ml-2 group-hover:text-[#ea580c]">{a.location}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between px-4 h-10 border-t border-[#eaeded] bg-[#f8fafc] font-sans text-[11px] text-[#64748b]">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><CornerDownLeft className="h-3.5 w-3.5 text-[#64748b]" /> Select Command</span>
            <span>Esc to cancel</span>
          </div>
          <span>Ouantum Unified Command Palette</span>
        </div>
      </div>
    </div>
  );
}
