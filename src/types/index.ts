export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  startingPrice: number;
  deliveryTime: string;
  popular?: boolean;
  features: string[];
  addOns?: { name: string; price: number }[];
}

export interface FreelancerProfile {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  avatarUrl: string;
  availability: AvailabilityStatus;
  startingPrice: number;
  hourlyRate: number;
  skills: string[];
  services: ServicePackage[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    dribbble?: string;
    instagram?: string;
  };
  stats: {
    totalProjects: number;
    rating: number;
    verifiedProjects: number;
    onTimeRate: number;
  };
}

export type LeadStage = 'new' | 'contacted' | 'meeting' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';

export type LostReason = 
  | 'Price' 
  | 'Timeline' 
  | 'Client chose competitor' 
  | 'Client cancelled' 
  | 'No response' 
  | 'Requirements changed' 
  | 'Other';

export interface Lead {
  id: string;
  clientName: string;
  companyName: string;
  email: string;
  phone?: string;
  projectTitle: string;
  estimatedValue: number;
  source: string;
  stage: LeadStage;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lostReason?: LostReason;
  lostNotes?: string;
}

export type ClientStatus = 'active' | 'invited' | 'pending_invitation' | 'completed' | 'archived';
export type PortalInvitationStatus = 'not_invited' | 'invitation_sent' | 'portal_activated' | 'access_revoked';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: ClientStatus;
  portalStatus: PortalInvitationStatus;
  invitationSentAt?: string;
  invitationToken?: string;
  portalActivatedAt?: string;
  totalRevenue: number;
  projectCount: number;
  lastActivity: string;
  notes?: string;
  address?: string;
  joinedDate: string;
  source?: string;
  projectRequirement?: string;
}

export type ProjectStatus = 'in_progress' | 'completed' | 'review' | 'proposal' | 'archived' | 'lost';
export type PaymentStructure = 'full' | 'milestone' | '50_50' | 'custom';
export type WorkflowTemplate = 'website' | 'graphic_design' | 'video_editing' | 'social_media' | 'photography' | 'consulting' | 'custom';

export type DeliverableStatus = 'pending' | 'in_progress' | 'submitted' | 'in_review' | 'approved' | 'revision_requested' | 'completed';

export interface ProjectMessage {
  id: string;
  sender: 'freelancer' | 'client';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: DeliverableStatus;
  fileUrl?: string;
  fileName?: string;
  submittedAt?: string;
  approvedAt?: string;
  feedback?: string;
  version?: number;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
}

export interface FormQuestion {
  id: string;
  question: string;
  type: 'short_text' | 'long_text' | 'multiple_choice' | 'checkbox' | 'file_upload' | 'date';
  required: boolean;
  options?: string[];
  answer?: string | string[];
}

export interface OnboardingForm {
  id: string;
  projectId: string;
  title: string;
  description: string;
  questions: FormQuestion[];
  isSent: boolean;
  isCompleted: boolean;
  submittedAt?: string;
}

export interface AgreementDocument {
  id: string;
  projectId: string;
  title: string;
  freelancerName: string;
  clientName: string;
  companyName: string;
  scope: string;
  price: number;
  timeline: string;
  revisionPolicy: string;
  paymentTerms: string;
  cancellationPolicy: string;
  ownership: string;
  confidentiality: string;
  status: 'draft' | 'sent' | 'freelancer_signed' | 'client_signed' | 'completed';
  freelancerSignature?: string;
  clientSignature?: string;
  signedAt?: string;
}

export interface ProposalDocument {
  id: string;
  projectId: string;
  title: string;
  clientName: string;
  introduction: string;
  clientProblem: string;
  proposedSolution: string;
  scope: string;
  deliverables: string[];
  timeline: string;
  pricing: number;
  terms: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  projectId: string;
  clientName: string;
  companyName: string;
  clientTitle?: string;
  rating: number; // 1-5
  comment: string;
  allowPublicDisplay: boolean;
  createdAt: string;
}

