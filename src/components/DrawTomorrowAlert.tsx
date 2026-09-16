import React, { useState, useEffect } from 'react';
import { MarketType } from '../types';
import { MARKET_CONFIG } from '../data/lotteryData';
import { Translations } from '../i18n/translations';
import { Zap, Timer, ChevronRight, Radio } from 'lucide-react';

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

  const calculateTimeState = () => {
    const now = new Date().getTime();
    const diff = targetDate - now;
    const absDiff = Math.max(0, diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

    // Live Draw: within 1 hour after scheduled start
    const isLive = diff <= 0 && diff > -(60 * 60 * 1000);

    // Calendar day comparison in local time
    const nowDate = new Date(now);
    const tgtDate = new Date(targetDate);
    const isToday =
      nowDate.getFullYear() === tgtDate.getFullYear() &&
      nowDate.getMonth() === tgtDate.getMonth() &&
      nowDate.getDate() === tgtDate.getDate();

    const targetDayStart = new Date(tgtDate.getFullYear(), tgtDate.getMonth(), tgtDate.getDate()).getTime();
    const nowDayStart = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime();
    const dayDiff = Math.round((targetDayStart - nowDayStart) / (24 * 60 * 60 * 1000));
    const isTomorrow = dayDiff === 1;

    return {
      hours,
      minutes,
      seconds,
      diff,
      isLive,
      isToday,
      isTomorrow
    };
  };

  const [timeState, setTimeState] = useState(calculateTimeState);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeState(calculateTimeState());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Determine dynamic copy based on real-time event status
  const tgtDate = new Date(targetDate);
  let alertTitle = t.drawTomorrowAlertTitle;
  let alertBadge = t.drawTomorrowBadge;
  let alertSub = t.drawTomorrowAlertSub;
  let badgeColor = 'bg-amber-500 text-slate-950';
  let bannerBorder = 'border-amber-500/50';

  if (timeState.isLive) {
    alertTitle = t.drawLiveAlertTitle;
    alertBadge = t.drawLiveBadge;
    alertSub = t.drawLiveAlertSub;
    badgeColor = 'bg-rose-500 text-white animate-pulse';
    bannerBorder = 'border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.25)]';
  } else if (timeState.isToday) {
    alertTitle = t.drawTodayAlertTitle;
    alertBadge = t.drawTodayBadge;
    alertSub = t.drawTodayAlertSub;
    badgeColor = 'bg-amber-400 text-slate-950 font-extrabold';
    bannerBorder = 'border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.2)]';
  } else if (timeState.isTomorrow) {
    alertTitle = t.drawTomorrowAlertTitle;
    alertBadge = t.drawTomorrowBadge;
    alertSub = t.drawTomorrowAlertSub;
  } else {
    // Multi-day upcoming
    alertTitle = `📅 ${conf.name} (${tgtDate.getDate()} / ${tgtDate.getMonth() + 1})`;
    alertBadge = 'UPCOMING DRAW';
    alertSub = conf.drawSchedule;
  }

  return (
    <div className={`bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-cyan-500/15 border ${bannerBorder} rounded-xl p-4 relative overflow-hidden mb-6 transition-all duration-500`}>
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        {/* Urgent Icon & Headline */}
        <div className="flex items-start sm:items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl ${timeState.isLive ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-amber-500/20 border-amber-500/50 text-amber-300'} border flex items-center justify-center shrink-0 shadow-md`}>
            {timeState.isLive ? (
              <Radio className="w-5 h-5 animate-pulse text-rose-400" />
            ) : (
              <Zap className="w-5 h-5 animate-bounce" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-white font-mono tracking-tight">
                {alertTitle}
              </h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm ${badgeColor}`}>
                {alertBadge}
              </span>
            </div>
            <p className="text-xs text-amber-200/80 font-mono mt-0.5 max-w-2xl">
              {alertSub}
            </p>
          </div>
        </div>

        {/* Real-time Countdown Box */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-amber-500/20">
          <div className="flex items-center space-x-2 bg-slate-950/80 border border-amber-500/40 px-3 py-1.5 rounded-lg font-mono text-xs">
            <Timer className={`w-4 h-4 ${timeState.isLive ? 'text-rose-400 animate-spin' : 'text-amber-400 animate-pulse'}`} />
            <span className="text-[11px] text-slate-400">
              {timeState.isLive ? 'สถานะสด:' : 'เหลือเวลา:'}
            </span>
            {timeState.isLive ? (
              <span className="text-rose-400 font-extrabold tracking-wider animate-pulse">
                LIVE ON AIR
              </span>
            ) : (
              <div className="flex items-center space-x-1 font-bold text-amber-300">
                <span className="bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                  {String(timeState.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                  {String(timeState.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                  {String(timeState.seconds).padStart(2, '0')}s
                </span>
              </div>
            )}
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

