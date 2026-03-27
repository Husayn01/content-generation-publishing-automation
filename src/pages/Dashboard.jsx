import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Layers, ArrowLeft, RotateCcw, LogOut, Database, ExternalLink, LayoutDashboard } from 'lucide-react';

import SubmissionForm from '../components/SubmissionForm';
import DraftReview from '../components/DraftReview';
import RegenerationForm from '../components/RegenerationForm';
import PublishingControls from '../components/PublishingControls';

export default function Dashboard() {
  const navigate = useNavigate();
  // ── Global state ──────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [drafts, setDrafts] = useState({ draft_1: '', draft_2: '', draft_3: '' });

  const isAnyLoading = isGenerating || isRegenerating || isPublishing;
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
    setIsGenerating(false);
    setIsRegenerating(false);
    setIsPublishing(false);
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

      {/* ═══ Layout Wrapper ═══════════════════════════ */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        
        {/* ═══ Sidebar ══════════════════════════════════ */}
        <aside className="w-[280px] shrink-0 hidden lg:flex flex-col py-10 pr-8">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl p-5 relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
            
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></span>
              Workspace Links
            </h3>
            
            <nav className="flex flex-col gap-3 relative z-10">
              <a 
                href="https://airtable.com/appiQz7Mzyw4LykjY/shrT3PfO669E3zP2U" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-indigo-100 bg-transparent hover:bg-indigo-50/50 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100/70 flex items-center justify-center shrink-0 transition-colors">
                  <Database size={18} className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="flex-1 flex flex-col pt-0.5">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors flex items-center justify-between">
                    Airtable SDK
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                  </span>
                  <span className="text-xs font-semibold text-slate-400 mt-0.5">Raw data pipeline</span>
                </div>
              </a>

              <a 
                href="https://airtable.com/appiQz7Mzyw4LykjY/shreTH69XA2THxPi7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-indigo-100 bg-transparent hover:bg-indigo-50/50 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100/70 flex items-center justify-center shrink-0 transition-colors">
                  <LayoutDashboard size={18} className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="flex-1 flex flex-col pt-0.5">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors flex items-center justify-between">
                    Exec Interface
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                  </span>
                  <span className="text-xs font-semibold text-slate-400 mt-0.5">Live Analytics</span>
                </div>
              </a>
            </nav>
          </div>
        </aside>

        {/* ═══ Main content ═════════════════════════════ */}
        <main className="flex-1 py-10 px-4 sm:px-6">
          {currentStep === 1 && (
          <SubmissionForm
            onDraftsReceived={handleDraftsReceived}
            isLoading={isGenerating}
            setIsLoading={setIsGenerating}
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
              isLoading={isRegenerating}
              setIsLoading={setIsRegenerating}
              isAnyLoading={isAnyLoading}
            />
            <div className="pt-4">
              <PublishingControls
                recordId={recordId}
                selectedDraftText={selectedDraftText}
                onReset={handleReset}
                isLoading={isPublishing}
                setIsLoading={setIsPublishing}
                isAnyLoading={isAnyLoading}
              />
            </div>
          </div>
        )}
        </main>
      </div>

      {/* ═══ Footer ═══════════════════════════════════ */}
      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-200/40">
        © {new Date().getFullYear()} Fetemi Marketing Agency
      </footer>
    </div>
  );
}
