import React, { useEffect, useState, useRef } from 'react';
import { 
  Search, 
  Terminal, 
  Folder, 
  User, 
  Ticket, 
  CornerDownLeft, 
  X,
  Compass,
  Zap,
  Activity,
  FileText
} from 'lucide-react';
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
    { label: 'Analyze Pillar B12', action: 'workspace', value: WORKSPACES.STRUCTURAL, icon: Activity },
    { label: 'Run crack propagation simulation', action: 'workspace', value: WORKSPACES.PREDICTIVE, icon: Zap },
    { label: 'Generate structural report', action: 'workspace', value: WORKSPACES.REPORTING, icon: FileText },
    { label: 'Show risk heatmap', action: 'workspace', value: WORKSPACES.TWIN, icon: Compass },
    { label: 'Predict corrosion failure', action: 'workspace', value: WORKSPACES.PREDICTIVE, icon: Terminal },
    { label: 'Open live sensors', action: 'workspace', value: WORKSPACES.SHM, icon: Activity },
    { label: 'Generate compliance audit', action: 'workspace', value: WORKSPACES.REPORTING, icon: FileText },
    { label: 'Run seismic simulation', action: 'workspace', value: WORKSPACES.TWIN, icon: Zap }
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
        className="w-full max-w-2xl rounded-[4px] border border-[#d5dbdb] bg-[#ffffff] shadow-[0_4px_20px_0_rgba(0,28,36,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-[#16191f] font-sans"
      >
        {/* Search header bar */}
        <div className="flex items-center px-4 border-b border-[#eaeded] h-14 bg-[#ffffff]">
          <Search className="h-4.5 w-4.5 text-[#545b64] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search core command directives (e.g. 'Analyze Pillar B12')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="command-palette-input w-full h-full bg-transparent text-[13px] text-[#16191f] placeholder-[#879596] border-none outline-none font-sans"
          />
          <button 
            onClick={() => toggleCommandPalette(false)}
            className="p-1.5 border border-[#545b64] text-[#545b64] hover:bg-[#f1f3f3] hover:text-[#16191f] rounded-[4px] transition-colors flex items-center justify-center bg-white cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* List */}
        <div className="max-h-[26rem] overflow-y-auto p-5 space-y-5 text-[13px] font-sans">
          
          {/* Engineering Core Commands */}
          <div>
            <p className="text-[11px] text-[#545b64] uppercase tracking-wider mb-2.5 font-bold border-b border-[#eaeded] pb-1.5">Core Command Directives</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                return (
                  <button 
                    key={index}
                    onClick={() => handleAction(cmd.action, cmd.value)}
                    className="flex items-center justify-between p-2.5 rounded-[4px] border border-[#d5dbdb] bg-[#ffffff] hover:bg-[#f1f3f3] hover:border-[#aab7b8] text-left text-xs font-semibold text-[#16191f] transition-all group min-w-0 cursor-pointer"
                  >
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      <Icon className="h-3.5 w-3.5 text-[#545b64] flex-shrink-0" /> 
                      <span className="truncate">{cmd.label}</span>
                    </span>
                    <span className="text-[10px] border border-[#aab7b8] bg-[#f2f3f3] text-[#545b64] px-1.5 py-0.5 rounded-[4px] flex-shrink-0 ml-2 group-hover:border-[#545b64] transition-colors font-bold">
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
              <p className="text-[11px] text-[#545b64] uppercase tracking-wider mb-2.5 font-bold border-b border-[#eaeded] pb-1.5">CRM Unified Asset Portfolios</p>
              <div className="space-y-1">
                {filteredAccounts.map((a) => (
                  <div 
                    key={a.id} 
                    onClick={() => handleAction('workspace', WORKSPACES.EXECUTIVE)}
                    className="flex items-center justify-between p-2.5 border border-transparent hover:border-[#aab7b8] bg-[#f2f3f3] hover:bg-[#ffffff] rounded-[4px] cursor-pointer transition-all text-xs text-[#16191f]"
                  >
                    <span className="flex items-center gap-2 font-semibold text-[#16191f]"><Folder className="h-3.5 w-3.5 text-[#545b64] flex-shrink-0" /> <span className="truncate">{a.name}</span></span>
                    <span className="text-[11px] text-[#545b64] flex-shrink-0 ml-2">{a.location}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between px-4 h-10 border-t border-[#eaeded] bg-[#f2f3f3] font-sans text-[11px] text-[#545b64]">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><CornerDownLeft className="h-3.5 w-3.5 text-[#545b64]" /> Select Command</span>
            <span>Esc to cancel</span>
          </div>
          <span>Ouantum Unified Command Palette</span>
        </div>
      </div>
    </div>
  );
}
