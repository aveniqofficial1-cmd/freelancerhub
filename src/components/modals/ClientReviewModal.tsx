import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, AlertTriangle, FileText, Download, Sparkles, MessageSquare } from 'lucide-react';
import { Deliverable } from '../../types';

interface ClientReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverable: Deliverable;
  projectId: string;
}

export const ClientReviewModal: React.FC<ClientReviewModalProps> = ({
  isOpen,
  onClose,
  deliverable,
  projectId
}) => {
  const { approveDeliverable, requestDeliverableRevision, getProjectById } = useApp();
  const [isRequestingChanges, setIsRequestingChanges] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  if (!isOpen) return null;

  const project = getProjectById(projectId);

  const handleApprove = () => {
    approveDeliverable(projectId, deliverable.id);
    onClose();
  };

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    requestDeliverableRevision(projectId, deliverable.id, feedbackText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Banner simulating client portal review */}
        <div className="px-5 py-3 bg-sky-50 border-b border-sky-100 flex items-center justify-between text-xs text-sky-800 font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>Simulated Client Review Interface</span>
          </div>
          <span className="font-mono text-[11px] text-sky-700">{project?.clientCompany}</span>
        </div>

        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your Deliverable is Ready for Review</h3>
            <p className="text-xs text-slate-500 mt-0.5">Project: {project?.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deliverable Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{deliverable.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                Due: {deliverable.dueDate}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {deliverable.description}
            </p>

            {deliverable.fileName && (
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-emerald-700">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-mono">{deliverable.fileName}</span>
                </div>
                <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">Preview Ready</span>
              </div>
            )}
          </div>

          {!isRequestingChanges ? (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-slate-500 text-center">
                Please review this milestone asset and choose an action:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleApprove}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  ✓ Approve Deliverable
                </button>

                <button
                  onClick={() => setIsRequestingChanges(true)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-amber-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Request Changes
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRevisionSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  What changes or revisions would you like?
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Please increase the font size of the pricing cards and test the mobile hero alignment..."
                  className="w-full p-3 rounded-xl bg-white border border-amber-300 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequestingChanges(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  Submit Revision Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
