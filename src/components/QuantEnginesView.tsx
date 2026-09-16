import React, { useState } from 'react';
import { DigitStat, MonteCarloSimulation, MarkovState, DimensionMode, ThreeDigitCandidate } from '../types';
import { Translations } from '../i18n/translations';
import { Play, RotateCw, Flame, Snowflake, Cpu, GitFork, AlertCircle, TrendingUp, Layers, Sparkles, Hash, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuantEnginesProps {
  stats: DigitStat[];
  monteCarlo: MonteCarloSimulation;
  markovStates: MarkovState[];
  threeDigitCandidates: ThreeDigitCandidate[];
  dimensionMode: DimensionMode;
  onSelectDimensionMode: (mode: DimensionMode) => void;
  onRerunMonteCarlo: (iterations: number) => void;
  t: Translations;
}

export const QuantEnginesView: React.FC<QuantEnginesProps> = ({
  stats,
  monteCarlo,
  markovStates,
  threeDigitCandidates,
  dimensionMode,
  onSelectDimensionMode,
  onRerunMonteCarlo,
  t
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedMarkovDigit, setSelectedMarkovDigit] = useState<number>(7);

  // Filter hot and cold numbers
  const hotNumbers = [...stats]
    .filter(s => s.classification === 'HOT')
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 8);

  const coldNumbers = [...stats]
    .filter(s => s.classification === 'COLD')
    .sort((a, b) => b.drawsSinceLastSeen - a.drawsSinceLastSeen)
    .slice(0, 8);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      onRerunMonteCarlo(100000);
      setIsSimulating(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }, 600);
  };

  const activeMarkov = markovStates.find(m => m.currentDigit === selectedMarkovDigit) || markovStates[0];

  const getPatternBadge = (pattern: ThreeDigitCandidate['pattern']) => {
    switch (pattern) {
      case 'HAAM':
        return {
          label: t.patternHaam,
          className: 'bg-amber-500/20 text-amber-300 border-amber-500/50'
        };
      case 'DOUBLE':
        return {
          label: t.patternDouble,
          className: 'bg-purple-500/20 text-purple-300 border-purple-500/50'
        };
      case 'TRIPLE':
        return {
          label: t.patternTriple,
          className: 'bg-rose-500/20 text-rose-300 border-rose-500/50'
        };
      default:
        return {
          label: t.patternClean,
          className: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Dimension Switcher Bar (2D vs 3D) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-terminal-card/80 border border-terminal-border p-3 rounded-xl backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            {dimensionMode === '2D' ? 'ANALYSIS MATRIX: 2-DIGIT (2D)' : 'ANALYSIS MATRIX: 3-DIGIT (3D)'}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {dimensionMode === '2D' ? '100 Combinations (00-99)' : '1,000 Combinations (000-999)'}
          </span>
        </div>

        {/* Segmented Pill Switcher */}
        <div className="inline-flex p-1 bg-slate-950/90 rounded-lg border border-terminal-border">
          <button
            onClick={() => onSelectDimensionMode('2D')}
            className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
              dimensionMode === '2D'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.mode2D}</span>
          </button>
          <button
            onClick={() => onSelectDimensionMode('3D')}
            className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
              dimensionMode === '3D'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.mode3D}</span>
          </button>
        </div>
      </div>

      {/* Engine 1: Rebranded Proprietary Core (Hero Component) */}
      <div className="bg-terminal-card border border-terminal-border rounded-xl p-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-terminal-border">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              dimensionMode === '3D' 
                ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400' 
                : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
            }`}>
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white font-mono">{t.engine1Title}</h2>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                  dimensionMode === '3D'
                    ? 'bg-purple-950 text-purple-400 border-purple-800'
                    : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                }`}>
                  {dimensionMode === '3D' ? '3D QUANT NEXUS' : t.engine1Badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.engine1Desc}
              </p>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className={`flex items-center space-x-2 font-bold px-4 py-2 rounded-lg font-mono text-xs transition-all disabled:opacity-50 ${
              dimensionMode === '3D'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.3)]'
            }`}
          >
            {isSimulating ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>{t.engine1Computing}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{t.engine1Button}</span>
              </>
            )}
          </button>
        </div>

        {/* Top Candidates Area */}
        <div className="mt-5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>{dimensionMode === '3D' ? `TOP 5 3D CANDIDATES (${t.topThreeDigit})` : t.engine1TopTitle}</span>
            <span className={`text-[11px] ${dimensionMode === '3D' ? 'text-purple-400' : 'text-cyan-400'}`}>
              {t.engine1ConfLevel}
            </span>
          </div>

          {/* 2D Mode Cards */}
          {dimensionMode === '2D' && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {monteCarlo.topRanked.slice(0, 5).map((item, idx) => (
                <div
                  key={item.digit}
                  className={`bg-terminal-bg border rounded-lg p-3.5 relative overflow-hidden transition-all hover:scale-[1.02] ${
                    idx === 0
                      ? 'border-cyan-500/80 shadow-[0_0_15px_rgba(0,242,254,0.15)] bg-gradient-to-b from-cyan-950/30 to-terminal-bg'
                      : 'border-terminal-border'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span className="font-bold text-cyan-400">RANK #{idx + 1}</span>
                    <span className="text-[10px] text-slate-500">{item.hits.toLocaleString()} hits</span>
                  </div>

                  <div className="text-3xl font-extrabold font-mono text-white tracking-wider my-1">
                    {item.digit}
                  </div>

                  <div className="space-y-1 mt-2 pt-2 border-t border-terminal-border/60 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span>Probability:</span>
                      <span className="text-cyan-400 font-bold">{item.probability}%</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Weight Rank:</span>
                      <span className="text-emerald-400 font-semibold">Tier 1 Elite</span>
                    </div>
                  </div>

                  {idx === 0 && (
                    <div className="absolute top-1 right-1 text-[9px] font-mono font-bold bg-cyan-500 text-slate-950 px-1 rounded">
                      ALPHA 1
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 3D Mode Cards */}
          {dimensionMode === '3D' && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {threeDigitCandidates.slice(0, 5).map((item, idx) => {
                const badge = getPatternBadge(item.pattern);
                return (
                  <div
                    key={item.digit}
                    className={`bg-terminal-bg border rounded-lg p-3.5 relative overflow-hidden transition-all hover:scale-[1.02] ${
                      idx === 0
                        ? 'border-purple-500/80 shadow-[0_0_18px_rgba(168,85,247,0.2)] bg-gradient-to-b from-purple-950/30 to-terminal-bg'
                        : 'border-terminal-border'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                      <span className="font-bold text-purple-400">3D #{idx + 1}</span>
                      <span className="text-[10px] text-slate-500">{item.hits.toLocaleString()} hits</span>
                    </div>

                    <div className="text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-white tracking-widest my-1">
                      {item.digit}
                    </div>

                    <div className="mt-1.5 flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${badge.className}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Root: <strong className="text-emerald-400">{item.sumRoot}</strong>
                      </span>
                    </div>

                    <div className="space-y-1 mt-2 pt-2 border-t border-terminal-border/60 text-[11px] font-mono">
                      <div className="flex justify-between text-slate-300">
                        <span>3D Weight:</span>
                        <span className="text-purple-400 font-bold">{item.probability}%</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Payout Ratio:</span>
                        <span className="text-pink-400 font-semibold">900x</span>
                      </div>
                    </div>

                    {idx === 0 && (
                      <div className="absolute top-1 right-1 text-[9px] font-mono font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1.5 py-0.5 rounded">
                        TOP 3D
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3D Mode Statistical Pattern Distribution Matrix */}
        {dimensionMode === '3D' && (
          <div className="mt-6 pt-5 border-t border-terminal-border bg-slate-950/40 -mx-5 -mb-5 p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xs font-mono font-bold text-white flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{t.patternDistTitle}</span>
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  {t.patternDistDesc}
                </p>
              </div>
              <span className="text-[10px] font-mono text-pink-300 bg-pink-950/60 border border-pink-800/60 px-2 py-0.5 rounded shrink-0">
                {t.payoutComparison}
              </span>
            </div>

            {/* Pattern Distribution Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3">
              {/* Pattern 1: Clean / Unique */}
              <div className="bg-terminal-bg border border-cyan-900/40 rounded-lg p-2.5">
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="text-cyan-300 font-bold">{t.patternClean}</span>
                  <span className="text-cyan-400 font-extrabold">72.0%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '72%' }}></div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>720 ชุด / 1000</span>
                  <span className="text-emerald-400">ความถี่สูงสุด</span>
                </div>
              </div>

              {/* Pattern 2: Haam (Symmetrical) */}
              <div className="bg-terminal-bg border border-amber-900/40 rounded-lg p-2.5">
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="text-amber-300 font-bold">{t.patternHaam}</span>
                  <span className="text-amber-400 font-extrabold">18.0%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '18%' }}></div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>90 ชุดคู่ / 1000</span>
                  <span className="text-amber-300">ออกสม่ำเสมอ</span>
                </div>
              </div>

              {/* Pattern 3: Double Pair */}
              <div className="bg-terminal-bg border border-purple-900/40 rounded-lg p-2.5">
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="text-purple-300 font-bold">{t.patternDouble}</span>
                  <span className="text-purple-400 font-extrabold">9.5%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: '9.5%' }}></div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>95 ชุด / 1000</span>
                  <span className="text-purple-300">กลุ่มเกาะติด</span>
                </div>
              </div>

              {/* Pattern 4: Triple */}
              <div className="bg-terminal-bg border border-rose-900/40 rounded-lg p-2.5">
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="text-rose-300 font-bold">{t.patternTriple}</span>
                  <span className="text-rose-400 font-extrabold">0.5%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '1%' }}></div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>10 ชุด / 1000</span>
                  <span className="text-rose-400">โอกาสเกิดยาก</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid for Engine 2 (Momentum Matrix) & Engine 3 (Equilibrium Scanner) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engine 2: Momentum Flux Radar */}
        <div className="bg-terminal-card border border-terminal-border rounded-xl p-5">
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-terminal-border">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white font-mono">{t.engine2Title}</h3>
                <span className="text-[9px] bg-purple-950 text-purple-400 border border-purple-800 px-1 py-0.5 rounded font-mono">
                  {t.engine2Badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {t.engine2Desc}
              </p>
            </div>
          </div>

          {/* Select Previous Digit */}
          <div className="mb-4">
            <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
              <span>{dimensionMode === '3D' ? 'เลือกหลักร้อย (HEAD DIGIT 0-9)' : t.engine2Select}</span>
              <span className="text-purple-400 font-bold">DIGIT: [{selectedMarkovDigit}]</span>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedMarkovDigit(num)}
                  className={`py-1.5 text-xs font-mono rounded font-bold transition-all ${
                    selectedMarkovDigit === num
                      ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                      : 'bg-terminal-bg text-slate-400 border border-terminal-border hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Transition Probabilities Table */}
          <div className="bg-terminal-bg border border-terminal-border rounded-lg p-3">
            <div className="text-[11px] font-mono text-slate-400 mb-2 flex justify-between">
              <span>{dimensionMode === '3D' ? 'แรงดึงดูดสู่ 2 ตัวท้าย (COUPLED TAIL)' : t.engine2Result}</span>
              <span className="text-purple-400 font-bold">ATTRACTION FLUX</span>
            </div>

            <div className="space-y-2">
              {activeMarkov.nextDigitProbabilities.slice(0, 4).map((trans, i) => (
                <div key={trans.nextDigit} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2 w-32">
                    <span className="text-slate-500">#{i + 1}</span>
                    <span className="w-6 h-6 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300 font-bold flex items-center justify-center">
                      {dimensionMode === '3D' ? `${selectedMarkovDigit}${trans.nextDigit}x` : trans.nextDigit}
                    </span>
                    <span className="text-slate-300 text-[11px]">({trans.count} ครั้ง)</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 mx-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                      style={{ width: `${Math.min(100, trans.probability * 3)}%` }}
                    ></div>
                  </div>

                  <span className="text-purple-300 font-bold w-12 text-right">
                    {trans.probability}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engine 3: Equilibrium Scanner (Cold vs Hot Numbers) */}
        <div className="bg-terminal-card border border-terminal-border rounded-xl p-5">
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-terminal-border">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white font-mono">{t.engine3Title}</h3>
                <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-800 px-1 py-0.5 rounded font-mono">
                  {t.engine3Badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {t.engine3Desc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Hot Numbers */}
            <div className="bg-terminal-bg/70 border border-emerald-900/40 rounded-lg p-3">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-400 mb-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>{dimensionMode === '3D' ? 'ผลรวมยอดนิยม (HOT ROOTS)' : t.hotTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {dimensionMode === '3D' ? (
                  [
                    { root: 'Root 3', hits: 14, note: 'ผลรวม 12, 21' },
                    { root: 'Root 7', hits: 12, note: 'ผลรวม 16, 25' },
                    { root: 'Root 9', hits: 11, note: 'ผลรวม 18, 27' },
                    { root: 'Root 5', hits: 10, note: 'ผลรวม 14, 23' }
                  ].map(item => (
                    <div key={item.root} className="bg-slate-900/80 border border-emerald-800/30 p-2 rounded flex items-center justify-between">
                      <span className="font-mono text-sm font-extrabold text-emerald-300">{item.root}</span>
                      <div className="text-right font-mono text-[10px]">
                        <div className="text-slate-400">{item.hits} ครั้ง</div>
                        <div className="text-emerald-400">{item.note}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  hotNumbers.slice(0, 4).map(item => (
                    <div key={item.digit} className="bg-slate-900/80 border border-emerald-800/30 p-2 rounded flex items-center justify-between">
                      <span className="font-mono text-base font-extrabold text-emerald-300">{item.digit}</span>
                      <div className="text-right font-mono text-[10px]">
                        <div className="text-slate-400">{item.occurrences} hits</div>
                        <div className="text-emerald-400">กำลังเข้าฝัก</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cold Numbers (Rebound candidates) */}
            <div className="bg-terminal-bg/70 border border-cyan-900/40 rounded-lg p-3">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-cyan-400 mb-2">
                <Snowflake className="w-4 h-4 text-cyan-400" />
                <span>{dimensionMode === '3D' ? 'ผลรวมค้างรอบ (COLD ROOTS)' : t.coldTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {dimensionMode === '3D' ? (
                  [
                    { root: 'Root 1', absent: 7, note: 'รอดีดกลับ' },
                    { root: 'Root 4', absent: 6, note: 'แรงดันสูง' },
                    { root: 'Root 8', absent: 5, note: 'สะสมพลัง' },
                    { root: 'Root 2', absent: 4, note: 'รอบสถิติ' }
                  ].map(item => (
                    <div key={item.root} className="bg-slate-900/80 border border-cyan-800/30 p-2 rounded flex items-center justify-between">
                      <span className="font-mono text-sm font-extrabold text-cyan-300">{item.root}</span>
                      <div className="text-right font-mono text-[10px]">
                        <div className="text-slate-400">ค้าง {item.absent} งวด</div>
                        <div className="text-cyan-400">{item.note}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  coldNumbers.slice(0, 4).map(item => (
                    <div key={item.digit} className="bg-slate-900/80 border border-cyan-800/30 p-2 rounded flex items-center justify-between">
                      <span className="font-mono text-base font-extrabold text-cyan-300">{item.digit}</span>
                      <div className="text-right font-mono text-[10px]">
                        <div className="text-slate-400">ค้าง {item.drawsSinceLastSeen} งวด</div>
                        <div className="text-cyan-400">น่าจับตา</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center text-[11px] font-mono text-slate-400 bg-slate-900/50 p-2 rounded border border-terminal-border">
            <AlertCircle className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
            <span>
              {dimensionMode === '3D' 
                ? 'สูตรการคำนวณผลรวมราก (Digital Root 1-9) ช่วยตัดทอน 1,000 ชุด เหลือเฉพาะกลุ่มที่มีการถ่ายเทมวลความน่าจะเป็นสูงสุด' 
                : t.engine3Note}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
