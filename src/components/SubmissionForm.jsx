import { useState } from 'react';
import { generateDrafts } from '../services/api';
import {
  Loader2,
  Send,
  Type,
  Link,
  Sparkles,
  FileText,
  Globe,
} from 'lucide-react';

export default function SubmissionForm({ onDraftsReceived, isLoading, setIsLoading }) {
  const [submissionType, setSubmissionType] = useState('text');
  const [contentInput, setContentInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!contentInput.trim()) {
      setError('Please enter your content before generating drafts.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await generateDrafts({
        submission_type: submissionType,
        content_input: contentInput.trim(),
      });
      onDraftsReceived(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up w-full max-w-2xl mx-auto">
      {/* ── Card ────────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden">
        {/* Card header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                New Content
              </h2>
              <p className="text-sm text-gray-500">
                Submit a raw idea or paste a URL to get started.
              </p>
            </div>
          </div>
        </div>

        {/* Card body */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          {/* ── Submission type toggle ────────────────── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Submission Type
            </label>
            <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
              {[
                { value: 'text', label: 'Raw Idea', icon: FileText },
                { value: 'url',  label: 'URL',      icon: Globe },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setSubmissionType(value);
                    setContentInput('');
                    setError('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    submissionType === value
                      ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Content input ────────────────────────── */}
          <div>
            <label
              htmlFor="content-input"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              {submissionType === 'text' ? 'Your Idea' : 'Source URL'}
            </label>

            {submissionType === 'text' ? (
              <textarea
                id="content-input"
                rows={6}
                placeholder="Describe your content idea, topic, or key talking points…"
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Link size={16} className="text-gray-400" />
                </div>
                <input
                  id="content-input"
                  type="url"
                  placeholder="https://example.com/article-to-repurpose"
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}
          </div>

          {/* ── Error message ────────────────────────── */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Submit button ────────────────────────── */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating Drafts…
              </>
            ) : (
              <>
                <Send size={18} />
                Generate Drafts
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
