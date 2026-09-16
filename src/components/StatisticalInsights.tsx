import React, { useMemo } from 'react';
import { DrawRecord, DigitStat, MarketType } from '../types';
import { calculateChiSquareTest, findDormantNumbers, calculateCoOccurrencePairs } from '../math/statisticalInsights';
import { Translations } from '../i18n/translations';
import { BeliefNumbers } from './BeliefNumbers';
import { Sigma, Moon, Link2, CheckCircle2, XCircle } from 'lucide-react';

interface StatisticalInsightsProps {
  draws: DrawRecord[];
  stats: DigitStat[];
  market: MarketType;
  t: Translations;
}

const DORMANT_CUTOFF_YEARS = 3;

export const StatisticalInsights: React.FC<StatisticalInsightsProps> = ({ draws, stats, market, t }) => {
  const chiSquare = useMemo(() => calculateChiSquareTest(stats), [stats]);
  const dormant = useMemo(() => findDormantNumbers(draws, DORMANT_CUTOFF_YEARS), [draws]);
  const coOccurrence = useMemo(() => calculateCoOccurrencePairs(draws, 10), [draws]);

  return (
    <div className="space-y-6">
      {/* Chi-square honesty check */}
      <div className="bg-terminal-card border border-terminal-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sigma className="w-5 h-5 text-cyan-400 shrink-0" />
          <h3 className="text-sm font-bold text-white font-mono">{t.chiSquareTitle}</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">{t.chiSquareDesc}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <div className="bg-terminal-bg/60 border border-terminal-border rounded-lg p-3">
            <div className="text-[10px] text-slate-400 font-mono uppercase">{t.chiSquareStatLabel}</div>
            <div className="text-lg font-bold font-mono text-white">{chiSquare.statistic}</div>
          </div>
          <div className="bg-terminal-bg/60 border border-terminal-border rounded-lg p-3">
            <div className="text-[10px] text-slate-400 font-mono uppercase">{t.chiSquareDfLabel}</div>
            <div className="text-lg font-bold font-mono text-white">{chiSquare.degreesOfFreedom}</div>
          </div>
          <div className="bg-terminal-bg/60 border border-terminal-border rounded-lg p-3">
            <div className="text-[10px] text-slate-400 font-mono uppercase">{t.chiSquarePValueLabel}</div>
            <div className="text-lg font-bold font-mono text-white">{chiSquare.pValue}</div>
          </div>
          <div className={`rounded-lg p-3 border ${chiSquare.isConsistentWithRandom ? 'bg-emerald-950/30 border-emerald-800/50' : 'bg-amber-950/30 border-amber-800/50'}`}>
            <div className="flex items-center gap-1.5">
              {chiSquare.isConsistentWithRandom
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                : <XCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              <span className={`text-xs font-bold font-mono ${chiSquare.isConsistentWithRandom ? 'text-emerald-300' : 'text-amber-300'}`}>
                {chiSquare.isConsistentWithRandom ? t.chiSquareVerdictRandom : t.chiSquareVerdictSkewed}
              </span>
            </div>
          </div>
        </div>
        <p className="text-[10px] font-mono text-slate-500">{t.chiSquareFootnote}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dormant numbers */}
        <div className="bg-terminal-card border border-terminal-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Moon className="w-5 h-5 text-indigo-400 shrink-0" />
            <h3 className="text-sm font-bold text-white font-mono">{t.dormantTitle}</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">{t.dormantDesc}</p>

          {dormant.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 text-center py-6">{t.dormantEmptyState}</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {dormant.map(item => (
                <div key={item.digit} className="bg-terminal-bg/60 border border-indigo-900/40 rounded-lg p-2 text-center">
                  <div className="font-mono font-extrabold text-white text-base">{item.digit}</div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                    {item.lastSeenDate === null ? t.dormantNeverSeenLabel : `${t.dormantLastSeenLabel} ${item.lastSeenDate}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Co-occurrence pairs */}
        <div className="bg-terminal-card border border-terminal-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Link2 className="w-5 h-5 text-teal-400 shrink-0" />
            <h3 className="text-sm font-bold text-white font-mono">{t.cooccurTitle}</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">{t.cooccurDesc}</p>

          {coOccurrence.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 text-center py-6">{t.cooccurEmptyState}</p>
          ) : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {coOccurrence.map(entry => (
                <div key={entry.pair.join('-')} className="flex items-center justify-between bg-terminal-bg/60 border border-teal-900/40 rounded-lg px-3 py-1.5">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-white text-sm">
                    <span className="px-1.5 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-300">{entry.pair[0]}</span>
                    <span className="text-slate-600">+</span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-300">{entry.pair[1]}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{entry.count}x {t.cooccurCountLabel}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deliberately separated from the Quant Engine content above: social belief, not statistics. */}
      <BeliefNumbers market={market} t={t} />
    </div>
  );
};
