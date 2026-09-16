import React, { useState, useEffect, useCallback } from 'react';
import { MarketType } from '../types';
import { AdminSession, AdminRole, signIn, signOut, fetchAdminRole } from '../services/authService';
import { DrawCorrectionView, submitCorrection, fetchPendingCorrections, reviewCorrection } from '../services/correctionsService';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, KeyRound, PlusCircle, LogOut, ClipboardCheck } from 'lucide-react';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMarket: MarketType;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({ isOpen, onClose, activeMarket }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formTopPrize, setFormTopPrize] = useState('');
  const [formBottomTwo, setFormBottomTwo] = useState('');
  const [formFrontThree, setFormFrontThree] = useState('');
  const [formBackThree, setFormBackThree] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [pending, setPending] = useState<DrawCorrectionView[]>([]);

  const loadPending = useCallback(async (activeSession: AdminSession) => {
    setPending(await fetchPendingCorrections(activeSession));
  }, []);

  useEffect(() => {
    if (session && role) void loadPending(session);
  }, [session, role, loadPending]);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    const result = await signIn(email, password);
    setAuthLoading(false);
    if ('error' in result) {
      setAuthError(result.error);
      return;
    }
    setSession(result.session);
    setRole(await fetchAdminRole(result.session));
  };

  const handleSignOut = async () => {
    if (session) await signOut(session);
    setSession(null);
    setRole(null);
    setPending([]);
    setEmail('');
    setPassword('');
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!session) return;

    const topPrize = formTopPrize.trim();
    const twoDigitBottom = formBottomTwo.trim();
    if (!topPrize || !twoDigitBottom || !formReason.trim()) {
      setFormError('Top prize, 2-digit bottom, and a reason are all required.');
      return;
    }

    const result = await submitCorrection(session, {
      marketCode: activeMarket,
      drawDate: formDate,
      drawNumber: `Manual ${formDate}`,
      topPrize,
      twoDigitTop: topPrize.slice(-2),
      twoDigitBottom,
      threeDigitTop: topPrize.slice(-3),
      threeDigitFront: formFrontThree ? formFrontThree.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      threeDigitBack: formBackThree ? formBackThree.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      reason: formReason.trim()
    });

    if (result.success) {
      setFormSuccess('Correction submitted for admin review. It will not appear on the public site until approved.');
      setFormTopPrize('');
      setFormBottomTwo('');
      setFormFrontThree('');
      setFormBackThree('');
      setFormReason('');
      void loadPending(session);
    } else {
      setFormError(result.error);
    }
  };

  const handleReview = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    if (!session) return;
    setFormError(null);
    const result = await reviewCorrection(session, id, decision);
    if (result.success) {
      setFormSuccess(`Correction ${decision.toLowerCase()}.`);
      void loadPending(session);
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-terminal-card border border-terminal-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="flex items-center justify-between p-5 border-b border-terminal-border bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                <span>OPERATOR CONTROL CONSOLE</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                ยืนยันตัวตนจริงผ่าน Supabase Auth ทุกการแก้ไขต้องผ่านการอนุมัติจาก Admin คนอื่นก่อนเผยแพร่
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!session ? (
          <div className="p-8 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white font-mono mb-2 text-center">เข้าสู่ระบบเจ้าหน้าที่</h3>
            <form onSubmit={handleSignIn} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="EMAIL"
                className="w-full bg-slate-900 border border-terminal-border rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
                autoFocus
                required
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full bg-slate-900 border border-terminal-border rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
                required
              />
              {authError && (
                <div className="text-xs font-mono text-red-400 flex items-center justify-center space-x-1">
                  <AlertTriangle className="w-4 h-4 mr-1 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all"
              >
                {authLoading ? 'กำลังเข้าสู่ระบบ...' : 'SIGN IN'}
              </button>
            </form>
          </div>
        ) : role === null ? (
          <div className="p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-white font-mono mb-1">บัญชียืนยันแล้ว แต่ยังไม่ได้รับสิทธิ์</p>
            <p className="text-xs text-slate-400 mb-4">ให้ผู้ดูแลระบบเพิ่มสิทธิ์ในตาราง admin_roles ก่อนใช้งานส่วนนี้ ({session.email})</p>
            <button onClick={handleSignOut} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-mono text-slate-300">
              SIGN OUT
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-slate-400">
                {session.email} · <span className="text-cyan-400">{role}</span>
              </div>
              <button onClick={handleSignOut} className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-white">
                <LogOut className="w-3.5 h-3.5" />
                <span>SIGN OUT</span>
              </button>
            </div>

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

            {/* Submit a correction (requires a second admin's approval before it goes live) */}
            <div className="bg-slate-900/50 border border-terminal-border rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-terminal-border">
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">เสนอแก้ไขผลรางวัล ({activeMarket}) — ต้องรออนุมัติ</span>
              </div>
              <form onSubmit={handleSubmitCorrection} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">วันที่ออกรางวัล</label>
                    <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)}
                      className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500" required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">รางวัลที่ 1</label>
                    <input type="text" maxLength={6} value={formTopPrize} onChange={e => setFormTopPrize(e.target.value)}
                      className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 font-bold" required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">2 ตัวล่าง</label>
                    <input type="text" maxLength={2} value={formBottomTwo} onChange={e => setFormBottomTwo(e.target.value)}
                      className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 font-bold" required />
                  </div>
                </div>
                {activeMarket === 'THAI' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="3 ตัวหน้า เช่น 264, 591" value={formFrontThree} onChange={e => setFormFrontThree(e.target.value)}
                      className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500" />
                    <input type="text" placeholder="3 ตัวท้าย เช่น 120, 835" value={formBackThree} onChange={e => setFormBackThree(e.target.value)}
                      className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                )}
                <textarea
                  placeholder="เหตุผลที่ต้องแก้ไขด้วยมือ (เช่น GLO API ล่ม อ้างอิงแหล่งที่มา)"
                  value={formReason}
                  onChange={e => setFormReason(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-terminal-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  required
                />
                <button type="submit" className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold font-mono text-xs rounded-lg transition-all">
                  ส่งคำขอแก้ไข (SUBMIT FOR REVIEW)
                </button>
              </form>
            </div>

            {/* Admin review queue */}
            {role === 'ADMIN' && (
              <div className="bg-slate-900/50 border border-terminal-border rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-terminal-border">
                  <ClipboardCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase">รออนุมัติ ({pending.length})</span>
                </div>
                {pending.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono">ไม่มีคำขอค้างอนุมัติ</p>
                ) : (
                  <div className="space-y-2">
                    {pending.map(item => {
                      const isOwn = item.submittedBy === session.userId;
                      return (
                        <div key={item.id} className="bg-slate-950 border border-terminal-border rounded-lg p-3 text-xs font-mono">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-bold">{item.marketCode} · {item.drawDate}</span>
                            <span className="text-slate-500">{item.topPrize} / {item.twoDigitBottom}</span>
                          </div>
                          <p className="text-slate-400 mb-2">{item.reason}</p>
                          {isOwn ? (
                            <span className="text-[10px] text-amber-400">รอ Admin คนอื่นอนุมัติ (คุณอนุมัติคำขอของตัวเองไม่ได้)</span>
                          ) : (
                            <div className="flex gap-2">
                              <button onClick={() => handleReview(item.id, 'APPROVED')} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-bold">APPROVE</button>
                              <button onClick={() => handleReview(item.id, 'REJECTED')} className="px-3 py-1 bg-red-900 hover:bg-red-800 rounded text-red-200 font-bold">REJECT</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
