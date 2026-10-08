import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, CheckCircle2, ShieldCheck, Sparkles, Trophy } from 'lucide-react';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const TestimonialModal: React.FC<TestimonialModalProps> = ({
  isOpen,
  onClose,
  projectId
}) => {
  const { completeProjectWithTestimonial, getProjectById } = useApp();
  const project = getProjectById(projectId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState(
    'Rithvik is an exceptional partner. High code quality, lightning-fast turnaround, and great communication from kickoff to final deployment!'
  );
  const [allowPublicDisplay, setAllowPublicDisplay] = useState(true);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeProjectWithTestimonial(projectId, {
      rating,
      comment,
      allowPublicDisplay
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-400" />

        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">🎉 Complete & Verify Project</h3>
              <p className="text-xs text-slate-500">Collect client review and generate cryptographic proof</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            Project: <strong className="text-slate-900">{project.name}</strong> for <strong className="text-emerald-700">{project.clientCompany}</strong>
          </div>

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Client Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-amber-600">{rating}.0 / 5.0 Rating</span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Client Feedback & Testimonial</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share client feedback..."
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Display Permission */}
          <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allowPublicDisplay}
              onChange={(e) => setAllowPublicDisplay(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-slate-50"
            />
            <span>Display this verified testimonial on public portfolio & verification pages</span>
          </label>

          {/* Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99]"
            >
              <ShieldCheck className="w-4 h-4" />
              Complete Project & Mint Verified Badge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
