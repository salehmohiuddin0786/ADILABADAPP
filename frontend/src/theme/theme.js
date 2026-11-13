/**
 * ADILABAD APP — JAVASCRIPT THEME TOKENS
 * Exported for Tailwind CSS, Mantine Provider, and JavaScript dynamic calculations.
 * Strict Rule: Changing tokens here and in colors.css propagates across all 5 panels.
 */

export const theme = {
  colors: {
    brand: {
      primary: '#14532D',      // Deep Emerald Green
      primaryHover: '#0F3F22',
      primaryLight: '#166534',
      primarySubtle: '#F0FDF4',
      secondary: '#16A34A',    // Fresh Green
      secondaryHover: '#15803D',
      secondaryLight: '#4ADE80',
      secondarySubtle: '#DCFCE7',
      gold: '#EAB308',         // Warm Gold Accent
      goldHover: '#CA8A04',
      goldSubtle: '#FEF9C3'
    },
    ui: {
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceMuted: '#F1F5F9',
      textMain: '#0F172A',
      textSecondary: '#64748B',
      textMuted: '#94A3B8',
      borderDefault: '#E2E8F0',
      borderStrong: '#CBD5E1'
    },
    status: {
      success: '#15803D',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#2563EB'
    }
  },
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  typography: {
    fontSans: "'Inter', system-ui, -apple-system, sans-serif",
    fontDisplay: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace"
  }
};

export default theme;
