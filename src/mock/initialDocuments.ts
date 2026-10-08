import { ProfessionalDocument } from '../types';

export const initialDocuments: ProfessionalDocument[] = [
  {
    id: 'doc-welcome-1',
    type: 'welcome_message',
    title: 'WELCOME MESSAGE',
    subtitle: 'A professional introduction and project-start message for your client.',
    status: 'sent',
    clientId: 'cli-abc-1',
    clientName: 'Ramesh Kumar',
    clientCompany: 'ABC Gym',
    projectId: 'prj-abc-1',
    projectName: 'ABC Gym Website',
    createdAt: '2026-10-02',
    updatedAt: '2026-10-02',
    data: {
      type: 'welcome_message',
      payload: {
        freelancerName: 'Rithvik Kolipaka',
        freelancerRole: 'Full-Stack Developer & UI/UX Designer',
        freelancerEmail: 'rithvik@freelancerhub.com',
        freelancerPhone: '+91 94401 23456',
        freelancerWebsite: 'https://rithvik.design',
        documentDate: 'October 02, 2026',
        clientName: 'Ramesh Kumar',
        clientCompany: 'ABC Gym',
        subject: 'Welcome! Excited to Work With You on ABC Gym Website',
        welcomeMessage:
          "Hi Ramesh,\n\nThank you for choosing to work with me! I'm excited to collaborate with you on the ABC Gym Website project. Our primary goal is to build a high-converting, blazing-fast web presence with class schedules and online membership signup.\n\nHere's a quick overview of what we'll be working on:",
        projectName: 'ABC Gym Website',
        projectScope:
          'Design and development of a bespoke 6-page responsive gym website featuring class schedule calendar, trainer booking engine, membership tiers, and instant UPI checkout.',
        startDate: 'October 02, 2026',
        expectedDelivery: 'October 25, 2026',
        communicationMethod: 'WhatsApp & Client Portal (Async)',
        preferredContactTime: '10:00 AM – 6:00 PM IST (Mon–Fri)',
        additionalNotes:
          'Staging preview links and major milestones will be posted directly to your Client Portal for 1-click approvals and review.',
        closingMessage:
          "I'll keep you updated throughout each milestone phase and will reach out if I need any additional brand assets.\n\nLooking forward to creating great results together!"
      }
    }
  },
  {
    id: 'doc-onboard-1',
    type: 'onboarding_form',
    title: 'CLIENT ONBOARDING FORM',
    subtitle: 'A quick form to collect essential client and project details before starting.',
    status: 'completed',
    clientId: 'cli-abc-1',
    clientName: 'Ramesh Kumar',
    clientCompany: 'ABC Gym',
    projectId: 'prj-abc-1',
    projectName: 'ABC Gym Website',
    createdAt: '2026-10-02',
    updatedAt: '2026-10-03',
    data: {
      type: 'onboarding_form',
      payload: {
        clientDetails: {
          name: 'Ramesh Kumar',
          company: 'ABC Gym',
          email: 'abcgym@fitness.in',
          phone: '+91 98765 12345',
          website: 'https://abcgym.in',
          contactMethods: ['Email', 'WhatsApp']
        },
        projectDetails: {
          projectName: 'ABC Gym Website',
          projectType: 'Web Development & UI/UX Design',
          projectDescription: 'High-converting gym membership and class booking website for Hyderabad fitness center.',
          mainGoal: 'Increase online membership signups and allow members to book classes with trainers effortlessly.',
          keyDeliverables: 'Figma UI/UX Mockups, Responsive Website, Booking Flow, UPI Gateway, SEO Setup.'
        },
        requirements: {
          targetAudience: 'Fitness enthusiasts, CrossFit athletes, professionals aged 20–45 in Hyderabad.',
          references: 'Cult.fit, Equinox, Barrys Bootcamp',
          brandGuidelines: 'Bold energetic aesthetic, neon lime & dark carbon theme. High contrast typography.',
          stylePreferences: 'Modern, punchy, athletic, minimal clutter, mobile-first design.',
          anythingToAvoid: 'Cluttered stock gym photos, overly corporate blue gradients, slow-loading widgets.'
        },
        timelineBudget: {
          startDate: '2026-10-02',
          deadline: '2026-10-25',
          budget: 35000,
          currency: 'INR (₹)',
          timelineFlexibility: 'Yes',
          otherDeadlines: 'Social media Diwali launch campaign on Nov 01, 2026.'
        },
        communication: {
          preferredContactPerson: 'Ramesh Kumar (Managing Director)',
          communicationTools: ['Email', 'WhatsApp', 'Client Portal'],
          availabilityTimeZone: 'IST (UTC+5:30) 10 AM - 7 PM',
          meetingFrequency: 'Weekly Milestone Check-in',
          additionalNotes: 'High-resolution photography of gym floor and trainers will be provided via Drive link.'
        },
        confirmation: {
          confirmedClientName: 'Ramesh Kumar',
          signature: 'Ramesh Kumar (Digital Verified)',
          date: '2026-10-03'
        }
      }
    }
  },
  {
    id: 'doc-agreement-1',
    type: 'client_agreement',
    title: 'CLIENT AGREEMENT',
    subtitle: 'A professional agreement defining the project terms, scope, responsibilities and payment conditions.',
    status: 'accepted',
    clientId: 'cli-abc-1',
    clientName: 'Ramesh Kumar',
    clientCompany: 'ABC Gym',
    projectId: 'prj-abc-1',
    projectName: 'ABC Gym Website',
    createdAt: '2026-10-02',
    updatedAt: '2026-10-02',
    data: {
      type: 'client_agreement',
      payload: {
        agreementNumber: 'AGR-2026-881',
        date: 'October 02, 2026',
        version: 'v1.0 (Final)',
        clientName: 'Ramesh Kumar',
        clientCompany: 'ABC Gym',
        freelancerName: 'Rithvik Kolipaka',
        freelancerBusiness: 'FreelancerHub Studio',
        freelancerEmail: 'rithvik@freelancerhub.com',
        projectName: 'ABC Gym Website',
        startDate: 'October 02, 2026',
        deadline: 'October 25, 2026',
        scopeOfWork:
          'Design, responsive full-stack frontend development, and live server deployment of a 6-page bespoke website for ABC Gym, including class schedules, trainer bookings, pricing comparison tables, and online UPI member checkout.',
        deliverables: [
          {
            id: 'agr-del-1',
            name: 'Figma UI/UX Prototypes',
            description: 'Interactive wireframes & visual designs for all pages',
            dueDate: 'October 06, 2026'
          },
          {
            id: 'agr-del-2',
            name: 'Production Ready Source Code & Assets',
            description: 'Fully responsive code deployed on live staging server',
            dueDate: 'October 15, 2026'
          },
          {
            id: 'agr-del-3',
            name: 'Final Domain Launch & SEO Config',
            description: 'Custom domain mapping, SSL certificate, and Google analytics verification',
            dueDate: 'October 25, 2026'
          }
        ],
        totalFee: 35000,
        currency: 'INR (₹)',
        paymentScheduleType: '50_50',
        milestones: [
          {
            id: 'ms-1',
            title: '50% Advance Milestone Deposit upon Agreement Execution',
            percentage: 50,
            amount: 17500,
            dueCondition: 'Prior to Project Kickoff'
          },
          {
            id: 'ms-2',
            title: '50% Final Settlement upon Final Deliverable Sign-Off',
            percentage: 50,
            amount: 17500,
            dueCondition: 'Prior to Domain Launch'
          }
        ],
        paymentMethod: 'UPI / IMPS / Bank Transfer / Stripe',
        includedRevisions: '2 rounds of structured revisions per milestone phase prior to final sign-off.',
        extraRevisionsPolicy: 'Additional iterations outside initial agreed scope billed at ₹1,500/hour with written approval.',
        freelancerResponsibilities: [
          'Deliver agreed deliverables on schedule with high professional craft.',
          'Ensure responsive compatibility across all modern desktop, tablet, and mobile devices.',
          'Communicate any technical dependencies or blockers proactively.',
          'Transfer 100% intellectual property ownership to Client upon final payment clearance.'
        ],
        clientResponsibilities: [
          'Provide brand logos, high-res gym images, trainer bios, and copy in a timely manner.',
          'Review submitted deliverables and provide structured feedback within 4 business days.',
          'Process milestone payments as per agreed payment schedule.'
        ],
        changesAndAdditionalWorkClause:
          'Any changes outside the agreed scope, deliverables, or timeline may require additional fees or time. Such changes will be discussed and agreed upon in writing before proceeding.',
        clientSignature: 'Ramesh Kumar (Digital Signature Verified)',
        freelancerSignature: 'Rithvik Kolipaka (Digital Verified)',
        clientSignedDate: 'October 02, 2026',
        freelancerSignedDate: 'October 02, 2026'
      }
    }
  },
  {
    id: 'doc-invoice-1',
    type: 'invoice',
    title: 'INVOICE',
    subtitle: 'Thank you for your business!',
    status: 'paid',
    clientId: 'cli-abc-1',
    clientName: 'Ramesh Kumar',
    clientCompany: 'ABC Gym',
    projectId: 'prj-abc-1',
    projectName: 'ABC Gym Website',
    createdAt: '2026-10-02',
    updatedAt: '2026-10-02',
    data: {
      type: 'invoice',
      payload: {
        invoiceNumber: 'INV-2026-001',
        invoiceDate: 'October 02, 2026',
        dueDate: 'October 09, 2026',
        paymentTerms: 'Due upon receipt / 7 Days',
        freelancerName: 'Rithvik Kolipaka',
        freelancerBusiness: 'FreelancerHub Studio',
        freelancerAddress: 'Banjara Hills, Hyderabad, Telangana 500034, India',
        freelancerEmail: 'rithvik@freelancerhub.com',
        freelancerPhone: '+91 94401 23456',
        freelancerWebsite: 'https://rithvik.design',
        clientName: 'Ramesh Kumar',
        clientCompany: 'ABC Gym',
        clientAddress: 'Road No. 36, Jubilee Hills, Hyderabad 500033',
        clientEmail: 'abcgym@fitness.in',
        clientPhone: '+91 98765 12345',
        projectName: 'ABC Gym Website',
        items: [
          {
            id: 'it-inv-1',
            description: '50% Advance Milestone Deposit — ABC Gym Website Kickoff & UI/UX Architecture',
            quantity: 1,
            rate: 17500,
            amount: 17500
          }
        ],
        subtotal: 17500,
        taxPercent: 0,
        taxAmount: 0,
        discount: 0,
        totalDue: 17500,
        currency: 'INR (₹)',
        paymentMethod: 'UPI / Direct Bank Transfer',
        upiBankDetails: 'UPI ID: rithvik@okaxis • HDFC Bank A/C: 501004928192 • IFSC: HDFC0001234',
        notes: 'Thank you for your business! All IP ownership rights transfer upon final invoice clearance.'
      }
    }
  },
  {
    id: 'doc-pricing-1',
    type: 'pricing_chart',
    title: 'PRICING CHART',
    subtitle: 'A clear price sheet to present your services, packages and rates professionally.',
    status: 'published',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
    isTemplate: true,
    templateName: 'Standard Freelance Web & Design Rate Card',
    data: {
      type: 'pricing_chart',
      payload: {
        freelancerName: 'Rithvik Kolipaka',
        freelancerBusiness: 'FreelancerHub Studio',
        freelancerEmail: 'rithvik@freelancerhub.com',
        freelancerPhone: '+91 94401 23456',
        freelancerWebsite: 'https://rithvik.design',
        currency: 'INR (₹)',
        servicesOverview: [
          {
            id: 'srv-1',
            serviceName: 'Landing Page / Portfolio Website',
            basicPrice: 8000,
            standardPrice: 15000,
            premiumPrice: 28000
          },
          {
            id: 'srv-2',
            serviceName: 'Full Custom Business Website (5–8 Pages)',
            basicPrice: 18000,
            standardPrice: 35000,
            premiumPrice: 60000
          },
          {
            id: 'srv-3',
            serviceName: 'E-Commerce & Membership Portal',
            basicPrice: 25000,
            standardPrice: 50000,
            premiumPrice: 95000
          },
          {
            id: 'srv-4',
            serviceName: 'Brand Identity & Figma UI/UX System',
            basicPrice: 6000,
            standardPrice: 14000,
            premiumPrice: 25000
          }
        ],
        packages: [
          {
            id: 'pkg-basic',
            name: 'Basic / Starter Package',
            price: 15000,
            description: 'Perfect for local businesses and creators needing a fast, high-converting digital launchpad.',
            features: [
              'Single High-Converting Landing Page',
              'Figma UI Design & Clean React Code',
              'Mobile & Tablet Responsive Layout',
              'Contact Form with Email Alerts',
              'Standard Google SEO Metadata'
            ],
            revisions: '2 Rounds of Revisions',
            deliveryTime: '5–7 Business Days',
            popular: false
          },
          {
            id: 'pkg-standard',
            name: 'Standard / Growth Package',
            price: 35000,
            description: 'Our most popular end-to-end package for growing brands and businesses requiring complete digital workflows.',
            features: [
              'Up to 6 Bespoke Custom Pages',
              'Interactive Booking / Schedule Calendar',
              'UPI & Payment Gateway Integration',
              'High-Converting Copywriting & Imagery',
              'Speed Optimization (90+ PageSpeed)',
              '14 Days Post-Launch Support'
            ],
            revisions: '3 Rounds of Revisions',
            deliveryTime: '2–3 Weeks',
            popular: true
          },
          {
            id: 'pkg-premium',
            name: 'Premium / Scale Package',
            price: 65000,
            description: 'Comprehensive enterprise-grade solution with bespoke CMS, customer portal, and advanced automations.',
            features: [
              'Unlimited Pages & Custom Post Types',
              'Full Client Portal & Database Backend',
              'Automated Invoice & Email Notifications',
              'Custom Micro-Animations & Framer Motion',
              'Advanced Analytics & Funnel Tracking',
              '30 Days Dedicated Priority Support'
            ],
            revisions: 'Unlimited Milestone Revisions',
            deliveryTime: '4–5 Weeks',
            popular: false
          }
        ],
        addOns: [
          { id: 'add-1', name: 'Rush 48-Hour Delivery Expedite', price: 6000, description: 'Priority turnaround with dedicated focus.' },
          { id: 'add-2', name: 'Additional Custom Page / View', price: 3500, description: 'Full design + frontend coding.' },
          { id: 'add-3', name: 'Multi-Language (Localization)', price: 8000, description: 'Dynamic translation support.' },
          { id: 'add-4', name: 'Extra Round of Structured Revisions', price: 2500, description: 'Post-signoff modification round.' },
          { id: 'add-5', name: 'Monthly Website Maintenance & Retainer', price: 5000, description: 'Security, updates, and minor edits.' }
        ],
        paymentTerms: '50% deposit upon project agreement execution, 50% upon final sign-off.',
        paymentMethod: 'UPI / Direct Bank Transfer / Razorpay / Credit Card',
        upiBankDetails: 'UPI: rithvik@okaxis • Bank: HDFC Bank Banjara Hills',
        notes: 'All quotes valid for 30 days. Custom scope packages available upon consultation.'
      }
    }
  },
  {
    id: 'doc-deliverables-1',
    type: 'deliverables',
    title: 'DELIVERABLES',
    subtitle: 'A document clearly listing what will be delivered, including project requirements and deadlines.',
    status: 'in_review',
    clientId: 'cli-abc-1',
    clientName: 'Ramesh Kumar',
    clientCompany: 'ABC Gym',
    projectId: 'prj-abc-1',
    projectName: 'ABC Gym Website',
    createdAt: '2026-10-02',
    updatedAt: '2026-10-08',
    data: {
      type: 'deliverables',
      payload: {
        projectId: 'PRJ-ABC-2026-881',
        documentDate: 'October 08, 2026',
        version: 'v1.1 (Staging Review)',
        clientName: 'Ramesh Kumar',
        clientCompany: 'ABC Gym',
        projectName: 'ABC Gym Website',
        projectType: 'Bespoke Website & Member Booking Engine',
        startDate: 'October 02, 2026',
        finalDeadline: 'October 25, 2026',
        projectManager: 'Rithvik Kolipaka',
        deliverablesTable: [
          {
            id: 'del-row-1',
            deliverable: 'Figma UI/UX Mockups & Design System',
            description: 'High-fidelity Figma prototypes for Homepage, Pricing, Class Schedules, and Trainer bios.',
            dueDate: 'October 06, 2026',
            formatNotes: 'Figma shareable link + exportable SVG/PNG assets',
            status: 'approved'
          },
          {
            id: 'del-row-2',
            deliverable: 'Live Staging Website & Booking Engine',
            description: 'Complete responsive React/Tailwind codebase deployed on live preview server with interactive membership forms.',
            dueDate: 'October 15, 2026',
            formatNotes: 'Vercel / Preview staging URL (https://abcgym-staging.vercel.app)',
            status: 'in_review'
          },
          {
            id: 'del-row-3',
            deliverable: 'Payment Gateway Integration & Database Setup',
            description: 'Integration of UPI/Cards via Razorpay webhook and member booking records.',
            dueDate: 'October 20, 2026',
            formatNotes: 'Live API keys configuration & test sandbox receipt verification',
            status: 'in_progress'
          },
          {
            id: 'del-row-4',
            deliverable: 'Domain Setup, SSL, SEO & Launch Handover',
            description: 'Custom domain linking (abcgym.in), SSL certification, Google Search Console indexing, and training documentation.',
            dueDate: 'October 25, 2026',
            formatNotes: 'Production deployment + GitHub source repo transfer',
            status: 'pending'
          }
        ],
        filesMaterialsNeeded:
          'High-resolution trainer photos, official gym membership rate card, class schedules, logo vector files.',
        designContentRequirements:
          'Clean dark athletic UI with neon green accents, mobile-first booking calendar, instant WhatsApp floating CTA.',
        referenceLinks: 'https://cult.fit, https://barrys.com',
        additionalNotes: 'All source code will be committed to client private GitHub repository upon final sign-off.',
        milestones: [
          { id: 'ms-d-1', milestone: 'Initial Draft & Wireframes', description: 'Wireframes & brand palette review', targetDate: 'Oct 06, 2026' },
          { id: 'ms-d-2', milestone: 'Client Review & Staging', description: 'Interactive staging prototype test', targetDate: 'Oct 15, 2026' },
          { id: 'ms-d-3', milestone: 'Revisions & Payment Integration', description: 'Final QA tests and polish', targetDate: 'Oct 20, 2026' },
          { id: 'ms-d-4', milestone: 'Final Delivery & Launch', description: 'Domain DNS live cutover', targetDate: 'Oct 25, 2026' }
        ],
        clientApproval: 'Ramesh Kumar (Pending final sign-off)',
        freelancerApproval: 'Rithvik Kolipaka',
        freelancerApprovalDate: 'October 08, 2026',
        notes: 'Please review staging deliverables and submit approvals via the Client Portal.'
      }
    }
  }
];
