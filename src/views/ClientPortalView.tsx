import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Eye,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileText,
  Receipt,
  Download,
  ShieldCheck,
  Star,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Clock,
  Send,
  Lock,
  Mail,
  KeyRound,
  Check,
  AlertCircle,
  LogOut,
  ChevronRight,
  FileSignature,
  CreditCard,
  Building,
  User,
  ExternalLink,
  X
} from 'lucide-react';
import { ClientReviewModal } from '../components/modals/ClientReviewModal';
import { Deliverable, Project, Invoice, Client, ProfessionalDocument } from '../types';
import { A4DocumentRenderer } from '../components/documents/A4DocumentRenderer';

export const ClientPortalView: React.FC = () => {
  const {
    clients,
    projects,
    invoices,
    documents,
    selectedProjectId,
    setSelectedProjectId,
    profile,
    setActiveView,
    activeClientSession,
    setActiveClientSession,
    clientLogin,
    clientLogout,
    signAgreementAsClient,
    signDocumentAsClient,
    submitOnboardingFormAsClient,
    markInvoiceAsPaid,
    approveDeliverable,
    requestDeliverableRevision,
    completeProjectWithTestimonial,
    addProjectMessage,
    triggerConfetti,
    addToast
  } = useApp();

  // Document Viewer & Interaction State
  const [viewingDoc, setViewingDoc] = useState<ProfessionalDocument | null>(null);
  const [signingDoc, setSigningDoc] = useState<ProfessionalDocument | null>(null);
  const [signerName, setSignerName] = useState('');
  const [fillingOnboardingDoc, setFillingOnboardingDoc] = useState<ProfessionalDocument | null>(null);
  const [onboardingResponses, setOnboardingResponses] = useState<Record<string, any>>({});

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Project Tab State
  const [portalTab, setPortalTab] = useState<'overview' | 'deliverables' | 'documents' | 'billing' | 'messages' | 'review'>('overview');
  const [selectedDel, setSelectedDel] = useState<Deliverable | null>(null);

  // Revision Modal State
  const [revisionDel, setRevisionDel] = useState<Deliverable | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  // Message Input State
  const [chatMessage, setChatMessage] = useState('');

  // Testimonial Form State
  const [rating, setRating] = useState(5);
  const [testimonialComment, setTestimonialComment] = useState('');
  const [allowPublicDisplay, setAllowPublicDisplay] = useState(true);

  // Simulated Payment Modal
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'bank'>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // If not logged in as a client, show Passwordless OTP Login Screen
  if (!activeClientSession) {
    const handleSendOtp = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      const client = clients.find(c => c.email.toLowerCase() === loginEmail.trim().toLowerCase());
      if (!client) {
        setLoginError('No client account found with this email. Check demo accounts below or create one in the freelancer dashboard.');
        return;
      }
      if (client.portalStatus === 'access_revoked') {
        setLoginError('This client portal is no longer available. Access has been revoked by your freelancer.');
        return;
      }
      setOtpSent(true);
      setLoginOtp('1234'); // Pre-fill demo OTP for convenience
      addToast('Verification OTP sent to ' + loginEmail + ' (Demo OTP: 1234)', 'info');
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      const res = clientLogin(loginEmail, loginOtp);
      if (!res.success) {
        setLoginError(res.error || 'Invalid OTP code.');
      }
    };

    const handleQuickLogin = (c: Client) => {
      setLoginEmail(c.email);
      setLoginOtp('1234');
      setOtpSent(true);
      clientLogin(c.email, '1234');
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-sky-500 selection:text-white">
        {/* Top return bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-800">Client Portal Gateway</span>
          </div>
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Freelancer Dashboard</span>
          </button>
        </div>

        {/* Login Container */}
        <div className="max-w-md w-full mx-auto p-4 sm:p-6 my-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Client Portal Access</h1>
            <p className="text-xs text-slate-500">
              Passwordless, secure one-time passcode login for project workspaces and deliverables.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{loginError}</div>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. abcgym@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-sky-600 focus:bg-white focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Login OTP</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center justify-between">
                  <span className="truncate">Sent OTP to: <strong>{loginEmail}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-sky-700 font-bold hover:underline shrink-0 text-[11px]"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter 4-Digit Passcode (OTP)</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono tracking-widest text-center focus:border-sky-600 focus:bg-white focus:outline-none font-bold"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Demo Code: <strong className="text-sky-700">1234</strong></span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Access Portal</span>
                </button>
              </form>
            )}

            {/* Quick Demo Login Switcher */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                Demo Accounts (Click to login instantly)
              </span>
              <div className="space-y-1.5">
                {clients.slice(0, 3).map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleQuickLogin(c)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-left flex items-center justify-between text-xs transition-colors group"
                  >
                    <div>
                      <strong className="text-slate-800 group-hover:text-sky-700">{c.company}</strong>
                      <span className="text-slate-500 text-[11px] block">{c.email}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-slate-400">
          Powered by FreelancerHub Pro Client Infrastructure • End-to-End Encrypted
        </div>
      </div>
    );
  }

  // Filter projects strictly for activeClientSession
  const myProjects = projects.filter(
    p => p.clientId === activeClientSession.id || p.clientCompany.toLowerCase() === activeClientSession.company.toLowerCase()
  );

  const currentProject = myProjects.find(p => p.id === selectedProjectId) || myProjects[0];

  const myInvoices = invoices.filter(
    i => i.clientId === activeClientSession.id || i.clientCompany.toLowerCase() === activeClientSession.company.toLowerCase()
  );

  const myDocuments = documents.filter(
    d =>
      !d.isTemplate &&
      (d.clientId === activeClientSession.id ||
        (currentProject && d.projectId === currentProject.id) ||
        (d.clientName && d.clientName.toLowerCase().includes(activeClientSession.name.toLowerCase())) ||
        (d.clientCompany && d.clientCompany.toLowerCase().includes(activeClientSession.company.toLowerCase())))
  );

  const pendingDeliverables = currentProject?.deliverables.filter(d => d.status === 'in_review' || d.status === 'pending') || [];
  const pendingInvoices = myInvoices.filter(i => i.status === 'sent' || i.status === 'draft');
  const pendingDocuments = myDocuments.filter(d => d.status === 'sent' || d.status === 'viewed');

  const handleSignAgreementModal = (doc: ProfessionalDocument) => {
    setSigningDoc(doc);
    setSignerName(activeClientSession.name || activeClientSession.company);
  };

  const handleConfirmSignDoc = () => {
    if (!signingDoc || !signerName.trim()) return;
    signDocumentAsClient(signingDoc.id, signerName.trim());
    setSigningDoc(null);
    setSignerName('');
    triggerConfetti();
    addToast('Agreement accepted and digitally signed successfully!', 'success');
  };

  const handleOpenOnboardingModal = (doc: ProfessionalDocument) => {
    setFillingOnboardingDoc(doc);
    if (doc.data.type === 'onboarding_form') {
      const p = doc.data.payload;
      setOnboardingResponses({
        name: p.clientDetails.name || activeClientSession.name,
        company: p.clientDetails.company || activeClientSession.company,
        email: p.clientDetails.email || activeClientSession.email,
        phone: p.clientDetails.phone || activeClientSession.phone,
        mainGoal: p.projectDetails.mainGoal || '',
        targetAudience: p.requirements.targetAudience || '',
        references: p.requirements.references || ''
      });
    }
  };

  const handleSubmitOnboardingForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fillingOnboardingDoc || fillingOnboardingDoc.data.type !== 'onboarding_form') return;
    const existing = fillingOnboardingDoc.data.payload;
    const updatedPayload = {
      ...existing,
      clientDetails: {
        ...existing.clientDetails,
        name: onboardingResponses.name || existing.clientDetails.name,
        company: onboardingResponses.company || existing.clientDetails.company,
        email: onboardingResponses.email || existing.clientDetails.email,
        phone: onboardingResponses.phone || existing.clientDetails.phone
      },
      projectDetails: {
        ...existing.projectDetails,
        mainGoal: onboardingResponses.mainGoal || existing.projectDetails.mainGoal
      },
      requirements: {
        ...existing.requirements,
        targetAudience: onboardingResponses.targetAudience || existing.requirements.targetAudience,
        references: onboardingResponses.references || existing.requirements.references
      },
      confirmation: {
        confirmedClientName: onboardingResponses.name || activeClientSession.name,
        signature: onboardingResponses.name || activeClientSession.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    };
    submitOnboardingFormAsClient(fillingOnboardingDoc.id, updatedPayload);
    setFillingOnboardingDoc(null);
    triggerConfetti();
    addToast('Onboarding form submitted successfully! Freelancer has been notified.', 'success');
  };

  const handleApprove = (delId: string) => {
    if (!currentProject) return;
    approveDeliverable(currentProject.id, delId);
  };

  const handleOpenRevision = (del: Deliverable) => {
    setRevisionDel(del);
    setRevisionFeedback(del.feedback || '');
  };

  const handleSaveRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProject && revisionDel) {
      requestDeliverableRevision(currentProject.id, revisionDel.id, revisionFeedback);
      setRevisionDel(null);
      setRevisionFeedback('');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !currentProject) return;
    addProjectMessage(currentProject.id, {
      sender: 'client',
      senderName: activeClientSession.name || activeClientSession.company,
      message: chatMessage.trim()
    });
    setChatMessage('');
    addToast('Message sent to freelancer', 'success');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    completeProjectWithTestimonial(currentProject.id, {
      rating,
      comment: testimonialComment,
      allowPublicDisplay
    });
    addToast('Thank you! Your testimonial has been submitted.', 'success');
  };

  const handleConfirmPay = () => {
    if (!payingInvoice) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      markInvoiceAsPaid(payingInvoice.id);
      setIsProcessingPayment(false);
      setPayingInvoice(null);
      triggerConfetti();
      addToast(`Payment of ₹${payingInvoice.totalAmount.toLocaleString()} confirmed via ${paymentMethod.toUpperCase()}!`, 'success');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Top Client Portal Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-black text-base shadow-2xs">
            {activeClientSession.company.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{activeClientSession.company}</span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                Client Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Welcome back, <strong>{activeClientSession.name}</strong> • Working with <strong>{profile.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveView('landing')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Go to FreelancerHub Homepage"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Homepage</span>
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs border border-emerald-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch to Freelancer View</span>
            <span className="sm:hidden">Freelancer</span>
          </button>

          <button
            onClick={clientLogout}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
            title="Sign out of Client Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Project Selector if client has multiple projects */}
        {myProjects.length > 1 && (
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Switch Project:</span>
            <div className="flex items-center gap-2">
              {myProjects.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    currentProject?.id === p.id
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Project Main Header */}
        {currentProject ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  Project Workspace
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{currentProject.name}</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Service: <strong className="text-slate-800">{currentProject.service}</strong> • Managed by <strong className="text-slate-800">{profile.name}</strong> ({profile.title})
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-right shrink-0">
                <div className="text-xs text-slate-500">Target Delivery</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{currentProject.deadline}</div>
                <div className="text-xs font-bold text-emerald-600 mt-1">{currentProject.progress}% Completed</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentProject.progress}%` }}
              />
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 overflow-x-auto scrollbar-none">
              {[
                { id: 'overview', label: 'Overview & Milestones', icon: FolderKanban },
                { id: 'deliverables', label: `Deliverables & Sign-Off (${currentProject.deliverables.length})`, icon: CheckCircle2 },
                { id: 'documents', label: 'Agreement & Documents', icon: FileSignature },
                { id: 'billing', label: `Invoices & Payments (${myInvoices.length})`, icon: Receipt },
                { id: 'messages', label: `Messages & Chat (${currentProject.messages?.length || 0})`, icon: MessageSquare },
                { id: 'review', label: 'Testimonial & Review', icon: Star }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = portalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPortalTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Overview */}
            {portalTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Pending Actions Callout */}
                {(pendingDeliverables.length > 0 || pendingInvoices.length > 0 || currentProject.agreement?.status !== 'completed') && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      Pending Client Actions
                    </span>
                    <ul className="text-xs text-amber-800 list-disc list-inside space-y-1 pl-1">
                      {pendingDeliverables.map(d => (
                        <li key={d.id}>
                          Deliverable awaiting your review: <strong>{d.title}</strong>
                        </li>
                      ))}
                      {currentProject.agreement && currentProject.agreement.status !== 'completed' && (
                        <li>Service Agreement pending client signature.</li>
                      )}
                      {pendingInvoices.map(inv => (
                        <li key={inv.id}>
                          Invoice <strong>{inv.invoiceNumber}</strong> (₹{inv.totalAmount.toLocaleString()}) ready for payment.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Scope Description */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Project Scope & Specs</h3>
                  <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed font-medium">
                    {currentProject.description}
                  </p>
                </div>

                {/* Milestones Timeline */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Milestone Progress</h3>
                  <div className="space-y-2">
                    {currentProject.milestones.map((m, idx) => (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                          m.completed
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            m.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {m.completed ? '✓' : idx + 1}
                          </span>
                          <span>{m.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {m.completed ? `Completed ${m.completedAt || ''}` : 'In Progress'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Deliverables & Sign-Off */}
            {portalTab === 'deliverables' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Project Deliverables & Client Approvals</h3>
                  <span className="text-xs text-slate-500">Approve deliverable or request revisions with feedback</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentProject.deliverables.map(del => (
                    <div
                      key={del.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{del.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            del.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : del.status === 'revision_requested'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}>
                            {del.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{del.description}</p>

                        {del.feedback && (
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                            <strong>Client Feedback:</strong> "{del.feedback}"
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">Due: {del.dueDate}</span>
                        {del.status !== 'approved' ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenRevision(del)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                            >
                              Request Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprove(del.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all hover:scale-105"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Approved by Client
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Documents & Agreements */}
            {portalTab === 'documents' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Project Documents & Legal Signatures</h3>
                    <p className="text-xs text-slate-500">Official agreements, onboarding forms, deliverables matrices, and project memos.</p>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {myDocuments.length} Documents Available
                  </span>
                </div>

                {myDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myDocuments.map(doc => {
                      const isAgreement = doc.type === 'client_agreement';
                      const isOnboarding = doc.type === 'onboarding_form';
                      const isSigned = doc.status === 'accepted';
                      const isCompleted = doc.status === 'completed';

                      return (
                        <div
                          key={doc.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                                {doc.type.replace('_', ' ')}
                              </span>
                              <span
                                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                  isSigned || isCompleted || doc.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : doc.status === 'sent'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {isSigned ? '✓ Signed' : isCompleted ? '✓ Completed' : doc.status}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {doc.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {doc.subtitle || `Official ${doc.type.replace('_', ' ')} for ${doc.clientCompany}`}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-400 font-medium">
                              Date: {doc.updatedAt}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewingDoc(doc)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View A4</span>
                              </button>

                              {isAgreement && !isSigned && (
                                <button
                                  type="button"
                                  onClick={() => handleSignAgreementModal(doc)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                                >
                                  <FileSignature className="w-3.5 h-3.5" />
                                  <span>Sign</span>
                                </button>
                              )}

                              {isOnboarding && !isCompleted && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenOnboardingModal(doc)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Fill Form</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-bold text-slate-600 text-sm">No documents shared yet</p>
                    <p className="text-slate-400">When your freelancer sends agreements, invoices, or project briefs, they will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Invoices & Payments */}
            {portalTab === 'billing' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Project Billing & Invoices</h3>
                  <span className="text-xs text-slate-500">View and settle invoices securely</span>
                </div>

                <div className="space-y-3">
                  {myInvoices.map(inv => (
                    <div
                      key={inv.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-xs">{inv.invoiceNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                            inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Due Date: {inv.dueDate} • Issue Date: {inv.issueDate}
                        </div>
                        <div className="text-sm font-black text-slate-900 mt-1">
                          Amount: ₹{inv.totalAmount.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {inv.status !== 'paid' ? (
                          <button
                            type="button"
                            onClick={() => setPayingInvoice(inv)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Invoice (₹{inv.totalAmount.toLocaleString()})</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Paid in Full</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Messages & Collaboration */}
            {portalTab === 'messages' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-slate-900">Direct Workspace Collaboration Thread</h3>

                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-4">
                  <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                    {(!currentProject.messages || currentProject.messages.length === 0) ? (
                      <div className="text-center py-8 text-xs text-slate-400">
                        No messages yet. Send a note to your freelancer below!
                      </div>
                    ) : (
                      currentProject.messages.map(msg => {
                        const isMe = msg.sender === 'client';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                              {msg.senderName} • {msg.timestamp}
                            </div>
                            <div
                              className={`p-3 rounded-2xl text-xs max-w-md ${
                                isMe
                                  ? 'bg-sky-600 text-white rounded-br-xs'
                                  : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs shadow-2xs'
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-200">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message to your freelancer..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:border-sky-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 6: Testimonial & Review */}
            {portalTab === 'review' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Client Review & Verified Testimonial</h3>
                  <span className="text-xs text-slate-500">Provide feedback for freelancer portfolio verification</span>
                </div>

                {currentProject.testimonial ? (
                  <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < currentProject.testimonial!.rating ? 'fill-current' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-emerald-800">✓ Testimonial Submitted</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 italic font-medium">
                      "{currentProject.testimonial.comment}"
                    </p>

                    <div className="text-[11px] text-slate-500">
                      Submitted by {currentProject.testimonial.clientName} ({currentProject.testimonial.companyName}) on {currentProject.testimonial.createdAt}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Rating (1–5 Stars)</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 text-amber-500 hover:scale-110 transition-transform"
                          >
                            <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-slate-300'}`} />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5 Stars</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Testimonial / Feedback</label>
                      <textarea
                        rows={4}
                        required
                        value={testimonialComment}
                        onChange={(e) => setTestimonialComment(e.target.value)}
                        placeholder="Describe your experience working with the freelancer, speed of delivery, communication, and overall quality..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:border-sky-600 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="allowPublic"
                        checked={allowPublicDisplay}
                        onChange={(e) => setAllowPublicDisplay(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="allowPublic" className="text-xs text-slate-700 cursor-pointer font-medium">
                        Allow this testimonial to be publicly displayed on the freelancer's portfolio & case studies.
                      </label>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Submit Review & Complete Project</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 space-y-3">
            <FolderKanban className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Projects Found</h3>
            <p className="text-xs text-slate-500">There are no active projects associated with your client account.</p>
          </div>
        )}
      </main>

      {/* Revision Feedback Modal */}
      {revisionDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Request Revision: {revisionDel.title}</h3>
              <button onClick={() => setRevisionDel(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRevision} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">What changes would you like made?</label>
                <textarea
                  rows={4}
                  required
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="e.g. Please update the hero section heading font size and add the new contact form fields..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-sky-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRevisionDel(null)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md"
                >
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Pay Invoice {payingInvoice.invoiceNumber}</h3>
              </div>
              <button onClick={() => setPayingInvoice(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="text-xs text-emerald-800 font-medium">Total Amount Due</span>
              <div className="text-2xl font-black text-emerald-950">₹{payingInvoice.totalAmount.toLocaleString()}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR' },
                  { id: 'card', label: 'Card' },
                  { id: 'bank', label: 'NetBanking' }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === m.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleConfirmPay}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Pay ₹{payingInvoice.totalAmount.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A4 Document Fullscreen Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-sm animate-fade-in text-slate-900">
          {/* Top Bar */}
          <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{viewingDoc.title}</h3>
                <span className="text-[11px] text-slate-500">
                  {viewingDoc.type.replace('_', ' ').toUpperCase()} • Status: <strong className="text-slate-800 uppercase">{viewingDoc.status}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              {viewingDoc.type === 'client_agreement' && viewingDoc.status !== 'accepted' && (
                <button
                  type="button"
                  onClick={() => {
                    handleSignAgreementModal(viewingDoc);
                    setViewingDoc(null);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  <span>Sign Agreement</span>
                </button>
              )}

              {viewingDoc.type === 'onboarding_form' && viewingDoc.status !== 'completed' && (
                <button
                  type="button"
                  onClick={() => {
                    handleOpenOnboardingModal(viewingDoc);
                    setViewingDoc(null);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Fill Form</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable A4 Document Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-100">
            <div className="max-w-[850px] w-full bg-white shadow-2xl rounded-2xl overflow-hidden my-auto">
              <A4DocumentRenderer document={viewingDoc} />
            </div>
          </div>
        </div>
      )}

      {/* Digital Signature Modal */}
      {signingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Accept & Sign Agreement</h3>
                  <span className="text-xs text-slate-500">{signingDoc.title}</span>
                </div>
              </div>
              <button onClick={() => setSigningDoc(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <p className="font-semibold text-slate-900">Agreement Terms Summary:</p>
              <p className="leading-relaxed">
                By entering your full name below, you confirm that you have read and agreed to the project deliverables, payment terms, revision policies, and terms set forth by <strong>{profile.name}</strong>.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Signatory Full Name (Legal Signature)
                </label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="e.g. John Doe / Client Representative"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Timestamped cryptographic electronic signature log will be recorded.</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSigningDoc(null)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!signerName.trim()}
                onClick={handleConfirmSignDoc}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50 hover:scale-105"
              >
                <Check className="w-4 h-4" />
                <span>Accept & Sign Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Onboarding Form Questionnaire Modal */}
      {fillingOnboardingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900">Client Onboarding Questionnaire</h3>
                <p className="text-xs text-slate-500">Please provide essential details to kick off our project smoothly.</p>
              </div>
              <button onClick={() => setFillingOnboardingDoc(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOnboardingForm} className="space-y-6 text-xs">
              {/* 1. Client Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs">1</span>
                  Client & Business Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={onboardingResponses.name || ''}
                      onChange={(e) => setOnboardingResponses({ ...onboardingResponses, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company / Brand Name</label>
                    <input
                      type="text"
                      required
                      value={onboardingResponses.company || ''}
                      onChange={(e) => setOnboardingResponses({ ...onboardingResponses, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={onboardingResponses.email || ''}
                      onChange={(e) => setOnboardingResponses({ ...onboardingResponses, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={onboardingResponses.phone || ''}
                      onChange={(e) => setOnboardingResponses({ ...onboardingResponses, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Project Goals & Audience */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs">2</span>
                  Project Goals & Requirements
                </h4>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Goal / Objective</label>
                  <textarea
                    rows={2}
                    placeholder="What is the key problem we are solving or goal we are achieving?"
                    value={onboardingResponses.mainGoal || ''}
                    onChange={(e) => setOnboardingResponses({ ...onboardingResponses, mainGoal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience & Brand Guidelines</label>
                  <textarea
                    rows={2}
                    placeholder="Describe your ideal customers and any existing design/brand guidelines..."
                    value={onboardingResponses.targetAudience || ''}
                    onChange={(e) => setOnboardingResponses({ ...onboardingResponses, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reference Links / Competitor Examples</label>
                  <input
                    type="text"
                    placeholder="https://example.com, https://inspiration.com"
                    value={onboardingResponses.references || ''}
                    onChange={(e) => setOnboardingResponses({ ...onboardingResponses, references: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. Timeline & Confirmation */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs">3</span>
                  Confirmation
                </h4>
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-[11px] text-slate-700 leading-relaxed">
                    I confirm that the information provided above is accurate and ready for project kickoff.
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setFillingOnboardingDoc(null)}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Onboarding Responses</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
