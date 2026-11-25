import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeInUp } from '../../shared/animations/motionPresets';

export default function AnimatedSection({
  children,
  className = '',
  variants = fadeInUp,
  delay = 0,
  duration = 0.35,
  amount = 0.1,
  once = true
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      custom={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
