import React, { useState } from 'react';
import { DigitStat } from '../types';
import { Translations } from '../i18n/translations';
import { Flame, Snowflake, Info, X } from 'lucide-react';

interface HeatmapProps {
  stats: DigitStat[];
  t: Translations;
}

export const ProbabilityHeatmap: React.FC<HeatmapProps> = ({ stats, t }) => {
  const [selectedDigit, setSelectedDigit] = useState<DigitStat | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'HOT' | 'COLD' | 'EVEN' | 'ODD'>('ALL');

  // Filter digits
  const filteredStats = stats.filter(s => {
    if (filter === 'HOT') return s.classification === 'HOT';
    if (filter === 'COLD') return s.classification === 'COLD';
    if (filter === 'EVEN') return s.num % 2 === 0;
    if (filter === 'ODD') return s.num % 2 !== 0;
    return true;
  });

  // Calculate color intensity based on probability weight
  const getCellColor = (stat: DigitStat) => {
    if (stat.classification === 'HOT') {
      return 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 hover:bg-emerald-800/80 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
    }
    if (stat.classification === 'COLD') {
      return 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300 hover:bg-cyan-800/80 shadow-[0_0_8px_rgba(0,242,254,0.2)]';
    }
    if (stat.probabilityWeight > 1.2) {
      return 'bg-purple-950/50 border-purple-600/50 text-purple-200 hover:bg-purple-800/70';
    }
    return 'bg-terminal-bg/80 border-terminal-border/80 text-slate-400 hover:border-slate-500 hover:text-white';
  };

  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-terminal-border">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white font-mono">{t.heatmapTitle}</h2>
            <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800 px-1.5 py-0.5 rounded font-mono">
              10x10 MATRIX
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.heatmapDesc}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-1.5 bg-terminal-bg p-1 rounded-lg border border-terminal-border text-xs font-mono">
          {(['ALL', 'HOT', 'COLD', 'EVEN', 'ODD'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded transition-all ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/60 border border-emerald-400"></span>
          <span>{t.legendHot}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-cyan-500/60 border border-cyan-400"></span>
          <span>{t.legendCold}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-purple-500/50 border border-purple-400"></span>
          <span>{t.legendAboveAvg}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></span>
          <span>{t.legendBaseline}</span>
        </div>
      </div>

      {/* 10x10 Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
        {filteredStats.map(stat => (
          <button
            key={stat.digit}
            onClick={() => setSelectedDigit(stat)}
            className={`h-11 sm:h-12 rounded border flex flex-col items-center justify-center font-mono transition-all transform hover:scale-105 relative ${getCellColor(
              stat
            )}`}
          >
            <span className="text-sm sm:text-base font-extrabold tracking-wider">{stat.digit}</span>
            <span className="text-[9px] opacity-70 leading-none">{stat.occurrences}x</span>

            {stat.classification === 'HOT' && (
              <span className="absolute top-0.5 right-0.5 text-[8px] text-emerald-400">
                <Flame className="w-2.5 h-2.5 fill-current" />
              </span>
            )}
            {stat.classification === 'COLD' && (
              <span className="absolute top-0.5 right-0.5 text-[8px] text-cyan-400">
                <Snowflake className="w-2.5 h-2.5" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Modal Dossier when clicking a digit */}
      {selectedDigit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-terminal-card border border-terminal-border rounded-xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setSelectedDigit(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-terminal-bg border border-terminal-border"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-4 mb-5">
              <div className="w-16 h-16 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center font-mono text-3xl font-extrabold text-cyan-300 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                {selectedDigit.digit}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-mono text-lg font-bold text-white">DOSSIER: DIGIT {selectedDigit.digit}</h3>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      selectedDigit.classification === 'HOT'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : selectedDigit.classification === 'COLD'
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    {selectedDigit.classification}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {t.dossierEnergyStatus} {selectedDigit.probabilityWeight.toFixed(2)}x Baseline
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 font-mono text-xs">
              <div className="bg-terminal-bg p-3 rounded-lg border border-terminal-border">
                <span className="text-slate-400 text-[10px] uppercase">{t.dossierDrawCount}</span>
                <div className="text-lg font-bold text-white">{selectedDigit.occurrences} {t.proofDrawUnit}</div>
                <div className="text-[10px] text-cyan-400">{selectedDigit.frequency.toFixed(2)}% of total draws</div>
              </div>

              <div className="bg-terminal-bg p-3 rounded-lg border border-terminal-border">
                <span className="text-slate-400 text-[10px] uppercase">{t.dossierDrawsAbsent}</span>
                <div className="text-lg font-bold text-white">{selectedDigit.drawsSinceLastSeen} {t.proofDrawUnit}</div>
                <div className="text-[10px] text-slate-500">
                  {selectedDigit.drawsSinceLastSeen === 0 ? t.dossierJustDrawn : t.dossierAbsenceLabel}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-terminal-border text-xs font-mono text-slate-300 mb-4">
              <div className="flex items-center text-cyan-400 font-bold mb-1">
                <Info className="w-3.5 h-3.5 mr-1" />
                <span>{t.dossierEvalTitle}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {selectedDigit.classification === 'HOT' && t.dossierEvalHot}
                {selectedDigit.classification === 'COLD' && t.dossierEvalCold}
                {selectedDigit.classification === 'NEUTRAL' && t.dossierEvalNeutral}
              </p>
            </div>

            <button
              onClick={() => setSelectedDigit(null)}
              className="w-full py-2 bg-terminal-bg hover:bg-terminal-hover border border-terminal-border rounded-lg text-xs font-mono text-white transition-all font-semibold"
            >
              {t.dossierCloseBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
