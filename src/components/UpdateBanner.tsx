import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

// Bump the key's suffix whenever there's a new announcement to show it again.
const KEY = 'faf-daily-update-resources';

// A dismissible "what changed" banner at the top of the page. No examples —
// just names what changed in the category.
export function UpdateBanner() {
  const [show, setShow] = useState(() => {
    try {
      return localStorage.getItem(KEY) !== 'dismissed';
    } catch {
      return true;
    }
  });
  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, 'dismissed');
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mb-6 flex items-start gap-3 border border-accent/40 bg-accent/[0.06] px-4 py-3">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
      <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-slate-300">
        <span className="font-semibold text-accent">Update — the “Yields” column is now “Resources”.</span>{' '}
        It now tracks three resources —{' '}
        <span className="font-semibold text-slate-100">Mass</span>,{' '}
        <span className="font-semibold text-slate-100">Energy</span> and{' '}
        <span className="font-semibold text-slate-100">Buildpower</span> — a unit matches on Buildpower if it
        can build at all, and units that spend{' '}
        <span className="font-semibold text-slate-100">Energy upkeep</span> are now flagged too.
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss update"
        className="shrink-0 text-slate-500 transition-colors hover:text-slate-200"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
