import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCategoryIcon } from '../../utils/iconMap';
import { ChevronRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex items-center justify-between group"
      >
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm duration-300 shrink-0">
            {getCategoryIcon(category.icon, 'w-5 h-5 sm:w-6 sm:h-6')}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition text-xs sm:text-base leading-tight truncate">
              {category.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-medium truncate">
              {category.advertisements_count || 0} ads
            </p>
          </div>
        </div>

        <div className="hidden sm:flex w-8 h-8 rounded-full bg-slate-50 group-hover:bg-brand-50 text-slate-400 group-hover:text-brand-600 items-center justify-center transition shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
}