export interface CaseStudy {
  id: string;
  projectId: string;
  title: string;
  category: string;
  clientName: string;
  challenge: string;
  solution: string;
  services: string[];
  technologies: string[];
  deliverables: string[];
  results: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  projectId?: string;
  projectName?: string;
  description: string;
  type: 'project' | 'invoice' | 'lead' | 'deliverable' | 'document' | 'client' | 'approval';
  timestamp: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number; // percentage
  taxAmount: number;
  discount: number; // amount
  totalAmount: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  notes?: string;
}

export interface Project {
  id: string;
  verificationCode?: string;
  name: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  service: string;
  description: string;
  budget: number;
  paidAmount: number;
  progress: number;
  startDate: string;
  deadline: string;
  status: ProjectStatus;
  paymentStructure: PaymentStructure;
  workflowTemplate: WorkflowTemplate;
  milestones: Milestone[];
  tasks: ProjectTask[];
  deliverables: Deliverable[];
  onboardingForm?: OnboardingForm;
  agreement?: AgreementDocument;
  proposal?: ProposalDocument;
  testimonial?: Testimonial;
  caseStudy?: CaseStudy;
  messages?: ProjectMessage[];
  isVerified?: boolean;
  verifiedAt?: string;
  lostReason?: LostReason;
  lostNotes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  linkTo?: {
    view: string;
    projectId?: string;
    clientId?: string;
    tab?: string;
  };
}

export interface TemplateItem {
  id: string;
  title: string;
  category: 'communication' | 'document' | 'onboarding';
  description: string;
  content: string;
  tags: string[];
}

export type DocumentTemplateType =
  | 'welcome_message'
  | 'onboarding_form'
  | 'client_agreement'
  | 'invoice'
  | 'pricing_chart'
  | 'deliverables';

export type DocumentStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'completed'
  | 'accepted'
  | 'rejected'
  | 'paid'
  | 'overdue'
  | 'published'
  | 'archived'
  | 'in_review'
  | 'approved';

export interface WelcomeMessageData {
  freelancerName: string;
  freelancerRole: string;
  freelancerBusiness?: string;
  freelancerEmail: string;
  freelancerPhone: string;
  freelancerWebsite: string;
  documentDate: string;
  clientName: string;
  clientCompany: string;
  subject: string;
  welcomeMessage: string;
  projectName: string;
  projectScope: string;
  startDate: string;
  expectedDelivery: string;
  communicationMethod: string;
  preferredContactTime: string;
  additionalNotes: string;
  closingMessage: string;
}

export interface OnboardingFormSection1 {
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  contactMethods: string[];
}

export interface OnboardingFormSection2 {
  projectName: string;
  projectType: string;
  projectDescription: string;
  mainGoal: string;
  keyDeliverables: string;
}

export interface OnboardingFormSection3 {
  targetAudience: string;
  references: string;
  brandGuidelines: string;
  stylePreferences: string;
  anythingToAvoid: string;
}

export interface OnboardingFormSection4 {
  startDate: string;
  deadline: string;
  budget: number;
  currency: string;
  timelineFlexibility: 'Yes' | 'No' | 'Maybe';
  otherDeadlines: string;
}

export interface OnboardingFormSection5 {
  preferredContactPerson: string;
  communicationTools: string[];
  availabilityTimeZone: string;
  meetingFrequency: string;
  additionalNotes: string;
}

export interface OnboardingFormSection6 {
  confirmedClientName: string;
  signature: string;
  date: string;
}

export interface OnboardingFormData {
  clientDetails: OnboardingFormSection1;
  projectDetails: OnboardingFormSection2;
  requirements: OnboardingFormSection3;
  timelineBudget: OnboardingFormSection4;
  communication: OnboardingFormSection5;
  confirmation: OnboardingFormSection6;
  customQuestions?: { id: string; question: string; answer?: string; required?: boolean }[];
}

