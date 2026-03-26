import { CheckCircle2 } from 'lucide-react';

const DRAFT_LABELS = [
  { key: 'draft_1', label: 'Draft 1', color: 'from-blue-500 to-cyan-400' },
  { key: 'draft_2', label: 'Draft 2', color: 'from-violet-500 to-purple-400' },
  { key: 'draft_3', label: 'Draft 3', color: 'from-amber-500 to-orange-400' },
];

export default function DraftReview({ drafts, draftTags, selectedDraftKey, onSelectDraft }) {
  return (
    <div className="animate-fade-in-up w-full max-w-6xl mx-auto">
      {/* Section heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Review Your Drafts
        </h2>
        <p className="mt-1 text-gray-500 text-sm">
          We generated 3 variations — pick the one that fits best.
        </p>
      </div>

      {/* ── Draft cards grid ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DRAFT_LABELS.map(({ key, label, color }) => {
          const isSelected = selectedDraftKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDraft(key)}
              className={`group relative text-left rounded-2xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-md overflow-hidden cursor-pointer ${isSelected
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20 scale-[1.01]'
                  : 'border-gray-200/60 shadow-sm hover:shadow-md hover:border-gray-300'
                }`}
            >
              {/* Colour bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700 tracking-wide uppercase">
                    {label}
                  </span>
                  {draftTags && draftTags[key] && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      {draftTags[key]}
                    </span>
                  )}
                </div>
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${isSelected
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white'
                    }`}
                >
                  {isSelected && <CheckCircle2 size={14} />}
                </span>
              </div>

              {/* Content */}
              <div className="px-5 pb-5">
                <div className="draft-content text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {drafts[key] || '(No content)'}
                </div>
              </div>

              {/* Selected label */}
              {isSelected && (
                <div className="absolute bottom-0 inset-x-0 bg-blue-500 text-white text-center text-xs font-semibold py-1.5 tracking-wide">
                  ✓ SELECTED
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
