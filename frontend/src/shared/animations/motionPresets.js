/**
 * Adilabad App - Central Motion & Animation System
 * Powered by Framer Motion (Motion for React)
 * Respects prefers-reduced-motion and prioritizes high-performance CSS transforms & opacity.
 */

export const MOTION_DURATION = {
  fast: 0.18,
  normal: 0.28,
  page: 0.32,
  slow: 0.45
};

export const MOTION_EASE = {
  easeOut: [0.16, 1, 0.3, 1], // snappy & natural
  easeInOut: [0.4, 0, 0.2, 1], // standard material/smooth
  anticipate: [0.36, 0, 0.66, -0.56],
  bounce: [0.34, 1.56, 0.64, 1]
};

// 1. PAGE TRANSITIONS (250–350ms, subtle movement & opacity)
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 10
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.page,
      ease: MOTION_EASE.easeOut,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: MOTION_EASE.easeInOut
    }
  }
};

// 2. FADE-IN & VIEWPORT SCROLL ANIMATIONS
export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration || MOTION_DURATION.normal,
      delay: custom.delay || 0,
      ease: MOTION_EASE.easeOut
    }
  })
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      duration: custom.duration || MOTION_DURATION.normal,
      delay: custom.delay || 0,
      ease: MOTION_EASE.easeOut
    }
  })
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: custom.duration || MOTION_DURATION.normal,
      delay: custom.delay || 0,
      ease: MOTION_EASE.easeOut
    }
  })
};

// 3. STAGGER CONTAINERS FOR LISTS & GRIDS
export const staggerContainer = (staggerDelay = 0.05, delayChildren = 0.02) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren
    }
  }
});

// 4. CARD & INTERACTIVE ITEM HOVER
export const cardHover = {
  rest: { y: 0, transition: { duration: 0.2, ease: MOTION_EASE.easeOut } },
  hover: {
    y: -4,
    transition: { duration: 0.22, ease: MOTION_EASE.easeOut }
  },
  tap: {
    scale: 0.985,
    transition: { duration: 0.1 }
  }
};

export const buttonTap = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.15, ease: MOTION_EASE.easeOut }
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1 }
  }
};

// 5. MODAL & DROPDOWN TRANSITIONS
export const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.24, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeIn' }
  }
};

export const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: MOTION_EASE.easeOut }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.18, ease: 'easeIn' }
  }
};

export const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.18, ease: MOTION_EASE.easeOut }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: { duration: 0.14, ease: 'easeIn' }
  }
};

// 6. DASHBOARD METRICS & STATS PULSE
export const statWidgetVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.35,
      ease: MOTION_EASE.easeOut
    }
  })
};

// 7. SKELETON SHIMMER (Accessible & light)
export const shimmerAnimation = {
  initial: { backgroundPosition: '-200% 0' },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear'
    }
  }
};
