import React, { useState } from 'react';
import { MarketType, DrawRecord } from '../types';
import { LotteryStorageService } from '../services/storageService';
import { validateDrawRecord } from '../services/dataValidator';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, KeyRound, Database, PlusCircle, RotateCcw, Download, Upload, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMarket: MarketType;
  currentDataset: DrawRecord[];
  onDatasetUpdated: (updated: DrawRecord[]) => void;
  factoryDefaultDataset: DrawRecord[];
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  onClose,
  activeMarket,
  currentDataset,
  onDatasetUpdated,
  factoryDefaultDataset
}) => {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Form State for Quick Draw Add
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formTopPrize, setFormTopPrize] = useState('');
  const [formBottomTwo, setFormBottomTwo] = useState('');
  const [formFrontThree, setFormFrontThree] = useState('');
  const [formBackThree, setFormBackThree] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Import State
  const [importJson, setImportJson] = useState('');
  const [showImport, setShowImport] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Owner PIN: 1689
    if (pin === '1689') {
      setIsAuthorized(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Auto-derive 2D and 3D from top prize
    const topPrize = formTopPrize.trim();
    const twoDigitBottom = formBottomTwo.trim();

    if (!topPrize || !twoDigitBottom) {
      setFormError('Please provide both Top Prize and 2-Digit Bottom numbers.');
      return;
    }

    const twoDigitTop = topPrize.slice(-2);
    const threeDigitTop = topPrize.slice(-3);

    // Front/Back 3D for Thai
    const frontThree = formFrontThree
      ? formFrontThree.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;
    const backThree = formBackThree
      ? formBackThree.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    // Derive draw label
    const dateObj = new Date(formDate);
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const dayOfWeekTh = days[dateObj.getDay()] || 'จันทร์';
    const drawNumber = `งวด ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${(dateObj.getFullYear() + 543) % 100}`;

    const newDraw: DrawRecord = {
      id: `${activeMarket.toLowerCase()}-${formDate}`,
      market: activeMarket,
      date: formDate,
      dayOfWeekTh,
      drawNumber,
      topPrize,
      twoDigitTop,
      twoDigitBottom,
      threeDigitTop,
      threeDigitFront: frontThree,
      threeDigitBack: backThree
    };

    const validation = validateDrawRecord(newDraw);
    if (!validation.isValid) {
      setFormError(validation.errors.join(' | '));
      return;
    }

    const result = LotteryStorageService.addNewDraw(activeMarket, newDraw, currentDataset);
    if (result.success) {
      onDatasetUpdated(result.updatedDataset);
      setFormSuccess(`Successfully registered Draw on ${formDate}! All engines updated.`);
      setFormTopPrize('');
      setFormBottomTwo('');
      setFormFrontThree('');
      setFormBackThree('');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } else {
      setFormError(result.errors?.join(' | ') || 'Failed to save draw record.');
    }
  };

  const handleReset = () => {
    if (window.confirm(`Are you sure you want to reset ${activeMarket} back to Factory Master defaults?`)) {
      const reset = LotteryStorageService.resetMarketData(activeMarket, factoryDefaultDataset);
      onDatasetUpdated(reset);
      setFormSuccess(`Reset ${activeMarket} to factory defaults.`);
    }
  };

  const handleExport = () => {
    const backupStr = LotteryStorageService.exportBackup();
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantlotto_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importJson.trim()) return;
    const res = LotteryStorageService.importBackup(importJson);
    if (res.success) {
      const refreshed = LotteryStorageService.loadMarketData(activeMarket, factoryDefaultDataset);
      onDatasetUpdated(refreshed);
      setFormSuccess('Backup restored successfully!');
      setShowImport(false);
      setImportJson('');
    } else {
      setFormError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-terminal-card border border-terminal-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-terminal-border bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                <span>OPERATOR CONTROL CONSOLE</span>
                <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded font-mono">
                  LEVEL 1 ROOT
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                ห้องควบคุมฉุกเฉินสำหรับเจ้าของระบบ: ตรวจสอบและอัปเดตผลรางวัลทันที (Zero Lag)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Authorization Screen */}
        {!isAuthorized ? (
          <div className="p-8 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white font-mono mb-2">เจ้าหน้าที่ระบบ (Security Clearance)</h3>
            <p className="text-xs text-slate-400 font-mono mb-6">
              กรุณากรอกรหัส PIN ประจำตัวเพื่อเข้าสู่ระบบควบคุมหลังบ้าน (Default PIN: 1689)
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="ENTER PIN CODE"
                className="w-full text-center tracking-widest text-xl font-mono font-bold bg-slate-900 border border-terminal-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                autoFocus
              />

              {pinError && (
                <div className="text-xs font-mono text-red-400 flex items-center justify-center space-x-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span>รหัสผ่านไม่ถูกต้อง (Invalid PIN)</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
              >
                ยืนยันรหัสผ่าน (AUTHORIZE)
              </button>
            </form>
          </div>
        ) : (
          /* Authorized Admin Workspace */
          <div className="p-6 space-y-6">
            {/* Status Metric Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-900/80 border border-terminal-border rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400">ACTIVE MARKET</div>
                <div className="text-sm font-bold font-mono text-cyan-400">{activeMarket}</div>
              </div>
              <div className="bg-slate-900/80 border border-terminal-border rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400">VERIFIED DRAWS</div>
                <div className="text-sm font-bold font-mono text-emerald-400">{currentDataset.length} งวด</div>
              </div>
              <div className="bg-slate-900/80 border border-terminal-border rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400">LATEST RECORD</div>
                <div className="text-sm font-bold font-mono text-purple-400">{currentDataset[0]?.date || 'N/A'}</div>
              </div>
            </div>

            {/* Notifications */}
            {formSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs font-mono text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-xs font-mono text-red-300 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* 1-Click Quick Add Form */}
            <div className="bg-slate-900/50 border border-terminal-border rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-terminal-border">
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  บันทึกผลงวดใหม่ด่วน (1-Click Instant Draw Update)
                </span>
              </div>

              <form onSubmit={handleQuickAdd} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">วันที่ออกรางวัล (Date)</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      รางวัลที่ 1 ({activeMarket === 'THAI' ? '6 หลัก' : activeMarket === 'LAO' ? '4 หลัก' : '5 หลัก'})
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder={activeMarket === 'THAI' ? '818894' : activeMarket === 'LAO' ? '9284' : '84931'}
                      value={formTopPrize}
                      onChange={e => setFormTopPrize(e.target.value)}
                      className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 font-bold tracking-wider"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">2 ตัวล่าง (2 หลัก)</label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="63"
                      value={formBottomTwo}
                      onChange={e => setFormBottomTwo(e.target.value)}
                      className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 font-bold tracking-wider"
                      required
                    />
                  </div>
                </div>

                {/* Additional 3D Front & Back for Thai Lotto */}
                {activeMarket === 'THAI' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-terminal-border/60">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">3 ตัวหน้า (คั่นด้วยจุลภาค เช่น 264, 591)</label>
                      <input
                        type="text"
                        placeholder="264, 591"
                        value={formFrontThree}
                        onChange={e => setFormFrontThree(e.target.value)}
                        className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">3 ตัวท้าย (คั่นด้วยจุลภาค เช่น 120, 835)</label>
                      <input
                        type="text"
                        placeholder="120, 835"
                        value={formBackThree}
                        onChange={e => setFormBackThree(e.target.value)}
                        className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold font-mono text-xs rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  บันทึก & คำนวณโมเดลใหม่ทันที (SAVE & RECALCULATE ENGINES)
                </button>
              </form>
            </div>

            {/* Utility Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-terminal-border justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-terminal-border hover:border-slate-600 rounded-lg text-xs font-mono text-slate-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT BACKUP</span>
                </button>
                <button
                  onClick={() => setShowImport(!showImport)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-terminal-border hover:border-slate-600 rounded-lg text-xs font-mono text-slate-300 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>RESTORE BACKUP</span>
                </button>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-950/40 border border-red-800/40 hover:bg-red-900/60 rounded-lg text-xs font-mono text-red-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET TO FACTORY</span>
              </button>
            </div>

            {/* Import Backup Box */}
            {showImport && (
              <div className="bg-slate-950 border border-terminal-border rounded-xl p-3 space-y-2">
                <label className="block text-[11px] font-mono text-slate-400">Paste JSON Backup Content:</label>
                <textarea
                  rows={4}
                  value={importJson}
                  onChange={e => setImportJson(e.target.value)}
                  className="w-full bg-slate-900 border border-terminal-border rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none"
                  placeholder='{"version": "v2_", "data": {...}}'
                />
                <button
                  onClick={handleImportSubmit}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-mono text-xs font-bold"
                >
                  Apply Backup
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
