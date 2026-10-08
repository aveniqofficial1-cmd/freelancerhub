import React from 'react';
import {
  X,
  Mail,
  Phone,
  IndianRupee,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  ExternalLink,
  Tag,
  Building
} from 'lucide-react';
import { Lead } from '../../types';

interface ViewLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onConvert: (leadId: string) => void;
  onDelete: (lead: Lead) => void;
}

export const ViewLeadModal: React.FC<ViewLeadModalProps> = ({
  lead,
  isOpen,
  onClose,
  onEdit,
  onConvert,
  onDelete
}) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
      <div 
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-100 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Lead Details
              </span>
              <span className="text-[10px] font-mono text-slate-500">ID: {lead.id}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{lead.companyName}</h3>
            <p className="text-xs text-slate-500 font-medium">{lead.projectTitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-[11px] font-medium text-slate-500">Estimated Value</span>
              <div className="text-lg font-black text-emerald-700 mt-0.5">
                ₹{lead.estimatedValue.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500">Pipeline Stage</span>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-1">
                {lead.stage.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900">Client Contact Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Contact:</span>
                <span className="font-bold text-slate-900">{lead.clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`mailto:${lead.email}`} className="text-emerald-700 hover:underline truncate">
                  {lead.email}
                </a>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{lead.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Source: <strong className="text-slate-800">{lead.source}</strong></span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">Opportunity Notes & Scope</h4>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                "{lead.notes}"
              </div>
            </div>
          )}

          {/* Lost reason if lost */}
          {lead.stage === 'lost' && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
              <div className="font-bold">Deal Lost: {lead.lostReason || 'Unspecified'}</div>
              {lead.lostNotes && <div className="text-[11px] text-rose-700">{lead.lostNotes}</div>}
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Created: {lead.createdAt}</span>
            <span>Last Updated: {lead.updatedAt}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onDelete(lead)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Delete Lead</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(lead)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Lead</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onConvert(lead.id);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convert to Client</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
