/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./layouts/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          'primary-hover': 'var(--brand-primary-hover)',
          'primary-light': 'var(--brand-primary-light)',
          'primary-subtle': 'var(--brand-primary-subtle)',
          secondary: 'var(--brand-secondary)',
          'secondary-hover': 'var(--brand-secondary-hover)',
          'secondary-light': 'var(--brand-secondary-light)',
          'secondary-subtle': 'var(--brand-secondary-subtle)',
          gold: 'var(--accent-gold)',
          'gold-hover': 'var(--accent-gold-hover)',
          'gold-subtle': 'var(--accent-gold-subtle)',
          // Backward-compatible scale mapped to deep emerald & fresh green
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        surface: {
          app: 'var(--bg-app)',
          DEFAULT: 'var(--bg-surface)',
          muted: 'var(--bg-surface-muted)',
          glass: 'var(--bg-surface-glass)'
        },
        content: {
          main: 'var(--text-main)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)'
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'hover': '0 12px 30px -5px rgba(20, 83, 45, 0.15)',
        'emerald': '0 10px 25px -5px rgba(20, 83, 45, 0.25)',
        'gold': '0 10px 25px -5px rgba(234, 179, 8, 0.25)'
      }
    },
  },
  plugins: [],
}
