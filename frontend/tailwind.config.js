/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#0f172a',
          900: '#0a0f1d',
          950: '#030712',
        },
        surface: {
          dark: '#0e1726',
          darker: '#090d16',
          card: '#111c30',
          border: '#1e293b',
          'border-subtle': '#182234',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
        'panel': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
