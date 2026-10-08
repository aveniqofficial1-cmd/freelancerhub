import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Building,
  UserCheck
} from 'lucide-react';
import { Client } from '../../types';

interface InviteClientModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSendInvite: (clientId: string, email: string, message: string) => void;
  onOpenPortalAsClient: (client: Client) => void;
}

export const InviteClientModal: React.FC<InviteClientModalProps> = ({
  client,
  isOpen,
  onClose,
  onSendInvite,
  onOpenPortalAsClient
}) => {
  const [email, setEmail] = useState(client?.email || '');
  const [message, setMessage] = useState(
    `You have been invited to access your project workspace. You can view project progress, documents, deliverables, invoices and communicate with your freelancer.`
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isSentSuccess, setIsSentSuccess] = useState(false);

  React.useEffect(() => {
    if (client) {
      setEmail(client.email);
      setIsSentSuccess(client.portalStatus === 'invitation_sent' || client.portalStatus === 'portal_activated');
    }
  }, [client]);

  if (!isOpen || !client) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    onSendInvite(client.id, email, message);
    setIsSentSuccess(true);
  };

  const inviteUrl = `https://freelancerhub.com/portal/login?client=${encodeURIComponent(client.email)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
      <div
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold shadow-2xs">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Invite {client.company} to Client Portal
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Grant passwordless access to project workspaces, deliverables, and invoices.
              </p>
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
        {!isSentSuccess ? (
          <form onSubmit={handleSend} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Invitation Message</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none leading-relaxed"
              />
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Passwordless Client Access</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                The client will receive an invitation link with instant one-time password (OTP) access to their branded workspace.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>Send Invitation</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">Invitation Active</h4>
                <p className="text-[11px] text-emerald-800">
                  Invitation sent to <strong className="font-mono">{client.email}</strong> on {client.invitationSentAt || new Date().toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Direct Client Invitation Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onSendInvite(client.id, email, message);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs"
              >
                Resend Invitation
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPortalAsClient(client);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Client Portal</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
