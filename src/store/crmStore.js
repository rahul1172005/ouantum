import { create } from 'zustand';

// Roles configuration defining permission scopes
export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EXECUTION: 'Sales/Ops',
  VIEWER: 'Viewer',
};

// Available Workspace Views
export const WORKSPACES = {
  EXECUTIVE: 'EXECUTIVE OVERVIEW',
  STRUCTURAL: 'STRUCTURAL ANALYSIS STUDIO',
  TWIN: 'DIGITAL TWIN ENGINE',
  NDT: 'NDT INTELLIGENCE LAB',
  SHM: 'SHM MONITORING CENTER',
  AUDIT: 'AUDIT INTELLIGENCE ENGINE',
  PREDICTIVE: 'PREDICTIVE AI ENGINE',
  GIS: 'INFRASTRUCTURE GIS ENGINE',
  REPORTING: 'REPORTING & INTELLIGENCE STUDIO',
  EMERGENCY: 'EMERGENCY RESPONSE SYSTEM',
  VALIDATION: 'AI STRUCTURAL VALIDATION & SIMULATION ENGINE',
  CIVIL_OS: 'CIVIL & INFRASTRUCTURE OS',
  GEOTECH: 'GEOTECHNICAL & HYDROLOGY ENGINE',
  MATERIALS: 'MATERIALS INTELLIGENCE LAB',
  STRUCTURAL_SAFETY: 'STRUCTURAL SAFETY & STABILITY',
  PROJECT_INTEL: 'PROJECT LIFECYCLE INTELLIGENCE',
};

// Initial Seed Data mapping CRM SSOT to infrastructure tracking
const initialAccounts = [
  { id: 'acc-1', name: 'MSRDC (Maharashtra Road Dev Corp)', domain: 'msrdc.in', industry: 'Public Infrastructure', location: 'Mumbai, MH', riskScore: 84 },
  { id: 'acc-2', name: 'CMRL (Chennai Metro Rail Ltd)', domain: 'chennaimetrorail.org', industry: 'Transit System', location: 'Chennai, TN', riskScore: 92 },
  { id: 'acc-3', name: 'NHAI (National Highways Authority)', domain: 'nhai.gov.in', industry: 'Roads & Highways', location: 'New Delhi, DL', riskScore: 78 }
];

const initialContacts = [
  { id: 'con-1', accountId: 'acc-1', name: 'Dr. Rajesh Mehta', email: 'r.mehta@msrdc.in', phone: '+91 98200 12345', role: 'Chief Structural Inspector' },
  { id: 'con-2', accountId: 'acc-2', name: 'Arun Viswanathan', email: 'arun.v@chennaimetrorail.org', phone: '+91 94440 98765', role: 'Director of Rail Systems' },
  { id: 'con-3', accountId: 'acc-3', name: 'Anjali Deshmukh', email: 'anjali.d@nhai.gov.in', phone: '+91 91110 54321', role: 'Principal Highway Safety Auditor' }
];

const initialDeals = [
  { id: 'deal-1', accountId: 'acc-1', title: 'Bandra-Worli Sea Link Pillar Reinforcement', amount: 45000000, stage: 'In Progress', healthScore: 68, closeDate: '2026-09-30' },
  { id: 'deal-2', accountId: 'acc-2', title: 'Chennai Metro Line 3 Acoustic Sensor Deployment', amount: 120000000, stage: 'Proposal', healthScore: 94, closeDate: '2026-11-15' },
  { id: 'deal-3', accountId: 'acc-3', title: 'NHAI Highway Bridge-42 Corrosion Mapping', amount: 85000000, stage: 'Negotiation', healthScore: 81, closeDate: '2026-08-01' }
];

const initialTickets = [
  { id: 'tick-1', accountId: 'acc-1', dealId: 'deal-1', title: 'Crack Propagation in Pillar B-12', severity: 'CRITICAL', status: 'OPEN', assetName: 'Bandra-Worli Sea Link', detectedAt: '2026-05-20T08:12:00Z', confidence: 98.4 },
  { id: 'tick-2', accountId: 'acc-2', dealId: 'deal-2', title: 'Acoustic Emission Sensor Failure in Section 4A', severity: 'MEDIUM', status: 'IN_PROGRESS', assetName: 'Chennai Metro L3', detectedAt: '2026-05-21T02:30:00Z', confidence: 89.1 },
  { id: 'tick-3', accountId: 'acc-3', dealId: 'deal-3', title: 'Corrosion Degradation Anomaly near Pier 42', severity: 'HIGH', status: 'OPEN', assetName: 'NH Bridge 42', detectedAt: '2026-05-19T14:45:00Z', confidence: 91.5 }
];

const initialActivities = [
  { id: 'act-1', accountId: 'acc-1', type: 'Sensor Alert', description: 'Micro-vibration threshold exceeded (3.4 Hz) in Pillar B-12.', timestamp: '2026-05-21T09:15:00Z', critical: true },
  { id: 'act-2', accountId: 'acc-2', type: 'Drone Inspection', description: 'Autonomous Drone flight B-34 logged crack images.', timestamp: '2026-05-20T11:20:00Z', critical: false },
  { id: 'act-3', accountId: 'acc-3', type: 'Audit Sync', description: 'Ultrasonic Pulse Velocity audit completed on Pier 42.', timestamp: '2026-05-19T16:00:00Z', critical: false }
];

const initialDocuments = [
  { id: 'doc-1', accountId: 'acc-1', name: 'BWSL_Structural_Assessment_2026.pdf', size: '14.2 MB', category: 'Audit' },
  { id: 'doc-2', accountId: 'acc-2', name: 'Metro_Line3_SensorLayout_V3.dwg', size: '48.9 MB', category: 'CAD Blueprint' },
  { id: 'doc-3', accountId: 'acc-3', name: 'Bridge_42_Corrosion_Map.xlsx', size: '2.4 MB', category: 'NDT Metrics' }
];

