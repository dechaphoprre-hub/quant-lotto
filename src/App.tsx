import React, { useState, useMemo, useEffect } from 'react';
import { MarketType, DimensionMode, DrawRecord } from './types';
import { MARKET_CONFIG } from './data/lotteryData';
import { calculateDigitStatistics, runMonteCarloSimulation, calculateMarkovTransitions, runThreeDigitSimulation } from './math/quantEngine';
import { LotteryStorageService } from './services/storageService';
import { LotterySyncService } from './services/lotterySyncService';
import { TerminalNavbar } from './components/TerminalNavbar';
import { MarketStatsHeader } from './components/MarketStatsHeader';
import { QuantEnginesView } from './components/QuantEnginesView';
import { ProbabilityHeatmap } from './components/ProbabilityHeatmap';
import { LiveWarRoom } from './components/LiveWarRoom';
import { ProofOfAlgorithm } from './components/ProofOfAlgorithm';
import { GuideModal } from './components/GuideModal';
import { AdminConsoleModal } from './components/AdminConsoleModal';
import { DrawTomorrowAlert } from './components/DrawTomorrowAlert';
import { EventTimelineRadar } from './components/EventTimelineRadar';
import { BannerAd } from './components/BannerAd';
import { TRANSLATIONS, Language } from './i18n/translations';
import { Shield, Bell } from 'lucide-react';

const LINE_OA_URL = import.meta.env.VITE_LINE_OA_URL as string | undefined;

