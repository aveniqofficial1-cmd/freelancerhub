import React from 'react';
import { ProfessionalDocument, DocumentTemplateType } from '../../types';
import {
  Sparkles,
  Building,
  Mail,
  Phone,
  Globe,
  Calendar,
  CheckCircle2,
  FileSignature,
  Receipt,
  FileText,
  Clock,
  ShieldCheck,
  Check,
  Star
} from 'lucide-react';

interface A4DocumentRendererProps {
  document: ProfessionalDocument;
  onPrint?: () => void;
  isPrintMode?: boolean;
}

export const A4DocumentRenderer: React.FC<A4DocumentRendererProps> = ({
  document,
  isPrintMode = false
}) => {
  const { type, data } = document;

  return (
    <div
      className={`bg-white text-slate-900 border border-slate-300 shadow-2xl mx-auto font-sans relative overflow-hidden selection:bg-emerald-100 ${
        isPrintMode ? 'w-full shadow-none border-none p-0' : 'w-full max-w-[800px] min-h-[1100px] p-8 sm:p-12 rounded-2xl'
      }`}
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Top Professional Decorative Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600" />

      {/* 1. WELCOME MESSAGE */}
      {data.type === 'welcome_message' && (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl shadow-sm shrink-0">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{data.payload.freelancerBusiness || data.payload.freelancerName}</h2>
                <p className="text-xs font-semibold text-emerald-700">{data.payload.freelancerRole}</p>
                <div className="text-[11px] text-slate-500 mt-1.5 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" /> {data.payload.freelancerEmail}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" /> {data.payload.freelancerPhone}
                  </div>
                  {data.payload.freelancerWebsite && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-slate-400" /> {data.payload.freelancerWebsite}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-mono uppercase font-black tracking-widest px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300">
                OFFICIAL CLIENT MEMO
              </span>
              <div className="text-xs font-bold text-slate-900 pt-2">Date: {data.payload.documentDate}</div>
              <div className="text-[11px] text-slate-500">Client: <strong className="text-slate-800">{data.payload.clientName}</strong></div>
              <div className="text-[11px] text-slate-500">Company: <strong className="text-slate-800">{data.payload.clientCompany}</strong></div>
            </div>
          </div>

          {/* Title Banner */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
              {document.title}
            </h1>
            <p className="text-xs text-slate-500 font-medium">{document.subtitle}</p>
          </div>

          {/* Subject Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Subject:</span>
            <div className="text-sm font-bold text-slate-900">{data.payload.subject}</div>
          </div>

          {/* Main Welcome Letter */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
            {data.payload.welcomeMessage}
          </div>

          {/* Project Summary Box */}
          <div className="border-2 border-slate-900 rounded-2xl p-5 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Building className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Project Overview</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block text-[11px]">Project Title:</span>
                <strong className="text-slate-900 text-xs">{data.payload.projectName}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[11px]">Timeline:</span>
                <strong className="text-slate-900 text-xs">{data.payload.startDate} → {data.payload.expectedDelivery}</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 font-semibold block text-[11px]">Scope Summary:</span>
                <p className="text-slate-700 font-medium mt-0.5 leading-relaxed">{data.payload.projectScope}</p>
              </div>
            </div>
          </div>

          {/* Communication & Additional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Communication Channels
              </h4>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Method: <strong className="text-slate-800">{data.payload.communicationMethod}</strong></div>
                <div>Hours: <strong className="text-slate-800">{data.payload.preferredContactTime}</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Additional Notes
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {data.payload.additionalNotes}
              </p>
            </div>
          </div>

          {/* Closing & Signature */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <p className="text-xs text-slate-700 italic whitespace-pre-line">
              {data.payload.closingMessage}
            </p>

            <div className="pt-2">
              <div className="text-xs text-slate-500">Best regards,</div>
              <div className="text-base font-black text-slate-900 mt-1">{data.payload.freelancerName}</div>
              <div className="text-xs font-semibold text-emerald-700">{data.payload.freelancerRole}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{data.payload.freelancerEmail} • {data.payload.freelancerPhone}</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CLIENT ONBOARDING FORM */}
      {data.type === 'onboarding_form' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                {document.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{document.subtitle}</p>
            </div>
            <span className="text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300">
              FORM ID: {document.id}
            </span>
          </div>

          {/* Section 1: Client Details */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2 text-xs font-black uppercase tracking-wider">
              1. Client Details
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/50">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Client Name</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-semibold">{data.payload.clientDetails.name}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Company / Brand</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-semibold">{data.payload.clientDetails.company}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Email Address</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-semibold">{data.payload.clientDetails.email}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Phone Number</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-semibold">{data.payload.clientDetails.phone}</div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[11px] text-slate-500 font-bold block">Preferred Contact Methods</span>
                <div className="flex gap-4 pt-1 text-xs">
                  {['Email', 'Phone', 'WhatsApp', 'Other'].map(m => (
                    <label key={m} className="flex items-center gap-1.5 text-slate-700">
                      <input
                        type="checkbox"
                        readOnly
                        checked={data.payload.clientDetails.contactMethods?.includes(m)}
                        className="rounded text-emerald-600"
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Project Details */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2 text-xs font-black uppercase tracking-wider">
              2. Project Details
            </div>
            <div className="p-4 space-y-3 text-xs bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 font-bold block">Project Name</span>
                  <div className="p-2 rounded bg-white border border-slate-200 font-semibold">{data.payload.projectDetails.projectName}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-bold block">Project Type</span>
                  <div className="p-2 rounded bg-white border border-slate-200 font-semibold">{data.payload.projectDetails.projectType}</div>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Project Description & Goal</span>
                <div className="p-2.5 rounded bg-white border border-slate-200 font-medium leading-relaxed">{data.payload.projectDetails.projectDescription}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Key Deliverables Required</span>
                <div className="p-2.5 rounded bg-white border border-slate-200 font-medium">{data.payload.projectDetails.keyDeliverables}</div>
              </div>
            </div>
          </div>

          {/* Section 3: Requirements */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2 text-xs font-black uppercase tracking-wider">
              3. Requirements & Design Direction
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/50">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Target Audience</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-medium">{data.payload.requirements.targetAudience}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Style Preferences</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-medium">{data.payload.requirements.stylePreferences}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Reference Links / Competitors</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-medium">{data.payload.requirements.references}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Things to Avoid</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-medium">{data.payload.requirements.anythingToAvoid}</div>
              </div>
            </div>
          </div>

          {/* Section 4: Timeline & Budget */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2 text-xs font-black uppercase tracking-wider">
              4. Timeline & Budget
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/50">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Start Date</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-semibold">{data.payload.timelineBudget.startDate}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Target Deadline</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-semibold">{data.payload.timelineBudget.deadline}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Allocated Budget</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-black text-emerald-700">₹{data.payload.timelineBudget.budget.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Section 5: Communication */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2 text-xs font-black uppercase tracking-wider">
              5. Communication & Review Preferences
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/50">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Preferred Contact Person</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-medium">{data.payload.communication.preferredContactPerson}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Meeting Frequency</span>
                <div className="p-2 rounded bg-white border border-slate-200 font-medium">{data.payload.communication.meetingFrequency}</div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[11px] text-slate-500 font-bold block">Communication Tools</span>
                <div className="flex gap-4 pt-1 text-xs">
                  {['Email', 'WhatsApp', 'Slack', 'Google Meet', 'Client Portal'].map(t => (
                    <label key={t} className="flex items-center gap-1.5 text-slate-700">
                      <input
                        type="checkbox"
                        readOnly
                        checked={data.payload.communication.communicationTools?.includes(t)}
                        className="rounded text-emerald-600"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Client Confirmation */}
          <div className="border-2 border-slate-900 rounded-2xl p-5 bg-slate-50 space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-slate-900">
              6. Client Confirmation & Sign-Off
            </div>
            <p className="text-xs text-slate-600 italic">
              "I confirm that the information provided above is accurate and complete, and will serve as the project requirements brief."
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Client Signature</span>
                <div className="font-bold text-slate-900 mt-1">{data.payload.confirmation.signature || 'Pending Signature'}</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-bold block">Submission Date</span>
                <div className="font-bold text-slate-900 mt-1">{data.payload.confirmation.date || 'Pending'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CLIENT AGREEMENT */}
      {data.type === 'client_agreement' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                {document.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{document.subtitle}</p>
            </div>
            <div className="text-right text-xs">
              <span className="font-mono font-bold text-slate-900 block">{data.payload.agreementNumber}</span>
              <span className="text-slate-500 text-[11px]">Date: {data.payload.date}</span>
              <span className="text-[10px] font-mono text-emerald-700 block mt-0.5">{data.payload.version}</span>
            </div>
          </div>

          {/* 1. Project Details Box */}
          <div className="border border-slate-300 rounded-2xl p-4 bg-slate-50 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">1. Engagement Parties & Schedule</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Client:</span>
                <strong className="text-slate-900">{data.payload.clientName} ({data.payload.clientCompany})</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Freelancer / Provider:</span>
                <strong className="text-slate-900">{data.payload.freelancerName} ({data.payload.freelancerBusiness})</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Project Name:</span>
                <strong className="text-slate-900">{data.payload.projectName}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Target Delivery:</span>
                <strong className="text-slate-900">{data.payload.startDate} → {data.payload.deadline}</strong>
              </div>
            </div>
          </div>

          {/* 2. Scope & Deliverables */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">2. Scope of Services & Deliverables</h3>
            <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed font-medium">
              {data.payload.scopeOfWork}
            </p>

            <div className="border border-slate-300 rounded-xl overflow-hidden mt-3">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold">
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Key Deliverable</th>
                    <th className="p-2.5">Specification & Details</th>
                    <th className="p-2.5">Target Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.payload.deliverables.map((d, i) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-500">{i + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">{d.name}</td>
                      <td className="p-2.5 text-slate-600">{d.description}</td>
                      <td className="p-2.5 font-medium text-slate-800">{d.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Payment Terms & Milestones */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">3. Investment & Milestone Schedule</h3>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[11px]">Total Project Fee:</span>
                <div className="text-lg font-black text-emerald-700">₹{data.payload.totalFee.toLocaleString()} {data.payload.currency}</div>
              </div>
              <div className="text-right text-[11px] text-slate-600">
                <span>Accepted Methods: <strong>{data.payload.paymentMethod}</strong></span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              {data.payload.milestones.map(ms => (
                <div key={ms.id} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{ms.title} ({ms.percentage}%)</span>
                  <span className="font-bold text-emerald-800 font-mono">₹{ms.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Revisions & Responsibilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="font-black text-slate-900 uppercase">Freelancer Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {data.payload.freelancerResponsibilities.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="font-black text-slate-900 uppercase">Client Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {data.payload.clientResponsibilities.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 5. Changes & Revisions Clause */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <strong>Changes & Scope Modifications:</strong>
            <p className="italic text-slate-600 leading-relaxed">{data.payload.changesAndAdditionalWorkClause}</p>
          </div>

          {/* 6. Approval & Digital Signatures */}
          <div className="border-2 border-slate-900 rounded-2xl p-5 bg-white space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">7. Acceptance & Electronic Signatures</h3>
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <span className="text-[11px] text-slate-500 font-bold block">Freelancer Sign-Off</span>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">{data.payload.freelancerSignature}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Date: {data.payload.freelancerSignedDate}</div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-slate-500 font-bold block">Client Sign-Off</span>
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <div className="font-bold text-emerald-900">{data.payload.clientSignature || 'Pending Electronic Signature'}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Date: {data.payload.clientSignedDate || 'Awaiting'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. INVOICE */}
      {data.type === 'invoice' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
                {document.title}
              </h1>
              <p className="text-xs font-semibold text-emerald-700 mt-1">{document.subtitle}</p>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs">
              <div className="font-mono font-bold text-lg text-slate-900">{data.payload.invoiceNumber}</div>
              <div className="text-slate-500">Invoice Date: <strong className="text-slate-800">{data.payload.invoiceDate}</strong></div>
              <div className="text-slate-500">Due Date: <strong className="text-rose-700">{data.payload.dueDate}</strong></div>
              <div className="text-slate-500">Terms: <strong className="text-slate-800">{data.payload.paymentTerms}</strong></div>
            </div>
          </div>

          {/* From & Bill To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">From:</span>
              <div className="font-black text-slate-900 text-sm">{data.payload.freelancerBusiness || data.payload.freelancerName}</div>
              <div className="text-slate-600">{data.payload.freelancerAddress}</div>
              <div className="text-slate-600">Email: {data.payload.freelancerEmail}</div>
              <div className="text-slate-600">Phone: {data.payload.freelancerPhone}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bill To:</span>
              <div className="font-black text-slate-900 text-sm">{data.payload.clientCompany}</div>
              <div className="text-slate-700 font-semibold">{data.payload.clientName}</div>
              <div className="text-slate-600">{data.payload.clientAddress}</div>
              <div className="text-slate-600">Email: {data.payload.clientEmail}</div>
              <div className="text-slate-600">Phone: {data.payload.clientPhone}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="p-3 w-10">#</th>
                  <th className="p-3">Service / Description</th>
                  <th className="p-3 text-center w-16">Qty</th>
                  <th className="p-3 text-right w-28">Rate</th>
                  <th className="p-3 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.payload.items.map((item, i) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-500">{i + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{item.description}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">₹{item.rate.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-slate-900">₹{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal & Totals Box */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-xs p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold">₹{data.payload.subtotal.toLocaleString()}</span>
              </div>
              {data.payload.taxPercent > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({data.payload.taxPercent}%):</span>
                  <span>₹{data.payload.taxAmount.toLocaleString()}</span>
                </div>
              )}
              {data.payload.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-₹{data.payload.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-sm font-black text-slate-900">
                <span>Total Due:</span>
                <span className="text-emerald-700">₹{data.payload.totalDue.toLocaleString()} {data.payload.currency}</span>
              </div>
            </div>
          </div>

          {/* Payment Details & Notes */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1.5">
            <span className="font-bold text-emerald-950 uppercase tracking-wider block">Payment Instructions:</span>
            <p className="font-mono text-emerald-900 font-bold">{data.payload.upiBankDetails}</p>
            <p className="text-[11px] text-slate-600 pt-1">{data.payload.notes}</p>
          </div>
        </div>
      )}

      {/* 5. PRICING CHART */}
      {data.type === 'pricing_chart' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                {document.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{document.subtitle}</p>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-slate-900">{data.payload.freelancerBusiness || data.payload.freelancerName}</div>
              <div className="text-slate-500 text-[11px]">{data.payload.freelancerEmail}</div>
              <div className="text-slate-500 text-[11px]">{data.payload.freelancerWebsite}</div>
            </div>
          </div>

          {/* 1. Services Overview Table */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">1. Services & Pricing Overview</h3>
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold">
                    <th className="p-3">Service Name</th>
                    <th className="p-3 text-right">Basic Tier</th>
                    <th className="p-3 text-right">Standard Tier</th>
                    <th className="p-3 text-right">Premium Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.payload.servicesOverview.map(srv => (
                    <tr key={srv.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{srv.serviceName}</td>
                      <td className="p-3 text-right font-mono text-slate-700">₹{srv.basicPrice.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/40">₹{srv.standardPrice.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">₹{srv.premiumPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Package Cards */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">2. Featured Package Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.payload.packages.map(pkg => (
                <div
                  key={pkg.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                    pkg.popular
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black uppercase tracking-wider text-xs text-slate-900">{pkg.name}</span>
                      {pkg.popular && (
                        <span className="text-[9px] font-bold uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-black text-slate-900">₹{pkg.price.toLocaleString()}</div>
                    <p className="text-[11px] text-slate-500 leading-normal">{pkg.description}</p>
                    <ul className="space-y-1 text-[11px] text-slate-700 pt-2 border-t border-slate-200/80">
                      {pkg.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 space-y-0.5">
                    <div>Revisions: <strong className="text-slate-800">{pkg.revisions}</strong></div>
                    <div>Turnaround: <strong className="text-slate-800">{pkg.deliveryTime}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Add-ons Table */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">3. Add-On Services</h3>
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-2.5">Add-On Description</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.payload.addOns.map(add => (
                    <tr key={add.id}>
                      <td className="p-2.5">
                        <strong className="text-slate-900">{add.name}</strong>
                        {add.description && <span className="text-slate-500 text-[11px] block">{add.description}</span>}
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900 font-mono">₹{add.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <strong className="text-slate-800">Terms & Payment Details:</strong>
            <p>{data.payload.paymentTerms} • {data.payload.notes}</p>
          </div>
        </div>
      )}

      {/* 6. DELIVERABLES */}
      {data.type === 'deliverables' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                {document.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{document.subtitle}</p>
            </div>
            <div className="text-right text-xs">
              <span className="font-mono font-bold text-slate-900 block">ID: {data.payload.projectId}</span>
              <span className="text-slate-500 text-[11px]">Date: {data.payload.documentDate}</span>
              <span className="text-[10px] font-mono text-emerald-700 block mt-0.5">{data.payload.version}</span>
            </div>
          </div>

          {/* 1. Project Details Box */}
          <div className="border border-slate-300 rounded-2xl p-4 bg-slate-50 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">1. Project Specification</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Client Name:</span>
                <strong className="text-slate-900">{data.payload.clientName} ({data.payload.clientCompany})</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Project Title:</span>
                <strong className="text-slate-900">{data.payload.projectName}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Project Type:</span>
                <strong className="text-slate-900">{data.payload.projectType}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Final Deadline:</span>
                <strong className="text-slate-900">{data.payload.finalDeadline}</strong>
              </div>
            </div>
          </div>

          {/* 2. Deliverables Table */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">2. Deliverables List & Status</h3>
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold">
                    <th className="p-3 w-8">#</th>
                    <th className="p-3">Deliverable</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Format / Notes</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.payload.deliverablesTable.map((d, i) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-500">{i + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">{d.deliverable}</td>
                      <td className="p-2.5 text-slate-600">{d.description}</td>
                      <td className="p-2.5 text-slate-800 whitespace-nowrap">{d.dueDate}</td>
                      <td className="p-2.5 text-slate-600 text-[11px]">{d.formatNotes}</td>
                      <td className="p-2.5 text-center">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          d.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.status === 'in_review'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {d.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Deadlines & Milestones Table */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">3. Milestones & Phase Deadlines</h3>
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-2.5">Milestone</th>
                    <th className="p-2.5">Phase Objective</th>
                    <th className="p-2.5 text-right">Target Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.payload.milestones.map(m => (
                    <tr key={m.id}>
                      <td className="p-2.5 font-bold text-slate-900">{m.milestone}</td>
                      <td className="p-2.5 text-slate-600">{m.description}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">{m.targetDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Approval Signatures */}
          <div className="border-2 border-slate-900 rounded-2xl p-5 bg-white space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">4. Deliverable Verification & Sign-Off</h3>
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">Lead Freelancer Approval</span>
                <div className="font-bold text-slate-900">{data.payload.freelancerApproval}</div>
                <div className="text-[10px] text-slate-400">Date: {data.payload.freelancerApprovalDate}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">Client Approval Sign-Off</span>
                <div className="font-bold text-slate-900">{data.payload.clientApproval || 'Awaiting Sign-Off'}</div>
                <div className="text-[10px] text-slate-400">Date: {data.payload.clientApprovalDate || 'Pending'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding for A4 Sheet */}
      <div className="pt-8 mt-8 border-t border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-between">
        <span>Prepared with FreelancerHub Pro Professional Document Engine</span>
        <span>Page 1 of 1 • Official Verified Record</span>
      </div>
    </div>
  );
};
