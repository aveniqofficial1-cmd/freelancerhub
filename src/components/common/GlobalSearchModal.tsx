import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  FolderKanban,
  Users,
  TrendingUp,
  Receipt,
  ArrowRight,
  Sparkles,
  Building,
  Mail,
  Phone,
  CheckCircle2
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    clients,
    projects,
    leads,
    invoices,
    setActiveView,
    setSelectedProjectId,
    setSelectedClientId,
    setActiveProjectTab,
    setIsCreateProjectOpen
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'clients' | 'projects' | 'leads' | 'invoices'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveCategory('all');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Robust Search Matchers
  const filteredClients = clients.filter(c =>
    !cleanQuery ||
    c.name.toLowerCase().includes(cleanQuery) ||
    c.company.toLowerCase().includes(cleanQuery) ||
    c.email.toLowerCase().includes(cleanQuery) ||
    c.phone.includes(cleanQuery) ||
    (c.notes && c.notes.toLowerCase().includes(cleanQuery))
  );

  const filteredProjects = projects.filter(p =>
    !cleanQuery ||
    p.name.toLowerCase().includes(cleanQuery) ||
    p.clientCompany.toLowerCase().includes(cleanQuery) ||
    p.clientName.toLowerCase().includes(cleanQuery) ||
    p.service.toLowerCase().includes(cleanQuery) ||
    (p.verificationCode && p.verificationCode.toLowerCase().includes(cleanQuery))
  );

  const filteredLeads = leads.filter(l =>
    !cleanQuery ||
    l.clientName.toLowerCase().includes(cleanQuery) ||
    l.companyName.toLowerCase().includes(cleanQuery) ||
    l.projectTitle.toLowerCase().includes(cleanQuery) ||
    l.source.toLowerCase().includes(cleanQuery)
  );

  const filteredInvoices = invoices.filter(i =>
    !cleanQuery ||
    i.invoiceNumber.toLowerCase().includes(cleanQuery) ||
    i.clientCompany.toLowerCase().includes(cleanQuery) ||
    i.clientName.toLowerCase().includes(cleanQuery) ||
    i.projectName.toLowerCase().includes(cleanQuery)
  );

  const showClients = activeCategory === 'all' || activeCategory === 'clients';
  const showProjects = activeCategory === 'all' || activeCategory === 'projects';
  const showLeads = activeCategory === 'all' || activeCategory === 'leads';
  const showInvoices = activeCategory === 'all' || activeCategory === 'invoices';

  const totalResults = (showClients ? filteredClients.length : 0) +
                       (showProjects ? filteredProjects.length : 0) +
                       (showLeads ? filteredLeads.length : 0) +
                       (showInvoices ? filteredInvoices.length : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh]">
        {/* Search Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <Search className="w-5 h-5 text-emerald-600 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients by name/company, projects, leads, invoices... (e.g. Graminum, Suresh)"
            className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-700 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300">
            ESC
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-white text-xs overflow-x-auto">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'clients', label: `Clients (${filteredClients.length})`, icon: Users },
            { id: 'projects', label: `Projects (${filteredProjects.length})`, icon: FolderKanban },
            { id: 'leads', label: `Leads (${filteredLeads.length})`, icon: TrendingUp },
            { id: 'invoices', label: `Invoices (${filteredInvoices.length})`, icon: Receipt },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="overflow-y-auto p-4 space-y-5 flex-1">
          {totalResults === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">No matching clients or items found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by client name (e.g. Suresh, Vikram, Pooja) or company name</p>
            </div>
          ) : (
            <>
              {/* Clients Section (Top Priority) */}
              {showClients && filteredClients.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <Users className="w-3.5 h-3.5" />
                      Clients ({filteredClients.length})
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">Click to open client workspace</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredClients.map(client => (
                      <div
                        key={client.id}
                        onClick={() => {
                          setSelectedClientId(client.id);
                          setActiveView('clients');
                          setIsSearchOpen(false);
                        }}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50/50 hover:border-emerald-300 transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                            {client.company.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {client.company}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">
                              {client.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[170px] mt-0.5">
                              {client.email}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {client.projectCount || 1} Proj
                          </span>
                          <div className="text-[11px] font-bold text-emerald-700 mt-1">
                            ₹{(client.totalRevenue || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {showProjects && filteredProjects.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
                    Projects ({filteredProjects.length})
                  </div>

                  <div className="space-y-1.5">
                    {filteredProjects.map(proj => (
                      <div
                        key={proj.id}
                        onClick={() => {
                          setSelectedProjectId(proj.id);
                          setActiveView('project_workspace');
                          setActiveProjectTab('overview');
                          setIsSearchOpen(false);
                        }}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                            {proj.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Client: <strong className="text-slate-700">{proj.clientCompany}</strong> • Budget: ₹{proj.budget.toLocaleString()} • {proj.progress}% Complete
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-blue-600 flex items-center gap-1 font-semibold">
                          Open <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leads Section */}
              {showLeads && filteredLeads.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    Leads Pipeline ({filteredLeads.length})
                  </div>

                  <div className="space-y-1.5">
                    {filteredLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setActiveView('leads');
                          setIsSearchOpen(false);
                        }}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-amber-50/50 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                            {lead.companyName} — {lead.projectTitle}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {lead.clientName} • ₹{lead.estimatedValue.toLocaleString()} • Stage: <span className="uppercase font-semibold">{lead.stage}</span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-amber-600 flex items-center gap-1 font-semibold">
                          View CRM <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices Section */}
              {showInvoices && filteredInvoices.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    Invoices ({filteredInvoices.length})
                  </div>

                  <div className="space-y-1.5">
                    {filteredInvoices.map(inv => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          setActiveView('invoices');
                          setIsSearchOpen(false);
                        }}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50/50 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                            {inv.invoiceNumber} — {inv.clientCompany}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {inv.projectName} • ₹{inv.totalAmount.toLocaleString()} • Status: <span className="uppercase font-semibold">{inv.status}</span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-emerald-600 flex items-center gap-1 font-semibold">
                          View Invoice <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Quick Jump:</span>
            <button onClick={() => setQuery('Graminum')} className="text-emerald-700 hover:underline font-semibold">Graminum</button>
            <span>•</span>
            <button onClick={() => setQuery('ABC Gym')} className="text-emerald-700 hover:underline font-semibold">ABC Gym</button>
            <span>•</span>
            <button onClick={() => setQuery('Sadalaxmi')} className="text-emerald-700 hover:underline font-semibold">Sadalaxmi</button>
          </div>
          <span>Press <kbd className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300 text-[10px]">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};
