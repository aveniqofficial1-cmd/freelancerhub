import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  User,
  Shield,
  Bell,
  CreditCard,
  Building,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Trash2,
  Save,
  Globe,
  Sliders
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { profile, updateProfile, resetToDemoData, setIsWalkthroughActive, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'billing' | 'notifications' | 'demo'>('general');

  // Business info state
  const [taxId, setTaxId] = useState('GSTIN29AAACA1234F1Z5');
  const [bankDetails, setBankDetails] = useState('HDFC Bank • A/C: 50100029384812 • IFSC: HDFC0001234');
  const [upiId, setUpiId] = useState('rithvik@okhdfcbank');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings updated successfully', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Workspace Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your business information, payment channels, notifications, and demo controls.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {[
          { id: 'general', label: 'General & Profile', icon: User },
          { id: 'billing', label: 'Invoicing & Payouts', icon: CreditCard },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'demo', label: 'Demo Sandbox & Reset', icon: Sparkles },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GENERAL */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Business Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Freelancer / Legal Entity Name</label>
              <input
                type="text"
                defaultValue={profile.name}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Business Email</label>
              <input
                type="email"
                defaultValue={profile.email}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: BILLING & PAYOUTS */}
      {activeTab === 'billing' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Invoicing & Banking Defaults</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default UPI Virtual Payment Address (VPA)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Account & Wire Transfer Details</label>
              <input
                type="text"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tax ID / GSTIN / PAN</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
            >
              Update Payment Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>

          <div className="space-y-3 text-xs">
            {[
              { title: 'Client Deliverable Approvals', desc: 'Notify immediately when client approves or requests revisions' },
              { title: 'Invoice Payment Cleared', desc: 'Instant alert when milestone funds are settled' },
              { title: 'New Portfolio Inquiries', desc: 'Direct alerts for incoming leads from public profile' }
            ].map((item, idx) => (
              <label key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">{item.title}</div>
                  <div className="text-slate-500">{item.desc}</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DEMO CONTROLS */}
      {activeTab === 'demo' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Demo Walkthrough & Reset Controls</span>
            </h3>
            <p className="text-xs text-slate-500">
              Reset all modifications back to the default pristine dataset or launch the 14-step guided tour.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900">14-Step Complete Demo Walkthrough</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Step-by-step interactive assistant guiding you through Lead conversion, Workspace onboarding, Agreements, Invoicing, Approvals, Testimonials, and Portfolio publishing.
              </p>
              <button
                onClick={() => setIsWalkthroughActive(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Start Demo Walkthrough
              </button>
            </div>

            <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="text-xs font-bold text-amber-800">Reset Demo State</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Restores Graminum E-commerce, ABC Gym, leads, invoices, and mock activity logs to their initial clean state.
              </p>
              <button
                onClick={resetToDemoData}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-4 h-4" /> Restore Initial Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
