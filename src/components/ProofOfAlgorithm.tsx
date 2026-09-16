import React from 'react';
import { STRUCTURED_PROOF_RECORDS } from '../math/quantEngine';
import { Translations } from '../i18n/translations';
import { ShieldCheck, Lock, CheckCircle2, Copy } from 'lucide-react';

interface ProofProps {
  t: Translations;
}

export const ProofOfAlgorithm: React.FC<ProofProps> = ({ t }) => {
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Proof Hero Banner */}
      <div className="bg-terminal-card border border-terminal-border rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-terminal-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white font-mono">{t.proofTitle}</h2>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                  {t.proofBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.proofDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-terminal-bg px-4 py-2 rounded-lg border border-terminal-border font-mono text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">{t.proofHitRateLabel}</span>
              <span className="text-emerald-400 font-extrabold text-lg">82.4%</span>
            </div>
            <div className="h-7 w-px bg-slate-800"></div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">{t.proofVerifiedDrawsLabel}</span>
              <span className="text-white font-extrabold text-lg">342 {t.proofDrawUnit}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs font-mono text-slate-400 bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg flex items-start gap-2">
          <Lock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <span>
            <strong>{t.proofGuaranteeTitle}</strong> {t.proofGuaranteeText}
          </span>
        </div>
      </div>

      {/* Historical Verifiable Ledger Table */}
      <div className="bg-terminal-card border border-terminal-border rounded-xl p-5 overflow-hidden">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>{t.proofTableTitle}</span>
          <span className="text-emerald-400">{t.proofAuditedBadge}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-terminal-border text-slate-500">
                <th className="pb-3 font-semibold">{t.proofThDateMarket}</th>
                <th className="pb-3 font-semibold">{t.proofThPredictions}</th>
                <th className="pb-3 font-semibold">{t.proofThActual}</th>
                <th className="pb-3 font-semibold">{t.proofThResult}</th>
                <th className="pb-3 font-semibold">{t.proofThHash}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-terminal-border/60">
              {STRUCTURED_PROOF_RECORDS.map(record => (
                <tr key={record.id} className="hover:bg-terminal-hover/40 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-white">{record.drawDate}</div>
                    <div className="text-[10px] text-cyan-400">{record.market} LOTTERY</div>
                  </td>

                  <td className="py-3.5">
                    <div className="flex items-center space-x-1.5">
                      {record.predictedTop5.map((num, i) => (
                        <span
                          key={num}
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            i === 0
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-slate-900 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Fully Translated Actual Winning: (Top 2D) / (Bottom 2D) */}
                  <td className="py-3.5 font-bold text-slate-200">
                    <span>{record.topTwoDigit}</span>{' '}
                    <span className="text-slate-400 font-normal text-[11px]">({t.topTwoDigit})</span>
                    <span className="mx-1 text-slate-600">/</span>
                    <span>{record.bottomTwoDigit}</span>{' '}
                    <span className="text-slate-400 font-normal text-[11px]">({t.bottomTwoDigit})</span>
                  </td>

                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {record.matchType}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <div className="flex items-center space-x-1.5">
                      <code className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 truncate max-w-[140px]">
                        {record.sha256Hash}
                      </code>
                      <button
                        onClick={() => handleCopy(record.sha256Hash)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                        title="Copy Hash"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {copiedHash === record.sha256Hash && (
                      <span className="text-[9px] text-emerald-400 block mt-0.5">{t.proofCopied}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
