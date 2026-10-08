import {
  FreelancerProfile,
  Client,
  Project,
  Lead,
  Invoice,
  ActivityItem,
  NotificationItem,
  TemplateItem
} from '../types';

export const initialFreelancerProfile: FreelancerProfile = {
  name: 'Rithvik Kolipaka',
  title: 'Web Developer & UI/UX Designer',
  bio: 'Building modern, high-converting digital experiences for growing businesses and forward-thinking brands.',
  location: 'Hyderabad, India',
  email: 'rithvik@freelancerhub.com',
  phone: '+91 98765 43210',
  website: 'https://freelancerhub.com/rithvik',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  availability: 'available',
  startingPrice: 15000,
  hourlyRate: 1500,
  skills: [
    'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'UI/UX Design', 
    'Figma', 'Node.js', 'E-commerce', 'REST APIs'
  ],
  services: [
    {
      id: 'srv-1',
      name: 'Landing Page Design & Build',
      description: 'High-converting, responsive single-page website with custom animations, SEO setup, and fast loading speed.',
      startingPrice: 15000,
      deliveryTime: '3-5 Days',
      popular: false,
      features: [
        'Custom Figma UI/UX Design',
        'Mobile-first Responsive Code',
        'Contact & Lead Capture Form',
        'SEO Meta & OpenGraph Setup'
      ],
      addOns: [
        { name: 'Copywriting & Content Strategy', price: 3000 },
        { name: 'Analytics & Pixel Integration', price: 1500 }
      ]
    },
    {
      id: 'srv-2',
      name: 'Business Website Package',
      description: 'Complete multi-page corporate or fitness website with schedule CMS, services breakdown, and client portal access.',
      startingPrice: 35000,
      deliveryTime: '7-10 Days',
      popular: true,
      features: [
        'Up to 6 Custom Pages',
        'Dynamic Schedule & Booking CMS',
        'Interactive Contact / Booking Engine',
        'Speed Score 95+ on Google PageSpeed'
      ],
      addOns: [
        { name: 'Multilingual Support', price: 5000 },
        { name: 'Custom CRM Webhook Sync', price: 3500 }
      ]
    },
    {
      id: 'srv-3',
      name: 'Custom Web Application',
      description: 'Full-featured web application with authentication, database integration, payments, and admin management.',
      startingPrice: 65000,
      deliveryTime: '14-20 Days',
      popular: false,
      features: [
        'Custom Frontend & Backend Architecture',
        'Payment Gateway Integration',
        'User Authentication & Roles',
        'Admin Dashboard & Analytics'
      ],
      addOns: [
        { name: 'Priority 24/7 Support SLA', price: 8000 }
      ]
    }
  ],
  socialLinks: {
    github: 'https://github.com/rithvik',
    linkedin: 'https://linkedin.com/in/rithvik',
    twitter: 'https://twitter.com/rithvik',
    dribbble: 'https://dribbble.com/rithvik'
  },
  stats: {
    totalProjects: 1,
    rating: 5.0,
    verifiedProjects: 1,
    onTimeRate: 100
  }
};

export const initialClients: Client[] = [
  {
    id: 'cli-abc-1',
    name: 'Ramesh Kumar',
    company: 'ABC Gym',
    email: 'abcgym@fitness.in',
    phone: '+91 98765 12345',
    avatarUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    status: 'active',
    portalStatus: 'not_invited',
    totalRevenue: 35000,
    projectCount: 1,
    lastActivity: 'Lead converted',
    notes: 'Premier fitness and CrossFit center in Hyderabad. Key contact: Ramesh Kumar.',
    address: 'Banjara Hills, Hyderabad, India',
    joinedDate: '2026-10-02',
    source: 'Instagram',
    projectRequirement: 'Membership & Class Booking Website'
  }
];

