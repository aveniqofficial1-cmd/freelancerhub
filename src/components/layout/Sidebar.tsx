import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  TrendingUp,
  Users,
  FolderKanban,
  FileText,
  CheckSquare,
  Receipt,
  Layers,
  BarChart3,
  Bot,
  Settings,
  Sparkles,
  ShieldCheck,
  Eye,
  RotateCcw
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    leads,
    projects,
    invoices,
    setSelectedProjectId,
    resetToDemoData,
    setIsWalkthroughActive
  } = useApp();

  const newLeadsCount = leads.filter(l => l.stage === 'new' || l.stage === 'contacted').length;
  const activeProjectsCount = projects.filter(p => p.status === 'in_progress').length;
  const pendingInvoicesCount = invoices.filter(i => i.status === 'sent' || i.status === 'draft').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'leads', label: 'Leads Pipeline', icon: TrendingUp, badge: newLeadsCount > 0 ? newLeadsCount : undefined },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: activeProjectsCount > 0 ? activeProjectsCount : undefined },
    { id: 'deliverables', label: 'Deliverables', icon: CheckSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: Receipt, badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : undefined },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'profile', label: 'My Profile', icon: UserCheck },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai_assistant', label: 'AI Assistant', icon: Bot, isNew: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 select-none z-20 shadow-xs">
      {/* Brand Logo Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 bg-white">
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 text-left group"
          title="Open FreelancerHub Homepage"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              FreelancerHub
              <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.2 rounded">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Workspace & Proof</div>
          </div>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Main Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id || (item.id === 'projects' && activeView === 'project_workspace');

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'projects') {
                  setSelectedProjectId(projects[0]?.id || 'prj-1');
                  setActiveView('projects');
                } else if (item.id === 'deliverables') {
                  setSelectedProjectId('prj-1');
                  setActiveView('deliverables');
                } else if (item.id === 'documents') {
                  setSelectedProjectId('prj-1');
                  setActiveView('documents');
                } else {
                  setActiveView(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.isNew && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 border border-indigo-200">
                    AI
                  </span>
                )}
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-150 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Demo Experience Sandbox Section */}
        <div className="pt-4 mt-4 border-t border-slate-200">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Simulated Portals
          </div>

          <button
            onClick={() => {
              setSelectedProjectId('prj-1');
              setActiveView('client_portal');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all mt-1 ${
              activeView === 'client_portal'
                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-sky-600" />
              <span>Client Portal View</span>
            </div>
            <span className="text-[9px] font-mono text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded border border-sky-200 font-bold">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveView('verification')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all mt-1 ${
              activeView === 'verification'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Certificate</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
              Proof
            </span>
          </button>
        </div>
      </div>

      {/* Demo Controls Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70">
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DEMO MODE</span>
            </div>
            <button
              onClick={() => setIsWalkthroughActive(true)}
              className="text-[11px] text-emerald-700 hover:underline font-semibold"
            >
              Start Guide
            </button>
          </div>
          <button
            onClick={resetToDemoData}
            className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-amber-600" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
