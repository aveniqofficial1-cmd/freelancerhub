import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  Plus,
  CheckCircle2,
  Clock,
  Printer,
  Trash2,
  Edit2,
  X,
  IndianRupee,
  Calendar,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Invoice, InvoiceItem } from '../types';
import { InvoicePreviewModal } from '../components/modals/InvoicePreviewModal';

export const InvoicesView: React.FC = () => {
  const {
    invoices,
    projects,
    clients,
    addInvoice,
    deleteInvoice,
    markInvoiceAsPaid,
    setSelectedProjectId,
    setActiveView,
    setActiveProjectTab
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'paid' | 'sent' | 'draft'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  // New Invoice Form State
  const [selectedProjectId, setFormProjectId] = useState(projects[0]?.id || '');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [taxPercent, setTaxPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState('Payment due within 14 days of issue.');
  const [items, setItems] = useState<{ id: string; description: string; quantity: number; unitPrice: number }[]>([
    { id: 'it-1', description: 'Web Development & UI Milestone Delivery', quantity: 1, unitPrice: 15000 }
  ]);

  const filteredInvoices = invoices.filter(i => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  const totalPaidRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.paidAmount, 0);

  const totalPendingRevenue = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);

  // Form helpers
  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { id: 'it-' + Date.now(), description: 'Additional Project Deliverable / Add-on', quantity: 1, unitPrice: 2000 }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: 'description' | 'quantity' | 'unitPrice', val: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const subtotal = items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === selectedProjectId) || projects[0];
    const client = clients.find(c => c.id === proj?.clientId) || clients[0];

    addInvoice({
      projectId: proj?.id || 'prj-custom-' + Date.now(),
      projectName: proj?.name || 'Milestone Delivery Project',
      clientId: proj?.clientId || client?.id || 'cli-custom-' + Date.now(),
      clientName: proj?.clientName || client?.name || 'Direct Client',
      clientCompany: proj?.clientCompany || client?.company || 'Client Organization',
      clientEmail: client?.email || `${(proj?.clientName || 'client').toLowerCase().replace(/\s+/g, '')}@example.com`,
      items,
      subtotal,
      tax: taxPercent,
      taxAmount,
      discount: discountAmount,
      totalAmount,
      paidAmount: 0,
      status: 'sent',
      issueDate,
      dueDate,
      notes
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Invoices & Billing</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate professional client invoices, calculate taxes & discounts, and track revenue.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* 2 Big Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Settled Revenue</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">
              ₹{totalPaidRevenue.toLocaleString()}
            </div>
            <span className="text-xs text-slate-400">Collected in demo account</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Pending & Awaiting Payment</span>
            <div className="text-3xl font-black text-amber-600 mt-1">
              ₹{totalPendingRevenue.toLocaleString()}
            </div>
            <span className="text-xs text-slate-400">Scheduled milestone balances</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {[
          { id: 'all', label: 'All Invoices' },
          { id: 'sent', label: 'Awaiting Payment' },
          { id: 'paid', label: 'Paid & Cleared' },
          { id: 'draft', label: 'Drafts' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === f.id
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Invoice Table / Cards */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        {filteredInvoices.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <Receipt className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Invoices Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {invoices.length === 0
                  ? 'You haven\'t created any invoices yet. Generate professional milestone invoices with itemized billing, taxes, and automatic payment tracking.'
                  : `No invoices matching the selected "${filter}" status.`}
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm inline-flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Invoice</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredInvoices.map(inv => (
              <div
                key={inv.id}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">{inv.invoiceNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    {inv.clientCompany} • <span className="text-slate-500">{inv.projectName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Issued: {inv.issueDate} • Due: {inv.dueDate} {inv.paidAt && `• Paid: ${inv.paidAt}`}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right sm:mr-4">
                    <div className="text-base font-extrabold text-slate-900">₹{inv.totalAmount.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">{inv.items.length} items</div>
                  </div>

                  {inv.status !== 'paid' && (
                    <button
                      onClick={() => markInvoiceAsPaid(inv.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Paid
                    </button>
                  )}

                  <button
                    onClick={() => setPreviewInvoice(inv)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-200"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview PDF</span>
                  </button>

                  <button
                    onClick={() => deleteInvoice(inv.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Invoice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Create New Invoice</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setFormProjectId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.clientCompany})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Invoice Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    + Add Item Row
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          placeholder="Qty"
                          className="w-full px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-center focus:border-emerald-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                          placeholder="Price"
                          className="w-full px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax & Discount */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tax (%)</label>
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Totals Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs text-right">
                <div>Subtotal: <strong className="text-slate-900">₹{subtotal.toLocaleString()}</strong></div>
                {taxAmount > 0 && <div>Tax ({taxPercent}%): <strong className="text-slate-700">+₹{taxAmount.toLocaleString()}</strong></div>}
                {discountAmount > 0 && <div>Discount: <strong className="text-emerald-700">-₹{discountAmount.toLocaleString()}</strong></div>}
                <div className="text-sm font-black text-emerald-700 pt-1 border-t border-slate-200">
                  Total Amount: ₹{totalAmount.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  Save & Send Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewInvoice && (
        <InvoicePreviewModal
          isOpen={!!previewInvoice}
          onClose={() => setPreviewInvoice(null)}
          invoice={previewInvoice}
        />
      )}
    </div>
  );
};
