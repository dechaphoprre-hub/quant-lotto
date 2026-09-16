import React, { useState, useEffect } from 'react';
import { MarketType } from '../types';
import { MARKET_CONFIG } from '../data/lotteryData';
import { Translations } from '../i18n/translations';
import { Radio, Play, RotateCcw, Zap, Target, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WarRoomProps {
  market: MarketType;
  t: Translations;
}

export const LiveWarRoom: React.FC<WarRoomProps> = ({ market, t }) => {
  const conf = MARKET_CONFIG[market];
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStep, setDrawStep] = useState<0 | 1 | 2>(0); // 0: Idle, 1: First digit out, 2: Final 2-digit out
  const [firstDigit, setFirstDigit] = useState<number | null>(null);
  const [secondDigit, setSecondDigit] = useState<number | null>(null);
  const [spinningDigit, setSpinningDigit] = useState(0);

  // Digital wheel spin animation
  useEffect(() => {
    let interval: any;
    if (isDrawing) {
      interval = setInterval(() => {
        setSpinningDigit(Math.floor(Math.random() * 10));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isDrawing]);

  const handleStartDraw = () => {
    setDrawStep(0);
    setFirstDigit(null);
    setSecondDigit(null);
    setIsDrawing(true);

    // Step 1: Reveal first digit after 1.5 seconds
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 10);
      setFirstDigit(d1);
      setDrawStep(1);

      // Step 2: Reveal second digit after another 1.8 seconds
      setTimeout(() => {
        const d2 = Math.floor(Math.random() * 10);
        setSecondDigit(d2);
        setDrawStep(2);
        setIsDrawing(false);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 1800);
    }, 1500);
  };

  const handleReset = () => {
    setDrawStep(0);
    setFirstDigit(null);
    setSecondDigit(null);
    setIsDrawing(false);
  };

  // Remaining candidate pool when first digit is locked
  const remainingCandidates =
    firstDigit !== null
      ? Array(10)
          .fill(0)
          .map((_, i) => `${firstDigit}${i}`)
      : [];

  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-6 relative overflow-hidden">
      {/* Live Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-terminal-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white font-mono">{t.warRoomTitle}</h2>
              <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                LIVE BROADCAST
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.warRoomDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {drawStep === 2 && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-2 bg-terminal-bg hover:bg-terminal-hover border border-terminal-border rounded-lg text-xs font-mono text-slate-300 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.warRoomResetBtn}</span>
            </button>
          )}

          <button
            onClick={handleStartDraw}
            disabled={isDrawing}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold px-5 py-2 rounded-lg font-mono text-xs transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isDrawing ? t.engine1Computing : t.warRoomButton}</span>
          </button>
        </div>
      </div>

      {/* Main War Room Stage */}
      <div className="mt-8 text-center max-w-2xl mx-auto">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
          OFFICIAL BALL SPHERE MACHINE // {conf.tag}
        </div>

        {/* The Two Digit Ball Display */}
        <div className="flex items-center justify-center gap-6 my-6">
          {/* Digit 1 (Tens Position) */}
          <div className="relative">
            <div className="text-[11px] font-mono text-slate-400 mb-2">{t.warRoomTens}</div>
            <div
              className={`w-28 h-36 rounded-2xl border-2 flex items-center justify-center font-mono text-6xl font-extrabold transition-all shadow-2xl ${
                firstDigit !== null
                  ? 'bg-gradient-to-b from-cyan-950 to-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_30px_rgba(0,242,254,0.3)] scale-105'
                  : isDrawing
                  ? 'bg-slate-900 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-terminal-bg border-terminal-border text-slate-600'
              }`}
            >
              {firstDigit !== null ? firstDigit : isDrawing ? spinningDigit : '?'}
            </div>
            {firstDigit !== null && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full whitespace-nowrap">
                {t.warRoomLocked}
              </span>
            )}
          </div>

          {/* Digit 2 (Units Position) */}
          <div className="relative">
            <div className="text-[11px] font-mono text-slate-400 mb-2">{t.warRoomUnits}</div>
            <div
              className={`w-28 h-36 rounded-2xl border-2 flex items-center justify-center font-mono text-6xl font-extrabold transition-all shadow-2xl ${
                secondDigit !== null
                  ? 'bg-gradient-to-b from-emerald-950 to-slate-900 border-emerald-400 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105'
                  : isDrawing && drawStep === 1
                  ? 'bg-slate-900 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-terminal-bg border-terminal-border text-slate-600'
              }`}
            >
              {secondDigit !== null ? secondDigit : isDrawing && drawStep === 1 ? spinningDigit : '?'}
            </div>
            {secondDigit !== null && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full whitespace-nowrap">
                {t.warRoomWinner}
              </span>
            )}
          </div>
        </div>

        {/* Live Probability Shrinker Telemetry */}
        <div className="mt-8 bg-terminal-bg border border-terminal-border rounded-xl p-4 text-left font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-terminal-border">
            <span className="flex items-center gap-1.5 font-bold text-cyan-400">
              <Zap className="w-4 h-4" />
              REAL-TIME CANDIDATE NARROWING
            </span>
            <span>
              <span className="text-slate-500">STATUS: </span>
              <span className="text-white font-bold">
                {drawStep === 0
                  ? t.warRoomAwaiting
                  : drawStep === 1
                  ? t.warRoomShrunk
                  : `${t.warRoomCompleted} [${firstDigit}${secondDigit}]`}
              </span>
            </span>
          </div>

          {drawStep === 0 && (
            <div className="text-xs text-slate-400 text-center py-4">
              {t.warRoomInstruction}
            </div>
          )}

          {drawStep === 1 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {t.warRoomEliminatedNotice}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {remainingCandidates.map(num => (
                  <div
                    key={num}
                    className="p-2 rounded bg-cyan-950/60 border border-cyan-500/50 text-center text-cyan-300 font-bold text-sm shadow-sm animate-pulse"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          )}

          {drawStep === 2 && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-lg flex items-center justify-between animate-in zoom-in-95 duration-200">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">
                    {t.warRoomResultPrefix} <span className="text-emerald-400 text-lg">[{firstDigit}{secondDigit}]</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {t.warRoomVerifiedEngine}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded uppercase">
                  VERIFIED BY ENGINE
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
