import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, CheckCircle2, Download, Send, Sparkles, Building, Mail, Calendar } from 'lucide-react';
import { Invoice } from '../../types';

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  const { profile, markInvoiceAsPaid, addToast } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSend = () => {
    addToast(`Invoice ${invoice.invoiceNumber} emailed to ${invoice.clientEmail}`, 'success');
  };

  const handleMarkPaid = () => {
    markInvoiceAsPaid(invoice.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Screen only) */}
        <div className="no-print px-6 py-3.5 bg-slate-100 text-slate-900 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-900">{invoice.invoiceNumber}</span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
              invoice.status === 'paid'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {invoice.status !== 'paid' && (
              <button
                onClick={handleMarkPaid}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Paid
              </button>
            )}

            <button
              onClick={handleSend}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-200 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-200 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>

            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-8 bg-white" id="printable-invoice">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">{profile.name}</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{profile.title}</p>
              <p className="text-xs text-slate-500">{profile.location} • {profile.email}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold uppercase tracking-widest text-slate-400">INVOICE</div>
              <div className="font-mono text-sm font-bold text-slate-800 mt-1">{invoice.invoiceNumber}</div>
              <div className="text-xs text-slate-500 mt-1">Issue Date: {invoice.issueDate}</div>
              <div className="text-xs font-bold text-slate-800">Due Date: {invoice.dueDate}</div>
            </div>
          </div>

          {/* Bill To & Project Info */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To:</div>
              <div className="font-bold text-sm text-slate-900">{invoice.clientName}</div>
              <div className="text-slate-600 font-medium">{invoice.clientCompany}</div>
              <div className="text-slate-500">{invoice.clientEmail}</div>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">Project Reference:</div>
              <div className="font-bold text-sm text-slate-900">{invoice.projectName}</div>
              <div className="text-slate-500">Payment Status: <span className="font-bold uppercase text-slate-900">{invoice.status}</span></div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-500 uppercase font-bold text-[10px]">
                <th className="py-2">Description</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item) => (
                <tr key={item.id} className="py-2">
                  <td className="py-3 font-medium text-slate-800">{item.description}</td>
                  <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-3 text-right text-slate-600">₹{item.unitPrice.toLocaleString()}</td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    ₹{(item.quantity * item.unitPrice).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{invoice.subtotal.toLocaleString()}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span>- ₹{invoice.discount.toLocaleString()}</span>
                </div>
              )}
              {invoice.tax > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({invoice.tax}%):</span>
                  <span>+ ₹{invoice.taxAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-900">
                <span>Total Amount:</span>
                <span>₹{invoice.totalAmount.toLocaleString()}</span>
              </div>
              {invoice.paidAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Paid to Date:</span>
                  <span>₹{invoice.paidAmount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Banking Note */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Payment Instructions:</div>
            <div>Bank: HDFC Bank • IFSC: HDFC0001234 • A/C: 50100029384812</div>
            <div>UPI ID: <span className="font-mono font-bold text-slate-800">rithvik@okhdfcbank</span></div>
            {invoice.notes && <div className="text-slate-500 italic mt-1">{invoice.notes}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
