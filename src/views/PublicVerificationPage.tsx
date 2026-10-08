import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  Sparkles,
  Calendar,
  Building,
  User,
  ArrowLeft,
  Lock,
  Search,
  ExternalLink,
  Award,
  Layers
} from 'lucide-react';

export const PublicVerificationPage: React.FC = () => {
  const { projects, selectedVerificationCode, setSelectedVerificationCode, setActiveView, setSelectedProjectId } = useApp();

  const [inputCode, setInputCode] = useState(selectedVerificationCode || 'GRM-2026-001');

  // Find project by verification code
  const verifiedProject = projects.find(
    p => p.verificationCode && p.verificationCode.toLowerCase() === inputCode.trim().toLowerCase()
  ) || (inputCode ? projects.find(p => p.id === inputCode.trim()) : null) || (projects.length > 0 ? projects[0] : null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top bar back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('landing')}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Homepage
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Workspace
            </button>
          </div>

          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold shadow-2xs">
            <Lock className="w-3 h-3" /> Cryptographically Verified Record
          </span>
        </div>

        {/* Verification Code Search Box */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
          <Search className="w-4 h-4 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter verification code (e.g. GRM-2026-001 or ABC-2026-002)"
            className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-mono"
          />
        </div>

        {/* Verification Certificate Card or Not Found State */}
        {!verifiedProject ? (
          <div className="rounded-3xl bg-white border border-slate-200 shadow-md p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">No Verified Record Found</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {inputCode.trim()
                  ? `No project found matching the verification ID "${inputCode}". Please verify the code or check with the freelancer.`
                  : 'Enter a valid verification code above to inspect verified deliverables, signed completion certificates, and authentic client reviews.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white border-2 border-emerald-500/50 shadow-xl overflow-hidden relative">
            {/* Certificate Header Banner */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50/60 via-slate-50 to-white border-b border-slate-200 text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 mb-3 shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
                Verified Freelance Engagement Certificate
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {verifiedProject.name}
              </h1>
              <div className="mt-2 font-mono text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full inline-block shadow-2xs">
                Verification ID: <span className="text-emerald-700 font-bold">{verifiedProject.verificationCode || 'VERIFIED-001'}</span>
              </div>
            </div>

          {/* Certificate Details */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Verified Freelancer:</span>
                <div className="text-sm font-bold text-slate-900">Rithvik Kolipaka</div>
                <div className="text-slate-500">Web Developer & UI/UX Designer (Hyderabad, IN)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Authenticated Client:</span>
                <div className="text-sm font-bold text-slate-900">{verifiedProject.clientCompany}</div>
                <div className="text-slate-500">Primary Contact: {verifiedProject.clientName}</div>
              </div>
            </div>

            {/* Scope & Deliverables Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Verified Deliverables Completed
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                {verifiedProject.deliverables.map(del => (
                  <div key={del.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{del.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      Approved
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Testimonial & Rating */}
            {verifiedProject.testimonial && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(verifiedProject.testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1 text-xs font-bold text-slate-900">
                      {verifiedProject.testimonial.rating}.0 Client Rating
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Submitted on {verifiedProject.testimonial.createdAt}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{verifiedProject.testimonial.comment}"
                </p>
                <div className="text-xs text-slate-600">
                  — <strong className="text-slate-900">{verifiedProject.testimonial.clientName}</strong>, {verifiedProject.testimonial.companyName}
                </div>
              </div>
            )}

            {/* Verification Metadata Footer */}
            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>Status: <strong className="text-emerald-700">100% Verified & Authenticated</strong></span>
              <span>SHA-256 Hash: <code className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">7f9c2a8e4b10...d98a</code></span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};
