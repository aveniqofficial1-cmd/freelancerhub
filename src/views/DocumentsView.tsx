import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Download,
  Printer,
  Send,
  Eye,
  Sparkles,
  Layers,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  Building,
  User,
  ArrowLeft,
  Check,
  ExternalLink,
  ShieldCheck,
  FileSignature,
  Receipt,
  Maximize2,
  Minimize2,
  Filter
} from 'lucide-react';
import {
  ProfessionalDocument,
  DocumentTemplateType,
  DocumentStatus
} from '../types';
import { A4DocumentRenderer } from '../components/documents/A4DocumentRenderer';
import { DocumentFormEditor } from '../components/documents/DocumentFormEditor';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { SaveTemplateModal } from '../components/modals/SaveTemplateModal';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    selectedDocumentId,
    setSelectedDocumentId,
    addDocument,
    updateDocument,
    deleteDocument,
    duplicateDocument,
    saveDocumentAsTemplate,
    sendDocumentToClient,
    clients,
    projects,
    profile,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  // Mode: 'list' or 'editor' or 'preview'
  const [viewMode, setViewMode] = useState<'list' | 'editor' | 'preview'>('list');
  const [activeEditingDoc, setActiveEditingDoc] = useState<ProfessionalDocument | null>(null);

  // Modals
  const [docToDelete, setDocToDelete] = useState<ProfessionalDocument | null>(null);
  const [templateModalDoc, setTemplateModalDoc] = useState<ProfessionalDocument | null>(null);

  // 3-dot dropdown menu
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fullscreen preview in editor
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuDocId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered Documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.clientCompany && doc.clientCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.projectName && doc.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.templateName && doc.templateName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTypeFilter !== 'all' && doc.type !== selectedTypeFilter) return false;

    if (selectedStatusFilter === 'all') return true;
    if (selectedStatusFilter === 'templates') return doc.isTemplate;
    if (selectedStatusFilter === 'draft') return doc.status === 'draft';
    if (selectedStatusFilter === 'sent') return doc.status === 'sent';
    if (selectedStatusFilter === 'completed') return doc.status === 'completed' || doc.status === 'accepted' || doc.status === 'paid' || doc.status === 'approved';
    return true;
  });

  const templatesList: {
    type: DocumentTemplateType;
    title: string;
    subtitle: string;
    icon: any;
    description: string;
    color: string;
  }[] = [
    {
      type: 'welcome_message',
      title: 'Welcome Message',
      subtitle: 'Project kickoff & communication protocol',
      icon: Sparkles,
      description: 'Professional welcome memo introducing project overview, milestones, contact time, and scope.',
      color: 'from-emerald-600 to-teal-500'
    },
    {
      type: 'onboarding_form',
      title: 'Client Onboarding Form',
      subtitle: '6-part structured intake brief',
      icon: FileText,
      description: 'Interactive intake form capturing client details, project goals, brand preferences, and timeline.',
      color: 'from-sky-600 to-blue-500'
    },
    {
      type: 'client_agreement',
      title: 'Client Agreement',
      subtitle: 'Terms, scope, payment & e-signatures',
      icon: FileSignature,
      description: 'Rock-solid contract defining deliverables, revision policies, milestones, responsibilities, and IP.',
      color: 'from-indigo-600 to-violet-500'
    },
    {
      type: 'invoice',
      title: 'Invoice',
      subtitle: 'A4 billing & UPI/Bank payment details',
      icon: Receipt,
      description: 'Itemized billing document with subtotal, taxes, discounts, payment terms, and invoice status.',
      color: 'from-emerald-700 to-teal-600'
    },
    {
      type: 'pricing_chart',
      title: 'Pricing Chart',
      subtitle: 'Tiered service rate cards & add-ons',
      icon: Layers,
      description: 'Modern 3-tier package comparison sheet (Basic, Standard, Premium) plus customizable add-ons.',
      color: 'from-amber-600 to-orange-500'
    },
    {
      type: 'deliverables',
      title: 'Deliverables Document',
      subtitle: 'Milestone tracker & client approvals',
      icon: CheckCircle2,
      description: 'Complete project deliverables matrix with format notes, review status, requirements, and sign-offs.',
      color: 'from-teal-600 to-emerald-500'
    }
  ];

  const handleCreateNewDocument = (templateType: DocumentTemplateType) => {
    const defaultProj = projects[0];
    const defaultClient = clients[0];

    let initialPayload: any;

    if (templateType === 'welcome_message') {
      initialPayload = {
        type: 'welcome_message',
        payload: {
          freelancerName: profile.name,
          freelancerRole: profile.title,
          freelancerEmail: profile.email,
          freelancerPhone: profile.phone,
          freelancerWebsite: profile.website,
          documentDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          clientName: defaultProj?.clientName || 'Client Name',
          clientCompany: defaultProj?.clientCompany || 'Client Company',
          subject: `Welcome! Excited to Work With You on ${defaultProj?.name || 'Your Project'}`,
          welcomeMessage: `Hi ${defaultProj?.clientName || 'there'},\n\nThank you for choosing to work with me. I'm excited to collaborate with you on ${defaultProj?.name || 'this project'}.\n\nHere's a quick overview of what we'll be working on:`,
          projectName: defaultProj?.name || 'New Project',
          projectScope: defaultProj?.description || 'Custom professional service engagement.',
          startDate: defaultProj?.startDate || 'October 10, 2026',
          expectedDelivery: defaultProj?.deadline || 'October 25, 2026',
          communicationMethod: 'WhatsApp / Email / Client Portal',
          preferredContactTime: '10:00 AM – 6:00 PM IST',
          additionalNotes: 'All project milestones and deliverables will be posted directly to your client workspace.',
          closingMessage: "I'll keep you updated throughout the project and will reach out if I need any additional information from you.\n\nLooking forward to creating great results together!"
        }
      };
    } else if (templateType === 'onboarding_form') {
      initialPayload = {
        type: 'onboarding_form',
        payload: {
          clientDetails: {
            name: defaultProj?.clientName || 'Client Contact',
            company: defaultProj?.clientCompany || 'Brand Name',
            email: defaultClient?.email || 'client@example.com',
            phone: defaultClient?.phone || '+91 98765 00000',
            website: defaultClient?.address || 'https://example.com',
            contactMethods: ['Email', 'WhatsApp']
          },
          projectDetails: {
            projectName: defaultProj?.name || 'Project Name',
            projectType: defaultProj?.service || 'Web Development',
            projectDescription: defaultProj?.description || 'Project goals and scope.',
            mainGoal: 'Launch high-converting digital experience.',
            keyDeliverables: 'Figma prototypes, Responsive Code, Deployment'
          },
          requirements: {
            targetAudience: 'Target customer demographics',
            references: 'Reference website links',
            brandGuidelines: 'Brand colors and typography preferences',
            stylePreferences: 'Modern, minimal, high-speed',
            anythingToAvoid: 'Cluttered design, slow widgets'
          },
          timelineBudget: {
            startDate: defaultProj?.startDate || '2026-10-10',
            deadline: defaultProj?.deadline || '2026-10-25',
            budget: defaultProj?.budget || 25000,
            currency: 'INR (₹)',
            timelineFlexibility: 'Yes',
            otherDeadlines: 'None'
          },
          communication: {
            preferredContactPerson: defaultProj?.clientName || 'Primary Contact',
            communicationTools: ['Email', 'WhatsApp', 'Client Portal'],
            availabilityTimeZone: 'IST (UTC+5:30)',
            meetingFrequency: 'Weekly check-in',
            additionalNotes: 'Assets will be shared via Google Drive.'
          },
          confirmation: {
            confirmedClientName: defaultProj?.clientName || 'Client',
            signature: `${defaultProj?.clientName || 'Client'} (Pending Signature)`,
            date: new Date().toISOString().split('T')[0]
          }
        }
      };
    } else if (templateType === 'client_agreement') {
      initialPayload = {
        type: 'client_agreement',
        payload: {
          agreementNumber: `AGR-2026-${Math.floor(100 + Math.random() * 900)}`,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          version: 'v1.0 (Draft)',
          clientName: defaultProj?.clientName || 'Client Name',
          clientCompany: defaultProj?.clientCompany || 'Company',
          freelancerName: profile.name,
          freelancerBusiness: 'FreelancerHub Studio',
          freelancerEmail: profile.email,
          projectName: defaultProj?.name || 'Project Name',
          startDate: defaultProj?.startDate || 'October 10, 2026',
          deadline: defaultProj?.deadline || 'October 25, 2026',
          scopeOfWork: defaultProj?.description || 'Bespoke design and development services.',
          deliverables: [
            { id: 'del-1', name: 'Phase 1: Architecture & Figma Prototypes', description: 'Interactive wireframes and design system', dueDate: 'October 15, 2026' },
            { id: 'del-2', name: 'Phase 2: Full-Stack Staging Implementation', description: 'Production-ready code and live staging URL', dueDate: 'October 25, 2026' }
          ],
          totalFee: defaultProj?.budget || 25000,
          currency: 'INR (₹)',
          paymentScheduleType: '50_50',
          milestones: [
            { id: 'm-1', title: '50% Advance Kickoff Milestone', percentage: 50, amount: (defaultProj?.budget || 25000) / 2, dueCondition: 'Upon Agreement Execution' },
            { id: 'm-2', title: '50% Final Delivery & Sign-Off', percentage: 50, amount: (defaultProj?.budget || 25000) / 2, dueCondition: 'Upon Project Launch' }
          ],
          paymentMethod: 'UPI / IMPS / Bank Transfer',
          includedRevisions: '2 rounds of structured revisions included per phase prior to sign-off.',
          extraRevisionsPolicy: 'Additional iterations billed at ₹1,500/hour.',
          freelancerResponsibilities: [
            'Deliver agreed work on time with high craftsmanship.',
            'Maintain quality, security, and responsive mobile compatibility.',
            'Communicate any issues or dependencies promptly.'
          ],
          clientResponsibilities: [
            'Provide required brand materials and feedback within 4 business days.',
            'Process milestone payments as agreed.'
          ],
          changesAndAdditionalWorkClause:
            'Any changes outside the agreed scope, deliverables, or timeline may require additional fees or time. Such changes will be discussed and agreed upon in writing before proceeding.',
          clientSignature: '',
          freelancerSignature: `${profile.name} (Digital Signature Verified)`,
          freelancerSignedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }
      };
    } else if (templateType === 'invoice') {
      const invNum = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
      initialPayload = {
        type: 'invoice',
        payload: {
          invoiceNumber: invNum,
          invoiceDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          dueDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          paymentTerms: 'Due in 7 Days',
          freelancerName: profile.name,
          freelancerBusiness: 'FreelancerHub Studio',
          freelancerAddress: 'Banjara Hills, Hyderabad, India',
          freelancerEmail: profile.email,
          freelancerPhone: profile.phone,
          freelancerWebsite: profile.website,
          clientName: defaultProj?.clientName || 'Client Name',
          clientCompany: defaultProj?.clientCompany || 'Client Company',
          clientAddress: 'Hyderabad, India',
          clientEmail: defaultClient?.email || 'client@example.com',
          clientPhone: defaultClient?.phone || '+91 98765 00000',
          projectName: defaultProj?.name || 'Project Name',
          items: [
            { id: 'it-1', description: `Milestone Deposit for ${defaultProj?.name || 'Project'}`, quantity: 1, rate: defaultProj?.budget || 25000, amount: defaultProj?.budget || 25000 }
          ],
          subtotal: defaultProj?.budget || 25000,
          taxPercent: 0,
          taxAmount: 0,
          discount: 0,
          totalDue: defaultProj?.budget || 25000,
          currency: 'INR (₹)',
          paymentMethod: 'UPI / Bank Transfer',
          upiBankDetails: 'UPI ID: rithvik@okaxis • HDFC Bank Banjara Hills',
          notes: 'Thank you for your business!'
        }
      };
    } else if (templateType === 'pricing_chart') {
      initialPayload = {
        type: 'pricing_chart',
        payload: {
          freelancerName: profile.name,
          freelancerBusiness: 'FreelancerHub Studio',
          freelancerEmail: profile.email,
          freelancerPhone: profile.phone,
          freelancerWebsite: profile.website,
          currency: 'INR (₹)',
          servicesOverview: [
            { id: 's-1', serviceName: 'Landing Page Website', basicPrice: 8000, standardPrice: 15000, premiumPrice: 28000 },
            { id: 's-2', serviceName: 'Full Custom Business Website', basicPrice: 18000, standardPrice: 35000, premiumPrice: 60000 },
            { id: 's-3', serviceName: 'Brand Identity & Design System', basicPrice: 6000, standardPrice: 14000, premiumPrice: 25000 }
          ],
          packages: [
            {
              id: 'p-1',
              name: 'Basic Package',
              price: 15000,
              description: 'Quick launchpad for creators & local businesses.',
              features: ['Single Landing Page', 'Mobile Responsive', 'Contact Form'],
              revisions: '2 Rounds',
              deliveryTime: '5 Days',
              popular: false
            },
            {
              id: 'p-2',
              name: 'Standard Package',
              price: 35000,
              description: 'Our most popular comprehensive package.',
              features: ['Up to 6 Custom Pages', 'Payment Integration', 'SEO Setup', 'Speed Optimized'],
              revisions: '3 Rounds',
              deliveryTime: '2 Weeks',
              popular: true
            },
            {
              id: 'p-3',
              name: 'Premium Package',
              price: 65000,
              description: 'Scale-ready solution with advanced integrations.',
              features: ['Unlimited Pages', 'Client Portal', 'Custom Animations', '30 Days Support'],
              revisions: 'Unlimited',
              deliveryTime: '4 Weeks',
              popular: false
            }
          ],
          addOns: [
            { id: 'a-1', name: 'Rush Delivery Expedite', price: 5000, description: '48-hour delivery turnaround' },
            { id: 'a-2', name: 'Additional Page Design', price: 3000, description: 'Full responsive page design & code' }
          ],
          paymentTerms: '50% deposit on start, 50% on completion.',
          paymentMethod: 'UPI / Cards / Bank Transfer',
          upiBankDetails: 'UPI: rithvik@okaxis',
          notes: 'Quotes valid for 30 days.'
        }
      };
    } else {
      // deliverables
      initialPayload = {
        type: 'deliverables',
        payload: {
          projectId: defaultProj ? `PRJ-${defaultProj.id}` : 'PRJ-2026-001',
          documentDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          version: 'v1.0 (Draft)',
          clientName: defaultProj?.clientName || 'Client Name',
          clientCompany: defaultProj?.clientCompany || 'Company',
          projectName: defaultProj?.name || 'Project Name',
          projectType: defaultProj?.service || 'Web Development',
          startDate: defaultProj?.startDate || 'October 10, 2026',
          finalDeadline: defaultProj?.deadline || 'October 25, 2026',
          projectManager: profile.name,
          deliverablesTable: [
            {
              id: 'd-1',
              deliverable: 'Figma UI/UX Mockups',
              description: 'Wireframes & high-fidelity prototype',
              dueDate: 'October 15, 2026',
              formatNotes: 'Figma shareable link',
              status: 'in_progress'
            },
            {
              id: 'd-2',
              deliverable: 'Production Ready Code',
              description: 'Responsive frontend application deployed on staging',
              dueDate: 'October 25, 2026',
              formatNotes: 'Live URL + GitHub repo',
              status: 'pending'
            }
          ],
          filesMaterialsNeeded: 'Brand assets, high-res photos, copy brief.',
          designContentRequirements: 'Clean dark mode, mobile responsiveness, fast load speeds.',
          referenceLinks: 'https://cult.fit',
          additionalNotes: 'Handover includes 14-day warranty.',
          milestones: [
            { id: 'm-1', milestone: 'Draft Mockups', description: 'UI review', targetDate: 'Oct 15, 2026' },
            { id: 'm-2', milestone: 'Final Launch', description: 'Domain DNS cutover', targetDate: 'Oct 25, 2026' }
          ],
          clientApproval: '',
          freelancerApproval: profile.name,
          freelancerApprovalDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          notes: 'Milestones subject to timely client feedback.'
        }
      };
    }

    const newDoc = addDocument({
      type: templateType,
      title: templateType.replace('_', ' ').toUpperCase(),
      subtitle: templatesList.find(t => t.type === templateType)?.subtitle || 'Professional Business Document',
      status: 'draft',
      projectId: defaultProj?.id,
      projectName: defaultProj?.name,
      clientId: defaultProj?.clientId,
      clientName: defaultProj?.clientName,
      clientCompany: defaultProj?.clientCompany,
      data: initialPayload
    });

    setActiveEditingDoc(newDoc);
    setViewMode('editor');
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: DocumentStatus) => {
    const map: Record<string, string> = {
      draft: 'bg-slate-100 text-slate-700 border-slate-200',
      sent: 'bg-sky-100 text-sky-800 border-sky-200',
      viewed: 'bg-amber-100 text-amber-800 border-amber-200',
      accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      published: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      in_review: 'bg-blue-100 text-blue-800 border-blue-200',
      archived: 'bg-slate-100 text-slate-500 border-slate-200'
    };

    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${map[status] || map.draft}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-900 print:p-0 print:m-0 print:max-w-none">
      {/* Printable Area Handler for clean print styling */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-document, #printable-document * {
            visibility: visible;
          }
          #printable-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Mode 1: Split Screen Document Editor & Live Preview */}
      {viewMode === 'editor' && activeEditingDoc ? (
        <div className="space-y-4 animate-fade-in">
          {/* Top Editor Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Back to Documents List"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900">{activeEditingDoc.title}</h2>
                  {getStatusBadge(activeEditingDoc.status)}
                </div>
                <p className="text-xs text-slate-500">
                  {activeEditingDoc.projectName ? `Project: ${activeEditingDoc.projectName} (${activeEditingDoc.clientCompany})` : 'Standalone Document'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => setTemplateModalDoc(activeEditingDoc)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Save as Template</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sendDocumentToClient(activeEditingDoc.id);
                  setActiveEditingDoc(prev => prev ? { ...prev, status: 'sent' } : null);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Client</span>
              </button>
            </div>
          </div>

          {/* Two-Panel Split Layout: Left Form Editor + Right Real-time Live A4 Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Form Controls (5 cols) */}
            <div className={`lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-h-[85vh] overflow-y-auto space-y-4 ${isFullscreenPreview ? 'hidden lg:hidden' : 'block'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-emerald-600" />
                  <span>Document Editor Controls</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ⚡ Live Auto-Updating
                </span>
              </div>

              <DocumentFormEditor
                document={activeEditingDoc}
                onChange={(updated) => {
                  setActiveEditingDoc(updated);
                  updateDocument(updated.id, updated);
                }}
                clients={clients}
                projects={projects}
                profile={profile}
              />
            </div>

            {/* Right Panel: Real-time Live A4 Canvas (7 cols) */}
            <div className={`${isFullscreenPreview ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-3`}>
              <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Live Printable A4 Document Preview</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsFullscreenPreview(!isFullscreenPreview)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1 text-[11px] font-bold"
                >
                  {isFullscreenPreview ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isFullscreenPreview ? 'Exit Fullscreen' : 'Fullscreen Preview'}</span>
                </button>
              </div>

              <div id="printable-document" className="bg-slate-200/60 p-4 sm:p-6 rounded-3xl border border-slate-300 overflow-x-auto shadow-inner">
                <A4DocumentRenderer document={activeEditingDoc} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Documents Hub & Templates Gallery */
        <div className="space-y-8 animate-fade-in">
          {/* Main Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Professional Documents & Templates</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {documents.length} Documents
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Generate high-craft A4 business documents, contracts, invoices, intake briefs, and rate cards with 1-click client delivery.
              </p>
            </div>
          </div>

          {/* 6 Professional Templates Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>Document Templates Library (6 Formats)</span>
                </h2>
                <p className="text-xs text-slate-500">Choose a template to auto-populate from your projects and generate printable PDFs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templatesList.map(tpl => {
                const Icon = tpl.icon;
                return (
                  <div
                    key={tpl.type}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group relative overflow-hidden shadow-2xs"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tpl.color} flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                          A4 Format
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {tpl.title}
                        </h3>
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">{tpl.subtitle}</p>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleCreateNewDocument(tpl.type)}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-105"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Document</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Documents', count: documents.length },
                { id: 'draft', label: 'Drafts', count: documents.filter(d => d.status === 'draft').length },
                { id: 'sent', label: 'Sent to Client', count: documents.filter(d => d.status === 'sent').length },
                { id: 'completed', label: 'Signed / Accepted / Paid', count: documents.filter(d => d.status === 'completed' || d.status === 'accepted' || d.status === 'paid').length },
                { id: 'templates', label: 'Custom Templates', count: documents.filter(d => d.isTemplate).length }
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
                placeholder="Search documents, clients, projects..."
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Generated Documents List Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6 pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Generated Documents Archive ({filteredDocuments.length})</span>
              </h3>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No documents found matching your filter criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-4">Document Title & Type</th>
                      <th className="p-4">Client & Project</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Last Updated</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDocuments.map(doc => {
                      const isMenuOpen = activeMenuDocId === doc.id;

                      return (
                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <strong
                                  onClick={() => {
                                    setActiveEditingDoc(doc);
                                    setViewMode('editor');
                                  }}
                                  className="text-xs font-bold text-slate-900 hover:text-emerald-700 cursor-pointer block truncate"
                                >
                                  {doc.isTemplate && doc.templateName ? doc.templateName : doc.title}
                                </strong>
                                <span className="text-[11px] text-slate-400 font-medium capitalize">
                                  {doc.type.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="text-slate-800 font-bold">{doc.clientCompany || 'Direct Client'}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{doc.projectName || 'Standalone'}</div>
                          </td>

                          <td className="p-4">
                            {getStatusBadge(doc.status)}
                          </td>

                          <td className="p-4 text-slate-500 font-medium">
                            {doc.updatedAt}
                          </td>

                          <td className="p-4 text-right relative">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveEditingDoc(doc);
                                  setViewMode('editor');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit & Preview</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuDocId(isMenuOpen ? null : doc.id);
                                }}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                title="Actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                              <div ref={menuRef} className="absolute right-4 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-30 animate-scale-up text-left">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuDocId(null);
                                    setActiveEditingDoc(doc);
                                    setViewMode('editor');
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Preview Document</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuDocId(null);
                                    duplicateDocument(doc.id);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Duplicate</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuDocId(null);
                                    setActiveEditingDoc(doc);
                                    setTimeout(() => window.print(), 300);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Print / Download PDF</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuDocId(null);
                                    sendDocumentToClient(doc.id);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                                >
                                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Send to Client</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuDocId(null);
                                    setTemplateModalDoc(doc);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 flex items-center gap-2"
                                >
                                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Save as Template</span>
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuDocId(null);
                                    setDocToDelete(doc);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Delete Document</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Document Confirmation Modal */}
      {docToDelete && (
        <DeleteConfirmationModal
          isOpen={!!docToDelete}
          title="Delete this document?"
          message="This document will be permanently removed. This action cannot be undone."
          itemName={docToDelete.title}
          itemDetails={`Type: ${docToDelete.type.replace('_', ' ')} • Client: ${docToDelete.clientCompany || 'N/A'}`}
          confirmButtonText="Delete Document"
          onCancel={() => setDocToDelete(null)}
          onConfirm={() => {
            deleteDocument(docToDelete.id);
            setDocToDelete(null);
          }}
        />
      )}

      {/* Save as Template Modal */}
      {templateModalDoc && (
        <SaveTemplateModal
          isOpen={!!templateModalDoc}
          defaultTitle={templateModalDoc.title}
          onClose={() => setTemplateModalDoc(null)}
          onSave={(tplName) => {
            saveDocumentAsTemplate(templateModalDoc.id, tplName);
            setTemplateModalDoc(null);
          }}
        />
      )}
    </div>
  );
};
