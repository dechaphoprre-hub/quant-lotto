import React, { useState, useEffect } from 'react';
import { MarketType } from '../types';
import { MARKET_CONFIG } from '../data/lotteryData';
import { ACTIVE_MARKETS } from '../data/dataSources';
import { Translations } from '../i18n/translations';
import { Calendar, Timer, Zap, ChevronRight, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface EventTimelineRadarProps {
  activeMarket: MarketType;
  onSelectMarket: (m: MarketType) => void;
  onJumpToEngine: () => void;
  t: Translations;
}

interface EventItem {
  market: MarketType;
  title: string;
  flag: string;
  tag: string;
  timeStr: string;
  dateStr: string;
  dayBadge: string;
  badgeType: 'SUPER' | 'MAJOR' | 'DAILY' | 'REGULAR';
  targetTimestamp: number;
}

export const EventTimelineRadar: React.FC<EventTimelineRadarProps> = ({
  activeMarket,
  onSelectMarket,
  onJumpToEngine,
  t
}) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getDynamicDateStr = (targetTimestamp: number) => {
    const tgt = new Date(targetTimestamp);
    const curr = new Date(now);

    const isSameDay =
      tgt.getFullYear() === curr.getFullYear() &&
      tgt.getMonth() === curr.getMonth() &&
      tgt.getDate() === curr.getDate();

    const targetDayStart = new Date(tgt.getFullYear(), tgt.getMonth(), tgt.getDate()).getTime();
    const currDayStart = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate()).getTime();
    const dayDiff = Math.round((targetDayStart - currDayStart) / (24 * 60 * 60 * 1000));

    const day = tgt.getDate();
    const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const month = thMonths[tgt.getMonth()];
    const yearBe = tgt.getFullYear() + 543;

    if (isSameDay) {
      return `${day} ${month} ${yearBe} (${t.todayLabel})`;
    }
    if (dayDiff === 1) {
      return `${day} ${month} ${yearBe} (${t.tomorrowLabel})`;
    }
    return `${day} ${month} ${yearBe}`;
  };

  const thaiTarget = new Date(MARKET_CONFIG.THAI.nextDrawDate).getTime();
  const hanoiTarget = new Date(MARKET_CONFIG.HANOI.nextDrawDate).getTime();
  const hanoiVipTarget = new Date(MARKET_CONFIG.HANOI_VIP.nextDrawDate).getTime();
  const laoTarget = new Date(MARKET_CONFIG.LAO.nextDrawDate).getTime();

  // Dynamic Events list
  const events = ([
    {
      market: 'THAI',
      title: t.markets.THAI.name,
      flag: '🇹🇭',
      tag: 'GLO THAILAND',
      timeStr: '14:30 - 15:30 น.',
      dateStr: getDynamicDateStr(thaiTarget),
      dayBadge: t.superDrawDayBadge,
      badgeType: 'SUPER',
      targetTimestamp: thaiTarget
    },
    {
      market: 'HANOI',
      title: t.markets.HANOI.name,
      flag: '🇻🇳',
      tag: 'HANOI REGULAR',
      timeStr: '18:15 น.',
      dateStr: getDynamicDateStr(hanoiTarget),
      dayBadge: 'DAILY DRAW',
      badgeType: 'DAILY',
      targetTimestamp: hanoiTarget
    },
    {
      market: 'HANOI_VIP',
      title: t.markets.HANOI_VIP.name,
      flag: '🇻🇳',
      tag: 'HANOI VIP',
      timeStr: '19:15 น.',
      dateStr: getDynamicDateStr(hanoiVipTarget),
      dayBadge: 'DAILY DRAW',
      badgeType: 'DAILY',
      targetTimestamp: hanoiVipTarget
    },
    {
      market: 'LAO',
      title: t.markets.LAO.name,
      flag: '🇱🇦',
      tag: 'LAO DEVELOPMENT',
      timeStr: '20:30 น.',
      dateStr: getDynamicDateStr(laoTarget),
      dayBadge: 'WEDNESDAY NIGHT',
      badgeType: 'MAJOR',
      targetTimestamp: laoTarget
    }
  ] as EventItem[]).filter(event => ACTIVE_MARKETS.includes(event.market));

  const formatCountdown = (target: number) => {
    const diff = target - now;
    if (diff <= 0 && diff > -(60 * 60 * 1000)) {
      return {
        text: 'LIVE ON AIR',
        isUrgent: true,
        isLive: true
      };
    }
    const absDiff = Math.max(0, diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
    return {
      text: `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`,
      isUrgent: hours < 18,
      isLive: false
    };
  };

  const handleCardClick = (market: MarketType) => {
    onSelectMarket(market);
    onJumpToEngine();
  };

  return (
    <div className="mb-6 space-y-3">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold font-mono text-white tracking-wide uppercase">
            {t.eventRadarTitle}
          </h2>
          <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.2 rounded">
            TIMELINE 24H
          </span>
        </div>
        <p className="text-[11px] font-mono text-slate-400">
          {t.eventRadarSub}
        </p>
      </div>

      {/* Responsive Event Timeline Grid - 4 Columns Full Width on Desktop, No Horizontal Scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {events.map((ev) => {
          const isActive = activeMarket === ev.market;
          const cd = formatCountdown(ev.targetTimestamp);

          return (
            <div
              key={ev.market}
              onClick={() => handleCardClick(ev.market)}
              className={`w-full bg-terminal-card border rounded-xl p-3.5 sm:p-4 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between select-none ${
                isActive
                  ? 'border-cyan-400/90 shadow-[0_0_20px_rgba(0,242,254,0.25)] bg-gradient-to-b from-cyan-950/40 via-terminal-card to-terminal-card scale-[1.01]'
                  : 'border-terminal-border hover:border-slate-600 hover:bg-terminal-hover/80'
              }`}
            >
              {/* Active Indicator Pulse */}
              {isActive && (
                <div className="absolute top-0 right-0 w-2 h-full bg-cyan-400 shadow-[0_0_10px_#00F2FE]"></div>
              )}

              <div>
                {/* Event Market & Badge */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-300 min-w-0">
                    <span className="text-base shrink-0">{ev.flag}</span>
                    <span className="truncate">{ev.tag}</span>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      ev.badgeType === 'SUPER'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : ev.badgeType === 'MAJOR'
                        ? 'bg-purple-900/80 text-purple-300 border border-purple-700'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {ev.dayBadge}
                  </span>
                </div>

                {/* Event Name */}
                <h3 className="text-sm font-bold text-white font-mono truncate mb-1">
                  {ev.title}
                </h3>

                {/* Date & Time */}
                <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                  <div className="text-slate-300 font-semibold">{ev.dateStr}</div>
                  <div>ออกรางวัล: <span className="text-cyan-400 font-bold">{ev.timeStr}</span></div>
                </div>
              </div>

              {/* Countdown & Action Button Footer */}
              <div className="mt-3.5 pt-2.5 border-t border-terminal-border/70 flex items-center justify-between gap-1">
                <div className="flex items-center space-x-1 sm:space-x-1.5 text-[11px] sm:text-xs font-mono shrink-0">
                  <Timer className={`w-3.5 h-3.5 ${cd.isUrgent ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                  <span className={`font-bold ${cd.isUrgent ? 'text-amber-300' : 'text-slate-300'}`}>
                    {cd.text}
                  </span>
                </div>

                <div
                  className={`flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono font-bold px-2 py-1 rounded transition-colors shrink-0 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{isActive ? 'กำลังวิเคราะห์' : t.analyzeMarketBtn}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
