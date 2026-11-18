import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare } from 'lucide-react';

export default function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    if (typeof window === 'undefined') return;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      return; // Already running as an installed PWA
    }

    // Check if user dismissed recently
    const dismissedAt = localStorage.getItem('adilabad_pwa_dismissed');
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < 5) return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Listen for Chrome/Edge/Android beforeinstallprompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // On iOS Safari, show prompt after 4 seconds
    if (isAppleDevice && !isStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    try {
      localStorage.setItem('adilabad_pwa_dismissed', Date.now().toString());
    } catch {}
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Floating Bottom App Installation Bar on Mobile */}
      <div className="fixed bottom-16 md:bottom-5 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="bg-slate-900/95 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shrink-0 shadow-md">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white tracking-tight">Adilabad App</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">
                  Install
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                Install as mobile app for fastest access & offline mode
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-xs font-black shadow-md shadow-brand-500/30 flex items-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss install prompt"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-brand-400" />
                <h3 className="font-black text-base">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              To install <strong>Adilabad App</strong> on your home screen via Safari:
            </p>

            <ol className="text-xs text-slate-200 space-y-2.5">
              <li className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">1</span>
                <span>Tap the <strong>Share</strong> button <Share className="w-4 h-4 inline text-brand-400 mx-1" /> at the bottom of Safari.</span>
              </li>
              <li className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">2</span>
                <span>Scroll down and select <strong>Add to Home Screen</strong> <PlusSquare className="w-4 h-4 inline text-emerald-400 mx-1" />.</span>
              </li>
              <li className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">3</span>
                <span>Tap <strong>Add</strong> in the top-right corner.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-md transition"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
