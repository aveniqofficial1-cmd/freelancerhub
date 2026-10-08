import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  IndianRupee,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
  MoveRight,
  Filter,
  MoreVertical,
  Eye,
  UserCheck
} from 'lucide-react';
import { Lead, LeadStage, LostReason } from '../types';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { ViewLeadModal } from '../components/modals/ViewLeadModal';

export const LeadsView: React.FC = () => {
  const {
    leads,
    addLead,
    updateLead,
    deleteLead,
    moveLeadStage,
    convertLeadToProject,
    convertLeadToClient
  } = useApp();

  // Modals state
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Three-dot dropdown menu state
  const [activeMenuLeadId, setActiveMenuLeadId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuLeadId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form state
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(25000);
  const [source, setSource] = useState('Instagram');
  const [stage, setStage] = useState<LeadStage>('new');
  const [notes, setNotes] = useState('');

  // Lost Reason Modal State
  const [lostModalLeadId, setLostModalLeadId] = useState<string | null>(null);
  const [lostReason, setLostReason] = useState<LostReason>('Price');
  const [lostNotes, setLostNotes] = useState('');

  // Won Modal Prompt State
  const [wonLeadPrompt, setWonLeadPrompt] = useState<Lead | null>(null);

  const stages: { id: LeadStage; label: string; color: string; badgeColor: string }[] = [
    { id: 'new', label: 'New Inquiries', color: 'border-blue-200', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'contacted', label: 'Contacted', color: 'border-cyan-200', badgeColor: 'bg-cyan-100 text-cyan-800' },
    { id: 'meeting', label: 'Meeting Scheduled', color: 'border-amber-200', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'proposal_sent', label: 'Proposal Sent', color: 'border-indigo-200', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'negotiation', label: 'Negotiation', color: 'border-purple-200', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'won', label: 'Won & Ready', color: 'border-emerald-200', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'lost', label: 'Lost Deals', color: 'border-rose-200', badgeColor: 'bg-rose-100 text-rose-800' }
  ];

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setClientName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setProjectTitle('');
    setEstimatedValue(25000);
    setSource('Instagram');
    setStage('new');
    setNotes('');
    setIsAddLeadOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setClientName(lead.clientName);
    setCompanyName(lead.companyName);
    setEmail(lead.email);
    setPhone(lead.phone || '');
    setProjectTitle(lead.projectTitle);
    setEstimatedValue(lead.estimatedValue);
    setSource(lead.source);
    setStage(lead.stage);
    setNotes(lead.notes || '');
    setIsAddLeadOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      updateLead(editingLead.id, {
        clientName,
        companyName,
        email,
        phone,
        projectTitle,
        estimatedValue: Number(estimatedValue),
        source,
        stage,
        notes
      });
    } else {
      addLead({
        clientName,
        companyName,
        email,
        phone,
        projectTitle,
        estimatedValue: Number(estimatedValue),
        source,
        stage,
        notes
      });
    }
    setIsAddLeadOpen(false);
  };

  const handleStageChange = (leadId: string, nextStage: LeadStage) => {
    if (nextStage === 'lost') {
      setLostModalLeadId(leadId);
      return;
    }

    moveLeadStage(leadId, nextStage);

    if (nextStage === 'won') {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        setWonLeadPrompt(lead);
      }
    }
  };

  const handleConfirmLost = () => {
    if (lostModalLeadId) {
      moveLeadStage(lostModalLeadId, 'lost', lostReason, lostNotes);
      setLostModalLeadId(null);
      setLostNotes('');
    }
  };

  const handleDeleteLeadConfirm = () => {
    if (leadToDelete) {
      deleteLead(leadToDelete.id);
      setLeadToDelete(null);
    }
  };

  const totalPipelineValue = leads
    .filter(l => l.stage !== 'lost')
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              CRM Leads Pipeline
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Pipeline Value: ₹{totalPipelineValue.toLocaleString()}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture, nurture, and convert freelance leads into signed client workspaces.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Kanban Pipeline or Empty State */}
      {leads.length === 0 ? (
        <div className="py-16 px-6 text-center bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">No leads yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Add your first lead to start managing your opportunities.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Lead</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x">
          {stages.map(stg => {
            const leadsInStage = leads.filter(l => l.stage === stg.id);
            const stageValue = leadsInStage.reduce((sum, l) => sum + l.estimatedValue, 0);

            return (
              <div
                key={stg.id}
                className="w-72 sm:w-80 shrink-0 bg-slate-100/70 border border-slate-200 rounded-3xl p-3.5 flex flex-col max-h-[78vh] snap-start shadow-2xs"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{stg.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${stg.badgeColor}`}>
                      {leadsInStage.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-600">
                    ₹{stageValue.toLocaleString()}
                  </span>
                </div>

                {/* Cards list */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {leadsInStage.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-2xl bg-white/50">
                      No leads in this stage
                    </div>
                  ) : (
                    leadsInStage.map(lead => {
                      const isMenuOpen = activeMenuLeadId === lead.id;

                      return (
                        <div
                          key={lead.id}
                          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-sm space-y-2.5 group relative"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 
                                onClick={() => setViewingLead(lead)}
                                className="text-xs font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors truncate"
                                title="Click to view details"
                              >
                                {lead.companyName}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium truncate">
                                {lead.projectTitle}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-xs font-black text-emerald-700">
                                ₹{lead.estimatedValue.toLocaleString()}
                              </span>

                              {/* Three-dot action menu */}
                              <div className="relative" ref={isMenuOpen ? menuRef : null}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuLeadId(isMenuOpen ? null : lead.id);
                                  }}
                                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                  title="Lead Actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {isMenuOpen && (
                                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-30 animate-scale-up text-left">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuLeadId(null);
                                        setViewingLead(lead);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                                      <span>View</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuLeadId(null);
                                        handleOpenEditModal(lead);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                      <span>Edit</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuLeadId(null);
                                        convertLeadToClient(lead.id);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                                    >
                                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Convert to Client</span>
                                    </button>

                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuLeadId(null);
                                        setLeadToDelete(lead);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-medium">
                            <span>Contact: <strong className="text-slate-800">{lead.clientName}</strong></span>
                            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">
                              {lead.source}
                            </span>
                          </div>

                          {lead.notes && (
                            <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-xl border border-slate-200 line-clamp-2">
                              "{lead.notes}"
                            </p>
                          )}

                          {/* Lost reason badge */}
                          {lead.stage === 'lost' && lead.lostReason && (
                            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-medium">
                              <strong>Lost Reason:</strong> {lead.lostReason}
                              {lead.lostNotes && <span className="block text-[10px] text-rose-600 mt-0.5">{lead.lostNotes}</span>}
                            </div>
                          )}

                          {/* Stage Action Controls */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <select
                              value={lead.stage}
                              onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)}
                              className="text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-2 py-1 focus:border-emerald-600 focus:outline-none"
                            >
                              {stages.map(s => (
                                <option key={s.id} value={s.id}>Move: {s.label}</option>
                              ))}
                            </select>

                            <div className="flex items-center gap-1">
                              {lead.stage === 'won' && (
                                <button
                                  onClick={() => convertLeadToClient(lead.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                                  title="Convert to Client"
                                >
                                  <Sparkles className="w-3 h-3" /> Convert to Client
                                </button>
                              )}

                              <button
                                onClick={() => setViewingLead(lead)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                                title="View Details"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(lead)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setLeadToDelete(lead)}
                                className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Won Conversion Prompt Modal */}
      {wonLeadPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Convert Lead to Client?</h3>
                <p className="text-xs text-slate-500">"{wonLeadPrompt.companyName}" was marked as WON!</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Automatically create a verified client profile with contact details, company information, lead source, and requirement notes copied directly into your Clients directory.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setWonLeadPrompt(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800"
              >
                Later
              </button>
              <button
                onClick={() => {
                  convertLeadToClient(wonLeadPrompt.id);
                  setWonLeadPrompt(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Convert to Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lost Reason Modal */}
      {lostModalLeadId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Why was this project lost?</h3>
                <p className="text-xs text-slate-500">Help improve your conversion rate analytics</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Reason</label>
                <select
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value as LostReason)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Price">Price (Budget too high)</option>
                  <option value="Timeline">Timeline (Client wanted faster delivery)</option>
                  <option value="Client chose competitor">Client chose competitor</option>
                  <option value="Client cancelled">Client cancelled initiative</option>
                  <option value="No response">No response / Ghosted</option>
                  <option value="Requirements changed">Requirements changed</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  value={lostNotes}
                  onChange={(e) => setLostNotes(e.target.value)}
                  placeholder="e.g. Budget was ₹15k vs proposal ₹25k..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setLostModalLeadId(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLost}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Log as Lost
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Lead Modal */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingLead ? 'Edit Lead' : 'Add New Client Lead'}
              </h3>
              <button onClick={() => setIsAddLeadOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. ABC Gym & Fitness"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Vikram Mehta"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@abcgym.com"
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Focus *</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Membership Booking Website"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Referral">Referral</option>
                    <option value="Website">Website</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as LeadStage)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none font-medium"
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key notes from initial conversation..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  {editingLead ? 'Update Lead' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Lead Details Modal */}
      <ViewLeadModal
        lead={viewingLead}
        isOpen={Boolean(viewingLead)}
        onClose={() => setViewingLead(null)}
        onEdit={(ld) => {
          setViewingLead(null);
          handleOpenEditModal(ld);
        }}
        onConvert={(lid) => {
          setViewingLead(null);
          convertLeadToProject(lid);
        }}
        onDelete={(ld) => {
          setViewingLead(null);
          setLeadToDelete(ld);
        }}
      />

      {/* Delete Lead Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(leadToDelete)}
        title="Delete this lead?"
        message="This action will permanently remove this lead and its associated information. This cannot be undone."
        itemName={leadToDelete ? leadToDelete.companyName : undefined}
        itemDetails={leadToDelete ? `Contact: ${leadToDelete.clientName} • Value: ₹${leadToDelete.estimatedValue.toLocaleString()} • Stage: ${leadToDelete.stage.replace('_', ' ').toUpperCase()}` : undefined}
        confirmButtonText="Delete Lead"
        onConfirm={handleDeleteLeadConfirm}
        onCancel={() => setLeadToDelete(null)}
      />
    </div>
  );
};
