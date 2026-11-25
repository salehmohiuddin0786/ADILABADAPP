import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageVariants } from '../../shared/animations/motionPresets';

export function scrollPageToTop(behavior = 'instant') {
  if (typeof window === 'undefined') return;
  try {
    window.scrollTo({ top: 0, left: 0, behavior });
  } catch (e) {
    window.scrollTo(0, 0);
  }
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  const mainEl = document.querySelector('main');
  if (mainEl && mainEl.scrollTop > 0) mainEl.scrollTop = 0;
}

export default function PageTransition({ children, className = '', pageKey }) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    scrollPageToTop('instant');
    const raf = requestAnimationFrame(() => scrollPageToTop('instant'));
    return () => cancelAnimationFrame(raf);
  }, [pageKey]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      key={pageKey}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
