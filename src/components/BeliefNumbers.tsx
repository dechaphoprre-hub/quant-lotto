import React from 'react';
import { MarketType } from '../types';
import { fetchBeliefNumbers, BeliefNumberView } from '../services/beliefNumbersService';
import { Translations } from '../i18n/translations';
import { Newspaper, AlertTriangle } from 'lucide-react';

interface BeliefNumbersProps {
  market: MarketType;
  t: Translations;
}

/**
 * "Numbers from the news/folklore" — a real, high-traffic genre for Thai
 * lottery sites, but explicitly social belief, not statistics. Deliberately
 * styled apart from the Quant Engine (different color, its own disclaimer)
 * so it's never mistaken for a Quant Engine output, and only ever shows
 * real admin-submitted entries with a source note — never a fabricated
 * example.
 */
export const BeliefNumbers: React.FC<BeliefNumbersProps> = ({ market, t }) => {
  const [entries, setEntries] = React.useState<BeliefNumberView[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBeliefNumbers(market).then(result => {
      if (!cancelled) {
        setEntries(result);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [market]);

  return (
    <div className="bg-purple-950/10 border border-purple-800/40 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Newspaper className="w-5 h-5 text-purple-400 shrink-0" />
        <h3 className="text-sm font-bold text-white font-mono">{t.beliefTitle}</h3>
      </div>
      <div className="flex items-start gap-2 bg-purple-950/30 border border-purple-800/40 rounded-lg p-2.5 mb-4 text-[11px] font-mono text-purple-200">
        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>{t.beliefDisclaimer}</span>
      </div>

      {loading && <p className="text-xs font-mono text-slate-500">{t.proofLoadingLabel}</p>}

      {!loading && entries.length === 0 && (
        <div className="text-center py-6">
          <p className="text-xs font-mono font-bold text-slate-300 mb-1">{t.beliefEmptyTitle}</p>
          <p className="text-[11px] font-mono text-slate-500 max-w-sm mx-auto">{t.beliefEmptyDesc}</p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="space-y-2.5">
          {entries.map(entry => (
            <div key={entry.id} className="bg-slate-950/60 border border-purple-900/40 rounded-lg p-3">
              <p className="text-xs font-bold text-white mb-1.5">{entry.headline}</p>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {entry.numbers.map((num, idx) => (
                  <span key={`${entry.id}-${idx}`} className="px-2 py-0.5 rounded bg-purple-900/50 border border-purple-700/50 text-purple-200 font-mono text-xs font-bold">
                    {num}
                  </span>
                ))}
              </div>
              <p className="text-[10px] font-mono text-slate-500">
                {t.beliefSourceLabel}: {entry.sourceNote}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
