import React, { useState, useEffect } from 'react';
import { Translations } from '../i18n/translations';
import { X, Play, Pause, RotateCcw, ChevronRight, Video, Target, Flame, Radio } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, t }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentScene, setCurrentScene] = useState<1 | 2 | 3>(1);
  const [progress, setProgress] = useState(0);

  // Simulated video playback cycle
  useEffect(() => {
    let interval: any;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentScene(s => (s === 3 ? 1 : ((s + 1) as 1 | 2 | 3)));
            return 0;
          }
          return prev + 2;
        });
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-terminal-card border border-terminal-border rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden relative font-sans text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-terminal-border bg-terminal-bg/80">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">{t.guideTitle}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{t.guideSub}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-terminal-bg border border-terminal-border text-slate-400 hover:text-white hover:bg-terminal-hover transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Simulated Video Player Box */}
          <div className="relative aspect-video rounded-xl bg-slate-950 border border-terminal-border overflow-hidden shadow-2xl flex flex-col justify-between p-5 select-none">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-transparent to-purple-950/30 pointer-events-none"></div>

            {/* Video Top Controls */}
            <div className="flex items-center justify-between z-10 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                TUTORIAL DEMO // CHAPTER 0{currentScene}/03
              </span>
              <span className="text-slate-400 bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
                1080p HD // 60 FPS
              </span>
            </div>

            {/* Dynamic Simulated Video Screen */}
            <div className="my-auto text-center z-10 py-6">
              {currentScene === 1 && (
                <div className="animate-in zoom-in-95 duration-300 space-y-3">
                  <div className="inline-flex p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 mb-1">
                    <Target className="w-8 h-8 animate-bounce" />
                  </div>
                  <h4 className="text-xl font-bold font-mono text-white">{t.guideChapter1Title}</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    {t.guideChapter1Desc}
                  </p>
                  <div className="flex justify-center gap-2 pt-2">
                    {['94', '54', '77', '00', '23'].map((n, i) => (
                      <span key={n} className={`px-2.5 py-1 rounded font-mono font-bold text-sm ${i === 0 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {currentScene === 2 && (
                <div className="animate-in zoom-in-95 duration-300 space-y-3">
                  <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 mb-1">
                    <Flame className="w-8 h-8 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-bold font-mono text-white">{t.guideChapter2Title}</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    {t.guideChapter2Desc}
                  </p>
                </div>
              )}

              {currentScene === 3 && (
                <div className="animate-in zoom-in-95 duration-300 space-y-3">
                  <div className="inline-flex p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 mb-1">
                    <Radio className="w-8 h-8 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-bold font-mono text-white">{t.guideChapter3Title}</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    {t.guideChapter3Desc}
                  </p>
                </div>
              )}
            </div>

            {/* Video Bottom Timeline Controls */}
            <div className="space-y-2 z-10">
              {/* Progress Scrub Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-cyan-400 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-cyan-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setProgress(0);
                      setCurrentScene(1);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <span>00:{String(Math.floor((progress / 100) * 60)).padStart(2, '0')} / 01:00</span>
                </div>

                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map(sc => (
                    <button
                      key={sc}
                      onClick={() => {
                        setCurrentScene(sc as 1 | 2 | 3);
                        setProgress(0);
                      }}
                      className={`w-5 h-5 rounded text-[10px] font-bold ${
                        currentScene === sc
                          ? 'bg-cyan-500 text-slate-950 font-extrabold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3 Step Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              onClick={() => {
                setCurrentScene(1);
                setProgress(0);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                currentScene === 1
                  ? 'bg-cyan-950/50 border-cyan-500/80 shadow-md'
                  : 'bg-terminal-bg border-terminal-border hover:border-slate-600'
              }`}
            >
              <div className="font-mono text-xs font-bold text-cyan-400 mb-1">{t.step1Title}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{t.step1Desc}</p>
            </div>

            <div
              onClick={() => {
                setCurrentScene(2);
                setProgress(0);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                currentScene === 2
                  ? 'bg-purple-950/50 border-purple-500/80 shadow-md'
                  : 'bg-terminal-bg border-terminal-border hover:border-slate-600'
              }`}
            >
              <div className="font-mono text-xs font-bold text-purple-400 mb-1">{t.step2Title}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{t.step2Desc}</p>
            </div>

            <div
              onClick={() => {
                setCurrentScene(3);
                setProgress(0);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                currentScene === 3
                  ? 'bg-rose-950/50 border-rose-500/80 shadow-md'
                  : 'bg-terminal-bg border-terminal-border hover:border-slate-600'
              }`}
            >
              <div className="font-mono text-xs font-bold text-rose-400 mb-1">{t.step3Title}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{t.step3Desc}</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-extrabold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(0,242,254,0.25)] flex items-center justify-center space-x-2"
          >
            <span>{t.gotItBtn}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
