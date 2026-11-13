import React from 'react';
import Head from 'next/head';
import { Globe, CheckCircle2 } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { useLanguage } from '../../src/shared/contexts/LanguageContext';
import { useToast } from '../../src/context/ToastContext';

export default function CustomerLanguagePage() {
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  const { addToast } = useToast();

  const handleSelect = (code) => {
    setLanguage(code);
    addToast(`App language switched to ${code.toUpperCase()}`, 'success');
  };

  return (
    <CustomerLayout title="Language Preferences">
      <Head>
        <title>Language — Customer Hub</title>
      </Head>

      <div className="space-y-6 max-w-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Select Interface Language</h2>
          <p className="text-xs text-slate-500 mt-0.5">Choose your preferred reading language for menus and descriptions.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
          {(Array.isArray(supportedLanguages) ? supportedLanguages : []).map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                currentLanguage === lang.code
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <span className="font-bold text-slate-900 text-sm block">{lang.name}</span>
                <span className="text-xs text-slate-500 block">{lang.label}</span>
              </div>
              {currentLanguage === lang.code && (
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              )}
            </button>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