export const initialProjects: Project[] = [
  {
    id: 'prj-abc-1',
    verificationCode: 'ABC-2026-881',
    name: 'ABC Gym Website',
    clientId: 'cli-abc-1',
    clientName: 'Ramesh Kumar',
    clientCompany: 'ABC Gym',
    service: 'Business Website Package',
    description: 'High-converting gym membership website with class schedule calendar, trainer booking, and UPI payments.',
    budget: 35000,
    paidAmount: 17500,
    progress: 75,
    startDate: '2026-10-02',
    deadline: '2026-10-25',
    status: 'in_progress',
    paymentStructure: '50_50',
    workflowTemplate: 'website',
    createdAt: '2026-10-02',
    milestones: [
      { id: 'm-1', title: 'Brand Direction & Wireframes', completed: true, completedAt: '2026-10-04' },
      { id: 'm-2', title: 'UI Design & Membership Booking Flow', completed: true, completedAt: '2026-10-06' },
      { id: 'm-3', title: 'Responsive Development & CMS Setup', completed: true, completedAt: '2026-10-08' },
      { id: 'm-4', title: 'QA Testing & Domain Launch', completed: false }
    ],
    tasks: [
      { id: 't-1', title: 'Figma wireframes review', completed: true },
      { id: 't-2', title: 'Trainer directory database setup', completed: true },
      { id: 't-3', title: 'Payment gateway integration', completed: true },
      { id: 't-4', title: 'Final client sign-off & SSL setup', completed: false }
    ],
    deliverables: [
      {
        id: 'del-1',
        title: 'Figma UI/UX Mockups & Design System',
        description: 'High-fidelity Figma prototypes for Homepage, Pricing, Class Schedules, and Trainer bios.',
        dueDate: '2026-10-06',
        status: 'approved',
        submittedAt: '2026-10-05',
        approvedAt: '2026-10-06',
        version: 1
      },
      {
        id: 'del-2',
        title: 'Live Staging Website & Booking Engine',
        description: 'Complete responsive React/Tailwind codebase deployed on live preview server with interactive membership forms.',
        dueDate: '2026-10-15',
        status: 'submitted',
        submittedAt: '2026-10-08',
        version: 1
      }
    ],
    agreement: {
      id: 'agr-1',
      projectId: 'prj-abc-1',
      title: 'ABC Gym Website Service Agreement',
      freelancerName: 'Rithvik Kolipaka',
      clientName: 'Ramesh Kumar',
      companyName: 'ABC Gym',
      scope: 'Design, development, and launch of 6-page responsive gym website with membership booking.',
      price: 35000,
      timeline: '2 weeks (Target launch: Oct 25, 2026)',
      revisionPolicy: '2 rounds of structured revision included during milestone phases.',
      paymentTerms: '50% advance milestone on kickoff (₹17,500), 50% final upon project completion.',
      cancellationPolicy: 'Notice required within 7 days. Completed milestone payments are non-refundable.',
      ownership: 'Full intellectual property transferred to client upon final payment settlement.',
      confidentiality: 'Both parties agree to treat business metrics and source files with strict confidentiality.',
      status: 'client_signed',
      freelancerSignature: 'Rithvik Kolipaka',
      clientSignature: 'Ramesh Kumar',
      signedAt: '2026-10-02'
    },
    messages: [
      {
        id: 'msg-1',
        sender: 'freelancer',
        senderName: 'Rithvik',
        message: 'Hi Ramesh! Welcome to the ABC Gym project workspace. Staging server is now live for your review.',
        timestamp: 'Oct 08, 10:30 AM'
      }
    ]
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'lead-abc-1',
    clientName: 'Ramesh Kumar',
    companyName: 'ABC Gym',
    email: 'abcgym@fitness.in',
    phone: '+91 98765 12345',
    projectTitle: 'Membership & Class Booking Website',
    estimatedValue: 35000,
    source: 'Instagram',
    stage: 'won',
    notes: 'Needs modern website with schedule calendar, trainer profiles, and online member signup.',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-08'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-abc-1',
    invoiceNumber: 'INV-2026-001',
    projectId: 'prj-abc-1',
    projectName: 'ABC Gym Website',
    clientId: 'cli-abc-1',
    clientName: 'Ramesh Kumar',
    clientCompany: 'ABC Gym',
    clientEmail: 'abcgym@fitness.in',
    items: [
      { id: 'it-1', description: '50% Advance Milestone — ABC Gym Website Kickoff', quantity: 1, unitPrice: 17500 }
    ],
    subtotal: 17500,
    tax: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 17500,
    paidAmount: 17500,
    status: 'paid',
    issueDate: '2026-10-02',
    dueDate: '2026-10-09',
    paidAt: '2026-10-02',
    notes: 'Advance milestone paid via UPI.'
  },
  {
    id: 'inv-abc-2',
    invoiceNumber: 'INV-2026-002',
    projectId: 'prj-abc-1',
    projectName: 'ABC Gym Website',
    clientId: 'cli-abc-1',
    clientName: 'Ramesh Kumar',
    clientCompany: 'ABC Gym',
    clientEmail: 'abcgym@fitness.in',
    items: [
      { id: 'it-2', description: 'Final Milestone & Domain Launch — ABC Gym Website', quantity: 1, unitPrice: 17500 }
    ],
    subtotal: 17500,
    tax: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 17500,
    paidAmount: 0,
    status: 'sent',
    issueDate: '2026-10-08',
    dueDate: '2026-10-25',
    notes: 'Final balance due upon project completion.'
  }
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    projectId: 'prj-abc-1',
    projectName: 'ABC Gym Website',
    description: 'Advance invoice #INV-2026-001 settled (₹17,500)',
    type: 'invoice',
    timestamp: 'Oct 02, 2026'
  },
  {
    id: 'act-2',
    projectId: 'prj-abc-1',
    projectName: 'ABC Gym Website',
    description: 'Client signed service agreement',
    type: 'document',
    timestamp: 'Oct 02, 2026'
  },
  {
    id: 'act-3',
    projectId: 'prj-abc-1',
    projectName: 'ABC Gym Website',
    description: 'Deliverable #del-1 approved by client',
    type: 'approval',
    timestamp: 'Oct 06, 2026'
  }
];

export const initialNotifications: NotificationItem[] = [];

