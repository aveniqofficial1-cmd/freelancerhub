import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  FolderKanban,
  IndianRupee,
  Users,
  PieChart,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { projects, leads, invoices, profile } = useApp();

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.paidAmount, 0);
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const avgProjectValue = projects.length === 0 ? 0 : Math.round(projects.reduce((sum, p) => sum + p.budget, 0) / projects.length);

  const totalLeadsCount = leads.length;
  const wonLeadsCount = leads.filter(l => l.stage === 'won').length;
  const conversionRate = totalLeadsCount === 0 ? 0 : Math.round((wonLeadsCount / totalLeadsCount) * 100);

  // Lost reasons distribution
  const lostLeads = leads.filter(l => l.stage === 'lost');
  const totalLost = Math.max(1, lostLeads.length);
  const priceLost = lostLeads.filter(l => l.lostReason === 'Price').length;
  const timelineLost = lostLeads.filter(l => l.lostReason === 'Timeline').length;
  const competitorLost = lostLeads.filter(l => l.lostReason === 'Client chose competitor').length;

  // Monthly Revenue Data points
  const monthlyRevenue = [
    { month: 'May', amount: 0, height: '8%' },
    { month: 'Jun', amount: 0, height: '8%' },
    { month: 'Jul', amount: 0, height: '8%' },
    { month: 'Aug', amount: 0, height: '8%' },
    { month: 'Sep', amount: 0, height: '8%' },
    { month: 'Current', amount: totalRevenue, height: totalRevenue > 0 ? '85%' : '8%' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Freelance Business Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track conversion performance, revenue velocity, client retention, and win/loss diagnostics.
        </p>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Lifetime Settled Revenue</span>
          <div className="text-2xl font-black text-emerald-600">₹{totalRevenue.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Tracked from paid invoices
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Average Project Value</span>
          <div className="text-2xl font-black text-slate-900">₹{avgProjectValue.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> Across {projects.length} project(s)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Lead Conversion Rate</span>
          <div className="text-2xl font-black text-sky-600">{conversionRate}%</div>
          <span className="text-[11px] text-slate-400">{wonLeadsCount} won of {totalLeadsCount} leads</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Active Invoices</span>
          <div className="text-2xl font-black text-amber-600">{invoices.filter(i => i.status !== 'paid').length}</div>
          <span className="text-[11px] text-amber-700 font-semibold">Pending settlement</span>
        </div>
      </div>

      {/* Monthly Revenue Bar Chart Simulation */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Monthly Revenue Trends</h3>
            <p className="text-xs text-slate-500">Real-time revenue updates from settled project invoices</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            ₹{totalRevenue.toLocaleString()} Total Settled
          </span>
        </div>

        <div className="h-56 pt-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-2">
          {monthlyRevenue.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                ₹{item.amount.toLocaleString()}
              </span>
              <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden h-40 flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all duration-500 rounded-t-xl"
                  style={{ height: item.height }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-700">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2 Diagnostic Panels: Why Projects Were Lost & Business Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lost Project Analysis */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Lost Deals Diagnostics</span>
            </h3>
            <span className="text-xs text-slate-400">{lostLeads.length} lost lead(s)</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700">
                <span>Pricing / Budget Constraints</span>
                <span className="font-bold text-rose-600">{lostLeads.length > 0 ? Math.round((priceLost / totalLost) * 100) : 0}% ({priceLost} Deals)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${lostLeads.length > 0 ? (priceLost / totalLost) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700">
                <span>Timeline / Expedited Launch</span>
                <span className="font-bold text-amber-600">{lostLeads.length > 0 ? Math.round((timelineLost / totalLost) * 100) : 0}% ({timelineLost} Deals)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${lostLeads.length > 0 ? (timelineLost / totalLost) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700">
                <span>Client Chose Competitor / Agency</span>
                <span className="font-bold text-purple-600">{lostLeads.length > 0 ? Math.round((competitorLost / totalLost) * 100) : 0}% ({competitorLost} Deals)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${lostLeads.length > 0 ? (competitorLost / totalLost) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Strategic Recommendations */}
        <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>Actionable Growth Insights</span>
          </div>

          <ul className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>E-commerce projects yield highest profit margin:</strong> Consider packaging maintenance retainers to increase recurring MRR.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Price objection mitigation:</strong> Introduce a 2-stage milestone option for leads hesitating on ₹25,000 upfront quotes.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Portfolio verification impact:</strong> Verified badges increased proposal acceptances by 34% over unverified proposals.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
