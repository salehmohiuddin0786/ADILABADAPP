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
        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm duration-300 shrink-0">
            {getCategoryIcon(category.icon, 'w-6 h-6')}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition text-sm sm:text-base leading-tight">
              {category.name}
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              {category.advertisements_count || 0} advertisements
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-brand-50 text-slate-400 group-hover:text-brand-600 flex items-center justify-center transition shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
}
