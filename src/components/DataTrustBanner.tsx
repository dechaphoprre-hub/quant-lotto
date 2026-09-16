import React from 'react';
import { DrawRecord } from '../types';
import { Translations } from '../i18n/translations';
import { AlertTriangle, FlaskConical } from 'lucide-react';

interface DataTrustBannerProps {
  latestDraw: DrawRecord;
  t: Translations;
}

/**
 * Every market's data carries a real trust level (see DrawRecord.verificationStatus).
 * This surfaces it honestly instead of letting demo or third-party-referenced
 * numbers look as trustworthy as an officially verified draw.
 */
export const DataTrustBanner: React.FC<DataTrustBannerProps> = ({ latestDraw, t }) => {
  const status = latestDraw.verificationStatus ?? 'DEMO';
  if (status === 'VERIFIED') return null;

  const isDemo = status === 'DEMO';

  return (
    <div className={`flex items-start gap-2 rounded-lg p-3 mb-4 text-xs font-mono border ${
      isDemo ? 'bg-red-950/30 border-red-900/50 text-red-200' : 'bg-amber-950/30 border-amber-900/50 text-amber-200'
    }`}>
      {isDemo ? <FlaskConical className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
      <div>
        <div className="font-bold">{isDemo ? t.trustDemoTitle : t.trustPendingTitle}</div>
        <div className="opacity-90">{isDemo ? t.trustDemoDesc : t.trustPendingDesc}</div>
      </div>
    </div>
  );
};
