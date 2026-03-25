import { useState } from 'react';
import { publishDraft } from '../services/api';
import {
  Loader2,
  Rocket,
  CalendarClock,
  Zap,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function PublishingControls({
  recordId,
  selectedDraftText,
  onReset,
  isLoading,
  setIsLoading,
}) {
  const [action, setAction] = useState('publish_now');
  const [scheduledTime, setScheduledTime] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const canSubmit = selectedDraftText && !isLoading;

  const handleSubmit = async () => {
    setError('');

    if (!selectedDraftText) {
      setError('Please select a draft above before proceeding.');
      return;
    }

    if (action === 'schedule' && !scheduledTime) {
      setError('Please pick a date and time for the scheduled publish.');
      return;
    }

    setIsLoading(true);

    try {
      await publishDraft({
        submission_record_id: recordId,
        selected_draft_text: selectedDraftText,
        action,
        scheduled_time: action === 'schedule' ? new Date(scheduledTime).toISOString() : '',
      });

      // Show success toast
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onReset();
      }, 2500);
    } catch (err) {
      setError(err.message || 'Publishing failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ── Toast notification ──────────────────────── */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 toast-enter">
          <div className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl">
            <CheckCircle size={22} />
            <div>
              <p className="font-semibold text-sm">
                {action === 'publish_now' ? 'Published!' : 'Scheduled!'}
              </p>
              <p className="text-emerald-100 text-xs">
                {action === 'publish_now'
                  ? 'Your content is now live.'
                  : 'Your content has been queued.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Controls card ───────────────────────────── */}
      <div className="animate-fade-in-up w-full max-w-2xl mx-auto mt-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <Rocket size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  Publish Settings
                </h2>
                <p className="text-sm text-gray-500">
                  Choose how you'd like to release this content.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 pb-8 space-y-6">
            {/* ── Action toggle ──────────────────────── */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Action
              </label>
              <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
                {[
                  { value: 'publish_now', label: 'Publish Now', icon: Zap },
                  { value: 'schedule',    label: 'Schedule',    icon: Clock },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setAction(value);
                      setError('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      action === value
                        ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Conditional date-time picker ───────── */}
            {action === 'schedule' && (
              <div className="animate-fade-in-up">
                <label
                  htmlFor="schedule-time"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Schedule Date &amp; Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CalendarClock size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="schedule-time"
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* ── Error message ──────────────────────── */}
            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* ── Submit button ──────────────────────── */}
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Rocket size={18} />
                  Approve &amp; Process
                </>
              )}
            </button>

            {!selectedDraftText && (
              <p className="text-center text-xs text-gray-400">
                ↑ Select a draft above to enable this button.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
