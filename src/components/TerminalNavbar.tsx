import React from 'react';
import { MarketType } from '../types';
import { MARKET_CONFIG } from '../data/lotteryData';
import { Translations, Language } from '../i18n/translations';
import { LiveServerClock } from './LiveServerClock';
import { Activity, ShieldCheck, Flame, Radio, Cpu, Video, Globe } from 'lucide-react';

interface NavbarProps {
  activeMarket: MarketType;
  onSelectMarket: (m: MarketType) => void;
  activeTab: 'TERMINAL' | 'HEATMAP' | 'WAR_ROOM' | 'PROOF';
  onSelectTab: (tab: 'TERMINAL' | 'HEATMAP' | 'WAR_ROOM' | 'PROOF') => void;
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenGuide: () => void;
  onOpenAdminConsole?: () => void;
  t: Translations;
}

export const TerminalNavbar: React.FC<NavbarProps> = ({
  activeMarket,
  onSelectMarket,
  activeTab,
  onSelectTab,
  currentLang,
  onSelectLang,
  onOpenGuide,
  onOpenAdminConsole,
  t
}) => {
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'TH', label: 'TH', flag: '🇹🇭' },
    { code: 'LA', label: 'LA', flag: '🇱🇦' },
    { code: 'VN', label: 'VN', flag: '🇻🇳' },
    { code: 'EN', label: 'EN', flag: '🇺🇸' }
  ];

  return (
    <header className="border-b border-terminal-border bg-terminal-card/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Ticker Bar with Live Real-time Clock */}
      <div className="bg-terminal-bg/95 border-b border-terminal-border/60 px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-terminal-muted">
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
          {/* Operator Console Trigger Badge */}
          {onOpenAdminConsole && (
            <button
              onClick={onOpenAdminConsole}
              title="Operator Console (Ctrl+Shift+A)"
              className="flex items-center text-emerald-400 font-semibold shrink-0 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              <span className="text-[11px] sm:text-xs">{t.sysActive}</span>
            </button>
          )}

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Real-Time Live Clock & Date */}
          <LiveServerClock currentLang={currentLang} />

          <span className="text-slate-700 hidden lg:inline">|</span>
          <span className="hidden lg:inline text-cyan-400 font-bold truncate">{t.engineName}</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-auto">
          {/* Video Guide CTA Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/50 text-cyan-300 px-2.5 sm:px-3 py-1 rounded font-mono font-bold text-[11px] sm:text-xs transition-all shadow-sm active:scale-95"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{t.guideButton}</span>
          </button>

          {/* Direct 1-Click Language Switcher (Pill Selector) */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700">
            <span className="px-1 text-slate-500 hidden sm:inline">
              <Globe className="w-3 h-3" />
            </span>
            {languages.map(l => {
              const isSelected = currentLang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => onSelectLang(l.code)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-bold transition-all flex items-center space-x-0.5 sm:space-x-1 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={l.label}
                >
                  <span>{l.flag}</span>
                  <span>{l.code}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Bar: Brand + Market Selector + Primary Navigation Tabs in a single sleek row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Brand Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.15)] shrink-0">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse-glow" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wider text-white font-mono">
                  QUANT<span className="text-cyan-400">LOTTO</span>
                </span>
                <span className="text-[9px] sm:text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.2 rounded font-mono font-semibold">
                  TERMINAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden xl:block">Quantitative Probability & Statistical Engine</p>
            </div>
          </div>
        </div>

        {/* Action Controls in the SAME line: Market Selector Box + Nav Tabs Box (Strict Single Line) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-x-auto no-scrollbar">
          {/* Market Selector Box - Ultra Compact (No TH/LA/VN/VN prefix) */}
          <div className="flex items-center bg-terminal-bg p-0.5 sm:p-1 rounded-lg border border-terminal-border shrink-0">
            {(Object.keys(MARKET_CONFIG) as MarketType[]).map((key) => {
              const conf = MARKET_CONFIG[key];
              const isActive = activeMarket === key;
              const shortTag = key === 'THAI' ? 'GLO THAI' : key === 'LAO' ? 'LAO DEV' : key === 'HANOI' ? 'HANOI' : 'HANOI VIP';
              return (
                <button
                  key={key}
                  onClick={() => onSelectMarket(key)}
                  className={`px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono transition-all flex items-center justify-center active:scale-95 shrink-0 ${
                    isActive
                      ? 'bg-terminal-card text-cyan-300 font-bold border border-cyan-400/80 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-terminal-hover'
                  }`}
                  title={conf.name}
                >
                  <span className="font-semibold whitespace-nowrap">{shortTag}</span>
                </button>
              );
            })}
          </div>

          {/* Primary Navigation Tabs Box - Same line side-by-side */}
          <div className="flex items-center bg-terminal-bg p-0.5 sm:p-1 rounded-lg border border-terminal-border shrink-0">
            <button
              onClick={() => onSelectTab('TERMINAL')}
              className={`flex items-center justify-center space-x-1 px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono transition-all active:scale-95 shrink-0 ${
                activeTab === 'TERMINAL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-terminal-hover'
              }`}
            >
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{t.terminalTab}</span>
            </button>

            <button
              onClick={() => onSelectTab('HEATMAP')}
              className={`flex items-center justify-center space-x-1 px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono transition-all active:scale-95 shrink-0 ${
                activeTab === 'HEATMAP'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-terminal-hover'
              }`}
            >
              <Flame className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{t.heatmapTab}</span>
            </button>

            <button
              onClick={() => onSelectTab('WAR_ROOM')}
              className={`flex items-center justify-center space-x-1 px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono transition-all active:scale-95 shrink-0 ${
                activeTab === 'WAR_ROOM'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold animate-pulse shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-terminal-hover'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="whitespace-nowrap">{t.warRoomTab}</span>
            </button>

            <button
              onClick={() => onSelectTab('PROOF')}
              className={`flex items-center justify-center space-x-1 px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono transition-all active:scale-95 shrink-0 ${
                activeTab === 'PROOF'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-terminal-hover'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{t.proofTab}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
