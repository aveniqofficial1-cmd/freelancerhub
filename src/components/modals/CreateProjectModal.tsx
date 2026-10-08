import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  FolderPlus,
  Users,
  CreditCard,
  Layers,
  Calendar,
  IndianRupee,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileCode,
  Palette,
  Video,
  Share2,
  Camera,
  Briefcase
} from 'lucide-react';
import { PaymentStructure, WorkflowTemplate } from '../../types';

export const CreateProjectModal: React.FC = () => {
  const {
    isCreateProjectOpen,
    setIsCreateProjectOpen,
    clients,
    addClient,
    addProject,
    preselectedLeadForProject,
    setPreselectedLeadForProject,
    setSelectedProjectId,
    setActiveView,
    setActiveProjectTab,
    profile
  } = useApp();

  const [step, setStep] = useState(1);

  // Step 1: Details
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [service, setService] = useState('Business Website Package');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(25000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Step 2: Payment
  const [paymentStructure, setPaymentStructure] = useState<PaymentStructure>('50_50');

  // Step 3: Workflow Template
  const [workflowTemplate, setWorkflowTemplate] = useState<WorkflowTemplate>('website');

  // Pre-fill if lead was converted
  useEffect(() => {
    if (preselectedLeadForProject) {
      setName(`${preselectedLeadForProject.companyName} ${preselectedLeadForProject.projectTitle}`);
      setDescription(`High-impact project for ${preselectedLeadForProject.companyName}. Source: ${preselectedLeadForProject.source}`);
      setBudget(preselectedLeadForProject.estimatedValue || 25000);

      const matchingClient = clients.find(
        c => c.company.toLowerCase() === preselectedLeadForProject.companyName.toLowerCase()
      );
      if (matchingClient) {
        setClientId(matchingClient.id);
        setIsNewClient(false);
      } else {
        setIsNewClient(true);
        setNewClientName(preselectedLeadForProject.clientName);
        setNewClientCompany(preselectedLeadForProject.companyName);
        setNewClientEmail(preselectedLeadForProject.email);
      }
    } else if (clients.length > 0 && !clientId) {
      setClientId(clients[0].id);
    }
  }, [preselectedLeadForProject, clients]);

  if (!isCreateProjectOpen) return null;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSubmit = () => {
    let finalClientId = clientId;
    let finalClientName = '';
    let finalClientCompany = '';

    if (isNewClient) {
      const created = addClient({
        name: newClientName || 'Client Lead',
        company: newClientCompany || 'Company',
        email: newClientEmail || 'client@example.com',
        phone: '+91 98765 00000',
        status: 'active',
        portalStatus: 'not_invited',
        notes: 'Created during project setup.'
      });
      finalClientId = created.id;
      finalClientName = created.name;
      finalClientCompany = created.company;
    } else {
      const clientObj = clients.find(c => c.id === clientId);
      if (clientObj) {
        finalClientName = clientObj.name;
        finalClientCompany = clientObj.company;
      }
    }

    const templateDeliverables: Record<WorkflowTemplate, string[]> = {
      website: [
        'Figma UI/UX Prototypes & Wireframes',
        'Responsive Frontend Code & Animations',
        'Payment Gateway & Database Integration',
        'Production Deployment & SEO Audit'
      ],
      graphic_design: [
        'Brand Moodboard & Color Palettes',
        'Primary & Secondary Logo Vector Pack',
        'Typography & Brand Guidelines PDF',
        'Social Media Kit & Business Stationery'
      ],
      video_editing: [
        'Rough Cut & Storyboard Assembly',
        'Sound Design & Color Grading',
        'Motion Graphics & Subtitles',
        'Final 4K Master Render & Aspect Ratio Pack'
      ],
      social_media: [
        'Monthly Content Calendar & Copy',
        '15 High-Resolution Carousel Creatives',
        '4 Short-Form Viral Video Reels',
        'Hashtag Strategy & Analytics Report'
      ],
      photography: [
        'Raw Shoot Culling & Selection Gallery',
        'High-End Retouching & Color Grading',
        'Web-Optimized & Print-Ready Export Archive'
      ],
      consulting: [
        'Discovery Audit & Competitive Landscape',
        'Strategic Architecture Roadmap Document',
        'Implementation Playbook & Stakeholder Workshop'
      ],
      custom: [
        'Initial Milestone Prototype',
        'Main Functional Build Delivery',
        'Final Sign-off & Asset Handover'
      ]
    };

    const newProj = addProject({
      name: name || 'New Client Project',
      clientId: finalClientId,
      clientName: finalClientName || 'Client Name',
      clientCompany: finalClientCompany || 'Client Company',
      service,
      description: description || 'Professional project engagement.',
      budget: Number(budget) || 20000,
      startDate,
      deadline,
      status: 'in_progress',
      paymentStructure,
      workflowTemplate,
      initialDeliverables: templateDeliverables[workflowTemplate]
    });

    setIsCreateProjectOpen(false);
    setPreselectedLeadForProject(null);
    setStep(1);

    // Switch right into the newly created Project Workspace!
    setSelectedProjectId(newProj.id);
    setActiveView('project_workspace');
    setActiveProjectTab('overview');
  };

  const templatesList: { id: WorkflowTemplate; name: string; icon: any; desc: string }[] = [
    { id: 'website', name: 'Website Development', icon: FileCode, desc: 'Figma, React, responsive build, QA & deployment' },
    { id: 'graphic_design', name: 'Graphic & Brand Design', icon: Palette, desc: 'Moodboards, logos, brand guides & assets' },
    { id: 'video_editing', name: 'Video Editing & Motion', icon: Video, desc: 'Rough cuts, audio grading & 4K master exports' },
    { id: 'social_media', name: 'Social Media Management', icon: Share2, desc: 'Calendars, carousel posts, reels & captions' },
    { id: 'photography', name: 'Photography & Media', icon: Camera, desc: 'Shoot culling, high-end retouching & export' },
    { id: 'consulting', name: 'Consulting & Strategy', icon: Briefcase, desc: 'Audits, strategic roadmaps & team playbooks' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create New Project</h3>
              <p className="text-xs text-slate-500">Step {step} of 4: {step === 1 ? 'Project Details' : step === 2 ? 'Payment Terms' : step === 3 ? 'Workflow Template' : 'Review & Initialize'}</p>
            </div>
          </div>
          <button
            onClick={() => { setIsCreateProjectOpen(false); setStep(1); }}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 pt-3 pb-1 bg-white flex items-center gap-2 border-b border-slate-100">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Graminum D2C E-commerce Website"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Client Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Client *</label>
                  <button
                    type="button"
                    onClick={() => setIsNewClient(!isNewClient)}
                    className="text-xs text-emerald-700 hover:underline font-bold"
                  >
                    {isNewClient ? '← Select existing client' : '+ Create new client'}
                  </button>
                </div>

                {!isNewClient ? (
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none font-medium"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.name})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1 font-semibold">Company / Brand Name</label>
                        <input
                          type="text"
                          value={newClientCompany}
                          onChange={(e) => setNewClientCompany(e.target.value)}
                          placeholder="e.g. Apex Earth"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1 font-semibold">Contact Person Name</label>
                        <input
                          type="text"
                          value={newClientName}
                          onChange={(e) => setNewClientName(e.target.value)}
                          placeholder="e.g. Sunita Rao"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1 font-semibold">Email Address</label>
                      <input
                        type="email"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        placeholder="sunita@apexearth.com"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Service & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Service Package</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                  >
                    {profile.services.map(s => (
                      <option key={s.id} value={s.name}>{s.name} (from ₹{s.startingPrice.toLocaleString()})</option>
                    ))}
                    <option value="Custom Bespoke Project">Custom Bespoke Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project Budget (₹ INR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Delivery Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Scope & Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline key objectives, deliverables and scope boundaries..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Payment Structure */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-500">Choose how client invoices and milestone schedules will be configured:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: '50_50',
                    title: '50% Advance / 50% on Completion',
                    desc: 'Standard freelancer protection. 50% upfront to commence, 50% upon sign-off.',
                    badge: 'Recommended'
                  },
                  {
                    id: 'milestone',
                    title: 'Milestone-Based Payments',
                    desc: 'Split across multiple deliverable stages (e.g. 30% / 40% / 30%).',
                    badge: 'Flexible'
                  },
                  {
                    id: 'full',
                    title: '100% Upfront Full Payment',
                    desc: 'Full payment cleared prior to commencing work.',
                    badge: 'Instant'
                  },
                  {
                    id: 'custom',
                    title: 'Custom Terms',
                    desc: 'Retainer, hourly billing, or custom agreement structure.',
                    badge: 'Custom'
                  }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentStructure(item.id as PaymentStructure)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      paymentStructure === item.id
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm text-slate-900 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Calculated Upfront Advance Deposit:</span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  ₹{paymentStructure === '50_50' ? (budget / 2).toLocaleString() : paymentStructure === 'full' ? budget.toLocaleString() : (budget * 0.3).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Workflow Template */}
          {step === 3 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs text-slate-500">Select a project template to auto-populate deliverables, onboarding briefs, and task boards:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templatesList.map(tpl => {
                  const Icon = tpl.icon;
                  const isSelected = workflowTemplate === tpl.id;

                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setWorkflowTemplate(tpl.id)}
                      className={`p-3.5 rounded-2xl text-left border flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 mb-0.5">{tpl.name}</div>
                        <div className="text-[11px] text-slate-500 leading-tight">{tpl.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Initialize */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Creating this workspace will automatically initialize an Onboarding Brief, Service Agreement Draft, Deliverable pipeline, and Advance Invoice!
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Project Name:</span>
                  <span className="font-bold text-slate-900">{name || 'New Project'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Client:</span>
                  <span className="font-bold text-slate-900">{isNewClient ? newClientCompany : clients.find(c => c.id === clientId)?.company}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Service:</span>
                  <span className="font-bold text-slate-900">{service}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Total Budget:</span>
                  <span className="font-bold text-emerald-700">₹{Number(budget).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Payment Structure:</span>
                  <span className="font-bold text-slate-900 uppercase">{paymentStructure.replace('_', ' / ')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Target Delivery:</span>
                  <span className="font-bold text-slate-900">{deadline}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 1 && !name.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 transition-all shadow-md hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" /> Launch Project Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
