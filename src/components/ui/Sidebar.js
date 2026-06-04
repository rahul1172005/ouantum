import React, { useState } from 'react';
import { useCRMStore, WORKSPACES } from '@/store/crmStore';

// Custom Retro-style SVG Icons to match reference image exactly
const YellowFolderIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 2.5C1.5 2.22386 1.72386 2 2 2H5.5L7.5 4H14C14.2761 4 14.5 4.22386 14.5 4.5V13.5C14.5 13.7761 14.2761 14 14 14H2C1.72386 14 1.5 13.7761 1.5 13.5V2.5Z" fill="#F8C444" stroke="#DCA224" strokeWidth="0.8"/>
    <path d="M2 4.5H14V13H2V4.5Z" fill="#FDE69E"/>
  </svg>
);

const FolderNewIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 2.5C1.5 2.22386 1.72386 2 2 2H5.5L7.5 4H14C14.2761 4 14.5 4.22386 14.5 4.5V13.5C14.5 13.7761 14.2761 14 14 14H2C1.72386 14 1.5 13.7761 1.5 13.5V2.5Z" fill="#F8C444" stroke="#DCA224" strokeWidth="0.8"/>
    <path d="M2 4.5H14V13H2V4.5Z" fill="#FDE69E"/>
    <circle cx="12" cy="10" r="3.5" fill="#336600" stroke="#ffffff" strokeWidth="0.5"/>
    <line x1="12" y1="8.5" x2="12" y2="11.5" stroke="#ffffff" strokeWidth="0.8"/>
    <line x1="10.5" y1="10" x2="13.5" y2="10" stroke="#ffffff" strokeWidth="0.8"/>
  </svg>
);

const TableGridIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="2.5" width="13" height="11" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8"/>
    <rect x="1.5" y="2.5" width="13" height="3" fill="#E68A00" stroke="#E68A00" strokeWidth="0.8"/>
    <line x1="1.5" y1="8.5" x2="14.5" y2="8.5" stroke="#DDDDDD" strokeWidth="0.8"/>
    <line x1="1.5" y1="11.5" x2="14.5" y2="11.5" stroke="#DDDDDD" strokeWidth="0.8"/>
    <line x1="5.5" y1="5.5" x2="5.5" y2="13.5" stroke="#DDDDDD" strokeWidth="0.8"/>
    <line x1="10.5" y1="5.5" x2="10.5" y2="13.5" stroke="#DDDDDD" strokeWidth="0.8"/>
  </svg>
);

const ColumnChartIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8"/>
    <rect x="3.5" y="7.5" width="2" height="5.5" fill="#336600" stroke="#224400" strokeWidth="0.5"/>
    <rect x="7.5" y="5.5" width="2" height="7.5" fill="#E68A00" stroke="#CC7A00" strokeWidth="0.5"/>
    <rect x="11.5" y="3.5" width="2" height="9.5" fill="#CC0000" stroke="#990000" strokeWidth="0.5"/>
    <line x1="2.5" y1="13" x2="13.5" y2="13" stroke="#555555" strokeWidth="0.8"/>
  </svg>
);

const DashboardPanelIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" fill="#FFFFFF" stroke="#777777" strokeWidth="0.8"/>
    <rect x="3" y="3" width="4.5" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5"/>
    <rect x="8.5" y="3" width="4.5" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5"/>
    <rect x="3" y="8.5" width="10" height="4.5" fill="#EBF3FB" stroke="#4A90E2" strokeWidth="0.5"/>
  </svg>
);

const CollapseIcon = ({ collapsed }) => (
  <span 
    className="w-3 h-3 border border-gray-400 bg-white flex items-center justify-center text-[9px] font-black text-gray-500 select-none mr-1.5 flex-shrink-0" 
    style={{ width: '11px', height: '11px', lineHeight: '9px', fontStyle: 'normal' }}
  >
    {collapsed ? '+' : '-'}
  </span>
);

