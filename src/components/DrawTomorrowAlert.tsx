import React, { useState, useEffect } from 'react';
import { MarketType } from '../types';
import { MARKET_CONFIG } from '../data/lotteryData';
import { Translations } from '../i18n/translations';
import { AlertCircle, Zap, Timer, ChevronRight } from 'lucide-react';

interface DrawTomorrowAlertProps {
  market: MarketType;
  t: Translations;
  onJumpToEngine?: () => void;
}

export const DrawTomorrowAlert: React.FC<DrawTomorrowAlertProps> = ({
  market,
  t,
  onJumpToEngine
}) => {
  const conf = MARKET_CONFIG[market];
  const targetDate = new Date(conf.nextDrawDate).getTime();

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const diff = Math.max(0, targetDate - now);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds, diff };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-cyan-500/15 border border-amber-500/50 rounded-xl p-4 shadow-[0_0_25px_rgba(245,158,11,0.15)] relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        {/* Urgent Icon & Headline */}
        <div className="flex items-start sm:items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shrink-0 shadow-md">
            <Zap className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-white font-mono tracking-tight">
                {t.drawTomorrowAlertTitle}
              </h2>
              <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow-sm">
                {t.drawTomorrowBadge}
              </span>
            </div>
            <p className="text-xs text-amber-200/80 font-mono mt-0.5 max-w-2xl">
              {t.drawTomorrowAlertSub}
            </p>
          </div>
        </div>

        {/* Real-time Countdown Box */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-amber-500/20">
          <div className="flex items-center space-x-2 bg-slate-950/80 border border-amber-500/40 px-3 py-1.5 rounded-lg font-mono text-xs">
            <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-[11px] text-slate-400">เหลือเวลา:</span>
            <div className="flex items-center space-x-1 font-bold text-amber-300">
              <span className="bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          {onJumpToEngine && (
            <button
              onClick={onJumpToEngine}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-mono text-xs rounded-lg shadow-md transition-all flex items-center space-x-1 shrink-0 active:scale-95"
            >
              <span>วิเคราะห์เลขงวดนี้</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
