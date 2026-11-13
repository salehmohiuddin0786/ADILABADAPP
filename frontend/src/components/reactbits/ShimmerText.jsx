import React from 'react';
import { motion } from 'framer-motion';

export function ShimmerText({ text, className = '' }) {
  return (
    <span className={`relative inline-block overflow-hidden font-extrabold ${className}`}>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary via-accent-gold to-brand-primary animate-shimmer">
        {text}
      </span>
    </span>
  );
}

export default ShimmerText;
