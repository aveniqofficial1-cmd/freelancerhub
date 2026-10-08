import React from 'react';
import { AlertTriangle, Trash2, X, Archive, FolderKanban } from 'lucide-react';
import { Client, Project } from '../../types';

interface DeleteClientModalProps {
  client: Client | null;
  associatedProjects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onDeleteClientAndProjects: (clientId: string) => void;
  onDeleteClientKeepProjects: (clientId: string) => void;
}

export const DeleteClientModal: React.FC<DeleteClientModalProps> = ({
  client,
  associatedProjects,
  isOpen,
  onClose,
  onDeleteClientAndProjects,
  onDeleteClientKeepProjects
}) => {
  if (!isOpen || !client) return null;

  const projectCount = associatedProjects.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
      <div
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Delete Client: {client.company}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Permanent Client Record Removal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {projectCount > 0 ? (
            <>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    This client has {projectCount} associated project{projectCount > 1 ? 's' : ''}. What would you like to do?
                  </span>
                </div>
                <ul className="text-xs text-amber-800 list-disc list-inside space-y-0.5 pl-1">
                  {associatedProjects.map(p => (
                    <li key={p.id} className="truncate">
                      <strong>{p.name}</strong> (Budget: ₹{p.budget.toLocaleString()} • {p.status})
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Choose whether to completely wipe all project workspaces or preserve project deliverables and history under an archived status.
              </p>

              <div className="space-y-3 pt-1">
                {/* Option 1: Delete all */}
                <button
                  type="button"
                  onClick={() => onDeleteClientAndProjects(client.id)}
                  className="w-full p-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-left space-y-1 transition-all group"
                >
                  <div className="text-xs font-bold text-rose-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      Option 1 — Delete Client and Projects
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-full">
                      Permanent
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-700 leading-relaxed pl-6">
                    Permanently deletes client profile, all {projectCount} project workspaces, deliverables, client portal access, documents, and messages.
                  </p>
                </button>

                {/* Option 2: Keep projects */}
                <button
                  type="button"
                  onClick={() => onDeleteClientKeepProjects(client.id)}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left space-y-1 transition-all group"
                >
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Archive className="w-4 h-4 text-slate-600" />
                      Option 2 — Delete Client but Keep Projects
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                      Preserve History
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
                    Removes the client profile but retains the project records marked as <strong className="text-slate-800">Archived / Client Removed</strong>.
                  </p>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This will permanently delete this client and their associated client information. This action cannot be undone.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 font-medium">
                <div>Company: <strong className="text-slate-900">{client.company}</strong></div>
                <div>Contact: <strong className="text-slate-900">{client.name}</strong> ({client.email})</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs"
          >
            Cancel
          </button>
          {projectCount === 0 && (
            <button
              type="button"
              onClick={() => onDeleteClientAndProjects(client.id)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Client</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
