import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  FreelancerProfile,
  Client,
  Project,
  Lead,
  Invoice,
  ActivityItem,
  NotificationItem,
  TemplateItem,
  AvailabilityStatus,
  LeadStage,
  LostReason,
  DeliverableStatus,
  Testimonial,
  CaseStudy,
  ProjectMessage,
  PortalInvitationStatus,
  ProfessionalDocument,
  OnboardingFormData
} from '../types';
import {
  initialFreelancerProfile,
  initialClients,
  initialProjects,
  initialLeads,
  initialInvoices,
  initialActivities,
  initialNotifications,
  initialTemplates
} from '../mock/initialData';
import { initialDocuments } from '../mock/initialDocuments';
import confetti from 'canvas-confetti';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  view: string;
  projectId?: string;
  tab?: string;
  completed: boolean;
}

interface AppContextType {
  // Navigation & View State
  activeView: string;
  setActiveView: (view: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  selectedVerificationCode: string | null;
  setSelectedVerificationCode: (code: string | null) => void;
  activeProjectTab: string;
  setActiveProjectTab: (tab: string) => void;
  
  // Auth state
  isAuthenticated: boolean;
  loginDemoUser: () => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;

  // Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Create Project Modal
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;
  preselectedLeadForProject: Lead | null;
  setPreselectedLeadForProject: (lead: Lead | null) => void;

  // Profile
  profile: FreelancerProfile;
  updateProfile: (profile: Partial<FreelancerProfile>) => void;
  setAvailability: (status: AvailabilityStatus) => void;

  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLeadStage: (id: string, stage: LeadStage, lostReason?: LostReason, lostNotes?: string) => void;
  convertLeadToProject: (leadId: string) => void;

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'joinedDate' | 'totalRevenue' | 'projectCount' | 'lastActivity' | 'portalStatus'> & { portalStatus?: PortalInvitationStatus }) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'progress' | 'paidAmount' | 'milestones' | 'tasks' | 'deliverables'> & { initialDeliverables?: string[] }) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  
  // Project specific workflows
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  addDeliverable: (projectId: string, deliverable: { title: string; description: string; dueDate: string }) => void;
  updateDeliverableStatus: (projectId: string, deliverableId: string, status: DeliverableStatus, feedback?: string) => void;
  approveDeliverable: (projectId: string, deliverableId: string) => void;
  requestDeliverableRevision: (projectId: string, deliverableId: string, feedback: string) => void;
  saveOnboardingQuestions: (projectId: string, questions: any[]) => void;
  signAgreementAsClient: (projectId: string) => void;
  completeProjectWithTestimonial: (projectId: string, testimonial: { rating: number; comment: string; allowPublicDisplay: boolean }) => void;
  generateCaseStudyForProject: (projectId: string) => void;
  togglePublishCaseStudy: (projectId: string) => void;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  markInvoiceAsPaid: (id: string) => void;

  // Professional Documents & Templates
  documents: ProfessionalDocument[];
  addDocument: (doc: Omit<ProfessionalDocument, 'id' | 'createdAt' | 'updatedAt'>) => ProfessionalDocument;
  updateDocument: (id: string, updates: Partial<ProfessionalDocument>) => void;
  deleteDocument: (id: string) => void;
  duplicateDocument: (id: string) => ProfessionalDocument;
  saveDocumentAsTemplate: (docId: string, templateName: string) => void;
  sendDocumentToClient: (docId: string) => void;
  signDocumentAsClient: (docId: string, clientName: string) => void;
  submitOnboardingFormAsClient: (docId: string, formData: OnboardingFormData) => void;

  // Templates
  templates: TemplateItem[];
  addTemplate: (template: Omit<TemplateItem, 'id'>) => void;
  updateTemplate: (id: string, updates: Partial<TemplateItem>) => void;
  deleteTemplate: (id: string) => void;

  // Activity & Notifications
  activities: ActivityItem[];
  logActivity: (description: string, type: ActivityItem['type'], projectId?: string, projectName?: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Walkthrough Guide
  walkthroughSteps: WalkthroughStep[];
  isWalkthroughActive: boolean;
  setIsWalkthroughActive: (active: boolean) => void;
  currentWalkthroughStep: number;
  goToWalkthroughStep: (index: number) => void;
  completeWalkthroughStep: (stepId: string) => void;

  // Client Portal Session & Passwordless Auth
  activeClientSession: Client | null;
  setActiveClientSession: (client: Client | null) => void;
  clientLogin: (email: string, otp: string) => { success: boolean; error?: string; client?: Client };
  clientLogout: () => void;
  sendClientInvitation: (clientId: string, email?: string, message?: string) => void;
  revokeClientPortalAccess: (clientId: string) => void;
  deleteClientWithProjectChoice: (clientId: string, choice: 'delete_all' | 'keep_projects') => void;
  convertLeadToClient: (leadId: string) => Client | undefined;
  addProjectMessage: (projectId: string, msg: { sender: 'freelancer' | 'client'; senderName: string; message: string }) => void;

  // Demo Control
  resetToDemoData: () => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'freelancer_hub_clean_v3';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Clear any legacy demo data from localStorage if exists
  try {
    localStorage.removeItem('freelancer_hub_demo_state_v1');
    localStorage.removeItem('freelancer_hub_state_clean_v2');
  } catch (e) {
    // ignore
  }

  // Try loading from localStorage or fallback to defaults
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage:', e);
    }
    return null;
  };

  const savedState = loadInitialState();

  const [profile, setProfile] = useState<FreelancerProfile>(savedState?.profile || initialFreelancerProfile);
  const [clients, setClients] = useState<Client[]>(savedState?.clients || initialClients);
  const [projects, setProjects] = useState<Project[]>(savedState?.projects || initialProjects);
  const [leads, setLeads] = useState<Lead[]>(savedState?.leads || initialLeads);
  const [invoices, setInvoices] = useState<Invoice[]>(savedState?.invoices || initialInvoices);
  const [documents, setDocuments] = useState<ProfessionalDocument[]>(savedState?.documents || initialDocuments);
  const [activities, setActivities] = useState<ActivityItem[]>(savedState?.activities || initialActivities);
  const [notifications, setNotifications] = useState<NotificationItem[]>(savedState?.notifications || initialNotifications);
  const [templates, setTemplates] = useState<TemplateItem[]>(savedState?.templates || initialTemplates);

  // App UI State (Defaults to Landing Page / Homepage)
  const [activeView, setActiveView] = useState<string>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedVerificationCode, setSelectedVerificationCode] = useState<string | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState<string>('overview');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState<boolean>(false);
  const [preselectedLeadForProject, setPreselectedLeadForProject] = useState<Lead | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Interactive 14-Step Guided Tour (works with new user flow)
  const initialWalkthroughSteps: WalkthroughStep[] = [
    { id: 'wt-1', title: '1. Review Leads Pipeline', description: 'Explore incoming client leads and stages.', view: 'leads', completed: false },
    { id: 'wt-2', title: '2. Convert a Lead to Won', description: 'Move lead to Won and click "Convert to Client & Project".', view: 'leads', completed: false },
    { id: 'wt-3', title: '3. Create Project via Wizard', description: 'Configure project details, payment & workflow.', view: 'projects', completed: false },
    { id: 'wt-4', title: '4. Open Project Workspace', description: 'Explore your active project workspace.', view: 'project_workspace', tab: 'overview', completed: false },
    { id: 'wt-5', title: '5. Customize Onboarding Brief', description: 'Edit questions and preview client intake form.', view: 'project_workspace', tab: 'onboarding', completed: false },
    { id: 'wt-6', title: '6. Review & Sign Agreement', description: 'Generate contract and simulate digital signatures.', view: 'project_workspace', tab: 'documents', completed: false },
    { id: 'wt-7', title: '7. Generate Project Invoice', description: 'View invoice details, download PDF or create new.', view: 'invoices', completed: false },
    { id: 'wt-8', title: '8. Mark Invoice as Paid', description: 'Watch dashboard revenue and metrics auto-update.', view: 'invoices', completed: false },
    { id: 'wt-9', title: '9. Submit Deliverables for Review', description: 'Send design/code items for client review.', view: 'project_workspace', tab: 'deliverables', completed: false },
    { id: 'wt-10', title: '10. Simulate Client Approval', description: 'Open Client Portal view to approve or request changes.', view: 'client_portal', completed: false },
    { id: 'wt-11', title: '11. Complete Project & Rating', description: 'Mark project complete and collect 5-star testimonial.', view: 'project_workspace', tab: 'completion', completed: false },
    { id: 'wt-12', title: '12. View Verified Project Certificate', description: 'Inspect the public cryptographic verification link.', view: 'verification', completed: false },
    { id: 'wt-13', title: '13. Generate Portfolio Case Study', description: 'Auto-generate a rich case study from project results.', view: 'portfolio', completed: false },
    { id: 'wt-14', title: '14. Publish to Public Live Portfolio', description: 'View your live public portfolio site.', view: 'public_profile', completed: false },
  ];

  const [walkthroughSteps, setWalkthroughSteps] = useState<WalkthroughStep[]>(initialWalkthroughSteps);
  const [isWalkthroughActive, setIsWalkthroughActive] = useState<boolean>(false);
  const [currentWalkthroughStep, setCurrentWalkthroughStep] = useState<number>(0);

  // Sync with LocalStorage
  useEffect(() => {
    const stateToSave = {
      profile,
      clients,
      projects,
      leads,
      invoices,
      documents,
      activities,
      notifications,
      templates
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [profile, clients, projects, leads, invoices, documents, activities, notifications, templates]);

  // Toast Dispatcher
  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
    });
  };

  const logActivity = (description: string, type: ActivityItem['type'], projectId?: string, projectName?: string) => {
    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      projectId,
      projectName,
      description,
      type,
      timestamp: 'Just now'
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    addToast('All notifications cleared', 'info');
  };

  // Auth Methods
  const loginDemoUser = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setActiveView('dashboard');
    addToast('Welcome back, Rithvik! Demo workspace loaded.', 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveView('landing');
    addToast('Signed out of demo account', 'info');
  };

  // Profile Methods
  const updateProfile = (updates: Partial<FreelancerProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    addToast('Profile updated successfully', 'success');
  };

  const setAvailability = (status: AvailabilityStatus) => {
    setProfile(prev => ({ ...prev, availability: status }));
    const labels = {
      available: '🟢 Available for Work',
      busy: '🟡 Busy with Projects',
      unavailable: '🔴 Not Available'
    };
    addToast(`Status updated to ${labels[status]}`, 'info');
  };

  // Lead Methods
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
    logActivity(`New lead created: "${newLead.companyName}" (₹${newLead.estimatedValue.toLocaleString()})`, 'lead');
    addToast(`Lead "${newLead.companyName}" added successfully`, 'success');
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : l));
    addToast('Lead details updated', 'success');
  };

  const deleteLead = (id: string) => {
    const lead = leads.find(l => l.id === id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (lead) {
      logActivity(`Deleted lead "${lead.companyName}"`, 'lead');
    }
    addToast(`Lead "${lead?.companyName || ''}" permanently deleted`, 'info');
  };

  const moveLeadStage = (id: string, stage: LeadStage, lostReason?: LostReason, lostNotes?: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          stage,
          lostReason: stage === 'lost' ? lostReason : undefined,
          lostNotes: stage === 'lost' ? lostNotes : undefined,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return l;
    }));

    const lead = leads.find(l => l.id === id);
    if (lead) {
      logActivity(`Moved lead "${lead.companyName}" to ${stage.replace('_', ' ').toUpperCase()}`, 'lead');
      if (stage === 'won') {
        triggerConfetti();
        addToast(`🎉 Lead "${lead.companyName}" marked as WON!`, 'success');
      } else if (stage === 'lost') {
        addToast(`Lead marked as Lost (${lostReason || 'Unspecified'})`, 'warning');
      } else {
        addToast(`Lead stage updated to ${stage.replace('_', ' ')}`, 'info');
      }
    }
  };

  const [activeClientSession, setActiveClientSession] = useState<Client | null>(null);

  // Lead Conversion Methods
  const convertLeadToClient = (leadId: string): Client | undefined => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Check if client already exists by email or company
    let existingClient = clients.find(
      c => c.email.toLowerCase() === lead.email.toLowerCase() ||
           c.company.toLowerCase() === lead.companyName.toLowerCase()
    );

    if (!existingClient) {
      existingClient = {
        id: 'cli-' + Date.now(),
        name: lead.clientName,
        company: lead.companyName,
        email: lead.email,
        phone: lead.phone || '+91 98765 00000',
        status: 'active',
        portalStatus: 'not_invited',
        source: lead.source,
        notes: lead.notes || `Requirement: ${lead.projectTitle}`,
        projectRequirement: lead.projectTitle,
        address: 'India',
        joinedDate: new Date().toISOString().split('T')[0],
        totalRevenue: 0,
        projectCount: 0,
        lastActivity: 'Converted from Lead'
      };
      setClients(prev => [existingClient!, ...prev]);
    }

    // Mark lead as won
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: 'won', updatedAt: new Date().toISOString().split('T')[0] } : l));

    setSelectedClientId(existingClient.id);
    setActiveView('clients');
    logActivity(`Converted lead "${lead.companyName}" to Client profile`, 'client');
    addToast(`Client profile for "${existingClient.company}" created from lead!`, 'success');
    triggerConfetti();
    return existingClient;
  };

  const convertLeadToProject = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // First check if client already exists or create new client
    let existingClient = clients.find(c => c.name.toLowerCase() === lead.clientName.toLowerCase() || c.company.toLowerCase() === lead.companyName.toLowerCase());
    
    if (!existingClient) {
      existingClient = addClient({
        name: lead.clientName,
        company: lead.companyName,
        email: lead.email,
        phone: lead.phone || '+91 98765 00000',
        status: 'active',
        portalStatus: 'not_invited',
        source: lead.source,
        projectRequirement: lead.projectTitle,
        address: 'India',
        notes: `Converted from lead: ${lead.projectTitle}. Source: ${lead.source}`
      });
    }

    setPreselectedLeadForProject(lead);
    setIsCreateProjectOpen(true);
  };

  // Client Methods
  const addClient = (clientData: Omit<Client, 'id' | 'joinedDate' | 'totalRevenue' | 'projectCount' | 'lastActivity' | 'portalStatus'> & { portalStatus?: PortalInvitationStatus }): Client => {
    const newClient: Client = {
      ...clientData,
      id: 'cli-' + Date.now(),
      status: clientData.status || 'active',
      portalStatus: clientData.portalStatus || 'not_invited',
      joinedDate: new Date().toISOString().split('T')[0],
      totalRevenue: 0,
      projectCount: 0,
      lastActivity: 'Just now'
    };
    setClients(prev => [newClient, ...prev]);
    logActivity(`Added new client: "${newClient.company}"`, 'client');
    addToast(`Client "${newClient.company}" created`, 'success');
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates, lastActivity: 'Just now' } : c));
    if (activeClientSession?.id === id) {
      setActiveClientSession(prev => prev ? { ...prev, ...updates } : null);
    }
    addToast('Client profile updated', 'success');
  };

  const deleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    setClients(prev => prev.filter(c => c.id !== id));
    if (selectedClientId === id) {
      setSelectedClientId(null);
    }
    if (activeClientSession?.id === id) {
      setActiveClientSession(null);
    }
    if (client) {
      logActivity(`Removed client "${client.company}"`, 'client');
    }
    addToast('Client removed', 'info');
  };

  const deleteClientWithProjectChoice = (clientId: string, choice: 'delete_all' | 'keep_projects') => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (choice === 'delete_all') {
      // Delete all projects belonging to this client
      setProjects(prev => {
        const remaining = prev.filter(p => p.clientId !== clientId && p.clientCompany.toLowerCase() !== client.company.toLowerCase());
        if (selectedProjectId && !remaining.some(p => p.id === selectedProjectId)) {
          setSelectedProjectId(remaining.length > 0 ? remaining[0].id : null);
        }
        return remaining;
      });
      // Delete invoices belonging to this client
      setInvoices(prev => prev.filter(i => i.clientId !== clientId && i.clientCompany.toLowerCase() !== client.company.toLowerCase()));
      // Remove client
      setClients(prev => prev.filter(c => c.id !== clientId));
      if (selectedClientId === clientId) setSelectedClientId(null);
      if (activeClientSession?.id === clientId) setActiveClientSession(null);

      logActivity(`Permanently deleted client "${client.company}" and all associated projects`, 'client');
      addToast(`Client "${client.company}" and all associated projects permanently deleted`, 'info');
    } else {
      // Keep projects but mark as archived / client removed
      setProjects(prev => prev.map(p => {
        if (p.clientId === clientId || p.clientCompany.toLowerCase() === client.company.toLowerCase()) {
          return {
            ...p,
            status: 'archived',
            clientName: `${p.clientName} (Archived)`,
            clientCompany: `${p.clientCompany} (Client Removed)`
          };
        }
        return p;
      }));
      // Remove client
      setClients(prev => prev.filter(c => c.id !== clientId));
      if (selectedClientId === clientId) setSelectedClientId(null);
      if (activeClientSession?.id === clientId) setActiveClientSession(null);

      logActivity(`Deleted client "${client.company}" (retained projects as archived)`, 'client');
      addToast(`Client "${client.company}" removed. Associated projects preserved in archive.`, 'info');
    }
  };

  const sendClientInvitation = (clientId: string, email?: string, message?: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const now = new Date().toLocaleString();
    const token = 'inv-' + clientId + '-' + Math.random().toString(36).substring(2, 8);

    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          email: email || c.email,
          portalStatus: 'invitation_sent',
          invitationSentAt: now,
          invitationToken: token,
          lastActivity: 'Invitation sent'
        };
      }
      return c;
    }));

    logActivity(`Client portal invitation sent to "${client.company}" (${email || client.email})`, 'client');
    addToast(`Invitation sent to ${client.company}!`, 'success');
  };

  const revokeClientPortalAccess = (clientId: string) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, portalStatus: 'access_revoked', lastActivity: 'Access revoked' } : c));
    if (activeClientSession?.id === clientId) {
      setActiveClientSession(null);
    }
    logActivity(`Revoked client portal access for client ID: ${clientId}`, 'client');
    addToast('Client portal access revoked', 'warning');
  };

  const clientLogin = (email: string, otp: string): { success: boolean; error?: string; client?: Client } => {
    const trimmedEmail = email.trim().toLowerCase();
    const client = clients.find(c => c.email.toLowerCase() === trimmedEmail);

    if (!client) {
      return { success: false, error: 'No client profile found registered with this email address.' };
    }

    if (client.portalStatus === 'access_revoked') {
      return { success: false, error: 'This client portal is no longer available. Access has been revoked.' };
    }

    // Accept OTP (default demo OTP: 1234, or any 4 digit code)
    if (!otp || otp.trim().length < 4) {
      return { success: false, error: 'Please enter a valid 4-digit verification OTP.' };
    }

    const activatedClient: Client = {
      ...client,
      portalStatus: 'portal_activated',
      portalActivatedAt: new Date().toISOString().split('T')[0],
      lastActivity: 'Logged into Client Portal'
    };

    setClients(prev => prev.map(c => c.id === client.id ? activatedClient : c));
    setActiveClientSession(activatedClient);

    const clientProjs = projects.filter(p => p.clientId === client.id || p.clientCompany.toLowerCase() === client.company.toLowerCase());
    if (clientProjs.length > 0) {
      setSelectedProjectId(clientProjs[0].id);
    }

    logActivity(`Client "${client.company}" accessed their Client Portal`, 'client');
    addToast(`Welcome to your workspace, ${client.name}!`, 'success');
    return { success: true, client: activatedClient };
  };

  const clientLogout = () => {
    setActiveClientSession(null);
    addToast('Signed out of Client Portal', 'info');
  };

  const addProjectMessage = (projectId: string, msg: { sender: 'freelancer' | 'client'; senderName: string; message: string }) => {
    const newMsg: ProjectMessage = {
      id: 'msg-' + Date.now(),
      sender: msg.sender,
      senderName: msg.senderName,
      message: msg.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          messages: [...(p.messages || []), newMsg]
        };
      }
      return p;
    }));

    logActivity(`New message from ${msg.senderName}`, 'project', projectId);
  };

  const getClientById = (id: string) => clients.find(c => c.id === id);

  // Project Methods
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'progress' | 'paidAmount' | 'milestones' | 'tasks' | 'deliverables'> & { initialDeliverables?: string[] }): Project => {
    const codePrefix = projectData.clientCompany.substring(0, 3).toUpperCase();
    const verCode = `${codePrefix}-2026-${Math.floor(100 + Math.random() * 900)}`;
    
    const initialMilestones = [
      { id: 'm-' + Date.now() + '-1', title: 'Discovery & Client Onboarding', completed: true, completedAt: new Date().toISOString().split('T')[0] },
      { id: 'm-' + Date.now() + '-2', title: 'UI/UX Design Wireframes & Review', completed: false },
      { id: 'm-' + Date.now() + '-3', title: 'Core Development & Functionality', completed: false },
      { id: 'm-' + Date.now() + '-4', title: 'Testing, QA & Final Launch', completed: false },
    ];

    const initialTasks = [
      { id: 't-' + Date.now() + '-1', title: 'Setup project repository and design tokens', completed: true },
      { id: 't-' + Date.now() + '-2', title: 'Send client onboarding brief', completed: true },
      { id: 't-' + Date.now() + '-3', title: 'Create wireframes & prototype', completed: false },
      { id: 't-' + Date.now() + '-4', title: 'Conduct milestone code review', completed: false },
    ];

    const initialDeliverableList = (projectData.initialDeliverables && projectData.initialDeliverables.length > 0)
      ? projectData.initialDeliverables.map((title, idx) => ({
          id: 'del-' + Date.now() + '-' + idx,
          title,
          description: `Deliverable specifications for ${title}`,
          dueDate: projectData.deadline,
          status: 'pending' as DeliverableStatus,
          version: 1
        }))
      : [
          {
            id: 'del-' + Date.now() + '-1',
            title: 'Figma UI/UX Prototypes',
            description: 'Interactive wireframes & visual designs for all pages',
            dueDate: projectData.deadline,
            status: 'in_progress' as DeliverableStatus,
            version: 1
          },
          {
            id: 'del-' + Date.now() + '-2',
            title: 'Production Ready Source Code & Assets',
            description: 'Fully responsive code deployed on live staging server',
            dueDate: projectData.deadline,
            status: 'pending' as DeliverableStatus,
            version: 1
          }
        ];

    const newProject: Project = {
      id: 'prj-' + Date.now(),
      verificationCode: verCode,
      name: projectData.name,
      clientId: projectData.clientId,
      clientName: projectData.clientName,
      clientCompany: projectData.clientCompany,
      service: projectData.service,
      description: projectData.description,
      budget: projectData.budget,
      paidAmount: 0,
      progress: 15,
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      deadline: projectData.deadline,
      status: 'in_progress',
      paymentStructure: projectData.paymentStructure,
      workflowTemplate: projectData.workflowTemplate,
      milestones: initialMilestones,
      tasks: initialTasks,
      deliverables: initialDeliverableList,
      onboardingForm: {
        id: 'form-' + Date.now(),
        projectId: 'prj-' + Date.now(),
        title: `${projectData.clientCompany} Project Brief`,
        description: 'Please answer these questions to align our project goals and design direction.',
        isSent: true,
        isCompleted: false,
        questions: [
          { id: 'q-1', question: 'What is your primary goal for this project?', type: 'long_text', required: true },
          { id: 'q-2', question: 'Who is your ideal target audience?', type: 'long_text', required: true },
          { id: 'q-3', question: 'Please share links to 2-3 websites/designs you admire:', type: 'long_text', required: false },
          { id: 'q-4', question: 'Do you have existing brand colors and logo files ready?', type: 'multiple_choice', required: true, options: ['Yes, ready', 'In progress', 'Need help creating them'] }
        ]
      },
      agreement: {
        id: 'agr-' + Date.now(),
        projectId: 'prj-' + Date.now(),
        title: `${projectData.name} Service Agreement`,
        freelancerName: profile.name,
        clientName: projectData.clientName,
        companyName: projectData.clientCompany,
        scope: projectData.description,
        price: projectData.budget,
        timeline: `Target Delivery: ${projectData.deadline}`,
        revisionPolicy: '2 rounds of design revisions included prior to final sign-off.',
        paymentTerms: projectData.paymentStructure === '50_50' ? '50% advance deposit and 50% upon final deliverable approval.' : 'Milestone-based payouts as scheduled.',
        cancellationPolicy: 'Notice of 7 days in writing by either party.',
        ownership: '100% intellectual property ownership transfers to client upon final payment.',
        confidentiality: 'Strict mutual non-disclosure of business data.',
        status: 'freelancer_signed',
        freelancerSignature: `${profile.name} (Digital Sign)`,
        signedAt: new Date().toISOString().split('T')[0]
      },
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjects(prev => [newProject, ...prev]);

    // Update Client metrics
    setClients(prev => prev.map(c => {
      if (c.id === projectData.clientId) {
        return {
          ...c,
          projectCount: (c.projectCount || 0) + 1,
          status: 'active',
          lastActivity: 'Project created'
        };
      }
      return c;
    }));

    // Auto-create initial advance invoice
    const advanceAmount = projectData.paymentStructure === '50_50' ? projectData.budget / 2 : projectData.budget;
    addInvoice({
      projectId: newProject.id,
      projectName: newProject.name,
      clientId: newProject.clientId,
      clientName: newProject.clientName,
      clientCompany: newProject.clientCompany,
      clientEmail: `${newProject.clientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      items: [
        { id: 'it-' + Date.now(), description: `Project Kickoff & Advance Milestone for ${newProject.name}`, quantity: 1, unitPrice: advanceAmount }
      ],
      subtotal: advanceAmount,
      tax: 0,
      taxAmount: 0,
      discount: 0,
      totalAmount: advanceAmount,
      paidAmount: 0,
      status: 'sent',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Initial invoice generated upon project creation.'
    });

    logActivity(`Created new project workspace: "${newProject.name}" (₹${newProject.budget.toLocaleString()})`, 'project', newProject.id, newProject.name);
    addToast(`Project workspace created for "${newProject.name}"!`, 'success');
    triggerConfetti();

    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addToast('Project details updated', 'success');
  };

  const deleteProject = (id: string) => {
    const proj = projects.find(p => p.id === id);
    setProjects(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (selectedProjectId === id) {
        setSelectedProjectId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
    if (proj) {
      logActivity(`Deleted project "${proj.name}"`, 'project');
    }
    addToast(`Project "${proj?.name || ''}" permanently deleted`, 'info');
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  // Project Milestones & Tasks
  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString().split('T')[0] : undefined } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
        return {
          ...p,
          milestones: updatedMilestones,
          progress: newProgress
        };
      }
      return p;
    }));
    addToast('Milestone status updated', 'info');
  };

  const toggleTask = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedTasks = p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        return { ...p, tasks: updatedTasks };
      }
      return p;
    }));
  };

  // Deliverables & Approvals
  const addDeliverable = (projectId: string, del: { title: string; description: string; dueDate: string }) => {
    const newDel = {
      id: 'del-' + Date.now(),
      title: del.title,
      description: del.description,
      dueDate: del.dueDate,
      status: 'pending' as DeliverableStatus,
      version: 1
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          deliverables: [...p.deliverables, newDel]
        };
      }
      return p;
    }));

    logActivity(`Added deliverable "${del.title}"`, 'deliverable', projectId);
    addToast(`Deliverable "${del.title}" added`, 'success');
  };

  const updateDeliverableStatus = (projectId: string, deliverableId: string, status: DeliverableStatus, feedback?: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updated = p.deliverables.map(d => {
          if (d.id === deliverableId) {
            return {
              ...d,
              status,
              feedback: feedback || d.feedback,
              submittedAt: status === 'submitted' || status === 'in_review' ? new Date().toISOString().split('T')[0] : d.submittedAt,
              approvedAt: status === 'approved' ? new Date().toISOString().split('T')[0] : d.approvedAt
            };
          }
          return d;
        });

        // Recalculate progress based on deliverables
        const approvedCount = updated.filter(d => d.status === 'approved' || d.status === 'completed').length;
        const calcProgress = updated.length > 0 ? Math.round((approvedCount / updated.length) * 100) : p.progress;

        return {
          ...p,
          deliverables: updated,
          progress: Math.max(p.progress, calcProgress)
        };
      }
      return p;
    }));
  };

  const approveDeliverable = (projectId: string, deliverableId: string) => {
    const proj = projects.find(p => p.id === projectId);
    const del = proj?.deliverables.find(d => d.id === deliverableId);
    
    updateDeliverableStatus(projectId, deliverableId, 'approved', 'Client approved deliverable without changes.');
    triggerConfetti();
    
    if (proj && del) {
      logActivity(`${proj.clientName} (${proj.clientCompany}) approved deliverable: "${del.title}"`, 'approval', projectId, proj.name);
      addToast(`🎉 Deliverable "${del.title}" Approved!`, 'success');
    }
  };

  const requestDeliverableRevision = (projectId: string, deliverableId: string, feedback: string) => {
    const proj = projects.find(p => p.id === projectId);
    const del = proj?.deliverables.find(d => d.id === deliverableId);

    updateDeliverableStatus(projectId, deliverableId, 'revision_requested', feedback);
    if (proj && del) {
      logActivity(`Client requested revisions for: "${del.title}" — "${feedback}"`, 'deliverable', projectId, proj.name);
      addToast('Revision feedback logged and sent to freelancer', 'warning');
    }
  };

  const saveOnboardingQuestions = (projectId: string, questions: any[]) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.onboardingForm) {
        return {
          ...p,
          onboardingForm: {
            ...p.onboardingForm,
            questions
          }
        };
      }
      return p;
    }));
    addToast('Onboarding form updated successfully', 'success');
  };

  const signAgreementAsClient = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.agreement) {
        return {
          ...p,
          agreement: {
            ...p.agreement,
            status: 'completed',
            clientSignature: `${p.clientName} (Digital Signature Verified)`,
            signedAt: new Date().toISOString().split('T')[0]
          }
        };
      }
      return p;
    }));

    triggerConfetti();
    logActivity(`Agreement signed by client: "${proj.clientName}"`, 'document', projectId, proj.name);
    addToast('Agreement signed & executed successfully! Status: Completed', 'success');
  };

  const completeProjectWithTestimonial = (
    projectId: string,
    testimonialData: { rating: number; comment: string; allowPublicDisplay: boolean }
  ) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    const newTestimonial: Testimonial = {
      id: 'tst-' + Date.now(),
      projectId,
      clientName: proj.clientName,
      companyName: proj.clientCompany,
      rating: testimonialData.rating,
      comment: testimonialData.comment,
      allowPublicDisplay: testimonialData.allowPublicDisplay,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const verCode = proj.verificationCode || `VER-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'completed',
          progress: 100,
          paidAmount: p.budget,
          testimonial: newTestimonial,
          isVerified: true,
          verificationCode: verCode,
          verifiedAt: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));

    // Update Client Revenue & Status
    setClients(prev => prev.map(c => {
      if (c.id === proj.clientId) {
        return {
          ...c,
          totalRevenue: (c.totalRevenue || 0) + proj.budget,
          status: 'completed',
          lastActivity: 'Project completed'
        };
      }
      return c;
    }));

    // Update Profile stats
    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalProjects: prev.stats.totalProjects + 1,
        verifiedProjects: prev.stats.verifiedProjects + 1
      }
    }));

    triggerConfetti();
    logActivity(`Project marked completed & verified: "${proj.name}" (Code: ${verCode})`, 'project', projectId, proj.name);
    addToast(`🎉 Project completed! Verified code: ${verCode}`, 'success');
  };

  const generateCaseStudyForProject = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    const newCaseStudy: CaseStudy = {
      id: 'cs-' + Date.now(),
      projectId,
      title: `How We Scaled ${proj.clientCompany} with a Modern ${proj.service}`,
      category: proj.service,
      clientName: proj.clientCompany,
      challenge: `${proj.clientCompany} was experiencing operational bottlenecks and needed a tailored, high-converting digital solution with rapid turnaround.`,
      solution: `Designed and built an end-to-end bespoke solution featuring responsive UI/UX, robust frontend architecture, and seamless integrations.`,
      services: [proj.service, 'UI/UX Design', 'Full-Stack Development', 'Performance Optimization'],
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      deliverables: proj.deliverables.map(d => d.title),
      results: `Achieved 100% on-time milestone sign-off and received a ${proj.testimonial?.rating || 5}-star client rating.`,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      isPublished: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          caseStudy: newCaseStudy
        };
      }
      return p;
    }));

    triggerConfetti();
    logActivity(`Generated case study for "${proj.name}"`, 'document', projectId, proj.name);
    addToast('Case study generated and ready to publish!', 'success');
  };

  const togglePublishCaseStudy = (projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.caseStudy) {
        const nextState = !p.caseStudy.isPublished;
        return {
          ...p,
          caseStudy: {
            ...p.caseStudy,
            isPublished: nextState
          }
        };
      }
      return p;
    }));

    const proj = projects.find(p => p.id === projectId);
    if (proj?.caseStudy) {
      const willBePublished = !proj.caseStudy.isPublished;
      if (willBePublished) {
        addToast('Case study is now LIVE on your public portfolio!', 'success');
      } else {
        addToast('Case study unpublished to private draft.', 'info');
      }
    }
  };

  // Invoice Methods
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const invNum = `INV-${1000 + invoices.length + 1}`;
    const newInv: Invoice = {
      ...invoiceData,
      id: 'inv-' + Date.now(),
      invoiceNumber: invNum
    };

    setInvoices(prev => [newInv, ...prev]);
    logActivity(`Generated invoice ${invNum} for "${newInv.clientCompany}" (₹${newInv.totalAmount.toLocaleString()})`, 'invoice');
    addToast(`Invoice ${invNum} created`, 'success');
    return newInv;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    addToast('Invoice updated', 'success');
  };

  const deleteInvoice = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    setInvoices(prev => prev.filter(i => i.id !== id));
    if (inv) {
      logActivity(`Deleted invoice ${inv.invoiceNumber}`, 'invoice');
    }
    addToast('Invoice deleted', 'info');
  };

  const markInvoiceAsPaid = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    setInvoices(prev => prev.map(i => {
      if (i.id === id) {
        return {
          ...i,
          status: 'paid',
          paidAmount: i.totalAmount,
          paidAt: new Date().toISOString().split('T')[0]
        };
      }
      return i;
    }));

    // Update project paid amount
    setProjects(prev => prev.map(p => {
      if (p.id === inv.projectId) {
        return {
          ...p,
          paidAmount: Math.min(p.budget, p.paidAmount + inv.totalAmount)
        };
      }
      return p;
    }));

    // Update client total revenue
    setClients(prev => prev.map(c => {
      if (c.id === inv.clientId) {
        return {
          ...c,
          totalRevenue: (c.totalRevenue || 0) + inv.totalAmount,
          lastActivity: 'Payment cleared'
        };
      }
      return c;
    }));

    triggerConfetti();
    logActivity(`Invoice ${inv.invoiceNumber} marked as PAID (₹${inv.totalAmount.toLocaleString()})`, 'invoice', inv.projectId, inv.projectName);
    addToast(`💰 Invoice ${inv.invoiceNumber} marked as PAID! Revenue updated.`, 'success');
  };

  // Templates
  const addTemplate = (templateData: Omit<TemplateItem, 'id'>) => {
    const newTpl: TemplateItem = {
      ...templateData,
      id: 'tpl-' + Date.now()
    };
    setTemplates(prev => [newTpl, ...prev]);
    addToast(`Template "${newTpl.title}" saved`, 'success');
  };

  const updateTemplate = (id: string, updates: Partial<TemplateItem>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    addToast('Template updated', 'success');
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    addToast('Template deleted', 'info');
  };

  // Document Methods
  const addDocument = (docData: Omit<ProfessionalDocument, 'id' | 'createdAt' | 'updatedAt'>): ProfessionalDocument => {
    const newDoc: ProfessionalDocument = {
      ...docData,
      id: 'doc-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
    logActivity(`Created document "${newDoc.title}" for ${newDoc.clientCompany || 'Client'}`, 'document', newDoc.projectId, newDoc.projectName);
    addToast(`Document "${newDoc.title}" created successfully`, 'success');
    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<ProfessionalDocument>) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : d));
    addToast('Document updated successfully', 'success');
  };

  const deleteDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDocumentId === id) {
      setSelectedDocumentId(null);
    }
    if (doc) {
      logActivity(`Deleted document "${doc.title}"`, 'document', doc.projectId, doc.projectName);
    }
    addToast('Document permanently removed', 'info');
  };

  const duplicateDocument = (id: string): ProfessionalDocument => {
    const doc = documents.find(d => d.id === id);
    if (!doc) throw new Error('Document not found');

    const duplicated: ProfessionalDocument = {
      ...JSON.parse(JSON.stringify(doc)),
      id: 'doc-' + Date.now(),
      title: `${doc.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setDocuments(prev => [duplicated, ...prev]);
    logActivity(`Duplicated document "${doc.title}"`, 'document', doc.projectId, doc.projectName);
    addToast(`Duplicated "${doc.title}"`, 'success');
    return duplicated;
  };

  const saveDocumentAsTemplate = (docId: string, templateName: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    const tplDoc: ProfessionalDocument = {
      ...JSON.parse(JSON.stringify(doc)),
      id: 'doc-tpl-' + Date.now(),
      isTemplate: true,
      templateName: templateName || `${doc.title} Template`,
      status: 'published',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setDocuments(prev => [tplDoc, ...prev]);
    logActivity(`Saved "${doc.title}" as reusable template: "${tplDoc.templateName}"`, 'document');
    addToast(`Template "${tplDoc.templateName}" saved to templates library!`, 'success');
  };

  const sendDocumentToClient = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'sent', updatedAt: new Date().toISOString().split('T')[0] } : d));
    logActivity(`Sent document "${doc.title}" to ${doc.clientCompany || 'Client'}`, 'document', doc.projectId, doc.projectName);
    addToast(`Document "${doc.title}" sent to client portal!`, 'success');
  };

  const signDocumentAsClient = (docId: string, clientSignName: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        if (d.data.type === 'client_agreement') {
          return {
            ...d,
            status: 'accepted',
            updatedAt: new Date().toISOString().split('T')[0],
            data: {
              ...d.data,
              payload: {
                ...d.data.payload,
                clientSignature: `${clientSignName} (Digitally Signed)`,
                clientSignedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              }
            }
          };
        }
        return { ...d, status: 'completed', updatedAt: new Date().toISOString().split('T')[0] };
      }
      return d;
    }));

    triggerConfetti();
    logActivity(`Client electronically accepted agreement: "${doc.title}"`, 'approval', doc.projectId, doc.projectName);
    addToast(`Agreement signed & accepted by ${clientSignName}!`, 'success');
  };

  const submitOnboardingFormAsClient = (docId: string, formData: OnboardingFormData) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    setDocuments(prev => prev.map(d => {
      if (d.id === docId && d.data.type === 'onboarding_form') {
        return {
          ...d,
          status: 'completed',
          updatedAt: new Date().toISOString().split('T')[0],
          data: {
            type: 'onboarding_form',
            payload: formData
          }
        };
      }
      return d;
    }));

    triggerConfetti();
    logActivity(`Client submitted Onboarding Form: "${doc.projectName || doc.title}"`, 'document', doc.projectId, doc.projectName);
    addToast('Onboarding form submitted successfully to freelancer!', 'success');
  };

  // Walkthrough navigation
  const goToWalkthroughStep = (index: number) => {
    if (index >= 0 && index < walkthroughSteps.length) {
      setCurrentWalkthroughStep(index);
      const step = walkthroughSteps[index];
      if (step.view) setActiveView(step.view);
      if (step.projectId) setSelectedProjectId(step.projectId);
      if (step.tab) setActiveProjectTab(step.tab);
    }
  };

  const completeWalkthroughStep = (stepId: string) => {
    setWalkthroughSteps(prev => prev.map(s => s.id === stepId ? { ...s, completed: true } : s));
  };

  // Reset Data to Pristine Demo
  const resetToDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setProfile(initialFreelancerProfile);
    setClients(initialClients);
    setProjects(initialProjects);
    setLeads(initialLeads);
    setInvoices(initialInvoices);
    setDocuments(initialDocuments);
    setActivities(initialActivities);
    setNotifications(initialNotifications);
    setTemplates(initialTemplates);
    setWalkthroughSteps(initialWalkthroughSteps);
    setSelectedProjectId('prj-1');
    setSelectedDocumentId(null);
    setActiveView('dashboard');
    addToast('Demo data restored to initial state ✨', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProjectId,
        setSelectedProjectId,
        selectedClientId,
        setSelectedClientId,
        selectedVerificationCode,
        setSelectedVerificationCode,
        activeProjectTab,
        setActiveProjectTab,
        isAuthenticated,
        loginDemoUser,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isSearchOpen,
        setIsSearchOpen,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        preselectedLeadForProject,
        setPreselectedLeadForProject,
        profile,
        updateProfile,
        setAvailability,
        leads,
        addLead,
        updateLead,
        deleteLead,
        moveLeadStage,
        convertLeadToProject,
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        toggleMilestone,
        toggleTask,
        addDeliverable,
        updateDeliverableStatus,
        approveDeliverable,
        requestDeliverableRevision,
        saveOnboardingQuestions,
        signAgreementAsClient,
        completeProjectWithTestimonial,
        generateCaseStudyForProject,
        togglePublishCaseStudy,
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markInvoiceAsPaid,
        documents,
        selectedDocumentId,
        setSelectedDocumentId,
        addDocument,
        updateDocument,
        deleteDocument,
        duplicateDocument,
        saveDocumentAsTemplate,
        sendDocumentToClient,
        signDocumentAsClient,
        submitOnboardingFormAsClient,
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        activities,
        logActivity,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        toasts,
        addToast,
        removeToast,
        walkthroughSteps,
        isWalkthroughActive,
        setIsWalkthroughActive,
        currentWalkthroughStep,
        goToWalkthroughStep,
        completeWalkthroughStep,
        activeClientSession,
        setActiveClientSession,
        clientLogin,
        clientLogout,
        sendClientInvitation,
        revokeClientPortalAccess,
        deleteClientWithProjectChoice,
        convertLeadToClient,
        addProjectMessage,
        resetToDemoData,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
