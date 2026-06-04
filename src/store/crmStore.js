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
  // Phase 2 — Full Platform Expansion
  DEFECT_DETECTION: 'AI DEFECT DETECTION & COMPUTER VISION',
  SITE_INSPECTION: 'DIGITAL SITE INSPECTION & NCR',
  CONSTRUCTION_MONITOR: 'CONSTRUCTION PROGRESS MONITORING',
  COMPLIANCE_ENGINE: 'STANDARDS & COMPLIANCE ENGINE',
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
  
  // Data lists (SSOT) - start empty, loaded from backend
  accounts: [],
  contacts: [],
  deals: [],
  tickets: [],
  activities: [],
  documents: [],
  isLoadingBackend: false,
  
  // System metrics & logs
  auditLogs: [
    { timestamp: new Date().toISOString(), user: 'System', action: 'Initialized CRM Store connected to live Neon PostgreSQL database', target: 'SSOT Engine' }
  ],
  
  // Fetch real-time CRM data from PostgreSQL backend
  fetchBackendData: async () => {
    set({ isLoadingBackend: true });
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Failed to fetch CRM data');
      const data = await res.json();
      set({
        accounts: data.accounts || [],
        contacts: data.contacts || [],
        deals: data.deals || [],
        tickets: data.tickets || [],
        activities: data.activities || [],
        documents: data.documents || [],
        isLoadingBackend: false
      });
    } catch (err) {
      console.error('Error loading CRM data from backend:', err);
      set({ isLoadingBackend: false });
    }
  },
  
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
  addAccount: async (account) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'account', payload: account })
      });
      const result = await res.json();
      if (!result.success) {
        // Handle deduplication merge
        const action = `Duplicate Account '${account.name}' detected and merged.`;
        set((state) => ({
          auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action, target: 'Deduplication' }, ...state.auditLogs]
        }));
        return { success: false, message: result.message, accountId: result.accountId };
      }

      const newAcc = { id: result.id, riskScore: 100, ...account };
      set((state) => ({
        accounts: [...state.accounts, newAcc],
        auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action: `Created Account '${newAcc.name}'`, target: newAcc.id }, ...state.auditLogs]
      }));
      return { success: true, accountId: newAcc.id };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Backend Server Connection Error' };
    }
  },

  // Contact Operations (Must belong to Account)
  addContact: async (contact) => {
    if (!contact.accountId) {
      return { success: false, message: 'RULE 2.2 Violation: Contact cannot exist without an Associated Account.' };
    }

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', payload: contact })
      });
      const result = await res.json();
      if (!result.success) {
        return { success: false, message: result.message };
      }

      const newCon = { id: result.id, ...contact };
      
      // Fetch fresh activities and contacts from backend
      await get().fetchBackendData();

      set((state) => ({
        auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action: `Added Contact '${newCon.name}'`, target: newCon.id }, ...state.auditLogs]
      }));
      return { success: true, contactId: newCon.id };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Backend Server Connection Error' };
    }
  },

  // Deal Operations (Must belong to Account)
  addDeal: async (deal) => {
    if (!deal.accountId) {
      return { success: false, message: 'RULE 2.2 Violation: Deal cannot exist without an Associated Account.' };
    }

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'deal', payload: deal })
      });
      const result = await res.json();
      if (!result.success) {
        return { success: false, message: result.message };
      }

      const newDeal = { id: result.id, healthScore: 100, ...deal };

      await get().fetchBackendData();

      set((state) => ({
        auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action: `Opened Deal '${newDeal.title}'`, target: newDeal.id }, ...state.auditLogs]
      }));
      return { success: true, dealId: newDeal.id };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Backend Server Connection Error' };
    }
  },

  // Ticket Operations (Associated with Account and optionally Deal)
  addTicket: async (ticket) => {
    if (!ticket.accountId) {
      return { success: false, message: 'RULE 2.2 Violation: Ticket / Anomaly must be associated with an Account.' };
    }

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ticket', payload: ticket })
      });
      const result = await res.json();
      if (!result.success) {
        return { success: false, message: result.message };
      }

      const newTicket = { id: result.id, detectedAt: new Date().toISOString(), status: 'OPEN', ...ticket };

      await get().fetchBackendData();

      set((state) => ({
        auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action: `Logged Ticket '${newTicket.title}'`, target: newTicket.id }, ...state.auditLogs]
      }));
      return { success: true, ticketId: newTicket.id };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Backend Server Connection Error' };
    }
  },

  // Resolve Ticket
  resolveTicket: async (ticketId) => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'resolve_ticket', payload: { ticketId } })
      });

      set((state) => ({
        tickets: state.tickets.map(t => t.id === ticketId ? { ...t, status: 'RESOLVED' } : t),
        auditLogs: [{ timestamp: new Date().toISOString(), user: 'Dr. Rajesh Mehta', action: `Resolved Ticket '${ticketId}'`, target: ticketId }, ...state.auditLogs]
      }));
    } catch (err) {
      console.error(err);
    }
  },

  addAuditLogEntry: (action, target) => {
    set((state) => ({
      auditLogs: [
        {
          timestamp: new Date().toISOString(),
          user: 'Dr. Rajesh Mehta',
          action,
          target
        },
        ...state.auditLogs
      ]
    }));
  }
}));
