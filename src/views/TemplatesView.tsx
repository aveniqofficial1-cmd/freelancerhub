import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Plus,
  Copy,
  Edit2,
  Trash2,
  FileText,
  MessageSquare,
  CheckSquare,
  Sparkles,
  X,
  Check
} from 'lucide-react';
import { TemplateItem } from '../types';

export const TemplatesView: React.FC = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate, addToast, setActiveView, setActiveProjectTab } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'communication' | 'document' | 'onboarding'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TemplateItem['category']>('communication');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tagsText, setTagsText] = useState('');

  const filteredTemplates = templates.filter(t => {
    if (categoryFilter === 'all') return true;
    return t.category === categoryFilter;
  });

  const handleOpenAdd = () => {
    setEditingTemplate(null);
    setTitle('');
    setCategory('communication');
    setDescription('');
    setContent('');
    setTagsText('Email, Client');
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (t: TemplateItem) => {
    setEditingTemplate(t);
    setTitle(t.title);
    setCategory(t.category);
    setDescription(t.description);
    setContent(t.content);
    setTagsText(t.tags.join(', '));
    setIsEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsText.split(',').map(tag => tag.trim()).filter(Boolean);
    if (editingTemplate) {
      updateTemplate(editingTemplate.id, {
        title,
        category,
        description,
        content,
        tags
      });
    } else {
      addTemplate({
        title,
        category,
        description,
        content,
        tags
      });
    }
    setIsEditModalOpen(false);
  };

  const handleDuplicate = (t: TemplateItem) => {
    addTemplate({
      title: `${t.title} (Copy)`,
      category: t.category,
      description: t.description,
      content: t.content,
      tags: [...t.tags]
    });
  };

  const handleUseTemplate = (t: TemplateItem) => {
    navigator.clipboard.writeText(t.content);
    addToast(`Template "${t.title}" copied to clipboard & ready to insert!`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Template Library</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pre-built communication messages, contracts, proposals, and onboarding briefs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Template</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {[
          { id: 'all', label: 'All Templates' },
          { id: 'communication', label: 'Client Communication' },
          { id: 'document', label: 'Proposals & Contracts' },
          { id: 'onboarding', label: 'Onboarding Questionnaires' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id as any)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              categoryFilter === cat.id
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-sm hover:shadow-md space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t.category}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDuplicate(t)} className="p-1 text-slate-400 hover:text-slate-700" title="Duplicate">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleOpenEdit(t)} className="p-1 text-slate-400 hover:text-slate-700" title="Edit">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteTemplate(t.id)} className="p-1 text-rose-400 hover:text-rose-600" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1.5">{t.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{t.description}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {t.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewTemplate(t)}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Preview Content
              </button>

              <button
                onClick={() => handleUseTemplate(t)}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-bold transition-colors"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">{previewTemplate.title}</h3>
              <button onClick={() => setPreviewTemplate(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {previewTemplate.content}
            </pre>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUseTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Copy & Use
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingTemplate ? 'Edit Template' : 'Add New Template'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  >
                    <option value="communication">Client Communication</option>
                    <option value="document">Proposals & Contracts</option>
                    <option value="onboarding">Onboarding Brief</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content / Template Body</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
