import React from 'react';
import { MarketType } from '../types';
import { fetchActiveBanner, AdCampaignView } from '../services/adService';

interface BannerAdProps {
  market: MarketType;
  slot: 'TOP_BANNER' | 'INLINE' | 'SIDEBAR' | 'FOOTER';
}

/**
 * Renders a real, currently-active sponsor banner from Supabase, or
 * nothing at all. There is no placeholder, no revenue estimate, and no
 * content shown when there is no paying sponsor for this slot.
 */
export const BannerAd: React.FC<BannerAdProps> = ({ market, slot }) => {
  const [campaign, setCampaign] = React.useState<AdCampaignView | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetchActiveBanner(market, slot).then(result => {
      if (!cancelled) setCampaign(result);
    });
    return () => { cancelled = true; };
  }, [market, slot]);

  if (!campaign) return null;

  return (
    <a
      href={campaign.targetUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block bg-terminal-card border border-terminal-border rounded-xl overflow-hidden hover:border-cyan-500/40 transition-colors"
    >
      <div className="relative">
        <span className="absolute top-2 left-2 z-10 text-[9px] font-mono font-bold uppercase bg-slate-950/80 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded">
          {campaign.label}
        </span>
        <img
          src={campaign.imageUrl}
          alt={campaign.name}
          className="w-full h-auto max-h-28 object-cover"
          loading="lazy"
        />
      </div>
    </a>
  );
};
