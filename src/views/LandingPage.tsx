import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Users,
  Receipt,
  ShieldCheck,
  FileText,
  Star,
  Zap,
  LayoutDashboard,
  Layers,
  Bot,
  Play,
  Check,
  TrendingUp,
  Globe,
  ChevronRight,
  IndianRupee
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginDemoUser, setIsAuthModalOpen, setAuthMode, setActiveView, setSelectedProjectId } = useApp();

  const workflowSteps = [
    { num: '01', title: 'Create Profile', desc: 'Set up your professional identity, skills & custom service packages.' },
    { num: '02', title: 'Get Lead', desc: 'Capture client leads across Instagram, Twitter, LinkedIn or website.' },
    { num: '03', title: 'Convert Lead', desc: 'Track stages on CRM pipeline and 1-click convert won leads into clients.' },
    { num: '04', title: 'Create Project', desc: 'Launch project workspaces with custom budgets & milestone schedules.' },
    { num: '05', title: 'Onboard Client', desc: 'Send interactive question briefs to collect assets & design requirements.' },
    { num: '06', title: 'Agreement', desc: 'Generate contracts with e-signatures & transparent IP ownership.' },
    { num: '07', title: 'Invoice', desc: 'Send automated milestone invoices with 1-click payment tracking.' },
    { num: '08', title: 'Deliverables', desc: 'Submit design & code assets for instant 1-click client approval.' },
    { num: '09', title: 'Project Complete', desc: 'Celebrate sign-off, collect 5-star rating & generate verified proof.' },
    { num: '10', title: 'Build Portfolio', desc: '1-click AI generates published case studies on your public portfolio.' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Freelancer Profile',
      desc: 'Create a stunning professional brand with services, starting rates, and live availability status.'
    },
    {
      icon: FolderKanban,
      title: 'Project Workspace',
      desc: 'A dedicated command center for every project: milestones, tasks, documents, and deliverables.'
    },
    {
      icon: Users,
      title: 'Client CRM',
      desc: 'Keep every client contact, project history, invoices, files, and communications organized.'
    },
    {
      icon: FileText,
      title: 'Documents & Agreements',
      desc: 'Generate high-conversion proposals, welcome briefs, and signed contracts in seconds.'
    },
    {
      icon: Receipt,
      title: 'Invoices & Payments',
      desc: 'Create professional invoices with automatic taxes, discounts, and instant status updates.'
    },
    {
      icon: CheckCircle2,
      title: 'Deliverable Approvals',
      desc: 'Share interactive assets with clients for 1-click approval or structured revision feedback.'
    },
    {
      icon: Globe,
      title: 'Client Portal',
      desc: 'Give clients a dedicated, branded project experience without clutter or confusion.'
    },
    {
      icon: ShieldCheck,
      title: 'Project Verification',
      desc: 'Turn completed projects into tamper-proof, verified credentials with authentic reviews.'
    },
    {
      icon: FolderKanban,
      title: 'Portfolio & Case Studies',
      desc: 'Automatically convert completed projects into rich, SEO-friendly portfolio case studies.'
    },
    {
      icon: Bot,
      title: 'AI Freelance Assistant',
      desc: 'Draft proposals, refine onboarding questions, write client emails, and diagnose lost deals.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black shadow-sm">
              <Sparkles className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">FreelancerHub</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                SaaS Demo
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-emerald-700 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-emerald-700 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 px-3 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => loginDemoUser()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try Demo Account</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-100 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-6 animate-fade-in shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Freelancer Workspace & Verified Portfolio Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.1] mb-6">
          Run your freelance business <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">professionally.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          Manage clients, projects, documents, invoices and deliverables — then turn completed work into beautiful, verified portfolio case studies.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => loginDemoUser()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <span>Explore Live Demo</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              loginDemoUser();
              setSelectedProjectId('prj-1');
              setActiveView('project_workspace');
            }}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-base flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>Open Graminum Workspace</span>
          </button>
        </div>

        {/* Live Interactive Dashboard Preview Mockup */}
        <div className="mt-16 relative rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl overflow-hidden p-2 sm:p-4 text-left">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 text-xs text-slate-500 bg-white rounded-t-2xl mb-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="font-mono ml-2 text-slate-600 font-medium">freelancerhub.com/dashboard</span>
            </div>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Workspace Interactive Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 sm:p-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Active Projects</div>
              <div className="text-2xl font-black text-slate-900">4 Active</div>
              <div className="text-xs text-emerald-700 font-bold mt-2">● Graminum (65% Complete)</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">This Month's Revenue</div>
              <div className="text-2xl font-black text-emerald-700">₹72,500</div>
              <div className="text-xs text-slate-500 mt-2 font-medium">+18% vs last month</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Verified Proof</div>
              <div className="text-2xl font-black text-blue-700">12 Projects</div>
              <div className="text-xs text-amber-600 font-bold mt-2">★ 4.9 Rating (18 Reviews)</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 bg-slate-50/50">
        <div className="text-center mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
            The Complete Freelance Lifecycle
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            From First Lead to Verified Case Study
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto mt-2">
            A seamless 10-step system designed to eliminate client chaos, automate administration, and turn every project into proof.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {workflowSteps.map((s) => (
            <div
              key={s.num}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl font-black text-slate-300 group-hover:text-emerald-600 transition-colors font-mono mb-2">
                  {s.num}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
            Powerful Built-In Modules
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Everything you need to scale your freelance business
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 bg-slate-50/50">
        <div className="text-center mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Invest in your independent career
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Starter</h3>
              <p className="text-xs text-slate-500 mt-1">For freelancers just getting started.</p>
              <div className="mt-6 text-3xl font-extrabold text-slate-900">₹0 <span className="text-xs font-normal text-slate-500">/ forever free</span></div>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Up to 3 Active Projects</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Standard Invoicing & CRM</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Public Profile Page</li>
              </ul>
            </div>
            <button onClick={() => loginDemoUser()} className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors">
              Try Free Demo
            </button>
          </div>

          {/* Pro Freelancer */}
          <div className="p-8 rounded-3xl bg-white border-2 border-emerald-600 relative flex flex-col justify-between shadow-xl ring-4 ring-emerald-50">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
              Most Popular
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pro Freelancer</h3>
              <p className="text-xs text-slate-500 mt-1">For full-time independent creators.</p>
              <div className="mt-6 text-3xl font-extrabold text-slate-900">₹999 <span className="text-xs font-normal text-slate-500">/ month</span></div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Unlimited Projects & Clients</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Verified Cryptographic Badges</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Client Portal with 1-Click Approvals</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> AI Proposal & Case Study Generator</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Custom Domain Support</li>
              </ul>
            </div>
            <button onClick={() => loginDemoUser()} className="mt-8 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md">
              Launch Pro Demo
            </button>
          </div>

          {/* Agency */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Studio & Agency</h3>
              <p className="text-xs text-slate-500 mt-1">For small teams and boutique agencies.</p>
              <div className="mt-6 text-3xl font-extrabold text-slate-900">₹2,499 <span className="text-xs font-normal text-slate-500">/ month</span></div>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Multi-Seat Team Workspaces</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> White-Labeled Client Portals</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Priority API & Webhook Integrations</li>
              </ul>
            </div>
            <button onClick={() => loginDemoUser()} className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors">
              Try Agency Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>FreelancerHub SaaS — Built for elite independent creators.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => loginDemoUser()} className="text-slate-600 hover:text-slate-900">Demo Account</button>
            <button onClick={() => setActiveView('public_profile')} className="text-slate-600 hover:text-slate-900">Public Portfolio</button>
            <button onClick={() => setActiveView('verification')} className="text-slate-600 hover:text-slate-900">Verify Project</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
