import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Layers, ArrowLeft, RotateCcw, LogOut } from 'lucide-react';

import SubmissionForm from '../components/SubmissionForm';
import DraftReview from '../components/DraftReview';
import RegenerationForm from '../components/RegenerationForm';
import PublishingControls from '../components/PublishingControls';

export default function Dashboard() {
  const navigate = useNavigate();
  // ── Global state ──────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [drafts, setDrafts] = useState({ draft_1: '', draft_2: '', draft_3: '' });
  const [draftTags, setDraftTags] = useState({
    draft_1: 'Analytical',
    draft_2: 'Contrarian',
    draft_3: 'Results-Oriented'
  });
  const [selectedDraftKey, setSelectedDraftKey] = useState('');
  const [recordId, setRecordId] = useState('');

  const selectedDraftText = selectedDraftKey ? drafts[selectedDraftKey] : '';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  // ── Callbacks ─────────────────────────────────────
  const handleDraftsReceived = useCallback((data) => {
    const parseText = (val) => (typeof val === 'object' && val !== null ? val.text || val.content : val);
    const parseTag = (key, defaultTag, val) => data[`${key}_tag`] || (typeof val === 'object' && val !== null ? val.style || val.tag : defaultTag);

    setDrafts({
      draft_1: parseText(data.draft_1),
      draft_2: parseText(data.draft_2),
      draft_3: parseText(data.draft_3),
    });
    setDraftTags({
      draft_1: parseTag('draft_1', 'Analytical', data.draft_1),
      draft_2: parseTag('draft_2', 'Contrarian', data.draft_2),
      draft_3: parseTag('draft_3', 'Results-Oriented', data.draft_3),
    });
    if (data.record_id) {
      setRecordId(data.record_id);
    }
    setSelectedDraftKey('');
    setCurrentStep(2);
  }, []);

  const handleSelectDraft = useCallback((key) => {
    setSelectedDraftKey(key);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setDrafts({ draft_1: '', draft_2: '', draft_3: '' });
    setSelectedDraftKey('');
    setRecordId('');
    setIsLoading(false);
  }, []);

  // ── Render ────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* ═══ Navbar ═══════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow">
              <Layers size={18} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Content Engine
            </span>
            <span className="hidden md:inline-block ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700">
              Agency Pro
            </span>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            {/* Step indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium mr-4">
              <span
                className={`px-3 py-1 rounded-full transition-colors ${currentStep === 1
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-200 text-slate-500'
                  }`}
              >
                1 · Submit
              </span>
              <span className="text-slate-300">→</span>
              <span
                className={`px-3 py-1 rounded-full transition-colors ${currentStep === 2
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-200 text-slate-500'
                  }`}
              >
                2 · Review &amp; Publish
              </span>
            </div>

            {/* Back / Reset */}
            {currentStep === 2 && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Start Over</span>
                <RotateCcw size={14} className="sm:hidden" />
              </button>
            )}

            <div className="w-px h-5 bg-slate-200 hidden sm:block"></div>

            <button
               onClick={handleLogout}
               className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
               title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ═══ Main content ═════════════════════════════ */}
      <main className="flex-1 py-10 px-4 sm:px-6">
        {currentStep === 1 && (
          <SubmissionForm
            onDraftsReceived={handleDraftsReceived}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <DraftReview
              drafts={drafts}
              draftTags={draftTags}
              selectedDraftKey={selectedDraftKey}
              onSelectDraft={handleSelectDraft}
            />
            <RegenerationForm
              recordId={recordId}
              onRegenerated={handleDraftsReceived}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
            <div className="pt-4">
              <PublishingControls
                recordId={recordId}
                selectedDraftText={selectedDraftText}
                onReset={handleReset}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        )}
      </main>

      {/* ═══ Footer ═══════════════════════════════════ */}
      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-200/40">
        © {new Date().getFullYear()} Fetemi Marketing Agency
      </footer>
    </div>
  );
}
