import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, X, Copy, Check, MessageCircle, Twitter, Facebook } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/api';

export default function ShareModal({ isOpen, onClose, title, slug, id, type = 'advertisement' }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/${type === 'business' ? 'businesses' : type === 'event' ? 'events' : 'advertisements'}/${slug}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('Link copied to clipboard!', 'success');
    if (id && type === 'advertisement') {
      apiFetch(`/advertisements/${id}/click`, {
        method: 'POST',
        body: JSON.stringify({ type: 'share' })
      }).catch(() => {});
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(`${title} on Adilabad App — Discover Local`);
  const shareUrl = encodeURIComponent(url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Share with Friends</h3>
            <p className="text-xs text-slate-500">Spread the word across Adilabad</p>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleCopy()}
            className="p-3 rounded-2xl bg-green-50 hover:bg-green-100 text-green-700 flex flex-col items-center justify-center gap-1.5 transition text-xs font-semibold"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleCopy()}
            className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex flex-col items-center justify-center gap-1.5 transition text-xs font-semibold"
          >
            <Facebook className="w-5 h-5" />
            <span>Facebook</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleCopy()}
            className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-600 flex flex-col items-center justify-center gap-1.5 transition text-xs font-semibold"
          >
            <Twitter className="w-5 h-5" />
            <span>Twitter/X</span>
          </a>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 p-1.5 pl-3.5 rounded-xl border border-slate-200 bg-slate-50">
          <span className="text-xs text-slate-600 truncate flex-1 font-mono">{url}</span>
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
