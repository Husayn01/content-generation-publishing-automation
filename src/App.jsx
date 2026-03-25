import { useState, useCallback } from 'react';
import {
  Layers,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';

import SubmissionForm from './components/SubmissionForm';
import DraftReview from './components/DraftReview';
import RegenerationForm from './components/RegenerationForm';
import PublishingControls from './components/PublishingControls';

export default function App() {
  // ── Global state ──────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [drafts, setDrafts] = useState({ draft_1: '', draft_2: '', draft_3: '' });
  const [selectedDraftKey, setSelectedDraftKey] = useState('');
  const [recordId, setRecordId] = useState('');

  const selectedDraftText = selectedDraftKey ? drafts[selectedDraftKey] : '';

  // ── Callbacks ─────────────────────────────────────
  const handleDraftsReceived = useCallback((data) => {
    setDrafts({
      draft_1: data.draft_1,
      draft_2: data.draft_2,
      draft_3: data.draft_3,
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
    <div className="min-h-screen flex flex-col">
      {/* ═══ Navbar ═══════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow">
              <Layers size={18} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              Content Engine
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            {/* Step pills */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
              <span
                className={`px-3 py-1 rounded-full transition-colors ${currentStep === 1
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-400'
                  }`}
              >
                1 · Submit
              </span>
              <span className="text-gray-300">→</span>
              <span
                className={`px-3 py-1 rounded-full transition-colors ${currentStep === 2
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-400'
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
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors ml-2 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Start Over</span>
                <RotateCcw size={14} className="sm:hidden" />
              </button>
            )}
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
      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-200/40">
        © {new Date().getFullYear()} Content Engine · Powered by AI
      </footer>
    </div>
  );
}
