import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SearchX, ArrowRight } from 'lucide-react';
import { scaleUp } from '../../shared/animations/motionPresets';

export default function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search terms or filter criteria.',
  actionLabel = 'Reset Filters',
  actionHref,
  onAction
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleUp}
      className="py-16 px-4 text-center flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-sm"
      >
        <SearchX className="w-8 h-8" />
      </motion.div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>

      {actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : null}
    </motion.div>
  );
}
