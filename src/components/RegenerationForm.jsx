import { useState } from 'react';
import { regenerateDrafts } from '../services/api';
import { Loader2, RefreshCw, MessageSquare } from 'lucide-react';

export default function RegenerationForm({ recordId, onRegenerated, isLoading, setIsLoading }) {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleRegenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!feedback.trim()) {
      setError('Please provide feedback on what to change.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await regenerateDrafts({
        submission_record_id: recordId,
        feedback: feedback.trim(),
      });
      onRegenerated(data);
      setFeedback('');
    } catch (err) {
      setError(err.message || 'Regeneration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up w-full max-w-6xl mx-auto mt-4 px-4 sm:px-0">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-orange-200/60 overflow-hidden">
        <form onSubmit={handleRegenerate} className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 w-full relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MessageSquare size={18} className="text-orange-400" />
              </div>
              <input
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isLoading}
                placeholder="Not quite right? Request changes to get a fresh set of drafts..."
                className="w-full rounded-xl border border-orange-100 bg-orange-50/50 pl-11 pr-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all disabled:opacity-50"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !feedback.trim()}
              className="shrink-0 w-full md:w-auto flex items-center justify-center gap-2 bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50 font-semibold py-3.5 px-6 rounded-xl shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Regenerate
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
