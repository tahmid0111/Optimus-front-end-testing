/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // M.C. DEAN Optimus brand — white base, deep blue accent
        blue: {
          DEFAULT: '#002B5C', // primary — deep blue
          hover: '#1464B4', // hover — brighter blue
          tint: '#DCEDFA', // light blue — soft background / badge tint
        },
        // card surfaces — the three brand-banner tones; sibling cards rotate
        card: {
          deep: '#C9DDF5', // deep blue
          light: '#DFF0FC', // light blue
          green: '#DFF4DB', // ambient green
        },
        ink: '#1A1A2E', // dark slate text
        // status palette
        status: {
          processing: '#F59E0B', // amber
          done: '#16A34A', // green
          failed: '#DC2626', // red
          queued: '#9CA3AF', // gray
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(26, 26, 46, 0.10)',
        lift: '0 12px 28px -6px rgba(0, 43, 92, 0.25)',
        card: '0 2px 10px -2px rgba(26, 26, 46, 0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-fast': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '60%': { opacity: '1', transform: 'scale(1.01)' },
          '100%': { transform: 'scale(1)' },
        },
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.6)', opacity: '0.45' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'bar-stripe': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 0' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-in-fast': 'fade-in-fast 0.25s ease-out both',
        'pop-in': 'pop-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-dot': 'pulse-dot 1.2s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
        'bar-stripe': 'bar-stripe 0.6s linear infinite',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
