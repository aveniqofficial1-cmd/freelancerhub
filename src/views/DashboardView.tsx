import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Plus,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Calendar,
  IndianRupee,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Users,
  Search,
  MoreVertical,
  Edit2,
  Archive,
  Trash2
} from 'lucide-react';
import { Project } from '../types';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { EditProjectModal } from '../components/modals/EditProjectModal';

export const DashboardView: React.FC = () => {
  const {
    profile,
    projects,
    leads,
    clients,
    invoices,
    activities,
    setSelectedProjectId,
    setSelectedClientId,
    setActiveView,
    setActiveProjectTab,
    setIsCreateProjectOpen,
    setIsWalkthroughActive,
    setIsSearchOpen,
    updateProject,
    deleteProject
  } = useApp();

  // Project action state
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuProjectId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic calculations from state
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'review');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const portfolioProjects = projects.filter(p => p.caseStudy && p.caseStudy.isPublished);
  const newLeads = leads.filter(l => l.stage !== 'won' && l.stage !== 'lost');

  const totalMonthlyRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.paidAmount, 0);

  const pendingPayments = invoices
    .filter(i => i.status === 'sent' || i.status === 'draft')
    .reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);

  // Upcoming deadlines from active projects
  const upcomingDeadlines = projects
    .filter(p => p.status === 'in_progress')
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      name: p.name,
      client: p.clientCompany,
      date: p.deadline,
      progress: p.progress
    }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-900">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good morning, {profile.name.split(' ')[0]} 👋
            </h1>
            <span className="hidden sm:inline-flex text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Pro Freelancer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's what's happening with your freelance business today.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveView('clients')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Find Clients ({clients.length})</span>
          </button>

          <button
            onClick={() => setIsWalkthroughActive(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Demo Tour</span>
          </button>

          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Active Projects */}
        <div
          onClick={() => setActiveView('projects')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeProjects.length}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-0.5">
            <span>In production</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* New Leads */}
        <div
          onClick={() => setActiveView('leads')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">New Leads</span>
            <TrendingUp className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{newLeads.length}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-0.5">
            <span>Pipeline active</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Revenue This Month */}
        <div
          onClick={() => setActiveView('invoices')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Revenue Cleared</span>
            <span className="text-emerald-600 font-bold text-xs">₹</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            ₹{totalMonthlyRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Settled payments</div>
        </div>

        {/* Pending Payments */}
        <div
          onClick={() => setActiveView('invoices')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-md cursor-pointer transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pending Payouts</span>
            <Receipt className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            ₹{pendingPayments.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Due milestone funds</div>
        </div>

        {/* Completed Projects */}
        <div
          onClick={() => setActiveView('projects')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {profile.stats.totalProjects}
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">100% delivered</div>
        </div>

        {/* Portfolio Projects */}
        <div
          onClick={() => setActiveView('portfolio')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md cursor-pointer transition-all group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Case Studies</span>
            <Briefcase className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{portfolioProjects.length + 2}</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">Live public proof</div>
        </div>
      </div>

      {/* Quick Client Jump Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800">Quick Client Directory:</span>
          {clients.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {clients.slice(0, 4).map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedClientId(c.id);
                    setActiveView('clients');
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 font-medium transition-colors"
                >
                  {c.company}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-400">No clients added yet.</span>
          )}
        </div>
        <button
          onClick={() => setActiveView('clients')}
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>{clients.length > 0 ? `View All Clients (${clients.length})` : '+ Add First Client'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Business Insight Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Freelancer Hub Active
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-0.5 font-medium">
              Start by adding an incoming lead or creating a new client project to begin tracking milestones, contracts, and revenue.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Get Started</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Project Overview + Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Project Overview Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Active Projects Overview</h2>
              <p className="text-xs text-slate-500">Track progress, budgets, and milestone delivery</p>
            </div>
            {projects.length > 0 && (
              <button
                onClick={() => setActiveView('projects')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View All ({projects.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100">
            {projects.length > 0 ? (
              projects.slice(0, 4).map((project) => {
                const isMenuOpen = activeMenuProjectId === project.id;

                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setActiveView('project_workspace');
                      setActiveProjectTab('overview');
                    }}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          {project.name}
                        </span>
                        {project.status === 'archived' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Archived
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="text-slate-700 font-semibold">{project.clientCompany}</span>
                        <span>•</span>
                        <span>Budget: <strong className="text-slate-900">₹{project.budget.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>Due: {project.deadline}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2 max-w-md">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Milestone Progress</span>
                          <span className="font-bold text-emerald-700">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              project.progress === 100
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right side status & action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            project.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : project.status === 'in_progress'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {project.status.replace('_', ' ')}
                        </span>

                        {/* Three-dot action menu */}
                        <div 
                          className="relative" 
                          ref={isMenuOpen ? menuRef : null}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuProjectId(isMenuOpen ? null : project.id);
                            }}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Project Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-30 animate-scale-up text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuProjectId(null);
                                  setSelectedProjectId(project.id);
                                  setActiveView('project_workspace');
                                  setActiveProjectTab('overview');
                                }}
                                className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <FolderKanban className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Open Project</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuProjectId(null);
                                  setProjectToEdit(project);
                                }}
                                className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuProjectId(null);
                                  updateProject(project.id, {
                                    status: project.status === 'archived' ? 'in_progress' : 'archived'
                                  });
                                }}
                                className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Archive className="w-3.5 h-3.5 text-slate-500" />
                                <span>{project.status === 'archived' ? 'Unarchive' : 'Archive'}</span>
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuProjectId(null);
                                  setProjectToDelete(project);
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

                      <span className="text-xs text-slate-400 group-hover:text-emerald-700 flex items-center gap-1 font-semibold">
                        Open Workspace <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 sm:p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                  <FolderKanban className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No projects yet</h3>
                  <p className="text-xs text-slate-500">
                    Create your first project to start managing client work.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsCreateProjectOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" /> Create First Project
                  </button>
                  <button
                    onClick={() => setActiveView('leads')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200"
                  >
                    View Leads CRM
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deadlines & Live Activity Stream */}
        <div className="space-y-6">
          {/* Upcoming Deadlines Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Upcoming Deadlines</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">This Month</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedProjectId(item.id);
                      setActiveView('project_workspace');
                    }}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800 truncate">{item.name}</span>
                      <span className="text-amber-700 font-mono text-[11px] font-bold shrink-0">{item.date}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>{item.client}</span>
                      <span className="font-semibold text-emerald-700">{item.progress}% complete</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                  No upcoming deadlines scheduled
                </div>
              )}
            </div>
          </div>

          {/* Live Recent Activity Feed */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Recent Activity</span>
              </h3>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">Real-time</span>
            </div>

            <div className="space-y-3 pt-1">
              {activities.length > 0 ? (
                activities.slice(0, 5).map(act => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-700 font-medium leading-snug">{act.description}</p>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                  Activity logs will appear as you create projects and manage invoices.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      <EditProjectModal
        project={projectToEdit}
        isOpen={Boolean(projectToEdit)}
        onClose={() => setProjectToEdit(null)}
        onSave={(id, updates) => updateProject(id, updates)}
      />

      {/* Delete Project Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(projectToDelete)}
        title="Delete this project?"
        message="This will permanently delete this project and its project data, including associated deliverables, documents, timeline information and other project records. This action cannot be undone."
        itemName={projectToDelete ? projectToDelete.name : undefined}
        itemDetails={projectToDelete ? `Client: ${projectToDelete.clientCompany} • Budget: ₹${projectToDelete.budget.toLocaleString()} • Status: ${projectToDelete.status.toUpperCase()}` : undefined}
        confirmButtonText="Delete Project"
        onConfirm={() => {
          if (projectToDelete) {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }
        }}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
};