export const App: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<MarketType>('THAI');
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'HEATMAP' | 'WAR_ROOM' | 'PROOF'>('TERMINAL');
  const [dimensionMode, setDimensionMode] = useState<DimensionMode>('2D');
  const [monteCarloRuns, setMonteCarloRuns] = useState<number>(50000);
  const [currentLang, setCurrentLang] = useState<Language>('TH');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState('Preparing data source...');
  const adminConsoleEnabled = import.meta.env.VITE_ADMIN_CONSOLE_ENABLED === 'true';

  // Persistent market datasets with fallback to master factory data
  const [datasets, setDatasets] = useState<Record<MarketType, DrawRecord[]>>(() => ({
    THAI: LotteryStorageService.loadMarketData('THAI', MARKET_CONFIG.THAI.dataset),
    LAO: LotteryStorageService.loadMarketData('LAO', MARKET_CONFIG.LAO.dataset),
    HANOI: LotteryStorageService.loadMarketData('HANOI', MARKET_CONFIG.HANOI.dataset),
    HANOI_VIP: LotteryStorageService.loadMarketData('HANOI_VIP', MARKET_CONFIG.HANOI_VIP.dataset),
  }));

  const t = TRANSLATIONS[currentLang];
  const draws = datasets[activeMarket] || MARKET_CONFIG[activeMarket].dataset;
  const latestDraw = draws[0] || MARKET_CONFIG[activeMarket].dataset[0];

  useEffect(() => {
    let cancelled = false;
    const markets: MarketType[] = ['THAI', 'LAO', 'HANOI', 'HANOI_VIP'];

    const syncDatasets = async () => {
      const results = await Promise.all(
        markets.map(market => LotterySyncService.checkAndUpdate(market, datasets[market]))
      );

      if (cancelled) return;

      setDatasets(previous => {
        const next = { ...previous };
        results.forEach((result, index) => {
          if (result.updated) next[markets[index]] = result.dataset;
        });
        return next;
      });

      const remoteCount = results.filter(result => result.updated).length;
      setSyncMessage(remoteCount === markets.length
        ? 'Live data API connected and datasets validated.'
        : 'Live data API unavailable; showing bundled snapshots.');
    };

    void syncDatasets();
    return () => { cancelled = true; };
  }, []);

  // Operator keyboard shortcut (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (adminConsoleEnabled && (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminConsoleEnabled]);

  // Compute quantitative models for the selected market with deterministic cross-device PRNG
  const digitStats = useMemo(() => calculateDigitStatistics(draws), [draws]);
  const markovStates = useMemo(() => calculateMarkovTransitions(draws), [draws]);
  const simulationSeed = `${activeMarket}-${latestDraw?.date || '2026-09-16'}-${monteCarloRuns}`;
  const monteCarlo = useMemo(
    () => runMonteCarloSimulation(digitStats, monteCarloRuns, simulationSeed),
    [digitStats, monteCarloRuns, simulationSeed]
  );
  const threeDigitCandidates = useMemo(() => runThreeDigitSimulation(draws), [draws]);

  const handleRerunMonteCarlo = (iterations: number) => {
    setMonteCarloRuns(iterations);
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text flex flex-col terminal-grid">
      {/* Navbar & Live Ticker */}
      <TerminalNavbar
        activeMarket={activeMarket}
        onSelectMarket={setActiveMarket}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAdminConsole={adminConsoleEnabled ? () => setIsAdminOpen(true) : undefined}
        t={t}
      />

      {/* Main Terminal Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <div className="mb-4 text-[11px] font-mono text-slate-500" role="status">
          DATA SOURCE: {syncMessage}
        </div>
        {/* Real-time Draw Tomorrow Banner Alert */}
        <DrawTomorrowAlert
          market={activeMarket}
          t={t}
          onJumpToEngine={() => {
            setActiveTab('TERMINAL');
            window.scrollTo({ top: 480, behavior: 'smooth' });
          }}
        />

        {/* Multi-Market Upcoming Event Radar Timeline (Today & Tomorrow) */}
        <EventTimelineRadar
          activeMarket={activeMarket}
          onSelectMarket={setActiveMarket}
          onJumpToEngine={() => {
            setActiveTab('TERMINAL');
            window.scrollTo({ top: 480, behavior: 'smooth' });
          }}
          t={t}
        />

        {/* Market Stats & Countdown Header */}
        <MarketStatsHeader
          market={activeMarket}
          latestDraw={latestDraw}
          entropyScore={monteCarlo.entropyScore}
          t={t}
        />

        {/* Dynamic Views */}
        {activeTab === 'TERMINAL' && (
          <div className="space-y-6">
            <QuantEnginesView
              stats={digitStats}
              monteCarlo={monteCarlo}
              markovStates={markovStates}
              threeDigitCandidates={threeDigitCandidates}
              dimensionMode={dimensionMode}
              onSelectDimensionMode={setDimensionMode}
              onRerunMonteCarlo={handleRerunMonteCarlo}
              t={t}
            />

            {/* Teaser Heatmap below Terminal */}
            <div className="mt-8">
              <ProbabilityHeatmap stats={digitStats} t={t} />
            </div>
          </div>
        )}

        {activeTab === 'HEATMAP' && (
          <ProbabilityHeatmap stats={digitStats} t={t} />
        )}

        {activeTab === 'WAR_ROOM' && (
          <LiveWarRoom market={activeMarket} t={t} />
        )}

        {activeTab === 'PROOF' && (
          <ProofOfAlgorithm t={t} market={activeMarket} />
        )}

        {/* Monetization & Platform Acquisition Slot */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Real sponsor banner: renders nothing when there is no active campaign */}
          <div className="md:col-span-2">
            <BannerAd market={activeMarket} slot="TOP_BANNER" />
          </div>

          {/* LINE OA Acquisition Widget */}
          {LINE_OA_URL && (
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bell className="w-5 h-5 animate-pulse" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-mono font-bold text-emerald-400 truncate">
                    {t.lineBotTitle}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {t.lineBotDesc}
                  </p>
                </div>
              </div>
              <a
                href={LINE_OA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all shrink-0 whitespace-nowrap"
              >
                {t.lineBotBtn}
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-terminal-border bg-terminal-card/80 py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>{t.footerTitle}</span>
          </div>
          <p className="text-[11px] text-slate-600 max-w-xl">
            {t.footerDisclaimer}
          </p>
          <div className="text-cyan-400 font-bold shrink-0">
            {t.footerZeroCustomers}
          </div>
        </div>
      </footer>

      {/* Video Guide Onboarding Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        t={t}
      />

      {/* Secret Operator Console Modal */}
      <AdminConsoleModal
        isOpen={adminConsoleEnabled && isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        activeMarket={activeMarket}
      />
    </div>
  );
};
