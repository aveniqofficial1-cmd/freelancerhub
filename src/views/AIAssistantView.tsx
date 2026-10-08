import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Sparkles,
  Send,
  Copy,
  Check,
  User,
  Lightbulb,
  FileText,
  MessageSquare,
  Zap,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionSnippet?: string;
}

export const AIAssistantView: React.FC = () => {
  const { profile, projects, leads, addToast } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${profile.name.split(' ')[0]}! I am your AI Freelance Copilot. I can generate client proposals, customize onboarding briefs, craft polite follow-ups, diagnose lost deals, and transform project deliverables into verified case studies. How can I help you today?`,
      timestamp: 'Just now'
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    { title: 'Draft a ₹25,000 Website Proposal', prompt: 'Create a proposal for a ₹25,000 website.' },
    { title: 'Restaurant Onboarding Questionnaire', prompt: 'Create an onboarding form for a restaurant website.' },
    { title: 'Professional Kickoff Message', prompt: 'Write a professional welcome message.' },
    { title: 'Client Milestone Follow-up', prompt: 'Create a client follow-up message for pending feedback.' },
    { title: 'Summarize Active Workload', prompt: 'Summarize my current active projects and upcoming deadlines.' },
    { title: 'Diagnose Lost Deals', prompt: 'Why am I losing projects and how can I fix it?' }
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate smart AI domain generation
    setTimeout(() => {
      let aiResponseText = '';
      const q = query.toLowerCase();

      if (q.includes('proposal') || q.includes('25,000')) {
        aiResponseText = `Here is a custom, high-converting proposal structured for a ₹25,000 website:

# PROJECT PROPOSAL & STATEMENT OF WORK
**Target Client:** Fast-Growing Brand  
**Prepared By:** ${profile.name} — ${profile.title}  
**Investment:** ₹25,000 (50% upfront deposit / 50% upon final sign-off)  
**Timeline:** 3 to 4 Weeks  

### 1. Strategic Objective
Deliver a responsive, mobile-first web app that reduces bounce rates, highlights your core offerings, and integrates seamless lead capture directly to WhatsApp / CRM.

### 2. Deliverables Breakdown
- High-fidelity Figma UI/UX prototype & design system
- React / Next.js responsive frontend code with modern animations
- Payment gateway & contact inquiry API integrations
- Google PageSpeed 90+ speed audit & technical SEO tags
- 30-day post-launch warranty & training walkthrough`;
      } else if (q.includes('onboarding') || q.includes('restaurant')) {
        aiResponseText = `Here is an optimized Onboarding Brief for a Restaurant & Hospitality client:

1. Brand name, tagline, and exact cuisine specialties
2. Primary location, operating hours, and seating capacity
3. Do you require table reservation booking, digital QR menu, or online delivery ordering?
4. Existing high-resolution food photography & logo vector assets
5. Links to 3 competitor restaurant websites you admire
6. Preferred color aesthetic (e.g., rustic bistro, luxury fine-dining, vibrant cafe)
7. Specific deadline or upcoming grand-opening event date`;
      } else if (q.includes('welcome') || q.includes('kickoff')) {
        aiResponseText = `Here is a warm, professional Welcome & Kickoff message:

"Hi [Client Name],

Welcome to your [Project Name] workspace! We are thrilled to partner with [Company Name] on this initiative.

Here is what will happen next:
1. Kickoff Onboarding Brief — We'll collect your brand guidelines and color preferences.
2. Prototype Review — You'll receive early Figma wireframes to approve before coding.
3. 1-Click Milestone Approvals — All deliverables will be shared here for your feedback.

Looking forward to building something outstanding together!

Warm regards,
${profile.name}"`;
      } else if (q.includes('summarize') || q.includes('current')) {
        aiResponseText = `Here is your current freelance business summary:
- **Active Projects (4):** Graminum Organics (65%), ABC Gym (Completed), Sadalaxmi Selections (Completed), Ricky Pickles (Proposal Stage).
- **Revenue Cleared:** ₹72,500 settled this month.
- **Top Priority:** Graminum "Cart & Checkout" deliverable is currently ready for final sign-off.`;
      } else if (q.includes('losing') || q.includes('fix')) {
        aiResponseText = `Based on your CRM pipeline diagnostics:
1. **50% of lost deals cited budget constraints:** Consider offering a 2-stage milestone payment option (e.g. ₹12,500 deposit + ₹12,500 on launch) to lower entry friction.
2. **Add Verified Badges to Proposals:** Highlighting your 12 verified projects and 4.9 rating on public proposals will increase trust against lower-priced competitors.`;
      } else {
        aiResponseText = `I have analyzed your request regarding "${query}". As your AI assistant, I can tailor this into a formal client document, integrate it into your active project workspace, or draft a direct email reply. Let me know if you would like me to refine the tone or format!`;
      }

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied text to clipboard!', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">AI Freelance Copilot</h1>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              GPT-4o Domain Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Generate proposals, customize briefs, write client responses, and optimize your conversion pipeline.
          </p>
        </div>
      </div>

      {/* Suggested Prompts Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.prompt)}
            className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-500/40 text-left transition-all group flex items-start justify-between gap-2 shadow-sm hover:shadow-md"
          >
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                {p.title}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{p.prompt}</div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-0.5" />
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-6 min-h-[400px] max-h-[600px] overflow-y-auto shadow-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 text-xs leading-relaxed ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-4 rounded-2xl max-w-2xl space-y-2 relative group ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white font-semibold rounded-tr-none shadow-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none font-mono whitespace-pre-wrap text-[12px]'
              }`}
            >
              <div>{m.text}</div>

              {m.sender === 'ai' && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-sans">
                  <span>AI Copilot • {m.timestamp}</span>
                  <button
                    onClick={() => handleCopy(m.text)}
                    className="flex items-center gap-1 hover:text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 italic">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>AI Copilot is drafting your response...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="relative">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask AI Copilot to generate proposals, contracts, client emails, or analyze projects..."
          className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none shadow-sm placeholder:text-slate-400"
        />
        <button
          onClick={() => handleSendMessage()}
          className="absolute right-2.5 top-2.5 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