export default function Sidebar({ isOpen, setIsOpen }) {
  const currentWorkspace = useCRMStore(state => state.currentWorkspace);
  const setWorkspace = useCRMStore(state => state.setWorkspace);
  
  // Custom sidebar explorer States
  const [searchFilter, setSearchFilter] = useState('');
  const [viewBy, setViewBy] = useState('Folder');
  
  const [collapsedFolders, setCollapsedFolders] = useState({
    tablesAndReports: false,
    engineeringLabs: false,
    monitoringIoT: false,
    systemsSettings: false,
  });

  const toggleFolder = (folderKey) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }));
  };

  // Group all workspaces logically with icons
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

  const handleRefresh = (e) => {
    e.preventDefault();
    setSearchFilter('');
    alert('Refreshed workspace explorer metadata.');
  };

  const getWorkspaceIcon = (type) => {
    switch (type) {
      case 'dashboard':
        return <DashboardPanelIcon />;
      case 'chart':
        return <ColumnChartIcon />;
      case 'table':
      default:
        return <TableGridIcon />;
    }
  };

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 bg-[#ffffff] flex flex-col transition-all duration-200 ${
        isOpen ? 'w-60' : 'w-14'
      } border-r border-[#eaeded] select-none`}
    >
      {isOpen ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          
          {/* 1. Explorer Tab Title with Collapse Arrow Button */}
          <div className="px-4 py-3 bg-[#ffffff] border-b border-[#eaeded] flex items-center justify-between font-bold text-gray-700 text-xs">
            <div className="flex items-center gap-1.5">
              <YellowFolderIcon />
              <span className="text-gray-800 text-[12px] font-semibold">Explorer</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-0.5 hover:bg-neutral-100 rounded-sm text-gray-400 hover:text-gray-800 transition-colors"
              title="Collapse Sidebar"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* 2. Search tables/reports bar */}
          <div className="p-3 border-b border-[#eaeded] bg-[#ffffff] space-y-2">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search Tables/Reports"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-8 px-2 pr-6 bg-white border border-[#aab7b8] text-xs focus:outline-none focus:border-[#0073bb] rounded"
              />
              <button className="absolute right-1.5 p-0.5 icon-btn hover:bg-gray-100 rounded-sm">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* 3. View by select & Refresh link */}
            <div className="flex justify-between items-center text-[11px] text-gray-600">
              <div className="flex items-center gap-1">
                <span>View by:</span>
                <select 
                  value={viewBy}
                  onChange={(e) => setViewBy(e.target.value)}
                  className="bg-white border border-[#aab7b8] rounded py-0.5 px-1 font-medium text-[11px] outline-none"
                >
                  <option value="Folder">Folder</option>
                  <option value="Type">Type</option>
                </select>
              </div>
              <a 
                href="#refresh" 
                onClick={handleRefresh} 
                className="text-gray-500 hover:text-gray-800 hover:underline"
              >
                Refresh
              </a>
            </div>

            {/* 4. Create New Folder Link */}
            <div className="pt-2 border-t border-[#eaeded] flex items-center gap-1.5">
              <FolderNewIcon />
              <a 
                href="#create-folder" 
                onClick={(e) => { e.preventDefault(); alert("Create Folder prompt: Feature restricted under role governance (SSOT)."); }}
                className="text-gray-600 hover:text-gray-800 hover:underline text-[11px] font-medium"
              >
                Create New Folder
              </a>
            </div>

          </div>

          {/* 5. Nav Tree Options */}
          <nav className="flex-1 px-1 py-2 overflow-y-auto space-y-1 bg-[#ffffff]">
            {folders.map((folder) => {
              const collapsed = collapsedFolders[folder.key];
              
              // Filter items inside folder
              const filteredItems = folder.items.filter(item => 
                item.label.toLowerCase().includes(searchFilter.toLowerCase())
              );

              // Don't show folder if filtered out completely
              if (searchFilter && filteredItems.length === 0) return null;

              return (
                <div key={folder.key} className="space-y-1">
                  {/* Folder Group Header */}
                  <div 
                    onClick={() => toggleFolder(folder.key)}
                    className="sidebar-folder cursor-pointer hover:bg-neutral-100 rounded-sm py-1 px-3 transition-colors flex items-center select-none"
                  >
                    <CollapseIcon collapsed={collapsed} />
                    <span className="truncate">{folder.label}</span>
                  </div>

                  {/* Folder Items */}
                  {!collapsed && (
                    <div className="pl-2 space-y-0.5">
                      {filteredItems.map((item, idx) => {
                        const isActive = currentWorkspace === item.workspace;
                        return (
                          <button
                            key={`${item.label}-${idx}`}
                            onClick={() => setWorkspace(item.workspace)}
                            className={`sidebar-btn ${isActive ? 'active' : ''}`}
                          >
                            <span className="mr-2">{getWorkspaceIcon(item.type)}</span>
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

        </div>
      ) : (
        /* Collapsed Sidebar View (Simplified vertical icons list) */
        <nav className="flex-1 px-1 py-3 space-y-3 overflow-y-auto flex flex-col items-center bg-[#ffffff]">
          <button onClick={() => setIsOpen(true)} className="p-1.5 hover:bg-neutral-100 rounded text-gray-500 hover:text-gray-800 topbar-btn">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="w-8 border-b border-[#eaeded] my-1"></div>
          
          {folders.flatMap(f => f.items).map((item, index) => {
            const isActive = currentWorkspace === item.workspace;
            return (
              <button
                key={`${item.label}-${index}`}
                onClick={() => setWorkspace(item.workspace)}
                title={item.label}
                className={`p-2 rounded-sm transition-colors topbar-btn flex items-center justify-center ${
                  isActive ? 'bg-neutral-100 border-l-3 border-[#ec7211]' : 'hover:bg-neutral-100'
                }`}
                style={{ width: '38px', height: '38px', borderTop: 'none', borderRight: 'none', borderBottom: 'none' }}
              >
                {getWorkspaceIcon(item.type)}
              </button>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
