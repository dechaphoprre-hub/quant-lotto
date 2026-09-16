import React, { useState } from 'react';
import { DrawRecord } from '../types';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareResultProps {
  draw: DrawRecord;
  marketLabel: string;
}

const SITE_URL = 'https://dechaphoprre-hub.github.io/quant-lotto/';
const canUseNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

/**
 * Real sharing only: Web Share API and LINE's public share intent both
 * work without any API key or account, and just hand off to whatever
 * app the visitor already uses. No fabricated share/view counters here.
 */
export const ShareResult: React.FC<ShareResultProps> = ({ draw, marketLabel }) => {
  const [copied, setCopied] = useState(false);
  const shareText = `ผลรางวัล ${marketLabel} งวด ${draw.date}: ${draw.topPrize} (2 ตัวล่าง ${draw.twoDigitBottom}) — เช็คสถิติย้อนหลังที่ QuantLotto`;

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: 'QuantLotto', text: shareText, url: SITE_URL });
    } catch {
      // Cancelled by the user; nothing to report.
    }
  };

  const handleLineShare = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=500,height=600');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${SITE_URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; nothing to report.
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {canUseNativeShare && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-mono text-slate-300 transition-colors"
          title="แชร์"
        >
          <Share2 className="w-3 h-3" />
        </button>
      )}
      <button
        onClick={handleLineShare}
        className="flex items-center gap-1 px-2 py-1 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800/40 rounded text-[10px] font-mono font-bold text-emerald-300 transition-colors"
        title="แชร์ไปยัง LINE"
      >
        LINE
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-mono text-slate-300 transition-colors"
        title="คัดลอกลิงก์"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
};
