import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  IndianRupee,
  Calendar,
  FileText,
  CheckSquare,
  Receipt,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Share2,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Send,
  Eye,
  Download,
  AlertTriangle,
  Play,
  ArrowRight,
  MessageSquare,
  Lock,
  ChevronRight,
  Star,
  Globe,
  MoreVertical,
  Archive
} from 'lucide-react';
import { ClientReviewModal } from '../components/modals/ClientReviewModal';
import { TestimonialModal } from '../components/modals/TestimonialModal';
import { InvoicePreviewModal } from '../components/modals/InvoicePreviewModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { EditProjectModal } from '../components/modals/EditProjectModal';
import { Deliverable, FormQuestion, Invoice } from '../types';

export const ProjectWorkspaceView: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    activeProjectTab,
    setActiveProjectTab,
    toggleMilestone,
    toggleTask,
    addDeliverable,
    updateDeliverableStatus,
    saveOnboardingQuestions,
    signAgreementAsClient,
    generateCaseStudyForProject,
    togglePublishCaseStudy,
    invoices,
    activities,
    profile,
    setActiveView,
    setSelectedVerificationCode,
    addToast,
    updateProject,
    deleteProject,
    setIsCreateProjectOpen
  } = useApp();

  const [isProjectActionMenuOpen, setIsProjectActionMenuOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);

  const project = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Modals inside Workspace
  const [selectedDeliverableForReview, setSelectedDeliverableForReview] = useState<Deliverable | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<Invoice | null>(null);

  // New Deliverable Form State
  const [isNewDelOpen, setIsNewDelOpen] = useState(false);
  const [newDelTitle, setNewDelTitle] = useState('');
  const [newDelDesc, setNewDelDesc] = useState('');
  const [newDelDate, setNewDelDate] = useState(project?.deadline || '2026-10-20');

  // Form Builder State
  const [questions, setQuestions] = useState<FormQuestion[]>(project?.onboardingForm?.questions || []);
  const [isPreviewBriefAsClient, setIsPreviewBriefAsClient] = useState(false);

  // Welcome Message Generator State
  const [welcomeMessage, setWelcomeMessage] = useState(
    `Hi ${project?.clientName || 'Client'},\n\nWelcome to your ${project?.name} project! We are thrilled to partner with ${project?.clientCompany} and build a high-impact digital experience.\n\nAll key deliverables, milestones, and design files will be shared through this workspace for your 1-click approval.\n\nBest regards,\n${profile.name}\n${profile.title}`
  );
  const [isWelcomeSent, setIsWelcomeSent] = useState(false);

  if (!project) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in text-center py-16">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <FolderKanban className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">No projects yet</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Create your first project to start managing client work.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveView('leads')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs shadow-2xs transition-all"
          >
            Check Leads Pipeline
          </button>
          <button
            onClick={() => setActiveView('clients')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs shadow-2xs transition-all"
          >
            Manage Clients
          </button>
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Project</span>
          </button>
        </div>
      </div>
    );
  }

  const remainingBalance = project.budget - project.paidAmount;
  const allDeliverablesApproved = project.deliverables.length > 0 && project.deliverables.every(d => d.status === 'approved' || d.status === 'completed');
  const projectInvoices = invoices.filter(i => i.projectId === project.id || i.clientCompany.toLowerCase() === project.clientCompany.toLowerCase());
  const projectActivities = activities.filter(a => a.projectId === project.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'onboarding', label: 'Client Onboarding', icon: FileText },
    { id: 'documents', label: 'Documents & Agreements', icon: FileText },
    { id: 'deliverables', label: 'Deliverables & Review', icon: CheckCircle2, badge: project.deliverables.length },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'completion', label: 'Completion & Proof', icon: ShieldCheck },
    { id: 'casestudy', label: 'Portfolio Case Study', icon: Briefcase, isSpecial: true },
  ];

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelTitle.trim()) return;
    addDeliverable(project.id, {
      title: newDelTitle,
      description: newDelDesc,
      dueDate: newDelDate
    });
    setNewDelTitle('');
    setNewDelDesc('');
    setIsNewDelOpen(false);
  };

  const handleAddQuestion = () => {
    const newQ: FormQuestion = {
      id: 'q-' + Date.now(),
      question: 'New Question Briefing Item',
      type: 'long_text',
      required: true
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    saveOnboardingQuestions(project.id, updated);
  };

  const handleDeleteQuestion = (qid: string) => {
    const updated = questions.filter(q => q.id !== qid);
    setQuestions(updated);
    saveOnboardingQuestions(project.id, updated);
  };

  const handleSendWelcomeMessage = () => {
    setIsWelcomeSent(true);
    addToast(`Welcome email successfully sent to ${project.clientName} (${project.clientCompany})`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-900">
      {/* Top Project Selector & Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{project.name}</h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                project.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : project.status === 'in_progress'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              ● {project.status.replace('_', ' ')}
            </span>
            {project.isVerified && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Verified: {project.verificationCode}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2">
            <span>Client: <strong className="text-slate-800">{project.clientCompany}</strong> ({project.clientName})</span>
            <span>•</span>
            <span>Service: <strong className="text-slate-800">{project.service}</strong></span>
            <span>•</span>
            <span>Deadline: <strong className="text-slate-800">{project.deadline}</strong></span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Switcher if multiple projects */}
          {projects.length > 1 && (
            <select
              value={project.id}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold focus:border-emerald-600 focus:outline-none transition-colors"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.clientCompany})</option>
              ))}
            </select>
          )}

          {/* Switch to Client Portal simulation */}
          <button
            onClick={() => setActiveView('client_portal')}
            className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            <span>Preview Client Portal</span>
          </button>

          {project.status !== 'completed' ? (
            <button
              onClick={() => setIsTestimonialModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Complete Project
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedVerificationCode(project.verificationCode || 'GRM-2026-001');
                setActiveView('verification');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> View Verified Proof
            </button>
          )}

          {/* Project Three-dot Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProjectActionMenuOpen(prev => !prev)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Project Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isProjectActionMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-30 animate-scale-up text-left"
                onMouseLeave={() => setIsProjectActionMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsProjectActionMenuOpen(false);
                    setIsEditProjectModalOpen(true);
                  }}
                  className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Project Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProjectActionMenuOpen(false);
                    updateProject(project.id, {
                      status: project.status === 'archived' ? 'in_progress' : 'archived'
                    });
                  }}
                  className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Archive className="w-3.5 h-3.5 text-slate-500" />
                  <span>{project.status === 'archived' ? 'Unarchive Project' : 'Archive Project'}</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setIsProjectActionMenuOpen(false);
                    setIsDeleteProjectModalOpen(true);
                  }}
                  className="w-full px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Delete Project</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeProjectTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveProjectTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeProjectTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Financials & Progress 4-Card Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 mb-1 font-semibold">Project Progress</div>
              <div className="text-2xl font-black text-emerald-700">{project.progress}%</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 mb-1 font-semibold">Total Budget</div>
              <div className="text-2xl font-black text-slate-900">₹{project.budget.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 mt-1 uppercase font-mono">{project.paymentStructure.replace('_', ' / ')}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 mb-1 font-semibold">Paid to Date</div>
              <div className="text-2xl font-black text-emerald-700">₹{project.paidAmount.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-700 mt-1 font-semibold">Cleared milestone</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 mb-1 font-semibold">Remaining Balance</div>
              <div className="text-2xl font-black text-rose-600">₹{remainingBalance.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 mt-1">Due on final launch</div>
            </div>
          </div>

          {/* Ready to Complete Alert Banner */}
          {allDeliverablesApproved && project.status !== 'completed' && (
            <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-pulse-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">🎉 All Milestone Deliverables Approved!</h3>
                  <p className="text-xs text-slate-600">Ready to complete project, mint verified credential, and collect client testimonial.</p>
                </div>
              </div>
              <button
                onClick={() => setIsTestimonialModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Complete Project Now
              </button>
            </div>
          )}

          {/* Milestones Checklist Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Project Milestones</h3>
                <p className="text-xs text-slate-500">Click checkboxes to mark progress</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {project.milestones.filter(m => m.completed).length} / {project.milestones.length} Completed
              </span>
            </div>

            <div className="space-y-2 pt-2">
              {project.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(project.id, m.id)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    m.completed
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={m.completed}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white"
                    />
                    <span className={`text-xs font-semibold ${m.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {m.title}
                    </span>
                  </div>
                  {m.completed && m.completedAt && (
                    <span className="text-[10px] font-mono font-bold text-emerald-700">
                      Completed: {m.completedAt}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TASKS */}
      {activeProjectTab === 'tasks' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tasks & Engineering Checklist</h3>
              <p className="text-xs text-slate-500">Granular implementation tasks for this project</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {project.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(project.id, task.id)}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  task.completed
                    ? 'bg-emerald-50/40 border-emerald-200 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white"
                />
                <span className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLIENT ONBOARDING */}
      {activeProjectTab === 'onboarding' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Client Onboarding Briefing Form</h3>
              <p className="text-xs text-slate-500">Collect brand colors, design references, target audience, and feature specs</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreviewBriefAsClient(!isPreviewBriefAsClient)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-sky-600" />
                <span>{isPreviewBriefAsClient ? 'Exit Client Preview' : 'Preview as Client'}</span>
              </button>

              <button
                onClick={handleAddQuestion}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>
          </div>

          {!isPreviewBriefAsClient ? (
            /* Builder Mode */
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Question {idx + 1}</span>
                    <button onClick={() => handleDeleteQuestion(q.id)} className="text-rose-500 hover:text-rose-700 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = questions.map(item => item.id === q.id ? { ...item, question: e.target.value } : item);
                      setQuestions(updated);
                      saveOnboardingQuestions(project.id, updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                  {q.answer && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                      <strong>Client Response:</strong> {Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Client Preview Mode */
            <div className="p-6 rounded-2xl bg-slate-50 border border-emerald-300 space-y-4">
              <div className="text-xs font-mono uppercase font-bold text-emerald-700">
                Live Client Intake View
              </div>
              {questions.map((q, i) => (
                <div key={q.id} className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {i + 1}. {q.question}
                  </label>
                  <input
                    type="text"
                    defaultValue={Array.isArray(q.answer) ? q.answer.join(', ') : q.answer || ''}
                    placeholder="Enter response here..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  addToast('Sample onboarding responses submitted!', 'success');
                  setIsPreviewBriefAsClient(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Submit Completed Brief
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DOCUMENTS & AGREEMENTS */}
      {activeProjectTab === 'documents' && (
        <div className="space-y-6 animate-fade-in">
          {/* Welcome Message Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Automated Welcome & Kickoff Email</h3>
                <p className="text-xs text-slate-500">Variables dynamically populate with client name and project context</p>
              </div>
              <button
                onClick={handleSendWelcomeMessage}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send Welcome Email
              </button>
            </div>

            <textarea
              rows={5}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-mono leading-relaxed focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Service Agreement & E-Signature Card */}
          {project.agreement && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Freelance Service Agreement & E-Signature</h3>
                  <p className="text-xs text-slate-500">Status: <strong className="text-emerald-700 uppercase font-mono">{project.agreement.status}</strong></p>
                </div>

                {project.agreement.status !== 'completed' ? (
                  <button
                    onClick={() => signAgreementAsClient(project.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" /> Simulate Client E-Signature
                  </button>
                ) : (
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fully Executed & Signed
                  </span>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700 font-serif leading-relaxed">
                <div className="font-bold text-sm text-slate-900 font-sans">{project.agreement.title}</div>
                <div><strong>Scope of Work:</strong> {project.agreement.scope}</div>
                <div><strong>Total Investment:</strong> ₹{project.agreement.price.toLocaleString()} ({project.agreement.paymentTerms})</div>
                <div><strong>Intellectual Property:</strong> {project.agreement.ownership}</div>
                <div><strong>Confidentiality:</strong> {project.agreement.confidentiality}</div>

                <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 font-sans text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Freelancer Signature:</span>
                    <strong className="text-emerald-800 font-mono">{project.agreement.freelancerSignature}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Client Signature:</span>
                    <strong className="text-emerald-700 font-mono">
                      {project.agreement.clientSignature || 'Awaiting client sign-off...'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: DELIVERABLES & APPROVALS */}
      {activeProjectTab === 'deliverables' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Deliverables Pipeline</h3>
              <p className="text-xs text-slate-500">Share milestone assets for 1-click client sign-off</p>
            </div>

            <button
              onClick={() => setIsNewDelOpen(!isNewDelOpen)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Deliverable
            </button>
          </div>

          {/* New Deliverable Form */}
          {isNewDelOpen && (
            <form onSubmit={handleAddDeliverable} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newDelTitle}
                  onChange={(e) => setNewDelTitle(e.target.value)}
                  placeholder="Deliverable Title (e.g. Admin Dashboard UI)"
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                />
                <input
                  type="date"
                  value={newDelDate}
                  onChange={(e) => setNewDelDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <textarea
                rows={2}
                value={newDelDesc}
                onChange={(e) => setNewDelDesc(e.target.value)}
                placeholder="Description / assets included..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewDelOpen(false)} className="text-xs text-slate-500 px-3 py-1">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">Save Deliverable</button>
              </div>
            </form>
          )}

          {/* Deliverables List */}
          <div className="space-y-3">
            {project.deliverables.map((del) => (
              <div
                key={del.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-300 transition-colors shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{del.title}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                        del.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : del.status === 'in_review'
                          ? 'bg-sky-100 text-sky-800 border border-sky-200'
                          : del.status === 'revision_requested'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {del.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed">{del.description}</p>
                  {del.feedback && (
                    <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-1 font-medium">
                      <strong>Feedback:</strong> {del.feedback}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {del.status !== 'approved' && (
                    <button
                      onClick={() => setSelectedDeliverableForReview(del)}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-600" />
                      <span>Review as Client</span>
                    </button>
                  )}
                  {del.status === 'approved' && (
                    <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INVOICES */}
      {activeProjectTab === 'invoices' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Invoices & Milestone Payments</h3>
              <p className="text-xs text-slate-500">Track paid and pending balances for {project.name}</p>
            </div>
            <button
              onClick={() => setActiveView('invoices')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Generate New Invoice
            </button>
          </div>

          <div className="space-y-3">
            {projectInvoices.map((inv) => (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoiceForPreview(inv)}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 cursor-pointer flex items-center justify-between transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{inv.invoiceNumber}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Due Date: {inv.dueDate}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">₹{inv.totalAmount.toLocaleString()}</div>
                  <span className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold">
                    Preview & PDF <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: TIMELINE */}
      {activeProjectTab === 'timeline' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-slate-900">Automated Project Activity Timeline</h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {projectActivities.length === 0 ? (
              <div className="text-xs text-slate-500">All actions are automatically recorded in real time.</div>
            ) : (
              projectActivities.map((act) => (
                <div key={act.id} className="relative flex items-start gap-3 text-xs">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
                  <div>
                    <p className="text-slate-800 font-semibold">{act.description}</p>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 8: COMPLETION & PROOF */}
      {activeProjectTab === 'completion' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Completion & Cryptographic Verification</h3>
              <p className="text-xs text-slate-500">Generate tamper-proof public credentials and 5-star testimonials</p>
            </div>

            {project.status !== 'completed' && (
              <button
                onClick={() => setIsTestimonialModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Complete Project
              </button>
            )}
          </div>

          {project.testimonial ? (
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(project.testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-slate-900">{project.testimonial.rating}.0 / 5.0</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  Verified Code: {project.verificationCode}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                "{project.testimonial.comment}"
              </p>
              <div className="text-xs text-slate-600 font-semibold">
                — {project.testimonial.clientName}, {project.testimonial.companyName}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              Complete the project to record client feedback and generate verification certificates.
            </div>
          )}
        </div>
      )}

      {/* TAB 9: CASE STUDY GENERATOR */}
      {activeProjectTab === 'casestudy' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Portfolio Case Study Generator</span>
              </h3>
              <p className="text-xs text-slate-500">Transform your delivery results into a public client-converting story</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => generateCaseStudyForProject(project.id)}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Re-Generate with AI
              </button>

              {project.caseStudy && (
                <button
                  onClick={() => togglePublishCaseStudy(project.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs ${
                    project.caseStudy.isPublished
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{project.caseStudy.isPublished ? '● Published Live' : 'Publish to Portfolio'}</span>
                </button>
              )}
            </div>
          </div>

          {project.caseStudy ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <input
                  type="text"
                  value={project.caseStudy.title}
                  onChange={() => {}}
                  className="w-full text-base font-bold text-slate-900 bg-transparent border-none focus:outline-none"
                />

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Challenge & Problem:</label>
                    <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">{project.caseStudy.challenge}</p>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Delivered Solution:</label>
                    <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">{project.caseStudy.solution}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                    <strong>Measurable Business Results:</strong> {project.caseStudy.results}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-3xl space-y-3 border border-slate-200">
              <Sparkles className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-slate-900">No case study drafted yet</p>
              <button
                onClick={() => generateCaseStudyForProject(project.id)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                1-Click Generate Case Study
              </button>
            </div>
          )}
        </div>
      )}

      {/* Embedded Modals */}
      {selectedDeliverableForReview && (
        <ClientReviewModal
          isOpen={!!selectedDeliverableForReview}
          onClose={() => setSelectedDeliverableForReview(null)}
          deliverable={selectedDeliverableForReview}
          projectId={project.id}
        />
      )}

      {isTestimonialModalOpen && (
        <TestimonialModal
          isOpen={isTestimonialModalOpen}
          onClose={() => setIsTestimonialModalOpen(false)}
          projectId={project.id}
        />
      )}

      {selectedInvoiceForPreview && (
        <InvoicePreviewModal
          isOpen={!!selectedInvoiceForPreview}
          onClose={() => setSelectedInvoiceForPreview(null)}
          invoice={selectedInvoiceForPreview}
        />
      )}

      {/* Edit Project Modal */}
      <EditProjectModal
        project={project}
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        onSave={(id, updates) => updateProject(id, updates)}
      />

      {/* Delete Project Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteProjectModalOpen}
        title="Delete this project?"
        message="This will permanently delete this project and its project data, including associated deliverables, documents, timeline information and other project records. This action cannot be undone."
        itemName={project.name}
        itemDetails={`Client: ${project.clientCompany} • Budget: ₹${project.budget.toLocaleString()} • Status: ${project.status.toUpperCase()}`}
        confirmButtonText="Delete Project"
        onConfirm={() => {
          setIsDeleteProjectModalOpen(false);
          deleteProject(project.id);
        }}
        onCancel={() => setIsDeleteProjectModalOpen(false)}
      />
    </div>
  );
};
