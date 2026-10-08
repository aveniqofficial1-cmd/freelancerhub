import React from 'react';
import {
  ProfessionalDocument,
  Client,
  Project,
  FreelancerProfile,
  DocumentTemplateType
} from '../../types';
import {
  Plus,
  Trash2,
  Sparkles,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  FileText,
  Clock,
  Layers
} from 'lucide-react';

interface DocumentFormEditorProps {
  document: ProfessionalDocument;
  onChange: (updatedDoc: ProfessionalDocument) => void;
  clients: Client[];
  projects: Project[];
  profile: FreelancerProfile;
}

export const DocumentFormEditor: React.FC<DocumentFormEditorProps> = ({
  document,
  onChange,
  clients,
  projects,
  profile
}) => {
  const { data } = document;

  const handleProjectSelect = (projectId: string) => {
    const selectedProj = projects.find(p => p.id === projectId);
    if (!selectedProj) return;

    const matchedClient = clients.find(
      c => c.id === selectedProj.clientId || c.company.toLowerCase() === selectedProj.clientCompany.toLowerCase()
    );

    // Deep copy document and auto-populate relevant fields based on type
    const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
    updated.projectId = selectedProj.id;
    updated.projectName = selectedProj.name;
    updated.clientId = matchedClient?.id || selectedProj.clientId;
    updated.clientName = selectedProj.clientName;
    updated.clientCompany = selectedProj.clientCompany;

    if (updated.data.type === 'welcome_message') {
      updated.data.payload.clientName = selectedProj.clientName;
      updated.data.payload.clientCompany = selectedProj.clientCompany;
      updated.data.payload.projectName = selectedProj.name;
      updated.data.payload.projectScope = selectedProj.description;
      updated.data.payload.startDate = selectedProj.startDate;
      updated.data.payload.expectedDelivery = selectedProj.deadline;
      updated.data.payload.subject = `Welcome! Excited to Work With You on ${selectedProj.name}`;
    } else if (updated.data.type === 'onboarding_form') {
      updated.data.payload.clientDetails.name = selectedProj.clientName;
      updated.data.payload.clientDetails.company = selectedProj.clientCompany;
      updated.data.payload.clientDetails.email = matchedClient?.email || `${selectedProj.clientName.toLowerCase().replace(/\s+/g, '')}@example.com`;
      updated.data.payload.clientDetails.phone = matchedClient?.phone || '+91 98765 00000';
      updated.data.payload.projectDetails.projectName = selectedProj.name;
      updated.data.payload.projectDetails.projectType = selectedProj.service;
      updated.data.payload.projectDetails.projectDescription = selectedProj.description;
      updated.data.payload.timelineBudget.startDate = selectedProj.startDate;
      updated.data.payload.timelineBudget.deadline = selectedProj.deadline;
      updated.data.payload.timelineBudget.budget = selectedProj.budget;
    } else if (updated.data.type === 'client_agreement') {
      updated.data.payload.clientName = selectedProj.clientName;
      updated.data.payload.clientCompany = selectedProj.clientCompany;
      updated.data.payload.projectName = selectedProj.name;
      updated.data.payload.startDate = selectedProj.startDate;
      updated.data.payload.deadline = selectedProj.deadline;
      updated.data.payload.scopeOfWork = selectedProj.description;
      updated.data.payload.totalFee = selectedProj.budget;
      updated.data.payload.deliverables = selectedProj.deliverables.map(d => ({
        id: d.id,
        name: d.title,
        description: d.description,
        dueDate: d.dueDate
      }));
      updated.data.payload.milestones = [
        {
          id: 'ms-1',
          title: '50% Advance Milestone Kickoff',
          percentage: 50,
          amount: selectedProj.budget / 2,
          dueCondition: 'Prior to Project Kickoff'
        },
        {
          id: 'ms-2',
          title: '50% Final Sign-Off & Launch',
          percentage: 50,
          amount: selectedProj.budget / 2,
          dueCondition: 'Prior to Final Code Handover'
        }
      ];
    } else if (updated.data.type === 'invoice') {
      updated.data.payload.clientName = selectedProj.clientName;
      updated.data.payload.clientCompany = selectedProj.clientCompany;
      updated.data.payload.clientEmail = matchedClient?.email || 'client@example.com';
      updated.data.payload.clientPhone = matchedClient?.phone || '+91 98765 00000';
      updated.data.payload.projectName = selectedProj.name;
      updated.data.payload.items = [
        {
          id: 'it-1',
          description: `50% Advance Kickoff Milestone for ${selectedProj.name}`,
          quantity: 1,
          rate: selectedProj.budget / 2,
          amount: selectedProj.budget / 2
        }
      ];
      updated.data.payload.subtotal = selectedProj.budget / 2;
      updated.data.payload.totalDue = selectedProj.budget / 2;
    } else if (updated.data.type === 'deliverables') {
      updated.data.payload.clientName = selectedProj.clientName;
      updated.data.payload.clientCompany = selectedProj.clientCompany;
      updated.data.payload.projectName = selectedProj.name;
      updated.data.payload.projectType = selectedProj.service;
      updated.data.payload.startDate = selectedProj.startDate;
      updated.data.payload.finalDeadline = selectedProj.deadline;
      updated.data.payload.deliverablesTable = selectedProj.deliverables.map((d, i) => ({
        id: d.id,
        deliverable: d.title,
        description: d.description,
        dueDate: d.dueDate,
        formatNotes: 'Live staging URL & assets repository',
        status: d.status
      }));
    }

    onChange(updated);
  };

  const updatePayloadField = (path: string, val: any) => {
    const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
    const parts = path.split('.');
    let target: any = updated.data;
    for (let i = 0; i < parts.length - 1; i++) {
      target = target[parts[i]];
    }
    target[parts[parts.length - 1]] = val;
    onChange(updated);
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Project / Client Quick Auto-populate */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
        <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Auto-Populate from Existing Project / Client</span>
        </label>
        <select
          value={document.projectId || ''}
          onChange={(e) => handleProjectSelect(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Select Project to Auto-Fill Data...</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.clientCompany} • ₹{p.budget.toLocaleString()})
            </option>
          ))}
        </select>
        <p className="text-[11px] text-emerald-800">
          Selects client names, email, project scope, budget, and dates automatically.
        </p>
      </div>

      {/* 1. WELCOME MESSAGE EDITOR */}
      {data.type === 'welcome_message' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
            Welcome Message Details
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client Contact Name</label>
              <input
                type="text"
                value={data.payload.clientName}
                onChange={(e) => updatePayloadField('payload.clientName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client Company Name</label>
              <input
                type="text"
                value={data.payload.clientCompany}
                onChange={(e) => updatePayloadField('payload.clientCompany', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Document Subject Line</label>
            <input
              type="text"
              value={data.payload.subject}
              onChange={(e) => updatePayloadField('payload.subject', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Personalized Welcome Message</label>
            <textarea
              rows={4}
              value={data.payload.welcomeMessage}
              onChange={(e) => updatePayloadField('payload.welcomeMessage', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Scope Summary</label>
            <textarea
              rows={3}
              value={data.payload.projectScope}
              onChange={(e) => updatePayloadField('payload.projectScope', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="text"
                value={data.payload.startDate}
                onChange={(e) => updatePayloadField('payload.startDate', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expected Delivery</label>
              <input
                type="text"
                value={data.payload.expectedDelivery}
                onChange={(e) => updatePayloadField('payload.expectedDelivery', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Communication Method</label>
              <input
                type="text"
                value={data.payload.communicationMethod}
                onChange={(e) => updatePayloadField('payload.communicationMethod', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Contact Time</label>
              <input
                type="text"
                value={data.payload.preferredContactTime}
                onChange={(e) => updatePayloadField('payload.preferredContactTime', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes</label>
            <textarea
              rows={2}
              value={data.payload.additionalNotes}
              onChange={(e) => updatePayloadField('payload.additionalNotes', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 2. ONBOARDING FORM EDITOR */}
      {data.type === 'onboarding_form' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
            Client & Project Onboarding Fields
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client Name</label>
              <input
                type="text"
                value={data.payload.clientDetails.name}
                onChange={(e) => updatePayloadField('payload.clientDetails.name', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company / Brand</label>
              <input
                type="text"
                value={data.payload.clientDetails.company}
                onChange={(e) => updatePayloadField('payload.clientDetails.company', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Name</label>
            <input
              type="text"
              value={data.payload.projectDetails.projectName}
              onChange={(e) => updatePayloadField('payload.projectDetails.projectName', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Description</label>
            <textarea
              rows={3}
              value={data.payload.projectDetails.projectDescription}
              onChange={(e) => updatePayloadField('payload.projectDetails.projectDescription', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
              <input
                type="text"
                value={data.payload.requirements.targetAudience}
                onChange={(e) => updatePayloadField('payload.requirements.targetAudience', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Style / Preferences</label>
              <input
                type="text"
                value={data.payload.requirements.stylePreferences}
                onChange={(e) => updatePayloadField('payload.requirements.stylePreferences', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="text"
                value={data.payload.timelineBudget.startDate}
                onChange={(e) => updatePayloadField('payload.timelineBudget.startDate', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deadline</label>
              <input
                type="text"
                value={data.payload.timelineBudget.deadline}
                onChange={(e) => updatePayloadField('payload.timelineBudget.deadline', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Budget (₹)</label>
              <input
                type="number"
                value={data.payload.timelineBudget.budget}
                onChange={(e) => updatePayloadField('payload.timelineBudget.budget', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. CLIENT AGREEMENT EDITOR */}
      {data.type === 'client_agreement' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
            Agreement Clauses & Deliverables
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Agreement Number</label>
              <input
                type="text"
                value={data.payload.agreementNumber}
                onChange={(e) => updatePayloadField('payload.agreementNumber', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Fee (₹)</label>
              <input
                type="number"
                value={data.payload.totalFee}
                onChange={(e) => updatePayloadField('payload.totalFee', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Scope of Work & Services</label>
            <textarea
              rows={3}
              value={data.payload.scopeOfWork}
              onChange={(e) => updatePayloadField('payload.scopeOfWork', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Revision Policy</label>
            <input
              type="text"
              value={data.payload.includedRevisions}
              onChange={(e) => updatePayloadField('payload.includedRevisions', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Changes & Additional Work Clause</label>
            <textarea
              rows={2}
              value={data.payload.changesAndAdditionalWorkClause}
              onChange={(e) => updatePayloadField('payload.changesAndAdditionalWorkClause', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 4. INVOICE EDITOR */}
      {data.type === 'invoice' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
            Invoice Items & Amounts
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Number</label>
              <input
                type="text"
                value={data.payload.invoiceNumber}
                onChange={(e) => updatePayloadField('payload.invoiceNumber', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
              <input
                type="text"
                value={data.payload.dueDate}
                onChange={(e) => updatePayloadField('payload.dueDate', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Service Line Items</label>
              <button
                type="button"
                onClick={() => {
                  const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
                  if (updated.data.type === 'invoice') {
                    const newItem = {
                      id: 'it-' + Date.now(),
                      description: 'Additional Milestone Service',
                      quantity: 1,
                      rate: 5000,
                      amount: 5000
                    };
                    updated.data.payload.items.push(newItem);
                    const newSub = updated.data.payload.items.reduce((s, i) => s + i.amount, 0);
                    updated.data.payload.subtotal = newSub;
                    updated.data.payload.totalDue = newSub;
                    onChange(updated);
                  }
                }}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            {data.payload.items.map((item, idx) => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
                      if (updated.data.type === 'invoice') {
                        updated.data.payload.items[idx].description = e.target.value;
                        onChange(updated);
                      }
                    }}
                    placeholder="Description..."
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
                      if (updated.data.type === 'invoice' && updated.data.payload.items.length > 1) {
                        updated.data.payload.items.splice(idx, 1);
                        const newSub = updated.data.payload.items.reduce((s, i) => s + i.amount, 0);
                        updated.data.payload.subtotal = newSub;
                        updated.data.payload.totalDue = newSub;
                        onChange(updated);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Rate (₹)</label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => {
                        const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
                        if (updated.data.type === 'invoice') {
                          const rate = Number(e.target.value);
                          updated.data.payload.items[idx].rate = rate;
                          updated.data.payload.items[idx].amount = rate * updated.data.payload.items[idx].quantity;
                          const newSub = updated.data.payload.items.reduce((s, i) => s + i.amount, 0);
                          updated.data.payload.subtotal = newSub;
                          updated.data.payload.totalDue = newSub;
                          onChange(updated);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Amount (₹)</label>
                    <input
                      type="number"
                      readOnly
                      value={item.amount}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-black text-emerald-800"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">UPI & Bank Payment Details</label>
            <input
              type="text"
              value={data.payload.upiBankDetails}
              onChange={(e) => updatePayloadField('payload.upiBankDetails', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 5. PRICING CHART EDITOR */}
      {data.type === 'pricing_chart' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
            Rate Card Packages & Add-Ons
          </h3>

          <div className="space-y-3">
            {data.payload.packages.map((pkg, idx) => (
              <div key={pkg.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Package Name</label>
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => {
                        const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
                        if (updated.data.type === 'pricing_chart') {
                          updated.data.payload.packages[idx].name = e.target.value;
                          onChange(updated);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Price (₹)</label>
                    <input
                      type="number"
                      value={pkg.price}
                      onChange={(e) => {
                        const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
                        if (updated.data.type === 'pricing_chart') {
                          updated.data.payload.packages[idx].price = Number(e.target.value);
                          onChange(updated);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500">Package Description</label>
                  <input
                    type="text"
                    value={pkg.description}
                    onChange={(e) => {
                      const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
                      if (updated.data.type === 'pricing_chart') {
                        updated.data.payload.packages[idx].description = e.target.value;
                        onChange(updated);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. DELIVERABLES EDITOR */}
      {data.type === 'deliverables' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
            Deliverables List & Status
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                value={data.payload.projectName}
                onChange={(e) => updatePayloadField('payload.projectName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Deadline</label>
              <input
                type="text"
                value={data.payload.finalDeadline}
                onChange={(e) => updatePayloadField('payload.finalDeadline', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Deliverables</label>
              <button
                type="button"
                onClick={() => {
                  const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
                  if (updated.data.type === 'deliverables') {
                    updated.data.payload.deliverablesTable.push({
                      id: 'del-' + Date.now(),
                      deliverable: 'New Milestone Deliverable',
                      description: 'Specifications and live link',
                      dueDate: 'October 25, 2026',
                      formatNotes: 'Production ready assets',
                      status: 'pending'
                    });
                    onChange(updated);
                  }
                }}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Deliverable
              </button>
            </div>

            {data.payload.deliverablesTable.map((d, idx) => (
              <div key={d.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={d.deliverable}
                    onChange={(e) => {
                      const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
                      if (updated.data.type === 'deliverables') {
                        updated.data.payload.deliverablesTable[idx].deliverable = e.target.value;
                        onChange(updated);
                      }
                    }}
                    placeholder="Deliverable title..."
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                  />
                  <select
                    value={d.status}
                    onChange={(e) => {
                      const updated = JSON.parse(JSON.stringify(document)) as ProfessionalDocument;
                      if (updated.data.type === 'deliverables') {
                        updated.data.payload.deliverablesTable[idx].status = e.target.value as any;
                        onChange(updated);
                      }
                    }}
                    className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold uppercase text-slate-700"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
