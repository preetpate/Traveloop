/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark glassmorphism theme
        background: '#0B1020',
        card: '#121A2F',
        primary: '#3B82F6',
        secondary: '#94A3B8',
        accent: '#8B5CF6',
        'text-primary': '#F8FAFC',
        'text-secondary': '#94A3B8',
        'text-muted': '#64748B',
        border: '#1E293B',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.3)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
};
