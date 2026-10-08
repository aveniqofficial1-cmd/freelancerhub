import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  FolderKanban,
  Receipt,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Building,
  MoreVertical,
  UserCheck,
  Send,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Archive,
  CheckCircle2,
  Lock,
  Tag,
  Eye,
  FileSignature
} from 'lucide-react';
import { Client, Project, ClientStatus, PortalInvitationStatus } from '../types';
import { InviteClientModal } from '../components/modals/InviteClientModal';
import { DeleteClientModal } from '../components/modals/DeleteClientModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';

export const ClientsView: React.FC = () => {
  const {
    clients,
    projects,
    invoices,
    activities,
    addClient,
    updateClient,
    deleteClient,
    deleteClientWithProjectChoice,
    deleteProject,
    sendClientInvitation,
    revokeClientPortalAccess,
    clientLogin,
    selectedClientId,
    setSelectedClientId,
    setSelectedProjectId,
    setActiveView,
    setActiveProjectTab,
    setIsCreateProjectOpen,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'documents' | 'payments' | 'activity'>('overview');

  // Modal States
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [inviteModalClient, setInviteModalClient] = useState<Client | null>(null);
  const [deleteModalClient, setDeleteModalClient] = useState<Client | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // 3-dot dropdown menu state
  const [activeMenuClientId, setActiveMenuClientId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuClientId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form State for Add / Edit
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState('Direct / Website');
  const [clientStatus, setClientStatus] = useState<ClientStatus>('active');

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    if (!matchesSearch) return false;
    if (selectedStatusFilter === 'all') return true;
    if (selectedStatusFilter === 'active') return c.status === 'active';
    if (selectedStatusFilter === 'invited') return c.portalStatus === 'invitation_sent' || c.portalStatus === 'portal_activated';
    if (selectedStatusFilter === 'pending_invitation') return c.portalStatus === 'not_invited' || c.status === 'pending_invitation';
    if (selectedStatusFilter === 'completed') return c.status === 'completed';
    if (selectedStatusFilter === 'archived') return c.status === 'archived';
    return true;
  });

  const activeClient = clients.find(c => c.id === selectedClientId) || filteredClients[0] || clients[0];

  const clientProjects = activeClient
    ? projects.filter(p => p.clientId === activeClient.id || p.clientCompany.toLowerCase() === activeClient.company.toLowerCase())
    : [];

  const activeProjectsCount = clientProjects.filter(p => p.status === 'in_progress' || p.status === 'review').length;
  const completedProjectsCount = clientProjects.filter(p => p.status === 'completed').length;

  const clientInvoices = activeClient
    ? invoices.filter(i => i.clientId === activeClient.id || i.clientCompany.toLowerCase() === activeClient.company.toLowerCase())
    : [];

  const totalPaid = clientInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPending = clientInvoices.filter(i => i.status === 'sent' || i.status === 'draft').reduce((sum, i) => sum + i.totalAmount, 0);
  const totalOverdue = clientInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.totalAmount, 0);

  const clientActivities = activeClient
    ? activities.filter(a => {
        const matchesClient = a.description.toLowerCase().includes(activeClient.company.toLowerCase()) ||
          a.description.toLowerCase().includes(activeClient.name.toLowerCase());
        const matchesProj = clientProjects.some(p => p.id === a.projectId);
        return matchesClient || matchesProj;
      })
    : [];

  const handleOpenAdd = () => {
    setEditingClient(null);
    setName('');
    setCompany('');
    setEmail('');
    setPhone('+91 ');
    setAddress('Hyderabad, India');
    setNotes('');
    setSource('Direct / Referral');
    setClientStatus('active');
    setIsAddClientModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setCompany(client.company);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address || 'Hyderabad, India');
    setNotes(client.notes || '');
    setSource(client.source || 'Direct');
    setClientStatus(client.status);
    setIsAddClientModalOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient.id, {
        name,
        company,
        email,
        phone,
        address,
        notes,
        source,
        status: clientStatus
      });
    } else {
      addClient({
        name,
        company,
        email,
        phone,
        address,
        notes,
        source,
        status: clientStatus,
        portalStatus: 'not_invited'
      });
    }
    setIsAddClientModalOpen(false);
  };

  const handleSendInvite = (clientId: string, clientEmail: string, inviteMsg: string) => {
    sendClientInvitation(clientId, clientEmail, inviteMsg);
  };

  const handleOpenPortalAsClient = (client: Client) => {
    clientLogin(client.email, '1234');
    setActiveView('client_portal');
  };

  const getPortalStatusBadge = (portalStatus?: PortalInvitationStatus) => {
    switch (portalStatus) {
      case 'portal_activated':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Portal Activated</span>
          </span>
        );
      case 'invitation_sent':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            <Send className="w-3 h-3 text-sky-600" />
            <span>Invitation Sent</span>
          </span>
        );
      case 'access_revoked':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <Lock className="w-3 h-3 text-rose-600" />
            <span>Access Revoked</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Not Invited</span>
          </span>
        );
    }
  };

  const getClientStatusBadge = (status: ClientStatus) => {
    const map = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      invited: 'bg-sky-100 text-sky-800 border-sky-200',
      pending_invitation: 'bg-amber-100 text-amber-800 border-amber-200',
      completed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      archived: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${map[status] || map.active}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Clients Management</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {clients.length} Total Clients
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage client profiles, send passwordless portal invitations, track projects, deliverables, documents, and payments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Clients', count: clients.length },
            { id: 'active', label: 'Active', count: clients.filter(c => c.status === 'active').length },
            { id: 'invited', label: 'Invited / Activated', count: clients.filter(c => c.portalStatus === 'invitation_sent' || c.portalStatus === 'portal_activated').length },
            { id: 'pending_invitation', label: 'Pending Invite', count: clients.filter(c => c.portalStatus === 'not_invited' || c.status === 'pending_invitation').length },
            { id: 'completed', label: 'Completed', count: clients.filter(c => c.status === 'completed').length },
            { id: 'archived', label: 'Archived', count: clients.filter(c => c.status === 'archived').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedStatusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedStatusFilter === tab.id ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, email..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Client Directory on Left + Deep Client Profile Workspace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Client Directory Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Client Directory ({filteredClients.length})</span>
            <span>Lifetime Revenue</span>
          </div>

          <div className="space-y-2.5 max-h-[80vh] overflow-y-auto pr-1">
            {filteredClients.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No clients found matching your search filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatusFilter('all');
                  }}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredClients.map(c => {
                const isSelected = activeClient?.id === c.id;
                const isMenuOpen = activeMenuClientId === c.id;
                const projs = projects.filter(p => p.clientId === c.id || p.clientCompany.toLowerCase() === c.company.toLowerCase());
                const actCount = projs.filter(p => p.status === 'in_progress').length;
                const compCount = projs.filter(p => p.status === 'completed').length;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClientId(c.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                          {c.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-slate-900 truncate">{c.company}</h3>
                          <p className="text-[11px] text-slate-500 font-medium truncate">{c.name}</p>
                        </div>
                      </div>

                      {/* 3-dot dropdown menu */}
                      <div className="relative shrink-0" ref={isMenuOpen ? menuRef : null}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuClientId(isMenuOpen ? null : c.id);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Client Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-30 animate-scale-up text-left">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuClientId(null);
                                setSelectedClientId(c.id);
                              }}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>View Client</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuClientId(null);
                                handleOpenEdit(c);
                              }}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                              <span>Edit Client</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuClientId(null);
                                setInviteModalClient(c);
                              }}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                            >
                              <Send className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Invite to Portal</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuClientId(null);
                                setSelectedClientId(c.id);
                                setActiveTab('projects');
                              }}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <FolderKanban className="w-3.5 h-3.5 text-slate-500" />
                              <span>View Projects ({projs.length})</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuClientId(null);
                                updateClient(c.id, {
                                  status: c.status === 'archived' ? 'active' : 'archived'
                                });
                                addToast(c.status === 'archived' ? 'Client restored to active' : 'Client archived', 'info');
                              }}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Archive className="w-3.5 h-3.5 text-slate-500" />
                              <span>{c.status === 'archived' ? 'Restore Client' : 'Archive Client'}</span>
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuClientId(null);
                                setDeleteModalClient(c);
                              }}
                              className="w-full px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete Client</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                      {getClientStatusBadge(c.status)}
                      {getPortalStatusBadge(c.portalStatus)}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>
                        {projs.length} Proj ({actCount} active • {compCount} done)
                      </span>
                      <span className="font-bold text-slate-900">
                        ₹{(c.totalRevenue || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column (2 spans): Deep Client Profile Workspace */}
        {activeClient ? (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
            {/* Top Client Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
                  {activeClient.company.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{activeClient.company}</h2>
                    {getClientStatusBadge(activeClient.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Primary Contact: <strong className="text-slate-800">{activeClient.name}</strong> • Client ID: <span className="font-mono">{activeClient.id}</span> • Joined {activeClient.joinedDate}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {getPortalStatusBadge(activeClient.portalStatus)}
                    {activeClient.invitationSentAt && (
                      <span className="text-[11px] text-slate-400">
                        Sent on {activeClient.invitationSentAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => setInviteModalClient(activeClient)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{activeClient.portalStatus === 'portal_activated' ? 'Manage Portal' : 'Invite Client'}</span>
                </button>

                <button
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Project</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(activeClient)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Edit Client Profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDeleteModalClient(activeClient)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                  title="Delete Client"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Client Portal Status Banner Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50/50 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-sky-950">
                    Client Portal Access & Workspace
                  </span>
                  {getPortalStatusBadge(activeClient.portalStatus)}
                </div>
                <p className="text-[11px] text-slate-600">
                  {activeClient.portalStatus === 'portal_activated'
                    ? `✓ Client Portal Activated on ${activeClient.portalActivatedAt || 'Recent login'}. Client has full passwordless access.`
                    : activeClient.portalStatus === 'invitation_sent'
                    ? `Invitation sent to ${activeClient.email}. Client can log in using email & OTP.`
                    : 'Client has not been invited yet. Send an invitation to give them direct workspace access.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeClient.portalStatus !== 'not_invited' && (
                  <button
                    onClick={() => {
                      const inviteUrl = `https://freelancerhub.com/portal/login?client=${encodeURIComponent(activeClient.email)}`;
                      navigator.clipboard.writeText(inviteUrl);
                      addToast('Invitation link copied to clipboard!', 'success');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>
                )}

                <button
                  onClick={() => handleOpenPortalAsClient(activeClient)}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Client Portal</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs for Client Details */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
              {[
                { id: 'overview', label: 'Overview & Info', icon: UserCheck },
                { id: 'projects', label: `Projects (${clientProjects.length})`, icon: FolderKanban },
                { id: 'documents', label: 'Documents & Contracts', icon: FileText },
                { id: 'payments', label: `Billing & Payments (${clientInvoices.length})`, icon: Receipt },
                { id: 'activity', label: 'Activity History', icon: Clock }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Overview & Info */}
            {activeTab === 'overview' && (
              <div className="space-y-5 animate-fade-in">
                {/* Contact & Financial Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                    </div>
                    <div className="font-bold text-slate-800 truncate select-all">{activeClient.email}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                    </div>
                    <div className="font-bold text-slate-800 select-all">{activeClient.phone}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> Lifetime Revenue
                    </div>
                    <div className="font-black text-emerald-700 text-base">₹{(activeClient.totalRevenue || 0).toLocaleString()}</div>
                  </div>
                </div>

                {/* Additional Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location / Address
                    </span>
                    <p className="text-slate-800 font-medium">{activeClient.address || 'Hyderabad, India'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" /> Lead Source / Acquisition
                    </span>
                    <p className="text-slate-800 font-medium">{activeClient.source || 'Direct Client'}</p>
                  </div>
                </div>

                {/* Client Notes & Project Requirement */}
                {activeClient.notes && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> Client Notes & Requirement:
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">{activeClient.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Projects List with Individual Delete */}
            {activeTab === 'projects' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Associated Project Workspaces ({clientProjects.length})
                  </h3>
                  <button
                    onClick={() => setIsCreateProjectOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                <div className="space-y-3">
                  {clientProjects.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-slate-50 text-xs text-slate-500 text-center border border-dashed border-slate-200 space-y-2">
                      <FolderKanban className="w-8 h-8 text-slate-300 mx-auto" />
                      <p>No projects created for this client yet.</p>
                      <button
                        onClick={() => setIsCreateProjectOpen(true)}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        Create first project for {activeClient.company}
                      </button>
                    </div>
                  ) : (
                    clientProjects.map(p => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs group"
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            setActiveView('project_workspace');
                            setActiveProjectTab('overview');
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white text-slate-700 border border-slate-200 uppercase">
                              {p.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Service: <strong className="text-slate-700">{p.service}</strong> • Budget: ₹{p.budget.toLocaleString()} • Progress: {p.progress}% • Due: {p.deadline}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProjectId(p.id);
                              setActiveView('project_workspace');
                              setActiveProjectTab('overview');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setProjectToDelete(p)}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Delete this project separately"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-slate-900">Proposals & Service Agreements</h3>

                <div className="space-y-3">
                  {clientProjects.map(p => (
                    <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 flex items-center gap-2">
                          <FileSignature className="w-4 h-4 text-emerald-600" />
                          {p.name} - Service Agreement
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {p.agreement?.status || 'Active'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">
                        "{p.agreement?.scope || p.description}"
                      </p>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                        <span>Price: ₹{p.budget.toLocaleString()}</span>
                        <span>Client Signature: {p.agreement?.clientSignature ? '✓ Verified' : 'Pending Client Sign'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Payments */}
            {activeTab === 'payments' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-0.5">
                    <div className="text-emerald-800 font-medium">Total Paid</div>
                    <div className="text-base font-black text-emerald-950">₹{totalPaid.toLocaleString()}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-0.5">
                    <div className="text-amber-800 font-medium">Pending Invoices</div>
                    <div className="text-base font-black text-amber-950">₹{totalPending.toLocaleString()}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-0.5">
                    <div className="text-rose-800 font-medium">Overdue</div>
                    <div className="text-base font-black text-rose-950">₹{totalOverdue.toLocaleString()}</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-900">Invoices List ({clientInvoices.length})</h4>
                  {clientInvoices.map(inv => (
                    <div key={inv.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                        <span className="text-slate-500 ml-2">Due: {inv.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">₹{inv.totalAmount.toLocaleString()}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Activity History */}
            {activeTab === 'activity' && (
              <div className="space-y-3 animate-fade-in">
                <h3 className="text-sm font-bold text-slate-900">Recent Client Activity Stream</h3>
                <div className="space-y-2">
                  {clientActivities.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                      No activity recorded for this client yet.
                    </div>
                  ) : (
                    clientActivities.map(act => (
                      <div key={act.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-slate-800 font-medium">{act.description}</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-2 py-16 px-6 text-center bg-white border border-slate-200 rounded-3xl space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Client Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a client from the directory on the left or add a new client to start tracking workspaces, invitations, and billing.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm inline-flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Client</span>
            </button>
          </div>
        )}
      </div>

      {/* Invite Client Modal */}
      {inviteModalClient && (
        <InviteClientModal
          isOpen={!!inviteModalClient}
          client={inviteModalClient}
          onClose={() => setInviteModalClient(null)}
          onSendInvite={handleSendInvite}
          onOpenPortalAsClient={handleOpenPortalAsClient}
        />
      )}

      {/* Delete Client Modal (With Option 1 / Option 2) */}
      {deleteModalClient && (
        <DeleteClientModal
          isOpen={!!deleteModalClient}
          client={deleteModalClient}
          associatedProjects={projects.filter(p => p.clientId === deleteModalClient.id || p.clientCompany.toLowerCase() === deleteModalClient.company.toLowerCase())}
          onClose={() => setDeleteModalClient(null)}
          onDeleteClientAndProjects={(id) => {
            deleteClientWithProjectChoice(id, 'delete_all');
            setDeleteModalClient(null);
          }}
          onDeleteClientKeepProjects={(id) => {
            deleteClientWithProjectChoice(id, 'keep_projects');
            setDeleteModalClient(null);
          }}
        />
      )}

      {/* Delete Project Separately Modal */}
      {projectToDelete && (
        <DeleteConfirmationModal
          isOpen={!!projectToDelete}
          title="Delete this project?"
          message="This will permanently delete this project and its associated project data. The client account will remain active."
          itemName={projectToDelete.name}
          itemDetails={`Budget: ₹${projectToDelete.budget.toLocaleString()} • Status: ${projectToDelete.status}`}
          confirmButtonText="Delete Project"
          onCancel={() => setProjectToDelete(null)}
          onConfirm={() => {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }}
        />
      )}

      {/* Add / Edit Client Modal */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingClient ? 'Edit Client Profile' : 'Add New Client Profile'}
              </h3>
              <button onClick={() => setIsAddClientModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. ABC Gym"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Contact Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abcgym@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={clientStatus}
                    onChange={(e) => setClientStatus(e.target.value as ClientStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="invited">Invited</option>
                    <option value="pending_invitation">Pending Invitation</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Source</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Direct, Instagram..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address / Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Hyderabad, India"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Requirements</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key background notes about client..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  {editingClient ? 'Save Changes' : 'Create Client Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