export const initialTemplates: TemplateItem[] = [
  {
    id: 'tpl-1',
    title: 'Client Project Welcome & Kickoff Message',
    category: 'communication',
    description: 'Professional welcome message introducing project milestones, communication channels, and timeline expectations.',
    tags: ['Kickoff', 'Welcome', 'Email'],
    content: `Hi {client_name},

Welcome to your {project_name} project! We are thrilled to partner with {client_company} and bring this vision to life.

Here is what you can expect over the next few days:
1. Kickoff Onboarding Brief — We will gather your brand assets, preferred color palette, and inspiration links.
2. Architecture & Design Wireframes — You will receive early Figma prototypes to review and approve before coding starts.
3. Live Interactive Deliverables — Every major milestone will be shared for your 1-click review and feedback.

Our primary workspace is accessible anytime via your client portal link. If you have questions, feel free to reply directly to this message.

Looking forward to building something outstanding together!

Warm regards,
{freelancer_name}
{freelancer_title}`
  },
  {
    id: 'tpl-2',
    title: 'High-Conversion Website Proposal Template',
    category: 'document',
    description: 'Comprehensive project proposal with problem definition, strategic solution, milestone pricing, and terms.',
    tags: ['Proposal', 'Website', 'Sales'],
    content: `PROJECT PROPOSAL: {project_name}
Client: {client_name} ({client_company})
Prepared by: {freelancer_name}

1. EXECUTIVE SUMMARY
{client_company} is poised to accelerate online growth. This project focuses on designing and delivering a modern, high-speed digital experience that turns casual visitors into paying customers.

2. PROBLEM STATEMENT & OBJECTIVES
- Modernize digital brand perception
- Eliminate mobile navigation friction
- Implement seamless 1-click customer conversions
- Achieve Google PageSpeed score of 90+

3. SCOPE OF DELIVERABLES
- Comprehensive Figma UI/UX Design System
- Full-Stack Responsive Code (React / Next.js / Tailwind)
- Payment Gateway & CRM Form Integration
- Search Engine Optimization (SEO) & Analytics Setup
- 30-Day Post-Launch Warranty

4. INVESTMENT & TIMELINE
Total Project Value: {budget}
Timeline: 3 to 4 Weeks from kickoff
Payment Terms: 50% deposit upon kickoff, 50% upon final deliverable sign-off.`
  },
  {
    id: 'tpl-3',
    title: 'Standard Freelance Service & IP Agreement',
    category: 'document',
    description: 'Rock-solid contract covering deliverables, intellectual property ownership, milestone payments, and revision limits.',
    tags: ['Contract', 'Legal', 'Agreement'],
    content: `FREELANCE SERVICES AGREEMENT
This agreement is entered between {freelancer_name} ("Freelancer") and {client_name} of {client_company} ("Client").

1. SCOPE OF SERVICES:
Freelancer shall perform professional development and design services for the project titled "{project_name}".

2. REVISIONS & APPROVALS:
Client shall review deliverables within 5 business days of submission. Each milestone includes up to 2 rounds of design revisions. Additional iterations outside initial scope shall be billed at hourly rate.

3. INTELLECTUAL PROPERTY:
Upon receipt of full and final payment, all custom source code, assets, and design files created for this project shall become the exclusive property of Client.

4. CONFIDENTIALITY:
Both parties agree not to disclose proprietary or non-public business information shared during the engagement.`
  },
  {
    id: 'tpl-4',
    title: 'Comprehensive Website Onboarding Form',
    category: 'onboarding',
    description: '10 essential questions to extract exact brand requirements, color preferences, and competitors.',
    tags: ['Onboarding', 'Brief', 'Website'],
    content: `Website Onboarding Brief:
1. Business name and core elevator pitch
2. Primary target audience & demographics
3. Top 3 competitor websites (what do you like/dislike?)
4. Brand guidelines, logo files, and color palette preferences
5. Essential features (e.g. Booking, Payments, Blog, Multi-language)
6. Reference websites whose aesthetic you admire
7. High-priority deadline or launch event`
  },
  {
    id: 'tpl-5',
    title: 'Project Milestone Delay Notification',
    category: 'communication',
    description: 'Courteous notification if asset delays or technical complexity require adjusting target delivery dates.',
    tags: ['Delay', 'Update', 'Communication'],
    content: `Hi {client_name},

I am writing to share a quick update on {project_name}.

To ensure the highest code quality and thorough mobile responsiveness testing, we are adjusting our target completion date for the upcoming milestone to {target_date}.

All remaining deliverables remain on track. Thank you for your continued collaboration and trust!

Best regards,
{freelancer_name}`
  },
  {
    id: 'tpl-6',
    title: 'Project Completion & Testimonial Request',
    category: 'communication',
    description: 'Celebratory project wrap-up message with 1-click client testimonial request.',
    tags: ['Completion', 'Testimonial', 'Review'],
    content: `Hi {client_name},

🎉 Congratulations! Your {project_name} is now 100% complete and deployed live.

It has been an absolute pleasure collaborating with {client_company}. 

If you loved the experience and results, could you take 60 seconds to share a short review? Your feedback helps verify our work and supports growing independent creators.

Thank you once again for choosing to work together!

Warm regards,
{freelancer_name}`
  }
];
