import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  CheckCircle2,
  Send,
  X,
  MessageSquare,
  ArrowLeft,
  Briefcase
} from 'lucide-react';

export const PublicProfilePage: React.FC = () => {
  const { profile, projects, addLead, setActiveView, setSelectedProjectId, setSelectedVerificationCode } = useApp();

  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [budget, setBudget] = useState(25000);
  const [notes, setNotes] = useState('');

  // Collect published case studies
  const publishedCaseStudies = projects
    .filter(p => p.caseStudy && p.caseStudy.isPublished)
    .map(p => ({
      ...p.caseStudy!,
      projectObj: p
    }));

  // Collect verified testimonials
  const verifiedTestimonials = projects
    .filter(p => p.testimonial && p.testimonial.allowPublicDisplay)
    .map(p => ({
      ...p.testimonial!,
      verificationCode: p.verificationCode,
      projectName: p.name
    }));

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      clientName,
      companyName: companyName || clientName,
      email,
      projectTitle: projectTitle || 'New Project Inquiry',
      estimatedValue: Number(budget) || 20000,
      source: 'Public Portfolio Page',
      stage: 'new',
      notes: notes || 'Submitted directly through the public freelancer portfolio.'
    });
    setIsHireModalOpen(false);
    setClientName('');
    setCompanyName('');
    setEmail('');
    setProjectTitle('');
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Demo Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 text-xs flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 text-slate-500">
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>Public URL: <strong className="text-slate-900 font-mono">freelancerhub.com/rithvik</strong></span>
        </div>
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
        </button>
      </div>

      {/* Hero Header */}
      <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-slate-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl shrink-0 ring-1 ring-slate-200"
          />

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Creator
              </span>
            </div>

            <p className="text-lg font-semibold text-emerald-700">{profile.title}</p>
            
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              "{profile.bio}"
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.location}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {profile.email}</span>
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-400" /> {profile.website}</span>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                onClick={() => setIsHireModalOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Hire Me for a Project</span>
              </button>

              <button
                onClick={() => setIsHireModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
              >
                Contact & Inquire
              </button>
            </div>
          </div>
        </div>

        {/* 4 Key Verified Trust Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 pt-8 border-t border-slate-200">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
            <div className="text-2xl font-black text-slate-900">{profile.stats.totalProjects}</div>
            <div className="text-xs text-slate-500 mt-0.5">Projects Delivered</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
            <div className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> {profile.stats.rating}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Client Rating</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
            <div className="text-2xl font-black text-emerald-600">{profile.stats.verifiedProjects}</div>
            <div className="text-xs text-slate-500 mt-0.5">Verified Case Studies</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
            <div className="text-2xl font-black text-sky-600">{profile.stats.onTimeRate}%</div>
            <div className="text-xs text-slate-500 mt-0.5">On-Time Delivery</div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-slate-200">
        <div className="text-center sm:text-left mb-8">
          <h2 className="text-xl font-bold text-slate-900">Services & Pricing Packages</h2>
          <p className="text-xs text-slate-500">Standardized packages with predictable turnaround and deliverables</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profile.services.map(srv => (
            <div
              key={srv.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">{srv.name}</h3>
                  <span className="text-sm font-black text-emerald-600">₹{srv.startingPrice.toLocaleString()}+</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{srv.description}</p>
                <div className="text-[11px] text-slate-500 font-mono mb-4">
                  Turnaround: <strong className="text-slate-800">{srv.deliveryTime}</strong>
                </div>

                <ul className="space-y-2 text-xs text-slate-600">
                  {srv.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setProjectTitle(srv.name);
                  setBudget(srv.startingPrice);
                  setIsHireModalOpen(true);
                }}
                className="mt-6 w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-700 transition-colors"
              >
                Choose This Package
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Case Studies Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-slate-200">
        <div className="text-center sm:text-left mb-8">
          <h2 className="text-xl font-bold text-slate-900">Verified Portfolio Case Studies</h2>
          <p className="text-xs text-slate-500">Real projects with verified client proof, outcomes, and code results</p>
        </div>

        {publishedCaseStudies.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-2">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Case Studies Coming Soon</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              New client engagement case studies are currently being finalized. Inquire directly below to collaborate on your next project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedCaseStudies.map(cs => (
              <div
                key={cs.id}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={cs.imageUrl}
                    alt={cs.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-slate-200 shadow-sm">
                    {cs.category}
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {cs.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {cs.solution}
                    </p>
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800">
                      <strong>Results:</strong> {cs.results}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {cs.technologies.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>

                    {cs.projectObj.verificationCode && (
                      <button
                        onClick={() => {
                          setSelectedVerificationCode(cs.projectObj.verificationCode!);
                          setActiveView('verification');
                        }}
                        className="text-xs text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Verify</span> <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Verified Client Testimonials */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center sm:text-left mb-8">
          <h2 className="text-xl font-bold text-slate-900">Client Reviews & Testimonials</h2>
          <p className="text-xs text-slate-500">Authentic feedback from verified projects</p>
        </div>

        {verifiedTestimonials.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-2">
            <Star className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Accepting New Client Projects</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Ready to create your next success story. Send an inquiry below to get a proposal with guaranteed timelines.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verifiedTestimonials.map(tst => (
              <div key={tst.id} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(tst.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {tst.verificationCode && (
                    <button
                      onClick={() => {
                        setSelectedVerificationCode(tst.verificationCode!);
                        setActiveView('verification');
                      }}
                      className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hover:underline font-semibold"
                    >
                      Verified: {tst.verificationCode}
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                  "{tst.comment}"
                </p>
                <div className="pt-2 border-t border-slate-100 text-xs">
                  <div className="font-bold text-slate-900">{tst.clientName}</div>
                  <div className="text-slate-500">{tst.companyName}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Hire Me Modal */}
      {isHireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4 relative">
            <button
              onClick={() => setIsHireModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900">Hire {profile.name}</h3>
              <p className="text-xs text-slate-500">Share your project vision to receive an instant proposal.</p>
            </div>

            <form onSubmit={handleHireSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Hyderabad Roasters"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Focus</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. E-commerce Website"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Details & Goals</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your timeline, features or reference websites..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Submit Project Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
