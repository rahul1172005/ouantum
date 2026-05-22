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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-white/70 backdrop-blur-sm">
      <div 
        ref={containerRef}
        className="w-full max-w-2xl rounded border-4 border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-black"
      >
        {/* Search header bar */}
        <div className="flex items-center px-4 border-b-2 border-black h-14 bg-gray-50">
          <Search className="h-4.5 w-4.5 text-black mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="TYPE A COMMAND (e.g. 'Analyze Pillar B12', 'Run seismic simulation')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-full bg-transparent text-[11px] text-black placeholder-gray-400 border-none outline-none font-mono uppercase font-bold"
          />
          <button 
            onClick={() => toggleCommandPalette(false)}
            className="p-1 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* List */}
        <div className="max-h-[26rem] overflow-y-auto p-4 space-y-4 text-[10px] font-mono">
          
          {/* Engineering Core Commands */}
          <div>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-2 font-black border-b border-black pb-1">AI Command Bar Core Directives</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                return (
                  <button 
                    key={index}
                    onClick={() => handleAction(cmd.action, cmd.value)}
                    className="flex items-center justify-between p-2.5 rounded border border-black bg-white hover:bg-black hover:text-white text-left transition-colors font-bold uppercase"
                  >
                    <span className="flex items-center gap-2"><Icon className="h-3.5 w-3.5" /> {cmd.label}</span>
                    <span className="text-[8.5px] border border-black px-1 py-0.25 group-hover:border-white">EXEC</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CRM Account Entities */}
          {filteredAccounts.length > 0 && (
            <div>
              <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-2 font-black border-b border-black pb-1">CRM Unified Asset Portfolios</p>
              <div className="space-y-1">
                {filteredAccounts.map((a) => (
                  <div 
                    key={a.id} 
                    onClick={() => handleAction('workspace', WORKSPACES.EXECUTIVE)}
                    className="flex items-center justify-between p-2 border border-transparent hover:border-black bg-gray-50 hover:bg-white cursor-pointer transition-all"
                  >
                    <span className="flex items-center gap-2 font-bold uppercase"><Folder className="h-3.5 w-3.5" /> {a.name}</span>
                    <span className="text-[9px] text-gray-500">{a.location}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between px-4 h-10 border-t-2 border-black bg-gray-50 font-mono text-[8px] text-gray-600 font-bold uppercase">
          <div className="flex gap-4">
            <span><CornerDownLeft className="h-3 w-3 inline mr-1" /> Select Command</span>
            <span>Esc to cancel</span>
          </div>
          <span>Ouantum Intelligence Core Command Console</span>
        </div>
      </div>
    </div>
  );
}