export const useCRMStore = create((set, get) => ({
  // Active states
  currentRole: ROLES.ADMIN,
  currentWorkspace: WORKSPACES.EXECUTIVE,
  searchQuery: '',
  showCommandPalette: false,
  
  // Data lists (SSOT)
  accounts: initialAccounts,
  contacts: initialContacts,
  deals: initialDeals,
  tickets: initialTickets,
  activities: initialActivities,
  documents: initialDocuments,
  
  // System metrics & logs
  auditLogs: [
    { timestamp: '2026-05-21T06:00:00Z', user: 'System', action: 'Initialized CRM Store with Indian Infrastructure database', target: 'SSOT Engine' }
  ],
  
  // Role & workspace modifiers
  setRole: (role) => {
    const action = `Changed Active Role to '${role}'`;
    set((state) => ({
      currentRole: role,
      auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action, target: 'RBAC Engine' }, ...state.auditLogs]
    }));
  },
  
  setWorkspace: (workspace) => {
    const action = `Switched Workspace to '${workspace}'`;
    set((state) => ({
      currentWorkspace: workspace,
      auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action, target: 'Viewport Layer' }, ...state.auditLogs]
    }));
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleCommandPalette: (show) => set((state) => ({ showCommandPalette: show !== undefined ? show : !state.showCommandPalette })),

  // Accounts Operations (SSOT deduplication)
  addAccount: (account) => {
    const existing = get().accounts.find(a => a.name.toLowerCase().trim() === account.name.toLowerCase().trim());
    if (existing) {
      // Automatic merge / warning
      const action = `Duplicate Account '${account.name}' detected and merged.`;
      set((state) => ({
        auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action, target: 'Deduplication' }, ...state.auditLogs]
      }));
      return { success: false, message: 'Duplicate Account detected! System auto-merged metrics.', accountId: existing.id };
    }

    const newAcc = { id: `acc-${Date.now()}`, riskScore: 100, ...account };
    set((state) => ({
      accounts: [...state.accounts, newAcc],
      auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action: `Created Account '${newAcc.name}'`, target: newAcc.id }, ...state.auditLogs]
    }));
    return { success: true, accountId: newAcc.id };
  },

  // Contact Operations (Must belong to Account)
  addContact: (contact) => {
    if (!contact.accountId) {
      return { success: false, message: 'RULE 2.2 Violation: Contact cannot exist without an Associated Account.' };
    }
    
    // Automatic Deduplication by email
    const duplicate = get().contacts.find(c => c.email.toLowerCase() === contact.email.toLowerCase());
    if (duplicate) {
      return { success: false, message: 'Deduplication Alert: Email belongs to an existing Contact.' };
    }

    const newCon = { id: `con-${Date.now()}`, ...contact };
    set((state) => ({
      contacts: [...state.contacts, newCon],
      activities: [
        { id: `act-${Date.now()}`, accountId: contact.accountId, type: 'System Log', description: `Added associated contact '${contact.name}'.`, timestamp: new Date().toISOString(), critical: false },
        ...state.activities
      ],
      auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action: `Added Contact '${newCon.name}'`, target: newCon.id }, ...state.auditLogs]
    }));
    return { success: true, contactId: newCon.id };
  },

  // Deal Operations (Must belong to Account)
  addDeal: (deal) => {
    if (!deal.accountId) {
      return { success: false, message: 'RULE 2.2 Violation: Deal cannot exist without an Associated Account.' };
    }

    const newDeal = { id: `deal-${Date.now()}`, healthScore: 100, ...deal };
    set((state) => ({
      deals: [...state.deals, newDeal],
      activities: [
        { id: `act-${Date.now()}`, accountId: deal.accountId, type: 'System Log', description: `Opened Deal / Project '${deal.title}' for ₹${deal.amount.toLocaleString('en-IN')}`, timestamp: new Date().toISOString(), critical: false },
        ...state.activities
      ],
      auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action: `Opened Deal '${newDeal.title}'`, target: newDeal.id }, ...state.auditLogs]
    }));
    return { success: true, dealId: newDeal.id };
  },

  // Ticket Operations (Associated with Account and optionally Deal)
  addTicket: (ticket) => {
    if (!ticket.accountId) {
      return { success: false, message: 'RULE 2.2 Violation: Ticket / Anomaly must be associated with an Account.' };
    }

    const newTicket = { id: `tick-${Date.now()}`, detectedAt: new Date().toISOString(), status: 'OPEN', ...ticket };
    
    // Auto-create severe alarm activity
    const isCritical = ticket.severity === 'CRITICAL' || ticket.severity === 'HIGH';
    
    set((state) => ({
      tickets: [...state.tickets, newTicket],
      activities: [
        { 
          id: `act-${Date.now()}`, 
          accountId: ticket.accountId, 
          type: isCritical ? 'Emergency Alert' : 'Structural Anomaly', 
          description: `ANOMALY: ${ticket.title} detected on ${ticket.assetName}. Severity: ${ticket.severity}.`, 
          timestamp: new Date().toISOString(), 
          critical: isCritical 
        },
        ...state.activities
      ],
      auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action: `Logged Ticket '${newTicket.title}'`, target: newTicket.id }, ...state.auditLogs]
    }));
    return { success: true, ticketId: newTicket.id };
  },

  // Resolve Ticket
  resolveTicket: (ticketId) => {
    set((state) => ({
      tickets: state.tickets.map(t => t.id === ticketId ? { ...t, status: 'RESOLVED' } : t),
      auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action: `Resolved Ticket '${ticketId}'`, target: ticketId }, ...state.auditLogs]
    }));
  }
}));
