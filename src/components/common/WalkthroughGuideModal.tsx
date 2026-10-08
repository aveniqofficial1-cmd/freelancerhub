import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Circle, ArrowRight, Sparkles, X, ChevronRight, Play } from 'lucide-react';

export const WalkthroughGuideModal: React.FC = () => {
  const {
    isWalkthroughActive,
    setIsWalkthroughActive,
    walkthroughSteps,
    currentWalkthroughStep,
    goToWalkthroughStep
  } = useApp();

  if (!isWalkthroughActive) return null;

  const current = walkthroughSteps[currentWalkthroughStep] || walkthroughSteps[0];

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-md w-full bg-white/95 border border-emerald-300 rounded-3xl shadow-2xl backdrop-blur-xl p-5 animate-slide-up text-slate-900">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Interactive Demo Walkthrough
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                Step {currentWalkthroughStep + 1} of {walkthroughSteps.length}
              </span>
            </h4>
          </div>
        </div>
        <button
          onClick={() => setIsWalkthroughActive(false)}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          title="Minimize Guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300"
          style={{ width: `${((currentWalkthroughStep + 1) / walkthroughSteps.length) * 100}%` }}
        />
      </div>

      {/* Current Step Card */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
        <div className="text-xs font-bold text-emerald-800 mb-1">
          {current.title}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {current.description}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-2">
        <button
          disabled={currentWalkthroughStep === 0}
          onClick={() => goToWalkthroughStep(currentWalkthroughStep - 1)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Previous
        </button>

        <button
          onClick={() => goToWalkthroughStep(currentWalkthroughStep)}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Play className="w-3 h-3 fill-current" /> Go to this Step
        </button>

        <button
          disabled={currentWalkthroughStep === walkthroughSteps.length - 1}
          onClick={() => goToWalkthroughStep(currentWalkthroughStep + 1)}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-40 shadow-xs"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick All Steps Jump */}
      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span>Click any step anytime in sidebar / topbar</span>
        <button
          onClick={() => setIsWalkthroughActive(false)}
          className="hover:text-slate-800 underline"
        >
          Hide guide
        </button>
      </div>
    </div>
  );
};
