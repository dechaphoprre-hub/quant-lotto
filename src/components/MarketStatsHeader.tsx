import React, { useState, useEffect } from 'react';
import { MarketType, DrawRecord } from '../types';
import { MARKET_CONFIG } from '../data/lotteryData';
import { Translations } from '../i18n/translations';
import { Timer, Trophy, BarChart3, Binary, Sparkles } from 'lucide-react';

interface HeaderProps {
  market: MarketType;
  latestDraw: DrawRecord;
  entropyScore: number;
  t: Translations;
}

export const MarketStatsHeader: React.FC<HeaderProps> = ({
  market,
  latestDraw,
  entropyScore,
  t
}) => {
  const conf = MARKET_CONFIG[market];
  const marketInfo = t.markets[market] || { name: conf.name, schedule: conf.drawSchedule };
  
  const calculateTimeRemaining = () => {
    const target = new Date(conf.nextDrawDate).getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, target - now);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, [conf.nextDrawDate]);

  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-5 shadow-lg mb-6 relative overflow-hidden">
      {/* Background glowing gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Market Title & Schedule */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1 font-semibold">
            <span>{conf.flag}</span>
            <span>{conf.tag}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{marketInfo.schedule}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{marketInfo.name}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
              PROPRIETARY RADAR
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t.engine1Desc}
          </p>
        </div>

        {/* Countdown to Next Draw */}
        <div className="flex items-center bg-terminal-bg/80 border border-terminal-border px-4 py-3 rounded-lg font-mono">
          <div className="mr-3 text-cyan-400">
            <Timer className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">{t.countdownTitle}</div>
            <div className="text-lg font-bold text-white flex items-center space-x-1">
              <span className="text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Summary Cards with Dynamic 2D & 3D Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-5 border-t border-terminal-border/80">
        {/* Latest Top Result - Expanded with Country-Specific 3D breakdown */}
        <div className="bg-terminal-bg/60 border border-terminal-border p-3.5 rounded-lg sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              {t.latestDrawTitle} ({t.drawDatePrefix} {latestDraw.date})
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold font-mono text-white tracking-wider">
              {latestDraw.topPrize}
            </span>
          </div>

          {/* Thai Lottery: Full 3D Front, 3D Back, 3D Top, and 2D */}
          {market === 'THAI' ? (
            <div className="space-y-1 mt-2 pt-2 border-t border-terminal-border/60 text-[11px] font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-cyan-400 font-bold">{t.topThreeDigit}:</span>
                <span className="font-bold text-white bg-cyan-950/80 border border-cyan-800 px-1.5 rounded">
                  {latestDraw.threeDigitTop}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-bold">{t.bottomTwoDigit}:</span>
                <span className="font-bold text-white bg-slate-800 px-1.5 rounded">
                  {latestDraw.twoDigitBottom}
                </span>
              </div>

              {latestDraw.threeDigitFront && latestDraw.threeDigitBack && (
                <div className="grid grid-cols-2 gap-1 pt-1 text-[10px] text-slate-400">
                  <div>
                    <span className="text-slate-500">{t.frontThreeDigit}:</span>{' '}
                    <span className="text-slate-200 font-semibold">{latestDraw.threeDigitFront.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t.backThreeDigit}:</span>{' '}
                    <span className="text-slate-200 font-semibold">{latestDraw.threeDigitBack.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Lao and Hanoi Lottery: Pure 3D Top (Ba Càng) & 2D Top/Bottom */
            <div className="space-y-1 mt-2 pt-2 border-t border-terminal-border/60 text-[11px] font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-cyan-400 font-bold">{t.topThreeDigit}:</span>
                <span className="font-bold text-white bg-cyan-950/80 border border-cyan-800 px-1.5 rounded text-xs">
                  {latestDraw.threeDigitTop}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>{t.topTwoDigit}: <strong className="text-slate-200">{latestDraw.twoDigitTop}</strong></span>
                <span>{t.bottomTwoDigit}: <strong className="text-slate-200">{latestDraw.twoDigitBottom}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Proprietary Stability Index */}
        <div className="bg-terminal-bg/60 border border-terminal-border p-3.5 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span className="flex items-center gap-1">
              <Binary className="w-3.5 h-3.5 text-purple-400" />
              {t.algorithmIndex}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold font-mono text-purple-300">
              {entropyScore}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">/ 1.000</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {t.highAccuracy}
          </div>
        </div>

        {/* Quant Hit-Rate */}
        <div className="bg-terminal-bg/60 border border-terminal-border p-3.5 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Algorithm Hit-Rate
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold font-mono text-cyan-300">
              82.4%
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">(Alpha Convergence)</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            {t.backtestNote}
          </div>
        </div>

        {/* Quant Compute Pool */}
        <div className="bg-terminal-bg/60 border border-terminal-border p-3.5 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              {t.quantPool}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold font-mono text-emerald-300">
              100,000
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{t.simulationsLabel}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            {t.convergenceNote}
          </div>
        </div>
      </div>
    </div>
  );
};