export interface AgreementDeliverableItem {
  id: string;
  name: string;
  description: string;
  dueDate: string;
}

export interface AgreementPaymentMilestone {
  id: string;
  title: string;
  percentage: number;
  amount: number;
  dueCondition: string;
}

export interface ClientAgreementData {
  agreementNumber: string;
  date: string;
  version: string;
  clientName: string;
  clientCompany: string;
  freelancerName: string;
  freelancerBusiness: string;
  freelancerEmail: string;
  projectName: string;
  startDate: string;
  deadline: string;
  scopeOfWork: string;
  deliverables: AgreementDeliverableItem[];
  totalFee: number;
  currency: string;
  paymentScheduleType: '50_50' | 'milestones' | 'full' | 'custom';
  milestones: AgreementPaymentMilestone[];
  paymentMethod: string;
  includedRevisions: string;
  extraRevisionsPolicy: string;
  freelancerResponsibilities: string[];
  clientResponsibilities: string[];
  changesAndAdditionalWorkClause: string;
  clientSignature?: string;
  freelancerSignature: string;
  clientSignedDate?: string;
  freelancerSignedDate: string;
}

export interface InvoiceItemEntry {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  freelancerName: string;
  freelancerBusiness: string;
  freelancerAddress: string;
  freelancerEmail: string;
  freelancerPhone: string;
  freelancerWebsite: string;
  clientName: string;
  clientCompany: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  projectName: string;
  items: InvoiceItemEntry[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discount: number;
  totalDue: number;
  currency: string;
  paymentMethod: string;
  upiBankDetails: string;
  notes: string;
}

export interface PricingOverviewItem {
  id: string;
  serviceName: string;
  basicPrice: number;
  standardPrice: number;
  premiumPrice: number;
}

export interface PricingPackageCard {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  revisions: string;
  deliveryTime: string;
  popular?: boolean;
}

export interface PricingAddOnItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface PricingChartData {
  freelancerName: string;
  freelancerBusiness: string;
  freelancerEmail: string;
  freelancerPhone: string;
  freelancerWebsite: string;
  currency: string;
  servicesOverview: PricingOverviewItem[];
  packages: PricingPackageCard[];
  addOns: PricingAddOnItem[];
  paymentTerms: string;
  paymentMethod: string;
  upiBankDetails: string;
  notes: string;
}

export interface DeliverableItemEntry {
  id: string;
  deliverable: string;
  description: string;
  dueDate: string;
  formatNotes: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'in_review' | 'approved' | 'revision_requested' | 'completed';
}

export interface DeliverablesDocData {
  projectId: string;
  documentDate: string;
  version: string;
  clientName: string;
  clientCompany: string;
  projectName: string;
  projectType: string;
  startDate: string;
  finalDeadline: string;
  projectManager: string;
  deliverablesTable: DeliverableItemEntry[];
  filesMaterialsNeeded: string;
  designContentRequirements: string;
  referenceLinks: string;
  additionalNotes: string;
  milestones: { id: string; milestone: string; description: string; targetDate: string }[];
  clientApproval?: string;
  freelancerApproval: string;
  clientApprovalDate?: string;
  freelancerApprovalDate: string;
  notes: string;
}

export interface ProfessionalDocument {
  id: string;
  type: DocumentTemplateType;
  title: string;
  subtitle: string;
  status: DocumentStatus;
  clientId?: string;
  clientName?: string;
  clientCompany?: string;
  projectId?: string;
  projectName?: string;
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
  templateName?: string;
  data:
    | { type: 'welcome_message'; payload: WelcomeMessageData }
    | { type: 'onboarding_form'; payload: OnboardingFormData }
    | { type: 'client_agreement'; payload: ClientAgreementData }
    | { type: 'invoice'; payload: InvoiceData }
    | { type: 'pricing_chart'; payload: PricingChartData }
    | { type: 'deliverables'; payload: DeliverablesDocData };
}
