import React, { useState } from 'react';
import { Layers, X, Check } from 'lucide-react';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateName: string) => void;
  defaultTitle: string;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultTitle
}) => {
  const [templateName, setTemplateName] = useState(`${defaultTitle} Template`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;
    onSave(templateName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
      <div
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Save as Reusable Template</h3>
              <p className="text-xs text-slate-500">Save to your templates library for future projects</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Template Name</label>
            <input
              type="text"
              required
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. My Website Development Agreement"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            This document will be saved as a reusable blueprint. You can select it next time you create documents for new projects.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Template</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
