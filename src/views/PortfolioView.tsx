import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Globe,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const {
    projects,
    togglePublishCaseStudy,
    setSelectedProjectId,
    setActiveView,
    setActiveProjectTab,
    setSelectedVerificationCode
  } = useApp();

  const caseStudyProjects = projects.filter(p => p.caseStudy);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Portfolio Case Studies</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {caseStudyProjects.filter(p => p.caseStudy?.isPublished).length} Published
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish verified client proof and case studies to your public freelancer site.
          </p>
        </div>

        <button
          onClick={() => setActiveView('public_profile')}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Globe className="w-4 h-4" />
          <span>View Live Public Portfolio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Case Studies Grid or Empty State */}
      {caseStudyProjects.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No Case Studies Published Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Once you complete milestone projects and gather client feedback, you can automatically convert them into high-converting, verified portfolio case studies with 1 click.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('public_profile')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs shadow-2xs transition-all"
            >
              Preview Public Portfolio
            </button>
            <button
              onClick={() => setActiveView('leads')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Start New Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudyProjects.map((p) => {
            const cs = p.caseStudy!;
            return (
              <div
                key={cs.id}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-sm hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img src={cs.imageUrl} alt={cs.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-emerald-700 border border-slate-200 shadow-sm">
                    {cs.category}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        cs.isPublished
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white/90 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {cs.isPublished ? '● Published' : '○ Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{cs.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{cs.solution}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => togglePublishCaseStudy(p.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                        cs.isPublished
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-emerald-600'
                      }`}
                    >
                      {cs.isPublished ? 'Unpublish' : 'Publish Live'}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setActiveView('project_workspace');
                        setActiveProjectTab('casestudy');
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold"
                    >
                      <span>Edit Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
